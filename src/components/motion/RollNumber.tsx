"use client";

import { useEffect, useRef } from "react";

/**
 * Odometer roll for a headline number ("292", "₹254"): each digit is a column
 * of 0–9 that rolls to its value right after load. The server renders every
 * column already on its final digit, so no JS / reduced motion shows the real
 * number and the layout never shifts. Non-digits stay plain text.
 */
export function RollNumber({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.dataset.mo = "wait";
    const id = requestAnimationFrame(() => requestAnimationFrame(() => (el.dataset.mo = "play")));
    return () => cancelAnimationFrame(id);
  }, []);
  let col = 0;
  return (
    <strong ref={ref} className={`roll ${className ?? ""}`} aria-label={text}>
      {[...text].map((ch, i) =>
        /\d/.test(ch) ? (
          <span key={i} aria-hidden="true" className="roll-col" style={{ "--d": Number(ch), "--c": col++ } as React.CSSProperties}>
            <span className="roll-strip">
              {"0123456789".split("").map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden="true">
            {ch}
          </span>
        ),
      )}
    </strong>
  );
}
