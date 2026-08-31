"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { experienceTimeline } from "@/content/about";
import { skillLabel } from "@/content/skills";
import { Tag } from "@/components/ui/Tag";

gsap.registerPlugin(ScrollTrigger);

/**
 * Experience timeline. Below lg: single left-aligned line + cards, each
 * with its "Marketing Concept" folded inline (easiest to read on a narrow
 * screen). At lg+: a real 3-column grid (card / gutter / card) — entries
 * alternate sides of a centered line, and the gutter isn't empty space —
 * it holds a sticky panel that swaps to a real marketing concept tied to
 * whichever role is currently centered in the viewport, tracked via a
 * second GSAP ScrollTrigger per item (matchMedia-gated to lg+, so mobile
 * never creates the extra triggers). The terms aren't generic glossary
 * filler: each is the concept that role's own description actually
 * involves (CAPI for the role that mentions it, CPL for the lead-gen
 * role, organic-vs-paid for the social-media internship).
 *
 * The existing fade/slide-in-on-scroll reveal (GSAP ScrollTrigger, synced
 * to the global Lenis scroll, fires once) is unchanged.
 */
export function Timeline() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".timeline-item");

      items.forEach((item) => {
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

      // Field-note annotations get their own reveal, queried separately
      // from .timeline-item so they can't shift the active-concept index
      // tracking below (which assumes items[i] === experienceTimeline[i]).
      gsap.utils.toArray<HTMLElement>(".timeline-fieldnote").forEach((note) => {
        gsap.from(note, {
          opacity: 0,
          y: 16,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: note,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      // Active-concept tracking only matters where the sticky gutter panel
      // is actually visible (lg+) — matchMedia keeps these triggers from
      // ever being created on mobile/tablet.
      ScrollTrigger.matchMedia({
        "(min-width: 1024px)": () => {
          items.forEach((item, i) => {
            ScrollTrigger.create({
              trigger: item,
              start: "top center",
              end: "bottom center",
              onToggle: (self) => {
                if (self.isActive) setActiveIndex(i);
              },
            });
          });
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const activeConcept = experienceTimeline[activeIndex].concept;

  return (
    <div
      ref={rootRef}
      className="relative lg:grid lg:grid-cols-[1fr_minmax(200px,240px)_1fr] lg:gap-x-10"
    >
      {/* Connecting line — a subtle terracotta→sage gradient, the same
          direction as the scroll-progress bar and footer accent, so the
          gutter feature reads as part of one consistent color system. */}
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
                line at a fixed offset to align to. At lg+, a per-card dot
                can't land correctly on the shared center line from inside
                a narrow grid column without knowing the gutter's exact
                pixel width — the sticky panel's own progress dots (below)
                serve as the desktop position indicator instead, which
                ends up more interesting anyway: a marker that travels with
                scroll, not static waypoints. */}
            <span
              aria-hidden="true"
              className={`absolute top-1.5 left-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 lg:hidden ${
                entry.current ? "border-terracotta bg-terracotta" : "border-terracotta bg-cream"
              }`}
            />

            <div className={`pl-9 sm:pl-10 lg:pl-0 ${onLeft ? "lg:pr-10" : "lg:pl-10"}`}>
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

                {/* Mobile/tablet fallback — same concept data, no sticky
                    mechanic, just folded into the card it belongs to. */}
                <div className="mt-5 rounded-xl bg-sage/10 px-4 py-3 lg:hidden">
                  <p className="font-body text-[11px] font-semibold tracking-[0.1em] text-sage-dark uppercase">
                    Marketing Concept — {entry.concept.term}
                  </p>
                  <p className="mt-1 font-body text-sm leading-relaxed text-charcoal">
                    {entry.concept.definition}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Field notes — the space directly opposite each card at lg+,
          previously empty. Deliberately NOT another bordered card: no
          fill, no terracotta/sage, a slight permanent tilt plus a slow
          drift (paused under reduced-motion) so it reads as a different
          register of content — a handwritten margin note, not more data.
          Each line is a first-person reflection tied to that specific
          role, distinct from the gutter panel's formal definitions. */}
      {experienceTimeline.map((entry, i) => {
        const onLeft = i % 2 === 0;
        return (
          <div
            key={`note-${entry.org}-${entry.range}`}
            className="hidden lg:flex lg:items-center lg:justify-center"
            style={{ gridColumn: onLeft ? 3 : 1, gridRow: i + 1 }}
          >
            <div className="timeline-fieldnote field-note-float rotate-[-1.5deg] max-w-[200px] px-4 text-center">
              <span aria-hidden="true" className="block font-heading text-6xl leading-none text-beige-border select-none">
                “
              </span>
              <p className="-mt-5 font-heading text-lg leading-snug text-charcoal italic">
                {entry.fieldNote}
              </p>
              <span className="mt-3 block font-body text-[10px] font-semibold tracking-[0.2em] text-warm-grey uppercase">
                Field Note
              </span>
            </div>
          </div>
        );
      })}

      {/* Sticky gutter panel — desktop only, spans the full height of the
          timeline grid so it can travel with the scroll and swap content
          as each role becomes the one centered in view. */}
      <div
        className="hidden lg:block"
        style={{ gridColumn: 2, gridRow: `1 / span ${experienceTimeline.length}` }}
      >
        <div className="sticky top-32">
          <div className="glass-card paper-grain relative mx-auto w-full max-w-[240px] rounded-2xl px-6 py-7 text-center shadow-xl">
            <span className="relative z-10 font-body text-[10px] font-semibold tracking-[0.2em] text-warm-grey uppercase">
              Marketing Concept
            </span>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="relative z-10 mt-3 font-heading text-2xl font-bold text-terracotta">
                  {activeConcept.term}
                </p>
                <p className="relative z-10 mt-3 font-body text-sm leading-relaxed text-charcoal">
                  {activeConcept.definition}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="relative z-10 mt-6 flex items-center justify-center gap-2">
              {experienceTimeline.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "w-6 bg-terracotta" : "w-1.5 bg-beige-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
