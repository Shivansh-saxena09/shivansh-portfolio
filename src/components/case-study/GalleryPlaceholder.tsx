import Image from "next/image";

/**
 * Creatives/graphics gallery (CLAUDE.md: 3–5 images per case study).
 * Renders real uploaded creatives (via the admin's gallery upload, stored
 * in Supabase Storage) once any exist; falls back to honest empty-state
 * placeholder tiles — zero network requests, zero layout-shift risk —
 * for the common case where a case study hasn't had real assets attached
 * yet, rather than showing fake stock photography.
 */
export function Gallery({
  images,
  placeholderCount,
}: {
  images: { id: string; url: string; altText: string | null }[];
  placeholderCount: number;
}) {
  if (images.length > 0) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image) => (
          <div key={image.id} className="relative aspect-[4/5] overflow-hidden rounded-xl border border-beige-border bg-ivory">
            <Image
              src={image.url}
              alt={image.altText ?? ""}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: placeholderCount }).map((_, i) => (
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
