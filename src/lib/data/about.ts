import { cache } from "react";
import { createClient } from "@/lib/supabase/public";
import { getSkillsMap, type Skill } from "@/lib/data/skills";

export type AboutContent = {
  heroEyebrow: string;
  heroHeadline: string;
  heroAccentWord: string;
  vitalsCurrentRole: string;
  vitalsCurrentOrg: string;
  vitalsLocation: string;
  vitalsEducationNote: string;
  storyParagraphs: string[];
  storyPullQuote: string;
};

export const getAboutContent = cache(async function getAboutContent(): Promise<AboutContent> {
  const supabase = createClient();
  const { data, error } = await supabase.from("about_content").select("*").eq("id", 1).single();
  if (error) throw error;

  return {
    heroEyebrow: data.hero_eyebrow,
    heroHeadline: data.hero_headline,
    heroAccentWord: data.hero_accent_word,
    vitalsCurrentRole: data.vitals_current_role,
    vitalsCurrentOrg: data.vitals_current_org,
    vitalsLocation: data.vitals_location,
    vitalsEducationNote: data.vitals_education_note,
    storyParagraphs: data.story_paragraphs ?? [],
    storyPullQuote: data.story_pull_quote,
  };
});

export type QuickFact = { id: string; value: string; label: string };

export const getQuickFacts = cache(async function getQuickFacts(): Promise<QuickFact[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("about_quick_facts")
    .select("id, value, label")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as QuickFact[];
});

export type EducationEntry = {
  id: string;
  range: string;
  credential: string;
  detail: string;
  accent: "terracotta" | "sage";
};

export const getEducation = cache(async function getEducation(): Promise<EducationEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("education")
    .select("id, range, credential, detail, accent")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as EducationEntry[];
});

export type TimelineChallengeOption = { id: string; label: string; correct: boolean };

export type TimelineIconName = "trending" | "layers" | "sprout";

export type TimelineChallenge = {
  emoji: string;
  question: string;
  options: TimelineChallengeOption[];
  correctExplanation: string;
  incorrectExplanation: string;
};

export type TimelineEntry = {
  id: string;
  range: string;
  role: string;
  org: string;
  location?: string | null;
  description: string;
  current: boolean;
  skills: Skill[];
  icon: TimelineIconName;
  challenge: TimelineChallenge;
};

type TimelineRow = {
  id: string;
  range: string;
  role: string;
  org: string;
  location: string | null;
  description: string;
  current: boolean;
  icon: string;
  challenge_emoji: string;
  challenge_question: string;
  challenge_correct_explanation: string;
  challenge_incorrect_explanation: string;
  experience_timeline_skills: { skill_slug: string }[];
  experience_timeline_challenge_options: { id: string; label: string; is_correct: boolean; sort_order: number }[];
};

export const getExperienceTimeline = cache(async function getExperienceTimeline(): Promise<
  TimelineEntry[]
> {
  const supabase = createClient();
  const [{ data, error }, skillsMap] = await Promise.all([
    supabase
      .from("experience_timeline")
      .select(
        `id, range, role, org, location, description, current, icon,
         challenge_emoji, challenge_question, challenge_correct_explanation, challenge_incorrect_explanation,
         experience_timeline_skills ( skill_slug ),
         experience_timeline_challenge_options ( id, label, is_correct, sort_order )`,
      )
      .order("sort_order", { ascending: true }),
    getSkillsMap(),
  ]);
  if (error) throw error;
  const rows = data as unknown as TimelineRow[];

  return rows.map((row) => ({
    id: row.id,
    range: row.range,
    role: row.role,
    org: row.org,
    location: row.location,
    description: row.description,
    current: row.current,
    icon: row.icon as TimelineIconName,
    skills: row.experience_timeline_skills.map((s) => skillsMap[s.skill_slug]).filter(Boolean),
    challenge: {
      emoji: row.challenge_emoji,
      question: row.challenge_question,
      correctExplanation: row.challenge_correct_explanation,
      incorrectExplanation: row.challenge_incorrect_explanation,
      options: [...row.experience_timeline_challenge_options]
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((o) => ({ id: o.id, label: o.label, correct: o.is_correct })),
    },
  }));
});
