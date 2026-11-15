# Roadmap (for you and your AI agent)

Work top to bottom. Tick a box when its acceptance criteria are met. Always finish with `npm run build`.

## Phase 0: Foundation (done in this starter)
- [x] Next.js + Tailwind + TypeScript + Framer Motion project
- [x] Six rooms/pages with diorama pattern and placeholders
- [x] Day/night from local time (dawn/day/dusk/night) + manual toggle, no flash on load
- [x] Ambient petals (day) / stars + fireflies (night), mascot, hotspots with `?debug` coordinate picker
- [x] Data-driven content in `src/data`

## Phase 1: Make it yours (content)
- [x] **Site basics**: edit `src/data/site.ts` (email, socials, tagline, about paragraphs, loves, fun facts, mascot name and lines).
  *Accept:* no `TODO` or `example.com` left on the home, bedroom and porch pages.
- [x] **Projects**: fill `src/data/projects.ts` (real blurbs, stack tags, links; keep your two existing sites).
  *Accept:* every card has a one-sentence pitch, 2-5 tags and a working link.
- [x] **Skills**: shelves/books in `src/data/skills.ts`. *Accept:* 3-5 shelves, 3-8 books each, honest "currently learning".
- [x] **Experience/education**: `src/data/experience.ts`. *Accept:* dates, 1-3 outcome-focused bullets each.
- [x] Add `public/images/me.jpg` (square, >= 800px) and `public/resume.pdf`.
- [ ] Write the metadata description + replace `NEXT_PUBLIC_SITE_URL` (copy `.env.example` to `.env.local`).

## Phase 2: Art
- [ ] Generate **living-room** day + night (`docs/ASSET_PROMPTS.md` section 5.1). Re-measure doors with `/?debug`, update `door` in `rooms.ts`.
- [ ] Generate the other five rooms (day first, then night by editing the day image). Re-position each page's `hotspots` with `?debug`.
- [ ] Mascot cat (awake + asleep), wallpaper tiles (day + night), OG image.
- [ ] `npm run assets:check` shows 20/20.
- [ ] Rewrite hotspot `note` text to be actually about you.

## Phase 3: Delight (pick what you like; keep it tasteful)
- [ ] **Door transition**: clicking a door on the living room zooms the scene toward it (Framer `layoutId` or scale + fade) before navigating.
  *Accept:* respects reduced motion; keyboard activation works too.
- [ ] **Scene parallax**: split a room into background + foreground layers; shift on pointer move (max ~12px). *Accept:* off on touch + reduced motion.
- [ ] **Studio screen**: clicking the monitor hotspot opens a "desktop" modal listing projects with an animated cursor.
- [ ] **Cursor sparkle trail** (pink, day only; golden at night). Throttled; disabled on touch + reduced motion.
- [ ] **Lamp toggle**: clicking the lamp hotspot forces a warm glow overlay in any room (state in `TimeProvider`).
- [ ] **Mascot wanders** along the bottom of the screen and reacts to the current room (different line per room).
- [ ] **Seasonal petals** (cherry blossoms in spring, leaves in autumn, snow in winter) via `Ambient`.
- [ ] Optional soft ambient sound (crickets at night, birds by day) with a clearly labelled mute-by-default toggle.

## Phase 4: Depth
- [ ] **Project detail pages** `/studio/[slug]` with screenshots, role, stack, what you learned (`generateStaticParams`).
- [ ] **Reading nook** in the library: notes/blog from markdown/MDX files.
- [ ] **Guestbook** on the porch (Supabase, Firebase or Formspree + moderation) with sticky-note styling.
- [ ] **Easter eggs**: Konami code makes it rain hearts; clicking the front door three times says something funny.
- [ ] Contact form wired to Formspree (`NEXT_PUBLIC_FORMSPREE_ID`) and tested.

## Phase 5: Quality and launch
- [ ] Lighthouse mobile: Performance >= 90, Accessibility 100, SEO 100 (compress art; consider `next/image` once final art sizes are fixed).
- [ ] Verify at 360, 768, 1280, 1920px in day AND night; test with the OS clock set to 3am and 3pm.
- [ ] Keyboard-only walkthrough of every room; screen-reader pass on header, hotspots, form.
- [ ] `prefers-reduced-motion` pass: nothing loops or moves.
- [ ] Add `app/sitemap.ts`, `app/robots.ts`; check the OG image preview.
- [ ] Deploy to Vercel (see README), connect your domain, add analytics if wanted.

## Prompts you can paste to your IDE agent
**Start:** "Read AGENTS.md, docs/ARCHITECTURE.md and docs/DESIGN_SYSTEM.md. Then do the next unchecked task in docs/ROADMAP.md. Follow the definition of done and tick the box."

**Door transition:** "Implement the Phase 3 door transition. Follow AGENTS.md golden rules (reduced motion, keyboard access, works with zero assets). Explain which files you changed."

**New room:** "Add a new room called `<name>` for `<purpose>` following the 'Add a room' steps in AGENTS.md, including its data file, asset entries and ASSET_PROMPTS section."

**Review:** "Audit the site against the definition of done in AGENTS.md at 375px and 1280px in both themes. List issues by severity, then fix the high ones."
