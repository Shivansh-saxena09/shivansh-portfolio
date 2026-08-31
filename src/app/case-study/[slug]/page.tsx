import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { caseStudies, getCaseStudy } from "@/content/caseStudies";
import { skillLabel } from "@/content/skills";
import {
  aggregate,
  cardSummary,
  composeCampaignIntro,
  formatINR,
  formatNumber,
} from "@/lib/caseStudyNarrative";
import { Tag } from "@/components/ui/Tag";
import { StatTile } from "@/components/case-study/StatTile";
import { AdSetSection } from "@/components/case-study/AdSetSection";
import { AdSetComparisonTable } from "@/components/case-study/AdSetComparisonTable";
import { GalleryPlaceholder } from "@/components/case-study/GalleryPlaceholder";

const categoryLabel = {
  standard: "Campaign",
  learning: "Learning",
  "dual-skill-fusion": "Marketing × Engineering",
} as const;

const narrativeBlocks = [
  { key: "objective", label: "The Objective" },
  { key: "strategy", label: "The Strategy" },
  { key: "challenge", label: "The Challenge" },
  { key: "decision", label: "The Decision" },
  { key: "outcome", label: "The Outcome" },
  { key: "whatIdDoDifferently", label: "What I'd Do Differently" },
] as const;

// Static generation — every case study page is prerendered at build time,
// so visiting one is a static HTML fetch, not a server round-trip.
export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/case-study/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) return {};
  const { oneLiner } = cardSummary(caseStudy);
  return {
    title: `${caseStudy.campaignName} — Shivansh Saxena`,
    description: oneLiner,
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/case-study/[slug]">) {
  const { slug } = await params;
  const caseStudy = getCaseStudy(slug);
  if (!caseStudy) notFound();

  const totals = aggregate(caseStudy.adSets);
  const { resultHeadline } = cardSummary(caseStudy);
  const multiAdSet = caseStudy.adSets.length > 1;

  return (
    <article className="px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <Link href="/marketing" className="nav-underline font-body text-sm text-terracotta">
          ← All marketing work
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-terracotta">
            {categoryLabel[caseStudy.category]}
          </span>
          <span className="text-beige-border">·</span>
          <span className="font-body text-xs text-warm-grey">{caseStudy.status}</span>
          <span className="text-beige-border">·</span>
          <span className="font-body text-xs text-warm-grey">{caseStudy.dateRange}</span>
        </div>

        <h1 className="mt-4 font-heading text-4xl leading-tight text-charcoal sm:text-5xl">
          {caseStudy.campaignName}
        </h1>
        <p className="mt-4 font-body text-lg text-warm-grey">{caseStudy.narrative.objective}</p>
        <p className="mt-6 font-body text-2xl font-medium text-sage-dark">{resultHeadline}</p>

        {/* Aggregate stats — always the campaign-wide totals, even with multiple ad sets */}
        <dl className="mt-10 grid grid-cols-2 gap-3 border-y border-beige-border py-8 sm:grid-cols-4">
          <StatTile label="Reach" value={formatNumber(totals.reach)} />
          <StatTile label="Leads" value={totals.leads > 0 ? formatNumber(totals.leads) : "—"} />
          <StatTile
            label="Cost / Lead"
            value={totals.leads > 0 ? formatINR(totals.costPerLead) : "—"}
          />
          <StatTile label="Amount Spent" value={formatINR(totals.amountSpent)} />
        </dl>

        <p className="mt-8 font-body text-base leading-relaxed text-charcoal">
          {composeCampaignIntro(caseStudy)}
        </p>

        {/* Narrative — auto-composed metrics prose interleaved with the
            author's own words, per CLAUDE.md's case-study spec. */}
        <div className="mt-14 flex flex-col gap-10">
          {narrativeBlocks.map((block) => (
            <div key={block.key}>
              <h2 className="font-heading text-xl text-charcoal">{block.label}</h2>
              <p className="mt-2 font-body text-base leading-relaxed text-warm-grey">
                {caseStudy.narrative[block.key]}
              </p>
            </div>
          ))}
        </div>

        {/* Per-ad-set breakdown */}
        <div className="mt-14">
          <h2 className="font-heading text-2xl text-charcoal">
            {multiAdSet ? "Ad Set Breakdown" : "Campaign Performance"}
          </h2>
          <div className="mt-6 flex flex-col gap-8">
            {caseStudy.adSets.map((adSet) => (
              <AdSetSection key={adSet.name} adSet={adSet} showName={multiAdSet} />
            ))}
          </div>
        </div>

        {multiAdSet && (
          <div className="mt-10">
            <h2 className="font-heading text-xl text-charcoal">Side-by-Side Comparison</h2>
            <div className="mt-5">
              <AdSetComparisonTable adSets={caseStudy.adSets} />
            </div>
          </div>
        )}

        <div className="mt-14">
          <h2 className="font-heading text-xl text-charcoal">Creatives</h2>
          <div className="mt-5">
            <GalleryPlaceholder count={caseStudy.galleryPlaceholderCount} />
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {caseStudy.skills.map((s) => (
            <Tag key={s}>{skillLabel(s)}</Tag>
          ))}
        </div>

        <p className="mt-8 font-body text-xs text-warm-grey">
          Last verified {caseStudy.lastVerified}
        </p>
      </div>
    </article>
  );
}
