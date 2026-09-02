import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "../globals.css";
import { getSiteSettings, getContactInfo, getPageMeta } from "@/lib/data/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";

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
  const meta = await getPageMeta("home");
  if (meta) return { title: meta.metaTitle, description: meta.metaDescription };

  const settings = await getSiteSettings();
  return {
    title: `${settings.personName} — ${settings.personTagline}`,
    description: settings.heroSubheading,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, contact] = await Promise.all([getSiteSettings(), getContactInfo()]);

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream text-charcoal">
        <Preloader personName={settings.personName} />
        <ScrollProgress />
        <SmoothScrollProvider>
          <Header personName={settings.personName} contact={contact} />
          <main className="flex-1">{children}</main>
          <Footer
            personName={settings.personName}
            personTagline={settings.personTagline}
            location={settings.location}
            availability={settings.availability}
            footerCta={settings.footerCta}
            contact={contact}
          />
        </SmoothScrollProvider>
        <MobileStickyCta whatsapp={contact.whatsapp} />
      </body>
    </html>
  );
}
