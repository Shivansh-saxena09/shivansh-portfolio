"use client";

import "@/components/loaders/loaders.css";
import { useActionState } from "react";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { DoneState, UploadProgress } from "@/components/loaders/Loaders";
import { useDelayed, useJustFinished } from "@/components/loaders/useDelayed";
import { uploadResume, type ResumeUploadState } from "@/app/admin/(panel)/resume/actions";

const initialState: ResumeUploadState = { error: null };

export function ResumeUploadForm() {
  const [state, formAction, pending] = useActionState(uploadResume, initialState);
  const late = useDelayed(pending);
  const finished = useJustFinished(pending);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-2xl border border-beige-border bg-ivory p-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="file" className="font-body text-sm font-medium text-charcoal">
          Replace resume PDF
        </label>
        <input
          id="file"
          name="file"
          type="file"
          accept="application/pdf"
          required
          className="font-body text-sm text-charcoal file:mr-4 file:rounded-full file:border-0 file:bg-terracotta file:px-4 file:py-2 file:font-body file:text-sm file:font-medium file:text-ivory hover:file:bg-terracotta-dark"
        />
      </div>

      {late && <UploadProgress label="Uploading…" />}
      {!pending && state.error && <DoneState ok={false} message={state.error} />}
      {!pending && !state.error && finished && <DoneState ok message="Resume replaced" />}

      <div>
        <SubmitButton pendingLabel="Uploading…">Upload &amp; Replace</SubmitButton>
      </div>
    </form>
  );
}
