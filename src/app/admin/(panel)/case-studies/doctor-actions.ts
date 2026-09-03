"use server";

import { revalidatePath } from "next/cache";
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
    aiInsight: null,
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

/**
 * Publishes one reviewed analysis result to the case study's public page
 * (CLAUDE.md's "Campaign Doctor Insight" showcase) — a static snapshot,
 * not a live call, so visitors never trigger paid API usage. The admin
 * reviews the result in the panel first; nothing reaches the public site
 * automatically the moment Claude responds.
 */
export async function publishInsight(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");

  const slug = String(formData.get("slug"));
  const analysis = JSON.parse(String(formData.get("analysis"))) as CampaignAnalysis;

  const { error } = await supabase
    .from("case_studies")
    .update({
      ai_insight_whats_working: analysis.whatsWorking,
      ai_insight_likely_issues: analysis.likelyIssues,
      ai_insight_recommended_action: analysis.recommendedAction,
      ai_insight_timeframe: analysis.timeframe,
      ai_insight_generated_at: new Date().toISOString(),
      ai_insight_published: true,
    })
    .eq("slug", slug);
  if (error) throw error;
  revalidatePath("/", "layout");
}

export async function unpublishInsight(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const slug = String(formData.get("slug"));
  const { error } = await supabase
    .from("case_studies")
    .update({ ai_insight_published: false })
    .eq("slug", slug);
  if (error) throw error;
  revalidatePath("/", "layout");
}
