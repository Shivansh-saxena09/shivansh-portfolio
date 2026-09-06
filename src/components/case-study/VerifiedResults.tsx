"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

type ProofImage = { id: string; url: string; altText: string | null };

function ShieldCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path
        d="M12 3.5 5 6v5.5c0 4.4 3 7.4 7 9 4-1.6 7-4.6 7-9V6l-7-2.5Z"
        strokeLinejoin="round"
      />
      <path d="m9 12.2 2 2 4-4.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// document.body isn't available during SSR — same pattern MobileNav.tsx
// uses to know when it's safe to portal the lightbox out to <body>.
function subscribe() {
  return () => {};
}
function getMountedSnapshot() {
  return true;
}
function getMountedServerSnapshot() {
  return false;
}

/**
 * "Verified Results" — small proof gallery + a disclosure line, sitting
 * at the tail end of the Results section (after the ad-set breakdown,
 * still inside the shared grid row — see the note above that grid in
 * page.tsx) rather than as its own top-level section: it's the direct
 * receipts for the numbers just shown, not a new topic, so it doesn't
 * get its own Table of Contents entry.
 *
 * Reuses case_study_images (image_type='proof') — the exact same
 * upload/storage mechanism as the Creatives gallery, just a different
 * type, rather than a second bespoke system (see GalleryManager.tsx).
 *
 * Always renders, even with zero images: the disclosure line itself
 * ("Figures verified directly from Meta Ads Manager") is real content
 * on its own for case studies where a screenshot hasn't been uploaded
 * yet — the gallery/lightbox only appears once there's something to
 * show.
 */
export function VerifiedResults({ images }: { images: ProofImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const mounted = useSyncExternalStore(subscribe, getMountedSnapshot, getMountedServerSnapshot);

  const close = () => setOpenIndex(null);
  const showPrev = () => setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  const showNext = () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));

  useEffect(() => {
    if (openIndex === null) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex, images.length]);

  return (
    <div className="mt-6 rounded-2xl border border-beige-border bg-ivory p-6">
      <div className="flex items-center gap-2">
        <ShieldCheckIcon className="h-4 w-4 shrink-0 text-sage-dark" />
        <p className="font-body text-xs font-semibold tracking-[0.15em] text-sage-dark uppercase">
          Verified Results
        </p>
      </div>

      {images.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`View full-size: ${img.altText || "Meta Ads Manager screenshot"}`}
              className="group relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border border-beige-border transition-colors hover:border-sage/60"
            >
              <Image
                src={img.url}
                alt={img.altText || "Meta Ads Manager results screenshot"}
                fill
                sizes="128px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}

      <p className="mt-3 font-body text-xs leading-relaxed text-warm-grey">
        {images.length > 0
          ? "Cropped to remove account IDs and unrelated campaigns. Figures verified directly from Meta Ads Manager."
          : "Figures verified directly from Meta Ads Manager."}
      </p>

      {mounted &&
        images.length > 0 &&
        createPortal(
          <AnimatePresence>
            {openIndex !== null && (
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="Verified results screenshot"
                className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal/85 p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={close}
              >
                <motion.div
                  key={openIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="relative max-h-full max-w-4xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative aspect-[16/10] w-[min(90vw,900px)] overflow-hidden rounded-xl bg-charcoal shadow-2xl">
                    <Image
                      src={images[openIndex].url}
                      alt={images[openIndex].altText || "Meta Ads Manager results screenshot"}
                      fill
                      sizes="900px"
                      className="object-contain"
                    />
                  </div>
                  {images[openIndex].altText && (
                    <p className="mt-3 text-center font-body text-sm text-cream/80">{images[openIndex].altText}</p>
                  )}
                </motion.div>

                <button
                  type="button"
                  onClick={close}
                  aria-label="Close"
                  className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        showPrev();
                      }}
                      aria-label="Previous screenshot"
                      className="absolute top-1/2 left-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
                    >
                      <ArrowIcon className="h-5 w-5 rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        showNext();
                      }}
                      aria-label="Next screenshot"
                      className="absolute top-1/2 right-4 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream/20"
                    >
                      <ArrowIcon className="h-5 w-5" />
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
