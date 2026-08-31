import type { AdSet } from "@/content/caseStudies";
import { composeAdSetNarrative, formatINR, formatNumber, formatPct } from "@/lib/caseStudyNarrative";
import { StatTile } from "./StatTile";

export function AdSetSection({ adSet, showName }: { adSet: AdSet; showName: boolean }) {
  const { metrics, targeting, businessOutcome } = adSet;
  const ctrLink = metrics.impressions > 0 ? (metrics.linkClicks / metrics.impressions) * 100 : 0;
  const costPerLead = metrics.leads > 0 ? metrics.amountSpent / metrics.leads : 0;

  return (
    <div className="border-l-2 border-terracotta pl-6">
      {showName && <h3 className="font-heading text-xl text-charcoal">{adSet.name}</h3>}

      <p className="mt-2 font-body text-base leading-relaxed text-charcoal">
        {composeAdSetNarrative(adSet)}
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Reach" value={formatNumber(metrics.reach)} />
        <StatTile label="CPM" value={formatINR(metrics.cpm)} />
        <StatTile label="Link CTR" value={formatPct(ctrLink)} />
        <StatTile
          label="Cost / Lead"
          value={metrics.leads > 0 ? formatINR(costPerLead) : "—"}
        />
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
    </div>
  );
}
