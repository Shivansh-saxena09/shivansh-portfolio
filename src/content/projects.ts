/**
 * Engineering projects (CLAUDE.md → /engineering's featured project).
 * Modeled as a collection from day one — even with a single entry today —
 * because it's exactly the shape the eventual Supabase table takes (a
 * `projects` row + a `project_challenges` child table, mirroring how
 * caseStudies.ts already models ad sets as a child collection). Adding a
 * second project later means pushing an array entry, not reshaping this
 * file or any component that reads it.
 *
 * Placeholder GitHub URL — swap for the real repo link (and confirm
 * whether it's public before linking it, since it likely touches company
 * data). Each challenge's `snippet` is a short, real illustration of the
 * actual fix described — not decorative filler code.
 */

export type ProjectChallenge = {
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
  flow: { label: string; detail: string }[];
  challenges: ProjectChallenge[];
};

export const projects: Project[] = [
  {
    slug: "dashboard-of-dpi",
    name: "dashboard-of-dpi",
    tagline: "Real-time lead intake and qualification dashboard",
    description:
      "Built to close the gap between ad spend and sales follow-up: leads land in Supabase the moment Meta's webhook fires, get auto-scored, and show up on a live dashboard the sales team actually uses — instead of a CSV export nobody opens fast enough.",
    githubUrl: "https://github.com/Shivansh-saxena09/dashboard-of-dpi",
    stack: ["Next.js", "React", "Supabase", "TypeScript", "Tailwind CSS"],
    status: "Active",
    featured: true,

    flow: [
      { label: "Meta Ad", detail: "Lead form submitted" },
      { label: "Webhook", detail: "Meta fires the lead event" },
      { label: "Supabase", detail: "RLS-scoped upsert, deduplicated" },
      { label: "Dashboard", detail: "Pushed live via Realtime" },
    ],

    challenges: [
      {
        title: "Row-Level Security for multi-role access",
        problem:
          "Sales reps needed to see only their assigned leads while admins saw everything — enforced at the database layer, not just hidden in the UI.",
        fix: "Supabase RLS policies keyed off a role column, so access control holds even if the client is bypassed.",
        snippet: {
          filename: "policies.sql",
          code: 'create policy "reps see own leads"\non leads for select\nusing (auth.uid() = assigned_rep_id);',
        },
      },
      {
        title: "Race condition on duplicate lead intake",
        problem:
          "Meta occasionally re-fires the same lead webhook, creating duplicate rows and double-counting results.",
        fix: "A unique constraint on the platform lead ID plus an upsert instead of a blind insert.",
        snippet: {
          filename: "intake.ts",
          code: 'await supabase\n  .from("leads")\n  .upsert(lead, { onConflict: "platform_lead_id" });',
        },
      },
      {
        title: "Realtime subscription silently going stale",
        problem:
          "The live dashboard would stop updating after long idle periods because the Supabase Realtime socket died without visibly disconnecting.",
        fix: "A heartbeat check that detects a stale connection and reconnects automatically.",
        snippet: {
          filename: "realtime.ts",
          code: 'channel.on("system", { event: "*" }, (status) => {\n  if (status === "CLOSED") channel.subscribe();\n});',
        },
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProject(): Project | undefined {
  return projects.find((p) => p.featured);
}
