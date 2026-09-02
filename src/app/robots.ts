import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/data/site";
import { siteBaseUrl } from "@/lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings();
  const base = siteBaseUrl(settings.personDomain);

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
    sitemap: `${base}/sitemap.xml`,
  };
}
