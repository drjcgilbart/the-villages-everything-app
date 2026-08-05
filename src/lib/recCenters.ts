/**
 * Recreation Centers catalog for The Villages Hub.
 * Addresses, phones, and types are drawn from public districtgov.org listings.
 * Themes/tips are neighbor-oriented orientation notes — not official amenity inventories.
 * Confirm hours, IDs, and closures on districtgov.org / thevillages.com.
 */

export const OFFICIAL_REC_CENTERS_URL =
  "https://www.districtgov.org/recreation/centers/";
export const OFFICIAL_REC_MAP_URL =
  "https://www.districtgov.org/wp-content/uploads/2024/08/maps-recreation.pdf";
export const OFFICIAL_REC_HUB_URL =
  "https://www.thevillages.com/recreation-centers/";

export type RecCenterType = "regional" | "village" | "neighborhood";

export type RecCenter = {
  id: string;
  name: string;
  shortName: string;
  type: RecCenterType;
  address: string;
  phone?: string;
  officialPage: string;
  /** Architecture / vibe theme when known */
  theme: string;
  blurb: string;
  about: string;
  amenities: string[];
  coolBits: { title: string; body: string }[];
  tips: string[];
  /** Local whimsical illustration path */
  image: string;
  areaHint: string;
};

const TYPE_DEFAULTS: Record<
  RecCenterType,
  { hours: string; amenityLine: string; image: string }
> = {
  regional: {
    hours: "Open daily 7:00am – 10:00pm (confirm holidays)",
    amenityLine:
      "Widest amenity mix: gathering rooms, arts & crafts, theater, sports pools, outdoor recreation",
    image: "/graphics/rec-centers/type-regional.jpg",
  },
  village: {
    hours: "Open daily 7:00am – 10:00pm (confirm holidays)",
    amenityLine:
      "Meeting rooms, cards, billiards, family pool, and outdoor facilities typical of village centers",
    image: "/graphics/rec-centers/type-village.jpg",
  },
  neighborhood: {
    hours: "Open daily 7:30am – dusk (confirm seasonally)",
    amenityLine:
      "Adult pools and outdoor fun: bocce, shuffleboard, horseshoes, neighbor hangout energy",
    image: "/graphics/rec-centers/type-neighborhood.jpg",
  },
};

export function typeLabel(type: RecCenterType): string {
  if (type === "regional") return "Regional Complex";
  if (type === "village") return "Village Center";
  return "Neighborhood Area";
}

export function typeHours(type: RecCenterType): string {
  return TYPE_DEFAULTS[type].hours;
}

export function typeAmenityLine(type: RecCenterType): string {
  return TYPE_DEFAULTS[type].amenityLine;
}

function mapsQuery(c: RecCenter): string {
  return `${c.name}, ${c.address}, The Villages, FL`;
}

export function mapsUrl(c: RecCenter): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery(c))}`;
}

/** Regional complexes — full neighbor-oriented writeups */
const REGIONALS: RecCenter[] = [
  {
    id: "paradise",
    name: "Paradise Recreation",
    shortName: "Paradise",
    type: "regional",
    address: "1403 Paradise Drive",
    phone: "352-674-1800",
    officialPage: "https://www.thevillages.com/recreation/paradise/",
    theme: "Tuscan villa energy",
    blurb:
      "A north-side regional hub with Tuscan-style flair — big amenity menu, pools, rooms, and the “meet you at Paradise” classic.",
    about:
      "Paradise is one of the best-known regional complexes: wide amenities, gathering rooms, and outdoor play that pulls residents from multiple villages. Think “main stage of the north” rather than a quiet neighborhood pool.",
    amenities: [
      "Multiple gathering rooms",
      "Arts & crafts spaces",
      "Theater / performance space",
      "Sports pool",
      "Outdoor recreation courts & fields",
    ],
    coolBits: [
      {
        title: "Tuscan postcard vibes",
        body: "Architecture leans warm-villa rather than plain warehouse gym — a favorite for first-time visitor tours.",
      },
      {
        title: "North-end gravity well",
        body: "If friends live Historic Side / Spanish Springs orbit, Paradise is often the default meet-up complex.",
      },
    ],
    tips: [
      "Regional complexes can get busy mid-morning — arrive early for popular rooms.",
      "Confirm theater / special-event calendars on official recreation listings.",
    ],
    image: "/graphics/rec-centers/paradise.jpg",
    areaHint: "North / Paradise Drive corridor",
  },
  {
    id: "la-hacienda",
    name: "La Hacienda Recreation",
    shortName: "La Hacienda",
    type: "regional",
    address: "1200 Avenida Central",
    phone: "352-753-1716",
    officialPage: "https://www.thevillages.com/recreation/la-hacienda/",
    theme: "Spanish hacienda style",
    blurb:
      "Spanish-style regional complex with full-service amenities and weekend At Your Service hours — a classic Villages landmark rec stop.",
    about:
      "La Hacienda brings Spanish colonial-adjacent design to a full regional amenity stack: rooms for clubs, sports pool energy, and outdoor play. It’s a frequent pin on “show the guests the rec centers” tours.",
    amenities: [
      "Gathering & club rooms",
      "Arts & crafts",
      "Theater amenities",
      "Sports pool",
      "Outdoor recreation",
      "At Your Service desk (incl. select weekend hours)",
    ],
    coolBits: [
      {
        title: "Showpiece Spanish style",
        body: "One of the easiest complexes to photograph without trying — arches, plaza energy, cart-path arrival drama.",
      },
      {
        title: "Weekend desk coverage",
        body: "Listed among complexes with weekend At Your Service hours — handy when plans change Saturday morning.",
      },
    ],
    tips: [
      "Pair with a Spanish Springs square evening if you’re cart-path touring the north.",
      "Service animals only inside rec facilities per District policy.",
    ],
    image: "/graphics/rec-centers/la-hacienda.jpg",
    areaHint: "North-central · Avenida Central",
  },
  {
    id: "savannah",
    name: "Savannah Recreation",
    shortName: "Savannah",
    type: "regional",
    address: "1545 Buena Vista Boulevard",
    phone: "352-750-6084",
    officialPage: "https://www.thevillages.com/recreation/savannah/",
    theme: "Southern Savannah charm",
    blurb:
      "Southern-charm regional on Buena Vista Blvd — rooms, pools, outdoor fun, and a polished “gather here” reputation.",
    about:
      "Savannah Recreation sits on the Buena Vista spine and leans southern-hospitality architecture. Expect the full regional toolkit: indoor gathering spaces, pool life, and outdoor courts that fill by late morning.",
    amenities: [
      "Multiple gathering rooms",
      "Arts & crafts",
      "Theater space",
      "Sports pool",
      "Outdoor recreation",
    ],
    coolBits: [
      {
        title: "Buena Vista boulevard energy",
        body: "Easy mental map: if you can find Buena Vista, you can find Savannah.",
      },
      {
        title: "Club-calendar magnet",
        body: "Many resident clubs book regional rooms — check schedules before assuming a room is free to peek into.",
      },
    ],
    tips: [
      "Great midpoint meet for friends spread north–south along Buena Vista.",
      "Bring a water bottle; Florida sun does not care about your shade strategy.",
    ],
    image: "/graphics/rec-centers/savannah.jpg",
    areaHint: "Central corridor · Buena Vista Blvd",
  },
  {
    id: "mulberry-grove",
    name: "Mulberry Grove Recreation",
    shortName: "Mulberry Grove",
    type: "regional",
    address: "8445 SE 165 Mulberry Lane",
    phone: "352-259-6040",
    officialPage: "https://www.thevillages.com/recreation/mulberry-grove/",
    theme: "Grove / southern campus",
    blurb:
      "Regional complex with grove-side campus feel — full amenity set for residents toward the Lady Lake / north-east map edge.",
    about:
      "Mulberry Grove is a regional powerhouse for residents who orient “up near Mulberry.” Same big-complex promise: rooms, crafts, theater amenities, sports pool, and outdoor play.",
    amenities: [
      "Gathering rooms",
      "Arts & crafts",
      "Theater amenities",
      "Sports pool",
      "Outdoor recreation",
    ],
    coolBits: [
      {
        title: "Edge-of-map champion",
        body: "If your cart battery fears long Buena Vista hauls, Mulberry may be your home regional.",
      },
    ],
    tips: [
      "Confirm the SE 165 Mulberry Lane approach once — first visits are where GPS gets creative.",
      "Outdoor facilities can close for quarterly maintenance; check District notices.",
    ],
    image: "/graphics/rec-centers/mulberry-grove.jpg",
    areaHint: "North-east / Mulberry corridor",
  },
  {
    id: "laurel-manor",
    name: "Laurel Manor Recreation",
    shortName: "Laurel Manor",
    type: "regional",
    address: "1985 Laurel Manor Dr",
    phone: "352-751-7110",
    officialPage: "https://www.thevillages.com/recreation/laurel-manor/",
    theme: "English manor polish",
    blurb:
      "Manor-themed regional complex — elegant indoor spaces plus the full outdoor and pool toolkit.",
    about:
      "Laurel Manor brings a more formal, manor-house design language to the regional formula. Inside you’ll find the usual multi-room complex; outside, sports and social courts keep the calendar loud.",
    amenities: [
      "Gathering rooms",
      "Arts & crafts",
      "Theater amenities",
      "Sports pool",
      "Outdoor recreation",
    ],
    coolBits: [
      {
        title: "Dressier architecture",
        body: "If you like rec centers that feel a little “event venue,” Laurel Manor’s theme delivers.",
      },
    ],
    tips: [
      "Popular for clubs that want a polished backdrop — book early for big groups.",
    ],
    image: "/graphics/rec-centers/laurel-manor.jpg",
    areaHint: "Central · Laurel Manor Dr",
  },
  {
    id: "lake-miona",
    name: "Lake Miona Recreation",
    shortName: "Lake Miona",
    type: "regional",
    address: "1526 Buena Vista Boulevard",
    phone: "352-430-2950",
    officialPage: "https://www.thevillages.com/recreation/lake-miona/",
    theme: "Nautical · America’s Cup",
    blurb:
      "Nautical regional on Buena Vista with sports-pool swagger and weekend desk hours — a central-map favorite.",
    about:
      "Lake Miona Recreation leans yacht-club / America’s Cup nautical. It’s a full regional complex with the amenity breadth residents expect, plus a strong “let’s meet at Miona” name recognition along Buena Vista.",
    amenities: [
      "Gathering rooms",
      "Arts & crafts",
      "Theater amenities",
      "Sports pool",
      "Outdoor recreation",
      "At Your Service (incl. select weekend hours)",
    ],
    coolBits: [
      {
        title: "Nautical Instagram bait",
        body: "Even if you never sail, the theme makes the complex feel like a vacation day.",
      },
      {
        title: "Maintenance reality check",
        body: "District notices sometimes close indoor/outdoor/pool areas for quarterly work — peek before you cart over.",
      },
    ],
    tips: [
      "Pair with Lake Sumter Landing for a water-themed day (rec by day, square by night).",
    ],
    image: "/graphics/rec-centers/lake-miona.jpg",
    areaHint: "Central · Buena Vista Blvd",
  },
  {
    id: "colony-cottage",
    name: "Colony Cottage Recreation",
    shortName: "Colony Cottage",
    type: "regional",
    address: "510 Colony Blvd",
    phone: "352-750-1935",
    officialPage: "https://www.thevillages.com/recreation/colony-cottage/",
    theme: "Colonial cottage campus",
    blurb:
      "Cottage-charm regional complex — friendly scale with full regional amenities and a cozy design language.",
    about:
      "Colony Cottage proves regional doesn’t have to mean impersonal. Cottage styling wraps the big amenity menu: rooms, crafts, pool, outdoor courts, and At Your Service support.",
    amenities: [
      "Gathering rooms",
      "Arts & crafts",
      "Theater amenities",
      "Sports pool",
      "Outdoor recreation",
      "At Your Service desk",
    ],
    coolBits: [
      {
        title: "Soft landing for newcomers",
        body: "The cottage theme feels approachable if giant complexes intimidate you.",
      },
    ],
    tips: [
      "Ask At Your Service for the week’s hot classes if you’re new to the calendar.",
    ],
    image: "/graphics/rec-centers/colony-cottage.jpg",
    areaHint: "South-central · Colony Blvd",
  },
  {
    id: "seabreeze",
    name: "SeaBreeze Recreation",
    shortName: "SeaBreeze",
    type: "regional",
    address: "2384 Buena Vista Blvd",
    phone: "352-750-2488",
    officialPage: "https://www.thevillages.com/recreation/seabreeze/",
    theme: "Coastal resort",
    blurb:
      "Coastal-resort regional on Buena Vista — bright, breezy design energy with full complex amenities.",
    about:
      "SeaBreeze (often written Seabreeze) is the coastal-resort cousin of the nautical Lake Miona vibe: airy theming, full regional amenities, and strong resident popularity for pool and outdoor play.",
    amenities: [
      "Gathering rooms",
      "Arts & crafts",
      "Theater amenities",
      "Sports pool",
      "Outdoor recreation",
      "At Your Service +",
    ],
    coolBits: [
      {
        title: "Resort day without leaving town",
        body: "If your mood is “vacation at home,” SeaBreeze’s theme does half the work.",
      },
    ],
    tips: [
      "Sunscreen still required — coastal theme is aesthetic, not shade magic.",
    ],
    image: "/graphics/rec-centers/seabreeze.jpg",
    areaHint: "Central-south · Buena Vista Blvd",
  },
  {
    id: "eisenhower",
    name: "Eisenhower Recreation",
    shortName: "Eisenhower",
    type: "regional",
    address: "3560 Buena Vista Blvd",
    phone: "352-674-8390",
    officialPage: "https://www.thevillages.com/recreation/eisenhower/",
    theme: "Presidential / classic American",
    blurb:
      "Often-mentioned regional landmark on Buena Vista — full complex amenities and weekend desk coverage.",
    about:
      "Eisenhower Recreation is a name you’ll hear in “must-see rec centers” conversations. Classic American / presidential theming wraps a full regional amenity set and dependable At Your Service presence (including weekend hours on the District list).",
    amenities: [
      "Gathering rooms",
      "Arts & crafts",
      "Theater amenities",
      "Sports pool",
      "Outdoor recreation",
      "At Your Service (incl. weekend hours)",
    ],
    coolBits: [
      {
        title: "Resident-recommended classic",
        body: "When neighbors rank regionals, Eisenhower frequently makes the shortlist.",
      },
    ],
    tips: [
      "Weekend desk hours help if you’re sorting guest IDs or activity questions Saturday morning.",
    ],
    image: "/graphics/rec-centers/eisenhower.jpg",
    areaHint: "Central-south · Buena Vista Blvd",
  },
  {
    id: "rohan",
    name: "Rohan Recreation",
    shortName: "Rohan",
    type: "regional",
    address: "850 Kristine Way",
    phone: "352-674-8400",
    officialPage: "https://www.thevillages.com/recreation/rohan/",
    theme: "Irish / Celtic-inspired campus",
    blurb:
      "South-map regional with distinctive name recognition, full amenities, and weekend At Your Service hours.",
    about:
      "Rohan Recreation serves the expanding southern villages with the full regional toolkit. The name alone has made it a cart-path destination; the amenities keep people coming back.",
    amenities: [
      "Gathering rooms",
      "Arts & crafts",
      "Theater amenities",
      "Sports pool",
      "Outdoor recreation",
      "At Your Service (incl. weekend hours)",
    ],
    coolBits: [
      {
        title: "South-end social HQ",
        body: "If your friends live “down by Rohan,” this is often the default complex.",
      },
    ],
    tips: [
      "Growth areas mean busy parking at peak class times — have a plan B lot.",
    ],
    image: "/graphics/rec-centers/rohan.jpg",
    areaHint: "South · Kristine Way",
  },
  {
    id: "fenney",
    name: "Fenney Recreation",
    shortName: "Fenney",
    type: "regional",
    address: "3200 Fenney Way",
    phone: "352-674-8460",
    officialPage: "https://www.thevillages.com/recreation/fenney/",
    theme: "Modern growth-edge campus",
    blurb:
      "Regional complex anchoring the Fenney growth area — newer energy, full amenities, At Your Service +.",
    about:
      "Fenney Recreation is the social and sports hub for one of The Villages’ better-known newer corridors. Expect regional breadth: rooms, crafts, pool, outdoor courts, and a calendar that reflects a still-growing population.",
    amenities: [
      "Gathering rooms",
      "Arts & crafts",
      "Theater amenities",
      "Sports pool",
      "Outdoor recreation",
      "At Your Service +",
    ],
    coolBits: [
      {
        title: "Growth-story rec center",
        body: "Pair a Fenney rec morning with Future Development rubbernecking if you like watching the map expand.",
      },
    ],
    tips: [
      "Neighborhood centers nearby (Blue Heron, Dudley, etc.) handle the pool-and-bocce micro-trips.",
    ],
    image: "/graphics/rec-centers/fenney.jpg",
    areaHint: "South growth · Fenney Way",
  },
  {
    id: "everglades",
    name: "Everglades Recreation",
    shortName: "Everglades",
    type: "regional",
    address: "5497 Marsh Bend Trail",
    phone: "352-674-8434",
    officialPage: "https://www.thevillages.com/recreation/everglades/",
    theme: "Florida wilderness / tropical",
    blurb:
      "Marsh Bend Trail regional with Everglades-inspired theming, full amenities, and weekend desk hours.",
    about:
      "Everglades Recreation brings a Florida-wild / tropical design story to the regional formula. It’s a major complex for residents along the Marsh Bend growth spine.",
    amenities: [
      "Gathering rooms",
      "Arts & crafts",
      "Theater amenities",
      "Sports pool",
      "Outdoor recreation",
      "At Your Service (incl. weekend hours)",
    ],
    coolBits: [
      {
        title: "Theme fits the trail name",
        body: "Marsh Bend + Everglades theming is peak Central Florida storytelling.",
      },
    ],
    tips: [
      "Watch District notices for outdoor facility closures after storms or maintenance weeks.",
    ],
    image: "/graphics/rec-centers/everglades.jpg",
    areaHint: "South · Marsh Bend Trail",
  },
  {
    id: "ezell",
    name: "Ezell Recreation",
    shortName: "Ezell",
    type: "regional",
    address: "769 Marilee Place",
    phone: "352-674-1860",
    officialPage: "https://www.thevillages.com/recreation/ezell/",
    theme: "Newer south / Sawgrass orbit",
    blurb:
      "Regional complex near Marilee Place / Sawgrass Grove energy — newer campus, full amenity stack, At Your Service +.",
    about:
      "Ezell is part of the modern southern recreation map near Sawgrass Grove. It delivers regional-level amenities for residents living on the growth edge who don’t want a long cart ride north for every class.",
    amenities: [
      "Gathering rooms",
      "Arts & crafts",
      "Theater amenities",
      "Sports pool",
      "Outdoor recreation",
      "At Your Service +",
    ],
    coolBits: [
      {
        title: "Square + rec combo day",
        body: "Easy to combine with Sawgrass Grove entertainment when both calendars line up.",
      },
    ],
    tips: [
      "Still a newer pin for some GPS apps — save the Marilee Place address.",
    ],
    image: "/graphics/rec-centers/ezell.jpg",
    areaHint: "South · Marilee Place / Sawgrass",
  },
  {
    id: "olympia",
    name: "Olympia Recreation",
    shortName: "Olympia",
    type: "regional",
    address: "1210 McPherson Terrace",
    phone: "352-674-1841",
    officialPage: "https://www.thevillages.com/recreation/olympia/",
    theme: "Olympic / athletic campus",
    blurb:
      "Regional complex with athletic-campus energy — full amenities and weekend At Your Service hours.",
    about:
      "Olympia Recreation rounds out the regional map with a sporty, campus-like presence. Expect the standard regional amenity breadth and weekend desk coverage listed by the District.",
    amenities: [
      "Gathering rooms",
      "Arts & crafts",
      "Theater amenities",
      "Sports pool",
      "Outdoor recreation",
      "At Your Service (incl. weekend hours)",
    ],
    coolBits: [
      {
        title: "Name writes the mission",
        body: "If your week is pickleball-forward, an “Olympia” pin just feels correct.",
      },
    ],
    tips: [
      "Peak sports hours = peak cart parking. Arrive early or walk the last block.",
    ],
    image: "/graphics/rec-centers/olympia.jpg",
    areaHint: "South growth · McPherson Terrace",
  },
];

type Mini = {
  id: string;
  name: string;
  shortName: string;
  address: string;
  phone?: string;
  path: string;
  areaHint: string;
  theme?: string;
  blurb?: string;
};

const VILLAGE_MINI: Mini[] = [
  { id: "allamanda", name: "Allamanda Recreation", shortName: "Allamanda", address: "1515 St. Charles Place", phone: "352-750-1941", path: "allamanda", areaHint: "St. Charles Place" },
  { id: "aviary", name: "Aviary Recreation", shortName: "Aviary", address: "5748 Morse Boulevard", phone: "352-674-8417", path: "aviary-recreation", areaHint: "Morse Boulevard", theme: "Bird / aviary motif", blurb: "Village center with a memorable name and full village-center amenity pattern — rooms, pool, outdoor play." },
  { id: "bacall", name: "Bacall Recreation", shortName: "Bacall", address: "2041 Canal Street", phone: "352-350-2281", path: "bacall", areaHint: "Canal Street" },
  { id: "big-cypress", name: "Big Cypress Recreation", shortName: "Big Cypress", address: "3110 Hendry Dr", phone: "352-674-8385", path: "big-cypress", areaHint: "Hendry Dr" },
  { id: "blanchard", name: "Blanchard Recreation", shortName: "Blanchard", address: "1512 Craig Court", phone: "352-674-1838", path: "blanchard", areaHint: "Craig Court" },
  { id: "bradenton", name: "Bradenton Recreation", shortName: "Bradenton", address: "1300 Pinellas Place", phone: "352-674-8380", path: "bradenton", areaHint: "Pinellas Place" },
  { id: "bridgeport", name: "Bridgeport Recreation", shortName: "Bridgeport", address: "1670 Lake Miona Dr", phone: "352-259-6590", path: "bridgeport", areaHint: "Lake Miona Dr" },
  { id: "burnsed", name: "Burnsed Recreation", shortName: "Burnsed", address: "4019 Deskin Lane", phone: "352-674-8430", path: "burnsed", areaHint: "Deskin Lane" },
  { id: "canal-street", name: "Canal Street Recreation", shortName: "Canal Street", address: "1513 Canal Street", phone: "352-205-8571", path: "canal-street", areaHint: "Canal Street" },
  { id: "captiva", name: "Captiva Recreation", shortName: "Captiva", address: "658 Pinellas Place", phone: "352-259-7422", path: "captiva", areaHint: "Pinellas Place", theme: "Island / Captiva coastal" },
  { id: "chatham", name: "Chatham Recreation", shortName: "Chatham", address: "7415 SE 172nd Legacy Lane", phone: "352-753-4570", path: "chatham", areaHint: "Legacy Lane" },
  { id: "chula-vista", name: "Chula Vista Recreation", shortName: "Chula Vista", address: "1011 Rio Grande Ave", phone: "352-753-0002", path: "chula-vista", areaHint: "Rio Grande Ave" },
  { id: "churchill-street", name: "Churchill Street Recreation", shortName: "Churchill Street", address: "2375 Churchill Downs", phone: "352-751-6200", path: "churchill-street", areaHint: "Churchill Downs" },
  { id: "coconut-cove", name: "Coconut Cove Recreation", shortName: "Coconut Cove", address: "1398 Stillwater Trail", phone: "352-750-5870", path: "coconut-cove", areaHint: "Stillwater Trail", theme: "Tropical cove" },
  { id: "el-santiago", name: "El Santiago Recreation", shortName: "El Santiago", address: "2373 Enrique Drive", phone: "352-753-1410", path: "el-santiago", areaHint: "Enrique Drive" },
  { id: "first-responders", name: "First Responders Recreation", shortName: "First Responders", address: "7746 SE Highway 42", phone: "352-674-1870", path: "first-responders", areaHint: "SE Highway 42" },
  { id: "fish-hawk", name: "Fish Hawk Recreation", shortName: "Fish Hawk", address: "2318 Buttonwood Run", phone: "352-750-3525", path: "fish-hawk", areaHint: "Buttonwood Run" },
  { id: "franklin", name: "Franklin Recreation", shortName: "Franklin", address: "6750 Meggison Road", phone: "352-674-1989", path: "franklin", areaHint: "Meggison Road" },
  { id: "hibiscus", name: "Hibiscus Recreation", shortName: "Hibiscus", address: "1740 Bailey Trail", phone: "352-751-6761", path: "hibiscus", areaHint: "Bailey Trail" },
  { id: "homestead", name: "Homestead Recreation", shortName: "Homestead", address: "6227 Meggison Road", phone: "352-674-1971", path: "homestead", areaHint: "Meggison Road" },
  { id: "lake-okahumpka", name: "Lake Okahumpka Recreation", shortName: "Lake Okahumpka", address: "4505 Okahumpka Run", phone: "352-674-1887", path: "lake-okahumpka", areaHint: "Okahumpka Run", blurb: "Popular village center near the lake corridor — rooms, family pool, outdoor amenities." },
  { id: "manatee", name: "Manatee Recreation", shortName: "Manatee", address: "1512 Hillsborough Trail", phone: "352-674-8411", path: "manatee", areaHint: "Hillsborough Trail" },
  { id: "moyer", name: "Moyer Recreation", shortName: "Moyer", address: "3000 Moyer Loop", phone: "352-674-8440", path: "moyer", areaHint: "Moyer Loop" },
  { id: "mustang", name: "Mustang Recreation", shortName: "Mustang", address: "See official page", path: "mustang", areaHint: "Confirm on official listing" },
  { id: "odell", name: "Odell Recreation", shortName: "Odell", address: "2260 Odell Circle", phone: "352-750-2700", path: "odell", areaHint: "Odell Circle" },
  { id: "pimlico", name: "Pimlico Recreation", shortName: "Pimlico", address: "530 Belvedere Boulevard", phone: "352-259-6990", path: "pimlico", areaHint: "Belvedere Blvd" },
  { id: "riverbend", name: "Riverbend Recreation", shortName: "Riverbend", address: "1833 Corbin Trail", phone: "352-674-8455", path: "riverbend", areaHint: "Corbin Trail" },
  { id: "saddlebrook", name: "Saddlebrook Recreation", shortName: "Saddlebrook", address: "3010 Saddlebrook Lane", phone: "352-259-5377", path: "saddlebrook", areaHint: "Saddlebrook Lane" },
  { id: "saluki", name: "Saluki Recreation", shortName: "Saluki", address: "7504 Marsh Bend Trail", phone: "352-674-1833", path: "saluki", areaHint: "Marsh Bend Trail" },
  { id: "silver-lake", name: "Silver Lake Recreation", shortName: "Silver Lake", address: "683 Rainbow Boulevard", phone: "352-259-1377", path: "silver-lake", areaHint: "Rainbow Blvd" },
  { id: "southside", name: "Southside Recreation", shortName: "Southside", address: "623 Webb Way", phone: "352-753-1749", path: "southside", areaHint: "Webb Way" },
  { id: "st-tropez", name: "St. Tropez Recreation", shortName: "St. Tropez", address: "6341 McNeill Drive", phone: "352-674-1854", path: "st-tropez", areaHint: "McNeill Drive", theme: "Mediterranean resort nod" },
  { id: "sterling-heights", name: "Sterling Heights Recreation", shortName: "Sterling Heights", address: "2508 St. Charles Place", phone: "352-753-4510", path: "sterling-heights", areaHint: "St. Charles Place" },
  { id: "tierra-del-sol", name: "Tierra Del Sol Recreation", shortName: "Tierra Del Sol", address: "808 San Marino Drive", phone: "352-753-4412", path: "tierra-del-sol", areaHint: "San Marino Drive" },
  { id: "trillium", name: "Trillium Recreation", shortName: "Trillium", address: "2660 Trillium Ridge", phone: "352-674-1968", path: "trillium", areaHint: "Trillium Ridge" },
  { id: "truman", name: "Truman Recreation", shortName: "Truman", address: "2705 Canal Street", phone: "352-751-2650", path: "truman", areaHint: "Canal Street" },
  { id: "water-lily", name: "Water Lily Recreation", shortName: "Water Lily", address: "4710 Marsh Bend Trail", phone: "352-674-1962", path: "water-lily", areaHint: "Marsh Bend Trail" },
];

const NEIGHBORHOOD_MINI: Mini[] = [
  { id: "alden-bungalows", name: "Alden Bungalows Recreation", shortName: "Alden Bungalows", address: "3538 Kiessel Drive", phone: "352-674-8390", path: "alden-bungalows", areaHint: "Kiessel Drive" },
  { id: "amelia", name: "Amelia Recreation", shortName: "Amelia", address: "1970 Odell Circle", phone: "352-750-2700", path: "amelia", areaHint: "Odell Circle" },
  { id: "antrim-dells", name: "Antrim Dells Recreation", shortName: "Antrim Dells", address: "3791 East Torch Lake Dr", phone: "352-674-1800", path: "antrim-dells", areaHint: "E Torch Lake Dr" },
  { id: "ashland", name: "Ashland Recreation", shortName: "Ashland", address: "735 Lynnhaven Lane", phone: "352-674-1800", path: "ashland", areaHint: "Lynnhaven Lane" },
  { id: "belvedere", name: "Belvedere Recreation", shortName: "Belvedere", address: "2860 Churchill Downs", phone: "352-259-6990", path: "belvedere", areaHint: "Churchill Downs" },
  { id: "blue-heron", name: "Blue Heron Recreation", shortName: "Blue Heron", address: "2905 Fenney Way", phone: "352-674-8460", path: "blue-heron", areaHint: "Fenney Way" },
  { id: "bonita", name: "Bonita Recreation", shortName: "Bonita", address: "2541 Canal Street", phone: "352-205-8571", path: "bonita", areaHint: "Canal Street" },
  { id: "bonnybrook", name: "Bonnybrook Recreation", shortName: "Bonnybrook", address: "675 Belvedere Boulevard", phone: "352-674-1800", path: "bonnybrook", areaHint: "Belvedere Blvd" },
  { id: "bradford", name: "Bradford Recreation", shortName: "Bradford", address: "5371 Dray Drive", phone: "352-674-8417", path: "bradford", areaHint: "Dray Drive" },
  { id: "buttonwood", name: "Buttonwood Recreation", shortName: "Buttonwood", address: "2278 Buttonwood Run", phone: "352-750-3525", path: "buttonwood", areaHint: "Buttonwood Run" },
  { id: "calumet-grove", name: "Calumet Grove Recreation", shortName: "Calumet Grove", address: "17100 SE 82nd Calumet Ave", phone: "352-259-6040", path: "calumet-grove", areaHint: "Calumet Ave" },
  { id: "caroline", name: "Caroline Recreation", shortName: "Caroline", address: "1301 Stillwater Trail", phone: "352-750-5870", path: "caroline", areaHint: "Stillwater Trail" },
  { id: "cason-hammock", name: "Cason Hammock Recreation", shortName: "Cason Hammock", address: "5938 Cason Hammock Path", phone: "352-674-1971", path: "cason-hammock", areaHint: "Cason Hammock Path" },
  { id: "cattail", name: "Cattail Recreation", shortName: "Cattail", address: "5219 Marsh Bend Trail", phone: "352-674-8468", path: "cattail", areaHint: "Marsh Bend Trail" },
  { id: "charlotte", name: "Charlotte Recreation", shortName: "Charlotte", address: "3276 Charlotte Court", phone: "352-674-8440", path: "charlotte", areaHint: "Charlotte Court" },
  { id: "chitty-chatty", name: "Chitty Chatty Recreation", shortName: "Chitty Chatty", address: "4911 Chitty Chatty Run", phone: "352-674-8400", path: "chitty-chatty", areaHint: "Chitty Chatty Run" },
  { id: "citrus-grove", name: "Citrus Grove Recreation", shortName: "Citrus Grove", address: "6163 Citrus Grove Street", phone: "352-674-1971", path: "citrus-grove", areaHint: "Citrus Grove St" },
  { id: "clarendon", name: "Clarendon Recreation", shortName: "Clarendon", address: "2796 Tharp Avenue", phone: "352-674-1887", path: "clarendon", areaHint: "Tharp Ave" },
  { id: "collier", name: "Collier Recreation", shortName: "Collier", address: "3355 Hendry Drive", phone: "352-674-8385", path: "collier", areaHint: "Hendry Dr" },
  { id: "cordoba", name: "Cordoba Recreation", shortName: "Cordoba", address: "1233 Morse Boulevard", phone: "352-753-1716", path: "cordoba", areaHint: "Morse Blvd" },
  { id: "creekside-landing", name: "Creekside Landing Recreation", shortName: "Creekside Landing", address: "1075 Peninsula Street", phone: "352-205-8571", path: "creekside-landing", areaHint: "Peninsula St" },
  { id: "dabney", name: "Dabney Recreation", shortName: "Dabney", address: "805 Chandler Drive", phone: "352-674-1989", path: "dabney", areaHint: "Chandler Dr" },
  { id: "deluna", name: "DeLuna Recreation", shortName: "DeLuna", address: "4240 Marsh Bend Trail", phone: "352-674-8434", path: "deluna", areaHint: "Marsh Bend Trail" },
  { id: "dudley", name: "Dudley Recreation", shortName: "Dudley", address: "2470 Fenney Way", phone: "352-674-8460", path: "dudley", areaHint: "Fenney Way" },
  { id: "dunedin", name: "Dunedin Recreation", shortName: "Dunedin", address: "1196 Hillsborough Trail", phone: "352-674-8411", path: "dunedin", areaHint: "Hillsborough Trail" },
  { id: "duval", name: "Duval Recreation", shortName: "Duval", address: "2606 Odell Circle", phone: "352-751-2650", path: "duval", areaHint: "Odell Circle" },
  { id: "edenfield", name: "Edenfield Recreation", shortName: "Edenfield", address: "6426 McNeill Drive", phone: "352-674-1854", path: "edenfield", areaHint: "McNeill Drive" },
  { id: "fernandina", name: "Fernandina Recreation", shortName: "Fernandina", address: "1049 Pinellas Place", phone: "352-674-8380", path: "fernandina", areaHint: "Pinellas Place" },
  { id: "gilchrist", name: "Gilchrist Recreation", shortName: "Gilchrist", address: "1520 Pinellas Place", phone: "352-674-8380", path: "gilchrist", areaHint: "Pinellas Place" },
  { id: "haciendas-mission-hills", name: "Haciendas of Mission Hills Recreation", shortName: "Haciendas of Mission Hills", address: "631 Mission Hills Trail", phone: "352-430-2950", path: "haciendas-of-mission-hills", areaHint: "Mission Hills Trail" },
  { id: "hadley", name: "Hadley Recreation", shortName: "Hadley", address: "2405 Odell Circle", phone: "352-750-2700", path: "hadley", areaHint: "Odell Circle" },
  { id: "hawkins", name: "Hawkins Recreation", shortName: "Hawkins", address: "5807 Hawkins Drive", phone: "352-674-8417", path: "hawkins", areaHint: "Hawkins Dr" },
  { id: "hemingway", name: "Hemingway Recreation", shortName: "Hemingway", address: "2545 Odell Circle", phone: "352-751-2650", path: "hemingway", areaHint: "Odell Circle" },
  { id: "hillsborough", name: "Hillsborough Recreation", shortName: "Hillsborough", address: "1828 Hillsborough Trail", phone: "352-674-8411", path: "hillsborough", areaHint: "Hillsborough Trail" },
  { id: "hilltop", name: "Hilltop Recreation", shortName: "Hilltop", address: "803 St. Andrews Boulevard", phone: "352-259-1377", path: "hilltop", areaHint: "St. Andrews Blvd" },
  { id: "hummingbird", name: "Hummingbird Recreation", shortName: "Hummingbird", address: "3735 Reader Path", phone: "352-674-8460", path: "hummingbird", areaHint: "Reader Path" },
  { id: "labelle", name: "LaBelle Recreation", shortName: "LaBelle", address: "530 Independence Path", phone: "352-674-8430", path: "labelle", areaHint: "Independence Path" },
  { id: "lagrange", name: "LaGrange Recreation", shortName: "LaGrange", address: "1374 LaGrange Loop", phone: "352-674-1841", path: "lagrange", areaHint: "LaGrange Loop" },
  { id: "lake-deaton", name: "Lake Deaton Recreation", shortName: "Lake Deaton", address: "3571 Warnock Road", phone: "352-674-8411", path: "lake-deaton", areaHint: "Warnock Rd" },
  { id: "lake-miona-shores", name: "Lake Miona Shores Recreation", shortName: "Lake Miona Shores", address: "2223 Clearwater Run", phone: "352-751-6200", path: "lake-miona-shores", areaHint: "Clearwater Run" },
  { id: "lake-shore-cottages", name: "Lake Shore Cottages Recreation", shortName: "Lake Shore Cottages", address: "953 Cottage Drive", phone: "352-205-8571", path: "lake-shore-cottages", areaHint: "Cottage Dr" },
  { id: "lakeview", name: "Lakeview Recreation", shortName: "Lakeview", address: "See official page", path: "lakeview", areaHint: "Confirm on official listing" },
  { id: "largo", name: "Largo Recreation", shortName: "Largo", address: "1981 Canal Street", phone: "352-350-2281", path: "largo", areaHint: "Canal Street" },
  { id: "liberty-park", name: "Liberty Park Recreation", shortName: "Liberty Park", address: "1401 St. Charles Place", phone: "352-750-1941", path: "liberty-park", areaHint: "St. Charles Place" },
  { id: "long-prairie", name: "Long Prairie Recreation", shortName: "Long Prairie", address: "See official page", path: "long-prairie", areaHint: "Confirm on official listing" },
  { id: "lynnhaven", name: "Lynnhaven Recreation", shortName: "Lynnhaven", address: "2500 Churchill Street", phone: "352-751-6200", path: "lynnhaven", areaHint: "Churchill St" },
  { id: "mallory-square", name: "Mallory Square Recreation", shortName: "Mallory Square", address: "1721 Odell Circle", phone: "352-750-5870", path: "mallory-square", areaHint: "Odell Circle" },
  { id: "moultrie-creek", name: "Moultrie Creek Recreation", shortName: "Moultrie Creek", address: "7789 Barr Blvd", phone: "352-674-1833", path: "moultrie-creek", areaHint: "Barr Blvd" },
  { id: "oak-hollow", name: "Oak Hollow Recreation", shortName: "Oak Hollow", address: "1637 Craig Court", phone: "352-674-1854", path: "oak-hollow", areaHint: "Craig Court" },
  { id: "osceola-hills", name: "Osceola Hills Recreation", shortName: "Osceola Hills", address: "4234 McDowell Drive", phone: "352-674-8430", path: "osceola-hills", areaHint: "McDowell Dr" },
  { id: "pennecamp", name: "Pennecamp Recreation", shortName: "Pennecamp", address: "1944 Pennecamp Drive", phone: "352-750-3525", path: "pennecamp", areaHint: "Pennecamp Dr" },
  { id: "phillips", name: "Phillips Recreation", shortName: "Phillips", address: "16735 SE 91st Phillips Court", phone: "352-259-6040", path: "phillips", areaHint: "Phillips Court" },
  { id: "pine-hills", name: "Pine Hills Recreation", shortName: "Pine Hills", address: "3422 Moyer Loop", phone: "352-674-8440", path: "pine-hills", areaHint: "Moyer Loop" },
  { id: "pine-ridge", name: "Pine Ridge Recreation", shortName: "Pine Ridge", address: "3174 Moyer Loop", phone: "352-674-8440", path: "pine-ridge", areaHint: "Moyer Loop" },
  { id: "pinellas", name: "Pinellas Recreation", shortName: "Pinellas", address: "2101 Pinellas Place", phone: "352-674-8385", path: "pinellas", areaHint: "Pinellas Place" },
  { id: "poinciana", name: "Poinciana Recreation", shortName: "Poinciana", address: "1901 Bailey Trail", phone: "352-751-6761", path: "poinciana", areaHint: "Bailey Trail" },
  { id: "richmond", name: "Richmond Recreation", shortName: "Richmond", address: "2956 Tharp Avenue", phone: "352-674-1887", path: "richmond", areaHint: "Tharp Ave" },
  { id: "rio-grande", name: "Rio Grande Recreation", shortName: "Rio Grande", address: "1213 Rio Grande Avenue", phone: "352-753-0002", path: "rio-grande", areaHint: "Rio Grande Ave" },
  { id: "sabal-chase", name: "Sabal Chase Recreation", shortName: "Sabal Chase", address: "1795 Canal Street", phone: "352-350-2281", path: "sabal-chase", areaHint: "Canal Street" },
  { id: "sanibel", name: "Sanibel Recreation", shortName: "Sanibel", address: "954 Pinellas Place", phone: "352-674-1800", path: "sanibel", areaHint: "Pinellas Place" },
  { id: "shady-brook", name: "Shady Brook Recreation", shortName: "Shady Brook", address: "7565 Marsh Bend Trail", phone: "352-674-1833", path: "shady-brook", areaHint: "Marsh Bend Trail" },
  { id: "soulliere", name: "Soulliere Recreation", shortName: "Soulliere", address: "16705 SE 74th Soulliere Avenue", phone: "352-259-6040", path: "soulliere", areaHint: "Soulliere Ave" },
  { id: "spanish-moss", name: "Spanish Moss Recreation", shortName: "Spanish Moss", address: "3225 Spanish Moss Way", phone: "352-674-8460", path: "spanish-moss", areaHint: "Spanish Moss Way" },
  { id: "springdale", name: "Springdale Recreation", shortName: "Springdale", address: "17210 SE 86th Belle Meade Circle", phone: "352-259-6040", path: "springdale", areaHint: "Belle Meade Circle" },
  { id: "st-catherine", name: "St. Catherine Recreation", shortName: "St. Catherine", address: "5786 St. Catherine Circle", phone: "352-674-1860", path: "st-catherine", areaHint: "St. Catherine Circle" },
  { id: "st-charles", name: "St. Charles Recreation", shortName: "St. Charles", address: "2126 Bailey Trail", phone: "352-751-6761", path: "st-charles", areaHint: "Bailey Trail" },
  { id: "st-james", name: "St. James Recreation", shortName: "St. James", address: "2429 St. Charles Place", phone: "352-753-4510", path: "st-james", areaHint: "St. Charles Place" },
  { id: "st-johns", name: "St. Johns Recreation", shortName: "St. Johns", address: "1593 Whalin Way", phone: "352-674-8434", path: "st-johns", areaHint: "Whalin Way" },
  { id: "sugar-cane", name: "Sugar Cane Recreation", shortName: "Sugar Cane", address: "2636 Fenney Way", phone: "352-674-8460", path: "sugar-cane", areaHint: "Fenney Way" },
  { id: "summerhill", name: "Summerhill Recreation", shortName: "Summerhill", address: "881 Davenport Drive", phone: "352-259-5377", path: "summerhill", areaHint: "Davenport Dr" },
  { id: "sunset-pointe", name: "Sunset Pointe Recreation", shortName: "Sunset Pointe", address: "1700 Bailey Trail", phone: "352-751-6761", path: "sunset-pointe", areaHint: "Bailey Trail" },
  { id: "swallowtail", name: "Swallowtail Recreation", shortName: "Swallowtail", address: "1615 Corbin Trail", phone: "352-674-8455", path: "swallowtail", areaHint: "Corbin Trail" },
  { id: "tall-trees", name: "Tall Trees Recreation", shortName: "Tall Trees", address: "2078 Tall Trees Lane", phone: "352-751-7110", path: "tall-trees", areaHint: "Tall Trees Lane" },
  { id: "tamarind-grove", name: "Tamarind Grove Recreation", shortName: "Tamarind Grove", address: "2418 Tamarind Grove Run", phone: "352-674-1800", path: "tamarind-grove", areaHint: "Tamarind Grove Run" },
  { id: "virginia-trace", name: "Virginia Trace Recreation", shortName: "Virginia Trace", address: "1311 Canal Street", phone: "352-205-8571", path: "virginia-trace", areaHint: "Canal Street" },
  { id: "waters-edge", name: "Waters Edge Recreation", shortName: "Waters Edge", address: "7223 Barr Boulevard", phone: "352-674-1833", path: "waters-edge", areaHint: "Barr Blvd" },
  { id: "well-point", name: "Well Point Recreation", shortName: "Well Point", address: "6222 McNeill Drive", phone: "352-674-1854", path: "well-point", areaHint: "McNeill Drive" },
  { id: "willow-tree", name: "Willow Tree Recreation", shortName: "Willow Tree", address: "2162 Fenney Way", phone: "352-674-8455", path: "willow-tree", areaHint: "Fenney Way" },
  { id: "winifred", name: "Winifred Recreation", shortName: "Winifred", address: "624 Kingston Way", phone: "352-259-6590", path: "winifred", areaHint: "Kingston Way" },
];

const VILLAGE_IMAGES = [
  "/graphics/rec-centers/village-a.jpg",
  "/graphics/rec-centers/village-b.jpg",
  "/graphics/rec-centers/village-c.jpg",
  "/graphics/rec-centers/village-d.jpg",
];

const NEIGHBORHOOD_IMAGES = [
  "/graphics/rec-centers/neighborhood-a.jpg",
  "/graphics/rec-centers/neighborhood-b.jpg",
  "/graphics/rec-centers/neighborhood-c.jpg",
];

function expandMini(
  m: Mini,
  type: "village" | "neighborhood",
  index: number
): RecCenter {
  const images = type === "village" ? VILLAGE_IMAGES : NEIGHBORHOOD_IMAGES;
  const image = images[index % images.length];
  const typeNoun = type === "village" ? "village center" : "neighborhood rec area";
  return {
    id: m.id,
    name: m.name,
    shortName: m.shortName,
    type,
    address: m.address,
    phone: m.phone,
    officialPage: `https://www.thevillages.com/recreation/${m.path}/`,
    theme: m.theme || (type === "village" ? "Village center campus" : "Neighborhood pool & courts"),
    blurb:
      m.blurb ||
      (type === "village"
        ? `${m.shortName} is a village recreation center — indoor gathering spaces and a family pool pattern, plus outdoor amenities for nearby villages.`
        : `${m.shortName} is a neighborhood recreation area — adult pool and outdoor courts for everyday neighbor hangouts.`),
    about:
      type === "village"
        ? `${m.name} is listed by the District as a Village Center. These centers typically include thoughtfully designed gathering spaces (meeting room, card room, billiards, game room, kitchen) plus a family pool and outdoor facilities. Exact rooms vary by campus — use the official page and At Your Service at nearby regionals for the latest.`
        : `${m.name} is listed as a Neighborhood Area. Neighborhood centers focus on adult pools and outdoor recreation such as bocce, shuffleboard, and horseshoes. Hours are generally 7:30am–dusk. Perfect for a short cart hop when you don’t need a full regional complex.`,
    amenities:
      type === "village"
        ? [
            "Meeting / gathering rooms (varies)",
            "Card room / billiards / game room (typical)",
            "Family pool (typical)",
            "Outdoor recreation facilities",
            "Full-service kitchen on many campuses",
          ]
        : [
            "Adult pool",
            "Bocce courts (typical)",
            "Shuffleboard (typical)",
            "Horseshoe pit (typical)",
            "Outdoor social space",
          ],
    coolBits: [
      {
        title: type === "village" ? "Middle weight fun" : "Micro adventure",
        body:
          type === "village"
            ? "Bigger than a neighborhood pool, closer than a regional complex — the Goldilocks stop for many villages."
            : "When you only need 45 minutes of sun and bocce diplomacy, neighborhood centers win.",
      },
      {
        title: "Always verify",
        body: "Quarterly maintenance and weather closures happen. District “What’s Happening” is your friend.",
      },
    ],
    tips: [
      `Open the official ${m.shortName} page for current photos and amenity notes.`,
      type === "neighborhood"
        ? "Neighborhood hours end at dusk — plan the return cart path with daylight."
        : "Village centers can host clubs; peek the door schedule before assuming a quiet room.",
      "Only certified service animals are allowed in recreation centers (District policy).",
    ],
    image,
    areaHint: m.areaHint,
  };
}

export const REC_CENTERS: RecCenter[] = [
  ...REGIONALS,
  ...VILLAGE_MINI.map((m, i) => expandMini(m, "village", i)),
  ...NEIGHBORHOOD_MINI.map((m, i) => expandMini(m, "neighborhood", i)),
];

export function getRecCenter(id: string): RecCenter | undefined {
  return REC_CENTERS.find((c) => c.id === id);
}

export function recCentersByType(type: RecCenterType): RecCenter[] {
  return REC_CENTERS.filter((c) => c.type === type);
}

export function otherRecCenters(id: string, limit = 8): RecCenter[] {
  const current = getRecCenter(id);
  if (!current) return REC_CENTERS.filter((c) => c.type === "regional").slice(0, limit);
  const sameType = REC_CENTERS.filter(
    (c) => c.type === current.type && c.id !== id
  );
  return sameType.slice(0, limit);
}

export function recCenterCounts() {
  return {
    total: REC_CENTERS.length,
    regional: recCentersByType("regional").length,
    village: recCentersByType("village").length,
    neighborhood: recCentersByType("neighborhood").length,
  };
}
