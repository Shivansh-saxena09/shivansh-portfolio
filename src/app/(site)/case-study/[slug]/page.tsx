import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllCaseStudySlugs, getCaseStudy } from "@/lib/data/caseStudies";
import { getSiteSettings } from "@/lib/data/site";
import { aggregate, cardSummary, composeCampaignIntro, formatINR, formatNumber } from "@/lib/caseStudyNarrative";
import { highlightStats, statHeadline } from "@/lib/highlightStats";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";
import { StatTile } from "@/components/case-study/StatTile";
import { StoryChapters } from "@/components/case-study/StoryChapters";
import { AdSetSection } from "@/components/case-study/AdSetSection";
import { AdSetComparisonTable } from "@/components/case-study/AdSetComparisonTable";
import { Gallery } from "@/components/case-study/GalleryPlaceholder";
import { CampaignDoctorInsight } from "@/components/case-study/CampaignDoctorInsight";
import { TableOfContents, type TocSection } from "@/components/case-study/TableOfContents";
import { CaseStudyJsonLd } from "@/components/seo/JsonLd";

const categoryLabel = {
  standard: "Campaign",
  learning: "Learning",
  "dual-skill-fusion": "Marketing × Engineering",
} as const;

// Static generation — every case study page is prerendered at build time,
// so visiting one is a static HTML fetch, not a server round-trip.
export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/case-study/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [caseStudy, settings] = await Promise.all([getCaseStudy(slug), getSiteSettings()]);
  if (!caseStudy) return {};
  const { oneLiner } = cardSummary(caseStudy);
  return {
    title: `${caseStudy.campaignName} — ${settings.personName}`,
    description: oneLiner,
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/case-study/[slug]">) {
  const { slug } = await params;
  const [caseStudy, settings] = await Promise.all([getCaseStudy(slug), getSiteSettings()]);
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

  // Drives both the mobile pill nav and the desktop sidebar list from one
  // source of truth, so a section can never appear in one and not the
  // other — Campaign Doctor only exists here at all once an insight has
  // actually been published for this case study.
  const tocSections: TocSection[] = [
    { id: "overview", label: "Overview" },
    { id: "story", label: "The Story" },
    { id: "results", label: "Results" },
    ...(caseStudy.aiInsight ? [{ id: "campaign-doctor", label: "Campaign Doctor" }] : []),
    { id: "creatives", label: "Creatives" },
  ];

  return (
    <article className="py-16 sm:py-24">
      <CaseStudyJsonLd caseStudy={caseStudy} settings={settings} />
      <Container>
        <Link href="/marketing" className="nav-underline font-body text-sm text-terracotta">
          ← All marketing work
        </Link>

        <div id="overview" className="mt-8 max-w-3xl scroll-mt-24">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-terracotta">
              {categoryLabel[caseStudy.category]}
            </span>
            <span className="text-beige-border">·</span>
            <span className="font-body text-xs text-warm-grey">{caseStudy.status}</span>
            <span className="text-beige-border">·</span>
            <span className="font-body text-xs text-warm-grey">{caseStudy.dateRange}</span>
          </div>

          <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            {caseStudy.campaignName}
          </h1>
          <p className="mt-4 font-body text-lg text-warm-grey">{caseStudy.narrative.objective}</p>
          <p className="mt-6 leading-tight">{statHeadline(resultHeadline, caseStudy.slug, "page")}</p>
        </div>

        {/* Mobile/tablet jump nav — the sticky sidebar below is desktop-only
            (lg:sticky), so this horizontally-scrollable pill row gives
            everything below that breakpoint the same fast way to skip
            straight to Results or Campaign Doctor on a page this long. */}
        <div className="mt-6 lg:hidden">
          <TableOfContents sections={tocSections} variant="pills" />
        </div>

        <div className="mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-14">
          {/* Sticky rail — jump nav, then the quick-facts card. Appears
              first on mobile as a summary block, moves to the right on
              desktop via order utilities so the wide viewport gets a real
              two-column editorial layout instead of one narrow column
              drowning in whitespace. */}
          <aside className="lg:order-2 lg:col-span-4">
            <div className="glass-card paper-grain rounded-2xl px-6 py-7 shadow-lg lg:sticky lg:top-24">
              <div className="relative z-10 hidden lg:block">
                <p className="font-body text-xs font-semibold tracking-[0.15em] text-warm-grey uppercase">
                  On This Page
                </p>
                <div className="mt-3">
                  <TableOfContents sections={tocSections} variant="list" />
                </div>
              </div>

              <dl className="relative z-10 grid grid-cols-2 gap-3 lg:mt-6 lg:border-t lg:border-beige-border/70 lg:pt-6">
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
                  <Tag key={s.slug}>{s.label}</Tag>
                ))}
              </div>

              <p className="relative z-10 mt-6 border-t border-beige-border/70 pt-4 font-body text-xs text-warm-grey">
                Last verified {caseStudy.lastVerified}
              </p>
            </div>
          </aside>

          <div className="mt-10 max-w-[42rem] lg:order-1 lg:col-span-8 lg:mt-0">
            <p className="font-body text-base leading-relaxed text-charcoal">
              {highlightStats(composeCampaignIntro(caseStudy), "intro")}
            </p>

            {/* The Story — the six narrative fields as one connected
                sequence (see StoryChapters.tsx) rather than six identical
                stacked heading/paragraph pairs, with auto-composed metrics
                prose interleaved with the author's own words per
                CLAUDE.md's case-study spec. Numbers get the same inline
                callout treatment here as in the auto-generated copy above
                — a reader scanning "The Challenge" should catch the ₹540
                CPL failure number as fast as the sentence around it. */}
            <section id="story" className="mt-14 scroll-mt-24">
              <h2 className="font-heading text-2xl text-charcoal">The Story</h2>
              <div className="mt-8">
                <StoryChapters narrative={caseStudy.narrative} />
              </div>
            </section>

            {/* Results — the always-visible comparison table (when there's
                more than one ad set to compare) answers "which one won"
                immediately; the full per-ad-set breakdown underneath is
                progressive disclosure for whoever wants the deep numbers,
                collapsed by default except the first (see AdSetSection). */}
            <section id="results" className="mt-14 scroll-mt-24">
              <h2 className="font-heading text-2xl text-charcoal">Results</h2>

              {multiAdSet && (
                <div className="mt-6">
                  <AdSetComparisonTable adSets={caseStudy.adSets} />
                </div>
              )}

              <div className="mt-6 flex flex-col gap-4">
                {caseStudy.adSets.map((adSet, i) => (
                  <AdSetSection
                    key={adSet.id}
                    adSet={adSet}
                    showName={multiAdSet}
                    collapsible={multiAdSet}
                    defaultOpen={i === 0}
                  />
                ))}
              </div>
            </section>

            {caseStudy.aiInsight && (
              <section id="campaign-doctor" className="mt-14 scroll-mt-24">
                <CampaignDoctorInsight
                  whatsWorking={caseStudy.aiInsight.whatsWorking}
                  likelyIssues={caseStudy.aiInsight.likelyIssues}
                  recommendedAction={caseStudy.aiInsight.recommendedAction}
                  timeframe={caseStudy.aiInsight.timeframe}
                  generatedAt={caseStudy.aiInsight.generatedAt}
                />
              </section>
            )}

            <section id="creatives" className="mt-14 scroll-mt-24">
              <h2 className="font-heading text-xl text-charcoal">Creatives</h2>
              <div className="mt-5">
                <Gallery images={caseStudy.galleryImages} placeholderCount={caseStudy.galleryPlaceholderCount} />
              </div>
            </section>
          </div>
        </div>
      </Container>
    </article>
  );
}
