"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, person } from "@/content/site";
import { SocialLinks } from "@/components/ui/SocialLinks";

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

const linkContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.2 } },
};

const linkVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_PREMIUM } },
};

export function MobileNav() {
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
                    className="absolute inset-y-0 right-0 flex w-[82vw] max-w-sm flex-col bg-cream shadow-[-16px_0_60px_-8px_rgba(43,38,34,0.4)]"
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
                    <div className="flex items-center justify-between px-6 py-5">
                      <span className="font-heading text-lg font-semibold text-charcoal">
                        {person.name}
                      </span>
                      <button
                        ref={closeButtonRef}
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setOpen(false)}
                        className="flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition-colors hover:bg-terracotta/10"
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

                    <motion.nav
                      className="mt-4 flex flex-1 flex-col overflow-y-auto px-6"
                      variants={linkContainerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {nav.map((item) => (
                        <motion.div key={item.href} variants={linkVariants}>
                          <Link
                            href={item.href}
                            data-active={pathname === item.href}
                            className="block border-b border-beige-border/70 py-4 font-heading text-2xl text-charcoal data-[active=true]:text-terracotta"
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}

                      <motion.div
                        variants={linkVariants}
                        className="mt-auto flex flex-col gap-4 border-t border-beige-border/70 py-6"
                      >
                        <span className="font-body text-xs font-medium uppercase tracking-[0.15em] text-warm-grey">
                          Elsewhere
                        </span>
                        <SocialLinks iconClassName="h-5 w-5" />
                      </motion.div>
                    </motion.nav>
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
