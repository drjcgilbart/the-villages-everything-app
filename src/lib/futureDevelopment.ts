/**
 * Future Development hub content — pure data (safe for any component).
 * YouTube creators are independent; this site is not affiliated with them
 * or The Villages® developer.
 */

export type DroneCreator = {
  id: string;
  name: string;
  handle: string;
  channelUrl: string;
  blurb: string;
  strengths: string[];
  /** Optional recent-ish video to embed */
  featuredVideoId?: string;
  featuredVideoTitle?: string;
};

export type DevelopmentArea = {
  id: string;
  title: string;
  region: string;
  status: "hot" | "building" | "watch" | "open";
  summary: string;
  tips: string[];
  relatedVillageSlugs?: string[];
};

export type WatchPick = {
  id: string;
  title: string;
  creatorId: string;
  youtubeId: string;
  why: string;
};

export const DRONE_CREATORS: DroneCreator[] = [
  {
    id: "dd-aerial",
    name: "DD Aerial Photography",
    handle: "@DD-Aerial-Photography",
    channelUrl: "https://www.youtube.com/@DD-Aerial-Photography",
    blurb:
      "Soar-above tours of The Villages — villages, lakes, squares, and construction progress with that “wait, is that my roof?” energy.",
    strengths: [
      "Village-by-village aerial tours",
      "Construction flyovers",
      "Lakes, golf, and square vibes from altitude",
    ],
    featuredVideoId: "aEfkThqmCHY",
    featuredVideoTitle: "Village of Edenfield aerial look",
  },
  {
    id: "papa-pineapples",
    name: "Papa Pineapples",
    handle: "@PapaPineapples",
    channelUrl: "https://www.youtube.com/@PapaPineapples",
    blurb:
      "The Villages Experience™ — drone cruises, new construction surprises, town centers, and the occasional “new area unlocked” tour.",
    strengths: [
      "New construction progress",
      "Hidden gems & cruising series",
      "Real-estate-adjacent flyovers",
    ],
    featuredVideoId: "hySM1HrVv8Q",
    featuredVideoTitle: "Oak Hollow & Lakeview construction from above",
  },
  {
    id: "gold-wingnut",
    name: "Gold Wingnut",
    handle: "@GoldWingnut",
    channelUrl: "https://www.youtube.com/@GoldWingnut",
    blurb:
      "Construction updates, news, and live Q&A energy — the “what’s going up now?” channel for Sumter County watchers.",
    strengths: [
      "Regular construction update series",
      "Live streams & Q&A",
      "Big-picture progress reports",
    ],
    featuredVideoId: "rhW2CbphsJc",
    featuredVideoTitle: "The Villages Construction Update series",
  },
  {
    id: "villages-chief",
    name: "The Villages Chief",
    handle: "@TheVillagesChief",
    channelUrl: "https://www.youtube.com/@TheVillagesChief",
    blurb:
      "Retired Navy Chief, full-time Villager, and honest “here’s what it’s actually like” energy — homes, lifestyle, motors, and the occasional aerial side quest.",
    strengths: [
      "Living-here reviews & day-in-the-life",
      "New-home / Eastport-area stories",
      "Cars, jeeps, and Florida adventure detours",
    ],
    featuredVideoId: "jHI7bm3SsRw",
    featuredVideoTitle: "Is The Villages really worth it? 3-year experience",
  },
  {
    id: "rock-cop-aviation",
    name: "Rock Cop Aviation",
    handle: "@Rockcopaviation",
    channelUrl: "https://www.youtube.com/@Rockcopaviation",
    blurb:
      "Wheels-up Florida flying — scenic hops, airparks, and the sky view of Central Florida that pairs perfectly with ground-level Villages growth talk.",
    strengths: [
      "Scenic Florida flights",
      "Airpark & runway adventures",
      "Aerial context beyond the gates",
    ],
    featuredVideoId: "sFdxzaf90D8",
    featuredVideoTitle: "Scenic flight over Florida with Rock Cop Aviation",
  },
];

export const WATCH_PICKS: WatchPick[] = [
  {
    id: "pick-1",
    title: "Edenfield from the air",
    creatorId: "dd-aerial",
    youtubeId: "aEfkThqmCHY",
    why: "Newest-chapter FOMO — Eastport-area growth in one flyby.",
  },
  {
    id: "pick-2",
    title: "Oak Hollow & Lakeview progress",
    creatorId: "papa-pineapples",
    youtubeId: "hySM1HrVv8Q",
    why: "All-drone construction progress when you want dirt-to-rooftops context.",
  },
  {
    id: "pick-3",
    title: "Construction update deep dive",
    creatorId: "gold-wingnut",
    youtubeId: "rhW2CbphsJc",
    why: "Longer-form “here’s what’s moving” reporting for the map nerds.",
  },
  {
    id: "pick-4",
    title: "New surprises tour",
    creatorId: "papa-pineapples",
    youtubeId: "vXLYFkY6soA",
    why: "Brand-new construction and the delight of “wait, that wasn’t there last month.”",
  },
  {
    id: "pick-5",
    title: "Three-year Villages reality check",
    creatorId: "villages-chief",
    youtubeId: "jHI7bm3SsRw",
    why: "Ground-truth living review when you’re weighing the move — not just the dirt piles.",
  },
  {
    id: "pick-6",
    title: "Flying with Rock Cop Aviation to Venice",
    creatorId: "villages-chief",
    youtubeId: "1prYzSTei6U",
    why: "Villages-based collab hop — sky adventure energy with Rock Cop Aviation.",
  },
  {
    id: "pick-7",
    title: "Scenic flight over Florida",
    creatorId: "rock-cop-aviation",
    youtubeId: "sFdxzaf90D8",
    why: "Wheels-up context for the wider Central Florida map around The Villages.",
  },
];

export const DEVELOPMENT_AREAS: DevelopmentArea[] = [
  {
    id: "eastport",
    title: "Eastport growth corridor",
    region: "Eastport / eastern expansion",
    status: "hot",
    summary:
      "One of the newest “center of it all” chapters — town-center energy, championship golf adjacency, and villages like Edenfield, Oak Hollow, and friends filling in fast.",
    tips: [
      "Watch drone flyovers month-to-month — rooftops appear like popcorn.",
      "Pair aerials with My Village pages for CDD / area context.",
      "Town-center amenities often lag housing by a beat — manage expectations.",
    ],
    relatedVillageSlugs: ["edenfield", "oak-hollow", "lagrange", "moultrie-creek"],
  },
  {
    id: "south-44",
    title: "South of SR 44",
    region: "Southern expansion",
    status: "building",
    summary:
      "Fenney-area and south-of-44 villages keep the map marching south — newer floor plans, longer cart rides to classic squares, and lots of dirt in the background of drone videos.",
    tips: [
      "Construction update channels love this corridor — great for progress porn.",
      "Ask: how far is Brownwood vs Eastport vs your daily coffee run?",
    ],
    relatedVillageSlugs: ["fenney", "desoto", "deluna", "monarch-grove"],
  },
  {
    id: "in-fill",
    title: "In-fill & finishing touches",
    region: "Across Sumter / established edges",
    status: "watch",
    summary:
      "Not every “new” thing is a brand-new village — watch for finishing phases, commercial pads, and rec upgrades that change daily life without a new village name.",
    tips: [
      "Gold Wingnut-style updates often catch infrastructure you’d miss from the cart path.",
      "Commercial + rec additions matter as much as model homes.",
    ],
  },
  {
    id: "beyond",
    title: "Around The Villages",
    region: "Sumter & nearby counties",
    status: "open",
    summary:
      "Roads, neighboring projects, and regional growth that affect traffic, shopping runs, and “is that still The Villages?” debates.",
    tips: [
      "Drone pilots sometimes swing wider than the gates — useful for context.",
      "Always verify land-use news with official county / district sources.",
    ],
  },
];

export const WATCHER_TIPS = [
  {
    title: "Watch before you drive",
    body: "A five-minute aerial beats a 45-minute wrong-gate adventure. Scout villages from the couch, then cart with confidence.",
  },
  {
    title: "Compare months, not minutes",
    body: "New construction looks chaotic up close. Drone progress videos make the timeline make sense.",
  },
  {
    title: "Support the pilots",
    body: "Like, subscribe, and respect airspace / privacy — these creators spend real time (and batteries) so the rest of us can rubberneck responsibly.",
  },
  {
    title: "Not official marketing",
    body: "These channels are independent. Official product, pricing, and availability always come from The Villages® sales / your agent — not a YouTube title.",
  },
];

export function creatorById(id: string) {
  return DRONE_CREATORS.find((c) => c.id === id) || null;
}

export function statusLabel(status: DevelopmentArea["status"]) {
  switch (status) {
    case "hot":
      return "🔥 Hot growth";
    case "building":
      return "🚧 Building now";
    case "watch":
      return "👀 Worth watching";
    case "open":
      return "🗺️ Wider map";
  }
}
