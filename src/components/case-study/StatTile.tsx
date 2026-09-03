/** Splits a leading ₹ off a formatted value so it can be styled smaller
 *  and muted next to the number — a standard "price tag" treatment
 *  (small currency mark, large bold figure) rather than sizing the
 *  symbol the same as the digits. */
function splitCurrency(value: string): { symbol: string | null; rest: string } {
  if (value.startsWith("₹")) return { symbol: "₹", rest: value.slice(1) };
  return { symbol: null, rest: value };
}

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
  const { symbol, rest } = splitCurrency(value);

  return (
    <div
      className={`overflow-hidden rounded-xl border border-beige-border bg-ivory ${
        compact ? "px-4 py-3" : "px-5 py-4"
      }`}
    >
      <dt className="truncate font-body text-xs uppercase tracking-wide text-warm-grey">{label}</dt>
      {/* Numbers are data, not a headline — font-body (Inter), not the
          Playfair Display heading font, whose stylized serif numerals
          were reading as cursive/script at this size and weight, and
          whose wider letterforms were overflowing these narrow cards.
          tabular-nums keeps digit widths consistent so tiles in the same
          row don't jitter against each other. No text-overflow ellipsis
          on the figure itself — a clipped number is misleading in a way
          a clipped label never is, so the outer card's overflow-hidden
          is the safety net, not a "47,7…"-style truncation. */}
      <dd
        className={`mt-1 flex items-baseline gap-0.5 whitespace-nowrap font-body font-bold text-charcoal tabular-nums ${
          compact ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"
        }`}
      >
        {symbol && <span className="text-[0.55em] font-semibold text-warm-grey">{symbol}</span>}
        {rest}
      </dd>
    </div>
  );
}
