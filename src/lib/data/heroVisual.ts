// Content for the homepage hero motion graphic. Lives in Supabase
// (site_settings.hero_visual, migration 0007) and is edited from
// /admin/settings; these defaults only cover the window before that
// migration is applied, and mirror its seed exactly.

export type HeroVisualContent = {
  spendLabel: string;
  stages: [string, string, string];
  leadsValue: number;
  leadsLabel: string;
  metricChips: [string, string];
  systemNodes: [string, string, string];
  feedbackLabel: string;
};

export const DEFAULT_HERO_VISUAL: HeroVisualContent = {
  spendLabel: "₹47.7K ad spend",
  stages: ["Impressions", "Clicks", "Leads"],
  leadsValue: 159,
  leadsLabel: "leads generated",
  metricChips: ["₹300 CPL", "0.96% CTR"],
  systemNodes: ["Pixel + CAPI", "Supabase CRM", "Live dashboard"],
  feedbackLabel: "conversion signal",
};

function tuple<T extends string[]>(value: unknown, fallback: T): T {
  if (!Array.isArray(value)) return fallback;
  return fallback.map((f, i) => (typeof value[i] === "string" && value[i] ? value[i] : f)) as T;
}

export function parseHeroVisual(raw: unknown): HeroVisualContent {
  const d = DEFAULT_HERO_VISUAL;
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (v: unknown, f: string) => (typeof v === "string" && v ? v : f);
  const n = Number(r.leadsValue);
  return {
    spendLabel: str(r.spendLabel, d.spendLabel),
    stages: tuple(r.stages, d.stages),
    leadsValue: Number.isFinite(n) && n >= 0 ? Math.round(n) : d.leadsValue,
    leadsLabel: str(r.leadsLabel, d.leadsLabel),
    metricChips: tuple(r.metricChips, d.metricChips),
    systemNodes: tuple(r.systemNodes, d.systemNodes),
    feedbackLabel: str(r.feedbackLabel, d.feedbackLabel),
  };
}
