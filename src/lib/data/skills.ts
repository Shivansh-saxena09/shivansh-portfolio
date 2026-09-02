import { cache } from "react";
import { createClient } from "@/lib/supabase/public";

export type SkillCategory = "marketing" | "development" | "design";

export type Skill = {
  slug: string;
  label: string;
  category: SkillCategory;
};

/** cache() dedupes repeated calls within one request/render pass. */
export const getSkills = cache(async function getSkills(): Promise<Skill[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("slug, label, category")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as Skill[];
});

/** slug → label/category lookup, built from getSkills() — used to resolve
 *  the skill slugs stored on case studies / timeline entries into display
 *  labels without a separate query per row. */
export const getSkillsMap = cache(async function getSkillsMap(): Promise<Record<string, Skill>> {
  const skills = await getSkills();
  return Object.fromEntries(skills.map((s) => [s.slug, s]));
});

export async function skillLabel(slug: string): Promise<string> {
  const map = await getSkillsMap();
  return map[slug]?.label ?? slug;
}
