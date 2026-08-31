/**
 * Placeholder-free — every fact here comes straight from CLAUDE.md's real
 * background section. Structured (not prose blobs) so this becomes the
 * admin's Experience/Timeline Manager later without a rewrite.
 */

export const aboutStory = {
  headline: "Marketing is the job. Building is the",
  accentWord: "edge.",
  paragraphs: [
    "I'm a Performance Marketing Manager at Divya Padma Infosystem LLP, running Meta Ads and Google Ads for real estate lead generation — the kind of work measured in cost per lead and qualification rate, not impressions.",
    "Full-stack development is what I bring on top of that: Next.js, React, and Supabase, used to build the tracking, qualification, and reporting systems my own campaigns run on. It's a differentiator I built because I got tired of waiting on someone else's dashboard — not a parallel career.",
    "I'm also a year into an MBA — Digital Marketing and Business Analytics & IT — on top of a B.Tech in Computer Science. One degree taught me to build; the other is formalizing the marketing and analytics instincts I already use every day.",
  ],
} as const;

export type TimelineEntry = {
  range: string;
  role: string;
  org: string;
  location?: string;
  description: string;
  current?: boolean;
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
  },
  {
    range: "Nov 2023 – Jan 2025",
    role: "Performance Marketer + Website Developer",
    org: "Dfractal Advisory",
    description:
      "A dual role spanning paid campaign management and building the websites and landing pages those campaigns pointed traffic to.",
  },
  {
    range: "Jun 2023 – Sep 2023",
    role: "Intern — Social Media Marketing & Website Development",
    org: "I View Academy",
    location: "New Delhi, Ashok Vihar Phase 2",
    description:
      "First professional role, split between social media marketing execution and website development — where the marketing/dev overlap started.",
  },
];

export type EducationEntry = {
  range: string;
  credential: string;
  detail: string;
};

export const education: EducationEntry[] = [
  {
    range: "2023",
    credential: "B.Tech, Computer Science",
    detail: "Abdul Kalam Technical University (AKTU), Lucknow",
  },
  {
    range: "Expected 2027",
    credential: "MBA — Digital Marketing + Business Analytics & IT",
    detail: "Pursuing, dual specialization — 1st year complete",
  },
];
