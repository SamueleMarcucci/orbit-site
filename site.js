// Procedural random stars + parallax + nav collapse.
(() => {
  const body = document.body;
  const layers = [...document.querySelectorAll(".star-layer")];
  let ticking = false;

  const seededRandom = (seed) => {
    let t = seed >>> 0;
    return () => {
      t += 0x6d2b79f5;
      let v = Math.imul(t ^ (t >>> 15), 1 | t);
      v ^= v + Math.imul(v ^ (v >>> 7), 61 | v);
      return ((v ^ (v >>> 14)) >>> 0) / 4294967296;
    };
  };

  const drawLayer = (canvas, index) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const cssWidth = Math.max(1, Math.round(rect.width));
    const cssHeight = Math.max(1, Math.round(rect.height));

    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    const density = Number(canvas.dataset.density || 0.00012);
    const speed = Number(canvas.dataset.speed || 0.2);
    const seedBase = 0x9e3779b9 + index * 0x85ebca6b + cssWidth * 13 + cssHeight * 17;
    const rand = seededRandom(seedBase >>> 0);
    const starCount = Math.max(80, Math.floor(cssWidth * cssHeight * density));

    let minSize = 0.45;
    let maxSize = 1.1;
    let minAlpha = 0.35;
    let maxAlpha = 0.95;
    if (index === 1) {
      minSize = 0.35;
      maxSize = 0.9;
      minAlpha = 0.22;
      maxAlpha = 0.7;
    } else if (index === 2) {
      minSize = 0.25;
      maxSize = 0.7;
      minAlpha = 0.15;
      maxAlpha = 0.48;
    }

    for (let i = 0; i < starCount; i += 1) {
      const x = rand() * cssWidth;
      const y = rand() * cssHeight;
      const size = minSize + rand() * (maxSize - minSize);
      const alpha = minAlpha + rand() * (maxAlpha - minAlpha);
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add a few brighter anchor stars to improve visibility.
    const anchorCount = Math.max(8, Math.floor(starCount * 0.025));
    for (let i = 0; i < anchorCount; i += 1) {
      const x = rand() * cssWidth;
      const y = rand() * cssHeight;
      const r = 1 + rand() * 0.9;
      ctx.fillStyle = `rgba(255,255,255,${(0.72 + rand() * 0.28).toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    canvas.dataset.speed = String(speed);
  };

  const buildStarfield = () => {
    layers.forEach((canvas, index) => drawLayer(canvas, index));
  };

  const sync = () => {
    const y = window.scrollY;
    body.classList.toggle("is-scrolled", y > 24);
    layers.forEach((canvas) => {
      const speed = Number(canvas.dataset.speed || 0.2);
      canvas.style.transform = `translate3d(0, ${(-y * speed).toFixed(2)}px, 0)`;
    });
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
