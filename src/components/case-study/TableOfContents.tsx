"use client";

import { useActiveSection } from "./useActiveSection";

export type TocSection = { id: string; label: string };

/**
 * In-page jump nav for the case-study page, with scroll-spy highlighting
 * whichever section currently owns the reading position (see
 * useActiveSection.ts). Used for the mobile/tablet horizontally-
 * scrollable pill row (`variant="pills"`) — the desktop sticky sidebar
 * uses CaseStudySidebarPanel.tsx instead, which pairs the same nav list
 * with a contextual content panel that changes with the active section.
 */
export function TableOfContents({
  sections,
  variant,
}: {
  sections: TocSection[];
  variant: "list" | "pills";
}) {
  const active = useActiveSection(sections.map((s) => s.id));

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
