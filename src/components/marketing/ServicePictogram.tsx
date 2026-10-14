/**
 * Animated pictogram for a service card, picked from the (admin-editable)
 * service title so new services get a matching one automatically; anything
 * unmatched gets the funnel. Draws once when its grid scrolls in (Reveal →
 * data-mo); static otherwise.
 */
type Kind = "leadform" | "search" | "loop" | "browser" | "spark" | "funnel";

export function pictogramFor(title: string): Kind {
  const t = title.toLowerCase();
  if (/conversion|capi|pixel|tracking|analytic|attribution/.test(t)) return "loop";
  if (/google|search|ppc|keyword/.test(t)) return "search";
  if (/meta|facebook|instagram|lead/.test(t)) return "leadform";
  if (/web|landing|site|develop|build/.test(t)) return "browser";
  if (/content|creative|ai|design|video/.test(t)) return "spark";
  return "funnel";
}

export function ServicePictogram({ title, index }: { title: string; index: number }) {
  const kind = pictogramFor(title);
  const ink = "fill-none stroke-terracotta";
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={`sp sp-${kind} h-12 w-12`} style={{ "--i": index } as React.CSSProperties} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="1" width="46" height="46" rx="12" className="fill-ivory stroke-beige-border" strokeWidth="1" />
      {kind === "leadform" && (
        <g>
          <rect x="13" y="10" width="22" height="28" rx="3" className={ink} />
          <path d="M17 17h14M17 23h14" className="sp-row stroke-sage-dark" />
          <rect x="17" y="29" width="14" height="5" rx="2.5" className="sp-btn fill-terracotta stroke-none" />
        </g>
      )}
      {kind === "search" && (
        <g>
          <rect x="8" y="12" width="32" height="9" rx="4.5" className="stroke-sage-dark fill-none" />
          <circle cx="13" cy="16.5" r="2.2" className="stroke-sage-dark fill-none" />
          <path d="M18 16.5h14" className="sp-type stroke-warm-grey" />
          <path d="M10 28h22M10 34h16" className="sp-row stroke-terracotta" />
        </g>
      )}
      {kind === "loop" && (
        <g>
          <path d="M14 24a10 10 0 0 1 17-7l3 3M34 24a10 10 0 0 1-17 7l-3-3" className={`sp-spin ${ink}`} />
          <path d="M34 14v6h-6M14 34v-6h6" className="sp-spin stroke-sage-dark fill-none" />
        </g>
      )}
      {kind === "browser" && (
        <g>
          <rect x="9" y="11" width="30" height="26" rx="3" className="stroke-sage-dark fill-none" />
          <path d="M9 17h30" className="stroke-sage-dark" />
          <path d="M14 23h12M14 29h18" className="sp-row stroke-terracotta" />
        </g>
      )}
      {kind === "spark" && <path d="M24 10v6M24 32v6M10 24h6M32 24h6M15 15l4 4M29 29l4 4M33 15l-4 4M19 29l-4 4" className={`sp-spin ${ink}`} />}
      {kind === "funnel" && (
        <g>
          <path d="M11 12h26l-9 12v9l-8 4V24z" className={ink} />
          <path d="M15 17h18" className="sp-row stroke-sage-dark" />
        </g>
      )}
    </svg>
  );
}
