import crypto from "crypto";
import fs from "fs";
import path from "path";
import {
  ensureDurableHydrated,
  isEphemeralHost,
  readJsonFile,
  saveUploadFile,
  writeJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import {
  AREA_SERVICE_CATEGORIES,
  LOCAL_SERVICE_CATEGORIES,
  categoriesForScope,
  listingScope,
  type AreaServiceCategory,
  type LocalProsDailyChampion,
  type LocalProsDailyLeaderboard,
  type LocalServiceCategory,
  type LocalServiceListing,
  type LocalServiceModStatus,
  type LocalServiceReview,
  type LocalServiceScope,
  type LocalServiceStats,
  type LocalServicesData,
} from "./localServicesTypes";

const FILE = "local-services.json";

function uid(prefix = "svc") {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

function emptyData(): LocalServicesData {
  return { listings: [], reviews: [], dailyLeaderboard: null, updatedAt: null };
}

/** Bundled git seed — used when durable Redis/Blob has an older empty copy. */
function readBundledLocalServicesSeed(): LocalServicesData | null {
  try {
    const p = path.join(process.cwd(), "data", FILE);
    if (!fs.existsSync(/*turbopackIgnore: true*/ p)) return null;
    const raw = JSON.parse(
      fs.readFileSync(/*turbopackIgnore: true*/ p, "utf8")
    ) as LocalServicesData;
    return {
      listings: Array.isArray(raw.listings) ? raw.listings : [],
      reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
      dailyLeaderboard: raw.dailyLeaderboard || null,
      updatedAt: raw.updatedAt || null,
    };
  } catch {
    return null;
  }
}

function listingDedupeKey(l: LocalServiceListing): string {
  return `${listingScope(l)}|${l.businessName}|${l.category}`.toLowerCase();
}

/**
 * Merge any seed listings missing from durable storage (by id + name/category).
 * Production often already has an empty local-services.json in Redis/Blob from
 * before Local Pros seeds shipped — without this, the page stays empty forever.
 */
async function mergeMissingSeedListings(
  data: LocalServicesData
): Promise<LocalServicesData> {
  const seed = readBundledLocalServicesSeed();
  if (!seed?.listings.length) return data;

  const byId = new Set(data.listings.map((l) => l.id));
  const byKey = new Set(data.listings.map(listingDedupeKey));
  const toAdd = seed.listings.filter((l) => {
    if (!l?.id || !l.businessName) return false;
    if (byId.has(l.id)) return false;
    return !byKey.has(listingDedupeKey(l));
  });
  if (!toAdd.length) return data;

  const merged: LocalServicesData = {
    ...data,
    listings: [...data.listings, ...toAdd],
    // Keep durable reviews/leaderboard; only backfill missing seed listings
    reviews: data.reviews,
    dailyLeaderboard: data.dailyLeaderboard,
  };

  // Persist so every serverless instance sees seeds after first request
  if (isEphemeralHost()) {
    try {
      await saveLocalServicesAsync(merged);
    } catch (err) {
      console.error("[localServices] seed merge save failed", err);
      // Still serve merged data this request
    }
  }
  return merged;
}

export function loadLocalServices(): LocalServicesData {
  const raw = readJsonFile<LocalServicesData>(FILE);
  if (!raw) return emptyData();
  return {
    listings: Array.isArray(raw.listings) ? raw.listings : [],
    reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
    dailyLeaderboard: raw.dailyLeaderboard || null,
    updatedAt: raw.updatedAt || null,
  };
}

export async function loadLocalServicesAsync(): Promise<LocalServicesData> {
  await ensureDurableHydrated();
  const data = loadLocalServices();
  return mergeMissingSeedListings(data);
}

export function saveLocalServices(data: LocalServicesData) {
  data.updatedAt = new Date().toISOString();
  writeJsonFile(FILE, data);
  return data;
}

export async function saveLocalServicesAsync(data: LocalServicesData) {
  data.updatedAt = new Date().toISOString();
  await writeJsonFileAsync(FILE, data);
  return data;
}

function cleanText(v: unknown, max: number, label: string, min = 1) {
  const t = String(v || "")
    .trim()
    .replace(/\s+/g, " ");
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

function parseScope(v: unknown): LocalServiceScope {
  return String(v || "").toLowerCase() === "area" ? "area" : "villager";
}

function parseCategory(
  v: unknown,
  scope: LocalServiceScope
): LocalServiceCategory {
  const s = String(v || "Other");
  const allowed = categoriesForScope(scope) as readonly string[];
  if (allowed.includes(s)) return s as LocalServiceCategory;
  // Tolerate legacy villager categories on area submissions → Other
  if (
    scope === "area" &&
    (LOCAL_SERVICE_CATEGORIES as readonly string[]).includes(s)
  ) {
    return "Other";
  }
  if (
    scope === "villager" &&
    (AREA_SERVICE_CATEGORIES as readonly string[]).includes(s)
  ) {
    return "Other";
  }
  return "Other";
}

function normalizeUrl(v?: string, label = "Website") {
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
    throw new Error(`${label} must be a valid URL`);
  }
}

function optionalPhotoUrl(v: unknown): string | undefined {
  const t = String(v || "").trim();
  if (!t) return undefined;
  if (t.length > 500) throw new Error("Photo URL is too long");
  // Only allow app media proxy or relative paths we control
  if (
    t.startsWith("/api/media/") ||
    t.startsWith("/uploads/") ||
    t.startsWith("/member-uploads/")
  )
    return t;
  if (t.startsWith("https://") && t.includes("blob.vercel-storage.com")) {
    return t;
  }
  throw new Error("Invalid photo URL — upload an image first");
}

/** Parse main + up to 2 extras (or a single photos[] array, first = main). */
function parsePhotos(input: {
  photoUrl?: unknown;
  extraPhotos?: unknown;
  photos?: unknown;
}): { photoUrl?: string; extraPhotos?: string[] } {
  // Prefer explicit photos[] if provided (max 3)
  if (Array.isArray(input.photos) && input.photos.length > 0) {
    const urls: string[] = [];
    for (const raw of input.photos) {
      const u = optionalPhotoUrl(raw);
      if (u && !urls.includes(u)) urls.push(u);
      if (urls.length >= 3) break;
    }
    if (urls.length === 0) return {};
    return {
      photoUrl: urls[0],
      extraPhotos: urls.slice(1).length ? urls.slice(1) : undefined,
    };
  }

  const photoUrl = optionalPhotoUrl(input.photoUrl);
  const extrasRaw = Array.isArray(input.extraPhotos) ? input.extraPhotos : [];
  const extraPhotos: string[] = [];
  for (const raw of extrasRaw) {
    const u = optionalPhotoUrl(raw);
    if (u && u !== photoUrl && !extraPhotos.includes(u)) extraPhotos.push(u);
    if (extraPhotos.length >= 2) break;
  }
  return {
    photoUrl,
    extraPhotos: extraPhotos.length ? extraPhotos : undefined,
  };
}

export function listApprovedServices(
  data: LocalServicesData = loadLocalServices(),
  scope?: LocalServiceScope
): LocalServiceListing[] {
  return data.listings
    .filter((l) => l.status === "approved")
    .filter((l) => (scope ? listingScope(l) === scope : true))
    .slice()
    .sort((a, b) => a.businessName.localeCompare(b.businessName));
}

export function listPendingServices(
  data: LocalServicesData = loadLocalServices(),
  scope?: LocalServiceScope
): LocalServiceListing[] {
  return data.listings
    .filter((l) => l.status === "pending")
    .filter((l) => (scope ? listingScope(l) === scope : true))
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function saveLocalServiceUpload(
  buffer: Buffer,
  filename: string,
  mime: string
): Promise<{ url: string }> {
  const lower = filename.toLowerCase();
  const mimeLower = (mime || "").toLowerCase();
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
    (!mimeLower && /\.(jpe?g|png|webp)$/i.test(lower));
  if (!isImage) {
    throw new Error("Only photo files are allowed (JPG, PNG, or WebP)");
  }

  let contentType = mimeLower || "image/jpeg";
  if (lower.endsWith(".png")) contentType = "image/png";
  else if (lower.endsWith(".webp")) contentType = "image/webp";
  else if (!contentType.startsWith("image/")) contentType = "image/jpeg";

  const safeName = `local-svc-${filename || "photo.jpg"}`;
  const { url } = await saveUploadFile(buffer, safeName, contentType);
  return { url };
}

export async function submitLocalService(input: {
  businessName: string;
  contactName: string;
  category?: string;
  description: string;
  village?: string;
  serviceArea?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  mapsUrl?: string;
  photoUrl?: string;
  extraPhotos?: string[];
  photos?: string[];
  submittedByName?: string;
  replacesId?: string;
  scope?: string;
}): Promise<LocalServiceListing> {
  const data = await loadLocalServicesAsync();
  const scope = parseScope(input.scope);
  const businessName = cleanText(input.businessName, 100, "Business name", 2);
  const contactName = cleanText(input.contactName, 80, "Contact name", 2);
  const description = cleanText(input.description, 800, "Description", 10);
  const category = parseCategory(input.category, scope);
  const village = optionalText(input.village, 80);
  const serviceArea = optionalText(input.serviceArea, 120);
  const address = optionalText(input.address, 200);
  const email = optionalText(input.email, 120);
  const phone = optionalText(input.phone, 40);
  const website = normalizeUrl(optionalText(input.website, 200));
  const mapsUrl = normalizeUrl(optionalText(input.mapsUrl, 400), "Maps link");
  const { photoUrl, extraPhotos } = parsePhotos(input);
  const submittedByName = cleanText(
    input.submittedByName || contactName,
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
      (l) =>
        l.id === rid &&
        l.status === "approved" &&
        listingScope(l) === scope
    );
    if (!existing) {
      throw new Error("That listing was not found (or is not live yet)");
    }
    replacesId = existing.id;
  } else {
    const match = data.listings.find(
      (l) =>
        l.status === "approved" &&
        listingScope(l) === scope &&
        l.businessName.toLowerCase() === businessName.toLowerCase() &&
        l.contactName.toLowerCase() === contactName.toLowerCase()
    );
    if (match) replacesId = match.id;
  }

  const now = new Date().toISOString();
  const listing: LocalServiceListing = {
    id: uid("svc"),
    scope,
    businessName,
    contactName,
    category,
    description,
    village,
    serviceArea,
    address,
    phone,
    email,
    website,
    mapsUrl,
    photoUrl,
    extraPhotos,
    submittedByName,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    replacesId,
  };

  data.listings.unshift(listing);
  await saveLocalServicesAsync(data);
  return listing;
}

export async function setLocalServiceStatus(
  id: string,
  status: LocalServiceModStatus
): Promise<LocalServiceListing> {
  const data = await loadLocalServicesAsync();
  const idx = data.listings.findIndex((l) => l.id === id);
  if (idx < 0) throw new Error("Listing not found");

  const item = data.listings[idx];

  if (status === "approved") {
    const now = new Date().toISOString();
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
      const itemScope = listingScope(item);
      for (let i = 0; i < data.listings.length; i++) {
        if (
          i !== idx &&
          data.listings[i].status === "approved" &&
          listingScope(data.listings[i]) === itemScope &&
          data.listings[i].businessName.toLowerCase() ===
            item.businessName.toLowerCase() &&
          data.listings[i].contactName.toLowerCase() ===
            item.contactName.toLowerCase()
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

  await saveLocalServicesAsync(data);
  return data.listings[idx];
}

/** Admin: edit fields on an existing listing (pending or live). */
export async function updateLocalService(
  id: string,
  input: {
    businessName?: string;
    contactName?: string;
    category?: string;
    description?: string;
    village?: string | null;
    serviceArea?: string | null;
    address?: string | null;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    mapsUrl?: string | null;
    photoUrl?: string | null;
    extraPhotos?: string[] | null;
    photos?: string[] | null;
    adminNote?: string | null;
  }
): Promise<LocalServiceListing> {
  const data = await loadLocalServicesAsync();
  const idx = data.listings.findIndex((l) => l.id === id);
  if (idx < 0) throw new Error("Listing not found");

  const cur = data.listings[idx];
  const businessName =
    input.businessName !== undefined
      ? cleanText(input.businessName, 100, "Business name", 2)
      : cur.businessName;
  const contactName =
    input.contactName !== undefined
      ? cleanText(input.contactName, 80, "Contact name", 2)
      : cur.contactName;
  const description =
    input.description !== undefined
      ? cleanText(input.description, 800, "Description", 10)
      : cur.description;
  const scope = listingScope(cur);
  const category =
    input.category !== undefined
      ? parseCategory(input.category, scope)
      : cur.category;

  let village = cur.village;
  if (input.village !== undefined) {
    village =
      input.village === null || input.village === ""
        ? undefined
        : optionalText(input.village, 80);
  }

  let serviceArea = cur.serviceArea;
  if (input.serviceArea !== undefined) {
    serviceArea =
      input.serviceArea === null || input.serviceArea === ""
        ? undefined
        : optionalText(input.serviceArea, 120);
  }

  let address = cur.address;
  if (input.address !== undefined) {
    address =
      input.address === null || input.address === ""
        ? undefined
        : optionalText(input.address, 200);
  }

  let mapsUrl = cur.mapsUrl;
  if (input.mapsUrl !== undefined) {
    mapsUrl =
      input.mapsUrl === null || input.mapsUrl === ""
        ? undefined
        : normalizeUrl(optionalText(input.mapsUrl, 400), "Maps link");
  }

  let phone = cur.phone;
  if (input.phone !== undefined) {
    phone =
      input.phone === null || input.phone === ""
        ? undefined
        : optionalText(input.phone, 40);
  }

  let email = cur.email;
  if (input.email !== undefined) {
    email =
      input.email === null || input.email === ""
        ? undefined
        : optionalText(input.email, 120);
  }

  let website = cur.website;
  if (input.website !== undefined) {
    website =
      input.website === null || input.website === ""
        ? undefined
        : normalizeUrl(optionalText(input.website, 200));
  }

  let photoUrl = cur.photoUrl;
  let extraPhotos = cur.extraPhotos;
  if (
    input.photos !== undefined ||
    input.photoUrl !== undefined ||
    input.extraPhotos !== undefined
  ) {
    const parsed = parsePhotos({
      photoUrl:
        input.photoUrl === null
          ? undefined
          : input.photoUrl !== undefined
            ? input.photoUrl
            : cur.photoUrl,
      extraPhotos:
        input.extraPhotos === null
          ? []
          : input.extraPhotos !== undefined
            ? input.extraPhotos
            : cur.extraPhotos,
      photos:
        input.photos === null
          ? []
          : input.photos !== undefined
            ? input.photos
            : undefined,
    });
    // Clearing all photos when empty arrays/nulls were sent
    if (
      (Array.isArray(input.photos) && input.photos.length === 0) ||
      input.photos === null ||
      (input.photoUrl === null &&
        (input.extraPhotos === null ||
          (Array.isArray(input.extraPhotos) && input.extraPhotos.length === 0)))
    ) {
      photoUrl = undefined;
      extraPhotos = undefined;
    } else {
      photoUrl = parsed.photoUrl;
      extraPhotos = parsed.extraPhotos;
    }
  }

  let adminNote = cur.adminNote;
  if (input.adminNote !== undefined) {
    adminNote =
      input.adminNote === null || input.adminNote === ""
        ? undefined
        : optionalText(input.adminNote, 400);
  }

  if (!email && !phone && !website) {
    throw new Error("Please keep at least one of: email, phone, or website");
  }

  data.listings[idx] = {
    ...cur,
    businessName,
    contactName,
    category,
    description,
    village,
    serviceArea,
    address,
    phone,
    email,
    website,
    mapsUrl,
    photoUrl,
    extraPhotos,
    adminNote,
    updatedAt: new Date().toISOString(),
  };

  await saveLocalServicesAsync(data);
  return data.listings[idx];
}

export async function deleteLocalService(id: string): Promise<void> {
  const data = await loadLocalServicesAsync();
  const before = data.listings.length;
  data.listings = data.listings.filter((l) => l.id !== id);
  if (data.listings.length === before) throw new Error("Listing not found");
  // Drop orphaned reviews
  data.reviews = (data.reviews || []).filter((r) => r.listingId !== id);
  await saveLocalServicesAsync(data);
}

// ─── Ratings / leaderboards (dining-style) ───────────────────────────

export function getVisibleServiceReviews(
  reviews: LocalServiceReview[] | undefined,
  listingId?: string
): LocalServiceReview[] {
  const list = (reviews || []).filter((r) => !r.hidden);
  if (!listingId) return list;
  return list.filter((r) => r.listingId === listingId);
}

export function computeServiceStats(
  listingId: string,
  reviews: LocalServiceReview[] | undefined
): LocalServiceStats {
  const list = getVisibleServiceReviews(reviews, listingId);
  const reviewCount = list.length;
  if (!reviewCount) return { reviewCount: 0, averageRating: 0 };
  const sum = list.reduce((s, r) => s + Math.min(5, Math.max(1, r.rating)), 0);
  return {
    reviewCount,
    averageRating: Math.round((sum / reviewCount) * 10) / 10,
  };
}

export type RankedLocalService = LocalServiceListing & {
  stats: LocalServiceStats;
  rank: number;
};

export function withServiceStats(
  listings: LocalServiceListing[],
  reviews: LocalServiceReview[] | undefined
): (LocalServiceListing & { stats: LocalServiceStats })[] {
  return listings.map((l) => ({
    ...l,
    stats: computeServiceStats(l.id, reviews),
  }));
}

/** Top N approved listings in a category (area or villager). */
export function topByServiceCategory(
  category: string,
  scope: LocalServiceScope,
  limit = 5,
  minReviews = 0,
  data: LocalServicesData = loadLocalServices()
): RankedLocalService[] {
  const ranked = withServiceStats(
    listApprovedServices(data, scope).filter((l) => l.category === category),
    data.reviews
  )
    .filter((l) => l.stats.reviewCount >= minReviews)
    .sort((a, b) => {
      if (b.stats.averageRating !== a.stats.averageRating) {
        return b.stats.averageRating - a.stats.averageRating;
      }
      if (b.stats.reviewCount !== a.stats.reviewCount) {
        return b.stats.reviewCount - a.stats.reviewCount;
      }
      return a.businessName.localeCompare(b.businessName);
    })
    .slice(0, limit);

  return ranked.map((l, i) => ({ ...l, rank: i + 1 }));
}

/** Boards for every category in the scope (area shows all trades with art). */
export function allCategoryLeaders(
  scope: LocalServiceScope,
  limit = 5,
  minReviews = 0,
  data: LocalServicesData = loadLocalServices()
): { category: string; leaders: RankedLocalService[] }[] {
  return categoriesForScope(scope).map((category) => ({
    category,
    leaders: topByServiceCategory(category, scope, limit, minReviews, data),
  }));
}

/** #1 in each category that has votes (for daily champion strip). */
export function computeCategoryChampions(
  scope: LocalServiceScope = "area",
  data: LocalServicesData = loadLocalServices()
): LocalProsDailyChampion[] {
  const champions: LocalProsDailyChampion[] = [];
  for (const category of categoriesForScope(scope)) {
    const leaders = topByServiceCategory(category, scope, 1, 1, data);
    if (leaders.length === 0) continue;
    const top = leaders[0];
    champions.push({
      category: category as AreaServiceCategory,
      listingId: top.id,
      businessName: top.businessName,
      contactName: top.contactName,
      averageRating: top.stats.averageRating,
      reviewCount: top.stats.reviewCount,
    });
  }
  return champions;
}

function todayKeyEastern(): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/**
 * Ensure daily champion snapshot is for today; recompute + persist if stale.
 * Safe to call from page renders / GET handlers.
 */
export async function ensureDailyLeaderboard(
  scope: LocalServiceScope = "area"
): Promise<LocalProsDailyLeaderboard> {
  const data = await loadLocalServicesAsync();
  const asOf = todayKeyEastern();
  if (
    data.dailyLeaderboard &&
    data.dailyLeaderboard.asOf === asOf &&
    Array.isArray(data.dailyLeaderboard.champions)
  ) {
    return data.dailyLeaderboard;
  }
  const board: LocalProsDailyLeaderboard = {
    asOf,
    updatedAt: new Date().toISOString(),
    champions: computeCategoryChampions(scope, data),
  };
  data.dailyLeaderboard = board;
  await saveLocalServicesAsync(data);
  return board;
}

export async function addLocalServiceReview(input: {
  listingId: string;
  authorName: string;
  rating: number;
  body?: string;
  authorMemberId?: string | null;
}): Promise<LocalServiceReview> {
  const data = await loadLocalServicesAsync();
  const listingId = String(input.listingId || "").trim();
  const listing = data.listings.find(
    (l) => l.id === listingId && l.status === "approved"
  );
  if (!listing) throw new Error("That listing is not available for ratings");

  const rating = Math.min(5, Math.max(1, Math.round(Number(input.rating) || 0)));
  if (rating < 1) throw new Error("Rating must be 1–5 stars");

  const authorName = cleanText(input.authorName, 80, "Your name", 2);
  const body = optionalText(input.body, 500);

  const review: LocalServiceReview = {
    id: uid("rev"),
    listingId,
    authorName,
    authorMemberId: input.authorMemberId || null,
    rating,
    body,
    createdAt: new Date().toISOString(),
  };

  if (!data.reviews) data.reviews = [];
  data.reviews.unshift(review);
  await saveLocalServicesAsync(data);
  return review;
}

export function listReviewsForListing(
  listingId: string,
  data: LocalServicesData = loadLocalServices()
): LocalServiceReview[] {
  return getVisibleServiceReviews(data.reviews, listingId).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}
