import type { Metadata } from "next";
import { aboutStory } from "@/content/about";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
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
      <section className="paper-grain relative border-b border-beige-border/70 pt-16 pb-14 sm:pt-24 sm:pb-16">
        <Container className="relative z-10">
          <p className="font-body text-sm font-medium uppercase tracking-[0.2em] text-terracotta">
            About
          </p>
          <h1 className="mt-6 max-w-3xl font-heading text-4xl font-bold leading-tight text-charcoal sm:text-5xl lg:text-6xl">
            {aboutStory.headline} <em className="text-terracotta italic">{aboutStory.accentWord}</em>
          </h1>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container size="narrow">
          <div className="flex flex-col gap-6">
            {aboutStory.paragraphs.map((paragraph, i) => (
              <p key={i} className="font-body text-lg leading-relaxed text-charcoal">
                {paragraph}
              </p>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-beige-border/70 bg-ivory py-20">
        <Container>
          <h2 className="font-heading text-3xl text-charcoal sm:text-4xl">Experience</h2>
          <div className="mt-10 max-w-3xl">
            <Timeline />
          </div>
        </Container>
      </section>

      <section className="border-t border-beige-border/70 py-20">
        <Container>
          <h2 className="font-heading text-3xl text-charcoal sm:text-4xl">Education</h2>
          <div className="mt-10 max-w-3xl">
            <Education />
          </div>
        </Container>
      </section>

      <section className="border-t border-beige-border/70 bg-ivory py-20">
        <Container>
          <h2 className="max-w-2xl font-heading text-3xl text-charcoal sm:text-4xl">
            See the work that comes out of it.
          </h2>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button href="/marketing" variant="primary">
              View Marketing Work
            </Button>
            <Button href="/engineering" variant="secondary">
              View Engineering Work
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
