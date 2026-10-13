"use client";

import { useRef, type ReactNode } from "react";
import { useRevealOnce } from "@/components/motion/useRevealOnce";

/** Wraps server-rendered content so its `.mo-pop` children stagger in once (see globals.css). */
export function Reveal({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useRevealOnce(ref);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
