import type { Metadata } from "next";
import { caseStudiesBySkill } from "@/content/caseStudies";
import { skillLabel } from "@/content/skills";
import { CaseStudyCard } from "@/components/marketing/CaseStudyCard";
import { ServicesSection } from "@/components/marketing/ServicesSection";
import { ContactCTA } from "@/components/marketing/ContactCTA";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Marketing Work — Shivansh Saxena",
  description:
    "Meta Ads and Google Ads campaign case studies with real, structured performance data — lead generation for real estate.",
};

export default async function MarketingPage({
  searchParams,
}: PageProps<"/marketing">) {
  const { skill } = await searchParams;
  const activeSkill = typeof skill === "string" ? skill : undefined;
  const filtered = caseStudiesBySkill(activeSkill);

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

          {activeSkill && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="font-body text-sm text-warm-grey">Filtered by:</span>
              <Tag active>{skillLabel(activeSkill)}</Tag>
              <a href="/marketing" className="nav-underline font-body text-sm text-terracotta">
                Clear filter
              </a>
            </div>
          )}
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container>
          {filtered.length > 0 ? (
            <>
              {/* Mobile: a swipeable, snap-to-card carousel (one card at a
                  time, next card peeking at the edge) rather than a long
                  vertical stack of five near-identical cards — the
                  textbook case for a horizontal pattern on a small screen.
                  Desktop: unchanged responsive grid. Pure CSS scroll-snap,
                  no JS/library cost. */}
              <p className="mb-4 font-body text-xs font-medium text-warm-grey sm:hidden">
                Swipe to explore →
              </p>
              <div className="relative sm:contents">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-cream to-transparent sm:hidden"
                />
                <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
                  {filtered.map((caseStudy) => (
                    <div
                      key={caseStudy.slug}
                      className="w-[82vw] shrink-0 snap-start sm:w-auto sm:shrink"
                    >
                      <CaseStudyCard caseStudy={caseStudy} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <p className="font-body text-warm-grey">No case studies tagged with this skill yet.</p>
          )}
        </Container>
      </section>

      <ServicesSection />
      <ContactCTA />
    </>
  );
}
