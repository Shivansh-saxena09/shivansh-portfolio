"use client";

import { useEffect, type RefObject } from "react";

/**
 * Play-once scroll reveal for below-the-fold motion. Drives a `data-mo`
 * attribute on the element (no React state, no re-render):
 * - SSR / no JS / reduced motion / already on screen at mount → no
 *   attribute, so CSS shows the finished static frame (never a flash).
 * - Otherwise "wait" (CSS holds the start frame) → "play" once ≥25% is in
 *   view; `onPlay` runs then, for JS-driven bits like count-ups.
 */
export function useRevealOnce(ref: RefObject<Element | null>, onPlay?: (el: Element) => void) {
  useEffect(() => {
    const el = ref.current as HTMLElement | null;
    if (!el || typeof IntersectionObserver === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) return;
    el.dataset.mo = "wait";
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        el.dataset.mo = "play";
        onPlay?.(el);
      },
      // Fires once the element is clearly on screen (top ~20% into view), not at its first pixel.
      { threshold: 0.2, rootMargin: "0px 0px -18% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

