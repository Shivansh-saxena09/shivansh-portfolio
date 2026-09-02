import type { ContactInfo } from "@/lib/data/site";
import { LinkedInIcon, GitHubIcon, WhatsAppIcon, EmailIcon } from "./SocialIcons";

export function SocialLinks({
  contact,
  className = "",
  iconClassName = "h-[18px] w-[18px]",
}: {
  contact: ContactInfo;
  className?: string;
  iconClassName?: string;
}) {
  const items = [
    { label: "LinkedIn", href: contact.linkedin, Icon: LinkedInIcon },
    { label: "GitHub", href: contact.github, Icon: GitHubIcon },
    { label: "WhatsApp", href: contact.whatsapp, Icon: WhatsAppIcon },
    { label: "Email", href: `mailto:${contact.email}`, Icon: EmailIcon },
  ] as const;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {items.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          aria-label={label}
          title={label}
          className="flex h-10 w-10 items-center justify-center rounded-full text-charcoal transition-colors duration-200 hover:bg-terracotta/10 hover:text-terracotta"
        >
          <Icon className={iconClassName} />
        </a>
      ))}
    </div>
  );
}
