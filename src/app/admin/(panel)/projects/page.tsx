import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AddProjectForm } from "@/components/admin/AddProjectForm";

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  // Unfiltered — RLS already lets an authenticated admin see drafts too;
  // the public lib/data/projects.ts helpers add their own
  // `published = true` filter on top of RLS, which would hide drafts
  // here if reused as-is. Admin views query directly for that reason.
  const { data: projects, error } = await supabase
    .from("projects")
    .select("slug, name, tagline, status, featured, published")
    .order("sort_order", { ascending: true });
  if (error) throw error;

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Projects</h1>
      <p className="mt-1 font-body text-sm text-warm-grey">
        Engineering projects shown on /engineering, each with its own detail page.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {projects.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/projects/${p.slug}`}
            className="flex items-center justify-between gap-4 rounded-xl border border-beige-border bg-ivory p-4 transition-colors hover:border-terracotta/40"
          >
            <div>
              <p className="font-heading text-base font-bold text-charcoal">
                {p.name}
                {p.featured && (
                  <span className="ml-2 rounded-full bg-sage/15 px-2 py-0.5 font-body text-xs font-semibold text-sage-dark">
                    Featured
                  </span>
                )}
              </p>
              <p className="font-body text-sm text-warm-grey">{p.tagline || "No tagline yet"}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${
                p.published ? "bg-sage/15 text-sage-dark" : "bg-beige-border/60 text-warm-grey"
              }`}
            >
              {p.published ? "Published" : "Draft"}
            </span>
          </Link>
        ))}
        {projects.length === 0 && <p className="font-body text-sm text-warm-grey">No projects yet.</p>}
      </div>

      <div className="mt-6">
        <AddProjectForm />
      </div>
    </div>
  );
}
