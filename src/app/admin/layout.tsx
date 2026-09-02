import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Inter } from "next/font/google";
import "../globals.css";

// /admin is its own root layout (Next.js "multiple root layouts" pattern —
// see src/app/(site)/layout.tsx for the counterpart). It deliberately does
// NOT render the public site's Preloader/Header/Footer/SmoothScrollProvider
// — those are marketing-site chrome that has no place around an internal
// tool, and rendering them here was a real bug (the admin login page was
// briefly showing the public preloader animation) caught via a console/
// hydration check, not a visual glance.
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// The entire /admin tree is private tooling — never indexed, and never
// linked to from the public site.
export const metadata: Metadata = {
  title: "Admin — Shivansh Saxena",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-cream text-charcoal">{children}</body>
    </html>
  );
}
