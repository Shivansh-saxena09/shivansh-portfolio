import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { CaseStudyDetail } from "@/lib/data/caseStudies";
import { aggregate } from "@/lib/caseStudyNarrative";

/**
 * Campaign Doctor (CLAUDE.md's one deliberate paid-API exception) —
 * admin-only, never imported by any public page or client component.
 * The `"server-only"` directive above makes that a build error, not
 * just a convention, if anything under src/app/(site) ever imports this
 * file. ANTHROPIC_API_KEY is read here and only here — no NEXT_PUBLIC_
 * prefix, so Next.js never bundles it into client JS.
 */

const AnalysisSchema = z.object({
  whatsWorking: z.array(z.string()).describe("Specific things performing well, cite real numbers from the data."),
  likelyIssues: z.array(z.string()).describe("Specific probable problems, e.g. creative fatigue, audience saturation, weak CTR vs strong CPM."),
  recommendedAction: z.string().describe("One specific, concrete next action — not generic advice."),
  timeframe: z.string().describe("A rough timeframe for the recommended action, e.g. 'within 3-5 days'."),
});

export type CampaignAnalysis = z.infer<typeof AnalysisSchema>;

function buildPrompt(caseStudy: CaseStudyDetail): string {
  const totals = aggregate(caseStudy.adSets);
  const isLive = caseStudy.status === "Active";

  const adSetLines = caseStudy.adSets.map((a) => {
    const ctrLink = a.metrics.impressions > 0 ? (a.metrics.linkClicks / a.metrics.impressions) * 100 : 0;
    const cpl = a.metrics.leads > 0 ? a.metrics.amountSpent / a.metrics.leads : 0;
    return [
      `- "${a.name}" (${a.targeting.audienceType} audience, ${a.targeting.locations}, ${a.targeting.ageGender})`,
      `  Impressions: ${a.metrics.impressions}, Reach: ${a.metrics.reach}, Frequency: ${a.metrics.frequency.toFixed(2)}, CPM: ₹${a.metrics.cpm}`,
      `  Link Clicks: ${a.metrics.linkClicks}, All Clicks: ${a.metrics.allClicks}, Link CTR: ${ctrLink.toFixed(2)}%`,
      `  Leads: ${a.metrics.leads}, Amount Spent: ₹${a.metrics.amountSpent}, Cost/Lead: ₹${cpl.toFixed(0)}`,
      a.businessOutcome?.qualifiedLeads ? `  Qualified by sales: ${a.businessOutcome.qualifiedLeads}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  });

  return `Campaign: ${caseStudy.campaignName}
Platform: ${caseStudy.platform} | Objective: ${caseStudy.objective} | Budget type: ${caseStudy.budgetType}
Status: ${caseStudy.status} (${isLive ? "still running — give forward-looking optimization advice" : "closed — give retrospective 'what should have been done' analysis"})
Date range: ${caseStudy.dateRange}

Blended totals across all ad sets:
Reach: ${totals.reach}, CPM: ₹${totals.cpm.toFixed(0)}, Link CTR: ${totals.ctrLink.toFixed(2)}%, Cost/Lead: ₹${totals.costPerLead.toFixed(0)}, Leads: ${totals.leads}

Per-ad-set breakdown:
${adSetLines.join("\n\n")}

Analyze this campaign's performance data. Identify what's genuinely working (cite real numbers), the most likely underlying issue(s) if performance is weak anywhere (e.g. creative fatigue from high frequency, audience saturation, a weak CTR against a strong CPM signaling a creative problem, budget misallocation between ad sets), one specific recommended action, and a rough timeframe for taking it. Be specific and grounded in the actual numbers given — never generic advice that could apply to any campaign.`;
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set.");
    }
    client = new Anthropic();
  }
  return client;
}

export async function analyzeCaseStudy(caseStudy: CaseStudyDetail): Promise<CampaignAnalysis> {
  const response = await getClient().messages.parse({
    model: "claude-opus-5",
    max_tokens: 2048,
    output_config: { effort: "medium", format: zodOutputFormat(AnalysisSchema) },
    messages: [{ role: "user", content: buildPrompt(caseStudy) }],
  });

  if (!response.parsed_output) {
    throw new Error("Claude returned a response that didn't match the expected format.");
  }
  return response.parsed_output;
}
