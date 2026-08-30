import crypto from "crypto";
import {
  ensureDurableHydrated,
  readJsonFile,
  writeJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import {
  pickleballCourtById,
  type PickleballClubData,
  type PickleballDuprLeader,
  type PickleballFormat,
  type PickleballLookingPost,
  type PickleballLookingStatus,
  type PickleballModStatus,
  type PickleballPlayersNeeded,
  type PickleballRating,
} from "./pickleballTypes";

const FILE = "pickleball-club.json";

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

function emptyData(): PickleballClubData {
  return { ratings: [], looking: [], updatedAt: null };
}

export function loadPickleballClub(): PickleballClubData {
  const raw = readJsonFile<PickleballClubData>(FILE);
  if (!raw) return emptyData();
  return {
    ratings: Array.isArray(raw.ratings) ? raw.ratings : [],
    looking: Array.isArray(raw.looking) ? raw.looking : [],
    updatedAt: raw.updatedAt || null,
  };
}

export async function loadPickleballClubAsync(): Promise<PickleballClubData> {
  await ensureDurableHydrated().catch(() => undefined);
  return loadPickleballClub();
}

export async function savePickleballClubAsync(data: PickleballClubData) {
  data.updatedAt = new Date().toISOString();
  await writeJsonFileAsync(FILE, data);
  return data;
}

export function savePickleballClub(data: PickleballClubData) {
  data.updatedAt = new Date().toISOString();
  writeJsonFile(FILE, data);
  return data;
}

function cleanName(name: string) {
  const t = name.trim().replace(/\s+/g, " ");
  if (t.length < 2) throw new Error("Name is required");
  if (t.length > 60) throw new Error("Name is too long");
  return t;
}

function duprNum(value: unknown): number | "" {
  if (value === "" || value == null) return "";
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error("DUPR must be a number");
  if (n < 2 || n > 8) throw new Error("DUPR must be between 2.000 and 8.000");
  return Math.round(n * 1000) / 1000;
}

function parseFormat(v: unknown): PickleballFormat {
  return String(v || "").toLowerCase() === "singles" ? "singles" : "doubles";
}

function parseNeeded(v: unknown): PickleballPlayersNeeded {
  const n = Number(v);
  if (n === 1 || n === 2 || n === 3) return n;
  throw new Error("Players needed must be 1, 2, or 3");
}

export async function submitPickleballRating(input: {
  playerName: string;
  duprDoubles?: unknown;
  duprSingles?: unknown;
  pcvg?: string;
  courtName?: string;
  notes?: string;
}): Promise<PickleballRating> {
  const duprDoubles = duprNum(input.duprDoubles);
  const duprSingles = duprNum(input.duprSingles);
  if (duprDoubles === "" && duprSingles === "") {
    throw new Error("Enter a DUPR doubles and/or singles rating");
  }
  const rec: PickleballRating = {
    id: uid("dupr"),
    playerName: cleanName(input.playerName),
    duprDoubles,
    duprSingles,
    pcvg: input.pcvg?.trim().slice(0, 20) || undefined,
    courtName: input.courtName?.trim().slice(0, 80) || undefined,
    notes: input.notes?.trim().slice(0, 400) || undefined,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const data = await loadPickleballClubAsync();
  data.ratings.unshift(rec);
  await savePickleballClubAsync(data);
  return rec;
}

export async function setPickleballRatingStatus(
  id: string,
  status: PickleballModStatus
): Promise<PickleballRating> {
  const data = await loadPickleballClubAsync();
  const rec = data.ratings.find((x) => x.id === id);
  if (!rec) throw new Error("Rating not found");
  rec.status = status;
  await savePickleballClubAsync(data);
  return rec;
}

export async function submitPickleballLooking(input: {
  organizerName: string;
  format: unknown;
  playersNeeded: unknown;
  courtId?: string;
  whenNote: string;
  message: string;
  contact: string;
  duprNote?: string;
}): Promise<PickleballLookingPost> {
  const whenNote = String(input.whenNote || "").trim();
  const message = String(input.message || "").trim();
  const contact = String(input.contact || "").trim();
  if (whenNote.length < 3) throw new Error("When / preferred window is required");
  if (message.length < 5) throw new Error("Add a short note about the game");
  if (contact.length < 3) {
    throw new Error("Contact info is required (phone, email, or village note)");
  }
  const court = input.courtId ? pickleballCourtById(input.courtId) : undefined;
  const post: PickleballLookingPost = {
    id: uid("look"),
    organizerName: cleanName(input.organizerName),
    format: parseFormat(input.format),
    playersNeeded: parseNeeded(input.playersNeeded),
    courtId: court?.id,
    courtName: court?.name,
    whenNote: whenNote.slice(0, 120),
    message: message.slice(0, 500),
    contact: contact.slice(0, 120),
    duprNote: input.duprNote?.trim().slice(0, 40) || undefined,
    status: "open",
    createdAt: new Date().toISOString(),
  };
  const data = await loadPickleballClubAsync();
  data.looking.unshift(post);
  await savePickleballClubAsync(data);
  return post;
}

export async function setPickleballLookingStatus(
  id: string,
  status: PickleballLookingStatus
): Promise<PickleballLookingPost> {
  const data = await loadPickleballClubAsync();
  const p = data.looking.find((x) => x.id === id);
  if (!p) throw new Error("Looking post not found");
  p.status = status;
  await savePickleballClubAsync(data);
  return p;
}

function duprLeaders(data: PickleballClubData): PickleballDuprLeader[] {
  const latest = new Map<string, PickleballRating>();
  const counts = new Map<string, number>();
  for (const r of data.ratings) {
    if (r.status !== "approved") continue;
    const key = r.playerName.toLowerCase();
    counts.set(key, (counts.get(key) || 0) + 1);
    const prev = latest.get(key);
    if (!prev || r.createdAt > prev.createdAt) latest.set(key, r);
  }
  return [...latest.values()]
    .map((r) => ({
      playerName: r.playerName,
      duprDoubles: r.duprDoubles,
      duprSingles: r.duprSingles,
      pcvg: r.pcvg,
      ratingsCount: counts.get(r.playerName.toLowerCase()) || 1,
    }))
    .sort((a, b) => {
      const ad = typeof a.duprDoubles === "number" ? a.duprDoubles : -1;
      const bd = typeof b.duprDoubles === "number" ? b.duprDoubles : -1;
      return bd - ad;
    })
    .slice(0, 40);
}

export async function publicPickleballFeed() {
  const data = await loadPickleballClubAsync();
  return {
    duprLeaders: duprLeaders(data),
    looking: data.looking.filter((p) => p.status === "open").slice(0, 60),
    pendingRatings: data.ratings.filter((r) => r.status === "pending").length,
    updatedAt: data.updatedAt,
  };
}
