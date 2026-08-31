import Link from "next/link";
import type { CaseStudy } from "@/content/caseStudies";
import { skillLabel } from "@/content/skills";
import { Tag } from "@/components/ui/Tag";

const categoryLabel: Record<CaseStudy["category"], string> = {
  standard: "Campaign",
  learning: "Learning",
  "dual-skill-fusion": "Marketing × Engineering",
};

export function CaseStudyCard({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <Link
      href={`/case-study/${caseStudy.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-beige-border bg-ivory p-7 shadow-sm transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-terracotta">
          {categoryLabel[caseStudy.category]}
        </span>
        <span className="font-body text-xs text-warm-grey">{caseStudy.status}</span>
      </div>

      <h3 className="font-heading text-2xl leading-snug text-charcoal transition-colors group-hover:text-terracotta-dark">
        {caseStudy.campaignName}
      </h3>

      <p className="font-body text-sm leading-relaxed text-warm-grey">{caseStudy.oneLiner}</p>

      <p className="font-body text-base font-medium text-sage-dark">{caseStudy.resultHeadline}</p>

      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        <Tag>{caseStudy.platform}</Tag>
        {caseStudy.skills.slice(0, 3).map((slug) => (
          <Tag key={slug}>{skillLabel(slug)}</Tag>
        ))}
      </div>
    </Link>
  );
}
