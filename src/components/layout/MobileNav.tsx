"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/data/site";
import type { ContactInfo, SiteSettings } from "@/lib/data/site";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Button } from "@/components/ui/Button";

/**
 * Hamburger + slide-in drawer for mobile nav, built on Framer Motion (an
 * existing project dependency — no new bundle cost) for real spring
 * physics and staggered children, rather than hand-rolled CSS transitions.
 *
 * The backdrop+drawer are portaled to document.body rather than rendered
 * inline. Header uses backdrop-blur-md, and per spec, backdrop-filter (like
 * transform/filter/perspective) makes an ancestor a new containing block
 * for position:fixed descendants — so a `fixed inset-0` div nested inside
 * Header was actually being sized to Header's own box (~76px tall), not
 * the viewport. Confirmed via getBoundingClientRect() during an earlier
 * audit, not visible from a quick manual glance. Portaling out of Header
 * sidesteps the containing-block issue entirely.
 */
// document.body doesn't exist during SSR, so the portal target is only
// known client-side — the sanctioned way to read that without a
// setState-in-effect is useSyncExternalStore with a static true/false
// snapshot (there's nothing to actually subscribe to; it flips once,
// right after hydration).
function subscribe() {
  return () => {};
}
function getMountedSnapshot() {
  return true;
}
function getMountedServerSnapshot() {
  return false;
}

// Matches the --ease-premium design token (globals.css) for consistency
// between this Framer-driven component and the rest of the site's CSS.
const EASE_PREMIUM = [0.16, 1, 0.3, 1] as const;

const staggerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_PREMIUM } },
};

// One short line of orientation per destination — a visitor tapping into
// the drawer without much context gets a reason to choose, not just a
// label, and it's genuine content filling space rather than padding.
const navDescriptions: Record<string, string> = {
  "/marketing": "Campaign case studies & results",
  "/engineering": "Full-stack projects & systems",
  "/about": "Story, experience, education",
};

function PinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path
        d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.25" />
    </svg>
  );
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MobileNav({ settings, contact }: { settings: SiteSettings; contact: ContactInfo }) {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, getMountedSnapshot, getMountedServerSnapshot);
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  // Close on route change — the sanctioned React pattern for "reset state
  // when a prop changes" is a render-time comparison against a ref/state
  // snapshot, not a setState call inside an effect.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Lock background scroll, move focus in, restore focus on close, Escape closes.
  useEffect(() => {
    if (!open) return;

    const openButton = openButtonRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      openButton?.focus();
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        ref={openButtonRef}
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-terracotta/10"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-6 w-6">
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

      {mounted &&
        createPortal(
          // Clipping + click-blocking layer, kept mounted always: without
          // it, the drawer's off-screen animated states (x: "100%") can
          // briefly inflate document.documentElement.scrollWidth during
          // the transition, and an unclipped full-viewport layer would
          // swallow clicks even while "invisible". Both were caught via a
          // Playwright audit, not a visual glance — see git history.
          <div
            className={`fixed inset-0 z-[70] overflow-hidden ${open ? "" : "pointer-events-none"}`}
            aria-hidden={!open}
          >
            <AnimatePresence>
              {open && (
                <>
                  {/* Backdrop — a real backdrop-filter blur, not just a dim */}
                  <motion.div
                    key="backdrop"
                    aria-hidden="true"
                    onClick={() => setOpen(false)}
                    className="absolute inset-0 bg-charcoal/55 backdrop-blur-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE_PREMIUM }}
                  />

                  {/* Drawer panel — spring physics (slight natural
                      overshoot/settle) plus a scale-up entrance, so it
                      reads as a physical object arriving, not a flat
                      slide. Native drag-to-dismiss via Framer's `drag`. */}
                  <motion.div
                    key="drawer"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Site menu"
                    className="absolute inset-y-0 right-0 flex w-[82vw] max-w-sm flex-col overflow-hidden bg-cream shadow-[-16px_0_60px_-8px_rgba(43,38,34,0.4)]"
                    initial={{ x: "100%", scale: 0.96 }}
                    animate={{ x: 0, scale: 1 }}
                    exit={{ x: "100%", scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.9 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={{ left: 0, right: 0.6 }}
                    dragMomentum={false}
                    onDragEnd={(_, info) => {
                      if (info.offset.x > 100 || info.velocity.x > 600) setOpen(false);
                    }}
                  >
                    {/* Grain texture lives on its own layer rather than the
                        drawer root: .paper-grain hard-sets position:relative
                        (an unlayered rule, so it beats any Tailwind position
                        utility in the cascade regardless of class order),
                        which was silently downgrading the drawer's required
                        position:absolute — that's what let inset-y-0 stop
                        constraining its height to the viewport, so on short
                        screens it grew to fit its content (823px, confirmed
                        via getBoundingClientRect) instead of clamping to
                        667px, leaving the CTA/social row clipped and
                        unreachable with no scrollbar. Isolated here, the
                        grain still paints correctly (it only needs to be a
                        positioned box the size of the drawer) without
                        touching the drawer's own positioning. */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
                      <div className="paper-grain h-full w-full" />
                    </div>

                    {/* Ambient glows — the same floating-blur language the
                        Hero/About/Engineering pages use, echoed here at
                        low opacity so the drawer feels like part of the
                        same visual system rather than a bare utility
                        panel. */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-16 -right-12 h-56 w-56 rounded-full bg-terracotta/15 blur-3xl"
                    />
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute bottom-24 -left-16 h-48 w-48 rounded-full bg-sage/15 blur-3xl"
                    />

                    <div className="relative z-10 flex items-center justify-between gap-3 border-b border-beige-border/70 px-6 py-5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta font-heading text-base font-semibold text-ivory">
                          {settings.personName.charAt(0)}
                        </span>
                        <div>
                          <p className="font-heading text-lg leading-tight font-semibold text-charcoal">
                            {settings.personName}
                          </p>
                          <p className="font-body text-xs text-warm-grey">{settings.personTagline}</p>
                        </div>
                      </div>
                      <button
                        ref={closeButtonRef}
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setOpen(false)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-terracotta/10"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.8}
                          className="h-6 w-6"
                        >
                          <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>

                    <motion.div
                      className="relative z-10 flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6"
                      variants={staggerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      <nav aria-label="Site" className="flex flex-col">
                        {nav.map((item) => (
                          <motion.div key={item.href} variants={itemVariants}>
                            <Link
                              href={item.href}
                              data-active={pathname === item.href}
                              className="group flex items-center justify-between gap-3 border-b border-beige-border/70 py-4"
                            >
                              <span>
                                <span className="block font-heading text-2xl text-charcoal group-data-[active=true]:text-terracotta">
                                  {item.label}
                                </span>
                                <span className="mt-0.5 block font-body text-xs text-warm-grey">
                                  {navDescriptions[item.href]}
                                </span>
                              </span>
                              <ArrowIcon className="h-4 w-4 shrink-0 text-warm-grey transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-data-[active=true]:text-terracotta" />
                            </Link>
                          </motion.div>
                        ))}
                      </nav>

                      {/* Currently Working On — the same live-status
                          widget the homepage shows, so someone who came
                          in through a subpage still sees it. Real,
                          admin-editable content, not filler. */}
                      <motion.div
                        variants={itemVariants}
                        className="glass-card mt-6 flex items-start gap-3 rounded-2xl px-4 py-3.5"
                      >
                        <span className="relative mt-1 flex h-2 w-2 shrink-0">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
                        </span>
                        <div>
                          <p className="font-body text-[11px] font-semibold tracking-[0.1em] text-sage-dark uppercase">
                            Currently working on
                          </p>
                          <p className="mt-1 font-body text-sm leading-relaxed text-charcoal">
                            {settings.currentlyWorkingOnText}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2"
                      >
                        <span className="flex items-center gap-1.5 font-body text-sm text-charcoal">
                          <PinIcon className="h-4 w-4 shrink-0 text-terracotta" />
                          {settings.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/15 px-2.5 py-1 font-body text-xs font-semibold text-sage-dark">
                          <span className="h-1.5 w-1.5 rounded-full bg-sage" />
                          {settings.availability}
                        </span>
                      </motion.div>

                      <motion.div variants={itemVariants} className="mt-6">
                        <Button href={contact.whatsapp} variant="primary" className="js-whatsapp-cta w-full">
                          Message on WhatsApp
                        </Button>
                      </motion.div>

                      <motion.div
                        variants={itemVariants}
                        className="mt-auto flex flex-col gap-4 border-t border-beige-border/70 pt-6 pb-2"
                      >
                        <span className="font-body text-xs font-medium uppercase tracking-[0.15em] text-warm-grey">
                          Elsewhere
                        </span>
                        <SocialLinks contact={contact} iconClassName="h-5 w-5" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>,
          document.body,
        )}
    </div>
  );
}
