import type { Metadata } from "next";
import type { PageMeta } from "@/lib/data/site";

/**
 * Turns one admin-editable page_meta row into full Next.js Metadata —
 * title/description plus Open Graph and Twitter card, so the og_image_url
 * field editable in /admin/settings actually reaches rendered <head> tags
 * instead of being stored and never read (it wasn't, until this). Falls
 * back to the given defaults if the row doesn't exist yet.
 */
export function pageMetadata(meta: PageMeta | null, fallback: { title: string; description: string }): Metadata {
  const title = meta?.metaTitle ?? fallback.title;
  const description = meta?.metaDescription ?? fallback.description;
  const images = meta?.ogImageUrl ? [meta.ogImageUrl] : undefined;

  return {
    title,
    description,
    openGraph: { title, description, images, type: "website" },
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export function siteBaseUrl(domain: string): string {
  return `https://${domain}`;
}
