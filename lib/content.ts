export const systemFacts = [
  ["STATUS", "PRELAUNCH"],
  ["AVAILABILITY", "NOT ON APP STORE"],
  ["ACCOUNT", "NOT REQUIRED"],
  ["CONTACT", "SUPPORT@LIVEORBITAPP.COM"]
];

export const capabilityCells = [
  {
    code: "ORBIT/01",
    title: "Live Globe",
    body: "Start from Earth. Follow object positions, orbit context, and satellite detail without turning the catalog into a spreadsheet.",
    span: "wide"
  },
  {
    code: "PASS/02",
    title: "Pass Predictions",
    body: "Use location with iOS permission to calculate visible passes, timing, peak elevation, and pass context.",
    span: "standard"
  },
  {
    code: "SKY/03",
    title: "Sky Mode and AR",
    body: "Point with device orientation and location. The app treats pointing as an estimate, not as navigation or safety guidance.",
    span: "standard"
  },
  {
    code: "FIND/04",
    title: "Search",
    body: "Search common names, aliases, NORAD IDs, missions, operators, and beginner terms. ISS handling is kept clean.",
    span: "tall"
  },
  {
    code: "BRIEF/05",
    title: "Insights",
    body: "Read catalog context, launches, reentries, trends, object highlights, and plain-language answers built from the app data model.",
    span: "standard"
  },
  {
    code: "SIGNAL/06",
    title: "News",
    body: "Track space stories, launches, mission updates, live streams, and events through the same product surface as the tracker.",
    span: "wide"
  }
];

export const sequence = [
  {
    label: "CATALOG",
    title: "Public orbital elements",
    body: "Live Orbit reads public orbital data and catalog facts. No private account is required for the core product."
  },
  {
    label: "PROPAGATE",
    title: "SGP4-style position estimates",
    body: "Satellite positions and passes are estimates. Freshness matters, and the product states its limits plainly."
  },
  {
    label: "LOCALIZE",
    title: "Your sky, with permission",
    body: "Location supports visible passes, maps, Sky Mode, and AR. iOS permission controls access."
  },
  {
    label: "INTERPRET",
    title: "Readable detail",
    body: "The app translates orbit data into sheets, widgets, search results, news, insights, and supportable context."
  }
];

export const trustLedger = [
  {
    term: "No store claim",
    detail: "The site treats Live Orbit as prelaunch until a real App Store or TestFlight URL exists."
  },
  {
    term: "No fake telemetry",
    detail: "The site avoids invented satellite counts, timestamps, operators, missions, countries, and activity claims."
  },
  {
    term: "Not safety critical",
    detail: "Positions, passes, maps, and pointing are estimates. They are not for navigation, collision avoidance, control, or emergency use."
  },
  {
    term: "Privacy-limited analytics",
    detail: "App telemetry is limited to broad usage, crash, performance, and MetricKit diagnostics. Exact location and raw searches are excluded."
  }
];

export const dataSourceSections = [
  {
    title: "Satellite Data",
    note: "Sources used to identify satellites and calculate their positions.",
    items: [
      ["Space-Track.org", "GP elements, SATCAT facts, object status, launch IDs, launch-site codes.", "Catalog, facts, tracking freshness, launch metadata."],
      ["CelesTrak", "OMM/TLE-style orbital element mirrors and supplemental catalog groups.", "Fast public fallback for live orbit propagation."],
      ["Live Orbit catalog mirror", "Prebuilt shards from the same public catalog data.", "Faster startup, facts lookup, and synced insights."]
    ]
  },
  {
    title: "Reference Data",
    note: "Sources used for context, links, and planning.",
    items: [
      ["Gunter's Space Page", "Spacecraft and mission reference pages.", "External reference links."],
      ["Jonathan McDowell / planet4589", "Satellite catalog reference material.", "Historical catalog cross-checks."],
      ["Open-Meteo", "Cloud cover and sky-condition weather.", "Pass planning context."]
    ]
  },
  {
    title: "Maps and Imagery",
    note: "Visual sources used for the globe, sky, and maps.",
    items: [
      ["Apple MapKit", "Apple map tiles, annotations, and map controls.", "Launch site maps and pass maps."],
      ["NASA Blue Marble", "Earth day texture and global imagery references.", "Globe rendering."],
      ["NASA Visible Earth", "Night lights and global Earth imagery references.", "Globe night-side styling."],
      ["NASA SVS Deep Star Maps", "All-sky star maps built from Gaia, Hipparcos, and Tycho catalogs.", "Sky background."],
      ["Natural Earth", "Public-domain land and boundary vectors.", "Map and geography overlays."]
    ]
  }
];

export const supportTopics = [
  "Report a problem",
  "Report a satellite data issue",
  "Ask about launch timing",
  "Request a feature",
  "Ask about future Pro plans"
];
