import { Hero } from "@/components/home/Hero";
import { CurrentlyWorkingOn } from "@/components/home/CurrentlyWorkingOn";
import { getSiteSettings } from "@/lib/data/site";
import { getEducation, getExperienceTimeline } from "@/lib/data/about";
import { getCaseStudies } from "@/lib/data/caseStudies";
import { getSkills } from "@/lib/data/skills";
import { aggregate, formatINR, formatNumber } from "@/lib/caseStudyNarrative";
import { ProofStrip } from "@/components/home/ProofStrip";
import { SkillsStrip } from "@/components/home/SkillsStrip";

export default async function Home() {
  const [settings, timeline, edu, caseStudies, skills] = await Promise.all([getSiteSettings(), getExperienceTimeline(), getEducation(), getCaseStudies(), getSkills()]);
  // Proof strip: real totals across every published case study; anything without data is dropped.
  const t = aggregate(caseStudies.flatMap((c) => c.adSets));
  const pl = settings.heroVisual.proofLabels;
  const proof = [
    { label: pl[0], value: t.leads, text: formatNumber(t.leads) },
    { label: pl[1], value: t.impressions, text: formatNumber(t.impressions) },
    { label: pl[2], value: t.leads > 0 ? t.amountSpent / t.leads : 0, text: t.leads > 0 ? formatINR(t.amountSpent / t.leads) : "" },
  ].filter((p) => p.value > 0 && p.label);
  // Phone story: oldest → newest credential, year = last 4-digit year in the range.
  const education = edu
    .map((e) => ({ year: e.range.match(/\d{4}(?!.*\d{4})/)?.[0] ?? e.range, credential: e.credential }))
    .sort((a, b) => a.year.localeCompare(b.year));
  // Timeline is stored newest-first; the scene's career axis runs oldest → now.
  const milestones = [...timeline].reverse().map((t) => ({
    date: t.range.split("–")[0].trim(),
    org: t.org,
    current: t.current,
  }));

  return (
    <>
      <Hero
        identity={{ name: settings.personName, role: settings.heroEyebrow, tagline: settings.heroHeading }}
        visual={settings.heroVisual}
        milestones={milestones}
        resumeUrl={settings.resumeUrl}
        education={education}
        place={{ location: settings.location, availability: settings.availability }}
      />
      <ProofStrip items={proof} />
      <SkillsStrip skills={skills} />
      <CurrentlyWorkingOn />
    </>
  );
}
