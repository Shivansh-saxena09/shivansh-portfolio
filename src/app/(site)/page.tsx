import { Hero } from "@/components/home/Hero";
import { CurrentlyWorkingOn } from "@/components/home/CurrentlyWorkingOn";
import { getSiteSettings } from "@/lib/data/site";
import { getSkills } from "@/lib/data/skills";

export default async function Home() {
  const [settings, skills] = await Promise.all([getSiteSettings(), getSkills()]);
  const focusSkills = skills.filter((s) => s.category === "marketing").slice(0, 4);

  return (
    <>
      <Hero
        heroCopy={{
          eyebrow: settings.heroEyebrow,
          heading: settings.heroHeading,
          subheading: settings.heroSubheading,
        }}
        focusSkills={focusSkills}
      />
      <CurrentlyWorkingOn />
    </>
  );
}
