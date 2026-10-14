import type { Metadata } from "next";
import { Suspense } from "react";
import { getCaseStudies } from "@/lib/data/caseStudies";
import { getSkills } from "@/lib/data/skills";
import { getContactInfo, getPageMeta, getSiteSettings } from "@/lib/data/site";
import { formatINR, formatPct } from "@/lib/caseStudyNarrative";
import { AdSetRace, type RaceSet } from "@/components/marketing/AdSetRace";
import { ProcessSteps } from "@/components/marketing/ProcessSteps";
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
  const processSteps = hv.processSteps.map((title, i) => ({ title, detail: hv.processDetails[i] })).filter((s) => s.title);

  return (
    <>
      <section className="paper-grain relative border-b border-beige-border/70 pt-16 pb-14 sm:pt-24 sm:pb-16">
        <Container className="relative z-10">
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
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          <CaseStudyResults caseStudies={caseStudies} />
          {raceCase && (
            <div className="mt-14">
              <AdSetRace heading={hv.barRaceHeading} labels={hv.barRaceLabels} campaign={raceCase.campaignName} href={`/case-study/${raceCase.slug}`} sets={toRace(raceCase)} />
            </div>
          )}
        </Container>
      </section>

      <ServicesSection />
      {processSteps.length > 0 && <ProcessSteps heading={hv.processHeading} steps={processSteps} />}
      <ContactCTA contact={contact} />
    </>
  );
}
