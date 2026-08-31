"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experienceTimeline } from "@/content/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * Vertical experience timeline. Each entry fades/slides in as it scrolls
 * into view (GSAP ScrollTrigger, consistent with the rest of the site;
 * synced to the global Lenis scroll already wired up in
 * SmoothScrollProvider). `toggleActions: "play none none none"` fires the
 * reveal once and never reverses it — a one-time entrance, not a
 * scroll-position-linked effect, so scrolling back up doesn't re-trigger
 * or flicker anything.
 */
export function Timeline() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".timeline-item").forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: 28,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <div className="absolute top-2 bottom-2 left-2 w-px bg-beige-border" aria-hidden="true" />

      <div className="flex flex-col gap-8">
        {experienceTimeline.map((entry) => (
          <div key={`${entry.org}-${entry.range}`} className="timeline-item relative pl-9 sm:pl-12">
            <span
              aria-hidden="true"
              className={`absolute top-1.5 left-0 h-4 w-4 rounded-full border-2 ${
                entry.current ? "border-terracotta bg-terracotta" : "border-terracotta bg-cream"
              }`}
            />

            <div className="rounded-2xl border border-beige-border bg-ivory p-6 shadow-[0_1px_3px_rgba(43,38,34,0.05)] sm:p-7">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-terracotta">
                  {entry.range}
                </span>
                {entry.current && (
                  <span className="rounded-full bg-sage/15 px-2.5 py-0.5 font-body text-xs font-semibold text-sage-dark">
                    Current
                  </span>
                )}
              </div>

              <h3 className="mt-3 font-heading text-xl text-charcoal sm:text-2xl">{entry.role}</h3>
              <p className="mt-1 font-body text-sm font-medium text-warm-grey">
                {entry.org}
                {entry.location ? ` · ${entry.location}` : ""}
              </p>
              <p className="mt-4 font-body text-base leading-relaxed text-charcoal">
                {entry.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
