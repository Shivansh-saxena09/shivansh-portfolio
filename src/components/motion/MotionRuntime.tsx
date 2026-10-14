"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { countUp } from "@/components/motion/countUp";

const REVEAL = "main .mo-reveal, main .mo-split, main .mo-mask, main .roll";

/**
 * The one runtime behind the site's motion, loaded after hydration in its own
 * chunk, so no animated section needs client JS of its own:
 * - `.mo-reveal` / `.mo-split` / `.mo-mask` play once (data-mo="play") when ~20% into view;
 *   `.mo-count` inside a played block counts up from 0 to its real text (data-d = delay ms).
 *   Elements already on screen at load stay static, except `[data-mo-now]` and `.roll`
 *   (above-the-fold numbers), which play right away.
 * - `.mo-loop` ambient loops get data-run="0" while off-screen, which pauses them.
 * - Desktop only (fine pointer + hover): a context-aware cursor ring that grows over
 *   links/buttons, shows "view" over images and hides over form fields. The native
 *   cursor stays; the ring is decoration only.
 * Reduced motion: nothing is marked, so every element keeps its finished frame.
 */
export function MotionRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const play = (el: HTMLElement) => {
      el.dataset.mo = "play";
      el.querySelectorAll<HTMLElement>(".mo-count").forEach((n, i) => countUp(n, Number(n.dataset.d ?? i * 220)));
    };
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          play(e.target as HTMLElement);
        }),
      { threshold: 0.2, rootMargin: "0px 0px -18% 0px" },
    );
    const raf: number[] = [];
    document.querySelectorAll<HTMLElement>(REVEAL).forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) {
        if (!el.hasAttribute("data-mo-now") && !el.classList.contains("roll")) return;
        el.dataset.mo = "wait";
        raf.push(requestAnimationFrame(() => raf.push(requestAnimationFrame(() => play(el)))));
        return;
      }
      el.dataset.mo = "wait";
      io.observe(el);
    });
    // Skills strip: clone the server-rendered row once so the loop is seamless, then let it move.
    document.querySelectorAll<HTMLElement>(".skills-track:not([data-cloned])").forEach((ul) => {
      [...ul.children].forEach((li) => {
        const c = li.cloneNode(true) as HTMLElement;
        c.setAttribute("aria-hidden", "true");
        ul.append(c);
      });
      ul.dataset.cloned = "";
    });
    const loops = new IntersectionObserver((entries) => entries.forEach((e) => ((e.target as HTMLElement).dataset.run = e.isIntersecting ? "1" : "0")));
    document.querySelectorAll(".mo-loop").forEach((el) => loops.observe(el));
    return () => {
      io.disconnect();
      loops.disconnect();
      raf.forEach(cancelAnimationFrame);
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
      if (!ring.dataset.on) ring.dataset.on = "1";
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const over = (e: Event) => {
      const t = e.target as Element;
      const c = t.closest("input, textarea, select, [contenteditable]") ? "hide" : t.closest("a, button, [role='button'], summary, label") ? "link" : t.closest(".mo-mask, .skel") ? "view" : "";
      // Only touch the DOM when the context actually changes (keeps clicks free of style work).
      if ((ring.dataset.c ?? "") !== c) ring.dataset.c = c;
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
