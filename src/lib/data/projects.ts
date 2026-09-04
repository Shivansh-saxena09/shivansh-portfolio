import { cache } from "react";
import { createClient } from "@/lib/supabase/public";

export type ProjectChallenge = {
  id: string;
  title: string;
  problem: string;
  fix: string;
  snippet: { filename: string; code: string };
};

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  githubUrl: string;
  stack: string[];
  status: "Active" | "Completed" | "Archived";
  featured: boolean;
  demoVideoUrl: string | null;
  flow: { label: string; detail: string }[];
  challenges: ProjectChallenge[];
};

type ProjectRow = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  github_url: string;
  stack: string[];
  status: string;
  featured: boolean;
  demo_video_url: string | null;
  project_flow_steps: { label: string; detail: string; sort_order: number }[];
  project_challenges: {
    id: string;
    title: string;
    problem: string;
    fix: string;
    snippet_filename: string;
    snippet_code: string;
    sort_order: number;
  }[];
};

function mapProjectRow(row: ProjectRow): Project {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    githubUrl: row.github_url,
    stack: row.stack,
    status: row.status as Project["status"],
    featured: row.featured,
    demoVideoUrl: row.demo_video_url,
    flow: [...row.project_flow_steps]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s) => ({ label: s.label, detail: s.detail })),
    challenges: [...row.project_challenges]
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((c) => ({
        id: c.id,
        title: c.title,
        problem: c.problem,
        fix: c.fix,
        snippet: { filename: c.snippet_filename, code: c.snippet_code },
      })),
  };
}

const PROJECT_SELECT = `slug, name, tagline, description, github_url, stack, status, featured, demo_video_url,
  project_flow_steps ( label, detail, sort_order ),
  project_challenges ( id, title, problem, fix, snippet_filename, snippet_code, sort_order )`;

export const getProjects = cache(async function getProjects(): Promise<Project[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data as unknown as ProjectRow[]).map(mapProjectRow);
});

export const getProject = cache(async function getProject(slug: string): Promise<Project | undefined> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProjectRow(data as unknown as ProjectRow) : undefined;
});

export const getFeaturedProject = cache(async function getFeaturedProject(): Promise<
  Project | undefined
> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .select(PROJECT_SELECT)
    .eq("published", true)
    .eq("featured", true)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProjectRow(data as unknown as ProjectRow) : undefined;
});

/** All (published) slugs, for generateStaticParams. No explicit
 *  `.eq("published", true)` needed — this runs on the anon client, and
 *  RLS's public_read_published policy already hides unpublished rows
 *  from an unauthenticated caller. */
export const getAllProjectSlugs = cache(async function getAllProjectSlugs(): Promise<string[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from("projects").select("slug");
  if (error) throw error;
  return data.map((p) => p.slug);
});
