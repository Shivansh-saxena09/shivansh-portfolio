import "@/components/engineering/engineering-motion.css";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

/**
 * The featured project's real data flow (its admin "How it works" steps) with
 * packets travelling between nodes: three runs once it scrolls in, paused
 * while off-screen (MotionRuntime data-run). Fewer than 2 steps → nothing.
 * Reduced motion: the static diagram.
 */
export function FlowPackets({ steps, href, name }: { steps: { label: string; detail: string }[]; href: string; name: string }) {
  if (steps.length < 2) return null;
  return (
    <Reveal className="mo-loop mt-10 rounded-2xl border border-beige-border bg-cream p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Link href={href} className="tap nav-underline font-body text-xs font-semibold tracking-[0.15em] text-sage-dark uppercase">
          {name} →
        </Link>
      </div>
      <ol className="mt-6 flex flex-col items-stretch gap-0 sm:flex-row sm:items-center">
        {steps.map((s, i) => (
          <li key={s.label} className="contents">
            <div className="mo-pop rounded-xl border border-beige-border bg-ivory px-4 py-3 text-center sm:flex-1" style={{ "--i": i * 2 } as React.CSSProperties}>
              <p className="font-heading text-base font-bold text-charcoal">{s.label}</p>
              <p className="mt-0.5 font-body text-xs text-warm-grey">{s.detail}</p>
            </div>
            {i < steps.length - 1 && (
              <span aria-hidden="true" className="fp-wire relative mx-auto h-8 w-[2px] shrink-0 bg-beige-border sm:mx-0 sm:h-[2px] sm:w-10" style={{ "--i": i } as React.CSSProperties}>
                <i className="fp-packet absolute h-2 w-2 rounded-full bg-terracotta" />
              </span>
            )}
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
