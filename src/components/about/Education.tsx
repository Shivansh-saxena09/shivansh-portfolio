import { education } from "@/content/about";

export function Education() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {education.map((entry) => (
        <div
          key={entry.credential}
          className="rounded-2xl border border-beige-border bg-cream p-6 shadow-[0_1px_3px_rgba(43,38,34,0.05)] sm:p-7"
        >
          <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-sage-dark">
            {entry.range}
          </span>
          <h3 className="mt-3 font-heading text-xl text-charcoal">{entry.credential}</h3>
          <p className="mt-2 font-body text-sm leading-relaxed text-warm-grey">{entry.detail}</p>
        </div>
      ))}
    </div>
  );
}
