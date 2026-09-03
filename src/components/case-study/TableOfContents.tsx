"use client";

import { useEffect, useState } from "react";

export type TocSection = { id: string; label: string };

/**
 * In-page jump nav for the case-study page, with scroll-spy (an
 * IntersectionObserver watching each section, no scroll-event polling)
 * highlighting whichever one currently owns the reading position. One
 * component serves both placements this page needs — the sticky
 * sidebar's vertical list on desktop (`variant="list"`) and a
 * horizontally-scrollable pill row for everything below `lg`
 * (`variant="pills"`), where the sidebar isn't sticky (or present)
 * — same active-section logic either way, just different chrome.
 */
export function TableOfContents({
  sections,
  variant,
}: {
  sections: TocSection[];
  variant: "list" | "pills";
}) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Treats a section as "current" once it crosses a band near the
      // top of the viewport, not merely once any part of it is visible
      // — otherwise a short section barely peeking into view would
      // steal the highlight before a visitor has actually reached it.
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 },
    );

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  if (variant === "pills") {
    return (
      <nav className="relative -mx-5 sm:mx-0">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-cream to-transparent sm:hidden"
        />
        <div className="flex gap-2 overflow-x-auto px-5 pb-1 sm:px-0">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-active={s.id === active}
              className="shrink-0 rounded-full border border-beige-border px-3.5 py-1.5 font-body text-xs font-medium whitespace-nowrap text-charcoal transition-colors data-[active=true]:border-terracotta data-[active=true]:bg-terracotta data-[active=true]:text-ivory"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex flex-col gap-1">
      {sections.map((s) => (
        <a
          key={s.id}
          href={`#${s.id}`}
          data-active={s.id === active}
          className="rounded-lg px-2.5 py-1.5 font-body text-sm text-warm-grey transition-colors data-[active=true]:bg-terracotta/10 data-[active=true]:font-medium data-[active=true]:text-terracotta-dark"
        >
          {s.label}
        </a>
      ))}
    </nav>
  );
}
