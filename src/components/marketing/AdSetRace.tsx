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
    <div className="mo-reveal rounded-2xl border border-beige-border bg-ivory p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-heading text-2xl text-charcoal sm:text-3xl">{heading}</h2>
        <Link href={href} className="nav-underline font-body text-sm text-terracotta">
          {campaign} →
        </Link>
      </div>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="font-body text-xs font-semibold tracking-[0.14em] text-warm-grey uppercase">{g.label}</p>
            <ul className="mt-3 flex flex-col gap-3">
              {sets.map((s, i) => {
                const [v, text] = g.get(s);
                const win = v === g.best;
                return (
                  <li key={s.name} style={{ "--i": i } as React.CSSProperties}>
                    <div className="flex items-baseline justify-between gap-3 font-body text-sm">
                      <span className="truncate text-charcoal">{s.name}</span>
                      <span className={`ar-num mo-count shrink-0 text-right font-semibold tabular-nums ${win ? "text-sage-dark" : "text-charcoal"}`} data-d={350 + i * 250}>
                        {text}
                      </span>
                    </div>
                    <span className="mt-1.5 block h-2.5 overflow-hidden rounded-full bg-cream">
                      <i className={`ar-bar block h-full rounded-full ${win ? "bg-sage" : "bg-terracotta/70"}`} style={{ width: `${Math.max(6, (v / g.max) * 100)}%` }} />
                    </span>
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
