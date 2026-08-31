import type { ReactNode } from "react";

/**
 * Matches the numeric tokens worth calling out in auto-composed case-study
 * prose: currency (₹47,700), percentages (0.96%), and multi-digit counts
 * (159, 9,30,000). Deliberately requires 2+ digits for bare numbers so
 * incidental mentions ("2 ad sets") don't get swept up — only real metrics
 * (lead counts, CPL, reach) tend to run two digits or more in this data.
 */
const STAT_PATTERN = /₹[\d,]+(?:\.\d+)?|[\d,]+(?:\.\d+)?%|\b\d{2,}(?:,\d{2,3})*(?:\.\d+)?\b/g;

function splitOnStats(text: string): { parts: string[]; matches: string[] } {
  const matches = text.match(STAT_PATTERN) ?? [];
  const parts = text.split(STAT_PATTERN);
  return { parts, matches };
}

/**
 * Inline emphasis for numbers embedded in flowing prose (case-study
 * narrative paragraphs) — bold + terracotta, same size as the surrounding
 * text. Restrained on purpose: this is prose, not a stat card, so it
 * should still read as a sentence, just one where the numbers pop.
 */
export function highlightStats(text: string, keyPrefix: string): ReactNode {
  const { parts, matches } = splitOnStats(text);
  if (matches.length === 0) return text;

  const nodes: ReactNode[] = [];
  parts.forEach((part, i) => {
    if (part) nodes.push(<span key={`${keyPrefix}-t${i}`}>{part}</span>);
    if (matches[i]) {
      nodes.push(
        <strong key={`${keyPrefix}-m${i}`} className="font-semibold text-terracotta">
          {matches[i]}
        </strong>,
      );
    }
  });
  return nodes;
}

/**
 * Stat-callout emphasis for short result headlines ("159 leads at ₹300
 * per lead") — numbers jump up in size and weight, connecting words
 * demote to muted grey, so the metric reads first. Falls back to the
 * plain string when there's nothing numeric to emphasize (e.g. "Sales
 * follow-up time cut from hours to minutes") so that headline still
 * inherits the caller's own bold/accent styling instead of going quiet.
 */
export function statHeadline(
  text: string,
  keyPrefix: string,
  size: "card" | "page" = "card",
): ReactNode {
  const { parts, matches } = splitOnStats(text);
  if (matches.length === 0) return text;

  const numberClass =
    size === "page"
      ? "font-heading text-3xl font-bold text-terracotta sm:text-4xl"
      : "font-heading text-xl font-bold text-terracotta";

  const nodes: ReactNode[] = [];
  parts.forEach((part, i) => {
    if (part) {
      nodes.push(
        <span key={`${keyPrefix}-t${i}`} className="font-normal text-warm-grey">
          {part}
        </span>,
      );
    }
    if (matches[i]) {
      nodes.push(
        <strong key={`${keyPrefix}-m${i}`} className={numberClass}>
          {matches[i]}
        </strong>,
      );
    }
  });
  return nodes;
}
