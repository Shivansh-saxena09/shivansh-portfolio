import { getSiteSettings, getContactInfo } from "@/lib/data/site";
import { getCaseStudies } from "@/lib/data/caseStudies";
import { getProjects } from "@/lib/data/projects";
import { cardSummary } from "@/lib/caseStudyNarrative";
import { siteBaseUrl } from "@/lib/seo";

/**
 * /llms.txt — a plain-text summary for LLMs/answer engines (CLAUDE.md →
 * SEO/AEO/GEO), per the emerging community convention at llmstxt.org.
 * Not a Next.js metadata-file convention (unlike sitemap.ts/robots.ts),
 * so this is a plain Route Handler — but built from the same live
 * Supabase data as the rest of the site, so it never drifts out of sync
 * with what's actually published.
 */
export async function GET() {
  const [settings, contact, caseStudies, projects] = await Promise.all([
    getSiteSettings(),
    getContactInfo(),
    getCaseStudies(),
    getProjects(),
  ]);
  const base = siteBaseUrl(settings.personDomain);

  const lines: string[] = [];
  lines.push(`# ${settings.personName}`);
  lines.push("");
  lines.push(`> ${settings.personTagline} ${settings.heroSubheading}`);
  lines.push("");
  lines.push("## Key facts");
  lines.push(`- Role: ${settings.heroEyebrow} at ${settings.personCompany}`);
  lines.push(`- Location: ${settings.location} (${settings.availability})`);
  lines.push(`- Contact: ${contact.email} · WhatsApp: ${contact.whatsapp}`);
  lines.push(`- LinkedIn: ${contact.linkedin}`);
  lines.push(`- GitHub: ${contact.github}`);
  lines.push("");
  lines.push("## Pages");
  lines.push(`- Marketing work & case studies: ${base}/marketing`);
  lines.push(`- Engineering / full-stack projects: ${base}/engineering`);
  lines.push(`- About, experience, and education: ${base}/about`);
  lines.push("");

  if (caseStudies.length > 0) {
    lines.push("## Case studies");
    for (const cs of caseStudies) {
      const { resultHeadline } = cardSummary(cs);
      lines.push(`- ${cs.campaignName} (${cs.platform}, ${cs.status}): ${resultHeadline}. ${base}/case-study/${cs.slug}`);
    }
    lines.push("");
  }

  if (projects.length > 0) {
    lines.push("## Engineering projects");
    for (const p of projects) {
      lines.push(`- ${p.name}: ${p.tagline} — ${p.stack.join(", ")}. ${base}/project/${p.slug}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
