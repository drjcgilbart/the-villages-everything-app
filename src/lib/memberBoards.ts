import { readJsonFile, writeJsonFileAsync } from "./dataFs";
import {
  type MemberBoards,
  type StoredBoardId,
  emptyBoards,
  sanitizeBoard,
} from "./memberBoardModel";
import { sampleBoards } from "./sampleBoards";
import { siteOwnerEmails } from "./siteOwner";
import { getMemberByEmail, listMembers } from "./yardSale";

export * from "./memberBoardModel";

const FILE = "member-boards.json";

type FileShape = {
  members: Record<string, Partial<MemberBoards>>;
  updatedAt: string | null;
};

function loadFile(): FileShape {
  const raw = readJsonFile<FileShape>(FILE);
  if (!raw || typeof raw !== "object") return { members: {}, updatedAt: null };
  return {
    members: raw.members && typeof raw.members === "object" ? raw.members : {},
    updatedAt: raw.updatedAt || null,
  };
}

function ownerIds(): string[] {
  const ids: string[] = [];
  for (const email of siteOwnerEmails()) {
    const m = getMemberByEmail(email);
    if (m?.id) ids.push(m.id);
  }
  return [...new Set(ids)];
}

function sameBoard(a: unknown, b: unknown) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function collectIds(value: unknown, into: Set<string> = new Set()): Set<string> {
  if (!value || typeof value !== "object") return into;
  if (Array.isArray(value)) {
    for (const item of value) collectIds(item, into);
    return into;
  }
  const rec = value as Record<string, unknown>;
  if (typeof rec.id === "string" && rec.id.trim()) into.add(rec.id.trim());
  for (const v of Object.values(rec)) {
    if (v && typeof v === "object") collectIds(v, into);
  }
  return into;
}

function personalIds(value: unknown, sampleIds: Set<string>): Set<string> {
  const out = new Set<string>();
  for (const id of collectIds(value)) {
    if (id.startsWith("ex-") || sampleIds.has(id)) continue;
    out.add(id);
  }
  return out;
}

function collectSignificantStrings(
  value: unknown,
  into: Set<string> = new Set()
): Set<string> {
  if (value == null) return into;
  if (typeof value === "string") {
    const s = value.trim().toLowerCase();
    if (
      s.length >= 12 &&
      !s.startsWith("ex-") &&
      !/^\d{4}-\d{2}-\d{2}/.test(s) &&
      !s.startsWith("http")
    ) {
      into.add(s);
    }
    return into;
  }
  if (typeof value !== "object") return into;
  if (Array.isArray(value)) {
    for (const item of value) collectSignificantStrings(item, into);
    return into;
  }
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (k === "id" || k === "url" || k === "localId") continue;
    collectSignificantStrings(v, into);
  }
  return into;
}

function stringOverlapCopy(mine: unknown, theirs: unknown, samples: unknown) {
  const sampleStr = collectSignificantStrings(samples);
  const mineStr = new Set(
    [...collectSignificantStrings(mine)].filter((s) => !sampleStr.has(s))
  );
  if (mineStr.size < 3) return false;
  const theirsStr = collectSignificantStrings(theirs);
  let hit = 0;
  for (const s of mineStr) {
    if (theirsStr.has(s)) hit += 1;
  }
  return hit >= Math.max(3, Math.ceil(mineStr.size * 0.3));
}

function boardLooksCopied(
  mine: unknown,
  theirs: unknown,
  samples: unknown,
  mineRaw?: unknown,
  theirsRaw?: unknown
) {
  if (
    mineRaw != null &&
    theirsRaw != null &&
    sameBoard(mineRaw, theirsRaw) &&
    !sameBoard(mineRaw, samples)
  ) {
    return true;
  }
  if (sameBoard(mine, theirs) && !sameBoard(mine, samples)) return true;
  const sampleIds = collectIds(samples);
  const minePersonal = personalIds(mine, sampleIds);
  if (minePersonal.size === 0) return false;
  const theirsPersonal = personalIds(theirs, sampleIds);
  for (const id of minePersonal) {
    if (theirsPersonal.has(id)) return true;
  }
  return false;
}

function payloadCopiesOwner(
  memberId: string,
  boardId: StoredBoardId,
  data: unknown
) {
  const owners = ownerIds();
  if (owners.includes(memberId)) return false;
  const samples = sampleBoards()[boardId];
  const sanitized = sanitizeBoard(boardId, data);
  const file = loadFile();
  for (const ownerId of owners) {
    if (
      boardLooksCopied(
        sanitized,
        getMemberBoards(ownerId)[boardId],
        samples,
        data,
        file.members[ownerId]?.[boardId]
      )
    ) {
      return true;
    }
  }
  return false;
}

async function writeMemberBoards(
  memberId: string,
  boards: Partial<MemberBoards>
) {
  const file = loadFile();
  file.members[memberId] = boards;
  file.updatedAt = new Date().toISOString();
  await writeJsonFileAsync(FILE, file);
}

/** New accounts get comic samples only — never another neighbor’s real boards. */
export async function seedNewMemberBoards(memberId: string) {
  const id = String(memberId || "").trim();
  if (!id) return;
  if (ownerIds().includes(id)) return;
  const file = loadFile();
  const existing = file.members[id];
  if (existing && Object.keys(existing).length > 0) {
    await isolateCopiedOwnerBoards(id);
    return;
  }
  await writeMemberBoards(id, sampleBoards());
}

/**
 * If this login somehow received a copy of the site-owner boards, wipe it
 * back to samples. Owner data stays on the owner id only.
 */
export async function isolateCopiedOwnerBoards(memberId: string) {
  const id = String(memberId || "").trim();
  if (!id) return getMemberBoards(id);
  const owners = ownerIds();
  if (owners.includes(id)) return getMemberBoards(id);
  const file = loadFile();
  const mineRaw = file.members[id] || {};
  const samples = sampleBoards();
  const mineSan = getMemberBoards(id);
  const sampleIds = collectIds(samples);
  const next: Partial<MemberBoards> = { ...mineRaw };
  let copiedBoards = 0;
  let ownerIdHit = false;
  for (const ownerId of owners) {
    const theirsSan = getMemberBoards(ownerId);
    const theirsRaw = file.members[ownerId] || {};
    if (
      Object.keys(mineRaw).length > 0 &&
      Object.keys(theirsRaw).length > 0 &&
      sameBoard(mineRaw, theirsRaw)
    ) {
      await writeMemberBoards(id, samples);
      return getMemberBoards(id);
    }
    const minePersonal = personalIds(mineSan, sampleIds);
    const theirsPersonal = personalIds(theirsSan, sampleIds);
    for (const pid of minePersonal) {
      if (theirsPersonal.has(pid)) {
        ownerIdHit = true;
        break;
      }
    }
    if (stringOverlapCopy(mineSan, theirsSan, samples)) ownerIdHit = true;
    for (const key of Object.keys(samples) as StoredBoardId[]) {
      if (
        boardLooksCopied(
          mineSan[key],
          theirsSan[key],
          samples[key],
          mineRaw[key],
          theirsRaw[key]
        )
      ) {
        (next as MemberBoards)[key] = samples[key] as never;
        copiedBoards += 1;
      }
    }
  }
  if (ownerIdHit || copiedBoards >= 2) {
    await writeMemberBoards(id, samples);
    return getMemberBoards(id);
  }
  if (copiedBoards > 0) {
    await writeMemberBoards(id, next);
  }
  return getMemberBoards(id);
}

/** Wipe owner copies off every non-owner account (existing leak cleanup). */
export async function isolateAllCopiedOwnerBoards() {
  const file = loadFile();
  const owners = new Set(ownerIds());
  const ids = new Set<string>([
    ...Object.keys(file.members),
    ...listMembers().map((m) => m.id),
  ]);
  for (const id of ids) {
    if (!id || owners.has(id)) continue;
    await isolateCopiedOwnerBoards(id);
  }
}

export function getMemberBoards(memberId: string): MemberBoards {
  const rec = loadFile().members[memberId] || {};
  return {
    news: sanitizeBoard("news", rec.news) as MemberBoards["news"],
    entertainment: sanitizeBoard(
      "entertainment",
      rec.entertainment
    ) as MemberBoards["entertainment"],
    food: sanitizeBoard("food", rec.food) as MemberBoards["food"],
    gym: sanitizeBoard("gym", rec.gym) as MemberBoards["gym"],
    maintenance: sanitizeBoard(
      "maintenance",
      rec.maintenance
    ) as MemberBoards["maintenance"],
    memories: sanitizeBoard("memories", rec.memories) as MemberBoards["memories"],
    golfLog: sanitizeBoard("golfLog", rec.golfLog) as MemberBoards["golfLog"],
    pickleballLog: sanitizeBoard(
      "pickleballLog",
      rec.pickleballLog
    ) as MemberBoards["pickleballLog"],
    health: sanitizeBoard("health", rec.health) as MemberBoards["health"],
    pets: sanitizeBoard("pets", rec.pets) as MemberBoards["pets"],
    calendar: sanitizeBoard("calendar", rec.calendar) as MemberBoards["calendar"],
    portfolio: sanitizeBoard(
      "portfolio",
      rec.portfolio
    ) as MemberBoards["portfolio"],
    weather: sanitizeBoard("weather", rec.weather) as MemberBoards["weather"],
  };
}

export async function saveMemberBoard(
  memberId: string,
  boardId: StoredBoardId,
  data: unknown
) {
  const safeData = payloadCopiesOwner(memberId, boardId, data)
    ? sampleBoards()[boardId]
    : data;
  const file = loadFile();
  const current = getMemberBoards(memberId);
  const next: MemberBoards = {
    ...emptyBoards(),
    ...current,
    [boardId]: sanitizeBoard(boardId, safeData),
  };
  file.members[memberId] = next;
  file.updatedAt = new Date().toISOString();
  await writeJsonFileAsync(FILE, file);
  return next[boardId];
}

export async function deleteMemberBoards(memberId: string) {
  const file = loadFile();
  if (!file.members[memberId]) return;
  delete file.members[memberId];
  file.updatedAt = new Date().toISOString();
  await writeJsonFileAsync(FILE, file);
}
