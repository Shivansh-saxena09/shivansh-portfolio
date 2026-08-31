import { featuredProject } from "@/content/featuredProject";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";

export function FeaturedProject() {
  return (
    <section className="border-t border-beige-border/70 bg-ivory py-20">
      <Container>
        <span className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-sage-dark">
          Featured Project
        </span>

        <div className="mt-10 lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <h2 className="font-heading text-3xl text-charcoal sm:text-4xl">
              {featuredProject.name}
            </h2>
            <p className="mt-3 font-body text-lg text-warm-grey">{featuredProject.tagline}</p>
            <p className="mt-5 font-body text-base leading-relaxed text-charcoal">
              {featuredProject.description}
            </p>

            <div className="mt-12 grid gap-8 sm:grid-cols-3 lg:grid-cols-1">
              {featuredProject.challenges.map((challenge) => (
                <div
                  key={challenge.title}
                  className="rounded-xl border border-beige-border bg-cream px-5 py-5 shadow-[0_1px_3px_rgba(43,38,34,0.05)] lg:flex lg:gap-6"
                >
                  <h3 className="font-heading text-lg text-charcoal lg:w-56 lg:shrink-0">
                    {challenge.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-warm-grey lg:mt-0">
                    {challenge.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <aside className="mt-10 lg:col-span-5 lg:mt-0">
            <div className="glass-card paper-grain rounded-2xl px-7 py-8 shadow-lg lg:sticky lg:top-24">
              <span className="relative z-10 font-body text-xs font-semibold uppercase tracking-[0.15em] text-warm-grey">
                Stack
              </span>
              <div className="relative z-10 mt-4 flex flex-wrap gap-2">
                {featuredProject.stack.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>

              <a
                href={featuredProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-underline relative z-10 mt-6 inline-block font-body text-sm font-medium text-terracotta"
              >
                View on GitHub →
              </a>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
