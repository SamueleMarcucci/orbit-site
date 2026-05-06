(() => {
  const state = {
    token: window.localStorage.getItem("live_orbit_dev_token") || "",
    range: "24h",
    targetFilter: "",
    payload: null,
  };

  const apiBases = ["", "https://live-orbit-analytics.marcucci-sam.workers.dev"];
  const $ = (id) => document.getElementById(id);
  const fmt = new Intl.NumberFormat();
  const dateFmt = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  const timeFmt = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit", second: "2-digit" });

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
        if (response.status === 401 || response.status === 403) throw new Error("locked");
        if (response.status === 404 && !base) {
          lastError = new Error("same_origin_api_missing");
          continue;
        }
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      } catch (error) {
        if (error instanceof Error && error.message === "locked") throw error;
        lastError = error;
      }
    }
    throw lastError || new Error("api_unavailable");
  };

  const setStatus = (label, live = false) => {
    const pill = $("connection-pill");
    pill.textContent = label;
    pill.classList.toggle("is-live", live);
  };

  const setLocked = (locked) => {
    $("locked-panel").hidden = !locked;
  };

  const render = (payload) => {
    state.payload = payload;
    const { overview, health, recent, sessions, tree, breakdowns, timeseries, targets } = payload;

    $("metric-active").textContent = fmt.format(overview.active_now || 0);
    $("metric-events").textContent = fmt.format(overview.total_events || 0);
    $("metric-sessions").textContent = fmt.format(overview.unique_sessions || 0);
    $("metric-server").textContent = health.ok ? "Online" : "Check";

    renderLatest(overview.latest_event, health);
    renderChart(timeseries.points || []);
    renderRecent(recent.events || []);
    renderTree(tree.edges || []);
    renderRanks("feature-list", breakdowns.features || [], "feature");
    renderRanks("event-list", breakdowns.events || [], "event");
    renderRanks("platform-list", breakdowns.platforms || [], "platform");
    renderRanks("version-list", breakdowns.app_versions || [], "build");
    renderTargets(targets.targets || []);
    renderSessions(sessions.sessions || []);
    renderServer(health);
    $("raw-json").textContent = JSON.stringify(payload, null, 2);
  };

  const renderLatest = (event, health) => {
    if (!event) {
      $("latest-event").innerHTML = emptyState("No events yet", "The console is connected, but no real app or website activity has arrived.");
      return;
    }
    $("latest-event").innerHTML = detailRows([
      ["Event", event.event_name],
      ["Feature", event.feature],
      ["Target", event.target_name || "-"],
      ["Source", `${event.source || "-"} / ${event.platform || "-"}`],
      ["Time", formatDate(event.created_at)],
      ["DB latency", `${health.latency_ms || 0} ms`],
    ]);
  };

  const renderChart = (points) => {
    if (!points.length) {
      $("activity-chart").innerHTML = emptyState("No timeline yet", "Hourly activity appears here after real events arrive.");
      return;
    }
    const max = Math.max(1, ...points.map((p) => Number(p.events || 0)));
    $("activity-chart").innerHTML = points
      .map((point) => {
        const h = Math.max(4, Math.round((Number(point.events || 0) / max) * 100));
        return `<span class="chart-bar" title="${escapeAttr(point.bucket)} · ${fmt.format(point.events || 0)} events" style="--h:${h}%"></span>`;
      })
      .join("");
  };

  const renderRecent = (events) => {
    if (!events.length) {
      $("event-stream").innerHTML = emptyState("Waiting for real events", "No fake rows. This fills only when the website or app sends real telemetry.");
      return;
    }
    $("event-stream").innerHTML = events
      .map((event) => {
        const metadata = parseMetadata(event.metadata_json);
        return `
          <article class="event-row">
            <strong>${escapeHtml(event.event_name || "event")}</strong>
            <span>${escapeHtml(event.target_name || event.target_id || event.page_path || "Live Orbit")} · ${escapeHtml(event.feature || "-")} · ${formatTime(event.created_at)}</span>
            ${renderMetadata(metadata)}
          </article>
        `;
      })
      .join("");
  };

  const renderTree = (edges) => {
    if (!edges.length) {
      $("tree-canvas").innerHTML = emptyState("No behavior paths yet", "Paths become useful after multiple real events happen in the same anonymous session.");
      return;
    }
    const max = Math.max(1, ...edges.map((edge) => edge.count || 0));
    $("tree-canvas").innerHTML = edges
      .map((edge) => {
        const width = Math.max(6, Math.round(((edge.count || 0) / max) * 100));
        return `
          <div class="tree-row">
            <strong>${escapeHtml(edge.label || "unknown path")}</strong>
            <span>${fmt.format(edge.count || 0)}</span>
            <span class="tree-track" aria-hidden="true"><span class="tree-fill" style="--w:${width}%"></span></span>
          </div>
        `;
      })
      .join("");
  };

  const renderRanks = (id, rows, noun) => {
    if (!rows.length) {
      $(id).innerHTML = emptyState(`No ${noun} data yet`, "This section will fill after the app sends the matching events.");
      return;
    }
    $(id).innerHTML = rows
      .map(
        (row) => `
          <div class="rank-row">
            <strong>${escapeHtml(row.label || "unknown")}</strong>
            <span>${fmt.format(row.count || 0)} events</span>
          </div>
        `
      )
      .join("");
  };

  const renderTargets = (targets) => {
    if (!targets.length) {
      $("target-grid").innerHTML = emptyState("No targets yet", "Satellites, launches, articles, passes, settings, and shares show here once wired.");
      return;
    }
    $("target-grid").innerHTML = targets
      .map(
        (target) => `
          <button class="target-row" type="button">
            <strong>${escapeHtml(target.label || target.target_name || "Unknown target")}</strong>
            <span>${escapeHtml(target.target_type || target.feature || "event")} · ${fmt.format(target.count || 0)} touches · ${formatDate(target.last_seen_at)}</span>
          </button>
        `
      )
      .join("");
  };

  const renderSessions = (sessions) => {
    if (!sessions.length) {
      $("session-list").innerHTML = emptyState("No anonymous sessions yet", "Once real users visit or the app sends telemetry, journeys appear here.");
      $("session-events").innerHTML = emptyState("Nothing selected", "Select an anonymous session to inspect its event timeline.");
      return;
    }
    $("session-list").innerHTML = sessions
      .map(
        (session) => `
          <button class="session-row" type="button" data-session="${escapeAttr(session.session_id)}">
            <strong>${escapeHtml(session.anonymous_id || "anonymous user")}</strong>
            <span>${fmt.format(session.event_count || 0)} events · ${escapeHtml(session.platform || "-")} · ${formatDate(session.last_seen_at)}</span>
          </button>
        `
      )
      .join("");
  };

  const renderServer = (health) => {
    $("server-worker").textContent = health.ok ? "Online" : "Offline";
    $("server-host").textContent = health.host || "-";
    $("server-db").textContent = health.database?.ok ? "Connected" : "Check D1";
    $("server-db-copy").textContent = `${fmt.format(health.database?.total_events || 0)} events · ${fmt.format(health.database?.total_sessions || 0)} sessions`;
    $("server-ingest").textContent = `${fmt.format(health.database?.events_last_5m || 0)} events`;
    $("server-ingest-copy").textContent = "Accepted in the last 5 minutes.";
    $("server-latency").textContent = `${health.latency_ms || 0} ms`;
  };

  const load = async () => {
    try {
      setStatus("Connecting", false);
      const range = encodeURIComponent(state.range);
      const type = state.targetFilter ? `&type=${encodeURIComponent(state.targetFilter)}` : "";
      const [overview, recent, sessions, tree, health, breakdowns, timeseries, targets] = await Promise.all([
        api(`/api/analytics/admin/overview?range=${range}`),
        api("/api/analytics/admin/recent?limit=100"),
        api(`/api/analytics/admin/sessions?range=${range}`),
        api(`/api/analytics/admin/tree?range=${range}`),
        api("/api/analytics/admin/health"),
        api(`/api/analytics/admin/breakdowns?range=${range}`),
        api(`/api/analytics/admin/timeseries?range=${range}`),
        api(`/api/analytics/admin/targets?range=${range}${type}`),
      ]);
      render({ overview, recent, sessions, tree, health, breakdowns, timeseries, targets });
      setLocked(false);
      setStatus("Live", true);
    } catch (error) {
      if (error instanceof Error && error.message === "locked") {
        setLocked(true);
        setStatus("Locked", false);
        return;
      }
      setStatus("Offline", false);
    }
  };

  const loadSession = async (sessionId) => {
    $("session-title").textContent = sessionId;
    $("session-events").innerHTML = emptyState("Loading", "Fetching this anonymous journey.");
    try {
      const payload = await api(`/api/analytics/admin/sessions/${encodeURIComponent(sessionId)}`);
      const events = payload.events || [];
      if (!events.length) {
        $("session-events").innerHTML = emptyState("No events", "This session has no events in storage.");
        return;
      }
      $("session-events").innerHTML = events
        .map(
          (event) => `
            <article class="event-row">
              <strong>${escapeHtml(event.event_name || "event")}</strong>
              <span>${escapeHtml(event.target_name || event.page_path || "-")} · ${formatDate(event.created_at)}</span>
              ${renderMetadata(parseMetadata(event.metadata_json))}
            </article>
          `
        )
        .join("");
    } catch {
      $("session-events").innerHTML = emptyState("Locked", "Cloudflare Access or the developer token is required.");
    }
  };

  const detailRows = (rows) =>
    rows.map(([label, value]) => `<div class="detail-row"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value || "-")}</span></div>`).join("");

  const renderMetadata = (metadata) => {
    const entries = Object.entries(metadata || {}).slice(0, 12);
    if (!entries.length) return "";
    return `<div class="metadata-grid">${entries.map(([key, value]) => `<span><code>${escapeHtml(key)}</code>: ${escapeHtml(value)}</span>`).join("")}</div>`;
  };

  const parseMetadata = (value) => {
    try {
      return value ? JSON.parse(value) : {};
    } catch {
      return {};
    }
  };

  const emptyState = (title, body) => `
    <div class="empty-state">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(body)}</span>
    </div>
  `;

  const formatDate = (value) => {
    if (!value) return "unknown";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "unknown";
    return dateFmt.format(date);
  };

  const formatTime = (value) => {
    if (!value) return "now";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "now";
    return timeFmt.format(date);
  };

  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => {
      const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return map[char];
    });

  const escapeAttr = (value) => escapeHtml(value).replace(/`/g, "&#96;");

  $("screen-nav").addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("[data-screen]");
    if (!button) return;
    const screen = button.getAttribute("data-screen");
    document.querySelectorAll("[data-screen]").forEach((item) => item.classList.toggle("is-active", item === button));
    document.querySelectorAll("[data-screen-panel]").forEach((panel) => {
      panel.classList.toggle("is-active", panel.getAttribute("data-screen-panel") === screen);
    });
  });

  $("range-select").addEventListener("change", (event) => {
    state.range = event.target.value;
    load();
  });

  $("refresh-button").addEventListener("click", load);

  $("local-token-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const token = $("local-token").value.trim();
    state.token = token;
    if (token) window.localStorage.setItem("live_orbit_dev_token", token);
    else window.localStorage.removeItem("live_orbit_dev_token");
    load();
  });

  document.querySelector(".target-toolbar").addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const chip = target.closest("[data-target-filter]");
    if (!chip) return;
    document.querySelectorAll("[data-target-filter]").forEach((item) => item.classList.toggle("is-active", item === chip));
    state.targetFilter = chip.getAttribute("data-target-filter") || "";
    load();
  });

  $("session-list").addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const row = target.closest("[data-session]");
    if (!row) return;
    loadSession(row.getAttribute("data-session"));
  });

  $("copy-raw-button").addEventListener("click", async () => {
    await navigator.clipboard?.writeText($("raw-json").textContent || "{}");
    $("copy-raw-button").textContent = "Copied";
    window.setTimeout(() => {
      $("copy-raw-button").textContent = "Copy JSON";
    }, 1200);
  });

  load();
  window.setInterval(load, 15000);
})();
