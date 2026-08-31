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
 * of the /about timeline. No score, no lock-in: picking an answer reveals
 * an explanation immediately, and the visitor can freely switch between
 * options to read both explanations out of curiosity. Kept deliberately
 * tiny in scope (one question, one tap, done) so it never slows down
 * someone just scrolling through — see src/content/about.ts for the data
 * shape this reads from.
 */
export function TimelineChallenge({ challenge }: { challenge: TimelineChallengeData }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = challenge.options.find((o) => o.id === selectedId) ?? null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-beige-border bg-gradient-to-br from-terracotta/[0.06] via-ivory to-sage/[0.08] p-6">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="text-base">
          🎯
        </span>
        <span className="font-body text-[10px] font-semibold tracking-[0.2em] text-warm-grey uppercase">
          Quick Take
        </span>
      </div>

      <p className="mt-3 font-heading text-lg leading-snug text-charcoal">
        <span aria-hidden="true" className="mr-1.5">
          {challenge.emoji}
        </span>
        {challenge.question}
      </p>

      <div className="mt-4 flex flex-col gap-2">
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
                  ? "border-sage bg-sage/15 text-sage-dark"
                  : revealWrong
                    ? "border-terracotta bg-terracotta/10 text-terracotta-dark"
                    : "border-beige-border bg-ivory text-charcoal hover:border-sage"
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
            className="relative mt-4 rounded-xl bg-cream/70 px-4 py-3"
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

            <p className="font-body text-sm font-semibold text-charcoal">
              {selected.correct ? "Correct!" : "Not quite —"}
            </p>
            <p className="mt-1 font-body text-sm leading-relaxed text-warm-grey">
              {selected.correct ? challenge.correctExplanation : challenge.incorrectExplanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
