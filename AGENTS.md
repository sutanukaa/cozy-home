# AGENTS.md: instructions for AI coding agents

You are helping build **a cozy, animated personal portfolio that is a little pink home**. Each page is a different room.
Read this file fully, then `docs/ARCHITECTURE.md` and `docs/DESIGN_SYSTEM.md` before changing code.
Work from `docs/ROADMAP.md` (pick the next unchecked task, finish it, tick it off).

## The concept (never lose this)
- Owner: Sutanuka Chakraborty, a software developer. Tone: warm, soft, whimsical, a bit funny, very personal.
- Pink walls, handmade scrapbook feel, tiny delightful details. Think "dollhouse cutaway", not "SaaS landing page".
- Rooms = pages: Living room `/` (hub), Studio `/studio` (projects), Bedroom `/bedroom` (about), Library `/library` (skills),
  Kitchen `/kitchen` (experience/education), Porch `/porch` (contact).
- **Day/night follows the visitor's local clock** (dawn/day/dusk/night). Manual override toggle exists.

## Stack
Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 3.4 · Framer Motion. No UI kit, no CSS-in-JS.

## Commands
```
npm install
npm run dev           # http://localhost:3000   (add ?debug on a room page to pick hotspot coordinates)
npm run typecheck
npm run build         # must pass before you call a task done
npm run assets:check  # which generated images are in place
```

## Golden rules
1. **Content lives in `src/data/*`, never hard-coded in components.** Add/edit data, not JSX copy.
2. **Colours come from tokens** (`bg-wall`, `text-ink`, `bg-paper`, `text-accent`, ...). They flip automatically at night.
   Do not hard-code hex values in components, except for fixed brand accents (`blush`, `rose`, `butter`, `sage`) that look right in both themes.
3. **Day/night is CSS-driven.** `<html data-theme="day|night" data-phase="dawn|day|dusk|night">` is set by an inline script
   in `layout.tsx` before paint and kept fresh by `TimeProvider`. Style night with the `dark:` variant (mapped to `data-theme=night`)
   or with the `.only-day/.only-night/.variant-night` helpers in `globals.css`. Never branch on the theme in server components
   and never read `window`/`localStorage` during render.
4. **The site must work with zero image assets.** Every image goes through `AssetImage` (hides/falls back on 404) and every
   scene has a built-in placeholder. Never add a hard dependency on a file that may not exist yet.
5. **Rooms use the diorama pattern:** `<RoomHeading/>` + `<RoomScene room="..." hotspots={[...]}/>` + content cards below.
   The scene is always 16:9; hotspot coordinates are percentages of it.
6. **Accessibility is a requirement:** semantic landmarks, one `<h1>` per page, visible focus (already global), `aria-label` on
   icon-only controls, text contrast >= 4.5:1, honour `prefers-reduced-motion` (CSS already neutralises keyframes; use
   `useReducedMotion()` for Framer Motion). Decorative art gets `alt=""`.
7. **Motion is seasoning.** Ambient motion (petals, stars, floating emoji) is already present. Add motion that answers a
   user action (hover, open, navigate). Do not add fade-up-on-scroll to every section.
8. Keep client components to the minimum (`'use client'` only where state/effects/event handlers are needed).
9. No new dependencies without a clear reason; prefer CSS + Framer Motion.
10. Copy style: sentence case, plain words, first person, short. Placeholder copy is marked `TODO`. Never invent facts about the owner
    (employers, dates, degrees, links): leave a clear `TODO`.

## How to...
**Add a room:** add a slug to `RoomSlug` and an entry in `src/data/rooms.ts` (name, emoji, purpose, tagline, `door` position) ->
create `src/app/<slug>/page.tsx` using the diorama pattern -> add `<slug>-day.png` / `<slug>-night.png` entries to
`src/data/assets.json` -> add a prompt to `docs/ASSET_PROMPTS.md`. Nav, home doors and "Where to?" cards update automatically.

**Place a hotspot:** open the room with `?debug`, click the spot on the art, copy `x, y`, paste into that page's `hotspots` array.

**Add a project:** append to `src/data/projects.ts`.

**Swap fonts/colours:** fonts in `tailwind.config.ts` + the `<link>` in `layout.tsx`; colours in `:root` / `html[data-theme='night']` in `globals.css`.

**Change asset format (png -> webp):** change `ASSET_EXT` in `src/lib/assets.ts` and the extensions in `src/data/assets.json`.

## Definition of done (every task)
- [ ] `npm run typecheck` and `npm run build` pass
- [ ] Checked at 375px, 768px and 1280px widths, in both day and night (toggle in header)
- [ ] Works with and without the generated art present
- [ ] Keyboard-navigable; no console errors; reduced-motion respected
- [ ] No hard-coded personal copy outside `src/data`
- [ ] Roadmap checkbox ticked; docs updated if structure changed

## Do not
- Do not restructure the folder layout or rename tokens without updating `docs/ARCHITECTURE.md`.
- Do not use `localStorage` outside `TimeProvider`/guarded effects. Do not use `Math.random()` in render (hydration mismatch).
- Do not use cold greys, pure black, or sharp 90-degree corners. Everything is round, soft and warm.
- Do not add stock icons packs/emoji-heavy UI beyond what exists; the illustrations carry the personality.
