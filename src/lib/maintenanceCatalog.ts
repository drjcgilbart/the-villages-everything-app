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
    { title: "Battery water and terminals", notes: "Electric carts: check water and clean the posts. Skip this on a lithium pack.", repeatEvery: 1, repeatUnit: "months" },
    { title: "Tire pressure", notes: "Match the sidewall PSI. Low tires show up on cart paths.", repeatEvery: 30, repeatUnit: "days" },
    { title: "Brake check", notes: "Pedal feel and the parking brake on a slope.", repeatEvery: 6, repeatUnit: "months" },
    { title: "Cart service", notes: "Brakes, cables, steering, and the charger cord.", repeatEvery: 6, repeatUnit: "months" },
    { title: "Lights, signals, and horn", notes: "Street carts need these working for an LSV.", repeatEvery: 6, repeatUnit: "months" },
    { title: "LSV registration", notes: "Florida low-speed vehicle renewal. flhsmv.gov", repeatEvery: 12, repeatUnit: "months" },
    { title: "Oil change (gas carts)", notes: "Skip this if the cart is electric.", repeatEvery: 6, repeatUnit: "months" },
  ],
  car: [
    { title: "Oil change", notes: "Use the weight on the door sticker. Florida heat is hard on oil.", repeatEvery: 5000, repeatUnit: "miles" },
    { title: "Tire rotation", notes: "Rotate and look at tread and alignment.", repeatEvery: 6000, repeatUnit: "miles" },
    { title: "Cabin air filter", notes: "Pollen clogs these. The size is usually in the glove box.", repeatEvery: 12, repeatUnit: "months" },
    { title: "Engine air filter", notes: "Check it when you do the cabin filter.", repeatEvery: 12, repeatUnit: "months" },
    { title: "Brake inspection", notes: "Pads, rotors, and fluid.", repeatEvery: 12, repeatUnit: "months" },
    { title: "Wiper blades", notes: "Sun and afternoon storms eat the rubber.", repeatEvery: 12, repeatUnit: "months" },
    { title: "Battery test", notes: "Heat shortens battery life. Test before summer.", repeatEvery: 12, repeatUnit: "months" },
    { title: "Registration and tag", notes: "Florida renewal. Keep the card in the visor. flhsmv.gov", repeatEvery: 12, repeatUnit: "months" },
  ],
  house: [
    { title: "A/C filter", notes: "Dust and pollen. Write the filter size on the air handler.", repeatEvery: 90, repeatUnit: "days" },
    { title: "HVAC service", notes: "Cooling check before summer. Coils, drain, and refrigerant.", repeatEvery: 12, repeatUnit: "months" },
    { title: "Irrigation clock", notes: "Match the District watering days and test the rain sensor.", repeatEvery: 6, repeatUnit: "months" },
    { title: "Water softener salt", notes: "Most homes here are on a softener. Check the brine tank.", repeatEvery: 2, repeatUnit: "months" },
    { title: "Smoke and CO detectors", notes: "Test each detector and replace weak batteries.", repeatEvery: 12, repeatUnit: "months" },
    { title: "Gutters and downspouts", notes: "Clear them before rainy season.", repeatEvery: 6, repeatUnit: "months" },
    { title: "Water heater flush", notes: "Drain a few gallons so sediment does not pile up.", repeatEvery: 12, repeatUnit: "months" },
    { title: "Pest control", notes: "Palmetto bugs and ants. Interior and the lanai.", repeatEvery: 3, repeatUnit: "months" },
    { title: "Dryer vent", notes: "Clean the run to the outside wall. Lint is a fire risk.", repeatEvery: 12, repeatUnit: "months" },
    { title: "Hurricane supplies", notes: "Shutters, batteries, water, and medications before June.", repeatEvery: 12, repeatUnit: "months" },
  ],
  hvac: [
    { title: "Replace filter", notes: "Keep a spare in the garage. Write the size on the unit.", repeatEvery: 90, repeatUnit: "days" },
    { title: "Professional service", notes: "Coils, drain line, and a refrigerant check.", repeatEvery: 12, repeatUnit: "months" },
    { title: "Condensate drain", notes: "A clogged drain is how a ceiling gets a surprise.", repeatEvery: 3, repeatUnit: "months" },
    { title: "Rinse the outdoor coil", notes: "Hose the coil from the inside out. Power off first.", repeatEvery: 6, repeatUnit: "months" },
    { title: "Thermostat batteries", notes: "Replace them before the unit goes blank.", repeatEvery: 12, repeatUnit: "months" },
  ],
  appliance: [
    { title: "Dryer lint and vent", notes: "Clean the trap every load, and the vent hose on this schedule.", repeatEvery: 6, repeatUnit: "months" },
    { title: "Fridge coils and door seal", notes: "Vacuum the coils and wipe the gasket.", repeatEvery: 6, repeatUnit: "months" },
    { title: "Fridge water filter", notes: "Replace the cartridge. Write the date on it.", repeatEvery: 6, repeatUnit: "months" },
    { title: "Dishwasher filter", notes: "Pull the filter and rinse the food trap.", repeatEvery: 3, repeatUnit: "months" },
    { title: "Washer clean cycle", notes: "Run an empty hot cycle. Leave the door ajar after loads.", repeatEvery: 1, repeatUnit: "months" },
    { title: "Range hood filter", notes: "Soak the metal filter. Replace a charcoal one.", repeatEvery: 3, repeatUnit: "months" },
  ],
  pool: [
    { title: "Chemistry check", notes: "Chlorine or salt, pH, and filter pressure.", repeatEvery: 7, repeatUnit: "days" },
    { title: "Skimmer and pump basket", notes: "Empty both so the pump is not sucking air.", repeatEvery: 7, repeatUnit: "days" },
    { title: "Filter clean", notes: "Backwash or rinse the cartridge.", repeatEvery: 1, repeatUnit: "months" },
    { title: "Salt cell clean", notes: "Soak the cell if this pool is a salt system.", repeatEvery: 3, repeatUnit: "months" },
    { title: "Equipment inspection", notes: "Pump, timer, heater, and leaks around the pad.", repeatEvery: 6, repeatUnit: "months" },
  ],
  generator: [
    { title: "Exercise run", notes: "Run it under load for 10 to 15 minutes.", repeatEvery: 30, repeatUnit: "days" },
    { title: "Oil change", notes: "Follow the hours in the manual.", repeatEvery: 100, repeatUnit: "hours" },
    { title: "Battery check", notes: "A dead battery is how it fails in a storm.", repeatEvery: 6, repeatUnit: "months" },
    { title: "Fuel and stabilizer", notes: "Fresh fuel for a portable. Confirm the natural-gas supply on a standby unit.", repeatEvery: 6, repeatUnit: "months" },
    { title: "Air filter", notes: "Inspect and replace if it is dirty.", repeatEvery: 12, repeatUnit: "months" },
  ],
  other: [
    { title: "General service", notes: "A reminder for whatever this thing needs.", repeatEvery: 6, repeatUnit: "months" },
  ],
};

type MaintFieldId = "year" | "make" | "model" | "meter" | "vendor" | "notes";

export type MaintField = {
  id: MaintFieldId;
  label: string;
  placeholder: string;
};

export type MaintKindForm = {
  nameLabel: string;
  namePlaceholder: string;
  blurb: string;
  fields: MaintField[];
};

export const MAINT_KIND_FORMS: Record<string, MaintKindForm> = {
  "golf-cart": {
    nameLabel: "Which golf cart?",
    namePlaceholder: "Yamaha cart, the blue Club Car…",
    blurb: "Check the cart jobs you want on a schedule. Add your own at the bottom.",
    fields: [
      { id: "year", label: "Year (optional)", placeholder: "2019" },
      { id: "make", label: "Make (optional)", placeholder: "Yamaha, Club Car, E-Z-GO" },
      { id: "model", label: "Model (optional)", placeholder: "Drive2, Onward, RXV" },
      { id: "meter", label: "Current miles (optional)", placeholder: "4200" },
      { id: "vendor", label: "Shop (optional)", placeholder: "Cart barn or dealer" },
      { id: "notes", label: "Notes", placeholder: "Gas or electric, battery type, key number" },
    ],
  },
  car: {
    nameLabel: "Which car or truck?",
    namePlaceholder: "The Civic, Jonathan’s truck…",
    blurb: "Check the service you want to remember. Oil and tires follow miles. Tags follow the calendar.",
    fields: [
      { id: "year", label: "Year (optional)", placeholder: "2018" },
      { id: "make", label: "Make (optional)", placeholder: "Toyota, Honda, Ford" },
      { id: "model", label: "Model (optional)", placeholder: "Camry, CR-V, F-150" },
      { id: "meter", label: "Current miles (optional)", placeholder: "12450" },
      { id: "vendor", label: "Shop (optional)", placeholder: "Dealer or local garage" },
      { id: "notes", label: "Notes", placeholder: "VIN, plate, oil weight, tire size" },
    ],
  },
  house: {
    nameLabel: "Which house?",
    namePlaceholder: "3388 Red Oak, the villa…",
    blurb: "Common jobs for a Villages house. Check the ones you want, then add anything else.",
    fields: [
      { id: "year", label: "Year built (optional)", placeholder: "1998" },
      { id: "vendor", label: "Usual contractor (optional)", placeholder: "HVAC, plumber, pest company" },
      { id: "notes", label: "Notes", placeholder: "Filter size, paint color, gate code, softener" },
    ],
  },
  hvac: {
    nameLabel: "Which system?",
    namePlaceholder: "Hall air handler, the package unit…",
    blurb: "Filter, drain, and a yearly service. Add a second system as its own item.",
    fields: [
      { id: "year", label: "Installed (optional)", placeholder: "2016" },
      { id: "make", label: "Brand (optional)", placeholder: "Carrier, Trane, Lennox" },
      { id: "model", label: "Size or model (optional)", placeholder: "3 ton" },
      { id: "vendor", label: "HVAC company (optional)", placeholder: "Who services it" },
      { id: "notes", label: "Notes", placeholder: "Filter size, thermostat, last refrigerant note" },
    ],
  },
  appliance: {
    nameLabel: "Which appliance?",
    namePlaceholder: "Kitchen fridge, the dryer…",
    blurb: "Check the jobs that match this appliance. Leave the rest unchecked.",
    fields: [
      { id: "year", label: "Year (optional)", placeholder: "2020" },
      { id: "make", label: "Brand (optional)", placeholder: "Whirlpool, Samsung, LG" },
      { id: "model", label: "Model (optional)", placeholder: "On the inside sticker" },
      { id: "vendor", label: "Repair shop (optional)", placeholder: "Who you call" },
      { id: "notes", label: "Notes", placeholder: "Serial number, filter size, warranty end" },
    ],
  },
  pool: {
    nameLabel: "Which pool or spa?",
    namePlaceholder: "The lanai pool, the spa…",
    blurb: "Weekly chemistry, plus the filter and the salt cell if you have one.",
    fields: [
      { id: "make", label: "Equipment brand (optional)", placeholder: "Pentair, Hayward, Jandy" },
      { id: "model", label: "Sanitizer (optional)", placeholder: "Salt, chlorine, mineral" },
      { id: "meter", label: "Pump hours (optional)", placeholder: "Only if the pump shows hours" },
      { id: "vendor", label: "Pool company (optional)", placeholder: "Who balances it" },
      { id: "notes", label: "Notes", placeholder: "Gallons, target salt, gate code" },
    ],
  },
  generator: {
    nameLabel: "Which generator?",
    namePlaceholder: "The Generac, the portable Honda…",
    blurb: "A monthly run and an oil change by hours. Add the transfer-switch test if you want it.",
    fields: [
      { id: "year", label: "Year (optional)", placeholder: "2018" },
      { id: "make", label: "Make (optional)", placeholder: "Generac, Kohler, Honda" },
      { id: "model", label: "Model (optional)", placeholder: "22 kW" },
      { id: "meter", label: "Current hours (optional)", placeholder: "140" },
      { id: "vendor", label: "Service company (optional)", placeholder: "Who changes the oil" },
      { id: "notes", label: "Notes", placeholder: "Fuel type, transfer switch, exercise day" },
    ],
  },
  other: {
    nameLabel: "What are you tracking?",
    namePlaceholder: "Boat, bike, well pump…",
    blurb: "Start with a general reminder, then add the jobs that belong to this thing.",
    fields: [
      { id: "year", label: "Year (optional)", placeholder: "2015" },
      { id: "make", label: "Make (optional)", placeholder: "Brand" },
      { id: "model", label: "Model (optional)", placeholder: "Model" },
      { id: "meter", label: "Miles or hours (optional)", placeholder: "Leave blank if it is not metered" },
      { id: "vendor", label: "Shop (optional)", placeholder: "Who services it" },
      { id: "notes", label: "Notes", placeholder: "Anything you need next time" },
    ],
  },
};

export function maintKindForm(kind: string) {
  return MAINT_KIND_FORMS[kind] || MAINT_KIND_FORMS.other;
}

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
