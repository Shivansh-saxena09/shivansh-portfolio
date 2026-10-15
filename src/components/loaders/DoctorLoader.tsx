"use client";

import "@/components/loaders/loaders.css";
import { Avatar } from "@/components/home/sceneParts";

/**
 * Campaign Doctor thinking: the site's character studies its notes while three
 * wordless steps cycle: data rows in, chart bars, verdict tick.
 */
export function DoctorLoader() {
  return (
    <div role="status" aria-label="Analysing" className="ld-doctor flex items-center gap-4">
      <svg viewBox="-34 -196 68 202" aria-hidden="true" className="h-20 w-auto overflow-visible">
        <Avatar x={0} y={0} pose="hold" />
      </svg>
      <svg viewBox="0 0 120 64" aria-hidden="true" className="h-16 w-auto">
        <rect x="1" y="1" width="118" height="62" rx="10" className="fill-ivory stroke-beige-border" />
        <g className="ld-step ld-step-1">
          {[14, 26, 38].map((y, i) => (
            <rect key={y} x="14" y={y} width={[70, 54, 62][i]} height="5" rx="2.5" className="fill-warm-grey" fillOpacity="0.35" />
          ))}
          <circle cx="98" cy="31" r="7" className="fill-none stroke-sage-dark" strokeWidth="2" />
          <path d="M103 36l5 5" className="stroke-sage-dark" strokeWidth="2" strokeLinecap="round" />
        </g>
        <g className="ld-step ld-step-2">
          {[22, 30, 18, 38].map((h, i) => (
            <rect key={i} x={30 + i * 16} y={50 - h} width="10" height={h} rx="2" className={i === 3 ? "fill-terracotta" : "fill-sage"} />
          ))}
        </g>
        <g className="ld-step ld-step-3">
          <circle cx="60" cy="32" r="16" className="fill-sage/15" />
          <path d="M51 32l6 6 12-13" className="fill-none stroke-sage-dark" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}
