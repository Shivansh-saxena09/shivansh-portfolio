-- ============================================================================
-- Admin-editable labels/values for the homepage hero motion graphic
-- (components/home/HeroVisual.tsx). Stored as one jsonb blob on the existing
-- single-row site_settings table — the graphic's shape is fixed in code, only
-- its words/numbers are content. The app falls back to the same defaults
-- (lib/data/heroVisual.ts) until this migration runs, so it's safe to apply
-- at any time via the Supabase SQL editor.
-- ============================================================================

alter table public.site_settings
  add column if not exists hero_visual jsonb;

update public.site_settings
set hero_visual = '{
  "spendLabel": "₹47.7K ad spend",
  "stages": ["Impressions", "Clicks", "Leads"],
  "leadsValue": 159,
  "leadsLabel": "leads generated",
  "metricChips": ["₹300 CPL", "0.96% CTR"],
  "systemNodes": ["Pixel + CAPI", "Supabase CRM", "Live dashboard"],
  "feedbackLabel": "conversion signal"
}'::jsonb
where id = 1 and hero_visual is null;
