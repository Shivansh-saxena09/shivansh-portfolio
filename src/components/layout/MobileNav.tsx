"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, person } from "@/content/site";
import { SocialLinks } from "@/components/ui/SocialLinks";

/**
 * Hamburger + slide-in drawer for mobile nav. Pure CSS transform/opacity
 * transitions (GPU-accelerated, no animation library) so open/close stays
 * instant per the project's standing performance requirement — the
 * "premium" feel comes from a slower expo-out easing curve and a staggered
 * nav-link reveal, not from JS-driven animation.
 *
 * The backdrop+drawer are portaled to document.body rather than rendered
 * inline. Header uses backdrop-blur-md, and per spec, backdrop-filter (like
 * transform/filter/perspective) makes an ancestor a new containing block
 * for position:fixed descendants — so a `fixed inset-0` div nested inside
 * Header was actually being sized to Header's own box (~76px tall), not
 * the viewport. Confirmed via getBoundingClientRect() during the
 * responsiveness audit, not visible from a quick manual glance. Portaling
 * out of Header sidesteps the containing-block issue entirely.
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

// Distance (px) a rightward swipe needs to travel before it counts as
// "close the drawer" on release, rather than snapping back open.
const SWIPE_CLOSE_THRESHOLD = 80;

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, getMountedSnapshot, getMountedServerSnapshot);
  const pathname = usePathname();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  // Swipe-to-close: track the active touch's start point, and once the
  // gesture commits to "horizontal drag" (rather than a vertical scroll
  // attempt), follow the finger 1:1 via inline transform — no transition
  // lag — then either finish the close or snap back on release.
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

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

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!touchStartRef.current) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartRef.current.x;
    const dy = t.clientY - touchStartRef.current.y;

    if (!dragging) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return; // not enough movement to tell intent yet
      if (Math.abs(dy) > Math.abs(dx)) {
        touchStartRef.current = null; // vertical scroll intent — hand off to native scroll
        return;
      }
      setDragging(true);
    }
    setDragX(Math.max(0, dx));
  }

  function handleTouchEnd() {
    if (dragging && dragX > SWIPE_CLOSE_THRESHOLD) setOpen(false);
    setDragging(false);
    setDragX(0);
    touchStartRef.current = null;
  }

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
          <div
            className={`fixed inset-0 z-[70] overflow-hidden ${open ? "" : "pointer-events-none"}`}
            aria-hidden={!open}
          >
            {/* Backdrop */}
            <div
              aria-hidden="true"
              onClick={() => setOpen(false)}
              className={`absolute inset-0 bg-charcoal/50 backdrop-blur-md transition-opacity duration-300 ease-premium ${
                open ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            />

            {/* Drawer */}
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={handleTouchEnd}
              className={`absolute inset-y-0 right-0 flex w-[82vw] max-w-sm flex-col bg-cream shadow-2xl ${
                dragging ? "" : "transition-transform duration-500 ease-premium"
              } ${open ? "translate-x-0" : "translate-x-full"}`}
              style={dragging ? { transform: `translateX(${dragX}px)` } : undefined}
            >
              <div className="flex items-center justify-between px-6 py-5">
                <span className="font-heading text-lg font-semibold text-charcoal">
                  {person.name}
                </span>
                <button
                  ref={closeButtonRef}
                  type="button"
                  aria-label="Close menu"
                  tabIndex={open ? 0 : -1}
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

              <nav className="mt-4 flex flex-col px-6">
                {nav.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    data-active={pathname === item.href}
                    tabIndex={open ? 0 : -1}
                    className="border-b border-beige-border/70 py-4 font-heading text-2xl text-charcoal transition-[opacity,transform] duration-300 ease-premium data-[active=true]:text-terracotta"
                    style={{
                      // Staggered reveal, one link after another, only on
                      // open — closing skips the stagger so it stays snappy.
                      transitionDelay: open ? `${150 + i * 70}ms` : "0ms",
                      opacity: open ? 1 : 0,
                      transform: open ? "translateX(0)" : "translateX(-12px)",
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div
                className="mt-auto flex flex-col gap-4 border-t border-beige-border/70 px-6 py-6 transition-opacity duration-300 ease-premium"
                style={{
                  transitionDelay: open ? `${150 + nav.length * 70}ms` : "0ms",
                  opacity: open ? 1 : 0,
                }}
              >
                <span className="font-body text-xs font-medium uppercase tracking-[0.15em] text-warm-grey">
                  Elsewhere
                </span>
                <SocialLinks iconClassName="h-5 w-5" />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
