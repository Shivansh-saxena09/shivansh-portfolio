"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { CaseStudyDetail } from "@/lib/data/caseStudies";
import { CaseStudyCard } from "./CaseStudyCard";

/**
 * Presentational grid — no data dependency of its own, safe to use both
 * as the static fallback (all case studies, the common no-filter case)
 * and as the post-hydration filtered result.
 */
function Grid({ caseStudies }: { caseStudies: CaseStudyDetail[] }) {
  if (caseStudies.length === 0) {
    return <p className="font-body text-warm-grey">No case studies tagged with this skill yet.</p>;
  }

  return (
    <>
      {/* Mobile: a swipeable, snap-to-card carousel (one card at a
          time, next card peeking at the edge) rather than a long
          vertical stack of five near-identical cards — the
          textbook case for a horizontal pattern on a small screen.
          Desktop: unchanged responsive grid. Pure CSS scroll-snap,
          no JS/library cost. */}
      <p className="mb-4 font-body text-xs font-medium text-warm-grey sm:hidden">Swipe to explore →</p>
      <div className="relative sm:contents">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-cream to-transparent sm:hidden"
        />
        <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
          {caseStudies.map((caseStudy) => (
            <div key={caseStudy.slug} className="w-[82vw] shrink-0 snap-start sm:w-auto sm:shrink">
              <CaseStudyCard caseStudy={caseStudy} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/** Reads ?skill= client-side and filters the already-loaded (server-
 *  fetched, statically embedded) full list in memory — no extra fetch,
 *  no server round-trip, just a JS array filter. */
function FilteredGrid({ caseStudies }: { caseStudies: CaseStudyDetail[] }) {
  const searchParams = useSearchParams();
  const skillSlug = searchParams.get("skill");
  const filtered = skillSlug ? caseStudies.filter((c) => c.skills.some((s) => s.slug === skillSlug)) : caseStudies;
  return <Grid caseStudies={filtered} />;
}

/**
 * See FilterBadge.tsx for the full rationale — same technique here: the
 * Suspense fallback (required by useSearchParams for static rendering)
 * IS the full unfiltered grid, so the statically-generated HTML already
 * shows the correct result for every visitor without a ?skill= param,
 * with nothing to hydrate-and-swap. Only a filtered link pays a brief,
 * client-only re-filter after hydration.
 */
export function CaseStudyResults({ caseStudies }: { caseStudies: CaseStudyDetail[] }) {
  return (
    <Suspense fallback={<Grid caseStudies={caseStudies} />}>
      <FilteredGrid caseStudies={caseStudies} />
    </Suspense>
  );
}
