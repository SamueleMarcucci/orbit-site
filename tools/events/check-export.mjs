import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
const store = JSON.parse(await readFile('.events-private/events.json', 'utf8'));
const forbidden = store.events.flatMap(event => [event.intro, ...event.sections.flatMap(section => section.paragraphs)]);
let files = 0;
async function walk(dir) {
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, item.name);
    if (item.isDirectory()) { await walk(file); continue; }
    const bytes = await readFile(file);
    for (const text of forbidden) if (bytes.includes(Buffer.from(text))) throw new Error(`Private article leaked into static export: ${file}`);
    if (file.startsWith('out/events/')) throw new Error(`Event route must not be exported statically: ${file}`);
    files++;
  }
}
await walk('out');
console.log(`Static export privacy check passed: ${files} files, no event bodies or event routes.`);
