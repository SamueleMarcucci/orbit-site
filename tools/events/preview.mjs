// Local-only preview. The production entrypoint never imports this file.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHandler } from '../../worker/handler.ts';
const root = fileURLToPath(new URL('../../', import.meta.url));
const store = JSON.parse(await readFile(path.join(root, '.events-private/events.json'), 'utf8'));
const now = process.env.EVENTS_PREVIEW_UTC ? Date.parse(process.env.EVENTS_PREVIEW_UTC) : Date.now();
const events = structuredClone(store.events);
if (process.argv.includes('--launch-preview')) {
  for (const event of events) {
    if (event.status === 'held' && event.hero.sha256 && Date.parse(event.publishAtUTC) <= now) {
      event.status = 'ready';
      event.availableFromUTC = new Date(now).toISOString();
    }
  }
}
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
async function fileResponse(directory, pathname) {
  let filename = path.resolve(directory, '.' + decodeURIComponent(pathname));
  if (!filename.startsWith(directory + path.sep) && filename !== directory) return new Response('Not found', { status: 404 });
  try {
    if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html');
    return new Response(await readFile(filename), { headers: { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream' } });
  } catch { return new Response('Not found', { status: 404 }); }
}
const fetchUpstream = async url => fileResponse(path.join(root, 'out'), new URL(url).pathname.replace(/^\/orbit-site/, '') || '/');
const env = { EVENT_ASSETS: { fetch: async request => fileResponse(path.join(root, '.event-assets'), new URL(request.url).pathname) } };
const handle = createHandler(events, { now: () => now, fetchUpstream, revision: 'local-preview' });
createServer(async (request, response) => {
  try {
    const result = await handle(new Request(`http://127.0.0.1:4381${request.url}`, { method: request.method, headers: request.headers }), env);
    response.writeHead(result.status, { ...Object.fromEntries(result.headers), 'X-Robots-Tag': 'noindex, nofollow' });
    response.end(Buffer.from(await result.arrayBuffer()));
  } catch (error) {
    console.error(error);
    response.writeHead(500); response.end('Preview error');
  }
}).listen(4381, '127.0.0.1', () => console.log('Events local preview: http://127.0.0.1:4381/events/; clock=' + new Date(now).toISOString()));
