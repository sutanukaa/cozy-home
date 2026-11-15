// Usage: npm run assets:check
// Lists which generated assets are in place and which are still missing.
import { readFileSync, existsSync } from 'node:fs';

const assets = JSON.parse(readFileSync(new URL('../src/data/assets.json', import.meta.url), 'utf8'));
let missing = 0;
for (const a of assets) {
  const ok = existsSync(new URL('../' + a.path, import.meta.url));
  if (!ok) missing++;
  console.log(`${ok ? '✅' : '⬜'} ${a.path}  (${a.size})`);
}
console.log(`\n${assets.length - missing}/${assets.length} assets in place. The site works without them (placeholders show instead).`);
