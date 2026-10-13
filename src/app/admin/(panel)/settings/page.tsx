import { getSiteSettings } from "@/lib/data/site";
import { getServices } from "@/lib/data/services";
import { createClient } from "@/lib/supabase/server";
import { Field, TextInput, TextArea, FieldGrid } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { updateSiteSettings, updatePageMeta, updateHeroVisual } from "./actions";

const PAGES = [
  { key: "home", label: "Home (/)" },
  { key: "marketing", label: "Marketing (/marketing)" },
  { key: "engineering", label: "Engineering (/engineering)" },
  { key: "about", label: "About (/about)" },
] as const;

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const [settings, services, { data: pageMetaRows }] = await Promise.all([
    getSiteSettings(),
    getServices(),
    supabase.from("page_meta").select("*"),
  ]);
  const hv = settings.heroVisual;
  const HERO_FIELD_GROUPS: { title: string; fields: [string, string, string][] }[] = [
    {
      title: "Marketing — funnel",
      fields: [
        ["campaign_label", "Campaign label", hv.campaignLabel],
        ["spend_label", "Ad spend label", hv.spendLabel],
        ...hv.stages.map((v, i): [string, string, string] => [`stage_${i}`, `Funnel stage ${i + 1}`, v]),
        ...hv.stageValues.map((v, i): [string, string, string] => [`stage_value_${i}`, `Stage ${i + 1} value`, v]),
        ["leads_value", "Leads (animated counter)", String(hv.leadsValue)],
        ...hv.metricChips.map((v, i): [string, string, string] => [`chip_${i}`, `Metric chip ${i + 1}`, v]),
      ],
    },
    {
      title: "Engineering — system layer",
      fields: [
        ...hv.systemNodes.map((v, i): [string, string, string] => [`node_${i}`, `System node ${i + 1}`, v]),
        ["feedback_label", "Conversion-signal loop label", hv.feedbackLabel],
      ],
    },
    {
      title: "AI — agent node + /engineering#ai section",
      fields: [
        ["ai_label", "AI node label", hv.aiLabel],
        ...hv.aiItems.map((v, i): [string, string, string] => [`ai_item_${i}`, `AI item ${i + 1}`, v]),
        ["ai_status", "AI status badge", hv.aiStatus],
        ["ai_section_heading", "AI section heading", hv.aiSectionHeading],
        ["ai_section_body", "AI section text", hv.aiSectionBody],
      ],
    },
    {
      title: "Resume, career & link labels",
      fields: [
        ["resume_label", "Resume document label", hv.resumeLabel],
        ["resume_meta", "Resume file note", hv.resumeMeta],
        ["career_label", "Career line label", hv.careerLabel],
        ...(["Marketing", "Engineering", "AI", "Resume"] as const).map(
          (k, i): [string, string, string] => [`link_label_${i}`, `${k} link label`, hv.linkLabels[i]],
        ),
      ],
    },
  ];
  const metaByKey = new Map((pageMetaRows ?? []).map((r) => [r.page_key, r]));

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div>
        <h1 className="font-heading text-2xl font-bold text-charcoal">Site Settings</h1>
        <p className="mt-1 font-body text-sm text-warm-grey">
          Identity, hero copy, and the &quot;Currently Working On&quot; status line.
        </p>

        <form
          action={updateSiteSettings}
          className="mt-6 flex flex-col gap-4 rounded-2xl border border-beige-border bg-ivory p-6"
        >
          <FieldGrid>
            <Field label="Name" htmlFor="person_name">
              <TextInput id="person_name" name="person_name" required defaultValue={settings.personName} />
            </Field>
            <Field label="Tagline" htmlFor="person_tagline">
              <TextInput id="person_tagline" name="person_tagline" required defaultValue={settings.personTagline} />
            </Field>
            <Field label="Company" htmlFor="person_company">
              <TextInput id="person_company" name="person_company" required defaultValue={settings.personCompany} />
            </Field>
            <Field label="Domain" htmlFor="person_domain">
              <TextInput id="person_domain" name="person_domain" required defaultValue={settings.personDomain} />
            </Field>
          </FieldGrid>

          <Field label="Hero eyebrow" htmlFor="hero_eyebrow">
            <TextInput id="hero_eyebrow" name="hero_eyebrow" required defaultValue={settings.heroEyebrow} />
          </Field>
          <Field label="Hero heading" htmlFor="hero_heading">
            <TextInput id="hero_heading" name="hero_heading" required defaultValue={settings.heroHeading} />
          </Field>
          <Field label="Hero subheading" htmlFor="hero_subheading">
            <TextArea id="hero_subheading" name="hero_subheading" rows={3} required defaultValue={settings.heroSubheading} />
          </Field>

          <Field
            label="Currently Working On"
            htmlFor="currently_working_on_text"
            hint={`Last updated ${new Date(settings.currentlyWorkingOnUpdatedAt).toLocaleDateString("en-IN")} — bumps automatically when this text changes.`}
          >
            <TextArea
              id="currently_working_on_text"
              name="currently_working_on_text"
              rows={2}
              required
              defaultValue={settings.currentlyWorkingOnText}
            />
          </Field>

          <FieldGrid>
            <Field label="Location" htmlFor="location">
              <TextInput id="location" name="location" required defaultValue={settings.location} />
            </Field>
            <Field label="Availability" htmlFor="availability">
              <TextInput id="availability" name="availability" required defaultValue={settings.availability} />
            </Field>
          </FieldGrid>

          <FieldGrid>
            <Field label="Footer CTA heading" htmlFor="footer_cta_heading">
              <TextInput id="footer_cta_heading" name="footer_cta_heading" required defaultValue={settings.footerCta.heading} />
            </Field>
            <Field label="Footer CTA button label" htmlFor="footer_cta_label">
              <TextInput id="footer_cta_label" name="footer_cta_label" required defaultValue={settings.footerCta.ctaLabel} />
            </Field>
          </FieldGrid>

          <div>
            <SubmitButton>Save Site Settings</SubmitButton>
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-heading text-xl font-bold text-charcoal">Hero Scene</h2>
        <p className="mt-1 font-body text-sm text-warm-grey">
          Every label, number and link label inside the homepage hero scene. Name, role (hero
          eyebrow) and the tagline line (hero heading) come from the fields above; career
          milestones come from the Experience timeline; the resume document uses the uploaded PDF.
        </p>

        <form
          action={updateHeroVisual}
          className="mt-6 flex flex-col gap-6 rounded-2xl border border-beige-border bg-ivory p-6"
        >
          {HERO_FIELD_GROUPS.map((group) => (
            <fieldset key={group.title} className="flex flex-col gap-3">
              <legend className="mb-1 font-body text-xs font-semibold tracking-[0.1em] text-terracotta uppercase">
                {group.title}
              </legend>
              <FieldGrid>
                {group.fields.map(([name, label, value]) => (
                  <Field key={name} label={label} htmlFor={name}>
                    {name === "ai_section_body" ? (
                      <TextArea id={name} name={name} rows={3} required defaultValue={value} />
                    ) : (
                      <TextInput
                        id={name}
                        name={name}
                        required
                        defaultValue={value}
                        {...(name === "leads_value" ? { type: "number", min: 0 } : {})}
                      />
                    )}
                  </Field>
                ))}
              </FieldGrid>
            </fieldset>
          ))}
          <div>
            <SubmitButton>Save Hero Scene</SubmitButton>
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-heading text-xl font-bold text-charcoal">SEO / Page Meta</h2>
        <p className="mt-1 font-body text-sm text-warm-grey">
          Meta title, description, and OG image per page.
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {PAGES.map((page) => {
            const meta = metaByKey.get(page.key);
            return (
              <form
                key={page.key}
                action={updatePageMeta}
                className="flex flex-col gap-3 rounded-2xl border border-beige-border bg-ivory p-6"
              >
                <input type="hidden" name="page_key" value={page.key} />
                <p className="font-body text-xs font-semibold tracking-[0.1em] text-terracotta uppercase">
                  {page.label}
                </p>
                <Field label="Meta title" htmlFor={`${page.key}_title`}>
                  <TextInput
                    id={`${page.key}_title`}
                    name="meta_title"
                    required
                    defaultValue={meta?.meta_title ?? ""}
                  />
                </Field>
                <Field label="Meta description" htmlFor={`${page.key}_desc`}>
                  <TextArea
                    id={`${page.key}_desc`}
                    name="meta_description"
                    rows={2}
                    required
                    defaultValue={meta?.meta_description ?? ""}
                  />
                </Field>
                <Field label="OG image URL" htmlFor={`${page.key}_og`} hint="Optional — leave blank to use no OG image.">
                  <TextInput id={`${page.key}_og`} name="og_image_url" defaultValue={meta?.og_image_url ?? ""} />
                </Field>
                <div>
                  <SubmitButton>Save</SubmitButton>
                </div>
              </form>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="font-heading text-xl font-bold text-charcoal">Services</h2>
        <p className="mt-1 font-body text-sm text-warm-grey">Shown in the Services section on /marketing.</p>
        <div className="mt-6">
          <ServicesManager services={services} />
        </div>
      </div>
    </div>
  );
}
