function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <path
        d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.29 2.25h17.78A1.5 1.5 0 0 0 22.18 18L13.71 3.86a1.5 1.5 0 0 0-2.42 0Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * "Campaign Doctor Insight" — a real, admin-approved AI analysis result
 * shown publicly (CLAUDE.md's Campaign Doctor is admin-only to *run*;
 * this showcases one reviewed output, not a live endpoint). No API call
 * happens here — every field is a static snapshot published from
 * /admin/case-studies (see doctor-actions.ts's publishInsight), so this
 * costs nothing per visitor no matter how much traffic the page gets.
 *
 * Deliberately reuses the site's "Quick Take" dark-card treatment
 * (rotating conic-gradient ring + drifting ambient glows, see
 * .quick-take-border/.quick-take-glow-a/b in globals.css) rather than
 * inventing a fourth visual language — this section is quite literally
 * the marketing/engineering dual-skill fusion the rest of the site
 * argues for, so it earns the same "alive, technical" register.
 */
export function CampaignDoctorInsight({
  whatsWorking,
  likelyIssues,
  recommendedAction,
  timeframe,
  generatedAt,
}: {
  whatsWorking: string[];
  likelyIssues: string[];
  recommendedAction: string;
  timeframe: string;
  generatedAt: string;
}) {
  return (
    <div className="quick-take-border rounded-3xl">
      <div className="relative overflow-hidden rounded-3xl bg-charcoal p-7 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.3),0_24px_50px_-16px_rgba(181,98,58,0.4)] sm:p-9">
        <div
          aria-hidden="true"
          className="quick-take-glow-a pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-terracotta/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="quick-take-glow-b pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-sage/25 blur-3xl"
        />

        <div className="relative z-10 flex items-center gap-3">
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
            <span
              aria-hidden="true"
              className="motion-safe:animate-ping absolute inset-0 rounded-full bg-gradient-to-br from-terracotta to-sage opacity-60"
            />
            <span
              aria-hidden="true"
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-terracotta to-sage text-base"
            >
              🩺
            </span>
          </span>
          <div>
            <p className="font-body text-xs font-bold tracking-[0.2em] text-cream uppercase">
              Campaign Doctor
            </p>
            <p className="font-body text-[11px] font-medium text-cream/60">
              AI-powered campaign analysis — built into my admin panel
            </p>
          </div>
        </div>

        <p className="relative z-10 mt-5 font-heading text-lg leading-snug text-cream">
          Here&apos;s what my AI-powered analysis tool identified for this campaign.
        </p>

        <div className="relative z-10 mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <p className="font-body text-xs font-bold tracking-[0.15em] text-sage uppercase">
              What&apos;s Working
            </p>
            <ul className="mt-2.5 flex flex-col gap-2">
              {whatsWorking.map((point, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-sm leading-relaxed text-cream/90">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-body text-xs font-bold tracking-[0.15em] text-terracotta uppercase">
              Likely Issues
            </p>
            <ul className="mt-2.5 flex flex-col gap-2">
              {likelyIssues.map((point, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-sm leading-relaxed text-cream/90">
                  <AlertIcon className="mt-0.5 h-4 w-4 shrink-0 text-terracotta" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative z-10 mt-5 rounded-xl bg-cream/[0.07] p-4">
          <p className="font-body text-xs font-bold tracking-[0.15em] text-cream uppercase">
            Recommended Action
          </p>
          <p className="mt-1.5 font-body text-sm leading-relaxed text-cream/90">{recommendedAction}</p>
          <p className="mt-2 font-body text-xs font-medium text-cream/50">Timeframe: {timeframe}</p>
        </div>

        <p className="relative z-10 mt-5 font-body text-[11px] text-cream/40">
          Generated by Claude, reviewed and approved before publishing — analyzed{" "}
          {new Date(generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.
        </p>
      </div>
    </div>
  );
}
