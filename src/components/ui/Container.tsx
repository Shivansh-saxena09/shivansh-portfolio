import type { ReactNode } from "react";

/**
 * Shared page-width container. "wide" is the default frame for sections,
 * grids, and layout structure; "narrow" is reserved for long-form prose
 * columns (case-study narrative) where a full-width line length would
 * hurt readability. Keeping these consistent (and wider than the earlier
 * 4xl/5xl per-section guesses) is most of the fix for pages feeling
 * overly centered/cramped on laptop+ screens.
 */
export function Container({
  children,
  size = "wide",
  className = "",
}: {
  children: ReactNode;
  size?: "wide" | "narrow";
  className?: string;
}) {
  const maxWidth = size === "wide" ? "max-w-7xl" : "max-w-[42rem]";
  return <div className={`mx-auto ${maxWidth} px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}
