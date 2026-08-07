/**
 * Health hub content for The Villages Everything App.
 * Facility phones/addresses are public listings — always confirm before you rely on them.
 * This is neighbor orientation, not medical advice.
 */

export type HealthFacilityKind =
  | "hospital"
  | "er"
  | "urgent"
  | "pharmacy"
  | "helpline"
  | "wellness";

export type HealthFacility = {
  id: string;
  name: string;
  kind: HealthFacilityKind;
  emoji: string;
  blurb: string;
  address?: string;
  city?: string;
  phone?: string;
  /** Secondary line (ER desk, scheduling, etc.) */
  phoneAlt?: string;
  phoneAltLabel?: string;
  hours?: string;
  href?: string;
  mapsQuery?: string;
  /** Soft color accent class suffix */
  accent: "palm" | "coral" | "gold" | "sky" | "lilac";
};

export const HEALTH_HUB = {
  name: "Health in The Villages",
  blurb:
    "Local hospitals and ERs you can actually find on a cart map, plus light wellness tools for steps, water, and “I feel pretty good today.” Not a doctor — just a friendly hub.",
  disclaimer:
    "This page is for general orientation only — not medical advice, diagnosis, or treatment. In an emergency, call 911. Confirm addresses, hours, and phone numbers before you go.",
} as const;

export const HEALTH_EMERGENCY = {
  title: "When it’s an emergency",
  body: "Chest pain, stroke signs (FAST), trouble breathing, severe bleeding, sudden confusion, or a fall with head injury — call 911. Don’t drive yourself if you’re unsure.",
  numbers: [
    { label: "Emergency", value: "911", tel: "911", note: "Police · fire · ambulance" },
    {
      label: "Poison Control",
      value: "1-800-222-1222",
      tel: "18002221222",
      note: "24/7 free & confidential",
    },
    {
      label: "Suicide & Crisis Lifeline",
      value: "988",
      tel: "988",
      note: "Call or text · 24/7",
    },
  ],
} as const;

/** ER vs urgent care — plain-language neighbor guide */
export const CARE_PATH_GUIDE = [
  {
    id: "er",
    title: "Go to the ER / call 911",
    emoji: "🚨",
    items: [
      "Chest pain, pressure, or pain that spreads to arm/jaw",
      "Signs of stroke: face droop, arm weakness, speech trouble",
      "Severe shortness of breath or blue lips",
      "Uncontrolled bleeding, major trauma, or head injury after a fall",
      "Sudden severe headache, seizure, or loss of consciousness",
      "Allergic reaction with swelling or trouble breathing",
    ],
  },
  {
    id: "urgent",
    title: "Urgent care / same-day clinic energy",
    emoji: "🩺",
    items: [
      "Sprains, minor cuts that may need stitches",
      "Fever, flu-ish misery, UTI symptoms (if not severe)",
      "Ear pain, sinus pain, sore throat",
      "Rashes without breathing trouble",
      "When your regular doctor can’t see you soon and it’s not life-threatening",
    ],
  },
  {
    id: "primary",
    title: "Primary care / rec-center wellness",
    emoji: "🌴",
    items: [
      "Med refills, annual physicals, routine labs",
      "Chronic condition check-ins (when stable)",
      "Prevention, vaccines, and “how’s the blood pressure?”",
      "Movement goals: walking, pickleball, rec classes",
    ],
  },
] as const;

/**
 * Local facilities — public contact info for orientation.
 * Brand names change; links go to official org pages where possible.
 */
export const HEALTH_FACILITIES: HealthFacility[] = [
  {
    id: "uf-spanish-plaines",
    name: "UF Health Spanish Plaines Hospital",
    kind: "hospital",
    emoji: "🏥",
    blurb:
      "Full hospital campus in The Villages (longtime locals may still say “The Villages Hospital”). Main line + emergency department on site.",
    address: "1451 El Camino Real",
    city: "The Villages, FL 32159",
    phone: "(352) 751-8000",
    phoneAlt: "(352) 643-7555",
    phoneAltLabel: "ER",
    hours: "ER: 24/7",
    href: "https://ufhealth.org/locations/uf-health-spanish-plaines-hospital",
    mapsQuery: "UF Health Spanish Plaines Hospital The Villages FL",
    accent: "palm",
  },
  {
    id: "uf-brownwood-er",
    name: "UF Health Brownwood Freestanding ER",
    kind: "er",
    emoji: "🚑",
    blurb:
      "Freestanding emergency room near Brownwood — handy when south-end cart paths are closer than the main hospital campus.",
    address: "3800 Meggison Road",
    city: "The Villages, FL 32163",
    phone: "(352) 570-6100",
    hours: "ER: 24/7",
    href: "https://ufhealth.org/locations/uf-health-the-villages-hospital-freestanding-e-r",
    mapsQuery: "UF Health Brownwood Freestanding ER The Villages FL",
    accent: "coral",
  },
  {
    id: "uf-leesburg",
    name: "UF Health Leesburg Hospital",
    kind: "hospital",
    emoji: "🏨",
    blurb:
      "Nearby full-service hospital in Leesburg — another option many Villagers already know from specialists and transfers.",
    address: "600 E Dixie Ave",
    city: "Leesburg, FL 34748",
    phone: "(352) 323-5762",
    hours: "ER: 24/7",
    href: "https://ufhealth.org/locations/uf-health-leesburg-hospital",
    mapsQuery: "UF Health Leesburg Hospital",
    accent: "sky",
  },
  {
    id: "advent-waterman",
    name: "AdventHealth Waterman",
    kind: "hospital",
    emoji: "💙",
    blurb:
      "Hospital in Tavares — common destination for Lake County–side care and specialists.",
    address: "1000 Waterman Way",
    city: "Tavares, FL 32778",
    phone: "(352) 253-3333",
    hours: "ER: 24/7",
    href: "https://www.adventhealth.com/hospital/adventhealth-waterman",
    mapsQuery: "AdventHealth Waterman Tavares FL",
    accent: "lilac",
  },
  {
    id: "advent-ocala",
    name: "AdventHealth Ocala",
    kind: "hospital",
    emoji: "🏥",
    blurb:
      "Larger regional hospital north in Ocala — useful if your specialist or transfer plan points that way.",
    address: "1500 SW 1st Ave",
    city: "Ocala, FL 34471",
    phone: "(352) 351-7200",
    hours: "ER: 24/7",
    href: "https://www.adventhealth.com/hospital/adventhealth-ocala",
    mapsQuery: "AdventHealth Ocala",
    accent: "gold",
  },
  {
    id: "pharmacy-tip",
    name: "Pharmacies on the square path",
    kind: "pharmacy",
    emoji: "💊",
    blurb:
      "CVS, Walgreens, Publix Pharmacy, and in-store clinics are scattered near town squares and main roads. Use your insurance app or call ahead for wait times and drive-thru hours.",
    hours: "Varies by location",
    href: "https://www.google.com/maps/search/pharmacy+near+The+Villages+FL",
    mapsQuery: "pharmacy near The Villages FL",
    accent: "palm",
  },
  {
    id: "villages-rec-wellness",
    name: "Rec centers & movement",
    kind: "wellness",
    emoji: "🏊",
    blurb:
      "Pools, fitness rooms, pickleball, and classes — the unofficial prescription for “I need to move but I’m not joining a cult.”",
    href: "/rec-centers",
    accent: "sky",
  },
  {
    id: "988",
    name: "988 Suicide & Crisis Lifeline",
    kind: "helpline",
    emoji: "💜",
    blurb:
      "Free, confidential support if you or a neighbor is in emotional distress. Call or text 988 — 24/7.",
    phone: "988",
    hours: "24/7",
    href: "https://988lifeline.org/",
    accent: "lilac",
  },
];

export const HEALTH_SNAPSHOT = [
  {
    title: "Know your closest ER",
    body: "Save Spanish Plaines and Brownwood freestanding ER in your phone before you need them. Cart GPS is cute until it isn’t.",
    emoji: "📍",
  },
  {
    title: "Move like a villager",
    body: "Executive nines, rec-center pools, evening square strolls — consistency beats heroic gym resolutions every time.",
    emoji: "🚶",
  },
  {
    title: "Meds & appointments",
    body: "Keep a simple list of meds/allergies in your wallet or phone. Future-you (and any ER) will send a thank-you note.",
    emoji: "📋",
  },
  {
    title: "Heat is a co-author",
    body: "Florida afternoons win arguments. Water, shade, early walks, and “maybe pickleball at 8 a.m.” are power moves.",
    emoji: "☀️",
  },
] as const;

export const WELLNESS_TIPS = [
  "Park the cart one plaza farther and claim the walk as a victory lap.",
  "Fill a water bottle before the band starts — future-you at 9 p.m. is less cranky.",
  "Stretch calves after pickleball. Your tomorrow-morning self is watching.",
  "If the weather app says heat advisory, your ego does not get a vote.",
  "Write tomorrow’s meds next to the coffee maker. Ritual > memory.",
  "A 12-minute neighborhood loop still counts. So does laughing on a porch.",
  "Sunglasses + hat: not a fashion thesis, just smart Florida math.",
  "Swap one sugar-bomb drink this week for sparkling water with citrus. Quiet flex.",
  "Text a neighbor to walk — accountability with better gossip.",
  "Sleep is a wellness plan. The 11 p.m. square encore is optional.",
  "Balance day: one fun thing, one useful thing, one kind thing for yourself.",
  "If your watch congratulates you for standing, accept the award with dignity.",
] as const;

export const DAILY_MOVES = [
  { id: "walk", label: "10-minute cart-path walk", emoji: "🚶", minutes: 10 },
  { id: "water", label: "Extra glass of water", emoji: "💧", minutes: 1 },
  { id: "stretch", label: "Porch stretch (neck/shoulders/hips)", emoji: "🧘", minutes: 5 },
  { id: "stairs", label: "Take the long way at the rec center", emoji: "🏟️", minutes: 8 },
  { id: "square", label: "Evening square stroll (no shopping required)", emoji: "🎶", minutes: 20 },
  { id: "breathe", label: "Four slow breaths before the group chat", emoji: "🌬️", minutes: 2 },
] as const;

export const STRETCHES = [
  {
    name: "Mailbox reach",
    body: "Stand tall, reach both arms overhead, lean gently side to side. Wave at three carts for form credit.",
  },
  {
    name: "Lanai calf drop",
    body: "Heels off a step or curb, slow lower and rise. Great after a “just nine holes” that was not just nine holes.",
  },
  {
    name: "Porch shoulder rolls",
    body: "Big slow circles backward, then forward. Releases “I was on Zoom with the grandkids” tension.",
  },
  {
    name: "Seated ankle alphabet",
    body: "Sit and draw the alphabet with each foot. Airport energy, living-room convenience.",
  },
] as const;

export const MOOD_OPTIONS = [
  { id: "great", label: "Great", emoji: "🌟" },
  { id: "good", label: "Pretty good", emoji: "😊" },
  { id: "okay", label: "Okay", emoji: "😐" },
  { id: "low", label: "Low energy", emoji: "😴" },
  { id: "ouch", label: "Oof day", emoji: "🤒" },
] as const;

export function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export function tipOfDay(d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 0);
  const day = Math.floor((d.getTime() - start.getTime()) / 86400000);
  return WELLNESS_TIPS[day % WELLNESS_TIPS.length];
}

export function stretchOfDay(d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 0);
  const day = Math.floor((d.getTime() - start.getTime()) / 86400000);
  return STRETCHES[day % STRETCHES.length];
}

export function facilityKindLabel(kind: HealthFacilityKind) {
  switch (kind) {
    case "hospital":
      return "Hospital";
    case "er":
      return "Emergency";
    case "urgent":
      return "Urgent care";
    case "pharmacy":
      return "Pharmacy";
    case "helpline":
      return "Helpline";
    case "wellness":
      return "Wellness";
    default:
      return kind;
  }
}
