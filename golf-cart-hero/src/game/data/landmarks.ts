import { GEO_LANDMARKS, project } from "./geo";

export type LandmarkKind = "town-square" | "rec-center" | "flavor";

export type Landmark = {
  id: string;
  name: string;
  shortName: string;
  kind: LandmarkKind;
  /** Ground plane: x = east meters, y = north meters (mapped to Three.js z) */
  x: number;
  y: number;
  lat: number;
  lon: number;
  note?: string;
  theme?: string;
};

export const LANDMARKS: Landmark[] = GEO_LANDMARKS.map((g) => {
  const p = project(g.lat, g.lon);
  return {
    id: g.id,
    name: g.name,
    shortName: g.shortName,
    kind: g.kind,
    x: p.x,
    y: p.z,
    lat: g.lat,
    lon: g.lon,
    note: g.note,
    theme: g.theme,
  };
});

/** Bounds of the playable world in meters (with padding) */
function computeWorld() {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const l of LANDMARKS) {
    minX = Math.min(minX, l.x);
    maxX = Math.max(maxX, l.x);
    minY = Math.min(minY, l.y);
    maxY = Math.max(maxY, l.y);
  }
  const pad = 900;
  return {
    minX: minX - pad,
    maxX: maxX + pad,
    minY: minY - pad,
    maxY: maxY + pad,
    width: maxX - minX + pad * 2,
    height: maxY - minY + pad * 2,
  };
}

export const WORLD = computeWorld();

export const TOWN_SQUARES = LANDMARKS.filter((l) => l.kind === "town-square");
export const REC_CENTERS = LANDMARKS.filter((l) => l.kind === "rec-center");
