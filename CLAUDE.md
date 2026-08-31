# Project: Shivansh Saxena — Personal Portfolio Website

## About Me
- **Name:** Shivansh Saxena
- **Primary identity:** Performance Marketing Manager — this is the main professional identity and the primary thing the site should sell. Meta Ads, Google Ads, Lead Generation, Conversions API.
- **Secondary identity:** Full-stack Developer (Next.js, React, Supabase) — a supporting/secondary skillset, not the lead pitch. Present it as a strong differentiator ("I also build the systems behind my campaigns"), not as equal billing to marketing.
- **Tagline:** "Performance Marketing Manager. Full-stack builder." (marketing-first framing — do NOT use "Founder" anywhere, I am not the founder of the company I work at)
- Works at Divya Padma Infosystem LLP — a real estate marketing/channel-partner firm — as Performance Marketing Manager (not founder).
- **Domain:** shivanshdigital.com
- **No personal photo** — keep it fully work/portfolio focused, no headshots.

## Education
- B.Tech, Computer Science — Abdul Kalam Technical University (AKTU), Lucknow — 2023
- MBA (Pursuing, expected 2027) — Dual Specialization: Digital Marketing + Business Analytics & IT — 1st year complete

## Experience Timeline
1. **Jun 2023 – Sep 2023** — Intern, I View Academy (New Delhi, Ashok Vihar Phase 2) — Social Media Marketing + Website Development
2. **Nov 2023 – Jan 2025** — Dfractal Advisory — Performance Marketer + Website Developer
3. **Mar 2025 – Present** — Divya Padma Infosystem LLP — Performance Marketing Manager

## Skills (tag-based, must link to relevant case studies)
- **Marketing (primary, lead with this):** Meta Ads, Google Ads, Conversions API (CAPI), Lead Generation Strategy, AI Content Creation
- **Development (secondary):** Next.js, JavaScript, React.js, Supabase, WordPress, Website Development (coding)
- **Design:** Graphic Design, Basic Video Editing

## Contact Info (use placeholders for now — will be replaced with real values later, structure must make them trivially editable from admin)
- Email: placeholder
- WhatsApp: placeholder
- LinkedIn: placeholder
- GitHub: placeholder

---

## Site Structure

### Homepage
- Hero section, marketing-first framing, with the tagline above
- Two CTAs / paths: **"View Marketing Work" (primary, visually emphasized)** and "View Engineering Work" (secondary, present but less emphasized by default)
- Smart adaptive homepage: referrer-based bias is fine as a secondary signal (e.g. LinkedIn referrer can lightly emphasize Engineering), but the DEFAULT emphasis with no referrer signal should always favor Marketing, since that's the primary identity
- A "Currently Working On" live-status widget — single admin-editable line of text

### `/marketing` — Client-facing path (primary path)
- List of campaign case studies (cards)
- Services offered section
- Contact CTA (WhatsApp / email / contact form)

### `/engineering` — Secondary path
- Featured project: "dashboard-of-dpi" — tech stack tags, 2-3 real technical challenges solved (RLS security setup, race condition fix, realtime bug fix), GitHub link
- Skills grid (tag-based, clickable — filters to related case studies)
- Resume download button (PDF, uploadable via admin)

### Campaign / Project Case Study detail page (dynamic route: `/case-study/[slug]`)

Each case study is built from structured metric fields entered in the admin panel (not hand-written prose) — the display page should auto-compose a professional narrative from these fields using templates, so I only ever have to paste numbers, not write paragraphs.

**Case study data model — fields to capture per case study (and per ad set, since a campaign can have multiple ad sets):**

1. **Setup info:** Campaign name, project/property name, objective (Lead Gen/Traffic/Conversions), platform (Meta/Google), budget type (CBO/ABO), special ad category, date range, status (Active/Paused/Completed)
2. **Targeting details:** Locations, age/gender, interests/behaviors, placements, estimated audience size, custom/lookalike audience used
3. **Awareness/Reach metrics:** Impressions, Reach, Frequency, CPM
4. **Engagement metrics:** Link Clicks, CTR (link), All Clicks, CTR (all), CPC (all), CPC (link)
5. **Conversion/Result metrics:** Leads/Results, Amount Spent, Cost per Result (CPL), Conversion Rate
6. **Business outcome metrics:** Qualified leads handed to sales, Qualification Rate % (auto-calculated), Site visits (optional), Bookings/Sales closed (optional), CAC (optional), ROAS (optional)
7. **Narrative/qualitative fields (short free-text, I fill these in briefly):** Objective in my own words, Strategy reasoning, Challenge faced, Decision/solution taken, Outcome summary, "What I'd do differently"
8. Creatives/Graphics gallery — 3 to 5 images
9. Tools/skills used — tags (linked back to skills section)
10. "Last verified" timestamp badge — auto-updates when admin edits the entry
11. Optional: Before/after comparison images, mini process timeline, multiple ad-set comparison table (e.g. broad vs. interest-targeted performance side by side)

The public-facing case study page should auto-generate readable narrative sections from these structured fields (e.g. "This ad set generated 159 leads at ₹300 per lead, with a 0.96% CTR against a targeted investor audience...") using a template system — not an AI call, just structured templating — so publishing a new case study is fast (fill in numbers, get a polished page).

Include one transparent "learning" case study (a real problem faced and solved — e.g. a tracking/pixel issue, or an operational bottleneck like sales follow-up capacity not matching lead volume). Include one "dual-skill fusion" case study connecting a marketing problem to an engineering solution I built.

### "Campaign Doctor" — AI-powered analysis tool (admin-only, NOT public-facing)
- Located inside the admin panel, behind my login only — never exposed to site visitors, to keep API costs controlled and predictable.
- After I fill in a campaign/ad-set's metrics, an "Analyze & Suggest" button sends that structured data to the Claude API and returns: what's working, what the likely issue is (e.g. creative fatigue from high frequency, audience saturation, weak CTR vs strong CPM signaling a creative problem), a specific recommended action, and a rough timeframe for that action.
- Works for both live campaigns (forward-looking optimization advice) and closed/completed campaigns (retrospective "what should have been done" analysis) — same analysis engine, framed differently based on campaign status.
- Requires an Anthropic API key (I will provide this when we build this part — walk me through exactly where it needs to go, e.g. as an environment variable, and confirm it's never exposed client-side).
- This is the one deliberate exception to the "no paid APIs" rule elsewhere in this doc — I've accepted a small monthly cost (roughly ₹30–100/month depending on usage) specifically for this feature, since it's restricted to my own admin use and not public-facing. Every other part of the site must still avoid paid dependencies.

### About/Story section
- Marketing-first narrative: lead with performance marketing expertise and results, then introduce the development skillset as a differentiator/support skill — not as a co-equal identity.

### Footer (global, all pages)
- Contact links, socials, "Based in India · Open to remote work" note

---

## Admin Panel (`/admin`, authenticated via Supabase Auth, single admin user)
Everything visible on the site must be editable from here — nothing hardcoded:
1. Projects/Case Studies Manager (CRUD, image gallery upload, draft/published toggle, drag-and-drop reorder)
2. Skills Manager (add/remove/reorder, category grouping, link to case study tags)
3. Experience/Timeline Manager
4. Resume Manager (upload/replace PDF)
5. Contact Info Manager (single source of truth, reflected sitewide)
6. Site Settings (hero tagline, "Currently Working On" status line, SEO meta per page, OG image per page)

---

## Design Direction — LOCKED: "Warm Cream + Terracotta/Sage" (Editorial Premium)

### Color Palette
- Base background: warm cream/off-white (~#F7F3EC) — muted, paper-like, NOT stark white, NOT pink-tinted
- Secondary background: soft ivory (~#FDFBF7) for cards/sections layered above base
- Primary accent: earthy terracotta — muted, low-saturation, baked-clay/raw-pottery tone (warm brown-orange, NOT pink/rose/blush)
- Secondary accent: muted sage/olive green — dull, not pastel/mint
- Text primary: warm charcoal (near-black with warm undertone, not pure black)
- Text secondary/muted: warm grey
- Borders/dividers: light warm beige
- All colors as CSS variables driving Tailwind utilities

### Typography
- Headings: Playfair Display (elegant serif)
- Body: Inter (clean sans-serif)
- Large, confident heading scale, disciplined hierarchy, generous line-height — editorial/magazine feel

### Design Language ("Clean. Editorial. Premium." — ELORIA-style reference)
- Full-bleed photography — images run edge-to-edge, not boxed/padded
- Restraint over decoration — whitespace is a feature
- Floating card overlays that overlap/float over image sections for depth
- Subtle shadows for depth (not heavy gradients)
- Glassmorphic cards (light-glass: translucent ivory/cream, soft shadow) used sparingly
- Subtle paper-grain texture on some sections (barely visible)

### Animations & Interactions
- Lenis smooth scroll site-wide, synced with GSAP ScrollTrigger
- Image reveal/mask animations — clip-path wipe on scroll into view (not plain fade)
- Split-text headline reveals (word/character stagger on scroll)
- GSAP ScrollTrigger pin on key sections
- Framer Motion page transitions (AnimatePresence)
- 3D tilt-on-hover for cards (subtle mouse-position-based rotateX/rotateY)
- Micro-interactions: SVG stroke-draw button borders, center-out nav underline, scroll-progress line
- Branded preloader — logo/text reveal animation before site content shows

### Key Principle
Color palette alone doesn't create "premium" — execution discipline does: full-bleed photography, precise typographic hierarchy, generous whitespace, and layered depth (floating elements, subtle shadows) rather than heavy decoration.

- Mobile-first responsive — must look excellent on phone.

## Tech Stack
- Next.js + TypeScript + Tailwind CSS
- Supabase (database + auth) for all dynamic content and admin panel
- GSAP + ScrollTrigger, Lenis, Framer Motion for animation/scroll behavior
- Deploy target: Vercel (free tier)
- Version control: GitHub (I will provide a personal access token and repo details — push all work there from the start, commit incrementally as features are completed, not just at the end)
- **No paid APIs anywhere except one deliberate exception: the admin-only "Campaign Doctor" feature described above, which uses the Claude API and has an accepted small monthly cost. Every other part of the site (public pages, chatbot-style features, auto-generation of case study prose) must run on free tiers only (Vercel free tier, Supabase free tier, GitHub free). Do not introduce any other dependency requiring a recurring paid subscription.**

## SEO / AEO / GEO requirements
- Unique meta title & description per page (editable via admin)
- Schema.org structured data: Person schema (me), Organization schema (Divya Padma Infosystem LLP), CreativeWork/Project schema per case study
- Auto-generated sitemap.xml and robots.txt
- FAQ-style content blocks where natural, to support answer-engine/featured-snippet visibility
- `llms.txt` file at root summarizing who I am, what I do, with links to key pages — written factually and specifically (real numbers, real project names)
- Keep entity information (name, role, company) consistent across the site and matching external profiles (LinkedIn, GitHub)
- Case studies must use real, specific data — never generic placeholder claims

## Build approach
- Build iteratively: homepage + routing first, then case study template, then marketing/engineering pages, then admin panel + Supabase integration, then SEO/polish last.
- Everything content-driven from Supabase — no hardcoded text/images that can't be edited from the admin panel.
- Push to GitHub from the very first commit, and continue committing as work progresses — I want full version history from day one, not just a final upload.
- Single-version build — implement everything listed above now, no "v2 later" scope-splitting.
