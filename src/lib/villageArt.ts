/**
 * Per-village whimsical art: Florida creature scene + unique motif + accent.
 * Base scenes live under /public/graphics/villages/.
 * Each village gets a deterministic unique combo (creature scene + motif + color).
 */

import type { Village, VillageRegionId } from "./villages";

export type VillageMotifId =
  | "golf"
  | "water"
  | "spanish"
  | "garden"
  | "oaks"
  | "bridge"
  | "meadow"
  | "historic"
  | "sunrise"
  | "carts"
  | "lanai"
  | "growth";

export type VillageArtSpec = {
  /** Path under /public */
  image: string;
  creature: string;
  motif: VillageMotifId;
  motifLabel: string;
  /** CSS color for card accent */
  accent: string;
  /** Short unique hook from village identity */
  hook: string;
};

/** Scene pool: cute FL creature + neighborhood vibe */
export const VILLAGE_SCENES = [
  {
    id: "pelican-cartpath",
    file: "/graphics/villages/pelican-cartpath.jpg",
    creature: "Brown pelican",
  },
  {
    id: "manatee-canal",
    file: "/graphics/villages/manatee-canal.jpg",
    creature: "Manatee",
  },
  {
    id: "gator-bungalow",
    file: "/graphics/villages/gator-bungalow.jpg",
    creature: "Alligator",
  },
  {
    id: "turtle-culdesac",
    file: "/graphics/villages/turtle-culdesac.jpg",
    creature: "Sea turtle",
  },
  {
    id: "armadillo-garden",
    file: "/graphics/villages/armadillo-garden.jpg",
    creature: "Armadillo",
  },
  {
    id: "dolphin-plaza",
    file: "/graphics/villages/dolphin-plaza.jpg",
    creature: "Dolphin",
  },
  {
    id: "ibis-spanish",
    file: "/graphics/villages/ibis-spanish.jpg",
    creature: "White ibis",
  },
  {
    id: "raccoon-gardener",
    file: "/graphics/villages/raccoon-gardener.jpg",
    creature: "Raccoon",
  },
  {
    id: "bear-lanai",
    file: "/graphics/villages/bear-lanai.jpg",
    creature: "Florida black bear",
  },
  {
    id: "spoonbill-pond",
    file: "/graphics/villages/spoonbill-pond.jpg",
    creature: "Roseate spoonbill",
  },
  {
    id: "otter-dock",
    file: "/graphics/villages/otter-dock.jpg",
    creature: "River otter",
  },
  {
    id: "scrubjay-mailbox",
    file: "/graphics/villages/scrubjay-mailbox.jpg",
    creature: "Florida scrub-jay",
  },
  {
    id: "heron-fountain",
    file: "/graphics/villages/heron-fountain.jpg",
    creature: "Great blue heron",
  },
  {
    id: "tortoise-scrub",
    file: "/graphics/villages/tortoise-scrub.jpg",
    creature: "Gopher tortoise",
  },
  {
    id: "crane-golf",
    file: "/graphics/villages/crane-golf.jpg",
    creature: "Sandhill crane",
  },
] as const;

const MOTIF_META: Record<
  VillageMotifId,
  { label: string; emoji: string; keywords: string[] }
> = {
  golf: {
    label: "Golf & greens",
    emoji: "⛳",
    keywords: ["golf", "country club", "links", "eagle", "birdie", "fairway"],
  },
  water: {
    label: "Lakes & water",
    emoji: "💧",
    keywords: [
      "lake",
      "marina",
      "cove",
      "bay",
      "pond",
      "spring",
      "water",
      "canal",
      "river",
    ],
  },
  spanish: {
    label: "Spanish flavor",
    emoji: "🏛️",
    keywords: [
      "la ",
      "el ",
      "hacienda",
      "mesa",
      "cortez",
      "zamora",
      "del mar",
      "mira",
      "spanish",
      "riata",
      "santiago",
      "seville",
    ],
  },
  garden: {
    label: "Gardens bloom",
    emoji: "🌺",
    keywords: [
      "eden",
      "garden",
      "bloom",
      "rose",
      "lily",
      "orchid",
      "azalea",
      "hibiscus",
      "magnolia",
    ],
  },
  oaks: {
    label: "Oaks & woods",
    emoji: "🌳",
    keywords: ["oak", "wood", "pine", "grove", "forest", "cedar", "cypress"],
  },
  bridge: {
    label: "Bridges & paths",
    emoji: "🌉",
    keywords: ["bridge", "crossing", "pass", "gate", "trail"],
  },
  meadow: {
    label: "Open meadows",
    emoji: "🌾",
    keywords: ["field", "meadow", "prairie", "grass", "savannah", "fenney"],
  },
  historic: {
    label: "Classic roots",
    emoji: "🏡",
    keywords: ["historic", "original", "classic", "early", "established"],
  },
  sunrise: {
    label: "Sunrise side",
    emoji: "🌅",
    keywords: ["sunrise", "sunset", "dawn", "east", "morning"],
  },
  carts: {
    label: "Cart-path life",
    emoji: "⛳",
    keywords: ["cart", "path", "drive"],
  },
  lanai: {
    label: "Lanai living",
    emoji: "🪑",
    keywords: ["lanai", "porch", "villa", "cottage", "bungalow"],
  },
  growth: {
    label: "New growth",
    emoji: "✨",
    keywords: ["new", "modern", "fresh", "eastport", "fenney", "expansion"],
  },
};

const REGION_DEFAULT_MOTIF: Record<VillageRegionId, VillageMotifId> = {
  "historic-side": "historic",
  "north-of-466": "carts",
  "south-of-466": "meadow",
  "south-of-466a": "lanai",
  "south-of-sr-44": "growth",
  eastport: "sunrise",
};

const ACCENTS = [
  "#1f6b4a",
  "#e85d4c",
  "#3aa6c9",
  "#c4782a",
  "#6b4c9a",
  "#2a7a8c",
  "#b03a2e",
  "#4a7c59",
  "#d4a017",
  "#5c6bc0",
  "#00897b",
  "#8d6e63",
];

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return h;
}

function detectMotif(village: Village): VillageMotifId {
  const hay = `${village.name} ${village.blurb}`.toLowerCase();
  for (const [id, meta] of Object.entries(MOTIF_META) as [
    VillageMotifId,
    (typeof MOTIF_META)[VillageMotifId],
  ][]) {
    if (meta.keywords.some((k) => hay.includes(k))) return id;
  }
  return REGION_DEFAULT_MOTIF[village.region] || "carts";
}

function hookFromVillage(village: Village): string {
  // First sentence fragment of blurb, short
  const b = village.blurb.replace(/\s+/g, " ").trim();
  const cut = b.split(/[.—]/)[0]?.trim() || b;
  return cut.length > 72 ? cut.slice(0, 70).trim() + "…" : cut;
}

/**
 * Deterministic art for a village: scene from pool + motif + accent.
 * Mixes slug hash with region so neighbors spread across different creatures.
 */
export function getVillageArt(village: Village): VillageArtSpec {
  const h = hashSlug(village.slug);
  const regionBoost =
    village.region.length * 13 +
    (village.region.charCodeAt(0) || 0) +
    (village.region.charCodeAt(village.region.length - 1) || 0);
  const pick =
    VILLAGE_SCENES[(h + regionBoost + village.name.length * 17) % VILLAGE_SCENES.length];

  const motif = detectMotif(village);
  const accent = ACCENTS[(h + village.name.length) % ACCENTS.length];

  return {
    image: pick.file,
    creature: pick.creature,
    motif,
    motifLabel: MOTIF_META[motif].label,
    accent,
    hook: hookFromVillage(village),
  };
}

export function motifEmoji(motif: VillageMotifId): string {
  return MOTIF_META[motif].emoji;
}
