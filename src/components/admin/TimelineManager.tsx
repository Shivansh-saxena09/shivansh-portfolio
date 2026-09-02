"use client";

import type { TimelineEntry } from "@/lib/data/about";
import type { Skill } from "@/lib/data/skills";
import { Field, TextInput, TextArea, SelectInput, Checkbox, FieldGrid } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ReorderableList, DragHandle } from "@/components/admin/ReorderableList";
import {
  createTimelineEntry,
  updateTimelineEntry,
  deleteTimelineEntry,
  reorderTimelineEntries,
} from "@/app/admin/(panel)/experience/actions";

const ICONS = ["trending", "layers", "sprout"] as const;

function EntryForm({ entry, allSkills }: { entry: TimelineEntry; allSkills: Skill[] }) {
  const entrySkillSlugs = new Set(entry.skills.map((s) => s.slug));
  const option1 = entry.challenge.options[0];
  const option2 = entry.challenge.options[1];

  return (
    <form action={updateTimelineEntry} className="flex flex-col gap-5 rounded-2xl border border-beige-border bg-cream p-5">
      <input type="hidden" name="id" value={entry.id} />

      <FieldGrid>
        <Field label="Date range" htmlFor={`range-${entry.id}`}>
          <TextInput id={`range-${entry.id}`} name="range" defaultValue={entry.range} required />
        </Field>
        <Field label="Icon" htmlFor={`icon-${entry.id}`}>
          <SelectInput id={`icon-${entry.id}`} name="icon" defaultValue={entry.icon}>
            {ICONS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Role" htmlFor={`role-${entry.id}`}>
          <TextInput id={`role-${entry.id}`} name="role" defaultValue={entry.role} required />
        </Field>
        <Field label="Organization" htmlFor={`org-${entry.id}`}>
          <TextInput id={`org-${entry.id}`} name="org" defaultValue={entry.org} required />
        </Field>
        <Field label="Location (optional)" htmlFor={`location-${entry.id}`}>
          <TextInput id={`location-${entry.id}`} name="location" defaultValue={entry.location ?? ""} />
        </Field>
      </FieldGrid>

      <Checkbox name="current" label="This is my current role" defaultChecked={entry.current} />

      <Field label="Description" htmlFor={`description-${entry.id}`}>
        <TextArea id={`description-${entry.id}`} name="description" rows={3} defaultValue={entry.description} required />
      </Field>

      <div>
        <p className="font-body text-sm font-medium text-charcoal">Skills</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
          {allSkills.map((skill) => (
            <label key={skill.slug} className="flex items-center gap-1.5 font-body text-sm text-charcoal">
              <input
                type="checkbox"
                name="skills"
                value={skill.slug}
                defaultChecked={entrySkillSlugs.has(skill.slug)}
                className="h-4 w-4 accent-terracotta"
              />
              {skill.label}
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-beige-border bg-ivory p-4">
        <p className="font-body text-xs font-semibold tracking-[0.1em] text-terracotta uppercase">
          Quick Take Challenge
        </p>
        <div className="mt-3 flex flex-col gap-3">
          <FieldGrid>
            <Field label="Emoji" htmlFor={`emoji-${entry.id}`}>
              <TextInput id={`emoji-${entry.id}`} name="challenge_emoji" defaultValue={entry.challenge.emoji} required />
            </Field>
            <Field label="Question" htmlFor={`question-${entry.id}`}>
              <TextInput id={`question-${entry.id}`} name="challenge_question" defaultValue={entry.challenge.question} required />
            </Field>
          </FieldGrid>

          <p className="font-body text-xs font-medium text-warm-grey">Options — pick which one is correct</p>
          <FieldGrid>
            <label className="flex items-center gap-2 font-body text-sm text-charcoal">
              <input type="radio" name="correct_option" value="1" defaultChecked={option1?.correct} required className="accent-terracotta" />
              <TextInput name="option_1_label" defaultValue={option1?.label ?? ""} required placeholder="Option A" />
            </label>
            <label className="flex items-center gap-2 font-body text-sm text-charcoal">
              <input type="radio" name="correct_option" value="2" defaultChecked={option2?.correct} required className="accent-terracotta" />
              <TextInput name="option_2_label" defaultValue={option2?.label ?? ""} required placeholder="Option B" />
            </label>
          </FieldGrid>

          <Field label="Explanation if correct" htmlFor={`correct-exp-${entry.id}`}>
            <TextArea
              id={`correct-exp-${entry.id}`}
              name="challenge_correct_explanation"
              rows={2}
              defaultValue={entry.challenge.correctExplanation}
              required
            />
          </Field>
          <Field label="Explanation if incorrect" htmlFor={`incorrect-exp-${entry.id}`}>
            <TextArea
              id={`incorrect-exp-${entry.id}`}
              name="challenge_incorrect_explanation"
              rows={2}
              defaultValue={entry.challenge.incorrectExplanation}
              required
            />
          </Field>
        </div>
      </div>

      <div>
        <SubmitButton>Save Entry</SubmitButton>
      </div>
    </form>
  );
}

export function TimelineManager({ entries, allSkills }: { entries: TimelineEntry[]; allSkills: Skill[] }) {
  return (
    <div>
      <ReorderableList
        items={entries}
        onReorder={(ids) => reorderTimelineEntries(ids)}
        renderItem={(entry, dragHandleProps) => (
          <div className="flex items-start gap-2">
            <div className="pt-5">
              <DragHandle {...dragHandleProps} />
            </div>
            <div className="flex-1">
              <EntryForm entry={entry} allSkills={allSkills} />
              <form action={deleteTimelineEntry} className="mt-2 flex justify-end">
                <input type="hidden" name="id" value={entry.id} />
                <SubmitButton variant="danger" pendingLabel="Deleting…">
                  Delete Entry
                </SubmitButton>
              </form>
            </div>
          </div>
        )}
      />

      <form action={createTimelineEntry} className="mt-4">
        <SubmitButton variant="secondary" pendingLabel="Adding…">
          + Add Experience Entry
        </SubmitButton>
      </form>
    </div>
  );
}
