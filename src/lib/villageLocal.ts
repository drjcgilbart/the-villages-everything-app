import crypto from "crypto";
import { readJsonFile, tryWriteJsonFile, writeJsonFile } from "./dataFs";
import type {
  VillageLocalBundle,
  VillageLocalData,
  VillageLocalKind,
  VillageLocalLink,
  VillageLocalTip,
} from "./villageLocalTypes";

const FILE = "village-local.json";

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

function emptyData(): VillageLocalData {
  return { links: [], tips: [], updatedAt: null };
}

/** Verified public group pages only — never invent TeamReach codes. */
function curatedLinks(): VillageLocalLink[] {
  const day = "2026-09-06T12:00:00.000Z";
  return [
    {
      id: "curated-edenfield-fb",
      villageSlug: "edenfield",
      kind: "facebook",
      title: "The Village of Edenfield, The Villages FL",
      url: "https://www.facebook.com/groups/edenfieldthevillages/",
      note: "Private neighbor group · created June 2025",
      source: "curated",
      createdAt: day,
    },
    {
      id: "curated-fenney-fb",
      villageSlug: "fenney",
      kind: "facebook",
      title: "Village of Fenney (The Villages, Fl)",
      url: "https://www.facebook.com/groups/1683557811687589/",
      note: "Private neighbor group for Fenney news and day-to-day",
      source: "curated",
      createdAt: day,
    },
    {
      id: "curated-hammock-fenney-fb",
      villageSlug: "hammock-at-fenney",
      kind: "facebook",
      title: "Village of Hammock at Fenney (The Villages, FL)",
      url: "https://www.facebook.com/groups/1005065213331862/",
      note: "Private neighbor group for Hammock at Fenney",
      source: "curated",
      createdAt: day,
    },
  ];
}

function curatedTips(): VillageLocalTip[] {
  const day = "2026-09-06T12:00:00.000Z";
  return [
    {
      id: "curated-edenfield-tip-rec",
      villageSlug: "edenfield",
      title: "Pools on McNeill Drive",
      body: "Edenfield Recreation (6426 McNeill Drive) is the village adult pool. St. Tropez Recreation is a short cart hop on the same street for indoor pickleball and family-friendly rec. Olympia is the regional complex with the big gym.",
      source: "curated",
      createdAt: day,
    },
    {
      id: "curated-edenfield-tip-play",
      villageSlug: "edenfield",
      title: "Golf, square, and shopping",
      body: "Woodlands Championship sits on Craig Court next door. Eastport Town Center is the nearest square. Magnolia Plaza and Sawgrass Grove cover daily shopping, dining, and live music. Confirm hours on official pages.",
      source: "curated",
      createdAt: day,
    },
    {
      id: "curated-fenney-tip",
      villageSlug: "fenney",
      title: "Fenney rec + Brownwood nights",
      body: "Fenney Recreation on Fenney Way is the regional hub. Brownwood Paddock Square is the usual evening square. Neighborhood recs along Fenney Way (Blue Heron, Dudley, Sugar Cane) handle the short pool-and-bocce trips.",
      source: "curated",
      createdAt: day,
    },
  ];
}

export function loadVillageLocal(): VillageLocalData {
  try {
    const raw = readJsonFile<VillageLocalData>(FILE);
    if (!raw) {
      const seed = emptyData();
      tryWriteJsonFile(FILE, seed);
      return seed;
    }
    return {
      links: Array.isArray(raw.links) ? raw.links : [],
      tips: Array.isArray(raw.tips) ? raw.tips : [],
      updatedAt: raw.updatedAt || null,
    };
  } catch {
    return emptyData();
  }
}

export function saveVillageLocal(data: VillageLocalData) {
  data.updatedAt = new Date().toISOString();
  try {
    writeJsonFile(FILE, data);
  } catch {
    throw new Error(
      "Could not save village link on this host. Posts need local disk or cloud storage later."
    );
  }
  return data;
}

function visible<T extends { hidden?: boolean }>(rows: T[]): T[] {
  return rows.filter((r) => !r.hidden);
}

function linkKey(link: VillageLocalLink): string {
  if (link.kind === "facebook") return `fb:${(link.url || "").toLowerCase().replace(/\/$/, "")}`;
  return `tr:${(link.code || "").toLowerCase()}`;
}

function mergeLinks(villageSlug: string): VillageLocalLink[] {
  const data = loadVillageLocal();
  const curated = curatedLinks().filter((l) => l.villageSlug === villageSlug);
  const neighbor = visible(data.links).filter((l) => l.villageSlug === villageSlug);
  const seen = new Set<string>();
  const out: VillageLocalLink[] = [];
  for (const link of [...curated, ...neighbor]) {
    const key = linkKey(link);
    if (!key.endsWith(":") && seen.has(key)) continue;
    if (!key.endsWith(":")) seen.add(key);
    out.push(link);
  }
  return out.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

function mergeTips(villageSlug: string): VillageLocalTip[] {
  const data = loadVillageLocal();
  const curated = curatedTips().filter((t) => t.villageSlug === villageSlug);
  const neighbor = visible(data.tips).filter((t) => t.villageSlug === villageSlug);
  return [...curated, ...neighbor].sort((a, b) =>
    String(b.createdAt).localeCompare(String(a.createdAt))
  );
}

export function getVillageLocalBundle(villageSlug: string): VillageLocalBundle {
  const links = mergeLinks(villageSlug);
  return {
    facebook: links.filter((l) => l.kind === "facebook"),
    teamreach: links.filter((l) => l.kind === "teamreach"),
    tips: mergeTips(villageSlug),
  };
}

function cleanText(v: unknown, max: number, label: string, min = 1) {
  const t = String(v || "").trim().replace(/\s+/g, " ");
  if (t.length < min) throw new Error(`${label} is required`);
  if (t.length > max) throw new Error(`${label} is too long`);
  return t;
}

function optionalText(v: unknown, max: number) {
  const t = String(v || "").trim().replace(/\s+/g, " ");
  if (!t) return undefined;
  if (t.length > max) throw new Error("A field is too long");
  return t;
}

export function parseFacebookGroupUrl(raw: unknown): string {
  const t = String(raw || "").trim();
  if (!t) throw new Error("Paste a Facebook group link");
  let url: URL;
  try {
    url = new URL(t.startsWith("http") ? t : `https://${t}`);
  } catch {
    throw new Error("Enter a full Facebook group URL");
  }
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (host !== "facebook.com" && host !== "m.facebook.com" && host !== "fb.com") {
    throw new Error("Link must be a facebook.com group URL");
  }
  if (!url.pathname.includes("/groups/")) {
    throw new Error("Please paste a Facebook group link (facebook.com/groups/…)");
  }
  url.protocol = "https:";
  url.hash = "";
  url.search = "";
  return url.toString().replace(/\/$/, "");
}

export function parseTeamReachCode(raw: unknown): string {
  const t = String(raw || "").trim().replace(/\s+/g, "");
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,31}$/.test(t)) {
    throw new Error("TeamReach codes are usually 3–32 letters and numbers — no spaces");
  }
  return t;
}

export function addVillageLocalItem(input: {
  villageSlug: string;
  kind: VillageLocalKind;
  title?: string;
  url?: string;
  code?: string;
  note?: string;
  body?: string;
  submittedBy?: string;
}) {
  const villageSlug = String(input.villageSlug || "")
    .trim()
    .toLowerCase()
    .slice(0, 80);
  if (!villageSlug) throw new Error("Village is required");

  const submittedBy = optionalText(input.submittedBy, 60);
  const data = loadVillageLocal();

  if (input.kind === "tip") {
    const title = cleanText(input.title, 80, "Title", 3);
    const body = cleanText(input.body, 600, "Tip", 12);
    const tip: VillageLocalTip = {
      id: uid("vtip"),
      villageSlug,
      title,
      body,
      source: "neighbor",
      submittedBy,
      createdAt: new Date().toISOString(),
    };
    data.tips.unshift(tip);
    saveVillageLocal(data);
    return { kind: "tip" as const, tip };
  }

  if (input.kind === "facebook") {
    const url = parseFacebookGroupUrl(input.url);
    const title = cleanText(input.title || "Village Facebook group", 100, "Group name", 3);
    const existing = data.links.find(
      (l) =>
        l.kind === "facebook" &&
        l.villageSlug === villageSlug &&
        (l.url || "").toLowerCase().replace(/\/$/, "") === url.toLowerCase()
    );
    if (existing && !existing.hidden) {
      throw new Error("That Facebook group is already listed for this village");
    }
    const link: VillageLocalLink = {
      id: uid("vfb"),
      villageSlug,
      kind: "facebook",
      title,
      url,
      note: optionalText(input.note, 160),
      source: "neighbor",
      submittedBy,
      createdAt: new Date().toISOString(),
    };
    data.links.unshift(link);
    saveVillageLocal(data);
    return { kind: "facebook" as const, link };
  }

  if (input.kind === "teamreach") {
    const code = parseTeamReachCode(input.code);
    const title = cleanText(input.title || "Village TeamReach", 80, "Group name", 3);
    const existing = data.links.find(
      (l) =>
        l.kind === "teamreach" &&
        l.villageSlug === villageSlug &&
        (l.code || "").toLowerCase() === code.toLowerCase()
    );
    if (existing && !existing.hidden) {
      throw new Error("That TeamReach code is already listed for this village");
    }
    const link: VillageLocalLink = {
      id: uid("vtr"),
      villageSlug,
      kind: "teamreach",
      title,
      code,
      note: optionalText(input.note, 160),
      source: "neighbor",
      submittedBy,
      createdAt: new Date().toISOString(),
    };
    data.links.unshift(link);
    saveVillageLocal(data);
    return { kind: "teamreach" as const, link };
  }

  throw new Error("Unknown submission type");
}

export function setVillageLocalHidden(id: string, hidden: boolean) {
  const data = loadVillageLocal();
  const linkIdx = data.links.findIndex((n) => n.id === id);
  if (linkIdx >= 0) {
    data.links[linkIdx] = { ...data.links[linkIdx], hidden: !!hidden };
    return saveVillageLocal(data);
  }
  const tipIdx = data.tips.findIndex((n) => n.id === id);
  if (tipIdx >= 0) {
    data.tips[tipIdx] = { ...data.tips[tipIdx], hidden: !!hidden };
    return saveVillageLocal(data);
  }
  throw new Error("Village item not found");
}
