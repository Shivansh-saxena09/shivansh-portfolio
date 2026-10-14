import type { CSSProperties } from "react";

/**
 * Server-rendered word split for heading reveals: each word is its own span
 * (`.mo-w`, stagger index `--i`), whitespace stays real text so copy, search
 * and screen readers read the heading normally. The heading itself carries
 * `.mo-split`; MotionRuntime plays it once when it scrolls into view.
 */
export function SplitText({ text }: { text: string }) {
  let n = 0;
  return (
    <>
      {text.split(/(\s+)/).map((w, i) =>
        /^\s*$/.test(w) ? (
          w
        ) : (
          <span key={i} className="mo-w" style={{ "--i": n++ } as CSSProperties}>
            {w}
          </span>
        ),
      )}
    </>
  );
}
