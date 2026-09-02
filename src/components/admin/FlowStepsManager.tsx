"use client";

import { TextInput } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ReorderableList, DragHandle } from "@/components/admin/ReorderableList";
import { createFlowStep, updateFlowStep, deleteFlowStep, reorderFlowSteps } from "@/app/admin/(panel)/projects/actions";

export type FlowStep = { id: string; label: string; detail: string };

export function FlowStepsManager({ projectSlug, steps }: { projectSlug: string; steps: FlowStep[] }) {
  return (
    <div>
      <ReorderableList
        items={steps}
        onReorder={(ids) => reorderFlowSteps(ids)}
        renderItem={(step, dragHandleProps) => (
          <div className="flex items-center gap-2 rounded-xl border border-beige-border bg-cream p-3">
            <DragHandle {...dragHandleProps} />
            <form action={updateFlowStep} className="flex flex-1 flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={step.id} />
              <TextInput name="label" defaultValue={step.label} required className="w-40" placeholder="Meta Ad" />
              <TextInput name="detail" defaultValue={step.detail} required className="max-w-xs flex-1" placeholder="Lead form submitted" />
              <SubmitButton className="shrink-0">Save</SubmitButton>
            </form>
            <form action={deleteFlowStep}>
              <input type="hidden" name="id" value={step.id} />
              <SubmitButton variant="danger" pendingLabel="…">
                Delete
              </SubmitButton>
            </form>
          </div>
        )}
      />
      <form action={createFlowStep} className="mt-3">
        <input type="hidden" name="project_slug" value={projectSlug} />
        <SubmitButton variant="secondary" pendingLabel="Adding…">
          + Add Step
        </SubmitButton>
      </form>
    </div>
  );
}
