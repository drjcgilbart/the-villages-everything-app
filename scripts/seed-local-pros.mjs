/**
 * Seed Local Pros (area) directory with public business listings
 * gathered from open web sources (company sites, Yelp snippets, BBB, etc.).
 * Does NOT scrape Google Maps privately — mapsUrl uses public Google Maps search links.
 *
 * Run: node scripts/seed-local-pros.mjs
 */
import fs from "fs";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.join(__dirname, "..", "data", "local-services.json");

function uid() {
  return (
    "svc-seed-" +
    Date.now().toString(36) +
    "-" +
    crypto.randomBytes(2).toString("hex")
  );
}

function maps(q) {
  return (
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q)
  );
}

const seeds = [
  {
    businessName: "Frank Gay Services",
    contactName: "Frank Gay Services",
    category: "HVAC & Air Conditioning",
    description:
      "HVAC, plumbing, electrical, and drain services serving Lady Lake, The Villages, and Central Florida. Public business listing — verify current hours and licensing before hiring.",
    address: "320 US-441, Lady Lake, FL 32159",
    serviceArea: "Lady Lake, The Villages, Wildwood, Leesburg",
    phone: "(352) 706-5710",
    website: "https://frankgayservices.com/",
    mapsUrl: maps("Frank Gay Services 320 US-441 Lady Lake FL 32159"),
  },
  {
    businessName: "Frank Gay Services (Electrical)",
    contactName: "Frank Gay Services",
    category: "Electricians",
    description:
      "Electrical service for The Villages / Lady Lake area from Frank Gay Services. Multi-trade home services company. Verify credentials before hiring.",
    address: "320 US-441, Lady Lake, FL 32159",
    serviceArea: "Lady Lake, The Villages area",
    phone: "(407) 204-0430",
    website: "https://frankgayservices.com/service-area/the-villages/",
    mapsUrl: maps("Frank Gay Services Lady Lake FL"),
  },
  {
    businessName: "Frank Gay Services (Plumbing)",
    contactName: "Frank Gay Services",
    category: "Plumbers",
    description:
      "Plumbing services for Lady Lake and The Villages via Frank Gay Services. Confirm emergency availability when you call.",
    address: "320 US-441, Lady Lake, FL 32159",
    serviceArea: "Lady Lake, The Villages",
    phone: "(407) 204-0430",
    website: "https://frankgayservices.com/service-area/lady-lake/",
    mapsUrl: maps("Frank Gay Services plumbing Lady Lake FL"),
  },
  {
    businessName: "Village Plumber, LLC",
    contactName: "Village Plumber",
    category: "Plumbers",
    description:
      "Local plumbing service with a Villages / Lady Lake presence. Listed from public directory info — call to confirm availability and licensing.",
    address: "1576 Bella Cruz Dr, Ste 431, The Villages, FL 32159",
    serviceArea: "The Villages, Lady Lake",
    phone: "(352) 205-5262",
    website: "http://www.villageplumberllc.net",
    mapsUrl: maps("Village Plumber 1576 Bella Cruz Dr The Villages FL"),
  },
  {
    businessName: "Ross Plumbing",
    contactName: "Ross Plumbing",
    category: "Plumbers",
    description:
      "Plumbing solutions serving Lady Lake and The Villages area. Emergency after-hours number published on their site. Confirm current details before hiring.",
    address: "Serving Lady Lake and The Villages, FL",
    serviceArea: "Lady Lake, The Villages, Leesburg",
    phone: "(352) 728-6053",
    website: "https://terryrossplumbing.com/lady-lake-plumber/",
    mapsUrl: maps("Ross Plumbing Leesburg FL"),
  },
  {
    businessName: "T&D Pool & Spa Construction",
    contactName: "T&D Pool Construction",
    category: "Pools — Build & Service",
    description:
      "Custom pool and spa construction serving Wildwood, The Villages, Lady Lake, and Sumter County. Public business listing from their website.",
    address: "3321 NE 37th Place, Wildwood, FL 34785",
    serviceArea: "Wildwood, The Villages, Lady Lake, Sumter County",
    phone: "(352) 748-3987",
    website: "https://www.tdpools.com/",
    mapsUrl: maps("T&D Pool & Spa Construction Wildwood FL 34785"),
  },
  {
    businessName: "T&D Patio & Pool",
    contactName: "T&D Patio & Pool",
    category: "Pools — Build & Service",
    description:
      "T&D patio and pool services location in The Villages. Related to T&D Pool group — confirm which location fits your project.",
    address: "2255 Parr Dr, The Villages, FL 32162",
    serviceArea: "The Villages",
    phone: "(352) 391-1036",
    website: "https://www.tdpools.com/",
    mapsUrl: maps("T&D Patio & Pool 2255 Parr Dr The Villages FL"),
  },
  {
    businessName: "Advanced Pool & Spa",
    contactName: "Advanced Pool & Spa",
    category: "Pools — Build & Service",
    description:
      "Pool and spa company serving Central Florida homeowners. Contact for package details and service area.",
    address: "Serving The Villages / Central Florida",
    serviceArea: "The Villages and surrounding areas",
    phone: "(352) 205-4270",
    website: "https://advpoolandspa.com/",
    mapsUrl: maps("Advanced Pool & Spa The Villages FL"),
  },
  {
    businessName: "Blue Haven Pools of The Villages",
    contactName: "Blue Haven Pools",
    category: "Pools — Build & Service",
    description:
      "Custom pool builders marketing services in The Villages / Lady Lake area. Call for design consult.",
    address: "Serving The Villages and Lady Lake, FL",
    serviceArea: "The Villages, Lady Lake, Wildwood",
    phone: "(352) 410-7850",
    website: "https://bluehavenpotg.com/locations/the-villages-florida/",
    mapsUrl: maps("Blue Haven Pools The Villages Florida"),
  },
  {
    businessName: "Browning's Aluminum & Screen Repair",
    contactName: "Browning's Aluminum",
    category: "Aluminum Screens & Enclosures",
    description:
      "Veteran-owned aluminum and screen enclosure contractor serving Ocala, The Villages, and Marion County. Screens, gutters, soffit/fascia.",
    address: "Ocala, FL 34472 (serves The Villages)",
    serviceArea: "Ocala, The Villages, Belleview, Marion County",
    phone: "(352) 680-0280",
    website: "https://www.browningsaluminum.com/",
    mapsUrl: maps("Browning's Aluminum Screen Repair Ocala FL"),
  },
  {
    businessName: "Browning's Aluminum (Gutters)",
    contactName: "Browning's Aluminum",
    category: "Gutter Cleaning & Installation",
    description:
      "Gutter installation, guards, soffit and fascia from Browning's Aluminum. Same veteran-owned company as screen enclosures.",
    address: "Ocala, FL 34472 (serves The Villages)",
    serviceArea: "Ocala, The Villages, Marion County",
    phone: "(352) 680-0280",
    website: "https://www.browningsaluminum.com/",
    mapsUrl: maps("Browning's Aluminum gutters Ocala FL"),
  },
  {
    businessName: "Village Palms Landscaping & Design",
    contactName: "Village Palms",
    category: "Landscaping & Lawn Care",
    description:
      "Landscaping and design company in Lady Lake serving local homeowners. Public contact info from villagepalms.com.",
    address: "740 County Road 466, Lady Lake, FL 32159",
    serviceArea: "Lady Lake, The Villages",
    phone: "(352) 753-4772",
    website: "https://www.villagepalms.com/home/",
    mapsUrl: maps("Village Palms Landscaping 740 County Road 466 Lady Lake FL"),
  },
  {
    businessName: "Massey Services — Landscape",
    contactName: "Massey Services",
    category: "Landscaping & Lawn Care",
    description:
      "Regional landscape and lawn service with a Lady Lake / Villages service center. Also offers pest and irrigation.",
    address: "606 Hoopfer Way, Lady Lake, FL 32159",
    serviceArea: "Lady Lake, The Villages",
    phone: "(352) 259-6991",
    website: "https://www.masseyservices.com/the-villages/landscape-service/",
    mapsUrl: maps("Massey Services 606 Hoopfer Way Lady Lake FL"),
  },
  {
    businessName: "Massey Services — Pest Control",
    contactName: "Massey Services",
    category: "Pest Control",
    description:
      "Pest and termite services from Massey Services Lady Lake center. Regional company serving The Villages area.",
    address: "606 Hoopfer Way, Lady Lake, FL 32159",
    serviceArea: "Lady Lake, The Villages",
    phone: "(352) 259-6991",
    website: "https://www.masseyservices.com/the-villages/",
    mapsUrl: maps("Massey Services Pest Control Lady Lake FL"),
  },
  {
    businessName: "Massey Services — Irrigation",
    contactName: "Massey Services",
    category: "Irrigation & Sprinklers",
    description:
      "Irrigation / sprinkler services through Massey Services Lady Lake. Confirm current irrigation offerings when you call.",
    address: "606 Hoopfer Way, Lady Lake, FL 32159",
    serviceArea: "Lady Lake, The Villages",
    phone: "(352) 259-0500",
    website: "https://www.masseyservices.com/",
    mapsUrl: maps("Massey Services Irrigation Lady Lake FL"),
  },
  {
    businessName: "Sack Roofing, Inc.",
    contactName: "Sack Roofing",
    category: "Roofing",
    description:
      "Roofing contractor based in Lady Lake serving the local area. Public address and phone from company site.",
    address: "308 Oak St Ste A, Lady Lake, FL 32159",
    serviceArea: "Lady Lake, The Villages area",
    phone: "(352) 430-2773",
    website: "https://sackroofing.com/",
    mapsUrl: maps("Sack Roofing 308 Oak St Lady Lake FL"),
  },
  {
    businessName: "Brehm Roofing & Restoration",
    contactName: "Brehm Roofing",
    category: "Roofing",
    description:
      "Roofing and restoration serving The Villages. Public listing — confirm emergency and inspection availability.",
    address: "561 Fieldcrest Dr, Ste 1, The Villages, FL 32162",
    serviceArea: "The Villages, Lady Lake",
    phone: "(352) 664-7373",
    website: "https://brehmroofing.com/",
    mapsUrl: maps("Brehm Roofing Fieldcrest Dr The Villages FL"),
  },
  {
    businessName: "Willie's Golf Carts",
    contactName: "Willie's Golf Carts",
    category: "Golf Cart Service",
    description:
      "Golf cart repairs and maintenance near The Villages in Fruitland Park. Public hours Mon–Fri 7am–4pm on their site.",
    address: "3439 Dixie Avenue / US 27 area, Fruitland Park, FL 34731",
    serviceArea: "Fruitland Park, The Villages, Leesburg",
    phone: "(352) 255-1369",
    website: "https://www.williesgolfcarts.com/",
    mapsUrl: maps("Willie's Golf Carts Fruitland Park FL"),
  },
  {
    businessName: "Cartfixer Mobile Golf Cart Repair",
    contactName: "Cartfixer",
    category: "Golf Cart Service",
    description:
      "Mobile golf cart repair serving The Villages. Public phone from cartfixer.com.",
    address: "Mobile service — The Villages, FL",
    serviceArea: "The Villages and nearby",
    phone: "(352) 433-5411",
    website: "https://cartfixer.com/",
    mapsUrl: maps("Cartfixer Golf Cart Repair The Villages FL"),
  },
  {
    businessName: "The Villages Golf Cars — Gantenbein's Garage",
    contactName: "Gantenbein's Garage",
    category: "Golf Cart Service",
    description:
      "Official Villages Golf Cars service garage at Spanish Springs. Public service number from thevillagesgolfcars.com.",
    address: "Spanish Springs, The Villages, FL",
    serviceArea: "The Villages",
    phone: "(352) 750-3410",
    website: "https://www.thevillagesgolfcars.com/service/",
    mapsUrl: maps("The Villages Golf Cars Spanish Springs Service"),
  },
  {
    businessName: "Steve Kling Painting, Inc.",
    contactName: "Steve Kling Painting",
    category: "Painting",
    description:
      "Residential painting serving The Villages, Lady Lake, Leesburg, Wildwood. Public contact from company site.",
    address: "5210 Green Briar Dr, Lady Lake, FL 32159",
    serviceArea: "The Villages, Lady Lake, Leesburg, Wildwood",
    phone: "(352) 436-8781",
    website: "https://stevenklingpainting.com/contact",
    mapsUrl: maps("Steve Kling Painting Lady Lake FL"),
  },
  {
    businessName: "360° Painting of The Villages",
    contactName: "360 Painting",
    category: "Painting",
    description:
      "Interior/exterior painting franchise serving The Villages and nearby towns. Request estimate via website or phone.",
    address: "Serving The Villages and Lady Lake, FL",
    serviceArea: "The Villages, Lady Lake, Leesburg, Wildwood, Ocala",
    phone: "(772) 257-4876",
    website: "https://www.360painting.com/the-villages/",
    mapsUrl: maps("360 Painting The Villages FL"),
  },
  {
    businessName: "Benchmark Pavers LLC",
    contactName: "Benchmark Pavers",
    category: "Driveways, Pavers & Staining",
    description:
      "Paver design and installation for driveways, patios, and outdoor living in The Villages area. Free estimates advertised.",
    address: "Serving The Villages, FL",
    serviceArea: "The Villages and surrounding Central Florida",
    phone: "(352) 651-6077",
    website: "https://www.benchmarkpavers.com/pavers-the-villages-fl.html",
    mapsUrl: maps("Benchmark Pavers The Villages FL"),
  },
  {
    businessName: "SCR Pavers, Inc.",
    contactName: "SCR Pavers",
    category: "Driveways, Pavers & Staining",
    description:
      "Paver contractor serving The Villages. Call for outdoor living and driveway projects.",
    address: "Serving The Villages, FL",
    serviceArea: "The Villages",
    phone: "(352) 302-3108",
    website: "https://www.scrpavershardscapes.com/the-villages-fl/",
    mapsUrl: maps("SCR Pavers The Villages FL"),
  },
  {
    businessName: "Paver Brick Super Seal",
    contactName: "Paver Brick Super Seal",
    category: "Driveways, Pavers & Staining",
    description:
      "Pressure washing, paver cleaning, and sealing for driveways and pool decks in The Villages area.",
    address: "Clermont base — serves The Villages",
    serviceArea: "The Villages, Clermont, Central Florida",
    phone: "(407) 488-5238",
    website:
      "https://www.paverbricksuperseal.com/the-villages-paver-sealing-cleaning/",
    mapsUrl: maps("Paver Brick Super Seal Clermont FL"),
  },
  {
    businessName: "Paver Brick Super Seal (Pressure Washing)",
    contactName: "Paver Brick Super Seal",
    category: "Pressure Washing & Window Cleaning",
    description:
      "Exterior pressure washing and surface cleaning for homes in The Villages area (same company as paver sealing listing).",
    address: "Serves The Villages / Central Florida",
    serviceArea: "The Villages, Clermont",
    phone: "(407) 488-5238",
    website: "https://www.paverbricksuperseal.com/",
    mapsUrl: maps("Paver Brick Super Seal pressure washing The Villages"),
  },
  {
    businessName: "Casey's Cart Repairs",
    contactName: "Todd Casey",
    category: "Golf Cart Service",
    description:
      "Mobile golf cart repair serving The Villages with 25+ years experience. Door-to-door tune-ups and repairs.",
    address: "Mobile service — The Villages, FL",
    serviceArea: "The Villages",
    website: "https://caseyscartrepairs.com/",
    mapsUrl: maps("Casey's Cart Repairs The Villages FL"),
  },
];

const raw = JSON.parse(fs.readFileSync(FILE, "utf8"));
const now = new Date().toISOString();
raw.listings = Array.isArray(raw.listings) ? raw.listings : [];
raw.reviews = Array.isArray(raw.reviews) ? raw.reviews : [];

let added = 0;
for (const s of seeds) {
  const key = (s.businessName + "|" + s.category).toLowerCase();
  const dup = raw.listings.some(
    (l) =>
      l.scope === "area" &&
      (l.businessName + "|" + l.category).toLowerCase() === key
  );
  if (dup) continue;

  raw.listings.push({
    id: uid(),
    scope: "area",
    businessName: s.businessName,
    contactName: s.contactName,
    category: s.category,
    description: s.description,
    serviceArea: s.serviceArea,
    address: s.address,
    phone: s.phone,
    website: s.website,
    mapsUrl: s.mapsUrl,
    submittedByName: "Directory seed (public web)",
    status: "approved",
    createdAt: now,
    updatedAt: now,
    approvedAt: now,
    adminNote:
      "Seeded from public web business listings for Local Pros. Verify phone/hours/licensing before hiring. Not affiliated with The Villages brand. Maps links open a public Google Maps search — not private scraped data.",
  });
  added++;
}

raw.updatedAt = now;
raw.dailyLeaderboard = null; // rebuild on next page load
fs.writeFileSync(FILE, JSON.stringify(raw, null, 2));
console.log(
  `Added ${added} area listings. Total: ${raw.listings.length}. Area approved: ${
    raw.listings.filter((l) => l.scope === "area" && l.status === "approved")
      .length
  }`
);
