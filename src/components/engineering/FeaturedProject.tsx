import { featuredProject } from "@/content/featuredProject";
import { Tag } from "@/components/ui/Tag";

export function FeaturedProject() {
  return (
    <section className="border-t border-beige-border/70 bg-ivory px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-sage-dark">
          Featured Project
        </span>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="font-heading text-3xl text-charcoal sm:text-4xl">
            {featuredProject.name}
          </h2>
          <a
            href={featuredProject.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="nav-underline w-fit font-body text-sm text-terracotta"
          >
            View on GitHub →
          </a>
        </div>

        <p className="mt-3 font-body text-lg text-warm-grey">{featuredProject.tagline}</p>
        <p className="mt-5 max-w-3xl font-body text-base leading-relaxed text-charcoal">
          {featuredProject.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {featuredProject.stack.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {featuredProject.challenges.map((challenge) => (
            <div key={challenge.title} className="border-l-2 border-sage pl-5">
              <h3 className="font-heading text-lg text-charcoal">{challenge.title}</h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-warm-grey">
                {challenge.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
