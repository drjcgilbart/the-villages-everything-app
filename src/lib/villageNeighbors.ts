import fs from "fs";
import path from "path";
import crypto from "crypto";
import type { VillageNeighbor, VillageNeighborsData } from "./villageNeighborTypes";

const DATA_DIR = path.join(process.cwd(), "data");
const PATH = path.join(DATA_DIR, "village-neighbors.json");

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function uid(prefix = "nbr") {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

function seedData(): VillageNeighborsData {
  const now = new Date().toISOString();
  const day = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
  return {
    neighbors: [
      {
        id: "nbr-seed-1",
        villageSlug: "edenfield",
        displayName: "Pat & Sam",
        areaNote: "Near the cart path to Eastport",
        bio: "New construction survivors who still wave at every cart. Looking for pickleball partners who don't keep score too seriously.",
        interests: ["Pickleball", "Early walks", "Eastport music"],
        tenure: "Since 2025",
        createdAt: day(5),
      },
      {
        id: "nbr-seed-2",
        villageSlug: "edenfield",
        displayName: "Robin",
        bio: "Dog person, coffee person, “which gate is which?” person. Happy to share builder tips and dessert recommendations.",
        interests: ["Dogs", "Baking", "Golf carts"],
        tenure: "Moved in last year",
        createdAt: day(3),
      },
      {
        id: "nbr-seed-3",
        villageSlug: "mira-mesa",
        displayName: "LongTimer Lou",
        bio: "Historic-side regular. Knows every shortcut that still gets you lost. Welcome wagon energy without the formal committee.",
        interests: ["Spanish Springs", "Cards", "History"],
        tenure: "Since 2012",
        createdAt: day(10),
      },
    ],
    updatedAt: now,
  };
}

export function loadVillageNeighbors(): VillageNeighborsData {
  ensureDirs();
  if (!fs.existsSync(PATH)) {
    const seed = seedData();
    fs.writeFileSync(PATH, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
  try {
    const raw = JSON.parse(fs.readFileSync(PATH, "utf8")) as VillageNeighborsData;
    return {
      neighbors: Array.isArray(raw.neighbors) ? raw.neighbors : [],
      updatedAt: raw.updatedAt || null,
    };
  } catch {
    return seedData();
  }
}

export function saveVillageNeighbors(data: VillageNeighborsData) {
  ensureDirs();
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(PATH, JSON.stringify(data, null, 2), "utf8");
  return data;
}

export function getNeighborsForVillage(villageSlug: string): VillageNeighbor[] {
  return loadVillageNeighbors()
    .neighbors.filter((n) => n.villageSlug === villageSlug && !n.hidden)
    .slice()
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

export function addVillageNeighbor(input: {
  villageSlug: string;
  displayName: string;
  areaNote?: string;
  bio: string;
  interests?: string[];
  tenure?: string;
}) {
  const data = loadVillageNeighbors();
  const displayName = String(input.displayName || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 60);
  const bio = String(input.bio || "").trim().slice(0, 600);
  const villageSlug = String(input.villageSlug || "")
    .trim()
    .toLowerCase()
    .slice(0, 80);

  if (!villageSlug) throw new Error("Village is required");
  if (displayName.length < 2) throw new Error("Please enter a display name");
  if (bio.length < 12) throw new Error("Tell neighbors a bit more about you");

  const neighbor: VillageNeighbor = {
    id: uid("nbr"),
    villageSlug,
    displayName,
    areaNote: input.areaNote
      ? String(input.areaNote).trim().slice(0, 80)
      : undefined,
    bio,
    interests: Array.isArray(input.interests)
      ? input.interests.map((t) => String(t).trim().slice(0, 40)).filter(Boolean).slice(0, 8)
      : [],
    tenure: input.tenure ? String(input.tenure).trim().slice(0, 40) : undefined,
    createdAt: new Date().toISOString(),
  };

  data.neighbors.unshift(neighbor);
  saveVillageNeighbors(data);
  return neighbor;
}

export function setNeighborHidden(id: string, hidden: boolean) {
  const data = loadVillageNeighbors();
  const idx = data.neighbors.findIndex((n) => n.id === id);
  if (idx < 0) throw new Error("Neighbor profile not found");
  data.neighbors[idx] = { ...data.neighbors[idx], hidden: !!hidden };
  return saveVillageNeighbors(data);
}
