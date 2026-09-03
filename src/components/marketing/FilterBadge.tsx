"use client";

import { useSearchParams } from "next/navigation";
import type { Skill } from "@/lib/data/skills";
import { Tag } from "@/components/ui/Tag";

/**
 * "Filtered by: X · Clear filter" badge, read client-side from the URL's
 * ?skill= param — pulled out of the page's server render so the page
 * itself never has to `await searchParams`, which is what was forcing
 * the whole /marketing route to render dynamically (server round-trip +
 * a live Supabase query) on every single visit, even the overwhelming
 * majority with no filter at all. See CaseStudyResults.tsx for the
 * matching fix on the grid itself.
 *
 * Wrapped in <Suspense fallback={null}> by the page — that's what lets
 * Next.js statically prerender everything else. The unfiltered common
 * case renders identically before and after hydration (nothing here),
 * so there's no flash; only a filtered/bookmarked link briefly shows no
 * badge for the instant before hydration resolves the real param.
 */
export function FilterBadge({ skills }: { skills: Skill[] }) {
  const searchParams = useSearchParams();
  const skillSlug = searchParams.get("skill");
  const activeSkill = skillSlug ? skills.find((s) => s.slug === skillSlug) : undefined;

  if (!activeSkill) return null;

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <span className="font-body text-sm text-warm-grey">Filtered by:</span>
      <Tag active>{activeSkill.label}</Tag>
      <a href="/marketing" className="nav-underline font-body text-sm text-terracotta">
        Clear filter
      </a>
    </div>
  );
}
