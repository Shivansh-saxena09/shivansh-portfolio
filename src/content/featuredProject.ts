/**
 * Featured engineering project (CLAUDE.md → /engineering). Placeholder
 * GitHub URL — swap for the real repo link (and confirm whether it's
 * public before linking it, since it likely touches company data).
 */
export const featuredProject = {
  name: "dashboard-of-dpi",
  tagline: "Real-time lead intake and qualification dashboard",
  description:
    "Built to close the gap between ad spend and sales follow-up: leads land in Supabase the moment Meta's webhook fires, get auto-scored, and show up on a live dashboard the sales team actually uses — instead of a CSV export nobody opens fast enough.",
  githubUrl: "https://github.com/Shivansh-saxena09/dashboard-of-dpi",
  stack: ["Next.js", "React", "Supabase", "TypeScript", "Tailwind CSS"],
  challenges: [
    {
      title: "Row-Level Security for multi-role access",
      detail:
        "Sales reps needed to see only their assigned leads while admins saw everything, enforced at the database layer (not just hidden in the UI) — designed Supabase RLS policies keyed off a role column instead of trusting client-side filtering.",
    },
    {
      title: "Race condition on duplicate lead intake",
      detail:
        "Meta occasionally re-fires the same lead webhook, which was creating duplicate rows and double-counting results. Fixed with a unique constraint on the platform lead ID plus an upsert instead of a blind insert.",
    },
    {
      title: "Realtime subscription silently going stale",
      detail:
        "The live dashboard would stop updating after long idle periods because the Supabase Realtime socket died without visibly disconnecting. Added a heartbeat check that detects a stale connection and reconnects automatically.",
    },
  ],
} as const;
