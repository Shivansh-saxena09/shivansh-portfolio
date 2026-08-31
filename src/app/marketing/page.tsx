import type { Metadata } from "next";
import { caseStudiesBySkill } from "@/content/caseStudies";
import { skillLabel } from "@/content/skills";
import { CaseStudyCard } from "@/components/marketing/CaseStudyCard";
import { ServicesSection } from "@/components/marketing/ServicesSection";
import { ContactCTA } from "@/components/marketing/ContactCTA";
import { Tag } from "@/components/ui/Tag";

export const metadata: Metadata = {
  title: "Marketing Work — Shivansh Saxena",
  description:
    "Meta Ads and Google Ads campaign case studies with real, structured performance data — lead generation for real estate.",
};

export default async function MarketingPage({
  searchParams,
}: PageProps<"/marketing">) {
  const { skill } = await searchParams;
  const activeSkill = typeof skill === "string" ? skill : undefined;
  const filtered = caseStudiesBySkill(activeSkill);

  return (
    <>
      <section className="border-b border-beige-border/70 px-6 pt-20 pb-16 sm:px-10 sm:pt-28">
        <div className="mx-auto max-w-4xl">
          <p className="font-body text-sm font-medium uppercase tracking-[0.2em] text-terracotta">
            Marketing Work
          </p>
          <h1 className="mt-6 font-heading text-4xl leading-tight text-charcoal sm:text-5xl">
            Campaign case studies, built from real numbers.
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-warm-grey">
            Every case study below is pulled from structured campaign data — targeting,
            spend, results, and what I&apos;d do differently — not rewritten after the fact.
          </p>

          {activeSkill && (
            <div className="mt-8 flex items-center gap-3">
              <span className="font-body text-sm text-warm-grey">Filtered by:</span>
              <Tag active>{skillLabel(activeSkill)}</Tag>
              <a href="/marketing" className="nav-underline font-body text-sm text-terracotta">
                Clear filter
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="px-6 py-16 sm:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2">
          {filtered.length > 0 ? (
            filtered.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} />
            ))
          ) : (
            <p className="font-body text-warm-grey">No case studies tagged with this skill yet.</p>
          )}
        </div>
      </section>

      <ServicesSection />
      <ContactCTA />
    </>
  );
}
