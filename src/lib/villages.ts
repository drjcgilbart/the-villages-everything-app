/**
 * Neighborhood "villages" inside The Villages, FL.
 * Organized for browse/search — not exhaustive of every unit, but covers
 * the commonly named villages residents use day to day.
 * Sources: districtgov.org residential districts, community geography.
 */

export type VillageRegionId =
  | "historic-side"
  | "north-of-466"
  | "south-of-466"
  | "south-of-466a"
  | "south-of-sr-44"
  | "eastport";

export type County = "Lake" | "Marion" | "Sumter";

export type Village = {
  slug: string;
  name: string;
  region: VillageRegionId;
  county: County;
  /** Community Development District number when known */
  cdd?: number | "lady-lake";
  blurb: string;
  highlights: string[];
};

export type VillageRegion = {
  id: VillageRegionId;
  label: string;
  shortLabel: string;
  description: string;
  nearestSquare: string;
  vibe: string;
};

export const VILLAGE_REGIONS: VillageRegion[] = [
  {
    id: "historic-side",
    label: "Historic Side (Lake County)",
    shortLabel: "Historic Side",
    description:
      "The original side of The Villages — mature landscaping, established neighborhoods, and the closest cart ride to Spanish Springs Town Square.",
    nearestSquare: "Spanish Springs",
    vibe: "Classic hometown roots",
  },
  {
    id: "north-of-466",
    label: "North of CR 466",
    shortLabel: "North of 466",
    description:
      "Often called “up north” by locals — a mix of early Sumter County villages near the original expansion corridors.",
    nearestSquare: "Spanish Springs · Lake Sumter Landing",
    vibe: "Established & central",
  },
  {
    id: "south-of-466",
    label: "South of CR 466",
    shortLabel: "South of 466",
    description:
      "A huge middle belt of villages with easy access to Lake Sumter Landing, golf, and recreation throughout Sumter County.",
    nearestSquare: "Lake Sumter Landing",
    vibe: "Heart of the map",
  },
  {
    id: "south-of-466a",
    label: "South of CR 466A",
    shortLabel: "South of 466A",
    description:
      "Southern Sumter neighborhoods oriented toward Brownwood Paddock Square energy, with a mix of bungalows and later-built homes.",
    nearestSquare: "Brownwood Paddock Square",
    vibe: "South-side social",
  },
  {
    id: "south-of-sr-44",
    label: "South of SR 44",
    shortLabel: "South of 44",
    description:
      "Some of the newer southern expansion villages — Fenney area and beyond, with modern floor plans and growing amenities.",
    nearestSquare: "Brownwood · southern rec corridors",
    vibe: "Newer southern growth",
  },
  {
    id: "eastport",
    label: "Eastport Area",
    shortLabel: "Eastport",
    description:
      "One of the newest growth areas — including Edenfield and neighbors — near Eastport Town Center, championship golf, and fresh construction.",
    nearestSquare: "Eastport",
    vibe: "Newest chapter",
  },
];

function v(
  name: string,
  region: VillageRegionId,
  county: County,
  cdd: Village["cdd"],
  blurb: string,
  highlights: string[] = []
): Village {
  const slug = name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return { slug, name, region, county, cdd, blurb, highlights };
}

/** All villages, alphabetical-friendly list */
export const VILLAGES: Village[] = [
  // Historic Side / Lake
  v("Country Club", "historic-side", "Lake", "lady-lake", "One of the earliest Villages neighborhoods — classic roots near the original Spanish Springs orbit."),
  v("Del Mar", "historic-side", "Lake", "lady-lake", "Historic-side living with mature trees and an easy cart path to Spanish Springs shopping and entertainment."),
  v("El Cortez", "historic-side", "Lake", "lady-lake", "Established Lake County village with the classic older-Villages streetscape and town-square proximity."),
  v("Hacienda", "historic-side", "Lake", "lady-lake", "A familiar historic-side name spanning early development — walkable vibes and longtime neighbors."),
  v("La Reynalda", "historic-side", "Lake", "lady-lake", "Quiet historic-side streets close to the original shopping and entertainment core."),
  v("La Zamora", "historic-side", "Lake", "lady-lake", "Lake County classic with established landscaping and Spanish Springs cart access."),
  v("Mira Mesa", "historic-side", "Lake", "lady-lake", "Early village living on the historic side — smaller-scale charm and deep roots."),
  v("Oak Meadow", "historic-side", "Lake", "lady-lake", "Historic-side neighborhood energy with mature homes and nearby rec options."),
  v("Orange Blossom Gardens", "historic-side", "Lake", "lady-lake", "Tied to the original Orange Blossom Gardens story — where The Villages lifestyle first took shape."),
  v("Pine Hills", "historic-side", "Lake", 11, "Established village with Lake County roots and nearby piney-green corridors."),
  v("Pine Ridge", "historic-side", "Lake", 11, "Mature historic-side village known for settled streets and proximity to early amenities."),
  v("Silver Lake", "historic-side", "Lake", "lady-lake", "Lake County village with classic Villages curb appeal and square access."),
  v("Spring Arbor", "historic-side", "Lake", "lady-lake", "Historic-side pocket with established homes and a quieter residential feel."),
  v("Valle Verde", "historic-side", "Lake", "lady-lake", "Early neighborhood on the historic side — green, settled, and close to Spanish Springs."),

  // North of 466
  v("Alhambra", "north-of-466", "Sumter", 2, "North-of-466 village with Spanish-inspired naming and easy access toward the northern squares."),
  v("Belle Aire", "north-of-466", "Sumter", 2, "Popular north-side village spanning multiple pockets — established homes and strong rec access."),
  v("Briar Meadow", "north-of-466", "Marion", 4, "Marion County village with a residential meadow feel and neighborhood rec access."),
  v("Calumet Grove", "north-of-466", "Marion", 4, "Marion County grove-named village — quieter streets and cart-friendly living."),
  v("Chatham", "north-of-466", "Marion", 4, "Marion County village with classic Villages villas and neighborhood amenities."),
  v("Chatham at Soulliere", "north-of-466", "Marion", 4, "A Chatham-area pocket with its own identity — small-village feel inside the larger map."),
  v("De Allende", "north-of-466", "Sumter", 1, "Early Sumter expansion village north of 466 with longtime residents and mature landscaping."),
  v("De La Vista", "north-of-466", "Sumter", 1, "North-of-466 classic — established streets and a strong “I’ve lived here forever” energy."),
  v("Glenbrook", "north-of-466", "Sumter", 3, "North-side village with residential charm and solid access to central amenities."),
  v("Palo Alto", "north-of-466", "Sumter", 1, "Well-known north-of-466 village (sometimes spelled Pallo Alto) with established homes."),
  v("Piedmont", "north-of-466", "Marion", 4, "Marion County village with neighborhood recreation and quiet residential streets."),
  v("Polo Ridge", "north-of-466", "Sumter", 3, "North-side village with a residential ridge feel and convenient cart corridors."),
  v("Rio Grande", "north-of-466", "Sumter", 1, "Early Sumter village with Spanish-inspired naming and mature neighborhood character."),
  v("Rio Ponderosa", "north-of-466", "Sumter", 1, "North-of-466 village with established homes and familiar local rec patterns."),
  v("Rio Ranchero", "north-of-466", "Sumter", 1, "Ranchero-named north-side village — residential, cartable, and long-settled."),
  v("Santiago", "north-of-466", "Sumter", 2, "North-of-466 village known for patio and courtyard villa living options."),
  v("Santo Domingo", "north-of-466", "Sumter", 2, "North-side village with classic Villages architecture and neighborhood amenities."),
  v("Springdale", "north-of-466", "Marion", 4, "Marion County village with a springdale quiet and nearby recreation."),
  v("Summerhill", "north-of-466", "Sumter", 3, "North-of-466 residential village with established streets and cart access."),
  v("Tierra Del Sol", "north-of-466", "Sumter", 1, "Sunny north-side village name, established homes, and District 1 services."),
  v("Woodbury", "north-of-466", "Marion", 4, "Marion County village with woodsy residential character and neighborhood rec."),
  v("Woodbury at Phillips", "north-of-466", "Marion", 4, "A Woodbury-area pocket with its own street identity and quiet living."),

  // South of 466
  v("Amelia", "south-of-466", "Sumter", 6, "South-of-466 village with coastal-Florida naming and central Sumter access."),
  v("Ashland", "south-of-466", "Sumter", 5, "Popular middle-map village with a mix of home styles and strong rec proximity."),
  v("Belvedere", "south-of-466", "Sumter", 5, "South-of-466 village with residential polish and Lake Sumter Landing cart reach."),
  v("Bonita", "south-of-466", "Sumter", 7, "Sunny-named village in the south-of-466 belt with neighborhood amenities."),
  v("Bonnybrook", "south-of-466", "Sumter", 5, "Well-known village with patio, courtyard, and ranch-style home options."),
  v("Bridgeport at Creekside Landing", "south-of-466", "Sumter", 8, "Bridgeport pocket near water/landing amenities — cottage and villa energy."),
  v("Bridgeport at Lake Miona", "south-of-466", "Sumter", 5, "Lake Miona–oriented Bridgeport living with water-adjacent Villages lifestyle."),
  v("Bridgeport at Lake Sumter", "south-of-466", "Sumter", 6, "Bridgeport neighborhood oriented toward Lake Sumter corridors and squares."),
  v("Bridgeport at Lakeshore Cottages", "south-of-466", "Sumter", 6, "Cottage-style Bridgeport living with a lakeshore naming vibe."),
  v("Bridgeport at Laurel Valley", "south-of-466", "Sumter", 8, "Laurel Valley Bridgeport pocket — residential streets and nearby rec."),
  v("Bridgeport at Miona Shores", "south-of-466", "Sumter", 6, "Miona Shores Bridgeport living with water-inspired neighborhood character."),
  v("Bridgeport at Mission Hills", "south-of-466", "Sumter", 9, "Mission Hills Bridgeport pocket in the broader south-of-466 / 466A transition."),
  v("Buttonwood", "south-of-466", "Sumter", 8, "South-of-466 village with Florida coastal plant names and settled streets."),
  v("Caroline", "south-of-466", "Sumter", 6, "Central Sumter village with classic Villages home styles and rec access."),
  v("Duval", "south-of-466", "Sumter", 7, "South-of-466 village named for Florida place heritage — residential and cartable."),
  v("Hadley", "south-of-466", "Sumter", 7, "Quieter south-of-466 village living with neighborhood amenities nearby."),
  v("Hemingway", "south-of-466", "Sumter", 7, "Literate-named village south of 466 with villa options and rec access."),
  v("Largo", "south-of-466", "Sumter", 6, "South-of-466 village with Florida Gulf-coast naming and central amenities."),
  v("Liberty Park", "south-of-466", "Sumter", 5, "Park-named village with residential streets and Lake Sumter Landing reach."),
  v("Lynnhaven", "south-of-466", "Sumter", 5, "South-of-466 village with a residential haven feel and strong amenity access."),
  v("Mallory Square", "south-of-466", "Sumter", 6, "Square-named village — community-oriented living in the middle map."),
  v("Pennecamp", "south-of-466", "Sumter", 8, "Florida park–named village south of 466 with neighborhood recreation nearby."),
  v("Poinciana", "south-of-466", "Sumter", 5, "Flowering-tree-named village known for single-family options in central Sumter."),
  v("Sabal Chase", "south-of-466", "Sumter", 6, "Palm-named village south of 466 with residential charm and cart corridors."),
  v("St. Charles", "south-of-466", "Sumter", 8, "South-of-466 village with classic naming and neighborhood amenities."),
  v("St. James", "south-of-466", "Sumter", 8, "Residential village south of 466 with established Villages street patterns."),
  v("Sunset Pointe", "south-of-466", "Sumter", 5, "Sunset-named village — golden-hour branding and central Sumter living."),
  v("Tall Trees", "south-of-466", "Sumter", 6, "Tree-canopy village feel south of 466 with neighborhood recreation."),
  v("Tamarind Grove", "south-of-466", "Sumter", 8, "Grove-named village with Florida fruit-tree energy and south-of-466 access."),
  v("Virginia Trace", "south-of-466", "Sumter", 6, "Popular village for patio and courtyard villas with strong lifestyle access."),
  v("Winifred", "south-of-466", "Sumter", 5, "South-of-466 village with residential streets and Lake Sumter Landing proximity."),

  // South of 466A
  v("Charlotte", "south-of-466a", "Sumter", 9, "South-of-466A village near Brownwood energy — Florida county naming and later-built homes."),
  v("Collier", "south-of-466a", "Sumter", 10, "Larger south-side village name with multiple Collier pockets and bungalow options."),
  v("Collier at Alden Bungalows", "south-of-466a", "Sumter", 10, "Bungalow-focused Collier pocket with a distinct street-level identity."),
  v("Collier at Antrim Dells", "south-of-466a", "Sumter", 10, "Antrim Dells Collier neighborhood — dells naming and southern Sumter living."),
  v("Collier at Atwood Bungalows", "south-of-466a", "Sumter", 9, "Atwood bungalow pocket within the broader Collier family of villages."),
  v("Dunedin", "south-of-466a", "Sumter", 10, "Gulf-coast-named village south of 466A with Brownwood-area cart reach."),
  v("Fernandina", "south-of-466a", "Sumter", 9, "Northeast-Florida-named village oriented toward southern squares and rec."),
  v("Gilchrist", "south-of-466a", "Sumter", 9, "South-of-466A village with Florida county naming and neighborhood amenities."),
  v("Hillsborough", "south-of-466a", "Sumter", 10, "South-side village near Brownwood corridors and later-era home styles."),
  v("LaBelle", "south-of-466a", "Sumter", 10, "South-of-466A village with Florida heritage naming and residential streets."),
  v("Lake Deaton", "south-of-466a", "Sumter", 10, "Lake-oriented southern village — water geography and Brownwood-area lifestyle."),
  v("Osceola Hills", "south-of-466a", "Sumter", 10, "Hilly-named southern village with residential character near south-side amenities."),
  v("Osceola Hills at Soaring Eagle Preserve", "south-of-466a", "Sumter", 10, "Osceola Hills pocket by Soaring Eagle Preserve — nature-edge living."),
  v("Pinellas", "south-of-466a", "Sumter", 9, "Gulf-coast-named village south of 466A with cart access to Brownwood."),
  v("Sanibel", "south-of-466a", "Sumter", 9, "Island-named village popular for patio and courtyard villa living."),

  // South of SR 44
  v("Bradford", "south-of-sr-44", "Sumter", 13, "Southern expansion village south of SR 44 with newer-construction character."),
  v("Cason Hammock", "south-of-sr-44", "Sumter", 13, "Hammock-named southern village — Florida landscape language and growing amenities."),
  v("Chitty Chatty", "south-of-sr-44", "Sumter", 13, "One of the most memorable village names — south of 44 with neighborly energy."),
  v("Citrus Grove", "south-of-sr-44", "Sumter", 13, "Grove-named southern village with Florida citrus heritage vibes."),
  v("DeLuna", "south-of-sr-44", "Sumter", 12, "Southern village (also spelled De Luna) spanning newer expansion areas."),
  v("DeSoto", "south-of-sr-44", "Sumter", 12, "Explorer-named southern village with modern home styles and rec growth."),
  v("Fenney", "south-of-sr-44", "Sumter", 12, "Major southern growth area — Fenney is a landmark name for south-of-44 living."),
  v("Hammock at Fenney", "south-of-sr-44", "Sumter", 12, "Fenney-area hammock pocket with nature-forward naming and newer streets."),
  v("Hawkins", "south-of-sr-44", "Sumter", 13, "Southern village south of SR 44 with residential streets and expanding amenities."),
  v("Linden", "south-of-sr-44", "Sumter", 12, "Tree-named southern village in the SR 44 growth corridor."),
  v("Marsh Bend", "south-of-sr-44", "Sumter", 12, "Marsh-and-bend geography naming — southern expansion living."),
  v("McClure", "south-of-sr-44", "Sumter", 12, "Southern village near Fenney-area growth with newer construction."),
  v("Monarch Grove", "south-of-sr-44", "Sumter", 12, "Butterfly-and-grove naming in the southern map — residential and cartable."),
  v("Richmond", "south-of-sr-44", "Sumter", 13, "Southern village south of SR 44 with neighborhood character."),
  v("St. Catherine", "south-of-sr-44", "Sumter", 13, "Southern village with classic naming in the SR 44 expansion belt."),
  v("St. Johns", "south-of-sr-44", "Sumter", 13, "River-named southern village in the newer growth corridor."),

  // Eastport (includes Edenfield!)
  v(
    "Edenfield",
    "eastport",
    "Sumter",
    15,
    "One of The Villages’ newest villages in the Eastport area — golf views near the Woodlands Championship course, fresh construction, and Eastport Town Center energy just a cart ride away.",
    [
      "Eastport area (newer growth)",
      "Near Woodlands Championship Golf Course",
      "Designer & Premier home options",
      "Close to Eastport shopping, dining & recreation",
      "VCDD District 15",
    ]
  ),
  v("Dabney", "eastport", "Sumter", 14, "Eastport-area village in the newest chapter of The Villages map — modern homes and growing amenities."),
  v("LaGrange", "eastport", "Sumter", 15, "Eastport-area village near Edenfield and neighbors — new-construction lifestyle and District 15 services."),
  v("Lake Denham", "eastport", "Sumter", 14, "Eastport-area lake-named village with newer streets and regional recreation growth."),
  v("Moultrie Creek", "eastport", "Sumter", 15, "Eastport village with creek-inspired naming and fresh residential development."),
  v("Newell", "eastport", "Sumter", 14, "Eastport-area village in the newest districts — modern floor plans and cart corridors."),
  v("Oak Hollow", "eastport", "Sumter", 15, "Eastport village with oak-hollow naming — District 15 and newer-home energy."),
  v("Shady Brook", "eastport", "Sumter", 15, "Eastport-area village with shady-brook character in The Villages’ eastern growth."),
  v("Waters Edge", "eastport", "Sumter", 15, "Eastport village with water-edge naming and proximity to new amenities."),
  v("Well Point", "eastport", "Sumter", 15, "Eastport-area village in District 15 — part of the newest residential wave."),
];

export function getRegion(id: VillageRegionId): VillageRegion {
  const r = VILLAGE_REGIONS.find((x) => x.id === id);
  if (!r) throw new Error(`Unknown region: ${id}`);
  return r;
}

export function getVillageBySlug(slug: string): Village | null {
  return VILLAGES.find((v) => v.slug === slug) || null;
}

export function villagesByRegion(region: VillageRegionId): Village[] {
  return VILLAGES.filter((v) => v.region === region).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export function searchVillages(query: string): Village[] {
  const q = query.trim().toLowerCase();
  if (!q) return VILLAGES.slice().sort((a, b) => a.name.localeCompare(b.name));
  return VILLAGES.filter(
    (v) =>
      v.name.toLowerCase().includes(q) ||
      v.slug.includes(q) ||
      v.blurb.toLowerCase().includes(q) ||
      getRegion(v.region).label.toLowerCase().includes(q) ||
      getRegion(v.region).nearestSquare.toLowerCase().includes(q)
  ).sort((a, b) => a.name.localeCompare(b.name));
}

export function villageCount() {
  return VILLAGES.length;
}

export function cddLabel(cdd: Village["cdd"]) {
  if (cdd == null) return "Check districtgov.org";
  if (cdd === "lady-lake") return "Lady Lake / Lake County";
  return `VCDD District ${cdd}`;
}
