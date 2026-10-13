"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { HeroVisualContent } from "@/lib/data/heroVisual";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { Ambient, Arrow, Avatar, Glow, Liquid, OBJ, Particle, Pill, ResumeDoc, Robot, Spark, StatusBadge, box } from "@/components/home/sceneParts";

/**
 * Hero pantomime — wordless. A headset-wearing character climbs three
 * career steps: tosses ad spend into the Jewar funnel (it fills like
 * liquid) — but the Leads band stays empty and the Pixel node throws an
 * "event not firing" flag. At the laptop (camera pushes in) the character
 * debugs it: code types out, the screen flips to a mini dashboard, the
 * flag turns to a check, and only then does the lead counter run. A robot
 * agent wakes, waves and high-fives; the character pulls the résumé from
 * the dashboard and holds it out. Then idles, follows the cursor with its
 * eyes, and reacts (with the object) to every hover/focus/tap.
 *
 * The four destinations are real <Link>/<a>s, visible and clickable from
 * the first frame. SSR markup is the finished final pose; the timeline is
 * built before paint (start pose) and played after the first frame and
 * after the preloader, so the server-rendered h1 stays the LCP. Reduced
 * motion / the display:none composition never build a timeline.
 */

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export type Milestone = { date: string; org: string; current: boolean };
type Target = "mkt" | "eng" | "ai" | "cv";
type Q = (s: string) => Element[];

type Props = {
  c: HeroVisualContent;
  milestones: Milestone[];
  resumeUrl: string;
  resumeFileName: string;
  engineeringLeaning: boolean;
};
type CompositionProps = Props & { animated: boolean; react: (t: Target | null) => void };

const reactProps = (react: CompositionProps["react"], t: Target) => ({
  onPointerEnter: () => react(t),
  onPointerLeave: () => react(null),
  onPointerDown: () => react(t),
  onFocus: () => react(t),
  onBlur: () => react(null),
});

/* ---------------------------------------------------------------- face -- */
type Expr = "neutral" | "delight" | "focus" | "worried" | "curious" | "proud";
const EXPR: Record<Expr, { m: string; yL: number; yR: number; rL: number; rR: number }> = {
  neutral: { m: "smile", yL: 0, yR: 0, rL: 0, rR: 0 },
  delight: { m: "open", yL: -3.5, yR: -3.5, rL: 0, rR: 0 },
  focus: { m: "flat", yL: 1.5, yR: 1.5, rL: 12, rR: -12 },
  worried: { m: "o", yL: -1.5, yR: -1.5, rL: -14, rR: 14 },
  curious: { m: "o", yL: -4.5, yR: 0, rL: -8, rR: 0 },
  proud: { m: "grin", yL: -1.5, yR: -1.5, rL: 0, rR: 0 },
};
const MOUTHS = ".av-m-smile,.av-m-open,.av-m-flat,.av-m-o,.av-m-grin";

function setFace(q: Q, e: Expr) {
  const x = EXPR[e];
  gsap.set(q(MOUTHS), { opacity: 0 });
  gsap.set(q(`.av-m-${x.m}`), { opacity: 1 });
  gsap.to(q(".av-brL"), { y: x.yL, rotation: x.rL, transformOrigin: "50% 50%", duration: 0.2, overwrite: "auto" });
  gsap.to(q(".av-brR"), { y: x.yR, rotation: x.rR, transformOrigin: "50% 50%", duration: 0.2, overwrite: "auto" });
}

/** Timeline helpers shared by both compositions. */
function rig(q: Q, tl: gsap.core.Timeline) {
  const face = (e: Expr, at: number) => {
    const x = EXPR[e];
    tl.set(q(MOUTHS), { opacity: 0 }, at)
      .set(q(`.av-m-${x.m}`), { opacity: 1 }, at)
      .to(q(".av-brL"), { y: x.yL, rotation: x.rL, duration: 0.18 }, at)
      .to(q(".av-brR"), { y: x.yR, rotation: x.rR, duration: 0.18 }, at);
  };
  const walk = (at: number, dur: number) => {
    const n = Math.max(3, Math.round(dur / 0.17) | 1);
    const d = dur / (n + 1);
    tl.to(q(".av-legL"), { rotation: 22, duration: d, yoyo: true, repeat: n, ease: "sine.inOut" }, at)
      .to(q(".av-legR"), { rotation: -22, duration: d, yoyo: true, repeat: n, ease: "sine.inOut" }, at)
      .to(q(".av-look"), { rotation: 3, duration: dur / 2, yoyo: true, repeat: 1, ease: "sine.inOut" }, at);
  };
  /** Anticipation crouch → jump → squash on landing → recover. */
  const hop = (at: number, h = 16, arms = false) => {
    const pos = q(".av-pos");
    const body = q(".av-body");
    tl.to(body, { scaleY: 0.93, scaleX: 1.04, duration: 0.1 }, at)
      .to(pos, { y: `-=${h}`, duration: 0.2, ease: "power2.out" }, at + 0.1)
      .to(body, { scaleY: 1.05, scaleX: 0.97, duration: 0.12 }, at + 0.1)
      .to(pos, { y: `+=${h}`, duration: 0.17, ease: "power2.in" }, at + 0.3)
      .to(body, { scaleY: 0.92, scaleX: 1.05, duration: 0.07 }, at + 0.47)
      .to(body, { scaleY: 1, scaleX: 1, duration: 0.35, ease: "elastic.out(1,0.45)" }, at + 0.54);
    if (arms) tl.to(q(".av-armL"), { rotation: 160, duration: 0.18 }, at + 0.08).to(q(".av-armR"), { rotation: -160, duration: 0.18 }, at + 0.1);
  };
  /** Coin with squash & stretch: arc → hit the rim → bounce → drop in → sink. */
  const coin = (el: Element, at: number, from: [number, number], peak: [number, number], rim: [number, number], into: [number, number]) => {
    tl.to(
      el,
      {
        keyframes: [
          { x: from[0], y: from[1], opacity: 1, scaleX: 1, scaleY: 1, duration: 0.06 },
          { x: peak[0], y: peak[1], scaleX: 0.82, scaleY: 1.22, duration: 0.24, ease: "power1.out" },
          { x: rim[0], y: rim[1], scaleX: 0.85, scaleY: 1.2, duration: 0.2, ease: "power1.in" },
          { scaleX: 1.4, scaleY: 0.6, duration: 0.05 },
          { x: (rim[0] + into[0]) / 2, y: rim[1] - 13, scaleX: 1, scaleY: 1, duration: 0.15, ease: "power1.out" },
          { x: into[0], y: into[1], scaleX: 0.9, scaleY: 1.12, duration: 0.15, ease: "power1.in" },
          { y: into[1] + 14, scaleX: 1.2, scaleY: 0.7, opacity: 0, duration: 0.14 },
        ],
      },
      at,
    );
  };
  const counter = (at: number, dur: number) => {
    const el = q(".st-num[data-value]")[0];
    if (!el) return;
    const n = { v: 0 };
    const final = Number((el as SVGElement).dataset.value);
    tl.to(n, { v: final, duration: dur, ease: "power1.out", onUpdate: () => void (el.textContent = Math.round(n.v).toLocaleString("en-IN")) }, at);
  };
  return { face, walk, hop, coin, counter };
}

/** Start pose shared by both compositions (everything the story "builds"). */
function startPose(q: Q) {
  gsap.set(q(".av-armL,.av-armR,.av-legL,.av-legR,.rb-arm"), { transformOrigin: "50% 0%" });
  gsap.set(q(".av-head,.av-look,.av-body"), { transformOrigin: "50% 100%" });
  gsap.set(q(".av-brL,.av-brR"), { transformOrigin: "50% 50%" });
  gsap.set(q(".av-armL"), { rotation: 8 });
  gsap.set(q(".av-armR"), { rotation: -8 });
  setFace(q, "neutral");
  gsap.set(q(".st-coin"), { opacity: 0 });
  gsap.set(q(".st-spend"), { opacity: 0, y: 8 });
  q(".st-liquid").forEach((l) => gsap.set(l, { y: 90 }));
  gsap.set(q(".st-val"), { opacity: 0.3 });
  gsap.set(q(".st-line"), { strokeDashoffset: 1 });
  gsap.set(q(".st-node"), { opacity: 0.35 });
  gsap.set(q(".st-particles"), { opacity: 0 });
  gsap.set(q(".st-err"), { opacity: 0, scale: 0, transformOrigin: "50% 50%" });
  gsap.set(q(".st-ok"), { opacity: 0, scale: 0, transformOrigin: "50% 50%" });
  gsap.set(q(".st-errline"), { opacity: 0 });
  gsap.set(q(".rb-shut"), { opacity: 1 });
  gsap.set(q(".rb-open"), { opacity: 0 });
  gsap.set(q(".rb-wave"), { opacity: 0, scaleY: 0.2, transformOrigin: "50% 50%" });
  gsap.set(q(".rb-bulb"), { opacity: 0.25 });
  gsap.set(q(".st-step"), { opacity: 0.35 });
  const el = q(".st-num[data-value]")[0];
  if (el) el.textContent = "0";
}

function wakeRobot(q: Q, tl: gsap.core.Timeline, at: number) {
  tl.to(q(".rb-bulb"), { opacity: 1, duration: 0.12, yoyo: true, repeat: 3 }, at)
    .to(q(".rb-shut"), { opacity: 0, duration: 0.08 }, at + 0.1)
    .to(q(".rb-open"), { opacity: 1, duration: 0.08 }, at + 0.1)
    .to(q(".rb-body"), { y: -6, duration: 0.14, yoyo: true, repeat: 1, ease: "power2.out" }, at + 0.1)
    .to(q(".rb-arm"), { rotation: 150, duration: 0.2, ease: "back.out(2)" }, at + 0.3)
    .to(q(".rb-arm"), { rotation: 120, duration: 0.14, yoyo: true, repeat: 3, ease: "sine.inOut" }, at + 0.5);
}
const robotTalks = (q: Q, tl: gsap.core.Timeline, at: number) =>
  tl.to(q(".rb-open"), { opacity: 0, duration: 0.1 }, at).to(q(".rb-wave"), { opacity: 1, scaleY: 1, duration: 0.35, ease: "back.out(2)" }, at);

function Coin() {
  return (
    <g className="st-coin" opacity="0">
      <circle r="7" className="fill-terracotta" />
      <circle r="4.2" className="fill-none stroke-ivory" strokeWidth="1.3" strokeOpacity="0.8" />
    </g>
  );
}

function StepLabel({ m, style, big }: { m: Milestone; style: React.CSSProperties; big?: boolean }) {
  return (
    <div className="st-step absolute" style={style}>
      <span className={`block font-body font-semibold uppercase ${big ? "text-[0.8cqw] tracking-[0.14em]" : "text-[2.3cqw] tracking-[0.1em]"} ${m.current ? "text-terracotta" : "text-warm-grey"}`}>
        {m.date}
      </span>
      <span className={`block font-heading leading-tight font-semibold text-charcoal ${big ? "text-[1.2cqw]" : "text-[3.2cqw]"}`}>{m.org}</span>
    </div>
  );
}

function FunnelValues({ c, bands, cx, sizes }: { c: HeroVisualContent; bands: readonly (readonly [number, number])[]; cx: number; sizes: [number, number, number] }) {
  return (
    <>
      {bands.map(([t, b], i) => (
        <g key={t} className="st-val">
          <text x={cx} y={(t + b) / 2 - sizes[2]} textAnchor="middle" className={`font-body ${i === 2 ? "fill-ivory" : "fill-charcoal"}`} fillOpacity={i === 2 ? 0.9 : 0.6} fontSize={sizes[0]} fontWeight="600" letterSpacing="1.6">
            {c.stages[i].toUpperCase()}
          </text>
          <text x={cx} y={(t + b) / 2 + sizes[1] - 6} textAnchor="middle" className={`st-num font-heading tabular-nums ${i === 2 ? "fill-ivory" : "fill-charcoal"}`} fontSize={sizes[1]} fontWeight="700" data-value={i === 2 ? c.leadsValue : undefined}>
            {i === 2 ? c.leadsValue.toLocaleString("en-IN") : c.stageValues[i]}
          </text>
        </g>
      ))}
    </>
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
const D_AV = { a: [110, 520], b: [470, 490], c: [1035, 460] } as const;
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
const CODE = [
  [0, 34, "fill-terracotta"],
  [6, 46, "fill-sage"],
  [12, 30, "fill-ivory"],
  [12, 40, "fill-sage"],
  [6, 22, "fill-ivory"],
  [6, 38, "fill-terracotta"],
  [0, 18, "fill-sage"],
] as const;

function DesktopComposition({ c, milestones, resumeUrl, resumeFileName, engineeringLeaning, animated, react }: CompositionProps) {
  const pill = "text-[1.05cqw]";
  return (
    <div className="paper-grain relative aspect-[2/1] w-full">
      <Ambient motes={16} W={DW} H={DH} />
      <div className="st-cam absolute inset-0">
        <svg viewBox={`0 0 ${DW} ${DH}`} className="st-svg absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
          {D_STEPS.map((s, i) => (
            <g key={i}>
              <rect x={s.x0} y={s.top} width={s.x1 - s.x0} height={DH - s.top} className="fill-ivory" />
              <path d={`M${s.x0} ${s.top} H${s.x1} ${i < 2 ? `V${D_STEPS[i + 1].top}` : ""}`} className="stroke-beige-border" strokeWidth="2" fill="none" />
            </g>
          ))}
          {Object.values(D_PATHS).map((d) => (
            <path key={d} d={d} pathLength={1} strokeDasharray="1" className="st-line stroke-sage" strokeWidth="1.5" fill="none" />
          ))}
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

        <Link href="/marketing" aria-label={c.linkLabels[0]} className={`${OBJ} z-10`} style={dBox(200, 200, 220, 270)} {...reactProps(react, "mkt")}>
          <Glow tone="terracotta" />
          <Pill tone="terracotta" vivid className={`top-0 left-1/2 -translate-x-1/2 ${pill}`}>{c.linkLabels[0]}</Pill>
          <svg viewBox="0 0 220 270" className="relative h-full w-full overflow-visible" aria-hidden="true">
            {F_BANDS.map(([t, b]) => (
              <path key={t} d={fBand(t, b)} className="fill-ivory stroke-terracotta" strokeOpacity="0.5" strokeWidth="1.2" />
            ))}
            <Liquid id="dl" bands={F_BANDS} band={fBand} x0={10} x1={210} />
            <FunnelValues c={c} bands={F_BANDS} cx={110} sizes={[9, 22, 6]} />
            <text x="110" y="262" textAnchor="middle" className="st-val fill-warm-grey font-body" fontSize="10.5">{c.metricChips.join("  ·  ")}</text>
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
            <rect x="185" y="30" width="170" height="36" rx="9" className="st-errline fill-none stroke-terracotta-dark" strokeWidth="2.5" opacity="0" />
            <StatusBadge x={355} y={30} />
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
          <Pill tone="sage" className={`-top-[2.6cqw] left-1/2 -translate-x-1/2 ${pill}`}>{c.linkLabels[2]}</Pill>
          <svg viewBox="0 0 120 170" className="relative h-full w-full overflow-visible" aria-hidden="true">
            <Robot y={10} />
            <rect x="22" y="122" width="76" height="16" rx="8" className="fill-ivory" fillOpacity="0.9" />
            <text x="60" y="133.5" textAnchor="middle" className="fill-sage-dark font-body" fontSize="8" fontWeight="700" letterSpacing="1.2">{c.aiStatus.toUpperCase()}</text>
          </svg>
        </Link>

        {/* Character, desk + laptop, coins — pointer-transparent foreground */}
        <svg viewBox={`0 0 ${DW} ${DH}`} className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible" aria-hidden="true">
          <Avatar x={D_AV.c[0]} y={D_AV.c[1]} pose="hold" />
          <ellipse cx="565" cy="388" rx="70" ry="46" className="st-glow fill-sage" opacity="0" />
          <rect x="500" y="420" width="128" height="7" rx="3" className="fill-ivory stroke-beige-border" strokeWidth="1.5" />
          <rect x="508" y="427" width="5" height="63" className="fill-warm-grey" fillOpacity="0.5" />
          <rect x="615" y="427" width="5" height="63" className="fill-warm-grey" fillOpacity="0.5" />
          <rect x="522" y="360" width="86" height="56" rx="5" className="fill-charcoal" />
          <g className="st-code" opacity="0">
            {CODE.map(([ind, w, cls], i) => (
              <rect key={i} className={`st-cl ${cls}`} x={531 + ind} y={369 + i * 6} width={w} height="2.8" rx="1.4" fillOpacity="0.85" />
            ))}
          </g>
          <g className="st-mini">
            {[8, 13, 10, 18, 25].map((h, i) => (
              <rect key={i} className={`st-mb ${i === 4 ? "fill-terracotta" : "fill-sage"}`} x={532 + i * 9} y={407 - h} width="6" height={h} rx="1" />
            ))}
            <polyline points="578,398 584,394 590,396 596,386 602,380" className="fill-none stroke-ivory" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="602" cy="380" r="2" className="fill-terracotta" />
          </g>
          <path d="M514 416 H616 L621 422 H509 Z" className="fill-sage-dark" />
          <Spark x={1097} y={376} />
          {Array.from({ length: 6 }, (_, i) => <Coin key={i} />)}
        </svg>

        <a href={resumeUrl} download={resumeFileName} aria-label={`${c.linkLabels[3]} (${c.resumeMeta} download)`} className={`st-doc ${OBJ} z-30`} style={dBox(1003, 340, 64, 80)} {...reactProps(react, "cv")}>
          <Glow tone="terracotta" />
          <svg viewBox="0 0 140 160" className="st-docsvg relative h-full w-full overflow-visible drop-shadow-[0_8px_14px_rgb(43_38_34/0.18)]" aria-hidden="true">
            <ResumeDoc />
          </svg>
          <Pill tone="terracotta" down className={`top-full left-1/2 mt-[0.6cqw] -translate-x-1/2 ${pill}`}>{c.linkLabels[3]}</Pill>
        </a>

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
    </div>
  );
}

function buildDesktop(root: HTMLElement) {
  const q = gsap.utils.selector(root) as Q;
  const pos = q(".av-pos");
  const [armL, armR, eyes, look, head] = [".av-armL", ".av-armR", ".av-eyes", ".av-look", ".av-head"].map((s) => q(s));
  const coins = q(".st-coin");
  const liquids = q(".st-liquid");
  const vals = q(".st-val");
  const lines = q(".st-line");
  const nodes = q(".st-node");
  const steps = q(".st-step");
  const cam = q(".st-cam");
  const amb = q(".st-amb");
  const doc = q(".st-doc");

  startPose(q);
  gsap.set(pos, { x: -90, y: D_AV.a[1] });
  gsap.set(cam, { scale: 1.07, transformOrigin: "12% 82%" });
  gsap.set(amb, { scale: 1.03, transformOrigin: "12% 82%" });
  gsap.set(q(".st-bar"), { scaleY: 0.08, transformOrigin: "50% 100%" });
  gsap.set(q(".st-cl"), { scaleX: 0, transformOrigin: "0% 50%" });
  gsap.set(q(".st-code"), { opacity: 1 });
  gsap.set(q(".st-mini"), { opacity: 0 });
  gsap.set(q(".st-mb"), { scaleY: 0, transformOrigin: "50% 100%" });
  gsap.set(doc, { xPercent: -117, yPercent: -112, scale: 0.45 });

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
  const { face, walk, hop, coin, counter } = rig(q, tl);

  // 1 · walk on, camera eases out from a slight push on the first step
  tl.to(cam, { scale: 1, duration: 3.2, ease: "power2.inOut" }, 0.2).to(amb, { scale: 1, duration: 3.2, ease: "power2.inOut" }, 0.2);
  tl.to(pos, { x: D_AV.a[0], duration: 1.1, ease: "power1.out" }, 0.1);
  walk(0.1, 1.1);
  tl.to(q(".av-body"), { scaleY: 0.95, duration: 0.08, yoyo: true, repeat: 1 }, 1.2).to(steps[0], { opacity: 1, duration: 0.4 }, 0.9);

  // 2 · marketing: dip into the bag, three anticipated throws
  face("curious", 1.25);
  tl.to(armR, { rotation: 6, duration: 0.2 }, 1.25).to(q(".st-spend"), { opacity: 1, y: 0, duration: 0.4 }, 1.3);
  face("delight", 1.6);
  for (let i = 0; i < 3; i++) {
    const t = 1.55 + i * 0.45;
    tl.to(armR, { rotation: 28, duration: 0.12, ease: "power1.in" }, t)
      .to(q(".av-body"), { scaleY: 0.97, duration: 0.12 }, t)
      .to(armR, { rotation: -145, duration: 0.2, ease: "back.out(2.2)" }, t + 0.12)
      .to(q(".av-body"), { scaleY: 1, duration: 0.2 }, t + 0.12)
      .to(armR, { rotation: 0, duration: 0.24, ease: "power1.inOut" }, t + 0.34);
    for (let j = 0; j < 2; j++) {
      const k = i * 2 + j;
      const rimLeft = k % 2 === 0;
      coin(coins[k], t + 0.2 + j * 0.06, [176, 352], [244 + j * 16, 196 - j * 8], [rimLeft ? 218 : 398, 241], [300 + (k % 3) * 8, 262]);
    }
  }
  tl.to(liquids[0], { y: 0, duration: 0.8, ease: "power1.out" }, 2.05).to(vals[0], { opacity: 1, duration: 0.3 }, 2.2);
  tl.to(liquids[1], { y: 0, duration: 0.8, ease: "power1.out" }, 2.55).to(vals[1], { opacity: 1, duration: 0.3 }, 2.7);

  // … but the Leads band stays empty: the Pixel event isn't firing
  tl.to(armR, { rotation: -8, duration: 0.3 }, 3.0)
    .to(lines[0], { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 2.95)
    .to(q(".st-err"), { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(3)" }, 3.4)
    .to(q(".st-errline"), { opacity: 1, duration: 0.25, yoyo: true, repeat: 4 }, 3.45)
    .to(eyes, { x: 3.5, y: -1, duration: 0.2 }, 3.3);
  face("worried", 3.35);

  // 3 · lean back (anticipation), walk up to the desk
  tl.to(look, { rotation: -6, duration: 0.15 }, 3.65).to(eyes, { x: 0, y: 0, duration: 0.2 }, 3.7);
  tl.to(pos, { x: D_AV.b[0], duration: 1.15, ease: "power1.inOut" }, 3.8).to(pos, { y: D_AV.b[1], duration: 0.2 }, 4.45);
  walk(3.8, 1.15);
  tl.to(steps[1], { opacity: 1, duration: 0.4 }, 4.6);

  // 4 · debug at the laptop — camera pushes in, code types, dashboard comes up
  tl.set(cam, { transformOrigin: "47% 64%" }, 4.9).set(amb, { transformOrigin: "47% 64%" }, 4.9);
  tl.to(cam, { scale: 1.16, duration: 0.9, ease: "power2.inOut" }, 4.95).to(amb, { scale: 1.06, duration: 0.9, ease: "power2.inOut" }, 4.95);
  face("focus", 5.0);
  tl.to(armL, { rotation: -68, duration: 0.2 }, 5.0)
    .to(armR, { rotation: -42, duration: 0.2 }, 5.0)
    .to(armL, { rotation: -60, duration: 0.07, yoyo: true, repeat: 11, ease: "none" }, 5.2)
    .to(armR, { rotation: -34, duration: 0.07, yoyo: true, repeat: 11, ease: "none" }, 5.24)
    .to(eyes, { x: 3, y: 1.5, duration: 0.2 }, 5.05)
    .to(q(".st-glow"), { opacity: 0.28, duration: 0.4 }, 5.05)
    .to(q(".st-cl"), { scaleX: 1, duration: 0.12, stagger: 0.11 }, 5.1)
    .to(nodes[0], { opacity: 1, duration: 0.3 }, 5.2)
    .to(q(".st-code"), { opacity: 0, duration: 0.15 }, 6.0)
    .to(q(".st-mini"), { opacity: 1, duration: 0.15 }, 6.05)
    .to(q(".st-mb"), { scaleY: 1, duration: 0.3, stagger: 0.05, ease: "back.out(2)" }, 6.05);
  // the fix: flag → check, leads finally flow
  tl.to(q(".st-err"), { opacity: 0, scale: 0.4, duration: 0.2 }, 6.1)
    .to(q(".st-errline"), { opacity: 0, duration: 0.2 }, 6.1)
    .to(q(".st-ok"), { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(3)" }, 6.15)
    .to(lines[1], { strokeDashoffset: 0, duration: 0.3 }, 6.15)
    .to(nodes[1], { opacity: 1, duration: 0.3 }, 6.25)
    .to(lines[2], { strokeDashoffset: 0, duration: 0.3 }, 6.4)
    .to(nodes[2], { opacity: 1, duration: 0.3 }, 6.5)
    .to(q(".st-bar"), { scaleY: 1, duration: 0.45, stagger: 0.05, ease: "back.out(1.6)" }, 6.55)
    .to(q(".st-particles"), { opacity: 1, duration: 0.4 }, 6.2)
    .to(liquids[2], { y: 0, duration: 0.9, ease: "power1.out" }, 6.2)
    .to(vals[2], { opacity: 1, duration: 0.3 }, 6.2)
    .to(armL, { rotation: 8, duration: 0.25 }, 6.3)
    .to(armR, { rotation: -8, duration: 0.25 }, 6.3)
    .to(eyes, { x: -3, y: -1, duration: 0.2 }, 6.25);
  counter(6.2, 1);
  face("delight", 6.25);
  hop(6.6, 18, true);
  tl.to(armL, { rotation: 8, duration: 0.3, ease: "back.out(2)" }, 7.15).to(armR, { rotation: -8, duration: 0.3, ease: "back.out(2)" }, 7.17);
  tl.to(cam, { scale: 1, duration: 0.9, ease: "power2.inOut" }, 7.0).to(amb, { scale: 1, duration: 0.9, ease: "power2.inOut" }, 7.0);
  tl.to(q(".st-glow"), { opacity: 0, duration: 0.5 }, 7.1).to(vals[3], { opacity: 1, duration: 0.3 }, 7.1);

  // 5 · on to the top step
  tl.to(eyes, { x: 0, y: 0, duration: 0.2 }, 7.3).to(pos, { x: D_AV.c[0], duration: 1.15, ease: "power1.inOut" }, 7.35).to(pos, { y: D_AV.c[1], duration: 0.2 }, 7.95);
  walk(7.35, 1.15);
  tl.to(steps[2], { opacity: 1, duration: 0.4 }, 8.1);

  // 6 · AI: curious poke → robot wakes, waves → high-five
  face("curious", 8.45);
  tl.to(eyes, { x: 3.5, y: 1, duration: 0.2 }, 8.45)
    .to(armR, { rotation: 12, duration: 0.12, ease: "power1.in" }, 8.5)
    .to(armR, { rotation: -80, duration: 0.22, ease: "back.out(2.5)" }, 8.62)
    .to(armR, { rotation: -10, duration: 0.25 }, 8.9);
  tl.to(lines[3], { strokeDashoffset: 0, duration: 0.45 }, 8.6);
  wakeRobot(q, tl, 8.78);
  face("delight", 9.05);
  tl.to(armR, { rotation: -30, duration: 0.12 }, 9.45)
    .to(armR, { rotation: -46, duration: 0.12, ease: "power3.in" }, 9.57)
    .to(q(".rb-arm"), { rotation: 165, duration: 0.24, ease: "power3.in" }, 9.45)
    .to(q(".st-spark"), { keyframes: [{ opacity: 1, scale: 0.4, duration: 0.01 }, { scale: 1.3, duration: 0.25 }, { opacity: 0, duration: 0.15 }] }, 9.69)
    .to(q(".rb-body"), { rotation: -4, transformOrigin: "50% 100%", duration: 0.08, yoyo: true, repeat: 1 }, 9.69)
    .to(armR, { rotation: -8, duration: 0.3 }, 9.85)
    .to(q(".rb-arm"), { rotation: 0, duration: 0.35, ease: "back.out(2)" }, 9.85);
  robotTalks(q, tl, 9.9);

  // 7 · résumé: reach into the dashboard, hold it out to the visitor
  tl.to(eyes, { x: -3.5, y: -1, duration: 0.2 }, 9.95)
    .to(look, { rotation: -4, duration: 0.25 }, 9.95)
    .to(armL, { rotation: 60, duration: 0.12, ease: "power1.in" }, 10.0)
    .to(armL, { rotation: 86, duration: 0.2, ease: "back.out(2)" }, 10.12)
    .to(doc, { xPercent: -95, yPercent: -48, scale: 0.6, duration: 0.35, ease: "power1.inOut" }, 10.3)
    .to(armL, { rotation: -40, duration: 0.45, ease: "power2.inOut" }, 10.6)
    .to(armR, { rotation: 40, duration: 0.45, ease: "power2.inOut" }, 10.62)
    .to(doc, { xPercent: 0, yPercent: 0, scale: 1, duration: 0.55, ease: "back.out(1.5)" }, 10.65)
    .to([eyes, look], { x: 0, y: 0, rotation: 0, duration: 0.25 }, 10.75)
    .to(head, { rotation: 7, duration: 0.14, yoyo: true, repeat: 1 }, 11.0);
  face("proud", 10.8);
  return tl;
}

/* ======================================================================== */
/* Mobile — 360 × 496, vertical, fewer beats: arrive → toss → flag → zap    */
/* fix → leads → robot waves → résumé + wave. Static staircase underneath.  */
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
const M_PATHS = { lead: "M100 202 V208 H10 V262 H26", ai: "M73 278 V328", cv: "M287 278 V328" };

function MobileComposition({ c, milestones, resumeUrl, resumeFileName, engineeringLeaning, animated, react }: CompositionProps) {
  const pill = "text-[3.2cqw]";
  return (
    <div className="paper-grain relative w-full" style={{ aspectRatio: `${MW} / ${MH}` }}>
      <Ambient motes={8} W={MW} H={MH} />
      <div className="st-cam absolute inset-0">
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
            {M_BANDS.map(([t, b]) => (
              <path key={t} d={mBand(t, b)} className="fill-ivory stroke-terracotta" strokeOpacity="0.5" strokeWidth="1" />
            ))}
            <Liquid id="ml" bands={M_BANDS} band={mBand} x0={4} x1={196} />
            <FunnelValues c={c} bands={M_BANDS} cx={100} sizes={[8, 17, 5]} />
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
            <rect x="26" y="6" width="94" height="32" rx="7" className="st-errline fill-none stroke-terracotta-dark" strokeWidth="2" opacity="0" />
            <StatusBadge x={118} y={7} s={0.8} />
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
          <svg viewBox="0 0 140 160" className="st-docsvg relative h-[13cqw] w-[11.5cqw] shrink-0 overflow-visible" aria-hidden="true">
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
          <circle className="st-zap fill-sage-dark" r="4" opacity="0" />
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
    </div>
  );
}

function buildMobile(root: HTMLElement) {
  const q = gsap.utils.selector(root) as Q;
  const pos = q(".av-pos");
  const [armL, armR, eyes, look] = [".av-armL", ".av-armR", ".av-eyes", ".av-look"].map((s) => q(s));
  const coins = q(".st-coin");
  const liquids = q(".st-liquid");
  const vals = q(".st-val");
  const lines = q(".st-line");

  startPose(q);
  gsap.set(pos, { x: 420, y: M_AV[1] });
  gsap.set(q(".st-doc"), { scale: 0.9, opacity: 0.55 });

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
  const { face, walk, hop, coin, counter } = rig(q, tl);

  tl.to(pos, { x: M_AV[0], duration: 0.8, ease: "power1.out" }, 0.1);
  walk(0.1, 0.8);
  tl.to(q(".av-body"), { scaleY: 0.95, duration: 0.08, yoyo: true, repeat: 1 }, 0.9)
    .to(armR, { rotation: 4, duration: 0.2 }, 1.0)
    .to(q(".st-spend"), { opacity: 1, y: 0, duration: 0.4 }, 1.0)
    .to(eyes, { x: -3.5, y: -1, duration: 0.2 }, 1.05)
    .to(look, { rotation: -6, duration: 0.3 }, 1.05);
  face("delight", 1.1);
  for (let i = 0; i < 2; i++) {
    const t = 1.25 + i * 0.45;
    tl.to(armL, { rotation: -12, duration: 0.1, ease: "power1.in" }, t)
      .to(armL, { rotation: 132, duration: 0.18, ease: "back.out(2.2)" }, t + 0.1)
      .to(armL, { rotation: 20, duration: 0.24 }, t + 0.3);
    for (let j = 0; j < 2; j++) {
      const k = i * 2 + j;
      coin(coins[k], t + 0.16 + j * 0.06, [228, 100], [170 - j * 12, 6], [k % 2 ? 186 : 16, 33], [92 + k * 6, 52]);
    }
  }
  tl.to(liquids[0], { y: 0, duration: 0.7 }, 1.7).to(vals[0], { opacity: 1, duration: 0.3 }, 1.8);
  tl.to(liquids[1], { y: 0, duration: 0.7 }, 2.05).to(vals[1], { opacity: 1, duration: 0.3 }, 2.15);

  // flag on the Pixel node → point → zap → fixed
  tl.to(armR, { rotation: -8, duration: 0.2 }, 2.4)
    .to(lines[0], { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" }, 2.45)
    .to(q(".st-err"), { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(3)" }, 2.75)
    .to(q(".st-errline"), { opacity: 1, duration: 0.22, yoyo: true, repeat: 4 }, 2.8)
    .to(look, { rotation: 0, duration: 0.25 }, 2.7)
    .to(eyes, { x: -2.5, y: 3, duration: 0.2 }, 2.7);
  face("worried", 2.75);
  face("focus", 3.15);
  tl.to(armL, { rotation: 58, duration: 0.14, ease: "power1.in" }, 3.15)
    .to(armL, { rotation: 38, duration: 0.2, ease: "back.out(3)" }, 3.29)
    .to(q(".st-zap"), { keyframes: [{ x: 235, y: 163, opacity: 1, duration: 0.01 }, { x: 175, y: 175, duration: 0.18, ease: "none" }, { x: 120, y: 246, duration: 0.2, ease: "power1.in" }, { opacity: 0, scale: 2.4, duration: 0.15 }] }, 3.4)
    .to(q(".st-err"), { opacity: 0, scale: 0.4, duration: 0.2 }, 3.78)
    .to(q(".st-errline"), { opacity: 0, duration: 0.2 }, 3.78)
    .to(q(".st-ok"), { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(3)" }, 3.82)
    .to(q(".st-node"), { opacity: 1, duration: 0.3, stagger: 0.15 }, 3.82)
    .to(lines[3], { strokeDashoffset: 0, duration: 0.4 }, 3.95)
    .to(q(".st-particles"), { opacity: 1, duration: 0.4 }, 3.9)
    .to(liquids[2], { y: 0, duration: 0.8 }, 3.9)
    .to(vals[2], { opacity: 1, duration: 0.3 }, 3.9)
    .to(vals[3], { opacity: 1, duration: 0.3 }, 4.0)
    .to(vals[4], { opacity: 1, duration: 0.3 }, 4.0)
    .to(armL, { rotation: 8, duration: 0.25 }, 3.9)
    .to(eyes, { x: -3, y: -1, duration: 0.2 }, 3.9);
  counter(3.9, 0.9);
  face("delight", 3.95);
  hop(4.3, 16, true);
  tl.to(armL, { rotation: 8, duration: 0.3, ease: "back.out(2)" }, 4.85).to(armR, { rotation: -8, duration: 0.3, ease: "back.out(2)" }, 4.87);

  // robot wakes and waves; résumé tile pops; character waves hello, proud
  face("curious", 5.0);
  tl.to(eyes, { x: -3, y: 3, duration: 0.2 }, 5.0).to(lines[1], { strokeDashoffset: 0, duration: 0.3 }, 5.0);
  wakeRobot(q, tl, 5.15);
  robotTalks(q, tl, 5.9);
  tl.to(q(".rb-arm"), { rotation: 0, duration: 0.3, ease: "back.out(2)" }, 5.85)
    .to(lines[2], { strokeDashoffset: 0, duration: 0.3 }, 5.85)
    .to(q(".st-doc"), { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.8)" }, 6.0)
    .to(eyes, { x: 0, y: 0, duration: 0.25 }, 6.1)
    .to(armR, { rotation: 12, duration: 0.12, ease: "power1.in" }, 6.1)
    .to(armR, { rotation: -150, duration: 0.25, ease: "back.out(2)" }, 6.22)
    .to(armR, { rotation: -122, duration: 0.15, yoyo: true, repeat: 3, ease: "sine.inOut" }, 6.47)
    .to(armR, { rotation: -8, duration: 0.3 }, 7.1)
    .to(q(".st-step"), { opacity: 1, duration: 0.35, stagger: 0.15 }, 6.1);
  face("proud", 6.3);
  return tl;
}

/* ======================================================================== */

const POSES: Record<"desktop" | "mobile", { base: [number, number]; to: Record<Target, { e: Expr; look: number; armL?: number; armR?: number }> }> = {
  desktop: {
    base: [-40, 40],
    to: { mkt: { e: "delight", look: -8, armL: 112 }, eng: { e: "focus", look: -5, armL: 92 }, ai: { e: "curious", look: 6, armR: -96 }, cv: { e: "proud", look: 0 } },
  },
  mobile: {
    base: [8, -8],
    to: { mkt: { e: "delight", look: -8, armL: 112 }, eng: { e: "focus", look: -3, armL: 40 }, ai: { e: "curious", look: -6, armL: 30 }, cv: { e: "proud", look: 0 } },
  },
};

export function HeroStory({ variant, ...props }: Props & { variant: "desktop" | "mobile" }) {
  const controlLabels = props.c.controlLabels;
  const reduced = usePrefersReducedMotion();
  const animated = !reduced;
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const idleRef = useRef<gsap.core.Animation[]>([]);
  const phaseRef = useRef<"static" | "playing" | "done">("static");
  const [phase, setPhaseState] = useState<"static" | "playing" | "done">("static");
  const setPhase = (p: "static" | "playing" | "done") => {
    phaseRef.current = p;
    setPhaseState(p);
  };

  const sel = () => gsap.utils.selector(rootRef.current) as Q;

  const stopIdle = () => {
    idleRef.current.forEach((a) => a.kill());
    idleRef.current = [];
    const q = sel();
    gsap.set(q(".av-body"), { scaleY: 1, scaleX: 1 });
    gsap.set(q(".av-head"), { rotation: 0 });
    gsap.set(q(".av-lid"), { scaleY: 1 });
    gsap.set(q(".rb-body"), { y: 0 });
  };

  const startIdle = () => {
    stopIdle();
    const q = sel();
    idleRef.current = [
      gsap.to(q(".av-body"), { scaleY: 1.014, transformOrigin: "50% 100%", duration: 1.7, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.timeline({ repeat: -1, repeatDelay: 3.1, delay: 0.8 }).to(q(".av-lid"), { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.07, yoyo: true, repeat: 1 }),
      gsap.to(q(".av-head"), { rotation: 3, transformOrigin: "50% 100%", duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1.2 }),
      gsap.to(q(".rb-body"), { y: -2.5, duration: 1.3, yoyo: true, repeat: -1, ease: "sine.inOut" }),
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

  // Off-screen: pause SMIL, CSS loops and idle. On-screen + idle: eyes follow
  // the cursor (last tap on touch) and the ambient layer drifts in parallax.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !animated) return;
    const svg = root.querySelector<SVGSVGElement>(".st-svg");
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      root.classList.toggle("hv-paused", !visible);
      if (visible) svg?.unpauseAnimations();
      else svg?.pauseAnimations();
      idleRef.current.forEach((a) => (visible ? a.resume() : a.pause()));
    });
    io.observe(root);

    const q = gsap.utils.selector(root) as Q;
    const eyeX = gsap.quickTo(q(".av-eyes"), "x", { duration: 0.35, ease: "power3.out" });
    const eyeY = gsap.quickTo(q(".av-eyes"), "y", { duration: 0.35, ease: "power3.out" });
    const ambX = gsap.quickTo(q(".st-amb"), "x", { duration: 1.2, ease: "power3.out" });
    const ambY = gsap.quickTo(q(".st-amb"), "y", { duration: 1.2, ease: "power3.out" });
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf || !visible || phaseRef.current !== "done" || root.offsetParent === null) return;
      const { clientX, clientY } = e;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const head = q(".av-head")[0]?.getBoundingClientRect();
        const r = root.getBoundingClientRect();
        if (!head) return;
        const dx = clientX - (head.left + head.width / 2);
        const dy = clientY - (head.top + head.height / 2);
        const d = Math.max(Math.hypot(dx, dy), 1);
        const k = Math.min(d / 120, 1);
        eyeX((dx / d) * 3.6 * k);
        eyeY((dy / d) * 2.6 * k);
        ambX(((clientX - r.left) / r.width - 0.5) * -14);
        ambY(((clientY - r.top) / r.height - 0.5) * -8);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, [animated]);

  /** Character + object react together to hover / focus / tap. */
  const react = (t: Target | null) => {
    if (phaseRef.current !== "done" || !rootRef.current) return;
    const q = sel();
    const { base, to } = POSES[variant];
    const p = t ? to[t] : null;
    const o = { duration: 0.35, ease: "back.out(1.8)", overwrite: "auto" as const };
    setFace(q, p?.e ?? "proud");
    gsap.to(q(".av-look"), { rotation: p?.look ?? 0, ...o });
    gsap.to(q(".av-armL"), { rotation: p?.armL ?? base[0], ...o });
    gsap.to(q(".av-armR"), { rotation: p?.armR ?? base[1], ...o });
    if (t === "mkt") gsap.fromTo(q(".st-liquid"), { y: -5 }, { y: 0, duration: 0.9, ease: "elastic.out(1,0.3)", stagger: 0.06, overwrite: "auto" });
    if (t === "eng") {
      gsap.fromTo(q(".st-node"), { scale: 1.06, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.6, stagger: 0.08, ease: "elastic.out(1,0.4)", overwrite: "auto" });
      gsap.fromTo(q(".st-ok"), { scale: 1.5 }, { scale: 1, duration: 0.5, ease: "back.out(3)", overwrite: "auto" });
    }
    if (t === "ai") {
      gsap.timeline().to(q(".rb-arm"), { rotation: 150, duration: 0.18 }).to(q(".rb-arm"), { rotation: 120, duration: 0.13, yoyo: true, repeat: 3 }).to(q(".rb-arm"), { rotation: 0, duration: 0.25 });
      gsap.fromTo(q(".rb-bulb"), { opacity: 0.3 }, { opacity: 1, duration: 0.12, repeat: 3, yoyo: true });
    }
    if (t === "cv") {
      gsap.fromTo(q(".st-docsvg"), { rotation: -7 }, { rotation: 0, duration: 0.8, ease: "elastic.out(1,0.3)", overwrite: "auto" });
      gsap.to(q(".av-head"), { rotation: 8, duration: 0.14, yoyo: true, repeat: 3, ease: "sine.inOut" });
    }
  };

  const skip = () => tlRef.current?.progress(1);
  const replay = () => {
    stopIdle();
    const q = sel();
    gsap.set([q(".av-eyes"), q(".av-look"), q(".st-amb")], { x: 0, y: 0, rotation: 0 });
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
          className={`absolute top-0 z-40 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-beige-border bg-ivory/80 px-3 py-1.5 font-body text-xs font-medium text-warm-grey backdrop-blur-sm transition-colors hover:border-sage hover:text-sage-dark focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none ${variant === "desktop" ? "right-0" : "left-0"}`}
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
