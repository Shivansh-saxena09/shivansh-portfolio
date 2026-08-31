export function StatTile({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  /** Tighter padding/type scale for constrained layouts like the case-study sidebar. */
  compact?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-beige-border bg-ivory ${
        compact ? "px-4 py-3" : "px-5 py-4"
      }`}
    >
      <dt className="font-body text-xs uppercase tracking-wide text-warm-grey">{label}</dt>
      <dd
        className={`mt-1 font-heading font-bold text-charcoal ${compact ? "text-xl" : "text-3xl"}`}
      >
        {value}
      </dd>
    </div>
  );
}
