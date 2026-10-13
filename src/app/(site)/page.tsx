import { Hero } from "@/components/home/Hero";
import { CurrentlyWorkingOn } from "@/components/home/CurrentlyWorkingOn";
import { getSiteSettings } from "@/lib/data/site";

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <>
      <Hero
        heroCopy={{
          eyebrow: settings.heroEyebrow,
          heading: settings.heroHeading,
          subheading: settings.heroSubheading,
        }}
        visual={settings.heroVisual}
      />
      <CurrentlyWorkingOn />
    </>
  );
}
