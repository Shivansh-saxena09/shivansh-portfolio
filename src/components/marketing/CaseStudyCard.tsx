"use client";

import { useState, type MouseEvent } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { CaseStudyDetail } from "@/content/caseStudies";
import { skillLabel } from "@/content/skills";
import { cardSummary } from "@/lib/caseStudyNarrative";
import { statHeadline } from "@/lib/highlightStats";
import { Tag } from "@/components/ui/Tag";

const categoryLabel: Record<CaseStudyDetail["category"], string> = {
  standard: "Campaign",
  learning: "Learning",
  "dual-skill-fusion": "Marketing × Engineering",
};

/**
 * Click affordance, two layers (CLAUDE.md's cards need to read as
 * clickable, not just decorative):
 * 1. A persistent corner arrow — visible on every device, including
 *    touch, where hover never fires.
 * 2. A cursor-following "View Case Study" badge on pointer devices
 *    (Framer Motion spring, already a project dependency) — an
 *    intentional, portfolio-appropriate signature interaction rather
 *    than a generic hover state.
 */
export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudyDetail }) {
  const { oneLiner, resultHeadline } = cardSummary(caseStudy);
  const [hovered, setHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30, mass: 0.5 });

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  return (
    <Link
      href={`/case-study/${caseStudy.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-beige-border bg-ivory p-6 pb-16 shadow-[0_1px_3px_rgba(43,38,34,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(43,38,34,0.22)] sm:p-7 sm:pb-16"
    >
      {/* Cursor-follow badge — pointer devices only (mouse events never
          fire from touch the same way, so this simply never appears there). */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute z-20 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 rounded-full bg-charcoal px-4 py-2 font-body text-xs font-medium whitespace-nowrap text-cream sm:flex"
        style={{ left: springX, top: springY }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.85 }}
        transition={{ duration: 0.2 }}
      >
        View Case Study
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
          <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <div className="flex items-center justify-between gap-3">
        <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-terracotta">
          {categoryLabel[caseStudy.category]}
        </span>
        <span className="font-body text-xs text-warm-grey">{caseStudy.status}</span>
      </div>

      <h3 className="font-heading text-2xl leading-snug text-charcoal transition-colors group-hover:text-terracotta-dark">
        {caseStudy.campaignName}
      </h3>

      <p className="font-body text-sm leading-relaxed text-warm-grey">{oneLiner}</p>

      <p className="font-body text-base font-semibold text-sage-dark">
        {statHeadline(resultHeadline, caseStudy.slug, "card")}
      </p>

      {/* Own row, right-padded so wrapped tags never run under the corner
          icon below — fixes an earlier bug where a wrapping flex row could
          push the icon to the bottom-LEFT instead of staying put. */}
      <div className="mt-auto flex flex-wrap gap-2 pt-2 pr-12">
        <Tag>{caseStudy.platform}</Tag>
        {caseStudy.skills.slice(0, 3).map((slug) => (
          <Tag key={slug}>{skillLabel(slug)}</Tag>
        ))}
      </div>

      {/* Persistent affordance — always visible (incl. touch, where hover
          never fires) — absolutely positioned so its corner placement
          can't be disturbed by however many tags wrapped above it. */}
      <span className="absolute right-6 bottom-6 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream text-charcoal transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-terracotta group-hover:text-ivory sm:right-7 sm:bottom-7">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
