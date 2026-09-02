"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function revalidateSite() {
  revalidatePath("/", "layout");
}

export type ProjectFormState = { error: string | null };

export async function createProject(
  _prevState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const slug = String(formData.get("slug")).trim();
  const name = String(formData.get("name")).trim();

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { error: "Slug must be lowercase letters, numbers, and hyphens only." };
  }
  if (!name) return { error: "Name is required." };

  const supabase = await createClient();
  const { error } = await supabase.from("projects").insert({
    slug,
    name,
    tagline: "",
    description: "",
    github_url: "",
    stack: [],
    status: "Active",
    featured: false,
    published: false,
  });

  if (error) {
    return { error: error.code === "23505" ? "A project with this slug already exists." : error.message };
  }
  revalidateSite();
  redirect(`/admin/projects/${slug}`);
}

export async function updateProject(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const slug = String(formData.get("slug"));
  const stack = String(formData.get("stack"))
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabase
    .from("projects")
    .update({
      name: String(formData.get("name")),
      tagline: String(formData.get("tagline")),
      description: String(formData.get("description")),
      github_url: String(formData.get("github_url")),
      stack,
      status: String(formData.get("status")),
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
    })
    .eq("slug", slug);
  if (error) throw error;
  revalidateSite();
}

export async function deleteProject(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const slug = String(formData.get("slug"));
  const { error } = await supabase.from("projects").delete().eq("slug", slug);
  if (error) throw error;
  revalidateSite();
  redirect("/admin/projects");
}

// -- Flow steps -----------------------------------------------------------

export async function createFlowStep(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const projectSlug = String(formData.get("project_slug"));
  const { count } = await supabase
    .from("project_flow_steps")
    .select("id", { count: "exact", head: true })
    .eq("project_slug", projectSlug);
  const { error } = await supabase
    .from("project_flow_steps")
    .insert({ project_slug: projectSlug, label: "Step", detail: "", sort_order: count ?? 0 });
  if (error) throw error;
  revalidateSite();
}

export async function updateFlowStep(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase
    .from("project_flow_steps")
    .update({ label: String(formData.get("label")), detail: String(formData.get("detail")) })
    .eq("id", id);
  if (error) throw error;
  revalidateSite();
}

export async function deleteFlowStep(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("project_flow_steps").delete().eq("id", id);
  if (error) throw error;
  revalidateSite();
}

export async function reorderFlowSteps(orderedIds: string[]): Promise<void> {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("project_flow_steps").update({ sort_order: index }).eq("id", id),
    ),
  );
  revalidateSite();
}

// -- Challenges -------------------------------------------------------------

export async function createChallenge(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const projectSlug = String(formData.get("project_slug"));
  const { count } = await supabase
    .from("project_challenges")
    .select("id", { count: "exact", head: true })
    .eq("project_slug", projectSlug);
  const { error } = await supabase.from("project_challenges").insert({
    project_slug: projectSlug,
    title: "New challenge",
    problem: "",
    fix: "",
    snippet_filename: "",
    snippet_code: "",
    sort_order: count ?? 0,
  });
  if (error) throw error;
  revalidateSite();
}

export async function updateChallenge(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase
    .from("project_challenges")
    .update({
      title: String(formData.get("title")),
      problem: String(formData.get("problem")),
      fix: String(formData.get("fix")),
      snippet_filename: String(formData.get("snippet_filename")),
      snippet_code: String(formData.get("snippet_code")),
    })
    .eq("id", id);
  if (error) throw error;
  revalidateSite();
}

export async function deleteChallenge(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("project_challenges").delete().eq("id", id);
  if (error) throw error;
  revalidateSite();
}

export async function reorderChallenges(orderedIds: string[]): Promise<void> {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("project_challenges").update({ sort_order: index }).eq("id", id),
    ),
  );
  revalidateSite();
}
