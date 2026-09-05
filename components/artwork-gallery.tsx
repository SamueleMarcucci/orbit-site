"use client";
import { useEffect, useRef, useState } from "react";
import { assetPath } from "@/lib/site";

const artworks = [
  { name: "sky", title: "Find your way across the sky.", alt: "Live Orbit Sky Mode with satellite guidance on iPhone" },
  { name: "sky-detail", title: "See where curiosity takes you.", alt: "Live Orbit Sky Mode showing satellite positions and a predicted path on iPhone" },
  { name: "passes", title: "Make time for the next pass.", alt: "Live Orbit pass results with visibility, timing, and maps" },
  { name: "alerts", title: "Keep your next pass in view.", alt: "Live Orbit notifications and Live Activity on the iPhone Lock Screen" },
  { name: "radio", title: "Hear signals from space.", alt: "Live Orbit Radio Signals, with recordings and listening controls" },
  { name: "search", title: "Follow a little curiosity.", alt: "Live Orbit search, celestial objects, nearby objects, and watchlists" },
  { name: "news", title: "Stay in the know.", alt: "Live Orbit space news on iPhone" },
  { name: "languages", title: "Explore in your language.", alt: "Live Orbit language selection, supporting 17 languages" },
];

export function ArtworkGallery() {
  const rail = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ start: true, end: false });
  const [enhanced, setEnhanced] = useState(false);
  useEffect(() => {
    const element = rail.current;
    if (!element) return;
    const update = () => setPosition({ start: element.scrollLeft < 4, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4 });
    // Buttons enhance the native scrolling gallery; the images also work without JavaScript.
    setEnhanced(true);
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => { element.removeEventListener("scroll", update); observer.disconnect(); };
  }, []);
  function move(direction: number) {
    const element = rail.current;
    const card = element?.querySelector("figure");
    if (!element || !card) return;
    element.scrollBy({ left: direction * (card.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap)), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return (
    <section className="gallery-section" id="gallery" aria-labelledby="gallery-title">
      <div className="wrap section-top"><div><p className="eyebrow">A CLOSER LOOK</p><h2 id="gallery-title">So much above.<br /><span>So much to explore.</span></h2></div><div className="gallery-controls" hidden={!enhanced}><button type="button" aria-label="Previous screenshots" aria-controls="artwork-rail" disabled={position.start} onClick={() => move(-1)}>←</button><button type="button" aria-label="Next screenshots" aria-controls="artwork-rail" disabled={position.end} onClick={() => move(1)}>→</button></div></div>
      <div className="artwork-rail" id="artwork-rail" ref={rail} tabIndex={0} role="region" aria-label="Live Orbit screenshots. Scroll horizontally to explore.">
        {artworks.map((artwork, index) => <figure key={artwork.name} className="artwork-card"><picture><source srcSet={[440, 880, 1242].map(width => `${assetPath(`/assets/september/${artwork.name}-${width}.webp`)} ${width}w`).join(", ")} sizes="(max-width: 700px) 76vw, 300px" type="image/webp" /><img src={assetPath(`/assets/september/${artwork.name}-880.webp`)} width={1242} height={2688} alt={artwork.alt} loading="lazy" decoding="async" /></picture><figcaption><span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>{artwork.title}</figcaption></figure>)}
      </div>
      <p className="wrap gallery-note">A look inside Live Orbit. Swipe or use the arrows to explore.</p>
    </section>
  );
}
