import type { AdSet } from "@/content/caseStudies";
import { formatINR, formatNumber, formatPct } from "@/lib/caseStudyNarrative";

/**
 * Plain server-rendered table — no tab-switcher JS. A static comparison
 * table is both instantly scannable and costs zero client-side JS,
 * which matters for a page that should feel instant on load.
 */
export function AdSetComparisonTable({ adSets }: { adSets: AdSet[] }) {
  const rows: { label: string; values: (adSet: AdSet) => string }[] = [
    { label: "Audience type", values: (a) => a.targeting.audienceType },
    { label: "Reach", values: (a) => formatNumber(a.metrics.reach) },
    { label: "CPM", values: (a) => formatINR(a.metrics.cpm) },
    {
      label: "Link CTR",
      values: (a) =>
        formatPct(a.metrics.impressions > 0 ? (a.metrics.linkClicks / a.metrics.impressions) * 100 : 0),
    },
    { label: "Leads", values: (a) => formatNumber(a.metrics.leads) },
    {
      label: "Cost / Lead",
      values: (a) => (a.metrics.leads > 0 ? formatINR(a.metrics.amountSpent / a.metrics.leads) : "—"),
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-beige-border">
      <table className="w-full min-w-[480px] border-collapse font-body text-sm">
        <thead>
          <tr className="bg-ivory">
            <th className="px-4 py-3 text-left font-medium text-warm-grey">Ad Set</th>
            {adSets.map((adSet) => (
              <th key={adSet.name} className="px-4 py-3 text-left font-medium text-charcoal">
                {adSet.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-beige-border">
              <th className="px-4 py-3 text-left font-medium text-warm-grey">{row.label}</th>
              {adSets.map((adSet) => (
                <td key={adSet.name} className="px-4 py-3 text-charcoal">
                  {row.values(adSet)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
