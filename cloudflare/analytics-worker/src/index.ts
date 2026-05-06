export interface Env {
  ANALYTICS_DB: D1Database;
  LIVE_ORBIT_ANALYTICS_KEY?: string;
  DEV_DASHBOARD_TOKEN?: string;
  ANALYTICS_HASH_PEPPER?: string;
  ALLOWED_ORIGINS?: string;
}

type RawEvent = {
  event_name?: unknown;
  timestamp?: unknown;
  anonymous_id?: unknown;
  session_id?: unknown;
  page_path?: unknown;
  page_title?: unknown;
  referrer?: unknown;
  source?: unknown;
  platform?: unknown;
  app_version?: unknown;
  feature?: unknown;
  target_type?: unknown;
  target_id?: unknown;
  target_name?: unknown;
  metadata?: unknown;
};

type AnalyticsEvent = {
  id: string;
  createdAt: string;
  eventName: string;
  anonymousId: string;
  sessionId: string;
  pagePath: string | null;
  pageTitle: string | null;
  referrer: string | null;
  source: string;
  platform: string;
  appVersion: string | null;
  feature: string;
  targetType: string | null;
  targetId: string | null;
  targetName: string | null;
  metadataJson: string;
};

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

const blockedMetadataKeys = new Set([
  "email",
  "phone",
  "name",
  "firstName",
  "lastName",
  "address",
  "password",
  "token",
  "secret",
  "authorization",
]);

const featureFallbacks: Record<string, string> = {
  "website.page_view": "website",
  "website.app_store_click": "website",
  "website.nav_click": "website",
  "website.outbound_click": "website",
  "app.satellite.opened": "satellite detail",
  "app.satellite.shared": "sharing",
  "app.article.opened": "news",
  "app.article.shared": "sharing",
  "app.launch.opened": "launches",
  "app.pass.opened": "passes",
  "app.pass.notification_set": "notifications",
  "app.ar.opened": "ar",
  "app.sky.opened": "sky mode",
  "app.search.submitted": "search",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(request, env) });
    }

    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";

    try {
      if (pathname === "/api/analytics/events" && request.method === "POST") {
        return withCors(request, env, await ingestEvents(request, env));
      }

      if (pathname.startsWith("/api/analytics/admin")) {
        if (!(await isDeveloperRequest(request, env))) {
          return withCors(request, env, json({ error: "developer_access_required" }, 401));
        }
        if (pathname === "/api/analytics/admin/overview" && request.method === "GET") {
          return withCors(request, env, await overview(url, env));
        }
        if (pathname === "/api/analytics/admin/health" && request.method === "GET") {
          return withCors(request, env, await health(request, env));
        }
        if (pathname === "/api/analytics/admin/breakdowns" && request.method === "GET") {
          return withCors(request, env, await breakdowns(url, env));
        }
        if (pathname === "/api/analytics/admin/timeseries" && request.method === "GET") {
          return withCors(request, env, await timeseries(url, env));
        }
        if (pathname === "/api/analytics/admin/targets" && request.method === "GET") {
          return withCors(request, env, await targets(url, env));
        }
        if (pathname === "/api/analytics/admin/recent" && request.method === "GET") {
          return withCors(request, env, await recent(url, env));
        }
        if (pathname === "/api/analytics/admin/sessions" && request.method === "GET") {
          return withCors(request, env, await sessions(url, env));
        }
        if (pathname.startsWith("/api/analytics/admin/sessions/") && request.method === "GET") {
          const sessionId = decodeURIComponent(pathname.split("/").pop() || "");
          return withCors(request, env, await sessionDetail(sessionId, env));
        }
        if (pathname === "/api/analytics/admin/tree" && request.method === "GET") {
          return withCors(request, env, await tree(url, env));
        }
      }

      return withCors(request, env, json({ error: "not_found" }, 404));
    } catch (error) {
      return withCors(
        request,
        env,
        json({ error: "analytics_worker_error", detail: error instanceof Error ? error.message : "unknown" }, 500)
      );
    }
  },
};

async function ingestEvents(request: Request, env: Env): Promise<Response> {
  const length = Number(request.headers.get("content-length") || 0);
  if (length > 64_000) {
    return json({ error: "payload_too_large" }, 413);
  }

  const body = await request.json().catch(() => null);
  const rawEvents = Array.isArray((body as { events?: unknown })?.events)
    ? ((body as { events: unknown[] }).events as RawEvent[])
    : [body as RawEvent];

  if (!rawEvents.length || rawEvents.length > 25) {
    return json({ error: "invalid_batch_size" }, 400);
  }

  const requiresAppKey = rawEvents.some((event) => {
    const name = clean(event?.event_name, 80);
    const platform = clean(event?.platform, 40).toLowerCase();
    const source = clean(event?.source, 40).toLowerCase();
    return name.startsWith("app.") || platform === "ios" || source === "app";
  });

  if (requiresAppKey) {
    const provided = request.headers.get("x-live-orbit-analytics-key") || "";
    if (!env.LIVE_ORBIT_ANALYTICS_KEY || !constantTimeEqual(provided, env.LIVE_ORBIT_ANALYTICS_KEY)) {
      return json({ error: "invalid_ingest_key" }, 401);
    }
  }

  const now = new Date().toISOString();
  const events = rawEvents.map((event) => normalizeEvent(event, now)).filter(Boolean) as AnalyticsEvent[];
  if (!events.length) {
    return json({ error: "no_valid_events" }, 400);
  }

  const ipHash = await hashValue(request.headers.get("cf-connecting-ip") || "", env);
  const userAgentHash = await hashValue(request.headers.get("user-agent") || "", env);
  const country = clean(request.cf?.country || request.headers.get("cf-ipcountry") || "", 8) || null;

  const statements: D1PreparedStatement[] = [];
  for (const event of events) {
    statements.push(
      env.ANALYTICS_DB.prepare(
        `INSERT INTO analytics_events (
          id, created_at, event_name, anonymous_id, session_id, page_path, page_title,
          referrer, source, platform, app_version, feature, target_type, target_id, target_name,
          metadata_json, ip_hash, user_agent_hash, country
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        event.id,
        event.createdAt,
        event.eventName,
        event.anonymousId,
        event.sessionId,
        event.pagePath,
        event.pageTitle,
        event.referrer,
        event.source,
        event.platform,
        event.appVersion,
        event.feature,
        event.targetType,
        event.targetId,
        event.targetName,
        event.metadataJson,
        ipHash,
        userAgentHash,
        country
      )
    );
    statements.push(
      env.ANALYTICS_DB.prepare(
        `INSERT INTO analytics_sessions (
          session_id, anonymous_id, first_seen_at, last_seen_at, event_count, source, platform, app_version, country
        ) VALUES (?, ?, ?, ?, 1, ?, ?, ?, ?)
        ON CONFLICT(session_id) DO UPDATE SET
          last_seen_at = excluded.last_seen_at,
          event_count = analytics_sessions.event_count + 1,
          source = excluded.source,
          platform = excluded.platform,
          app_version = COALESCE(excluded.app_version, analytics_sessions.app_version),
          country = COALESCE(excluded.country, analytics_sessions.country)`
      ).bind(
        event.sessionId,
        event.anonymousId,
        event.createdAt,
        event.createdAt,
        event.source,
        event.platform,
        event.appVersion,
        country
      )
    );
  }

  await env.ANALYTICS_DB.batch(statements);
  return json({ ok: true, accepted: events.length });
}

async function overview(url: URL, env: Env): Promise<Response> {
  const since = sinceDate(url.searchParams.get("range"));
  const activeSince = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const total = await env.ANALYTICS_DB.prepare(
    "SELECT COUNT(*) AS count FROM analytics_events WHERE created_at >= ?"
  ).bind(since).first<{ count: number }>();
  const active = await env.ANALYTICS_DB.prepare(
    "SELECT COUNT(DISTINCT session_id) AS count FROM analytics_events WHERE created_at >= ?"
  ).bind(activeSince).first<{ count: number }>();
  const topFeature = await env.ANALYTICS_DB.prepare(
    `SELECT feature, COUNT(*) AS count
     FROM analytics_events
     WHERE created_at >= ?
     GROUP BY feature
     ORDER BY count DESC
     LIMIT 1`
  ).bind(since).first<{ feature: string; count: number }>();
  const shareEvents = await env.ANALYTICS_DB.prepare(
    `SELECT COUNT(*) AS count
     FROM analytics_events
     WHERE created_at >= ? AND (event_name LIKE '%share%' OR feature = 'sharing')`
  ).bind(since).first<{ count: number }>();
  const uniqueSessions = await env.ANALYTICS_DB.prepare(
    "SELECT COUNT(DISTINCT session_id) AS count FROM analytics_events WHERE created_at >= ?"
  ).bind(since).first<{ count: number }>();
  const uniqueUsers = await env.ANALYTICS_DB.prepare(
    "SELECT COUNT(DISTINCT anonymous_id) AS count FROM analytics_events WHERE created_at >= ?"
  ).bind(since).first<{ count: number }>();
  const appEvents = await env.ANALYTICS_DB.prepare(
    "SELECT COUNT(*) AS count FROM analytics_events WHERE created_at >= ? AND source = 'app'"
  ).bind(since).first<{ count: number }>();
  const webEvents = await env.ANALYTICS_DB.prepare(
    "SELECT COUNT(*) AS count FROM analytics_events WHERE created_at >= ? AND source = 'website'"
  ).bind(since).first<{ count: number }>();
  const failureEvents = await env.ANALYTICS_DB.prepare(
    "SELECT COUNT(*) AS count FROM analytics_events WHERE created_at >= ? AND event_name LIKE '%.failed'"
  ).bind(since).first<{ count: number }>();
  const latest = await env.ANALYTICS_DB.prepare(
    `SELECT created_at, event_name, source, platform, feature, target_name
     FROM analytics_events
     ORDER BY created_at DESC
     LIMIT 1`
  ).first();
  const topTargets = await env.ANALYTICS_DB.prepare(
    `SELECT
       COALESCE(target_name, target_id, page_path, event_name) AS label,
       COALESCE(target_type, feature, 'event') AS kind,
       COUNT(*) AS count
     FROM analytics_events
     WHERE created_at >= ?
     GROUP BY label, kind
     ORDER BY count DESC
     LIMIT 10`
  ).bind(since).all();

  return json({
    active_now: active?.count || 0,
    total_events: total?.count || 0,
    unique_sessions: uniqueSessions?.count || 0,
    unique_users: uniqueUsers?.count || 0,
    app_events: appEvents?.count || 0,
    web_events: webEvents?.count || 0,
    failure_events: failureEvents?.count || 0,
    top_feature: topFeature?.feature || null,
    share_events: shareEvents?.count || 0,
    latest_event: latest || null,
    top_targets: topTargets.results || [],
  });
}

async function recent(url: URL, env: Env): Promise<Response> {
  const limit = boundedInt(url.searchParams.get("limit"), 10, 100, 50);
  const rows = await env.ANALYTICS_DB.prepare(
    `SELECT created_at, event_name, anonymous_id, session_id, page_path, page_title, referrer,
       source, platform, app_version, feature, target_type, target_id, target_name, metadata_json, country
     FROM analytics_events
     ORDER BY created_at DESC
     LIMIT ?`
  ).bind(limit).all();
  return json({ events: rows.results || [] });
}

async function health(request: Request, env: Env): Promise<Response> {
  const started = Date.now();
  const totalEvents = await env.ANALYTICS_DB.prepare("SELECT COUNT(*) AS count FROM analytics_events").first<{ count: number }>();
  const totalSessions = await env.ANALYTICS_DB.prepare("SELECT COUNT(*) AS count FROM analytics_sessions").first<{ count: number }>();
  const lastEvent = await env.ANALYTICS_DB.prepare(
    `SELECT created_at, event_name, source, platform, feature, target_name
     FROM analytics_events
     ORDER BY created_at DESC
     LIMIT 1`
  ).first();
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const recentEvents = await env.ANALYTICS_DB.prepare(
    "SELECT COUNT(*) AS count FROM analytics_events WHERE created_at >= ?"
  ).bind(fiveMinutesAgo).first<{ count: number }>();

  return json({
    ok: true,
    worker: "live-orbit-analytics",
    checked_at: new Date().toISOString(),
    host: new URL(request.url).host,
    database: {
      ok: true,
      total_events: totalEvents?.count || 0,
      total_sessions: totalSessions?.count || 0,
      events_last_5m: recentEvents?.count || 0,
      last_event: lastEvent || null,
    },
    latency_ms: Date.now() - started,
  });
}

async function breakdowns(url: URL, env: Env): Promise<Response> {
  const since = sinceDate(url.searchParams.get("range"));
  const [events, features, sources, platforms, targetsByType, countries, appVersions] = await Promise.all([
    groupCount(env, "event_name", since, 40),
    groupCount(env, "feature", since, 40),
    groupCount(env, "source", since, 20),
    groupCount(env, "platform", since, 20),
    groupCount(env, "target_type", since, 30),
    groupCount(env, "country", since, 50),
    groupCount(env, "app_version", since, 20),
  ]);

  return json({
    events,
    features,
    sources,
    platforms,
    targets_by_type: targetsByType,
    countries,
    app_versions: appVersions,
  });
}

async function timeseries(url: URL, env: Env): Promise<Response> {
  const since = sinceDate(url.searchParams.get("range"));
  const rows = await env.ANALYTICS_DB.prepare(
    `SELECT
       substr(created_at, 1, 13) || ':00:00Z' AS bucket,
       COUNT(*) AS events,
       COUNT(DISTINCT session_id) AS sessions,
       SUM(CASE WHEN source = 'app' THEN 1 ELSE 0 END) AS app_events,
       SUM(CASE WHEN source = 'website' THEN 1 ELSE 0 END) AS web_events
     FROM analytics_events
     WHERE created_at >= ?
     GROUP BY bucket
     ORDER BY bucket ASC
     LIMIT 744`
  ).bind(since).all();
  return json({ points: rows.results || [] });
}

async function targets(url: URL, env: Env): Promise<Response> {
  const since = sinceDate(url.searchParams.get("range"));
  const type = clean(url.searchParams.get("type"), 80);
  const where = type ? "WHERE created_at >= ? AND target_type = ?" : "WHERE created_at >= ?";
  const statement = env.ANALYTICS_DB.prepare(
    `SELECT
       COALESCE(target_name, target_id, page_path, event_name) AS label,
       target_type,
       target_id,
       target_name,
       feature,
       source,
       COUNT(*) AS count,
       MAX(created_at) AS last_seen_at
     FROM analytics_events
     ${where}
     GROUP BY label, target_type, target_id, target_name, feature, source
     ORDER BY count DESC, last_seen_at DESC
     LIMIT 100`
  );
  const rows = type ? await statement.bind(since, type).all() : await statement.bind(since).all();
  return json({ targets: rows.results || [] });
}

async function sessions(url: URL, env: Env): Promise<Response> {
  const since = sinceDate(url.searchParams.get("range"));
  const rows = await env.ANALYTICS_DB.prepare(
    `SELECT session_id, anonymous_id, first_seen_at, last_seen_at, event_count, source, platform, country
     FROM analytics_sessions
     WHERE last_seen_at >= ?
     ORDER BY last_seen_at DESC
     LIMIT 100`
  ).bind(since).all();
  return json({ sessions: rows.results || [] });
}

async function sessionDetail(sessionId: string, env: Env): Promise<Response> {
  if (!sessionId || sessionId.length > 120) {
    return json({ error: "invalid_session_id" }, 400);
  }
  const rows = await env.ANALYTICS_DB.prepare(
    `SELECT created_at, event_name, page_path, page_title, referrer, source, platform, app_version,
       feature, target_type, target_id, target_name, metadata_json, country
     FROM analytics_events
     WHERE session_id = ?
     ORDER BY created_at ASC
     LIMIT 300`
  ).bind(sessionId).all();
  return json({ session_id: sessionId, events: rows.results || [] });
}

async function tree(url: URL, env: Env): Promise<Response> {
  const since = sinceDate(url.searchParams.get("range"));
  const rows = await env.ANALYTICS_DB.prepare(
    `SELECT session_id, event_name, feature, target_name, page_path, created_at
     FROM analytics_events
     WHERE created_at >= ?
     ORDER BY session_id ASC, created_at ASC
     LIMIT 2500`
  ).bind(since).all<{
    session_id: string;
    event_name: string;
    feature: string | null;
    target_name: string | null;
    page_path: string | null;
  }>();

  const counts = new Map<string, number>();
  let currentSession = "";
  let previous = "";
  for (const row of rows.results || []) {
    if (row.session_id !== currentSession) {
      currentSession = row.session_id;
      previous = "";
    }
    const current = displayNode(row.feature || row.event_name, row.target_name || row.page_path);
    if (previous) {
      const label = `${previous} -> ${current}`;
      counts.set(label, (counts.get(label) || 0) + 1);
    }
    previous = current;
  }

  const edges = [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);
  return json({ edges });
}

function normalizeEvent(raw: RawEvent, now: string): AnalyticsEvent | null {
  const eventName = clean(raw?.event_name, 80);
  if (!/^[a-z0-9_.:-]{3,80}$/i.test(eventName)) return null;

  const metadata = sanitizeMetadata(raw?.metadata);
  const source = clean(raw?.source, 32) || (eventName.startsWith("app.") ? "app" : "website");
  const platform = clean(raw?.platform, 32) || (source === "app" ? "ios" : "web");
  const feature =
    clean(raw?.feature, 80) ||
    clean(metadata.feature, 80) ||
    featureFallbacks[eventName] ||
    eventName.split(".")[1] ||
    "unknown";

  const anonymousId = clean(raw?.anonymous_id, 96) || crypto.randomUUID();
  const sessionId = clean(raw?.session_id, 96) || anonymousId;

  return {
    id: crypto.randomUUID(),
    createdAt: now,
    eventName,
    anonymousId,
    sessionId,
    pagePath: nullable(clean(raw?.page_path, 300)),
    pageTitle: nullable(clean(raw?.page_title, 160)),
    referrer: nullable(clean(raw?.referrer, 300)),
    source,
    platform,
    appVersion: nullable(clean(raw?.app_version, 40)),
    feature,
    targetType: nullable(clean(raw?.target_type ?? metadata.target_type, 80)),
    targetId: nullable(clean(raw?.target_id ?? metadata.target_id, 160)),
    targetName: nullable(clean(raw?.target_name ?? metadata.target_name ?? metadata.label, 180)),
    metadataJson: JSON.stringify(metadata).slice(0, 4_000),
  };
}

function sanitizeMetadata(input: unknown): Record<string, string | number | boolean> {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const cleanEntries: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!key || blockedMetadataKeys.has(key) || key.length > 80) continue;
    if (value === null || value === undefined) continue;
    if (typeof value === "boolean" || typeof value === "number") cleanEntries[key] = value;
    else cleanEntries[key] = clean(value, 500);
  }
  return cleanEntries;
}

function clean(value: unknown, max: number): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function nullable(value: string): string | null {
  return value ? value : null;
}

function sinceDate(range: string | null): string {
  const now = Date.now();
  const map: Record<string, number> = {
    "1h": 60 * 60 * 1000,
    "24h": 24 * 60 * 60 * 1000,
    "7d": 7 * 24 * 60 * 60 * 1000,
    "30d": 30 * 24 * 60 * 60 * 1000,
  };
  return new Date(now - (map[range || "24h"] || map["24h"])).toISOString();
}

function boundedInt(value: string | null, min: number, max: number, fallback: number): number {
  const parsed = Number.parseInt(value || "", 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

async function groupCount(env: Env, column: string, since: string, limit: number): Promise<unknown[]> {
  const allowed = new Set(["event_name", "feature", "source", "platform", "target_type", "country", "app_version"]);
  if (!allowed.has(column)) return [];
  const rows = await env.ANALYTICS_DB.prepare(
    `SELECT COALESCE(${column}, 'unknown') AS label, COUNT(*) AS count
     FROM analytics_events
     WHERE created_at >= ?
     GROUP BY label
     ORDER BY count DESC
     LIMIT ?`
  ).bind(since, limit).all();
  return rows.results || [];
}

function displayNode(feature: string, target: string | null): string {
  if (!target) return feature;
  return `${feature}: ${target}`.slice(0, 90);
}

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), { status, headers: jsonHeaders });
}

function corsHeaders(request: Request, env: Env): Headers {
  const headers = new Headers();
  const origin = request.headers.get("origin");
  const allowed = allowedOrigins(env);
  if (origin && allowed.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }
  headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Live-Orbit-Analytics-Key");
  headers.set("Access-Control-Max-Age", "86400");
  return headers;
}

function withCors(request: Request, env: Env, response: Response): Response {
  const headers = new Headers(response.headers);
  corsHeaders(request, env).forEach((value, key) => headers.set(key, value));
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function allowedOrigins(env: Env): Set<string> {
  const configured = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  return new Set([
    "https://liveorbitapp.com",
    "https://www.liveorbitapp.com",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    ...configured,
  ]);
}

async function isDeveloperRequest(request: Request, env: Env): Promise<boolean> {
  if (request.headers.get("cf-access-jwt-assertion")) return true;
  const auth = request.headers.get("authorization") || "";
  const bearer = auth.toLowerCase().startsWith("bearer ") ? auth.slice(7).trim() : "";
  if (!bearer || !env.DEV_DASHBOARD_TOKEN) return false;
  return constantTimeEqual(bearer, env.DEV_DASHBOARD_TOKEN);
}

function constantTimeEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const left = encoder.encode(a);
  const right = encoder.encode(b);
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) {
    diff |= left[i] ^ right[i];
  }
  return diff === 0;
}

async function hashValue(value: string, env: Env): Promise<string | null> {
  if (!value) return null;
  const pepper = env.ANALYTICS_HASH_PEPPER || env.LIVE_ORBIT_ANALYTICS_KEY || "";
  const bytes = new TextEncoder().encode(`${pepper}:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
