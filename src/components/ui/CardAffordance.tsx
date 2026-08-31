"use client";

import { motion, type MotionValue } from "framer-motion";

/**
 * The two-layer "this card is clickable" signal, shared by CaseStudyCard
 * and ProjectPreviewCard: a cursor-follow badge for pointer devices, and
 * a persistent corner arrow for every device (including touch, where
 * hover never fires). See useCardCursorFollow for the mouse-tracking.
 */
export function CursorFollowBadge({
  label,
  hovered,
  x,
  y,
}: {
  label: string;
  hovered: boolean;
  x: MotionValue<number>;
  y: MotionValue<number>;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-charcoal px-4 py-2 font-body text-xs font-medium whitespace-nowrap text-cream sm:flex"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.85 }}
      transition={{ duration: 0.2 }}
    >
      {label}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
        <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

export function CornerArrow() {
  return (
    <span className="absolute right-6 bottom-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-charcoal transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-terracotta group-hover:text-ivory sm:right-7 sm:bottom-7">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
        <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}
