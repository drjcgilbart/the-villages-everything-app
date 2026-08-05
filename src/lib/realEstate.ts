import fs from "fs";
import path from "path";
import crypto from "crypto";
import type {
  AgentTier,
  LeadType,
  ListingStatus,
  MarketSnapshot,
  PropertyType,
  RealEstateAgent,
  RealEstateData,
  RealEstateLead,
  RealEstateListing,
} from "./realEstateTypes";

const DATA_DIR = path.join(process.cwd(), "data");
const RE_PATH = path.join(DATA_DIR, "real-estate.json");

function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

/**
 * Free live market links — always open current public results (not scraped).
 * Kept in code (not frozen in JSON) so we can refresh the catalog anytime.
 */
const DEFAULT_LIVE_SEARCHES: MarketSnapshot["liveSearches"] = [
  {
    label: "The Villages Homefinder",
    description:
      "Official new & pre-owned homes inside The Villages community — best first stop for Villages inventory.",
    url: "https://www.thevillages.com/homefinder/",
    source: "Official",
  },
  {
    label: "Homes for sale · Realtor.com",
    description: "Broad MLS-style search for The Villages, FL",
    url: "https://www.realtor.com/realestateandhomes-search/The-Villages_FL",
    source: "Realtor.com",
  },
  {
    label: "Homes for sale · Redfin",
    description: "Alternate live map & list view for The Villages",
    url: "https://www.redfin.com/city/25985/FL/The-Villages",
    source: "Redfin",
  },
  {
    label: "Homes for sale · Zillow",
    description: "Zillow market view for The Villages area",
    url: "https://www.zillow.com/the-villages-fl/",
    source: "Zillow",
  },
  {
    label: "Under $350k",
    description: "Entry-level filter on Realtor.com",
    url: "https://www.realtor.com/realestateandhomes-search/The-Villages_FL/price-na-350000",
    source: "Filter",
  },
  {
    label: "Under $400k",
    description: "Mid-range budget snapshot",
    url: "https://www.realtor.com/realestateandhomes-search/The-Villages_FL/price-na-400000",
    source: "Filter",
  },
  {
    label: "Under $500k",
    description: "Room to stretch — still filtered live results",
    url: "https://www.realtor.com/realestateandhomes-search/The-Villages_FL/price-na-500000",
    source: "Filter",
  },
  {
    label: "New construction",
    description: "Newer inventory & builder-style product",
    url: "https://www.realtor.com/realestateandhomes-search/The-Villages_FL/type-single-family-home,condo/keyword-new",
    source: "Filter",
  },
  {
    label: "Condos & townhomes",
    description: "Lower-maintenance styles in and around The Villages",
    url: "https://www.realtor.com/realestateandhomes-search/The-Villages_FL/type-condo,townhome,co-op",
    source: "Filter",
  },
  {
    label: "55+ style search",
    description: "Keyword filter for active-adult / 55+ oriented results",
    url: "https://www.realtor.com/realestateandhomes-search/The-Villages_FL/keyword-55",
    source: "Filter",
  },
  {
    label: "Redfin · under $400k",
    description: "Budget filter on Redfin’s Villages map",
    url: "https://www.redfin.com/city/25985/FL/The-Villages/filter/max-price=400k",
    source: "Redfin",
  },
  {
    label: "Redfin · housing market",
    description: "Trends & stats for The Villages (not individual listings)",
    url: "https://www.redfin.com/city/25985/FL/The-Villages/housing-market",
    source: "Stats",
  },
];

function seedData(): RealEstateData {
  const now = new Date().toISOString();
  const agents: RealEstateAgent[] = [
    {
      id: "agent-seed-1",
      name: "Jordan Hale",
      brokerage: "Sunshine Cart Realty",
      phone: "(352) 555-0142",
      email: "jordan@example.com",
      website: "",
      bio: "Helping buyers and sellers navigate The Villages map — from Edenfield to the historic side — without the hard sell.",
      specialties: ["Buyers", "Sellers", "Eastport", "55+ communities"],
      tier: "preferred",
      acceptsLeads: true,
      active: true,
      createdAt: now,
    },
    {
      id: "agent-seed-2",
      name: "Sam Rivera",
      brokerage: "Lake Sumter Homes",
      phone: "(352) 555-0198",
      email: "sam@example.com",
      bio: "Local specialist for villa living, golf-course homes, and stress-free seller prep.",
      specialties: ["Villas", "Golf course homes", "Downsizing"],
      tier: "featured",
      acceptsLeads: true,
      active: true,
      createdAt: now,
    },
    {
      id: "agent-seed-3",
      name: "Pat Morgan",
      brokerage: "Friendly Hometown Realty",
      phone: "(352) 555-0110",
      email: "pat@example.com",
      bio: "First-time Villager? I'll translate the villages, rec centers, and bond talk into plain English.",
      specialties: ["Relocating buyers", "New construction"],
      tier: "listed",
      acceptsLeads: true,
      active: true,
      createdAt: now,
    },
  ];

  const listings: RealEstateListing[] = [
    {
      id: "list-seed-1",
      title: "Designer villa near Eastport energy",
      village: "Edenfield",
      address: "Eastport area",
      price: 489000,
      beds: 3,
      baths: 2,
      sqft: 1850,
      propertyType: "designer",
      status: "active",
      summary:
        "Sample featured listing — replace with a live MLS link. Open floor plan, golf-cart garage, and easy cart access to Eastport.",
      listingUrl:
        "https://www.realtor.com/realestateandhomes-search/The-Villages_FL",
      agentId: "agent-seed-1",
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "list-seed-2",
      title: "Courtyard villa · Lake Sumter side",
      village: "Virginia Trace",
      price: 365000,
      beds: 2,
      baths: 2,
      sqft: 1420,
      propertyType: "courtyard",
      status: "active",
      summary:
        "Sample listing for the hub — cozy courtyard living with southern exposure potential. Swap in real photos and MLS URL.",
      listingUrl:
        "https://www.zillow.com/the-villages-fl/",
      agentId: "agent-seed-2",
      featured: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "list-seed-3",
      title: "Classic ranch near Spanish Springs",
      village: "Mira Mesa",
      price: 329000,
      beds: 2,
      baths: 2,
      sqft: 1380,
      propertyType: "ranch",
      status: "pending",
      summary:
        "Historic-side sample listing — mature landscaping energy. Mark sold/pending from Studio when you go live with real inventory.",
      agentId: "agent-seed-3",
      featured: false,
      createdAt: now,
      updatedAt: now,
    },
  ];

  return {
    listings,
    agents,
    leads: [],
    market: {
      lastRefreshedAt: now,
      lastRefreshSource: "startup",
      headline: "The Villages market moves fast — always verify live inventory.",
      notes: [
        "Featured homes below are site-curated (great for agent partners).",
        "Live market buttons open Homefinder, Realtor.com, Redfin, Zillow, and handy budget filters.",
        "Snapshot refreshes daily when deployed with cron, or anytime via Refresh.",
      ],
      liveSearches: DEFAULT_LIVE_SEARCHES,
    },
    updatedAt: now,
  };
}

export function loadRealEstate(): RealEstateData {
  ensureDirs();
  if (!fs.existsSync(RE_PATH)) {
    const seed = seedData();
    fs.writeFileSync(RE_PATH, JSON.stringify(seed, null, 2), "utf8");
    return seed;
  }
  try {
    const raw = JSON.parse(fs.readFileSync(RE_PATH, "utf8")) as RealEstateData;
    return {
      listings: Array.isArray(raw.listings) ? raw.listings : [],
      agents: Array.isArray(raw.agents) ? raw.agents : [],
      leads: Array.isArray(raw.leads) ? raw.leads : [],
      market: {
        lastRefreshedAt: raw.market?.lastRefreshedAt || null,
        lastRefreshSource: raw.market?.lastRefreshSource || null,
        headline:
          raw.market?.headline ||
          "The Villages market moves fast — always verify live inventory.",
        notes: Array.isArray(raw.market?.notes)
          ? raw.market.notes
          : [
              "Featured homes below are site-curated (great for agent partners).",
              "“Live market” buttons open current public search results for The Villages.",
            ],
        // Always serve the code catalog so Homefinder / Redfin / filters stay current
        liveSearches: DEFAULT_LIVE_SEARCHES,
      },
      updatedAt: raw.updatedAt || null,
    };
  } catch {
    return seedData();
  }
}

export function saveRealEstate(data: RealEstateData) {
  ensureDirs();
  data.updatedAt = new Date().toISOString();
  fs.writeFileSync(RE_PATH, JSON.stringify(data, null, 2), "utf8");
  return data;
}

export function getPublicListings() {
  return loadRealEstate()
    .listings.filter((l) => l.status === "active" || l.status === "pending")
    .slice()
    .sort((a, b) => {
      if (Boolean(b.featured) !== Boolean(a.featured)) {
        return Number(b.featured) - Number(a.featured);
      }
      return String(b.updatedAt).localeCompare(String(a.updatedAt));
    });
}

export function getPublicAgents() {
  return loadRealEstate()
    .agents.filter((a) => a.active)
    .slice()
    .sort((a, b) => {
      const order: Record<AgentTier, number> = {
        preferred: 0,
        featured: 1,
        listed: 2,
      };
      if (order[a.tier] !== order[b.tier]) return order[a.tier] - order[b.tier];
      return a.name.localeCompare(b.name);
    });
}

export function getAgentById(id: string) {
  return loadRealEstate().agents.find((a) => a.id === id) || null;
}

/** Refresh market snapshot (hourly cron or on-demand). */
export function refreshMarket(source: "manual" | "hourly" | "startup" = "manual") {
  const data = loadRealEstate();
  const now = new Date().toISOString();
  const active = data.listings.filter((l) => l.status === "active");
  const pending = data.listings.filter((l) => l.status === "pending");
  const prices = active.map((l) => l.price).filter((n) => n > 0);
  const avg = prices.length
    ? Math.round(prices.reduce((s, n) => s + n, 0) / prices.length)
    : 0;

  data.market.lastRefreshedAt = now;
  data.market.lastRefreshSource = source;
  data.market.liveSearches = DEFAULT_LIVE_SEARCHES;
  data.market.headline =
    active.length > 0
      ? `${active.length} featured active home${active.length === 1 ? "" : "s"} on this site · avg featured ask ~$${avg.toLocaleString("en-US")}`
      : "No featured homes yet — use live market searches below for current inventory.";
  data.market.notes = [
    `Snapshot refreshed ${source === "hourly" ? "on the hourly schedule" : source === "manual" ? "on demand" : "at startup"}.`,
    `${pending.length} pending featured listing${pending.length === 1 ? "" : "s"} in the site catalog.`,
    "Live market buttons open Homefinder, Realtor.com, Redfin, Zillow, and budget filters — always current on those sites.",
    "Partner agents can sponsor featured placement and receive buyer/seller leads from this page.",
  ];

  // Bump listing updatedAt for active featured items so "freshness" is visible
  for (const l of data.listings) {
    if (l.status === "active" || l.status === "pending") {
      l.updatedAt = now;
    }
  }

  return saveRealEstate(data);
}

export function upsertListing(
  input: Partial<RealEstateListing> & {
    title: string;
    price: number;
    beds: number;
    baths: number;
    summary: string;
  }
) {
  const data = loadRealEstate();
  const now = new Date().toISOString();
  if (input.id) {
    const idx = data.listings.findIndex((l) => l.id === input.id);
    if (idx < 0) throw new Error("Listing not found");
    const prev = data.listings[idx];
    data.listings[idx] = {
      ...prev,
      ...input,
      title: String(input.title).trim().slice(0, 160),
      village: input.village !== undefined ? String(input.village || "").slice(0, 80) : prev.village,
      address: input.address !== undefined ? String(input.address || "").slice(0, 160) : prev.address,
      price: Math.max(0, Math.round(Number(input.price) || 0)),
      beds: Math.max(0, Math.round(Number(input.beds) || 0)),
      baths: Math.max(0, Number(input.baths) || 0),
      sqft: input.sqft !== undefined ? Math.max(0, Math.round(Number(input.sqft) || 0)) || undefined : prev.sqft,
      propertyType: (input.propertyType || prev.propertyType) as PropertyType,
      status: (input.status || prev.status) as ListingStatus,
      summary: String(input.summary ?? prev.summary).slice(0, 800),
      listingUrl: input.listingUrl !== undefined ? String(input.listingUrl || "").slice(0, 400) : prev.listingUrl,
      imageUrl: input.imageUrl !== undefined ? input.imageUrl || undefined : prev.imageUrl,
      agentId: input.agentId !== undefined ? input.agentId || undefined : prev.agentId,
      featured: input.featured !== undefined ? !!input.featured : prev.featured,
      updatedAt: now,
    };
  } else {
    data.listings.unshift({
      id: uid("list"),
      title: String(input.title).trim().slice(0, 160),
      village: input.village ? String(input.village).slice(0, 80) : undefined,
      address: input.address ? String(input.address).slice(0, 160) : undefined,
      price: Math.max(0, Math.round(Number(input.price) || 0)),
      beds: Math.max(0, Math.round(Number(input.beds) || 0)),
      baths: Math.max(0, Number(input.baths) || 0),
      sqft: input.sqft ? Math.max(0, Math.round(Number(input.sqft) || 0)) : undefined,
      propertyType: (input.propertyType || "villa") as PropertyType,
      status: (input.status || "active") as ListingStatus,
      summary: String(input.summary).slice(0, 800),
      listingUrl: input.listingUrl ? String(input.listingUrl).slice(0, 400) : undefined,
      imageUrl: input.imageUrl || undefined,
      agentId: input.agentId || undefined,
      featured: !!input.featured,
      createdAt: now,
      updatedAt: now,
    });
  }
  return saveRealEstate(data);
}

export function deleteListing(id: string) {
  const data = loadRealEstate();
  data.listings = data.listings.filter((l) => l.id !== id);
  return saveRealEstate(data);
}

export function upsertAgent(
  input: Partial<RealEstateAgent> & {
    name: string;
    brokerage: string;
    bio: string;
  }
) {
  const data = loadRealEstate();
  const now = new Date().toISOString();
  if (input.id) {
    const idx = data.agents.findIndex((a) => a.id === input.id);
    if (idx < 0) throw new Error("Agent not found");
    const prev = data.agents[idx];
    data.agents[idx] = {
      ...prev,
      ...input,
      name: String(input.name).trim().slice(0, 80),
      brokerage: String(input.brokerage).trim().slice(0, 120),
      phone: input.phone !== undefined ? String(input.phone || "").slice(0, 40) : prev.phone,
      email: input.email !== undefined ? String(input.email || "").slice(0, 120) : prev.email,
      website: input.website !== undefined ? String(input.website || "").slice(0, 200) : prev.website,
      bio: String(input.bio ?? prev.bio).slice(0, 800),
      specialties: Array.isArray(input.specialties) ? input.specialties : prev.specialties,
      tier: (input.tier || prev.tier) as AgentTier,
      acceptsLeads: input.acceptsLeads !== undefined ? !!input.acceptsLeads : prev.acceptsLeads,
      photoUrl: input.photoUrl !== undefined ? input.photoUrl || undefined : prev.photoUrl,
      active: input.active !== undefined ? !!input.active : prev.active,
    };
  } else {
    data.agents.unshift({
      id: uid("agent"),
      name: String(input.name).trim().slice(0, 80),
      brokerage: String(input.brokerage).trim().slice(0, 120),
      phone: input.phone ? String(input.phone).slice(0, 40) : undefined,
      email: input.email ? String(input.email).slice(0, 120) : undefined,
      website: input.website ? String(input.website).slice(0, 200) : undefined,
      bio: String(input.bio).slice(0, 800),
      specialties: Array.isArray(input.specialties) ? input.specialties : [],
      tier: (input.tier || "listed") as AgentTier,
      acceptsLeads: input.acceptsLeads !== false,
      photoUrl: input.photoUrl || undefined,
      active: input.active !== false,
      createdAt: now,
    });
  }
  return saveRealEstate(data);
}

export function deleteAgent(id: string) {
  const data = loadRealEstate();
  data.agents = data.agents.filter((a) => a.id !== id);
  return saveRealEstate(data);
}

export function addLead(input: {
  type: LeadType;
  name: string;
  email: string;
  phone?: string;
  message: string;
  village?: string;
  budget?: string;
  agentId?: string;
  listingId?: string;
}) {
  const data = loadRealEstate();
  const name = String(input.name || "").trim().slice(0, 80);
  const email = String(input.email || "").trim().slice(0, 120);
  const message = String(input.message || "").trim().slice(0, 2000);
  if (name.length < 2) throw new Error("Please enter your name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Valid email required");
  if (message.length < 10) throw new Error("Tell us a bit more so we can help");

  const lead: RealEstateLead = {
    id: uid("lead"),
    type: input.type || "general",
    name,
    email,
    phone: input.phone ? String(input.phone).slice(0, 40) : undefined,
    message,
    village: input.village ? String(input.village).slice(0, 80) : undefined,
    budget: input.budget ? String(input.budget).slice(0, 80) : undefined,
    agentId: input.agentId || undefined,
    listingId: input.listingId || undefined,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  data.leads.unshift(lead);
  saveRealEstate(data);
  return lead;
}

export function setLeadStatus(id: string, status: RealEstateLead["status"]) {
  const data = loadRealEstate();
  const idx = data.leads.findIndex((l) => l.id === id);
  if (idx < 0) throw new Error("Lead not found");
  data.leads[idx] = { ...data.leads[idx], status };
  return saveRealEstate(data);
}

export function deleteLead(id: string) {
  const data = loadRealEstate();
  data.leads = data.leads.filter((l) => l.id !== id);
  return saveRealEstate(data);
}

export function formatPrice(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n || 0);
}

export function marketSummary() {
  const data = loadRealEstate();
  const publicListings = getPublicListings();
  const active = publicListings.filter((l) => l.status === "active");
  const agents = getPublicAgents();
  return {
    activeCount: active.length,
    pendingCount: publicListings.filter((l) => l.status === "pending").length,
    agentCount: agents.length,
    preferredAgentCount: agents.filter((a) => a.tier === "preferred").length,
    lastRefreshedAt: data.market.lastRefreshedAt,
    lastRefreshSource: data.market.lastRefreshSource,
    headline: data.market.headline,
  };
}
