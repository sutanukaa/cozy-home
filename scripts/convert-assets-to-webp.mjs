import { readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const ASSETS_DIR = new URL('../public/assets', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

async function processDirectory(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else if (extname(entry).toLowerCase() === '.png') {
      // Skip cursor files as standard browser CSS cursor requires PNG/cur
      if (entry.startsWith('cursor-')) continue;

      const webpPath = fullPath.replace(/\.png$/i, '.webp');
      const origSize = stat.size;

      try {
        await sharp(fullPath)
          .webp({ quality: 86, effort: 4 })
          .toFile(webpPath);

        const newSize = statSync(webpPath).size;
        const saved = ((1 - newSize / origSize) * 100).toFixed(1);
        console.log(`Converted: ${entry} | ${(origSize / 1024 / 1024).toFixed(2)} MB -> ${(newSize / 1024 / 1024).toFixed(2)} MB (${saved}% saved)`);
      } catch (err) {
        console.error(`Error converting ${entry}:`, err);
      }
    }
  }
}

console.log('Starting WebP conversion in:', ASSETS_DIR);
await processDirectory(ASSETS_DIR);
console.log('WebP conversion completed!');

