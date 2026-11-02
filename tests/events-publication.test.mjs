import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler } from '../worker/handler.ts';
import { isPublic, DAY_MS, publishedAt } from '../worker/model.ts';
import { articleSchema } from '../worker/render.ts';
import { upsertEvents, normalizeEvent } from '../tools/events/contract.mjs';

const start = '2026-11-02T05:00:00.000Z';
const due = '2026-11-01T05:00:00.000Z'; // 01:00 EDT, not local midnight, across DST.
const make = (override = {}) => normalizeEvent({ event_key: 'fixture-2026', eventId: '999999', revision: 1, slug: 'fixture-story', title: 'Private fixture title', description: 'Private fixture summary', category: 'Mission watch', status: 'ready', startUTC: start, endUTC: '2026-11-09T05:00:00.000Z', timezone: 'America/New_York', scheduleBasis: 'An editorial watch; this is not a launch date.', scheduleVerifiedAtUTC: '2026-10-29T12:00:00Z', publishAtUTC: due, availableFromUTC: due, firstPublishedAtUTC: null, dateModifiedUTC: null, sourceCheckedAtUTC: '2026-10-29T12:00:00Z', hero: { alt: 'Illustrated satellite', caption: 'Editorial illustration, not an observation.', sha256: 'a'.repeat(64) }, intro: 'Private fixture article body', sections: [{ heading: 'Private fixture heading', paragraphs: ['Private fixture paragraph.'] }], sources: [{ title: 'Example operator', url: 'https://example.com/mission' }], relatedGuides: [{ title: 'Seeing the ISS', path: '/guides/how-to-see-iss/' }], relatedEventKeys: [], corrections: [], ...override });
const env = { EVENT_ASSETS: { fetch: async () => new Response('fixture image bytes', { headers: { 'Content-Type': 'image/webp' } }) } };
const origin = 'https://www.liveorbitapp.com';
const upstream = async () => new Response('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://www.liveorbitapp.com/guides/how-to-see-iss/</loc><lastmod>2026-10-25</lastmod></url></urlset>', { headers: { 'Content-Type': 'application/xml' } });

test('UTC subtraction stays exactly 86400 seconds across fall and spring DST', () => {
  for (const startUTC of [start, '2026-03-09T04:00:00.000Z', '2026-11-09T05:00:00.000Z']) {
    const endUTC = new Date(Date.parse(startUTC) + DAY_MS * 7).toISOString();
    const event = make({ startUTC, endUTC, publishAtUTC: null, availableFromUTC: null, status: 'held' });
    assert.equal(Date.parse(startUTC) - Date.parse(event.publishAtUTC), DAY_MS);
  }
  const local = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric' }).format(new Date(due));
  assert.equal(local, '1 AM');
});

test('future story becomes eligible at the exact server boundary', () => {
  const event = make();
  const boundary = Date.parse(due);
  assert.equal(isPublic(event, boundary - 1), false);
  assert.equal(isPublic(event, boundary), true);
  assert.equal(isPublic(event, boundary + 1), true);
});

for (const suffix of ['fixture-story/', 'fixture-story', 'fixture-story/index.html', 'fixture-story.html', 'fixture-story.json', 'fixture-story.txt', 'media/fixture-story/2400.webp', 'media/fixture-story/1536.webp', 'media/fixture-story/768.webp', 'media/fixture-story/2400.webp.json', 'data.json', 'index.html', '%66ixture-story/', 'fixture-story%2F', 'fixture-story//']) {
  test(`embargo blocks route or alias /events/${suffix}`, async () => {
    const handle = createHandler([make()], { now: () => Date.parse(due) - 1 });
    const response = await handle(new Request(origin + '/events/' + suffix), env);
    assert.equal(response.status, 404);
    assert.match(response.headers.get('Cache-Control'), /no-store/);
    assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
    const body = await response.text();
    assert.doesNotMatch(body, /Private fixture|fixture image bytes/);
  });
}

for (const path of ['/events/', '/events/feed.xml', '/events/sitemap.xml', '/sitemap.xml']) {
  test(`embargo excludes entries and body from ${path}`, async () => {
    const handle = createHandler([make()], { now: () => Date.parse(due) - 1, fetchUpstream: upstream });
    const response = await handle(new Request(origin + path), env);
    assert.equal(response.status, 200);
    assert.match(response.headers.get('Cache-Control'), /no-store/);
    const body = await response.text();
    assert.doesNotMatch(body, /fixture-story|Private fixture/);
    if (path === '/sitemap.xml') assert.match(body, /how-to-see-iss/);
  });
  test(`eligible story appears at boundary in ${path}`, async () => {
    const handle = createHandler([make()], { now: () => Date.parse(due), fetchUpstream: upstream });
    const response = await handle(new Request(origin + path), env);
    assert.equal(response.status, 200);
    assert.match(await response.text(), /fixture-story/);
  });
}

test('public article SSR, schema, image and HEAD agree', async () => {
  const handle = createHandler([make()], { now: () => Date.parse(due) });
  const response = await handle(new Request(origin + '/events/fixture-story/'), env);
  assert.equal(response.status, 200);
  const body = await response.text();
  assert.match(body, /Private fixture paragraph/);
  assert.match(body, /"@type":"BlogPosting"/);
  assert.doesNotMatch(body, /"@type":"Event"/);
  assert.match(body, /max-image-preview:large/);
  assert.match(body, /<link rel="canonical" href="https:\/\/www\.liveorbitapp\.com\/events\/fixture-story\/"/);
  const image = await handle(new Request(origin + '/events/media/fixture-story/2400.webp'), env);
  assert.equal(image.status, 200);
  assert.equal(await image.text(), 'fixture image bytes');
  const head = await handle(new Request(origin + '/events/fixture-story/', { method: 'HEAD' }), env);
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('X-Published-At'), due);
  assert.equal(await head.text(), '');
});

test('a browser clock, preview param, RSC header or cookie cannot advance publication', async () => {
  const handle = createHandler([make()], { now: () => Date.parse(due) - 1 });
  const response = await handle(new Request(origin + '/events/fixture-story/?now=2099-01-01&preview=true&_rsc=test', { headers: { 'X-Now': '2099-01-01', RSC: '1', Cookie: 'preview=true' } }), env);
  assert.equal(response.status, 404);
  assert.doesNotMatch(await response.text(), /Private fixture/);
});

test('held, canceled and uninitialized drafts stay private even after their start', async () => {
  for (const status of ['held', 'canceled']) {
    const event = make({ status });
    const handle = createHandler([event], { now: () => Date.parse(start) + DAY_MS });
    for (const path of ['/events/fixture-story/', '/events/media/fixture-story/2400.webp']) assert.equal((await handle(new Request(origin + path), env)).status, 404);
    for (const path of ['/events/', '/events/feed.xml', '/events/sitemap.xml']) assert.doesNotMatch(await (await handle(new Request(origin + path), env)).text(), /Private fixture|fixture-story/);
  }
  assert.equal(isPublic(make({ status: 'held', availableFromUTC: null }), Date.parse(start) + DAY_MS), false);
});

test('duplicate ingestion is idempotent; key, event ID and slug cannot duplicate articles', () => {
  const event = make();
  const once = upsertEvents([], [event], { now: Date.parse(due) - 1000 });
  const twice = upsertEvents(once.events, [event], { now: Date.parse(due) - 1000 });
  assert.equal(twice.events.length, 1);
  assert.equal(twice.results[0].result, 'duplicate_ignored');
  assert.throws(() => upsertEvents([event], [make({ event_key: 'different-key' })]), /Duplicate/);
  assert.throws(() => upsertEvents([event], [make({ title: 'Changed title' })]), /Revision conflict/);
});

test('schedule shifts replace a future release time; the old boundary stays closed', () => {
  const event = make();
  const change = make({ revision: 2, startUTC: '2026-11-04T05:00:00Z', publishAtUTC: '2026-11-03T05:00:00Z', availableFromUTC: '2026-11-03T05:00:00Z' });
  const result = upsertEvents([event], [change], { now: Date.parse(due) - 1000 });
  assert.equal(result.events.length, 1);
  assert.equal(isPublic(result.events[0], Date.parse(due)), false);
  assert.equal(isPublic(result.events[0], Date.parse('2026-11-03T05:00:00Z')), true);
});

test('published corrections preserve datePublished and show new modification provenance', () => {
  const prior = make();
  const now = Date.parse(start);
  assert.throws(() => upsertEvents([prior], [make({ revision: 2, title: 'Corrected title' })], { now }), /correction provenance/);
  const correction = { atUTC: start, note: 'Operator changed its target.', sourceUrl: 'https://example.com/update' };
  const changed = make({ revision: 2, title: 'Corrected title', startUTC: '2026-11-06T05:00:00Z', endUTC: '2026-11-13T05:00:00Z', publishAtUTC: '2026-11-05T05:00:00Z', availableFromUTC: '2026-11-05T05:00:00Z', corrections: [correction] });
  const result = upsertEvents([prior], [changed], { now }).events[0];
  assert.equal(publishedAt(result), due);
  assert.equal(result.dateModifiedUTC, start);
  assert.equal(isPublic(result, now), true);
  const article = articleSchema(result).find(item => item['@type'] === 'BlogPosting');
  assert.equal(article.datePublished, due);
  assert.equal(article.dateModified, start);
  assert.equal(upsertEvents([result], [changed], { now: now + 1000 }).results[0].result, 'duplicate_ignored');
});

test('wrong day subtraction and invented historical publication are rejected', () => {
  assert.throws(() => make({ publishAtUTC: '2026-11-01T04:00:00Z' }), /86400/);
  assert.throws(() => upsertEvents([], [make({ firstPublishedAtUTC: due })]), /previous publication/);
  assert.throws(() => upsertEvents([make()], [make({ revision: 2, firstPublishedAtUTC: '2026-10-30T05:00:00Z' })], { now: Date.parse(due) - 1000 }), /Unpublished article/);
  assert.throws(() => make({ timezone: undefined }), /IANA timezone/);
  assert.throws(() => upsertEvents([], [make()], { now: Date.parse(start) }), /backfill/);
  const activation = '2026-11-02T06:00:00Z';
  const event = make({ availableFromUTC: activation });
  const result = upsertEvents([], [event], { now: Date.parse(start), allowBackfill: true });
  assert.equal(isPublic(result.events[0], Date.parse(activation) - 1), false);
  assert.equal(publishedAt(result.events[0]), '2026-11-02T06:00:00.000Z');
});

test('held artwork cannot become ready without a reviewed hero; future verification dates are rejected', () => {
  const held = make({ status: 'held', availableFromUTC: null, hero: { alt: 'Pending illustration', caption: 'Editorial illustration pending approval.', sha256: null } });
  assert.equal(held.hero.sha256, null);
  assert.throws(() => make({ ...held, status: 'ready', availableFromUTC: due }), /approved artwork/);
  assert.throws(() => upsertEvents([], [make({ sourceCheckedAtUTC: '2099-01-01T00:00:00Z' })], { now: Date.parse(due) - 1000 }), /future verification/);
});

test('internal binding paths and unrecognized image variants cannot read staged assets', async () => {
  let calls = 0;
  const binding = { EVENT_ASSETS: { fetch: async () => { calls++; return new Response('should not read'); } } };
  const handle = createHandler([make()], { now: () => Date.parse(due) - 1 });
  for (const path of ['/.event-assets/events/media/fixture-story/2400.webp', '/.events-private/events.json', '/.generated/events-data.ts', '/worker/index.js.map', '/events/media/fixture-story/3840.png']) assert.equal((await handle(new Request(origin + path), binding)).status, 404);
  assert.equal(calls, 0);
});

test('non-Events proxy preserves routes, canonical redirects, headers and streaming behavior', async () => {
  const calls = [];
  const fetchUpstream = async (url, init) => { calls.push([url.toString(), init]); return new Response('<h1>Original homepage</h1>', { headers: { 'Content-Type': 'text/html', 'X-Original': 'yes' } }); };
  const handle = createHandler([], { fetchUpstream });
  const response = await handle(new Request(origin + '/?ref=example'), env);
  assert.equal(await response.text(), '<h1>Original homepage</h1>');
  assert.equal(calls[0][0], 'https://samuelemarcucci.github.io/orbit-site/?ref=example');
  assert.equal(response.headers.get('Cache-Control'), 'no-cache, must-revalidate');
  assert.equal(response.headers.get('X-Original'), 'yes');
  const redirect = await handle(new Request(origin + '/privacy'), env);
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get('Location'), origin + '/privacy/');
});

test('origin sitemap failure does not replace the existing sitemap with an incomplete list', async () => {
  const handle = createHandler([make()], { fetchUpstream: async () => new Response('unavailable', { status: 503 }) });
  assert.equal((await handle(new Request(origin + '/sitemap.xml'), env)).status, 503);
});

test('HTML and JSON-LD escape untrusted article strings', async () => {
  const event = make({ title: '</script><script>alert(1)</script>', intro: '<img onerror=alert(1)>' });
  const handle = createHandler([event], { now: () => Date.parse(due) });
  const html = await (await handle(new Request(origin + '/events/fixture-story/'), env)).text();
  assert.doesNotMatch(html, /<script>alert|<img onerror/);
  assert.match(html, /&lt;img onerror/);
});
