import type { AdSet, AudienceType, CaseStudyDetail } from "@/content/caseStudies";

/**
 * Structured-fields → readable-prose templating (CLAUDE.md → Campaign /
 * Project Case Study detail page). Deliberately plain string templates,
 * not an AI call — the only AI-generated text on this whole site is the
 * admin-only Campaign Doctor tool. Pure functions, no dependencies, so
 * this stays usable from a Server Component with zero client JS cost.
 */

export function formatINR(n: number): string {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function formatNumber(n: number): string {
  return Math.round(n).toLocaleString("en-IN");
}

export function formatPct(n: number, decimals = 2): string {
  return `${n.toFixed(decimals)}%`;
}

const audienceDescription: Record<AudienceType, string> = {
  Broad: "a broad audience",
  "Interest-based": "an interest-targeted audience",
  Lookalike: "a lookalike audience",
  Custom: "a custom audience",
  Retargeting: "a retargeting audience",
};

export function describeAudience(type: AudienceType): string {
  return audienceDescription[type];
}

export type AggregateMetrics = {
  impressions: number;
  reach: number;
  linkClicks: number;
  allClicks: number;
  leads: number;
  amountSpent: number;
  cpm: number; // spend-weighted
  ctrLink: number; // % — total link clicks / total impressions
  ctrAll: number; // % — total all clicks / total impressions
  cpcAll: number;
  cpcLink: number;
  costPerLead: number;
  conversionRate: number; // % — leads / link clicks
  qualifiedLeads: number;
  siteVisits: number;
  bookings: number;
};

/** Sums raw counts across ad sets and derives rate metrics from the totals — never averages of averages. */
export function aggregate(adSets: AdSet[]): AggregateMetrics {
  const totals = adSets.reduce(
    (acc, { metrics, businessOutcome }) => ({
      impressions: acc.impressions + metrics.impressions,
      reach: acc.reach + metrics.reach,
      linkClicks: acc.linkClicks + metrics.linkClicks,
      allClicks: acc.allClicks + metrics.allClicks,
      leads: acc.leads + metrics.leads,
      amountSpent: acc.amountSpent + metrics.amountSpent,
      qualifiedLeads: acc.qualifiedLeads + (businessOutcome?.qualifiedLeads ?? 0),
      siteVisits: acc.siteVisits + (businessOutcome?.siteVisits ?? 0),
      bookings: acc.bookings + (businessOutcome?.bookings ?? 0),
    }),
    {
      impressions: 0,
      reach: 0,
      linkClicks: 0,
      allClicks: 0,
      leads: 0,
      amountSpent: 0,
      qualifiedLeads: 0,
      siteVisits: 0,
      bookings: 0,
    },
  );

  return {
    ...totals,
    cpm: totals.impressions > 0 ? (totals.amountSpent / totals.impressions) * 1000 : 0,
    ctrLink: totals.impressions > 0 ? (totals.linkClicks / totals.impressions) * 100 : 0,
    ctrAll: totals.impressions > 0 ? (totals.allClicks / totals.impressions) * 100 : 0,
    cpcAll: totals.allClicks > 0 ? totals.amountSpent / totals.allClicks : 0,
    cpcLink: totals.linkClicks > 0 ? totals.amountSpent / totals.linkClicks : 0,
    costPerLead: totals.leads > 0 ? totals.amountSpent / totals.leads : 0,
    conversionRate: totals.linkClicks > 0 ? (totals.leads / totals.linkClicks) * 100 : 0,
  };
}

function adSetRates(adSet: AdSet) {
  const { metrics } = adSet;
  return {
    ctrLink: metrics.impressions > 0 ? (metrics.linkClicks / metrics.impressions) * 100 : 0,
    costPerLead: metrics.leads > 0 ? metrics.amountSpent / metrics.leads : 0,
  };
}

/** "This ad set generated 159 leads at ₹300 per lead, with a 0.96% CTR against a targeted investor audience..." */
export function composeAdSetNarrative(adSet: AdSet): string {
  const { metrics, targeting } = adSet;
  const rates = adSetRates(adSet);
  const audience = describeAudience(targeting.audienceType);

  const leadSentence =
    metrics.leads > 0
      ? `generated ${formatNumber(metrics.leads)} leads at ${formatINR(rates.costPerLead)} per lead`
      : `spent ${formatINR(metrics.amountSpent)} without a directly attributed lead in this window`;

  const reachClause = `reaching ${formatNumber(metrics.reach)} people at a CPM of ${formatINR(metrics.cpm)}`;

  const interestClause = targeting.interests ? `, layered with interest targeting on ${targeting.interests},` : "";

  return `The "${adSet.name}" ad set targeted ${audience} in ${targeting.locations}${interestClause} across ${targeting.ageGender}, ${reachClause}. It ${leadSentence}, with a ${formatPct(rates.ctrLink)} link CTR.`;
}

/** A short campaign-level opening paragraph, blending aggregate numbers with the stated objective. */
export function composeCampaignIntro(caseStudy: CaseStudyDetail): string {
  const totals = aggregate(caseStudy.adSets);
  const multiAdSet = caseStudy.adSets.length > 1;

  const spendLine =
    totals.leads > 0
      ? `${formatNumber(totals.leads)} leads at a blended cost of ${formatINR(totals.costPerLead)} per lead from ${formatINR(totals.amountSpent)} in spend`
      : `${formatINR(totals.amountSpent)} in spend`;

  const structureClause = multiAdSet
    ? `across ${caseStudy.adSets.length} ad sets running in parallel`
    : "from a single ad set";

  return `Running on ${caseStudy.platform} with a ${caseStudy.budgetType} budget, this ${caseStudy.objective.toLowerCase()} campaign reached ${formatNumber(totals.reach)} people ${structureClause}, producing ${spendLine}.`;
}

/** Card-level summary derived from structured data, so /marketing cards don't need hand-written duplicate copy. */
export function cardSummary(caseStudy: CaseStudyDetail): { oneLiner: string; resultHeadline: string } {
  const totals = aggregate(caseStudy.adSets);
  const resultHeadline =
    caseStudy.overrideResultHeadline ??
    (totals.leads > 0
      ? `${formatNumber(totals.leads)} leads at ${formatINR(totals.costPerLead)} per lead`
      : formatINR(totals.amountSpent) + " invested");

  return { oneLiner: caseStudy.narrative.objective, resultHeadline };
}
