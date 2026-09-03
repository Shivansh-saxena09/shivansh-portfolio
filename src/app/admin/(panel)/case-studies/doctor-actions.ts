"use server";

import { createClient } from "@/lib/supabase/server";
import { getSkillsMap } from "@/lib/data/skills";
import { mapAdSetRow, type AdSetRow } from "@/lib/data/caseStudies";
import type { CaseStudyDetail } from "@/lib/data/caseStudies";
import { analyzeCaseStudy, type CampaignAnalysis } from "@/lib/campaignDoctor";

export type DoctorState = { result: CampaignAnalysis | null; error: string | null };

/**
 * Server Action behind the "Analyze & Suggest" button. Re-checks auth
 * itself (never trusts that only the admin UI can call a Server Action —
 * Server Actions are POST endpoints Next.js exposes at a stable URL,
 * reachable directly) even though the /admin/case-studies route is
 * already behind middleware; this is the one action in the whole admin
 * panel that spends real money per call, so it gets its own explicit
 * guard rather than relying solely on the route-level check.
 */
export async function runCampaignDoctor(
  _prevState: DoctorState,
  formData: FormData,
): Promise<DoctorState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { result: null, error: "Not authenticated." };

  const slug = String(formData.get("slug"));

  const [{ data: csRow, error: csError }, skillsMap] = await Promise.all([
    supabase.from("case_studies").select("*, case_study_skills(skill_slug), ad_sets(*)").eq("slug", slug).single(),
    getSkillsMap(),
  ]);
  if (csError || !csRow) return { result: null, error: "Case study not found." };

  const caseStudy: CaseStudyDetail = {
    slug: csRow.slug,
    campaignName: csRow.campaign_name,
    projectName: csRow.project_name,
    objective: csRow.objective,
    platform: csRow.platform,
    budgetType: csRow.budget_type,
    specialAdCategory: csRow.special_ad_category,
    dateRange: csRow.date_range,
    status: csRow.status,
    category: csRow.category,
    skills: csRow.case_study_skills.map((s: { skill_slug: string }) => skillsMap[s.skill_slug]).filter(Boolean),
    lastVerified: csRow.last_verified,
    galleryPlaceholderCount: csRow.gallery_placeholder_count,
    galleryImages: [],
    overrideResultHeadline: csRow.override_result_headline,
    adSets: (csRow.ad_sets as AdSetRow[]).map(mapAdSetRow),
    narrative: {
      objective: csRow.narrative_objective,
      strategy: csRow.narrative_strategy,
      challenge: csRow.narrative_challenge,
      decision: csRow.narrative_decision,
      outcome: csRow.narrative_outcome,
      whatIdDoDifferently: csRow.narrative_what_id_do_differently,
    },
  };

  if (caseStudy.adSets.length === 0) {
    return { result: null, error: "Add at least one ad set with metrics before analyzing." };
  }

  try {
    const result = await analyzeCaseStudy(caseStudy);
    return { result, error: null };
  } catch (e) {
    return { result: null, error: e instanceof Error ? e.message : "Analysis failed." };
  }
}
