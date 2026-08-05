export type ListingStatus = "active" | "pending" | "sold" | "hidden";

export type PropertyType =
  | "villa"
  | "courtyard"
  | "ranch"
  | "premier"
  | "designer"
  | "condo"
  | "other";

export type AgentTier = "listed" | "featured" | "preferred";

export type LeadType = "buyer" | "seller" | "general";

export type RealEstateListing = {
  id: string;
  title: string;
  village?: string;
  address?: string;
  price: number;
  beds: number;
  baths: number;
  sqft?: number;
  propertyType: PropertyType;
  status: ListingStatus;
  summary: string;
  /** External MLS / brokerage listing URL (always “live” when clicked) */
  listingUrl?: string;
  imageUrl?: string;
  agentId?: string;
  featured?: boolean;
  /** When this listing was last confirmed/updated */
  updatedAt: string;
  createdAt: string;
};

export type RealEstateAgent = {
  id: string;
  name: string;
  brokerage: string;
  phone?: string;
  email?: string;
  website?: string;
  bio: string;
  specialties: string[];
  tier: AgentTier;
  /** Accept buyer/seller leads from the site */
  acceptsLeads: boolean;
  photoUrl?: string;
  active: boolean;
  createdAt: string;
};

export type RealEstateLead = {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone?: string;
  message: string;
  village?: string;
  budget?: string;
  /** Preferred agent if visitor picked one */
  agentId?: string;
  listingId?: string;
  status: "new" | "contacted" | "closed" | "spam";
  createdAt: string;
};

export type MarketSnapshot = {
  lastRefreshedAt: string | null;
  lastRefreshSource: "manual" | "hourly" | "startup" | null;
  /** Soft market notes shown on the hub */
  headline: string;
  notes: string[];
  /** Live search destinations (always current when opened) */
  liveSearches: {
    label: string;
    description: string;
    url: string;
    /** Short source badge, e.g. Homefinder / Realtor / Redfin */
    source?: string;
    /** Whimsical card art under /public/graphics/real-estate */
    image?: string;
  }[];
};

export type RealEstateData = {
  listings: RealEstateListing[];
  agents: RealEstateAgent[];
  leads: RealEstateLead[];
  market: MarketSnapshot;
  updatedAt: string | null;
};
