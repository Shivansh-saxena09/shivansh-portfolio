import "@/components/marketing/marketing-motion.css";
import Link from "next/link";

export type RaceSet = { name: string; cpl: number; cplText: string; ctr: number; ctrText: string };

/**
 * Bar race of one case study's ad sets, straight from ad_sets (cost per lead =
 * spend ÷ leads, link CTR = link clicks ÷ impressions). The page only renders
 * this for a case study with 2+ ad sets that have leads; the winner of each
 * metric (lowest CPL, highest CTR) is sage. Labels: admin "Site motion labels".
 * No JS of its own: MotionRuntime grows the bars and counts the numbers on scroll.
 */
export function AdSetRace({ heading, labels, campaign, href, sets }: { heading: string; labels: [string, string]; campaign: string; href: string; sets: RaceSet[] }) {
  const groups = [
    { label: labels[0], max: Math.max(...sets.map((s) => s.cpl)), best: Math.min(...sets.map((s) => s.cpl)), get: (s: RaceSet) => [s.cpl, s.cplText] as const },
    { label: labels[1], max: Math.max(...sets.map((s) => s.ctr)), best: Math.max(...sets.map((s) => s.ctr)), get: (s: RaceSet) => [s.ctr, s.ctrText] as const },
  ];
  return (
    // @container: the card lays itself out by its OWN width (it sits in a 5/12 or 7/12 column on
    // desktop and full width on phones), not the viewport. Each ad set: full name on its own line
    // (wraps, never clipped), then bar + value on one row (bar flexes, value never shrinks).
    <div className="@container mo-reveal rounded-2xl border border-beige-border bg-ivory p-5 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="min-w-0 font-heading text-2xl break-words text-charcoal @md:text-3xl">{heading}</h2>
        <Link href={href} className="tap nav-underline min-w-0 font-body text-sm break-words text-terracotta">
          {campaign} →
        </Link>
      </div>
      <div className="mt-6 grid gap-8 @xl:grid-cols-2">
        {groups.map((g) => (
          <div key={g.label} className="min-w-0">
            <p className="font-body text-xs font-semibold tracking-[0.14em] text-warm-grey uppercase">{g.label}</p>
            <ul className="mt-3 flex flex-col gap-4">
              {sets.map((s, i) => {
                const [v, text] = g.get(s);
                const win = v === g.best;
                return (
                  <li key={s.name} className="min-w-0" style={{ "--i": i } as React.CSSProperties}>
                    <p className="font-body text-sm leading-snug [overflow-wrap:anywhere] text-charcoal">{s.name}</p>
                    <div className="mt-1.5 flex items-center gap-3">
                      <span className="block h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-cream">
                        <i className={`ar-bar block h-full rounded-full ${win ? "bg-sage" : "bg-terracotta/70"}`} style={{ width: `${Math.max(6, (v / g.max) * 100)}%` }} />
                      </span>
                      <span className={`ar-num mo-count shrink-0 text-right font-body text-sm font-semibold whitespace-nowrap tabular-nums ${win ? "text-sage-dark" : "text-charcoal"}`} data-d={350 + i * 250}>
                        {text}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
