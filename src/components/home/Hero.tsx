"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Skill } from "@/lib/data/skills";
import { useReferrerBias } from "@/lib/useReferrerBias";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Tag } from "@/components/ui/Tag";
import { DestinationCard, ChartIcon, CodeIcon } from "@/components/ui/DestinationCard";

/**
 * Splits text into word spans for a GSAP stagger reveal. `accent` marks one
 * word (matched exactly, punctuation included) for the editorial
 * terracotta-italic treatment — same span structure either way, so the
 * reveal animation targets `.split-word` uniformly regardless of styling.
 */
function splitWords(text: string, accent?: string) {
  return text.split(" ").map((word, i) => (
    <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
      <span className={`split-word inline-block ${word === accent ? "italic text-terracotta" : ""}`}>
        {word}&nbsp;
      </span>
    </span>
  ));
}

type HeroCopy = { eyebrow: string; heading: string; subheading: string };

export function Hero({ heroCopy, focusSkills }: { heroCopy: HeroCopy; focusSkills: Skill[] }) {
  const bias = useReferrerBias();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".split-word", {
        y: "110%",
        duration: 0.9,
        stagger: 0.06,
        ease: "power4.out",
        delay: 0.2,
      });
      gsap.from(".hero-fade", {
        y: 16,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.8,
      });
    }, headingRef);

    return () => ctx.revert();
  }, []);

  // Default (no referrer, or unrecognized referrer): Marketing is the sole
  // primary CTA. LinkedIn referrer lightly evens the emphasis by making
  // Engineering equally weighted — Marketing never drops to secondary.
  const engineeringLeaning = bias === "engineering-leaning";

  return (
    <section className="relative overflow-hidden border-b border-beige-border/70 bg-cream pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pb-32">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-7">
            <p className="hero-fade font-body text-sm font-medium uppercase tracking-[0.2em] text-terracotta">
              {heroCopy.eyebrow}
            </p>

            <h1
              ref={headingRef}
              className="mt-6 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-charcoal sm:text-6xl lg:text-7xl"
            >
              {splitWords(heroCopy.heading, "pipeline.")}
            </h1>

            <p className="hero-fade mt-8 max-w-xl font-body text-lg leading-relaxed text-warm-grey sm:text-xl">
              {heroCopy.subheading}
            </p>

            {/* Desktop/tablet: the standard pill-button pair. Mobile gets
                its own richer treatment below — these two links are the
                entire job of the homepage on a phone, so they earn more
                than a bare button. */}
            <div className="hero-fade mt-10 hidden gap-4 sm:flex sm:items-center">
              <Button href="/marketing" variant="primary">
                View Marketing Work
              </Button>
              <Button href="/engineering" variant={engineeringLeaning ? "primary" : "secondary"}>
                View Engineering Work
              </Button>
            </div>

            <div className="hero-fade mt-10 flex flex-col gap-3 sm:hidden">
              <DestinationCard
                href="/marketing"
                icon={<ChartIcon className="h-5 w-5" />}
                label="View Marketing Work"
                description="Campaign case studies & real results"
                vivid
              />
              <DestinationCard
                href="/engineering"
                icon={<CodeIcon className="h-5 w-5" />}
                label="View Engineering Work"
                description="Full-stack systems & technical builds"
                vivid={engineeringLeaning}
              />
            </div>
          </div>

          {/* Floating card composition — fills the wide-screen right rail
              with real content (no fabricated stats) instead of leaving
              the hero feeling empty/centered on large viewports. */}
          <div className="hero-fade relative mt-16 lg:col-span-5 lg:mt-0">
            <div
              aria-hidden="true"
              className="absolute -right-6 -top-10 h-56 w-56 rounded-full bg-sage/25 blur-3xl sm:h-72 sm:w-72"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-8 left-6 h-40 w-40 rounded-full bg-terracotta/20 blur-3xl"
            />

            {/* Upright on mobile — a full-width tilted card on a narrow
                screen reads as a mistake, not an editorial flourish; the
                rotation only earns its keep once there's visible
                negative space around the card to show it's deliberate. */}
            <div className="glass-card paper-grain relative mx-auto max-w-sm rounded-2xl px-7 py-8 sm:px-8 lg:-rotate-2">
              <span className="relative z-10 font-body text-xs font-semibold uppercase tracking-[0.15em] text-warm-grey">
                Core Focus
              </span>
              <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                {focusSkills.map((skill) => (
                  <Tag key={skill.slug}>{skill.label}</Tag>
                ))}
              </div>
              <p className="relative z-10 mt-5 font-body text-sm leading-relaxed text-warm-grey">
                Also builds the tracking and reporting systems behind the campaigns.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
