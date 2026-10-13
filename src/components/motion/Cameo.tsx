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
      .fromTo(el, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: "back.out(1.8)" })
      .to(q(".av-armR"), { rotation: -150, duration: 0.2, ease: "back.out(2)" }, 0.35)
      .to(q(".av-armR"), { rotation: -120, duration: 0.14, yoyo: true, repeat: 3, ease: "sine.inOut" }, 0.55)
      .to(q(".av-armR"), { rotation: -8, duration: 0.25 }, 1.15);
  });
  return (
    <svg ref={ref} viewBox="-40 -194 80 200" aria-hidden="true" className={`cameo overflow-visible ${className ?? ""}`}>
      <Avatar x={0} y={0} pose="rest" />
    </svg>
  );
}
