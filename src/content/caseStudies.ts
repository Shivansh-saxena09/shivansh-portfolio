/**
 * ⚠️ PLACEHOLDER DATA. CLAUDE.md is explicit that case studies must use
 * real, specific numbers — never generic placeholder claims. These three
 * entries exist to build and preview the /marketing grid + card + stub
 * detail page; every metric below must be replaced with real campaign
 * data (via the admin panel, once it exists) before this site is public.
 *
 * The shape here is a deliberately trimmed-down version of the full case
 * study data model in CLAUDE.md (targeting details, ad-set breakdowns,
 * creative gallery, and the narrative-template fields are not modeled yet)
 * — that full model arrives with the case-study template phase. This
 * subset is just enough for a card + a stub detail page.
 */

export type CaseStudyCategory = "standard" | "learning" | "dual-skill-fusion";

export type CaseStudy = {
  slug: string;
  campaignName: string;
  projectName: string;
  objective: "Lead Gen" | "Traffic" | "Conversions";
  platform: "Meta" | "Google";
  status: "Active" | "Paused" | "Completed";
  dateRange: string;
  category: CaseStudyCategory;
  resultHeadline: string;
  metrics: {
    leads: number;
    costPerLead: number;
    ctr: number;
    amountSpent: number;
  };
  oneLiner: string;
  skills: string[];
  lastVerified: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "riverside-greens-meta-leadgen",
    campaignName: "Riverside Greens — Investor Lead Gen",
    projectName: "Riverside Greens",
    objective: "Lead Gen",
    platform: "Meta",
    status: "Completed",
    dateRange: "Jan 2026 – Mar 2026",
    category: "standard",
    resultHeadline: "159 leads at ₹300 per lead",
    metrics: { leads: 159, costPerLead: 300, ctr: 0.96, amountSpent: 47700 },
    oneLiner:
      "A targeted investor-audience Meta campaign for a residential plotting project, optimized down from an initial CPL of ₹540.",
    skills: ["meta-ads", "conversions-api", "lead-generation"],
    lastVerified: "2026-08-20",
  },
  {
    slug: "pixel-tracking-recovery",
    campaignName: "Pixel & Conversions API Recovery",
    projectName: "Divya Padma — Multi-project",
    objective: "Conversions",
    platform: "Meta",
    status: "Completed",
    dateRange: "Nov 2025",
    category: "learning",
    resultHeadline: "Recovered ~30% of under-reported conversions",
    metrics: { leads: 0, costPerLead: 0, ctr: 0, amountSpent: 0 },
    oneLiner:
      "iOS14.5 attribution loss was silently under-reporting leads across every active campaign — a transparent walkthrough of finding and fixing it with server-side CAPI.",
    skills: ["meta-ads", "conversions-api"],
    lastVerified: "2026-08-20",
  },
  {
    slug: "lead-dashboard-dual-skill",
    campaignName: "Real-time Lead Qualification Dashboard",
    projectName: "dashboard-of-dpi",
    objective: "Lead Gen",
    platform: "Meta",
    status: "Active",
    dateRange: "Mar 2026 – Present",
    category: "dual-skill-fusion",
    resultHeadline: "Sales follow-up time on new leads cut from hours to minutes",
    metrics: { leads: 0, costPerLead: 0, ctr: 0, amountSpent: 0 },
    oneLiner:
      "Sales couldn't keep pace with lead volume from a scaling ad budget, so I built the qualification dashboard myself — a marketing bottleneck solved with an engineering fix.",
    skills: ["meta-ads", "lead-generation", "nextjs", "supabase"],
    lastVerified: "2026-08-20",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function caseStudiesBySkill(skillSlug: string | undefined): CaseStudy[] {
  if (!skillSlug) return caseStudies;
  return caseStudies.filter((c) => c.skills.includes(skillSlug));
}
