import { skills, type SkillCategory } from "@/content/skills";
import { Tag } from "@/components/ui/Tag";

const categoryOrder: SkillCategory[] = ["marketing", "development", "design"];
const categoryLabel: Record<SkillCategory, string> = {
  marketing: "Marketing",
  development: "Development",
  design: "Design",
};

/** Tag-based skills grid; each tag links to /marketing filtered to that skill. */
export function SkillsGrid() {
  return (
    <section className="border-t border-beige-border/70 bg-cream px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="font-heading text-3xl text-charcoal sm:text-4xl">Skills</h2>
        <p className="mt-3 max-w-2xl font-body text-sm text-warm-grey">
          Click a skill to see the case studies where I used it.
        </p>

        <div className="mt-10 flex flex-col gap-8">
          {categoryOrder.map((category) => (
            <div key={category}>
              <h3 className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-warm-grey">
                {categoryLabel[category]}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
                    <Tag key={skill.slug} href={`/marketing?skill=${skill.slug}`}>
                      {skill.label}
                    </Tag>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
