"use client";

import type { AdSet } from "@/lib/data/caseStudies";
import { Field, TextInput, SelectInput, FieldGrid } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ReorderableList, DragHandle } from "@/components/admin/ReorderableList";
import { createAdSet, updateAdSet, deleteAdSet, reorderAdSets } from "@/app/admin/(panel)/case-studies/actions";

const AUDIENCE_TYPES = ["Broad", "Interest-based", "Lookalike", "Custom", "Retargeting"] as const;

function NumberField({ label, name, defaultValue, step = "1" }: { label: string; name: string; defaultValue: number | null | undefined; step?: string }) {
  return (
    <Field label={label} htmlFor={name}>
      <TextInput id={name} name={name} type="number" step={step} defaultValue={defaultValue ?? ""} />
    </Field>
  );
}

function AdSetForm({ adSet }: { adSet: AdSet }) {
  return (
    <form action={updateAdSet} className="flex flex-1 flex-col gap-4 rounded-2xl border border-beige-border bg-cream p-4">
      <input type="hidden" name="id" value={adSet.id} />
      <Field label="Ad set name" htmlFor={`name-${adSet.id}`}>
        <TextInput id={`name-${adSet.id}`} name="name" defaultValue={adSet.name} required />
      </Field>

      <div>
        <p className="font-body text-xs font-semibold tracking-[0.1em] text-terracotta uppercase">Targeting</p>
        <FieldGrid>
          <Field label="Locations" htmlFor={`loc-${adSet.id}`}>
            <TextInput id={`loc-${adSet.id}`} name="targeting_locations" defaultValue={adSet.targeting.locations} required />
          </Field>
          <Field label="Age / Gender" htmlFor={`age-${adSet.id}`}>
            <TextInput id={`age-${adSet.id}`} name="targeting_age_gender" defaultValue={adSet.targeting.ageGender} required />
          </Field>
          <Field label="Interests (optional)" htmlFor={`interests-${adSet.id}`}>
            <TextInput id={`interests-${adSet.id}`} name="targeting_interests" defaultValue={adSet.targeting.interests ?? ""} />
          </Field>
          <Field label="Placements" htmlFor={`placements-${adSet.id}`}>
            <TextInput id={`placements-${adSet.id}`} name="targeting_placements" defaultValue={adSet.targeting.placements} required />
          </Field>
          <Field label="Est. audience size (optional)" htmlFor={`audsize-${adSet.id}`}>
            <TextInput id={`audsize-${adSet.id}`} name="targeting_audience_size_estimate" defaultValue={adSet.targeting.audienceSizeEstimate ?? ""} />
          </Field>
          <Field label="Audience type" htmlFor={`audtype-${adSet.id}`}>
            <SelectInput id={`audtype-${adSet.id}`} name="targeting_audience_type" defaultValue={adSet.targeting.audienceType}>
              {AUDIENCE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </SelectInput>
          </Field>
        </FieldGrid>
      </div>

      <div>
        <p className="font-body text-xs font-semibold tracking-[0.1em] text-terracotta uppercase">
          Awareness &amp; Engagement
        </p>
        <FieldGrid>
          <NumberField label="Impressions" name="metrics_impressions" defaultValue={adSet.metrics.impressions} />
          <NumberField label="Reach" name="metrics_reach" defaultValue={adSet.metrics.reach} />
          <NumberField label="Frequency" name="metrics_frequency" defaultValue={adSet.metrics.frequency} step="0.01" />
          <NumberField label="CPM (₹)" name="metrics_cpm" defaultValue={adSet.metrics.cpm} step="0.01" />
          <NumberField label="Link clicks" name="metrics_link_clicks" defaultValue={adSet.metrics.linkClicks} />
          <NumberField label="All clicks" name="metrics_all_clicks" defaultValue={adSet.metrics.allClicks} />
        </FieldGrid>
      </div>

      <div>
        <p className="font-body text-xs font-semibold tracking-[0.1em] text-terracotta uppercase">
          Conversion / Result
        </p>
        <FieldGrid>
          <NumberField label="Leads" name="metrics_leads" defaultValue={adSet.metrics.leads} />
          <NumberField label="Amount spent (₹)" name="metrics_amount_spent" defaultValue={adSet.metrics.amountSpent} step="0.01" />
        </FieldGrid>
      </div>

      <div>
        <p className="font-body text-xs font-semibold tracking-[0.1em] text-sage-dark uppercase">
          Business Outcome (optional)
        </p>
        <FieldGrid>
          <NumberField label="Qualified leads" name="outcome_qualified_leads" defaultValue={adSet.businessOutcome?.qualifiedLeads} />
          <NumberField label="Site visits" name="outcome_site_visits" defaultValue={adSet.businessOutcome?.siteVisits} />
          <NumberField label="Bookings" name="outcome_bookings" defaultValue={adSet.businessOutcome?.bookings} />
          <NumberField label="CAC (₹)" name="outcome_cac" defaultValue={adSet.businessOutcome?.cac} step="0.01" />
          <NumberField label="ROAS" name="outcome_roas" defaultValue={adSet.businessOutcome?.roas} step="0.01" />
        </FieldGrid>
      </div>

      <div>
        <SubmitButton>Save Ad Set</SubmitButton>
      </div>
    </form>
  );
}

export function AdSetsManager({ caseStudySlug, adSets }: { caseStudySlug: string; adSets: AdSet[] }) {
  return (
    <div>
      <ReorderableList
        items={adSets}
        onReorder={(ids) => reorderAdSets(ids)}
        renderItem={(adSet, dragHandleProps) => (
          <div className="flex items-start gap-2">
            <div className="pt-5">
              <DragHandle {...dragHandleProps} />
            </div>
            <div className="flex-1">
              <AdSetForm adSet={adSet} />
              <form action={deleteAdSet} className="mt-2 flex justify-end">
                <input type="hidden" name="id" value={adSet.id} />
                <SubmitButton variant="danger" pendingLabel="Deleting…">
                  Delete Ad Set
                </SubmitButton>
              </form>
            </div>
          </div>
        )}
      />
      <form action={createAdSet} className="mt-4">
        <input type="hidden" name="case_study_slug" value={caseStudySlug} />
        <SubmitButton variant="secondary" pendingLabel="Adding…">
          + Add Ad Set
        </SubmitButton>
      </form>
    </div>
  );
}
