import "@/components/marketing/marketing-motion.css";
import { SplitText } from "@/components/motion/SplitText";

/**
 * "How I run a campaign": the admin's steps on a line that draws as you scroll
 * (CSS scroll-driven animation where supported; elsewhere the line is simply
 * drawn) and each step lands as it scrolls in (MotionRuntime). No JS of its
 * own. Empty steps are dropped by the page. Reduced motion: all visible.
 */
export function ProcessSteps({ heading, steps }: { heading: string; steps: { title: string; detail: string }[] }) {
  return (
    <section className="border-t border-beige-border/70 bg-cream py-20 sm:py-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8 lg:max-w-6xl">
        <h2 className="mo-split font-heading text-3xl text-charcoal sm:text-4xl">
          <SplitText text={heading} />
        </h2>
        <div className="relative mt-10">
          <span aria-hidden="true" className="ps-line absolute top-3 bottom-3 left-[15px] w-[2px] origin-top bg-gradient-to-b from-terracotta to-sage lg:hidden" />
          {/* Desktop: the same steps as a row, so the section uses the width instead of a narrow column */}
          <span aria-hidden="true" className="ps-line-h absolute top-[15px] right-4 left-4 hidden h-[2px] origin-left bg-gradient-to-r from-terracotta to-sage lg:block" />
          <ol className="flex flex-col gap-8 lg:grid lg:grid-cols-[repeat(var(--n),minmax(0,1fr))] lg:gap-6" style={{ "--n": steps.length } as React.CSSProperties}>
            {steps.map((s, i) => (
              <li key={i} className="ps-step mo-reveal relative flex gap-5 lg:flex-col lg:gap-4">
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-terracotta bg-ivory font-heading text-sm font-bold text-terracotta">
                  {i + 1}
                </span>
                <div className="pt-0.5 lg:pt-0">
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
