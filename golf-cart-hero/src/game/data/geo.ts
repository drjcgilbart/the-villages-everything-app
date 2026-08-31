/**
 * Real-world coordinates for The Villages, Florida.
 * Town squares geocoded via OpenStreetMap Nominatim; rec centers from
 * Nominatim where available, otherwise placed from published addresses
 * relative to verified anchors. Projected to local meters for the race world.
 */

export type LatLon = { lat: number; lon: number };

/** Rough center of The Villages for projection */
export const ORIGIN: LatLon = { lat: 28.88, lon: -81.98 };

const M_PER_DEG_LAT = 110_540;
const M_PER_DEG_LON = 111_320 * Math.cos((ORIGIN.lat * Math.PI) / 180);

/**
 * Compress real geography for arcade lap times while keeping relative layout.
 * 1.0 = true meters; ~0.12 keeps SS→Brownwood readable but raceable.
 */
export const WORLD_SCALE = 0.12;

/** Convert geographic degrees → local ground units (x=east, z=north). */
export function project(lat: number, lon: number): { x: number; z: number } {
  return {
    x: (lon - ORIGIN.lon) * M_PER_DEG_LON * WORLD_SCALE,
    z: (lat - ORIGIN.lat) * M_PER_DEG_LAT * WORLD_SCALE,
  };
}

export function projectLL(p: LatLon): { x: number; z: number } {
  return project(p.lat, p.lon);
}

export type GeoLandmark = {
  id: string;
  name: string;
  shortName: string;
  kind: "town-square" | "rec-center" | "flavor";
  lat: number;
  lon: number;
  note?: string;
  /** Building theme for cartoon architecture */
  theme?: string;
};

/**
 * Verified / best-effort real placements.
 * SS, LSL, Brownwood, Sawgrass Grove: Nominatim 2026.
 * Eastport: eastern expansion estimate near Buena Vista / Morse east corridor
 * (Nominatim “Eastport” hit was unreliable / too far south).
 */
export const GEO_LANDMARKS: GeoLandmark[] = [
  // —— Town Squares ——
  {
    id: "spanish-springs",
    name: "Spanish Springs Town Square",
    shortName: "Spanish Springs",
    kind: "town-square",
    lat: 28.9404332,
    lon: -81.9503209,
    note: "OG southwest plaza · free outdoor bands",
    theme: "southwest",
  },
  {
    id: "lake-sumter",
    name: "Sumter Landing",
    shortName: "Sumter Landing",
    kind: "town-square",
    lat: 28.9082192,
    lon: -81.9747144,
    note: "Lakeside boardwalk · lighthouse · coastal market",
    theme: "lakeside",
  },
  {
    id: "brownwood",
    name: "Brownwood Paddock Square",
    shortName: "Brownwood",
    kind: "town-square",
    lat: 28.8444857,
    lon: -82.0221819,
    note: "Old Florida ranch square · south side",
    theme: "western",
  },
  {
    id: "eastport",
    name: "Eastport Town Square",
    shortName: "Eastport",
    kind: "town-square",
    // Eastern social hub — east of Lake Sumter / Morse corridor
    lat: 28.9125,
    lon: -81.928,
    note: "Mid-century European-American charm · Central Lake",
    theme: "midcentury",
  },
  {
    id: "sawgrass-grove",
    name: "Sawgrass Grove",
    shortName: "Sawgrass Grove",
    kind: "town-square",
    lat: 28.7898509,
    lon: -81.9688595,
    note: "Orange-grove canopy · Market & Boxcar Stage",
    theme: "modern",
  },

  // —— Regional rec centers (Nominatim where found) ——
  {
    id: "paradise",
    name: "Paradise Recreation",
    shortName: "Paradise",
    kind: "rec-center",
    lat: 28.9345,
    lon: -81.9585,
    theme: "tuscan",
    note: "Tuscan villa regional complex",
  },
  {
    id: "la-hacienda",
    name: "La Hacienda Recreation",
    shortName: "La Hacienda",
    kind: "rec-center",
    lat: 28.926,
    lon: -81.962,
    theme: "spanish",
  },
  {
    id: "lake-miona",
    name: "Lake Miona Recreation",
    shortName: "Lake Miona",
    kind: "rec-center",
    lat: 28.8963356,
    lon: -81.9803263,
  },
  {
    id: "colony-cottage",
    name: "Colony Cottage Recreation",
    shortName: "Colony Cottage",
    kind: "rec-center",
    lat: 28.8661073,
    lon: -81.9613156,
  },
  {
    id: "eisenhower",
    name: "Eisenhower Recreation",
    shortName: "Eisenhower",
    kind: "rec-center",
    lat: 28.8481852,
    lon: -82.0149853,
  },
  {
    id: "rohan",
    name: "Rohan Recreation",
    shortName: "Rohan",
    kind: "rec-center",
    lat: 28.8249475,
    lon: -81.9716178,
  },
  {
    id: "fenney",
    name: "Fenney Recreation",
    shortName: "Fenney",
    kind: "rec-center",
    lat: 28.7960684,
    lon: -82.0384196,
  },
  {
    id: "everglades",
    name: "Everglades Recreation",
    shortName: "Everglades",
    kind: "rec-center",
    lat: 28.8044378,
    lon: -82.0070714,
  },
  {
    id: "savannah",
    name: "Savannah Recreation",
    shortName: "Savannah",
    kind: "rec-center",
    lat: 28.918,
    lon: -81.955,
  },
  {
    id: "mulberry-grove",
    name: "Mulberry Grove Recreation",
    shortName: "Mulberry Grove",
    kind: "rec-center",
    lat: 28.9,
    lon: -81.945,
  },
  {
    id: "laurel-manor",
    name: "Laurel Manor Recreation",
    shortName: "Laurel Manor",
    kind: "rec-center",
    lat: 28.89,
    lon: -81.99,
  },
  {
    id: "seabreeze",
    name: "SeaBreeze Recreation",
    shortName: "SeaBreeze",
    kind: "rec-center",
    lat: 28.875,
    lon: -81.97,
  },
  {
    id: "olympia",
    name: "Olympia Recreation",
    shortName: "Olympia",
    kind: "rec-center",
    lat: 28.905,
    lon: -81.915,
  },
];

/** Major corridor control points (lat/lon) approximating Morse / Buena Vista / 466 / 44 loops */
export const MAJOR_CORRIDOR: LatLon[] = [
  // Start near Lake Sumter Landing (central hub)
  { lat: 28.9082, lon: -81.9747 },
  // North toward Spanish Springs along roughly Morse / El Camino energy
  { lat: 28.918, lon: -81.968 },
  { lat: 28.926, lon: -81.962 }, // La Hacienda
  { lat: 28.9345, lon: -81.9585 }, // Paradise
  { lat: 28.9404, lon: -81.9503 }, // Spanish Springs
  // East then south toward Eastport
  { lat: 28.938, lon: -81.94 },
  { lat: 28.928, lon: -81.932 },
  { lat: 28.918, lon: -81.928 },
  { lat: 28.9125, lon: -81.928 }, // Eastport
  // South-east toward Sawgrass Grove
  { lat: 28.9, lon: -81.935 },
  { lat: 28.885, lon: -81.945 },
  { lat: 28.86, lon: -81.955 },
  { lat: 28.83, lon: -81.962 },
  { lat: 28.81, lon: -81.966 },
  { lat: 28.7899, lon: -81.9689 }, // Sawgrass Grove
  // West-south through Everglades / Fenney / Brownwood
  { lat: 28.795, lon: -81.985 },
  { lat: 28.8044, lon: -82.0071 }, // Everglades
  { lat: 28.82, lon: -82.02 },
  { lat: 28.8445, lon: -82.0222 }, // Brownwood
  { lat: 28.8482, lon: -82.015 }, // Eisenhower
  // North-east back via Rohan / Colony Cottage / Lake Miona
  { lat: 28.855, lon: -82.0 },
  { lat: 28.86, lon: -81.985 },
  { lat: 28.8661, lon: -81.9613 }, // Colony Cottage
  { lat: 28.88, lon: -81.97 },
  { lat: 28.8963, lon: -81.9803 }, // Lake Miona
  { lat: 28.904, lon: -81.978 },
  { lat: 28.9082, lon: -81.9747 }, // close loop at LSL
];
