"use client";

import { useRef, useSyncExternalStore, type MouseEvent, type TouchEvent } from "react";
import Link from "next/link";
import { nav } from "@/lib/data/site";
import type { ContactInfo } from "@/lib/data/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Button } from "@/components/ui/Button";
import { EmailIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";

const footerNav = [{ label: "Home", href: "/" }, ...nav] as const;

// Live IST clock in the identity column — a small, real detail (India
// has one timezone, no DST, so this is simple/reliable), not a static
// "Based in India" line. useSyncExternalStore rather than useState+
// useEffect: the value is genuinely unknowable at SSR time, which is
// exactly the case this hook exists for — server snapshot is null (no
// mismatch), the real time appears the moment it mounts.
function subscribeClock(callback: () => void) {
  const id = setInterval(callback, 30_000);
  return () => clearInterval(id);
}
function getClockSnapshot() {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}
function getClockServerSnapshot() {
  return null;
}

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

/**
 * Site footer, composed as one deliberate closing sequence rather than a
 * grid of stacked links: a full-width closing CTA panel first (the "one
 * more chance to reach out" a page's content already made the case for),
 * then a four-column utility grid (identity+location+live clock / explore
 * / get in touch / the interactive signature wordmark), then copyright.
 *
 * The signature column's wordmark is `personName`, scoped via container-
 * query units to that column's own width — a hollow outline that fills
 * with the terracotta→sage gradient inside a soft circle following the
 * cursor or a dragged finger. See globals.css' .footer-wordmark-* rules.
 */
export function Footer({
  personName,
  personTagline,
  location,
  availability,
  footerCta,
  contact,
}: {
  personName: string;
  personTagline: string;
  location: string;
  availability: string;
  footerCta: { heading: string; ctaLabel: string };
  contact: ContactInfo;
}) {
  const fillLayerRef = useRef<HTMLDivElement>(null);
  const [firstName, ...restName] = personName.split(" ");
  const lastName = restName.join(" ");
  const localTime = useSyncExternalStore(subscribeClock, getClockSnapshot, getClockServerSnapshot);

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
    <footer className="paper-grain relative overflow-hidden border-t border-beige-border/70 bg-cream">
      <div aria-hidden="true" className="h-[2px] w-full bg-gradient-to-r from-terracotta to-sage" />

      <Container className="relative z-10 py-16 sm:py-20 lg:py-24">
        {/* Closing CTA — a real, floating panel (glass-card + its own
            paper-grain), giving the paper texture and layered-depth
            language actual structural work to do here, not just a
            barely-visible global wash. */}
        <div className="glass-card paper-grain relative overflow-hidden rounded-3xl px-8 py-10 shadow-xl sm:px-12 sm:py-12">
          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="max-w-md font-heading text-3xl leading-tight font-bold text-charcoal sm:text-4xl">
              {footerCta.heading}
            </h2>
            <Button
              href={contact.whatsapp}
              variant="primary"
              className="js-whatsapp-cta w-full shrink-0 sm:w-fit"
            >
              {footerCta.ctaLabel}
            </Button>
          </div>
        </div>

        {/* Utility grid */}
        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta font-heading text-base font-semibold text-ivory">
                S
              </span>
              <p className="font-heading text-xl font-bold text-charcoal">{personName}</p>
            </div>

            <p className="mt-6 max-w-xs font-body text-sm leading-relaxed text-warm-grey">
              {personTagline}
            </p>

            <div className="mt-5 flex items-center gap-1.5 font-body text-sm text-charcoal">
              <PinIcon className="h-4 w-4 shrink-0 text-terracotta" />
              {location}
              {localTime && <span className="text-warm-grey">· {localTime} IST</span>}
            </div>
            <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-sage/15 px-3 py-1 font-body text-xs font-semibold text-sage-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" />
              {availability}
            </span>
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
                className="nav-underline flex items-center gap-2 font-body text-sm text-charcoal"
              >
                <EmailIcon className="h-4 w-4 shrink-0 text-warm-grey" />
                {contact.email}
              </a>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-underline flex items-center gap-2 font-body text-sm text-charcoal"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-warm-grey" />
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
              <SocialLinks contact={contact} />
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-beige-border/70 pt-6 text-center">
          <p className="font-body text-xs text-warm-grey">
            © {new Date().getFullYear()} {personName}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
