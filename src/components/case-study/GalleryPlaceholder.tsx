/**
 * Creatives/graphics gallery (CLAUDE.md: 3–5 images per case study). No
 * real creative assets exist yet, so this renders honest empty-state
 * tiles instead of fake stock photography — zero network requests, zero
 * layout-shift risk. Swap for next/image once the admin's gallery
 * upload exists and real creatives are attached to each case study.
 */
export function GalleryPlaceholder({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="paper-grain flex aspect-[4/5] items-center justify-center rounded-xl border border-dashed border-beige-border bg-ivory"
        >
          <span className="relative z-10 font-body text-xs text-warm-grey">
            Creative {i + 1} — uploaded via admin
          </span>
        </div>
      ))}
    </div>
  );
}
