"use client";

import { useActiveSection } from "./useActiveSection";
import type { TocSection } from "./TableOfContents";

/**
 * The desktop sticky sidebar's top block: the "On This Page" nav, paired
 * with a small contextual panel that changes based on which section is
 * currently being read. Solves a real problem the plain nav alone had —
 * once a visitor scrolls past the (much shorter) sidebar content into
 * Results/Campaign Doctor/Creatives, the space beside that long content
 * was just blank. Rather than fighting sticky-to-bottom positioning
 * (tried first; unreliable nested in this flex/grid structure — verified
 * via computed-style diagnostics, not assumed), this keeps the one
 * sticky direction that's provably solid (sticky-top) and makes ITS
 * OWN content adapt, so something genuinely relevant is always visible
 * for as long as the nav itself stays pinned.
 */
export function CaseStudySidebarPanel({
  sections,
  bestPerformer,
  aiInsightCounts,
  whatsapp,
}: {
  sections: TocSection[];
  bestPerformer: string | null;
  aiInsightCounts: { working: number; issues: number } | null;
  whatsapp: string;
}) {
  const active = useActiveSection(sections.map((s) => s.id));

  return (
    <div>
      <p className="font-body text-xs font-semibold tracking-[0.15em] text-warm-grey uppercase">
        On This Page
      </p>
      <nav className="mt-3 flex flex-col gap-1">
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

      {active === "results" && bestPerformer && (
        <div className="mt-4 rounded-xl border border-sage/30 bg-sage/10 p-3">
          <p className="font-body text-[11px] font-semibold tracking-[0.1em] text-sage-dark uppercase">
            Best Performer
          </p>
          <p className="mt-1 font-body text-sm leading-relaxed text-charcoal">{bestPerformer}</p>
        </div>
      )}

      {active === "campaign-doctor" && aiInsightCounts && (
        <div className="mt-4 rounded-xl border border-terracotta/30 bg-terracotta/10 p-3">
          <p className="font-body text-sm leading-relaxed text-charcoal">
            🩺 {aiInsightCounts.working} thing{aiInsightCounts.working === 1 ? "" : "s"} working,{" "}
            {aiInsightCounts.issues} issue{aiInsightCounts.issues === 1 ? "" : "s"} found
          </p>
        </div>
      )}

      {active === "creatives" && (
        <div className="mt-4 rounded-xl border border-terracotta/20 bg-terracotta/5 p-4">
          <p className="font-body text-sm font-semibold text-charcoal">Want results like this?</p>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="js-whatsapp-cta mt-2.5 inline-flex w-full items-center justify-center rounded-full bg-terracotta px-4 py-2.5 font-body text-xs font-medium text-ivory transition-colors hover:bg-terracotta-dark"
          >
            Message on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
