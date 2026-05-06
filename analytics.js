(() => {
  const endpoint =
    window.LiveOrbitAnalyticsEndpoint ||
    "https://live-orbit-analytics.marcucci-sam.workers.dev/api/analytics/events";
  const anonKey = "live_orbit_anon_id_v1";
  const sessionKey = "live_orbit_session_id_v1";
  const maxLabelLength = 120;
  const maxMetadataValueLength = 500;
  const blockedKeys = new Set([
    "email",
    "phone",
    "name",
    "firstName",
    "lastName",
    "address",
    "token",
    "password",
    "secret",
  ]);

  const randomId = () => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    const bytes = new Uint8Array(16);
    window.crypto?.getRandomValues?.(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex
      .slice(6, 8)
      .join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
  };

  const readOrCreate = (storage, key) => {
    try {
      const existing = storage.getItem(key);
      if (existing) return existing;
      const value = randomId();
      storage.setItem(key, value);
      return value;
    } catch {
      return randomId();
    }
  };

  const anonymousId = readOrCreate(window.localStorage, anonKey);
  const sessionId = readOrCreate(window.sessionStorage, sessionKey);

  const cleanString = (value, max = maxLabelLength) =>
    String(value ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, max);

  const sanitizeMetadata = (metadata = {}) => {
    const clean = {};
    Object.entries(metadata).forEach(([key, value]) => {
      if (!key || blockedKeys.has(key)) return;
      if (value === undefined || value === null) return;
      if (typeof value === "string") clean[key] = cleanString(value, maxMetadataValueLength);
      else if (typeof value === "number" || typeof value === "boolean") clean[key] = value;
      else if (Array.isArray(value)) clean[key] = value.slice(0, 20).map((item) => cleanString(item, 100));
      else clean[key] = cleanString(JSON.stringify(value), maxMetadataValueLength);
    });
    return clean;
  };

  const send = (events) => {
    const body = JSON.stringify({ events });
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
      if (ok) return;
    }
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      credentials: "omit",
      keepalive: true,
    }).catch(() => {});
  };

  const track = (eventName, metadata = {}) => {
    if (!eventName || document.visibilityState === "prerender") return;
    const event = {
      event_name: cleanString(eventName, 80),
      timestamp: new Date().toISOString(),
      anonymous_id: anonymousId,
      session_id: sessionId,
      page_path: window.location.pathname,
      page_title: cleanString(document.title, 160),
      referrer: cleanString(document.referrer, 300),
      source: "website",
      platform: "web",
      metadata: sanitizeMetadata(metadata),
    };
    send([event]);
  };

  const readableText = (element) => {
    const aria = element.getAttribute("aria-label");
    if (aria) return cleanString(aria);
    return cleanString(element.textContent || element.title || element.href || element.tagName);
  };

  const classifyClick = (target) => {
    const anchor = target.closest?.("a");
    const button = target.closest?.("button");
    if (!anchor && !button) return null;

    const element = anchor || button;
    const href = anchor?.href || "";
    const label = readableText(element);
    const localUrl = href ? new URL(href, window.location.href) : null;
    const isAppStore = href.includes("apps.apple.com");
    const isExternal = localUrl && localUrl.origin !== window.location.origin && !isAppStore;

    if (isAppStore) {
      return ["website.app_store_click", { label, href }];
    }
    if (element.closest(".nav") || element.closest(".mobile-menu")) {
      return ["website.nav_click", { label, href: localUrl?.pathname || href }];
    }
    if (isExternal) {
      return ["website.outbound_click", { label, href }];
    }
    return ["website.click", { label, href: localUrl?.pathname || href }];
  };

  window.LiveOrbitAnalytics = { track, anonymousId, sessionId };

  window.addEventListener("DOMContentLoaded", () => {
    track("website.page_view", {
      path: window.location.pathname,
      title: document.title,
    });
  });

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const result = classifyClick(target);
      if (!result) return;
      track(result[0], result[1]);
    },
    { capture: true, passive: true }
  );
})();
