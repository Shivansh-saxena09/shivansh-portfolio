"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TimelineIconName } from "@/lib/data/about";

function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function createTimelineEntry(): Promise<void> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("experience_timeline")
    .select("id", { count: "exact", head: true });

  const { error } = await supabase.from("experience_timeline").insert({
    range: "Month Year – Month Year",
    role: "New role",
    org: "Company name",
    description: "",
    current: false,
    icon: "sprout",
    sort_order: count ?? 0,
    challenge_emoji: "🎯",
    challenge_question: "",
    challenge_correct_explanation: "",
    challenge_incorrect_explanation: "",
  });
  if (error) throw error;
  revalidateSite();
}

/**
 * Updates every part of one timeline entry in a single submit: the core
 * fields, its linked skills (replaced wholesale — simpler and safe at
 * this scale than diffing), and its Quick Take challenge, which the
 * admin form keeps fixed at exactly two options (A/B, pick which is
 * correct) — every real entry uses two, and a fixed shape is far simpler
 * to edit than a dynamic add/remove-row list for a case that hasn't
 * come up yet.
 */
export async function updateTimelineEntry(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));

  const { error } = await supabase
    .from("experience_timeline")
    .update({
      range: String(formData.get("range")),
      role: String(formData.get("role")),
      org: String(formData.get("org")),
      location: String(formData.get("location") ?? "") || null,
      description: String(formData.get("description")),
      current: formData.get("current") === "on",
      icon: String(formData.get("icon")) as TimelineIconName,
      challenge_emoji: String(formData.get("challenge_emoji")),
      challenge_question: String(formData.get("challenge_question")),
      challenge_correct_explanation: String(formData.get("challenge_correct_explanation")),
      challenge_incorrect_explanation: String(formData.get("challenge_incorrect_explanation")),
    })
    .eq("id", id);
  if (error) throw error;

  const skillSlugs = formData.getAll("skills").map(String);
  await supabase.from("experience_timeline_skills").delete().eq("timeline_id", id);
  if (skillSlugs.length > 0) {
    await supabase
      .from("experience_timeline_skills")
      .insert(skillSlugs.map((skill_slug) => ({ timeline_id: id, skill_slug })));
  }

  const correctIndex = String(formData.get("correct_option"));
  const options = [
    { label: String(formData.get("option_1_label")), is_correct: correctIndex === "1", sort_order: 0 },
    { label: String(formData.get("option_2_label")), is_correct: correctIndex === "2", sort_order: 1 },
  ];
  await supabase.from("experience_timeline_challenge_options").delete().eq("timeline_id", id);
  await supabase
    .from("experience_timeline_challenge_options")
    .insert(options.map((o) => ({ ...o, timeline_id: id })));

  revalidateSite();
}

export async function deleteTimelineEntry(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("experience_timeline").delete().eq("id", id);
  if (error) throw error;
  revalidateSite();
}

export async function reorderTimelineEntries(orderedIds: string[]): Promise<void> {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("experience_timeline").update({ sort_order: index }).eq("id", id),
    ),
  );
  revalidateSite();
}
