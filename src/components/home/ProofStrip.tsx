import { CountUpText } from "@/components/motion/CountUpText";

export type ProofItem = { label: string; text: string };

/**
 * Home, below the hero: real totals summed across every published case study
 * (labels: admin "Site motion labels"). Items with no data are dropped by the
 * page; with none left, nothing renders.
 */
export function ProofStrip({ items }: { items: ProofItem[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-label={items.map((i) => i.label).join(", ")} className="border-b border-beige-border/70 bg-ivory py-10 sm:py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-5 sm:grid-cols-3 sm:px-8">
        {items.map((item, i) => (
          <div key={item.label} className="flex items-baseline gap-3 sm:block sm:text-center">
            <CountUpText text={item.text} delay={i * 220} className="font-heading text-3xl font-bold text-terracotta sm:text-4xl" />
            <p className="font-body text-xs font-semibold tracking-[0.14em] text-warm-grey uppercase sm:mt-2">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
