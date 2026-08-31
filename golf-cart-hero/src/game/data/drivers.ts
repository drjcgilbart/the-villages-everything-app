/**
 * Whimsical Florida critters — same spirit as cuisine / real-estate
 * mascots in The Villages Everything App.
 */
export type DriverId =
  | "alligator"
  | "turtle"
  | "manatee"
  | "armadillo"
  | "raccoon"
  | "pelican"
  | "ibis"
  | "otter";

export type DriverDef = {
  id: DriverId;
  name: string;
  species: string;
  emoji: string;
  blurb: string;
  /** Slight personality modifiers */
  luck: number;
  color: string;
};

export const DRIVERS: DriverDef[] = [
  {
    id: "alligator",
    name: "Alligator Al",
    species: "American Alligator",
    emoji: "🐊",
    blurb: "Retention-pond royalty. Unfazed by water hazards — maybe a little too unfazed.",
    luck: 1.05,
    color: "#2f6f4e",
  },
  {
    id: "turtle",
    name: "Shelly Slowlane",
    species: "Florida Softshell",
    emoji: "🐢",
    blurb: "Knows every crosswalk. Will NOT hit other turtles. Moral high ground included.",
    luck: 1.1,
    color: "#5c8a4a",
  },
  {
    id: "manatee",
    name: "Mo the Manatee",
    species: "West Indian Manatee",
    emoji: "🦭",
    blurb: "Gentle giant energy. Bumper padding for days. Snack holder always stocked.",
    luck: 1.08,
    color: "#7a8fa0",
  },
  {
    id: "armadillo",
    name: "Armie Armadillo",
    species: "Nine-banded Armadillo",
    emoji: "armadillo",
    blurb: "Armored for errant golf balls. Rolls through chaos like a lanai tank.",
    luck: 1.12,
    color: "#8b7355",
  },
  {
    id: "raccoon",
    name: "Ricky Raccoon",
    species: "Florida Raccoon",
    emoji: "🦝",
    blurb: "Night-market strategist. Can smell a free sample from three villages away.",
    luck: 1.06,
    color: "#5a5a62",
  },
  {
    id: "pelican",
    name: "Penny Pelican",
    species: "Brown Pelican",
    emoji: "pelican",
    blurb: "Aerial awareness of every square stage. Dive-bomb vibes, cart-path manners.",
    luck: 1.07,
    color: "#3a4a5c",
  },
  {
    id: "ibis",
    name: "Ivy Ibis",
    species: "White Ibis",
    emoji: "🦢",
    blurb: "Lawn-party scout. That curved beak is pure square-side style.",
    luck: 1.09,
    color: "#f0f0f0",
  },
  {
    id: "otter",
    name: "Otto Otter",
    species: "River Otter",
    emoji: "🦦",
    blurb: "Playful line-taker. Treats every roundabout like a waterslide.",
    luck: 1.1,
    color: "#6b5344",
  },
];

/** Emoji fallbacks for species without a single perfect emoji */
export function driverEmoji(d: DriverDef): string {
  if (d.emoji === "armadillo") return "🦔";
  if (d.emoji === "pelican") return "🐦";
  return d.emoji;
}

export function getDriver(id: DriverId): DriverDef {
  return DRIVERS.find((d) => d.id === id) ?? DRIVERS[0];
}

export function randomDriverExcluding(ids: DriverId[]): DriverDef {
  const pool = DRIVERS.filter((d) => !ids.includes(d.id));
  const list = pool.length ? pool : DRIVERS;
  return list[Math.floor(Math.random() * list.length)];
}
