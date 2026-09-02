"use client";

import { useActionState } from "react";
import type { Skill, SkillCategory } from "@/lib/data/skills";
import { TextInput, SelectInput } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ReorderableList, DragHandle } from "@/components/admin/ReorderableList";
import { createSkill, updateSkill, deleteSkill, reorderSkills, type SkillFormState } from "@/app/admin/(panel)/skills/actions";

const CATEGORIES: { value: SkillCategory; label: string }[] = [
  { value: "marketing", label: "Marketing" },
  { value: "development", label: "Development" },
  { value: "design", label: "Design" },
];

const initialState: SkillFormState = { error: null };

function CategoryGroup({ category, label, skills }: { category: SkillCategory; label: string; skills: Skill[] }) {
  return (
    <div>
      <h3 className="font-heading text-lg font-bold text-charcoal">{label}</h3>
      <div className="mt-3">
        <ReorderableList
          items={skills.map((s) => ({ ...s, id: s.slug }))}
          onReorder={(slugs) => reorderSkills(category, slugs)}
          renderItem={(skill, dragHandleProps) => (
            <div className="flex items-center gap-2 rounded-xl border border-beige-border bg-cream p-3">
              <DragHandle {...dragHandleProps} />
              <form action={updateSkill} className="flex flex-1 flex-wrap items-center gap-2">
                <input type="hidden" name="slug" value={skill.slug} />
                <span className="rounded-md bg-beige-border/50 px-2 py-1 font-mono text-xs text-warm-grey">
                  {skill.slug}
                </span>
                <TextInput name="label" defaultValue={skill.label} required className="max-w-[220px] flex-1" />
                <SelectInput name="category" defaultValue={skill.category} className="w-auto">
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </SelectInput>
                <SubmitButton className="shrink-0">Save</SubmitButton>
              </form>
              <form action={deleteSkill}>
                <input type="hidden" name="slug" value={skill.slug} />
                <SubmitButton variant="danger" pendingLabel="…">
                  Delete
                </SubmitButton>
              </form>
            </div>
          )}
        />
      </div>
    </div>
  );
}

export function SkillsManager({ skills }: { skills: Skill[] }) {
  const [state, formAction] = useActionState(createSkill, initialState);

  return (
    <div className="flex flex-col gap-8">
      {CATEGORIES.map((c) => (
        <CategoryGroup
          key={c.value}
          category={c.value}
          label={c.label}
          skills={skills.filter((s) => s.category === c.value)}
        />
      ))}

      <div>
        <h3 className="font-heading text-lg font-bold text-charcoal">Add a Skill</h3>
        <form action={formAction} className="mt-3 flex flex-wrap items-end gap-3 rounded-xl border border-beige-border bg-ivory p-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new_slug" className="font-body text-xs font-medium text-charcoal">
              Slug
            </label>
            <TextInput id="new_slug" name="slug" placeholder="meta-ads" required pattern="[a-z0-9-]+" className="w-40" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new_label" className="font-body text-xs font-medium text-charcoal">
              Label
            </label>
            <TextInput id="new_label" name="label" placeholder="Meta Ads" required className="w-48" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new_category" className="font-body text-xs font-medium text-charcoal">
              Category
            </label>
            <SelectInput id="new_category" name="category" defaultValue="marketing" className="w-40">
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </SelectInput>
          </div>
          <SubmitButton pendingLabel="Adding…">+ Add Skill</SubmitButton>
        </form>
        {state.error && (
          <p role="alert" className="mt-2 font-body text-sm text-terracotta-dark">
            {state.error}
          </p>
        )}
      </div>
    </div>
  );
}
