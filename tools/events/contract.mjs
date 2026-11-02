import { createHash } from 'node:crypto';

const DAY = 86400000;
const requiredText = ['event_key', 'slug', 'title', 'description', 'eventId', 'scheduleBasis', 'intro'];
const categories = ['Anniversary', 'Mission watch', 'Observing', 'Space weather'];
const statuses = ['ready', 'held', 'canceled'];
export const digest = value => createHash('sha256').update(typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value)).digest('hex');

function iso(value, name) {
  if (typeof value !== 'string' || !/(Z|\+00:00)$/.test(value) || !Number.isFinite(Date.parse(value))) throw new Error(`${name} must be a UTC ISO timestamp`);
  return new Date(value).toISOString();
}
function https(value) { return typeof value === 'string' && new URL(value).protocol === 'https:'; }

export function normalizeEvent(input) {
  const event = structuredClone(input);
  for (const key of requiredText) if (typeof event[key] !== 'string' || !event[key].trim()) throw new Error(`Missing ${key}`);
  if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{2,100}$/.test(event.event_key)) throw new Error('Invalid event_key');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(event.slug) || ['media', 'assets', 'index', 'feed', 'sitemap'].includes(event.slug)) throw new Error('Invalid or reserved slug');
  if (!Number.isInteger(event.revision) || event.revision < 1) throw new Error('revision must be a positive integer');
  if (!categories.includes(event.category) || !statuses.includes(event.status)) throw new Error('Invalid category/status');
  try { new Intl.DateTimeFormat('en-US', { timeZone: event.timezone }).format(); } catch { throw new Error('Invalid IANA timezone'); }
  for (const key of ['startUTC', 'endUTC', 'scheduleVerifiedAtUTC', 'sourceCheckedAtUTC']) event[key] = iso(event[key], key);
  if (Date.parse(event.endUTC) <= Date.parse(event.startUTC)) throw new Error('Event must end after it starts');
  const due = new Date(Date.parse(event.startUTC) - DAY).toISOString();
  if (event.publishAtUTC && iso(event.publishAtUTC, 'publishAtUTC') !== due) throw new Error('publishAtUTC must equal startUTC minus exactly 86400 seconds');
  event.publishAtUTC = due;
  for (const key of ['availableFromUTC', 'firstPublishedAtUTC', 'dateModifiedUTC']) event[key] = event[key] ? iso(event[key], key) : null;
  if (event.availableFromUTC && Date.parse(event.availableFromUTC) < Date.parse(due)) throw new Error('Availability cannot precede publishAtUTC');
  if (event.status === 'ready' && !event.availableFromUTC) throw new Error('Ready event requires availableFromUTC');
  if (!event.hero?.alt || !event.hero.caption || (event.hero.sha256 !== null && !/^[a-f0-9]{64}$/.test(event.hero.sha256))) throw new Error('Hero alt, illustration caption and SHA256 are required');
  if (event.status === 'ready' && !event.hero.sha256) throw new Error('Ready event requires approved artwork');
  if (!event.hero.caption.toLowerCase().includes('illustration')) throw new Error('Identify editorial artwork as illustration');
  event.hero = { alt: event.hero.alt, caption: event.hero.caption, sha256: event.hero.sha256 };
  if (!Array.isArray(event.sections) || !event.sections.length || event.sections.some(section => !section.heading || !section.paragraphs?.length || section.paragraphs.some(p => typeof p !== 'string' || !p.trim()))) throw new Error('Article sections are required');
  if (!Array.isArray(event.sources) || !event.sources.length || event.sources.some(source => !source.title || !https(source.url))) throw new Error('HTTPS primary source citations are required');
  if (!Array.isArray(event.relatedGuides) || event.relatedGuides.some(guide => !guide.title || !/^\/guides\/[a-z0-9-]+\/$/.test(guide.path))) throw new Error('Invalid related guides');
  if (!Array.isArray(event.relatedEventKeys) || event.relatedEventKeys.some(key => typeof key !== 'string')) throw new Error('Invalid related events');
  event.corrections ||= [];
  for (const correction of event.corrections) {
    correction.atUTC = iso(correction.atUTC, 'correction.atUTC');
    if (!correction.note || !https(correction.sourceUrl)) throw new Error('Correction needs note and source URL');
  }
  // Input file paths, handoff commentary and local approvals are never bundled.
  return Object.fromEntries(['event_key', 'revision', 'slug', 'title', 'description', 'category', 'status', 'eventId', 'startUTC', 'endUTC', 'timezone', 'scheduleBasis', 'scheduleVerifiedAtUTC', 'publishAtUTC', 'availableFromUTC', 'firstPublishedAtUTC', 'dateModifiedUTC', 'sourceCheckedAtUTC', 'hero', 'intro', 'sections', 'sources', 'relatedGuides', 'relatedEventKeys', 'corrections'].map(key => [key, event[key]]));
}

function release(event) { return event.firstPublishedAtUTC ? Date.parse(event.firstPublishedAtUTC) : event.availableFromUTC ? Math.max(Date.parse(event.publishAtUTC), Date.parse(event.availableFromUTC)) : Infinity; }
function wasPublic(event, now) { return event.status === 'ready' && release(event) <= now; }

export function upsertEvents(existing, inputs, { now = Date.now(), allowBackfill = false } = {}) {
  const events = existing.map(normalizeEvent);
  const results = [];
  for (const input of inputs) {
    const event = normalizeEvent(input);
    for (const key of ['scheduleVerifiedAtUTC', 'sourceCheckedAtUTC', 'dateModifiedUTC']) {
      if (event[key] && Date.parse(event[key]) > now) throw new Error(`${key} cannot claim a future verification/modification`);
    }
    if (event.corrections.some(correction => Date.parse(correction.atUTC) > now)) throw new Error('Correction provenance cannot be dated in the future');
    const index = events.findIndex(prior => prior.event_key === event.event_key);
    const prior = events[index];
    if (events.some(other => other.event_key !== event.event_key && (other.slug === event.slug || other.eventId === event.eventId))) throw new Error(`Duplicate slug/eventId for ${event.event_key}`);
    if (prior) {
      if (prior.slug !== event.slug || prior.eventId !== event.eventId) throw new Error('Stable event_key must preserve slug and eventId');
      if (event.revision === prior.revision) {
        event.firstPublishedAtUTC ||= prior.firstPublishedAtUTC;
        event.dateModifiedUTC ||= prior.dateModifiedUTC;
      }
      if (digest(prior) === digest(event)) { results.push({ event_key: event.event_key, result: 'duplicate_ignored', revision: prior.revision }); continue; }
      if (event.revision <= prior.revision) throw new Error(`Revision conflict for ${event.event_key}`);
      if (wasPublic(prior, now) || prior.firstPublishedAtUTC) {
        const published = prior.firstPublishedAtUTC || new Date(release(prior)).toISOString();
        if (event.firstPublishedAtUTC && event.firstPublishedAtUTC !== published) throw new Error('Cannot rewrite datePublished');
        event.firstPublishedAtUTC = published;
        event.dateModifiedUTC = new Date(now).toISOString();
        if (!event.corrections.length || digest(event.corrections) === digest(prior.corrections)) throw new Error('A changed public article needs new correction provenance');
      } else if (prior.startUTC !== event.startUTC && event.status === 'ready' && Date.parse(event.publishAtUTC) > now) {
        event.availableFromUTC = event.publishAtUTC;
      }
    } else if (event.firstPublishedAtUTC) {
      throw new Error('A new article cannot claim a previous publication');
    }
    if (!event.firstPublishedAtUTC && event.status === 'ready' && Date.parse(event.publishAtUTC) <= now && !wasPublic(prior || { status: 'held' }, now)) {
      if (!allowBackfill || Date.parse(event.availableFromUTC) < now) throw new Error('Late publication needs explicit backfill authorization and a future activation time');
    }
    if (prior) events[index] = event; else events.push(event);
    results.push({ event_key: event.event_key, result: prior ? 'updated' : 'created', revision: event.revision });
  }
  return { events, results };
}
