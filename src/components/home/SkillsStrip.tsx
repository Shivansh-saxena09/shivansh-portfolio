import type { Skill, SkillCategory } from "@/lib/data/skills";

const ICON: Record<SkillCategory, React.ReactNode> = {
  marketing: <path d="M3 4h14l-5 6v5l-4 2v-7z" />,
  development: <path d="M7 6 3 10l4 4M13 6l4 4-4 4" />,
  design: <path d="M4 16l2-6 8-8 4 4-8 8zM6 10l4 4" />,
};

/**
 * Slow, CSS-only strip of the skills table (one pictogram per category).
 * Pauses on hover and while off-screen (MotionRuntime sets data-run);
 * reduced motion shows a static wrapped list. Empty table → nothing.
 */
export function SkillsStrip({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null;
  const row = (dup: boolean) =>
    skills.map((s) => (
      <li key={`${dup ? "d" : "o"}-${s.slug}`} aria-hidden={dup || undefined} className="flex shrink-0 items-center gap-2 rounded-full border border-beige-border bg-ivory px-4 py-2 font-body text-sm text-charcoal">
        <svg viewBox="0 0 20 20" aria-hidden="true" className={`h-4 w-4 fill-none ${s.category === "marketing" ? "stroke-terracotta" : "stroke-sage-dark"}`} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          {ICON[s.category]}
        </svg>
        {s.label}
      </li>
    ));
  return (
    <div className="mo-loop skills-strip overflow-hidden border-b border-beige-border/70 bg-cream py-6">
      <ul className="skills-track flex w-max gap-3 px-3">
        {row(false)}
        {row(true)}
      </ul>
    </div>
  );
}
