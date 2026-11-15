# 🏡 Cozy Home Portfolio

A personal portfolio that is a little pink home. Every page is a different room, and the house changes from day to night with the visitor's local clock.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 3 · Framer Motion

## Quick start
```bash
npm install
cp .env.example .env.local   # optional
npm run dev                  # http://localhost:3000
```
The site runs immediately with built-in placeholders, no images required. To see the night house, use the clock / sun / moon toggle in the header (or change your OS clock).

## The rooms
| Room | Route | Shows |
|---|---|---|
| 🛋️ Living room | `/` | Hub with a door to every room |
| 🖥️ Studio | `/studio` | Projects |
| 🧸 Bedroom | `/bedroom` | About me |
| 📚 Library | `/library` | Skills (books on shelves) |
| 🍓 Kitchen | `/kitchen` | Experience and education (recipe cards) |
| 💌 Porch | `/porch` | Contact |

## Make it yours, in this order
1. Edit the files in **`src/data/`** (`site.ts`, `projects.ts`, `skills.ts`, `experience.ts`). Search the project for `TODO`.
2. Generate art with **`docs/ASSET_PROMPTS.md`** and drop files into `public/assets/...` (`npm run assets:check` tracks progress).
3. Open any room with **`?debug`** (e.g. `/studio?debug`), click on the art to copy hotspot coordinates, and paste them into that page's `hotspots`.
4. Add `public/images/me.jpg` and `public/resume.pdf`.
5. Follow **`docs/ROADMAP.md`** for animations and extras.

## Working with an AI agent in your IDE
Open this folder in Cursor, Claude Code, Copilot, Windsurf, etc. The agent reads **`AGENTS.md`** (also referenced by `CLAUDE.md`, `.cursor/rules` and `.github/copilot-instructions.md`).
Start with: *"Read AGENTS.md and the docs folder, then do the next unchecked task in docs/ROADMAP.md."*

## Project docs
- `AGENTS.md`: rules and definition of done for agents
- `docs/ARCHITECTURE.md`: folder map, day/night system, scene system
- `docs/DESIGN_SYSTEM.md`: palette, fonts, shapes, motion, voice
- `docs/ASSET_PROMPTS.md`: every image prompt + workflow
- `docs/ROADMAP.md`: ordered tasks + ready-to-paste agent prompts

## Scripts
`dev` · `build` · `start` · `typecheck` · `assets:check`

## Deploy (Vercel)
Push to GitHub -> import the repo at vercel.com -> framework preset "Next.js" -> add env vars from `.env.example` -> Deploy.
