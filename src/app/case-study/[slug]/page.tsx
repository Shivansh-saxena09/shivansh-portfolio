import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCaseStudy, caseStudies } from "@/content/caseStudies";
import { skillLabel } from "@/content/skills";
import { Tag } from "@/components/ui/Tag";

/**
 * Stub detail page. The full auto-composed narrative template described in
 * CLAUDE.md (structured metrics → readable prose, ad-set comparisons,
 * creative gallery, etc.) is the next build phase — this just renders the
 * trimmed placeholder fields from src/content/caseStudies.ts so /marketing
 * cards have somewhere real to link to in the meantime.
 */

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/case-study/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) return {};
  return {
    title: `${caseStudy.campaignName} — Shivansh Saxena`,
    description: caseStudy.oneLiner,
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/case-study/[slug]">) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) notFound();

  return (
    <section className="px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <Link href="/marketing" className="nav-underline font-body text-sm text-terracotta">
          ← All marketing work
        </Link>

        <div className="mt-6 rounded-xl border border-beige-border bg-ivory px-5 py-3 font-body text-sm text-warm-grey">
          Full case study template (structured metrics, targeting breakdown, creative gallery,
          narrative auto-generation) is coming in the next build phase — this is a preview with
          placeholder numbers.
        </div>

        <h1 className="mt-8 font-heading text-4xl leading-tight text-charcoal sm:text-5xl">
          {caseStudy.campaignName}
        </h1>
        <p className="mt-4 font-body text-lg text-warm-grey">{caseStudy.oneLiner}</p>
        <p className="mt-6 font-body text-xl font-medium text-sage-dark">
          {caseStudy.resultHeadline}
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-beige-border py-8 sm:grid-cols-4">
          <div>
            <dt className="font-body text-xs uppercase tracking-wide text-warm-grey">Platform</dt>
            <dd className="mt-1 font-body text-base text-charcoal">{caseStudy.platform}</dd>
          </div>
          <div>
            <dt className="font-body text-xs uppercase tracking-wide text-warm-grey">Objective</dt>
            <dd className="mt-1 font-body text-base text-charcoal">{caseStudy.objective}</dd>
          </div>
          <div>
            <dt className="font-body text-xs uppercase tracking-wide text-warm-grey">Status</dt>
            <dd className="mt-1 font-body text-base text-charcoal">{caseStudy.status}</dd>
          </div>
          <div>
            <dt className="font-body text-xs uppercase tracking-wide text-warm-grey">Dates</dt>
            <dd className="mt-1 font-body text-base text-charcoal">{caseStudy.dateRange}</dd>
          </div>
        </dl>

        <div className="mt-8 flex flex-wrap gap-2">
          {caseStudy.skills.map((s) => (
            <Tag key={s}>{skillLabel(s)}</Tag>
          ))}
        </div>

        <p className="mt-8 font-body text-xs text-warm-grey">
          Last verified {caseStudy.lastVerified}
        </p>
      </div>
    </section>
  );
}
