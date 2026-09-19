import crypto from "crypto";
import fs from "fs";
import path from "path";
import {
  ensureDurableHydrated,
  readJsonFile,
  writeJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import {
  CLUB_LISTING_CATEGORIES,
  CLUB_MEMBERSHIP_STATUSES,
  type ClubListing,
  type ClubListingCategory,
  type ClubListingModStatus,
  type ClubListingsData,
  type ClubMembershipStatus,
} from "./clubListingsTypes";

const FILE = "club-listings.json";

function uid(prefix = "club") {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

function emptyData(): ClubListingsData {
  return { listings: [], updatedAt: null };
}

export function loadClubListings(): ClubListingsData {
  const raw = readJsonFile<ClubListingsData>(FILE);
  if (!raw) return emptyData();
  return {
    listings: Array.isArray(raw.listings) ? raw.listings : [],
    updatedAt: raw.updatedAt || null,
  };
}

function clubDedupeKey(l: ClubListing): string {
  return `${l.name}|${l.location}`.toLowerCase();
}

function readBundledClubSeed(): ClubListingsData | null {
  try {
    const p = path.join(process.cwd(), "data", FILE);
    if (!fs.existsSync(/*turbopackIgnore: true*/ p)) return null;
    const raw = JSON.parse(
      fs.readFileSync(/*turbopackIgnore: true*/ p, "utf8")
    ) as ClubListingsData;
    return {
      listings: Array.isArray(raw.listings) ? raw.listings : [],
      updatedAt: raw.updatedAt || null,
    };
  } catch {
    return null;
  }
}

async function mergeMissingSeedClubs(
  data: ClubListingsData
): Promise<ClubListingsData> {
  const seed = readBundledClubSeed();
  if (!seed?.listings.length) return data;
  const byId = new Set(data.listings.map((l) => l.id));
  const byKey = new Set(data.listings.map(clubDedupeKey));
  const toAdd = seed.listings.filter((l) => {
    if (!l?.id || !l.name) return false;
    if (byId.has(l.id)) return false;
    return !byKey.has(clubDedupeKey(l));
  });
  if (!toAdd.length) return data;
  const merged: ClubListingsData = {
    listings: [...data.listings, ...toAdd],
    updatedAt: new Date().toISOString(),
  };
  await saveClubListingsAsync(merged);
  return merged;
}

export async function loadClubListingsAsync(): Promise<ClubListingsData> {
  await ensureDurableHydrated();
  const data = loadClubListings();
  return mergeMissingSeedClubs(data);
}

export function saveClubListings(data: ClubListingsData) {
  data.updatedAt = new Date().toISOString();
  writeJsonFile(FILE, data);
  return data;
}

export async function saveClubListingsAsync(data: ClubListingsData) {
  data.updatedAt = new Date().toISOString();
  await writeJsonFileAsync(FILE, data);
  return data;
}

function cleanText(v: unknown, max: number, label: string, min = 1) {
  const t = String(v || "").trim().replace(/\s+/g, " ");
  if (t.length < min) throw new Error(`${label} is required`);
  if (t.length > max) throw new Error(`${label} is too long`);
  return t;
}

function optionalText(v: unknown, max: number) {
  const t = String(v || "").trim();
  if (!t) return undefined;
  if (t.length > max) throw new Error("A field is too long");
  return t;
}

function parseMembership(v: unknown): ClubMembershipStatus {
  const s = String(v || "").toLowerCase();
  if ((CLUB_MEMBERSHIP_STATUSES as readonly string[]).includes(s)) {
    return s as ClubMembershipStatus;
  }
  throw new Error("Membership status must be open, waitlist, or closed");
}

function parseCategory(v: unknown): ClubListingCategory {
  const s = String(v || "Other");
  if ((CLUB_LISTING_CATEGORIES as readonly string[]).includes(s)) {
    return s as ClubListingCategory;
  }
  return "Other";
}

function normalizeUrl(v?: string) {
  if (!v) return undefined;
  let u = v.trim();
  if (!u) return undefined;
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("bad");
    }
    return parsed.toString();
  } catch {
    throw new Error("Website must be a valid URL");
  }
}

export function listApprovedClubs(
  data: ClubListingsData = loadClubListings()
): ClubListing[] {
  return data.listings
    .filter((l) => l.status === "approved")
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getApprovedClubById(
  id: string,
  data: ClubListingsData = loadClubListings()
): ClubListing | null {
  const key = String(id || "").trim();
  if (!key) return null;
  return (
    data.listings.find((l) => l.status === "approved" && l.id === key) || null
  );
}

export function listApprovedClubsByCategory(
  category: ClubListingCategory,
  data: ClubListingsData = loadClubListings()
): ClubListing[] {
  return listApprovedClubs(data).filter((l) => l.category === category);
}

export function searchApprovedClubs(
  query: string,
  data: ClubListingsData = loadClubListings()
): ClubListing[] {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return [];
  return listApprovedClubs(data).filter((l) => {
    return (
      l.name.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q) ||
      l.leaderName.toLowerCase().includes(q) ||
      l.category.toLowerCase().includes(q)
    );
  });
}

export function clubCategoryCounts(
  data: ClubListingsData = loadClubListings()
): { category: ClubListingCategory; count: number }[] {
  const counts = new Map<ClubListingCategory, number>();
  for (const cat of CLUB_LISTING_CATEGORIES) counts.set(cat, 0);
  for (const l of listApprovedClubs(data)) {
    counts.set(l.category, (counts.get(l.category) || 0) + 1);
  }
  return CLUB_LISTING_CATEGORIES.map((category) => ({
    category,
    count: counts.get(category) || 0,
  })).filter((row) => row.count > 0);
}

export function listPendingClubs(
  data: ClubListingsData = loadClubListings()
): ClubListing[] {
  return data.listings
    .filter((l) => l.status === "pending")
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function submitClubListing(input: {
  name: string;
  category?: string;
  location: string;
  leaderName: string;
  website?: string;
  email?: string;
  phone?: string;
  description: string;
  membershipStatus: unknown;
  submittedByName?: string;
  /** Optional: update an existing approved listing (by id) */
  replacesId?: string;
}): Promise<ClubListing> {
  const data = await loadClubListingsAsync();
  const name = cleanText(input.name, 100, "Club name", 2);
  const location = cleanText(input.location, 120, "Location", 2);
  const leaderName = cleanText(input.leaderName, 80, "Leader name", 2);
  const description = cleanText(input.description, 800, "Description", 10);
  const membershipStatus = parseMembership(input.membershipStatus);
  const category = parseCategory(input.category);
  const email = optionalText(input.email, 120);
  const phone = optionalText(input.phone, 40);
  const website = normalizeUrl(optionalText(input.website, 200));
  const submittedByName = cleanText(
    input.submittedByName || leaderName,
    80,
    "Your name",
    2
  );

  if (!email && !phone && !website) {
    throw new Error("Please include at least one of: email, phone, or website");
  }

  let replacesId: string | undefined;
  const rid = String(input.replacesId || "").trim();
  if (rid) {
    const existing = data.listings.find(
      (l) => l.id === rid && l.status === "approved"
    );
    if (!existing) {
      throw new Error("That club listing was not found (or is not live yet)");
    }
    replacesId = existing.id;
  } else {
    // Soft match: same name as an approved club → treat as update
    const match = data.listings.find(
      (l) =>
        l.status === "approved" &&
        l.name.toLowerCase() === name.toLowerCase()
    );
    if (match) replacesId = match.id;
  }

  const now = new Date().toISOString();
  const listing: ClubListing = {
    id: uid("club"),
    name,
    category,
    location,
    leaderName,
    website,
    email,
    phone,
    description,
    membershipStatus,
    submittedByName,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    replacesId,
  };

  data.listings.unshift(listing);
  await saveClubListingsAsync(data);
  return listing;
}

export async function setClubListingStatus(
  id: string,
  status: ClubListingModStatus
): Promise<ClubListing> {
  const data = await loadClubListingsAsync();
  const idx = data.listings.findIndex((l) => l.id === id);
  if (idx < 0) throw new Error("Listing not found");

  const item = data.listings[idx];

  if (status === "approved") {
    const now = new Date().toISOString();
    // If replacing an older approved listing, retire the old one
    if (item.replacesId) {
      const oldIdx = data.listings.findIndex(
        (l) => l.id === item.replacesId && l.status === "approved"
      );
      if (oldIdx >= 0 && oldIdx !== idx) {
        data.listings[oldIdx] = {
          ...data.listings[oldIdx],
          status: "rejected",
          updatedAt: now,
        };
      }
    } else {
      // Also retire other approved with same name
      for (let i = 0; i < data.listings.length; i++) {
        if (
          i !== idx &&
          data.listings[i].status === "approved" &&
          data.listings[i].name.toLowerCase() === item.name.toLowerCase()
        ) {
          data.listings[i] = {
            ...data.listings[i],
            status: "rejected",
            updatedAt: now,
          };
        }
      }
    }

    data.listings[idx] = {
      ...item,
      status: "approved",
      approvedAt: now,
      updatedAt: now,
      replacesId: undefined,
    };
  } else {
    data.listings[idx] = {
      ...item,
      status,
      updatedAt: new Date().toISOString(),
    };
  }

  await saveClubListingsAsync(data);
  return data.listings[idx];
}

export async function deleteClubListing(id: string): Promise<void> {
  const data = await loadClubListingsAsync();
  const before = data.listings.length;
  data.listings = data.listings.filter((l) => l.id !== id);
  if (data.listings.length === before) throw new Error("Listing not found");
  await saveClubListingsAsync(data);
}
