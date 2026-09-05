export type Guide = {
  slug: string; title: string; description: string; summary: string;
  sections: { title: string; paragraphs: string[]; steps?: string[] }[];
  sources: { name: string; url: string }[];
};
export const guideDate = "2026-09-05";
export const guides: Guide[] = [
  {
    slug: "satellite-tracking-iphone",
    title: "How to track satellites on iPhone",
    description: "Start satellite tracking on iPhone with Live Orbit. Learn how the Earth view, satellite search, visible passes, and Sky Mode fit together.",
    summary: "Start with a satellite on the map, check whether it has a visible pass from your location, then use sky guidance to look in the right direction. Live Orbit brings those parts of satellite tracking together on iPhone.",
    sections: [
      { title: "Choose what you want to find", paragraphs: ["The Earth view helps you explore satellites in orbit. Search is useful when you already have an object in mind, such as the International Space Station. Looking at the map and planning an observation answer different questions: where an object is, and whether you can see it.", "For a first session, keep it simple. Pick one object, look through its details, and concentrate on one upcoming viewing opportunity. A crowded globe does not need to become a crowded observing list."] },
      { title: "Turn a satellite into an observing plan", paragraphs: ["Live Orbit includes visible pass planning and Sky Mode. Use the pass information to prepare before you head outside, rather than trying to interpret every part of the app as a satellite crosses the sky."], steps: ["Confirm that the viewing location is the place where you will actually be observing.", "Choose a visible pass and read its timing and sky direction. Check which time zone the displayed time uses.", "Find a place with an open view in that direction and arrive before the pass begins.", "Use Sky Mode to orient yourself, then look up from the screen. Treat the guidance and predicted path as estimates."] },
      { title: "What the phone is doing", paragraphs: ["Live Orbit displays satellite tracking information and can use your location to provide local viewing context. Its radio section offers observation recordings when they are available. Playing a recording is different from receiving a satellite transmission directly with your phone.", "A map position alone is not a promise that an object is visible to your eyes. A visible-pass prediction, your actual surroundings, and sky conditions all matter. If you are having trouble, send the satellite name, viewing location, local time, and what you expected to see to Live Orbit support."] },
      { title: "Download and compatibility", paragraphs: ["Live Orbit is an iPhone app published by Apps Made Better LLC. It is free to download with in-app purchases. Use the App Store listing for current device requirements, availability, and purchase options."] },
    ],
    sources: [{ name: "Live Orbit on the App Store", url: "https://apps.apple.com/us/app/live-orbit/id6794325315" }],
  },
  {
    slug: "how-to-see-iss",
    title: "How to see the ISS from your location",
    description: "Plan an International Space Station sighting: choose a visible ISS pass, understand elevation and direction, and prepare your view of the sky.",
    summary: "To see the International Space Station, find a visible pass for your observing location, check where it will appear, and be outside a few minutes early. The station is visible by reflected sunlight, so an overhead pass is not always a visible one.",
    sections: [
      { title: "Start with your observing location", paragraphs: ["An ISS sighting plan is local. Check the place you will be watching from, the date, and the time zone before setting aside time for a pass. A screenshot shared by someone in another city is not a schedule for your sky.", "In Live Orbit, look for the ISS and check its pass information. NASA’s Spot the Station is another source for ISS viewing information. Compare the same location and date if you use more than one source."] },
      { title: "Read direction and elevation together", paragraphs: ["A compass direction tells you which way to face. Elevation tells you how far above the horizon to look: the horizon is 0 degrees and directly overhead is 90 degrees. A pass low in the sky can be harder to follow from between buildings or trees.", "Before the pass, identify the part of the sky you need to see. If your view is blocked, move to a suitable open area before it starts. A higher predicted pass may be more practical when nearby buildings hide the horizon."] },
      { title: "Make the observation easy", paragraphs: ["Prepare the app before the pass so that your attention can stay on the sky. You do not need to study every satellite detail during a short viewing opportunity."], steps: ["Confirm the start time and the direction where the station should appear.", "Be ready a few minutes early, with a clear view of that part of the sky.", "Use the predicted direction or Sky Mode as guidance, and look for a moving point of light.", "If you miss it, check the next visible opportunity rather than assuming the next orbit will be visible from the same spot."] },
      { title: "Why it may fade or fail to appear", paragraphs: ["NASA explains that the ISS can disappear as it moves into Earth’s shadow. Cloud and an obstructed view can also spoil an otherwise useful pass. A sighting prediction describes an opportunity, not a guaranteed observation.", "Keep your location and pass information current. If the time or direction seems wrong in Live Orbit, contact support with the pass date, satellite name, location, and a screenshot of the prediction. That gives us something specific to investigate."] },
    ],
    sources: [{ name: "NASA: Spot the Station frequently asked questions", url: "https://www.nasa.gov/missions/station/spot-the-station-frequently-asked-questions/" }, { name: "NASA: Understanding ISS sighting information", url: "https://spotthestation.nasa.gov/message_example.cfm" }],
  },
  {
    slug: "visible-satellite-passes",
    title: "Understanding visible satellite passes",
    description: "Learn the difference between an overhead satellite pass and a visible one, how to read a pass prediction, and why satellite pass times can change.",
    summary: "A satellite passing above your horizon is not necessarily visible. A useful observing prediction brings together the object’s estimated path, your location, and viewing conditions. Read the whole pass, not just its start time.",
    sections: [
      { title: "A map and a pass prediction do different jobs", paragraphs: ["The map gives you an overview of objects around Earth. A pass prediction narrows that picture to an observing location and a time window. A satellite displayed nearby on a globe can still be an unsuitable target for your next outdoor session.", "Live Orbit combines a 3D Earth view, satellite details, and visible pass planning. Use the globe to explore, then use the pass information to decide when and where to look. Sky Mode helps connect that plan with the direction you are facing."] },
      { title: "Read the complete viewing window", paragraphs: ["Write down the object, date, local time, viewing direction, and the highest part of the predicted path. Think about your actual view: an apartment window, courtyard, and open park give you very different parts of the sky.", "A prediction with a clear direction and a workable view is more useful than a long list of objects you cannot see from your location. Start with one pass and give yourself enough time to prepare."] },
      { title: "Why predictions change", paragraphs: ["Orbital data describes an object at a reference time. Models use that information to estimate its position later. CelesTrak notes that prediction accuracy depends on factors including the object’s orbit, the data, atmospheric drag, and maneuvers. There is no single accuracy figure that fits every satellite.", "Check the prediction again before observing, especially if you made your plan earlier. If two apps disagree, compare the object, location, time zone, and the freshness of the information before comparing the displayed times."] },
      { title: "A short troubleshooting checklist", paragraphs: ["If a pass did not look the way you expected, these details help separate a planning issue from a data issue."], steps: ["Check that you selected the same satellite and the correct observing date.", "Confirm the viewing location and local time zone.", "Compare the predicted direction with buildings, trees, and other obstructions.", "Check the sky conditions and refresh the pass information.", "Send support the prediction and what happened, including the time and satellite name."] },
      { title: "What to expect from Live Orbit", paragraphs: ["Live Orbit is designed for exploration and observing. Its positions, passes, maps, and pointing guidance are estimates. Treat them as a way to plan and understand your view, and report specific mismatches so they can be investigated."] },
    ],
    sources: [{ name: "CelesTrak: Orbital prediction accuracy and data updates", url: "https://celestrak.org/columns/v04n05/index.php" }],
  },
];
