import {
  Binoculars,
  Broadcast,
  Compass,
  Crosshair,
  GlobeHemisphereWest,
  MagnifyingGlass,
  Newspaper,
  Planet,
  ShieldCheck,
  Sparkle,
  TrendUp
} from "@phosphor-icons/react/dist/ssr";

export const proofPoints = [
  "Live position estimates from public orbital elements",
  "Pass predictions built around your location",
  "No account required for the core app",
  "Privacy-first telemetry and clear safety limits"
];

export const featureCards = [
  {
    title: "Live globe",
    body: "Start from Earth, not a spreadsheet. Follow satellites, orbit bands, and readable detail sheets from the main globe.",
    icon: GlobeHemisphereWest,
    tone: "blue"
  },
  {
    title: "Visible passes",
    body: "Plan upcoming viewing windows from your location with peak elevation, timing, and pass details.",
    icon: Binoculars,
    tone: "green"
  },
  {
    title: "Sky Mode and AR",
    body: "Use compass, device orientation, and location to point toward live satellite positions above the horizon.",
    icon: Crosshair,
    tone: "silver"
  },
  {
    title: "Search that understands space",
    body: "Search common names, NORAD IDs, organizations, missions, and aliases. ISS support is handled cleanly.",
    icon: MagnifyingGlass,
    tone: "blue"
  },
  {
    title: "Insights",
    body: "Read catalog breakdowns, launch and reentry trends, and facts that make the orbital catalog easier to understand.",
    icon: TrendUp,
    tone: "green"
  },
  {
    title: "News and events",
    body: "Follow launches, space events, articles, video, and live content in the same product language as the tracker.",
    icon: Newspaper,
    tone: "silver"
  }
];

export const storySteps = [
  {
    title: "Open the globe",
    body: "Live Orbit starts with a calm Earth view so the first signal is spatial, not a table.",
    icon: Planet
  },
  {
    title: "Choose an object",
    body: "The detail sheet turns catalog data, orbit data, widgets, notes, and actions into readable context.",
    icon: Broadcast
  },
  {
    title: "Step outside",
    body: "Pass predictions and Sky Mode connect the catalog to the sky above your current location.",
    icon: Compass
  }
];

export const trustItems = [
  {
    title: "Public orbital sources",
    body: "Live Orbit uses public orbital elements and catalog metadata, including Space-Track and CelesTrak derived data.",
    icon: ShieldCheck
  },
  {
    title: "Honest accuracy",
    body: "Satellite positions, passes, and AR pointing are estimates. They are not for navigation, safety-critical work, collision avoidance, or satellite control.",
    icon: Crosshair
  },
  {
    title: "Clean app privacy",
    body: "No account is required. Location supports visible passes and AR, controlled by iOS permission. Analytics avoids exact location, email, raw searches, and raw URLs.",
    icon: Sparkle
  }
];

export const dataSourceSections = [
  {
    title: "Satellite Data",
    subtitle: "Sources used to identify satellites and calculate their positions.",
    items: [
      {
        name: "Space-Track.org",
        data: "GP elements, SATCAT facts, object status, launch IDs, and launch-site codes.",
        use: "Catalog, facts, tracking freshness, and launch metadata."
      },
      {
        name: "CelesTrak",
        data: "OMM/TLE-style orbital element mirrors and supplemental catalog groups.",
        use: "Fast public fallback for live orbit propagation."
      },
      {
        name: "Live Orbit catalog mirror",
        data: "Prebuilt shards from the same public catalog data.",
        use: "Faster startup, facts lookup, and synced insights."
      }
    ]
  },
  {
    title: "Reference Data",
    subtitle: "Sources used for context, links, and planning.",
    items: [
      {
        name: "Gunter's Space Page",
        data: "Spacecraft and mission reference pages.",
        use: "External reference links."
      },
      {
        name: "Jonathan McDowell / planet4589",
        data: "Satellite catalog reference material.",
        use: "Historical catalog cross-checks."
      },
      {
        name: "Open-Meteo",
        data: "Cloud cover and sky-condition weather.",
        use: "Pass planning context."
      }
    ]
  },
  {
    title: "Maps and Imagery",
    subtitle: "Visual sources used for the globe, sky, and maps.",
    items: [
      {
        name: "Apple MapKit",
        data: "Apple map tiles, annotations, and map controls.",
        use: "Launch site maps and pass maps."
      },
      {
        name: "NASA Blue Marble",
        data: "Earth day texture and global imagery references.",
        use: "Globe rendering."
      },
      {
        name: "NASA Visible Earth",
        data: "Night lights and global Earth imagery references.",
        use: "Globe night-side styling."
      },
      {
        name: "NASA SVS Deep Star Maps",
        data: "All-sky star maps built from Gaia, Hipparcos, and Tycho catalogs.",
        use: "Sky background."
      },
      {
        name: "Natural Earth",
        data: "Public-domain land and boundary vectors.",
        use: "Map and geography overlays."
      }
    ]
  }
];

export const supportTopics = [
  "Report a problem",
  "Report a satellite data issue",
  "Request a feature",
  "Ask about launch timing",
  "Ask about billing or future Pro plans"
];
