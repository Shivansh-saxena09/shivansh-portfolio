import { getSkills, type SkillCategory } from "@/lib/data/skills";
import { Tag } from "@/components/ui/Tag";
import { Container } from "@/components/ui/Container";

const categoryOrder: SkillCategory[] = ["marketing", "development", "design"];
const categoryLabel: Record<SkillCategory, string> = {
  marketing: "Marketing",
  development: "Development",
  design: "Design",
};
// Marketing = terracotta, Development = sage — the same split already
// established on /marketing and /engineering elsewhere; Design gets a
// neutral charcoal bar rather than inventing a third brand color.
const categoryAccent: Record<SkillCategory, string> = {
  marketing: "bg-terracotta",
  development: "bg-sage",
  design: "bg-charcoal",
};

/** Tag-based skills grid, one card per category; each tag links to /marketing filtered to that skill. */
export async function SkillsGrid() {
  const skills = await getSkills();

  return (
    <section className="border-t border-beige-border/70 bg-cream py-20 sm:py-24">
      <Container>
        <h2 className="font-heading text-3xl font-bold text-charcoal sm:text-4xl">Skills</h2>
        <p className="mt-3 max-w-2xl font-body text-sm text-warm-grey">
          Click a skill to see the case studies where I used it.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {categoryOrder.map((category) => (
            <div
              key={category}
              className="rounded-2xl border border-beige-border bg-ivory p-7 shadow-[0_1px_3px_rgba(43,38,34,0.05)]"
            >
              <div className={`h-1 w-10 rounded-full ${categoryAccent[category]}`} />
              <h3 className="mt-5 font-heading text-lg font-bold text-charcoal">
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
      </Container>
    </section>
  );
}
