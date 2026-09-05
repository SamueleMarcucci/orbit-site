# Live Orbit

The product website for Live Orbit, an iPhone satellite tracker from Apps Made Better LLC. Built with Next.js 16, React 19, a locally hosted font, and a static export. The September redesign uses the founder's supplied screenshots and new orange app icon.

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
