import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { digest, normalizeEvent } from './contract.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const store = JSON.parse(await readFile(path.join(root, '.events-private/events.json'), 'utf8'));
const events = store.events.map(normalizeEvent);
const generated = path.join(root, '.generated');
await mkdir(generated, { recursive: true });
const contentDigest = digest(events).slice(0, 16);
await writeFile(path.join(generated, 'events-data.ts'), `// Private server bundle. Never commit, export through Next, or publish as an asset.\nimport type { EventRecord } from '../worker/model.ts';\nexport const contentDigest = ${JSON.stringify(contentDigest)};\nexport const events: EventRecord[] = ${JSON.stringify(events, null, 2)};\n`);
const assets = path.join(root, '.event-assets/events');
await mkdir(path.join(assets, 'assets'), { recursive: true });
await copyFile(path.join(root, 'app/fonts/instrument-sans.woff2'), path.join(assets, 'assets/instrument-sans.woff2'));
await copyFile(path.join(root, 'app/fonts/OFL.txt'), path.join(assets, 'assets/OFL.txt'));
const sizes = [];
for (const event of events) {
  if (!store.assets[event.event_key]) {
    if (event.status === 'ready') throw new Error(`Ready article is missing artwork: ${event.event_key}`);
    continue;
  }
  const original = await readFile(store.assets[event.event_key]);
  if (digest(original) !== event.hero.sha256) throw new Error(`Source hero changed for ${event.event_key}; ingest a reviewed revision first`);
  const metadata = await sharp(original).metadata();
  if (metadata.width !== 3840 || metadata.height !== 2160) throw new Error('Use the current clean 3840x2160 hero export');
  const dir = path.join(assets, 'media', event.slug);
  await mkdir(dir, { recursive: true });
  for (const width of [768, 1536, 2400]) {
    const output = path.join(dir, `${width}.webp`);
    await sharp(original).resize(width).webp({ quality: 87, effort: 5 }).toFile(output);
    sizes.push({ event_key: event.event_key, width, bytes: (await readFile(output)).length });
  }
}
await writeFile(path.join(generated, 'prepare-receipt.json'), JSON.stringify({ preparedAtUTC: new Date().toISOString(), contentDigest, eventCount: events.length, assets: sizes }, null, 2) + '\n');
console.log(JSON.stringify({ contentDigest, events: events.length, images: sizes.length, totalImageBytes: sizes.reduce((sum, file) => sum + file.bytes, 0) }));
