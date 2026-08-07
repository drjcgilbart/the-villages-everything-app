/** Client-safe types for leader-submitted club listings */

export const CLUB_MEMBERSHIP_STATUSES = [
  "open",
  "waitlist",
  "closed",
] as const;

export type ClubMembershipStatus = (typeof CLUB_MEMBERSHIP_STATUSES)[number];

export const CLUB_LISTING_CATEGORIES = [
  "Sports & Recreation",
  "Cards & Games",
  "Music & Performance",
  "Dance",
  "Arts & Crafts",
  "Fitness & Wellness",
  "Social & Community",
  "Books & Writing",
  "Golf",
  "Walking & Running",
  "Regional & Heritage",
  "Technology",
  "Pets & Animals",
  "Volunteering & Service",
  "Other",
] as const;

export type ClubListingCategory = (typeof CLUB_LISTING_CATEGORIES)[number];

export type ClubListingModStatus = "pending" | "approved" | "rejected";

/** Live or pending club info submitted by a leader */
export type ClubListing = {
  id: string;
  name: string;
  category: ClubListingCategory;
  location: string;
  leaderName: string;
  website?: string;
  email?: string;
  phone?: string;
  description: string;
  membershipStatus: ClubMembershipStatus;
  /** Who filled the form (may match leader) */
  submittedByName: string;
  status: ClubListingModStatus;
  createdAt: string;
  updatedAt: string;
  /** When last approved for public display */
  approvedAt?: string;
  /**
   * If this submission updates an existing approved listing,
   * admin approve will replace that listing.
   */
  replacesId?: string;
};

export type ClubListingsData = {
  listings: ClubListing[];
  updatedAt: string | null;
};

export function membershipLabel(status: ClubMembershipStatus): string {
  switch (status) {
    case "open":
      return "Open to new members";
    case "waitlist":
      return "Waitlist / limited";
    case "closed":
      return "Closed / full";
    default:
      return status;
  }
}
