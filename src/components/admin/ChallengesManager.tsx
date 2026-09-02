"use client";

import { Field, TextInput, TextArea, FieldGrid } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ReorderableList, DragHandle } from "@/components/admin/ReorderableList";
import { createChallenge, updateChallenge, deleteChallenge, reorderChallenges } from "@/app/admin/(panel)/projects/actions";

export type Challenge = {
  id: string;
  title: string;
  problem: string;
  fix: string;
  snippet: { filename: string; code: string };
};

export function ChallengesManager({ projectSlug, challenges }: { projectSlug: string; challenges: Challenge[] }) {
  return (
    <div>
      <ReorderableList
        items={challenges}
        onReorder={(ids) => reorderChallenges(ids)}
        renderItem={(challenge, dragHandleProps) => (
          <div className="flex items-start gap-2">
            <div className="pt-5">
              <DragHandle {...dragHandleProps} />
            </div>
            <div className="flex-1 rounded-2xl border border-beige-border bg-cream p-4">
              <form action={updateChallenge} className="flex flex-col gap-3">
                <input type="hidden" name="id" value={challenge.id} />
                <Field label="Title" htmlFor={`title-${challenge.id}`}>
                  <TextInput id={`title-${challenge.id}`} name="title" defaultValue={challenge.title} required />
                </Field>
                <FieldGrid>
                  <Field label="Problem" htmlFor={`problem-${challenge.id}`}>
                    <TextArea id={`problem-${challenge.id}`} name="problem" rows={3} defaultValue={challenge.problem} required />
                  </Field>
                  <Field label="Fix" htmlFor={`fix-${challenge.id}`}>
                    <TextArea id={`fix-${challenge.id}`} name="fix" rows={3} defaultValue={challenge.fix} required />
                  </Field>
                </FieldGrid>
                <Field label="Snippet filename" htmlFor={`filename-${challenge.id}`}>
                  <TextInput
                    id={`filename-${challenge.id}`}
                    name="snippet_filename"
                    defaultValue={challenge.snippet.filename}
                    required
                    className="font-mono"
                    placeholder="policies.sql"
                  />
                </Field>
                <Field label="Snippet code" htmlFor={`code-${challenge.id}`}>
                  <TextArea
                    id={`code-${challenge.id}`}
                    name="snippet_code"
                    rows={4}
                    defaultValue={challenge.snippet.code}
                    required
                    className="font-mono text-xs"
                  />
                </Field>
                <div>
                  <SubmitButton>Save Challenge</SubmitButton>
                </div>
              </form>
              <form action={deleteChallenge} className="mt-2 flex justify-end">
                <input type="hidden" name="id" value={challenge.id} />
                <SubmitButton variant="danger" pendingLabel="Deleting…">
                  Delete Challenge
                </SubmitButton>
              </form>
            </div>
          </div>
        )}
      />
      <form action={createChallenge} className="mt-3">
        <input type="hidden" name="project_slug" value={projectSlug} />
        <SubmitButton variant="secondary" pendingLabel="Adding…">
          + Add Challenge
        </SubmitButton>
      </form>
    </div>
  );
}
