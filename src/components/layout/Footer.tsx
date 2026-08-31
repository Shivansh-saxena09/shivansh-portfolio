import { footerNote, person } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  return (
    <footer className="paper-grain relative border-t border-beige-border/70 bg-ivory">
      {/* Same terracotta→sage gradient as the scroll-progress line — a
          small bookend touch tying the top and bottom of every page together. */}
      <div
        aria-hidden="true"
        className="h-[2px] w-full bg-gradient-to-r from-terracotta to-sage"
      />

      <Container className="relative z-10 flex flex-col gap-8 py-16 sm:flex-row sm:items-center sm:justify-between sm:py-20">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta font-heading text-sm font-semibold text-ivory">
            S
          </span>
          <div>
            <p className="font-heading text-xl font-semibold text-charcoal">{person.name}</p>
            <p className="mt-0.5 font-body text-sm text-warm-grey">{footerNote}</p>
          </div>
        </div>

        <SocialLinks />
      </Container>

      <div className="relative z-10 border-t border-beige-border/70 px-5 py-4 text-center font-body text-xs text-warm-grey">
        © {new Date().getFullYear()} {person.name}. All rights reserved.
      </div>
    </footer>
  );
}
