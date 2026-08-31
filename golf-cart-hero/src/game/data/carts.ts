export type CartId = "yamaha" | "evolution" | "hotrod" | "cybertruck";

export type CartDef = {
  id: CartId;
  name: string;
  shortName: string;
  blurb: string;
  /** Body fill color */
  color: string;
  accent: string;
  /** Top speed (world units / sec) */
  topSpeed: number;
  /** Acceleration */
  accel: number;
  /** Turn rate at speed */
  handling: number;
  /** How quickly you slow when off the road */
  offRoadGrip: number;
  emoji: string;
  powerType: "gas" | "electric" | "hotrod";
};

export const CARTS: CartDef[] = [
  {
    id: "yamaha",
    name: "Yamaha Drive2",
    shortName: "Yamaha",
    blurb: "Classic white Drive2 — open top, cream seats. Shoots golf balls.",
    color: "#f2f2f0",
    accent: "#1a1a1c",
    topSpeed: 32,
    accel: 18,
    handling: 1.15,
    offRoadGrip: 0.42,
    emoji: "⛽",
    powerType: "gas",
  },
  {
    id: "evolution",
    name: "Evolution Cruiser",
    shortName: "Evolution",
    blurb: "Cyan electric cruiser — open top, orange rims. Shoots loofahs.",
    color: "#2ec4d6",
    accent: "#1a9aab",
    topSpeed: 29,
    accel: 22,
    handling: 1.35,
    offRoadGrip: 0.48,
    emoji: "🔋",
    powerType: "electric",
  },
  {
    id: "hotrod",
    name: "Street Rod",
    shortName: "Hot Rod",
    blurb: "Blue/silver street rod — open top, chrome grille. Shoots fireballs.",
    color: "#2a6db5",
    accent: "#d8dde2",
    topSpeed: 38,
    accel: 19,
    handling: 0.95,
    offRoadGrip: 0.35,
    emoji: "🔥",
    powerType: "hotrod",
  },
  {
    id: "cybertruck",
    name: "Tesla Cybertruck",
    shortName: "Cybertruck",
    blurb: "Silver angular pickup — closed cabin, no driver shown. Shoots lightning bolts. Drive through lightning storms to recharge.",
    color: "#e4e8ee",
    accent: "#111111",
    topSpeed: 40,
    accel: 26,
    handling: 0.88,
    offRoadGrip: 0.62,
    emoji: "⚡",
    powerType: "electric",
  },
];

export function getCart(id: CartId): CartDef {
  return CARTS.find((c) => c.id === id) ?? CARTS[0];
}
