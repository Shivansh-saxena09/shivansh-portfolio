"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experienceTimeline } from "@/content/about";
import { skillLabel } from "@/content/skills";
import { Tag } from "@/components/ui/Tag";
import { TimelineChallenge } from "./TimelineChallenge";

gsap.registerPlugin(ScrollTrigger);

/**
 * Experience timeline. Below lg: single left-aligned line + cards, each
 * with its "Quick Take" challenge folded inline (no room for a separate
 * column on a narrow screen). At lg+: a real 3-column grid (card / gutter
 * / card) — entries alternate sides of a centered line, and the space
 * opposite each card holds that entry's interactive challenge instead of
 * sitting empty. See TimelineChallenge.tsx for the mechanic itself.
 *
 * Each card's fade/slide-in-on-scroll reveal (GSAP ScrollTrigger, synced
 * to the global Lenis scroll, fires once) is unchanged from earlier
 * passes. Challenges get their own separate reveal, queried via a
 * distinct class so it can't interfere with anything indexed off
 * .timeline-item.
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

      // A deliberately different, bouncier entrance than the timeline
      // cards' clean fade+slide (power2.out) — a small overshoot-and-
      // settle pop reads as "playful" the instant it moves, before a
      // visitor even reads the card, reinforcing the visual distinction.
      gsap.utils.toArray<HTMLElement>(".timeline-challenge").forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          scale: 0.85,
          rotate: -4,
          duration: 0.7,
          ease: "back.out(1.6)",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative lg:grid lg:grid-cols-[1fr_minmax(200px,240px)_1fr] lg:gap-x-10"
    >
      {/* Connecting line — a subtle terracotta→sage gradient, the same
          direction as the scroll-progress bar and footer accent. */}
      <div
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-2 w-px bg-beige-border lg:left-1/2 lg:-translate-x-1/2 lg:bg-gradient-to-b lg:from-terracotta lg:via-beige-border lg:to-sage"
      />

      {experienceTimeline.map((entry, i) => {
        const onLeft = i % 2 === 0;
        return (
          <div
            key={`${entry.org}-${entry.range}`}
            className="timeline-item relative mb-10 last:mb-0 lg:mb-6"
            style={{ gridColumn: onLeft ? 1 : 3, gridRow: i + 1 }}
          >
            {/* Node dot: only meaningful below lg, where there's a single
                line at a fixed offset to align to — see prior commits for
                why a per-card dot can't land on the shared center line at
                lg+ without knowing the gutter's exact pixel width. */}
            <span
              aria-hidden="true"
              className={`absolute top-1.5 left-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 lg:hidden ${
                entry.current ? "border-terracotta bg-terracotta" : "border-terracotta bg-cream"
              }`}
            />

            <div className={`pl-9 sm:pl-10 lg:pl-0 ${onLeft ? "lg:pr-10" : "lg:pl-10"}`}>
              <div className="rounded-2xl border border-beige-border bg-ivory p-6 shadow-[0_1px_3px_rgba(43,38,34,0.05)] sm:p-7">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-body text-xs font-semibold tracking-[0.15em] text-terracotta uppercase">
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

                {/* Mobile/tablet fallback — same challenge, folded into
                    the card it belongs to since there's no opposite-side
                    column to place it in below lg. */}
                <div className="mt-5 lg:hidden">
                  <TimelineChallenge challenge={entry.challenge} />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* The space opposite each card at lg+ — an interactive "Quick
          Take" challenge instead of empty gutter space. */}
      {experienceTimeline.map((entry, i) => {
        const onLeft = i % 2 === 0;
        return (
          <div
            key={`challenge-${entry.org}-${entry.range}`}
            className="timeline-challenge hidden lg:flex lg:items-center"
            style={{ gridColumn: onLeft ? 3 : 1, gridRow: i + 1 }}
          >
            <TimelineChallenge challenge={entry.challenge} />
          </div>
        );
      })}
    </div>
  );
}
