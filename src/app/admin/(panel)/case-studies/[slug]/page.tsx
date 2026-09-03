import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSkills } from "@/lib/data/skills";
import { mapAdSetRow, mediaPublicUrl, type AdSetRow } from "@/lib/data/caseStudies";
import { Field, TextInput, TextArea, SelectInput, Checkbox, FieldGrid } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { AdSetsManager } from "@/components/admin/AdSetsManager";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { CampaignDoctor } from "@/components/admin/CampaignDoctor";
import { updateCaseStudySetup, updateCaseStudyNarrative, deleteCaseStudy } from "../actions";

const NARRATIVE_FIELDS = [
  { key: "narrative_objective", label: "The Objective" },
  { key: "narrative_strategy", label: "The Strategy" },
  { key: "narrative_challenge", label: "The Challenge" },
  { key: "narrative_decision", label: "The Decision" },
  { key: "narrative_outcome", label: "The Outcome" },
  { key: "narrative_what_id_do_differently", label: "What I'd Do Differently" },
] as const;

export default async function AdminCaseStudyEditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const [{ data: caseStudy }, { data: skillRows }, allSkills, { data: adSetRows }, { data: imageRows }] =
    await Promise.all([
      supabase.from("case_studies").select("*").eq("slug", slug).maybeSingle(),
      supabase.from("case_study_skills").select("skill_slug").eq("case_study_slug", slug),
      getSkills(),
      supabase.from("ad_sets").select("*").eq("case_study_slug", slug).order("sort_order", { ascending: true }),
      supabase
        .from("case_study_images")
        .select("id, storage_path, alt_text")
        .eq("case_study_slug", slug)
        .order("sort_order", { ascending: true }),
    ]);

  if (!caseStudy) notFound();

  const selectedSkillSlugs = new Set((skillRows ?? []).map((s) => s.skill_slug));
  const adSets = (adSetRows as AdSetRow[] | null ?? []).map(mapAdSetRow);
  const images = (imageRows ?? []).map((img) => ({
    id: img.id,
    url: mediaPublicUrl(img.storage_path),
    altText: img.alt_text,
    storagePath: img.storage_path,
  }));

  return (
    <div className="max-w-3xl">
      <Link href="/admin/case-studies" className="font-body text-sm text-terracotta hover:underline">
        ← All case studies
      </Link>

      <div className="mt-2 flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold text-charcoal">{caseStudy.campaign_name}</h1>
        <span className="rounded-md bg-beige-border/50 px-2 py-1 font-mono text-xs text-warm-grey">{caseStudy.slug}</span>
      </div>
      <p className="mt-1 font-body text-xs text-warm-grey">
        Last verified {new Date(caseStudy.last_verified).toLocaleString("en-IN")} — bumps automatically on every save.
      </p>

      {/* Setup + targeting-adjacent fields + skills */}
      <form
        action={updateCaseStudySetup}
        className="mt-6 flex flex-col gap-4 rounded-2xl border border-beige-border bg-ivory p-6"
      >
        <input type="hidden" name="slug" value={caseStudy.slug} />
        <FieldGrid>
          <Field label="Campaign name" htmlFor="campaign_name">
            <TextInput id="campaign_name" name="campaign_name" required defaultValue={caseStudy.campaign_name} />
          </Field>
          <Field label="Project / property name" htmlFor="project_name">
            <TextInput id="project_name" name="project_name" required defaultValue={caseStudy.project_name} />
          </Field>
        </FieldGrid>

        <FieldGrid>
          <Field label="Objective" htmlFor="objective">
            <SelectInput id="objective" name="objective" defaultValue={caseStudy.objective}>
              <option value="Lead Gen">Lead Gen</option>
              <option value="Traffic">Traffic</option>
              <option value="Conversions">Conversions</option>
            </SelectInput>
          </Field>
          <Field label="Platform" htmlFor="platform">
            <SelectInput id="platform" name="platform" defaultValue={caseStudy.platform}>
              <option value="Meta">Meta</option>
              <option value="Google">Google</option>
            </SelectInput>
          </Field>
          <Field label="Budget type" htmlFor="budget_type">
            <SelectInput id="budget_type" name="budget_type" defaultValue={caseStudy.budget_type}>
              <option value="CBO">CBO</option>
              <option value="ABO">ABO</option>
            </SelectInput>
          </Field>
          <Field label="Special ad category (optional)" htmlFor="special_ad_category">
            <TextInput id="special_ad_category" name="special_ad_category" defaultValue={caseStudy.special_ad_category ?? ""} />
          </Field>
          <Field label="Date range" htmlFor="date_range">
            <TextInput id="date_range" name="date_range" required defaultValue={caseStudy.date_range} placeholder="Jan 2026 – Mar 2026" />
          </Field>
          <Field label="Status" htmlFor="status">
            <SelectInput id="status" name="status" defaultValue={caseStudy.status}>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </SelectInput>
          </Field>
          <Field label="Category" htmlFor="category">
            <SelectInput id="category" name="category" defaultValue={caseStudy.category}>
              <option value="standard">Standard</option>
              <option value="learning">Learning</option>
              <option value="dual-skill-fusion">Marketing × Engineering</option>
            </SelectInput>
          </Field>
          <Field label="Gallery placeholder count" htmlFor="gallery_placeholder_count" hint="Only shown when no real images are uploaded below.">
            <TextInput id="gallery_placeholder_count" name="gallery_placeholder_count" type="number" min={0} max={5} defaultValue={caseStudy.gallery_placeholder_count} />
          </Field>
        </FieldGrid>

        <Field
          label="Override result headline (optional)"
          htmlFor="override_result_headline"
          hint="For stories where the real headline isn't a raw ad metric (e.g. a learning or dual-skill case study)."
        >
          <TextInput id="override_result_headline" name="override_result_headline" defaultValue={caseStudy.override_result_headline ?? ""} />
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
                  defaultChecked={selectedSkillSlugs.has(skill.slug)}
                  className="h-4 w-4 accent-terracotta"
                />
                {skill.label}
              </label>
            ))}
          </div>
        </div>

        <Checkbox name="published" label="Published (visible on /marketing)" defaultChecked={caseStudy.published} />

        <div>
          <SubmitButton>Save Setup</SubmitButton>
        </div>
      </form>

      {/* Narrative */}
      <form
        action={updateCaseStudyNarrative}
        className="mt-8 flex flex-col gap-4 rounded-2xl border border-beige-border bg-ivory p-6"
      >
        <input type="hidden" name="slug" value={caseStudy.slug} />
        <h2 className="font-heading text-xl font-bold text-charcoal">Narrative</h2>
        {NARRATIVE_FIELDS.map((f) => (
          <Field key={f.key} label={f.label} htmlFor={f.key}>
            <TextArea
              id={f.key}
              name={f.key}
              rows={3}
              required
              defaultValue={String(caseStudy[f.key as keyof typeof caseStudy] ?? "")}
            />
          </Field>
        ))}
        <div>
          <SubmitButton>Save Narrative</SubmitButton>
        </div>
      </form>

      <div className="mt-10">
        <h2 className="font-heading text-xl font-bold text-charcoal">Ad Sets</h2>
        <div className="mt-4">
          <AdSetsManager caseStudySlug={caseStudy.slug} adSets={adSets} />
        </div>
      </div>

      <div className="mt-10">
        <CampaignDoctor
          slug={caseStudy.slug}
          isLive={caseStudy.status === "Active"}
          publishedInsight={
            caseStudy.ai_insight_published
              ? {
                  whatsWorking: caseStudy.ai_insight_whats_working,
                  likelyIssues: caseStudy.ai_insight_likely_issues,
                  recommendedAction: caseStudy.ai_insight_recommended_action,
                  timeframe: caseStudy.ai_insight_timeframe,
                  generatedAt: caseStudy.ai_insight_generated_at,
                }
              : null
          }
        />
      </div>

      <div className="mt-10">
        <h2 className="font-heading text-xl font-bold text-charcoal">Creatives Gallery</h2>
        <div className="mt-4">
          <GalleryManager caseStudySlug={caseStudy.slug} images={images} />
        </div>
      </div>

      <form action={deleteCaseStudy} className="mt-10 border-t border-beige-border pt-6">
        <input type="hidden" name="slug" value={caseStudy.slug} />
        <p className="mb-2 font-body text-sm text-warm-grey">
          Deleting a case study also deletes its ad sets, skills, and gallery images.
        </p>
        <SubmitButton variant="danger" pendingLabel="Deleting…">
          Delete Case Study
        </SubmitButton>
      </form>
    </div>
  );
}
