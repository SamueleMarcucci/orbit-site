import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { isPublic, eventPath, heroPath, publishedAt, modifiedAt, SITE } from '../../worker/model.ts';

const root = fileURLToPath(new URL('../../', import.meta.url));
const store = JSON.parse(await readFile(path.join(root, '.events-private/events.json'), 'utf8'));
const base = process.env.EVENTS_VERIFY_BASE || SITE;
const now = Date.now();
const checkedAtUTC = new Date(now).toISOString();
const checks = [];
const receipts = [];
async function get(route, expected, { privateEvent, image = false, origin = base } = {}) {
  const response = await fetch(origin + route, { redirect: 'manual', cache: 'no-store' });
  const body = image && response.ok ? Buffer.from(await response.arrayBuffer()) : await response.text();
  if (response.status !== expected) throw new Error(`${origin}${route}: expected ${expected}, got ${response.status}`);
  if (route.startsWith('/events/') && origin === base && !response.headers.get('Cache-Control')?.includes('no-store')) throw new Error(`${route}: missing no-store`);
  if (privateEvent && (String(body).includes(privateEvent.title) || String(body).includes(privateEvent.intro))) throw new Error(`${route}: embargo leak`);
  if (image && response.ok && (!response.headers.get('Content-Type')?.includes('image/webp') || body.subarray(8, 12).toString() !== 'WEBP')) throw new Error(`${route}: invalid image`);
  checks.push({ url: origin + route, status: response.status, cacheControl: response.headers.get('Cache-Control') });
  return { response, body };
}
const index = await get('/events/', 200);
const feed = await get('/events/feed.xml', 200);
const sitemap = await get('/events/sitemap.xml', 200);
const combined = await get('/sitemap.xml', 200);
for (const required of ['/guides/how-to-see-iss/', '/privacy/', '/tools/satellite-visibility/']) if (!combined.body.includes(SITE + required)) throw new Error('Existing sitemap route lost: ' + required);
for (const event of store.events) {
  const eligible = isPublic(event, now);
  const article = await get(eventPath(event), eligible ? 200 : 404, { privateEvent: eligible ? undefined : event });
  for (const width of [768, 1536, 2400]) await get(heroPath(event, width), eligible ? 200 : 404, { image: true, privateEvent: eligible ? undefined : event });
  for (const collection of [index, feed, sitemap, combined]) {
    if (eligible && !collection.body.includes(SITE + eventPath(event)) && !collection.body.includes(`href="${eventPath(event)}"`)) throw new Error('Missing public collection entry: ' + event.event_key);
    if (!eligible && (collection.body.includes(eventPath(event)) || collection.body.includes(event.title) || collection.body.includes(event.intro))) throw new Error('Private collection entry: ' + event.event_key);
  }
  if (eligible) {
    if (!article.body.includes(event.intro) || !article.body.includes('max-image-preview:large')) throw new Error('Missing crawlable article content or robots');
    if (!article.body.includes(`<link rel="canonical" href="${SITE}${eventPath(event)}">`)) throw new Error('Canonical mismatch');
    const schemaMatch = article.body.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
    const graph = JSON.parse(schemaMatch[1])['@graph'];
    const posting = graph.find(node => node['@type'] === 'BlogPosting');
    if (!posting || posting.datePublished !== publishedAt(event) || posting.dateModified !== modifiedAt(event)) throw new Error('Publication schema mismatch');
    if (!graph.some(node => node['@type'] === 'BreadcrumbList') || graph.some(node => node['@type'] === 'Event')) throw new Error('Incorrect schema type');
    for (const source of event.sources) if (!article.body.includes(source.url.replaceAll('&', '&amp;'))) throw new Error('Missing visible source');
  } else {
    for (const suffix of ['index.html', 'data.json', '?preview=true&now=2099-01-01']) await get(eventPath(event) + suffix, 404, { privateEvent: event });
    await get(`/events/${event.slug}.html`, 404, { privateEvent: event });
    if (base === SITE) {
      await get(eventPath(event), 404, { privateEvent: event, origin: 'https://samuelemarcucci.github.io/orbit-site' });
      await get(heroPath(event, 2400), 404, { privateEvent: event, origin: 'https://samuelemarcucci.github.io/orbit-site' });
    }
  }
  receipts.push({ event_key: event.event_key, revision: event.revision, eventId: event.eventId, title: event.title, startUTC: event.startUTC, endUTC: event.endUTC, timezone: event.timezone, scheduleBasis: event.scheduleBasis, scheduleVerifiedAtUTC: event.scheduleVerifiedAtUTC, publishAtUTC: event.publishAtUTC, availabilityAtUTC: event.availableFromUTC, state: eligible ? 'published_verified' : event.status === 'held' ? 'held' : event.status === 'canceled' ? 'canceled' : 'scheduled_embargo_verified', publicURL: eligible ? SITE + eventPath(event) : null, plannedURL: SITE + eventPath(event), publishedAtUTC: eligible ? publishedAt(event) : event.firstPublishedAtUTC, publicationVerifiedAtUTC: eligible ? checkedAtUTC : null, embargoVerifiedAtUTC: eligible ? null : checkedAtUTC, heroSha256: event.hero.sha256, sourceCitations: event.sources.map(source => source.url) });
}
for (const route of ['/events/data.json', '/events/index.html', '/.generated/events-data.ts', '/.events-private/events.json', '/worker/index.js.map']) await get(route, 404);
const receipt = { schema_version: 1, publisherThreadId: '01a19ab0-ad2d-7cd1-af0a-f671f23aa341', verifiedAtUTC: checkedAtUTC, base, checksPassed: checks.length, events: receipts, checks };
const output = path.join(root, 'publishing');
await mkdir(output, { recursive: true });
await writeFile(path.join(output, 'receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
await mkdir(path.join(root, '.codex-artifacts/events/2026-11-02'), { recursive: true });
for (const [name, content] of [['events-index.html', index.body], ['feed.xml', feed.body], ['events-sitemap.xml', sitemap.body], ['combined-sitemap.xml', combined.body]]) await writeFile(path.join(root, '.codex-artifacts/events/2026-11-02', name), content);
console.log(JSON.stringify({ verifiedAtUTC: checkedAtUTC, checksPassed: checks.length, published: receipts.filter(e => e.state === 'published_verified').length, futureOrHeld: receipts.filter(e => e.state !== 'published_verified').length, receipt: path.join(output, 'receipt.json') }, null, 2));
