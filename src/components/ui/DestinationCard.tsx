import Link from "next/link";

export function ChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M4 19V9m6 10V4m6 15v-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CodeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="m9 8-4 4 4 4m6-8 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="M7 17 17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Mobile-only destination card — richer than a plain pill button (icon +
 * label + one-line orientation + arrow, same recipe the nav drawer's
 * links use), for any spot on the site where the entire job of a mobile
 * screen is "get someone to Marketing or Engineering work" (home hero,
 * about's closing CTA). `vivid` gives it the same terracotta-filled
 * emphasis Button's "primary" variant has; the non-vivid state mirrors
 * "secondary" (light, outlined).
 */
export function DestinationCard({
  href,
  icon,
  label,
  description,
  vivid,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  vivid: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-4 rounded-2xl px-5 py-5 transition-transform active:scale-[0.98] ${
        vivid
          ? "bg-terracotta text-ivory shadow-[0_16px_32px_-12px_rgba(181,98,58,0.45)]"
          : "border border-beige-border bg-ivory text-charcoal"
      }`}
    >
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
          vivid ? "bg-ivory/15" : "bg-sage/15 text-sage-dark"
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-lg leading-tight font-bold">{label}</span>
        <span className={`mt-0.5 block font-body text-xs ${vivid ? "text-ivory/75" : "text-warm-grey"}`}>
          {description}
        </span>
      </span>
      <ArrowIcon
        className={`h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
          vivid ? "opacity-80" : "text-warm-grey"
        }`}
      />
    </Link>
  );
}
