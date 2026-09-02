"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function updateAboutContent(formData: FormData): Promise<void> {
  const supabase = await createClient();
  // Paragraphs are edited as one textarea, split on blank lines — a
  // dynamic add/remove-row list for a 2-4 item array isn't worth the
  // extra UI for how rarely this section changes.
  const storyParagraphs = String(formData.get("story_paragraphs"))
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from("about_content")
    .update({
      hero_eyebrow: String(formData.get("hero_eyebrow")),
      hero_headline: String(formData.get("hero_headline")),
      hero_accent_word: String(formData.get("hero_accent_word")),
      vitals_current_role: String(formData.get("vitals_current_role")),
      vitals_current_org: String(formData.get("vitals_current_org")),
      vitals_location: String(formData.get("vitals_location")),
      vitals_education_note: String(formData.get("vitals_education_note")),
      story_paragraphs: storyParagraphs,
      story_pull_quote: String(formData.get("story_pull_quote")),
    })
    .eq("id", 1);
  if (error) throw error;
  revalidateSite();
}

// -- Quick Facts -------------------------------------------------------

export async function createQuickFact(): Promise<void> {
  const supabase = await createClient();
  const { count } = await supabase.from("about_quick_facts").select("id", { count: "exact", head: true });
  const { error } = await supabase
    .from("about_quick_facts")
    .insert({ value: "0", label: "New fact", sort_order: count ?? 0 });
  if (error) throw error;
  revalidateSite();
}

export async function updateQuickFact(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase
    .from("about_quick_facts")
    .update({ value: String(formData.get("value")), label: String(formData.get("label")) })
    .eq("id", id);
  if (error) throw error;
  revalidateSite();
}

export async function deleteQuickFact(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("about_quick_facts").delete().eq("id", id);
  if (error) throw error;
  revalidateSite();
}

export async function reorderQuickFacts(orderedIds: string[]): Promise<void> {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("about_quick_facts").update({ sort_order: index }).eq("id", id),
    ),
  );
  revalidateSite();
}

// -- Education -----------------------------------------------------------

export async function createEducation(): Promise<void> {
  const supabase = await createClient();
  const { count } = await supabase.from("education").select("id", { count: "exact", head: true });
  const { error } = await supabase.from("education").insert({
    range: "Year",
    credential: "New credential",
    detail: "",
    accent: "sage",
    sort_order: count ?? 0,
  });
  if (error) throw error;
  revalidateSite();
}

export async function updateEducation(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase
    .from("education")
    .update({
      range: String(formData.get("range")),
      credential: String(formData.get("credential")),
      detail: String(formData.get("detail")),
      accent: String(formData.get("accent")),
    })
    .eq("id", id);
  if (error) throw error;
  revalidateSite();
}

export async function deleteEducation(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("education").delete().eq("id", id);
  if (error) throw error;
  revalidateSite();
}

export async function reorderEducation(orderedIds: string[]): Promise<void> {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) => supabase.from("education").update({ sort_order: index }).eq("id", id)),
  );
  revalidateSite();
}
