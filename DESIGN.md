# Live Orbit design

The September 2026 redesign follows the user's new App Store artwork: warm cream, black and muted olive-gray type, bright orange app identity, and native blue iOS download buttons. Instrument Sans is hosted locally, with its OFL license beside the font. Use generous spacing, large compact headlines, light dividers, rounded image frames, and restrained interaction feedback.

The hero uses the supplied hand-held iPhone PNG. Its warm background continues into the homepage toolbar, which fades to white over the first 180 pixels of scrolling. Other pages keep a white toolbar. The horizontal gallery presents eight supplied posters in full, including the restored Sky Mode artwork in second position. The viewing guide is text only. The gallery uses a 20px gap between screenshots. It scrolls natively, with progressively enhanced previous/next controls and clear endpoint states. No automatic carousel or synthetic telemetry.

The page proceeds through the introduction, product gallery, a short viewing guide, download section, and native FAQ disclosures. Shared navigation and footer extend to support and legal pages. The mobile header keeps its small set of links visible. There is no menu dependency or hidden content without JavaScript. Respect reduced motion, keyboard access, image dimensions, and text contrast.

Source originals are in the parent workspace at `media/live-orbit/september-source`. `tools/process-september-media.mjs` in the parent produces optimized copies for both sites. The second Sky Mode poster is included as explicitly requested by the user on September 5; its embedded promotional text is supplied artwork. The new app icon is also used in metadata, the manifest, favicon, and social preview.

Run lint, typecheck, and the static build. Inspect desktop/mobile renders, gallery bounds, FAQ keyboard controls, overflow, console output, support controls without submitting, and accessibility. The parent workspace's `tools/live-orbit-qa.mjs` checks the local export preview on port 4323.

Guides use the same typography and navigation, with readable article widths, source links, related guides, and direct app/support links. They are reached through the viewing guide and footer, keeping the product toolbar compact.
