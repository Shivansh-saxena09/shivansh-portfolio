
export type ProofItem = { label: string; text: string };

/**
 * Home, below the hero: real totals summed across every published case study
 * (labels: admin "Site motion labels"). Items with no data are dropped by the
 * page; with none left, nothing renders.
 */
export function ProofStrip({ items }: { items: ProofItem[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-label={items.map((i) => i.label).join(", ")} data-mo-now="" className="mo-reveal border-b border-beige-border/70 bg-ivory py-10 sm:py-12">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-5 sm:grid-cols-3 sm:px-8">
        {items.map((item, i) => (
          <div key={item.label} className="flex flex-wrap items-baseline gap-x-3 sm:block sm:text-center">
            <span className="mo-count font-heading text-3xl font-bold text-terracotta tabular-nums sm:text-4xl" data-d={i * 220}>
              {item.text}
            </span>
            <p className="font-body text-xs font-semibold tracking-[0.14em] text-warm-grey uppercase sm:mt-2">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
