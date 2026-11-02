import { SITE, eventPath, isPublic, modifiedAt, publishedAt, type EventRecord } from "./model.ts";

// This is the existing, public ownership-verification key, not a credential.
export const INDEXNOW_KEY = "5ad52370e4495937de86d267a6551b9de46740c1e533e7e131733b67cde793e5";
export const INDEXNOW_ORIGIN_KEY_URL = `https://samuelemarcucci.github.io/orbit-site/${INDEXNOW_KEY}.txt`;
export function notificationURLs(events: EventRecord[], scheduledTime: number): string[] {
  const windowStart = scheduledTime - 15 * 60 * 1000;
  return events.filter(event => {
    const removedPublicArticle = event.status !== "ready" && event.firstPublishedAtUTC;
    if (!isPublic(event, scheduledTime) && !removedPublicArticle) return false;
    const changedAt = event.dateModifiedUTC ? Date.parse(modifiedAt(event)) : Date.parse(publishedAt(event));
    return changedAt > windowStart && changedAt <= scheduledTime;
  }).map(event => SITE + eventPath(event));
}

export async function notifyIndexNow(urls: string[], fetcher: typeof fetch = fetch, proofURL = `${SITE}/${INDEXNOW_KEY}.txt`): Promise<{ status: number | null; urls: string[] }> {
  if (!urls.length) return { status: null, urls: [] };
  const keyLocation = `${SITE}/${INDEXNOW_KEY}.txt`;
  const proof = await fetcher(proofURL);
  if (!proof.ok || (await proof.text()).trim() !== INDEXNOW_KEY) throw new Error("Existing IndexNow ownership key could not be verified");
  const result = await fetcher("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: "www.liveorbitapp.com", key: INDEXNOW_KEY, keyLocation, urlList: urls }),
  });
  if (!result.ok) throw new Error(`IndexNow returned ${result.status}`);
  return { status: result.status, urls };
}
