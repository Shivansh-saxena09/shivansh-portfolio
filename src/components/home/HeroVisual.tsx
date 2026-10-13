"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import type { HeroVisualContent } from "@/lib/data/heroVisual";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * Hero motion graphic: ad spend pours into a campaign funnel (marketing,
 * terracotta, foreground), the leads that survive it flow down into a
 * bracketed system layer of nodes (engineering, sage, supporting), and a
 * dashed "conversion signal" loop runs from that system back up to the
 * spend — the two worlds visibly closing into one loop.
 *
 * Perf: shapes are static SVG; the only per-frame motion is SMIL
 * (animateMotion) and CSS keyframes, which run without JS on each frame.
 * GSAP only plays a one-off ~2.6s intro. Each SVG pauses its SMIL clock
 * when off-screen (or display:none — so the hidden mobile/desktop variant
 * costs nothing). Reduced motion gets the finished static composition.
 * The h1 stays the LCP element; nothing here loads a network asset.
 */

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

// ---- Desktop geometry (viewBox 480 × 540) --------------------------------
const CX = 240;
const FUNNEL_TOP = 90;
const SLOPE = 0.638; // half-width lost per px of height
const halfWidth = (y: number) => 180 - (y - FUNNEL_TOP) * SLOPE;
const BANDS = [
  [90, 170],
  [178, 250],
  [258, 322],
] as const;
const trapezoid = (top: number, bottom: number) =>
  `M${CX - halfWidth(top)} ${top} H${CX + halfWidth(top)} L${CX + halfWidth(bottom)} ${bottom} H${CX - halfWidth(bottom)} Z`;

const NODE_X = [100, 240, 380];
const FEEDBACK_PATH = "M380 440 V482 H470 V58 H262";
const PIPE_PATHS = ["M240 322 V370 H100 V400", "M240 322 V400", "M240 322 V370 H380 V400"];

// Deterministic particle layout (no Math.random → no hydration mismatch).
const PARTICLES = Array.from({ length: 14 }, (_, i) => {
  const xTop = 112 + ((i * 89) % 256);
  const survivor = i % 5 === 0;
  const endY = survivor ? 336 : i % 2 ? 166 : 246;
  const xAt = (y: number) => CX + ((xTop - CX) * halfWidth(y)) / halfWidth(FUNNEL_TOP);
  const path = survivor
    ? `M${CX} 50 Q${xTop} 58 ${xTop} ${FUNNEL_TOP} L${xAt(250).toFixed(1)} 250 L${CX} 322 V336`
    : `M${CX} 50 Q${xTop} 58 ${xTop} ${FUNNEL_TOP} L${xAt(endY).toFixed(1)} ${endY}`;
  return { path, begin: (i * 0.21).toFixed(2), dur: survivor ? "2.8s" : "2.2s", survivor };
});

// ---- Mobile geometry (viewBox 380 × 132), funnel turned on its side -----
const M_SLOPE = 0.233;
const mHalf = (x: number) => 56 - (x - 34) * M_SLOPE;
const M_BANDS = [
  [34, 96],
  [102, 158],
  [164, 210],
] as const;
const mTrapezoid = (l: number, r: number) =>
  `M${l} ${66 - mHalf(l)} L${r} ${66 - mHalf(r)} V${66 + mHalf(r)} L${l} ${66 + mHalf(l)} Z`;
const M_NODE_Y = [24, 66, 108];
const M_PIPE_PATHS = M_NODE_Y.map((y) => `M210 66 H236 V${y} H252`);
const M_FEEDBACK = "M350 108 V128 H6 V66 H20";
const M_PARTICLES = Array.from({ length: 9 }, (_, i) => {
  const yL = 22 + ((i * 41) % 88);
  const survivor = i % 4 === 0;
  const endX = survivor ? 222 : i % 2 ? 94 : 156;
  const yAt = (x: number) => 66 + ((yL - 66) * mHalf(x)) / mHalf(34);
  const path = survivor
    ? `M6 66 Q20 ${yL} 34 ${yL} L${158} ${yAt(158).toFixed(1)} L210 66 H222`
    : `M6 66 Q20 ${yL} 34 ${yL} L${endX} ${yAt(endX).toFixed(1)}`;
  return { path, begin: (i * 0.27).toFixed(2), dur: survivor ? "2.6s" : "2s", survivor };
});

function Particle({ path, begin, dur, r, className }: { path: string; begin: string; dur: string; r: number; className: string }) {
  return (
    <circle r={r} className={className} opacity="0">
      <animateMotion path={path} dur={dur} begin={`${begin}s`} repeatCount="indefinite" />
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.8;1" dur={dur} begin={`${begin}s`} repeatCount="indefinite" />
    </circle>
  );
}

function DesktopGraphic({ c, animated }: { c: HeroVisualContent; animated: boolean }) {
  return (
    <svg viewBox="0 0 480 540" className="hv-svg absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <pattern id="hv-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" className="fill-warm-grey" fillOpacity="0.22" />
        </pattern>
        <radialGradient id="hv-fade">
          <stop offset="0.3" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="hv-mask">
          <rect width="480" height="540" fill="url(#hv-fade)" />
        </mask>
      </defs>

      <rect width="480" height="540" fill="url(#hv-dots)" mask="url(#hv-mask)" className="hv-fade-in" />

      {/* Engineering layer — sits behind and below, the supporting system */}
      <g className="hv-bracket">
        <text x="16" y="452" className="fill-sage font-heading" fontSize="104" fillOpacity="0.28">{"{"}</text>
        <text x="464" y="452" textAnchor="end" className="fill-sage font-heading" fontSize="104" fillOpacity="0.28">{"}"}</text>
      </g>

      {PIPE_PATHS.map((d) => (
        <path key={d} d={d} pathLength={1} className="hv-line stroke-sage" strokeWidth="1.5" fill="none" strokeDasharray="1" />
      ))}

      <path d={FEEDBACK_PATH} className={`hv-feedback stroke-sage ${animated ? "hv-flow" : ""}`} strokeWidth="1.25" fill="none" strokeDasharray="4 6" strokeOpacity="0.7" />
      <text x="0" y="0" transform="translate(462 160) rotate(-90)" textAnchor="middle" className="hv-feedback fill-sage-dark font-body" fontSize="10" letterSpacing="2.5">
        {c.feedbackLabel.toUpperCase()}
      </text>
      <path d="M268 52 L258 58 L268 64" className="hv-feedback stroke-sage" strokeWidth="1.25" fill="none" />

      {NODE_X.map((x, i) => (
        <g key={x} className="hv-node">
          <rect x={x - 62} y="400" width="124" height="40" rx="9" className="fill-ivory stroke-sage" strokeWidth="1.25" />
          {animated && (
            <rect x={x - 62} y="400" width="124" height="40" rx="9" className="hv-pulse fill-none stroke-sage" strokeWidth="3" style={{ animationDelay: `${i * 0.8}s` }} />
          )}
          <circle cx={x} cy="400" r="3" className="fill-sage" />
          <text x={x} y="424.5" textAnchor="middle" className="fill-sage-dark font-mono" fontSize="11">
            {c.systemNodes[i]}
          </text>
        </g>
      ))}

      {/* Marketing layer — the funnel, foreground and strongest colour */}
      {BANDS.map(([top, bottom], i) => (
        <g key={top} className="hv-band">
          <path d={trapezoid(top, bottom)} className="fill-terracotta stroke-terracotta" fillOpacity={[0.1, 0.2, 0.88][i]} strokeOpacity="0.45" strokeWidth="1" />
          <text
            x={CX}
            y={(top + bottom) / 2 + 4}
            textAnchor="middle"
            className={`font-body ${i === 2 ? "fill-ivory" : "fill-charcoal"}`}
            fillOpacity={i === 2 ? 1 : 0.7}
            fontSize="11"
            fontWeight="600"
            letterSpacing="2.5"
          >
            {c.stages[i].toUpperCase()}
          </text>
        </g>
      ))}

      {animated && (
        <g className="hv-particles">
          {PARTICLES.map((p, i) => (
            <Particle key={i} path={p.path} begin={p.begin} dur={p.dur} r={p.survivor ? 3.2 : 2.6} className="fill-terracotta" />
          ))}
          {PIPE_PATHS.map((d, i) => (
            <Particle key={d} path={d} begin={(0.4 + i * 0.9).toFixed(2)} dur="1.6s" r={3} className="fill-sage-dark" />
          ))}
          <Particle path={FEEDBACK_PATH} begin="1.2" dur="4.2s" r={2.6} className="fill-sage" />
        </g>
      )}
    </svg>
  );
}

function MobileGraphic({ c, animated }: { c: HeroVisualContent; animated: boolean }) {
  return (
    <svg viewBox="0 0 380 132" className="hv-svg h-auto w-full overflow-visible" aria-hidden="true">
      <g className="hv-bracket">
        <text x="222" y="104" className="fill-sage font-heading" fontSize="96" fillOpacity="0.3">{"{"}</text>
        <text x="380" y="104" textAnchor="end" className="fill-sage font-heading" fontSize="96" fillOpacity="0.3">{"}"}</text>
      </g>

      {M_PIPE_PATHS.map((d) => (
        <path key={d} d={d} pathLength={1} className="hv-line stroke-sage" strokeWidth="1.25" fill="none" strokeDasharray="1" />
      ))}
      <path d={M_FEEDBACK} className={`hv-feedback stroke-sage ${animated ? "hv-flow" : ""}`} strokeWidth="1" fill="none" strokeDasharray="3 5" strokeOpacity="0.7" />

      {M_NODE_Y.map((y, i) => (
        <g key={y} className="hv-node">
          <rect x="252" y={y - 11} width="98" height="22" rx="6" className="fill-ivory stroke-sage" strokeWidth="1" />
          <text x="301" y={y + 3.5} textAnchor="middle" className="fill-sage-dark font-mono" fontSize="9">
            {c.systemNodes[i]}
          </text>
        </g>
      ))}

      {M_BANDS.map(([l, r], i) => (
        <path key={l} d={mTrapezoid(l, r)} className="hv-band fill-terracotta stroke-terracotta" fillOpacity={[0.1, 0.2, 0.88][i]} strokeOpacity="0.45" strokeWidth="1" />
      ))}
      <text x="187" y="69.5" textAnchor="middle" className="hv-band fill-ivory font-body" fontSize="8.5" fontWeight="600" letterSpacing="1.5">
        {c.stages[2].toUpperCase()}
      </text>

      {animated && (
        <g className="hv-particles">
          {M_PARTICLES.map((p, i) => (
            <Particle key={i} path={p.path} begin={p.begin} dur={p.dur} r={p.survivor ? 2.6 : 2.2} className="fill-terracotta" />
          ))}
          {M_PIPE_PATHS.map((d, i) => (
            <Particle key={d} path={d} begin={(0.3 + i * 0.7).toFixed(2)} dur="1.3s" r={2.4} className="fill-sage-dark" />
          ))}
          <Particle path={M_FEEDBACK} begin="1" dur="3.6s" r={2.2} className="fill-sage" />
        </g>
      )}
    </svg>
  );
}

function Sparkline() {
  return (
    <svg viewBox="0 0 96 28" className="h-7 w-24" aria-hidden="true">
      <path d="M2 25 L14 22 L24 23 L36 17 L46 18 L58 12 L70 13 L82 6 L94 3" pathLength={1} strokeDasharray="1" className="hv-line stroke-terracotta" strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="94" cy="3" r="2.5" className="hv-node fill-terracotta" />
    </svg>
  );
}

export function HeroVisual({ content, variant }: { content: HeroVisualContent; variant: "desktop" | "mobile" }) {
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const animated = !reduced;

  // One-off intro, then hand over to SMIL/CSS loops.
  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !animated) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ delay: 0.35, defaults: { ease: "power3.out" } });
      tl.from(q(".hv-fade-in"), { opacity: 0, duration: 1.2 }, 0)
        .from(q(".hv-band"), { opacity: 0, y: -14, duration: 0.7, stagger: 0.14 }, 0.05)
        .from(q(".hv-particles"), { opacity: 0, duration: 0.6 }, 0.35)
        .from(q(".hv-card"), { opacity: 0, y: 14, duration: 0.7, stagger: 0.12 }, 0.5)
        .from(q(".hv-line"), { strokeDashoffset: 1, duration: 0.9, stagger: 0.08, ease: "power2.inOut" }, 0.8)
        .from(q(".hv-node"), { opacity: 0, y: 8, duration: 0.5, stagger: 0.1 }, 1.25)
        .from(q(".hv-bracket"), { opacity: 0, scale: 0.92, transformOrigin: "50% 50%", duration: 0.9 }, 1.4)
        .from(q(".hv-feedback"), { opacity: 0, duration: 0.8 }, 1.8);

      const counter = counterRef.current;
      if (counter) {
        const target = { v: 0 };
        const final = Number(counter.dataset.value);
        tl.to(target, {
          v: final,
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            counter.textContent = Math.round(target.v).toLocaleString("en-IN");
          },
        }, 0.55);
      }
    }, root);
    return () => ctx.revert();
  }, [animated]);

  // Pause SMIL + CSS loops whenever this variant isn't on screen.
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

  const leads = content.leadsValue.toLocaleString("en-IN");

  if (variant === "mobile") {
    return (
      <div ref={rootRef} className="relative">
        <MobileGraphic c={content} animated={animated} />
        <div className="hv-card mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-xs text-warm-grey">
          <span className="text-terracotta">{content.spendLabel}</span>
          <span aria-hidden="true" className="text-beige-border">/</span>
          <span>
            <span ref={counterRef} data-value={content.leadsValue} className="font-heading text-base font-bold text-charcoal tabular-nums">
              {leads}
            </span>{" "}
            {content.leadsLabel}
          </span>
          <span aria-hidden="true" className="text-beige-border">/</span>
          <span>{content.metricChips.join(" · ")}</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative mx-auto aspect-[480/540] w-full max-w-[460px]">
      <DesktopGraphic c={content} animated={animated} />

      <div className="hv-card glass-card absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 rounded-full px-4 py-1.5 font-body text-xs font-semibold tracking-[0.12em] text-terracotta uppercase whitespace-nowrap">
        {content.spendLabel}
      </div>

      <div className="hv-card glass-card absolute top-[27%] -left-3 flex flex-col gap-1.5 rounded-xl px-3.5 py-3 sm:-left-8">
        {content.metricChips.map((chip) => (
          <span key={chip} className="font-body text-xs font-semibold text-charcoal tabular-nums whitespace-nowrap">
            {chip}
          </span>
        ))}
      </div>

      <div className="hv-card glass-card absolute top-[45%] -right-3 rounded-2xl px-4 py-3.5 sm:-right-8">
        <span ref={counterRef} data-value={content.leadsValue} className="block font-heading text-3xl font-bold leading-none text-charcoal tabular-nums">
          {leads}
        </span>
        <span className="mt-1 block font-body text-[11px] text-warm-grey">{content.leadsLabel}</span>
        <div className="mt-2">
          <Sparkline />
        </div>
      </div>
    </div>
  );
}
