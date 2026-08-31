import { footerNote, person } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";

export function Footer() {
  return (
    <footer className="paper-grain border-t border-beige-border/70 bg-ivory">
      <Container className="relative z-10 flex flex-col gap-6 py-14 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-heading text-xl text-charcoal">{person.name}</p>
          <p className="mt-1 font-body text-sm text-warm-grey">{footerNote}</p>
        </div>

        <SocialLinks />
      </Container>

      <div className="relative z-10 border-t border-beige-border/70 px-5 py-4 text-center font-body text-xs text-warm-grey">
        © {new Date().getFullYear()} {person.name}. All rights reserved.
      </div>
    </footer>
  );
}
