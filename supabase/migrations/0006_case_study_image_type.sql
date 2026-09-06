-- ============================================================================
-- Distinguishes ad-creative images from "verified results" proof screenshots
-- (e.g. cropped Meta Ads Manager screenshots) within the same
-- case_study_images table/storage bucket/upload mechanism — reusing the
-- existing Creatives gallery infrastructure rather than building a
-- separate one, just scoped by type. Existing rows default to 'creative'
-- so nothing already uploaded changes meaning.
-- ============================================================================

alter table public.case_study_images
  add column image_type text not null default 'creative'
    check (image_type in ('creative', 'proof'));
