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
      {down ? (
        <path d="M6 1.5v8m0 0L2.5 6M6 9.5 9.5 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M3 9 9 3m0 0H4m5 0v5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

/** Always-visible affordance on every object: a pulsing dot + label + arrow. */
export function Pill({ children, tone, vivid, down, className = "" }: { children: ReactNode; tone: "terracotta" | "sage"; vivid?: boolean; down?: boolean; className?: string }) {
  const toneCls =
    tone === "terracotta"
      ? vivid
        ? "bg-terracotta text-ivory border-terracotta"
        : "text-terracotta-dark border-terracotta/40 group-hover:bg-terracotta group-hover:text-ivory group-focus-visible:bg-terracotta group-focus-visible:text-ivory"
      : vivid
        ? "bg-sage-dark text-ivory border-sage-dark"
        : "text-sage-dark border-sage/50 group-hover:bg-sage-dark group-hover:text-ivory group-focus-visible:bg-sage-dark group-focus-visible:text-ivory";
  return (
    <span
      aria-hidden="true"
      className={`scene-pill absolute z-10 inline-flex items-center gap-[0.5em] rounded-full border bg-ivory/90 px-[0.9em] py-[0.45em] font-body font-semibold whitespace-nowrap shadow-[0_6px_18px_-10px_rgb(43_38_34/0.35)] backdrop-blur-sm transition-colors duration-300 ${toneCls} ${className}`}
    >
      <span className={`relative inline-flex h-[0.5em] w-[0.5em] rounded-full ${tone === "terracotta" ? "bg-terracotta" : "bg-sage"} group-hover:bg-ivory group-focus-visible:bg-ivory`}>
        <span className="scene-ping absolute inset-0 rounded-full bg-inherit" />
      </span>
      {children}
      <Arrow down={down} />
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

/** Flat robot "agent" (120 × 160). Asleep = dim bulb + shut eyes; awake = waveform. */
export function Robot({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  const bars = [0.35, 0.7, 1, 0.55, 0.9, 0.45, 0.75];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <line x1="60" y1="16" x2="60" y2="44" className="stroke-sage-dark" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="13" r="7" className="rb-bulb fill-terracotta" />
      <rect x="20" y="44" width="80" height="56" rx="16" className="scene-node fill-ivory stroke-sage" strokeWidth="2" />
      <rect x="30" y="53" width="60" height="38" rx="10" className="fill-sage-dark" />
      <g className="rb-eyes" opacity="0">
        <path d="M44 72 h8 M68 72 h8" className="stroke-ivory" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g className="rb-wave">
        {bars.map((h, i) => (
          <line key={i} x1={42 + i * 6} x2={42 + i * 6} y1={72 - h * 11} y2={72 + h * 11} className="hv-wave stroke-ivory" strokeWidth="3" strokeLinecap="round" style={{ animationDelay: `${i * 0.12}s` }} />
        ))}
      </g>
      <rect x="32" y="104" width="56" height="44" rx="12" className="fill-sage" />
      <rect x="18" y="110" width="10" height="26" rx="5" className="fill-sage-dark" />
      <rect x="92" y="110" width="10" height="26" rx="5" className="fill-sage-dark" />
      <rect x="38" y="148" width="16" height="12" rx="4" className="fill-sage-dark" />
      <rect x="66" y="148" width="16" height="12" rx="4" className="fill-sage-dark" />
    </g>
  );
}

/** Résumé document (140 × 160 incl. download badge). */
export function ResumeDoc({ x = 0, y = 0, s = 1 }: { x?: number; y?: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
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
 * ivory), no realistic face. Feet at (0,0), ~185 units tall. Each moving
 * part is its own group so GSAP can rotate it about its joint:
 * .av-pos (placement) › .av-body (breath) › .av-look (turn) › .av-head
 * (nod/tilt) › .av-eyes (gaze) › .av-lid (blink); .av-armL/.av-armR
 * (shoulder); .av-legL/.av-legR (hip). SSR markup is the story's final
 * pose (desktop: arms in, holding the document out) so no-JS and reduced-motion
 * visitors get the finished scene.
 */
export function Avatar({ x, y, s = 1, pose = "hold" }: { x: number; y: number; s?: number; pose?: "hold" | "rest" }) {
  const [rl, rr] = pose === "hold" ? [-40, 40] : [8, -8];
  const hand = (
    <g transform="translate(0 54)">
      <circle r="6.5" className="fill-ivory" />
      <circle r="6.5" className="fill-terracotta" fillOpacity="0.3" />
    </g>
  );
  return (
    <g className="av-pos" transform={`translate(${x} ${y})`}>
      <g transform={`scale(${s})`}>
        <ellipse cx="0" cy="0" rx="32" ry="5" className="fill-charcoal" fillOpacity="0.12" />
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
              <path d="M-22 -158 Q-24 -184 0 -183 Q24 -184 22 -160 Q15 -172 3 -170 Q-10 -175 -22 -158 Z" className="fill-charcoal" />
              <g className="av-eyes">
                <g className="av-lid">
                  <ellipse cx="-7.5" cy="-156" rx="2.3" ry="3" className="fill-charcoal" />
                  <ellipse cx="7.5" cy="-156" rx="2.3" ry="3" className="fill-charcoal" />
                </g>
              </g>
              <circle cx="-13" cy="-148" r="3.2" className="fill-terracotta" fillOpacity="0.35" />
              <circle cx="13" cy="-148" r="3.2" className="fill-terracotta" fillOpacity="0.35" />
              <path d="M-6 -146 Q0 -141 6 -146" className="stroke-charcoal" strokeWidth="1.7" fill="none" strokeLinecap="round" />
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
