"use client";

import type { EducationEntry } from "@/lib/data/about";
import { TextInput, SelectInput } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ReorderableList, DragHandle } from "@/components/admin/ReorderableList";
import { createEducation, updateEducation, deleteEducation, reorderEducation } from "@/app/admin/(panel)/about/actions";

export function EducationManager({ entries }: { entries: EducationEntry[] }) {
  return (
    <div>
      <ReorderableList
        items={entries}
        onReorder={(ids) => reorderEducation(ids)}
        renderItem={(entry, dragHandleProps) => (
          <div className="flex items-center gap-2 rounded-xl border border-beige-border bg-cream p-3">
            <DragHandle {...dragHandleProps} />
            <form action={updateEducation} className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-5 sm:items-center">
              <input type="hidden" name="id" value={entry.id} />
              <TextInput name="range" defaultValue={entry.range} required placeholder="2023" />
              <TextInput name="credential" defaultValue={entry.credential} required className="sm:col-span-2" placeholder="B.Tech, Computer Science" />
              <TextInput name="detail" defaultValue={entry.detail} required className="sm:col-span-1" placeholder="Institution" />
              <div className="flex items-center gap-2">
                <SelectInput name="accent" defaultValue={entry.accent} className="w-auto">
                  <option value="sage">Sage</option>
                  <option value="terracotta">Terracotta</option>
                </SelectInput>
                <SubmitButton className="shrink-0">Save</SubmitButton>
              </div>
            </form>
            <form action={deleteEducation}>
              <input type="hidden" name="id" value={entry.id} />
              <SubmitButton variant="danger" pendingLabel="…">
                Delete
              </SubmitButton>
            </form>
          </div>
        )}
      />
      <form action={createEducation} className="mt-3">
        <SubmitButton variant="secondary" pendingLabel="Adding…">
          + Add Education
        </SubmitButton>
      </form>
    </div>
  );
}
