import { education } from "@/content/about";

/**
 * Accent color echoes the site's marketing=terracotta / engineering=sage
 * split established on /marketing and /engineering — the CS degree reads
 * sage, the MBA reads terracotta, tying each credential to the identity
 * it feeds.
 */
export function Education() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {education.map((entry) => {
        const accent = entry.accent === "sage" ? "border-l-sage" : "border-l-terracotta";
        const chipColor =
          entry.accent === "sage" ? "text-sage-dark bg-sage/15" : "text-terracotta bg-terracotta/10";
        return (
          <div
            key={entry.credential}
            className={`rounded-2xl border border-beige-border ${accent} border-l-4 bg-cream p-7 shadow-[0_1px_3px_rgba(43,38,34,0.05)]`}
          >
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 font-body text-xs font-semibold uppercase tracking-[0.1em] ${chipColor}`}
            >
              {entry.range}
            </span>
            <h3 className="mt-4 font-heading text-xl font-bold text-charcoal sm:text-2xl">
              {entry.credential}
            </h3>
            <p className="mt-2 font-body text-sm leading-relaxed text-warm-grey">{entry.detail}</p>
          </div>
        );
      })}
    </div>
  );
}
