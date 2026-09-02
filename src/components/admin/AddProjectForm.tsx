"use client";

import { useActionState } from "react";
import { TextInput } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { createProject, type ProjectFormState } from "@/app/admin/(panel)/projects/actions";

const initialState: ProjectFormState = { error: null };

export function AddProjectForm() {
  const [state, formAction] = useActionState(createProject, initialState);

  return (
    <div>
      <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-xl border border-beige-border bg-ivory p-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="new_project_slug" className="font-body text-xs font-medium text-charcoal">
            Slug
          </label>
          <TextInput id="new_project_slug" name="slug" placeholder="my-new-project" required pattern="[a-z0-9-]+" className="w-48" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="new_project_name" className="font-body text-xs font-medium text-charcoal">
            Name
          </label>
          <TextInput id="new_project_name" name="name" placeholder="my-new-project" required className="w-56" />
        </div>
        <SubmitButton pendingLabel="Creating…">+ Add Project</SubmitButton>
      </form>
      {state.error && (
        <p role="alert" className="mt-2 font-body text-sm text-terracotta-dark">
          {state.error}
        </p>
      )}
    </div>
  );
}
