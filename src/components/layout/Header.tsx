"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, person } from "@/content/site";

export function Header() {
  const pathname = usePathname();

  const renderLinks = (className: string) =>
    nav.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className={className}
        data-active={pathname === item.href}
      >
        {item.label}
      </Link>
    ));

  return (
    <header className="sticky top-0 z-50 border-b border-beige-border/70 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 sm:px-10">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight text-charcoal"
        >
          {person.name}
        </Link>

        <nav className="hidden items-center gap-8 font-body text-sm text-charcoal sm:flex">
          {renderLinks("nav-underline")}
        </nav>

        {/* Mobile nav: simple stacked links; a proper menu/drawer can come
            once there are enough pages to warrant it (currently 3 links). */}
        <nav className="flex items-center gap-4 font-body text-xs text-charcoal sm:hidden">
          {renderLinks("nav-underline")}
        </nav>
      </div>
    </header>
  );
}
