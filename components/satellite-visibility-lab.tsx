'use client';

import { useId, useState } from 'react';
import { evaluateVisibility, visibilityConditions, type VisibilityConditions } from '@/lib/satellite-visibility';

export function SatelliteVisibilityLab() {
  const [conditions, setConditions] = useState<VisibilityConditions>({ aboveHorizon: true, sunlit: true, darkSky: true });
  const id = useId();
  const result = evaluateVisibility(conditions);
  const satelliteY = conditions.aboveHorizon ? 112 : 270;
  const skyColor = conditions.darkSky ? '#202c39' : '#e4eef0';
  const textColor = conditions.darkSky ? '#fffdf5' : '#23323a';

  return <div className="visibility-lab">
    <fieldset className="visibility-controls" aria-describedby={`${id}-instructions`}>
      <legend>Try the three conditions</legend>
      <p id={`${id}-instructions`}>Switch a condition off. See what changes, then switch it back.</p>
      {visibilityConditions.map((condition, index) => <label key={condition.key} className="visibility-control">
        <input type="checkbox" checked={conditions[condition.key]} onChange={event => {
          const checked = event.target.checked;
          setConditions(previous => ({ ...previous, [condition.key]: checked }));
        }} />
        <span><span className="visibility-control-title"><span aria-hidden="true">0{index + 1}</span>{condition.label}</span><span className="visibility-control-detail">{condition.detail}</span></span>
      </label>)}
    </fieldset>
    <div className="visibility-example">
      <figure className="visibility-figure">
        <svg viewBox="0 0 560 330" role="img" aria-labelledby={`${id}-diagram-title ${id}-diagram-description`}>
          <title id={`${id}-diagram-title`}>Illustrative satellite viewing conditions</title>
          <desc id={`${id}-diagram-description`}>The satellite is {conditions.aboveHorizon ? 'above' : 'below'} the observer’s horizon, {conditions.sunlit ? 'in sunlight' : 'in Earth’s shadow'}, with {conditions.darkSky ? 'a dark' : 'a bright'} observer sky. The diagram is schematic and not to scale.</desc>
          <rect width="560" height="330" fill={skyColor} />
          {conditions.darkSky && <g fill="#d8e3e8" opacity=".65" aria-hidden="true"><circle cx="68" cy="78" r="1.5" /><circle cx="181" cy="45" r="1.5" /><circle cx="262" cy="105" r="1.5" /><circle cx="453" cy="48" r="1.5" /><circle cx="492" cy="154" r="1.5" /></g>}
          <text x="28" y="35" fill={textColor} fontSize="14" fontFamily="inherit">{conditions.darkSky ? 'Dark observer sky' : 'Bright observer sky'}</text>
          <path d="M0 223 Q280 195 560 223 V330 H0 Z" fill="#e9e8dc" />
          <path d="M0 223 Q280 195 560 223" fill="none" stroke="#6f7569" strokeWidth="2" />
          <text x="28" y="250" fill="#414a40" fontSize="14" fontFamily="inherit">Your horizon</text>
          <circle cx="108" cy="197" r="5" fill="#414a40" />
          <path d="M108 202 V218 M99 210 L108 205 L117 210" fill="none" stroke="#414a40" strokeWidth="3" strokeLinecap="round" />
          <line x1="118" y1="201" x2="375" y2={satelliteY} stroke={conditions.aboveHorizon ? textColor : '#626b60'} strokeWidth="1.5" strokeDasharray="5 7" opacity=".6" />
          <g transform={`translate(390 ${satelliteY})`}>
            {!conditions.sunlit && <circle r="39" fill="none" stroke={conditions.aboveHorizon ? textColor : '#414a40'} strokeDasharray="3 5" opacity=".7" />}
            <rect x="-10" y="-10" width="20" height="20" rx="3" fill={conditions.sunlit ? '#f6b739' : '#6a7680'} stroke={conditions.aboveHorizon ? '#fffdf5' : '#414a40'} strokeWidth="1.5" />
            <path d="M-10 0 H-30 M10 0 H30" stroke={conditions.sunlit ? '#f6b739' : '#6a7680'} strokeWidth="10" />
          </g>
          <text x="390" y={conditions.aboveHorizon ? 169 : 317} textAnchor="middle" fill={conditions.aboveHorizon ? textColor : '#414a40'} fontSize="14" fontFamily="inherit">{conditions.sunlit ? 'Sunlit satellite' : 'In Earth’s shadow'}</text>
          <text x="28" y="303" fill="#626b60" fontSize="12" fontFamily="inherit">ILLUSTRATION · NOT TO SCALE</text>
        </svg>
        <figcaption>Your switches set this example. It does not represent a real satellite, location, or pass.</figcaption>
      </figure>
      <div className="visibility-result" role="status" aria-live="polite" aria-atomic="true">
        <p className="visibility-result-count">{result.favorableCount} of 3 conditions favor viewing</p>
        <h3>{result.title}</h3>
        <p>{result.summary}</p>
        {result.limitations.length > 0 && <ul>{result.limitations.map(condition => <li key={condition.key}>{condition.explanation}</li>)}</ul>}
      </div>
    </div>
    <noscript><p className="visibility-no-script">The interactive switches need JavaScript. The explanations below cover all three conditions, and the printable observing checklist works without it.</p></noscript>
  </div>;
}
