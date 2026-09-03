import type { AdSet } from "@/lib/data/caseStudies";
import { composeAdSetNarrative, formatINR, formatNumber, formatPct } from "@/lib/caseStudyNarrative";
import { highlightStats } from "@/lib/highlightStats";
import { StatTile } from "./StatTile";
import { ChevronIcon } from "./StoryIcons";

function shortHeadline(adSet: AdSet): string {
  const { metrics } = adSet;
  if (metrics.leads > 0) {
    return `${formatNumber(metrics.leads)} leads at ${formatINR(metrics.amountSpent / metrics.leads)}/lead`;
  }
  return `${formatINR(metrics.amountSpent)} spent`;
}

function AdSetBody({ adSet }: { adSet: AdSet }) {
  const { metrics, targeting, businessOutcome } = adSet;
  const ctrLink = metrics.impressions > 0 ? (metrics.linkClicks / metrics.impressions) * 100 : 0;
  const costPerLead = metrics.leads > 0 ? metrics.amountSpent / metrics.leads : 0;

  return (
    <>
      <p className="font-body text-base leading-relaxed text-charcoal">
        {highlightStats(composeAdSetNarrative(adSet), adSet.name)}
      </p>

      {/* Fixed 2x2 rather than a wider breakpoint-based grid — these
          cards can sit side-by-side in a narrower half-width column once
          there's more than one ad set (see the case-study page's Results
          section), and a viewport-based sm:grid-cols-4 would cram four
          tiles into that narrower space regardless of how wide the
          browser window itself is. */}
      {/* compact sizing — these cards can end up half-width once two ad
          sets sit side-by-side, and the larger (non-compact) scale
          genuinely doesn't fit a value like "6,20,000" in that narrower
          space (confirmed via screenshot: it was clipping mid-digit). */}
      <dl className="mt-5 grid grid-cols-2 gap-3">
        <StatTile compact label="Reach" value={formatNumber(metrics.reach)} />
        <StatTile compact label="CPM" value={formatINR(metrics.cpm)} />
        <StatTile compact label="Link CTR" value={formatPct(ctrLink)} />
        <StatTile compact label="Cost / Lead" value={metrics.leads > 0 ? formatINR(costPerLead) : "—"} />
      </dl>

      <p className="mt-4 font-body text-sm text-warm-grey">
        <span className="font-medium text-charcoal">Targeting:</span> {targeting.locations} ·{" "}
        {targeting.ageGender} · {targeting.placements}
        {targeting.audienceSizeEstimate ? ` · est. audience ${targeting.audienceSizeEstimate}` : ""}
      </p>

      {businessOutcome && (businessOutcome.qualifiedLeads || businessOutcome.siteVisits || businessOutcome.bookings) ? (
        <p className="mt-2 font-body text-sm text-sage-dark">
          {businessOutcome.qualifiedLeads ? `${businessOutcome.qualifiedLeads} qualified by sales` : ""}
          {businessOutcome.siteVisits ? ` · ${businessOutcome.siteVisits} site visits` : ""}
          {businessOutcome.bookings ? ` · ${businessOutcome.bookings} bookings` : ""}
        </p>
      ) : null}
    </>
  );
}

/**
 * One ad set's full breakdown, as a card rather than the old plain
 * left-border strip — gives it the same "boxed" visual grouping as
 * every other content block on the page, so the page reads as a set of
 * consistent sections instead of ad-hoc treatments.
 *
 * `collapsible` (true whenever a case study has more than one ad set)
 * wraps the metrics/targeting detail in a native <details> — the
 * always-visible comparison table above already answers "which ad set
 * won," so the deep per-ad-set numbers are progressive disclosure, not
 * the first thing a scanning visitor needs. A single-ad-set case study
 * has nothing to compare against, so it renders fully open with no
 * accordion chrome at all.
 */
export function AdSetSection({
  adSet,
  showName,
  collapsible,
  defaultOpen = false,
}: {
  adSet: AdSet;
  showName: boolean;
  collapsible: boolean;
  defaultOpen?: boolean;
}) {
  if (!collapsible) {
    return (
      <div className="rounded-2xl border border-beige-border bg-ivory p-6">
        {showName && <h3 className="font-heading text-xl text-charcoal">{adSet.name}</h3>}
        <div className={showName ? "mt-2" : ""}>
          <AdSetBody adSet={adSet} />
        </div>
      </div>
    );
  }

  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-beige-border bg-ivory open:shadow-[0_1px_2px_rgba(43,38,34,0.04),0_16px_32px_-14px_rgba(43,38,34,0.1)]"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 [&::-webkit-details-marker]:hidden">
        <div>
          <h3 className="font-heading text-xl text-charcoal">{adSet.name}</h3>
          <p className="mt-1 font-body text-sm font-medium text-sage-dark">{shortHeadline(adSet)}</p>
        </div>
        <ChevronIcon className="h-5 w-5 shrink-0 text-warm-grey transition-transform duration-300 group-open:rotate-180" />
      </summary>
      <div className="border-t border-beige-border/70 px-6 pt-5 pb-6">
        <AdSetBody adSet={adSet} />
      </div>
    </details>
  );
}
