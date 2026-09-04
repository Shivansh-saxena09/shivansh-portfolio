-- ============================================================================
-- Demo Video capability for Projects: an optional YouTube URL, rendered on
-- the public project page as a lite embed (thumbnail + play button; the
-- real iframe only loads once clicked, per CLAUDE.md's performance bar).
-- Generic per-project, not a one-off for any single project.
-- ============================================================================

alter table public.projects
  add column demo_video_url text;
