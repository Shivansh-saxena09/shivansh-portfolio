"use client";

import { useSyncExternalStore } from "react";

export type CtaBias = "marketing" | "engineering-leaning";

/**
 * Homepage CTA emphasis (see CLAUDE.md → Homepage):
 * default (no referrer, or unrecognized referrer) always favors Marketing.
 * A LinkedIn referrer is a secondary signal that lightly evens out the
 * emphasis toward Engineering — it never flips Marketing to secondary.
 *
 * document.referrer doesn't exist during SSR, so this reads it via
 * useSyncExternalStore: the server/first-paint snapshot is always
 * "marketing", and the real value is read right after hydration.
 */
function getSnapshot(): CtaBias {
  try {
    const referrer = document.referrer;
    if (!referrer) return "marketing";
    const host = new URL(referrer).hostname;
    return host.includes("linkedin.com") ? "engineering-leaning" : "marketing";
  } catch {
    return "marketing";
  }
}

function getServerSnapshot(): CtaBias {
  return "marketing";
}

// document.referrer is set once per navigation and never changes afterward,
// so there's nothing to subscribe to.
function subscribe(): () => void {
  return () => {};
}

export function useReferrerBias(): CtaBias {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
