-- ============================================================================
-- Phone hero story (components/home/PhoneStory.tsx, screens < 640px).
-- Data-only: adds the phone story's keys to site_settings.hero_visual
-- (channel tags, toolkit pictogram labels, MBA progress ring, plain-text
-- story for screen readers/crawlers). No schema change. The app falls back
-- to identical defaults (lib/data/heroVisual.ts) if this is skipped, and
-- saving the admin Settings form writes the same keys. Only fills keys that
-- are missing, so values already edited in /admin are kept.
-- ============================================================================

update public.site_settings
set hero_visual = '{
  "channelLabels": ["Meta Ads", "Google Ads"],
  "toolLabels": ["Conversion tracking", "Code", "Database", "AI"],
  "studyProgress": 50,
  "storyText": "Performance marketer first: ad spend from Meta Ads and Google Ads flows into one funnel. On the Jewar plots Meta lead-gen campaign: 7.76L impressions, 6,445 clicks and 292 leads at ₹254 CPL, 112 of them qualified. Also builds the systems behind the campaigns — Pixel + Conversions API tracking, a Supabase CRM and a live dashboard — and is now building AI agents. Toolkit: conversion tracking, code, databases and AI. Studied B.Tech Computer Science (2023); MBA in progress (expected 2027). Career: I View Academy (Jun 2023), Dfractal Advisory (Nov 2023), Divya Padma Infosystem LLP (Mar 2025). Based in Greater Noida, India — open to full-time remote work."
}'::jsonb || coalesce(hero_visual, '{}'::jsonb)
where id = 1;
