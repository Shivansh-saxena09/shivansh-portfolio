import Link from "next/link";
import { footerNote, person, nav, contact } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";

const footerNav = [{ label: "Home", href: "/" }, ...nav] as const;

/**
 * Site footer — a deliberate closing moment, not a stacked link dump.
 * Three columns (identity / explore / contact) over the same paper-grain
 * texture used sitewide, a glass-card pill for the social row, and a
 * giant low-opacity wordmark bleeding off the right edge for a signature
 * "premium agency" branding moment. The wordmark just renders
 * `person.name` from the shared content module — no new hardcoded
 * string, so it moves to Supabase for free whenever that field does.
 */
export function Footer() {
  return (
    <footer className="paper-grain relative overflow-hidden border-t border-beige-border/70 bg-ivory">
      {/* Same terracotta→sage gradient as the scroll-progress line — a
          small bookend touch tying the top and bottom of every page together. */}
      <div aria-hidden="true" className="h-[2px] w-full bg-gradient-to-r from-terracotta to-sage" />

      <Container className="relative z-10 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-terracotta font-heading text-base font-semibold text-ivory">
                S
              </span>
              <div>
                <p className="font-heading text-xl font-bold text-charcoal">{person.name}</p>
                <p className="mt-0.5 font-body text-sm text-warm-grey">{footerNote}</p>
              </div>
            </div>
            <p className="mt-6 max-w-xs font-body text-sm leading-relaxed text-warm-grey">
              {person.tagline}
            </p>
            <div className="glass-card mt-6 inline-flex rounded-full px-2 py-1">
              <SocialLinks />
            </div>
          </div>

          <div>
            <p className="font-body text-xs font-semibold tracking-[0.15em] text-warm-grey uppercase">
              Explore
            </p>
            <nav className="mt-4 flex flex-col items-start gap-3">
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
            <div className="mt-4 flex flex-col items-start gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="nav-underline font-body text-sm text-charcoal"
              >
                {contact.email}
              </a>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-underline font-body text-sm text-charcoal"
              >
                Message on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </Container>

      {/* Giant wordmark — full-bleed, aligned to the same left inset as
          the columns above, allowed to run past the right edge and clip
          rather than shrink to fit. Decorative (aria-hidden): the name
          already exists as real, readable content in the column above. */}
      <div aria-hidden="true" className="relative z-10 overflow-hidden py-2 pl-5 select-none sm:pl-8 lg:pl-12">
        <p className="bg-gradient-to-r from-terracotta to-sage bg-clip-text font-heading text-[clamp(3.5rem,16vw,11rem)] leading-none font-bold whitespace-nowrap text-transparent opacity-[0.09]">
          {person.name}
        </p>
      </div>

      <div className="relative z-10 border-t border-beige-border/70 px-5 py-4 text-center font-body text-xs text-warm-grey">
        © {new Date().getFullYear()} {person.name}. All rights reserved.
      </div>
    </footer>
  );
}
