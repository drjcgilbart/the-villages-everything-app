import fs from "fs";
import path from "path";
import crypto from "crypto";
import {
  BUNDLE_DATA_DIR,
  cacheDurableJson,
  ensureDurableHydrated,
  pullDurableJson,
  readJsonFile,
  saveUploadFile,
  writeJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import {
  LISTING_MAX_REFRESHES,
  contactChoiceError,
  contactMethodFromChoices,
  listingActivityAt,
  normalizeContactBy,
  resolveContactBy,
  type ContactBy,
  type ItemCondition,
  type ListingStatus,
  type Member,
  type MemberStatus,
  type MeetupType,
  type PublicMember,
  type YardListing,
  type YardSaleData,
} from "./yardSaleTypes";

const YARD_FILE = "yard-sale.json";
/** @deprecated path kept for exports/debug — runtime writes use dataFs */
const YARD_PATH = path.join(BUNDLE_DATA_DIR, YARD_FILE);

const MAX_IMAGES = 3;
const MAX_VIDEO_BYTES = 20 * 1024 * 1024;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;

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
  const raw = readJsonFile<YardSaleData>(YARD_FILE);
  if (!raw) return emptyData();
  return {
    members: Array.isArray(raw.members) ? raw.members : [],
    listings: Array.isArray(raw.listings) ? raw.listings : [],
    updatedAt: raw.updatedAt || null,
  };
}

/** Pull Redis/Blob into memory before a member write so we don't save a stale seed. */
export async function hydrateYardSale() {
  await ensureDurableHydrated();
  try {
    const text = await pullDurableJson(YARD_FILE);
    if (text) cacheDurableJson(YARD_FILE, text);
  } catch (err) {
    console.error("[yard-sale] durable pull failed", err);
  }
}

export function saveYardSale(data: YardSaleData) {
  data.updatedAt = new Date().toISOString();
  try {
    writeJsonFile(YARD_FILE, data);
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Could not save membership data on this host"
    );
  }
  return data;
}

export async function saveYardSaleAsync(data: YardSaleData) {
  data.updatedAt = new Date().toISOString();
  try {
    await writeJsonFileAsync(YARD_FILE, data);
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Could not save membership data on this host"
    );
  }
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
  if (password.length < 8) throw new Error("Password must be at least 8 characters");

  const data = loadYardSale();
  const existing = data.members.find((m) => m.email === email);
  if (existing) {
    // Pending requests can re-submit with a new password (forgot password / re-test).
    // Only pending — never overwrite approved/suspended credentials this way.
    if (existing.status === "pending") {
      const idx = data.members.findIndex((m) => m.id === existing.id);
      data.members[idx] = {
        ...existing,
        name,
        passwordHash: hashPassword(password),
        phone: String(input.phone || "").trim().slice(0, 40) || existing.phone,
        village:
          String(input.village || "").trim().slice(0, 80) || existing.village,
        // keep pending + original createdAt
      };
      saveYardSale(data);
      return toPublicMember(data.members[idx]);
    }
    throw new Error(
      "An account with this email already exists. Sign in with your password, or ask the site host to reset it in Studio."
    );
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

/** Admin: create an approved login. Does not touch an email that is already on the list. */
export function addApprovedMember(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  village?: string;
  notes?: string;
}) {
  const name = String(input.name || "").trim().slice(0, 80);
  const email = String(input.email || "").trim().toLowerCase().slice(0, 120);
  const password = String(input.password || "");
  if (!name) throw new Error("Name is required");
  if (!email || !email.includes("@")) throw new Error("Valid email is required");
  if (password.length < 8) throw new Error("Password must be at least 8 characters");

  const data = loadYardSale();
  const existing = data.members.find((m) => m.email === email);
  if (existing) {
    throw new Error(
      existing.status === "pending"
        ? "That email is already a sign-up request. Approve it in the list below."
        : "That email is already a member. Use Edit details on the existing account."
    );
  }

  const now = new Date().toISOString();
  const notes = String(input.notes || "").trim().slice(0, 500);
  const member: Member = {
    id: uid("mem"),
    name,
    email,
    passwordHash: hashPassword(password),
    phone: String(input.phone || "").trim().slice(0, 40) || undefined,
    village: String(input.village || "").trim().slice(0, 80) || undefined,
    notes: notes || undefined,
    status: "approved",
    createdAt: now,
    approvedAt: now,
  };
  data.members.push(member);
  saveYardSale(data);
  return member;
}

export function authenticateMember(email: string, password: string) {
  const data = loadYardSale();
  const member = data.members.find(
    (m) => m.email === String(email || "").trim().toLowerCase()
  );
  if (!member || !verifyPassword(password, member.passwordHash)) {
    throw new Error(
      "Invalid email or password. If you just re-requested membership while still pending, use the newest password you submitted — or re-submit the membership form to set a new one."
    );
  }
  if (member.status === "rejected") {
    throw new Error("This membership request was not approved");
  }
  if (member.status === "suspended") {
    throw new Error("This account is suspended. Contact the site admin.");
  }
  return member;
}

/** Admin-only: set a known password for a member (beta / support). */
export function setMemberPassword(id: string, password: string) {
  const next = String(password || "");
  if (next.length < 8) throw new Error("Password must be at least 8 characters");
  const data = loadYardSale();
  const idx = data.members.findIndex((m) => m.id === id);
  if (idx < 0) throw new Error("Member not found");
  data.members[idx] = {
    ...data.members[idx],
    passwordHash: hashPassword(next),
  };
  saveYardSale(data);
  return toPublicMember(data.members[idx]);
}

/** Signed-in member: replace password after verifying the current one. */
export function changeOwnPassword(
  id: string,
  currentPassword: string,
  newPassword: string
) {
  const next = String(newPassword || "");
  if (next.length < 8) throw new Error("New password must be at least 8 characters");
  if (next === String(currentPassword || "")) {
    throw new Error("New password must be different from the current password");
  }
  const data = loadYardSale();
  const idx = data.members.findIndex((m) => m.id === id);
  if (idx < 0) throw new Error("Member not found");
  if (!verifyPassword(String(currentPassword || ""), data.members[idx].passwordHash)) {
    throw new Error("Current password is incorrect");
  }
  data.members[idx] = {
    ...data.members[idx],
    passwordHash: hashPassword(next),
  };
  saveYardSale(data);
  return toPublicMember(data.members[idx]);
}

export function updateMemberDetails(
  id: string,
  input: {
    name?: string;
    email?: string;
    phone?: string;
    village?: string;
    notes?: string;
    password?: string;
  }
) {
  const data = loadYardSale();
  const idx = data.members.findIndex((m) => m.id === id);
  if (idx < 0) throw new Error("Member not found");
  const prev = data.members[idx];
  const name = input.name !== undefined ? String(input.name).trim().slice(0, 80) : prev.name;
  const email =
    input.email !== undefined
      ? String(input.email).trim().toLowerCase().slice(0, 120)
      : prev.email;
  if (!name) throw new Error("Name is required");
  if (!email || !email.includes("@")) throw new Error("Valid email is required");
  const clash = data.members.find((m) => m.email === email && m.id !== id);
  if (clash) throw new Error("Another member already uses that email");
  const password = String(input.password || "");
  if (password && password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  data.members[idx] = {
    ...prev,
    name,
    email,
    phone:
      input.phone !== undefined
        ? String(input.phone).trim().slice(0, 40) || undefined
        : prev.phone,
    village:
      input.village !== undefined
        ? String(input.village).trim().slice(0, 80) || undefined
        : prev.village,
    notes:
      input.notes !== undefined ? String(input.notes).trim().slice(0, 500) : prev.notes,
    passwordHash: password ? hashPassword(password) : prev.passwordHash,
  };
  saveYardSale(data);
  return data.members[idx];
}

export function getMemberById(id: string) {
  return loadYardSale().members.find((m) => m.id === id) || null;
}

export function getMemberByEmail(email: string) {
  const e = String(email || "").trim().toLowerCase();
  if (!e) return null;
  return loadYardSale().members.find((m) => m.email === e) || null;
}

/**
 * Create or approve a site-owner Hub account. Does not set a password unless
 * creating a new record (caller already verified the password).
 */
export function ensureApprovedOwnerMember(
  email: string,
  passwordIfCreating?: string
): Member {
  const e = String(email || "").trim().toLowerCase();
  if (!e || !e.includes("@")) throw new Error("Valid email is required");
  const data = loadYardSale();
  const now = new Date().toISOString();
  const idx = data.members.findIndex((m) => m.email === e);
  if (idx < 0) {
    const pw = String(passwordIfCreating || "");
    if (pw.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    const local = e.split("@")[0] || "Owner";
    const member: Member = {
      id: uid("mem"),
      name:
        /gilbart|jonathan/i.test(e) ? "Jonathan Gilbart" : local,
      email: e,
      passwordHash: hashPassword(pw),
      status: "approved",
      createdAt: now,
      approvedAt: now,
      notes: "Site owner",
    };
    data.members.push(member);
    saveYardSale(data);
    return member;
  }
  const existing = data.members[idx];
  if (existing.status === "rejected" || existing.status === "suspended") {
    throw new Error("This account is suspended. Contact the site admin.");
  }
  data.members[idx] = {
    ...existing,
    status: "approved",
    approvedAt: existing.approvedAt || now,
    notes: existing.notes || "Site owner",
  };
  saveYardSale(data);
  return data.members[idx];
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

export function getAdminLog(id: string): { at: string; text: string }[] {
  const m = getMemberById(id);
  return Array.isArray(m?.adminLog) ? m!.adminLog : [];
}

export function appendAdminLog(id: string, text: string) {
  const data = loadYardSale();
  const idx = data.members.findIndex((m) => m.id === id);
  if (idx < 0) return;
  const entry = {
    at: new Date().toISOString(),
    text: String(text || "").trim().slice(0, 280),
  };
  if (!entry.text) return;
  const prev = Array.isArray(data.members[idx].adminLog)
    ? data.members[idx].adminLog!
    : [];
  data.members[idx] = {
    ...data.members[idx],
    adminLog: [...prev, entry].slice(-60),
  };
  saveYardSale(data);
}

// ——— Listings ———

function clampImages(images: unknown): string[] {
  if (!Array.isArray(images)) return [];
  return images
    .map((u) => String(u || "").trim())
    .filter(Boolean)
    .slice(0, MAX_IMAGES);
}

function filledText(value: unknown, max = 120) {
  return String(value ?? "").trim().slice(0, max);
}

function sameSellerName(a: string, b: string) {
  return a.trim().toLowerCase() === b.trim().toLowerCase() && a.trim().length > 0;
}

/** Form fields win. The signed-in member fills a blank only when the listing is theirs. */
export function sellerFieldsForListing(
  input: {
    sellerName?: string | null;
    sellerEmail?: string | null;
    sellerPhone?: string | null;
    sellerVillage?: string | null;
  },
  member: { id?: string; name?: string; email?: string; phone?: string; village?: string } | null
) {
  const typedName = filledText(input.sellerName, 80);
  const ownListing =
    !!member?.id && !!member.name && (!typedName || sameSellerName(typedName, member.name));
  const sellerName = typedName || filledText(member?.name, 80);
  const sellerEmail =
    filledText(input.sellerEmail, 120) || (ownListing ? filledText(member?.email, 120) : "");
  const sellerPhone =
    filledText(input.sellerPhone, 40) || (ownListing ? filledText(member?.phone, 40) : "");
  const sellerVillage =
    filledText(input.sellerVillage, 80) ||
    (ownListing ? filledText(member?.village, 80) : "");
  return {
    sellerName,
    sellerEmail: sellerEmail || undefined,
    sellerPhone: sellerPhone || undefined,
    sellerVillage: sellerVillage || undefined,
    memberIdForBadges: ownListing ? member?.id : undefined,
  };
}

export function createListing(
  memberId: string | null,
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
    contactBy?: Partial<ContactBy> | null;
    images?: string[];
    videoUrl?: string | null;
    sellerName?: string;
    sellerEmail?: string;
    sellerPhone?: string;
    sellerVillage?: string;
  }
) {
  const member = memberId ? getMemberById(memberId) : null;
  if (memberId && !member) throw new Error("Member not found");
  if (member && member.status !== "approved") {
    throw new Error("Your membership is not active yet");
  }

  const seller = sellerFieldsForListing(input, member);
  const sellerName = seller.sellerName;
  const sellerEmail = seller.sellerEmail || "";
  const sellerPhone = seller.sellerPhone || "";
  const sellerVillage = seller.sellerVillage || "";
  if (!sellerName) throw new Error("Your name is required");
  const contactBy = normalizeContactBy(input.contactBy);
  const contactProblem = contactChoiceError(contactBy, sellerEmail, sellerPhone);
  if (contactProblem) throw new Error(contactProblem);

  const title = String(input.title || "").trim().slice(0, 120);
  const description = String(input.description || "").trim().slice(0, 3000);
  if (!title) throw new Error("Title is required");
  if (!description) throw new Error("Description is required");

  const images = clampImages(input.images);
  if (!images.length) throw new Error("Add at least one photo (up to 3)");

  const isFree = !!input.isFree || input.price === 0 || input.price === null;
  let price: number | null = isFree ? 0 : Number(input.price);
  if (!isFree && (!Number.isFinite(price) || price! < 0)) {
    throw new Error("Enter a valid price, or mark as free");
  }

  const now = new Date().toISOString();
  const listing: YardListing = {
    id: uid("list"),
    memberId: member?.id || "",
    submittedByName: member?.name ? filledText(member.name, 80) : undefined,
    sellerName,
    sellerEmail: sellerEmail || undefined,
    sellerPhone: sellerPhone || undefined,
    sellerVillage: sellerVillage || undefined,
    title,
    description,
    price: isFree ? 0 : price,
    isFree,
    condition: input.condition || "good",
    category: String(input.category || "Other").slice(0, 60),
    meetupType: input.meetupType || "message_to_arrange",
    meetupNotes: String(input.meetupNotes || "").trim().slice(0, 300) || undefined,
    contactMethod: contactMethodFromChoices(contactBy),
    contactBy,
    images,
    videoUrl: input.videoUrl ? String(input.videoUrl).slice(0, 300) : null,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    approvedAt: null,
    refreshCount: 0,
    lastActiveAt: null,
    reminderSentFor: null,
  };

  const data = loadYardSale();
  data.listings.unshift(listing);
  saveYardSale(data);
  return listing;
}

export type ManageActor = {
  memberId?: string | null;
  memberEmail?: string | null;
  isAdmin: boolean;
};

export type ListingAction = "archive" | "refresh" | "remove";

/** The member who posted the listing, or an admin. A guest post matches a later login by seller email. */
export function actorCanManageListing(listing: YardListing, actor: ManageActor) {
  if (actor.isAdmin) return true;
  const memberId = actor.memberId || "";
  if (!memberId) return false;
  if (listing.memberId && listing.memberId === memberId) return true;
  if (!listing.memberId && listing.sellerEmail && actor.memberEmail) {
    return (
      listing.sellerEmail.trim().toLowerCase() ===
      actor.memberEmail.trim().toLowerCase()
    );
  }
  return false;
}

function byActivityDesc(a: YardListing, b: YardListing) {
  return listingActivityAt(b).localeCompare(listingActivityAt(a));
}

export function updateListing(
  listingId: string,
  memberId: string,
  input: Partial<YardListing> & { isAdmin?: boolean; actorEmail?: string }
) {
  const data = loadYardSale();
  const idx = data.listings.findIndex((l) => l.id === listingId);
  if (idx < 0) throw new Error("Listing not found");
  const prev = data.listings[idx];
  if (
    !input.isAdmin &&
    !actorCanManageListing(prev, {
      memberId,
      memberEmail: input.actorEmail,
      isAdmin: false,
    })
  ) {
    throw new Error("Not your listing");
  }
  if (!input.isAdmin && prev.status === "removed") {
    throw new Error("This listing was removed");
  }

  const images = input.images !== undefined ? clampImages(input.images) : prev.images;
  if (!images.length) throw new Error("At least one photo is required");
  if (input.sellerName !== undefined && !filledText(input.sellerName, 80)) {
    throw new Error("Seller name is required");
  }

  const nextEmail =
    input.sellerEmail !== undefined
      ? filledText(input.sellerEmail, 120)
      : prev.sellerEmail || "";
  const nextPhone =
    input.sellerPhone !== undefined
      ? filledText(input.sellerPhone, 40)
      : prev.sellerPhone || "";
  let contactBy = prev.contactBy;
  let contactMethod = prev.contactMethod;
  const contactIsInThisEdit =
    input.contactBy != null ||
    input.contactMethod != null ||
    input.sellerEmail !== undefined ||
    input.sellerPhone !== undefined;
  if (contactIsInThisEdit) {
    const choices =
      input.contactBy != null
        ? normalizeContactBy(input.contactBy)
        : resolveContactBy({
            contactBy: prev.contactBy,
            contactMethod: input.contactMethod || prev.contactMethod,
          });
    const contactProblem = contactChoiceError(choices, nextEmail, nextPhone);
    if (contactProblem) throw new Error(contactProblem);
    contactBy = choices;
    contactMethod = contactMethodFromChoices(choices);
  }

  let isFree = input.isFree !== undefined ? !!input.isFree : prev.isFree;
  let price = prev.price;
  if (input.price !== undefined || input.isFree !== undefined) {
    isFree = !!input.isFree || input.price === 0 || input.price === null;
    price = isFree ? 0 : Number(input.price);
    if (!isFree && (!Number.isFinite(price) || (price as number) < 0)) {
      throw new Error("Invalid price");
    }
  }

  // A live listing stays live when the owner edits it. A rejected listing goes back to review.
  let status = prev.status;
  if ((input as { markSold?: boolean }).markSold) {
    status = "sold";
  } else if (!input.isAdmin && prev.status === "rejected") {
    status = "pending";
  } else if (input.isAdmin && input.status) {
    status = input.status;
  }

  const now = new Date().toISOString();
  const becomingLive = status === "approved" && prev.status !== "approved";
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
    contactMethod,
    contactBy,
    sellerName:
      input.sellerName !== undefined
        ? filledText(input.sellerName, 80)
        : prev.sellerName,
    sellerEmail:
      input.sellerEmail !== undefined
        ? filledText(input.sellerEmail, 120) || undefined
        : prev.sellerEmail,
    sellerPhone:
      input.sellerPhone !== undefined
        ? filledText(input.sellerPhone, 40) || undefined
        : prev.sellerPhone,
    sellerVillage:
      input.sellerVillage !== undefined
        ? filledText(input.sellerVillage, 80) || undefined
        : prev.sellerVillage,
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
    updatedAt: now,
    approvedAt: becomingLive ? now : prev.approvedAt,
    lastActiveAt: becomingLive ? now : prev.lastActiveAt,
    reminderSentFor: becomingLive ? null : prev.reminderSentFor,
    refreshCount: prev.refreshCount || 0,
    soldAt: status === "sold" ? now : prev.soldAt,
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
  const prev = data.listings[idx];
  const now = new Date().toISOString();
  const becomingLive = status === "approved" && prev.status !== "approved";
  data.listings[idx] = {
    ...prev,
    status,
    adminNote:
      adminNote !== undefined ? String(adminNote).slice(0, 500) : prev.adminNote,
    updatedAt: now,
    approvedAt: becomingLive ? now : prev.approvedAt,
    lastActiveAt: becomingLive ? now : prev.lastActiveAt,
    reminderSentFor: becomingLive ? null : prev.reminderSentFor,
    archivedAt: status === "archived" ? now : prev.archivedAt,
    soldAt: status === "sold" ? now : prev.soldAt,
  };
  saveYardSale(data);
  return data.listings[idx];
}

export function applyListingAction(
  listingId: string,
  action: ListingAction,
  actor: ManageActor
) {
  const data = loadYardSale();
  const idx = data.listings.findIndex((l) => l.id === listingId);
  if (idx < 0) throw new Error("Listing not found");
  const prev = data.listings[idx];
  if (!actorCanManageListing(prev, actor)) {
    throw new Error("Not your listing");
  }
  const now = new Date().toISOString();
  if (action === "refresh") {
    if (prev.status !== "approved") {
      throw new Error("Only a live Marketplace listing can be refreshed");
    }
    const count = prev.refreshCount || 0;
    if (count >= LISTING_MAX_REFRESHES) {
      throw new Error("This listing has already been refreshed 3 times");
    }
    data.listings[idx] = {
      ...prev,
      refreshCount: count + 1,
      lastActiveAt: now,
      reminderSentFor: null,
      updatedAt: now,
    };
  } else if (action === "archive") {
    if (prev.status !== "approved") {
      throw new Error("Only a live Marketplace listing can be archived");
    }
    data.listings[idx] = {
      ...prev,
      status: "archived",
      archivedAt: now,
      updatedAt: now,
    };
  } else {
    if (prev.status === "removed") {
      throw new Error("This listing is already removed");
    }
    data.listings[idx] = {
      ...prev,
      status: "removed",
      updatedAt: now,
    };
  }
  saveYardSale(data);
  return data.listings[idx];
}

export function deleteListing(
  listingId: string,
  memberId?: string,
  isAdmin = false,
  memberEmail?: string
) {
  const data = loadYardSale();
  const listing = data.listings.find((l) => l.id === listingId);
  if (!listing) throw new Error("Listing not found");
  if (
    !actorCanManageListing(listing, {
      memberId,
      memberEmail,
      isAdmin,
    })
  ) {
    throw new Error("Not your listing");
  }
  data.listings = data.listings.filter((l) => l.id !== listingId);
  saveYardSale(data);
  return { ok: true };
}

export function getApprovedListings() {
  return loadYardSale()
    .listings.filter((l) => l.status === "approved")
    .sort(byActivityDesc);
}

export function getListingById(id: string) {
  return loadYardSale().listings.find((l) => l.id === id) || null;
}

export function getListingsByMember(memberId: string) {
  return loadYardSale()
    .listings.filter((l) => l.memberId === memberId)
    .sort(byActivityDesc);
}

export function listAllListings() {
  return loadYardSale().listings.slice().sort(byActivityDesc);
}

export function listingWithSeller(
  listing: YardListing,
  opts?: { includeSubmitter?: boolean }
) {
  const member = listing.memberId ? getMemberById(listing.memberId) : null;
  const seller = sellerFieldsForListing(listing, member);
  const showContact = listing.status === "approved";
  const contactBy = resolveContactBy(listing);
  const wantEmail = contactBy.email;
  const wantPhone = contactBy.phone || contactBy.text;
  const { submittedByName: storedSubmitter, ...rest } = listing;
  const submitter = opts?.includeSubmitter
    ? storedSubmitter || member?.name || undefined
    : undefined;
  return {
    ...rest,
    ...(opts?.includeSubmitter ? { submittedByName: submitter } : {}),
    seller: seller.sellerName
      ? {
          id: seller.memberIdForBadges,
          name: seller.sellerName,
          village: seller.sellerVillage,
          email: showContact && wantEmail ? seller.sellerEmail : undefined,
          phone: showContact && wantPhone ? seller.sellerPhone : undefined,
          contactBy: showContact ? contactBy : undefined,
        }
      : null,
  };
}

export async function saveYardUpload(buffer: Buffer, filename: string) {
  const { url } = await saveUploadFile(buffer, filename);
  return url;
}

export { MAX_IMAGES, MAX_VIDEO_BYTES, MAX_IMAGE_BYTES, YARD_PATH };
