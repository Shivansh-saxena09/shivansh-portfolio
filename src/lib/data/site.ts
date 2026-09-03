import { cache } from "react";
import { createClient } from "@/lib/supabase/public";

export type SiteSettings = {
  personName: string;
  personTagline: string;
  personCompany: string;
  personDomain: string;
  heroEyebrow: string;
  heroHeading: string;
  heroSubheading: string;
  currentlyWorkingOnText: string;
  currentlyWorkingOnUpdatedAt: string;
  location: string;
  availability: string;
  footerCta: { heading: string; ctaLabel: string };
  resumeUrl: string;
  resumeUpdatedAt: string;
};

export type ContactInfo = {
  email: string;
  whatsapp: string;
  linkedin: string;
  github: string;
};

// `nav` used to live here, but this file also exports Supabase-backed
// server functions, and the Client Components that need `nav` (Header/
// Footer/MobileNav) are mounted on every page — see lib/data/nav.ts for
// why it moved to its own module.

export const getSiteSettings = cache(async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = createClient();
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (error) throw error;

  return {
    personName: data.person_name,
    personTagline: data.person_tagline,
    personCompany: data.person_company,
    personDomain: data.person_domain,
    heroEyebrow: data.hero_eyebrow,
    heroHeading: data.hero_heading,
    heroSubheading: data.hero_subheading,
    currentlyWorkingOnText: data.currently_working_on_text,
    currentlyWorkingOnUpdatedAt: data.currently_working_on_updated_at,
    location: data.location,
    availability: data.availability,
    footerCta: { heading: data.footer_cta_heading, ctaLabel: data.footer_cta_label },
    resumeUrl: data.resume_url,
    resumeUpdatedAt: data.resume_updated_at,
  };
});

export const getContactInfo = cache(async function getContactInfo(): Promise<ContactInfo> {
  const supabase = createClient();
  const { data, error } = await supabase.from("contact_info").select("*").eq("id", 1).single();
  if (error) throw error;

  return {
    email: data.email,
    whatsapp: data.whatsapp,
    linkedin: data.linkedin,
    github: data.github,
  };
});

export type PageMeta = {
  metaTitle: string;
  metaDescription: string;
  ogImageUrl: string | null;
};

export const getPageMeta = cache(async function getPageMeta(pageKey: string): Promise<PageMeta | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("page_meta")
    .select("*")
    .eq("page_key", pageKey)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return {
    metaTitle: data.meta_title,
    metaDescription: data.meta_description,
    ogImageUrl: data.og_image_url,
  };
});
