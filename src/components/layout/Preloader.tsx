"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Branded preloader — the first thing every visitor sees, so it earns a
 * genuinely designed reveal rather than a generic spinner (CLAUDE.md →
 * Animations & Interactions). Built on Framer Motion + CSS/SVG only, per
 * explicit instruction — no video/Lottie, so it costs the page nothing
 * beyond markup and a couple of small keyframe rules.
 *
 * Deliberately two different compositions below `sm:` vs above it, not
 * one layout scaled down:
 *  - Desktop has the room to be spacious: the name as two stacked full
 *    lines, an eyebrow tagline underneath, a drawn gradient rule, and a
 *    pair of slow-drifting ambient glows (the same motif Hero/About/
 *    Engineering/the nav drawer already use) filling the wider canvas.
 *  - Mobile is deliberately simpler and more compact: a small stroke-
 *    drawn monogram "seal" (echoing the avatar-circle used in the
 *    header/footer/drawer) stamps in first, then the name reveals below
 *    it as a single line — a narrow, thumb-width vertical composition
 *    with two elements instead of desktop's five, not a shrunk copy.
 *
 * Both compositions share one technique for the name itself: an outline
 * layer (hollow, light stroke) sits static from the start, while a
 * terracotta→sage gradient-fill layer is revealed on top of it via an
 * animated clip-path — the color genuinely "fills in" the letterforms,
 * rather than the gradient being decoration bolted onto a plain fade.
 *
 * Timing is a fixed, scripted sequence rather than tied to real network/
 * hydration readiness (matching the previous implementation) — a
 * branded preloader is a deliberate brand beat, not a progress
 * indicator, and Next.js's pre-rendered pages load fast enough that a
 * short fixed reveal reads as intentional rather than as stalling.
 * Total runtime (reveal + hold + exit) is ~1.7s on both breakpoints,
 * comfortably inside the 1–2s ceiling.
 */

const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;
const HOLD_UNTIL_MS = 1300;
const EXIT_TRANSITION = { duration: 0.4, ease: EASE_PREMIUM };

export function Preloader({
  personName,
  personTagline,
}: {
  personName: string;
  personTagline: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setTimeout(() => setDone(true), HOLD_UNTIL_MS);
    return () => clearTimeout(id);
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  const words = personName.trim().split(/\s+/);
  const initial = personName.charAt(0);
  // "Performance Marketing Manager. Full-stack builder." reads better as
  // a tracked-caps eyebrow line with a middot than with its sentence
  // punctuation carried straight through.
  const eyebrow = personTagline.replace(/\.\s+/g, " · ").replace(/\.\s*$/, "");

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          data-preloader
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-charcoal"
          exit={{ opacity: 0, y: -24, scale: 0.98 }}
          transition={EXIT_TRANSITION}
        >
          {/* Ambient glows — desktop only. Same drift keyframes the
              Hero/About/Engineering/nav-drawer glows already use, so a
              visitor's very first frame already feels like this site's
              visual system, not a one-off intro screen. */}
          <div aria-hidden="true" className="hidden sm:block">
            <div className="quick-take-glow-a pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-[150%] -translate-y-1/2 rounded-full bg-terracotta/20 blur-3xl" />
            <div className="quick-take-glow-b pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 translate-x-[50%] -translate-y-1/3 rounded-full bg-sage/20 blur-3xl" />
          </div>

          {/* ---------------------------------------------------------- */}
          {/* Desktop — spacious: two stacked lines, a drawn rule, an     */}
          {/* eyebrow tagline.                                            */}
          {/* ---------------------------------------------------------- */}
          <div className="relative z-10 hidden flex-col items-center gap-6 sm:flex">
            <div className="flex flex-col items-center">
              {words.map((word, i) => (
                <div key={word} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    transition={{ delay: 0.05 + i * 0.11, duration: 0.5, ease: EASE_PREMIUM }}
                    className="relative"
                  >
                    <span
                      aria-hidden="true"
                      className="preloader-wordmark-outline block font-heading text-6xl leading-[1.05] font-bold lg:text-7xl"
                    >
                      {word}
                    </span>
                    <motion.span
                      initial={{ clipPath: "inset(0 100% 0 0)" }}
                      animate={{ clipPath: "inset(0 0% 0 0)" }}
                      transition={{ delay: 0.35, duration: 0.6, ease: EASE_PREMIUM }}
                      className="preloader-wordmark-fill absolute inset-0 block font-heading text-6xl leading-[1.05] font-bold lg:text-7xl"
                    >
                      {word}
                    </motion.span>
                  </motion.div>
                </div>
              ))}
            </div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.55, duration: 0.4, ease: EASE_PREMIUM }}
              className="h-[2px] w-24 origin-center bg-gradient-to-r from-terracotta to-sage"
            />

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.4, ease: EASE_PREMIUM }}
              className="font-body text-xs font-medium tracking-[0.3em] text-warm-grey uppercase"
            >
              {eyebrow}
            </motion.p>
          </div>

          {/* ---------------------------------------------------------- */}
          {/* Mobile — compact: a stroke-drawn monogram seal stamps in,   */}
          {/* then the name reveals as a single line beneath it. No      */}
          {/* ambient glows, no tagline — two elements, not five, in a    */}
          {/* narrow thumb-width column.                                 */}
          {/* ---------------------------------------------------------- */}
          <div className="relative z-10 flex flex-col items-center gap-5 sm:hidden">
            <div className="relative flex h-16 w-16 items-center justify-center">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
                <defs>
                  <linearGradient id="preloader-seal-gradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--color-terracotta)" />
                    <stop offset="100%" stopColor="var(--color-sage)" />
                  </linearGradient>
                </defs>
                <motion.circle
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="url(#preloader-seal-gradient)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0, duration: 0.45, ease: EASE_PREMIUM }}
                />
              </svg>
              <motion.span
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: [0.7, 1, 1.08, 1] }}
                transition={{ delay: 0.3, duration: 0.5, times: [0, 0.5, 0.8, 1], ease: EASE_PREMIUM }}
                className="font-heading text-2xl font-bold text-cream"
              >
                {initial}
              </motion.span>
            </div>

            <div className="overflow-hidden">
              <motion.div
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.4, ease: EASE_PREMIUM }}
                className="relative"
              >
                <span
                  aria-hidden="true"
                  className="preloader-wordmark-outline block font-heading text-2xl font-bold whitespace-nowrap"
                >
                  {personName}
                </span>
                <motion.span
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{ delay: 0.7, duration: 0.45, ease: EASE_PREMIUM }}
                  className="preloader-wordmark-fill absolute inset-0 block font-heading text-2xl font-bold whitespace-nowrap"
                >
                  {personName}
                </motion.span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
