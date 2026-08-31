export function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-beige-border bg-ivory px-5 py-4">
      <dt className="font-body text-xs uppercase tracking-wide text-warm-grey">{label}</dt>
      <dd className="mt-1 font-heading text-2xl text-charcoal">{value}</dd>
    </div>
  );
}
