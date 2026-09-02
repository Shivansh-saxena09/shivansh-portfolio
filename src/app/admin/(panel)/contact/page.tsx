import { getContactInfo } from "@/lib/data/site";
import { Field, TextInput, FieldGrid } from "@/components/admin/fields";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { updateContactInfo } from "./actions";

export default async function AdminContactPage() {
  const contact = await getContactInfo();

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Contact Info</h1>
      <p className="mt-1 font-body text-sm text-warm-grey">
        Single source of truth — reflected in the header, footer, and every contact link sitewide.
      </p>

      <form action={updateContactInfo} className="mt-6 flex flex-col gap-4 rounded-2xl border border-beige-border bg-ivory p-6">
        <FieldGrid>
          <Field label="Email" htmlFor="email">
            <TextInput id="email" name="email" type="email" required defaultValue={contact.email} />
          </Field>
          <Field label="WhatsApp link" htmlFor="whatsapp" hint="Full wa.me URL, e.g. https://wa.me/91XXXXXXXXXX">
            <TextInput id="whatsapp" name="whatsapp" type="url" required defaultValue={contact.whatsapp} />
          </Field>
          <Field label="LinkedIn" htmlFor="linkedin">
            <TextInput id="linkedin" name="linkedin" type="url" required defaultValue={contact.linkedin} />
          </Field>
          <Field label="GitHub" htmlFor="github">
            <TextInput id="github" name="github" type="url" required defaultValue={contact.github} />
          </Field>
        </FieldGrid>

        <div>
          <SubmitButton>Save Contact Info</SubmitButton>
        </div>
      </form>
    </div>
  );
}
