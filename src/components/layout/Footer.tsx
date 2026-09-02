"use client";

import { useRef, type MouseEvent, type TouchEvent } from "react";
import Link from "next/link";
import { footerNote, person, nav, contact } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";

const footerNav = [{ label: "Home", href: "/" }, ...nav] as const;

/**
 * Site footer — four columns (identity / explore / get in touch /
 * signature). The signature column holds the interactive wordmark: a
 * hollow "Shivansh Saxena" that fills in with the terracotta→sage
 * gradient inside a soft circle following the cursor (or a dragged
 * finger on touch) — scoped to that one column's width (via container
 * query units) rather than spanning the whole footer, so it reads as a
 * proportionate signature detail, not a dominating background element.
 * Social icons sit in the same column, below the wordmark.
 *
 * `person.name` (an existing content-module value) drives both the real,
 * readable name in the identity column and the wordmark — one field,
 * two presentations, nothing new hardcoded.
 */
export function Footer() {
  const fillLayerRef = useRef<HTMLDivElement>(null);
  const [firstName, ...restName] = person.name.split(" ");
  const lastName = restName.join(" ");

  function setSpot(clientX: number, clientY: number, target: HTMLElement) {
    const el = fillLayerRef.current;
    if (!el) return;
    const rect = target.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${clientY - rect.top}px`);
    el.style.setProperty("--spot-opacity", "1");
  }

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    setSpot(e.clientX, e.clientY, e.currentTarget);
  }

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    const touch = e.touches[0];
    if (touch) setSpot(touch.clientX, touch.clientY, e.currentTarget);
  }

  function hideSpot() {
    fillLayerRef.current?.style.setProperty("--spot-opacity", "0");
  }

  const wordmarkTextClass =
    "font-heading text-[clamp(1.75rem,15cqw,2.75rem)] leading-[1.05] font-bold";

  return (
    <footer className="paper-grain relative overflow-hidden border-t border-beige-border/70 bg-ivory">
      <div aria-hidden="true" className="h-[2px] w-full bg-gradient-to-r from-terracotta to-sage" />

      <Container className="relative z-10 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta font-heading text-base font-semibold text-ivory">
                S
              </span>
              <div>
                <p className="font-heading text-xl font-bold text-charcoal">{person.name}</p>
                <p className="mt-0.5 font-body text-sm text-warm-grey">{footerNote}</p>
              </div>
            </div>
            <p className="mt-6 max-w-xs font-body text-sm leading-relaxed text-warm-grey">
              {person.tagline}
            </p>
          </div>

          <div>
            <p className="font-body text-xs font-semibold tracking-[0.15em] text-warm-grey uppercase">
              Explore
            </p>
            <nav className="mt-5 flex flex-col items-start gap-3">
              {footerNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-underline font-body text-sm text-charcoal"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-body text-xs font-semibold tracking-[0.15em] text-warm-grey uppercase">
              Get in Touch
            </p>
            <div className="mt-5 flex flex-col items-start gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="nav-underline font-body text-sm text-charcoal"
              >
                {contact.email}
              </a>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-underline font-body text-sm text-charcoal"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>

          <div>
            <div className="h-1 w-8 rounded-full bg-terracotta" />

            {/* Interactive wordmark — scoped to this column's own width
                via a container query (cqw units), so it stays a small,
                proportionate signature detail regardless of whether this
                column is full-width (mobile) or a quarter of the footer
                (desktop). */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={hideSpot}
              onTouchMove={handleTouchMove}
              onTouchEnd={hideSpot}
              className="@container relative mt-4 cursor-default"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none relative flex select-none flex-col"
              >
                <p className={`footer-wordmark-outline ${wordmarkTextClass}`}>{firstName}</p>
                <p className={`footer-wordmark-outline ${wordmarkTextClass}`}>{lastName}</p>
              </div>
              <div
                ref={fillLayerRef}
                aria-hidden="true"
                className="footer-wordmark-mask pointer-events-none absolute inset-0 flex select-none flex-col"
              >
                <p className={`footer-wordmark-fill ${wordmarkTextClass}`}>{firstName}</p>
                <p className={`footer-wordmark-fill ${wordmarkTextClass}`}>{lastName}</p>
              </div>
            </div>

            <div className="glass-card mt-6 inline-flex rounded-full px-2 py-1">
              <SocialLinks />
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-beige-border/70 pt-6 text-center">
          <p className="font-body text-xs text-warm-grey">
            © {new Date().getFullYear()} {person.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
