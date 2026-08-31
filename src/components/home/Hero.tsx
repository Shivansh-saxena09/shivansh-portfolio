"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { heroCopy } from "@/content/site";
import { useReferrerBias } from "@/lib/useReferrerBias";
import { Button } from "@/components/ui/Button";

/** Splits text into word spans for a GSAP stagger reveal. */
function splitWords(text: string) {
  return text.split(" ").map((word, i) => (
    <span key={i} className="inline-block overflow-hidden pb-1 align-bottom">
      <span className="split-word inline-block">{word}&nbsp;</span>
    </span>
  ));
}

export function Hero() {
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
    <section className="relative overflow-hidden border-b border-beige-border/70 bg-cream px-6 pt-20 pb-24 sm:px-10 sm:pt-28 sm:pb-32">
      <div className="mx-auto max-w-4xl">
        <p className="hero-fade font-body text-sm font-medium uppercase tracking-[0.2em] text-terracotta">
          {heroCopy.eyebrow}
        </p>

        <h1
          ref={headingRef}
          className="mt-6 font-heading text-4xl leading-[1.1] tracking-tight text-charcoal sm:text-6xl"
        >
          {splitWords(heroCopy.heading)}
        </h1>

        <p className="hero-fade mt-8 max-w-2xl font-body text-lg leading-relaxed text-warm-grey sm:text-xl">
          {heroCopy.subheading}
        </p>

        <div className="hero-fade mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button href="/marketing" variant="primary">
            View Marketing Work
          </Button>
          <Button
            href="/engineering"
            variant={engineeringLeaning ? "primary" : "secondary"}
          >
            View Engineering Work
          </Button>
        </div>
      </div>
    </section>
  );
}
