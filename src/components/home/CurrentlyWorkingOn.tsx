import { getSiteSettings } from "@/lib/data/site";
import { Container } from "@/components/ui/Container";

function PulsingDot({ className = "" }: { className?: string }) {
  return (
    <span className={`relative flex h-2 w-2 shrink-0 ${className}`}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
    </span>
  );
}

/**
 * "Currently Working On" live-status widget (CLAUDE.md → Homepage).
 * Renders the single admin-editable line straight from `site_settings`.
 *
 * Desktop keeps the original centered glass-card. Mobile gets a
 * genuinely different treatment — a full-bleed dark band, edge to edge,
 * no rounded corners — rather than the same card shrunk down. Every
 * other section on this page is "a rounded card on cream," so a flat
 * charcoal strip reads as a deliberate rhythm break, like a live-status
 * ticker rather than another content card, and it's the one place on
 * the homepage a phone visitor gets a beat of contrast. The admin-set
 * last-updated date rides along as a small authenticity signal (an
 * absolute date, not "2 days ago" — this is a statically-generated
 * page revalidated only when the admin edits something, so a relative
 * label would silently go stale between edits).
 */
export async function CurrentlyWorkingOn() {
  const { currentlyWorkingOnText, currentlyWorkingOnUpdatedAt } = await getSiteSettings();
  const updated = currentlyWorkingOnUpdatedAt
    ? new Date(currentlyWorkingOnUpdatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : null;

  return (
    <section>
      {/* Mobile — full-bleed band, no Container/side padding. */}
      <div className="relative overflow-hidden bg-charcoal px-5 py-5 sm:hidden">
        <div
          aria-hidden="true"
          className="quick-take-glow-a pointer-events-none absolute -top-12 -right-8 h-32 w-32 rounded-full bg-sage/20 blur-3xl"
        />
        <div className="relative z-10 flex items-center gap-2">
          <PulsingDot />
          <span className="font-body text-[11px] font-semibold tracking-[0.15em] text-sage uppercase">
            Currently working on
          </span>
          {updated && <span className="ml-auto shrink-0 font-body text-[11px] text-cream/40">{updated}</span>}
        </div>
        <p className="relative z-10 mt-2.5 font-body text-sm leading-relaxed text-cream/90">
          {currentlyWorkingOnText}
        </p>
      </div>

      {/* Desktop/tablet — unchanged centered glass-card. */}
      <div className="hidden py-14 sm:block sm:py-16">
        <Container>
          <div className="glass-card paper-grain mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl px-7 py-6 shadow-lg sm:flex-row sm:items-center sm:gap-6">
            <span className="relative z-10 flex shrink-0 items-center gap-2 font-body text-xs font-semibold tracking-[0.15em] text-sage-dark uppercase">
              <PulsingDot />
              Currently working on
            </span>
            <p className="relative z-10 font-body text-base leading-relaxed text-charcoal">
              {currentlyWorkingOnText}
            </p>
          </div>
        </Container>
      </div>
    </section>
  );
}
