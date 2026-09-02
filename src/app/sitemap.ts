import type { MetadataRoute } from "next";
import { getSiteSettings } from "@/lib/data/site";
import { getCaseStudies } from "@/lib/data/caseStudies";
import { getProjects } from "@/lib/data/projects";
import { siteBaseUrl } from "@/lib/seo";

// Lives at the app root (not inside the (site) route group) since
// sitemap.ts is a special file Next.js only recognizes there — it isn't
// a route itself, just a convention that generates /sitemap.xml.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, caseStudies, projects] = await Promise.all([
    getSiteSettings(),
    getCaseStudies(),
    getProjects(),
  ]);
  const base = siteBaseUrl(settings.personDomain);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/marketing`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/engineering`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const caseStudyRoutes: MetadataRoute.Sitemap = caseStudies.map((cs) => ({
    url: `${base}/case-study/${cs.slug}`,
    lastModified: new Date(cs.lastVerified),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/project/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...caseStudyRoutes, ...projectRoutes];
}
