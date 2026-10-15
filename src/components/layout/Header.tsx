"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/data/nav";
import type { ContactInfo, SiteSettings } from "@/lib/data/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { MobileNav } from "./MobileNav";

// Detail pages belong to their section: a case study is Marketing work, a project is Engineering.
const SECTION_OF: Record<string, string> = { "/case-study": "/marketing", "/project": "/engineering" };
function activeHref(pathname: string) {
  const first = "/" + (pathname.split("/")[1] ?? "");
  return SECTION_OF[first] ?? first;
}

/**
 * Sticky header. Desktop/tablet: nav with a clear current-section state,
 * the Resume download (label: admin hero "Resume" link label) and, on wide
 * screens, the availability dot (admin availability text). On scroll it
 * turns compact (solid, shadow, smaller mark) WITHOUT changing its height, so
 * nothing below it moves and the phone hero keeps its fit. The phone bar
 * (logo + menu) is unchanged.
 */
export function Header({ settings, contact }: { settings: SiteSettings; contact: ContactInfo }) {
  const pathname = usePathname();
  const current = activeHref(pathname);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const compact = scrollY > 24;
      if (compact !== el.hasAttribute("data-compact")) el.toggleAttribute("data-compact", compact);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header ref={ref} className="hdr sticky top-0 z-50 border-b border-beige-border/70 bg-cream/85 backdrop-blur-md">
      <Container className="flex items-center justify-between py-4 sm:py-5">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="hdr-mark flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta font-heading text-sm font-semibold text-ivory">S</span>
          <span className="truncate font-heading text-lg font-semibold tracking-tight text-charcoal">{settings.personName}</span>
        </Link>

        <div className="hidden items-center gap-5 sm:flex">
          <nav className="flex items-center gap-7 font-body text-sm text-charcoal">
            {nav.map((item) => {
              const active = current === item.href;
              return (
                <Link key={item.href} href={item.href} data-active={active} aria-current={active ? "page" : undefined} className={`tap nav-underline ${active ? "font-semibold text-terracotta" : ""}`}>
                  {item.label}
                </Link>
              );
            })}
          </nav>
          {settings.availability && (
            <span className="hidden items-center gap-2 font-body text-xs text-warm-grey min-[1360px]:flex">
              <span className="relative flex h-2 w-2">
                <span className="hdr-ping absolute inset-0 rounded-full bg-sage" />
                <span className="relative h-2 w-2 rounded-full bg-sage" />
              </span>
              {settings.availability}
            </span>
          )}
          <div className="hidden h-6 w-px bg-beige-border lg:block" aria-hidden="true" />
          <div className="hidden lg:block">
            <SocialLinks contact={contact} />
          </div>
          {settings.resumeUrl && (
            <a
              href={settings.resumeUrl}
              download={`${settings.personName.replace(/\s+/g, "-")}-Resume.pdf`}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-terracotta px-4 font-body text-sm font-semibold text-ivory transition-colors hover:bg-terracotta-dark focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <svg viewBox="0 0 16 16" aria-hidden="true" className="h-3.5 w-3.5">
                <path d="M8 2v8m0 0-3-3m3 3 3-3M3 13h10" className="fill-none stroke-current" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {settings.heroVisual.linkLabels[3]}
            </a>
          )}
        </div>

        <MobileNav settings={settings} contact={contact} />
      </Container>
    </header>
  );
}
