"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import type { HeroVisualContent } from "@/lib/data/heroVisual";
import { Avatar, Liquid, Spark, StatusBadge } from "@/components/home/sceneParts";

/**
 * Phone-only (<640px) hero: a wordless, Stories-style film in 8 beats —
 * who (spend → funnel → leads → the systems behind it), Meta Ads (feed
 * card → Instant Form → leads), Google Ads (search → sponsored result →
 * click; no numbers — capability only), results + the tracking-fix beat
 * (real Jewar numbers, Meta stream), toolkit pictograms, career steps with
 * role props, study + where, and the final pose holding out the résumé.
 *
 * Loaded with next/dynamic only when the phone media query matches, so
 * none of this ships to tablet/desktop. Tap right = next beat, left =
 * back, press-and-hold = pause; vertical drags still scroll the page; the
 * dock links (rendered server-side in Hero) always win. Reduced motion:
 * finished pose, no auto-advance. Pauses when hidden or off-screen.
 */

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

type Milestone = { date: string; org: string; current: boolean };
type Edu = { year: string; credential: string };
export type PhoneStoryProps = {
  c: HeroVisualContent;
  /** Person's name (site settings), printed on the résumé. */
  name: string;
  milestones: Milestone[];
  education: Edu[];
  place: { location: string; availability: string };
  resumeUrl: string;
  resumeFileName: string;
};

const W = 360;
const H = 420;
/**
 * Pacing — the one place to tune the story. Each beat's entrance is authored
 * on a raw timeline (RAW windows below); `dwell` is how long the beat lasts
 * on screen in seconds, `hold` how much of that is a still frame after the
 * last element lands (min 1.5s so every label/number can be read). The
 * entrance is stretched to fill dwell − hold. The last beat never advances:
 * its dwell is only its entrance, then it holds until the visitor acts.
 */
export const PACING = {
  beats: [
    { name: "who", dwell: 4.3, hold: 1.5 },
    { name: "meta", dwell: 3.6, hold: 1.5 },
    { name: "google", dwell: 3.7, hold: 1.5 },
    { name: "results", dwell: 5.0, hold: 1.6 },
    { name: "tools", dwell: 4.2, hold: 1.6 },
    { name: "career", dwell: 4.9, hold: 1.5 },
    { name: "study", dwell: 4.6, hold: 1.6 },
    { name: "finale", dwell: 1.8, hold: 0 },
  ],
  /** Tap-left within this many seconds of a beat's start goes to the previous beat. */
  backGrace: 1.2,
} as const;
// Raw authoring windows (seconds on the raw timeline), one per beat + end.
// Each window closes just before the next beat's first event, so a beat's
// hold never shows the next beat's set-up.
const RAW = [0, 2.78, 4.78, 6.78, 9.18, 10.58, 12.38, 13.98, 15.2];
// Beat start times on the played (master) timeline, + end.
const BEATS = PACING.beats.reduce<number[]>((a, b) => [...a, a[a.length - 1] + b.dwell], [0]);
const pct = (x: number, y: number, w: number, h?: number): React.CSSProperties => ({
  left: `${(x / W) * 100}%`,
  top: `${(y / H) * 100}%`,
  width: `${(w / W) * 100}%`,
  ...(h ? { height: `${(h / H) * 100}%` } : {}),
});

// Layout: b0 lifts the funnel into the empty top; tools/finale scale the character up.
const UP = -60;
// Text grid: left edge shared by the Meta card, its tags and the result block.
const GX = 20;
// Funnel + pipeline sit FX right of their drawn coordinates, leaving the left column for text.
const FX = 8;
const TOOL_S = 1.65;
const FIN_S = 1.95;
// Career steps [x, top, width] and the résumé box [x, y, w, h] (viewBox units).
const STEPS = [
  [8, 330, 112],
  [124, 250, 112],
  [240, 170, 112],
] as const;
const DOC = [100, 172, 160, 183] as const;

// Funnel (centre 210): Impressions › Clicks › Leads
const FB = [
  [130, 180],
  [185, 235],
  [240, 290],
] as const;
const fh = (y: number) => 100 - 0.27 * (y - 130);
const fBand = (t: number, b: number) => `M${210 - fh(t)} ${t} H${210 + fh(t)} L${210 + fh(b)} ${b} H${210 - fh(b)} Z`;

type Q = (s: string) => Element[];
type Expr = "neutral" | "delight" | "focus" | "worried" | "curious" | "proud";
const EX: Record<Expr, [string, number, number, number, number]> = {
  neutral: ["smile", 0, 0, 0, 0],
  delight: ["open", -3.5, -3.5, 0, 0],
  focus: ["flat", 1.5, 1.5, 12, -12],
  worried: ["o", -1.5, -1.5, -14, 14],
  curious: ["o", -4.5, 0, -8, 0],
  proud: ["grin", -1.5, -1.5, 0, 0],
};
const MOUTHS = ".av-m-smile,.av-m-open,.av-m-flat,.av-m-o,.av-m-grin";

/** "7.76L" / "6,445" / "₹254 CPL" / "112 qualified" → animatable parts. */
function numberParts(raw: string) {
  const m = raw.match(/^(\D*)([\d,]*\.?\d+)(.*)$/);
  if (!m) return null;
  const dec = (m[2].split(".")[1] ?? "").length;
  const comma = m[2].includes(",");
  const v = parseFloat(m[2].replace(/,/g, ""));
  const fmt = (x: number) => m[1] + (comma ? x.toLocaleString("en-IN", { maximumFractionDigits: 0 }) : x.toFixed(dec)) + m[3];
  return { v, fmt };
}

function build(q: Q, low: boolean) {
  const pos = q(".av-pos");
  const [armL, armR, eyes, look, body] = [".av-armL", ".av-armR", ".av-eyes", ".av-look", ".av-body"].map((s) => q(s));
  const lines = q(".p-line");
  const nodes = q(".p-node");
  const liq = q(".st-liquid");
  const coins = q(".p-coin").slice(0, low ? 2 : 4);
  const dots = q(".p-dot");
  const show = (s: string | Element[], at: number, d = 0.3) => tl.to(typeof s === "string" ? q(s) : s, { autoAlpha: 1, duration: d }, at);
  const hide = (s: string, at: number) => tl.to(q(s), { autoAlpha: 0, duration: 0.25 }, at);

  gsap.set(q(".av-armL,.av-armR,.av-legL,.av-legR"), { transformOrigin: "50% 0%" });
  gsap.set(q(".av-head,.av-look,.av-body,.p-step,.p-bar"), { transformOrigin: "50% 100%" });
  gsap.set(q(".av-brL,.av-brR,.p-pop,.st-ok,.st-err,.p-rip"), { transformOrigin: "50% 50%" });
  gsap.set(q(".p-q"), { transformOrigin: "0% 50%", scaleX: 0 });
  // Scale around the feet (the group's local origin), not the bbox corner.
  const bb = (pos[0] as SVGGraphicsElement).getBBox();
  gsap.set(pos, { transformOrigin: `${-bb.x}px ${-bb.y}px`, smoothOrigin: false, x: -50, y: 404, scale: 1 });
  gsap.set(armL, { rotation: 8 });
  gsap.set(armR, { rotation: -8 });
  gsap.set(q(MOUTHS), { opacity: 0 });
  gsap.set(q(".av-m-smile"), { opacity: 1 });
  gsap.set(q(".av-brL,.av-brR"), { y: 0, rotation: 0 });
  gsap.set(q(".g-fun,.g-pipe"), { autoAlpha: 1, y: UP });
  gsap.set(q(".g-meta,.g-goo,.g-capi,.g-tool,.g-car,.g-stu,.o-b,.p-form,.p-row,.p-coin,.p-dot,.p-rip,.st-err,.st-ok,.st-errline,.p-pop,.p-prop"), { autoAlpha: 0 });
  gsap.set(q(".g-fin,.p-doc,.st-spark"), { autoAlpha: 0 });
  liq.forEach((l) => gsap.set(l, { y: 70 }));
  gsap.set(q(".p-val"), { opacity: 0.3 });
  gsap.set(lines, { strokeDashoffset: 1 });
  gsap.set(nodes, { opacity: 0.35 });
  gsap.set(q(".p-step"), { scaleY: 0 });
  gsap.set(q(".p-ring"), { strokeDashoffset: 100 });
  gsap.set(q(".p-arc"), { strokeDashoffset: 1 });

  const tl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
  const face = (e: Expr, at: number) => {
    const [m, yL, yR, rL, rR] = EX[e];
    tl.set(q(MOUTHS), { opacity: 0 }, at)
      .set(q(`.av-m-${m}`), { opacity: 1 }, at)
      .to(q(".av-brL"), { y: yL, rotation: rL, duration: 0.18 }, at)
      .to(q(".av-brR"), { y: yR, rotation: rR, duration: 0.18 }, at);
  };
  const walk = (x: number, at: number, dur: number) => {
    const n = Math.max(3, Math.round(dur / 0.16) | 1);
    tl.to(pos, { x, duration: dur, ease: "power1.inOut" }, at)
      .to(q(".av-legL"), { rotation: 22, duration: dur / (n + 1), yoyo: true, repeat: n }, at)
      .to(q(".av-legR"), { rotation: -22, duration: dur / (n + 1), yoyo: true, repeat: n }, at);
  };
  const hopTo = (x: number, y: number, at: number, s?: number) =>
    tl
      .to(body, { scaleY: 0.92, duration: 0.08 }, at)
      .to(pos, { x, duration: 0.36, ease: "power1.inOut", ...(s ? { scale: s } : {}) }, at + 0.08)
      .to(pos, { keyframes: [{ y: Math.min(y, 404) - 34, duration: 0.18, ease: "power2.out" }, { y, duration: 0.18, ease: "power2.in" }] }, at + 0.08)
      .to(body, { scaleY: 1.05, duration: 0.12 }, at + 0.1)
      .to(body, { scaleY: 0.93, duration: 0.06 }, at + 0.44)
      .to(body, { scaleY: 1, duration: 0.3, ease: "elastic.out(1,0.45)" }, at + 0.5);
  const count = (el: Element, at: number, dur: number) => {
    const p = numberParts((el as HTMLElement).dataset.v ?? "");
    if (!p) return;
    // Hidden until it counts, so no "0" ever reads as a real metric.
    el.textContent = p.fmt(0);
    gsap.set(el, { opacity: 0 });
    const o = { v: 0 };
    tl.to(el, { opacity: 1, duration: 0.1 }, at).to(o, { v: p.v, duration: dur, ease: "power1.out", onUpdate: () => void (el.textContent = p.fmt(o.v)) }, at);
  };
  const nums = q(".p-num");

  // ── b0 · who: walk in, throw spend → funnel fills → leads → systems light up
  walk(52, 0.05, 0.8);
  face("delight", 0.6);
  for (let i = 0; i < coins.length; i++) {
    const t = 0.8 + i * (low ? 0.5 : 0.28);
    tl.to(armR, { rotation: 25, duration: 0.1, ease: "power1.in" }, t)
      .to(armR, { rotation: -135, duration: 0.16, ease: "back.out(2)" }, t + 0.1)
      .to(armR, { rotation: -8, duration: 0.2 }, t + 0.28)
      .to(
        coins[i],
        {
          keyframes: [
            { x: 111, y: 256, autoAlpha: 1, scaleX: 1, scaleY: 1, duration: 0.04 },
            { x: 160, y: 96 + UP, scaleX: 0.82, scaleY: 1.22, duration: 0.26, ease: "power1.out" },
            { x: (i % 2 ? 214 : 122) + FX, y: 131 + UP, scaleX: 0.85, scaleY: 1.2, duration: 0.18, ease: "power1.in" },
            { scaleX: 1.4, scaleY: 0.6, duration: 0.05 },
            { x: 190 + FX + i * 8, y: 118 + UP, scaleX: 1, scaleY: 1, duration: 0.12 },
            { y: 150 + UP, autoAlpha: 0, duration: 0.14, ease: "power1.in" },
          ],
        },
        t + 0.18,
      );
  }
  tl.to(liq[0], { y: 0, duration: 0.6 }, 1.25).to(liq[1], { y: 0, duration: 0.6 }, 1.6).to(liq[2], { y: 0, duration: 0.5 }, 1.9);
  tl.to(lines[0], { strokeDashoffset: 0, duration: 0.35 }, 2.1);
  dots.slice(0, 2).forEach((d, i) =>
    tl.to(d, { keyframes: [{ x: 210 + FX, y: 290 + UP, autoAlpha: 1, duration: 0.02 }, { y: 302 + UP, duration: 0.1 }, { x: 140 + FX, duration: 0.18 }, { y: 318 + UP, autoAlpha: 0, duration: 0.1 }] }, 2.15 + i * 0.18),
  );
  tl.to(nodes, { opacity: 1, duration: 0.2, stagger: 0.12 }, 2.3).to(lines.slice(1, 3), { strokeDashoffset: 0, duration: 0.2, stagger: 0.12 }, 2.35);
  tl.to(eyes, { x: 3, y: 2, duration: 0.2 }, 2.3);

  // ── b1 · Meta Ads: feed card → Instant Form → leads drop into the funnel
  tl.to(q(".g-fun,.g-pipe"), { y: 0, duration: 0.45, ease: "power2.inOut" }, 2.8);
  tl.to(liq, { y: 70, duration: 0.3 }, 2.8).to(nodes, { opacity: 0.35, duration: 0.2 }, 2.8).set(lines, { strokeDashoffset: 1 }, 2.95);
  face("curious", 2.85);
  tl.to(eyes, { x: 2, y: -3, duration: 0.2 }, 2.85).to(look, { rotation: -3, duration: 0.3 }, 2.85);
  tl.fromTo(q(".g-meta"), { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 2.9);
  show(".o-meta", 3.0);
  tl.fromTo(q(".p-form"), { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "back.out(1.6)" }, 3.45);
  dots.forEach((d, i) =>
    tl.to(d, { keyframes: [{ x: 95, y: 106, autoAlpha: 1, duration: 0.02 }, { x: 150, y: 96, duration: 0.18 }, { x: 196 + FX + i * 6, y: 132, duration: 0.18, ease: "power1.in" }, { y: 150, autoAlpha: 0, duration: 0.1 }] }, 3.95 + i * 0.12),
  );
  tl.to(liq[0], { y: 25, duration: 0.5 }, 4.1);
  face("delight", 4.2);

  // ── b2 · Google Ads: search → sponsored result → tap → click into the same funnel
  tl.to(look, { rotation: 0, duration: 0.3 }, 4.8).to(eyes, { x: 3.5, y: -3, duration: 0.2 }, 4.8);
  tl.fromTo(q(".g-goo"), { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.35 }, 4.85);
  show(".o-goo", 4.95);
  tl.to(q(".p-q"), { scaleX: 1, duration: 0.14, stagger: 0.14, ease: "none" }, 5.1);
  tl.fromTo(q(".p-row"), { autoAlpha: 0, x: 8 }, { autoAlpha: 1, x: 0, duration: 0.2, stagger: 0.1 }, 5.55);
  tl.to(armR, { rotation: -120, duration: 0.22, ease: "back.out(2)" }, 5.85);
  tl.fromTo(q(".p-rip"), { autoAlpha: 1, scale: 0.3 }, { autoAlpha: 0, scale: 1.6, duration: 0.45 }, 6.0);
  tl.to(dots[0], { keyframes: [{ x: 255, y: 52, autoAlpha: 1, duration: 0.02 }, { x: 236, y: 100, duration: 0.2 }, { x: 222 + FX, y: 132, duration: 0.14, ease: "power1.in" }, { y: 150, autoAlpha: 0, duration: 0.1 }] }, 6.05);
  tl.to(liq[1], { y: 20, duration: 0.4 }, 6.35).to(armR, { rotation: -8, duration: 0.3 }, 6.3);
  show(".g-capi", 6.4, 0.4);
  face("proud", 6.45);

  // ── b3 · results: real Jewar numbers (Meta) + the tracking fix
  tl.to(q(".g-goo"), { opacity: 0.35, duration: 0.3 }, 6.8).to(q(".o-goo"), { opacity: 0.35, duration: 0.3 }, 6.8);
  show(".o-camp", 6.85);
  tl.to(liq.slice(0, 2), { y: 0, duration: 0.7 }, 6.85).to(q(".p-val"), { opacity: 1, duration: 0.3, stagger: 0.1 }, 6.85);
  count(nums[0], 6.85, 1.1);
  count(nums[1], 7.0, 1.0);
  tl.to(lines[0], { strokeDashoffset: 0, duration: 0.3 }, 7.3)
    .to(nodes[0], { opacity: 1, duration: 0.2 }, 7.4)
    .to(q(".st-err"), { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(3)" }, 7.5)
    .to(q(".st-errline"), { autoAlpha: 1, duration: 0.2, yoyo: true, repeat: 2 }, 7.55);
  face("worried", 7.5);
  walk(80, 7.65, 0.4);
  face("focus", 8.0);
  tl.to(armR, { rotation: 10, duration: 0.1, ease: "power1.in" }, 8.0)
    .to(armR, { rotation: -60, duration: 0.18, ease: "back.out(2.5)" }, 8.1)
    .to(q(".st-err"), { autoAlpha: 0, scale: 0.4, duration: 0.15 }, 8.3)
    .to(q(".st-errline"), { autoAlpha: 0, duration: 0.15 }, 8.3)
    .to(q(".st-ok"), { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(3)" }, 8.32)
    .to(nodes, { opacity: 1, duration: 0.2, stagger: 0.08 }, 8.35)
    .to(lines, { strokeDashoffset: 0, duration: 0.2 }, 8.35)
    .to(liq[2], { y: 0, duration: 0.6 }, 8.35)
    .to(armR, { rotation: -8, duration: 0.25 }, 8.45);
  count(nums[2], 8.1, 0.8);
  count(nums[3], 8.25, 0.7);
  count(nums[4], 8.3, 0.7);
  face("delight", 8.45);
  hopTo(80, 404, 8.45);

  // ── b4 · toolkit: touch each pictogram, it pops into the scene
  ["g-fun", "g-pipe", "g-meta", "g-goo", "g-capi", "o-meta", "o-goo", "o-camp"].forEach((g) => hide(`.${g}`, 9.2));
  tl.set(q(".g-tool"), { autoAlpha: 1 }, 9.2);
  walk(180, 9.25, 0.4);
  tl.to(pos, { scale: TOOL_S, duration: 0.45, ease: "power2.inOut" }, 9.25);
  face("curious", 9.6);
  const tools = q(".p-tool");
  [
    [armL, 120],
    [armL, 160],
    [armR, -160],
    [armR, -120],
  ].forEach(([arm, r], i) => {
    const t = 9.62 + i * 0.18;
    tl.to(arm as Element[], { rotation: r as number, duration: 0.12, ease: "back.out(2)" }, t).fromTo(tools[i], { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2.6)" }, t + 0.08);
  });
  tl.to(armL, { rotation: 8, duration: 0.25 }, 10.3).to(armR, { rotation: -8, duration: 0.25 }, 10.3);
  face("delight", 10.25);

  // ── b5 · career: three steps, each with the role's props
  hide(".g-tool", 10.6);
  tl.set(q(".g-car"), { autoAlpha: 1 }, 10.6).to(q(".p-step"), { scaleY: 1, duration: 0.35, stagger: 0.08 }, 10.6);
  face("neutral", 10.65);
  const S = STEPS.map(([x, y, w]) => [x + w / 2 - 24, y]);
  S.forEach(([x, y], i) => {
    const t = 10.7 + i * 0.5;
    hopTo(x, y, t, 0.85);
    tl.to(q(".p-prop")[i], { autoAlpha: 1, duration: 0.01 }, t + 0.4)
      .fromTo(q(".p-prop")[i], { scale: 0.2 }, { scale: 1, duration: 0.3, ease: "back.out(2.6)" }, t + 0.4)
      .to(q(".o-step")[i], { autoAlpha: 1, duration: 0.25 }, t + 0.4);
    if (i) tl.to(q(".p-prop")[i - 1], { opacity: 0.4, duration: 0.2 }, t + 0.4);
  });
  face("proud", 12.0);

  // ── b6 · study + where
  hide(".g-car", 12.4);
  ["o-step"].forEach((g) => hide(`.${g}`, 12.4));
  tl.set(q(".g-stu"), { autoAlpha: 1 }, 12.45);
  hopTo(60, 404, 12.45, 1);
  tl.fromTo(q(".p-cap"), { autoAlpha: 0, y: -14 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.15, ease: "back.out(2)" }, 12.5)
    .to(q(".p-ring"), { strokeDashoffset: (_i: number, el: SVGElement) => 100 - Number(el.dataset.p ?? 0), duration: 0.7 }, 12.8)
    .fromTo(q(".p-globe"), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, 12.95)
    .fromTo(q(".p-pin"), { autoAlpha: 0, y: -26 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "bounce.out" }, 13.2)
    .to(q(".p-arc"), { strokeDashoffset: 0, duration: 0.35, stagger: 0.08 }, 13.4);
  show(".o-edu", 12.7);
  show(".o-place", 13.3);
  face("delight", 12.9);
  tl.to(eyes, { x: 3.5, y: -2, duration: 0.2 }, 13.0);

  // ── b7 · finale: hold the résumé out to the visitor
  ["g-stu", "o-edu", "o-place"].forEach((g) => hide(`.${g}`, 14.0));
  tl.set(q(".g-fin"), { autoAlpha: 1 }, 14.0);
  walk(180, 14.05, 0.45);
  tl.to(pos, { scale: FIN_S, duration: 0.5, ease: "power2.inOut" }, 14.05);
  tl.to(eyes, { x: 0, y: 0, duration: 0.2 }, 14.45)
    .to(armL, { rotation: -40, duration: 0.35, ease: "back.out(1.6)" }, 14.5)
    .to(armR, { rotation: 40, duration: 0.35, ease: "back.out(1.6)" }, 14.52)
    .fromTo(q(".p-doc"), { autoAlpha: 0, scale: 0.5, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(1.8)" }, 14.55);
  if (!low) tl.to(q(".st-spark"), { keyframes: [{ autoAlpha: 1, scale: 0.4, duration: 0.01 }, { scale: 1.3, duration: 0.25 }, { autoAlpha: 0, duration: 0.15 }] }, 14.75);
  face("proud", 14.6);

  // Played timeline: each beat scrubs its raw window over (dwell − hold),
  // then holds. Seeking to a beat's start renders the raw timeline at that
  // window's start, so a tapped-to beat always re-enters from clean.
  const master = gsap.timeline({ paused: true });
  PACING.beats.forEach((b, i) => {
    master.addLabel(`b${i}`, BEATS[i]);
    master.add(tl.tweenFromTo(RAW[i], RAW[i + 1], { duration: Math.max(0.3, b.dwell - b.hold), ease: "none", immediateRender: false }), BEATS[i]);
  });
  return master;
}

/** Phone finale's résumé: admin title + name on the page, abstract lines, download badge. */
function PhoneResume({ title, name }: { title: string; name: string }) {
  return (
    <g>
      <path d="M0 0 H92 L120 28 V150 H0 Z" className="fill-ivory stroke-terracotta" strokeOpacity="0.6" strokeWidth="1.25" />
      <path d="M92 0 V28 H120" className="fill-cream stroke-terracotta" strokeOpacity="0.6" strokeWidth="1.25" />
      <text x="60" y="47" textAnchor="middle" className="fill-charcoal font-heading" fontSize="19" fontWeight="700">
        {title}
      </text>
      <rect x="46" y="54" width="28" height="3" rx="1.5" className="fill-terracotta" />
      <text x="60" y="71" textAnchor="middle" className="fill-warm-grey font-body" fontSize="11.5" fontWeight="500">
        {name}
      </text>
      {[86, 96, 106, 120].map((y, i) => {
        const w = [76, 64, 70, 48][i];
        return <rect key={y} x={60 - w / 2} y={y} width={w} height="3.5" rx="1.75" className={i === 3 ? "fill-sage" : "fill-warm-grey"} fillOpacity={i === 3 ? 0.7 : 0.28} />;
      })}
      <circle cx="112" cy="140" r="20" className="fill-terracotta" />
      <path d="M112 130 v17 m0 0 -6 -6 m6 6 6 -6" className="stroke-ivory" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

export function PhoneStory({ c, name, milestones, education, place, resumeUrl, resumeFileName }: PhoneStoryProps) {
  const root = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const idle = useRef<gsap.core.Animation[]>([]);
  const [phase, setPhase] = useState<"static" | "playing" | "done">("static");
  const [paused, setPaused] = useState(false);
  // Client-only (next/dynamic ssr:false), so the HUD slot already exists.
  const [hud] = useState<HTMLElement | null>(() => document.getElementById("p-hud"));
  const beat = useRef(-1);
  const started = useRef(false);

  const startIdle = () => {
    const q = gsap.utils.selector(root.current) as Q;
    idle.current = [
      gsap.to(q(".av-body"), { scaleY: 1.014, transformOrigin: "50% 100%", duration: 1.7, yoyo: true, repeat: -1, ease: "sine.inOut" }),
      gsap.timeline({ repeat: -1, repeatDelay: 3, delay: 0.6 }).to(q(".av-lid"), { scaleY: 0.1, transformOrigin: "50% 50%", duration: 0.07, yoyo: true, repeat: 1 }),
    ];
  };
  const stopIdle = () => {
    idle.current.forEach((a) => a.kill());
    idle.current = [];
    gsap.set(gsap.utils.selector(root.current)(".av-body,.av-lid"), { scaleY: 1 });
  };

  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const low = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 3;
    const segs = () => document.querySelectorAll<HTMLElement>("#p-hud .p-seg i");
    const originals = [...el.querySelectorAll<HTMLElement>(".p-num")].map((n) => [n, n.textContent] as const);
    const ctx = gsap.context(() => {
      const tl = build(gsap.utils.selector(el) as Q, low);
      tl.eventCallback("onUpdate", () => {
        const t = tl.time();
        const s = segs();
        BEATS.slice(0, 8).forEach((b, i) => {
          const f = Math.min(1, Math.max(0, (t - b) / (BEATS[i + 1] - b)));
          if (s[i]) s[i].style.transform = `scaleX(${f})`;
        });
        const cur = BEATS.findIndex((b, i) => t >= b && t < BEATS[i + 1]);
        if (cur !== beat.current) {
          if (beat.current >= 0 && cur >= 0) navigator.vibrate?.(10);
          beat.current = cur;
        }
      });
      tl.eventCallback("onComplete", () => {
        setPhase("done");
        startIdle();
      });
      tlRef.current = tl;
    }, el);
    setPhase("playing");
    let raf = 0;
    const play = () =>
      (raf = requestAnimationFrame(() => {
        started.current = true;
        tlRef.current?.play();
      }));
    const pl = document.querySelector("[data-preloader]");
    if (pl && getComputedStyle(pl).display !== "none") window.addEventListener("preloader:done", play, { once: true });
    else play();
    return () => {
      window.removeEventListener("preloader:done", play);
      cancelAnimationFrame(raf);
      stopIdle();
      ctx.revert();
      originals.forEach(([n, t]) => (n.textContent = t));
      tlRef.current = null;
    };
  }, []);

  // Pause when the tab is hidden or the hero leaves the viewport.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let vis = true;
    let away = false;
    const sync = () => {
      const run = vis && !away;
      el.classList.toggle("hv-paused", !run);
      const tl = tlRef.current;
      if (tl && started.current && run && tl.progress() < 1 && !el.dataset.held) tl.resume();
      if (tl && !run) tl.pause();
      idle.current.forEach((a) => (run ? a.resume() : a.pause()));
    };
    const io = new IntersectionObserver(([e]) => ((vis = e.isIntersecting), sync()));
    const onVis = () => ((away = document.hidden), sync());
    io.observe(el);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Stories gestures. Links/buttons always win; vertical drags scroll the page.
  const g = useRef({ x: 0, y: 0, t: 0, hold: 0, held: false, char: false, moved: false });
  const onDown = (e: React.PointerEvent) => {
    if ((e.target as Element).closest("a,button")) return;
    const r = gsap.utils.selector(root.current)(".av-pos")[0]?.getBoundingClientRect();
    const onChar = phase === "done" && !!r && e.clientX > r.left - 8 && e.clientX < r.right + 8 && e.clientY > r.top && e.clientY < r.bottom;
    g.current = { x: e.clientX, y: e.clientY, t: performance.now(), hold: 0, held: false, char: onChar, moved: false };
    if (phase === "playing" && !onChar)
      g.current.hold = window.setTimeout(() => {
        g.current.held = true;
        root.current!.dataset.held = "1";
        tlRef.current?.pause();
        setPaused(true);
      }, 230);
  };
  const onMove = (e: React.PointerEvent) => {
    const s = g.current;
    if (!s.t) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 8 || Math.abs(e.clientY - s.y) > 8) {
      s.moved = true;
      clearTimeout(s.hold);
    }
    if (s.char) {
      const q = gsap.utils.selector(root.current);
      gsap.to(q(".av-look"), { rotation: Math.max(-14, Math.min(14, dx / 6)), duration: 0.2, overwrite: "auto" });
      gsap.to(q(".av-eyes"), { x: Math.max(-3.5, Math.min(3.5, dx / 12)), duration: 0.2, overwrite: "auto" });
    }
  };
  const onUp = (e: React.PointerEvent) => {
    const s = g.current;
    clearTimeout(s.hold);
    if (!s.t) return;
    g.current.t = 0;
    const tl = tlRef.current;
    if (s.held) {
      delete root.current!.dataset.held;
      setPaused(false);
      tl?.resume();
      return;
    }
    if (s.char) {
      const q = gsap.utils.selector(root.current);
      gsap.to(q(".av-look,.av-eyes"), { rotation: 0, x: 0, duration: 0.6, ease: "elastic.out(1,0.4)", overwrite: "auto" });
      gsap.timeline().to(q(".av-pos"), { y: "-=16", duration: 0.16, ease: "power2.out" }).to(q(".av-pos"), { y: "+=16", duration: 0.16, ease: "power2.in" });
      gsap.fromTo(q(".av-armR"), { rotation: -8 }, { rotation: -150, duration: 0.18, yoyo: true, repeat: 1, ease: "back.out(2)" });
      navigator.vibrate?.(8);
      return;
    }
    if (s.moved || !tl || phase !== "playing") return;
    const box = root.current!.getBoundingClientRect();
    const t = tl.time();
    const cur = Math.max(0, BEATS.findIndex((b, i) => t >= b && t < BEATS[i + 1]));
    if (e.clientX < box.left + box.width / 3) tl.seek(t - BEATS[cur] < PACING.backGrace && cur > 0 ? BEATS[cur - 1] : BEATS[cur]);
    else if (cur >= 7) tl.progress(1);
    else tl.seek(BEATS[cur + 1]);
    tl.resume();
  };
  const onCancel = () => {
    clearTimeout(g.current.hold);
    if (g.current.held) {
      delete root.current!.dataset.held;
      setPaused(false);
      tlRef.current?.resume();
    }
    g.current.t = 0;
  };

  const skip = () => tlRef.current?.progress(1);
  const replay = () => {
    stopIdle();
    setPhase("playing");
    tlRef.current?.restart();
  };

  const lbl = phase === "playing" ? c.controlLabels[0] : c.controlLabels[1];
  // Floors keep labels readable when a short phone shrinks the scene.
  const tag = "invisible absolute font-body text-[max(3cqw,9.5px)] leading-tight opacity-0";
  const hudEl =
    hud &&
    createPortal(
      <>
        <div className="absolute top-5 right-14 left-0 flex gap-1" aria-hidden="true">
          {BEATS.slice(0, 8).map((b) => (
            <span key={b} className="p-seg relative h-[3px] flex-1 overflow-hidden rounded-full bg-beige-border">
              <i className="absolute inset-0 origin-left bg-terracotta" style={{ transform: `scaleX(${phase === "playing" ? 0 : 1})` }} />
            </span>
          ))}
        </div>
        {phase !== "static" && (
          <button type="button" onClick={phase === "playing" ? skip : replay} aria-label={lbl} title={lbl} className="absolute top-0 right-0 z-40 inline-flex h-11 w-11 items-center justify-center rounded-full border border-beige-border bg-ivory/90 text-warm-grey focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:outline-none">
            <svg viewBox="0 0 12 12" className="h-4 w-4" aria-hidden="true">
              {phase === "playing" ? <path d="M2 2.5 6.5 6 2 9.5Z M6.5 2.5 11 6 6.5 9.5Z" className="fill-current" /> : <path d="M2.5 6a3.5 3.5 0 1 0 1.2-2.6M2.5 1.5v2.2h2.2" className="fill-none stroke-current" strokeWidth="1.4" strokeLinecap="round" />}
            </svg>
          </button>
        )}
      </>,
      hud,
    );

  const ink = "fill-ivory stroke-sage";
  return (
    <div
      ref={root}
      className="p-stage relative mx-auto touch-pan-y select-none [container-type:inline-size] [-webkit-touch-callout:none]"
      style={{ width: "min(100cqw, calc(100cqh * 360 / 420))", aspectRatio: "360 / 420" }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onCancel}
      onContextMenu={(e) => e.preventDefault()}
    >
      {hudEl}
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" role="group">
        <line x1="0" y1="404" x2="360" y2="404" className="stroke-beige-border" strokeWidth="1.5" />

        {/* Meta Ads — feed card + Instant Form */}
        <g className="g-meta" opacity="0" role="img" aria-label={c.channelLabels[0]}>
          <rect x="20" y="8" width="150" height="104" rx="10" className={ink} strokeWidth="1.2" />
          <circle cx="34" cy="22" r="6" className="fill-sage" />
          <rect x="46" y="17" width="54" height="4" rx="2" className="fill-charcoal" fillOpacity="0.5" />
          <rect x="46" y="24" width="32" height="3" rx="1.5" className="fill-warm-grey" fillOpacity="0.4" />
          <rect x="28" y="34" width="134" height="46" rx="5" className="fill-sage" fillOpacity="0.2" />
          <path d="M80 70 L95 56 L110 70 Z M85 70 h20 v10 h-20 Z" className="fill-terracotta" fillOpacity="0.85" />
          <rect x="28" y="86" width="134" height="14" rx="4" className="fill-terracotta" />
          <g className="p-form">
            <rect x="36" y="30" width="118" height="78" rx="8" className="fill-ivory stroke-terracotta" strokeOpacity="0.6" />
            <rect x="46" y="39" width="62" height="5" rx="2.5" className="fill-charcoal" fillOpacity="0.5" />
            {[0, 1, 2].map((i) => (
              <rect key={i} x="46" y={50 + i * 12} width="98" height="8" rx="3" className="fill-cream stroke-beige-border" />
            ))}
            <rect x="46" y="88" width="98" height="11" rx="4" className="fill-sage-dark" />
          </g>
        </g>

        {/* Google Ads — search, sponsored result, tap */}
        <g className="g-goo" opacity="0" role="img" aria-label={c.channelLabels[1]}>
          <rect x="190" y="8" width="160" height="24" rx="12" className={ink} strokeWidth="1.2" />
          <circle cx="204" cy="19" r="4.5" className="fill-none stroke-sage-dark" strokeWidth="1.6" />
          <path d="M207 22.5 L211 26" className="stroke-sage-dark" strokeWidth="1.6" strokeLinecap="round" />
          {[
            [216, 30],
            [250, 22],
            [276, 34],
          ].map(([x, w]) => (
            <rect key={x} className="p-q fill-warm-grey" fillOpacity="0.55" x={x} y="17" width={w} height="5" rx="2.5" />
          ))}
          {[42, 66, 90].map((y, i) => (
            <g key={y} className="p-row">
              <rect x="198" y={y} width="110" height="6" rx="3" className={i ? "fill-sage-dark" : "fill-terracotta-dark"} fillOpacity={i ? 0.55 : 0.85} />
              <rect x="198" y={y + 10} width="70" height="4" rx="2" className="fill-warm-grey" fillOpacity="0.35" />
              {i === 0 && <rect x="316" y={y - 1} width="26" height="9" rx="4.5" className="fill-terracotta" />}
            </g>
          ))}
          <circle className="p-rip fill-none stroke-terracotta" cx="255" cy="46" r="14" strokeWidth="2" />
        </g>

        {/* Conversions API: dashed signal loops back to both channels */}
        <g className="g-capi" opacity="0" role="img" aria-label="Conversions API">
          <path d="M118 332 H112 V118 M107 124 L112 116 L117 124" className="p-flow fill-none stroke-sage-dark" strokeWidth="1.3" strokeDasharray="4 4" />
          <path d="M318 332 H352 V38 M347 44 L352 36 L357 44" className="p-flow fill-none stroke-sage-dark" strokeWidth="1.3" strokeDasharray="4 4" />
        </g>

        {/* Funnel — fills like liquid; the Jewar numbers count up */}
        <g transform={`translate(${FX} 0)`}>
        <g className="g-fun" opacity="0" role="img" aria-label={c.stages.join(", ")}>
          {FB.map(([t, b]) => (
            <path key={t} d={fBand(t, b)} className="fill-ivory stroke-terracotta" strokeOpacity="0.5" />
          ))}
          <Liquid id="pf" bands={FB} band={fBand} x0={110} x1={310} />
          {FB.map(([t], i) => (
            <g key={t} className="p-val">
              <text x="210" y={t + 19} textAnchor="middle" className={`font-body ${i === 2 ? "fill-ivory" : "fill-charcoal"}`} fillOpacity="0.75" fontSize="9" fontWeight="600" letterSpacing="1">
                {c.stages[i].toUpperCase()}
              </text>
              <text x="210" y={t + 38} textAnchor="middle" className={`p-num font-heading ${i === 2 ? "fill-ivory" : "fill-charcoal"}`} fontSize="15" fontWeight="700" data-v={i === 2 ? String(c.leadsValue) : c.stageValues[i]}>
                {i === 2 ? c.leadsValue.toLocaleString("en-IN") : c.stageValues[i]}
              </text>
            </g>
          ))}
        </g>

        {/* Systems: Pixel + CAPI → CRM → dashboard */}
        <g className="g-pipe" opacity="0" role="img" aria-label={c.systemNodes.join(" → ")}>
          <path d="M210 290 V304 H140 V318" pathLength={1} strokeDasharray="1" className="p-line fill-none stroke-sage" strokeWidth="1.3" />
          <path d="M170 332 H180" pathLength={1} strokeDasharray="1" className="p-line stroke-sage" strokeWidth="1.3" />
          <path d="M240 332 H250" pathLength={1} strokeDasharray="1" className="p-line stroke-sage" strokeWidth="1.3" />
          {[110, 180, 250].map((x, i) => (
            <g key={x} className="p-node">
              <rect x={x} y="318" width="60" height="28" rx="8" className={ink} strokeWidth="1.2" />
              {i === 0 && <path d={`M${x + 24} 326 v5 M${x + 36} 326 v5 M${x + 21} 331 h18 v3 a9 6 0 0 1 -18 0 z M${x + 30} 340 v3`} className="fill-none stroke-sage-dark" strokeWidth="1.4" strokeLinecap="round" />}
              {i === 1 && <path d={`M${x + 21} 326 a9 3 0 0 0 18 0 a9 3 0 0 0 -18 0 v12 a9 3 0 0 0 18 0 v-12`} className="fill-none stroke-sage-dark" strokeWidth="1.4" />}
              {i === 2 && <path d={`M${x + 20} 340 v-5 M${x + 27} 340 v-9 M${x + 34} 340 v-7 M${x + 41} 340 v-12`} className="stroke-terracotta" strokeWidth="3" strokeLinecap="round" />}
            </g>
          ))}
          <rect x="110" y="318" width="60" height="28" rx="8" className="st-errline fill-none stroke-terracotta-dark" strokeWidth="2" opacity="0" />
          <StatusBadge x={170} y={318} s={0.7} />
        </g>
        </g>

        {/* Toolkit pictograms */}
        <g className="g-tool" opacity="0">
          {[
            [50, 150, <path key="a" d="M-4 -9 v5 M4 -9 v5 M-7 -4 h14 v4 a7 6 0 0 1 -14 0 z M0 6 v5 M-12 -2 a12 12 0 0 1 0 -4 M12 -2 a12 12 0 0 0 0 -4" />],
            [102, 96, <path key="b" d="M-4 -9 Q-9 -9 -9 -4 V-2 Q-9 0 -12 0 Q-9 0 -9 2 V4 Q-9 9 -4 9 M4 -9 Q9 -9 9 -4 V-2 Q9 0 12 0 Q9 0 9 2 V4 Q9 9 4 9" />],
            [258, 96, <path key="c" d="M-9 -6 a9 3.5 0 0 0 18 0 a9 3.5 0 0 0 -18 0 v12 a9 3.5 0 0 0 18 0 v-12 M-9 0 a9 3.5 0 0 0 18 0" />],
            [310, 150, <path key="d" d="M-8 -5 h16 v12 h-16 z M0 -5 v-5 M-3 1 h0.1 M3 1 h0.1 M-11 0 v4 M11 0 v4" />],
          ].map(([x, y, d], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(1.4)`} role="img" aria-label={c.toolLabels[i]}>
              <g className="p-tool p-pop">
                <circle r="20" className="fill-ivory stroke-sage" strokeWidth="1.4" />
                <g className={`fill-none ${i === 3 ? "stroke-terracotta" : "stroke-sage-dark"}`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {d}
                </g>
              </g>
            </g>
          ))}
        </g>

        {/* Career steps + role props */}
        <g className="g-car" opacity="0">
          {STEPS.map(([x, y, w]) => (
            <rect key={x} className="p-step fill-ivory stroke-beige-border" x={x} y={y} width={w} height={404 - y} strokeWidth="1.5" />
          ))}
          <g transform={`translate(4 ${STEPS[0][1] - 372})`}>
          <g className="p-prop p-pop" role="img" aria-label={milestones[0]?.org}>
            <rect x="82" y="320" width="28" height="46" rx="5" className="fill-ivory stroke-charcoal" strokeOpacity="0.55" />
            <rect x="87" y="327" width="18" height="12" rx="2" className="fill-sage" fillOpacity="0.4" />
            <path d="M96 352 c-3 -4 -8 0 0 5 c8 -5 3 -9 0 -5z" className="fill-terracotta" />
          </g>
          </g>
          <g transform={`translate(-2 ${STEPS[1][1] - 340})`}>
          <g className="p-prop p-pop" role="img" aria-label={milestones[1]?.org}>
            <rect x="188" y="292" width="46" height="36" rx="4" className={ink} strokeWidth="1.2" />
            {[10, 16, 13, 22].map((h, i) => (
              <rect key={i} x={194 + i * 9} y={322 - h} width="6" height={h} rx="1" className={i === 3 ? "fill-terracotta" : "fill-sage"} />
            ))}
          </g>
          </g>
          <g transform={`translate(0 ${STEPS[2][1] - 308})`}>
          <g className="p-prop p-pop" role="img" aria-label={milestones[2]?.org}>
            <circle cx="326" cy="238" r="12" className="fill-none stroke-terracotta" strokeWidth="1.6" />
            <circle cx="326" cy="238" r="6" className="fill-none stroke-terracotta" strokeWidth="1.6" />
            <circle cx="326" cy="238" r="2" className="fill-terracotta" />
            {[306, 322, 338].map((x, i) => (
              <g key={x}>
                <circle cx={x} cy="270" r="5.5" className={i === 1 ? "fill-terracotta" : "fill-sage"} />
                <path d={`M${x - 8} 290 a8 8 0 0 1 16 0 z`} className={i === 1 ? "fill-terracotta" : "fill-sage"} fillOpacity="0.8" />
              </g>
            ))}
          </g>
          </g>
        </g>

        {/* Study + where */}
        <g className="g-stu" opacity="0">
          <g className="p-cap" role="img" aria-label={`${education[0]?.credential ?? ""} ${education[0]?.year ?? ""}`}>
            <path d="M40 62 L62 52 L84 62 L62 72 Z" className="fill-charcoal" />
            <path d="M50 66 v10 q12 6 24 0 v-10" className="fill-charcoal" fillOpacity="0.85" />
            <path d="M84 62 v12" className="stroke-terracotta" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g className="p-cap" role="img" aria-label={`${education[1]?.credential ?? ""} ${education[1]?.year ?? ""} · ${c.studyProgress}%`}>
            <circle cx="166" cy="66" r="32" className="fill-none stroke-beige-border" strokeWidth="5" />
            <circle className="p-ring fill-none stroke-terracotta" cx="166" cy="66" r="32" strokeWidth="5" pathLength={100} strokeDasharray="100" strokeDashoffset={100 - c.studyProgress} strokeLinecap="round" transform="rotate(-90 166 66)" data-p={c.studyProgress} />
            <path d="M150 58 L166 50 L182 58 L166 66 Z" className="fill-charcoal" />
            <path d="M150 84 L158 78 L166 80 L180 68" className="fill-none stroke-sage-dark" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g role="img" aria-label={`${place.location} · ${place.availability}`}>
            <g className="p-globe">
              <circle cx="285" cy="190" r="46" className="fill-sage stroke-sage" fillOpacity="0.12" strokeWidth="1.4" />
              <ellipse cx="285" cy="190" rx="20" ry="46" className="fill-none stroke-sage" strokeOpacity="0.6" />
              <path d="M239 190 H331 M245 168 H325 M245 212 H325" className="stroke-sage" strokeOpacity="0.5" />
              {[
                [222, 128],
                [350, 136],
                [346, 262],
                [224, 260],
              ].map(([x, y]) => (
                <g key={x}>
                  <path d={`M300 176 Q${(300 + x) / 2} ${Math.min(176, y) - 30} ${x} ${y}`} pathLength={1} strokeDasharray="1" className="p-arc fill-none stroke-terracotta" strokeOpacity="0.6" strokeWidth="1.2" />
                  <circle cx={x} cy={y} r="4" className="fill-terracotta" />
                </g>
              ))}
            </g>
            <path className="p-pin fill-terracotta" d="M300 182 c-7 -9 -9 -13 -9 -17 a9 9 0 0 1 18 0 c0 4 -2 8 -9 17 z M300 162 a3 3 0 1 0 0.1 0 z" />
          </g>
        </g>

        <g className="g-fin">
          <circle cx="180" cy="262" r="142" className="fill-terracotta" fillOpacity="0.06" />
        </g>
        <Spark x={DOC[0] + DOC[2] - 6} y={DOC[1] + 8} />
        <Avatar x={180} y={404} s={0.9} ps={FIN_S} pose="hold" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} className="p-coin" opacity="0">
            <circle r="6" className="fill-terracotta" />
            <circle r="3.6" className="fill-none stroke-ivory" strokeWidth="1.2" />
          </g>
        ))}
        {[0, 1, 2].map((i) => (
          <circle key={i} className="p-dot fill-terracotta" r="3.5" opacity="0" />
        ))}
      </svg>

      {/* Labels as HTML (wrap cleanly, stay crisp) — all from admin content */}
      <span className={`o-b o-meta ${tag} font-semibold text-terracotta-dark`} style={pct(20, 114, 150)}>{c.channelLabels[0]}</span>
      <span className={`o-b o-goo ${tag} font-semibold text-sage-dark`} style={pct(190, 114, 160)}>{c.channelLabels[1]}</span>
      {/* Campaign + its results as one left-aligned block: chips flow under the label however it wraps */}
      <div className={`o-b o-camp ${tag} text-warm-grey`} style={pct(GX, 136, 86)}>
        {c.campaignLabel}
        {c.metricChips.map((m, i) => (
          <span key={i} className={`p-num block font-semibold whitespace-nowrap text-charcoal ${i ? "" : "mt-[1.4cqw]"} text-[max(3.3cqw,10px)]`} data-v={m}>
            {m}
          </span>
        ))}
      </div>
      {milestones.slice(0, 3).map((m, i) => (
        <span key={m.org} className={`o-b o-step ${tag}`} style={pct(STEPS[i][0] + 8, STEPS[i][1] + 8, STEPS[i][2] - 16)}>
          <b className={`block text-[max(2.6cqw,8.5px)] tracking-[0.08em] uppercase ${m.current ? "text-terracotta" : "text-warm-grey"}`}>{m.date}</b>
          <span className="font-heading text-[max(3.2cqw,10px)] font-semibold text-charcoal">{m.org}</span>
        </span>
      ))}
      {education.slice(0, 2).map((e, i) => (
        <span key={e.year} className={`o-b o-edu ${tag} text-center font-semibold text-charcoal`} style={pct([22, 126][i], 106, 80)}>
          {e.year}
        </span>
      ))}
      <span className={`o-b o-place ${tag} text-center`} style={pct(185, 276, 200)}>
        <b className="block font-heading text-[max(3.6cqw,11px)] text-charcoal">{place.location}</b>
        <span className="text-warm-grey">{place.availability}</span>
      </span>

      <a href={resumeUrl} download={resumeFileName} tabIndex={-1} aria-hidden="true" className="p-doc absolute z-10 block" style={pct(...DOC)}>
        <svg viewBox="0 0 140 160" className="h-full w-full overflow-visible">
          <PhoneResume title={c.resumeLabel} name={name} />
        </svg>
      </a>

      {paused && (
        <span className="absolute top-[36%] left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-charcoal/70" aria-hidden="true">
          <span className="mx-[3px] h-5 w-1.5 rounded bg-ivory" />
          <span className="mx-[3px] h-5 w-1.5 rounded bg-ivory" />
        </span>
      )}
      {phase !== "playing" && (
        <svg viewBox="0 0 24 12" className="p-cue absolute bottom-0 left-1/2 h-3 w-6 -translate-x-1/2 text-warm-grey" aria-hidden="true">
          <path d="M3 2 L12 9 L21 2" className="fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}
