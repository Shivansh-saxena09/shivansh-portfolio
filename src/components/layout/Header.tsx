"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, person } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { MobileNav } from "./MobileNav";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-beige-border/70 bg-cream/85 backdrop-blur-md">
      <Container className="flex items-center justify-between py-4 sm:py-5">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta font-heading text-sm font-semibold text-ivory">
            S
          </span>
          <span className="font-heading text-lg font-semibold tracking-tight text-charcoal">
            {person.name}
          </span>
        </Link>

        <div className="hidden items-center gap-2 sm:flex">
          <nav className="flex items-center gap-8 pr-6 font-body text-sm text-charcoal">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-active={pathname === item.href}
                className="nav-underline"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="h-6 w-px bg-beige-border" aria-hidden="true" />
          <SocialLinks className="pl-4" />
        </div>

        <MobileNav />
      </Container>
    </header>
  );
}
