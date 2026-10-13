"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap } from "gsap";
import type { HeroVisualContent } from "@/lib/data/heroVisual";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * The homepage hero as one scene: ad spend → campaign funnel (marketing,
 * terracotta, foreground) → Pixel/CAPI → CRM → dashboard system layer
 * (engineering, sage) → résumé document out the far end, with an AI agent
 * node hanging off the CRM and the career running underneath as a time
 * axis. The four destinations are the scene's own objects, each a real
 * <Link>/<a> (keyboard-focusable, labelled); everything else is aria-hidden
 * decoration. Desktop and mobile are separate compositions, each in its
 * own coordinate space (positions below are in that space's viewBox units
 * and become % offsets, text inside uses cqw so it scales with the scene).
 *
 * Perf: static SVG; per-frame motion is SMIL + CSS only, paused off-screen
 * (and in the display:none composition). GSAP plays a one-off intro. The
 * h1 is plain server-rendered text, never hidden, so it stays the LCP.
 */

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export type Milestone = { date: string; org: string; current: boolean };

type SceneProps = {
  c: HeroVisualContent;
  milestones: Milestone[];
  resumeUrl: string;
  resumeFileName: string;
  engineeringLeaning: boolean;
  animated: boolean;
  counterRef: React.RefObject<SVGTextElement | null>;
};

const box = (W: number, H: number, x: number, y: number, w: number, h: number): CSSProperties => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
  width: `${(w / W) * 100}%`,
  height: `${(h / H) * 100}%`,
});

function Particle({ path, begin, dur, r, className }: { path: string; begin: number; dur: number; r: number; className: string }) {
  return (
    <circle r={r} className={className} opacity="0">
      <animateMotion path={path} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.82;1" dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
    </circle>
  );
}

function Arrow({ down = false }: { down?: boolean }) {
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
function Pill({ children, tone, vivid, down, className = "" }: { children: ReactNode; tone: "terracotta" | "sage"; vivid?: boolean; down?: boolean; className?: string }) {
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

const OBJ =
  "scene-obj group absolute block rounded-[1.25rem] outline-none transition-transform duration-500 ease-premium hover:-translate-y-1 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-4 focus-visible:ring-offset-cream";

function Glow({ tone }: { tone: "terracotta" | "sage" }) {
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

function Wave({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  const bars = [0.35, 0.6, 0.9, 0.55, 1, 0.7, 0.45, 0.8, 0.4];
  return (
    <g>
      {bars.map((h, i) => (
        <line
          key={i}
          x1={cx + (i - 4) * 7 * scale}
          x2={cx + (i - 4) * 7 * scale}
          y1={cy - h * 18 * scale}
          y2={cy + h * 18 * scale}
          className="hv-wave stroke-sage-dark"
          strokeWidth={3 * scale}
          strokeLinecap="round"
          style={{ animationDelay: `${i * 0.11}s` }}
        />
      ))}
    </g>
  );
}

function ResumeDoc({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 H92 L120 28 V150 H0 Z" className="fill-ivory stroke-terracotta" strokeOpacity="0.6" strokeWidth="1.25" />
      <path d="M92 0 V28 H120" className="fill-cream stroke-terracotta" strokeOpacity="0.6" strokeWidth="1.25" />
      <rect x="14" y="16" width="44" height="7" rx="2" className="fill-terracotta" />
      <rect x="14" y="29" width="60" height="4" rx="2" className="fill-warm-grey" fillOpacity="0.35" />
      {[48, 60, 72, 92, 104, 116].map((ly, i) => (
        <rect key={ly} x="14" y={ly} width={[92, 78, 86, 92, 70, 82][i]} height="3.5" rx="1.75" className={i === 3 ? "fill-sage" : "fill-warm-grey"} fillOpacity={i === 3 ? 0.7 : 0.25} />
      ))}
      <g className="scene-dl">
        <circle cx="112" cy="140" r="20" className="fill-terracotta" />
        <path d="M112 130 v17 m0 0 -6 -6 m6 6 6 -6" className="stroke-ivory" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </g>
  );
}

/* ======================================================================== */
/* Desktop composition — 1200 × 600, flow runs left → right                 */
/* ======================================================================== */
const DW = 1200;
const DH = 600;
const dBox = (x: number, y: number, w: number, h: number) => box(DW, DH, x, y, w, h);
// Funnel (local to its 400×290 box at scene 150,190): turned on its side.
const fHalf = (x: number) => 115 - 0.215 * x;
const F_CY = 145;
const F_BANDS = [
  [0, 140],
  [148, 268],
  [276, 372],
] as const;
const fBand = (l: number, r: number) =>
  `M${l} ${F_CY - fHalf(l)} L${r} ${F_CY - fHalf(r)} V${F_CY + fHalf(r)} L${l} ${F_CY + fHalf(l)} Z`;
const D_PATHS = {
  funnelOut: "M522 335 H560 V292 H640",
  crmToAi: "M840 344 H900 V120 H1021",
  dashToResume: "M840 396 H1010",
  feedback: "M740 414 V505 H65 V360",
};
const D_PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const yL = 230 + ((i * 53) % 210);
  const survivor = i % 5 === 0;
  const endX = survivor ? 0 : i % 2 ? 290 : 418;
  const yAt = (sx: number) => 335 + ((yL - 335) * fHalf(sx - 150)) / fHalf(0);
  const path = survivor
    ? `M140 326 Q146 ${yL} 152 ${yL} L418 ${yAt(418).toFixed(1)} L522 335 ${D_PATHS.funnelOut.replace("M522 335 ", "")}`
    : `M140 326 Q146 ${yL} 152 ${yL} L${endX} ${yAt(endX).toFixed(1)}`;
  return { path, begin: i * 0.19, dur: survivor ? 3.6 : 2.2, survivor };
});

function DesktopScene({ c, milestones, resumeUrl, resumeFileName, engineeringLeaning, animated, counterRef }: SceneProps) {
  const pillText = "text-[1.05cqw]";
  return (
    <div className="relative aspect-[2/1] w-full">
      {/* Connective tissue, particles, career axis — decoration only */}
      <svg viewBox={`0 0 ${DW} ${DH}`} className="hv-svg absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <pattern id="sd-dots" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" className="fill-warm-grey" fillOpacity="0.2" />
          </pattern>
          <radialGradient id="sd-fade" cx="0.62" cy="0.55" r="0.55">
            <stop offset="0.2" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="sd-mask">
            <rect width={DW} height={DH} fill="url(#sd-fade)" />
          </mask>
        </defs>
        <rect width={DW} height={DH} fill="url(#sd-dots)" mask="url(#sd-mask)" className="hv-fade-in" />

        {[D_PATHS.funnelOut, D_PATHS.crmToAi, D_PATHS.dashToResume].map((d) => (
          <path key={d} d={d} pathLength={1} strokeDasharray="1" className="hv-line stroke-sage" strokeWidth="1.5" fill="none" />
        ))}
        <path d={D_PATHS.feedback} className={`hv-feedback stroke-sage ${animated ? "hv-flow" : ""}`} strokeWidth="1.25" fill="none" strokeDasharray="4 6" strokeOpacity="0.7" />
        <path d="M59 370 L65 360 L71 370" className="hv-feedback stroke-sage" strokeWidth="1.25" fill="none" />
        <text x="402" y="497" textAnchor="middle" className="hv-feedback fill-sage-dark font-body" fontSize="10" letterSpacing="2.5">
          {c.feedbackLabel.toUpperCase()}
        </text>

        {/* Career axis */}
        <g className="hv-mile">
          <path d="M0 548 H1188" className="stroke-beige-border" strokeWidth="1.5" />
          <path d="M1180 543 L1190 548 L1180 553" className="stroke-beige-border" strokeWidth="1.5" fill="none" />
          {milestones.map((m, i) => (
            <circle key={m.org} cx={150 + i * 310} cy="548" r={m.current ? 6 : 4.5} className={m.current ? "fill-terracotta" : "fill-ivory stroke-sage"} strokeWidth="1.5" />
          ))}
        </g>

        {animated && (
          <g className="hv-particles">
            {D_PARTICLES.map((p, i) => (
              <Particle key={i} path={p.path} begin={p.begin} dur={p.dur} r={p.survivor ? 3.4 : 2.7} className="fill-terracotta" />
            ))}
            <Particle path={D_PATHS.crmToAi} begin={1.1} dur={2.2} r={3} className="fill-sage-dark" />
            <Particle path={D_PATHS.dashToResume} begin={0.5} dur={1.6} r={3} className="fill-sage-dark" />
            <Particle path={D_PATHS.feedback} begin={1.6} dur={4.6} r={2.6} className="fill-sage" />
          </g>
        )}
      </svg>

      {/* Spend source */}
      <div className="hv-card glass-card absolute flex flex-col justify-center gap-[0.2cqw] rounded-2xl px-[0.9cqw]" style={dBox(0, 294, 140, 64)}>
        <span className="font-body text-[1.05cqw] font-semibold whitespace-nowrap text-terracotta">{c.spendLabel}</span>
        <span className="font-body text-[0.8cqw] leading-snug text-warm-grey">{c.campaignLabel}</span>
      </div>

      {/* 1 · Marketing — the funnel */}
      <Link href="/marketing" aria-label={c.linkLabels[0]} className={`${OBJ} hv-obj`} style={dBox(150, 190, 400, 290)}>
        <Glow tone="terracotta" />
        <Pill tone="terracotta" vivid className={`left-0 top-0 ${pillText}`}>{c.linkLabels[0]}</Pill>
        <svg viewBox="0 0 400 290" className="relative h-full w-full overflow-visible" aria-hidden="true">
          <g>
            {F_BANDS.map(([l, r], i) => (
              <g key={l} className="hv-band">
                <path d={fBand(l, r)} className="scene-band fill-terracotta stroke-terracotta" fillOpacity={[0.1, 0.2, 0.9][i]} strokeOpacity="0.45" strokeWidth="1" />
                <text x={(l + r) / 2} y={F_CY - 10} textAnchor="middle" className={`font-body ${i === 2 ? "fill-ivory" : "fill-charcoal"}`} fillOpacity={i === 2 ? 0.9 : 0.6} fontSize="10" fontWeight="600" letterSpacing="2">
                  {c.stages[i].toUpperCase()}
                </text>
                <text
                  ref={i === 2 ? counterRef : undefined}
                  data-value={i === 2 ? c.leadsValue : undefined}
                  x={(l + r) / 2}
                  y={F_CY + 20}
                  textAnchor="middle"
                  className={`font-heading tabular-nums ${i === 2 ? "fill-ivory" : "fill-charcoal"}`}
                  fontSize={i === 2 ? 30 : 26}
                  fontWeight="700"
                >
                  {i === 2 ? c.leadsValue.toLocaleString("en-IN") : c.stageValues[i]}
                </text>
              </g>
            ))}
          </g>
        </svg>
        <span className="hv-band absolute bottom-0 left-[46%] -translate-x-1/2 font-body text-[0.95cqw] whitespace-nowrap text-warm-grey" aria-hidden="true">
          {c.metricChips.join("  ·  ")}
        </span>
      </Link>

      {/* 2 · Engineering — the system layer */}
      <Link href="/engineering" aria-label={c.linkLabels[1]} className={`${OBJ} hv-obj`} style={dBox(590, 196, 300, 244)}>
        <Glow tone="sage" />
        <Pill tone="sage" vivid={engineeringLeaning} className={`left-[4%] top-0 ${pillText}`}>{c.linkLabels[1]}</Pill>
        <svg viewBox="0 0 300 244" className="relative h-full w-full overflow-visible" aria-hidden="true">
          <g className="hv-bracket">
            <text x="0" y="222" className="fill-sage font-heading" fontSize="172" fillOpacity="0.3">{"{"}</text>
            <text x="300" y="222" textAnchor="end" className="fill-sage font-heading" fontSize="172" fillOpacity="0.3">{"}"}</text>
          </g>
          <path d="M150 114 V130 M150 166 V182" pathLength={1} strokeDasharray="1" className="hv-line stroke-sage" strokeWidth="1.5" />
          {c.systemNodes.map((label, i) => (
            <g key={i} className="hv-node">
              <rect x="50" y={78 + i * 52} width="200" height="36" rx="9" className="scene-node fill-ivory stroke-sage" strokeWidth="1.25" />
              {animated && <rect x="50" y={78 + i * 52} width="200" height="36" rx="9" className="hv-pulse fill-none stroke-sage" strokeWidth="3" style={{ animationDelay: `${i * 0.8}s` }} />}
              <text x="150" y={100.5 + i * 52} textAnchor="middle" className="fill-sage-dark font-mono" fontSize="12">{label}</text>
            </g>
          ))}
        </svg>
      </Link>

      {/* 3 · AI — the agent node */}
      <Link href="/engineering#ai" aria-label={`${c.linkLabels[2]} — ${c.aiStatus}`} className={`${OBJ} hv-obj`} style={dBox(950, 0, 240, 250)}>
        <Glow tone="sage" />
        <Pill tone="sage" className={`left-1/2 top-0 -translate-x-1/2 ${pillText}`}>{c.linkLabels[2]}</Pill>
        <svg viewBox="0 0 240 250" className="relative h-full w-full overflow-visible" aria-hidden="true">
          <circle cx="120" cy="120" r="66" className={`stroke-sage ${animated ? "hv-orbit" : ""}`} fill="none" strokeDasharray="3 7" strokeOpacity="0.7" />
          <circle cx="120" cy="120" r="50" className="scene-node fill-ivory stroke-sage" strokeWidth="1.25" />
          <Wave cx={120} cy={120} />
          <text x="120" y="208" textAnchor="middle" className="fill-charcoal font-heading" fontSize="17" fontWeight="600">{c.aiLabel}</text>
          <text x="120" y="226" textAnchor="middle" className="fill-warm-grey font-body" fontSize="10.5">{c.aiItems.join(" · ")}</text>
          <rect x="72" y="234" width="96" height="16" rx="8" className="fill-sage" fillOpacity="0.18" />
          <text x="120" y="245.5" textAnchor="middle" className="fill-sage-dark font-body" fontSize="8.5" fontWeight="700" letterSpacing="1.5">{c.aiStatus.toUpperCase()}</text>
        </svg>
      </Link>

      {/* 4 · Resume — the pipeline's output document */}
      <a href={resumeUrl} download={resumeFileName} aria-label={`${c.linkLabels[3]} (${c.resumeMeta} download)`} className={`${OBJ} hv-obj`} style={dBox(990, 300, 200, 220)}>
        <Glow tone="terracotta" />
        <svg viewBox="0 0 200 220" className="relative h-full w-full overflow-visible" aria-hidden="true">
          <ResumeDoc x={22} y={30} />
          <text x="82" y="212" textAnchor="middle" className="fill-charcoal font-heading" fontSize="16" fontWeight="600">
            {c.resumeLabel} <tspan className="fill-warm-grey font-body" fontSize="11" fontWeight="400">· {c.resumeMeta}</tspan>
          </text>
        </svg>
        <Pill tone="terracotta" down className={`right-0 top-0 ${pillText}`}>{c.linkLabels[3]}</Pill>
      </a>

      {/* Career milestones along the axis */}
      <div className="hv-mile absolute font-body text-[0.85cqw] font-semibold tracking-[0.18em] text-warm-grey uppercase" style={dBox(0, 562, 120, 30)}>
        {c.careerLabel}
      </div>
      {milestones.map((m, i) => (
        <div key={m.org} className="hv-mile absolute" style={dBox(150 + i * 310 - 6, 562, 290, 38)}>
          <span className={`block font-body text-[0.8cqw] font-semibold tracking-[0.14em] uppercase ${m.current ? "text-terracotta" : "text-warm-grey"}`}>{m.date}</span>
          <span className="block truncate font-heading text-[1.2cqw] font-semibold text-charcoal">{m.org}</span>
        </div>
      ))}
    </div>
  );
}

/* ======================================================================== */
/* Mobile composition — 360 × 490, flow runs top → bottom                    */
/* ======================================================================== */
const MW = 360;
const MH = 502;
const mBox = (x: number, y: number, w: number, h: number) => box(MW, MH, x, y, w, h);
// Funnel local to its 320×196 box at scene 20,44; points down.
const mHalf = (y: number) => 150 - 0.42 * y;
const M_BANDS = [
  [0, 56],
  [62, 112],
  [118, 160],
] as const;
const mBand = (t: number, b: number) => `M${160 - mHalf(t)} ${t} H${160 + mHalf(t)} L${160 + mHalf(b)} ${b} H${160 - mHalf(b)} Z`;
const M_PATHS = {
  funnelOut: "M180 204 V212 H83 V264",
  crmToAi: "M180 296 V306 H70 V362",
  dashToResume: "M277 296 V362",
  feedback: "M340 300 H352 V19 H258",
};
const M_PARTICLES = Array.from({ length: 10 }, (_, i) => {
  const xT = 34 + ((i * 67) % 292);
  const survivor = i % 4 === 0;
  const endY = survivor ? 0 : i % 2 ? 100 : 156;
  const xAt = (sy: number) => 180 + ((xT - 180) * mHalf(sy - 44)) / mHalf(0);
  const path = survivor
    ? `M180 38 Q${xT} 40 ${xT} 46 L${xAt(156).toFixed(1)} 156 L180 204 ${M_PATHS.funnelOut.replace("M180 204 ", "")}`
    : `M180 38 Q${xT} 40 ${xT} 46 L${xAt(endY).toFixed(1)} ${endY}`;
  return { path, begin: i * 0.26, dur: survivor ? 3 : 2, survivor };
});

function MobileScene({ c, milestones, resumeUrl, resumeFileName, engineeringLeaning, animated, counterRef }: SceneProps) {
  const pillText = "text-[3.2cqw]";
  return (
    <div className="relative w-full" style={{ aspectRatio: `${MW} / ${MH}` }}>
      <svg viewBox={`0 0 ${MW} ${MH}`} className="hv-svg absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {[M_PATHS.funnelOut, M_PATHS.crmToAi, M_PATHS.dashToResume].map((d) => (
          <path key={d} d={d} pathLength={1} strokeDasharray="1" className="hv-line stroke-sage" strokeWidth="1.25" fill="none" />
        ))}
        <path d={M_PATHS.feedback} className={`hv-feedback stroke-sage ${animated ? "hv-flow" : ""}`} strokeWidth="1" fill="none" strokeDasharray="3 5" strokeOpacity="0.7" />
        <path d="M265 14 L258 19 L265 24" className="hv-feedback stroke-sage" strokeWidth="1" fill="none" />
        <text transform="translate(358 160) rotate(-90)" textAnchor="middle" className="hv-feedback fill-sage-dark font-body" fontSize="7.5" letterSpacing="1.8">
          {c.feedbackLabel.toUpperCase()}
        </text>

        <g className="hv-mile">
          <path d="M0 450 H352" className="stroke-beige-border" strokeWidth="1.25" />
          <path d="M346 446 L353 450 L346 454" className="stroke-beige-border" strokeWidth="1.25" fill="none" />
          {milestones.map((m, i) => (
            <circle key={m.org} cx={6 + i * 120} cy="450" r={m.current ? 4.5 : 3.5} className={m.current ? "fill-terracotta" : "fill-ivory stroke-sage"} strokeWidth="1.25" />
          ))}
        </g>

        {animated && (
          <g className="hv-particles">
            {M_PARTICLES.map((p, i) => (
              <Particle key={i} path={p.path} begin={p.begin} dur={p.dur} r={p.survivor ? 2.8 : 2.3} className="fill-terracotta" />
            ))}
            <Particle path={M_PATHS.crmToAi} begin={0.8} dur={1.6} r={2.5} className="fill-sage-dark" />
            <Particle path={M_PATHS.dashToResume} begin={0.3} dur={1.2} r={2.5} className="fill-sage-dark" />
            <Particle path={M_PATHS.feedback} begin={1.4} dur={4} r={2.2} className="fill-sage" />
          </g>
        )}
      </svg>

      <div className="hv-card glass-card absolute flex items-center justify-center gap-[1.5cqw] rounded-full" style={mBox(102, 0, 156, 38)}>
        <span className="font-body text-[3.2cqw] font-semibold text-terracotta">{c.spendLabel}</span>
      </div>

      {/* 1 · Marketing */}
      <Link href="/marketing" aria-label={c.linkLabels[0]} className={`${OBJ} hv-obj`} style={mBox(20, 44, 320, 198)}>
        <Glow tone="terracotta" />
        <svg viewBox="0 0 320 198" className="relative h-full w-full overflow-visible" aria-hidden="true">
          {M_BANDS.map(([t, b], i) => (
            <g key={t} className="hv-band">
              <path d={mBand(t, b)} className="scene-band fill-terracotta stroke-terracotta" fillOpacity={[0.1, 0.2, 0.9][i]} strokeOpacity="0.45" strokeWidth="1" />
              <text x="160" y={t + (b - t) / 2 - 5} textAnchor="middle" className={`font-body ${i === 2 ? "fill-ivory" : "fill-charcoal"}`} fillOpacity={i === 2 ? 0.9 : 0.6} fontSize="8.5" fontWeight="600" letterSpacing="1.6">
                {c.stages[i].toUpperCase()}
              </text>
              <text
                ref={i === 2 ? counterRef : undefined}
                data-value={i === 2 ? c.leadsValue : undefined}
                x="160"
                y={t + (b - t) / 2 + 14}
                textAnchor="middle"
                className={`font-heading tabular-nums ${i === 2 ? "fill-ivory" : "fill-charcoal"}`}
                fontSize="18"
                fontWeight="700"
              >
                {i === 2 ? c.leadsValue.toLocaleString("en-IN") : c.stageValues[i]}
              </text>
            </g>
          ))}
          <text x="2" y="144" className="hv-band fill-warm-grey font-body" fontSize="9.5">{c.metricChips[0]}</text>
          <text x="318" y="144" textAnchor="end" className="hv-band fill-warm-grey font-body" fontSize="9.5">{c.metricChips[1]}</text>
        </svg>
        <Pill tone="terracotta" vivid className={`bottom-0 left-1/2 -translate-x-1/2 ${pillText}`}>{c.linkLabels[0]}</Pill>
      </Link>

      {/* 2 · Engineering */}
      <Link href="/engineering" aria-label={c.linkLabels[1]} className={`${OBJ} hv-obj`} style={mBox(20, 252, 320, 98)}>
        <Glow tone="sage" />
        <svg viewBox="0 0 320 98" className="relative h-full w-full overflow-visible" aria-hidden="true">
          <g className="hv-bracket">
            <text x="-2" y="58" className="fill-sage font-heading" fontSize="64" fillOpacity="0.32">{"{"}</text>
            <text x="322" y="58" textAnchor="end" className="fill-sage font-heading" fontSize="64" fillOpacity="0.32">{"}"}</text>
          </g>
          <path d="M106 28 H117 M203 28 H214" pathLength={1} strokeDasharray="1" className="hv-line stroke-sage" strokeWidth="1.25" />
          {c.systemNodes.map((label, i) => (
            <g key={i} className="hv-node">
              <rect x={20 + i * 97} y="12" width="86" height="32" rx="7" className="scene-node fill-ivory stroke-sage" strokeWidth="1" />
              <text x={63 + i * 97} y="31" textAnchor="middle" className="fill-sage-dark font-mono" fontSize="8.6">{label}</text>
            </g>
          ))}
        </svg>
        <Pill tone="sage" vivid={engineeringLeaning} className={`bottom-0 left-1/2 -translate-x-1/2 ${pillText}`}>{c.linkLabels[1]}</Pill>
      </Link>

      {/* 3 · AI + 4 · Resume — two thumb-sized tiles */}
      <Link href="/engineering#ai" aria-label={`${c.linkLabels[2]} — ${c.aiStatus}`} className={`${OBJ} hv-obj glass-card flex items-center gap-[2.5cqw] px-[2.5cqw]`} style={mBox(20, 362, 154, 70)}>
        <Glow tone="sage" />
        <svg viewBox="0 0 56 56" className="relative h-[13cqw] w-[13cqw] shrink-0" aria-hidden="true">
          <circle cx="28" cy="28" r="26" className="fill-ivory stroke-sage" strokeWidth="1.25" />
          <Wave cx={28} cy={28} scale={0.6} />
        </svg>
        <span className="relative flex min-w-0 flex-col items-start gap-[1cqw]">
          <span className="flex items-center gap-[1cqw] font-heading text-[4cqw] leading-none font-semibold text-charcoal">
            {c.linkLabels[2]} <span className="text-sage-dark"><Arrow /></span>
          </span>
          <span className="rounded-full bg-sage/20 px-[1.8cqw] py-[0.6cqw] font-body text-[2.2cqw] font-bold tracking-[0.08em] whitespace-nowrap text-sage-dark uppercase">{c.aiStatus}</span>
        </span>
      </Link>

      <a href={resumeUrl} download={resumeFileName} aria-label={`${c.linkLabels[3]} (${c.resumeMeta} download)`} className={`${OBJ} hv-obj glass-card flex items-center gap-[2.5cqw] px-[2.5cqw]`} style={mBox(186, 362, 154, 70)}>
        <Glow tone="terracotta" />
        <svg viewBox="0 0 140 160" className="relative h-[13cqw] w-[11.5cqw] shrink-0 overflow-visible" aria-hidden="true">
          <ResumeDoc x={0} y={0} s={1} />
        </svg>
        <span className="relative flex min-w-0 flex-col items-start gap-[1cqw]">
          <span className="font-heading text-[4cqw] leading-none font-semibold text-charcoal">{c.linkLabels[3]}</span>
          <span className="flex items-center gap-[0.8cqw] font-body text-[2.8cqw] font-semibold text-terracotta">
            {c.resumeMeta} <Arrow down />
          </span>
        </span>
      </a>

      {milestones.map((m, i) => (
        <div key={m.org} className="hv-mile absolute" style={mBox(i * 120, 458, 116, 44)}>
          <span className={`block font-body text-[2.4cqw] font-semibold tracking-[0.1em] uppercase ${m.current ? "text-terracotta" : "text-warm-grey"}`}>{m.date}</span>
          <span className="block font-heading text-[3.3cqw] leading-tight font-semibold text-charcoal">{m.org}</span>
        </div>
      ))}
    </div>
  );
}

/* ======================================================================== */

export function HeroScene({
  variant,
  ...props
}: Omit<SceneProps, "animated" | "counterRef"> & { variant: "desktop" | "mobile" }) {
  const reduced = usePrefersReducedMotion();
  const animated = !reduced;
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<SVGTextElement>(null);

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !animated) return;
    // Skip the intro for the composition that isn't displayed.
    if (root.offsetParent === null) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: "power3.out" } });
      tl.from(q(".hv-fade-in"), { opacity: 0, duration: 1.2 }, 0)
        .from(q(".hv-card"), { opacity: 0, y: 10, duration: 0.6 }, 0.05)
        .from(q(".hv-band"), { opacity: 0, x: variant === "desktop" ? -16 : 0, y: variant === "mobile" ? -12 : 0, duration: 0.7, stagger: 0.12 }, 0.15)
        .from(q(".hv-particles"), { opacity: 0, duration: 0.6 }, 0.4)
        .from(q(".hv-line"), { strokeDashoffset: 1, duration: 0.8, stagger: 0.07, ease: "power2.inOut" }, 0.7)
        .from(q(".hv-node"), { opacity: 0, y: 8, duration: 0.5, stagger: 0.08 }, 0.95)
        .from(q(".hv-bracket"), { opacity: 0, scale: 0.92, transformOrigin: "50% 50%", duration: 0.8 }, 1.05)
        .from(q(".scene-pill"), { opacity: 0, y: 6, duration: 0.5, stagger: 0.08 }, 1.2)
        .from(q(".hv-obj"), { y: 12, duration: 0.9, stagger: 0.1, clearProps: "transform" }, 0.15)
        .from(q(".hv-feedback"), { opacity: 0, duration: 0.8 }, 1.5)
        .from(q(".hv-mile"), { opacity: 0, y: 8, duration: 0.6, stagger: 0.08 }, 1.6);

      const counter = counterRef.current;
      if (counter) {
        const target = { v: 0 };
        const final = Number(counter.dataset.value);
        tl.to(target, {
          v: final,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            counter.textContent = Math.round(target.v).toLocaleString("en-IN");
          },
        }, 0.4);
      }
    }, root);
    return () => ctx.revert();
  }, [animated, variant]);

  // Pause SMIL + CSS loops whenever this composition isn't on screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !animated) return;
    const svg = root.querySelector<SVGSVGElement>(".hv-svg");
    const io = new IntersectionObserver(([entry]) => {
      const on = entry.isIntersecting;
      root.classList.toggle("hv-paused", !on);
      if (on) svg?.unpauseAnimations();
      else svg?.pauseAnimations();
    });
    io.observe(root);
    return () => io.disconnect();
  }, [animated]);

  const Scene = variant === "desktop" ? DesktopScene : MobileScene;
  return (
    <div ref={rootRef} className="relative">
      <Scene {...props} animated={animated} counterRef={counterRef} />
    </div>
  );
}
