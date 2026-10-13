"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { HeroVisualContent } from "@/lib/data/heroVisual";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { Avatar, Glow, OBJ, Particle, Pill, ResumeDoc, Robot, Arrow, box } from "@/components/home/sceneParts";

/**
 * Hero pantomime: a flat vector character walks up three career steps and,
 * without a word, works each station — tosses ad spend into the Jewar
 * funnel (→ /marketing), types the Pixel/CAPI → CRM → dashboard pipeline
 * into existence (→ /engineering), wakes an AI agent (→ /engineering#ai,
 * "coming soon"), then pulls the résumé out of the dashboard and holds it
 * out (→ PDF download). Then idles (breath, blink) and reacts to whatever
 * object the visitor hovers, focuses or taps.
 *
 * Every destination is a real <Link>/<a> that is present, visible and
 * clickable from the first frame — the story only changes how "lit" each
 * object is. SSR markup is the finished final pose; the timeline is built
 * in a layout effect (start pose set before paint) and plays after the
 * first frame, so the server-rendered h1 stays the LCP. Reduced motion,
 * or the composition that's display:none, never builds a timeline.
 */

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export type Milestone = { date: string; org: string; current: boolean };
type Target = "mkt" | "eng" | "ai" | "cv";

type Props = {
  c: HeroVisualContent;
  milestones: Milestone[];
  resumeUrl: string;
  resumeFileName: string;
  engineeringLeaning: boolean;
};

type CompositionProps = Props & {
  animated: boolean;
  react: (t: Target | null) => void;
};

/** Hover / focus / touch wiring that makes the avatar react to an object. */
const reactProps = (react: CompositionProps["react"], t: Target) => ({
  onPointerEnter: () => react(t),
  onPointerLeave: () => react(null),
  onPointerDown: () => react(t),
  onFocus: () => react(t),
  onBlur: () => react(null),
});

function Coin() {
  return (
    <g className="st-coin" opacity="0">
      <circle r="7" className="fill-terracotta" />
      <circle r="4.2" className="fill-none stroke-ivory" strokeWidth="1.3" strokeOpacity="0.8" />
    </g>
  );
}

function StepLabel({ m, className = "", style, big }: { m: Milestone; className?: string; style: React.CSSProperties; big?: boolean }) {
  return (
    <div className={`st-step absolute ${className}`} style={style}>
      <span className={`block font-body font-semibold uppercase ${big ? "text-[0.8cqw] tracking-[0.14em]" : "text-[2.3cqw] tracking-[0.1em]"} ${m.current ? "text-terracotta" : "text-warm-grey"}`}>
        {m.date}
      </span>
      <span className={`block font-heading leading-tight font-semibold text-charcoal ${big ? "text-[1.2cqw]" : "text-[3.2cqw]"}`}>{m.org}</span>
    </div>
  );
}

/* ======================================================================== */
/* Desktop — 1200 × 600. Three rising career steps, one station on each.    */
/* ======================================================================== */
const DW = 1200;
const DH = 600;
const dBox = (x: number, y: number, w: number, h: number) => box(DW, DH, x, y, w, h);
const D_STEPS = [
  { x0: 0, x1: 440, top: 520 },
  { x0: 440, x1: 830, top: 490 },
  { x0: 830, x1: 1200, top: 460 },
];
const D_AV = { a: [110, 520], b: [520, 490], c: [1035, 460] } as const;
// Funnel, local to its 220 × 270 box at (200, 200): points down.
const fHalf = (y: number) => 100 - 0.37 * (y - 40);
const F_BANDS = [
  [40, 104],
  [110, 170],
  [176, 240],
] as const;
const fBand = (t: number, b: number) => `M${110 - fHalf(t)} ${t} H${110 + fHalf(t)} L${110 + fHalf(b)} ${b} H${110 - fHalf(b)} Z`;
const D_PATHS = {
  lead: "M310 440 V455 H610 V278 H640",
  spine: "M725 296 V320",
  dash: "M810 338 H850",
  ai: "M925 230 V196 H1135 V300",
};

function DesktopComposition({ c, milestones, resumeUrl, resumeFileName, engineeringLeaning, animated, react }: CompositionProps) {
  const pill = "text-[1.05cqw]";
  return (
    <div className="relative aspect-[2/1] w-full">
      {/* Layer 1 — career steps, pipeline wiring, lead particles */}
      <svg viewBox={`0 0 ${DW} ${DH}`} className="st-svg absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {D_STEPS.map((s, i) => (
          <g key={i}>
            <rect x={s.x0} y={s.top} width={s.x1 - s.x0} height={DH - s.top} className="fill-ivory" />
            <path d={`M${s.x0} ${s.top} H${s.x1} ${i < 2 ? `V${D_STEPS[i + 1].top}` : ""}`} className="stroke-beige-border" strokeWidth="2" fill="none" />
          </g>
        ))}
        <path d={D_PATHS.lead} pathLength={1} strokeDasharray="1" className="st-line stroke-sage" strokeWidth="1.5" fill="none" />
        <path d={D_PATHS.spine} pathLength={1} strokeDasharray="1" className="st-line stroke-sage" strokeWidth="1.5" fill="none" />
        <path d={D_PATHS.dash} pathLength={1} strokeDasharray="1" className="st-line stroke-sage" strokeWidth="1.5" fill="none" />
        <path d={D_PATHS.ai} pathLength={1} strokeDasharray="1" className="st-line stroke-sage" strokeWidth="1.5" fill="none" />
        {animated && (
          <g className="st-particles">
            {[0, 1.1, 2.2].map((b) => (
              <Particle key={b} path={D_PATHS.lead} begin={b} dur={3.3} r={3.2} className="fill-terracotta" />
            ))}
            <Particle path={D_PATHS.dash} begin={0.6} dur={1.2} r={3} className="fill-sage-dark" />
            <Particle path={D_PATHS.ai} begin={1.4} dur={2.6} r={3} className="fill-sage-dark" />
          </g>
        )}
      </svg>

      {/* Layer 2 — the four destinations (+ the dashboard, a pointer-only twin of Engineering) */}
      <Link href="/marketing" aria-label={c.linkLabels[0]} className={`${OBJ} z-10`} style={dBox(200, 200, 220, 270)} {...reactProps(react, "mkt")}>
        <Glow tone="terracotta" />
        <Pill tone="terracotta" vivid className={`top-0 left-1/2 -translate-x-1/2 ${pill}`}>{c.linkLabels[0]}</Pill>
        <svg viewBox="0 0 220 270" className="relative h-full w-full overflow-visible" aria-hidden="true">
          {F_BANDS.map(([t, b], i) => (
            <g key={t}>
              <path d={fBand(t, b)} className="fill-ivory stroke-terracotta" strokeOpacity="0.5" strokeWidth="1.2" />
              <path d={fBand(t, b)} className="st-fill scene-band fill-terracotta" fillOpacity={[0.12, 0.24, 0.9][i]} />
              <g className="st-val">
                <text x="110" y={(t + b) / 2 - 6} textAnchor="middle" className={`font-body ${i === 2 ? "fill-ivory" : "fill-charcoal"}`} fillOpacity={i === 2 ? 0.9 : 0.6} fontSize="9" fontWeight="600" letterSpacing="1.8">
                  {c.stages[i].toUpperCase()}
                </text>
                <text x="110" y={(t + b) / 2 + 16} textAnchor="middle" className={`st-num font-heading tabular-nums ${i === 2 ? "fill-ivory" : "fill-charcoal"}`} fontSize={i === 2 ? 24 : 22} fontWeight="700" data-value={i === 2 ? c.leadsValue : undefined}>
                  {i === 2 ? c.leadsValue.toLocaleString("en-IN") : c.stageValues[i]}
                </text>
              </g>
            </g>
          ))}
          <text x="110" y="262" textAnchor="middle" className="st-val fill-warm-grey font-body" fontSize="10.5">
            {c.metricChips.join("  ·  ")}
          </text>
        </svg>
      </Link>

      <Link href="/engineering" aria-label={c.linkLabels[1]} className={`${OBJ} z-10`} style={dBox(455, 230, 375, 240)} {...reactProps(react, "eng")}>
        <Glow tone="sage" />
        <Pill tone="sage" vivid={engineeringLeaning} className={`top-0 left-[49%] ${pill}`}>{c.linkLabels[1]}</Pill>
        <svg viewBox="0 0 375 240" className="relative h-full w-full overflow-visible" aria-hidden="true">
          <text x="160" y="132" className="fill-sage font-heading" fontSize="118" fillOpacity="0.28">{"{"}</text>
          <text x="378" y="132" textAnchor="end" className="fill-sage font-heading" fontSize="118" fillOpacity="0.28">{"}"}</text>
          {c.systemNodes.slice(0, 2).map((label, i) => (
            <g key={i} className="st-node">
              <rect x="185" y={30 + i * 60} width="170" height="36" rx="9" className="scene-node fill-ivory stroke-sage" strokeWidth="1.4" />
              <text x="270" y={52.5 + i * 60} textAnchor="middle" className="fill-sage-dark font-mono" fontSize="11.5">{label}</text>
            </g>
          ))}
        </svg>
      </Link>

      <Link href="/engineering" tabIndex={-1} aria-hidden="true" className={`${OBJ} z-10`} style={dBox(845, 225, 160, 235)} {...reactProps(react, "eng")}>
        <svg viewBox="0 0 160 235" className="relative h-full w-full overflow-visible" aria-hidden="true">
          <rect x="74" y="115" width="12" height="116" className="fill-sage-dark" fillOpacity="0.5" />
          <ellipse cx="80" cy="232" rx="28" ry="4" className="fill-sage-dark" fillOpacity="0.5" />
          <g className="st-node">
            <rect x="5" y="5" width="150" height="110" rx="10" className="scene-node fill-ivory stroke-sage" strokeWidth="1.4" />
            <text x="80" y="24" textAnchor="middle" className="fill-sage-dark font-mono" fontSize="10.5">{c.systemNodes[2]}</text>
            {[34, 52, 44, 68, 60, 80].map((h, i) => (
              <rect key={i} x={22 + i * 20} y={100 - h} width="12" height={h} rx="2" className={`st-bar ${i === 5 ? "fill-terracotta" : "fill-sage"}`} fillOpacity={i === 5 ? 1 : 0.55} />
            ))}
          </g>
        </svg>
      </Link>

      <Link href="/engineering#ai" aria-label={`${c.linkLabels[2]} — ${c.aiStatus}`} className={`${OBJ} z-10`} style={dBox(1075, 290, 120, 170)} {...reactProps(react, "ai")}>
        <Glow tone="sage" />
        <Pill tone="sage" className={`-top-[2.4cqw] left-1/2 -translate-x-1/2 ${pill}`}>{c.linkLabels[2]}</Pill>
        <svg viewBox="0 0 120 170" className="relative h-full w-full overflow-visible" aria-hidden="true">
          <Robot y={10} />
          <rect x="22" y="122" width="76" height="16" rx="8" className="fill-ivory" fillOpacity="0.9" />
          <text x="60" y="133.5" textAnchor="middle" className="fill-sage-dark font-body" fontSize="8" fontWeight="700" letterSpacing="1.2">{c.aiStatus.toUpperCase()}</text>
        </svg>
      </Link>

      {/* Layer 3 — desk, character, coins (pointer-transparent) */}
      <svg viewBox={`0 0 ${DW} ${DH}`} className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible" aria-hidden="true">
        <Avatar x={D_AV.c[0]} y={D_AV.c[1]} pose="hold" />
        <g>
          <rect x="462" y="440" width="116" height="8" rx="3" className="fill-ivory stroke-beige-border" strokeWidth="1.5" />
          <rect x="470" y="448" width="6" height="42" className="fill-warm-grey" fillOpacity="0.5" />
          <rect x="564" y="448" width="6" height="42" className="fill-warm-grey" fillOpacity="0.5" />
          <rect x="486" y="398" width="70" height="42" rx="5" className="fill-sage-dark" />
          <text x="521" y="424" textAnchor="middle" className="st-logo fill-ivory font-mono" fontSize="13">{"</>"}</text>
        </g>
        {Array.from({ length: 6 }, (_, i) => <Coin key={i} />)}
      </svg>

      <a href={resumeUrl} download={resumeFileName} aria-label={`${c.linkLabels[3]} (${c.resumeMeta} download)`} className={`st-doc ${OBJ} z-30`} style={dBox(1003, 340, 64, 80)} {...reactProps(react, "cv")}>
        <Glow tone="terracotta" />
        <svg viewBox="0 0 140 160" className="relative h-full w-full overflow-visible drop-shadow-[0_8px_14px_rgb(43_38_34/0.18)]" aria-hidden="true">
          <ResumeDoc />
        </svg>
        <Pill tone="terracotta" down className={`top-full left-1/2 mt-[0.4cqw] -translate-x-1/2 ${pill}`}>{c.linkLabels[3]}</Pill>
      </a>

      {/* Spend + career labels */}
      <div className="st-spend glass-card absolute z-20 flex items-center justify-center rounded-full" style={dBox(28, 296, 168, 32)}>
        <span className="font-body text-[1cqw] font-semibold whitespace-nowrap text-terracotta">{c.spendLabel}</span>
      </div>
      <span className="absolute font-body text-[0.75cqw] font-semibold tracking-[0.18em] text-warm-grey/80 uppercase" style={dBox(24, 530, 200, 14)}>
        {c.careerLabel}
      </span>
      {milestones.slice(0, 3).map((m, i) => (
        <StepLabel key={m.org} m={m} big style={dBox(D_STEPS[i].x0 + 24, D_STEPS[i].top + (i === 0 ? 28 : 16), 300, 40)} />
      ))}
    </div>
  );
}

function buildDesktop(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const pos = q(".av-pos");
  const [armL, armR, legL, legR, head, eyes] = [".av-armL", ".av-armR", ".av-legL", ".av-legR", ".av-head", ".av-eyes"].map((s) => q(s));
  const coins = q(".st-coin");
  const fills = q(".st-fill");
  const vals = q(".st-val");
  const lines = q(".st-line");
  const nodes = q(".st-node");
  const steps = q(".st-step");
  const counter = q(".st-num[data-value]")[0] as unknown as SVGTextElement | undefined;

  gsap.set([armL, armR, legL, legR], { transformOrigin: "50% 0%" });
  gsap.set(head, { transformOrigin: "50% 100%" });
  gsap.set(pos, { x: -90, y: D_AV.a[1] });
  gsap.set(armL, { rotation: 8 });
  gsap.set(armR, { rotation: -8 });
  gsap.set(coins, { x: 138, y: 447, opacity: 0 });
  gsap.set(q(".st-spend"), { opacity: 0, y: 8 });
  gsap.set(fills, { opacity: 0.12 });
  gsap.set(vals, { opacity: 0.3 });
  gsap.set(lines, { strokeDashoffset: 1 });
  gsap.set(nodes, { opacity: 0.35 });
  gsap.set(q(".st-bar"), { scaleY: 0.08, transformOrigin: "50% 100%" });
  gsap.set(q(".st-particles"), { opacity: 0 });
  gsap.set(q(".rb-wave"), { opacity: 0, scaleY: 0.2, transformOrigin: "50% 50%" });
  gsap.set(q(".rb-eyes"), { opacity: 1 });
  gsap.set(q(".rb-bulb"), { opacity: 0.25 });
  gsap.set(q(".st-doc"), { xPercent: -117, yPercent: -112, scale: 0.45 });
  gsap.set(steps, { opacity: 0.35 });
  gsap.set(q(".st-logo"), { opacity: 0.35 });
  if (counter) counter.textContent = "0";

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
  const walk = (at: number, dur: number) => {
    const n = Math.max(3, Math.round(dur / 0.17) | 1);
    const d = dur / (n + 1);
    tl.to(legL, { rotation: 22, duration: d, yoyo: true, repeat: n, ease: "sine.inOut" }, at)
      .to(legR, { rotation: -22, duration: d, yoyo: true, repeat: n, ease: "sine.inOut" }, at);
  };

  // 1 · enter on the first career step
  tl.to(pos, { x: D_AV.a[0], duration: 1.1, ease: "power1.out" }, 0.1);
  walk(0.1, 1.1);
  tl.to(steps[0], { opacity: 1, duration: 0.4 }, 0.9);

  // 2 · marketing: dip into the bag, toss spend into the funnel
  tl.to(armR, { rotation: 0, duration: 0.25 }, 1.2).to(q(".st-spend"), { opacity: 1, y: 0, duration: 0.4 }, 1.25);
  for (let i = 0; i < 3; i++) {
    const t = 1.55 + i * 0.45;
    tl.to(armR, { rotation: -135, duration: 0.18 }, t).to(armR, { rotation: 0, duration: 0.24, ease: "power1.inOut" }, t + 0.2);
    for (let j = 0; j < 2; j++) {
      const k = i * 2 + j;
      tl.to(
        coins[k],
        {
          keyframes: [
            { x: 176, y: 355, opacity: 1, duration: 0.12 },
            { x: 238 + j * 22, y: 214 - j * 8, duration: 0.22, ease: "power1.out" },
            { x: 290 + k * 7, y: 250, duration: 0.2, ease: "power1.in" },
            { y: 292, opacity: 0, duration: 0.18 },
          ],
        },
        t + 0.1 + j * 0.06,
      );
    }
  }
  fills.forEach((f, i) => tl.to(f, { opacity: 1, duration: 0.4 }, 2.0 + i * 0.32));
  vals.forEach((v, i) => tl.to(v, { opacity: 1, duration: 0.4 }, 2.05 + i * 0.32));
  if (counter) {
    const n = { v: 0 };
    const final = Number(counter.dataset.value);
    tl.to(n, { v: final, duration: 1, ease: "power1.out", onUpdate: () => void (counter.textContent = Math.round(n.v).toLocaleString("en-IN")) }, 2.6);
  }
  tl.to(armR, { rotation: -8, duration: 0.3 }, 3.0)
    .to(lines[0], { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 2.9)
    .to(q(".st-particles"), { opacity: 1, duration: 0.5 }, 3.2);

  // 3 · walk up to the desk
  tl.to(pos, { x: D_AV.b[0], duration: 1.3, ease: "power1.inOut" }, 3.6).to(pos, { y: D_AV.b[1], duration: 0.25 }, 4.45);
  walk(3.6, 1.3);
  tl.to(steps[1], { opacity: 1, duration: 0.4 }, 4.6);

  // 4 · engineering: type the pipeline into existence
  tl.to(armL, { rotation: -32, duration: 0.2 }, 5.0).to(armR, { rotation: 32, duration: 0.2 }, 5.0);
  tl.to(armL, { rotation: -24, duration: 0.07, yoyo: true, repeat: 13, ease: "none" }, 5.2)
    .to(armR, { rotation: 24, duration: 0.07, yoyo: true, repeat: 13, ease: "none" }, 5.24)
    .to(head, { rotation: 4, duration: 0.25, yoyo: true, repeat: 3, ease: "sine.inOut" }, 5.1)
    .to(q(".st-logo"), { opacity: 1, duration: 0.3 }, 5.15)
    .to(nodes[0], { opacity: 1, duration: 0.35 }, 5.2)
    .to(lines[1], { strokeDashoffset: 0, duration: 0.3 }, 5.5)
    .to(nodes[1], { opacity: 1, duration: 0.35 }, 5.65)
    .to(lines[2], { strokeDashoffset: 0, duration: 0.3 }, 5.95)
    .to(nodes[2], { opacity: 1, duration: 0.35 }, 6.1)
    .to(q(".st-bar"), { scaleY: 1, duration: 0.45, stagger: 0.06 }, 6.15)
    .to(armL, { rotation: 8, duration: 0.3 }, 6.4)
    .to(armR, { rotation: -8, duration: 0.3 }, 6.4);

  // 5 · walk on to the top step
  tl.to(pos, { x: D_AV.c[0], duration: 1.3, ease: "power1.inOut" }, 6.6).to(pos, { y: D_AV.c[1], duration: 0.25 }, 7.15);
  walk(6.6, 1.3);
  tl.to(steps[2], { opacity: 1, duration: 0.4 }, 7.4);

  // 6 · AI: tap the agent awake
  tl.to(eyes, { x: 3, duration: 0.2 }, 7.9)
    .to(armR, { rotation: -78, duration: 0.25 }, 7.95)
    .to(lines[3], { strokeDashoffset: 0, duration: 0.45 }, 8.0)
    .to(q(".rb-bulb"), { opacity: 1, duration: 0.15, yoyo: true, repeat: 3 }, 8.15)
    .to(q(".rb-eyes"), { opacity: 0, duration: 0.2 }, 8.2)
    .to(q(".rb-wave"), { opacity: 1, scaleY: 1, duration: 0.4, ease: "back.out(2)" }, 8.25)
    .to(armR, { rotation: -8, duration: 0.3 }, 8.4);

  // 7 · résumé: pull it from the dashboard, hold it out to the visitor
  tl.to(eyes, { x: -3, duration: 0.2 }, 8.5)
    .to(armL, { rotation: 82, duration: 0.3 }, 8.55)
    .to(q(".st-doc"), { xPercent: -95, yPercent: -48, scale: 0.6, duration: 0.35, ease: "power1.inOut" }, 8.8)
    .to(armL, { rotation: -40, duration: 0.45, ease: "power2.inOut" }, 9.15)
    .to(armR, { rotation: 40, duration: 0.45, ease: "power2.inOut" }, 9.15)
    .to(q(".st-doc"), { xPercent: 0, yPercent: 0, scale: 1, duration: 0.5, ease: "back.out(1.4)" }, 9.2)
    .to(eyes, { x: 0, duration: 0.2 }, 9.4)
    .to(head, { rotation: 7, duration: 0.14, yoyo: true, repeat: 1 }, 9.65);
  return tl;
}

/* ======================================================================== */
/* Mobile — 360 × 496, vertical. Fewer beats: arrive, toss, build, wake,    */
/* wave. Career steps sit underneath as a static staircase that lights up.  */
/* ======================================================================== */
const MW = 360;
const MH = 496;
const mBox = (x: number, y: number, w: number, h: number) => box(MW, MH, x, y, w, h);
const M_AV = [285, 232] as const;
const mHalf = (y: number) => 96 - 0.388 * (y - 6);
const M_BANDS = [
  [6, 62],
  [68, 120],
  [126, 176],
] as const;
const mBand = (t: number, b: number) => `M${100 - mHalf(t)} ${t} H${100 + mHalf(t)} L${100 + mHalf(b)} ${b} H${100 - mHalf(b)} Z`;
const M_STEPS = [
  { x0: 0, x1: 120, top: 450 },
  { x0: 120, x1: 240, top: 432 },
  { x0: 240, x1: 360, top: 414 },
];
const M_PATHS = {
  lead: "M100 202 V208 H10 V262 H26",
  ai: "M73 278 V328",
  cv: "M287 278 V328",
};

function MobileComposition({ c, milestones, resumeUrl, resumeFileName, engineeringLeaning, animated, react }: CompositionProps) {
  const pill = "text-[3.2cqw]";
  return (
    <div className="relative w-full" style={{ aspectRatio: `${MW} / ${MH}` }}>
      <svg viewBox={`0 0 ${MW} ${MH}`} className="st-svg absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        {M_STEPS.map((s, i) => (
          <g key={i}>
            <rect x={s.x0} y={s.top} width={s.x1 - s.x0} height={MH - s.top} className="fill-ivory" />
            <path d={`M${s.x0} ${s.top} H${s.x1} ${i < 2 ? `V${M_STEPS[i + 1].top}` : ""}`} className="stroke-beige-border" strokeWidth="1.5" fill="none" />
          </g>
        ))}
        {Object.values(M_PATHS).map((d) => (
          <path key={d} d={d} pathLength={1} strokeDasharray="1" className="st-line stroke-sage" strokeWidth="1.25" fill="none" />
        ))}
        {animated && (
          <g className="st-particles">
            <Particle path={M_PATHS.lead} begin={0} dur={2.4} r={2.6} className="fill-terracotta" />
            <Particle path={M_PATHS.lead} begin={1.2} dur={2.4} r={2.6} className="fill-terracotta" />
            <Particle path={M_PATHS.ai} begin={0.5} dur={1.3} r={2.4} className="fill-sage-dark" />
            <Particle path={M_PATHS.cv} begin={1.1} dur={1.3} r={2.4} className="fill-sage-dark" />
          </g>
        )}
      </svg>

      <Link href="/marketing" aria-label={c.linkLabels[0]} className={`${OBJ} z-10`} style={mBox(0, 26, 200, 200)} {...reactProps(react, "mkt")}>
        <Glow tone="terracotta" />
        <svg viewBox="0 0 200 200" className="relative h-full w-full overflow-visible" aria-hidden="true">
          {M_BANDS.map(([t, b], i) => (
            <g key={t}>
              <path d={mBand(t, b)} className="fill-ivory stroke-terracotta" strokeOpacity="0.5" strokeWidth="1" />
              <path d={mBand(t, b)} className="st-fill scene-band fill-terracotta" fillOpacity={[0.12, 0.24, 0.9][i]} />
              <g className="st-val">
                <text x="100" y={(t + b) / 2 - 5} textAnchor="middle" className={`font-body ${i === 2 ? "fill-ivory" : "fill-charcoal"}`} fillOpacity={i === 2 ? 0.9 : 0.6} fontSize="8" fontWeight="600" letterSpacing="1.4">
                  {c.stages[i].toUpperCase()}
                </text>
                <text x="100" y={(t + b) / 2 + 13} textAnchor="middle" className={`st-num font-heading tabular-nums ${i === 2 ? "fill-ivory" : "fill-charcoal"}`} fontSize="17" fontWeight="700" data-value={i === 2 ? c.leadsValue : undefined}>
                  {i === 2 ? c.leadsValue.toLocaleString("en-IN") : c.stageValues[i]}
                </text>
              </g>
            </g>
          ))}
          <text x="2" y="150" className="st-val fill-warm-grey font-body" fontSize="8.5">{c.metricChips[0]}</text>
          <text x="198" y="150" textAnchor="end" className="st-val fill-warm-grey font-body" fontSize="8.5">{c.metricChips[1]}</text>
        </svg>
        <Pill tone="terracotta" vivid className={`bottom-0 left-1/2 -translate-x-1/2 ${pill}`}>{c.linkLabels[0]}</Pill>
      </Link>

      <Link href="/engineering" aria-label={c.linkLabels[1]} className={`${OBJ} z-10`} style={mBox(0, 240, 360, 76)} {...reactProps(react, "eng")}>
        <Glow tone="sage" />
        <svg viewBox="0 0 360 76" className="relative h-full w-full overflow-visible" aria-hidden="true">
          <text x="0" y="40" className="fill-sage font-heading" fontSize="50" fillOpacity="0.3">{"{"}</text>
          <text x="360" y="40" textAnchor="end" className="fill-sage font-heading" fontSize="50" fillOpacity="0.3">{"}"}</text>
          <path d="M120 22 H133 M227 22 H240" className="st-line stroke-sage" pathLength={1} strokeDasharray="1" strokeWidth="1.25" />
          {c.systemNodes.map((label, i) => (
            <g key={i} className="st-node">
              <rect x={26 + i * 107} y="6" width="94" height="32" rx="7" className="scene-node fill-ivory stroke-sage" strokeWidth="1" />
              <text x={73 + i * 107} y="25" textAnchor="middle" className="fill-sage-dark font-mono" fontSize="8.8">{label}</text>
            </g>
          ))}
        </svg>
        <Pill tone="sage" vivid={engineeringLeaning} className={`bottom-0 left-1/2 -translate-x-1/2 ${pill}`}>{c.linkLabels[1]}</Pill>
      </Link>

      <Link href="/engineering#ai" aria-label={`${c.linkLabels[2]} — ${c.aiStatus}`} className={`${OBJ} glass-card z-10 flex items-center gap-[2.5cqw] px-[2.5cqw]`} style={mBox(0, 328, 172, 70)} {...reactProps(react, "ai")}>
        <Glow tone="sage" />
        <svg viewBox="0 0 120 170" className="relative h-[16cqw] w-[11.5cqw] shrink-0 overflow-visible" aria-hidden="true">
          <Robot />
        </svg>
        <span className="relative flex min-w-0 flex-col items-start gap-[1.2cqw]">
          <span className="flex items-center gap-[1cqw] font-heading text-[4cqw] leading-none font-semibold text-charcoal">
            {c.linkLabels[2]} <span className="text-sage-dark"><Arrow /></span>
          </span>
          <span className="rounded-full bg-sage/20 px-[1.8cqw] py-[0.6cqw] font-body text-[2.2cqw] font-bold tracking-[0.08em] whitespace-nowrap text-sage-dark uppercase">{c.aiStatus}</span>
        </span>
      </Link>

      <a href={resumeUrl} download={resumeFileName} aria-label={`${c.linkLabels[3]} (${c.resumeMeta} download)`} className={`st-doc ${OBJ} glass-card z-10 flex items-center gap-[2.5cqw] px-[2.5cqw]`} style={mBox(188, 328, 172, 70)} {...reactProps(react, "cv")}>
        <Glow tone="terracotta" />
        <svg viewBox="0 0 140 160" className="relative h-[13cqw] w-[11.5cqw] shrink-0 overflow-visible" aria-hidden="true">
          <ResumeDoc />
        </svg>
        <span className="relative flex min-w-0 flex-col items-start gap-[1.2cqw]">
          <span className="font-heading text-[4cqw] leading-none font-semibold text-charcoal">{c.linkLabels[3]}</span>
          <span className="flex items-center gap-[0.8cqw] font-body text-[2.8cqw] font-semibold text-terracotta">
            {c.resumeMeta} <Arrow down />
          </span>
        </span>
      </a>

      <svg viewBox={`0 0 ${MW} ${MH}`} className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible" aria-hidden="true">
        <Avatar x={M_AV[0]} y={M_AV[1]} s={0.82} pose="rest" />
        {Array.from({ length: 4 }, (_, i) => <Coin key={i} />)}
      </svg>

      <div className="st-spend glass-card absolute z-20 flex items-center justify-center rounded-full" style={mBox(214, 30, 144, 28)}>
        <span className="font-body text-[3cqw] font-semibold whitespace-nowrap text-terracotta">{c.spendLabel}</span>
      </div>
      <span className="absolute font-body text-[2.2cqw] font-semibold tracking-[0.16em] text-warm-grey/80 uppercase" style={mBox(4, 434, 112, 14)}>
        {c.careerLabel}
      </span>
      {milestones.slice(0, 3).map((m, i) => (
        <StepLabel key={m.org} m={m} style={mBox(M_STEPS[i].x0 + 5, M_STEPS[i].top + 5, 112, 60)} />
      ))}
    </div>
  );
}

function buildMobile(root: HTMLElement) {
  const q = gsap.utils.selector(root);
  const pos = q(".av-pos");
  const [armL, armR, legL, legR, head, eyes, look] = [".av-armL", ".av-armR", ".av-legL", ".av-legR", ".av-head", ".av-eyes", ".av-look"].map((s) => q(s));
  const coins = q(".st-coin");
  const lines = q(".st-line");
  const nodes = q(".st-node");
  const counter = q(".st-num[data-value]")[0] as unknown as SVGTextElement | undefined;

  gsap.set([armL, armR, legL, legR], { transformOrigin: "50% 0%" });
  gsap.set([head, look], { transformOrigin: "50% 100%" });
  gsap.set(pos, { x: 420, y: M_AV[1] });
  gsap.set(coins, { x: 300, y: 160, opacity: 0 });
  gsap.set(q(".st-spend"), { opacity: 0, y: 6 });
  gsap.set(q(".st-fill"), { opacity: 0.12 });
  gsap.set(q(".st-val"), { opacity: 0.3 });
  gsap.set(lines, { strokeDashoffset: 1 });
  gsap.set(nodes, { opacity: 0.35 });
  gsap.set(q(".st-particles"), { opacity: 0 });
  gsap.set(q(".rb-wave"), { opacity: 0, scaleY: 0.2, transformOrigin: "50% 50%" });
  gsap.set(q(".rb-eyes"), { opacity: 1 });
  gsap.set(q(".rb-bulb"), { opacity: 0.25 });
  gsap.set(q(".st-doc"), { scale: 0.9, opacity: 0.55 });
  gsap.set(q(".st-step"), { opacity: 0.35 });
  if (counter) counter.textContent = "0";

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
  tl.to(pos, { x: M_AV[0], duration: 0.8, ease: "power1.out" }, 0.1)
    .to(legL, { rotation: 20, duration: 0.15, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0.1)
    .to(legR, { rotation: -20, duration: 0.15, yoyo: true, repeat: 5, ease: "sine.inOut" }, 0.1)
    .to(armR, { rotation: 0, duration: 0.2 }, 0.95)
    .to(q(".st-spend"), { opacity: 1, y: 0, duration: 0.4 }, 1.0)
    .to(eyes, { x: -3, duration: 0.2 }, 1.1)
    .to(look, { rotation: -6, duration: 0.3 }, 1.1);
  for (let i = 0; i < 2; i++) {
    const t = 1.3 + i * 0.45;
    tl.to(armL, { rotation: 128, duration: 0.18 }, t).to(armL, { rotation: 20, duration: 0.24 }, t + 0.2);
    for (let j = 0; j < 2; j++) {
      const k = i * 2 + j;
      tl.to(coins[k], {
        keyframes: [
          { x: 228, y: 100, opacity: 1, duration: 0.1 },
          { x: 168 - j * 14, y: 8, duration: 0.22, ease: "power1.out" },
          { x: 96 + k * 6, y: 34, duration: 0.2, ease: "power1.in" },
          { y: 62, opacity: 0, duration: 0.16 },
        ],
      }, t + 0.08 + j * 0.06);
    }
  }
  q(".st-fill").forEach((f, i) => tl.to(f, { opacity: 1, duration: 0.35 }, 1.6 + i * 0.28));
  q(".st-val").forEach((v, i) => tl.to(v, { opacity: 1, duration: 0.35 }, 1.65 + Math.min(i, 3) * 0.28));
  if (counter) {
    const n = { v: 0 };
    const final = Number(counter.dataset.value);
    tl.to(n, { v: final, duration: 0.9, ease: "power1.out", onUpdate: () => void (counter.textContent = Math.round(n.v).toLocaleString("en-IN")) }, 2.1);
  }
  // build: look down, point at the pipeline as it assembles
  tl.to(armR, { rotation: -8, duration: 0.2 }, 2.6)
    .to(look, { rotation: 0, duration: 0.3 }, 2.8)
    .to(eyes, { x: -2, y: 3, duration: 0.25 }, 2.8)
    .to(armL, { rotation: 38, duration: 0.3 }, 2.85)
    .to(lines[0], { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" }, 2.9)
    .to(q(".st-particles"), { opacity: 1, duration: 0.4 }, 3.2)
    .to(nodes, { opacity: 1, duration: 0.3, stagger: 0.2 }, 3.25)
    .to(lines[3], { strokeDashoffset: 0, duration: 0.4 }, 3.5)
    // wake the agent
    .to(lines[1], { strokeDashoffset: 0, duration: 0.35 }, 3.9)
    .to(q(".rb-bulb"), { opacity: 1, duration: 0.15, yoyo: true, repeat: 3 }, 4.1)
    .to(q(".rb-eyes"), { opacity: 0, duration: 0.2 }, 4.15)
    .to(q(".rb-wave"), { opacity: 1, scaleY: 1, duration: 0.4, ease: "back.out(2)" }, 4.2)
    // hand over the résumé, then wave hello
    .to(lines[2], { strokeDashoffset: 0, duration: 0.35 }, 4.4)
    .to(q(".st-doc"), { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, 4.6)
    .to(armL, { rotation: 8, duration: 0.3 }, 4.6)
    .to(eyes, { x: 0, y: 0, duration: 0.25 }, 4.7)
    .to(armR, { rotation: -150, duration: 0.25 }, 4.85)
    .to(armR, { rotation: -125, duration: 0.16, yoyo: true, repeat: 3, ease: "sine.inOut" }, 5.1)
    .to(armR, { rotation: -8, duration: 0.3 }, 5.75)
    .to(q(".st-step"), { opacity: 1, duration: 0.35, stagger: 0.15 }, 5.0);
  return tl;
}

/* ======================================================================== */

/** Avatar reactions to hovered/focused/tapped objects, per composition. */
const POSES: Record<"desktop" | "mobile", { base: [number, number]; to: Record<Target, { eyes: [number, number]; look: number; armL?: number; armR?: number; nod?: boolean }> }> = {
  desktop: {
    base: [-40, 40],
    to: {
      mkt: { eyes: [-3.5, -1], look: -8, armL: 112 },
      eng: { eyes: [-3, 0], look: -5, armL: 92 },
      ai: { eyes: [3.5, 0], look: 6, armR: -96 },
      cv: { eyes: [0, 2], look: 0, nod: true },
    },
  },
  mobile: {
    base: [8, -8],
    to: {
      mkt: { eyes: [-3.5, -1], look: -8, armL: 112 },
      eng: { eyes: [-2, 3], look: -3, armL: 40 },
      ai: { eyes: [-3, 3], look: -6, armL: 30 },
      cv: { eyes: [0, 2], look: 0, nod: true },
    },
  },
};

export function HeroStory({ variant, ...props }: Props & { variant: "desktop" | "mobile" }) {
  const controlLabels = props.c.controlLabels;
  const reduced = usePrefersReducedMotion();
  const animated = !reduced;
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const idleRef = useRef<gsap.core.Animation[]>([]);
  const [phase, setPhase] = useState<"static" | "playing" | "done">("static");

  const stopIdle = () => {
    idleRef.current.forEach((a) => a.kill());
    idleRef.current = [];
    const q = gsap.utils.selector(rootRef.current);
    gsap.set(q(".av-body"), { scaleY: 1 });
    gsap.set(q(".av-head"), { rotation: 0 });
    gsap.set(q(".av-lid"), { scaleY: 1 });
  };

  const startIdle = () => {
    stopIdle();
    const q = gsap.utils.selector(rootRef.current);
    idleRef.current = [
      gsap.to(q(".av-body"), { scaleY: 1.014, transformOrigin: "50% 100%", duration: 1.7, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.timeline({ repeat: -1, repeatDelay: 3.1, delay: 0.8 }).to(q(".av-lid"), { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.07, yoyo: true, repeat: 1 }),
      gsap.to(q(".av-head"), { rotation: 3, transformOrigin: "50% 100%", duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.2 }),
    ];
  };

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    // matchMedia read directly: on hydration the hook's server snapshot
    // still says "no preference", and a reduced-motion visitor must never
    // see even one frame of the start pose.
    if (!root || !animated || root.offsetParent === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const counter = root.querySelector<SVGTextElement>(".st-num[data-value]");
    const ctx = gsap.context(() => {
      const tl = variant === "desktop" ? buildDesktop(root) : buildMobile(root);
      tl.eventCallback("onComplete", () => {
        setPhase("done");
        startIdle();
      });
      tlRef.current = tl;
    }, root);
    setPhase("playing");
    // Play after the first frame has painted (keeps the h1 the LCP) — and,
    // on a full page load, only once the branded preloader has left.
    let raf2 = 0;
    const play = () => {
      raf2 = requestAnimationFrame(() => tlRef.current?.play());
    };
    const raf1 = requestAnimationFrame(() => {
      if (document.querySelector("[data-preloader]")) window.addEventListener("preloader:done", play, { once: true });
      else play();
    });
    return () => {
      window.removeEventListener("preloader:done", play);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      stopIdle();
      ctx.revert();
      if (counter) counter.textContent = Number(counter.dataset.value).toLocaleString("en-IN");
      tlRef.current = null;
      setPhase("static");
    };
  }, [animated, variant]);

  // Pause SMIL particles, CSS loops and the idle loop while off-screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !animated) return;
    const svg = root.querySelector<SVGSVGElement>(".st-svg");
    const io = new IntersectionObserver(([entry]) => {
      const on = entry.isIntersecting;
      root.classList.toggle("hv-paused", !on);
      if (on) svg?.unpauseAnimations();
      else svg?.pauseAnimations();
      idleRef.current.forEach((a) => (on ? a.resume() : a.pause()));
    });
    io.observe(root);
    return () => io.disconnect();
  }, [animated]);

  const react = (t: Target | null) => {
    if (phase !== "done" || !rootRef.current) return;
    const q = gsap.utils.selector(rootRef.current);
    const { base, to } = POSES[variant];
    const p = t ? to[t] : null;
    const opts = { duration: 0.35, ease: "power2.out", overwrite: "auto" as const };
    gsap.to(q(".av-eyes"), { x: p?.eyes[0] ?? 0, y: p?.eyes[1] ?? 0, ...opts });
    gsap.to(q(".av-look"), { rotation: p?.look ?? 0, transformOrigin: "50% 100%", ...opts });
    gsap.to(q(".av-armL"), { rotation: p?.armL ?? base[0], ...opts });
    gsap.to(q(".av-armR"), { rotation: p?.armR ?? base[1], ...opts });
    if (p?.nod) gsap.to(q(".av-look"), { rotation: 8, duration: 0.14, yoyo: true, repeat: 3, ease: "sine.inOut", overwrite: "auto" });
  };

  const skip = () => tlRef.current?.progress(1);
  const replay = () => {
    stopIdle();
    const q = gsap.utils.selector(rootRef.current);
    gsap.set([q(".av-eyes"), q(".av-look")], { x: 0, y: 0, rotation: 0 });
    setPhase("playing");
    tlRef.current?.restart();
  };

  const Composition = variant === "desktop" ? DesktopComposition : MobileComposition;
  return (
    <div ref={rootRef} className="relative">
      {phase !== "static" && (
        <button
          type="button"
          onClick={phase === "playing" ? skip : replay}
          className={`absolute top-0 z-40 ${variant === "desktop" ? "right-0" : "left-0"} inline-flex items-center gap-1.5 rounded-full border border-beige-border bg-ivory/80 px-3 py-1.5 font-body text-xs font-medium text-warm-grey backdrop-blur-sm transition-colors hover:border-sage hover:text-sage-dark focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none`}
        >
          <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
            {phase === "playing" ? (
              <path d="M2 2.5 6.5 6 2 9.5Z M6.5 2.5 11 6 6.5 9.5Z" className="fill-current" />
            ) : (
              <path d="M2.5 6a3.5 3.5 0 1 0 1.2-2.6M2.5 1.5v2.2h2.2" className="fill-none stroke-current" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
          {phase === "playing" ? controlLabels[0] : controlLabels[1]}
        </button>
      )}
      <Composition {...props} animated={animated} react={react} />
    </div>
  );
}
