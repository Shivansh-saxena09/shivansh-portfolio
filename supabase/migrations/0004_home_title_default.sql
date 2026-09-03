-- ============================================================================
-- Shortens the home page's stored <title> to a concise, SEO-friendly form.
-- The original seed (0002_seed.sql) used the full hero tagline sentence
-- ("Shivansh Saxena — Performance Marketing Manager. Full-stack builder."),
-- which is longer than ideal for a title tag/browser tab. This is ordinary
-- admin-editable content (Site Settings → SEO meta for Home in /admin) —
-- editing it here just keeps the database in sync with the same value the
-- app code now falls back to (see (site)/layout.tsx's generateMetadata)
-- when this field is ever cleared. Safe to skip this migration and instead
-- edit the same field directly in /admin/settings if preferred — either
-- path writes the same page_meta row.
-- ============================================================================

update public.page_meta
set meta_title = 'Shivansh Saxena — Performance Marketing Manager'
where page_key = 'home';
