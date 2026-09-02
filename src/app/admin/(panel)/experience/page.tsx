import { getExperienceTimeline } from "@/lib/data/about";
import { getSkills } from "@/lib/data/skills";
import { TimelineManager } from "@/components/admin/TimelineManager";

export default async function AdminExperiencePage() {
  const [entries, allSkills] = await Promise.all([getExperienceTimeline(), getSkills()]);

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Experience</h1>
      <p className="mt-1 font-body text-sm text-warm-grey">
        Work history on /about, newest first by default — drag to reorder. Each entry&apos;s Quick Take
        challenge supports exactly two options.
      </p>

      <div className="mt-6">
        <TimelineManager entries={entries} allSkills={allSkills} />
      </div>
    </div>
  );
}
