"use client";

import { useActionState } from "react";
import { TextInput } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { createCaseStudy, type CaseStudyFormState } from "@/app/admin/(panel)/case-studies/actions";

const initialState: CaseStudyFormState = { error: null };

export function AddCaseStudyForm() {
  const [state, formAction] = useActionState(createCaseStudy, initialState);

  return (
    <div>
      <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-xl border border-beige-border bg-ivory p-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="new_cs_slug" className="font-body text-xs font-medium text-charcoal">
            Slug
          </label>
          <TextInput id="new_cs_slug" name="slug" placeholder="my-new-campaign" required pattern="[a-z0-9-]+" className="w-52" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="new_cs_name" className="font-body text-xs font-medium text-charcoal">
            Campaign name
          </label>
          <TextInput id="new_cs_name" name="campaign_name" placeholder="Riverside Greens — Investor Lead Gen" required className="w-72" />
        </div>
        <SubmitButton pendingLabel="Creating…">+ Add Case Study</SubmitButton>
      </form>
      {state.error && (
        <p role="alert" className="mt-2 font-body text-sm text-terracotta-dark">
          {state.error}
        </p>
      )}
    </div>
  );
}
