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

// Drifting satellites (from assets/manifest.json). Fixed to viewport; does not scroll with content.
(() => {
  const root = document.querySelector(".orbital-assets");
  if (!root) return;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (reduced) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const resolveManifest = async () => {
    const manifestUrl = new URL("/assets/manifest.json", document.baseURI).toString();
    try {
      const r = await fetch(manifestUrl, { cache: "no-store" });
      if (!r.ok) return [];
      const json = await r.json();
      const list = Array.isArray(json?.images) ? json.images : Array.isArray(json) ? json : [];
      return list.map((p) => new URL(p, document.baseURI).toString());
    } catch {
      return [];
    }
  };

  const preload = async (urls) => {
    const checks = urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.decoding = "async";
          img.onload = () => resolve(src);
          img.onerror = () => resolve(null);
          img.src = src;
        })
    );
    const results = await Promise.all(checks);
    return results.filter(Boolean);
  };

  const spawn = (src, seed) => {
    const el = new Image();
    el.decoding = "async";
    el.loading = "eager";
    el.src = src;
    el.alt = "";
    el.className = "orbital-asset";
    root.appendChild(el);

    const size = clamp(44 + (seed % 6) * 10, 44, 108);
    el.style.setProperty("--asset-size", `${size}px`);
    el.style.setProperty("--asset-opacity", `${seed % 4 === 0 ? 0.62 : 0.78}`);

    const angle = Math.random() * Math.PI * 2;
    const speed = 30 + Math.random() * 40; // px/sec, clearly crosses screen
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const wobbleRate = 0.16 + Math.random() * 0.24;
    const wobbleAmp = 0.10 + Math.random() * 0.14;
    const phase = Math.random() * Math.PI * 2;

    // Spawn off-screen so sprites travel into view and out (no "pop-in" mid-screen).
    const pad = 220;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const ax = Math.abs(vx);
    const ay = Math.abs(vy);
    let x;
    let y;
    if (ax >= ay) {
      // Mostly horizontal travel → spawn from left/right edge.
      x = vx >= 0 ? -pad : w + pad;
      y = -pad + Math.random() * (h + pad * 2);
    } else {
      // Mostly vertical travel → spawn from top/bottom edge.
      y = vy >= 0 ? -pad : h + pad;
      x = -pad + Math.random() * (w + pad * 2);
    }

    return { el, x, y, vx, vy, wobbleRate, wobbleAmp, phase, lastX: x, lastY: y };
  };

  const wrap = (s) => {
    const pad = 180;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (s.x < -pad) s.x = w + pad;
    if (s.x > w + pad) s.x = -pad;
    if (s.y < -pad) s.y = h + pad;
    if (s.y > h + pad) s.y = -pad;
  };

  // Scroll parallax: keep satellites "in space" as you scroll.
  // They live in a fixed viewport layer, but we render them with a wrapped scroll offset
  // so they shift like the starfield (without becoming a cheap overlay).
  const PARALLAX = 0.62;
  const wrapRange = (v, range) => ((v % range) + range) % range;

  const updateEl = (s) => {
    const h = window.innerHeight;
    const pad = 180;
    const range = h + pad * 2;
    const scrollOffset = window.scrollY * PARALLAX;

    // Render positions are offset by scroll and wrapped so motion continues forever.
    const rx = s.x;
    const ry = wrapRange(s.y - scrollOffset + pad, range) - pad;

    // Rotation should match the satellite's own travel direction.
    // Scrolling adds parallax, but it should not cause the sprite to "steer" visually.
    const rot = Math.atan2(s.vy, s.vx) * (180 / Math.PI);

    s.el.style.transform = `translate3d(${rx}px, ${ry}px, 0) rotate(${rot}deg)`;
    s.lastX = s.x;
    s.lastY = s.y;
  };

  let sprites = [];
  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    for (const s of sprites) {
      const wobble = 1 + Math.sin(now / 1000 * s.wobbleRate + s.phase) * s.wobbleAmp;
      s.lastX = s.x;
      s.lastY = s.y;
      s.x += s.vx * dt * wobble;
      s.y += s.vy * dt * wobble;
      wrap(s);
      updateEl(s);
    }
    requestAnimationFrame(tick);
  };

  resolveManifest()
    .then((candidates) => preload(candidates.filter(Boolean)))
    .then((usable) => {
      if (!usable.length) return;
      const count = clamp(Math.floor(window.innerWidth / 520) + 3, 4, 8);
      sprites = Array.from({ length: count }, (_, i) => spawn(pick(usable), i + 1));
      sprites.forEach(updateEl);
      requestAnimationFrame(tick);
    });
})();

// Mobile nav: hamburger + sheet links to Features / Support / About.
(() => {
  // Ensure CTA icon is cross-device: if `assets/iphone.png` is missing, hide broken icon.
  document.querySelectorAll(".nav-cta-icon").forEach((img) => {
    if (!(img instanceof HTMLImageElement)) return;
    img.addEventListener(
      "error",
      () => {
        if (img.src && img.src.includes("/assets/iphone.png")) img.style.display = "none";
      },
      { once: true }
    );
  });

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
