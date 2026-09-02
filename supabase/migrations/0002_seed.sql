-- ============================================================================
-- Seed data — migrated verbatim from src/content/*.ts (the pre-Supabase
-- placeholder content), so the live site keeps rendering exactly what it
-- does today, now served from the database. Run after 0001_init.sql.
-- ============================================================================

-- New table not in 0001_init.sql: the /marketing Services section is a
-- content module too (src/content/services.ts) — added here rather than
-- in the original schema file since it surfaced during the seed pass.
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  sort_order int not null default 0
);
alter table public.services enable row level security;
create policy "public_read" on public.services for select using (true);
create policy "admin_write" on public.services for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- site_settings ------------------------------------------------------------
insert into public.site_settings (
  id, person_name, person_tagline, person_company, person_domain,
  hero_eyebrow, hero_heading, hero_subheading,
  currently_working_on_text, location, availability,
  footer_cta_heading, footer_cta_label, resume_url
) values (
  1, 'Shivansh Saxena', 'Performance Marketing Manager. Full-stack builder.', 'Divya Padma Infosystem LLP', 'shivanshdigital.com',
  'Performance Marketing Manager', 'I turn ad spend into pipeline.', 'Meta Ads, Google Ads, and Conversions API campaigns for real estate lead generation — backed by the full-stack systems I build to track, qualify, and report on every lead.',
  'Rebuilding lead-qualification tracking with server-side Conversions API for a new campaign launch.', 'Greater Noida, India', 'Open to remote work',
  'Have a campaign that needs to perform?', 'Message on WhatsApp', '/resume-placeholder.pdf'
)
on conflict (id) do update set
  person_name = excluded.person_name, person_tagline = excluded.person_tagline,
  person_company = excluded.person_company, person_domain = excluded.person_domain,
  hero_eyebrow = excluded.hero_eyebrow, hero_heading = excluded.hero_heading,
  hero_subheading = excluded.hero_subheading,
  currently_working_on_text = excluded.currently_working_on_text,
  location = excluded.location, availability = excluded.availability,
  footer_cta_heading = excluded.footer_cta_heading, footer_cta_label = excluded.footer_cta_label,
  resume_url = excluded.resume_url;

-- contact_info ---------------------------------------------------------------
insert into public.contact_info (id, email, whatsapp, linkedin, github)
values (1, 'hello@shivanshdigital.com', 'https://wa.me/910000000000', 'https://linkedin.com/in/shivansh-saxena', 'https://github.com/Shivansh-saxena09')
on conflict (id) do update set
  email = excluded.email, whatsapp = excluded.whatsapp, linkedin = excluded.linkedin, github = excluded.github;

-- about_content ------------------------------------------------------------
insert into public.about_content (
  id, hero_eyebrow, hero_headline, hero_accent_word,
  vitals_current_role, vitals_current_org, vitals_location, vitals_education_note,
  story_paragraphs, story_pull_quote
) values (
  1, 'About', 'Marketing is the job. Building is the', 'edge.',
  'Performance Marketing Manager', 'Divya Padma Infosystem LLP', 'Based in India · open to remote work', 'MBA in progress — Digital Marketing + Business Analytics & IT',
  ARRAY['I''m a Performance Marketing Manager at Divya Padma Infosystem LLP, running Meta Ads and Google Ads for real estate lead generation — the kind of work measured in cost per lead and qualification rate, not impressions.', 'Full-stack development is what I bring on top of that: Next.js, React, and Supabase, used to build the tracking, qualification, and reporting systems my own campaigns run on. It''s a differentiator I built because I got tired of waiting on someone else''s dashboard — not a parallel career.', 'I''m also a year into an MBA — Digital Marketing and Business Analytics & IT — on top of a B.Tech in Computer Science. One degree taught me to build; the other is formalizing the marketing and analytics instincts I already use every day.']::text[], 'I got tired of waiting on someone else''s dashboard.'
)
on conflict (id) do update set
  hero_eyebrow = excluded.hero_eyebrow, hero_headline = excluded.hero_headline,
  hero_accent_word = excluded.hero_accent_word, vitals_current_role = excluded.vitals_current_role,
  vitals_current_org = excluded.vitals_current_org, vitals_location = excluded.vitals_location,
  vitals_education_note = excluded.vitals_education_note, story_paragraphs = excluded.story_paragraphs,
  story_pull_quote = excluded.story_pull_quote;

-- about_quick_facts ----------------------------------------------------------
delete from public.about_quick_facts;
insert into public.about_quick_facts (value, label, sort_order) values ('3', 'Roles since 2023', 0);
insert into public.about_quick_facts (value, label, sort_order) values ('2', 'Degrees pursued', 1);
insert into public.about_quick_facts (value, label, sort_order) values ('2', 'Ad platforms — Meta & Google', 2);

-- page_meta --------------------------------------------------------------
insert into public.page_meta (page_key, meta_title, meta_description) values ('home', 'Shivansh Saxena — Performance Marketing Manager. Full-stack builder.', 'Meta Ads, Google Ads, and Conversions API campaigns for real estate lead generation — backed by the full-stack systems I build to track, qualify, and report on every lead.') on conflict (page_key) do update set meta_title = excluded.meta_title, meta_description = excluded.meta_description;
insert into public.page_meta (page_key, meta_title, meta_description) values ('marketing', 'Marketing Work — Shivansh Saxena', 'Meta Ads and Google Ads campaign case studies with real, structured performance data — lead generation for real estate.') on conflict (page_key) do update set meta_title = excluded.meta_title, meta_description = excluded.meta_description;
insert into public.page_meta (page_key, meta_title, meta_description) values ('engineering', 'Engineering — Shivansh Saxena', 'Full-stack systems built to support performance marketing work: Next.js, React, and Supabase — the differentiator behind the campaigns.') on conflict (page_key) do update set meta_title = excluded.meta_title, meta_description = excluded.meta_description;
insert into public.page_meta (page_key, meta_title, meta_description) values ('about', 'About — Shivansh Saxena', 'Performance Marketing Manager running Meta and Google Ads for real estate lead generation, with full-stack development as a differentiator — the story, experience, and education.') on conflict (page_key) do update set meta_title = excluded.meta_title, meta_description = excluded.meta_description;

-- skills -------------------------------------------------------------------
insert into public.skills (slug, label, category, sort_order) values ('meta-ads', 'Meta Ads', 'marketing', 0) on conflict (slug) do update set label = excluded.label, category = excluded.category, sort_order = excluded.sort_order;
insert into public.skills (slug, label, category, sort_order) values ('google-ads', 'Google Ads', 'marketing', 1) on conflict (slug) do update set label = excluded.label, category = excluded.category, sort_order = excluded.sort_order;
insert into public.skills (slug, label, category, sort_order) values ('conversions-api', 'Conversions API (CAPI)', 'marketing', 2) on conflict (slug) do update set label = excluded.label, category = excluded.category, sort_order = excluded.sort_order;
insert into public.skills (slug, label, category, sort_order) values ('lead-generation', 'Lead Generation Strategy', 'marketing', 3) on conflict (slug) do update set label = excluded.label, category = excluded.category, sort_order = excluded.sort_order;
insert into public.skills (slug, label, category, sort_order) values ('ai-content', 'AI Content Creation', 'marketing', 4) on conflict (slug) do update set label = excluded.label, category = excluded.category, sort_order = excluded.sort_order;
insert into public.skills (slug, label, category, sort_order) values ('nextjs', 'Next.js', 'development', 5) on conflict (slug) do update set label = excluded.label, category = excluded.category, sort_order = excluded.sort_order;
insert into public.skills (slug, label, category, sort_order) values ('javascript', 'JavaScript', 'development', 6) on conflict (slug) do update set label = excluded.label, category = excluded.category, sort_order = excluded.sort_order;
insert into public.skills (slug, label, category, sort_order) values ('react', 'React.js', 'development', 7) on conflict (slug) do update set label = excluded.label, category = excluded.category, sort_order = excluded.sort_order;
insert into public.skills (slug, label, category, sort_order) values ('supabase', 'Supabase', 'development', 8) on conflict (slug) do update set label = excluded.label, category = excluded.category, sort_order = excluded.sort_order;
insert into public.skills (slug, label, category, sort_order) values ('wordpress', 'WordPress', 'development', 9) on conflict (slug) do update set label = excluded.label, category = excluded.category, sort_order = excluded.sort_order;
insert into public.skills (slug, label, category, sort_order) values ('web-dev', 'Website Development', 'development', 10) on conflict (slug) do update set label = excluded.label, category = excluded.category, sort_order = excluded.sort_order;
insert into public.skills (slug, label, category, sort_order) values ('graphic-design', 'Graphic Design', 'design', 11) on conflict (slug) do update set label = excluded.label, category = excluded.category, sort_order = excluded.sort_order;
insert into public.skills (slug, label, category, sort_order) values ('video-editing', 'Basic Video Editing', 'design', 12) on conflict (slug) do update set label = excluded.label, category = excluded.category, sort_order = excluded.sort_order;

-- services -----------------------------------------------------------------
delete from public.services;
insert into public.services (title, description, sort_order) values ('Meta Ads Management', 'Campaign structure, audience targeting, creative testing, and budget optimization for Facebook & Instagram lead generation.', 0);
insert into public.services (title, description, sort_order) values ('Google Ads Management', 'Search and performance max campaigns built around real purchase-intent keywords, not vanity traffic.', 1);
insert into public.services (title, description, sort_order) values ('Conversions API Setup', 'Server-side event tracking so your reported results survive iOS attribution loss and ad-blockers.', 2);
insert into public.services (title, description, sort_order) values ('Lead Generation Strategy', 'Full-funnel planning from ad to qualified lead — targeting, offer, landing page, and follow-up handoff.', 3);

-- education ----------------------------------------------------------------
delete from public.education;
insert into public.education (range, credential, detail, accent, sort_order) values ('2023', 'B.Tech, Computer Science', 'Abdul Kalam Technical University (AKTU), Lucknow', 'sage', 0);
insert into public.education (range, credential, detail, accent, sort_order) values ('Expected 2027', 'MBA — Digital Marketing + Business Analytics & IT', 'Pursuing, dual specialization — 1st year complete', 'terracotta', 1);

-- experience_timeline --------------------------------------------------------
delete from public.experience_timeline;
with tl_0 as (
  insert into public.experience_timeline (
    range, role, org, location, description, current, icon, sort_order,
    challenge_emoji, challenge_question, challenge_correct_explanation, challenge_incorrect_explanation
  ) values (
    'Mar 2025 – Present', 'Performance Marketing Manager', 'Divya Padma Infosystem LLP', null, 'Meta and Google Ads campaign strategy and budget allocation for real estate lead generation, plus the Conversions API setup behind reporting that survives iOS attribution loss.',
    true, 'trending', 0,
    '📉', 'Your Meta Ads dashboard suddenly shows 30% fewer conversions overnight — same spend, same creative. Most likely cause?',
    'Exactly — this is why server-side Conversions API exists: it keeps reporting conversions even when the browser blocks the pixel.', 'Fatigue shows up gradually as rising CPM and falling CTR. A sudden, broad drop like this usually means tracking broke, not the creative.'
  ) returning id
)
insert into public.experience_timeline_skills (timeline_id, skill_slug)
select id, skill_slug from tl_0, unnest(ARRAY['meta-ads', 'google-ads', 'conversions-api']::text[]) as skill_slug;
insert into public.experience_timeline_challenge_options (timeline_id, label, is_correct, sort_order)
select id, opt.label, opt.is_correct, opt.sort_order
from public.experience_timeline t,
  (values ('The audience is fatigued', false, 0), ('iOS privacy settings broke pixel tracking', true, 1)) as opt(label, is_correct, sort_order)
where t.range = 'Mar 2025 – Present' and t.org = 'Divya Padma Infosystem LLP';
with tl_1 as (
  insert into public.experience_timeline (
    range, role, org, location, description, current, icon, sort_order,
    challenge_emoji, challenge_question, challenge_correct_explanation, challenge_incorrect_explanation
  ) values (
    'Nov 2023 – Jan 2025', 'Performance Marketer + Website Developer', 'Dfractal Advisory', null, 'A dual role spanning paid campaign management and building the websites and landing pages those campaigns pointed traffic to.',
    false, 'layers', 1,
    '💰', 'Ad Set A has a lower cost-per-click. Ad Set B has a higher cost-per-click but a lower cost-per-lead. Which gets more budget?',
    'Right — CPC is a vanity metric here. Cost-per-lead is what actually pays the bills, and B wins on that.', 'Cheap clicks that don''t convert are still expensive leads. Cost-per-lead is the number that matters, and B wins on that.'
  ) returning id
)
insert into public.experience_timeline_skills (timeline_id, skill_slug)
select id, skill_slug from tl_1, unnest(ARRAY['lead-generation', 'web-dev']::text[]) as skill_slug;
insert into public.experience_timeline_challenge_options (timeline_id, label, is_correct, sort_order)
select id, opt.label, opt.is_correct, opt.sort_order
from public.experience_timeline t,
  (values ('Ad Set A — cheaper clicks', false, 0), ('Ad Set B — cheaper leads', true, 1)) as opt(label, is_correct, sort_order)
where t.range = 'Nov 2023 – Jan 2025' and t.org = 'Dfractal Advisory';
with tl_2 as (
  insert into public.experience_timeline (
    range, role, org, location, description, current, icon, sort_order,
    challenge_emoji, challenge_question, challenge_correct_explanation, challenge_incorrect_explanation
  ) values (
    'Jun 2023 – Sep 2023', 'Intern — Social Media Marketing & Website Development', 'I View Academy', 'New Delhi, Ashok Vihar Phase 2', 'First professional role, split between social media marketing execution and website development — where the marketing/dev overlap started.',
    false, 'sprout', 2,
    '📣', 'You post the exact same content organically, then boost it with ₹500. Which number is guaranteed to go up?',
    'Reach is what money buys directly — more people see it. That part''s guaranteed.', 'Boosting definitely grows reach, but engagement rate isn''t guaranteed — showing the post to less-interested people can dilute it.'
  ) returning id
)
insert into public.experience_timeline_skills (timeline_id, skill_slug)
select id, skill_slug from tl_2, unnest(ARRAY['web-dev']::text[]) as skill_slug;
insert into public.experience_timeline_challenge_options (timeline_id, label, is_correct, sort_order)
select id, opt.label, opt.is_correct, opt.sort_order
from public.experience_timeline t,
  (values ('Reach', true, 0), ('Engagement rate', false, 1)) as opt(label, is_correct, sort_order)
where t.range = 'Jun 2023 – Sep 2023' and t.org = 'I View Academy';

-- projects ------------------------------------------------------------------
insert into public.projects (slug, name, tagline, description, github_url, stack, status, featured, sort_order, published)
values ('dashboard-of-dpi', 'dashboard-of-dpi', 'Real-time lead intake and qualification dashboard', 'Built to close the gap between ad spend and sales follow-up: leads land in Supabase the moment Meta''s webhook fires, get auto-scored, and show up on a live dashboard the sales team actually uses — instead of a CSV export nobody opens fast enough.', 'https://github.com/Shivansh-saxena09/dashboard-of-dpi', ARRAY['Next.js', 'React', 'Supabase', 'TypeScript', 'Tailwind CSS']::text[], 'Active', true, 0, true)
on conflict (slug) do update set
  name = excluded.name, tagline = excluded.tagline, description = excluded.description,
  github_url = excluded.github_url, stack = excluded.stack, status = excluded.status,
  featured = excluded.featured, published = excluded.published;
delete from public.project_flow_steps where project_slug = 'dashboard-of-dpi';
insert into public.project_flow_steps (project_slug, label, detail, sort_order) values ('dashboard-of-dpi', 'Meta Ad', 'Lead form submitted', 0);
insert into public.project_flow_steps (project_slug, label, detail, sort_order) values ('dashboard-of-dpi', 'Webhook', 'Meta fires the lead event', 1);
insert into public.project_flow_steps (project_slug, label, detail, sort_order) values ('dashboard-of-dpi', 'Supabase', 'RLS-scoped upsert, deduplicated', 2);
insert into public.project_flow_steps (project_slug, label, detail, sort_order) values ('dashboard-of-dpi', 'Dashboard', 'Pushed live via Realtime', 3);
delete from public.project_challenges where project_slug = 'dashboard-of-dpi';
insert into public.project_challenges (project_slug, title, problem, fix, snippet_filename, snippet_code, sort_order) values ('dashboard-of-dpi', 'Row-Level Security for multi-role access', 'Sales reps needed to see only their assigned leads while admins saw everything — enforced at the database layer, not just hidden in the UI.', 'Supabase RLS policies keyed off a role column, so access control holds even if the client is bypassed.', 'policies.sql', 'create policy "reps see own leads"
on leads for select
using (auth.uid() = assigned_rep_id);', 0);
insert into public.project_challenges (project_slug, title, problem, fix, snippet_filename, snippet_code, sort_order) values ('dashboard-of-dpi', 'Race condition on duplicate lead intake', 'Meta occasionally re-fires the same lead webhook, creating duplicate rows and double-counting results.', 'A unique constraint on the platform lead ID plus an upsert instead of a blind insert.', 'intake.ts', 'await supabase
  .from("leads")
  .upsert(lead, { onConflict: "platform_lead_id" });', 1);
insert into public.project_challenges (project_slug, title, problem, fix, snippet_filename, snippet_code, sort_order) values ('dashboard-of-dpi', 'Realtime subscription silently going stale', 'The live dashboard would stop updating after long idle periods because the Supabase Realtime socket died without visibly disconnecting.', 'A heartbeat check that detects a stale connection and reconnects automatically.', 'realtime.ts', 'channel.on("system", { event: "*" }, (status) => {
  if (status === "CLOSED") channel.subscribe();
});', 2);

-- case_studies ----------------------------------------------------------------
insert into public.case_studies (
  slug, campaign_name, project_name, objective, platform, budget_type, special_ad_category,
  date_range, status, category, gallery_placeholder_count, override_result_headline, sort_order, published,
  narrative_objective, narrative_strategy, narrative_challenge, narrative_decision, narrative_outcome, narrative_what_id_do_differently
) values (
  'riverside-greens-meta-leadgen', 'Riverside Greens — Investor Lead Gen', 'Riverside Greens', 'Lead Gen', 'Meta', 'CBO', null,
  'Jan 2026 – Mar 2026', 'Completed', 'standard', 4, null, 0, true,
  'Generate qualified investor leads for a residential plotting project launching its second phase.', 'Ran a broad audience alongside a narrower interest-targeted audience from day one, on the same CBO budget, so Meta''s delivery system could find the cheaper source of leads without me guessing upfront.', 'The broad ad set opened at a CPL of ₹540 in week one — well above target — while the interest-targeted set was already tracking under ₹250.', 'Shifted budget weighting toward the interest-targeted ad set and tightened the broad set''s age range instead of pausing it outright, keeping some broad reach for retargeting pool size.', 'Blended CPL settled at ₹300 across both ad sets by the end of the flight, with the interest-targeted set carrying the majority of qualified leads.', 'Start the interest-targeted set with more budget share from day one instead of splitting evenly — the week-one broad spend at ₹540 CPL was the most expensive lesson in the campaign.'
)
on conflict (slug) do update set
  campaign_name = excluded.campaign_name, project_name = excluded.project_name, objective = excluded.objective,
  platform = excluded.platform, budget_type = excluded.budget_type, special_ad_category = excluded.special_ad_category,
  date_range = excluded.date_range, status = excluded.status, category = excluded.category,
  gallery_placeholder_count = excluded.gallery_placeholder_count, override_result_headline = excluded.override_result_headline,
  published = excluded.published, narrative_objective = excluded.narrative_objective, narrative_strategy = excluded.narrative_strategy,
  narrative_challenge = excluded.narrative_challenge, narrative_decision = excluded.narrative_decision,
  narrative_outcome = excluded.narrative_outcome, narrative_what_id_do_differently = excluded.narrative_what_id_do_differently;
delete from public.case_study_skills where case_study_slug = 'riverside-greens-meta-leadgen';
insert into public.case_study_skills (case_study_slug, skill_slug) values ('riverside-greens-meta-leadgen', 'meta-ads');
insert into public.case_study_skills (case_study_slug, skill_slug) values ('riverside-greens-meta-leadgen', 'conversions-api');
insert into public.case_study_skills (case_study_slug, skill_slug) values ('riverside-greens-meta-leadgen', 'lead-generation');
delete from public.ad_sets where case_study_slug = 'riverside-greens-meta-leadgen';
insert into public.ad_sets (
  case_study_slug, name, sort_order,
  targeting_locations, targeting_age_gender, targeting_interests, targeting_placements, targeting_audience_size_estimate, targeting_audience_type,
  metrics_impressions, metrics_reach, metrics_frequency, metrics_cpm, metrics_link_clicks, metrics_all_clicks, metrics_leads, metrics_amount_spent,
  outcome_qualified_leads, outcome_site_visits, outcome_bookings, outcome_cac, outcome_roas
) values (
  'riverside-greens-meta-leadgen', 'Broad — Investors 25–55', 0,
  'Delhi NCR', '25–55, all genders', null, 'Automatic placements', '~2.4M', 'Broad',
  1850000, 620000, 2.98, 145, 9200, 14500, 68, 27200,
  22, 14, 2, null, null
);
insert into public.ad_sets (
  case_study_slug, name, sort_order,
  targeting_locations, targeting_age_gender, targeting_interests, targeting_placements, targeting_audience_size_estimate, targeting_audience_type,
  metrics_impressions, metrics_reach, metrics_frequency, metrics_cpm, metrics_link_clicks, metrics_all_clicks, metrics_leads, metrics_amount_spent,
  outcome_qualified_leads, outcome_site_visits, outcome_bookings, outcome_cac, outcome_roas
) values (
  'riverside-greens-meta-leadgen', 'Interest-Targeted — Real Estate Investors', 1,
  'Delhi NCR', '28–50, all genders', 'Real estate investing, mutual funds, NRI investment', 'Feed + Reels', '~410K', 'Interest-based',
  980000, 310000, 3.16, 132, 9400, 12800, 91, 20500,
  40, 26, 5, null, null
);
insert into public.case_studies (
  slug, campaign_name, project_name, objective, platform, budget_type, special_ad_category,
  date_range, status, category, gallery_placeholder_count, override_result_headline, sort_order, published,
  narrative_objective, narrative_strategy, narrative_challenge, narrative_decision, narrative_outcome, narrative_what_id_do_differently
) values (
  'pixel-tracking-recovery', 'Pixel & Conversions API Recovery', 'Divya Padma — Multi-project', 'Conversions', 'Meta', 'ABO', null,
  'Nov 2025', 'Completed', 'learning', 3, 'Recovered ~30% of under-reported conversions', 1, true,
  'Understand why reported leads had been trailing what the sales team said they were actually receiving for several weeks running.', 'Cross-checked Meta''s reported lead count against the CRM''s actual lead intake for the same date range, campaign by campaign, instead of assuming the ad platform''s numbers were correct.', 'iOS 14.5''s App Tracking Transparency prompt was silently suppressing a meaningful share of browser-side pixel events, so Meta was under-reporting conversions across every active campaign — the ads were working better than the dashboard showed.', 'Implemented server-side Conversions API (CAPI) alongside the existing browser pixel, deduplicated by event ID, so conversions fire from the server regardless of what the visitor''s browser blocks.', 'Reported conversions rose roughly 30% for the same underlying traffic once CAPI was live — the leads had been arriving all along, just going uncounted.', 'Set up CAPI as part of initial campaign launch checklist from the start, rather than only discovering the gap after a manual CRM cross-check.'
)
on conflict (slug) do update set
  campaign_name = excluded.campaign_name, project_name = excluded.project_name, objective = excluded.objective,
  platform = excluded.platform, budget_type = excluded.budget_type, special_ad_category = excluded.special_ad_category,
  date_range = excluded.date_range, status = excluded.status, category = excluded.category,
  gallery_placeholder_count = excluded.gallery_placeholder_count, override_result_headline = excluded.override_result_headline,
  published = excluded.published, narrative_objective = excluded.narrative_objective, narrative_strategy = excluded.narrative_strategy,
  narrative_challenge = excluded.narrative_challenge, narrative_decision = excluded.narrative_decision,
  narrative_outcome = excluded.narrative_outcome, narrative_what_id_do_differently = excluded.narrative_what_id_do_differently;
delete from public.case_study_skills where case_study_slug = 'pixel-tracking-recovery';
insert into public.case_study_skills (case_study_slug, skill_slug) values ('pixel-tracking-recovery', 'meta-ads');
insert into public.case_study_skills (case_study_slug, skill_slug) values ('pixel-tracking-recovery', 'conversions-api');
delete from public.ad_sets where case_study_slug = 'pixel-tracking-recovery';
insert into public.ad_sets (
  case_study_slug, name, sort_order,
  targeting_locations, targeting_age_gender, targeting_interests, targeting_placements, targeting_audience_size_estimate, targeting_audience_type,
  metrics_impressions, metrics_reach, metrics_frequency, metrics_cpm, metrics_link_clicks, metrics_all_clicks, metrics_leads, metrics_amount_spent,
  outcome_qualified_leads, outcome_site_visits, outcome_bookings, outcome_cac, outcome_roas
) values (
  'pixel-tracking-recovery', 'All Active Campaigns (Pooled, Post-Fix)', 0,
  'Delhi NCR + Noida', '25–55, all genders', 'Property buyers, investors (mixed)', 'Automatic placements', '~1.8M', 'Broad',
  640000, 210000, 3.05, 118, 5100, 7300, 55, 12600,
  18, null, null, null, null
);
insert into public.case_studies (
  slug, campaign_name, project_name, objective, platform, budget_type, special_ad_category,
  date_range, status, category, gallery_placeholder_count, override_result_headline, sort_order, published,
  narrative_objective, narrative_strategy, narrative_challenge, narrative_decision, narrative_outcome, narrative_what_id_do_differently
) values (
  'lead-dashboard-dual-skill', 'Real-time Lead Qualification Dashboard', 'dashboard-of-dpi', 'Lead Gen', 'Meta', 'CBO', null,
  'Mar 2026 – Present', 'Active', 'dual-skill-fusion', 3, 'Sales follow-up time on new leads cut from hours to minutes', 2, true,
  'Scale ad spend on a campaign that was already converting well, without losing lead quality to slow sales follow-up.', 'Increased daily budget in stages while watching qualification rate, not just lead volume, as the signal for whether to keep scaling.', 'Lead volume grew faster than the sales team''s manual process for triaging and calling new leads — leads sitting in a spreadsheet for hours before first contact, well past the window when conversion is most likely.', 'Built dashboard-of-dpi: leads land in Supabase the moment Meta''s webhook fires, get auto-scored, and surface on a live dashboard sales actually opens — instead of a CSV export nobody checks fast enough.', 'Time from lead capture to first sales contact dropped from hours to minutes, and qualification rate held steady even as spend kept scaling.', 'Build the intake dashboard before scaling budget, not after — the follow-up bottleneck was predictable once lead volume started climbing.'
)
on conflict (slug) do update set
  campaign_name = excluded.campaign_name, project_name = excluded.project_name, objective = excluded.objective,
  platform = excluded.platform, budget_type = excluded.budget_type, special_ad_category = excluded.special_ad_category,
  date_range = excluded.date_range, status = excluded.status, category = excluded.category,
  gallery_placeholder_count = excluded.gallery_placeholder_count, override_result_headline = excluded.override_result_headline,
  published = excluded.published, narrative_objective = excluded.narrative_objective, narrative_strategy = excluded.narrative_strategy,
  narrative_challenge = excluded.narrative_challenge, narrative_decision = excluded.narrative_decision,
  narrative_outcome = excluded.narrative_outcome, narrative_what_id_do_differently = excluded.narrative_what_id_do_differently;
delete from public.case_study_skills where case_study_slug = 'lead-dashboard-dual-skill';
insert into public.case_study_skills (case_study_slug, skill_slug) values ('lead-dashboard-dual-skill', 'meta-ads');
insert into public.case_study_skills (case_study_slug, skill_slug) values ('lead-dashboard-dual-skill', 'lead-generation');
insert into public.case_study_skills (case_study_slug, skill_slug) values ('lead-dashboard-dual-skill', 'nextjs');
insert into public.case_study_skills (case_study_slug, skill_slug) values ('lead-dashboard-dual-skill', 'supabase');
delete from public.ad_sets where case_study_slug = 'lead-dashboard-dual-skill';
insert into public.ad_sets (
  case_study_slug, name, sort_order,
  targeting_locations, targeting_age_gender, targeting_interests, targeting_placements, targeting_audience_size_estimate, targeting_audience_type,
  metrics_impressions, metrics_reach, metrics_frequency, metrics_cpm, metrics_link_clicks, metrics_all_clicks, metrics_leads, metrics_amount_spent,
  outcome_qualified_leads, outcome_site_visits, outcome_bookings, outcome_cac, outcome_roas
) values (
  'lead-dashboard-dual-skill', 'Scaled Investor Campaign', 0,
  'Delhi NCR, Gurugram', '27–50, all genders', 'Real estate investing, HNI lifestyle', 'Feed + Reels + Stories', '~350K', 'Lookalike',
  1120000, 380000, 2.95, 128, 10800, 15200, 143, 42900,
  61, 38, 6, null, null
);