/**
 * Five themed drive areas — one per Town Square / gathering hub.
 * Theming cues from The Villages Everything App vibe + public square writeups:
 * thevillages.com, Inside the Bubble, thevills.com, entertainment listings.
 *
 * Player-facing names match the five Town Square hubs, including Eastport.
 */

export type AreaId =
  | "spanish-springs"
  | "lake-sumter"
  | "brownwood"
  | "eastport"
  | "sawgrass-grove";

export type AreaTheme = {
  /** Sky dome gradient */
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  fog: string;
  /** Ground / road tints (multiply on textures) */
  grass: string;
  grassDeep: string;
  asphalt: string;
  sidewalk: string;
  curb: string;
  water: string;
  /** Building palette */
  stucco: string[];
  roof: string;
  roofAlt: string;
  plaza: string;
  accent: string;
  /** Landmark architecture vibe for square centerpiece */
  landmarkStyle: "southwest" | "lighthouse" | "western" | "midcentury" | "modern";
};

export type DriveArea = {
  id: AreaId;
  name: string;
  shortName: string;
  /** Selection card blurb */
  blurb: string;
  themeLine: string;
  area: string;
  /** Everything App / local flavor highlights */
  highlights: string[];
  /** Nearby rec centers to weave into the local loop */
  recCenterIds: string[];
  /** Landmark id for the square center (geo.ts) */
  squareLandmarkId: string;
  theme: AreaTheme;
  /** Emoji / badge for UI */
  emoji: string;
  /** Soft card gradient */
  cardGradient: string;
};

/**
 * Themed drive areas — visual + narrative identity per square.
 *
 * Spanish Springs — Spanish colonial / SW plaza (oldest, 1994-era energy):
 *   adobe stucco, red-tile roofs, fountains, palm walks, Main Street bands.
 * Sumter Landing — Lake Sumter Landing Market Square:
 *   Atlantic coastal / seaside pastels, lighthouse, boardwalk, lake views.
 * Brownwood Paddock Square — Old World Florida ranch (1800s cattle country):
 *   western storefronts, barn flair, windmills, paddock vibes.
 * Eastport — newest eastern hub:
 *   European + mid-century American charm, Art Deco / pavilion plazas.
 * Sawgrass Grove — orange-grove canopy + Market food hall (2022):
 *   modern multi-use, Boxcar Stage, golf-adjacent SE lifestyle.
 */
export const DRIVE_AREAS: DriveArea[] = [
  {
    id: "spanish-springs",
    name: "Spanish Springs",
    shortName: "Spanish Springs",
    blurb:
      "Original southwest plaza — adobe stucco, red-tile roofs, plaza fountain, and free outdoor-band nights on Main Street.",
    themeLine: "Spanish colonial · original square",
    area: "North Villages · 1120 Main Street energy",
    highlights: [
      "Spanish colonial / southwest plaza architecture",
      "Adobe stucco, viga vibes & terra-cotta roofs",
      "Central fountain plaza & palm-lined walks",
      "Near Sharon L. Morse Performing Arts Center",
      "Nightly outdoor entertainment tradition",
    ],
    recCenterIds: ["paradise", "la-hacienda", "rohan"],
    squareLandmarkId: "spanish-springs",
    emoji: "🏜️",
    cardGradient: "linear-gradient(135deg, #c45c48 0%, #e8b84a 45%, #1f6b4a 100%)",
    theme: {
      skyTop: "#4a7ab0",
      skyMid: "#e8c48a",
      skyBottom: "#f5d9a8",
      fog: "#e8d4b0",
      grass: "#4a9a58",
      grassDeep: "#2f7a40",
      asphalt: "#5a5550",
      sidewalk: "#e8dcc8",
      curb: "#c45c48",
      water: "#3a9ab8",
      stucco: ["#f0e0c8", "#e8d4b0", "#f5e8d0", "#d4c4a8", "#f8e8c8"],
      roof: "#c45c48",
      roofAlt: "#a84838",
      plaza: "#e8dcc0",
      accent: "#e8b84a",
      landmarkStyle: "southwest",
    },
  },
  {
    id: "lake-sumter",
    name: "Sumter Landing",
    shortName: "Sumter Landing",
    blurb:
      "Lakeside market square — lighthouse silhouette, boardwalk pastels, and golden-hour water on Lake Sumter.",
    themeLine: "Coastal market · lighthouse & boardwalk",
    area: "Central Villages · 1000 Lake Sumter Landing",
    highlights: [
      "Lighthouse landmark & waterfront market energy",
      "Northeast seaside / Key West–inspired pastels",
      "Gazebo plaza & boardwalk cart-path feel",
      "Central hub of The Villages cart network",
      "Lake views & marina-town storefronts",
    ],
    recCenterIds: ["lake-miona", "laurel-manor", "seabreeze", "mulberry-grove"],
    squareLandmarkId: "lake-sumter",
    emoji: "🗼",
    cardGradient: "linear-gradient(135deg, #3aa6c9 0%, #7ec8e8 40%, #e8b84a 100%)",
    theme: {
      skyTop: "#3a8ec8",
      skyMid: "#8ec8e8",
      skyBottom: "#d8f0f8",
      fog: "#b8dce8",
      grass: "#3d9b5f",
      grassDeep: "#2a7a48",
      asphalt: "#4a5562",
      sidewalk: "#e0e8e8",
      curb: "#3aa6c9",
      water: "#2a90b8",
      stucco: ["#f0f4f8", "#e0ecf0", "#d0e0e8", "#f8f0e8", "#c8e0f0"],
      roof: "#4a7a9a",
      roofAlt: "#c47848",
      plaza: "#e8f0f4",
      accent: "#3aa6c9",
      landmarkStyle: "lighthouse",
    },
  },
  {
    id: "brownwood",
    name: "Brownwood Paddock Square",
    shortName: "Brownwood",
    blurb:
      "Old Florida ranch square — 1800s cattle-country western flair, rustic storefronts, windmills, and paddock energy.",
    themeLine: "Old West · Florida ranch heritage",
    area: "South Villages · 2705 W Torch Lake Drive",
    highlights: [
      "Old World Florida / cattle-hunter heritage",
      "Barn-style & false-front western shops",
      "Windmill, water-tower & paddock vibes",
      "South-side main stage for live bands",
      "Rustic wood tones & cowboy décor",
    ],
    recCenterIds: ["eisenhower", "colony-cottage", "fenney"],
    squareLandmarkId: "brownwood",
    emoji: "🤠",
    cardGradient: "linear-gradient(135deg, #8b5a2b 0%, #c47848 40%, #e8b84a 100%)",
    theme: {
      skyTop: "#5a7a9a",
      skyMid: "#d4a86a",
      skyBottom: "#e8d0a0",
      fog: "#e0c898",
      grass: "#6a9a48",
      grassDeep: "#4a7a30",
      asphalt: "#5a5048",
      sidewalk: "#d8c8a8",
      curb: "#8b5a2b",
      water: "#4a8a78",
      stucco: ["#e8d8c0", "#d0b890", "#c4a878", "#f0e4c8", "#b89868"],
      roof: "#6b4030",
      roofAlt: "#8b5a2b",
      plaza: "#d8c8a0",
      accent: "#c47848",
      landmarkStyle: "western",
    },
  },
  {
    id: "eastport",
    name: "Eastport",
    shortName: "Eastport",
    blurb:
      "Eastern social hub — European-inspired mid-century charm, open plazas, and Art Deco pavilion energy around Central Lake.",
    themeLine: "Mid-century · European-American charm",
    area: "East Villages · Central Lake / Morse corridor",
    highlights: [
      "European-inspired architecture with mid-century touches",
      "Art Deco / pavilion plazas (no Old West or Key West)",
      "Open lake-adjacent gathering energy",
      "Near Olympia Rec & eastern cart paths",
      "Newest full square lifestyle hub",
    ],
    recCenterIds: ["savannah", "mulberry-grove", "olympia"],
    squareLandmarkId: "eastport",
    emoji: "🏛️",
    cardGradient: "linear-gradient(135deg, #5a7a9a 0%, #e8b84a 50%, #e85d4c 100%)",
    theme: {
      skyTop: "#5a8ab8",
      skyMid: "#b0c8d8",
      skyBottom: "#f0e8d8",
      fog: "#d0dce8",
      grass: "#48a060",
      grassDeep: "#308048",
      asphalt: "#4a5058",
      sidewalk: "#e8e4dc",
      curb: "#5a7a9a",
      water: "#4890b0",
      stucco: ["#f8f0e8", "#e8e0d0", "#d8d0c0", "#f0e8d8", "#c8d0d8"],
      roof: "#5a6a7a",
      roofAlt: "#e85d4c",
      plaza: "#ece8e0",
      accent: "#e8b84a",
      landmarkStyle: "midcentury",
    },
  },
  {
    id: "sawgrass-grove",
    name: "Sawgrass Grove",
    shortName: "Sawgrass Grove",
    blurb:
      "Orange-grove canopy & Market food hall — Boxcar Stage nights, golf-adjacent greens, and modern SE Florida gathering energy.",
    themeLine: "Citrus canopy · Market & Boxcar Stage",
    area: "Southeast Villages · 766 Marilee Place",
    highlights: [
      "Orange grove–inspired canopy & open-air Market",
      "Boxcar Stage free live entertainment",
      "Golf shop / Southern Oaks adjacent lifestyle",
      "Modern Florida greens & multi-use plaza",
      "Newest SE cart-path social loop",
    ],
    recCenterIds: ["everglades", "fenney", "olympia"],
    squareLandmarkId: "sawgrass-grove",
    emoji: "🍊",
    cardGradient: "linear-gradient(135deg, #1f6b4a 0%, #3aa6c9 50%, #e8b84a 100%)",
    theme: {
      skyTop: "#3a90b8",
      skyMid: "#90d0b0",
      skyBottom: "#d8f0d8",
      fog: "#b8e0c8",
      grass: "#3d9b5f",
      grassDeep: "#1f6b4a",
      asphalt: "#4a5560",
      sidewalk: "#e0ebe4",
      curb: "#1f6b4a",
      water: "#2a98b0",
      stucco: ["#f0f8f4", "#e0f0e8", "#d0e8d8", "#f8fff8", "#c8e8d0"],
      roof: "#3d7a5a",
      roofAlt: "#4a7a9a",
      plaza: "#e4f0e8",
      accent: "#f0a830",
      landmarkStyle: "modern",
    },
  },
];

export function getDriveArea(id: AreaId): DriveArea {
  return DRIVE_AREAS.find((a) => a.id === id) ?? DRIVE_AREAS[0];
}

export function getAreaBySquareLandmark(landmarkId: string): DriveArea | undefined {
  return DRIVE_AREAS.find((a) => a.squareLandmarkId === landmarkId);
}
