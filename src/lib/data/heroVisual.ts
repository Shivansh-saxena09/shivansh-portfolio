// Content for the homepage hero story (components/home/HeroStory.tsx). Lives
// in Supabase (site_settings.hero_visual, migrations 0007 + 0008) and is
// edited from /admin/settings → Hero Scene; these defaults only cover the
// window before a migration is applied, and mirror 0008's seed exactly.
// Numbers are the Jewar campaign's real totals across both ad sets
// (case_studies.arpan-my-city-jewar → ad_sets).

export type HeroVisualContent = {
  campaignLabel: string;
  spendLabel: string;
  stages: [string, string, string];
  stageValues: [string, string];
  leadsValue: number;
  metricChips: [string, string];
  systemNodes: [string, string, string];
  /** Story controls: [skip, replay]. */
  controlLabels: [string, string];
  aiLabel: string;
  aiItems: [string, string];
  aiStatus: string;
  resumeLabel: string;
  resumeMeta: string;
  careerLabel: string;
  /** Marketing, Engineering, AI, Resume — the scene's four link labels. */
  linkLabels: [string, string, string, string];
  aiSectionHeading: string;
  aiSectionBody: string;
  /** Phone story: channel tags [Meta, Google] (Meta carries the Jewar numbers). */
  channelLabels: [string, string];
  /** Phone story pictogram labels: tracking, code, database, AI. */
  toolLabels: [string, string, string, string];
  /** MBA progress ring, 0–100. */
  studyProgress: number;
  /** Plain-text version of the phone story for screen readers and crawlers. */
  storyText: string;
  /** Home proof strip labels: [leads, impressions, cost per lead] (numbers come from the case studies). */
  proofLabels: [string, string, string];
  /** /marketing ad-set comparison: heading + [cost per lead, link CTR] labels (numbers from ad_sets). */
  barRaceHeading: string;
  barRaceLabels: [string, string];
  /** /marketing "how I run a campaign" scroll-draw: heading, 5 step titles, 5 one-line details. */
  processHeading: string;
  processSteps: [string, string, string, string, string];
  processDetails: [string, string, string, string, string];
  /** /marketing top panel heading (numbers are the case studies' real totals). */
  marketingPanelHeading: string;
  /** Footer closing strip: one short line, the last-updated label, the back-to-top label. */
  closingLine: string;
  lastUpdatedLabel: string;
  backToTopLabel: string;
};

export const DEFAULT_HERO_VISUAL: HeroVisualContent = {
  campaignLabel: "Jewar plots · Meta lead gen",
  spendLabel: "₹74K ad spend",
  stages: ["Impressions", "Clicks", "Leads"],
  stageValues: ["7.76L", "6,445"],
  leadsValue: 292,
  metricChips: ["₹254 CPL", "112 qualified"],
  systemNodes: ["Pixel + CAPI", "Supabase CRM", "Live dashboard"],
  controlLabels: ["Skip intro", "Replay"],
  aiLabel: "AI agents",
  aiItems: ["Campaign Doctor", "AI calling agent"],
  aiStatus: "Coming soon",
  resumeLabel: "Resume",
  resumeMeta: "PDF",
  careerLabel: "Career",
  linkLabels: ["Marketing work", "Engineering work", "AI work", "Resume"],
  aiSectionHeading: "AI work",
  proofLabels: ["Leads generated", "Impressions", "Avg. cost per lead"],
  barRaceHeading: "Ad sets, head to head",
  barRaceLabels: ["Cost per lead", "Link CTR"],
  processHeading: "How I run a campaign",
  processSteps: ["Brief", "Creative + form", "Tracking", "Launch + optimise", "Qualify + hand-off"],
  processDetails: [
    "Goal, budget and the audience worth paying for.",
    "Ad creatives and a lead form that filters intent.",
    "Pixel + Conversions API, so every lead is counted.",
    "Daily reads on CPL, CTR and frequency; shift budget to what works.",
    "Leads qualified and passed to sales the same day.",
  ],
  marketingPanelHeading: "All campaigns, combined",
  closingLine: "Based in India · Open to remote work",
  lastUpdatedLabel: "Last updated",
  backToTopLabel: "Back to top",
  channelLabels: ["Meta Ads", "Google Ads"],
  toolLabels: ["Conversion tracking", "Code", "Database", "AI"],
  studyProgress: 50,
  storyText:
    "Performance marketer first: ad spend from Meta Ads and Google Ads flows into one funnel. On the Jewar plots Meta lead-gen campaign: 7.76L impressions, 6,445 clicks and 292 leads at ₹254 CPL, 112 of them qualified. Also builds the systems behind the campaigns — Pixel + Conversions API tracking, a Supabase CRM and a live dashboard — and is now building AI agents. Toolkit: conversion tracking, code, databases and AI. Studied B.Tech Computer Science (2023); MBA in progress (expected 2027). Career: I View Academy (Jun 2023), Dfractal Advisory (Nov 2023), Divya Padma Infosystem LLP (Mar 2025). Based in Greater Noida, India — open to full-time remote work.",
  aiSectionBody:
    "Campaign Doctor — the internal tool I use to analyse campaign metrics — and an AI calling agent I'm building now. Full write-ups are coming soon.",
};

function tuple<T extends string[]>(value: unknown, fallback: T): T {
  if (!Array.isArray(value)) return fallback;
  return fallback.map((f, i) => (typeof value[i] === "string" && value[i] ? value[i] : f)) as T;
}

export function parseHeroVisual(raw: unknown): HeroVisualContent {
  const d = DEFAULT_HERO_VISUAL;
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (k: keyof HeroVisualContent) =>
    typeof r[k] === "string" && r[k] ? (r[k] as string) : (d[k] as string);
  const n = Number(r.leadsValue);
  return {
    campaignLabel: str("campaignLabel"),
    spendLabel: str("spendLabel"),
    stages: tuple(r.stages, d.stages),
    stageValues: tuple(r.stageValues, d.stageValues),
    leadsValue: Number.isFinite(n) && n >= 0 && r.leadsValue !== "" ? Math.round(n) : d.leadsValue,
    metricChips: tuple(r.metricChips, d.metricChips),
    systemNodes: tuple(r.systemNodes, d.systemNodes),
    controlLabels: tuple(r.controlLabels, d.controlLabels),
    aiLabel: str("aiLabel"),
    aiItems: tuple(r.aiItems, d.aiItems),
    aiStatus: str("aiStatus"),
    resumeLabel: str("resumeLabel"),
    resumeMeta: str("resumeMeta"),
    careerLabel: str("careerLabel"),
    linkLabels: tuple(r.linkLabels, d.linkLabels),
    aiSectionHeading: str("aiSectionHeading"),
    aiSectionBody: str("aiSectionBody"),
    channelLabels: tuple(r.channelLabels, d.channelLabels),
    toolLabels: tuple(r.toolLabels, d.toolLabels),
    studyProgress: Number.isFinite(Number(r.studyProgress)) && r.studyProgress !== "" && r.studyProgress != null
      ? Math.min(100, Math.max(0, Number(r.studyProgress)))
      : d.studyProgress,
    storyText: str("storyText"),
    proofLabels: tuple(r.proofLabels, d.proofLabels),
    barRaceHeading: str("barRaceHeading"),
    barRaceLabels: tuple(r.barRaceLabels, d.barRaceLabels),
    processHeading: str("processHeading"),
    processSteps: tuple(r.processSteps, d.processSteps),
    processDetails: tuple(r.processDetails, d.processDetails),
    marketingPanelHeading: str("marketingPanelHeading"),
    closingLine: str("closingLine"),
    lastUpdatedLabel: str("lastUpdatedLabel"),
    backToTopLabel: str("backToTopLabel"),
  };
}
