// Procedural random stars + infinite parallax + nav collapse.
(() => {
  const body = document.body;
  const layers = [...document.querySelectorAll(".star-layer")];
  let ticking = false;
  let layerState = [];

  const seededRandom = (seed) => {
    let t = seed >>> 0;
    return () => {
      t += 0x6d2b79f5;
      let v = Math.imul(t ^ (t >>> 15), 1 | t);
      v ^= v + Math.imul(v ^ (v >>> 7), 61 | v);
      return ((v ^ (v >>> 14)) >>> 0) / 4294967296;
    };
  };

  const buildLayerState = (canvas, index) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const fallbackWidth = Math.ceil(window.innerWidth * 1.16);
    const fallbackHeight = Math.ceil(window.innerHeight * 1.24);
    const cssWidth = Math.max(1, Math.round(rect.width || fallbackWidth));
    const cssHeight = Math.max(1, Math.round(rect.height || fallbackHeight));

    const density = Number(canvas.dataset.density || 0.00016);
    const speed = Number(canvas.dataset.speed || 0.2);
    const seedBase = 0x9e3779b9 + index * 0x85ebca6b + cssWidth * 13 + cssHeight * 17;
    const rand = seededRandom(seedBase >>> 0);
    const starCount = Math.max(80, Math.floor(cssWidth * cssHeight * density));

    let minSize = 0.6;
    let maxSize = 1.4;
    let minAlpha = 0.42;
    let maxAlpha = 1;
    if (index === 1) {
      minSize = 0.48;
      maxSize = 1.1;
      minAlpha = 0.28;
      maxAlpha = 0.82;
    } else if (index === 2) {
      minSize = 0.36;
      maxSize = 0.82;
      minAlpha = 0.18;
      maxAlpha = 0.58;
    }

    const stars = [];
    for (let i = 0; i < starCount; i += 1) {
      const x = rand() * cssWidth;
      const y = rand() * cssHeight;
      const size = minSize + rand() * (maxSize - minSize);
      const alpha = minAlpha + rand() * (maxAlpha - minAlpha);
      stars.push({ x, y, size, alpha });
    }

    // Add brighter anchor stars for readability.
    const anchorCount = Math.max(12, Math.floor(starCount * 0.035));
    for (let i = 0; i < anchorCount; i += 1) {
      const x = rand() * cssWidth;
      const y = rand() * cssHeight;
      const size = 1 + rand() * 0.9;
      const alpha = 0.72 + rand() * 0.28;
      stars.push({ x, y, size, alpha });
    }

    return { canvas, dpr, cssWidth, cssHeight, speed, stars };
  };

  const renderLayer = (state, scrollY) => {
    const { canvas, dpr, cssWidth, cssHeight, speed, stars } = state;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    // Infinite vertical wrap in natural direction: stars drift upward as page scrolls down.
    const offset = ((scrollY * speed) % cssHeight + cssHeight) % cssHeight;

    for (let i = 0; i < stars.length; i += 1) {
      const star = stars[i];
      const yWrapped = (star.y - offset + cssHeight) % cssHeight;
      ctx.fillStyle = `rgba(255,255,255,${star.alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(star.x, yWrapped, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const buildStarfield = () => {
    layerState = layers.map((canvas, index) => buildLayerState(canvas, index));
  };

  const sync = () => {
    const y = window.scrollY;
    body.classList.toggle("is-scrolled", y > 24);
    layerState.forEach((state) => renderLayer(state, y));
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(sync);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      buildStarfield();
      onScroll();
    },
    { passive: true }
  );

  buildStarfield();
  sync();
})();
