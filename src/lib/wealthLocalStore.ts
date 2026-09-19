import crypto from "crypto";
import {
  durableConfigured,
  ensureDurableHydrated,
  isEphemeralHost,
  pullDurableJson,
  cacheDurableJson,
  readJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import {
  WEALTH_ACCENTS,
  WEALTH_LOCAL,
  WEALTH_RESOURCE_KINDS,
  type WealthAccent,
  type WealthResource,
  type WealthResourceKind,
} from "./wealthResources";

const FILE = "wealth-local.json";

type WealthLocalFile = {
  places: WealthResource[];
  updatedAt: string | null;
};

const KIND_IDS = new Set(WEALTH_RESOURCE_KINDS.map((k) => k.id));
const ACCENT_IDS = new Set(WEALTH_ACCENTS);

function clip(s: unknown, n: number) {
  return String(s || "").trim().slice(0, n);
}

function emptyFile(): WealthLocalFile {
  return { places: [], updatedAt: null };
}

export function sanitizeWealthPlace(
  raw: Partial<WealthResource> & { id?: string },
  fallbackId?: string
): WealthResource | null {
  const name = clip(raw.name, 80);
  if (!name) return null;
  const kind = KIND_IDS.has(raw.kind as WealthResourceKind)
    ? (raw.kind as WealthResourceKind)
    : "bank";
  const accent = ACCENT_IDS.has(raw.accent as WealthAccent)
    ? (raw.accent as WealthAccent)
    : "palm";
  const id =
    clip(raw.id, 48).replace(/[^a-z0-9-]/gi, "") ||
    fallbackId ||
    slugId(name);
  return {
    id,
    name,
    kind,
    emoji: clip(raw.emoji, 8) || "🏦",
    blurb: clip(raw.blurb, 500),
    address: clip(raw.address, 120) || undefined,
    city: clip(raw.city, 80) || undefined,
    phone: clip(raw.phone, 40) || undefined,
    hours: clip(raw.hours, 80) || undefined,
    href: clip(raw.href, 240) || undefined,
    mapsQuery: clip(raw.mapsQuery, 160) || undefined,
    accent,
  };
}

function slugId(name: string) {
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 36) || "place";
  return `${slug}-${crypto.randomBytes(2).toString("hex")}`;
}

function normalizeFile(raw: unknown): WealthLocalFile {
  if (!raw || typeof raw !== "object") return emptyFile();
  const r = raw as Partial<WealthLocalFile>;
  const places = Array.isArray(r.places)
    ? r.places
        .map((p) => sanitizeWealthPlace(p || {}))
        .filter((p): p is WealthResource => !!p)
        .slice(0, 80)
    : [];
  return { places, updatedAt: r.updatedAt || null };
}

function seedFile(): WealthLocalFile {
  return {
    places: WEALTH_LOCAL.map((p) => ({ ...p })),
    updatedAt: null,
  };
}

export async function loadWealthLocalAsync(): Promise<WealthLocalFile> {
  if (isEphemeralHost() && durableConfigured()) {
    try {
      const text = await pullDurableJson(FILE);
      if (text) cacheDurableJson(FILE, text);
    } catch (err) {
      console.error("[wealth-local] durable pull failed", err);
      await ensureDurableHydrated().catch(() => undefined);
    }
  } else {
    await ensureDurableHydrated().catch(() => undefined);
  }

  const existing = readJsonFile<WealthLocalFile>(FILE);
  if (existing && Array.isArray(existing.places)) {
    return normalizeFile(existing);
  }
  const seeded = seedFile();
  await writeJsonFileAsync(FILE, seeded);
  return seeded;
}

export async function saveWealthLocalAsync(data: WealthLocalFile) {
  const next: WealthLocalFile = {
    places: data.places.slice(0, 80),
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFileAsync(FILE, next);
  return next;
}

export async function upsertWealthPlace(
  raw: Partial<WealthResource>
): Promise<WealthResource> {
  const data = await loadWealthLocalAsync();
  const incoming = sanitizeWealthPlace(raw);
  if (!incoming) throw new Error("Name is required");
  const idx = data.places.findIndex((p) => p.id === incoming.id);
  if (idx >= 0) data.places[idx] = incoming;
  else data.places.push(incoming);
  await saveWealthLocalAsync(data);
  return incoming;
}

export async function deleteWealthPlace(id: string): Promise<boolean> {
  const data = await loadWealthLocalAsync();
  const next = data.places.filter((p) => p.id !== id);
  if (next.length === data.places.length) return false;
  await saveWealthLocalAsync({ ...data, places: next });
  return true;
}
