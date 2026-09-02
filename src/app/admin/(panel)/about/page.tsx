import { getAboutContent, getQuickFacts, getEducation } from "@/lib/data/about";
import { Field, TextInput, TextArea, FieldGrid } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { QuickFactsManager } from "@/components/admin/QuickFactsManager";
import { EducationManager } from "@/components/admin/EducationManager";
import { updateAboutContent } from "./actions";

export default async function AdminAboutPage() {
  const [aboutContent, quickFacts, education] = await Promise.all([
    getAboutContent(),
    getQuickFacts(),
    getEducation(),
  ]);

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div>
        <h1 className="font-heading text-2xl font-bold text-charcoal">About Page</h1>
        <p className="mt-1 font-body text-sm text-warm-grey">Hero, vitals card, story, and pull-quote.</p>

        <form
          action={updateAboutContent}
          className="mt-6 flex flex-col gap-4 rounded-2xl border border-beige-border bg-ivory p-6"
        >
          <FieldGrid>
            <Field label="Hero eyebrow" htmlFor="hero_eyebrow">
              <TextInput id="hero_eyebrow" name="hero_eyebrow" required defaultValue={aboutContent.heroEyebrow} />
            </Field>
            <Field label="Hero accent word" htmlFor="hero_accent_word" hint="Rendered in italic terracotta at the end of the headline.">
              <TextInput id="hero_accent_word" name="hero_accent_word" required defaultValue={aboutContent.heroAccentWord} />
            </Field>
          </FieldGrid>
          <Field label="Hero headline" htmlFor="hero_headline" hint="The accent word above is appended after this.">
            <TextInput id="hero_headline" name="hero_headline" required defaultValue={aboutContent.heroHeadline} />
          </Field>

          <FieldGrid>
            <Field label="Vitals: current role" htmlFor="vitals_current_role">
              <TextInput id="vitals_current_role" name="vitals_current_role" required defaultValue={aboutContent.vitalsCurrentRole} />
            </Field>
            <Field label="Vitals: current org" htmlFor="vitals_current_org">
              <TextInput id="vitals_current_org" name="vitals_current_org" required defaultValue={aboutContent.vitalsCurrentOrg} />
            </Field>
            <Field label="Vitals: location" htmlFor="vitals_location">
              <TextInput id="vitals_location" name="vitals_location" required defaultValue={aboutContent.vitalsLocation} />
            </Field>
            <Field label="Vitals: education note" htmlFor="vitals_education_note">
              <TextInput id="vitals_education_note" name="vitals_education_note" required defaultValue={aboutContent.vitalsEducationNote} />
            </Field>
          </FieldGrid>

          <Field
            label="Story paragraphs"
            htmlFor="story_paragraphs"
            hint="Separate paragraphs with a blank line."
          >
            <TextArea
              id="story_paragraphs"
              name="story_paragraphs"
              rows={10}
              required
              defaultValue={aboutContent.storyParagraphs.join("\n\n")}
            />
          </Field>

          <Field label="Pull quote" htmlFor="story_pull_quote">
            <TextArea id="story_pull_quote" name="story_pull_quote" rows={2} required defaultValue={aboutContent.storyPullQuote} />
          </Field>

          <div>
            <SubmitButton>Save About Content</SubmitButton>
          </div>
        </form>
      </div>

      <div>
        <h2 className="font-heading text-xl font-bold text-charcoal">Quick Facts</h2>
        <p className="mt-1 font-body text-sm text-warm-grey">The three stat cards next to the pull-quote.</p>
        <div className="mt-6">
          <QuickFactsManager facts={quickFacts} />
        </div>
      </div>

      <div>
        <h2 className="font-heading text-xl font-bold text-charcoal">Education</h2>
        <div className="mt-6">
          <EducationManager entries={education} />
        </div>
      </div>
    </div>
  );
}
