"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { TimelineChallenge as TimelineChallengeData } from "@/content/about";

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
 * of the /about timeline. Deliberately styled as far from the timeline's
 * cards as the palette allows (dark charcoal instead of ivory, dashed
 * accent border, asymmetric "sticker" corners, a bouncy pop-in instead of
 * a fade) — a visitor should never mistake this for more career history.
 * No score, no lock-in: picking an answer reveals an explanation
 * immediately, and switching between options re-reveals freely so anyone
 * curious can read both. See src/content/about.ts for the data shape.
 */
export function TimelineChallenge({ challenge }: { challenge: TimelineChallengeData }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = challenge.options.find((o) => o.id === selectedId) ?? null;

  return (
    <div className="timeline-challenge-card relative overflow-hidden rounded-tl-[32px] rounded-tr-xl rounded-br-[32px] rounded-bl-xl border-2 border-dashed border-terracotta/60 bg-charcoal p-6 shadow-[0_24px_50px_-16px_rgba(181,98,58,0.4)]">
      {/* Warm glow washes, not a flat black box — keeps it feeling premium
          rather than like an unrelated dark-mode widget dropped on the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-terracotta/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-sage/25 blur-3xl"
      />

      <div className="relative z-10 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-terracotta to-sage text-base"
        >
          🎯
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
  );
}
