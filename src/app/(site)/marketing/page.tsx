import type { Metadata } from "next";
import { Suspense } from "react";
import { getCaseStudies } from "@/lib/data/caseStudies";
import { getSkills } from "@/lib/data/skills";
import { getContactInfo, getPageMeta, getSiteSettings } from "@/lib/data/site";
import { formatINR, formatPct } from "@/lib/caseStudyNarrative";
import { AdSetRace, type RaceSet } from "@/components/marketing/AdSetRace";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
import { CaseFunnel } from "@/components/case-study/CaseFunnel";
import { aggregate, formatNumber } from "@/lib/caseStudyNarrative";
import { pageMetadata } from "@/lib/seo";
import { FilterBadge } from "@/components/marketing/FilterBadge";
import { CaseStudyResults } from "@/components/marketing/CaseStudyResults";
import { ServicesSection } from "@/components/marketing/ServicesSection";
import { ContactCTA } from "@/components/marketing/ContactCTA";
import { Container } from "@/components/ui/Container";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("marketing");
  return pageMetadata(meta, {
    title: "Marketing Work — Shivansh Saxena",
    description:
      "Meta Ads and Google Ads campaign case studies with real, structured performance data — lead generation for real estate.",
  });
}

// No searchParams here (unlike the old version of this page) — the
// ?skill= filter is now resolved client-side (see FilterBadge and
// CaseStudyResults), specifically so this page has nothing forcing
// dynamic rendering. Reading searchParams in a Server Component opts
// the entire route out of static generation, which meant every single
// visit — including the overwhelming majority with no filter at all —
// was paying for a fresh server render and a live Supabase query. This
// is also the site's primary client-facing path (CLAUDE.md), so it's
// the page that most needed to be instant.
export default async function MarketingPage() {
  const [caseStudies, skills, contact, settings] = await Promise.all([
    getCaseStudies(),
    getSkills(),
    getContactInfo(),
    getSiteSettings(),
  ]);
  const hv = settings.heroVisual;
  // Bar race: the first published case study with 2+ ad sets that have leads and impressions (none → no race).
  const toRace = (c: (typeof caseStudies)[number]): RaceSet[] =>
    c.adSets
      .filter((a) => a.metrics.leads > 0 && a.metrics.impressions > 0)
      .map((a) => {
        const cpl = a.metrics.amountSpent / a.metrics.leads;
        const ctr = (a.metrics.linkClicks / a.metrics.impressions) * 100;
        return { name: a.name, cpl, cplText: formatINR(cpl), ctr, ctrText: formatPct(ctr) };
      });
  const raceCase = caseStudies.find((c) => toRace(c).length >= 2);
  // Top panel: real totals across every published case study (none → the intro spans the full width).
  const all = aggregate(caseStudies.flatMap((c) => c.adSets));
  const panelStages = [all.impressions, all.linkClicks, all.leads].map((value, i) => ({ label: hv.stages[i], value, text: formatNumber(value) })).filter((s) => s.value > 0);
  const platforms = [...new Set(caseStudies.map((c) => c.platform).filter(Boolean))];
  const single = caseStudies.length === 1 && !!raceCase;
  const processSteps = hv.processSteps.map((title, i) => ({ title, detail: hv.processDetails[i] })).filter((s) => s.title);

  return (
    <>
      <section className="paper-grain relative border-b border-beige-border/70 pt-16 pb-14 sm:pt-24 sm:pb-16">
        <Container className={`relative z-10 ${panelStages.length ? "lg:grid lg:grid-cols-12 lg:items-center lg:gap-12" : ""}`}>
          <div className={panelStages.length ? "lg:col-span-7" : ""}>
          <p className="font-body text-sm font-medium uppercase tracking-[0.2em] text-terracotta">
            Marketing Work
          </p>
          <h1 className="mt-6 max-w-3xl font-heading text-4xl font-bold leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            Campaign case studies, built from <em className="text-terracotta italic">real numbers</em>.
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-warm-grey">
            Every case study below is pulled from structured campaign data — targeting,
            spend, results, and what I&apos;d do differently — not rewritten after the fact.
          </p>

          <Suspense fallback={null}>
            <FilterBadge skills={skills} />
          </Suspense>
          </div>
          {panelStages.length > 0 && (
            <aside aria-label={hv.marketingPanelHeading} className="mt-10 hidden rounded-3xl sm:block border border-beige-border bg-ivory/80 p-6 shadow-[0_1px_2px_rgba(43,38,34,0.04),0_24px_48px_-24px_rgba(43,38,34,0.18)] lg:col-span-5 lg:mt-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-body text-xs font-semibold tracking-[0.15em] text-warm-grey uppercase">{hv.marketingPanelHeading}</p>
                <div className="flex gap-1.5">
                  {platforms.map((p) => (
                    <span key={p} className="rounded-full bg-terracotta/10 px-2.5 py-0.5 font-body text-[11px] font-semibold text-terracotta-dark">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-5">
                <CaseFunnel stages={panelStages} now />
              </div>
              {all.leads > 0 && all.amountSpent > 0 && (
                <p className="mt-4 flex items-baseline justify-between border-t border-beige-border/70 pt-4 font-body text-sm text-warm-grey">
                  {hv.proofLabels[2]}
                  <span className="font-heading text-2xl font-bold text-terracotta">{formatINR(all.amountSpent / all.leads)}</span>
                </p>
              )}
            </aside>
          )}
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          {/* One case study: its card and its ad-set race share the row instead of a lone card in a 3-column grid */}
          <div className={single ? "lg:grid lg:grid-cols-12 lg:items-start lg:gap-10" : ""}>
            <div className={single ? "lg:col-span-5" : ""}>
              <CaseStudyResults caseStudies={caseStudies} />
            </div>
            {raceCase && (
              <div className={single ? "mt-14 lg:col-span-7 lg:mt-0" : "mt-14"}>
                <AdSetRace heading={hv.barRaceHeading} labels={hv.barRaceLabels} campaign={raceCase.campaignName} href={`/case-study/${raceCase.slug}`} sets={toRace(raceCase)} />
              </div>
            )}
          </div>
        </Container>
      </section>

      <ServicesSection />
      {processSteps.length > 0 && <ProcessSteps heading={hv.processHeading} steps={processSteps} />}
      <ContactCTA contact={contact} />
    </>
  );
}
