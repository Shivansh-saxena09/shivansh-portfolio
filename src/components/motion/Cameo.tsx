"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { Avatar } from "@/components/home/sceneParts";
import { useRevealOnce } from "@/components/motion/useRevealOnce";

/** The site's character stands on the closing CTA and waves once when it scrolls into view. */
export function Cameo({ className }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useRevealOnce(ref, (el) => {
    const q = gsap.utils.selector(el);
    gsap
      .timeline()
      .fromTo(el, { y: 28, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: "back.out(1.8)" })
      .to(el, { keyframes: [{ y: -10, duration: 0.18, ease: "power2.out" }, { y: 0, duration: 0.2, ease: "power2.in" }] }, 0.55)
      .to(q(".av-armR"), { rotation: -150, duration: 0.22, ease: "back.out(2)" }, 0.95)
      .to(q(".av-armR"), { rotation: -118, duration: 0.16, yoyo: true, repeat: 5, ease: "sine.inOut" }, 1.17)
      .to(q(".av-armR"), { rotation: -8, duration: 0.3 }, 2.15);
  });
  return (
    <svg ref={ref} viewBox="-40 -194 80 200" aria-hidden="true" className={`cameo overflow-visible ${className ?? ""}`}>
      <Avatar x={0} y={0} pose="rest" />
    </svg>
  );
}
