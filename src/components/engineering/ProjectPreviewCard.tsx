"use client";

import Link from "next/link";
import type { Project } from "@/content/projects";
import { useCardCursorFollow } from "@/lib/useCardCursorFollow";
import { Tag } from "@/components/ui/Tag";
import { CursorFollowBadge, CornerArrow } from "@/components/ui/CardAffordance";

/**
 * Preview card linking to the full project detail page, matching the
 * case-study card's pattern (list/preview on the hub page, full
 * narrative on its own route) rather than dumping everything inline on
 * /engineering.
 */
export function ProjectPreviewCard({ project }: { project: Project }) {
  const { hovered, springX, springY, cardHandlers } = useCardCursorFollow();

  return (
    <Link
      href={`/project/${project.slug}`}
      {...cardHandlers}
      className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-beige-border bg-ivory p-6 pb-16 shadow-[0_1px_3px_rgba(43,38,34,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(43,38,34,0.22)] sm:p-8 sm:pb-16"
    >
      <CursorFollowBadge label="View Project" hovered={hovered} x={springX} y={springY} />

      <div className="flex items-center justify-between gap-3">
        <span className="font-body text-xs font-semibold tracking-[0.15em] text-sage-dark uppercase">
          Featured Project
        </span>
        <span className="font-body text-xs text-warm-grey">{project.status}</span>
      </div>

      <h3 className="font-heading text-3xl font-bold text-charcoal transition-colors group-hover:text-sage-dark">
        {project.name}
      </h3>

      <p className="max-w-xl font-body text-base text-warm-grey">{project.tagline}</p>

      <p className="font-body text-base font-semibold text-terracotta">
        {project.challenges.length} real technical challenges solved
      </p>

      <div className="mt-auto flex flex-wrap gap-2 pt-2 pr-12">
        {project.stack.map((tech) => (
          <Tag key={tech}>{tech}</Tag>
        ))}
      </div>

      <CornerArrow />
    </Link>
  );
}
