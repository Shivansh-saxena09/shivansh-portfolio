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

function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      <circle cx="12" cy="13.5" r="3.2" />
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

const MAX_GRID_TILES = 4;

/**
 * "Verified Results" — a full-width section, siblings with Campaign
 * Doctor and Creatives (same reasoning already established for those
 * two on this page: full width reads as substantially more premium
 * than being squeezed into the 8/12 main column, and there's a lot of
 * room to spare — the main column runs to ~2545px against the
 * sidebar's ~1058px, confirmed via measurement, so pulling this out
 * doesn't risk reintroducing the sidebar-height/gap problem earlier
 * commits on this page fixed). Gets its own Table of Contents entry
 * for the same reason: once it has this much visual presence, treating
 * it as a hidden appendix of Results would be inconsistent with how
 * Creatives (arguably lower-stakes content) already gets one.
 *
 * Two-column on tablet+ (badge/heading/disclosure beside the gallery,
 * using the width instead of wrapping tiny thumbnails); mobile gets
 * its own swipeable filmstrip rather than the same layout shrunk down,
 * matching the site's established mobile-carousel convention. The
 * zero-image state reuses the Creatives gallery's exact dashed-tile
 * placeholder language (paper-grain, dashed border) instead of a bare
 * sentence, so "nothing uploaded yet" still reads as a considered
 * design state rather than an empty gap.
 */
// Skeleton shimmer (globals.css .skel) stops once the image has painted.
const markLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => e.currentTarget.parentElement?.setAttribute("data-loaded", "");

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

  const gridImages = images.slice(0, MAX_GRID_TILES);
  const overflowCount = images.length - MAX_GRID_TILES;

  return (
    <div className="paper-grain relative overflow-hidden rounded-3xl border border-beige-border bg-ivory p-7 sm:p-9">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-14 h-64 w-64 rounded-full bg-sage/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-terracotta/[0.06] blur-3xl"
      />

      <div className="relative z-10 sm:grid sm:grid-cols-12 sm:gap-8 lg:gap-14">
        <div className="sm:col-span-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheckIcon className="h-5 w-5 shrink-0 text-sage-dark" />
            <h2 className="font-heading text-2xl font-bold text-charcoal">Verified Results</h2>
          </div>
          <p className="mt-3 max-w-xs font-body text-sm leading-relaxed text-warm-grey">
            {images.length > 0
              ? "Cropped to remove account IDs and unrelated campaigns."
              : "A screenshot hasn't been attached to this case study yet."}{" "}
            Figures verified directly from Meta Ads Manager.
          </p>
          {images.length > 0 && (
            <p className="mt-4 font-body text-xs font-medium tracking-[0.1em] text-sage-dark uppercase">
              {images.length} screenshot{images.length === 1 ? "" : "s"} attached
            </p>
          )}
        </div>

        <div className="mt-6 sm:col-span-8 sm:mt-0">
          {images.length > 0 ? (
            <>
              {/* Tablet/desktop: a proper grid, large enough tiles to
                  actually read as screenshots rather than icons. */}
              <div className="hidden gap-3 sm:grid sm:grid-cols-2">
                {gridImages.map((img, i) => {
                  const isLastVisible = i === MAX_GRID_TILES - 1 && overflowCount > 0;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setOpenIndex(i)}
                      aria-label={
                        isLastVisible
                          ? `View all ${images.length} screenshots`
                          : `View full-size: ${img.altText || "Meta Ads Manager screenshot"}`
                      }
                      className="skel group relative aspect-[16/10] overflow-hidden rounded-xl border bg-ivory border-beige-border shadow-[0_1px_2px_rgba(43,38,34,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-sage/50 hover:shadow-[0_16px_28px_-14px_rgba(43,38,34,0.25)]"
                    >
                      <Image
                        src={img.url}
                        alt={img.altText || "Meta Ads Manager results screenshot"}
                        fill
                        onLoad={markLoaded}
                        sizes="(min-width: 1024px) 30vw, 40vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                      {isLastVisible && (
                        <span className="absolute inset-0 flex items-center justify-center bg-charcoal/55 font-body text-sm font-semibold text-ivory backdrop-blur-[1px]">
                          +{overflowCount} more
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mobile: swipeable filmstrip, not the same grid shrunk
                  down — matches /marketing's case-study card carousel. */}
              <div className="sm:hidden">
                {images.length > 1 && (
                  <p className="mb-3 font-body text-xs font-medium text-warm-grey">Swipe to explore →</p>
                )}
                <div className="relative -mx-7">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-ivory to-transparent"
                  />
                  <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-7 pb-1">
                    {images.map((img, i) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => setOpenIndex(i)}
                        aria-label={`View full-size: ${img.altText || "Meta Ads Manager screenshot"}`}
                        className="skel relative aspect-[16/10] w-[78vw] shrink-0 snap-start overflow-hidden rounded-xl border border-beige-border bg-ivory"
                      >
                        <Image
                          src={img.url}
                          alt={img.altText || "Meta Ads Manager results screenshot"}
                          fill
                          onLoad={markLoaded}
                          sizes="78vw"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="paper-grain flex aspect-[16/10] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-beige-border bg-cream px-3 text-center"
                >
                  <CameraIcon className="relative z-10 h-5 w-5 text-warm-grey/70" />
                  <span className="relative z-10 font-body text-[11px] leading-snug text-warm-grey">
                    Screenshot coming soon
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
                  <div className="skel relative aspect-[16/10] w-[min(90vw,900px)] overflow-hidden rounded-xl bg-charcoal shadow-2xl">
                    <Image
                      src={images[openIndex].url}
                      alt={images[openIndex].altText || "Meta Ads Manager results screenshot"}
                      fill
                      onLoad={markLoaded}
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
