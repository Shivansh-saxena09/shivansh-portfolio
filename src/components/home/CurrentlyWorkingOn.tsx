import { currentlyWorkingOn } from "@/content/site";

/**
 * "Currently Working On" live-status widget (CLAUDE.md → Homepage).
 * Renders a single admin-editable line. Today it reads from the static
 * content module; once Supabase is wired up this becomes a server-fetched
 * row from a `site_settings` table — the component's shape doesn't change.
 */
export function CurrentlyWorkingOn() {
  return (
    <section className="px-6 py-14 sm:px-10">
      <div className="glass-card paper-grain mx-auto flex max-w-4xl flex-col gap-3 rounded-2xl px-7 py-6 sm:flex-row sm:items-center sm:gap-6">
        <span className="relative z-10 flex shrink-0 items-center gap-2 font-body text-xs font-semibold uppercase tracking-[0.15em] text-sage-dark">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-sage" />
          </span>
          Currently working on
        </span>
        <p className="relative z-10 font-body text-base leading-relaxed text-charcoal">
          {currentlyWorkingOn.text}
        </p>
      </div>
    </section>
  );
}
