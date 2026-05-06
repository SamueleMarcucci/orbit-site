# Live Orbit analytics Worker

This Worker powers the private `/developer/` dashboard.

Security model:

- `/developer/*` is protected by Cloudflare Access. Do not use a frontend password.
- `GET /api/analytics/admin/*` is protected by Cloudflare Access, plus an optional local `Authorization: Bearer` token for testing.
- `POST /api/analytics/events` accepts sanitized website events. App events require `X-Live-Orbit-Analytics-Key`.
- No raw IP address, email, phone, password, token, or name is stored. IP and user agent are hashed with a secret pepper.

## First setup

Install dependencies:

```sh
npm install
```

Create the D1 database:

```sh
npm run db:create
```

Copy the returned `database_id` into `wrangler.jsonc`, replacing `REPLACE_WITH_D1_DATABASE_ID`.

Create secrets:

```sh
openssl rand -base64 48
wrangler secret put LIVE_ORBIT_ANALYTICS_KEY
openssl rand -base64 48
wrangler secret put DEV_DASHBOARD_TOKEN
openssl rand -base64 48
wrangler secret put ANALYTICS_HASH_PEPPER
wrangler secret put ALLOWED_ORIGINS
```

Use this value for `ALLOWED_ORIGINS`:

```text
https://liveorbitapp.com,https://www.liveorbitapp.com,http://localhost:8080,http://127.0.0.1:8080
```

Create tables:

```sh
npm run db:migrate:remote
```

Deploy:

```sh
npm run deploy
```

The Worker is currently also available at:

```text
https://live-orbit-analytics.marcucci-sam.workers.dev
```

The clean `https://liveorbitapp.com/api/analytics/*` route only receives traffic when `liveorbitapp.com` is proxied through Cloudflare DNS.

## Cloudflare Access rules

Create a Cloudflare Access self-hosted application for:

```text
liveorbitapp.com/developer/*
```

Allow only your email.

Create a second Access application for:

```text
liveorbitapp.com/api/analytics/admin/*
```

Allow only your email.

Do not protect:

```text
liveorbitapp.com/api/analytics/events
```

That endpoint is the public event collector. The Worker still validates, sanitizes, and rate-limit rules should protect it.

## Rate limiting

Add a Cloudflare WAF rate limiting rule:

- If URI path equals `/api/analytics/events`
- Limit: start around `120 requests per minute per IP`
- Action: managed challenge or block

The website tracker batches with `sendBeacon`, so normal traffic should be far below that.

## App event example

The iOS app should send app telemetry with the secret header:

```http
POST https://liveorbitapp.com/api/analytics/events
X-Live-Orbit-Analytics-Key: <secret>
Content-Type: application/json
```

```json
{
  "events": [
    {
      "event_name": "app.satellite.opened",
      "source": "app",
      "platform": "ios",
      "app_version": "1.0",
      "anonymous_id": "anonymous-install-id",
      "session_id": "session-id",
      "feature": "satellite detail",
      "target_type": "satellite",
      "target_id": "25544",
      "target_name": "International Space Station",
      "metadata": {
        "orbit_class": "LEO"
      }
    }
  ]
}
```
