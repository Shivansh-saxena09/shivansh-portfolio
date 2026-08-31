"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experienceTimeline } from "@/content/about";
import { skillLabel } from "@/content/skills";
import { Tag } from "@/components/ui/Tag";

gsap.registerPlugin(ScrollTrigger);

/**
 * Experience timeline. Single left-aligned line + cards below lg (easiest
 * to read on a narrow screen); at lg+, the line moves to center and
 * entries alternate sides — a genuine desktop-specific composition
 * instead of the same narrow column just re-centered with more margin.
 *
 * Each entry fades/slides in as it scrolls into view (GSAP ScrollTrigger,
 * synced to the global Lenis scroll already wired up in
 * SmoothScrollProvider). `toggleActions: "play none none none"` fires the
 * reveal once and never reverses it — a one-time entrance, not a
 * scroll-position-linked effect.
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
      <div className="absolute top-2 bottom-2 left-2 w-px bg-beige-border lg:left-1/2 lg:-translate-x-1/2" />

      <div className="flex flex-col gap-10 lg:gap-6">
        {experienceTimeline.map((entry, i) => {
          const onLeft = i % 2 === 0;
          return (
            <div
              key={`${entry.org}-${entry.range}`}
              className="timeline-item relative lg:grid lg:grid-cols-2 lg:gap-x-16"
            >
              <span
                aria-hidden="true"
                className={`absolute top-1.5 left-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 lg:left-1/2 ${
                  entry.current ? "border-terracotta bg-terracotta" : "border-terracotta bg-cream"
                }`}
              />

              <div
                className={`pl-9 sm:pl-10 lg:pl-0 ${
                  onLeft ? "lg:col-start-1 lg:pr-16" : "lg:col-start-2 lg:pl-16"
                }`}
              >
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

                  <h3 className="mt-3 font-heading text-xl text-charcoal sm:text-2xl">
                    {entry.role}
                  </h3>
                  <p className="mt-1 font-body text-sm font-medium text-warm-grey">
                    {entry.org}
                    {entry.location ? ` · ${entry.location}` : ""}
                  </p>
                  <p className="mt-4 font-body text-base leading-relaxed text-charcoal">
                    {entry.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {entry.skills.map((slug) => (
                      <Tag key={slug}>{skillLabel(slug)}</Tag>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
