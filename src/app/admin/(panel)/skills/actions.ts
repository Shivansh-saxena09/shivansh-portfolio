"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SkillCategory } from "@/lib/data/skills";

// Skills are grouped by category everywhere they're displayed, but
// sort_order is one global column. Giving each category a wide, fixed
// numeric band (rather than reordering the whole table on every change)
// means reordering within one category can never collide with another
// category's values, without needing to touch rows outside the group
// being reordered.
const CATEGORY_BAND: Record<SkillCategory, number> = {
  marketing: 0,
  development: 1000,
  design: 2000,
};

function revalidateSite() {
  revalidatePath("/", "layout");
}

export type SkillFormState = { error: string | null };

export async function createSkill(
  _prevState: SkillFormState,
  formData: FormData,
): Promise<SkillFormState> {
  const slug = String(formData.get("slug")).trim();
  const label = String(formData.get("label")).trim();
  const category = String(formData.get("category")) as SkillCategory;

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: "Slug must be lowercase letters, numbers, and hyphens only." };
  }
  if (!label) return { error: "Label is required." };

  const supabase = await createClient();
  const { count } = await supabase
    .from("skills")
    .select("slug", { count: "exact", head: true })
    .eq("category", category);

  const { error } = await supabase
    .from("skills")
    .insert({ slug, label, category, sort_order: CATEGORY_BAND[category] + (count ?? 0) });

  if (error) {
    return { error: error.code === "23505" ? "A skill with this slug already exists." : error.message };
  }
  revalidateSite();
  return { error: null };
}

export async function updateSkill(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const slug = String(formData.get("slug"));
  const label = String(formData.get("label"));
  const category = String(formData.get("category")) as SkillCategory;

  // Category changed — append to the end of the new category's band
  // rather than leaving it in the old band (which would sort it
  // among the wrong group).
  const { data: existing } = await supabase.from("skills").select("category").eq("slug", slug).single();
  let sortOrder: number | undefined;
  if (existing && existing.category !== category) {
    const { count } = await supabase
      .from("skills")
      .select("slug", { count: "exact", head: true })
      .eq("category", category);
    sortOrder = CATEGORY_BAND[category] + (count ?? 0);
  }

  const { error } = await supabase
    .from("skills")
    .update({ label, category, ...(sortOrder !== undefined ? { sort_order: sortOrder } : {}) })
    .eq("slug", slug);
  if (error) throw error;
  revalidateSite();
}

export async function deleteSkill(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const slug = String(formData.get("slug"));
  const { error } = await supabase.from("skills").delete().eq("slug", slug);
  if (error) throw error;
  revalidateSite();
}

export async function reorderSkills(category: SkillCategory, orderedSlugs: string[]): Promise<void> {
  const supabase = await createClient();
  const band = CATEGORY_BAND[category];
  await Promise.all(
    orderedSlugs.map((slug, index) =>
      supabase.from("skills").update({ sort_order: band + index }).eq("slug", slug),
    ),
  );
  revalidateSite();
}
