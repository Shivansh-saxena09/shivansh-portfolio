import { Hero } from "@/components/home/Hero";
import { CurrentlyWorkingOn } from "@/components/home/CurrentlyWorkingOn";
import { getSiteSettings } from "@/lib/data/site";
import { getExperienceTimeline } from "@/lib/data/about";

export default async function Home() {
  const [settings, timeline] = await Promise.all([getSiteSettings(), getExperienceTimeline()]);
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
      />
      <CurrentlyWorkingOn />
    </>
  );
}
