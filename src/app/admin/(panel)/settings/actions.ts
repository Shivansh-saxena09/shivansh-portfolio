"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Every mutation below touches content rendered inside (site)/layout.tsx
// (Header/Footer show personName/contact sitewide) or a specific public
// page — revalidating the whole layout tree is simpler than tracking each
// page individually and costs nothing extra for a site this size.
function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function updateSiteSettings(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      person_name: String(formData.get("person_name")),
      person_tagline: String(formData.get("person_tagline")),
      person_company: String(formData.get("person_company")),
      person_domain: String(formData.get("person_domain")),
      hero_eyebrow: String(formData.get("hero_eyebrow")),
      hero_heading: String(formData.get("hero_heading")),
      hero_subheading: String(formData.get("hero_subheading")),
      currently_working_on_text: String(formData.get("currently_working_on_text")),
      location: String(formData.get("location")),
      availability: String(formData.get("availability")),
      footer_cta_heading: String(formData.get("footer_cta_heading")),
      footer_cta_label: String(formData.get("footer_cta_label")),
    })
    .eq("id", 1);
  if (error) throw error;
  revalidateSite();
}

export async function updatePageMeta(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const pageKey = String(formData.get("page_key"));
  const { error } = await supabase
    .from("page_meta")
    .update({
      meta_title: String(formData.get("meta_title")),
      meta_description: String(formData.get("meta_description")),
      og_image_url: String(formData.get("og_image_url") ?? "") || null,
    })
    .eq("page_key", pageKey);
  if (error) throw error;
  revalidateSite();
}

export async function createService(): Promise<void> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("services")
    .select("id", { count: "exact", head: true });
  const { error } = await supabase.from("services").insert({
    title: "New service",
    description: "",
    sort_order: count ?? 0,
  });
  if (error) throw error;
  revalidateSite();
}

export async function updateService(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase
    .from("services")
    .update({
      title: String(formData.get("title")),
      description: String(formData.get("description")),
    })
    .eq("id", id);
  if (error) throw error;
  revalidateSite();
}

export async function deleteService(formData: FormData): Promise<void> {
  const supabase = await createClient();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
  revalidateSite();
}

export async function reorderServices(orderedIds: string[]): Promise<void> {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("services").update({ sort_order: index }).eq("id", id),
    ),
  );
  revalidateSite();
}
