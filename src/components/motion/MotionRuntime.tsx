"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { observeOnce } from "@/components/motion/useRevealOnce";

/**
 * One site-wide runtime, loaded after hydration in its own chunk:
 * - plays `.mo-split` headings and `.mo-mask` images once as they scroll in;
 * - pauses `.mo-loop` ambient loops (skills strip, AI waveform, flow packets) while off-screen;
 * - desktop only (fine pointer + hover, no reduced motion): a context-aware cursor ring
 *   that grows over links/buttons, shows "view" over images and hides over form fields.
 *   The native cursor stays visible; the ring is decoration only.
 */
export function MotionRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    const els = [...document.querySelectorAll("main .mo-split, main .mo-mask")];
    const stopReveal = observeOnce(els);
    const loops = [...document.querySelectorAll<HTMLElement>(".mo-loop")];
    const io = new IntersectionObserver((entries) => entries.forEach((e) => ((e.target as HTMLElement).dataset.run = e.isIntersecting ? "1" : "0")));
    loops.forEach((el) => io.observe(el));
    return () => {
      stopReveal();
      io.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ring = document.createElement("div");
    ring.className = "cur";
    ring.setAttribute("aria-hidden", "true");
    document.body.append(ring);
    let x = -100,
      y = -100,
      tx = x,
      ty = y,
      raf = 0;
    const tick = () => {
      x += (tx - x) * 0.3;
      y += (ty - y) * 0.3;
      ring.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      ring.dataset.on = "1";
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const over = (e: Event) => {
      const t = e.target as Element;
      ring.dataset.c = t.closest("input, textarea, select, [contenteditable]") ? "hide" : t.closest("a, button, [role='button'], summary, label") ? "link" : t.closest(".mo-mask, .skel") ? "view" : "";
    };
    const leave = () => delete ring.dataset.on;
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
      ring.remove();
    };
  }, []);

  return null;
}
