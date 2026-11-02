import { readFile, writeFile, mkdir, rename } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { digest, upsertEvents } from './contract.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const filename = process.argv[2];
if (!filename) throw new Error('Usage: npm run events:ingest -- /absolute/path/handoff.json [--allow-backfill]');
const input = JSON.parse(await readFile(filename, 'utf8'));
if (input.schema_version !== 1 || !Array.isArray(input.events)) throw new Error('Expected schema_version 1 and events array; see docs/events-publishing.md');
const directory = path.join(root, '.events-private');
await mkdir(directory, { recursive: true });
const store = path.join(directory, 'events.json');
let prior = { events: [], assets: {} };
try { prior = JSON.parse(await readFile(store, 'utf8')); } catch (error) { if (error.code !== 'ENOENT') throw error; }
const { events, results } = upsertEvents(prior.events, input.events, { allowBackfill: process.argv.includes('--allow-backfill') });
const assets = { ...prior.assets };
for (const event of input.events) {
  if (!event.hero.sha256) delete assets[event.event_key];
  if (event.heroAssetPath) {
    if (!path.isAbsolute(event.heroAssetPath)) throw new Error('Hero source must be an absolute local path');
    if (event.heroAssetPath.split(path.sep).includes('Badminton')) throw new Error('Protected source');
    const content = await readFile(event.heroAssetPath);
    if (digest(content) !== event.hero.sha256) throw new Error(`Hero hash mismatch for ${event.event_key}`);
    assets[event.event_key] = event.heroAssetPath;
  }
  if (!assets[event.event_key] && event.status === 'ready') throw new Error(`Missing heroAssetPath for ${event.event_key}`);
}
const now = new Date().toISOString();
const backup = path.join(directory, 'history');
await mkdir(backup, { recursive: true });
try { await writeFile(path.join(backup, `${Date.now()}-before.json`), await readFile(store)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
await writeFile(store + '.tmp', JSON.stringify({ schema_version: 1, updatedAtUTC: now, events, assets }, null, 2) + '\n');
await rename(store + '.tmp', store);
const receipt = { ingestedAtUTC: now, handoffSha256: digest(await readFile(filename)), results };
await writeFile(path.join(directory, 'last-ingestion.json'), JSON.stringify(receipt, null, 2) + '\n');
await writeFile(path.join(backup, `${Date.now()}-ingestion.json`), JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify(receipt, null, 2));
