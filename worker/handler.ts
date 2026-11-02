import { isPublic, modifiedAt, publishedAt, type EventRecord } from "./model.ts";
import { proxy, type FetchUpstream } from "./proxy.ts";
import { extendSitemap, renderArticle, renderIndex, renderNotFound, renderRSS, renderSitemap } from "./render.ts";

const DYNAMIC_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Cloudflare-CDN-Cache-Control": "no-store",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
};

function dynamicResponse(request: Request, body: string | ReadableStream | null, type: string, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(request.method === "HEAD" ? null : body, { status, headers: { ...DYNAMIC_HEADERS, "Content-Type": type, ...extra } });
}

async function boundedText(response: Response, maxBytes: number): Promise<string> {
  if (Number(response.headers.get("Content-Length")) > maxBytes) throw new Error("Upstream sitemap exceeds size bound");
  if (!response.body) throw new Error("Empty upstream sitemap");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let body = "";
  try {
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      bytes += next.value.byteLength;
      if (bytes > maxBytes) throw new Error("Upstream sitemap exceeds size bound");
      body += decoder.decode(next.value, { stream: true });
    }
    return body + decoder.decode();
  } finally {
    await reader.cancel();
  }
}

export function createHandler(events: EventRecord[], options: { now?: () => number; fetchUpstream?: FetchUpstream; revision?: string } = {}) {
  return async function handle(request: Request, env: Pick<Env, "EVENT_ASSETS">): Promise<Response> {
    const url = new URL(request.url);
    // Only the deployed server clock controls publication. No query/header/cookie bypass.
    const now = (options.now || Date.now)();
    const extra = { "X-Live-Orbit-Events-Version": options.revision || "development" };
    if (!["www.liveorbitapp.com", "liveorbitapp.com"].includes(url.hostname)) {
      Object.assign(extra, { "X-Robots-Tag": "noindex, nofollow" });
    }
    const notFound = () => dynamicResponse(request, renderNotFound(now), "text/html; charset=utf-8", 404, { ...extra, "X-Robots-Tag": "noindex, follow" });
    const methodAllowed = request.method === "GET" || request.method === "HEAD";
    if (!methodAllowed) return dynamicResponse(request, "Method not allowed\n", "text/plain; charset=utf-8", 405, { Allow: "GET, HEAD" });
    // The asset binding is never a general fallback. Aliases, manifests, JSON,
    // source maps, RSC paths, and internal asset paths cannot expose staged content.
    let decoded: string;
    try { decoded = decodeURIComponent(url.pathname); } catch { return notFound(); }
    const isEvents = decoded === "/events" || decoded.startsWith("/events/");
    if (/^\/(?:_event-assets|\.event-assets|\.events-private|\.generated|worker)(?:\/|$)/i.test(decoded)) return notFound();
    if (isEvents && (decoded !== url.pathname || decoded.includes("//") || decoded.includes("\\"))) return notFound();
    if (isEvents && url.hostname === "liveorbitapp.com") {
      url.hostname = "www.liveorbitapp.com";
      return dynamicResponse(request, null, "text/plain; charset=utf-8", 308, { Location: url.toString() });
    }
    if (url.pathname === "/events") {
      url.pathname = "/events/";
      return dynamicResponse(request, null, "text/plain; charset=utf-8", 308, { Location: url.toString() });
    }
    if (url.pathname === "/events/") return dynamicResponse(request, renderIndex(events, now), "text/html; charset=utf-8", 200, extra);
    if (url.pathname === "/events/feed.xml") return dynamicResponse(request, renderRSS(events, now), "application/rss+xml; charset=utf-8", 200, extra);
    if (url.pathname === "/events/sitemap.xml") return dynamicResponse(request, renderSitemap(events, now), "application/xml; charset=utf-8", 200, extra);
    if (url.pathname === "/sitemap.xml") {
      try {
        const upstream = await proxy(new Request(request.url, { method: "GET", headers: { Accept: "application/xml" } }), options.fetchUpstream);
        if (!upstream.ok) throw new Error("Upstream sitemap unavailable");
        const xml = await boundedText(upstream, 1024 * 1024);
        return dynamicResponse(request, extendSitemap(xml, events, now), "application/xml; charset=utf-8", 200, extra);
      } catch {
        // Do not invent existing URLs or silently replace the sitemap on origin failure.
        return dynamicResponse(request, "Sitemap temporarily unavailable\n", "text/plain; charset=utf-8", 503, { "Retry-After": "60" });
      }
    }
    const sharedAsset = /^\/events\/assets\/(instrument-sans\.woff2|OFL\.txt)$/.test(url.pathname);
    const media = url.pathname.match(/^\/events\/media\/([a-z0-9-]+)\/(768|1536|2400)\.webp$/);
    if (sharedAsset || media) {
      const event = media && events.find(event => event.slug === media[1]);
      if (media && (!event || !isPublic(event, now))) return notFound();
      const asset = await env.EVENT_ASSETS.fetch(new Request(url.toString(), { method: request.method }));
      if (!asset.ok) return notFound();
      // No immutable caching: an event can be corrected, moved, held, or canceled.
      const response = dynamicResponse(request, asset.body, asset.headers.get("Content-Type") || "application/octet-stream", 200, extra);
      if (media) response.headers.set("X-Robots-Tag", "max-image-preview:large");
      return response;
    }
    if (isEvents) {
      const match = url.pathname.match(/^\/events\/([a-z0-9-]+)(\/)?$/);
      const event = match && events.find(event => event.slug === match[1]);
      if (!event || !isPublic(event, now)) return notFound();
      if (!url.pathname.endsWith("/")) {
        url.pathname += "/";
        return dynamicResponse(request, null, "text/plain; charset=utf-8", 308, { Location: url.toString() });
      }
      return dynamicResponse(request, renderArticle(event, events, now), "text/html; charset=utf-8", 200, { ...extra, "X-Published-At": publishedAt(event), "Last-Modified": new Date(modifiedAt(event)).toUTCString() });
    }
    return proxy(request, options.fetchUpstream);
  };
}
