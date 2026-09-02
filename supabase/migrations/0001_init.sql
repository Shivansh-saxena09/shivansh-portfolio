-- ============================================================================
-- Shivansh Saxena portfolio — initial schema
-- Mirrors every content module under src/content/*.ts, per CLAUDE.md's
-- admin panel + case-study data model spec. Run this once in the Supabase
-- SQL Editor (Dashboard → SQL Editor → New query → paste → Run).
--
-- Design notes:
--   - Primary keys are natural slugs (case_studies, projects, skills) where
--     the app already keys content that way; child/list tables use a uuid.
--   - RLS: every table is public-readable (published rows only, where a
--     table has a publish flag); writes require an authenticated session.
--     Since this project has exactly one admin account with no public
--     sign-up flow, "authenticated" and "the admin" are equivalent.
--   - `sort_order` on every list table backs the admin's drag-and-drop
--     reorder requirement.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Trigger helpers
-- ----------------------------------------------------------------------------

-- case_studies.last_verified: CLAUDE.md wants this badge to auto-update
-- whenever the admin edits the entry — i.e. on every UPDATE, not something
-- the admin fills in by hand.
create or replace function public.touch_last_verified()
returns trigger language plpgsql as $$
begin
  new.last_verified = now();
  return new;
end;
$$;

-- site_settings: two fields carry their own "updated at" — only bump each
-- one when its own value actually changes, not on every settings edit.
create or replace function public.touch_currently_working_on()
returns trigger language plpgsql as $$
begin
  if new.currently_working_on_text is distinct from old.currently_working_on_text then
    new.currently_working_on_updated_at = now();
  end if;
  return new;
end;
$$;

create or replace function public.touch_resume_updated_at()
returns trigger language plpgsql as $$
begin
  if new.resume_url is distinct from old.resume_url then
    new.resume_updated_at = now();
  end if;
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- Singletons: site_settings, contact_info, about_content
-- ----------------------------------------------------------------------------

create table public.site_settings (
  id int primary key default 1 check (id = 1),
  person_name text not null,
  person_tagline text not null,
  person_company text not null,
  person_domain text not null,
  hero_eyebrow text not null,
  hero_heading text not null,
  hero_subheading text not null,
  currently_working_on_text text not null,
  currently_working_on_updated_at timestamptz not null default now(),
  location text not null,
  availability text not null,
  footer_cta_heading text not null,
  footer_cta_label text not null,
  resume_url text not null default '',
  resume_updated_at timestamptz not null default now()
);

create trigger site_settings_touch_working_on
before update on public.site_settings
for each row execute function public.touch_currently_working_on();

create trigger site_settings_touch_resume
before update on public.site_settings
for each row execute function public.touch_resume_updated_at();

create table public.contact_info (
  id int primary key default 1 check (id = 1),
  email text not null,
  whatsapp text not null,
  linkedin text not null,
  github text not null
);

create table public.about_content (
  id int primary key default 1 check (id = 1),
  hero_eyebrow text not null,
  hero_headline text not null,
  hero_accent_word text not null,
  vitals_current_role text not null,
  vitals_current_org text not null,
  vitals_location text not null,
  vitals_education_note text not null,
  story_paragraphs text[] not null default '{}',
  story_pull_quote text not null
);

create table public.about_quick_facts (
  id uuid primary key default gen_random_uuid(),
  value text not null,
  label text not null,
  sort_order int not null default 0
);

-- Per-page SEO/OG metadata (home, marketing, engineering, about — case
-- studies and projects generate their own from their own rows).
create table public.page_meta (
  page_key text primary key,
  meta_title text not null,
  meta_description text not null,
  og_image_url text
);

-- ----------------------------------------------------------------------------
-- Skills
-- ----------------------------------------------------------------------------

create table public.skills (
  slug text primary key,
  label text not null,
  category text not null check (category in ('marketing', 'development', 'design')),
  sort_order int not null default 0
);

-- ----------------------------------------------------------------------------
-- Education
-- ----------------------------------------------------------------------------

create table public.education (
  id uuid primary key default gen_random_uuid(),
  range text not null,
  credential text not null,
  detail text not null,
  accent text not null check (accent in ('terracotta', 'sage')),
  sort_order int not null default 0
);

-- ----------------------------------------------------------------------------
-- Experience timeline (+ per-entry "Quick Take" challenge)
-- ----------------------------------------------------------------------------

create table public.experience_timeline (
  id uuid primary key default gen_random_uuid(),
  range text not null,
  role text not null,
  org text not null,
  location text,
  description text not null,
  current boolean not null default false,
  icon text not null check (icon in ('trending', 'layers', 'sprout')),
  sort_order int not null default 0,
  challenge_emoji text not null,
  challenge_question text not null,
  challenge_correct_explanation text not null,
  challenge_incorrect_explanation text not null
);

create table public.experience_timeline_skills (
  timeline_id uuid not null references public.experience_timeline(id) on delete cascade,
  skill_slug text not null references public.skills(slug) on delete cascade,
  primary key (timeline_id, skill_slug)
);

create table public.experience_timeline_challenge_options (
  id uuid primary key default gen_random_uuid(),
  timeline_id uuid not null references public.experience_timeline(id) on delete cascade,
  label text not null,
  is_correct boolean not null default false,
  sort_order int not null default 0
);

-- ----------------------------------------------------------------------------
-- Engineering projects (+ flow steps, technical challenges)
-- ----------------------------------------------------------------------------

create table public.projects (
  slug text primary key,
  name text not null,
  tagline text not null,
  description text not null,
  github_url text not null,
  stack text[] not null default '{}',
  status text not null check (status in ('Active', 'Completed', 'Archived')) default 'Active',
  featured boolean not null default false,
  sort_order int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.project_flow_steps (
  id uuid primary key default gen_random_uuid(),
  project_slug text not null references public.projects(slug) on delete cascade,
  label text not null,
  detail text not null,
  sort_order int not null default 0
);

create table public.project_challenges (
  id uuid primary key default gen_random_uuid(),
  project_slug text not null references public.projects(slug) on delete cascade,
  title text not null,
  problem text not null,
  fix text not null,
  snippet_filename text not null,
  snippet_code text not null,
  sort_order int not null default 0
);

-- ----------------------------------------------------------------------------
-- Case studies (+ skills join, ad sets, creative gallery)
-- ----------------------------------------------------------------------------

create table public.case_studies (
  slug text primary key,
  campaign_name text not null,
  project_name text not null,
  objective text not null check (objective in ('Lead Gen', 'Traffic', 'Conversions')),
  platform text not null check (platform in ('Meta', 'Google')),
  budget_type text not null check (budget_type in ('CBO', 'ABO')),
  special_ad_category text,
  date_range text not null,
  status text not null check (status in ('Active', 'Paused', 'Completed')),
  category text not null check (category in ('standard', 'learning', 'dual-skill-fusion')) default 'standard',
  last_verified timestamptz not null default now(),
  gallery_placeholder_count int not null default 0,
  override_result_headline text,
  sort_order int not null default 0,
  published boolean not null default false,
  narrative_objective text not null default '',
  narrative_strategy text not null default '',
  narrative_challenge text not null default '',
  narrative_decision text not null default '',
  narrative_outcome text not null default '',
  narrative_what_id_do_differently text not null default '',
  created_at timestamptz not null default now()
);

create trigger case_studies_touch_last_verified
before update on public.case_studies
for each row execute function public.touch_last_verified();

create table public.case_study_skills (
  case_study_slug text not null references public.case_studies(slug) on delete cascade,
  skill_slug text not null references public.skills(slug) on delete cascade,
  primary key (case_study_slug, skill_slug)
);

create table public.ad_sets (
  id uuid primary key default gen_random_uuid(),
  case_study_slug text not null references public.case_studies(slug) on delete cascade,
  name text not null,
  sort_order int not null default 0,
  -- targeting
  targeting_locations text not null,
  targeting_age_gender text not null,
  targeting_interests text,
  targeting_placements text not null,
  targeting_audience_size_estimate text,
  targeting_audience_type text not null
    check (targeting_audience_type in ('Broad', 'Interest-based', 'Lookalike', 'Custom', 'Retargeting')),
  -- awareness / reach
  metrics_impressions bigint not null default 0,
  metrics_reach bigint not null default 0,
  metrics_frequency numeric(6, 2) not null default 0,
  metrics_cpm numeric(10, 2) not null default 0,
  -- engagement
  metrics_link_clicks bigint not null default 0,
  metrics_all_clicks bigint not null default 0,
  -- conversion / result
  metrics_leads bigint not null default 0,
  metrics_amount_spent numeric(12, 2) not null default 0,
  -- business outcome (all optional)
  outcome_qualified_leads int,
  outcome_site_visits int,
  outcome_bookings int,
  outcome_cac numeric(12, 2),
  outcome_roas numeric(6, 2)
);

create table public.case_study_images (
  id uuid primary key default gen_random_uuid(),
  case_study_slug text not null references public.case_studies(slug) on delete cascade,
  storage_path text not null,
  alt_text text,
  sort_order int not null default 0
);

-- ----------------------------------------------------------------------------
-- Storage — one public bucket for resume + case-study creatives
-- ----------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- ============================================================================
-- Row Level Security
-- ============================================================================

alter table public.site_settings enable row level security;
alter table public.contact_info enable row level security;
alter table public.about_content enable row level security;
alter table public.about_quick_facts enable row level security;
alter table public.page_meta enable row level security;
alter table public.skills enable row level security;
alter table public.education enable row level security;
alter table public.experience_timeline enable row level security;
alter table public.experience_timeline_skills enable row level security;
alter table public.experience_timeline_challenge_options enable row level security;
alter table public.projects enable row level security;
alter table public.project_flow_steps enable row level security;
alter table public.project_challenges enable row level security;
alter table public.case_studies enable row level security;
alter table public.case_study_skills enable row level security;
alter table public.ad_sets enable row level security;
alter table public.case_study_images enable row level security;

-- Always-public tables (no independent publish state — either basic site
-- info, or a detail row of a parent that owns the publish flag itself but
-- is safe to read directly since none of this is sensitive).
create policy "public_read" on public.site_settings for select using (true);
create policy "public_read" on public.contact_info for select using (true);
create policy "public_read" on public.about_content for select using (true);
create policy "public_read" on public.about_quick_facts for select using (true);
create policy "public_read" on public.page_meta for select using (true);
create policy "public_read" on public.skills for select using (true);
create policy "public_read" on public.education for select using (true);
create policy "public_read" on public.experience_timeline for select using (true);
create policy "public_read" on public.experience_timeline_skills for select using (true);
create policy "public_read" on public.experience_timeline_challenge_options for select using (true);

-- Tables with their own draft/published flag.
create policy "public_read_published" on public.projects
  for select using (published = true or auth.uid() is not null);

create policy "public_read_published" on public.case_studies
  for select using (published = true or auth.uid() is not null);

-- Child tables of a published-gated parent — readable only if the parent
-- is published (or the caller is authenticated), so a direct query can't
-- bypass the parent's draft state.
create policy "public_read_via_project" on public.project_flow_steps
  for select using (
    exists (
      select 1 from public.projects p
      where p.slug = project_flow_steps.project_slug
        and (p.published = true or auth.uid() is not null)
    )
  );

create policy "public_read_via_project" on public.project_challenges
  for select using (
    exists (
      select 1 from public.projects p
      where p.slug = project_challenges.project_slug
        and (p.published = true or auth.uid() is not null)
    )
  );

create policy "public_read_via_case_study" on public.case_study_skills
  for select using (
    exists (
      select 1 from public.case_studies cs
      where cs.slug = case_study_skills.case_study_slug
        and (cs.published = true or auth.uid() is not null)
    )
  );

create policy "public_read_via_case_study" on public.ad_sets
  for select using (
    exists (
      select 1 from public.case_studies cs
      where cs.slug = ad_sets.case_study_slug
        and (cs.published = true or auth.uid() is not null)
    )
  );

create policy "public_read_via_case_study" on public.case_study_images
  for select using (
    exists (
      select 1 from public.case_studies cs
      where cs.slug = case_study_images.case_study_slug
        and (cs.published = true or auth.uid() is not null)
    )
  );

-- Writes: authenticated only, on every table (single-admin site — no
-- public sign-up route exists, so "authenticated" means "the admin").
create policy "admin_write" on public.site_settings for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.contact_info for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.about_content for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.about_quick_facts for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.page_meta for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.skills for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.education for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.experience_timeline for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.experience_timeline_skills for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.experience_timeline_challenge_options for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.projects for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.project_flow_steps for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.project_challenges for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.case_studies for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.case_study_skills for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.ad_sets for all using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "admin_write" on public.case_study_images for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- Storage: public read of the media bucket, admin-only write.
create policy "media_public_read" on storage.objects
  for select using (bucket_id = 'media');

create policy "media_admin_write" on storage.objects
  for all using (bucket_id = 'media' and auth.uid() is not null)
  with check (bucket_id = 'media' and auth.uid() is not null);
