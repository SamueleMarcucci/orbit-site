// Procedural random stars + parallax + nav collapse.
(() => {
  const root = document.documentElement;
  const body = document.body;
  const layers = [...document.querySelectorAll(".stars")];
  let ticking = false;
  let starSeed = Date.now();

  const seededRandom = (seed) => {
    let t = seed >>> 0;
    return () => {
      t += 0x6d2b79f5;
      let v = Math.imul(t ^ (t >>> 15), 1 | t);
      v ^= v + Math.imul(v ^ (v >>> 7), 61 | v);
      return ((v ^ (v >>> 14)) >>> 0) / 4294967296;
    };
  };

  const buildLayer = (el, count, minSize, maxSize, minAlpha, maxAlpha, speed) => {
    const rand = seededRandom(starSeed++);
    const stars = [];
    for (let i = 0; i < count; i += 1) {
      const x = (rand() * 100).toFixed(4);
      const y = (rand() * 100).toFixed(4);
      const size = (minSize + rand() * (maxSize - minSize)).toFixed(3);
      const alpha = (minAlpha + rand() * (maxAlpha - minAlpha)).toFixed(3);
      stars.push(
        `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,${alpha}) 0 ${size}px, transparent ${(
          Number(size) + 0.8
        ).toFixed(3)}px)`
      );
    }
    el.style.setProperty("--layer-speed", String(speed));
    el.style.backgroundImage = stars.join(",");
  };

  const buildStarfield = () => {
    if (!layers.length) return;
    // Dense enough to feel natural, sparse enough to stay premium.
    buildLayer(layers[0], 180, 0.8, 1.7, 0.45, 0.95, 0.14);
    buildLayer(layers[1], 260, 0.5, 1.1, 0.25, 0.72, 0.33);
    buildLayer(layers[2], 340, 0.35, 0.8, 0.16, 0.46, 0.58);
  };

  const sync = () => {
    const y = window.scrollY;
    root.style.setProperty("--stars-offset", `${y}px`);
    body.classList.toggle("is-scrolled", y > 24);
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(sync);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    buildStarfield();
    onScroll();
  }, { passive: true });

  buildStarfield();
  sync();
})();
