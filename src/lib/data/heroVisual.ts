// Content for the homepage hero scene (components/home/HeroScene.tsx). Lives
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
  feedbackLabel: string;
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
};

export const DEFAULT_HERO_VISUAL: HeroVisualContent = {
  campaignLabel: "Jewar plots · Meta lead gen",
  spendLabel: "₹74K ad spend",
  stages: ["Impressions", "Clicks", "Leads"],
  stageValues: ["7.76L", "6,445"],
  leadsValue: 292,
  metricChips: ["₹254 CPL", "112 qualified"],
  systemNodes: ["Pixel + CAPI", "Supabase CRM", "Live dashboard"],
  feedbackLabel: "conversion signal",
  aiLabel: "AI agents",
  aiItems: ["Campaign Doctor", "AI calling agent"],
  aiStatus: "Coming soon",
  resumeLabel: "Resume",
  resumeMeta: "PDF",
  careerLabel: "Career",
  linkLabels: ["Marketing work", "Engineering work", "AI work", "Resume"],
  aiSectionHeading: "AI work",
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
    feedbackLabel: str("feedbackLabel"),
    aiLabel: str("aiLabel"),
    aiItems: tuple(r.aiItems, d.aiItems),
    aiStatus: str("aiStatus"),
    resumeLabel: str("resumeLabel"),
    resumeMeta: str("resumeMeta"),
    careerLabel: str("careerLabel"),
    linkLabels: tuple(r.linkLabels, d.linkLabels),
    aiSectionHeading: str("aiSectionHeading"),
    aiSectionBody: str("aiSectionBody"),
  };
}
