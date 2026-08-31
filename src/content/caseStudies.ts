/**
 * ⚠️ PLACEHOLDER DATA. CLAUDE.md is explicit that case studies must use
 * real, specific numbers — never generic placeholder claims. Every
 * number below must be replaced with real campaign data (via the admin
 * panel, once it exists) before this site is public. The shape, however,
 * is the real data model from CLAUDE.md's case-study spec (minus the
 * creative gallery, which needs actual uploaded images to mean anything).
 *
 * This is a content module today; it becomes Supabase tables (a
 * case_studies row + an ad_sets table keyed to it) once the admin panel
 * is wired up — the shape here is deliberately close to that eventual
 * schema so the migration is mostly plumbing, not a redesign.
 */

export type CaseStudyCategory = "standard" | "learning" | "dual-skill-fusion";
export type AudienceType = "Broad" | "Interest-based" | "Lookalike" | "Custom" | "Retargeting";

export type AdSetTargeting = {
  locations: string;
  ageGender: string;
  interests?: string;
  placements: string;
  audienceSizeEstimate?: string;
  audienceType: AudienceType;
};

export type AdSetMetrics = {
  // Awareness / reach
  impressions: number;
  reach: number;
  frequency: number;
  cpm: number;
  // Engagement
  linkClicks: number;
  allClicks: number;
  // Conversion / result
  leads: number;
  amountSpent: number;
};

export type BusinessOutcome = {
  qualifiedLeads?: number;
  siteVisits?: number;
  bookings?: number;
  cac?: number;
  roas?: number;
};

export type AdSet = {
  name: string;
  targeting: AdSetTargeting;
  metrics: AdSetMetrics;
  businessOutcome?: BusinessOutcome;
};

export type NarrativeFields = {
  objective: string;
  strategy: string;
  challenge: string;
  decision: string;
  outcome: string;
  whatIdDoDifferently: string;
};

export type CaseStudyDetail = {
  slug: string;
  campaignName: string;
  projectName: string;
  objective: "Lead Gen" | "Traffic" | "Conversions";
  platform: "Meta" | "Google";
  budgetType: "CBO" | "ABO";
  specialAdCategory?: string;
  dateRange: string;
  status: "Active" | "Paused" | "Completed";
  category: CaseStudyCategory;
  skills: string[];
  lastVerified: string;
  adSets: AdSet[];
  narrative: NarrativeFields;
  /** Placeholder count (3–5 in the real model) — real uploaded creatives via admin later. */
  galleryPlaceholderCount: number;
  /** Only for stories (like the dual-skill one) where the real headline isn't a raw ad metric. */
  overrideResultHeadline?: string;
};

export const caseStudies: CaseStudyDetail[] = [
  {
    slug: "riverside-greens-meta-leadgen",
    campaignName: "Riverside Greens — Investor Lead Gen",
    projectName: "Riverside Greens",
    objective: "Lead Gen",
    platform: "Meta",
    budgetType: "CBO",
    dateRange: "Jan 2026 – Mar 2026",
    status: "Completed",
    category: "standard",
    skills: ["meta-ads", "conversions-api", "lead-generation"],
    lastVerified: "2026-08-20",
    galleryPlaceholderCount: 4,
    adSets: [
      {
        name: "Broad — Investors 25–55",
        targeting: {
          locations: "Delhi NCR",
          ageGender: "25–55, all genders",
          placements: "Automatic placements",
          audienceSizeEstimate: "~2.4M",
          audienceType: "Broad",
        },
        metrics: {
          impressions: 1_850_000,
          reach: 620_000,
          frequency: 2.98,
          cpm: 145,
          linkClicks: 9_200,
          allClicks: 14_500,
          leads: 68,
          amountSpent: 27_200,
        },
        businessOutcome: { qualifiedLeads: 22, siteVisits: 14, bookings: 2 },
      },
      {
        name: "Interest-Targeted — Real Estate Investors",
        targeting: {
          locations: "Delhi NCR",
          ageGender: "28–50, all genders",
          interests: "Real estate investing, mutual funds, NRI investment",
          placements: "Feed + Reels",
          audienceSizeEstimate: "~410K",
          audienceType: "Interest-based",
        },
        metrics: {
          impressions: 980_000,
          reach: 310_000,
          frequency: 3.16,
          cpm: 132,
          linkClicks: 9_400,
          allClicks: 12_800,
          leads: 91,
          amountSpent: 20_500,
        },
        businessOutcome: { qualifiedLeads: 40, siteVisits: 26, bookings: 5 },
      },
    ],
    narrative: {
      objective:
        "Generate qualified investor leads for a residential plotting project launching its second phase.",
      strategy:
        "Ran a broad audience alongside a narrower interest-targeted audience from day one, on the same CBO budget, so Meta's delivery system could find the cheaper source of leads without me guessing upfront.",
      challenge:
        "The broad ad set opened at a CPL of ₹540 in week one — well above target — while the interest-targeted set was already tracking under ₹250.",
      decision:
        "Shifted budget weighting toward the interest-targeted ad set and tightened the broad set's age range instead of pausing it outright, keeping some broad reach for retargeting pool size.",
      outcome:
        "Blended CPL settled at ₹300 across both ad sets by the end of the flight, with the interest-targeted set carrying the majority of qualified leads.",
      whatIdDoDifferently:
        "Start the interest-targeted set with more budget share from day one instead of splitting evenly — the week-one broad spend at ₹540 CPL was the most expensive lesson in the campaign.",
    },
  },
  {
    slug: "pixel-tracking-recovery",
    campaignName: "Pixel & Conversions API Recovery",
    projectName: "Divya Padma — Multi-project",
    objective: "Conversions",
    platform: "Meta",
    budgetType: "ABO",
    dateRange: "Nov 2025",
    status: "Completed",
    category: "learning",
    skills: ["meta-ads", "conversions-api"],
    lastVerified: "2026-08-20",
    galleryPlaceholderCount: 3,
    overrideResultHeadline: "Recovered ~30% of under-reported conversions",
    adSets: [
      {
        name: "All Active Campaigns (Pooled, Post-Fix)",
        targeting: {
          locations: "Delhi NCR + Noida",
          ageGender: "25–55, all genders",
          interests: "Property buyers, investors (mixed)",
          placements: "Automatic placements",
          audienceSizeEstimate: "~1.8M",
          audienceType: "Broad",
        },
        metrics: {
          impressions: 640_000,
          reach: 210_000,
          frequency: 3.05,
          cpm: 118,
          linkClicks: 5_100,
          allClicks: 7_300,
          leads: 55,
          amountSpent: 12_600,
        },
        businessOutcome: { qualifiedLeads: 18 },
      },
    ],
    narrative: {
      objective:
        "Understand why reported leads had been trailing what the sales team said they were actually receiving for several weeks running.",
      strategy:
        "Cross-checked Meta's reported lead count against the CRM's actual lead intake for the same date range, campaign by campaign, instead of assuming the ad platform's numbers were correct.",
      challenge:
        "iOS 14.5's App Tracking Transparency prompt was silently suppressing a meaningful share of browser-side pixel events, so Meta was under-reporting conversions across every active campaign — the ads were working better than the dashboard showed.",
      decision:
        "Implemented server-side Conversions API (CAPI) alongside the existing browser pixel, deduplicated by event ID, so conversions fire from the server regardless of what the visitor's browser blocks.",
      outcome:
        "Reported conversions rose roughly 30% for the same underlying traffic once CAPI was live — the leads had been arriving all along, just going uncounted.",
      whatIdDoDifferently:
        "Set up CAPI as part of initial campaign launch checklist from the start, rather than only discovering the gap after a manual CRM cross-check.",
    },
  },
  {
    slug: "lead-dashboard-dual-skill",
    campaignName: "Real-time Lead Qualification Dashboard",
    projectName: "dashboard-of-dpi",
    objective: "Lead Gen",
    platform: "Meta",
    budgetType: "CBO",
    dateRange: "Mar 2026 – Present",
    status: "Active",
    category: "dual-skill-fusion",
    skills: ["meta-ads", "lead-generation", "nextjs", "supabase"],
    lastVerified: "2026-08-20",
    galleryPlaceholderCount: 3,
    overrideResultHeadline: "Sales follow-up time on new leads cut from hours to minutes",
    adSets: [
      {
        name: "Scaled Investor Campaign",
        targeting: {
          locations: "Delhi NCR, Gurugram",
          ageGender: "27–50, all genders",
          interests: "Real estate investing, HNI lifestyle",
          placements: "Feed + Reels + Stories",
          audienceSizeEstimate: "~350K",
          audienceType: "Lookalike",
        },
        metrics: {
          impressions: 1_120_000,
          reach: 380_000,
          frequency: 2.95,
          cpm: 128,
          linkClicks: 10_800,
          allClicks: 15_200,
          leads: 143,
          amountSpent: 42_900,
        },
        businessOutcome: { qualifiedLeads: 61, siteVisits: 38, bookings: 6 },
      },
    ],
    narrative: {
      objective:
        "Scale ad spend on a campaign that was already converting well, without losing lead quality to slow sales follow-up.",
      strategy:
        "Increased daily budget in stages while watching qualification rate, not just lead volume, as the signal for whether to keep scaling.",
      challenge:
        "Lead volume grew faster than the sales team's manual process for triaging and calling new leads — leads sitting in a spreadsheet for hours before first contact, well past the window when conversion is most likely.",
      decision:
        "Built dashboard-of-dpi: leads land in Supabase the moment Meta's webhook fires, get auto-scored, and surface on a live dashboard sales actually opens — instead of a CSV export nobody checks fast enough.",
      outcome:
        "Time from lead capture to first sales contact dropped from hours to minutes, and qualification rate held steady even as spend kept scaling.",
      whatIdDoDifferently:
        "Build the intake dashboard before scaling budget, not after — the follow-up bottleneck was predictable once lead volume started climbing.",
    },
  },
];

export function getCaseStudy(slug: string): CaseStudyDetail | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function caseStudiesBySkill(skillSlug: string | undefined): CaseStudyDetail[] {
  if (!skillSlug) return caseStudies;
  return caseStudies.filter((c) => c.skills.includes(skillSlug));
}
