"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { runCampaignDoctor, type DoctorState } from "@/app/admin/(panel)/case-studies/doctor-actions";

const initialState: DoctorState = { result: null, error: null };

/**
 * Admin-only "Analyze & Suggest" panel (CLAUDE.md's Campaign Doctor).
 * Never rendered on any public page — imported only from the case-study
 * edit page inside /admin. Same analysis engine for live and closed
 * campaigns; the prompt (src/lib/campaignDoctor.ts) frames the request
 * differently based on the case study's own `status` field.
 */
export function CampaignDoctor({ slug, isLive }: { slug: string; isLive: boolean }) {
  const [state, formAction, pending] = useActionState(runCampaignDoctor, initialState);

  return (
    <div className="rounded-2xl border border-terracotta/30 bg-terracotta/5 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-body text-xs font-semibold tracking-[0.1em] text-terracotta uppercase">
            Campaign Doctor
          </p>
          <p className="mt-1 font-body text-sm text-warm-grey">
            {isLive
              ? "Forward-looking optimization advice based on current metrics."
              : "Retrospective analysis — what should have been done differently."}
          </p>
        </div>
        <form action={formAction}>
          <input type="hidden" name="slug" value={slug} />
          <SubmitButton pendingLabel="Analyzing…">Analyze &amp; Suggest</SubmitButton>
        </form>
      </div>

      {pending && (
        <p className="mt-4 font-body text-sm text-warm-grey">
          Sending metrics to Claude — usually takes a few seconds…
        </p>
      )}

      {state.error && (
        <p role="alert" className="mt-4 font-body text-sm text-terracotta-dark">
          {state.error}
        </p>
      )}

      {state.result && (
        <div className="mt-5 flex flex-col gap-4 border-t border-terracotta/20 pt-5">
          <div>
            <p className="font-body text-xs font-semibold tracking-[0.1em] text-sage-dark uppercase">
              What&apos;s Working
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {state.result.whatsWorking.map((point, i) => (
                <li key={i} className="font-body text-sm leading-relaxed text-charcoal">
                  • {point}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-body text-xs font-semibold tracking-[0.1em] text-terracotta uppercase">
              Likely Issues
            </p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {state.result.likelyIssues.map((point, i) => (
                <li key={i} className="font-body text-sm leading-relaxed text-charcoal">
                  • {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-ivory p-4">
            <p className="font-body text-xs font-semibold tracking-[0.1em] text-charcoal uppercase">
              Recommended Action
            </p>
            <p className="mt-1.5 font-body text-sm leading-relaxed text-charcoal">
              {state.result.recommendedAction}
            </p>
            <p className="mt-2 font-body text-xs font-medium text-warm-grey">
              Timeframe: {state.result.timeframe}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
