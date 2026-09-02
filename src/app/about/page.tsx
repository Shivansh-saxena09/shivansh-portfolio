import type { Metadata } from "next";
import { aboutHero, aboutStory, quickFacts, vitals } from "@/content/about";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ResumeButton } from "@/components/ui/ResumeButton";
import { Timeline } from "@/components/about/Timeline";
import { Education } from "@/components/about/Education";

export const metadata: Metadata = {
  title: "About — Shivansh Saxena",
  description:
    "Performance Marketing Manager running Meta and Google Ads for real estate lead generation, with full-stack development as a differentiator — the story, experience, and education.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero — mirrors the homepage's two-column + floating glass-card
          motif (a deliberate callback for sitewide cohesion), swapping
          skill chips for a "currently" profile card + resume download. */}
      <section className="paper-grain relative overflow-hidden border-b border-beige-border/70 pt-16 pb-20 sm:pt-24 sm:pb-24 lg:pb-28">
        <Container className="relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-7">
              <p className="font-body text-sm font-medium uppercase tracking-[0.2em] text-terracotta">
                {aboutHero.eyebrow}
              </p>
              <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-charcoal sm:text-5xl lg:text-6xl">
                {aboutHero.headline} <em className="text-terracotta italic">{aboutHero.accentWord}</em>
              </h1>
            </div>

            <div className="relative mt-14 lg:col-span-5 lg:mt-0">
              <div
                aria-hidden="true"
                className="absolute -top-10 -right-6 h-56 w-56 rounded-full bg-sage/25 blur-3xl sm:h-72 sm:w-72"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-8 left-6 h-40 w-40 rounded-full bg-terracotta/20 blur-3xl"
              />

              <div className="glass-card relative mx-auto max-w-sm rotate-1 rounded-2xl px-7 py-8 shadow-xl sm:px-8">
                <span className="relative z-10 font-body text-xs font-semibold uppercase tracking-[0.15em] text-warm-grey">
                  Currently
                </span>
                <p className="relative z-10 mt-2 font-heading text-xl font-bold text-charcoal">
                  {vitals.currentRole}
                </p>
                <p className="relative z-10 font-body text-sm text-warm-grey">{vitals.currentOrg}</p>

                <div className="relative z-10 mt-5 flex flex-col gap-2 border-t border-beige-border/70 pt-5 font-body text-sm text-charcoal">
                  <p>{vitals.location}</p>
                  <p>{vitals.educationNote}</p>
                </div>

                <div className="relative z-10 mt-6 border-t border-beige-border/70 pt-6">
                  <ResumeButton variant="primary" className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Story — narrative on one side, a pull-quote + real derived
          numbers on the other, so the section uses the full container
          width instead of a lone centered paragraph column. */}
      <section className="py-20 sm:py-24">
        <Container>
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="flex flex-col gap-6 lg:col-span-7">
              {aboutStory.paragraphs.map((paragraph, i) => (
                <p key={i} className="font-body text-lg leading-relaxed text-charcoal">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 lg:col-span-5 lg:mt-0">
              <blockquote className="border-l-4 border-terracotta pl-6 font-heading text-2xl leading-snug text-charcoal italic sm:text-3xl">
                “{aboutStory.pullQuote}”
              </blockquote>

              {/* Below sm: a real phone is too narrow for 3 columns here
                  without cramped wrapping (confirmed visually, not
                  assumed) — a stacked row list reads as a deliberate
                  spec-sheet rather than a squeezed grid. sm–lg: enough
                  width reopens for the 3-up grid. lg+: back to a single
                  stacked column matching the sidebar card treatment. */}
              <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4">
                {quickFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-center gap-4 rounded-xl border border-beige-border bg-ivory p-5 sm:block sm:gap-0 lg:flex lg:items-center lg:gap-4"
                  >
                    <p className="shrink-0 font-heading text-3xl font-bold text-terracotta">
                      {fact.value}
                    </p>
                    <p className="font-body text-xs text-warm-grey sm:mt-1 lg:mt-0">{fact.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-beige-border/70 bg-ivory py-20">
        <Container>
          <h2 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">Experience</h2>
          <div className="mt-12">
            <Timeline />
          </div>
        </Container>
      </section>

      <section className="border-t border-beige-border/70 py-20">
        <Container>
          <h2 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">Education</h2>
          <div className="mt-12">
            <Education />
          </div>
        </Container>
      </section>

      <section className="paper-grain relative border-t border-beige-border/70 bg-ivory py-20">
        <Container className="relative z-10">
          <h2 className="max-w-2xl font-heading text-3xl font-bold text-charcoal sm:text-4xl">
            See the work that comes out of it.
          </h2>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href="/marketing" variant="primary" className="w-full sm:w-auto">
              View Marketing Work
            </Button>
            <Button href="/engineering" variant="secondary" className="w-full sm:w-auto">
              View Engineering Work
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
