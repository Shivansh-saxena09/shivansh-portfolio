import Link from "next/link";
import { footerNote, person, nav, contact } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";

const footerNav = [{ label: "Home", href: "/" }, ...nav] as const;

/**
 * Site footer — four columns (identity / explore / get in touch /
 * signature) over the same paper-grain texture used sitewide, with the
 * social row in a glass-card pill. The name in the signature column is
 * `person.name` split across two lines at a normal, on-brand type scale —
 * no oversized background wordmark (tried, felt heavy/disproportionate;
 * removed rather than patched).
 */
export function Footer() {
  const [firstName, ...restName] = person.name.split(" ");
  const lastName = restName.join(" ");

  return (
    <footer className="paper-grain relative overflow-hidden border-t border-beige-border/70 bg-ivory">
      <div aria-hidden="true" className="h-[2px] w-full bg-gradient-to-r from-terracotta to-sage" />

      <Container className="relative z-10 py-16 sm:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
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

          <div>
            <div className="h-1 w-8 rounded-full bg-terracotta" />
            <p className="mt-4 font-heading text-3xl leading-[1.15] font-bold text-charcoal">
              <span className="block">{firstName}</span>
              <span className="block">{lastName}</span>
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center gap-6 border-t border-beige-border/70 pt-6 sm:flex-row sm:justify-between">
          <p className="font-body text-xs text-warm-grey">
            © {new Date().getFullYear()} {person.name}. All rights reserved.
          </p>
          <div className="glass-card inline-flex rounded-full px-2 py-1">
            <SocialLinks />
          </div>
        </div>
      </Container>
    </footer>
  );
}
