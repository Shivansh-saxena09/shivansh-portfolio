import type { Metadata } from "next";
import { FeaturedProject } from "@/components/engineering/FeaturedProject";
import { SkillsGrid } from "@/components/engineering/SkillsGrid";
import { ResumeButton } from "@/components/engineering/ResumeButton";

export const metadata: Metadata = {
  title: "Engineering — Shivansh Saxena",
  description:
    "Full-stack systems built to support performance marketing work: Next.js, React, and Supabase — the differentiator behind the campaigns.",
};

export default function EngineeringPage() {
  return (
    <>
      <section className="border-b border-beige-border/70 px-6 pt-20 pb-16 sm:px-10 sm:pt-28">
        <div className="mx-auto max-w-4xl">
          <p className="font-body text-sm font-medium uppercase tracking-[0.2em] text-sage-dark">
            Engineering
          </p>
          <h1 className="mt-6 font-heading text-4xl leading-tight text-charcoal sm:text-5xl">
            I also build the systems behind my campaigns.
          </h1>
          <p className="mt-6 max-w-2xl font-body text-lg leading-relaxed text-warm-grey">
            Full-stack development is a differentiator, not a separate career — I build the
            tracking, qualification, and reporting systems my marketing work runs on.
          </p>

          <div className="mt-8">
            <ResumeButton />
          </div>
        </div>
      </section>

      <FeaturedProject />
      <SkillsGrid />
    </>
  );
}
