import Link from "next/link";
import type { ReactNode } from "react";

type TagProps = {
  children: ReactNode;
  href?: string;
  active?: boolean;
};

/** Small pill used for skill/platform/status labels across cards and grids. */
export function Tag({ children, href, active = false }: TagProps) {
  const classes = `inline-flex items-center rounded-full border px-3.5 py-1.5 font-body text-xs font-medium tracking-wide transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
    active
      ? "border-terracotta bg-terracotta text-ivory"
      : "border-beige-border bg-ivory text-charcoal hover:border-sage hover:text-sage-dark"
  }`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <span className={classes}>{children}</span>;
}
