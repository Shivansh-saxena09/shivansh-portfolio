"use client";

import type { QuickFact } from "@/lib/data/about";
import { TextInput } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ReorderableList, DragHandle } from "@/components/admin/ReorderableList";
import { createQuickFact, updateQuickFact, deleteQuickFact, reorderQuickFacts } from "@/app/admin/(panel)/about/actions";

export function QuickFactsManager({ facts }: { facts: QuickFact[] }) {
  return (
    <div>
      <ReorderableList
        items={facts}
        onReorder={(ids) => reorderQuickFacts(ids)}
        renderItem={(fact, dragHandleProps) => (
          <div className="flex items-center gap-2 rounded-xl border border-beige-border bg-cream p-3">
            <DragHandle {...dragHandleProps} />
            <form action={updateQuickFact} className="flex flex-1 flex-wrap items-center gap-2">
              <input type="hidden" name="id" value={fact.id} />
              <TextInput name="value" defaultValue={fact.value} required className="w-24" placeholder="3" />
              <TextInput name="label" defaultValue={fact.label} required className="max-w-xs flex-1" placeholder="Roles since 2023" />
              <SubmitButton className="shrink-0">Save</SubmitButton>
            </form>
            <form action={deleteQuickFact}>
              <input type="hidden" name="id" value={fact.id} />
              <SubmitButton variant="danger" pendingLabel="…">
                Delete
              </SubmitButton>
            </form>
          </div>
        )}
      />
      <form action={createQuickFact} className="mt-3">
        <SubmitButton variant="secondary" pendingLabel="Adding…">
          + Add Quick Fact
        </SubmitButton>
      </form>
    </div>
  );
}
