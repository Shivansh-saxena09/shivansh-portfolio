import { Hero } from "@/components/home/Hero";
import { CurrentlyWorkingOn } from "@/components/home/CurrentlyWorkingOn";
import { getSiteSettings } from "@/lib/data/site";
import { getEducation, getExperienceTimeline } from "@/lib/data/about";

export default async function Home() {
  const [settings, timeline, edu] = await Promise.all([getSiteSettings(), getExperienceTimeline(), getEducation()]);
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
      <CurrentlyWorkingOn />
    </>
  );
}
