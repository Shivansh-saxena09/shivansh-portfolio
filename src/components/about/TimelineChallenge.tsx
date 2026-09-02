"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { TimelineChallenge as TimelineChallengeData, TimelineIconName } from "@/lib/data/about";
import { timelineIcons } from "./TimelineIcons";

// Small, fixed burst of emoji particles for the "correct" reveal — no
// confetti library, just a handful of Framer Motion spans animating
// outward and fading. Re-triggers naturally each time the reveal panel
// remounts (AnimatePresence keys it by the selected option's id).
const CONFETTI = [
  { emoji: "🎉", dx: -42, dy: -34 },
  { emoji: "✨", dx: 34, dy: -40 },
  { emoji: "🎯", dx: -16, dy: -48 },
  { emoji: "⭐", dx: 44, dy: -18 },
  { emoji: "🎊", dx: 6, dy: -50 },
];

/**
 * A one-question "Quick Take" mini-challenge — the interactive centerpiece
 * of the /about timeline. Deliberately built as a "living" object, not a
 * flat recolored card: a slowly rotating conic-gradient border ring (see
 * .quick-take-border in globals.css), two drifting ambient glows, and a
 * pulsing badge — layered depth and motion, all paused under
 * prefers-reduced-motion. The `icon` prop repeats the paired timeline
 * card's own icon (small, muted) so the two visually rhyme as belonging
 * together — by role, not by date — on top of the connecting line (see
 * Timeline.tsx).
 *
 * No score, no lock-in: picking an answer reveals an explanation
 * immediately, and the visitor can freely switch between options to read
 * both explanations out of curiosity. See src/content/about.ts for the
 * data shape.
 */
export function TimelineChallenge({
  challenge,
  icon,
}: {
  challenge: TimelineChallengeData;
  /**
   * The same per-role icon shown on the paired timeline card (see
   * TimelineIcons.tsx) — repeated here, small and muted, so the two
   * cards visually rhyme by "which role this belongs to" rather than
   * "when": a date/status badge on an interactive quiz never made sense
   * (a challenge isn't a dated event), even though it looked tidy.
   */
  icon: TimelineIconName;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = challenge.options.find((o) => o.id === selectedId) ?? null;
  const Icon = timelineIcons[icon];

  return (
    <div className="quick-take-border rounded-tl-[32px] rounded-tr-xl rounded-br-[32px] rounded-bl-xl">
      <div className="relative overflow-hidden rounded-tl-[32px] rounded-tr-xl rounded-br-[32px] rounded-bl-xl bg-charcoal p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.3),0_24px_50px_-16px_rgba(181,98,58,0.4)]">
        {/* Drifting ambient glows — replace static blur circles with ones
            that slowly move, so the card reads as "alive" at rest, before
            any interaction. */}
        <div
          aria-hidden="true"
          className="quick-take-glow-a pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-terracotta/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="quick-take-glow-b pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-sage/25 blur-3xl"
        />

        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
              <span
                aria-hidden="true"
                className="motion-safe:animate-ping absolute inset-0 rounded-full bg-gradient-to-br from-terracotta to-sage opacity-60"
              />
              <span
                aria-hidden="true"
                className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-terracotta to-sage text-base"
              >
                🎯
              </span>
            </span>
            <div>
              <p className="font-body text-xs font-bold tracking-[0.2em] text-cream uppercase">
                Quick Take
              </p>
              <p className="font-body text-[11px] font-medium text-cream/60">
                Test yourself — pick one
              </p>
            </div>
          </div>

          {/* Same icon as the paired timeline card, small and muted —
              ties this challenge to that specific role without
              implying it's a dated/scheduled event the way a date
              badge would. */}
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream/10 text-cream/50"
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
        </div>

        <p className="relative z-10 mt-4 font-heading text-lg leading-snug text-cream">
          <span aria-hidden="true" className="mr-1.5">
            {challenge.emoji}
          </span>
          {challenge.question}
        </p>

        <div className="relative z-10 mt-4 flex flex-col gap-2">
          {challenge.options.map((option) => {
            const isSelected = option.id === selectedId;
            const revealCorrect = selectedId !== null && option.correct;
            const revealWrong = isSelected && !option.correct;

            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => setSelectedId(option.id)}
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                className={`rounded-xl border px-4 py-3 text-left font-body text-sm font-medium transition-colors duration-200 ${
                  revealCorrect
                    ? "border-sage bg-sage/20 text-sage"
                    : revealWrong
                      ? "border-terracotta bg-terracotta/20 text-terracotta"
                      : "border-cream/15 bg-cream/[0.06] text-cream hover:border-sage/60"
                }`}
              >
                {option.label}
                {revealCorrect && (
                  <span aria-hidden="true" className="ml-2">
                    ✅
                  </span>
                )}
                {revealWrong && (
                  <span aria-hidden="true" className="ml-2">
                    🤔
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              aria-live="polite"
              className="relative z-10 mt-4 rounded-xl bg-cream/10 px-4 py-3"
            >
              {selected.correct && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 flex justify-center gap-1"
                >
                  {CONFETTI.map((c, i) => (
                    <motion.span
                      key={i}
                      className="text-base"
                      initial={{ opacity: 1, x: 0, y: 0, scale: 0.6 }}
                      animate={{ opacity: 0, x: c.dx, y: c.dy, scale: 1.1 }}
                      transition={{ duration: 0.8, delay: i * 0.03, ease: "easeOut" }}
                    >
                      {c.emoji}
                    </motion.span>
                  ))}
                </div>
              )}

              <p className="font-body text-sm font-semibold text-cream">
                {selected.correct ? "Correct!" : "Not quite —"}
              </p>
              <p className="mt-1 font-body text-sm leading-relaxed text-cream/70">
                {selected.correct ? challenge.correctExplanation : challenge.incorrectExplanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
