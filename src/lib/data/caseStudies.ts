import { cache } from "react";
import { createClient } from "@/lib/supabase/public";
import { getSkillsMap, type Skill } from "@/lib/data/skills";

export type CaseStudyCategory = "standard" | "learning" | "dual-skill-fusion";
export type AudienceType = "Broad" | "Interest-based" | "Lookalike" | "Custom" | "Retargeting";

export type AdSetTargeting = {
  locations: string;
  ageGender: string;
  interests?: string | null;
  placements: string;
  audienceSizeEstimate?: string | null;
  audienceType: AudienceType;
};

export type AdSetMetrics = {
  impressions: number;
  reach: number;
  frequency: number;
  cpm: number;
  linkClicks: number;
  allClicks: number;
  leads: number;
  amountSpent: number;
};

export type BusinessOutcome = {
  qualifiedLeads?: number | null;
  siteVisits?: number | null;
  bookings?: number | null;
  cac?: number | null;
  roas?: number | null;
};

export type AdSet = {
  id: string;
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
  specialAdCategory?: string | null;
  dateRange: string;
  status: "Active" | "Paused" | "Completed";
  category: CaseStudyCategory;
  skills: Skill[];
  lastVerified: string;
  adSets: AdSet[];
  narrative: NarrativeFields;
  galleryPlaceholderCount: number;
  overrideResultHeadline?: string | null;
};

type AdSetRow = {
  id: string;
  name: string;
  sort_order: number;
  targeting_locations: string;
  targeting_age_gender: string;
  targeting_interests: string | null;
  targeting_placements: string;
  targeting_audience_size_estimate: string | null;
  targeting_audience_type: string;
  metrics_impressions: number;
  metrics_reach: number;
  metrics_frequency: number;
  metrics_cpm: number;
  metrics_link_clicks: number;
  metrics_all_clicks: number;
  metrics_leads: number;
  metrics_amount_spent: number;
  outcome_qualified_leads: number | null;
  outcome_site_visits: number | null;
  outcome_bookings: number | null;
  outcome_cac: number | null;
  outcome_roas: number | null;
};

type CaseStudyRow = {
  slug: string;
  campaign_name: string;
  project_name: string;
  objective: string;
  platform: string;
  budget_type: string;
  special_ad_category: string | null;
  date_range: string;
  status: string;
  category: string;
  last_verified: string;
  gallery_placeholder_count: number;
  override_result_headline: string | null;
  narrative_objective: string;
  narrative_strategy: string;
  narrative_challenge: string;
  narrative_decision: string;
  narrative_outcome: string;
  narrative_what_id_do_differently: string;
  case_study_skills: { skill_slug: string }[];
  ad_sets: AdSetRow[];
};

function mapAdSetRow(row: AdSetRow): AdSet {
  return {
    id: row.id,
    name: row.name,
    targeting: {
      locations: row.targeting_locations,
      ageGender: row.targeting_age_gender,
      interests: row.targeting_interests,
      placements: row.targeting_placements,
      audienceSizeEstimate: row.targeting_audience_size_estimate,
      audienceType: row.targeting_audience_type as AudienceType,
    },
    metrics: {
      impressions: row.metrics_impressions,
      reach: row.metrics_reach,
      frequency: row.metrics_frequency,
      cpm: row.metrics_cpm,
      linkClicks: row.metrics_link_clicks,
      allClicks: row.metrics_all_clicks,
      leads: row.metrics_leads,
      amountSpent: row.metrics_amount_spent,
    },
    businessOutcome: {
      qualifiedLeads: row.outcome_qualified_leads,
      siteVisits: row.outcome_site_visits,
      bookings: row.outcome_bookings,
      cac: row.outcome_cac,
      roas: row.outcome_roas,
    },
  };
}

function mapCaseStudyRow(row: CaseStudyRow, skillsMap: Record<string, Skill>): CaseStudyDetail {
  return {
    slug: row.slug,
    campaignName: row.campaign_name,
    projectName: row.project_name,
    objective: row.objective as CaseStudyDetail["objective"],
    platform: row.platform as CaseStudyDetail["platform"],
    budgetType: row.budget_type as CaseStudyDetail["budgetType"],
    specialAdCategory: row.special_ad_category,
    dateRange: row.date_range,
    status: row.status as CaseStudyDetail["status"],
    category: row.category as CaseStudyCategory,
    skills: row.case_study_skills.map((s) => skillsMap[s.skill_slug]).filter(Boolean),
    lastVerified: row.last_verified,
    galleryPlaceholderCount: row.gallery_placeholder_count,
    overrideResultHeadline: row.override_result_headline,
    adSets: [...row.ad_sets].sort((a, b) => a.sort_order - b.sort_order).map(mapAdSetRow),
    narrative: {
      objective: row.narrative_objective,
      strategy: row.narrative_strategy,
      challenge: row.narrative_challenge,
      decision: row.narrative_decision,
      outcome: row.narrative_outcome,
      whatIdDoDifferently: row.narrative_what_id_do_differently,
    },
  };
}

const CASE_STUDY_SELECT = `slug, campaign_name, project_name, objective, platform, budget_type, special_ad_category,
  date_range, status, category, last_verified, gallery_placeholder_count, override_result_headline,
  narrative_objective, narrative_strategy, narrative_challenge, narrative_decision, narrative_outcome, narrative_what_id_do_differently,
  case_study_skills ( skill_slug ),
  ad_sets ( * )`;

export const getCaseStudies = cache(async function getCaseStudies(): Promise<CaseStudyDetail[]> {
  const supabase = createClient();
  const [{ data, error }, skillsMap] = await Promise.all([
    supabase
      .from("case_studies")
      .select(CASE_STUDY_SELECT)
      .eq("published", true)
      .order("sort_order", { ascending: true }),
    getSkillsMap(),
  ]);
  if (error) throw error;
  return (data as unknown as CaseStudyRow[]).map((row) => mapCaseStudyRow(row, skillsMap));
});

export const getCaseStudy = cache(async function getCaseStudy(
  slug: string,
): Promise<CaseStudyDetail | undefined> {
  const supabase = createClient();
  const [{ data, error }, skillsMap] = await Promise.all([
    supabase.from("case_studies").select(CASE_STUDY_SELECT).eq("slug", slug).eq("published", true).maybeSingle(),
    getSkillsMap(),
  ]);
  if (error) throw error;
  return data ? mapCaseStudyRow(data as unknown as CaseStudyRow, skillsMap) : undefined;
});

export async function getCaseStudiesBySkill(skillSlug: string | undefined): Promise<CaseStudyDetail[]> {
  const all = await getCaseStudies();
  if (!skillSlug) return all;
  return all.filter((c) => c.skills.some((s) => s.slug === skillSlug));
}

/** All (published) slugs, for generateStaticParams — see the identical
 *  note in lib/data/projects.ts on why no explicit published filter. */
export const getAllCaseStudySlugs = cache(async function getAllCaseStudySlugs(): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("case_studies").select("slug");
  if (error) throw error;
  return data.map((c) => c.slug);
});
