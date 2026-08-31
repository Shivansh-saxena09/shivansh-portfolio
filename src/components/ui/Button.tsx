import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

/**
 * Shared CTA button. "primary" is a filled terracotta pill; "secondary" is
 * an outlined pill whose border draws itself in on hover via an animated
 * SVG stroke (the "stroke-draw button border" micro-interaction from
 * CLAUDE.md → Animations & Interactions).
 */
export function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  if (variant === "primary") {
    return (
      <Link
        href={href}
        className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-terracotta px-8 py-4 font-body text-sm font-medium tracking-wide text-ivory transition-colors duration-300 hover:bg-terracotta-dark ${className}`}
      >
        <span className="relative z-10">{children}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center justify-center rounded-full px-8 py-4 font-body text-sm font-medium tracking-wide text-charcoal ${className}`}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 200 56"
        preserveAspectRatio="none"
        fill="none"
      >
        <rect
          x="1"
          y="1"
          width="198"
          height="54"
          rx="27"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-beige-border transition-[stroke] duration-300 group-hover:text-sage"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={0}
        />
        <rect
          x="1"
          y="1"
          width="198"
          height="54"
          rx="27"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-sage opacity-0 transition-[stroke-dashoffset,opacity] duration-500 ease-out group-hover:opacity-100 group-hover:[stroke-dashoffset:0]"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1}
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </Link>
  );
}
