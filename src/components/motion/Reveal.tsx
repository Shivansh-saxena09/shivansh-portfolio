import type { ReactNode } from "react";

/**
 * Marks server-rendered content for a play-once reveal. No JS of its own:
 * MotionRuntime (loaded lazily after hydration) sets data-mo on `.mo-reveal`
 * when it scrolls in, which starts the CSS of its children (`.mo-pop` etc.)
 * and counts up any `.mo-count` inside. `now`: if it is already on screen at
 * load, play right away instead of staying static.
 */
export function Reveal({ className, now, children }: { className?: string; now?: boolean; children: ReactNode }) {
  return (
    <div className={`mo-reveal ${className ?? ""}`} data-mo-now={now ? "" : undefined}>
      {children}
    </div>
  );
}
