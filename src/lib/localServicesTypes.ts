/** Client-safe types for Support Local Villagers service directory */

export const LOCAL_SERVICE_CATEGORIES = [
  "Home & Handyman",
  "Landscaping & Lawn",
  "Cleaning & Organizing",
  "Golf Cart & Auto",
  "Health & Wellness",
  "Pets",
  "Tech & Computers",
  "Music & Lessons",
  "Arts, Crafts & Makers",
  "Professional Services",
  "Food & Catering",
  "Other",
] as const;

export type LocalServiceCategory = (typeof LOCAL_SERVICE_CATEGORIES)[number];

export type LocalServiceModStatus = "pending" | "approved" | "rejected";

/** Neighbor service listing (pending or live) */
export type LocalServiceListing = {
  id: string;
  /** Business or display name */
  businessName: string;
  /** Person to ask for */
  contactName: string;
  category: LocalServiceCategory;
  description: string;
  /** Village / area served (optional) */
  village?: string;
  phone?: string;
  email?: string;
  website?: string;
  /** Optional portrait / logo / business card photo */
  photoUrl?: string;
  /** Who filled the form */
  submittedByName: string;
  status: LocalServiceModStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  adminNote?: string;
  /**
   * If this submission updates an existing approved listing,
   * admin approve will replace that listing.
   */
  replacesId?: string;
};

export type LocalServicesData = {
  listings: LocalServiceListing[];
  updatedAt: string | null;
};
