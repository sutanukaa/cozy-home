# Design system

**Feeling:** a hand-painted dollhouse. Soft, rounded, warm, slightly wonky like a scrapbook. Pink is the room, not just an accent.

## Palette
| Token | Day | Night | Use |
|---|---|---|---|
| `wall` | #F9C6D3 blush | #4E3460 plum | page background |
| `wall-deep` | #F3A8BD | #382448 | floors, scene backdrop |
| `paper` | #FFF6EC cream | #3E2A50 | cards, header, tooltips |
| `ink` | #5B3A47 cocoa | #FFEBF0 | body text |
| `ink-soft` | #805867 | #DBBECC | secondary text |
| `accent` | #D64676 rose | #FF8FB1 | buttons, active nav, focus |
| `glow` | #FFE29A butter | #FFC46B | lamp light |
| `sage` | #A9C7A0 | #8CAF96 | tags, tape, plants |
Fixed (both themes): `blush #F9C6D3`, `rose #E86A92`, `cream #FFF6EC`, `cocoa #5B3A47`, `butter #FFE29A`, `plum #2B1B3A`.
Never use pure black or neutral grey.

## Type
- **Fredoka** (rounded sans): headings, UI and body. Weights 400-700.
- **Gaegu** (handwriting): captions, taglines, sticky-note moments, tooltips. Always bigger than you think (`text-xl`+) because it runs small.
- Headings `font-display font-semibold tracking-tight`; body line length under ~70ch (`max-w-prose`).

## Shape & surface
- Radius: cards `rounded-3xl`, scenes `rounded-[2rem]`, pills `rounded-full`. Nothing square.
- Cards are **paper**: `PaperCard` (cream, 2px soft border, pink shadow). Tilt a few cards +-0.6 to 1 degree; add `tape` to a few, not all.
- Tags are **stickers** (`Sticker`): pill, white border, slight rotation.
- Buttons: pill, chunky bottom shadow (`shadow-pop`) that squashes on press.

## Motion
| What | How | Trigger |
|---|---|---|
| Petals / stars / fireflies | CSS keyframes, deterministic positions | ambient, by theme |
| Floating placeholder emoji, mascot bob | `animate-float`, `animate-bob` | ambient |
| Page enter | Framer `template.tsx` (fade + tiny scale) | navigation |
| Day <-> night | 1.2-1.4s cross-fades on colours and art | time change / toggle |
| Hotspot ping + pop bubble | `animate-ping-soft`, `animate-pop-in` | ambient / click |
| Card lift | `hover:-translate-y-1` | hover |
Rules: durations 250-500ms for interactions; ambient loops are slow (3-16s). Everything stops under `prefers-reduced-motion`.

## Layout
- Content width `max-w-6xl`; scenes and card groups `max-w-5xl`; reading text `max-w-prose`.
- Header: floating pill at top; mobile gets a floating bottom tab bar (emoji only, with `aria-label`s).
- Room anatomy: handwritten purpose line, big room title, handwritten tagline, 16:9 scene, then paper cards.

## Voice
First person, warm, specific, a little silly. Sentence case. Buttons say what happens ("Post it in the mailbox", "Open site").
Empty/placeholder states say what to do next.

## Illustration direction (shared by every asset)
Soft gouache + watercolour texture, subtle paper grain, rounded chunky shapes, pastel pink dominant, warm light, tiny charming details.
See `docs/ASSET_PROMPTS.md` for the exact style anchor.
