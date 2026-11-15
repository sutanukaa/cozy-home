# Architecture

## Folder map
```
cozy-home/
├─ AGENTS.md                  # rules for AI agents (start here)
├─ CLAUDE.md, .cursor/, .github/copilot-instructions.md   # pointers to AGENTS.md
├─ docs/
│  ├─ ARCHITECTURE.md         # this file
│  ├─ DESIGN_SYSTEM.md        # palette, type, shapes, motion, components
│  ├─ ASSET_PROMPTS.md        # prompts + workflow for every illustration
│  └─ ROADMAP.md              # ordered task list with acceptance criteria
├─ public/
│  ├─ assets/
│  │  ├─ rooms/               # <room>-day.png + <room>-night.png  (16:9)
│  │  ├─ objects/             # transparent PNGs: mascot, stickers, tape
│  │  ├─ patterns/            # wallpaper-day.png, wallpaper-night.png (seamless)
│  │  └─ og/og-image.png      # social share image (1200x630)
│  ├─ images/me.jpg           # your real photo for the bedroom polaroid (optional)
│  └─ resume.pdf              # your resume (optional)
├─ scripts/check-assets.mjs   # `npm run assets:check`
└─ src/
   ├─ app/
   │  ├─ layout.tsx           # <html>, fonts, theme init script, providers, header, mascot
   │  ├─ template.tsx         # page-enter animation (re-mounts per navigation)
   │  ├─ globals.css          # theme tokens, day/night helpers, ambient particles
   │  ├─ page.tsx             # Living room (hub with doors)
   │  ├─ studio/ bedroom/ library/ kitchen/ porch/   # one folder per room
   │  └─ not-found.tsx, icon.svg
   ├─ components/
   │  ├─ providers/TimeProvider.tsx   # mode (auto/day/night) + live phase
   │  ├─ layout/    SiteHeader, SiteFooter, TimeToggle, RoomHeading
   │  ├─ scene/     RoomScene (diorama), Ambient (petals/stars), Mascot
   │  ├─ ui/        AssetImage, Hotspot, PaperCard, Sticker, Button
   │  └─ rooms/     room-specific client components (ContactForm)
   ├─ data/         site.ts, rooms.ts, projects.ts, skills.ts, experience.ts, assets.json
   └─ lib/          time.ts (phase logic), assets.ts (asset paths)
```

## Rooms
| Route | Slug | Content | Source data |
|---|---|---|---|
| `/` | living-room | hero + doors to every room | `rooms.ts`, `site.ts` |
| `/studio` | studio | projects as "app windows" | `projects.ts` |
| `/bedroom` | bedroom | about, polaroid, loves, fun facts | `site.ts` |
| `/library` | library | skills as book spines on shelves | `skills.ts` |
| `/kitchen` | kitchen | experience/education as recipe cards | `experience.ts` |
| `/porch` | porch | contact form + socials | `site.ts`, env |

## Day / night system
1. **First paint:** an inline `<script>` in `layout.tsx` reads `localStorage['cozy-mode']` (`auto|day|night`) and the visitor's
   local hour, then sets `data-theme` (`day|night`) and `data-phase` (`dawn|day|dusk|night`) on `<html>` before React hydrates. No flash.
2. **After hydration:** `TimeProvider` reads the same stored mode, re-applies the attributes, and re-checks every 60s so the house
   changes light while someone has the tab open. `useTime()` returns `{ mode, setMode, phase, theme }`.
3. **Phases** (edit in `lib/time.ts` AND the inline script):
   05-07 dawn · 07-17 day · 17-19 dusk · 19-05 night. Only `night` flips the theme; dawn/dusk keep the day art with a warm tint
   (`.phase-tint`).
4. **Styling at night:** CSS variables in `globals.css` (`html[data-theme='night']`) remap every token; Tailwind `dark:` is mapped to
   `data-theme=night`. Particles, mascot and room art swap with `.ambient-*`, `.only-*`, `.variant-night` CSS (no JS, no flicker).
5. **Manual override:** `TimeToggle` in the header (clock / sun / moon), persisted in `localStorage`.

## Scene system (`RoomScene`)
Layers, bottom to top: CSS placeholder -> `<room>-day.png` -> `<room>-night.png` (fades in at night) -> dawn/dusk tint ->
optional children -> hotspots. 16:9 aspect keeps hotspot % aligned at every width. `?debug` shows a 10% grid and copies click coordinates.

Hotspot types: `href` (navigates, used for doors and mailbox) or `note` (pops a handwritten bubble).

## Conventions
- Server components by default; `'use client'` only for state/effects (`RoomScene`, `Hotspot`, `AssetImage`, `Mascot`,
  `TimeProvider`, `TimeToggle`, `SiteHeader`, `ContactForm`, `template.tsx`).
- Data -> page -> components. Pages import from `src/data`, never the reverse.
- Path alias `@/` = `src/`.
- Naming: components PascalCase, data/lib camelCase files, room asset names `<slug>-<day|night>.png`.
- Asset paths are built only through `src/lib/assets.ts`.

## Extending (patterns to follow)
- **Project detail pages:** `src/app/studio/[slug]/page.tsx` with `generateStaticParams` from `projects.ts`.
- **Blog / notes in the library:** MDX or plain `.md` files in `content/`, listed on a "reading nook" section.
- **Parallax:** split the room art into 2-3 transparent layers; move them with `useMotionValue` on pointer move (disable on reduced motion).
