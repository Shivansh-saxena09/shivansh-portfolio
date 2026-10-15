import type { Metadata } from "next";
import { getCaseStudies } from "@/lib/data/caseStudies";
import { MotionRuntimeLoader } from "@/components/motion/MotionRuntimeLoader";
import { Playfair_Display, Inter } from "next/font/google";
import "../globals.css";
import { getSiteSettings, getContactInfo, getPageMeta } from "@/lib/data/site";
import { pageMetadata, siteBaseUrl } from "@/lib/seo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { PersonOrganizationJsonLd } from "@/components/seo/JsonLd";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const [meta, settings] = await Promise.all([getPageMeta("home"), getSiteSettings()]);
  return {
    ...pageMetadata(meta, {
      // The default site title/tab title — used for home whenever no
      // "home" row exists in page_meta, and as the fallback for any
      // future route that doesn't set its own title. Built from
      // settings.personName + settings.heroEyebrow ("Performance
      // Marketing Manager") rather than a hardcoded string, so it stays
      // admin-editable and in sync with the hero section's own copy —
      // personTagline ("Performance Marketing Manager. Full-stack
      // builder.") reads fine as hero body copy but is too long and
      // sentence-punctuated for a concise, SEO-friendly <title>.
      title: `${settings.personName} — ${settings.heroEyebrow}`,
      description: settings.heroSubheading,
    }),
    metadataBase: new URL(siteBaseUrl(settings.personDomain)),
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, contact, caseStudies] = await Promise.all([getSiteSettings(), getContactInfo(), getCaseStudies()]);
  // Footer "last updated": the newest admin edit across existing timestamps (status line, résumé, case-study verification).
  const stamps = [settings.currentlyWorkingOnUpdatedAt, settings.resumeUpdatedAt, ...caseStudies.map((c) => c.lastVerified)].filter(Boolean).map((d) => new Date(d).getTime()).filter((t) => !Number.isNaN(t));
  const lastUpdated = stamps.length ? new Date(Math.max(...stamps)).toISOString() : null;

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Preloader plays once per session: mark repeat views before first
            paint so CSS hides it with no flash (see Preloader.tsx). */}
        <script dangerouslySetInnerHTML={{ __html: `try{sessionStorage.getItem("pl-seen")&&document.documentElement.classList.add("pl-seen")}catch(e){}` }} />
      </head>
      <body className="flex min-h-full flex-col bg-cream text-charcoal">
        <PersonOrganizationJsonLd settings={settings} contact={contact} />
        <Preloader personName={settings.personName} />
        <ScrollProgress />
        <SmoothScrollProvider>
          <Header settings={settings} contact={contact} />
          <main className="flex-1">{children}</main>
          <Footer
            personName={settings.personName}
            personTagline={settings.personTagline}
            location={settings.location}
            availability={settings.availability}
            footerCta={settings.footerCta}
            contact={contact}
            resumeUrl={settings.resumeUrl}
            resumeLabel={settings.heroVisual.linkLabels[3]}
            closing={{ line: settings.heroVisual.closingLine, lastUpdatedLabel: settings.heroVisual.lastUpdatedLabel, backToTopLabel: settings.heroVisual.backToTopLabel, lastUpdated }}
          />
        </SmoothScrollProvider>
        <MobileStickyCta whatsapp={contact.whatsapp} />
        <MotionRuntimeLoader />
      </body>
    </html>
  );
}
