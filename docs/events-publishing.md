# Live Orbit Events publishing

This is the reusable publishing surface for event deliveries to Codex chat
`01a19ab0-ad2d-7cd1-af0a-f671f23aa341`. Continue in that chat. The weekly coordinator
owns research, App Store Connect, Instagram, and its AppStore ledger. This repository
owns website articles, release gates, and website verification receipts.

The website remains a Next.js static export on GitHub Pages behind the existing
`live-orbit-site` Cloudflare Worker. Events are server-rendered by `worker/index.ts`;
other pages retain the original proxy's route, redirect, and cache behavior. Deploy
the Worker before merging navigation links to main. Main deploys to Pages through
the existing GitHub Actions workflow.

## Ingestion contract

The coordinator may deliver a title, clean hero, article or article brief, source
citations, and verified schedule. The publisher converts that delivery into
`{ "schema_version": 1, "events": [...] }` for `npm run events:ingest -- /absolute/handoff.json`.
The normalized record is `EventRecord` in `worker/model.ts`; runtime validation is
in `tools/events/contract.mjs`. No article is created solely from an App Store status.

| Field | Meaning |
| --- | --- |
| `event_key` | Immutable coordinator key; old five use their numeric ASC IDs; new campaigns keep their supplied stable keys. |
| `eventId`, `revision`, `slug` | ASC reference, monotonically increasing content revision, immutable clean URL slug. |
| `title`, `description`, `category`, `intro`, `sections` | Original factual article, plain text. `sections` has `heading` and `paragraphs`. |
| `startUTC`, `endUTC`, `timezone` | Verified UTC instants and IANA display timezone. Never infer a launch instant from an editorial watch. |
| `scheduleBasis`, `scheduleVerifiedAtUTC` | Explicit anniversary/watch/confirmed schedule basis and verification time. |
| `publishAtUTC` | Exactly `startUTC - 86400000ms`, including across DST. A supplied mismatch is rejected. |
| `status` | `held`, `ready`, or `canceled`. Only `ready` can publish. |
| `availableFromUTC` | Explicit website availability. Future ready deliveries normally equal `publishAtUTC`. Late initial additions use a newly authorized future activation time. |
| `firstPublishedAtUTC`, `dateModifiedUTC` | Initially null; public revisions freeze the original datePublished and record actual revision time. Never rewrite a historic publication date. |
| `heroAssetPath`, `hero` | Local clean 3840×2160 export; SHA256, useful alt, and visible editorial-illustration caption. Source paths are stripped from the Worker bundle. Held drafts may have null SHA256 while approved art is missing. |
| `sources`, `sourceCheckedAtUTC` | HTTPS primary-source links with titles, optional source issue dates, and actual last check. |
| `relatedGuides`, `relatedEventKeys` | Real guide routes and stable event keys. Only public related events are rendered. |
| `corrections` | Append `{atUTC, note, sourceUrl}` on any public content/schedule correction or withdrawal. |

Identical deliveries are ignored. A conflicting same/older revision is rejected.
Different keys cannot reuse a slug or ASC event ID. Existing keys keep their URL.
Before ingestion, verify the supplied artwork revision and source facts. A changed
file hash needs an explicitly reviewed revision. The protected Badminton directory
is never a permitted source. Do not use private reference phone photography.

An initial late addition requires the current publication authorization and
`--allow-backfill`. It is assigned its real new availability date, never the original
campaign date. An article that was already public stays public through a schedule
correction with its original publication date; setting `held` or `canceled` removes
it, its images, feed and sitemap entries. A future shift replaces the pending time.

## Private source and preparation

The repository is public. Full staged articles stay in the gitignored
`.events-private/events.json`; revisions and ingestion receipts are in
`.events-private/history/`. `npm run events:prepare` creates the gitignored private
server module `.generated/events-data.ts` and optimized images in `.event-assets/`.
Neither directory is copied into `out/`, committed, or exposed as a general file
server. Keep the private store for future deliveries and recovery. Its source assets
remain at the supplied AppStore paths; the generated bundle excludes those paths.

The production Worker can serve only recognized Events routes and approved image
sizes. `assets.run_worker_first: true` applies the gate before every binding lookup.
Future routes and images return a generic 404 with noindex and no-store. There is no
browser-clock, query, cookie, header, RSC, JSON, source-map, static-origin or preview
override. Workers.dev and version previews use the same gate and are noindex.

## Release guarantee and search

For a `ready` event, each incoming request evaluates the Cloudflare server clock
against its release instant. The first request at or after that instant can return
the story and image; earlier requests cannot. The index, related stories, both
sitemaps and RSS use the same predicate. Events responses use browser and CDN
no-store, avoiding stale negative entries and cached early responses. This is an
availability boundary, not a push to already-open browser tabs. Network delivery
and Cloudflare outages can delay a reader's response; no hard real-time SLA is
claimed. Publication does not depend on cron, a local computer, or a new build.

A small 15-minute Cloudflare cron sends eligible newly released/changed URLs through
the existing IndexNow property key. It is a best-effort search notification, separate
from publication. Its nominal 15-minute window avoids routine duplicate submissions;
a provider failure may require a manual retry. The weekly coordinator should run
`npm run events:verify` to reconcile actual states, not call a staged article published.
The cron performs no research, messaging, App Store, or Instagram operations.

Each public article includes SSR text, a clean canonical URL, unique metadata,
large-image previews, Open Graph/Twitter tags, BlogPosting, BreadcrumbList and
ImageObject, truthful publisher/byline, sources, and links to guides and the app.
These are editorial articles, not attendee events. Root `/sitemap.xml` retains the
origin entries and appends public Events; `/events/sitemap.xml` and `/events/feed.xml`
are dynamic. Lastmod reflects actual content publication/revision, not build time.

Primary requirements consulted:

- [Google Article markup](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Event eligibility](https://developers.google.com/search/docs/appearance/structured-data/event)
- [Google Indexing API restrictions](https://developers.google.com/search/apis/indexing-api/v3/using-api)
- [IndexNow protocol](https://www.indexnow.org/documentation)
- [Cloudflare asset gate and binding](https://developers.cloudflare.com/workers/static-assets/binding/)

Submit only public verified URLs using `node tools/events/submit-indexnow.mjs`.
The existing public ownership key is reused; no new account grants are needed.
Submit/inspect the Events sitemap in existing Google Search Console and Bing
Webmaster properties when authenticated. The general Google Indexing API is not
eligible for these articles. Search notifications do not guarantee indexing or rank.

## Validation and scoped deployment

Use Node 22.18+ or Node 24 for the tests and local preview. Install the website lockfile
with `npm ci`. Wrangler 4 is available in the parent company workspace.

```sh
npm run events:prepare
WRANGLER_LOG_PATH=/tmp/live-orbit-events-wrangler.log ../../node_modules/.bin/wrangler types -c wrangler.events.jsonc --include-runtime
npm run test:events
npm run events:typecheck
npm run lint
npm run typecheck
npm run build
python3 tools/verify-search-export.py
node tools/events/check-export.mjs
WRANGLER_LOG_PATH=/tmp/live-orbit-events-wrangler.log ../../node_modules/.bin/wrangler deploy --dry-run -c wrangler.events.jsonc
node tools/events/preview.mjs --launch-preview
```

`--launch-preview` temporarily renders eligible held articles that have valid art
in the local preview only; it cannot alter source state or the deployed gate. Use
the in-app browser at mobile and desktop widths to inspect index, articles, archive,
images, source links, navigation, download links, console and overflow. The local
preview is noindex. Stop it after use.

After reviewing the exact scoped diff against fresh main, open a PR. With the current
explicit publishing authorization, deploy only `wrangler.events.jsonc` after a dry
run; preserve existing routes and variables. Verify the live Events and embargoed
routes before merging the navigation/robots/feed changes and checking the Pages run.
`npm run events:verify` writes `publishing/receipt.json` with per-event verified
publication/embargo state, times, URLs, source citations and all HTTP checks.
IndexNow readback is in `publishing/indexnow-receipt.json`; deployment/browser/search
evidence is in `.codex-artifacts/events/`. A staged future item has a planned URL,
not a publicURL or an actual publication timestamp.

Rollback uses the recorded prior Cloudflare version. Restore the private store from
its history for an accidental content edit, then prepare, validate and redeploy.
Do not roll the proxy back to the legacy parent implementation while leaving Events
navigation live.
