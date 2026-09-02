import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AddCaseStudyForm } from "@/components/admin/AddCaseStudyForm";

export default async function AdminCaseStudiesPage() {
  const supabase = await createClient();
  const { data: caseStudies, error } = await supabase
    .from("case_studies")
    .select("slug, campaign_name, status, category, published")
    .order("sort_order", { ascending: true });
  if (error) throw error;

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Case Studies</h1>
      <p className="mt-1 font-body text-sm text-warm-grey">Campaign case studies shown on /marketing.</p>

      <div className="mt-6 flex flex-col gap-3">
        {caseStudies.map((cs) => (
          <Link
            key={cs.slug}
            href={`/admin/case-studies/${cs.slug}`}
            className="flex items-center justify-between gap-4 rounded-xl border border-beige-border bg-ivory p-4 transition-colors hover:border-terracotta/40"
          >
            <div>
              <p className="font-heading text-base font-bold text-charcoal">{cs.campaign_name}</p>
              <p className="font-body text-sm text-warm-grey">
                {cs.category} · {cs.status}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-0.5 font-body text-xs font-semibold ${
                cs.published ? "bg-sage/15 text-sage-dark" : "bg-beige-border/60 text-warm-grey"
              }`}
            >
              {cs.published ? "Published" : "Draft"}
            </span>
          </Link>
        ))}
        {caseStudies.length === 0 && <p className="font-body text-sm text-warm-grey">No case studies yet.</p>}
      </div>

      <div className="mt-6">
        <AddCaseStudyForm />
      </div>
    </div>
  );
}
