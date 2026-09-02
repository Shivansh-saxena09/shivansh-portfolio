"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Branded preloader — a brief logo/wordmark reveal before site content
 * shows (CLAUDE.md → Animations & Interactions). Runs once per page load.
 */
export function Preloader({ personName }: { personName: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setDone(true),
      });

      tl.set(rootRef.current, { autoAlpha: 1 })
        .from(".preloader-char", {
          y: "100%",
          duration: 0.6,
          stagger: 0.03,
          ease: "power3.out",
        })
        .to(".preloader-char", {
          y: "-100%",
          duration: 0.4,
          stagger: 0.02,
          ease: "power3.in",
          delay: 0.25,
        })
        .to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  if (done || prefersReducedMotion) return null;

  const chars = personName.split("");

  return (
    <div
      ref={rootRef}
      data-preloader
      className="invisible fixed inset-0 z-[100] flex items-center justify-center bg-charcoal"
      aria-hidden="true"
    >
      <div className="overflow-hidden font-heading text-2xl tracking-wide text-cream sm:text-4xl">
        <span className="inline-flex">
          {chars.map((char, i) => (
            <span key={i} className="preloader-char inline-block">
              {char === " " ? " " : char}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
