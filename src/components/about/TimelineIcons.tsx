import type { SVGProps } from "react";
import type { TimelineIconName } from "@/content/about";

/**
 * Small per-role badge icons for the experience timeline — custom
 * line-drawn SVGs (matching the site's existing icon style elsewhere,
 * e.g. Button/SocialIcons) rather than emoji, to keep the timeline's
 * register professional/editorial in contrast to the playful Quick Take
 * cards next to it.
 */
export function TrendingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M3 16 9.5 9.5l4 4L20 7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7h5v5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LayersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m3 13 9 5 9-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SproutIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M12 21v-8.5" strokeLinecap="round" />
      <path
        d="M12 12.5c-4-.5-6.5-3-6.5-7.5 4.2 0 6.5 2.7 6.5 6 0-3.3 2.3-6 6.5-6 0 4.5-2.5 7-6.5 7.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const timelineIcons: Record<TimelineIconName, (props: SVGProps<SVGSVGElement>) => React.JSX.Element> = {
  trending: TrendingIcon,
  layers: LayersIcon,
  sprout: SproutIcon,
};
