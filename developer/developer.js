(() => {
  const storage = {
    clientId: "live_orbit_ga_client_id",
    propertyId: "live_orbit_ga_property_id",
    range: "live_orbit_dashboard_range",
  };

  const state = {
    accessToken: "",
    clientId: localStorage.getItem(storage.clientId) || "",
    propertyId: localStorage.getItem(storage.propertyId) || "",
    range: localStorage.getItem(storage.range) || "today",
    tokenClient: null,
  };

  const $ = (id) => document.getElementById(id);
  const fmt = new Intl.NumberFormat();
  const compact = new Intl.NumberFormat(undefined, { notation: "compact", maximumFractionDigits: 1 });

  const featureEvents = {
    satellite: ["satellite_selected", "detail_opened"],
    passes: ["passes_opened", "passes_calculated", "passes_calculation_started"],
    share: ["share_tapped"],
    ar: ["find_ar_opened", "sky_mode_opened"],
    failures: ["catalog_failed", "passes_failed", "find_ar_failed", "sky_mode_failed"],
    metrickit: ["metric_kit_payload_received", "metric_kit_diagnostic_received"],
  };

  function init() {
    $("client-id").value = state.clientId;
    $("property-id").value = state.propertyId;
    document.querySelectorAll("[data-range]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.range === state.range);
    });
    bindEvents();
    renderEmpty();
    log("Ready", "");
  }

  function bindEvents() {
    $("save-config").addEventListener("click", saveConfig);
    $("google-login").addEventListener("click", signIn);
    $("refresh-button").addEventListener("click", loadDashboard);
    $("clear-config").addEventListener("click", clearConfig);
    $("apple-file").addEventListener("change", handleAppleFile);

    $("range-control").addEventListener("click", (event) => {
      const button = event.target.closest("[data-range]");
      if (!button) return;
      state.range = button.dataset.range;
      localStorage.setItem(storage.range, state.range);
      document.querySelectorAll("[data-range]").forEach((item) => item.classList.toggle("is-active", item === button));
      loadDashboard();
    });

    window.addEventListener("scroll", updateNavCurrent, { passive: true });
    updateNavCurrent();
  }

  function saveConfig() {
    state.clientId = $("client-id").value.trim();
    state.propertyId = $("property-id").value.trim();
    localStorage.setItem(storage.clientId, state.clientId);
    localStorage.setItem(storage.propertyId, state.propertyId);
    setStatus("Saved", "saved");
    log("Saved", "");
  }

  function clearConfig() {
    state.accessToken = "";
    state.clientId = "";
    state.propertyId = "";
    localStorage.removeItem(storage.clientId);
    localStorage.removeItem(storage.propertyId);
    $("client-id").value = "";
    $("property-id").value = "";
    renderEmpty();
    setStatus("Not connected", "idle");
    log("Cleared", "");
  }

  function signIn() {
    saveConfig();
    if (!state.clientId || !state.propertyId) {
      setStatus("Missing setup", "error");
      log("Missing setup", "");
      return;
    }
    if (!window.google?.accounts?.oauth2) {
      setStatus("Google script blocked", "error");
      log("Google script blocked", "");
      return;
    }

    state.tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: state.clientId,
      scope: "https://www.googleapis.com/auth/analytics.readonly",
      callback: (response) => {
        if (response.error) {
          setStatus("Sign-in failed", "error");
          log("Sign-in failed", response.error);
          return;
        }
        state.accessToken = response.access_token;
        setStatus("Connected", "live");
        log("Connected", "");
        loadDashboard();
      },
    });

    state.tokenClient.requestAccessToken({ prompt: state.accessToken ? "" : "consent" });
  }

  async function loadDashboard() {
    if (!state.accessToken) {
      log("Not connected", "");
      return;
    }
    setStatus("Loading", "saved");
    $("refresh-button").textContent = "Loading";
    try {
      const [summary, realtime, events, timeline, versions, platforms] = await Promise.allSettled([
        runReport({ metrics: ["eventCount", "activeUsers", "totalUsers", "sessions"] }),
        runRealtime({ dimensions: ["eventName"], metrics: ["activeUsers"], limit: 20 }),
        runReport({
          dimensions: ["eventName"],
          metrics: ["eventCount", "activeUsers"],
          limit: 80,
          orderMetric: "eventCount",
        }),
        runReport({
          dimensions: [state.range === "today" ? "dateHour" : "date"],
          metrics: ["eventCount", "activeUsers"],
          limit: 120,
        }),
        runReport({
          dimensions: ["appVersion"],
          metrics: ["eventCount", "activeUsers"],
          limit: 20,
          orderMetric: "eventCount",
        }),
        runReport({
          dimensions: ["platform"],
          metrics: ["eventCount", "activeUsers"],
          limit: 20,
          orderMetric: "eventCount",
        }),
      ]);

      const payload = {
        summary: unwrap(summary),
        realtime: unwrap(realtime),
        events: unwrap(events),
        timeline: unwrap(timeline),
        versions: unwrap(versions),
        platforms: unwrap(platforms),
      };

      renderDashboard(payload);
      setStatus("Connected", "live");
      $("last-updated").textContent = `Updated ${new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
      log("Updated", "");
    } catch (error) {
      setStatus("Error", "error");
      log("Load failed", error.message || "Could not load Firebase Analytics data.");
    } finally {
      $("refresh-button").textContent = "Refresh";
    }
  }

  async function runReport({ dimensions = [], metrics = [], limit, orderMetric }) {
    const body = {
      dateRanges: [{ startDate: state.range, endDate: "today" }],
      metrics: metrics.map((name) => ({ name })),
      dimensions: dimensions.map((name) => ({ name })),
    };
    if (limit) body.limit = String(limit);
    if (orderMetric) {
      body.orderBys = [{ metric: { metricName: orderMetric }, desc: true }];
    }
    return analyticsFetch(`properties/${state.propertyId}:runReport`, body);
  }

  async function runRealtime({ dimensions = [], metrics = [], limit }) {
    const body = {
      metrics: metrics.map((name) => ({ name })),
      dimensions: dimensions.map((name) => ({ name })),
    };
    if (limit) body.limit = String(limit);
    return analyticsFetch(`properties/${state.propertyId}:runRealtimeReport`, body);
  }

  async function analyticsFetch(path, body) {
    const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${state.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.error?.message || `Google Analytics API ${response.status}`);
    }
    return json;
  }

  function unwrap(result) {
    if (result.status === "fulfilled") return result.value;
    log("Partial report failed", result.reason?.message || "One Firebase report could not load.");
    return null;
  }

  function renderDashboard(payload) {
    const summary = reportRows(payload.summary)[0]?.metrics || {};
    $("total-events").textContent = formatNumber(summary.eventCount);
    $("total-users").textContent = formatNumber(summary.activeUsers || summary.totalUsers);
    $("total-sessions").textContent = formatNumber(summary.sessions);

    const realtimeRows = reportRows(payload.realtime);
    const activeNow = realtimeRows.reduce((sum, row) => sum + Number(row.metrics.activeUsers || 0), 0);
    $("active-now").textContent = formatNumber(activeNow);

    renderRealtime(realtimeRows);
    renderTimeline(reportRows(payload.timeline));
    renderEventTable(reportRows(payload.events));
    renderFeatureCards(reportRows(payload.events));
    renderStack("version-list", reportRows(payload.versions), "appVersion");
    renderStack("platform-list", reportRows(payload.platforms), "platform");
  }

  function renderRealtime(rows) {
    if (!rows.length) {
      $("realtime-list").innerHTML = empty("No realtime events");
      return;
    }
    $("realtime-list").innerHTML = rows
      .map((row) => stackRow(row.dimensions.eventName || "unknown", `${formatNumber(row.metrics.activeUsers)} active`))
      .join("");
  }

  function renderTimeline(rows) {
    if (!rows.length) {
      $("timeline-chart").innerHTML = empty("No chart data");
      return;
    }
    const max = Math.max(1, ...rows.map((row) => Number(row.metrics.eventCount || 0)));
    $("timeline-chart").innerHTML = rows
      .map((row) => {
        const height = Math.max(3, Math.round((Number(row.metrics.eventCount || 0) / max) * 100));
        const label = Object.values(row.dimensions)[0] || "bucket";
        return `<span style="--h:${height}%" title="${escapeAttr(label)} · ${formatNumber(row.metrics.eventCount)} events"></span>`;
      })
      .join("");
  }

  function renderEventTable(rows) {
    if (!rows.length) {
      $("event-table").innerHTML = `<tr><td colspan="3">${empty("No events")}</td></tr>`;
      return;
    }
    $("event-table").innerHTML = rows
      .map(
        (row) => `
          <tr>
            <td>${escapeHtml(row.dimensions.eventName || "unknown")}</td>
            <td>${formatNumber(row.metrics.eventCount)}</td>
            <td>${formatNumber(row.metrics.activeUsers)}</td>
          </tr>
        `
      )
      .join("");
  }

  function renderFeatureCards(eventRows) {
    const counts = Object.fromEntries(
      eventRows.map((row) => [row.dimensions.eventName || "", Number(row.metrics.eventCount || 0)])
    );
    const totalFor = (events) => events.reduce((sum, name) => sum + (counts[name] || 0), 0);
    $("feature-satellite").textContent = formatNumber(totalFor(featureEvents.satellite));
    $("feature-passes").textContent = formatNumber(totalFor(featureEvents.passes));
    $("feature-share").textContent = formatNumber(totalFor(featureEvents.share));
    $("feature-ar").textContent = formatNumber(totalFor(featureEvents.ar));
    $("feature-failures").textContent = formatNumber(totalFor(featureEvents.failures));
    $("feature-metrickit").textContent = formatNumber(totalFor(featureEvents.metrickit));
  }

  function renderStack(id, rows, dimensionName) {
    if (!rows.length) {
      $(id).innerHTML = empty("No rows");
      return;
    }
    $(id).innerHTML = rows
      .map((row) => stackRow(row.dimensions[dimensionName] || "unknown", `${formatNumber(row.metrics.eventCount)} events`))
      .join("");
  }

  function reportRows(report) {
    if (!report?.rows?.length) return [];
    const dimensions = report.dimensionHeaders?.map((item) => item.name) || [];
    const metrics = report.metricHeaders?.map((item) => item.name) || [];
    return report.rows.map((row) => ({
      dimensions: Object.fromEntries(dimensions.map((name, index) => [name, row.dimensionValues?.[index]?.value || ""])),
      metrics: Object.fromEntries(metrics.map((name, index) => [name, Number(row.metricValues?.[index]?.value || 0)])),
    }));
  }

  function handleAppleFile(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = parseCsv(String(reader.result || ""));
      renderAppleStats(rows);
      log("Apple import", `${fmt.format(rows.length)} rows`);
    };
    reader.readAsText(file);
  }

  function renderAppleStats(rows) {
    const totals = {
      rows: rows.length,
      installs: sumColumn(rows, ["app units", "units", "first-time downloads", "installs"]),
      pageViews: sumColumn(rows, ["product page views", "page views", "impressions"]),
      crashes: sumColumn(rows, ["crashes", "crash count"]),
    };
    $("apple-stats").innerHTML = `
      <article><span>Rows</span><strong>${formatNumber(totals.rows)}</strong></article>
      <article><span>Installs</span><strong>${formatNumber(totals.installs)}</strong></article>
      <article><span>Page views</span><strong>${formatNumber(totals.pageViews)}</strong></article>
      <article><span>Crashes</span><strong>${formatNumber(totals.crashes)}</strong></article>
    `;
  }

  function parseCsv(text) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];
    const headers = splitCsvLine(lines[0]).map((header) => normalize(header));
    return lines.slice(1).map((line) => {
      const values = splitCsvLine(line);
      return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
    });
  }

  function splitCsvLine(line) {
    const cells = [];
    let cell = "";
    let quote = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      const next = line[i + 1];
      if (char === '"' && quote && next === '"') {
        cell += '"';
        i += 1;
      } else if (char === '"') {
        quote = !quote;
      } else if (char === "," && !quote) {
        cells.push(cell.trim());
        cell = "";
      } else {
        cell += char;
      }
    }
    cells.push(cell.trim());
    return cells;
  }

  function sumColumn(rows, possibleNames) {
    return rows.reduce((sum, row) => {
      const key = possibleNames.map(normalize).find((name) => row[name] !== undefined);
      if (!key) return sum;
      const value = Number(String(row[key]).replace(/[^0-9.-]/g, ""));
      return Number.isFinite(value) ? sum + value : sum;
    }, 0);
  }

  function renderEmpty() {
    ["active-now", "total-events", "total-users", "total-sessions", "feature-satellite", "feature-passes", "feature-share", "feature-ar", "feature-failures", "feature-metrickit"].forEach((id) => {
      $(id).textContent = "-";
    });
    $("timeline-chart").innerHTML = empty("Connect Firebase");
    $("realtime-list").innerHTML = empty("No connection");
    $("event-table").innerHTML = `<tr><td colspan="3">${empty("No data")}</td></tr>`;
    $("version-list").innerHTML = empty("No build data");
    $("platform-list").innerHTML = empty("No platform data");
    $("last-updated").textContent = "Waiting";
  }

  function setStatus(label, mode) {
    $("connection-title").textContent = label;
    $("status-dot").classList.toggle("is-live", mode === "live");
    $("status-dot").classList.toggle("is-error", mode === "error");
  }

  function log(title, detail) {
    const row = document.createElement("div");
    row.className = "log-row";
    row.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(detail)}</span>`;
    $("log-list").prepend(row);
  }

  function stackRow(label, value) {
    return `<div class="stack-row"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></div>`;
  }

  function empty(title, detail = "") {
    const body = detail ? `<br /><span>${escapeHtml(detail)}</span>` : "";
    return `<div class="empty"><div><strong>${escapeHtml(title)}</strong>${body}</div></div>`;
  }

  function formatNumber(value) {
    const number = Number(value || 0);
    if (!Number.isFinite(number)) return "-";
    return number >= 10000 ? compact.format(number) : fmt.format(number);
  }

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => {
      const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return map[char];
    });
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }

  function updateNavCurrent() {
    const sections = [...document.querySelectorAll("main section[id]")];
    const current = sections
      .map((section) => ({ id: section.id, top: Math.abs(section.getBoundingClientRect().top - 88) }))
      .sort((a, b) => a.top - b.top)[0]?.id;
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.toggleAttribute("aria-current", link.getAttribute("href") === `#${current}`);
    });
  }

  init();
})();
