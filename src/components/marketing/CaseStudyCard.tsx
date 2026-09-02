"use client";

import Link from "next/link";
import type { CaseStudyDetail } from "@/lib/data/caseStudies";
import { cardSummary } from "@/lib/caseStudyNarrative";
import { statHeadline } from "@/lib/highlightStats";
import { useCardCursorFollow } from "@/lib/useCardCursorFollow";
import { Tag } from "@/components/ui/Tag";
import { CursorFollowBadge, CornerArrow } from "@/components/ui/CardAffordance";

const categoryLabel: Record<CaseStudyDetail["category"], string> = {
  standard: "Campaign",
  learning: "Learning",
  "dual-skill-fusion": "Marketing × Engineering",
};

/**
 * Click affordance, two layers (CLAUDE.md's cards need to read as
 * clickable, not just decorative) — see src/components/ui/CardAffordance.tsx.
 */
export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudyDetail }) {
  const { oneLiner, resultHeadline } = cardSummary(caseStudy);
  const { hovered, springX, springY, cardHandlers } = useCardCursorFollow();

  return (
    <Link
      href={`/case-study/${caseStudy.slug}`}
      {...cardHandlers}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-beige-border bg-ivory p-6 pb-16 shadow-[0_1px_3px_rgba(43,38,34,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(43,38,34,0.22)] sm:p-7 sm:pb-16"
    >
      <CursorFollowBadge label="View Case Study" hovered={hovered} x={springX} y={springY} />

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
        {caseStudy.skills.slice(0, 3).map((skill) => (
          <Tag key={skill.slug}>{skill.label}</Tag>
        ))}
      </div>

      <CornerArrow />
    </Link>
  );
}
