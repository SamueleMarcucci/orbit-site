export type EventStatus = "ready" | "held" | "canceled";
export interface EventRecord {
  event_key: string;
  revision: number;
  slug: string;
  title: string;
  description: string;
  category: "Anniversary" | "Mission watch" | "Observing" | "Space weather";
  status: EventStatus;
  eventId: string;
  startUTC: string;
  endUTC: string;
  timezone: string;
  scheduleBasis: string;
  scheduleVerifiedAtUTC: string;
  publishAtUTC: string;
  availableFromUTC: string | null;
  firstPublishedAtUTC: string | null;
  dateModifiedUTC: string | null;
  sourceCheckedAtUTC: string;
  hero: { alt: string; caption: string; sha256: string | null };
  intro: string;
  sections: Array<{ heading: string; paragraphs: string[] }>;
  sources: Array<{ title: string; url: string; date?: string }>;
  relatedGuides: Array<{ title: string; path: string }>;
  relatedEventKeys: string[];
  corrections: Array<{ atUTC: string; note: string; sourceUrl: string }>;
}

export const SITE = "https://www.liveorbitapp.com";
export const APP_STORE = "https://apps.apple.com/us/app/live-orbit/id6794325315";
export const DAY_MS = 86400 * 1000;
export const eventPath = (event: Pick<EventRecord, "slug">) => `/events/${event.slug}/`;
export const heroPath = (event: Pick<EventRecord, "slug">, width = 1536) => `/events/media/${event.slug}/${width}.webp`;

export function releaseTime(event: EventRecord): number {
  // An explicit availability time is required. A draft can never publish by accident.
  if (event.firstPublishedAtUTC) return Date.parse(event.firstPublishedAtUTC);
  return event.availableFromUTC ? Math.max(Date.parse(event.publishAtUTC), Date.parse(event.availableFromUTC)) : Infinity;
}

export function isPublic(event: EventRecord, now: number): boolean {
  return event.status === "ready" && Number.isFinite(releaseTime(event)) && now >= releaseTime(event);
}

export function publishedEvents(events: EventRecord[], now: number): EventRecord[] {
  return events.filter(event => isPublic(event, now)).sort((a, b) => releaseTime(b) - releaseTime(a) || a.slug.localeCompare(b.slug));
}

export function watchStatus(event: EventRecord, now: number): string {
  if (now >= Date.parse(event.endUTC)) return "Archive";
  if (now < Date.parse(event.startUTC)) return "Coming up";
  return event.category === "Mission watch" ? "On watch" : "Happening now";
}

export function publishedAt(event: EventRecord): string {
  return new Date(releaseTime(event)).toISOString();
}

export function modifiedAt(event: EventRecord): string {
  return event.dateModifiedUTC || publishedAt(event);
}

export function escapeHTML(value: string): string {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}

export function jsonLd(value: object): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");
}
