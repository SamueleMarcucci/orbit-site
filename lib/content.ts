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

export const dataSources = [
  {
    name: "Space-Track.org",
    body: "GP elements, SATCAT facts, object status, launch IDs, and launch-site codes."
  },
  {
    name: "CelesTrak",
    body: "Orbital element mirrors and catalog group references used by the app experience."
  },
  {
    name: "Live Orbit catalog mirror",
    body: "A protected catalog mirror that supports app-ready snapshots, status, and insight payloads."
  },
  {
    name: "Jonathan McDowell and planet4589",
    body: "Reference material for spaceflight history and catalog interpretation."
  },
  {
    name: "NASA SVS Deep Star Maps",
    body: "Space imagery resources used for sky and background context."
  }
];

export const supportTopics = [
  "Report a problem",
  "Report a satellite data issue",
  "Request a feature",
  "Ask about launch timing",
  "Ask about billing or future Pro plans"
];
