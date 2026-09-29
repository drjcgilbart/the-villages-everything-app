export type MemberStatus = "pending" | "approved" | "rejected" | "suspended";

export type AdminLogEntry = {
  at: string;
  text: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  /** hashed password */
  passwordHash: string;
  phone?: string;
  village?: string;
  status: MemberStatus;
  createdAt: string;
  approvedAt?: string | null;
  notes?: string;
  adminLog?: AdminLogEntry[];
};

/** Safe member shape for clients (no password hash) */
export type PublicMember = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  village?: string;
  status: MemberStatus;
  createdAt: string;
};

export type ListingStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "sold"
  | "removed";

export type MeetupType =
  | "porch_pickup"
  | "parking_lot"
  | "message_to_arrange"
  | "curbside"
  | "other";

export type ItemCondition =
  | "new"
  | "like_new"
  | "good"
  | "fair"
  | "for_parts"
  | "freebie";

/** Ways a buyer may reach the seller. At least one must be chosen. */
export type ContactBy = {
  phone: boolean;
  email: boolean;
  text: boolean;
};

export const EMPTY_CONTACT_BY: ContactBy = {
  phone: false,
  email: false,
  text: false,
};

export function normalizeContactBy(
  raw: Partial<ContactBy> | null | undefined
): ContactBy {
  return {
    phone: !!raw?.phone,
    email: !!raw?.email,
    text: !!raw?.text,
  };
}

/** Old listings stored a single contactMethod. Phone meant call or text. */
export function resolveContactBy(listing: {
  contactBy?: Partial<ContactBy> | null;
  contactMethod?: "email" | "phone" | "either" | null;
}): ContactBy {
  const stored = listing.contactBy;
  if (stored && (stored.phone || stored.email || stored.text)) {
    return normalizeContactBy(stored);
  }
  if (listing.contactMethod === "email") {
    return { phone: false, email: true, text: false };
  }
  if (listing.contactMethod === "phone") {
    return { phone: true, email: false, text: true };
  }
  if (listing.contactMethod === "either") {
    return { phone: true, email: true, text: true };
  }
  return { ...EMPTY_CONTACT_BY };
}

export function contactMethodFromChoices(
  choices: ContactBy
): "email" | "phone" | "either" {
  const byNumber = choices.phone || choices.text;
  if (choices.email && !byNumber) return "email";
  if (!choices.email && byNumber) return "phone";
  return "either";
}

/** Null when the choice is acceptable. Otherwise a sentence the form can show. */
export function contactChoiceError(
  choices: ContactBy,
  email: string,
  phone: string
): string | null {
  if (!choices.phone && !choices.email && !choices.text) {
    return "Choose at least one way buyers can reach the seller: Phone, Email, or Text. You can choose more than one.";
  }
  if (choices.email && !email.trim()) {
    return "Add an email address, since Email is one of the ways buyers can reach the seller.";
  }
  if ((choices.phone || choices.text) && !phone.trim()) {
    return "Add a phone number, since Phone or Text is one of the ways buyers can reach the seller.";
  }
  return null;
}

export type YardListing = {
  id: string;
  memberId: string;
  /** Member who posted the listing, snapshotted at submit time. Admin record only. */
  submittedByName?: string;
  /** Guest seller (when posted without a membership). */
  sellerName?: string;
  sellerEmail?: string;
  sellerPhone?: string;
  sellerVillage?: string;
  title: string;
  description: string;
  /** null or 0 = free */
  price: number | null;
  isFree: boolean;
  condition: ItemCondition;
  category: string;
  meetupType: MeetupType;
  meetupNotes?: string;
  /** How buyers should reach seller. Kept in sync with contactBy for older readers. */
  contactMethod: "email" | "phone" | "either";
  /** Phone, email, and text choices. Missing on listings saved before this field. */
  contactBy?: ContactBy;
  images: string[]; // max 5
  videoUrl?: string | null; // max 1 short video
  status: ListingStatus;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string | null;
  soldAt?: string | null;
};

export type YardSaleData = {
  members: Member[];
  listings: YardListing[];
  updatedAt: string | null;
};

export const MEETUP_LABELS: Record<MeetupType, string> = {
  porch_pickup: "Porch pickup",
  parking_lot: "Parking lot meetup",
  message_to_arrange: "Message to arrange",
  curbside: "Curbside",
  other: "Other",
};

export const CONDITION_LABELS: Record<ItemCondition, string> = {
  new: "New",
  like_new: "Like new",
  good: "Good",
  fair: "Fair",
  for_parts: "For parts",
  freebie: "Freebie",
};

export const CATEGORY_OPTIONS = [
  "Furniture",
  "Electronics",
  "Kitchen",
  "Golf / sports",
  "Decor",
  "Clothing",
  "Tools",
  "Garden",
  "Books / media",
  "Freebies",
  "Other",
];
