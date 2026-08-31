import { contact, footerNote, person } from "@/content/site";

const links = [
  { label: "Email", href: `mailto:${contact.email}` },
  { label: "WhatsApp", href: contact.whatsapp },
  { label: "LinkedIn", href: contact.linkedin },
  { label: "GitHub", href: contact.github },
];

export function Footer() {
  return (
    <footer className="border-t border-beige-border/70 bg-ivory">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <div>
          <p className="font-heading text-base text-charcoal">{person.name}</p>
          <p className="mt-1 font-body text-sm text-warm-grey">{footerNote}</p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 font-body text-sm text-charcoal">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="nav-underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-beige-border/70 px-6 py-4 text-center font-body text-xs text-warm-grey sm:px-10">
        © {new Date().getFullYear()} {person.name}. All rights reserved.
      </div>
    </footer>
  );
}
