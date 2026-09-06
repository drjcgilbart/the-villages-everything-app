import { GOLF_COURSES, PICKLE_COURTS, type GolfCourse, type PickleCourt } from "./entertainmentCatalog";
import { getRecCenter, REC_CENTERS, type RecCenter } from "./recCenters";
import { getTownSquare, type TownSquare } from "./townSquares";
import {
  getRegion,
  type Village,
  type VillageRegion,
  type VillageRegionId,
} from "./villages";

type RegionHub = {
  squareId: string;
  recIds: string[];
  golfIds: string[];
  pickleIds: string[];
};

const REGION_HUB: Record<VillageRegionId, RegionHub> = {
  "historic-side": {
    squareId: "spanish-springs",
    recIds: ["paradise", "la-hacienda"],
    golfIds: ["hacienda-hills", "orange-blossom-hills"],
    pickleIds: ["la-hacienda"],
  },
  "north-of-466": {
    squareId: "spanish-springs",
    recIds: ["paradise", "lake-miona"],
    golfIds: ["tierra-del-sol", "lopez-legacy"],
    pickleIds: ["lake-miona"],
  },
  "south-of-466": {
    squareId: "lake-sumter",
    recIds: ["colony-cottage", "savannah"],
    golfIds: ["mallory-hill", "havana"],
    pickleIds: ["colony-cottage"],
  },
  "south-of-466a": {
    squareId: "brownwood",
    recIds: ["eisenhower", "rohan"],
    golfIds: ["evans-prairie"],
    pickleIds: ["eisenhower", "rohan"],
  },
  "south-of-sr-44": {
    squareId: "brownwood",
    recIds: ["fenney", "everglades"],
    golfIds: ["shallow-creek"],
    pickleIds: ["fenney", "everglades"],
  },
  eastport: {
    squareId: "eastport",
    recIds: ["olympia", "st-tropez", "ezell"],
    golfIds: ["woodlands", "bellaire", "southern-oaks"],
    pickleIds: ["olympia", "st-tropez", "ezell"],
  },
};

export type VillageAmenities = {
  region: VillageRegion;
  ownRec: RecCenter | null;
  recs: RecCenter[];
  square: TownSquare | null;
  golf: GolfCourse[];
  pickle: PickleCourt[];
};

function uniqueById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

export function getVillageAmenities(village: Village): VillageAmenities {
  const region = getRegion(village.region);
  const hub = REGION_HUB[village.region];
  const ownRec = getRecCenter(village.slug) || null;

  const sameStreet = ownRec
    ? REC_CENTERS.filter(
        (c) =>
          c.id !== ownRec.id &&
          Boolean(c.areaHint) &&
          c.areaHint === ownRec.areaHint
      )
    : [];

  const regionRecs = hub.recIds
    .map((id) => getRecCenter(id))
    .filter((c): c is RecCenter => Boolean(c));

  const recs = uniqueById(
    [ownRec, ...sameStreet, ...regionRecs].filter((c): c is RecCenter => Boolean(c))
  ).slice(0, 6);

  const square = getTownSquare(hub.squareId) || null;
  const golf = hub.golfIds
    .map((id) => GOLF_COURSES.find((c) => c.id === id))
    .filter((c): c is GolfCourse => Boolean(c));
  const pickle = hub.pickleIds
    .map((id) => PICKLE_COURTS.find((c) => c.id === id))
    .filter((c): c is PickleCourt => Boolean(c))
    .slice(0, 4);

  return { region, ownRec, recs, square, golf, pickle };
}

export function facebookGroupSearchUrl(villageName: string): string {
  const q = `Village of ${villageName} The Villages`;
  return `https://www.facebook.com/search/groups/?q=${encodeURIComponent(q)}`;
}

export const TEAMREACH_SITE = "https://www.teamreach.com/";
export const TEAMREACH_IOS =
  "https://apps.apple.com/us/app/teamreach-your-team-app/id1101253705";
export const TEAMREACH_ANDROID =
  "https://play.google.com/store/apps/details?id=com.teamreach.app";

export function mentionsVillage(
  value: string | undefined,
  village: Pick<Village, "slug" | "name">
): boolean {
  if (!value) return false;
  const t = value.toLowerCase();
  const name = village.name.toLowerCase();
  const slugWords = village.slug.replace(/-/g, " ");
  return t.includes(name) || t.includes(slugWords) || t.includes(village.slug);
}
