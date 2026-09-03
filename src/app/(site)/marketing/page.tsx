import type { Metadata } from "next";
import { Suspense } from "react";
import { getCaseStudies } from "@/lib/data/caseStudies";
import { getSkills } from "@/lib/data/skills";
import { getContactInfo, getPageMeta } from "@/lib/data/site";
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
  const [caseStudies, skills, contact] = await Promise.all([
    getCaseStudies(),
    getSkills(),
    getContactInfo(),
  ]);

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
        </Container>
      </section>

      <ServicesSection />
      <ContactCTA contact={contact} />
    </>
  );
}
