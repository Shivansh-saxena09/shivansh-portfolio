-- ============================================================================
-- Campaign Doctor public showcase — one admin-approved AI analysis result
-- stored per case study, so the public case-study page can display it as
-- static data (no live API call per visitor). Populated only via the
-- admin's "Publish to public page" action after reviewing a real result.
-- ============================================================================

alter table public.case_studies
  add column ai_insight_whats_working text[],
  add column ai_insight_likely_issues text[],
  add column ai_insight_recommended_action text,
  add column ai_insight_timeframe text,
  add column ai_insight_generated_at timestamptz,
  add column ai_insight_published boolean not null default false;

-- No RLS changes needed: these are ordinary columns on an already-policed
-- table (public_read_published / admin_write from 0001_init.sql already
-- cover them).
