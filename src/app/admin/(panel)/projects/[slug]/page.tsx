import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Field, TextInput, TextArea, SelectInput, Checkbox, FieldGrid } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { FlowStepsManager } from "@/components/admin/FlowStepsManager";
import { ChallengesManager } from "@/components/admin/ChallengesManager";
import { updateProject, deleteProject } from "../actions";

export default async function AdminProjectEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: project }, { data: flowSteps }, { data: challenges }] = await Promise.all([
    supabase.from("projects").select("*").eq("slug", slug).maybeSingle(),
    supabase
      .from("project_flow_steps")
      .select("id, label, detail")
      .eq("project_slug", slug)
      .order("sort_order", { ascending: true }),
    supabase
      .from("project_challenges")
      .select("id, title, problem, fix, snippet_filename, snippet_code")
      .eq("project_slug", slug)
      .order("sort_order", { ascending: true }),
  ]);

  if (!project) notFound();

  return (
    <div className="max-w-3xl">
      <Link href="/admin/projects" className="font-body text-sm text-sage-dark hover:underline">
        ← All projects
      </Link>

      <div className="mt-2 flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-charcoal">{project.name}</h1>
        <span className="rounded-md bg-beige-border/50 px-2 py-1 font-mono text-xs text-warm-grey">{project.slug}</span>
      </div>

      <form
        action={updateProject}
        className="mt-6 flex flex-col gap-4 rounded-2xl border border-beige-border bg-ivory p-6"
      >
        <input type="hidden" name="slug" value={project.slug} />
        <Field label="Name" htmlFor="name">
          <TextInput id="name" name="name" required defaultValue={project.name} />
        </Field>
        <Field label="Tagline" htmlFor="tagline">
          <TextInput id="tagline" name="tagline" required defaultValue={project.tagline} />
        </Field>
        <Field label="Description" htmlFor="description">
          <TextArea id="description" name="description" rows={4} required defaultValue={project.description} />
        </Field>
        <Field label="GitHub URL" htmlFor="github_url">
          <TextInput id="github_url" name="github_url" type="url" required defaultValue={project.github_url} />
        </Field>
        <Field label="Tech stack" htmlFor="stack" hint="Comma-separated, shown as tags.">
          <TextInput id="stack" name="stack" required defaultValue={(project.stack as string[]).join(", ")} />
        </Field>
        <Field
          label="Demo Video URL"
          htmlFor="demo_video_url"
          hint="Optional. Any YouTube link (watch, youtu.be, or shorts) — shown as a click-to-play embed on the public page."
        >
          <TextInput
            id="demo_video_url"
            name="demo_video_url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            defaultValue={project.demo_video_url ?? ""}
          />
        </Field>

        <FieldGrid>
          <Field label="Status" htmlFor="status">
            <SelectInput id="status" name="status" defaultValue={project.status}>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Archived">Archived</option>
            </SelectInput>
          </Field>
          <div className="flex flex-col justify-end gap-3 pb-2.5">
            <Checkbox name="featured" label="Featured (shown in /engineering hero)" defaultChecked={project.featured} />
            <Checkbox name="published" label="Published" defaultChecked={project.published} />
          </div>
        </FieldGrid>

        <div>
          <SubmitButton>Save Project</SubmitButton>
        </div>
      </form>

      <div className="mt-10">
        <h2 className="font-heading text-xl font-bold text-charcoal">How It Works — Flow Steps</h2>
        <div className="mt-4">
          <FlowStepsManager projectSlug={project.slug} steps={flowSteps ?? []} />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-heading text-xl font-bold text-charcoal">Technical Challenges</h2>
        <div className="mt-4">
          <ChallengesManager
            projectSlug={project.slug}
            challenges={(challenges ?? []).map((c) => ({
              id: c.id,
              title: c.title,
              problem: c.problem,
              fix: c.fix,
              snippet: { filename: c.snippet_filename, code: c.snippet_code },
            }))}
          />
        </div>
      </div>

      <form action={deleteProject} className="mt-10 border-t border-beige-border pt-6">
        <input type="hidden" name="slug" value={project.slug} />
        <p className="mb-2 font-body text-sm text-warm-grey">
          Deleting a project also deletes its flow steps and challenges.
        </p>
        <SubmitButton variant="danger" pendingLabel="Deleting…">
          Delete Project
        </SubmitButton>
      </form>
    </div>
  );
}
