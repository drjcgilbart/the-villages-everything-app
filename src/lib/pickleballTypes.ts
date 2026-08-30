/** Client-safe types for The Villages Pickleball hub */

export type PickleballModStatus = "pending" | "approved" | "rejected";

export type PickleballLookingStatus = "open" | "filled" | "hidden";

export type PickleballFormat = "doubles" | "singles";

export type PickleballPlayersNeeded = 1 | 2 | 3;

export type PickleballCourt = {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  courts?: number;
  lighted?: boolean;
  indoor?: boolean;
  hub?: boolean;
  note?: string;
};

function court(
  id: string,
  name: string,
  extra: Omit<PickleballCourt, "id" | "name"> = {}
): PickleballCourt {
  return { id, name, ...extra };
}

/** Rec-center courts Villagers actually play. Regional hubs first. */
export const PICKLEBALL_COURTS: PickleballCourt[] = [
  court("rohan", "Rohan Recreation", {
    phone: "352-674-8400",
    address: "850 Kristine Way, The Villages, FL",
    courts: 18,
    lighted: true,
    hub: true,
    note: "Biggest outdoor complex · lighted · open-play magnet",
  }),
  court("ezell", "Ezell Recreation", {
    phone: "352-674-1860",
    address: "769 Marilee Place, The Villages, FL",
    courts: 12,
    hub: true,
    note: "Sawgrass Grove regional · 12 dedicated courts",
  }),
  court("olympia", "Olympia Recreation", {
    phone: "352-674-1841",
    address: "1210 McPherson Terrace, The Villages, FL",
    courts: 12,
    hub: true,
  }),
  court("everglades", "Everglades Recreation", {
    phone: "352-674-8434",
    address: "5497 Marsh Bend Trail, The Villages, FL",
    courts: 12,
    hub: true,
  }),
  court("colony-cottage", "Colony Cottage Recreation", {
    phone: "352-750-1935",
    address: "510 Colony Blvd, The Villages, FL 32162",
    courts: 6,
    hub: true,
  }),
  court("lake-miona", "Lake Miona Recreation", {
    phone: "352-430-2950",
    address: "1526 Buena Vista Blvd, The Villages, FL 32162",
    hub: true,
    note: "Regional · intro classes often here",
  }),
  court("eisenhower", "Eisenhower Recreation", {
    phone: "352-674-8390",
    address: "3560 Buena Vista Blvd, The Villages, FL",
    hub: true,
  }),
  court("st-tropez", "St. Tropez Recreation", {
    phone: "352-674-1854",
    address: "6341 McNeill Drive, The Villages, FL",
    note: "Village recreation center on McNeill Drive — outdoor amenities, not indoor pickleball.",
  }),
  court("la-hacienda", "La Hacienda Recreation", { hub: true }),
  court("allamanda", "Allamanda Recreation"),
  court("aviary", "Aviary Recreation", {
    address: "5748 Morse Boulevard, The Villages, FL",
    courts: 6,
  }),
  court("bacall", "Bacall Recreation"),
  court("big-cypress", "Big Cypress Recreation"),
  court("blanchard", "Blanchard Recreation"),
  court("bradenton", "Bradenton Recreation"),
  court("burnsed", "Burnsed Recreation"),
  court("canal-street", "Canal Street Recreation"),
  court("captiva", "Captiva Recreation"),
  court("cattail", "Cattail Recreation"),
  court("chula-vista", "Chula Vista Recreation"),
  court("churchill-street", "Churchill Street Recreation"),
  court("clarendon", "Clarendon Recreation", { phone: "352-751-2650" }),
  court("coconut-cove", "Coconut Cove Recreation"),
  court("cordoba", "Cordoba Recreation"),
  court("dabney", "Dabney Recreation"),
  court("deluna", "DeLuna Recreation"),
  court("el-santiago", "El Santiago Recreation"),
  court("first-responders", "First Responders Recreation", { courts: 2 }),
  court("fish-hawk", "Fish Hawk Recreation"),
  court("franklin", "Franklin Recreation"),
  court("hibiscus", "Hibiscus Recreation"),
  court("homestead", "Homestead Recreation"),
  court("laurel-manor", "Laurel Manor Recreation", {
    address: "1985 Laurel Manor Dr, The Villages, FL",
    courts: 4,
  }),
  court("manatee", "Manatee Recreation"),
  court("moyer", "Moyer Recreation"),
  court("mulberry-grove", "Mulberry Grove Recreation"),
  court("odell", "Odell Recreation"),
  court("paradise", "Paradise Recreation", {
    phone: "352-674-1800",
    address: "1403 Paradise Drive, The Villages, FL",
    courts: 2,
  }),
  court("pimlico", "Pimlico Recreation"),
  court("riverbend", "Riverbend Recreation"),
  court("saddlebrook", "Saddlebrook Recreation"),
  court("saluki", "Saluki Recreation", { phone: "352-674-1833" }),
  court("seabreeze", "SeaBreeze Recreation"),
  court("spanish-moss", "Spanish Moss Recreation"),
  court("sterling-heights", "Sterling Heights Recreation"),
  court("truman", "Truman Recreation", {
    address: "2705 Canal Street, The Villages, FL",
    courts: 6,
  }),
  court("water-lily", "Water Lily Recreation"),
];

export const PICKLEBALL_LOOKING_SECTIONS: {
  id: PickleballFormat;
  label: string;
  blurb: string;
}[] = [
  {
    id: "doubles",
    label: "Doubles",
    blurb: "Need 1–3 more for a rec or league game.",
  },
  {
    id: "singles",
    label: "Singles",
    blurb: "Looking for one opponent.",
  },
];

/** Neighbor-reported DUPR snapshot (admin-approved before the board). */
export type PickleballRating = {
  id: string;
  playerName: string;
  duprDoubles: number | "";
  duprSingles: number | "";
  pcvg?: string;
  courtName?: string;
  notes?: string;
  status: PickleballModStatus;
  createdAt: string;
};

export type PickleballLookingPost = {
  id: string;
  organizerName: string;
  format: PickleballFormat;
  playersNeeded: PickleballPlayersNeeded;
  courtId?: string;
  courtName?: string;
  whenNote: string;
  message: string;
  contact: string;
  duprNote?: string;
  status: PickleballLookingStatus;
  createdAt: string;
};

export type PickleballDuprLeader = {
  playerName: string;
  duprDoubles: number | "";
  duprSingles: number | "";
  pcvg?: string;
  ratingsCount: number;
};

export type PickleballClubData = {
  ratings: PickleballRating[];
  looking: PickleballLookingPost[];
  updatedAt: string | null;
};

export function pickleballCourtById(id: string): PickleballCourt | undefined {
  return PICKLEBALL_COURTS.find((c) => c.id === id);
}

export function pickleballMapsUrl(court: PickleballCourt): string | null {
  const q = court.address || `${court.name}, The Villages, FL`;
  if (!q) return null;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}
