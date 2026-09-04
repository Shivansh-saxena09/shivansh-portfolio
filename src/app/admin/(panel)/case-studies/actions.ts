"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function revalidateSite() {
  revalidatePath("/", "layout");
}

export type CaseStudyFormState = { error: string | null };

export async function createCaseStudy(
  _prevState: CaseStudyFormState,
  formData: FormData,
): Promise<CaseStudyFormState> {
  const slug = String(formData.get("slug")).trim();
  const campaignName = String(formData.get("campaign_name")).trim();

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: "Slug must be lowercase letters, numbers, and hyphens only." };
  }
  if (!campaignName) return { error: "Campaign name is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("case_studies").insert({
    slug,
    campaign_name: campaignName,
    project_name: campaignName,
    objective: "Lead Gen",
    platform: "Meta",
    budget_type: "CBO",
    date_range: "",
    status: "Active",
    category: "standard",
    gallery_placeholder_count: 4,
    published: false,
  });

  if (error) {
    return { error: error.code === "23505" ? "A case study with this slug already exists." : error.message };
  }
  revalidateSite();
  redirect(`/admin/case-studies/${slug}`);
}

export async function updateCaseStudySetup(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const slug = String(formData.get("slug"));

  const { error } = await supabase
    .from("case_studies")
    .update({
      campaign_name: String(formData.get("campaign_name")),
      project_name: String(formData.get("project_name")),
      objective: String(formData.get("objective")),
      platform: String(formData.get("platform")),
      budget_type: String(formData.get("budget_type")),
      special_ad_category: String(formData.get("special_ad_category") ?? "") || null,
      date_range: String(formData.get("date_range")),
      status: String(formData.get("status")),
      category: String(formData.get("category")),
      gallery_placeholder_count: Number(formData.get("gallery_placeholder_count") ?? 0),
      override_result_headline: String(formData.get("override_result_headline") ?? "") || null,
      published: formData.get("published") === "on",
    })
    .eq("slug", slug);
  if (error) throw error;

  const skillSlugs = formData.getAll("skills").map(String);
  await supabase.from("case_study_skills").delete().eq("case_study_slug", slug);
  if (skillSlugs.length > 0) {
    await supabase
      .from("case_study_skills")
      .insert(skillSlugs.map((skill_slug) => ({ case_study_slug: slug, skill_slug })));
  }

  revalidateSite();
}

export async function updateCaseStudyNarrative(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const slug = String(formData.get("slug"));
  const { error } = await supabase
    .from("case_studies")
    .update({
      narrative_objective: String(formData.get("narrative_objective")),
      narrative_strategy: String(formData.get("narrative_strategy")),
      narrative_challenge: String(formData.get("narrative_challenge")),
      narrative_decision: String(formData.get("narrative_decision")),
      narrative_outcome: String(formData.get("narrative_outcome")),
      narrative_what_id_do_differently: String(formData.get("narrative_what_id_do_differently")),
    })
    .eq("slug", slug);
  if (error) throw error;
  revalidateSite();
}

export async function deleteCaseStudy(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const slug = String(formData.get("slug"));
  const { error } = await supabase.from("case_studies").delete().eq("slug", slug);
  if (error) throw error;
  revalidateSite();
  redirect("/admin/case-studies");
}

// -- Ad sets ----------------------------------------------------------------

export async function createAdSet(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const caseStudySlug = String(formData.get("case_study_slug"));
  const { count } = await supabase
    .from("ad_sets")
    .select("id", { count: "exact", head: true })
    .eq("case_study_slug", caseStudySlug);

  const { error } = await supabase.from("ad_sets").insert({
    case_study_slug: caseStudySlug,
    name: "New Ad Set",
    sort_order: count ?? 0,
    targeting_locations: "",
    targeting_age_gender: "",
    targeting_placements: "",
    targeting_audience_type: "Broad",
  });
  if (error) throw error;
  revalidateSite();
}

function numOrNull(formData: FormData, key: string): number | null {
  const raw = formData.get(key);
  if (raw === null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export async function updateAdSet(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));

  const { error } = await supabase
    .from("ad_sets")
    .update({
      name: String(formData.get("name")),
      targeting_locations: String(formData.get("targeting_locations")),
      targeting_age_gender: String(formData.get("targeting_age_gender")),
      targeting_interests: String(formData.get("targeting_interests") ?? "") || null,
      targeting_placements: String(formData.get("targeting_placements")),
      targeting_audience_size_estimate: String(formData.get("targeting_audience_size_estimate") ?? "") || null,
      targeting_audience_type: String(formData.get("targeting_audience_type")),
      metrics_impressions: numOrNull(formData, "metrics_impressions") ?? 0,
      metrics_reach: numOrNull(formData, "metrics_reach") ?? 0,
      metrics_frequency: numOrNull(formData, "metrics_frequency") ?? 0,
      metrics_cpm: numOrNull(formData, "metrics_cpm") ?? 0,
      metrics_link_clicks: numOrNull(formData, "metrics_link_clicks") ?? 0,
      metrics_all_clicks: numOrNull(formData, "metrics_all_clicks") ?? 0,
      metrics_leads: numOrNull(formData, "metrics_leads") ?? 0,
      metrics_amount_spent: numOrNull(formData, "metrics_amount_spent") ?? 0,
      outcome_qualified_leads: numOrNull(formData, "outcome_qualified_leads"),
      outcome_site_visits: numOrNull(formData, "outcome_site_visits"),
      outcome_bookings: numOrNull(formData, "outcome_bookings"),
      outcome_cac: numOrNull(formData, "outcome_cac"),
      outcome_roas: numOrNull(formData, "outcome_roas"),
    })
    .eq("id", id);
  if (error) throw error;
  revalidateSite();
}

export async function deleteAdSet(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("ad_sets").delete().eq("id", id);
  if (error) throw error;
  revalidateSite();
}

export async function reorderAdSets(orderedIds: string[]): Promise<void> {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) => supabase.from("ad_sets").update({ sort_order: index }).eq("id", id)),
  );
  revalidateSite();
}

// -- Gallery images -----------------------------------------------------------

export type ImageUploadState = { error: string | null };

export async function uploadCaseStudyImage(
  _prevState: ImageUploadState,
  formData: FormData,
): Promise<ImageUploadState> {
  const caseStudySlug = String(formData.get("case_study_slug"));
  const altText = String(formData.get("alt_text") ?? "");
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file first." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "File must be an image." };
  }
  // Mirrors GalleryManager's client-side check — that's what catches
  // this in normal use (before the request is even sent), but this
  // stays as a second line of defense (JS disabled, a direct POST,
  // etc.). Comfortably under next.config.ts's bodySizeLimit so a file
  // that passes this never reaches that raw framework error either.
  const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: `Image is too large (${(file.size / 1024 / 1024).toFixed(1)}MB) — please upload a file under 8MB.` };
  }

  const supabase = await createClient();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const path = `case-studies/${caseStudySlug}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
    contentType: file.type,
  });
  if (uploadError) return { error: uploadError.message };

  const { count } = await supabase
    .from("case_study_images")
    .select("id", { count: "exact", head: true })
    .eq("case_study_slug", caseStudySlug);

  const { error } = await supabase.from("case_study_images").insert({
    case_study_slug: caseStudySlug,
    storage_path: path,
    alt_text: altText || null,
    sort_order: count ?? 0,
  });
  if (error) return { error: error.message };

  revalidateSite();
  return { error: null };
}

export async function deleteCaseStudyImage(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const path = String(formData.get("storage_path"));

  await supabase.storage.from("media").remove([path]);
  const { error } = await supabase.from("case_study_images").delete().eq("id", id);
  if (error) throw error;
  revalidateSite();
}

export async function reorderCaseStudyImages(orderedIds: string[]): Promise<void> {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("case_study_images").update({ sort_order: index }).eq("id", id),
    ),
  );
  revalidateSite();
}
