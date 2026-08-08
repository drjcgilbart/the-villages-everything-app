import crypto from "crypto";
import {
  ensureDurableHydrated,
  readJsonFile,
  saveUploadFile,
  writeJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import {
  LOCAL_SERVICE_CATEGORIES,
  type LocalServiceCategory,
  type LocalServiceListing,
  type LocalServiceModStatus,
  type LocalServicesData,
} from "./localServicesTypes";

const FILE = "local-services.json";

function uid(prefix = "svc") {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

function emptyData(): LocalServicesData {
  return { listings: [], updatedAt: null };
}

export function loadLocalServices(): LocalServicesData {
  const raw = readJsonFile<LocalServicesData>(FILE);
  if (!raw) return emptyData();
  return {
    listings: Array.isArray(raw.listings) ? raw.listings : [],
    updatedAt: raw.updatedAt || null,
  };
}

export async function loadLocalServicesAsync(): Promise<LocalServicesData> {
  await ensureDurableHydrated();
  return loadLocalServices();
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

function parseCategory(v: unknown): LocalServiceCategory {
  const s = String(v || "Other");
  if ((LOCAL_SERVICE_CATEGORIES as readonly string[]).includes(s)) {
    return s as LocalServiceCategory;
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

function optionalPhotoUrl(v: unknown): string | undefined {
  const t = String(v || "").trim();
  if (!t) return undefined;
  if (t.length > 500) throw new Error("Photo URL is too long");
  // Only allow app media proxy or relative paths we control
  if (t.startsWith("/api/media/") || t.startsWith("/uploads/")) return t;
  if (t.startsWith("https://") && t.includes("blob.vercel-storage.com")) {
    return t;
  }
  throw new Error("Invalid photo URL — upload an image first");
}

export function listApprovedServices(
  data: LocalServicesData = loadLocalServices()
): LocalServiceListing[] {
  return data.listings
    .filter((l) => l.status === "approved")
    .slice()
    .sort((a, b) => a.businessName.localeCompare(b.businessName));
}

export function listPendingServices(
  data: LocalServicesData = loadLocalServices()
): LocalServiceListing[] {
  return data.listings
    .filter((l) => l.status === "pending")
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
  phone?: string;
  email?: string;
  website?: string;
  photoUrl?: string;
  submittedByName?: string;
  replacesId?: string;
}): Promise<LocalServiceListing> {
  const data = await loadLocalServicesAsync();
  const businessName = cleanText(input.businessName, 100, "Business name", 2);
  const contactName = cleanText(input.contactName, 80, "Contact name", 2);
  const description = cleanText(input.description, 800, "Description", 10);
  const category = parseCategory(input.category);
  const village = optionalText(input.village, 80);
  const email = optionalText(input.email, 120);
  const phone = optionalText(input.phone, 40);
  const website = normalizeUrl(optionalText(input.website, 200));
  const photoUrl = optionalPhotoUrl(input.photoUrl);
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
      (l) => l.id === rid && l.status === "approved"
    );
    if (!existing) {
      throw new Error("That listing was not found (or is not live yet)");
    }
    replacesId = existing.id;
  } else {
    const match = data.listings.find(
      (l) =>
        l.status === "approved" &&
        l.businessName.toLowerCase() === businessName.toLowerCase() &&
        l.contactName.toLowerCase() === contactName.toLowerCase()
    );
    if (match) replacesId = match.id;
  }

  const now = new Date().toISOString();
  const listing: LocalServiceListing = {
    id: uid("svc"),
    businessName,
    contactName,
    category,
    description,
    village,
    phone,
    email,
    website,
    photoUrl,
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
      for (let i = 0; i < data.listings.length; i++) {
        if (
          i !== idx &&
          data.listings[i].status === "approved" &&
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
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    photoUrl?: string | null;
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
  const category =
    input.category !== undefined ? parseCategory(input.category) : cur.category;

  let village = cur.village;
  if (input.village !== undefined) {
    village =
      input.village === null || input.village === ""
        ? undefined
        : optionalText(input.village, 80);
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
  if (input.photoUrl !== undefined) {
    photoUrl =
      input.photoUrl === null || input.photoUrl === ""
        ? undefined
        : optionalPhotoUrl(input.photoUrl);
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
    phone,
    email,
    website,
    photoUrl,
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
  await saveLocalServicesAsync(data);
}
