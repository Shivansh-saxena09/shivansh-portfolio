import type { CSSProperties, ReactNode } from "react";

/** Shared building blocks for the homepage hero story (HeroStory.tsx). */

/** Viewbox-unit rectangle → % offsets inside a W×H composition. */
export const box = (W: number, H: number, x: number, y: number, w: number, h: number): CSSProperties => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
  width: `${(w / W) * 100}%`,
  height: `${(h / H) * 100}%`,
});

export function Particle({ path, begin, dur, r, className }: { path: string; begin: number; dur: number; r: number; className: string }) {
  return (
    <circle r={r} className={className} opacity="0">
      <animateMotion path={path} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.82;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
    </circle>
  );
}

export function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 12 12" className="scene-arrow h-[0.9em] w-[0.9em] shrink-0" aria-hidden="true">
      <path d={down ? "M6 1.5v8m0 0L2.5 6M6 9.5 9.5 6" : "M3 9 9 3m0 0H4m5 0v5"} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * In-world affordance: a hang-tag on a thread (notched label, punched hole
 * that pulses, arrow). Swings on hover/focus of its parent object.
 */
export function Pill({ children, tone, vivid, down, className = "" }: { children: ReactNode; tone: "terracotta" | "sage"; vivid?: boolean; down?: boolean; className?: string }) {
  const t = tone === "terracotta";
  const face = vivid
    ? t
      ? "bg-terracotta text-ivory"
      : "bg-sage-dark text-ivory"
    : t
      ? "bg-ivory text-terracotta-dark group-hover:bg-terracotta group-hover:text-ivory group-focus-visible:bg-terracotta group-focus-visible:text-ivory"
      : "bg-ivory text-sage-dark group-hover:bg-sage-dark group-hover:text-ivory group-focus-visible:bg-sage-dark group-focus-visible:text-ivory";
  return (
    <span aria-hidden="true" className={`scene-pill absolute z-10 ${className}`}>
      <span className={`scene-tag relative inline-flex items-center gap-[0.45em] py-[0.42em] pr-[0.85em] pl-[1.25em] font-body font-semibold whitespace-nowrap shadow-[0_4px_10px_-4px_rgb(43_38_34/0.35)] transition-colors duration-300 ${face}`}>
        {children}
        <Arrow down={down} />
      </span>
      <span className="absolute top-1/2 left-[0.5em] h-[0.42em] w-[0.42em] -translate-y-1/2 rounded-full bg-cream">
        <span className={`scene-ping absolute inset-0 rounded-full ${t ? "bg-terracotta" : "bg-sage"}`} />
      </span>
    </span>
  );
}

export const OBJ =
  "scene-obj group absolute block rounded-[1.25rem] outline-none transition-[translate,scale] duration-500 ease-premium hover:-translate-y-1 active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-4 focus-visible:ring-offset-cream";

export function Glow({ tone }: { tone: "terracotta" | "sage" }) {
  return (
    <span
      aria-hidden="true"
      className={`scene-glow pointer-events-none absolute -inset-[12%] rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100 ${
        tone === "terracotta"
          ? "bg-[radial-gradient(closest-side,rgb(181_98_58/0.22),transparent)]"
          : "bg-[radial-gradient(closest-side,rgb(124_139_111/0.28),transparent)]"
      }`}
    />
  );
}

/** Funnel bands that fill like liquid: a wavy surface clipped to each band. */
export function Liquid({ id, bands, band, x0, x1 }: { id: string; bands: readonly (readonly [number, number])[]; band: (t: number, b: number) => string; x0: number; x1: number }) {
  return (
    <>
      {bands.map(([top, bot], i) => {
        let d = `M${x0 - 40} ${top + 3}`;
        for (let x = x0 - 40; x < x1 + 40; x += 40) d += " q10 -5 20 0 t20 0";
        d += ` V${bot + 2} H${x0 - 40} Z`;
        return (
          <g key={top}>
            <clipPath id={`${id}${i}`}>
              <path d={band(top, bot)} />
            </clipPath>
            <g clipPath={`url(#${id}${i})`}>
              <g className="st-liquid">
                <path d={d} className="st-wavex fill-terracotta" fillOpacity={[0.16, 0.3, 0.9][i]} />
              </g>
            </g>
          </g>
        );
      })}
    </>
  );
}

/** Tracking status badge for the Pixel node: "!" (event not firing) ↔ ✓. */
export function StatusBadge({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="st-err" opacity="0">
        <circle r="9.5" className="fill-terracotta-dark" />
        <path d="M0 -5 V1.2" className="stroke-ivory" strokeWidth="2.4" strokeLinecap="round" />
        <circle cy="4.6" r="1.4" className="fill-ivory" />
      </g>
      <g className="st-ok">
        <circle r="9.5" className="fill-sage-dark" />
        <path d="M-4.2 0.2 L-1.2 3.2 L4.6 -3" className="stroke-ivory" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/** Six-ray burst (high-five, celebration). */
export function Spark({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="st-spark" opacity="0">
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <path key={a} d="M0 -9 V-17" transform={`rotate(${a})`} className="stroke-terracotta" strokeWidth="2.4" strokeLinecap="round" />
        ))}
      </g>
    </g>
  );
}

/** Flat robot "agent" (120 × 160). Asleep → eyes open → waves → talks (waveform). */
export function Robot({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  const bars = [0.35, 0.7, 1, 0.55, 0.9, 0.45, 0.75];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="rb-body">
        <line x1="60" y1="16" x2="60" y2="44" className="stroke-sage-dark" strokeWidth="3" strokeLinecap="round" />
        <circle cx="60" cy="13" r="7" className="rb-bulb fill-terracotta" />
        <rect x="20" y="44" width="80" height="56" rx="16" className="scene-node fill-ivory stroke-sage" strokeWidth="2" />
        <rect x="30" y="53" width="60" height="38" rx="10" className="fill-sage-dark" />
        <path className="rb-shut" opacity="0" d="M44 72 h8 M68 72 h8" stroke="var(--color-ivory)" strokeWidth="2.5" strokeLinecap="round" />
        <g className="rb-open" opacity="0">
          <circle cx="48" cy="71" r="4.5" className="fill-ivory" />
          <circle cx="72" cy="71" r="4.5" className="fill-ivory" />
        </g>
        <g className="rb-wave">
          {bars.map((h, i) => (
            <line key={i} x1={42 + i * 6} x2={42 + i * 6} y1={72 - h * 11} y2={72 + h * 11} className="hv-wave stroke-ivory" strokeWidth="3" strokeLinecap="round" style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </g>
        <rect x="32" y="104" width="56" height="44" rx="12" className="fill-sage" />
        <rect x="92" y="110" width="10" height="26" rx="5" className="fill-sage-dark" />
        <rect x="38" y="148" width="16" height="12" rx="4" className="fill-sage-dark" />
        <rect x="66" y="148" width="16" height="12" rx="4" className="fill-sage-dark" />
      </g>
      <g className="rb-arm">
        <rect x="18" y="110" width="10" height="26" rx="5" className="fill-sage-dark" />
        <circle cx="23" cy="138" r="5.5" className="fill-sage" />
      </g>
    </g>
  );
}

/** Résumé document (140 × 160 incl. download badge). */
export function ResumeDoc() {
  return (
    <g>
      <path d="M0 0 H92 L120 28 V150 H0 Z" className="fill-ivory stroke-terracotta" strokeOpacity="0.6" strokeWidth="1.25" />
      <path d="M92 0 V28 H120" className="fill-cream stroke-terracotta" strokeOpacity="0.6" strokeWidth="1.25" />
      <rect x="14" y="16" width="44" height="7" rx="2" className="fill-terracotta" />
      <rect x="14" y="29" width="60" height="4" rx="2" className="fill-warm-grey" fillOpacity="0.35" />
      {[48, 60, 72, 92, 104, 116].map((ly, i) => (
        <rect key={ly} x="14" y={ly} width={[92, 78, 86, 92, 70, 82][i]} height="3.5" rx="1.75" className={i === 3 ? "fill-sage" : "fill-warm-grey"} fillOpacity={i === 3 ? 0.7 : 0.25} />
      ))}
      <circle cx="112" cy="140" r="20" className="fill-terracotta" />
      <path d="M112 130 v17 m0 0 -6 -6 m6 6 6 -6" className="stroke-ivory" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/**
 * The character: flat vector, palette-only (skin = terracotta tint over
 * ivory), stylised face. Signature detail: a sage headset with a terracotta
 * mic, over a quiff. Feet at (0,0), ~190 units tall. Rig:
 * .av-pos › .av-body (breath / squash) › .av-look (turn) › .av-head (nod)
 * › .av-eyes (gaze) › .av-lid (blink); brows .av-brL/.av-brR; mouths
 * .av-m-{smile,open,flat,o,grin} swap per expression; arms rotate at the
 * shoulder, legs at the hip. SSR markup is the final pose (proud grin).
 */
export function Avatar({ x, y, s = 1, ps, pose = "hold" }: { x: number; y: number; s?: number; ps?: number; pose?: "hold" | "rest" }) {
  const [rl, rr] = pose === "hold" ? [-40, 40] : [8, -8];
  const hand = (
    <g transform="translate(0 54)">
      <circle r="6.5" className="fill-ivory" />
      <circle r="6.5" className="fill-terracotta" fillOpacity="0.3" />
    </g>
  );
  const ink = "stroke-charcoal";
  return (
    <g className="av-pos" transform={`translate(${x} ${y})${ps ? ` scale(${ps})` : ""}`}>
      <g transform={`scale(${s})`}>
        <ellipse cx="0" cy="0" rx="32" ry="5" className="av-shadow fill-charcoal" fillOpacity="0.12" />
        <g className="av-legL">
          <rect x="-15" y="-72" width="12" height="68" rx="5" className="fill-charcoal" />
          <ellipse cx="-12" cy="-4" rx="10" ry="5" className="fill-charcoal" />
        </g>
        <g className="av-legR">
          <rect x="3" y="-72" width="12" height="68" rx="5" className="fill-charcoal" />
          <ellipse cx="12" cy="-4" rx="10" ry="5" className="fill-charcoal" />
        </g>
        <g className="av-body">
          <path d="M-25 -66 V-118 Q-25 -132 -11 -132 H11 Q25 -132 25 -118 V-66 Z" className="fill-terracotta" />
          <path d="M-9 -132 L0 -116 L9 -132 Z" className="fill-ivory" />
          <path d="M-18 -128 L20 -80" className="stroke-sage-dark" strokeWidth="4" strokeLinecap="round" />
          <rect x="12" y="-88" width="24" height="22" rx="5" className="fill-sage" />
          <rect x="12" y="-88" width="24" height="8" rx="4" className="fill-sage-dark" />
          <rect x="-5" y="-139" width="10" height="9" className="fill-ivory" />
          <rect x="-5" y="-139" width="10" height="9" className="fill-terracotta" fillOpacity="0.3" />
          <g className="av-look">
            <g className="av-head">
              <circle cx="0" cy="-158" r="21" className="fill-ivory" />
              <circle cx="0" cy="-158" r="21" className="fill-terracotta" fillOpacity="0.3" />
              <path d="M-22 -156 Q-26 -186 2 -187 Q15 -193 21 -182 Q27 -173 22 -158 Q16 -171 4 -170 Q-9 -175 -22 -156 Z" className="fill-charcoal" />
              <path d="M-23.5 -160 Q-25 -188 0 -188 Q25 -188 23.5 -160" className="stroke-sage-dark" strokeWidth="3.5" fill="none" />
              <rect x="-28" y="-167" width="8" height="16" rx="4" className="fill-sage-dark" />
              <rect x="20" y="-167" width="8" height="16" rx="4" className="fill-sage-dark" />
              <path d="M-24 -153 Q-22 -141 -12 -141" className="stroke-sage-dark" strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <circle cx="-11" cy="-141" r="2.8" className="fill-terracotta" />
              <path className={`av-brL ${ink}`} d="M-11.5 -165 Q-7.5 -168 -3.5 -165.5" strokeWidth="2.1" fill="none" strokeLinecap="round" transform="translate(0 -1.5)" />
              <path className={`av-brR ${ink}`} d="M3.5 -165.5 Q7.5 -168 11.5 -165" strokeWidth="2.1" fill="none" strokeLinecap="round" transform="translate(0 -1.5)" />
              <g className="av-eyes">
                <g className="av-lid">
                  <ellipse cx="-7.5" cy="-156" rx="2.4" ry="3.1" className="fill-charcoal" />
                  <ellipse cx="7.5" cy="-156" rx="2.4" ry="3.1" className="fill-charcoal" />
                  <circle cx="-6.7" cy="-157.3" r="0.85" className="fill-ivory" />
                  <circle cx="8.3" cy="-157.3" r="0.85" className="fill-ivory" />
                </g>
              </g>
              <circle cx="-13" cy="-148" r="3.2" className="fill-terracotta" fillOpacity="0.35" />
              <circle cx="13" cy="-148" r="3.2" className="fill-terracotta" fillOpacity="0.35" />
              <path className={`av-m-smile ${ink}`} opacity="0" d="M-6 -146.5 Q0 -141 6 -146.5" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <path className="av-m-open fill-terracotta-dark" opacity="0" d="M-6.5 -147.5 Q0 -136 6.5 -147.5 Z" />
              <path className={`av-m-flat ${ink}`} opacity="0" d="M-4.5 -145 H4.5" strokeWidth="1.8" strokeLinecap="round" />
              <ellipse className="av-m-o fill-charcoal" opacity="0" cx="0" cy="-144.5" rx="2.5" ry="3.2" />
              <path className="av-m-grin fill-charcoal" d="M-7.5 -148 Q0 -138 7.5 -148 Q0 -144 -7.5 -148 Z" />
            </g>
          </g>
          <g transform="translate(-28 -127)">
            <g className="av-armL" transform={`rotate(${rl})`}>
              <rect x="-5.5" y="0" width="11" height="50" rx="5.5" className="fill-terracotta-dark" />
              {hand}
            </g>
          </g>
          <g transform="translate(28 -127)">
            <g className="av-armR" transform={`rotate(${rr})`}>
              <rect x="-5.5" y="0" width="11" height="50" rx="5.5" className="fill-terracotta-dark" />
              {hand}
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

/** Ambient depth: soft glows + slow drifting motes (CSS-only motion). */
export function Ambient({ motes, W, H }: { motes: number; W: number; H: number }) {
  return (
    <div className="st-amb pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute top-[30%] left-[18%] h-[45%] w-[30%] rounded-full bg-[radial-gradient(closest-side,rgb(181_98_58/0.12),transparent)]" />
      <div className="absolute top-[25%] right-[6%] h-[50%] w-[34%] rounded-full bg-[radial-gradient(closest-side,rgb(124_139_111/0.16),transparent)]" />
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
        {Array.from({ length: motes }, (_, i) => (
          <circle
            key={i}
            cx={((i * 157) % W) + 10}
            cy={((i * 83) % (H * 0.8)) + 30}
            r={1.4 + (i % 3) * 0.8}
            className={`st-mote ${i % 2 ? "fill-sage" : "fill-terracotta"}`}
            fillOpacity="0.28"
            style={{ animationDuration: `${9 + (i % 5) * 2.3}s`, animationDelay: `${-i * 1.7}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
