import type { SiteSettings, ContactInfo } from "@/lib/data/site";
import type { CaseStudyDetail } from "@/lib/data/caseStudies";
import { siteBaseUrl } from "@/lib/seo";

/**
 * Renders one <script type="application/ld+json"> tag. JSON.stringify
 * output can't collide with the closing </script> tag here — none of
 * these objects ever contain a literal "</script>" substring — so no
 * escaping beyond what JSON.stringify already does is needed.
 */
function JsonLdScript({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Site-wide Person + Organization schema (CLAUDE.md → SEO/AEO/GEO),
 * rendered once in the root layout so every page carries it. Built
 * entirely from site_settings/contact_info — editing those in
 * /admin/settings or /admin/contact updates this automatically.
 */
export function PersonOrganizationJsonLd({
  settings,
  contact,
}: {
  settings: SiteSettings;
  contact: ContactInfo;
}) {
  const base = siteBaseUrl(settings.personDomain);
  const sameAs = [contact.linkedin, contact.github].filter(Boolean);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${base}/#person`,
        name: settings.personName,
        jobTitle: settings.heroEyebrow,
        description: settings.personTagline,
        url: base,
        email: `mailto:${contact.email}`,
        ...(sameAs.length > 0 ? { sameAs } : {}),
        worksFor: { "@id": `${base}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${base}/#organization`,
        name: settings.personCompany,
      },
    ],
  };

  return <JsonLdScript data={data} />;
}

/**
 * CreativeWork schema for one case study, rendered on its detail page.
 * Built from the case study's own fields, so publishing/editing a case
 * study in /admin/case-studies updates this without any code change.
 */
export function CaseStudyJsonLd({
  caseStudy,
  settings,
}: {
  caseStudy: CaseStudyDetail;
  settings: SiteSettings;
}) {
  const base = siteBaseUrl(settings.personDomain);
  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: caseStudy.campaignName,
    description: caseStudy.narrative.objective,
    url: `${base}/case-study/${caseStudy.slug}`,
    dateModified: caseStudy.lastVerified,
    author: { "@id": `${base}/#person` },
    ...(caseStudy.skills.length > 0
      ? { keywords: caseStudy.skills.map((s) => s.label).join(", ") }
      : {}),
  };

  return <JsonLdScript data={data} />;
}
