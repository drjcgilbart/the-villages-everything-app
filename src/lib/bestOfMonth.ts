import crypto from "crypto";
import {
  ensureDurableHydrated,
  readJsonFile,
  resolveUploadFile,
  saveUploadFile,
  writeJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import {
  BOM_CATEGORIES,
  BOM_CATEGORY_META,
  type BomCategory,
  type BomData,
  type BomEntry,
  type BomFileType,
  type BomMonthResults,
  type BomVote,
} from "./bestOfMonthTypes";

const BOM_FILE = "best-of-month.json";

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

/** Florida calendar month key YYYY-MM */
export function bomMonthKey(d = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  return `${y}-${m}`;
}

export function previousMonthKey(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 2, 1); // month is 1-based in key
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yy}-${mm}`;
}

export function nextMonthKey(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m, 1);
  const yy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${yy}-${mm}`;
}

export function formatMonthLabel(monthKey: string): string {
  const [y, m] = monthKey.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function emptyData(): BomData {
  return { entries: [], votes: [], results: [], updatedAt: null };
}

export function loadBom(): BomData {
  const raw = readJsonFile<BomData>(BOM_FILE);
  if (!raw) return emptyData();
  return {
    entries: Array.isArray(raw.entries) ? raw.entries : [],
    votes: Array.isArray(raw.votes) ? raw.votes : [],
    results: Array.isArray(raw.results) ? raw.results : [],
    updatedAt: raw.updatedAt || null,
  };
}

/** Prefer this on serverless so Blob-backed entries are visible. */
export async function loadBomAsync(): Promise<BomData> {
  // Always re-pull this file from Blob (not the multi-file hydrate TTL cache)
  // so approvals submitted on another instance show up immediately.
  const {
    pullJsonFromBlob,
    isEphemeralHost,
    blobConfigured,
    cacheDurableJson,
  } = await import("./dataFs");
  if (isEphemeralHost() && blobConfigured()) {
    const text = await pullJsonFromBlob(BOM_FILE);
    if (text) {
      try {
        JSON.parse(text); // validate
        cacheDurableJson(BOM_FILE, text);
      } catch {
        /* fall through to local/memory */
      }
    }
  } else {
    await ensureDurableHydrated();
  }
  return loadBom();
}

export function saveBom(data: BomData) {
  data.updatedAt = new Date().toISOString();
  writeJsonFile(BOM_FILE, data);
  return data;
}

export async function saveBomAsync(data: BomData) {
  data.updatedAt = new Date().toISOString();
  await writeJsonFileAsync(BOM_FILE, data);
  return data;
}

export function isBomCategory(v: string): v is BomCategory {
  return (BOM_CATEGORIES as readonly string[]).includes(v);
}

/** Tabulate any past month that has approved entries but no results yet. */
export function ensurePastMonthsTabulated(data: BomData = loadBom()): BomData {
  const current = bomMonthKey();
  const months = new Set(
    data.entries
      .filter((e) => e.status === "approved")
      .map((e) => e.monthKey)
      .filter((m) => m < current)
  );

  let changed = false;
  for (const monthKey of months) {
    if (data.results.some((r) => r.monthKey === monthKey)) continue;
    data = tabulateMonth(data, monthKey);
    changed = true;
  }
  if (changed) saveBom(data);
  return data;
}

export async function ensurePastMonthsTabulatedAsync(
  data?: BomData
): Promise<BomData> {
  let next = data || (await loadBomAsync());
  const current = bomMonthKey();
  const months = new Set(
    next.entries
      .filter((e) => e.status === "approved")
      .map((e) => e.monthKey)
      .filter((m) => m < current)
  );

  let changed = false;
  for (const monthKey of months) {
    if (next.results.some((r) => r.monthKey === monthKey)) continue;
    next = tabulateMonth(next, monthKey);
    changed = true;
  }
  if (changed) await saveBomAsync(next);
  return next;
}

export function tabulateMonth(data: BomData, monthKey: string): BomData {
  if (data.results.some((r) => r.monthKey === monthKey)) return data;

  const categories = BOM_CATEGORIES.map((category) => {
    const ranked = data.entries
      .filter(
        (e) =>
          e.status === "approved" &&
          e.monthKey === monthKey &&
          e.category === category
      )
      .slice()
      .sort((a, b) => {
        if (b.votes !== a.votes) return b.votes - a.votes;
        return a.createdAt.localeCompare(b.createdAt);
      });

    const winnerEntryId = ranked[0]?.id || null;
    const honorableMentionIds = ranked
      .slice(1, 3)
      .map((e) => e.id)
      .filter(Boolean);

    return { category, winnerEntryId, honorableMentionIds };
  });

  const result: BomMonthResults = {
    monthKey,
    featuredInMonthKey: nextMonthKey(monthKey),
    tabulatedAt: new Date().toISOString(),
    categories,
  };
  data.results.unshift(result);
  return data;
}

/** Force-tabulate previous month (cron / manual). */
export function tabulatePreviousMonthIfNeeded(): BomData {
  let data = loadBom();
  data = ensurePastMonthsTabulated(data);
  const prev = previousMonthKey(bomMonthKey());
  if (!data.results.some((r) => r.monthKey === prev)) {
    const hasEntries = data.entries.some(
      (e) => e.status === "approved" && e.monthKey === prev
    );
    if (hasEntries) {
      data = tabulateMonth(data, prev);
      saveBom(data);
    }
  }
  return data;
}

export function getResultsForFeaturedMonth(
  data: BomData,
  featuredMonthKey: string
): BomMonthResults | null {
  return (
    data.results.find((r) => r.featuredInMonthKey === featuredMonthKey) ||
    data.results.find(
      (r) => r.monthKey === previousMonthKey(featuredMonthKey)
    ) ||
    null
  );
}

export function getEntryById(
  data: BomData,
  id: string
): BomEntry | undefined {
  return data.entries.find((e) => e.id === id);
}

export function listApprovedForMonth(
  data: BomData,
  monthKey: string,
  category?: BomCategory
): BomEntry[] {
  return data.entries
    .filter(
      (e) =>
        e.status === "approved" &&
        e.monthKey === monthKey &&
        (category ? e.category === category : true)
    )
    .slice()
    .sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes;
      return a.createdAt.localeCompare(b.createdAt);
    });
}

export function submitBomEntry(input: {
  category: BomCategory;
  title: string;
  description?: string;
  submitterName: string;
  imageUrl: string;
  fileType: BomFileType;
  monthKey?: string;
}): BomEntry {
  const data = loadBom();
  const title = String(input.title || "").trim().slice(0, 80);
  const submitterName = String(input.submitterName || "").trim().slice(0, 60);
  if (title.length < 2) throw new Error("Please enter a name/title");
  if (submitterName.length < 2) throw new Error("Please enter your name");
  if (!input.imageUrl) throw new Error("Please upload a JPG or PDF");
  if (!isBomCategory(input.category)) throw new Error("Invalid category");

  const entry: BomEntry = {
    id: uid("bom"),
    category: input.category,
    title,
    description: input.description
      ? String(input.description).trim().slice(0, 500)
      : undefined,
    submitterName,
    imageUrl: input.imageUrl,
    fileType: input.fileType,
    status: "pending",
    monthKey: input.monthKey || bomMonthKey(),
    createdAt: new Date().toISOString(),
    votes: 0,
  };
  data.entries.unshift(entry);
  saveBom(data);
  return entry;
}

export async function submitBomEntryAsync(input: {
  category: BomCategory;
  title: string;
  description?: string;
  submitterName: string;
  imageUrl: string;
  fileType: BomFileType;
  monthKey?: string;
}): Promise<BomEntry> {
  const data = await loadBomAsync();
  const title = String(input.title || "").trim().slice(0, 80);
  const submitterName = String(input.submitterName || "").trim().slice(0, 60);
  if (title.length < 2) throw new Error("Please enter a name/title");
  if (submitterName.length < 2) throw new Error("Please enter your name");
  if (!input.imageUrl) throw new Error("Please upload a JPG or PDF");
  if (!isBomCategory(input.category)) throw new Error("Invalid category");

  const entry: BomEntry = {
    id: uid("bom"),
    category: input.category,
    title,
    description: input.description
      ? String(input.description).trim().slice(0, 500)
      : undefined,
    submitterName,
    imageUrl: input.imageUrl,
    fileType: input.fileType,
    status: "pending",
    monthKey: input.monthKey || bomMonthKey(),
    createdAt: new Date().toISOString(),
    votes: 0,
  };
  data.entries.unshift(entry);
  await saveBomAsync(data);
  return entry;
}

export function setBomEntryStatus(
  id: string,
  status: "approved" | "rejected" | "pending"
): BomEntry {
  const data = loadBom();
  const idx = data.entries.findIndex((e) => e.id === id);
  if (idx < 0) throw new Error("Entry not found");
  data.entries[idx] = { ...data.entries[idx], status };
  saveBom(data);
  return data.entries[idx];
}

export async function setBomEntryStatusAsync(
  id: string,
  status: "approved" | "rejected" | "pending"
): Promise<BomEntry> {
  const data = await loadBomAsync();
  const idx = data.entries.findIndex((e) => e.id === id);
  if (idx < 0) throw new Error("Entry not found");
  data.entries[idx] = { ...data.entries[idx], status };
  await saveBomAsync(data);
  return data.entries[idx];
}

/** Admin: edit text (and optional category/status) on pending or approved entries. */
export async function updateBomEntryAsync(
  id: string,
  patch: {
    title?: string;
    description?: string | null;
    submitterName?: string;
    category?: string;
    status?: "approved" | "rejected" | "pending";
  }
): Promise<BomEntry> {
  const data = await loadBomAsync();
  const idx = data.entries.findIndex((e) => e.id === id);
  if (idx < 0) throw new Error("Entry not found");

  const cur = data.entries[idx];
  const title =
    patch.title !== undefined
      ? String(patch.title || "").trim().slice(0, 80)
      : cur.title;
  const submitterName =
    patch.submitterName !== undefined
      ? String(patch.submitterName || "").trim().slice(0, 60)
      : cur.submitterName;
  if (title.length < 2) throw new Error("Title is required");
  if (submitterName.length < 2) throw new Error("Submitter name is required");

  let description = cur.description;
  if (patch.description !== undefined) {
    const d = String(patch.description || "").trim().slice(0, 500);
    description = d.length ? d : undefined;
  }

  let category = cur.category;
  if (patch.category !== undefined) {
    if (!isBomCategory(String(patch.category))) {
      throw new Error("Invalid category");
    }
    category = patch.category as BomCategory;
  }

  let status = cur.status;
  if (patch.status !== undefined) {
    if (!["approved", "rejected", "pending"].includes(patch.status)) {
      throw new Error("Invalid status");
    }
    status = patch.status;
  }

  data.entries[idx] = {
    ...cur,
    title,
    description,
    submitterName,
    category,
    status,
  };
  await saveBomAsync(data);
  return data.entries[idx];
}

/** Admin: permanently remove an entry (and its votes). */
export async function deleteBomEntryAsync(id: string): Promise<void> {
  const data = await loadBomAsync();
  const before = data.entries.length;
  data.entries = data.entries.filter((e) => e.id !== id);
  if (data.entries.length === before) throw new Error("Entry not found");
  data.votes = data.votes.filter((v) => v.entryId !== id);
  // Recompute vote totals for remaining entries (in case of inconsistency)
  const counts = new Map<string, number>();
  for (const v of data.votes) {
    counts.set(v.entryId, (counts.get(v.entryId) || 0) + 1);
  }
  data.entries = data.entries.map((e) => ({
    ...e,
    votes: counts.get(e.id) || 0,
  }));
  await saveBomAsync(data);
}

function recountVotes(data: BomData, entryIds: string[]) {
  const set = new Set(entryIds.filter(Boolean));
  for (const id of set) {
    const idx = data.entries.findIndex((e) => e.id === id);
    if (idx < 0) continue;
    data.entries[idx] = {
      ...data.entries[idx],
      votes: data.votes.filter((v) => v.entryId === id).length,
    };
  }
}

/**
 * Cast or change a vote in a category for the current month.
 * One active pick per category per visitor — may switch until the month ends.
 */
export function castBomVote(input: {
  entryId: string;
  voterKey: string;
}): { entry: BomEntry; votes: number; changed: boolean; message: string } {
  const data = ensurePastMonthsTabulated(loadBom());
  const monthKey = bomMonthKey();
  const voterKey = String(input.voterKey || "").trim().slice(0, 80);
  if (voterKey.length < 8) throw new Error("Missing voter id");

  const entry = data.entries.find((e) => e.id === input.entryId);
  if (!entry) throw new Error("Entry not found");
  if (entry.status !== "approved") throw new Error("Entry is not open for voting");
  if (entry.monthKey !== monthKey) {
    throw new Error("Voting is only open for this month’s entries");
  }

  const already = data.votes.find(
    (v) =>
      v.voterKey === voterKey &&
      v.monthKey === monthKey &&
      v.category === entry.category
  );

  if (already) {
    if (already.entryId === entry.id) {
      const idx = data.entries.findIndex((e) => e.id === entry.id);
      return {
        entry: data.entries[idx],
        votes: data.entries[idx].votes,
        changed: false,
        message: "That’s already your pick in this category.",
      };
    }
    const previousId = already.entryId;
    already.entryId = entry.id;
    already.createdAt = new Date().toISOString();
    recountVotes(data, [previousId, entry.id]);
    saveBom(data);
    const idx = data.entries.findIndex((e) => e.id === entry.id);
    return {
      entry: data.entries[idx],
      votes: data.entries[idx].votes,
      changed: true,
      message: `Vote moved to “${entry.title}”. You can change again anytime this month.`,
    };
  }

  const vote: BomVote = {
    id: uid("vote"),
    entryId: entry.id,
    category: entry.category,
    monthKey,
    voterKey,
    createdAt: new Date().toISOString(),
  };
  data.votes.push(vote);
  recountVotes(data, [entry.id]);
  saveBom(data);
  const idx = data.entries.findIndex((e) => e.id === entry.id);
  return {
    entry: data.entries[idx],
    votes: data.entries[idx].votes,
    changed: true,
    message: "Vote recorded — you can change it anytime this month.",
  };
}

export async function castBomVoteAsync(input: {
  entryId: string;
  voterKey: string;
}): Promise<{ entry: BomEntry; votes: number; changed: boolean; message: string }> {
  const data = await ensurePastMonthsTabulatedAsync();
  const monthKey = bomMonthKey();
  const voterKey = String(input.voterKey || "").trim().slice(0, 80);
  if (voterKey.length < 8) throw new Error("Missing voter id");

  const entry = data.entries.find((e) => e.id === input.entryId);
  if (!entry) throw new Error("Entry not found");
  if (entry.status !== "approved") throw new Error("Entry is not open for voting");
  if (entry.monthKey !== monthKey) {
    throw new Error("Voting is only open for this month’s entries");
  }

  const already = data.votes.find(
    (v) =>
      v.voterKey === voterKey &&
      v.monthKey === monthKey &&
      v.category === entry.category
  );

  if (already) {
    if (already.entryId === entry.id) {
      const idx = data.entries.findIndex((e) => e.id === entry.id);
      return {
        entry: data.entries[idx],
        votes: data.entries[idx].votes,
        changed: false,
        message: "That’s already your pick in this category.",
      };
    }
    const previousId = already.entryId;
    already.entryId = entry.id;
    already.createdAt = new Date().toISOString();
    recountVotes(data, [previousId, entry.id]);
    await saveBomAsync(data);
    const idx = data.entries.findIndex((e) => e.id === entry.id);
    return {
      entry: data.entries[idx],
      votes: data.entries[idx].votes,
      changed: true,
      message: `Vote moved to “${entry.title}”. You can change again anytime this month.`,
    };
  }

  const vote: BomVote = {
    id: uid("vote"),
    entryId: entry.id,
    category: entry.category,
    monthKey,
    voterKey,
    createdAt: new Date().toISOString(),
  };
  data.votes.push(vote);
  recountVotes(data, [entry.id]);
  await saveBomAsync(data);
  const idx = data.entries.findIndex((e) => e.id === entry.id);
  return {
    entry: data.entries[idx],
    votes: data.entries[idx].votes,
    changed: true,
    message: "Vote recorded — you can change it anytime this month.",
  };
}

export function voterChoicesThisMonth(
  data: BomData,
  voterKey: string,
  monthKey = bomMonthKey()
): Partial<Record<BomCategory, string>> {
  const out: Partial<Record<BomCategory, string>> = {};
  for (const v of data.votes) {
    if (v.voterKey === voterKey && v.monthKey === monthKey) {
      out[v.category] = v.entryId;
    }
  }
  return out;
}

export async function saveBomUpload(
  buffer: Buffer,
  filename: string,
  mime: string
): Promise<{ url: string; fileType: BomFileType }> {
  const lower = filename.toLowerCase();
  const mimeLower = (mime || "").toLowerCase();
  const isPdf = mimeLower === "application/pdf" || lower.endsWith(".pdf");
  const isImage =
    mimeLower === "image/jpeg" ||
    mimeLower === "image/jpg" ||
    mimeLower === "image/png" ||
    mimeLower === "image/webp" ||
    mimeLower === "image/heic" ||
    mimeLower === "image/heif" ||
    lower.endsWith(".jpg") ||
    lower.endsWith(".jpeg") ||
    lower.endsWith(".png") ||
    lower.endsWith(".webp") ||
    lower.endsWith(".heic") ||
    lower.endsWith(".heif") ||
    // iOS sometimes sends empty type for photos
    (!mimeLower && /\.(jpe?g|png|webp)$/i.test(lower));
  if (!isPdf && !isImage) {
    throw new Error("Only photo (JPG/PNG/WebP) or PDF files are allowed");
  }

  let contentType = mimeLower || "image/jpeg";
  if (isPdf) contentType = "application/pdf";
  else if (lower.endsWith(".png")) contentType = "image/png";
  else if (lower.endsWith(".webp")) contentType = "image/webp";
  else if (!contentType.startsWith("image/")) contentType = "image/jpeg";

  // Prefix so media/blob keys are easy to spot
  const safeName = `bom-${filename || "photo.jpg"}`;
  const { url } = await saveUploadFile(buffer, safeName, contentType);

  return {
    url,
    fileType: isPdf ? "pdf" : "image",
  };
}

export function resolveBomMedia(name: string) {
  const base = String(name || "").split(/[/\\]/).pop() || "";
  return resolveUploadFile(base);
}

export { BOM_CATEGORIES, BOM_CATEGORY_META };
