import { getSkills } from "@/lib/data/skills";
import { SkillsManager } from "@/components/admin/SkillsManager";

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <div className="max-w-3xl">
      <h1 className="font-heading text-2xl font-bold text-charcoal">Skills</h1>
      <p className="mt-1 font-body text-sm text-warm-grey">
        Used on /engineering&apos;s skills grid, and as tags across case studies and the experience timeline.
        Deleting a skill removes it from anywhere it was tagged.
      </p>

      <div className="mt-6">
        <SkillsManager skills={skills} />
      </div>
    </div>
  );
}
