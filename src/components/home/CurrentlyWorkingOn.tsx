import { getSiteSettings } from "@/lib/data/site";
import { Container } from "@/components/ui/Container";

/**
 * "Currently Working On" live-status widget (CLAUDE.md → Homepage).
 * Renders the single admin-editable line straight from `site_settings`.
 */
export async function CurrentlyWorkingOn() {
  const { currentlyWorkingOnText } = await getSiteSettings();

  return (
    <section className="py-14 sm:py-16">
      <Container>
        <div className="glass-card paper-grain mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl px-7 py-6 shadow-lg sm:flex-row sm:items-center sm:gap-6">
          <span className="relative z-10 flex shrink-0 items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.15em] text-sage-dark">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
            </span>
            Currently working on
          </span>
          <p className="relative z-10 font-body text-base leading-relaxed text-charcoal">
            {currentlyWorkingOnText}
          </p>
        </div>
      </Container>
    </section>
  );
}
