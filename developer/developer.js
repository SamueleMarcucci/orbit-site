(() => {
  const state = {
    token: window.localStorage.getItem("live_orbit_dev_token") || "",
    lastPayload: null,
  };

  const apiBases = ["", "https://live-orbit-analytics.marcucci-sam.workers.dev"];

  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.protocol === "file:";

  const $ = (id) => document.getElementById(id);
  const fmt = new Intl.NumberFormat();
  const timeFmt = new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

  const demo = {
    overview: {
      active_now: 7,
      total_events: 1842,
      top_feature: "satellite detail",
      share_events: 46,
      top_targets: [
        { label: "International Space Station", kind: "satellite", count: 84 },
        { label: "AR mode", kind: "feature", count: 63 },
        { label: "Starlink-34284", kind: "satellite", count: 45 },
        { label: "Launches", kind: "view", count: 38 },
      ],
    },
    recent: [
      { event_name: "app.satellite.opened", target_name: "ISS", feature: "search", created_at: new Date().toISOString() },
      { event_name: "app.ar.opened", target_name: "Starlink-4414", feature: "ar", created_at: new Date().toISOString() },
      { event_name: "website.app_store_click", target_name: "Get the app", feature: "website", created_at: new Date().toISOString() },
    ],
    sessions: [
      { session_id: "demo-session-1", anonymous_id: "anon-7f41", event_count: 18, last_seen_at: new Date().toISOString() },
      { session_id: "demo-session-2", anonymous_id: "anon-a902", event_count: 11, last_seen_at: new Date().toISOString() },
    ],
    tree: {
      edges: [
        { label: "open app -> satellite detail", count: 96 },
        { label: "search -> ISS -> find", count: 73 },
        { label: "news -> article -> share", count: 42 },
        { label: "passes -> detail -> notification", count: 29 },
        { label: "sky mode -> focus -> AR", count: 21 },
      ],
    },
  };

  const headers = () => {
    const h = { Accept: "application/json" };
    if (state.token) h.Authorization = `Bearer ${state.token}`;
    return h;
  };

  const api = async (path) => {
    let lastError = null;
    for (const base of apiBases) {
      try {
        const response = await fetch(`${base}${path}`, {
          headers: headers(),
          credentials: base ? "omit" : "same-origin",
          cache: "no-store",
        });
        if (response.status === 401 || response.status === 403) {
          throw new Error("locked");
        }
        if (response.status === 404 && !base) {
          lastError = new Error("same_origin_api_missing");
          continue;
        }
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
      } catch (error) {
        if (error instanceof Error && error.message === "locked") throw error;
        lastError = error;
      }
    }
    throw lastError || new Error("api_unavailable");
  };

  const text = (value, fallback = "-") => {
    if (value === null || value === undefined || value === "") return fallback;
    return String(value);
  };

  const setStatus = (label, live = false) => {
    const pill = $("connection-pill");
    pill.textContent = label;
    pill.classList.toggle("is-live", live);
  };

  const setLocked = (locked) => {
    $("locked-panel").hidden = !locked;
  };

  const renderOverview = (overview) => {
    $("metric-active").textContent = fmt.format(overview.active_now || 0);
    $("metric-events").textContent = fmt.format(overview.total_events || 0);
    $("metric-feature").textContent = text(overview.top_feature);
    $("metric-shares").textContent = fmt.format(overview.share_events || 0);
  };

  const renderTargets = (targets = []) => {
    $("target-list").innerHTML = targets
      .slice(0, 8)
      .map(
        (item) => `
          <div class="rank-row">
            <strong>${escapeHtml(item.label || item.target_name || item.event_name || "Unknown")}</strong>
            <span>${escapeHtml(item.kind || item.target_type || "event")} · ${fmt.format(item.count || 0)} touches</span>
          </div>
        `
      )
      .join("");
  };

  const renderRecent = (events = []) => {
    $("event-stream").innerHTML = events
      .slice(0, 16)
      .map((event) => {
        const when = event.created_at ? timeFmt.format(new Date(event.created_at)) : "now";
        const target = event.target_name || event.target_id || event.page_path || "Live Orbit";
        return `
          <div class="event-row">
            <strong>${escapeHtml(event.event_name || "event")}</strong>
            <span>${escapeHtml(target)} · ${escapeHtml(event.feature || event.source || "app")} · ${when}</span>
          </div>
        `;
      })
      .join("");
  };

  const renderSessions = (sessions = []) => {
    $("session-list").innerHTML = sessions
      .slice(0, 12)
      .map(
        (session) => `
          <button class="session-row" type="button" data-session="${escapeAttr(session.session_id)}">
            <strong>${escapeHtml(session.anonymous_id || "anonymous user")}</strong>
            <span>${fmt.format(session.event_count || 0)} events · last seen ${escapeHtml(formatDate(session.last_seen_at))}</span>
          </button>
        `
      )
      .join("");
  };

  const renderTree = (tree = {}) => {
    const edges = tree.edges || [];
    const max = Math.max(1, ...edges.map((edge) => edge.count || 0));
    $("tree-canvas").innerHTML = edges
      .slice(0, 12)
      .map((edge) => {
        const width = Math.max(6, Math.round(((edge.count || 0) / max) * 100));
        return `
          <div class="tree-row">
            <span class="tree-label">${escapeHtml(edge.label || edge.path || "unknown path")}</span>
            <span class="tree-count">${fmt.format(edge.count || 0)}</span>
            <span class="tree-track" aria-hidden="true"><span class="tree-fill" style="--w: ${width}%"></span></span>
          </div>
        `;
      })
      .join("");
  };

  const render = (payload) => {
    renderOverview(payload.overview || {});
    renderTargets(payload.overview?.top_targets || []);
    renderRecent(payload.recent || []);
    renderSessions(payload.sessions || []);
    renderTree(payload.tree || {});
  };

  const load = async () => {
    try {
      setStatus("Connecting", false);
      const [overview, recent, sessions, tree] = await Promise.all([
        api("/api/analytics/admin/overview?range=24h"),
        api("/api/analytics/admin/recent?limit=60"),
        api("/api/analytics/admin/sessions?range=24h"),
        api("/api/analytics/admin/tree?range=24h"),
      ]);
      const payload = { overview, recent: recent.events, sessions: sessions.sessions, tree };
      state.lastPayload = payload;
      render(payload);
      setLocked(false);
      setStatus("Live", true);
    } catch (error) {
      if (error.message === "locked") {
        setLocked(true);
        setStatus("Locked", false);
        if (!state.lastPayload && isLocal) render(demo);
        return;
      }
      setStatus(isLocal ? "Local demo" : "Offline", false);
      if (isLocal) render(demo);
    }
  };

  const loadSession = async (sessionId) => {
    const dialog = $("session-dialog");
    const list = $("session-events");
    $("session-title").textContent = sessionId;
    list.innerHTML = `<div class="event-row"><strong>Loading</strong><span>Fetching session journey...</span></div>`;
    dialog.showModal();
    try {
      const payload = await api(`/api/analytics/admin/sessions/${encodeURIComponent(sessionId)}`);
      list.innerHTML = (payload.events || [])
        .map(
          (event) => `
            <div class="event-row">
              <strong>${escapeHtml(event.event_name || "event")}</strong>
              <span>${escapeHtml(event.target_name || event.page_path || "")} · ${escapeHtml(formatDate(event.created_at))}</span>
            </div>
          `
        )
        .join("");
    } catch {
      list.innerHTML = `<div class="event-row"><strong>Locked</strong><span>Cloudflare Access or local token is required.</span></div>`;
    }
  };

  const formatDate = (value) => {
    if (!value) return "unknown";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "unknown";
    return `${date.toLocaleDateString()} ${timeFmt.format(date)}`;
  };

  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => {
      const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return map[char];
    });

  const escapeAttr = (value) => escapeHtml(value).replace(/`/g, "&#96;");

  $("refresh-button").addEventListener("click", load);

  $("local-token-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const token = $("local-token").value.trim();
    state.token = token;
    if (token) window.localStorage.setItem("live_orbit_dev_token", token);
    else window.localStorage.removeItem("live_orbit_dev_token");
    load();
  });

  $("session-list").addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const row = target.closest("[data-session]");
    if (!row) return;
    loadSession(row.getAttribute("data-session"));
  });

  document.querySelectorAll("[data-close-dialog]").forEach((button) => {
    button.addEventListener("click", () => $("session-dialog").close());
  });

  load();
  window.setInterval(load, 15000);
})();
