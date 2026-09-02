import { getSiteSettings } from "@/lib/data/site";
import { getServices } from "@/lib/data/services";
import { createClient } from "@/lib/supabase/server";
import { Field, TextInput, TextArea, FieldGrid } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { updateSiteSettings, updatePageMeta } from "./actions";

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
