"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { contact } from "@/content/site";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";

// Scoped to the lead-gen pages only (home, marketing hub, and every case
// study) — a WhatsApp prompt makes sense while reading about campaign
// results, not while browsing engineering/project write-ups aimed at a
// developer audience.
function isEnabledPath(pathname: string) {
  return pathname === "/" || pathname === "/marketing" || pathname.startsWith("/case-study/");
}

/**
 * Mobile-only persistent bottom CTA — a floating "docked" card, not a
 * plain bar, so it reads as a deliberate UI element rather than an
 * intrusive ad strip. Appears once a visitor has scrolled past the hero
 * (i.e. has seen the pitch), and hides whenever a real on-page WhatsApp
 * CTA (the marketing page's contact form panel, the footer's closing
 * panel) is already in view — tracked via IntersectionObserver on every
 * `.js-whatsapp-cta` element, rather than a fixed "near the footer"
 * distance guess, since the contact panel above the footer needs the
 * same treatment and its position varies per page.
 *
 * The scroll half of this (has the visitor passed the hero yet) is
 * driven by native `window.scrollY` — Lenis runs on top of real scroll,
 * it doesn't replace it (see SmoothScrollProvider) — via a single
 * rAF-throttled listener that only calls setState on an actual boundary
 * crossing, never on every scroll pixel.
 */
export function MobileStickyCta() {
  const pathname = usePathname();
  const enabled = isEnabledPath(pathname);
  const [pastHero, setPastHero] = useState(false);
  const [obscured, setObscured] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let ticking = false;
    function evaluate() {
      const next = window.scrollY > window.innerHeight * 0.6;
      setPastHero((prev) => (prev === next ? prev : next));
      ticking = false;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(evaluate);
    }

    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    const targets = Array.from(document.querySelectorAll(".js-whatsapp-cta"));
    if (targets.length === 0) return;

    const visibleTargets = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visibleTargets.add(entry.target);
          else visibleTargets.delete(entry.target);
        }
        setObscured(visibleTargets.size > 0);
      },
      // Positive bottom margin grows the observed root downward, so a
      // real WhatsApp CTA is treated as "visible" (and this floating
      // one hides) a little before it actually enters the viewport —
      // otherwise there's a brief frame where both are on screen at
      // once while the real one is still crossing into view.
      { rootMargin: "0px 0px 200px 0px" },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled, pathname]);

  const visible = pastHero && !obscured;

  if (!enabled) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+0.875rem)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-[calc(100%+2rem)]"
      }`}
    >
      <a
        href={contact.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        className="glass-card flex items-center gap-3 rounded-2xl px-4 py-3.5 shadow-[0_16px_40px_-12px_rgba(43,38,34,0.35)] transition-transform active:scale-[0.98]"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta text-ivory">
          <WhatsAppIcon className="h-5 w-5" />
        </span>
        <span className="flex-1 text-left">
          <span className="block font-body text-[11px] text-warm-grey">Have a campaign in mind?</span>
          <span className="block font-body text-sm font-semibold text-charcoal">Message on WhatsApp</span>
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4 shrink-0 text-warm-grey">
          <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}
