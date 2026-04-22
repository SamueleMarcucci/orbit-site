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

// Orbital drifting assets: gentle random motion + auto-rotation to velocity.
(() => {
  const root = document.querySelector(".orbital-assets");
  if (!root) return;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduced) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Avoid accidental inclusion of browser/UI icons, but DO allow the satellite PNG
  // since it's a deliberate "thing in space" for this page.
  const isProbablyFavicon = (src) =>
    /favicon|icon\.svg|apple-touch|sat-favicon\.svg/i.test(src);

  const defaultCandidates = [
    "/assets/orbit-app-icon.icon/Assets/Sat.png",
  ];

  const resolveCandidates = () => {
    // Allow author override by dropping JSON manifest at `assets/manifest.json`.
    const base = document.baseURI;
    const manifestUrl = new URL("/assets/manifest.json", base).toString();
    return fetch(manifestUrl, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        const list = Array.isArray(json)
          ? json
          : Array.isArray(json?.images)
            ? json.images
            : Array.isArray(json?.floatingAssets)
              ? json.floatingAssets
              : null;
        if (!list || list.length === 0) return null;
        return list.map((p) => new URL(p, base).toString());
      })
      .catch(() => null)
      .then((list) => {
        if (list && list.length) return list.filter((s) => !isProbablyFavicon(s));
        return defaultCandidates
          .map((p) => new URL(p, base).toString())
          .filter((s) => !isProbablyFavicon(s));
      });
  };

  const spawn = (src, seed) => {
    const el = new Image();
    el.decoding = "async";
    el.loading = "eager";
    el.src = src;
    el.alt = "";
    el.className = "orbital-asset";
    if (seed % 3 === 0) el.classList.add("is-soft");
    root.appendChild(el);

    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;

    const size = clamp(56 + (seed % 5) * 10, 52, 104);
    el.style.setProperty("--asset-size", `${size}px`);
    el.style.setProperty("--asset-opacity", `${seed % 4 === 0 ? 0.14 : 0.22}`);

    // Position and motion.
    let x = Math.random() * vw();
    let y = Math.random() * vh();
    const angle = (Math.random() * Math.PI * 2);
    const speed = 22 + Math.random() * 34; // px / sec (clearly traverses screen)
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;

    // Slight per-asset drift so they don’t look linear.
    const wobbleRate = 0.18 + Math.random() * 0.22; // rad/sec
    const wobbleAmp = 0.12 + Math.random() * 0.16; // multiplier
    const phase = Math.random() * Math.PI * 2;

    const state = { el, x, y, vx, vy, wobbleRate, wobbleAmp, phase, size };
    return state;
  };

  const wrap = (state) => {
    const pad = 140;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (state.x < -pad) state.x = w + pad;
    if (state.x > w + pad) state.x = -pad;
    if (state.y < -pad) state.y = h + pad;
    if (state.y > h + pad) state.y = -pad;
  };

  const updateEl = (state) => {
    // Icons face "right" by default → add 0deg when moving right.
    const rot = Math.atan2(state.vy, state.vx) * (180 / Math.PI);
    state.el.style.transform = `translate3d(${state.x}px, ${state.y}px, 0) rotate(${rot}deg)`;
  };

  let sprites = [];
  let last = performance.now();

  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    for (const s of sprites) {
      const wobble = 1 + Math.sin(now / 1000 * s.wobbleRate + s.phase) * s.wobbleAmp;
      s.x += s.vx * dt * wobble;
      s.y += s.vy * dt * wobble;
      wrap(s);
      updateEl(s);
    }
    requestAnimationFrame(tick);
  };

  resolveCandidates().then((candidates) => {
    const usable = candidates.filter(Boolean);
    if (!usable.length) return;
    const count = clamp(Math.floor(window.innerWidth / 420) + 3, 4, 9);
    sprites = Array.from({ length: count }, (_, i) => spawn(pick(usable), i + 1));
    sprites.forEach(updateEl);
    requestAnimationFrame(tick);
  });
})();

// Mobile nav: hamburger + sheet links to Features / Support / About.
(() => {
  const header = document.querySelector(".nav");
  const toggle = document.querySelector(".menu-toggle");
  if (!header || !toggle) return;

  const setOpen = (open) => {
    header.classList.toggle("nav-menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  toggle.addEventListener("click", () => {
    setOpen(!header.classList.contains("nav-menu-open"));
  });

  header.querySelectorAll(".mobile-menu a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });

  document.addEventListener("click", (e) => {
    if (!header.classList.contains("nav-menu-open")) return;
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.closest(".nav-inner") || t.closest(".mobile-menu")) return;
    setOpen(false);
  });
})();
