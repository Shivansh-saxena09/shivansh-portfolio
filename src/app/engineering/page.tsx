import type { Metadata } from "next";
import { FeaturedProject } from "@/components/engineering/FeaturedProject";
import { SkillsGrid } from "@/components/engineering/SkillsGrid";
import { CodeCard } from "@/components/engineering/CodeCard";
import { ResumeButton } from "@/components/ui/ResumeButton";
import { Container } from "@/components/ui/Container";

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
                <ResumeButton />
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

      <FeaturedProject />
      <SkillsGrid />
    </>
  );
}
