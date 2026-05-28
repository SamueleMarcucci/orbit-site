export function OrbitPlate() {
  return (
    <figure className="orbit-plate" aria-label="Abstract orbit visualization for Live Orbit">
      <svg viewBox="0 0 900 900" role="img" aria-labelledby="orbit-title orbit-desc">
        <title id="orbit-title">Live Orbit abstract orbital display</title>
        <desc id="orbit-desc">A schematic Earth field with orbital paths and no live satellite data.</desc>
        <defs>
          <pattern id="dotfield" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" />
          </pattern>
        </defs>
        <rect width="900" height="900" className="plate-bg" />
        <rect x="42" y="42" width="816" height="816" className="plate-frame" />
        <path className="scan-ring" d="M450 104a346 346 0 1 1 0 692 346 346 0 0 1 0-692Z" />
        <path className="scan-ring muted" d="M450 190a260 260 0 1 1 0 520 260 260 0 0 1 0-520Z" />
        <path className="earth-disc" d="M450 270a180 180 0 1 1 0 360 180 180 0 0 1 0-360Z" />
        <path className="earth-mask" d="M270 450c54-33 96-40 143-17 57 28 102 9 160-41 31-27 57-39 57-39v284H270Z" />
        <ellipse className="orbit-line red" cx="450" cy="450" rx="356" ry="92" transform="rotate(-18 450 450)" />
        <ellipse className="orbit-line" cx="450" cy="450" rx="310" ry="124" transform="rotate(32 450 450)" />
        <ellipse className="orbit-line soft" cx="450" cy="450" rx="238" ry="340" transform="rotate(7 450 450)" />
        <line className="cross" x1="450" y1="64" x2="450" y2="836" />
        <line className="cross" x1="64" y1="450" x2="836" y2="450" />
        <rect x="87" y="86" width="120" height="32" className="label-box" />
        <text x="101" y="108" className="svg-label">PRELAUNCH</text>
        <rect x="642" y="782" width="172" height="32" className="label-box" />
        <text x="657" y="804" className="svg-label">ESTIMATED PATHS</text>
        <rect x="0" y="0" width="900" height="900" fill="url(#dotfield)" className="dotfield" />
      </svg>
    </figure>
  );
}
