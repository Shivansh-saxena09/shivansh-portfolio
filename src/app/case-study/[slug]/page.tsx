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
import { Container } from "@/components/ui/Container";
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

  const metaFacts: { label: string; value: string }[] = [
    { label: "Platform", value: caseStudy.platform },
    { label: "Objective", value: caseStudy.objective },
    { label: "Budget Type", value: caseStudy.budgetType },
    { label: "Status", value: caseStudy.status },
    { label: "Dates", value: caseStudy.dateRange },
  ];

  return (
    <article className="py-16 sm:py-24">
      <Container>
        <Link href="/marketing" className="nav-underline font-body text-sm text-terracotta">
          ← All marketing work
        </Link>

        <div className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-terracotta">
              {categoryLabel[caseStudy.category]}
            </span>
            <span className="text-beige-border">·</span>
            <span className="font-body text-xs text-warm-grey">{caseStudy.status}</span>
            <span className="text-beige-border">·</span>
            <span className="font-body text-xs text-warm-grey">{caseStudy.dateRange}</span>
          </div>

          <h1 className="mt-4 font-heading text-4xl leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            {caseStudy.campaignName}
          </h1>
          <p className="mt-4 font-body text-lg text-warm-grey">{caseStudy.narrative.objective}</p>
          <p className="mt-6 font-body text-2xl font-medium text-sage-dark">{resultHeadline}</p>
        </div>

        <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-14">
          {/* Sticky quick-facts rail — appears first on mobile as a summary
              card, moves to the right on desktop via order utilities so the
              wide viewport gets a real two-column editorial layout instead
              of one narrow column drowning in whitespace. */}
          <aside className="lg:order-2 lg:col-span-4">
            <div className="glass-card paper-grain rounded-2xl px-6 py-7 shadow-lg lg:sticky lg:top-24">
              <dl className="relative z-10 grid grid-cols-2 gap-3">
                <StatTile compact label="Reach" value={formatNumber(totals.reach)} />
                <StatTile
                  compact
                  label="Leads"
                  value={totals.leads > 0 ? formatNumber(totals.leads) : "—"}
                />
                <StatTile
                  compact
                  label="Cost / Lead"
                  value={totals.leads > 0 ? formatINR(totals.costPerLead) : "—"}
                />
                <StatTile compact label="Spent" value={formatINR(totals.amountSpent)} />
              </dl>

              <dl className="relative z-10 mt-6 flex flex-col gap-3 border-t border-beige-border/70 pt-6">
                {metaFacts.map((fact) => (
                  <div key={fact.label} className="flex items-center justify-between gap-3">
                    <dt className="font-body text-xs text-warm-grey">{fact.label}</dt>
                    <dd className="font-body text-sm font-medium text-charcoal">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="relative z-10 mt-6 flex flex-wrap gap-2 border-t border-beige-border/70 pt-6">
                {caseStudy.skills.map((s) => (
                  <Tag key={s}>{skillLabel(s)}</Tag>
                ))}
              </div>

              <p className="relative z-10 mt-6 border-t border-beige-border/70 pt-4 font-body text-xs text-warm-grey">
                Last verified {caseStudy.lastVerified}
              </p>
            </div>
          </aside>

          <div className="mt-10 max-w-[42rem] lg:order-1 lg:col-span-8 lg:mt-0">
            <p className="font-body text-base leading-relaxed text-charcoal">
              {composeCampaignIntro(caseStudy)}
            </p>

            {/* Narrative — auto-composed metrics prose interleaved with the
                author's own words, per CLAUDE.md's case-study spec. */}
            <div className="mt-12 flex flex-col gap-10">
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
          </div>
        </div>
      </Container>
    </article>
  );
}
