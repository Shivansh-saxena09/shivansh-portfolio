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

export type TimelineChallengeOption = {
  id: string;
  label: string;
  correct: boolean;
};

/**
 * A one-question, pick-an-answer performance-marketing scenario tied to
 * this specific role — real concepts (CAPI/attribution, CPL vs CPC,
 * organic vs. paid reach), not trivia. Renders as an interactive mini
 * challenge in the space opposite this entry's card at desktop width,
 * folded inline on mobile/tablet. See src/components/about/Timeline.tsx
 * and TimelineChallenge.tsx. Shaped so this becomes an admin-editable
 * `timeline_challenges` table later — a question + options array + two
 * fixed explanation strings, nothing baked into component logic.
 */
export type TimelineChallenge = {
  emoji: string;
  question: string;
  options: TimelineChallengeOption[];
  correctExplanation: string;
  incorrectExplanation: string;
};

export type TimelineEntry = {
  range: string;
  role: string;
  org: string;
  location?: string;
  description: string;
  current?: boolean;
  skills: string[];
  challenge: TimelineChallenge;
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
    challenge: {
      emoji: "📉",
      question:
        "Your Meta Ads dashboard suddenly shows 30% fewer conversions overnight — same spend, same creative. Most likely cause?",
      options: [
        { id: "fatigue", label: "The audience is fatigued", correct: false },
        { id: "tracking", label: "iOS privacy settings broke pixel tracking", correct: true },
      ],
      correctExplanation:
        "Exactly — this is why server-side Conversions API exists: it keeps reporting conversions even when the browser blocks the pixel.",
      incorrectExplanation:
        "Fatigue shows up gradually as rising CPM and falling CTR. A sudden, broad drop like this usually means tracking broke, not the creative.",
    },
  },
  {
    range: "Nov 2023 – Jan 2025",
    role: "Performance Marketer + Website Developer",
    org: "Dfractal Advisory",
    description:
      "A dual role spanning paid campaign management and building the websites and landing pages those campaigns pointed traffic to.",
    skills: ["lead-generation", "web-dev"],
    challenge: {
      emoji: "💰",
      question:
        "Ad Set A has a lower cost-per-click. Ad Set B has a higher cost-per-click but a lower cost-per-lead. Which gets more budget?",
      options: [
        { id: "a", label: "Ad Set A — cheaper clicks", correct: false },
        { id: "b", label: "Ad Set B — cheaper leads", correct: true },
      ],
      correctExplanation:
        "Right — CPC is a vanity metric here. Cost-per-lead is what actually pays the bills, and B wins on that.",
      incorrectExplanation:
        "Cheap clicks that don't convert are still expensive leads. Cost-per-lead is the number that matters, and B wins on that.",
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
    challenge: {
      emoji: "📣",
      question:
        "You post the exact same content organically, then boost it with ₹500. Which number is guaranteed to go up?",
      options: [
        { id: "reach", label: "Reach", correct: true },
        { id: "engagement", label: "Engagement rate", correct: false },
      ],
      correctExplanation:
        "Reach is what money buys directly — more people see it. That part's guaranteed.",
      incorrectExplanation:
        "Boosting definitely grows reach, but engagement rate isn't guaranteed — showing the post to less-interested people can dilute it.",
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
