import type { Skill } from "@/lib/data/skills";

/**
 * Slow, CSS-only strip of the skills table, one pictogram per category (a
 * shared sprite, so each chip is a single <use>). The server renders the list
 * once; MotionRuntime clones it for the seamless loop after hydration, and
 * only then does it move. Pauses on hover and off-screen; reduced motion (or
 * no JS) keeps a static wrapped list. Empty table → nothing.
 */
export function SkillsStrip({ skills }: { skills: Skill[] }) {
  if (skills.length === 0) return null;
  return (
    <div className="mo-loop skills-strip overflow-hidden border-b border-beige-border/70 bg-cream py-6">
      <svg aria-hidden="true" className="hidden">
        <symbol id="sk-marketing" viewBox="0 0 20 20">
          <path d="M3 4h14l-5 6v5l-4 2v-7z" />
        </symbol>
        <symbol id="sk-development" viewBox="0 0 20 20">
          <path d="M7 6 3 10l4 4M13 6l4 4-4 4" />
        </symbol>
        <symbol id="sk-design" viewBox="0 0 20 20">
          <path d="M4 16l2-6 8-8 4 4-8 8zM6 10l4 4" />
        </symbol>
      </svg>
      <ul className="skills-track px-3 font-body">
        {skills.map((s) => (
          <li key={s.slug} className={`sk sk-${s.category}`}>
            <svg aria-hidden="true">
              <use href={`#sk-${s.category}`} />
            </svg>
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
