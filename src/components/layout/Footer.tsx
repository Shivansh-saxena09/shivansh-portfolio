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
 * The interactive signature — hollow outline that fills with the
 * terracotta→sage gradient inside a soft circle following the cursor or a
 * dragged finger (see globals.css' .footer-wordmark-* rules). Pulled into
 * its own component (rather than inlined once) because the mobile layout
 * renders a second, smaller instance of it as a standalone closing
 * flourish instead of a desktop column filler — two instances mounted at
 * once (one hidden via CSS per breakpoint, not conditionally unmounted)
 * need their own ref/handlers each, not one shared ref fighting over two
 * DOM nodes.
 */
function Wordmark({
  firstName,
  lastName,
  textClass,
  className = "",
}: {
  firstName: string;
  lastName: string;
  textClass: string;
  className?: string;
}) {
  const fillLayerRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={hideSpot}
      onTouchMove={handleTouchMove}
      onTouchEnd={hideSpot}
      className={`relative cursor-default ${className}`}
    >
      <div aria-hidden="true" className="pointer-events-none relative flex select-none flex-col">
        <p className={`footer-wordmark-outline ${textClass}`}>{firstName}</p>
        <p className={`footer-wordmark-outline ${textClass}`}>{lastName}</p>
      </div>
      <div
        ref={fillLayerRef}
        aria-hidden="true"
        className="footer-wordmark-mask pointer-events-none absolute inset-0 flex select-none flex-col"
      >
        <p className={`footer-wordmark-fill ${textClass}`}>{firstName}</p>
        <p className={`footer-wordmark-fill ${textClass}`}>{lastName}</p>
      </div>
    </div>
  );
}

/**
 * Site footer, composed as one deliberate closing sequence rather than a
 * grid of stacked links: a full-width closing CTA panel first (the "one
 * more chance to reach out" a page's content already made the case for),
 * then desktop gets a four-column utility grid (identity+location+live
 * clock / explore / get in touch / the interactive signature wordmark);
 * mobile (below sm:) gets its own hand-ordered flow instead of that grid
 * simply stacked — see the two `hidden sm:…` / `sm:hidden` blocks below.
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
  const [firstName, ...restName] = personName.split(" ");
  const lastName = restName.join(" ");
  const localTime = useSyncExternalStore(subscribeClock, getClockSnapshot, getClockServerSnapshot);

  const wordmarkTextClass =
    "font-heading text-[clamp(1.75rem,15cqw,2.75rem)] leading-[1.05] font-bold";
  // The mobile instance is a fixed-position closing flourish, not a
  // column filler proportional to some ancestor's width — so it sizes
  // off the viewport (vw) directly rather than a container query. A
  // @container element needs inline-size containment, which — combined
  // with this instance sitting in an auto-width flex item (centered, no
  // explicit width) rather than a grid column with a definite track
  // width like the desktop instance — risks the container's content-
  // based sizing input being stripped out and collapsing toward 0.
  const mobileWordmarkTextClass =
    "font-heading text-[clamp(1.5rem,9vw,2.125rem)] leading-[1.05] font-bold";

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

        {/* ------------------------------------------------------------ */}
        {/* Desktop / tablet — the four-column utility grid, unchanged.   */}
        {/* ------------------------------------------------------------ */}
        <div className="mt-16 hidden grid-cols-2 gap-12 sm:grid lg:grid-cols-4 lg:gap-10">
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

            {/* Scoped to this column's own width via a container query
                (cqw units), so it stays a proportionate signature detail
                regardless of the column's share of the four-column grid. */}
            <Wordmark
              firstName={firstName}
              lastName={lastName}
              textClass={wordmarkTextClass}
              className="@container mt-4"
            />

            <div className="glass-card mt-6 inline-flex rounded-full px-2 py-1">
              <SocialLinks contact={contact} />
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Mobile — a hand-ordered flow, not the grid above simply       */}
        {/* stacked. Priority order: identity → social (high-value,       */}
        {/* short, so it stays visible) → contact (ditto) → a small       */}
        {/* closing signature instead of a full column-width one. No      */}
        {/* "Explore" links block at all — see the comment further down   */}
        {/* for why that's deliberate, not a missing section.             */}
        {/* ------------------------------------------------------------ */}
        <div className="mt-12 sm:hidden">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta font-heading text-base font-semibold text-ivory">
              S
            </span>
            <p className="font-heading text-xl font-bold text-charcoal">{personName}</p>
          </div>

          <p className="mt-5 max-w-xs font-body text-sm leading-relaxed text-warm-grey">
            {personTagline}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-1.5 font-body text-sm text-charcoal">
              <PinIcon className="h-4 w-4 shrink-0 text-terracotta" />
              {location}
              {localTime && <span className="text-warm-grey">· {localTime} IST</span>}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sage/15 px-2.5 py-1 font-body text-xs font-semibold text-sage-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-sage" />
              {availability}
            </span>
          </div>

          {/* Elsewhere — same glass-card social row + label convention
              as the nav drawer, so the two touch surfaces feel like one
              system rather than two different treatments of the same
              four icons. Bigger icons than the desktop row (h-5 vs the
              default h-[18px]) inside the same 40px tap target. */}
          <div className="mt-6">
            <p className="font-body text-xs font-medium tracking-[0.15em] text-warm-grey uppercase">
              Elsewhere
            </p>
            <div className="glass-card mt-3 inline-flex rounded-full px-2 py-1">
              <SocialLinks contact={contact} iconClassName="h-5 w-5" />
            </div>
          </div>

          {/* Get in Touch — kept always visible (not tucked into the
              accordion below) since it's two short, high-value lines,
              not a list worth an extra tap to reveal. Each row padded to
              a proper ~44px tap target, not the desktop column's tighter
              text-height links. */}
          <div className="mt-7 border-t border-beige-border/70 pt-6">
            <p className="font-body text-xs font-semibold tracking-[0.15em] text-warm-grey uppercase">
              Get in Touch
            </p>
            <div className="mt-1 flex flex-col">
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-3 border-b border-beige-border/60 py-3.5 font-body text-sm text-charcoal"
              >
                <EmailIcon className="h-4 w-4 shrink-0 text-warm-grey" />
                {contact.email}
              </a>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="js-whatsapp-cta flex items-center gap-3 py-3.5 font-body text-sm text-charcoal"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0 text-warm-grey" />
                Message on WhatsApp
              </a>
            </div>
          </div>

          {/* No "Explore" block here — deliberately, not an oversight.
              Those links are already one tap away at every scroll
              position via the sticky header's hamburger (it's pinned to
              the top of the screen even down here at the footer, as the
              screenshots confirm), and are what a mobile visitor most
              likely just came from if they used the nav drawer. Repeating
              them a third time on the same screen added length without
              adding a new way to get anywhere — cutting the block
              entirely is the more considered choice than re-housing it
              in a different widget. (An earlier version tried a
              collapsed <details> accordion here; removed per explicit
              feedback, and the redundancy above is the real reason it
              shouldn't come back in another form.) */}

          {/* Closing signature — a small centered flourish rather than a
              full-width column filler (mobile has no column to balance),
              touch-drag still reveals the gradient fill. */}
          <div className="mt-10 flex justify-center">
            <Wordmark
              firstName={firstName}
              lastName={lastName}
              textClass={mobileWordmarkTextClass}
              className="text-center"
            />
          </div>
        </div>

        <div className="mt-10 border-t border-beige-border/70 pt-6 text-center sm:mt-16">
          <p className="font-body text-xs text-warm-grey">
            © {new Date().getFullYear()} {personName}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
