/**
 * Placeholder-free — every fact here comes straight from CLAUDE.md's real
 * background section (or is directly derivable from it, e.g. role counts).
 * Structured (not prose blobs) so this becomes the admin's Experience/
 * Timeline Manager later without a rewrite.
 */

export const aboutHero = {
  eyebrow: "About",
  headline: "Marketing is the job. Building is the",
  accentWord: "edge.",
} as const;

/** Quick-facts card in the hero — a snapshot, not the full story. */
export const vitals = {
  currentRole: "Performance Marketing Manager",
  currentOrg: "Divya Padma Infosystem LLP",
  location: "Based in India · open to remote work",
  educationNote: "MBA in progress — Digital Marketing + Business Analytics & IT",
} as const;

export const aboutStory = {
  paragraphs: [
    "I'm a Performance Marketing Manager at Divya Padma Infosystem LLP, running Meta Ads and Google Ads for real estate lead generation — the kind of work measured in cost per lead and qualification rate, not impressions.",
    "Full-stack development is what I bring on top of that: Next.js, React, and Supabase, used to build the tracking, qualification, and reporting systems my own campaigns run on. It's a differentiator I built because I got tired of waiting on someone else's dashboard — not a parallel career.",
    "I'm also a year into an MBA — Digital Marketing and Business Analytics & IT — on top of a B.Tech in Computer Science. One degree taught me to build; the other is formalizing the marketing and analytics instincts I already use every day.",
  ],
  pullQuote: "I got tired of waiting on someone else's dashboard.",
} as const;

/** Small, real, derivable numbers — not fabricated metrics. */
export const quickFacts = [
  { value: "3", label: "Roles since 2023" },
  { value: "2", label: "Degrees pursued" },
  { value: "2", label: "Ad platforms — Meta & Google" },
] as const;

export type TimelineEntry = {
  range: string;
  role: string;
  org: string;
  location?: string;
  description: string;
  current?: boolean;
  skills: string[];
  /**
   * A real marketing concept tied to what this specific role actually
   * involved — not a generic glossary. Drives the scroll-synced "Marketing
   * Concept" panel in the timeline's center gutter (desktop) and an inline
   * card per entry (mobile/tablet). See src/components/about/Timeline.tsx.
   */
  concept: { term: string; definition: string };
};

// Newest first — leads with the current role, per the marketing-first,
// lead-with-current-expertise framing.
export const experienceTimeline: TimelineEntry[] = [
  {
    range: "Mar 2025 – Present",
    role: "Performance Marketing Manager",
    org: "Divya Padma Infosystem LLP",
    description:
      "Meta and Google Ads campaign strategy and budget allocation for real estate lead generation, plus the Conversions API setup behind reporting that survives iOS attribution loss.",
    current: true,
    skills: ["meta-ads", "google-ads", "conversions-api"],
    concept: {
      term: "CAPI",
      definition:
        "Conversions API — server-side event tracking that reports conversions even when a browser blocks the pixel or a user declines tracking. The fix for iOS-era attribution loss.",
    },
  },
  {
    range: "Nov 2023 – Jan 2025",
    role: "Performance Marketer + Website Developer",
    org: "Dfractal Advisory",
    description:
      "A dual role spanning paid campaign management and building the websites and landing pages those campaigns pointed traffic to.",
    skills: ["lead-generation", "web-dev"],
    concept: {
      term: "CPL",
      definition:
        "Cost Per Lead — what you pay, on average, for one lead. The core efficiency metric in performance marketing, more useful on its own than CPC or CPM.",
    },
  },
  {
    range: "Jun 2023 – Sep 2023",
    role: "Intern — Social Media Marketing & Website Development",
    org: "I View Academy",
    location: "New Delhi, Ashok Vihar Phase 2",
    description:
      "First professional role, split between social media marketing execution and website development — where the marketing/dev overlap started.",
    skills: ["web-dev"],
    concept: {
      term: "Organic vs. Paid",
      definition:
        "Organic reach is who sees your content for free; paid reach is what you buy on top of it. Most real strategies deliberately blend both, not just the one with a budget.",
    },
  },
];

export type EducationEntry = {
  range: string;
  credential: string;
  detail: string;
  accent: "terracotta" | "sage";
};

export const education: EducationEntry[] = [
  {
    range: "2023",
    credential: "B.Tech, Computer Science",
    detail: "Abdul Kalam Technical University (AKTU), Lucknow",
    accent: "sage",
  },
  {
    range: "Expected 2027",
    credential: "MBA — Digital Marketing + Business Analytics & IT",
    detail: "Pursuing, dual specialization — 1st year complete",
    accent: "terracotta",
  },
];
