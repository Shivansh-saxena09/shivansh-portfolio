"use client";

import { useEffect, useRef } from "react";
import { countUp } from "@/components/motion/countUp";

/**
 * A number that counts up once from 0 to its real (server-rendered) text when
 * it scrolls into view, or right after load when it is already on screen.
 * Non-numeric text is left alone; reduced motion shows the final value.
 */
export function CountUpText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        countUp(el, delay);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {text}
    </span>
  );
}
