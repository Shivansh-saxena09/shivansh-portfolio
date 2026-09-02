import type { Metadata } from "next";
import { ProjectPreviewCard } from "@/components/engineering/ProjectPreviewCard";
import { SkillsGrid } from "@/components/engineering/SkillsGrid";
import { CodeCard } from "@/components/engineering/CodeCard";
import { ResumeButton } from "@/components/ui/ResumeButton";
import { Container } from "@/components/ui/Container";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Engineering — Shivansh Saxena",
  description:
    "Full-stack systems built to support performance marketing work: Next.js, React, and Supabase — the differentiator behind the campaigns.",
};

export default function EngineeringPage() {
  return (
    <>
      {/* Hero — the same two-column + floating-card motif as the homepage
          and /about, with a page-specific twist: a rotating code card
          instead of skill chips or a vitals card, since this page's
          audience is developers/recruiters who want to see real code
          before anything else. */}
      <section className="paper-grain relative overflow-hidden border-b border-beige-border/70 pt-16 pb-20 sm:pt-24 sm:pb-24 lg:pb-28">
        <Container className="relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="lg:col-span-7">
              <p className="font-body text-sm font-medium tracking-[0.2em] text-sage-dark uppercase">
                Engineering
              </p>
              <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-charcoal sm:text-5xl lg:text-6xl">
                I also build the <em className="text-sage-dark italic">systems</em> behind my
                campaigns.
              </h1>
              <p className="mt-6 max-w-xl font-body text-lg leading-relaxed text-warm-grey">
                Full-stack development is a differentiator, not a separate career — I build the
                tracking, qualification, and reporting systems my marketing work runs on.
              </p>

              <div className="mt-8">
                <ResumeButton className="w-full sm:w-auto" />
              </div>
            </div>

            <div className="relative mt-14 lg:col-span-5 lg:mt-0">
              <div
                aria-hidden="true"
                className="absolute -top-10 -right-6 h-56 w-56 rounded-full bg-sage/25 blur-3xl sm:h-72 sm:w-72"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-8 left-6 h-40 w-40 rounded-full bg-terracotta/20 blur-3xl"
              />
              <div className="relative -rotate-1">
                <CodeCard />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured project — a preview card linking to its own full detail
          page (/project/[slug]), matching the case-study pattern rather
          than dumping the whole breakdown inline here. */}
      <section className="border-t border-beige-border/70 bg-ivory py-20 sm:py-24">
        <Container>
          <span className="font-body text-xs font-semibold tracking-[0.15em] text-sage-dark uppercase">
            Featured Project
          </span>
          <h2 className="mt-4 max-w-2xl font-heading text-3xl font-bold text-charcoal sm:text-4xl">
            The system behind the campaigns.
          </h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectPreviewCard key={project.slug} project={project} />
            ))}
          </div>
        </Container>
      </section>

      <SkillsGrid />
    </>
  );
}
