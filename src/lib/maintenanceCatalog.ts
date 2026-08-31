/** Villages maintenance resources, common jobs, and shop pointers (Aug 2026). */

export const MAINT_REPEAT_UNITS = ["months", "days", "weeks", "years", "miles", "hours"] as const;

export type MaintSuggest = {
  title: string;
  notes: string;
  repeatEvery: number;
  repeatUnit: string;
};

export const MAINT_SUGGESTIONS: Record<string, MaintSuggest[]> = {
  "golf-cart": [
    { title: "Battery water / terminals", notes: "Check water, clean posts, look for corrosion.", repeatEvery: 1, repeatUnit: "months" },
    { title: "Tire pressure", notes: "Match the sidewall PSI. Uneven wear shows up on cart paths.", repeatEvery: 30, repeatUnit: "days" },
    { title: "Brake check", notes: "Pedal feel and parking brake on a slope.", repeatEvery: 6, repeatUnit: "months" },
    { title: "6-month cart service", notes: "Shop or DIY: brakes, cables, steering, charger.", repeatEvery: 6, repeatUnit: "months" },
  ],
  car: [
    { title: "Oil change", notes: "Use the weight in the door sticker. Florida heat is hard on oil.", repeatEvery: 5000, repeatUnit: "miles" },
    { title: "Tire rotation", notes: "Rotate and check tread / alignment.", repeatEvery: 6000, repeatUnit: "miles" },
    { title: "Cabin air filter", notes: "Florida pollen clogs these fast.", repeatEvery: 12, repeatUnit: "months" },
    { title: "Registration / tag", notes: "Florida renewal — keep the card in the visor. flhsmv.gov", repeatEvery: 12, repeatUnit: "months" },
  ],
  house: [
    { title: "A/C filter", notes: "Villages dust + pollen. Write the size on the furnace.", repeatEvery: 90, repeatUnit: "days" },
    { title: "Smoke / CO detector batteries", notes: "Test all detectors while you are in each room.", repeatEvery: 12, repeatUnit: "months" },
    { title: "Gutters", notes: "Clear before rainy season.", repeatEvery: 6, repeatUnit: "months" },
    { title: "HVAC service", notes: "Cooling check before summer.", repeatEvery: 12, repeatUnit: "months" },
  ],
  hvac: [
    { title: "Replace filter", notes: "Keep a spare in the garage.", repeatEvery: 90, repeatUnit: "days" },
    { title: "Professional service", notes: "Coils, drain, refrigerant check.", repeatEvery: 12, repeatUnit: "months" },
  ],
  appliance: [
    { title: "Clean lint / coils", notes: "Dryer lint and fridge coils.", repeatEvery: 6, repeatUnit: "months" },
  ],
  pool: [
    { title: "Chemistry check", notes: "Chlorine, pH, filter pressure.", repeatEvery: 7, repeatUnit: "days" },
    { title: "Filter clean", notes: "Backwash or cartridge rinse.", repeatEvery: 1, repeatUnit: "months" },
  ],
  generator: [
    { title: "Exercise run", notes: "Run under load 10–15 minutes.", repeatEvery: 30, repeatUnit: "days" },
    { title: "Oil change", notes: "Follow the hours in the manual.", repeatEvery: 100, repeatUnit: "hours" },
  ],
  other: [
    { title: "General service", notes: "Whatever this thing needs on a schedule.", repeatEvery: 6, repeatUnit: "months" },
  ],
};

export const MAINT_OFFICIAL = [
  {
    label: "District utilities & sanitation",
    href: "https://www.districtgov.org/services/utilities/",
    note: "Water, sewer, irrigation, trash · Utilities 352-750-0000",
  },
  {
    label: "Pay utility / amenity bill",
    href: "https://www.districtgov.org/services/utilities/pay-bill/",
    note: "Online, phone, or in person Mon–Fri 8am–5pm",
  },
  {
    label: "Irrigation schedules",
    href: "https://www.districtgov.org/services/utilities/irrigation-schedules/",
    note: "By district and odd/even address · watering before 10am or after 4pm",
  },
  {
    label: "Water shortage / watering alerts",
    href: "https://www.districtgov.org/whats-happening/",
    note: "Standard irrigation schedule suspended Apr 3–Oct 1, 2026 (Phase III) — confirm on DistrictGov",
  },
  {
    label: "Find my District",
    href: "https://www.districtgov.org/districts/finder/",
    note: "Needed for irrigation, trash day, and bulk pickup",
  },
  {
    label: "Water Wisdom University",
    href: "https://www.waterwisdomuniversity.com/",
    note: "Run times, schedules, and water-saving tips for Villages homes",
  },
  {
    label: "District offices / customer service",
    href: "https://www.districtgov.org/contact-us/district-offices/",
    note: "Main 3571 Kiessel Rd · 352-753-4508 · Property Management for home issues",
  },
  {
    label: "Florida DHSMV — tags & titles",
    href: "https://www.flhsmv.gov/motor-vehicles-tags-titles/",
    note: "Car and LSV/golf-car tag renewal",
  },
];

export const MAINT_OFFICES = [
  {
    name: "District Customer Service — main",
    hours: "Mon–Fri 8:00 AM–5:00 PM",
    address: "3571 Kiessel Road, The Villages, FL 32163",
    phone: "352-753-4508",
    note: "General District help · parking behind the building across from The Lofts at Brownwood",
  },
  {
    name: "Utility billing",
    hours: "Mon–Fri 8:00 AM–5:00 PM",
    address: "Utilities@DistrictGov.org",
    phone: "352-750-0000",
    note: "Water, sewer, irrigation, sanitation, amenity fee on the combined bill",
  },
  {
    name: "Lake Sumter Landing satellite (historic listing)",
    hours: "Mon–Fri 8:00 AM–5:00 PM — confirm before you go",
    address: "984 Old Mill Run, The Villages, FL 32162",
    phone: "352-750-0000",
    note: "In-person utility payments · confirm current hours on DistrictGov",
  },
  {
    name: "South satellite",
    hours: "Mon–Fri 8:00 AM–5:00 PM — confirm before you go",
    address: "4856 South Morse Blvd, The Villages, FL",
    phone: "352-753-4508",
    note: "Customer Service Center",
  },
  {
    name: "North satellite — La Hacienda",
    hours: "Mon–Fri 8:00 AM–5:00 PM — confirm before you go",
    address: "1200 Avenida Central, The Villages, FL",
    phone: "352-753-4508",
    note: "At La Hacienda Recreation",
  },
];

export const CART_SHOPS = [
  {
    name: "Cart World Golf Cars",
    kind: "Authorized Club Car dealer",
    address: "133 W Hermosa St, Lady Lake, FL 32159",
    phone: "352-753-1800",
    page: "https://cartworldgolfcars.com/",
    note: "Lady Lake shop · also Ocala 352-509-2837",
  },
  {
    name: "Village Discount Golf Car",
    kind: "Sales & service",
    address: "8590 E County Rd 466, Suite D, The Villages, FL 32162",
    phone: "352-633-8480",
    page: "https://villagediscountgolfcars.com/",
    note: "Also Summerfield 16330 US-441 and Lady Lake 13891 Hwy 441 (352-633-4440)",
  },
  {
    name: "The Villages Golf Cars — Brownwood",
    kind: "Sales, service & rentals",
    address: "2636 W Torch Lake Dr, The Villages, FL 32163",
    phone: "352-205-8909",
    page: "https://www.thevillagesgolfcars.com/",
    note: "Yamaha, Club Car, E-Z-GO · also 1075 Old Camp Rd 352-753-6750",
  },
  {
    name: "Masters Golf Cars",
    kind: "Club Car · Yamaha · E-Z-GO",
    address: "12885 S US Hwy 441, Belleview, FL 34420",
    phone: "352-307-0111",
    page: "https://mastersgolfcars.com/golf-carts-for-sale-the-villages",
    note: "South of The Villages on 441 since 1999",
  },
];

export function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function unitLabel(unit: string, n: number) {
  if (unit === "miles" || unit === "hours") return unit;
  if (n === 1) {
    if (unit === "days") return "day";
    if (unit === "weeks") return "week";
    if (unit === "months") return "month";
    if (unit === "years") return "year";
  }
  return unit;
}

export function shiftDate(dateStr: string, every: number, unit: string) {
  const base = /^\d{4}-\d{2}-\d{2}$/.test(dateStr)
    ? dateStr
    : new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  const n = Math.max(1, Math.round(Number(every) || 1));
  const [y, m, d] = base.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  if (unit === "days") dt.setUTCDate(dt.getUTCDate() + n);
  else if (unit === "weeks") dt.setUTCDate(dt.getUTCDate() + n * 7);
  else if (unit === "years") dt.setUTCFullYear(dt.getUTCFullYear() + n);
  else dt.setUTCMonth(dt.getUTCMonth() + n);
  return dt.toISOString().slice(0, 10);
}

export function daysUntil(due: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(due)) return null;
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
  const a = Date.parse(`${today}T12:00:00Z`);
  const b = Date.parse(`${due}T12:00:00Z`);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.round((b - a) / 86400000);
}
