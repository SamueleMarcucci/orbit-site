// This is the existing production proxy, brought under the website's version control.
// Keep non-Events routing, redirect rewriting, and caching behavior unchanged.
const ORIGIN = "https://samuelemarcucci.github.io";
const BASE_PATH = "/orbit-site";
const TRAILING_SLASH_ROUTES = new Set([
  "/about", "/data-sources", "/features", "/privacy", "/support",
  "/support/thanks", "/terms", "/testing", "/testing/thanks",
]);

export type FetchUpstream = (request: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export async function proxy(request: Request, fetchUpstream: FetchUpstream = fetch): Promise<Response> {
  const url = new URL(request.url);
  const normalizedPath = url.pathname.replace(/\/$/, "") || "/";
  if (TRAILING_SLASH_ROUTES.has(normalizedPath) && url.pathname === normalizedPath) {
    const redirectUrl = new URL(request.url);
    redirectUrl.pathname = `${normalizedPath}/`;
    return Response.redirect(redirectUrl.toString(), 308);
  }
  const upstream = new URL(BASE_PATH + url.pathname, ORIGIN);
  upstream.search = url.search;
  const upstreamResponse = await fetchUpstream(upstream, {
    method: request.method,
    headers: {
      Accept: request.headers.get("Accept") || "*/*",
      "User-Agent": "LiveOrbitSiteProxy/1.0",
    },
    redirect: "manual",
  });
  const headers = new Headers(upstreamResponse.headers);
  const location = headers.get("Location");
  if (location) {
    const rewrittenLocation = new URL(location, upstream);
    if (rewrittenLocation.hostname === "samuelemarcucci.github.io" && rewrittenLocation.pathname.startsWith(BASE_PATH)) {
      rewrittenLocation.hostname = url.hostname;
      rewrittenLocation.protocol = url.protocol;
      rewrittenLocation.pathname = rewrittenLocation.pathname.slice(BASE_PATH.length) || "/";
      headers.set("Location", rewrittenLocation.toString());
    }
  }
  const contentType = headers.get("Content-Type") || "";
  if (contentType.includes("text/html")) {
    headers.set("Cache-Control", "no-cache, must-revalidate");
  } else {
    headers.set("Cache-Control", upstreamResponse.headers.get("Cache-Control") || "public, max-age=300");
  }
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Content-Type-Options", "nosniff");
  return new Response(request.method === "HEAD" ? null : upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers,
  });
}
