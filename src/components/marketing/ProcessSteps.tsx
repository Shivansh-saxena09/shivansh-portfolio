"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "@/components/motion/SplitText";

gsap.registerPlugin(ScrollTrigger);

/**
 * "How I run a campaign": the admin's steps on a line that draws with scroll;
 * each node and its text land as the line reaches them. Empty steps are
 * dropped by the page. Reduced motion: drawn, everything visible.
 */
export function ProcessSteps({ heading, steps }: { heading: string; steps: { title: string; detail: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ps-line", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: el, start: "top 75%", end: "bottom 65%", scrub: 0.5 } });
      gsap.utils.toArray<HTMLElement>(".ps-step").forEach((s) =>
        gsap.from(s, { autoAlpha: 0.15, x: 14, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: s, start: "top 72%", toggleActions: "play none none none" } }),
      );
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <section className="border-t border-beige-border/70 bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h2 className="mo-split font-heading text-3xl text-charcoal sm:text-4xl">
          <SplitText text={heading} />
        </h2>
        <div ref={ref} className="relative mt-10">
          <span aria-hidden="true" className="ps-line absolute top-3 bottom-3 left-[15px] w-[2px] origin-top bg-gradient-to-b from-terracotta to-sage" />
          <ol className="flex flex-col gap-8">
            {steps.map((s, i) => (
              <li key={i} className="ps-step relative flex gap-5">
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-terracotta bg-ivory font-heading text-sm font-bold text-terracotta">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <h3 className="font-heading text-xl text-charcoal">{s.title}</h3>
                  {s.detail && <p className="mt-1 font-body text-sm leading-relaxed text-warm-grey">{s.detail}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
