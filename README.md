# Live Orbit

The product website for Live Orbit, an iOS and iPadOS satellite tracker from Apps Made Better LLC. Built with Next.js 16, React 19, a locally hosted font, and a static export. The September redesign uses the founder's supplied screenshots and new orange app icon.

## Local development

```sh
npm ci
npm run dev -- --hostname 127.0.0.1 --port 4323
```

## Verify

```sh
npm run lint
npm run typecheck
npm run build
```

From the parent Apps Made Better workspace, serve the static export and run its browser checks:

```sh
node tools/preview-live-orbit.mjs
node tools/live-orbit-qa.mjs
```

The export is in `out/`. The existing GitHub Pages workflow deploys pushes to `main`; no commit, push, or deployment was performed as part of this local redesign. The public URL remains https://www.liveorbitapp.com/ and download actions use the verified Apple listing.

Support and testing forms retain their existing delivery endpoint. Local checks do not transmit submissions. Original product artwork remains in the parent workspace, and the media generation and social-preview scripts produce the files checked into this site's `public/` directory.

## Privacy policy source

`lib/privacy-policy.json` is exported from Live Orbit's canonical
`Trackingsoftware/LegalContent.swift`; do not independently rewrite its paragraphs.
From the app checkout, run:

```sh
python3 Tools/LegalRelease/export_privacy_policy.py --output /path/to/orbit-site/lib/privacy-policy.json
python3 Tools/LegalRelease/export_privacy_policy.py --check /path/to/orbit-site/lib/privacy-policy.json
```

The Next.js privacy page renders that snapshot. Keep the legacy `privacy/index.html`
policy text in sync when refreshing it. The October 2, 2026 snapshot includes the
server-side catalog metadata importer's data handling.


## Search reach update — October 12, 2026

This isolated branch starts from public production commit `448748d03c7c7dc06766ab3cd2395f713fb89957`. The older company-workspace checkout was not modified. Publication of this branch was authorized on October 12, 2026. Directory drafts remain separate from the website release.

The site now exports eleven observing and product guides, a features page, and eighteen indexable HTML routes. The sitemap includes the existing data-credit page. Homepage, hub, contextual, and related-guide links make every indexable page reachable in at most two links from the homepage. Product copy and SoftwareApplication markup describe iOS and iPadOS, confirmed against Apple's public version 2.2 feed on October 12. Existing privacy, credit, support, and testing behavior is preserved.

Run the export contract check after the standard checks:

```sh
npm run lint
npm run typecheck
npm run build
python3 tools/verify-search-export.py
node tools/preview-reach.mjs
```

The local preview is `http://127.0.0.1:4342/`. The local-only render runner is `http://127.0.0.1:4342/__qa/`; its Check every page control checks all eighteen public routes at 375, 768, and 1440 pixels. Its iframe viewport checks are layout checks, not simulated physical-device tests. Preview responses carry an HTTP noindex header; the exported production pages retain their normal indexing directives. Neither local test helper is exported as a public route.

The guides show editorial review dates. Existing publication dates remain on the three existing guides. The eight new guides use October 12, 2026, the approved publication date. Update modification dates only for changed content. The sources and article metadata share a publisher identity and truthful citations. The optional existing llms.txt navigation has been corrected; it is not required for Google AI search. FAQ markup is not a promise of FAQ rich results or AI citations.

Release through a reviewed branch/PR only after explicit authorization. The deployment workflow runs on main and includes the existing analytics configuration. Before publishing, fetch current main again and reconcile any changes. After publishing, verify the homepage, every sitemap route, robots.txt, media, and canonical metadata at https://www.liveorbitapp.com/. Only then submit the updated sitemap, request relevant guide recrawls, and perform owner-authorized directory submissions. Do not use the general Google Indexing API for these guide pages.
