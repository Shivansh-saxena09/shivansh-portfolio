/**
 * Skills are tag-based and link to relevant case studies (CLAUDE.md →
 * Skills). `slug` is what shows up in the `/marketing?skill=<slug>` filter
 * and in each case study's `skills` array — keep them in sync.
 *
 * Placeholder content module today; becomes a Supabase-backed Skills
 * Manager table once the admin panel is wired up.
 */

export type SkillCategory = "marketing" | "development" | "design";

export type Skill = {
  slug: string;
  label: string;
  category: SkillCategory;
};

export const skills: Skill[] = [
  // Marketing — primary
  { slug: "meta-ads", label: "Meta Ads", category: "marketing" },
  { slug: "google-ads", label: "Google Ads", category: "marketing" },
  { slug: "conversions-api", label: "Conversions API (CAPI)", category: "marketing" },
  { slug: "lead-generation", label: "Lead Generation Strategy", category: "marketing" },
  { slug: "ai-content", label: "AI Content Creation", category: "marketing" },

  // Development — secondary
  { slug: "nextjs", label: "Next.js", category: "development" },
  { slug: "javascript", label: "JavaScript", category: "development" },
  { slug: "react", label: "React.js", category: "development" },
  { slug: "supabase", label: "Supabase", category: "development" },
  { slug: "wordpress", label: "WordPress", category: "development" },
  { slug: "web-dev", label: "Website Development", category: "development" },

  // Design
  { slug: "graphic-design", label: "Graphic Design", category: "design" },
  { slug: "video-editing", label: "Basic Video Editing", category: "design" },
];

export function skillLabel(slug: string): string {
  return skills.find((s) => s.slug === slug)?.label ?? slug;
}
