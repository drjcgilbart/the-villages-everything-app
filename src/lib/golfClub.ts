import crypto from "crypto";
import {
  ensureDurableHydrated,
  readJsonFile,
  saveUploadFile,
  writeJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import type {
  GolfAce,
  GolfClubData,
  GolfCourseLeader,
  GolfFoursomePost,
  GolfFoursomeSection,
  GolfHandicapLeader,
  GolfHoles,
  GolfModStatus,
  GolfPlayersNeeded,
  GolfRound,
} from "./golfClubTypes";

const GOLF_FILE = "golf-club.json";

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

function emptyData(): GolfClubData {
  return { rounds: [], foursomes: [], aces: [], updatedAt: null };
}

export function loadGolfClub(): GolfClubData {
  const raw = readJsonFile<GolfClubData>(GOLF_FILE);
  if (!raw) return emptyData();
  return {
    rounds: Array.isArray(raw.rounds) ? raw.rounds : [],
    foursomes: Array.isArray(raw.foursomes) ? raw.foursomes : [],
    aces: Array.isArray(raw.aces) ? raw.aces : [],
    updatedAt: raw.updatedAt || null,
  };
}

export async function loadGolfClubAsync(): Promise<GolfClubData> {
  await ensureDurableHydrated().catch(() => undefined);
  return loadGolfClub();
}

export function saveGolfClub(data: GolfClubData) {
  data.updatedAt = new Date().toISOString();
  writeJsonFile(GOLF_FILE, data);
  return data;
}

export async function saveGolfClubAsync(data: GolfClubData) {
  data.updatedAt = new Date().toISOString();
  await writeJsonFileAsync(GOLF_FILE, data);
  return data;
}

function clampHandicap(n: number): number {
  if (!Number.isFinite(n)) throw new Error("Invalid handicap");
  // Practical bounds for casual reporting
  if (n < -10 || n > 54) throw new Error("Handicap must be between -10 and 54");
  return Math.round(n * 10) / 10;
}

function parseHoles(v: unknown): GolfHoles {
  const n = Number(v);
  if (n === 9 || n === 18) return n;
  throw new Error("Holes must be 9 or 18");
}

function parsePlayersNeeded(v: unknown): GolfPlayersNeeded {
  const n = Number(v);
  if (n === 1 || n === 2 || n === 3) return n;
  throw new Error("Players needed must be 1, 2, or 3");
}

function parseSection(v: unknown): GolfFoursomeSection {
  const s = String(v || "").toLowerCase();
  if (s === "men" || s === "women" || s === "mixed") return s;
  throw new Error("Section must be men, women, or mixed");
}

function cleanName(name: string) {
  const t = name.trim().replace(/\s+/g, " ");
  if (t.length < 2) throw new Error("Name is required");
  if (t.length > 60) throw new Error("Name is too long");
  return t;
}

function cleanCourse(course: string) {
  const t = course.trim().replace(/\s+/g, " ");
  if (t.length < 2) throw new Error("Course is required");
  if (t.length > 80) throw new Error("Course name is too long");
  return t;
}

function isDate(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function cleanPhotoUrl(v: unknown): string | undefined {
  const t = String(v || "").trim();
  if (!t) return undefined;
  if (!t.startsWith("/api/media/")) {
    throw new Error("Photo must be uploaded through this site");
  }
  return t.slice(0, 240);
}

export async function saveGolfAceUpload(
  buffer: Buffer,
  filename: string,
  mime: string
): Promise<{ url: string }> {
  const lower = filename.toLowerCase();
  const mimeLower = (mime || "").toLowerCase();
  const isImage =
    mimeLower.startsWith("image/") ||
    /\.(jpe?g|png|webp|heic|heif)$/i.test(lower) ||
    (!mimeLower && /\.(jpe?g|png|webp)$/i.test(lower));
  if (!isImage) {
    throw new Error("Only one photo is allowed (JPG, PNG, or WebP)");
  }
  let contentType = mimeLower || "image/jpeg";
  if (lower.endsWith(".png")) contentType = "image/png";
  else if (lower.endsWith(".webp")) contentType = "image/webp";
  else if (!contentType.startsWith("image/")) contentType = "image/jpeg";
  const { url } = await saveUploadFile(
    buffer,
    `ace-${filename || "photo.jpg"}`,
    contentType
  );
  return { url };
}

/* —— Rounds (best games) —— */

export async function submitGolfRound(input: {
  playerName: string;
  handicap?: number | null;
  course: string;
  playDate: string;
  playTime?: string;
  holes: unknown;
  score: unknown;
  notes?: string;
}): Promise<GolfRound> {
  const holes = parseHoles(input.holes);
  const score = Number(input.score);
  if (!Number.isFinite(score) || score < 18 || score > 200) {
    throw new Error("Score looks invalid — use total strokes for the round");
  }
  if (!isDate(String(input.playDate || ""))) {
    throw new Error("Play date is required (YYYY-MM-DD)");
  }
  const handicap =
    input.handicap === null ||
    input.handicap === undefined ||
    String(input.handicap) === ""
      ? null
      : clampHandicap(Number(input.handicap));

  const round: GolfRound = {
    id: uid("rnd"),
    playerName: cleanName(input.playerName),
    handicap,
    course: cleanCourse(input.course),
    playDate: String(input.playDate),
    playTime: input.playTime?.trim() || undefined,
    holes,
    score: Math.round(score),
    notes: input.notes?.trim().slice(0, 400) || undefined,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const data = await loadGolfClubAsync();
  data.rounds.unshift(round);
  await saveGolfClubAsync(data);
  return round;
}

export async function setRoundStatus(
  id: string,
  status: GolfModStatus
): Promise<GolfRound> {
  const data = await loadGolfClubAsync();
  const r = data.rounds.find((x) => x.id === id);
  if (!r) throw new Error("Round not found");
  r.status = status;
  await saveGolfClubAsync(data);
  return r;
}

/* —— Foursomes —— */

export async function submitFoursome(input: {
  organizerName: string;
  section: unknown;
  playersNeeded: unknown;
  course?: string;
  whenNote: string;
  message: string;
  contact: string;
}): Promise<GolfFoursomePost> {
  const whenNote = String(input.whenNote || "").trim();
  const message = String(input.message || "").trim();
  const contact = String(input.contact || "").trim();
  if (whenNote.length < 3) throw new Error("When / preferred window is required");
  if (message.length < 5) throw new Error("Add a short message about your group");
  if (contact.length < 3) throw new Error("Contact info is required (phone, email, or village note)");

  const post: GolfFoursomePost = {
    id: uid("fs"),
    organizerName: cleanName(input.organizerName),
    section: parseSection(input.section),
    playersNeeded: parsePlayersNeeded(input.playersNeeded),
    course: input.course?.trim() ? cleanCourse(input.course) : undefined,
    whenNote: whenNote.slice(0, 120),
    message: message.slice(0, 500),
    contact: contact.slice(0, 120),
    status: "open",
    createdAt: new Date().toISOString(),
  };

  const data = await loadGolfClubAsync();
  data.foursomes.unshift(post);
  await saveGolfClubAsync(data);
  return post;
}

export async function setFoursomeStatus(
  id: string,
  status: "open" | "filled" | "hidden"
): Promise<GolfFoursomePost> {
  const data = await loadGolfClubAsync();
  const p = data.foursomes.find((x) => x.id === id);
  if (!p) throw new Error("Foursome post not found");
  p.status = status;
  await saveGolfClubAsync(data);
  return p;
}

/* —— Aces (holes-in-one) —— */

export async function submitAce(input: {
  playerName: string;
  course: string;
  hole: unknown;
  playDate: string;
  clubUsed?: string;
  story?: string;
  photoUrl?: string;
}): Promise<GolfAce> {
  const hole = Number(input.hole);
  if (!Number.isFinite(hole) || hole < 1 || hole > 18) {
    throw new Error("Hole number must be 1–18");
  }
  if (!isDate(String(input.playDate || ""))) {
    throw new Error("Date is required (YYYY-MM-DD)");
  }

  const ace: GolfAce = {
    id: uid("ace"),
    playerName: cleanName(input.playerName),
    course: cleanCourse(input.course),
    hole: Math.round(hole),
    playDate: String(input.playDate),
    clubUsed: input.clubUsed?.trim().slice(0, 40) || undefined,
    story: input.story?.trim().slice(0, 500) || undefined,
    photoUrl: cleanPhotoUrl(input.photoUrl),
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  const data = await loadGolfClubAsync();
  data.aces.unshift(ace);
  await saveGolfClubAsync(data);
  return ace;
}

export async function setAceStatus(
  id: string,
  status: GolfModStatus
): Promise<GolfAce> {
  const data = await loadGolfClubAsync();
  const a = data.aces.find((x) => x.id === id);
  if (!a) throw new Error("Hole-in-one not found");
  a.status = status;
  await saveGolfClubAsync(data);
  return a;
}

export async function updateAce(
  id: string,
  patch: {
    playerName?: string;
    course?: string;
    hole?: unknown;
    playDate?: string;
    clubUsed?: string | null;
    story?: string | null;
    photoUrl?: string | null;
    status?: GolfModStatus;
  }
): Promise<GolfAce> {
  const data = await loadGolfClubAsync();
  const a = data.aces.find((x) => x.id === id);
  if (!a) throw new Error("Hole-in-one not found");

  if (patch.playerName !== undefined) a.playerName = cleanName(patch.playerName);
  if (patch.course !== undefined) a.course = cleanCourse(patch.course);
  if (patch.hole !== undefined) {
    const hole = Number(patch.hole);
    if (!Number.isFinite(hole) || hole < 1 || hole > 18) {
      throw new Error("Hole number must be 1–18");
    }
    a.hole = Math.round(hole);
  }
  if (patch.playDate !== undefined) {
    if (!isDate(String(patch.playDate))) {
      throw new Error("Date is required (YYYY-MM-DD)");
    }
    a.playDate = String(patch.playDate);
  }
  if (patch.clubUsed !== undefined) {
    const club = String(patch.clubUsed || "").trim().slice(0, 40);
    a.clubUsed = club || undefined;
  }
  if (patch.story !== undefined) {
    const story = String(patch.story || "").trim().slice(0, 500);
    a.story = story || undefined;
  }
  if (patch.photoUrl !== undefined) {
    a.photoUrl =
      patch.photoUrl === null || patch.photoUrl === ""
        ? undefined
        : cleanPhotoUrl(patch.photoUrl);
  }
  if (patch.status !== undefined) {
    if (!["pending", "approved", "rejected"].includes(patch.status)) {
      throw new Error("Invalid status");
    }
    a.status = patch.status;
  }

  await saveGolfClubAsync(data);
  return a;
}

export async function deleteAce(id: string): Promise<{ ok: true }> {
  const data = await loadGolfClubAsync();
  const next = data.aces.filter((x) => x.id !== id);
  if (next.length === data.aces.length) {
    throw new Error("Hole-in-one not found");
  }
  data.aces = next;
  await saveGolfClubAsync(data);
  return { ok: true };
}

/* —— Leaderboards —— */

/** Best (lowest) reported handicap per player from approved rounds. */
export function handicapLeaders(
  data: GolfClubData = loadGolfClub(),
  limit = 25
): GolfHandicapLeader[] {
  const map = new Map<string, { handicap: number; roundsCount: number }>();
  for (const r of data.rounds) {
    if (r.status !== "approved" || r.handicap === null) continue;
    const key = r.playerName.toLowerCase();
    const prev = map.get(key);
    if (!prev) {
      map.set(key, { handicap: r.handicap, roundsCount: 1 });
    } else {
      prev.roundsCount += 1;
      // Keep the most recently submitted handicap if lower-or-equal is not
      // enough — prefer the lowest reported (best) handicap for the board.
      if (r.handicap < prev.handicap) prev.handicap = r.handicap;
    }
  }

  // Preserve display casing from first match
  const nameByKey = new Map<string, string>();
  for (const r of data.rounds) {
    if (r.status !== "approved") continue;
    const key = r.playerName.toLowerCase();
    if (!nameByKey.has(key)) nameByKey.set(key, r.playerName);
  }

  return [...map.entries()]
    .map(([key, v]) => ({
      playerName: nameByKey.get(key) || key,
      handicap: v.handicap,
      roundsCount: v.roundsCount,
    }))
    .sort((a, b) => a.handicap - b.handicap || a.playerName.localeCompare(b.playerName))
    .slice(0, limit);
}

/** Best (lowest) score per course + holes from approved rounds. */
export function courseLeaders(
  data: GolfClubData = loadGolfClub()
): GolfCourseLeader[] {
  const best = new Map<string, GolfCourseLeader>();
  for (const r of data.rounds) {
    if (r.status !== "approved") continue;
    const key = `${r.course.toLowerCase()}|${r.holes}`;
    const cur = best.get(key);
    if (
      !cur ||
      r.score < cur.score ||
      (r.score === cur.score && r.playDate > cur.playDate)
    ) {
      best.set(key, {
        course: r.course,
        holes: r.holes,
        playerName: r.playerName,
        score: r.score,
        playDate: r.playDate,
        roundId: r.id,
      });
    }
  }
  return [...best.values()].sort(
    (a, b) =>
      a.course.localeCompare(b.course) || a.holes - b.holes || a.score - b.score
  );
}

export async function publicGolfFeed() {
  const data = await loadGolfClubAsync();
  const approvedRounds = data.rounds
    .filter((r) => r.status === "approved")
    .slice(0, 40);
  const openFoursomes = data.foursomes
    .filter((f) => f.status === "open")
    .slice(0, 60);
  const approvedAces = data.aces
    .filter((a) => a.status === "approved")
    .slice()
    .sort((a, b) => b.playDate.localeCompare(a.playDate) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, 40);

  return {
    handicapLeaders: handicapLeaders(data),
    courseLeaders: courseLeaders(data),
    recentRounds: approvedRounds,
    foursomes: openFoursomes,
    aces: approvedAces,
    pending: {
      rounds: data.rounds.filter((r) => r.status === "pending").length,
      aces: data.aces.filter((a) => a.status === "pending").length,
    },
    updatedAt: data.updatedAt,
  };
}
