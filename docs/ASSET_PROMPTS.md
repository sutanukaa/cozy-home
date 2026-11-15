# Asset prompts

Everything visual on the site can be generated with any image model (ChatGPT image generation, Gemini, Midjourney, Firefly, Leonardo, etc.).
The site works without any of these (placeholders show), so generate them room by room and drop each file in place.
Run `npm run assets:check` to see what is still missing.

## 0. Workflow (read once)
1. **Pick the style anchor** (below) and paste it at the start of *every* prompt. This is what keeps 20 images looking like one world.
2. **Generate the DAY version of a room first.** Make 4 variations, choose the best, upscale it.
3. **Generate the NIGHT version by editing the chosen day image**, not from scratch: upload the day image as a reference and use the night prompt.
   Same layout and objects is the point, because the site cross-fades between the two.
   - Midjourney: add the day image URL as `--sref <url>` and `--iw 2`, plus `--ar 16:9`.
   - ChatGPT / Gemini: attach the day image and say "Keep everything identical, only change the lighting to night."
4. **Export at 2400x1350 (16:9).** Save as `public/assets/rooms/<slug>-day.png` and `<slug>-night.png`.
5. **Objects/stickers:** generate on a plain white or flat pink background, remove the background (remove.bg, Photoshop, Photopea, or `rembg`), save as transparent PNG.
6. **Compress** with squoosh.app or similar. Aim for room images under ~600 KB. If you convert to WebP, set `ASSET_EXT = 'webp'` in `src/lib/assets.ts` and rename the extensions in `src/data/assets.json`.
7. **Place hotspots:** open the page with `?debug` (e.g. `/studio?debug`), click objects on the art, copy the `x, y` into that page's `hotspots` array. For the living room, update each `door` in `src/data/rooms.ts`.

## 1. Style anchor (paste at the start of every prompt)
```
Soft whimsical storybook illustration, hand-painted gouache and watercolor texture with subtle paper grain,
rounded chunky shapes, gentle pastel palette dominated by blush pink (#F9C6D3), cream (#FFF6EC), rose (#E86A92),
sage green (#A9C7A0) and butter yellow (#FFE29A), warm soft lighting, tiny charming handmade details,
cozy scrapbook feel, no text, no letters, no logos, no people.
```

## 2. Room camera block (add after the style anchor for all six rooms)
```
Straight-on dollhouse cutaway view of a single room, wide 16:9 composition, back wall and wooden floor visible,
camera slightly above floor level, symmetrical and centered, furniture arranged so the middle-bottom of the image
stays relatively uncluttered, gentle depth, everything slightly rounded and puffy.
```

## 3. Night variant block (add after the style anchor when editing a day image)
```
Keep the room, furniture, composition and every object exactly the same as the reference image.
Change ONLY the lighting to night: deep plum and indigo shadows, the window shows a starry sky with a crescent moon,
a warm glowing lamp and string lights are the main light sources, soft golden glow pooling on nearby surfaces,
still cozy and pastel (not dark or gloomy), subtle sparkles.
```

## 4. Negative prompt (for tools that support it)
`text, letters, watermark, signature, logo, people, faces, photorealistic, harsh shadows, neon, black, grey, cluttered center, cropped furniture, distorted perspective`

---

## 5. Rooms (12 files: 6 rooms x day + night)
Output: `public/assets/rooms/<slug>-day.png` and `-night.png`, 2400x1350.

### 5.1 Living room: `living-room-day.png` / `living-room-night.png`
Hub of the site. The doors are clickable, so draw them clearly and spread out.
```
[STYLE ANCHOR] [ROOM CAMERA BLOCK]
A cozy pink living room. Along the back wall, five small distinct doorways side by side, each with a tiny giveaway decoration:
far left a door with a little monitor sticker, next a door with a teddy-bear wreath, next a door shaped like a book with a tiny
shelf above it, next a door with strawberry curtains. Bottom center, a round-windowed pink front door with a doormat.
Fluffy cream sofa with pink cushions, round pastel rug, a large arched window with ruffled curtains, a potted monstera, a stack of
books, fairy lights draped across the top, framed abstract pictures (no text), a sleeping-cat basket in the corner.
```
Door hit areas (match to `rooms.ts`): studio ~(17,52), bedroom ~(38,50), library ~(62,50), kitchen ~(82,54), porch/front door ~(50,82).
After generating, re-measure with `/?debug` and update `door` values.

### 5.2 Studio (projects): `studio-day.png` / `studio-night.png`
Target dimensions: **2400x1350** (16:9 landscape). Must be a **wide pulled-back dollhouse cutaway** of the entire room (not a zoomed-in close-up of the desk).

```
Soft whimsical storybook illustration, hand-painted gouache and watercolor texture with subtle paper grain, rounded chunky shapes, gentle pastel palette dominated by blush pink (#F9C6D3), cream (#FFF6EC), rose (#E86A92), sage green (#A9C7A0) and butter yellow (#FFE29A), warm soft daytime lighting, tiny charming handmade details, cozy scrapbook feel, no text, no letters, no logos, no people.

Straight-on wide-angle dollhouse cutaway view of an entire cozy creative workspace room, wide 16:9 landscape composition, camera pulled back so the entire room is visible from the wooden floorboards at the bottom to the top wall and ceiling. Symmetrical and spacious room environment, pulled-back perspective, not a close-up, not zoomed in.

In the center against the back wall sits a cute pastel-pink wooden study desk with a cozy rounded office chair. On the desk sits a vintage-style desktop computer monitor with a completely 100% BLANK, flat, empty, plain pastel screen (strictly zero text, zero code, zero icons, zero illustrations on the monitor screen, purely solid empty screen). On the desk is a pink mechanical keyboard, mousepad, headphones on a stand, and a cute pink ceramic coffee mug with NO steam (plain mug, strictly no smoke, no vapor). The right side of the desk is clear and empty with space for a plant.

The room has a warm wooden plank floor with a fluffy cloud rug, pastel pink walls with washi-taped blank posters and corkboard, wall shelves with tech books and cute figurines, fairy lights strung along the top of the wall, and an arched window on one side with soft sunlight. Wide 16:9 landscape view showing the entire room.
```

Negative prompt: `close-up, zoomed-in desk, first-person perspective, cropped ceiling, cropped floor, steam, smoke, vapor, text on monitor, graphics on screen, plant on desk, table plant, people, photorealistic, harsh shadows, neon`

**Night edit prompt** (upload Day image as reference):
```
Keep the room, desk, furniture, composition, camera distance, and every single object exactly identical to the reference image.

Change ONLY the lighting to night: deep cozy plum and indigo shadows, warm amber fairy lights turned on and casting soft warm light pools over the desk and floor, starry night sky with a crescent moon through the window, subtle magical warm room glow. The computer monitor screen remains completely 100% BLANK, plain, empty, flat surface. No steam from the mug, no plant on the desk, no text, no people. Wide 16:9 landscape.
```

### 5.3 Bedroom (about me): `bedroom-day.png` / `bedroom-night.png`
```
[STYLE ANCHOR] [ROOM CAMERA BLOCK]
A dreamy pink bedroom. A puffy bed with a quilted pastel blanket and many pillows on the left, a teddy bear and a plush bunny,
a nightstand with a round lamp, a large window on the right with sheer curtains, a string of polaroid-style blank photos pinned
along the wall with fairy lights, a fluffy rug, a wardrobe with a heart handle, a small bookshelf, a tiny reading lamp, a houseplant.
```
Hotspots in code: bed ~(30,62), window ~(74,30).

### 5.4 Library (skills): `library-day.png` / `library-night.png`
```
[STYLE ANCHOR] [ROOM CAMERA BLOCK]
A magical cozy home library. Floor-to-ceiling bookshelves full of colorful pastel books along the back wall, a rolling wooden ladder,
a round arched window, a plush reading armchair with a blanket and a small tea tray in the lower left, a globe, a stack of books
as a side table, hanging plants, floating tiny sparkles, a patterned rug, lanterns.
```
Hotspot in code: reading nook ~(24,66).

### 5.5 Kitchen (experience): `kitchen-day.png` / `kitchen-night.png`
```
[STYLE ANCHOR] [ROOM CAMERA BLOCK]
A cheerful pastel kitchen. Soft pink cabinets with round knobs, a cream stove with a pink kettle on the right side, strawberry-print
curtains over a window with herb pots, a wooden table with a fruit bowl and a mixing bowl, recipe cards (blank) pinned on a corkboard,
hanging pots and wooden spoons, a checkered floor, a small fridge with magnets, cupcake stand.
```
Hotspot in code: kettle ~(70,48).

### 5.6 Porch (contact): `porch-day.png` / `porch-night.png`
```
[STYLE ANCHOR] [ROOM CAMERA BLOCK] (exterior version: straight-on view of the front porch instead of a room)
The front porch of a small pink cottage. A pink front door with a round window and a heart wreath, a wooden porch with steps,
a cute mailbox on the right with a little flag, hanging flower baskets, a welcome mat, a lantern, a white picket fence, wildflowers
and a rosebush, blue-pink sky with fluffy clouds visible at the top.
```
Night: add a warm lit lantern and glowing windows, starry sky, fireflies.
Hotspot in code: mailbox ~(78,62).

---

## 6. Objects (transparent PNGs)
Output: `public/assets/objects/<name>.png`

| File | Size | Used in |
|---|---|---|
| `mascot-cat.png` | 1024x1024 | bottom-right house pet (day) |
| `mascot-cat-sleep.png` | 1024x1024 | house pet at night |
| `basket-cat-sleep.png` | 512x512 | sleeping kitten in the living room woven basket |
| `basket-cat-wake.png` | 512x512 | cat waking up / stretching when clicked |
| `basket-cat-paw.png` | 512x512 | cat waving/swiping cute little paw |
| `basket-cat-loaf.png` | 512x512 | cat tucked into a cozy bread loaf |
| `basket-cat-play.png` | 512x512 | cat batting a tiny yarn ball |
| `basket-cat-yawn.png` | 512x512 | big adorable sleepy yawn |
| `sticker-heart.png`, `sticker-star.png` | 512x512 | decorations (roadmap tasks) |
| `washi-tape.png` | 1200x300 | card tape (roadmap tasks) |

### basket-cat-sleep (Sleeping in Basket)
```
[STYLE ANCHOR] A cute chubby fluffy calico / ginger kitten curled up asleep peacefully in a round cozy woven wicker basket with a soft pink fleece blanket, tail tucked in, closed happy eyes, gentle pastel colors, die-cut sticker with clean border, centered on plain flat background, high resolution 512x512 square.
```
*Drop into: `public/assets/objects/basket-cat-sleep.png`*

### basket-cat-wake (Waking Up & Stretching)
```
[STYLE ANCHOR] The same cute chubby kitten sitting up inside the woven wicker basket, stretching its front paws forward with a big happy smile, sparkly round eyes, pink nose, die-cut sticker with clean border, centered on plain flat background, high resolution 512x512 square.
```
*Drop into: `public/assets/objects/basket-cat-wake.png`

### basket-cat-paw (Friendly Paw Wave)
```
[STYLE ANCHOR] The same cute chubby kitten leaning over the rim of the round wicker basket, waving one fluffy front paw in a friendly greeting, curious happy expression, die-cut sticker with clean border, centered on plain flat background, high resolution 512x512 square.
```
*Drop into: `public/assets/objects/basket-cat-paw.png`

### basket-cat-loaf (Cozy Cat Loaf)
```
[STYLE ANCHOR] The same cute chubby kitten sitting inside the woven basket in a neat round "loaf" position with all four paws completely tucked underneath its fluffy body, content closed-eye smile, die-cut sticker with clean border, centered on plain flat background, high resolution 512x512 square.
```
*Drop into: `public/assets/objects/basket-cat-loaf.png`

### basket-cat-play (Playing with Yarn)
```
[STYLE ANCHOR] The same cute chubby kitten peeking out of the wicker basket batting playfully at a small pastel rose-pink ball of wool yarn with its front paws, playful cheerful expression, die-cut sticker with clean border, centered on plain flat background, high resolution 512x512 square.
```
*Drop into: `public/assets/objects/basket-cat-play.png`

### basket-cat-yawn (Sleepy Yawn)
```
[STYLE ANCHOR] The same cute chubby kitten in the wicker basket letting out a big wide sleepy yawn with tiny pink tongue showing, crinkled closed eyes, fluffy paws on the blanket, die-cut sticker with clean border, centered on plain flat background, high resolution 512x512 square.
```
*Drop into: `public/assets/objects/basket-cat-yawn.png`

### mascot-cat
```
[STYLE ANCHOR] A chubby cute cat sitting and looking happy, cream fur with soft pink inner ears and a tiny pink bow, big round
sparkly eyes, die-cut sticker style with a thin white outline, centered, full body, plain flat white background.
```
Change the colours to match your real pet or favorite cat. Rename `mascot.name` in `src/data/site.ts`.

### mascot-cat-sleep
```
[STYLE ANCHOR] The same cute chubby cat curled up asleep in a ball, closed happy eyes, tail wrapped around, tiny pink bow,
die-cut sticker style with a thin white outline, centered, plain flat white background.
```

### sticker-heart / sticker-star
```
[STYLE ANCHOR] A single glossy pastel pink heart sticker with a thin white die-cut border and a tiny highlight, centered, plain white background.
```
```
[STYLE ANCHOR] A single butter-yellow star sticker with a thin white die-cut border and a soft sparkle, centered, plain white background.
```

### washi-tape
```
[STYLE ANCHOR] A horizontal strip of pastel pink washi tape with tiny cream polka dots, slightly translucent, torn zig-zag ends,
flat top-down view, plain white background.
```

---

## 7. Patterns (seamless tiles)
Output: `public/assets/patterns/wallpaper-day.png`, `wallpaper-night.png`, 1024x1024, **must tile seamlessly**.
Displayed at 320px, so keep the motifs tiny and low contrast. They sit behind everything.
```
[STYLE ANCHOR] Seamless repeating wallpaper pattern, blush pink background with tiny cream flowers, small hearts and dots,
very low contrast, soft and delicate, flat, tileable, no border.
```
Night:
```
[STYLE ANCHOR] Seamless repeating wallpaper pattern, deep plum background with tiny pink flowers, small stars and dots,
very low contrast, soft and delicate, flat, tileable, no border.
```
Test tiling: in Photopea/Photoshop use Filter -> Other -> Offset by 512px and check for visible seams; or check on the site (the layer repeats).

---

## 8. Social image
`public/assets/og/og-image.png`, 1200x630.
```
[STYLE ANCHOR] A tiny pink cottage with a glowing window on a grassy hill, fluffy clouds, cherry blossom petals floating,
wide composition with calm empty space on the left, soft sunset light.
```
Add your name/title on top in Figma/Canva (generators draw text badly). Keep it inside the center safe area.

---

## 9. Custom UI & Sticker Icons (Emoji Replacements)
Output: `public/assets/icons/<name>.png`, 512x512 with transparent background.
Add this block at the end of every prompt:
`Single centered die-cut sticker with a clean white sticker border, isolated on a solid plain background, flat lighting, high resolution, 512x512 square.`

### 9.1 Rooms & Navigation
- **Home / Living Room** (`public/assets/icons/home.png`):
  `[STYLE ANCHOR] A tiny, adorable pastel pink cottage house with a round wooden door, chimney with a puff of heart-shaped smoke, and glowing windows, die-cut sticker format.`
- **Studio** (`public/assets/icons/studio.png`):
  `[STYLE ANCHOR] A cute retro chunky desktop computer monitor in pastel lavender-pink, showing a tiny heart on the screen, surrounded by miniature washi tape stickers, die-cut sticker format.`
- **Bedroom** (`public/assets/icons/bedroom.png`):
  `[STYLE ANCHOR] A plush fuzzy teddy bear with stitched button eyes, sitting peacefully wearing a tiny knitted cream scarf, die-cut sticker format.`
- **Library** (`public/assets/icons/library.png`):
  `[STYLE ANCHOR] A neat little stack of three pastel hardcover books tied together with a soft rose ribbon, a tiny golden bookmark peeking out, die-cut sticker format.`
- **Kitchen** (`public/assets/icons/kitchen.png`):
  `[STYLE ANCHOR] A plump sweet ripe strawberry with tiny seeds and soft sage-green calyx leaves, topped with a gentle sugar sparkle, die-cut sticker format.`
- **Porch** (`public/assets/icons/porch.png`):
  `[STYLE ANCHOR] A vintage love-letter envelope in cream paper sealed with a soft pink wax heart stamp, with tiny sparkles floating around it, die-cut sticker format.`

### 9.2 Time of Day Toggle (`TimeToggle`)
- **Auto / Clock Mode** (`public/assets/icons/time-clock.png`):
  `[STYLE ANCHOR] A cute round vintage mantle clock in pastel butter yellow with tiny rounded clock hands and soft floral embellishments, die-cut sticker format.`
- **Daytime Sun** (`public/assets/icons/time-sun.png`):
  `[STYLE ANCHOR] A happy cheerful pastel morning sun with soft rounded rays and a warm golden-butter glow, die-cut sticker format.`
- **Nighttime Moon** (`public/assets/icons/time-moon.png`):
  `[STYLE ANCHOR] A dreamy golden-cream crescent moon resting near a soft puffy cloud, surrounded by little stars, die-cut sticker format.`

### 9.3 Skills & Bookshelves (`skills.ts`)
- **Frontend** (`public/assets/icons/skill-frontend.png`):
  `[STYLE ANCHOR] A chunky hand-tied satin bow ribbon in blush pink and rose, puffy and soft, die-cut sticker format.`
- **Backend Cupcake** (`public/assets/icons/skill-backend.png`):
  `[STYLE ANCHOR] A cute bakery cupcake with swirls of strawberry cream frosting, rainbow sprinkles, and a striped pastel baking liner, die-cut sticker format.`
- **AI & Data Magic Wand** (`public/assets/icons/skill-ai.png`):
  `[STYLE ANCHOR] A wooden fairy godmother magic wand tipped with a glowing pastel star that leaves a trail of soft dust motes, die-cut sticker format.`
- **Tools & DevOps Toolbox** (`public/assets/icons/skill-tools.png`):
  `[STYLE ANCHOR] A mini pastel sage-green vintage toolbox with rounded brass latches and a cute handle, die-cut sticker format.`

### 9.4 Projects (`projects.ts`)
- **RAG Chatbot Robot** (`public/assets/icons/project-robot.png`):
  `[STYLE ANCHOR] A friendly, retro-cute mini toy robot with rounded rectangular head, tiny antenna with a glowing bulb, pastel mint and pink colors, die-cut sticker format.`
- **Syntactiq Lightning** (`public/assets/icons/project-lightning.png`):
  `[STYLE ANCHOR] A stylized, puffy pastel butter-yellow lightning bolt with rounded edges and gentle golden sparkle accents, die-cut sticker format.`
- **Scrapbook Journal** (`public/assets/icons/project-scrapbook.png`):
  `[STYLE ANCHOR] A spiral-bound scrapbook notebook with a textured pastel pink cover decorated with washi tape and a heart sticker, die-cut sticker format.`
- **Bloom Flower** (`public/assets/icons/project-flower.png`):
  `[STYLE ANCHOR] A delicate blooming cherry blossom flower with five soft pink petals and butter-yellow stamen in the center, die-cut sticker format.`

### 9.5 Socials & Accents
- **GitHub Octopus** (`public/assets/icons/social-github.png`):
  `[STYLE ANCHOR] An adorable tiny chibi octopus floating happily, soft lilac-pink watercolor texture, rounded tentacles, die-cut sticker format.`
- **LinkedIn Briefcase** (`public/assets/icons/social-linkedin.png`):
  `[STYLE ANCHOR] A cute mini vintage leather satchel / briefcase in warm cocoa brown with golden buckles, die-cut sticker format.`
- **Tea Kettle Hotspot** (`public/assets/icons/kettle.png`):
  `[STYLE ANCHOR] A charming ceramic teapot in pastel butter yellow with a little rose flower painted on the side and a gentle swirl of steam, die-cut sticker format.`

---

## 10. Optional extras
- **Door sprites** (transparent, one per room) to replace emoji hotspots.
- **Cursor trail:** a tiny sparkle PNG (`objects/sparkle.png`, 128x128).
- **Seasonal variants:** `*-autumn.png` / `*-winter.png` if you extend the time system to seasons.
- **Favicon:** replace `src/app/icon.svg` with a crop of the cat or the cottage (512x512 PNG named `icon.png` also works).

## 10. Consistency checklist
- [ ] Same palette and brush texture in every image (re-use the anchor verbatim)
- [ ] Same camera (straight-on cutaway) for all six rooms
- [ ] Night image has identical layout to its day image
- [ ] No readable text or faces inside the art
- [ ] Doors, monitor, mailbox, etc. are clearly visible where the hotspots will sit
- [ ] Center-bottom of each scene stays uncluttered (tooltips and the mascot sit there)

---

## 11. Studio Interactive Desk Plant & Watering Can
Output directory: `public/assets/objects/`
- `studio-plant-tiny.png` (512x512, transparent PNG): Tiny baby sprout in pot
- `studio-plant-growing.png` (512x512, transparent PNG): Medium half-grown leafy plant in identical pot
- `studio-plant-full.png` (512x512, transparent PNG): Fully grown flourishing & blooming plant in identical pot
- `studio-watering-can.png` (512x512, transparent PNG): Cute pastel pink watering can

### 11.1 Plant Stage 1 - Tiny Sprout (`studio-plant-tiny.png`)
```
Soft whimsical storybook illustration, hand-painted gouache and watercolor texture with subtle paper grain, rounded chunky shapes, gentle pastel palette dominated by blush pink (#F9C6D3), cream (#FFF6EC), rose (#E86A92), sage green (#A9C7A0) and butter yellow (#FFE29A), warm soft lighting, tiny charming handmade details, cozy scrapbook feel, no text, no letters, no logos, no people.

A tiny baby indoor plant sprout emerging from rich dark potting soil. Two small, tender round pastel sage-green baby leaves on a delicate stem. Planted in a rounded miniature ceramic flowerpot in soft blush pink with a delicate scalloped fluted rim and tiny hand-painted heart motif.

Centered, slightly elevated 3/4 front angle tabletop perspective (approx. 25-degree downward tilt) matching a wooden studio desk. Isolated object on a solid plain flat white background, strictly no white outline, no sticker border, no white halo, no die-cut edge, natural organic painted edges, 512x512 square, high resolution, no ground shadow.
```

### 11.2 Plant Stage 2 - Half-Grown Foliage (`studio-plant-growing.png`)
```
Soft whimsical storybook illustration, hand-painted gouache and watercolor texture with subtle paper grain, rounded chunky shapes, gentle pastel palette dominated by blush pink (#F9C6D3), cream (#FFF6EC), rose (#E86A92), sage green (#A9C7A0) and butter yellow (#FFE29A), warm soft lighting, tiny charming handmade details, cozy scrapbook feel, no text, no letters, no logos, no people.

The exact same indoor houseplant in its middle growth stage. A healthy cluster of 5 to 6 rounded pastel sage-green leaves on tender stems spreading upward and outward from the soil. Planted inside the EXACT SAME rounded miniature ceramic flowerpot in soft blush pink with a scalloped fluted rim and tiny hand-painted heart motif.

Identical scale, pot size, and tabletop camera angle as Stage 1. Isolated object on a solid plain flat white background, strictly no white outline, no sticker border, no white halo, no die-cut edge, natural organic painted edges, 512x512 square, high resolution, no ground shadow.
```

### 11.3 Plant Stage 3 - Fully Grown & Blooming (`studio-plant-full.png`)
```
Soft whimsical storybook illustration, hand-painted gouache and watercolor texture with subtle paper grain, rounded chunky shapes, gentle pastel palette dominated by blush pink (#F9C6D3), cream (#FFF6EC), rose (#E86A92), sage green (#A9C7A0) and butter yellow (#FFE29A), warm soft lighting, tiny charming handmade details, cozy scrapbook feel, no text, no letters, no logos, no people.

The exact same indoor houseplant in full bloom and peak lushness. Bushy, vibrant pastel sage-green leaves cascading softly over the rim of the pot, crowned with 3 to 4 tiny blooming star-shaped blossoms in soft blush pink and butter yellow centers, with subtle soft fairy sparkles. Planted inside the EXACT SAME rounded miniature ceramic flowerpot in soft blush pink with a scalloped fluted rim and tiny hand-painted heart motif.

Identical scale, pot size, and tabletop camera angle as Stage 1 and Stage 2. Isolated object on a solid plain flat white background, strictly no white outline, no sticker border, no white halo, no die-cut edge, natural organic painted edges, 512x512 square, high resolution, no ground shadow.
```

### 11.4 Watering Can (`studio-watering-can.png`)
```
Soft whimsical storybook illustration, hand-painted gouache and watercolor texture with subtle paper grain, rounded chunky shapes, gentle pastel palette dominated by blush pink (#F9C6D3), cream (#FFF6EC), rose (#E86A92), sage green (#A9C7A0) and butter yellow (#FFE29A), warm soft lighting, tiny charming handmade details, cozy scrapbook feel, no text, no letters, no logos, no people.

A charming miniature vintage indoor watering can. Rounded barrel body in soft pastel rose-pink enamel with a tiny cream heart painted on the side, an elegant arched overhead handle, a slender curved pour spout pointing to the left, and a cute polished brass sprinkler rosette tip. Clean, delightful, whimsical retro aesthetic.

Side 3/4 perspective, slightly tilted forward ready to pour. Isolated object on a solid plain flat white background, strictly no white outline, no sticker border, no white halo, no die-cut edge, natural organic painted edges, 512x512 square, high resolution, no ground shadow, no water droplets drawn.
```

### 11.5 Single-Sheet 3-Stage Progression (Consistency Method for Midjourney / DALL-E)
```
Soft whimsical storybook illustration, hand-painted gouache and watercolor texture with subtle paper grain, rounded chunky shapes, gentle pastel palette dominated by blush pink (#F9C6D3), cream (#FFF6EC), rose (#E86A92), sage green (#A9C7A0) and butter yellow (#FFE29A), warm soft lighting, tiny charming handmade details, cozy scrapbook feel, no text, no letters, no logos, no people.

A horizontal sequence showing three stages of the same indoor potted houseplant growing, displayed side by side in a row against a solid plain white background:
- Left: Stage 1, a tiny cute green seedling sprout with two baby leaves in a small blush pink scalloped ceramic pot.
- Middle: Stage 2, the same plant grown into a healthy young plant with 5 rounded sage green leaves in the identical blush pink pot.
- Right: Stage 3, the same plant fully grown, lush, bushy with cascading leaves and tiny blooming pink and butter flowers in the identical blush pink pot.
All three pots are completely identical in size, design, and camera angle. Wide landscape 16:9 composition, isolated objects on a plain white background, strictly no white outlines, no sticker borders, no white halos.
```
