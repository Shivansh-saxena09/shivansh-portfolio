"use client";

import { useActionState } from "react";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { uploadResume, type ResumeUploadState } from "@/app/admin/(panel)/resume/actions";

const initialState: ResumeUploadState = { error: null };

export function ResumeUploadForm() {
  const [state, formAction] = useActionState(uploadResume, initialState);

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

      {state.error && (
        <p role="alert" className="font-body text-sm text-terracotta-dark">
          {state.error}
        </p>
      )}

      <div>
        <SubmitButton pendingLabel="Uploading…">Upload &amp; Replace</SubmitButton>
      </div>
    </form>
  );
}
