export type MemberStatus = "pending" | "approved" | "rejected" | "suspended";

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

export type YardListing = {
  id: string;
  memberId: string;
  title: string;
  description: string;
  /** null or 0 = free */
  price: number | null;
  isFree: boolean;
  condition: ItemCondition;
  category: string;
  meetupType: MeetupType;
  meetupNotes?: string;
  /** How buyers should reach seller */
  contactMethod: "email" | "phone" | "either";
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
