import type { SVGProps } from "react";

/**
 * Line icons for each "Story" chapter — matching the site's existing
 * stroke-icon language (TimelineIcons.tsx: 24x24 viewBox, strokeWidth
 * 1.8, no fill) rather than introducing emoji here, since the narrative
 * section reads as the case study's factual record, not the playful
 * register the Quick Take component uses elsewhere.
 */

export function ObjectiveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="12" cy="12" r="0.5" fill="currentColor" />
    </svg>
  );
}

export function StrategyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-4.5 1.5L9 15l4.5-1.5L15 9Z" strokeLinejoin="round" />
    </svg>
  );
}

export function ChallengeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path
        d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DecisionIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M12 3v6" strokeLinecap="round" />
      <path d="M12 9 6 20M12 9l6 11" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="21" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="21" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function OutcomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M5 12.5 9.5 17 19 6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LessonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" strokeLinecap="round" />
      <path d="M3 4v4.5H7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
