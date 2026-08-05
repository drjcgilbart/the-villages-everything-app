import fs from "fs";
import path from "path";
import crypto from "crypto";
import type {
  ItemCondition,
  ListingStatus,
  Member,
  MemberStatus,
  MeetupType,
  PublicMember,
  YardListing,
  YardSaleData,
} from "./yardSaleTypes";

const DATA_DIR = path.join(process.cwd(), "data");
const YARD_PATH = path.join(DATA_DIR, "yard-sale.json");
const UPLOADS_DIR = path.join(DATA_DIR, "uploads");

const MAX_IMAGES = 5;
const MAX_VIDEO_BYTES = 40 * 1024 * 1024;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = String(stored || "").split(":");
  if (!salt || !hash) return false;
  const next = crypto.scryptSync(password, salt, 64).toString("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(next, "hex"));
  } catch {
    return false;
  }
}

export function toPublicMember(m: Member): PublicMember {
  return {
    id: m.id,
    name: m.name,
    email: m.email,
    phone: m.phone,
    village: m.village,
    status: m.status,
    createdAt: m.createdAt,
  };
}

function emptyData(): YardSaleData {
  return { members: [], listings: [], updatedAt: null };
}

export function loadYardSale(): YardSaleData {
  ensureDirs();
  if (!fs.existsSync(YARD_PATH)) {
    const seed = emptyData();
    seed.updatedAt = new Date().toISOString();
    fs.writeFileSync(YARD_PATH, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
  try {
    const raw = JSON.parse(fs.readFileSync(YARD_PATH, "utf8")) as YardSaleData;
    return {
      members: Array.isArray(raw.members) ? raw.members : [],
      listings: Array.isArray(raw.listings) ? raw.listings : [],
      updatedAt: raw.updatedAt || null,
    };
  } catch {
    return emptyData();
  }
}

export function saveYardSale(data: YardSaleData) {
  ensureDirs();
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(YARD_PATH, JSON.stringify(data, null, 2), "utf8");
  return data;
}

// ——— Members ———

export function registerMember(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  village?: string;
}) {
  const name = String(input.name || "").trim().slice(0, 80);
  const email = String(input.email || "").trim().toLowerCase().slice(0, 120);
  const password = String(input.password || "");
  if (!name) throw new Error("Name is required");
  if (!email || !email.includes("@")) throw new Error("Valid email is required");
  if (password.length < 6) throw new Error("Password must be at least 6 characters");

  const data = loadYardSale();
  if (data.members.some((m) => m.email === email)) {
    throw new Error("An account with this email already exists");
  }

  const member: Member = {
    id: uid("mem"),
    name,
    email,
    passwordHash: hashPassword(password),
    phone: String(input.phone || "").trim().slice(0, 40) || undefined,
    village: String(input.village || "").trim().slice(0, 80) || undefined,
    status: "pending",
    createdAt: new Date().toISOString(),
    approvedAt: null,
  };
  data.members.push(member);
  saveYardSale(data);
  return toPublicMember(member);
}

export function authenticateMember(email: string, password: string) {
  const data = loadYardSale();
  const member = data.members.find(
    (m) => m.email === String(email || "").trim().toLowerCase()
  );
  if (!member || !verifyPassword(password, member.passwordHash)) {
    throw new Error("Invalid email or password");
  }
  if (member.status === "rejected") {
    throw new Error("This membership request was not approved");
  }
  if (member.status === "suspended") {
    throw new Error("This account is suspended. Contact the site admin.");
  }
  return member;
}

export function getMemberById(id: string) {
  return loadYardSale().members.find((m) => m.id === id) || null;
}

export function listMembers() {
  return loadYardSale().members.map(toPublicMember).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
}

export function setMemberStatus(id: string, status: MemberStatus, notes?: string) {
  const data = loadYardSale();
  const idx = data.members.findIndex((m) => m.id === id);
  if (idx < 0) throw new Error("Member not found");
  data.members[idx] = {
    ...data.members[idx],
    status,
    notes: notes !== undefined ? String(notes).slice(0, 500) : data.members[idx].notes,
    approvedAt:
      status === "approved" ? new Date().toISOString() : data.members[idx].approvedAt,
  };
  saveYardSale(data);
  return toPublicMember(data.members[idx]);
}

// ——— Listings ———

function clampImages(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .map((u) => String(u || "").trim())
    .filter(Boolean)
    .slice(0, MAX_IMAGES);
}

export function createListing(
  memberId: string,
  input: {
    title: string;
    description: string;
    price?: number | null;
    isFree?: boolean;
    condition?: ItemCondition;
    category?: string;
    meetupType?: MeetupType;
    meetupNotes?: string;
    contactMethod?: "email" | "phone" | "either";
    images?: string[];
    videoUrl?: string | null;
  }
) {
  const member = getMemberById(memberId);
  if (!member) throw new Error("Member not found");
  if (member.status !== "approved") {
    throw new Error("Only approved members can post listings");
  }

  const title = String(input.title || "").trim().slice(0, 120);
  const description = String(input.description || "").trim().slice(0, 3000);
  if (!title) throw new Error("Title is required");
  if (!description) throw new Error("Description is required");

  const images = clampImages(input.images);
  if (!images.length) throw new Error("Add at least one photo (up to 5)");

  const isFree = !!input.isFree || input.price === 0 || input.price === null;
  let price: number | null = isFree ? 0 : Number(input.price);
  if (!isFree && (!Number.isFinite(price) || price! < 0)) {
    throw new Error("Enter a valid price, or mark as free");
  }

  const now = new Date().toISOString();
  const listing: YardListing = {
    id: uid("list"),
    memberId,
    title,
    description,
    price: isFree ? 0 : price,
    isFree,
    condition: input.condition || "good",
    category: String(input.category || "Other").slice(0, 60),
    meetupType: input.meetupType || "message_to_arrange",
    meetupNotes: String(input.meetupNotes || "").trim().slice(0, 300) || undefined,
    contactMethod: input.contactMethod || "either",
    images,
    videoUrl: input.videoUrl ? String(input.videoUrl).slice(0, 300) : null,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    approvedAt: null,
  };

  const data = loadYardSale();
  data.listings.unshift(listing);
  saveYardSale(data);
  return listing;
}

export function updateListing(
  listingId: string,
  memberId: string,
  input: Partial<YardListing> & { isAdmin?: boolean }
) {
  const data = loadYardSale();
  const idx = data.listings.findIndex((l) => l.id === listingId);
  if (idx < 0) throw new Error("Listing not found");
  const prev = data.listings[idx];
  if (!input.isAdmin && prev.memberId !== memberId) {
    throw new Error("Not your listing");
  }

  const images = input.images !== undefined ? clampImages(input.images) : prev.images;
  if (!images.length) throw new Error("At least one photo is required");

  let isFree = input.isFree !== undefined ? !!input.isFree : prev.isFree;
  let price = prev.price;
  if (input.price !== undefined || input.isFree !== undefined) {
    isFree = !!input.isFree || input.price === 0 || input.price === null;
    price = isFree ? 0 : Number(input.price);
    if (!isFree && (!Number.isFinite(price) || (price as number) < 0)) {
      throw new Error("Invalid price");
    }
  }

  // Member edits re-submit for approval unless admin (except mark sold)
  let status = prev.status;
  if (input.status === "sold" || (input as { markSold?: boolean }).markSold) {
    status = "sold";
  } else if (!input.isAdmin && prev.status === "approved" && input.title) {
    // Content edit by member → back to pending
    status = "pending";
  } else if (input.isAdmin && input.status) {
    status = input.status;
  }

  const next: YardListing = {
    ...prev,
    title: input.title !== undefined ? String(input.title).trim().slice(0, 120) : prev.title,
    description:
      input.description !== undefined
        ? String(input.description).trim().slice(0, 3000)
        : prev.description,
    price: isFree ? 0 : (price as number),
    isFree,
    condition: input.condition || prev.condition,
    category: input.category !== undefined ? String(input.category).slice(0, 60) : prev.category,
    meetupType: input.meetupType || prev.meetupType,
    meetupNotes:
      input.meetupNotes !== undefined
        ? String(input.meetupNotes || "").trim().slice(0, 300) || undefined
        : prev.meetupNotes,
    contactMethod: input.contactMethod || prev.contactMethod,
    images,
    videoUrl:
      input.videoUrl !== undefined
        ? input.videoUrl
          ? String(input.videoUrl).slice(0, 300)
          : null
        : prev.videoUrl,
    status,
    adminNote:
      input.adminNote !== undefined
        ? String(input.adminNote || "").slice(0, 500)
        : prev.adminNote,
    updatedAt: new Date().toISOString(),
    approvedAt:
      status === "approved" && prev.status !== "approved"
        ? new Date().toISOString()
        : status === "approved"
          ? prev.approvedAt
          : prev.approvedAt,
    soldAt: status === "sold" ? new Date().toISOString() : prev.soldAt,
  };

  data.listings[idx] = next;
  saveYardSale(data);
  return next;
}

export function setListingStatus(
  listingId: string,
  status: ListingStatus,
  adminNote?: string
) {
  const data = loadYardSale();
  const idx = data.listings.findIndex((l) => l.id === listingId);
  if (idx < 0) throw new Error("Listing not found");
  data.listings[idx] = {
    ...data.listings[idx],
    status,
    adminNote:
      adminNote !== undefined
        ? String(adminNote).slice(0, 500)
        : data.listings[idx].adminNote,
    updatedAt: new Date().toISOString(),
    approvedAt:
      status === "approved" ? new Date().toISOString() : data.listings[idx].approvedAt,
    soldAt: status === "sold" ? new Date().toISOString() : data.listings[idx].soldAt,
  };
  saveYardSale(data);
  return data.listings[idx];
}

export function deleteListing(listingId: string, memberId?: string, isAdmin = false) {
  const data = loadYardSale();
  const listing = data.listings.find((l) => l.id === listingId);
  if (!listing) throw new Error("Listing not found");
  if (!isAdmin && listing.memberId !== memberId) {
    throw new Error("Not your listing");
  }
  data.listings = data.listings.filter((l) => l.id !== listingId);
  saveYardSale(data);
  return { ok: true };
}

export function getApprovedListings() {
  return loadYardSale()
    .listings.filter((l) => l.status === "approved")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getListingById(id: string) {
  return loadYardSale().listings.find((l) => l.id === id) || null;
}

export function getListingsByMember(memberId: string) {
  return loadYardSale()
    .listings.filter((l) => l.memberId === memberId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listAllListings() {
  return loadYardSale().listings.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function listingWithSeller(listing: YardListing) {
  const member = getMemberById(listing.memberId);
  return {
    ...listing,
    seller: member
      ? {
          id: member.id,
          name: member.name,
          village: member.village,
          // Contact only exposed for approved live listings
          email:
            listing.status === "approved" &&
            (listing.contactMethod === "email" || listing.contactMethod === "either")
              ? member.email
              : undefined,
          phone:
            listing.status === "approved" &&
            (listing.contactMethod === "phone" || listing.contactMethod === "either")
              ? member.phone
              : undefined,
        }
      : null,
  };
}

export function saveYardUpload(buffer: Buffer, filename: string) {
  ensureDirs();
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80);
  const name = `${Date.now().toString(36)}-${safe}`;
  const full = path.join(UPLOADS_DIR, name);
  fs.writeFileSync(full, buffer);
  return `/api/media/${name}`;
}

export { MAX_IMAGES, MAX_VIDEO_BYTES, MAX_IMAGE_BYTES, YARD_PATH };
