"use client";

import type { Service } from "@/lib/data/services";
import { TextInput, TextArea } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ReorderableList, DragHandle } from "@/components/admin/ReorderableList";
import { createService, updateService, deleteService, reorderServices } from "@/app/admin/(panel)/settings/actions";

export function ServicesManager({ services }: { services: Service[] }) {
  return (
    <div>
      <ReorderableList
        items={services}
        onReorder={(ids) => reorderServices(ids)}
        renderItem={(service, dragHandleProps) => (
          <div className="flex items-start gap-2 rounded-xl border border-beige-border bg-cream p-4">
            <DragHandle {...dragHandleProps} />
            <form
              action={updateService}
              className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr_auto] sm:items-start"
            >
              <input type="hidden" name="id" value={service.id} />
              <TextInput name="title" defaultValue={service.title} required />
              <TextArea name="description" defaultValue={service.description} rows={2} required />
              <div className="flex gap-2">
                <SubmitButton className="shrink-0">Save</SubmitButton>
              </div>
            </form>
            <form action={deleteService}>
              <input type="hidden" name="id" value={service.id} />
              <SubmitButton variant="danger" pendingLabel="…">
                Delete
              </SubmitButton>
            </form>
          </div>
        )}
      />

      <form action={createService} className="mt-3">
        <SubmitButton variant="secondary" pendingLabel="Adding…">
          + Add Service
        </SubmitButton>
      </form>
    </div>
  );
}
