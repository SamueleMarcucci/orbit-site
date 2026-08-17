# Live Orbit Website Design Context

Visual archetype: Tactical Telemetry and CRT Terminal.

Substrate: dark only, tinted near-black background, white phosphor foreground, aviation red as the only broad accent. Terminal green may appear only as a restrained status signal.

Typography:
- Macro: heavy compressed sans, uppercase, tight tracking, large clamp-based scale.
- Micro: technical monospace, uppercase, small, tracked labels.
- Body: condensed sans, readable sentence case.

Layout:
- Rigid CSS grid, visible 1px dividers, sharp 90 degree corners.
- No rounded cards. No card-in-card. Repeated content appears as cells, tables, strips, and ledgers.
- Bimodal density: tight metadata clusters contrasted with large typographic panels.

Motion:
- Only opacity and transform.
- UI transitions under 300ms, custom ease-out curves.
- Pressable elements use subtle `scale(0.97)` active feedback.
- Respect `prefers-reduced-motion`.
