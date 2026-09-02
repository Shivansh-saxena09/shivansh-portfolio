import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProject, getAllProjectSlugs } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/site";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";

const arrowRight = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="mx-auto h-5 w-5 shrink-0 rotate-90 text-terracotta sm:mx-0 sm:rotate-0"
  >
    <path d="M5 12h14m0 0-5-5m5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Static generation — mirrors /case-study/[slug]: every project page is
// prerendered at build time.
export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/project/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [project, settings] = await Promise.all([getProject(slug), getSiteSettings()]);
  if (!project) return {};
  return {
    title: `${project.name} — ${settings.personName}`,
    description: project.tagline,
  };
}

export default async function ProjectPage({ params }: PageProps<"/project/[slug]">) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return (
    <article className="py-16 sm:py-24">
      <Container>
        <Link href="/engineering" className="nav-underline font-body text-sm text-sage-dark">
          ← All engineering work
        </Link>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <span className="font-body text-xs font-semibold tracking-[0.15em] text-sage-dark uppercase">
            {project.status}
          </span>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-beige-border px-5 py-2.5 font-body text-sm font-medium text-charcoal transition-colors hover:border-sage hover:text-sage-dark"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.48 2 2 6.58 2 12.21c0 4.51 2.87 8.33 6.84 9.68.5.1.68-.22.68-.49 0-.24-.01-1.04-.01-1.89-2.78.61-3.37-1.21-3.37-1.21-.46-1.18-1.11-1.5-1.11-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.1 2.91.84.09-.66.35-1.1.63-1.36-2.22-.26-4.56-1.14-4.56-5.05 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 2.5-.35c.85 0 1.71.12 2.5.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.71 1.03 1.62 1.03 2.74 0 3.92-2.34 4.78-4.57 5.04.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.21C22 6.58 17.52 2 12 2z"
              />
            </svg>
            View on GitHub
          </a>
        </div>

        <h1 className="mt-4 font-heading text-4xl font-bold leading-tight text-charcoal sm:text-5xl lg:text-6xl">
          {project.name}
        </h1>
        <p className="mt-4 max-w-2xl font-body text-lg text-warm-grey">{project.tagline}</p>
        <p className="mt-6 max-w-3xl font-body text-base leading-relaxed text-charcoal">
          {project.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>

        {/* How it works — plain HTML/CSS boxes+arrows, no diagramming
            library needed for a 4-step pipeline. */}
        <div className="mt-14">
          <h2 className="font-heading text-2xl font-bold text-charcoal">How It Works</h2>
          <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            {project.flow.flatMap((step, i) => {
              const box = (
                <div
                  key={step.label}
                  className="flex-1 rounded-xl border border-beige-border bg-ivory px-5 py-4 text-center sm:text-left"
                >
                  <p className="font-heading text-base font-bold text-charcoal">{step.label}</p>
                  <p className="mt-1 font-body text-xs text-warm-grey">{step.detail}</p>
                </div>
              );
              if (i === project.flow.length - 1) return [box];
              return [box, <span key={`${step.label}-arrow`}>{arrowRight}</span>];
            })}
          </div>
        </div>

        {/* Challenges — problem/fix split plus the real code that
            illustrates each fix. */}
        <div className="mt-14">
          <h2 className="font-heading text-2xl font-bold text-charcoal">
            Technical Challenges
          </h2>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {project.challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="flex min-w-0 flex-col rounded-2xl border border-beige-border bg-ivory p-6 shadow-[0_1px_3px_rgba(43,38,34,0.05)]"
              >
                <h3 className="font-heading text-lg text-charcoal">{challenge.title}</h3>

                <div className="mt-4 flex flex-col gap-3">
                  <div>
                    <span className="font-body text-xs font-semibold tracking-[0.1em] text-terracotta uppercase">
                      Problem
                    </span>
                    <p className="mt-1 font-body text-sm leading-relaxed text-warm-grey">
                      {challenge.problem}
                    </p>
                  </div>
                  <div>
                    <span className="font-body text-xs font-semibold tracking-[0.1em] text-sage-dark uppercase">
                      Fix
                    </span>
                    <p className="mt-1 font-body text-sm leading-relaxed text-charcoal">
                      {challenge.fix}
                    </p>
                  </div>
                </div>

                <div className="mt-5 overflow-x-auto rounded-lg bg-cream px-4 py-3">
                  <code className="font-mono text-xs leading-relaxed whitespace-pre text-charcoal">
                    {challenge.snippet.code}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </article>
  );
}
