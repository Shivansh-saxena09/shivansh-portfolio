import type { NarrativeFields } from "@/lib/data/caseStudies";
import { highlightStats } from "@/lib/highlightStats";
import {
  ObjectiveIcon,
  StrategyIcon,
  ChallengeIcon,
  DecisionIcon,
  OutcomeIcon,
  LessonIcon,
} from "./StoryIcons";

const CHAPTERS = [
  { key: "objective", label: "The Objective", Icon: ObjectiveIcon },
  { key: "strategy", label: "The Strategy", Icon: StrategyIcon },
  { key: "challenge", label: "The Challenge", Icon: ChallengeIcon },
  { key: "decision", label: "The Decision", Icon: DecisionIcon },
  { key: "outcome", label: "The Outcome", Icon: OutcomeIcon },
  { key: "whatIdDoDifferently", label: "What I'd Do Differently", Icon: LessonIcon },
] as const;

/**
 * The six narrative fields, presented as one connected sequence rather
 * than six identical stacked <h2>/<p> pairs — the exact "wall of text /
 * no rhythm" complaint this redesign is fixing. Echoes the /about
 * Timeline's connecting-spine treatment (a deliberate callback: both
 * components are "a sequence of things that happened," just at
 * different time scales), so a returning visitor recognizes the pattern
 * rather than learning a new one.
 */
export function StoryChapters({ narrative }: { narrative: NarrativeFields }) {
  return (
    <div className="relative flex flex-col gap-8">
      <div
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-5 w-px bg-gradient-to-b from-terracotta/40 via-beige-border to-sage/40"
      />
      {CHAPTERS.map(({ key, label, Icon }) => (
        <div key={key} className="relative flex gap-5">
          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta/10 text-terracotta ring-4 ring-cream">
            <Icon className="h-5 w-5" />
          </span>
          <div className="flex-1 pt-1.5">
            <h3 className="font-heading text-lg font-bold text-charcoal">{label}</h3>
            <p className="mt-1.5 font-body text-base leading-relaxed text-warm-grey">
              {highlightStats(narrative[key], key)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
