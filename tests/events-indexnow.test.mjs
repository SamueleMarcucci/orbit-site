import test from 'node:test';
import assert from 'node:assert/strict';
import { notificationURLs, notifyIndexNow, INDEXNOW_KEY } from '../worker/indexnow.ts';
const due = Date.parse('2026-11-30T05:00:00Z');
const event = { event_key: 'future-key', slug: 'future-story', status: 'ready', publishAtUTC: new Date(due).toISOString(), availableFromUTC: new Date(due).toISOString(), firstPublishedAtUTC: null, dateModifiedUTC: null };
test('release notifications include eligible new URLs once in their nominal cron window', () => {
  assert.deepEqual(notificationURLs([event], due - 1), []);
  assert.equal(notificationURLs([event], due).length, 1);
  assert.deepEqual(notificationURLs([event], due + 15 * 60 * 1000), []);
  assert.deepEqual(notificationURLs([{ ...event, status: 'held' }], due), []);
});
test('changed and canceled public articles can notify without disclosing held drafts', () => {
  const updated = { ...event, firstPublishedAtUTC: new Date(due - 86400000).toISOString(), dateModifiedUTC: new Date(due).toISOString() };
  assert.equal(notificationURLs([updated], due).length, 1);
  assert.equal(notificationURLs([{ ...updated, status: 'canceled' }], due).length, 1);
  assert.deepEqual(notificationURLs([{ ...event, status: 'canceled' }], due), []);
});
test('IndexNow uses the existing property key and sends only the selected public URLs', async () => {
  const calls = [];
  const fetcher = async (url, init) => { calls.push({ url, init }); return new Response(init?.method === 'POST' ? '' : INDEXNOW_KEY, { status: 200 }); };
  const urls = ['https://www.liveorbitapp.com/events/example/'];
  const result = await notifyIndexNow(urls, fetcher);
  assert.equal(result.status, 200);
  assert.equal(calls.length, 2);
  assert.deepEqual(JSON.parse(calls[1].init.body).urlList, urls);
  assert.equal(JSON.parse(calls[1].init.body).host, 'www.liveorbitapp.com');
});
test('no search request is sent for an empty window; missing ownership proof fails closed', async () => {
  let calls = 0;
  await notifyIndexNow([], async () => { calls++; return new Response(''); });
  assert.equal(calls, 0);
  await assert.rejects(notifyIndexNow(['https://www.liveorbitapp.com/events/example/'], async () => { calls++; return new Response('wrong'); }), /ownership key/);
  assert.equal(calls, 1);
});
