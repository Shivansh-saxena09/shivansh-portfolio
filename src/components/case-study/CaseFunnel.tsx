import "@/components/case-study/case-motion.css";

type Stage = { label: string; value: number; text: string };

const W = 300;
const BH = 50;
const GAP = 6;
const half = (y: number) => 140 - y * 0.32;
const band = (t: number) => {
  const b = t + BH;
  return `M${150 - half(t)} ${t} H${150 + half(t)} L${150 + half(b)} ${b} H${150 - half(b)} Z`;
};

/**
 * The case study's real totals (summed across ad sets) as the hero's funnel:
 * bands fill and numbers count up once when scrolled into view (MotionRuntime;
 * no JS of its own). Labels are the admin-editable hero stage labels; stages
 * with no data are dropped by the page, and none at all renders nothing.
 */
export function CaseFunnel({ stages }: { stages: Stage[] }) {
  if (stages.length === 0) return null;
  const id = `cf${stages.map((s) => s.value).join("-")}`;
  const H = stages.length * (BH + GAP) - GAP;
  return (
    <div className="cf mo-reveal mx-auto max-w-md">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={stages.map((s) => `${s.label}: ${s.text}`).join(", ")}>
        <defs>
          {stages.map((_, i) => (
            <clipPath key={i} id={`${id}-${i}`}>
              <path d={band(i * (BH + GAP))} />
            </clipPath>
          ))}
        </defs>
        {stages.map((s, i) => {
          const t = i * (BH + GAP);
          const last = i === stages.length - 1;
          return (
            <g key={s.label} style={{ "--i": i } as React.CSSProperties}>
              <path d={band(t)} className="fill-ivory stroke-terracotta" strokeOpacity="0.5" />
              <g clipPath={`url(#${id}-${i})`}>
                <rect className={`cf-liq ${last ? "fill-terracotta" : ["fill-terracotta/15", "fill-terracotta/30"][Math.min(i, 1)]}`} x="0" y={t} width={W} height={BH} />
              </g>
              <text x="150" y={t + 20} textAnchor="middle" className={`font-body ${last ? "fill-ivory" : "fill-charcoal"}`} fillOpacity="0.8" fontSize="9" fontWeight="600" letterSpacing="1">
                {s.label.toUpperCase()}
              </text>
              <text x="150" y={t + 39} textAnchor="middle" className={`cf-num mo-count font-heading ${last ? "fill-ivory" : "fill-charcoal"}`} data-d={300 + i * 480} fontSize="16" fontWeight="700">
                {s.text}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
