import { highlightStats } from "@/lib/highlightStats";

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

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** One diagnostic-report row — icon badge + a single short line, in its
 *  own bounded box so each point stays visually distinct from its
 *  neighbors regardless of exact length. */
function DiagnosticRow({
  tone,
  icon,
  children,
}: {
  tone: "positive" | "negative";
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const toneClass = tone === "positive" ? "bg-sage/15 text-sage" : "bg-terracotta/15 text-terracotta";
  return (
    <li className="flex items-start gap-2.5 rounded-lg bg-cream/[0.06] p-2.5">
      <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${toneClass}`}>
        {icon}
      </span>
      <span className="font-body text-sm leading-snug text-cream/90">{children}</span>
    </li>
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
 * Reads as a diagnostic report, not an essay: each point is its own
 * bounded row (DiagnosticRow) with a tone-coded icon badge, numbers
 * pulled out via the same highlightStats() treatment the rest of the
 * page uses for prose, so a number is the first thing that lands when
 * scanning down the list rather than reading full sentences.
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
            <ul className="mt-2.5 flex flex-col gap-1.5">
              {whatsWorking.map((point, i) => (
                <DiagnosticRow key={i} tone="positive" icon={<CheckIcon className="h-3 w-3" />}>
                  {highlightStats(point, `working-${i}`)}
                </DiagnosticRow>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-body text-xs font-bold tracking-[0.15em] text-terracotta uppercase">
              Likely Issues
            </p>
            <ul className="mt-2.5 flex flex-col gap-1.5">
              {likelyIssues.map((point, i) => (
                <DiagnosticRow key={i} tone="negative" icon={<AlertIcon className="h-3 w-3" />}>
                  {highlightStats(point, `issue-${i}`)}
                </DiagnosticRow>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative z-10 mt-5 rounded-xl bg-cream/[0.07] p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <p className="font-body text-xs font-bold tracking-[0.15em] text-cream uppercase">
              Recommended Action
            </p>
            {/* No shrink-0/nowrap assumption on the timeframe text — it's
                meant to be a short phrase ("Within 3-5 days"), but this
                has to stay robust against a longer one without breaking
                layout (confirmed via screenshot: a full-sentence
                timeframe from data generated before the schema tightened
                its length was overflowing badly here). */}
            <span className="flex max-w-full items-center gap-1.5 rounded-full bg-cream/10 px-2.5 py-1 font-body text-[11px] font-semibold text-cream/80">
              <ClockIcon className="h-3 w-3 shrink-0" />
              {timeframe}
            </span>
          </div>
          <p className="mt-2 font-body text-sm leading-relaxed text-cream/90">
            {highlightStats(recommendedAction, "action")}
          </p>
        </div>

        <p className="relative z-10 mt-5 font-body text-[11px] text-cream/40">
          Generated by Claude, reviewed and approved before publishing — analyzed{" "}
          {new Date(generatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}.
        </p>
      </div>
    </div>
  );
}
