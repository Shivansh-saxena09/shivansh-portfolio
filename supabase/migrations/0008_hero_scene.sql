-- ============================================================================
-- Hero story content (components/home/HeroStory.tsx). Data-only: extends the
-- existing site_settings.hero_visual jsonb (0007) with the scene's new keys
-- (AI node, resume document, career label, link labels, skip/replay
-- labels, /engineering#ai section copy) and switches the funnel numbers to the Jewar campaign's real
-- totals across both ad sets: 7,76,021 impressions, 6,445 link clicks,
-- 292 leads, ₹74,037 spent (₹254 CPL), 112 qualified. No schema change —
-- the app falls back to identical defaults (lib/data/heroVisual.ts) if this
-- is skipped, and saving the admin form writes the same values.
-- ============================================================================

update public.site_settings
set hero_visual = coalesce(hero_visual, '{}'::jsonb) || '{
  "campaignLabel": "Jewar plots · Meta lead gen",
  "spendLabel": "₹74K ad spend",
  "stages": ["Impressions", "Clicks", "Leads"],
  "stageValues": ["7.76L", "6,445"],
  "leadsValue": 292,
  "metricChips": ["₹254 CPL", "112 qualified"],
  "aiLabel": "AI agents",
  "aiItems": ["Campaign Doctor", "AI calling agent"],
  "aiStatus": "Coming soon",
  "resumeLabel": "Resume",
  "resumeMeta": "PDF",
  "careerLabel": "Career",
  "linkLabels": ["Marketing work", "Engineering work", "AI work", "Resume"],
  "controlLabels": ["Skip intro", "Replay"],
  "aiSectionHeading": "AI work",
  "aiSectionBody": "Campaign Doctor — the internal tool I use to analyse campaign metrics — and an AI calling agent I''m building now. Full write-ups are coming soon."
}'::jsonb - 'leadsLabel' - 'feedbackLabel'
where id = 1;
