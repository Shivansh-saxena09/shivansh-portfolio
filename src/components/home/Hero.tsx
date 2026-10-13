"use client";

import type { HeroVisualContent } from "@/lib/data/heroVisual";
import { useReferrerBias } from "@/lib/useReferrerBias";
import { Container } from "@/components/ui/Container";
import { HeroStory, type Milestone } from "@/components/home/HeroStory";

type Identity = { name: string; role: string; tagline: string };

/**
 * The hero is a single pantomime scene (HeroStory): the funnel, pipeline,
 * AI agent and résumé document are the page's four navigation links. The identity
 * block is one real h1 (name + role) shared by both compositions — in flow
 * above the scene on phones/tablets, laid into the scene's empty top-left
 * on desktop. Sizes there use cqw so it scales with the scene.
 */
export function Hero({
  identity,
  visual,
  milestones,
  resumeUrl,
}: {
  identity: Identity;
  visual: HeroVisualContent;
  milestones: Milestone[];
  resumeUrl: string;
}) {
  // Referrer bias: default (no/unknown referrer) only Marketing is vivid;
  // a LinkedIn referrer also lights Engineering — Marketing never dims.
  const engineeringLeaning = useReferrerBias() === "engineering-leaning";
  const shared = {
    c: visual,
    milestones,
    resumeUrl,
    resumeFileName: `${identity.name.replace(/\s+/g, "-")}-Resume.pdf`,
    engineeringLeaning,
  };

  return (
    <section className="relative overflow-hidden border-b border-beige-border/70 bg-cream pt-4 pb-6 sm:pt-12 sm:pb-16 lg:pt-14 lg:pb-16">
      <Container>
        <div className="relative mx-auto max-w-[520px] [container-type:inline-size] lg:max-w-none">
          <div className="relative z-10 lg:absolute lg:top-0 lg:left-0 lg:w-[46%]">
            <h1 className="font-heading text-charcoal">
              <span className="block text-[8.6cqw] leading-[1.05] font-bold tracking-tight lg:text-[5.2cqw]">
                {identity.name}
              </span>
              <span className="sr-only"> — </span>
              <span className="mt-[1.6cqw] block font-body text-[3cqw] font-semibold tracking-[0.2em] text-terracotta uppercase lg:mt-[1cqw] lg:text-[1.05cqw]">
                {identity.role}
              </span>
            </h1>
            <p className="mt-[1.6cqw] font-heading text-[4.4cqw] text-warm-grey italic lg:mt-[1.1cqw] lg:text-[1.9cqw]">
              {identity.tagline}
            </p>
          </div>

          <div className="mt-[4cqw] lg:hidden">
            <HeroStory variant="mobile" {...shared} />
          </div>
          <div className="hidden lg:block">
            <HeroStory variant="desktop" {...shared} />
          </div>
        </div>
      </Container>
    </section>
  );
}
