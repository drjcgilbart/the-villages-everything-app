/** Villages entertainment, golf, and pickleball directories with official links (Aug 2026). */

export const TICKETS_HOME = "https://www.thevillagesentertainment.com/";
export const TICKETS_EVENTS = "https://www.thevillagesentertainment.com/ticketed-performances/";
export const TICKETS_LOCATIONS = "https://www.thevillagesentertainment.com/theatres-locations/";
export const KNOW_BEFORE = "https://www.thevillagesentertainment.com/know-before-you-go/";
export const NIGHTLY = "https://www.thevillagesentertainment.com/nightly-entertainment/";
export const SUMMER_HOURS = "https://www.thevillagesentertainment.com/entertainment-summer-hours/";
export const TICKETS_ACCOUNT = "https://tickets.thevillages.com/account/login";
export const TICKET_WALLET = "https://wallet.thevillages.com/";
export const ENT_FACEBOOK = "https://www.facebook.com/TheVillagesEntertainment";
export const PLAYHOUSE = "https://www.thevillagesentertainment.com/playhouse-performances/";
export const LIVE_CAMS = "https://www.thevillages.com/entertainment/live-cams/";
export const SQUARES_HUB = "https://www.thevillages.com/entertainment/town-squares/";
export const MORE_VENUES = "https://www.thevillages.com/entertainment/more-venues/";
export const POLO_SITE = "https://thevillagespoloclub.com/";
export const TICKETS_EMAIL = "tickets@thevillages.com";

export const SQUARES = [
  {
    id: "spanish-springs",
    label: "Spanish Springs",
    town: "Lake County side",
    hours: "Free live music most nights · typically 5–9pm; summer (Jun 1–Sep 30) 6–10pm",
    address: "1051 Main St, The Villages, FL 32159",
    phone: "352-750-5411",
    map: "Spanish Springs Town Square, 1051 Main St, The Villages, FL 32159",
    page: "https://www.thevillagesentertainment.com/spanish-springs/",
  },
  {
    id: "lake-sumter",
    label: "Lake Sumter Landing",
    town: "Sumter County",
    hours: "Free live music most nights · typically 5–9pm; summer (Jun 1–Sep 30) 6–10pm",
    address: "1020 Lake Sumter Landing, The Villages, FL 32162",
    phone: "352-750-5411",
    map: "Lake Sumter Landing Market Square, 1020 Lake Sumter Landing, The Villages, FL 32162",
    page: "https://www.thevillagesentertainment.com/lake-sumter-landing/",
  },
  {
    id: "brownwood",
    label: "Brownwood Paddock Square",
    town: "Brownwood / Sumter",
    hours: "Free live music most nights · typically 5–9pm; summer (Jun 1–Sep 30) 6–10pm",
    address: "2726 Brownwood Blvd, The Villages, FL 32163",
    phone: "352-750-5411",
    map: "Brownwood Paddock Square, 2726 Brownwood Blvd, The Villages, FL 32163",
    page: "https://www.thevillagesentertainment.com/brownwood-paddock-square/",
  },
  {
    id: "sawgrass",
    label: "Sawgrass Grove",
    town: "South of 466 / Fenney side",
    hours: "Nightly entertainment — often midday + evening; confirm the weekly lineup",
    address: "766 Marilee Place, The Villages, FL 34785",
    phone: "352-750-5411",
    map: "Sawgrass Grove, 766 Marilee Place, The Villages, FL 34785",
    page: "https://www.thevillagesentertainment.com/sawgrass-grove/",
  },
  {
    id: "eastport",
    label: "Eastport",
    town: "Middleton / east side",
    hours: "Nightly entertainment — check the weekly lineup",
    address: "7025 Central Lake Dr, The Villages, FL 34762",
    phone: "352-750-5411",
    map: "Eastport, 7025 Central Lake Dr, The Villages, FL 34762",
    page: "https://www.thevillagesentertainment.com/eastport/",
  },
];

export const VENUES = [
  {
    id: "sharon",
    name: "The Sharon Performing Arts Center",
    kind: "Theater",
    note: "Just over 1,000 seats. Broadway tours, concerts, comedy, dance, and orchestra. Lobby usually opens ~1 hour before showtime.",
    address: "1051 Main Street, The Villages, FL 32159",
    phone: "352-751-7799",
    page: "https://www.thesharon.com/",
    tickets: TICKETS_HOME,
  },
  {
    id: "savannah",
    name: "Savannah Center",
    kind: "Shows & events",
    note: "About 850 seats. Concerts, comedy, touring shows, and resident-group theatre.",
    address: "1545 N Buena Vista Blvd, The Villages, FL 32162",
    phone: "352-753-3229",
    page: "https://www.thevillagesentertainment.com/savannah-shows/",
    tickets: TICKETS_HOME,
  },
  {
    id: "tracy",
    name: "The Tracy Performing Arts Center",
    kind: "Theater",
    note: "Up to 912 seats on The Villages Charter School campus in Middleton. Student and guest productions.",
    address: "2210 Dr. Randy McDaniel Way, Middleton, FL 34762",
    phone: "352-753-6600",
    page: "https://thetracy.com/",
    tickets: "https://thetracy.com/",
  },
  {
    id: "sigpro",
    name: "The SigPro Studio",
    kind: "Black box theatre",
    note: "Formerly The Studio Theatre at Tierra del Sol. Now at Lake Sumter Landing — 200+ seats, plays and musicals. Flexible thrust/proscenium staging.",
    address: "1030 Old Mill Run, The Villages, FL 32162",
    phone: "352-668-9502",
    page: "https://www.thesigprostudio.com/",
    tickets: TICKETS_HOME,
  },
  {
    id: "old-mill",
    name: "Epic Theatres Old Mill Playhouse",
    kind: "Movies & playhouse",
    note: "Movies plus Playhouse Performances. Playhouse tickets via The Villages Entertainment.",
    address: "1000 Old Mill Run, The Villages, FL 32162",
    phone: "",
    page: PLAYHOUSE,
    tickets: PLAYHOUSE,
  },
  {
    id: "katie-belles",
    name: "Katie Belle's",
    kind: "Nightclub",
    note: "Late dancing at Lake Sumter Landing.",
    address: "1105 Main St, Lake Sumter Landing, The Villages, FL 32162",
    phone: "",
    page: "https://www.thevillagesentertainment.com/lake-sumter-landing/",
    tickets: TICKETS_HOME,
  },
  {
    id: "polo",
    name: "The Villages Polo Club",
    kind: "Sporting events",
    note: "Spring season typically late Jan–early May (2026: Jan 30–May 3). Gate admission $25 cash; kids 12 & under free in general admission. Gates open 90 minutes before match.",
    address: "700 N Buena Vista Blvd, The Villages, FL 32162",
    phone: "352-750-7656",
    page: POLO_SITE,
    tickets: "https://thevillagespoloclub.com/admission/",
  },
  {
    id: "range",
    name: "The Range at H.G. Morse Stadium",
    kind: "Sporting events",
    note: "Charter School Middleton campus — Buffalo football and outdoor stadium events. Tickets through The Villages Entertainment / Bound when posted.",
    address: "2210 Dr. Randy McDaniel Way, Middleton, FL 34762",
    phone: "352-259-3777",
    page: MORE_VENUES,
    tickets: TICKETS_HOME,
  },
  {
    id: "rec",
    name: "Neighborhood recreation center",
    kind: "Clubs & cards",
    note: "Bingo, mahjong, line dancing, and cards — add yours under Rec clubs. Directory on DistrictGov.",
    address: "",
    phone: "",
    page: "https://www.districtgov.org/recreation/centers/",
    tickets: "https://www.districtgov.org/programs/",
  },
];

export const SHOW_VENUES = [
  "The Sharon Performing Arts Center",
  "Savannah Center",
  "The Tracy Performing Arts Center",
  "The SigPro Studio",
  "Epic Theatres Old Mill Playhouse",
  "Spanish Springs Town Square",
  "Lake Sumter Landing",
  "Brownwood Paddock Square",
  "Sawgrass Grove",
  "Eastport",
  "Katie Belle's",
  "The Villages Polo Club",
  "The Range at H.G. Morse Stadium",
];

export const BOX_OFFICES = [
  {
    name: "Lake Sumter Landing box office",
    hours: "Mon–Fri 10:00 AM–3:00 PM · Lake Sumter Landing Sales Office",
    address: "1000 Lake Sumter Landing, The Villages, FL 32162",
  },
  {
    name: "Brownwood box office",
    hours: "Mon–Fri 10:00 AM–3:00 PM · across from Dunkin’",
    address: "2726 Brownwood Blvd, The Villages, FL 32163",
  },
  {
    name: "Spanish Springs / The Sharon box office",
    hours: "Mon–Fri 10:00 AM–3:00 PM",
    address: "1051 Main Street, The Villages, FL 32159",
  },
  {
    name: "Remote box office & customer service",
    hours: "Mon–Sat 10:00 AM–5:00 PM (summer hours may apply)",
    address: "tickets@thevillages.com · (352) 753-3229",
  },
  {
    name: "Administrative office (by appointment)",
    hours: "Call (352) 750-5411",
    address: "2741 W Torch Lake Dr, The Villages, FL 32163",
  },
];

export const GOLF_HUB = {
  home: "https://www.thevillages.com/golf/",
  tees: "https://www.thevillages.com/golf/tee-times/",
  golfTheVillages: "https://www.golfthevillages.com/",
  championship: "https://www.golfthevillages.com/championship-golf/",
  map: "https://www.golfthevillages.com/images/thevillagesgolfmap.pdf",
  phoneGuide: "https://www.golfthevillages.com/images/telephonedirectory.pdf",
  locator: "https://www.golfthevillages.com/locator/index.asp",
  executive: "https://www.districtgov.org/golf/executive/",
  execOverview: "https://www.thevillages.com/golf/executive/",
  execGtv: "https://www.golfthevillages.com/executive-golf/",
  trailFees: "https://www.districtgov.org/golf/trail-fees/",
  trailApp: "https://www.golfthevillages.com/executive-golf/images/trailfeeapp.pdf",
  trailBuy: "https://membership.golfthevillages.com/",
  pairings: "https://www.golfthevillages.com/executive-golf/exec-pairings.asp",
  rates: "https://www.thevillages.com/golf/rates/",
  faq: "https://www.golfthevillages.com/executive-golf/faq.asp",
  goodGolf: "https://www.golfthevillages.com/golf-in-the-villages/goodgolfguide.pdf",
  currentRates: "https://www.golfthevillages.com/whatsnew/Current%20Rates.pdf",
  ghin: "https://www.ghin.com/",
  phone: "352-753-4653",
  questions: "352-750-4558",
  admin: "352-753-3396",
};

export const PICKLE_HUB = {
  home: "https://www.thevillages.com/recreation/pickleball/",
  pickleballers: "https://www.thevillages.com/recreation/pickleballers/",
  calendar: "https://www.thevillages.com/calendar/",
  clubs: "https://www.thevillages.com/recreation/clubs",
  sports: "https://www.districtgov.org/recreation/sports/",
  centers: "https://www.districtgov.org/recreation/centers/",
  recMap: "https://www.districtgov.org/wp-content/uploads/2026/03/Recreation-Map-Update-0326.pdf",
  recFlip: "https://online.flippingbook.com/view/10419946/",
  recHub: "https://www.thevillages.com/recreation-centers/",
  dupr: "https://www.dupr.com/",
  duprDash: "https://dashboard.dupr.com/",
  tvcpc: "https://www.tvcpc.com/",
  tvcpcFaq: "https://www.tvcpc.com/faq/",
  lessons: "https://pickleballcommunity.com/",
  usap: "https://usapickleball.org/what-is-pickleball/court-diagram/",
};

export type GolfCourse = {
  id: string;
  name: string;
  kind: string;
  holes: number;
  code?: string;
  phone?: string;
  address?: string;
  note?: string;
  level?: string;
};

function gc(
  id: string,
  name: string,
  kind: string,
  extra: Partial<GolfCourse> = {}
): GolfCourse {
  return {
    ...extra,
    id,
    name,
    kind,
    holes: extra.holes ?? (kind === "championship" ? 18 : 9),
  };
}

/** Official Golf The Villages telephone directory (VGOLF175_1025) + putting/practice notes. */
export const GOLF_COURSES: GolfCourse[] = [
  gc("belle-glade", "Belle Glade", "championship", { code: "087", phone: "352-674-2700", address: "434 Moyer Loop, The Villages, FL 32163" }),
  gc("bonifay", "Bonifay", "championship", { code: "040", phone: "352-753-1776", address: "1033 Pinellas Place, The Villages, FL 32163", holes: 27, note: "Destin, Fort Walton, Pensacola nines" }),
  gc("cane-garden", "Cane Garden", "championship", { code: "028", phone: "352-751-7029", address: "1728 Bailey Trail, The Villages, FL 32162", note: "Hibiscus, Jacaranda, Allamanda nines" }),
  gc("evans-prairie", "Evans Prairie", "championship", { code: "044", phone: "352-205-8910", address: "1824 Evans Prairie Trail, The Villages, FL 32163" }),
  gc("glenview-champions", "Glenview Champions", "championship", { code: "019", phone: "352-753-3345", address: "3190 Glenview Rd, The Villages, FL 32162", holes: 27, note: "Talley Ho, Fox Run, Stirrup Cup · driving range" }),
  gc("hacienda-hills", "Hacienda Hills", "championship", { code: "018", phone: "352-753-5155", address: "1195 Morse Blvd, The Villages, FL 32159", holes: 27, note: "Lakes, Oaks, Palms nines" }),
  gc("havana", "Havana", "championship", { code: "036", phone: "352-750-8085", address: "2488 O'Dell Circle, The Villages, FL 32162", note: "Kenya, Hemingway, Kilimanjaro nines" }),
  gc("lopez-legacy", "Nancy Lopez Legacy", "championship", { code: "020", phone: "352-753-1450", address: "17145 Buena Vista Blvd, The Villages, FL 32162", note: "Ashley Meadows, Torri Pines, Erinn Glenn · aqua driving range" }),
  gc("mallory-hill", "Mallory Hill", "championship", { code: "032", phone: "352-753-3730", address: "1675 O'Dell Circle, The Villages, FL 32162", holes: 27, note: "Virginia, Caroline, Amelia nines" }),
  gc("orange-blossom-hills", "Orange Blossom Hills", "championship", { code: "010", phone: "352-753-5200", address: "1548 Water Tower Circle, The Villages, FL 32159" }),
  gc("palmer-legends", "Palmer Legends", "championship", { code: "024", phone: "352-753-5300", address: "1645 Palmer Way, The Villages, FL 32162", note: "Arnold Palmer design · Cherry Hill, Laurel Valley, Riley Grove · driving range" }),
  gc("shallow-creek", "Shallow Creek", "championship", { code: "095", phone: "352-753-6696", address: "8007 Landstone Blvd, The Villages, FL 33585", note: "Opened 2024" }),
  gc("southern-oaks", "Southern Oaks", "championship", { code: "094", phone: "352-753-6740", address: "766 Marilee Place, Suite 110, The Villages, FL 32163" }),
  gc("tierra-del-sol", "Tierra Del Sol", "championship", { code: "011", phone: "352-750-4600", address: "806 San Marino Dr, The Villages, FL 32159" }),
  gc("woodlands", "Woodlands", "championship", { code: "106", phone: "352-915-7260", address: "1480 Craig Ct, The Villages, FL 33585", note: "Opened 2025" }),
  gc("amberwood", "Amberwood", "executive", { code: "061", phone: "352-750-0423", address: "7415 SE 172nd Legacy Ln, The Villages, FL 32159", level: "L4" }),
  gc("bacall", "Bacall", "executive", { code: "069", phone: "352-430-3431", address: "2042 Canal St, The Villages, FL 32162", level: "L3" }),
  gc("beautyberry", "Beautyberry", "executive", { code: "108", phone: "352-674-1849", address: "7600 Busche Blvd, The Villages, FL 34762", level: "L4", note: "Opened 2026 · shares shop with Honeysuckle" }),
  gc("bellaire", "Bellaire", "executive", { code: "105", phone: "352-674-8409", address: "7028 Beebe Ct, The Villages, FL 33585", level: "L2", note: "Opened 2025 · Central Lake / Eastport" }),
  gc("belmont", "Belmont", "executive", { code: "065", phone: "352-750-2019", address: "534 Belvedere Blvd, The Villages, FL 32162", level: "L4" }),
  gc("bogart", "Bogart", "executive", { code: "068", phone: "352-430-3431", address: "2042 Canal St, The Villages, FL 32162", level: "L2" }),
  gc("bonita-pass", "Bonita Pass", "executive", { code: "076", phone: "352-750-8029", address: "2313 Buttonwood Run, The Villages, FL 32162", level: "L3" }),
  gc("briarwood", "Briarwood", "executive", { code: "060", phone: "352-259-2967", address: "8501 SE 172nd Legacy Ln, The Villages, FL 32159", level: "L3" }),
  gc("chula-vista", "Chula Vista", "executive", { code: "052", phone: "352-753-4170", address: "1019 Rio Grand Ave, Lady Lake, FL 32159", level: "L1" }),
  gc("churchill-greens", "Churchill Greens", "executive", { code: "064", phone: "352-750-2019", address: "534 Belvedere Blvd, The Villages, FL 32162", level: "L3" }),
  gc("de-la-vista", "De La Vista", "executive", { code: "054", phone: "352-753-0977", address: "803 San Marino Blvd, The Villages, FL 32159", level: "L2" }),
  gc("el-diablo", "El Diablo", "executive", { code: "055", phone: "352-750-6670", address: "2381 Enrique Dr, The Villages, FL 32159", level: "L3" }),
  gc("el-santiago", "El Santiago", "executive", { code: "056", phone: "352-750-6670", address: "2381 Enrique Dr, The Villages, FL 32159", level: "L1" }),
  gc("escambia", "Escambia", "executive", { code: "084", phone: "352-674-2707", address: "3020 Moyer Loop, The Villages, FL 32163", level: "L3", note: "Night golf Wed & Fri · book via Belle Glade shop" }),
  gc("gray-fox", "Gray Fox", "executive", { code: "048", phone: "352-205-8902", address: "5674 Hummingbird Lane, The Villages, FL 32163", level: "L4" }),
  gc("hawkes-bay", "Hawkes Bay", "executive", { code: "058", phone: "352-753-8043", address: "740 Buena Vista Blvd, The Villages, FL 32159", level: "L2" }),
  gc("heron", "Heron", "executive", { code: "066", phone: "352-205-7427", address: "1261 Sunset Point Blvd, The Villages, FL 32162", level: "L3" }),
  gc("hill-top", "Hill Top", "executive", { code: "051", phone: "352-753-8276", address: "1432 Water Tower Circle, The Villages, FL 32159", level: "L2" }),
  gc("honeysuckle", "Honeysuckle", "executive", { code: "107", phone: "352-674-1849", address: "7600 Busche Blvd, The Villages, FL 34762", level: "L3", note: "Opened 2026 · shares shop with Beautyberry" }),
  gc("laurel-oak", "Laurel Oak", "executive", { code: "103", phone: "352-674-1889", address: "6345 McNeill Dr, The Villages, FL 33585", level: "L4" }),
  gc("live-oak", "Live Oak", "executive", { code: "104", phone: "352-674-1889", address: "6345 McNeill Dr, The Villages, FL 33585", level: "SG", note: "Specialty golf" }),
  gc("loblolly", "Loblolly", "executive", { code: "086", phone: "352-259-6452", address: "2197 Fenney Way, The Villages, FL 32163", level: "L3" }),
  gc("longleaf", "Longleaf", "executive", { code: "091", phone: "352-259-6451", address: "2217 Fenney Way, The Villages, FL 32163", level: "L3" }),
  gc("lowlands", "Lowlands", "executive", { code: "093", phone: "352-751-7786", address: "5197 Marsh Bend Trail, The Villages, FL 32163", level: "L2" }),
  gc("mangrove", "Mangrove", "executive", { code: "081", phone: "352-751-2335", address: "3198 Hendry Drive, The Villages, FL 32163", level: "L4" }),
  gc("marsh-view", "Marsh View Pitch & Putt", "pitch-putt", { code: "092", phone: "352-751-7788", address: "5223 Marsh Bend Trail, The Villages, FL 32163", holes: 18, level: "SG", note: "Cart-free · 40–110 yards · about 90 minutes" }),
  gc("mickylee", "Mickylee", "executive", { code: "102", phone: "352-751-7782", address: "6772 Meggison Road, The Villages, FL 32163", level: "SG", note: "Specialty golf" }),
  gc("mira-mesa", "Mira Mesa", "executive", { code: "053", phone: "352-753-0436", address: "998 Rio Grande Ave, The Villages, FL 32159", level: "L3" }),
  gc("oakleigh", "Oakleigh", "executive", { code: "062", phone: "352-750-0423", address: "7415 SE 172nd Legacy Ln, The Villages, FL 32159", level: "L3" }),
  gc("okeechobee", "Okeechobee", "executive", { code: "085", phone: "352-674-2707", address: "3020 Moyer Loop, The Villages, FL 32163", level: "L4" }),
  gc("palmetto", "Palmetto", "executive", { code: "079", phone: "352-205-8911", address: "3106 Hendry Drive, The Villages, FL 32163", level: "L3" }),
  gc("pelican", "Pelican", "executive", { code: "067", phone: "352-205-7427", address: "1261 Sunset Point Blvd, The Villages, FL 32162", level: "L4" }),
  gc("pimlico", "Pimlico", "executive", { code: "063", phone: "352-750-2019", address: "534 Belvedere Blvd, The Villages, FL 32162", level: "L2" }),
  gc("red-fox", "Red Fox", "executive", { code: "049", phone: "352-205-8902", address: "5674 Hummingbird Lane, The Villages, FL 32163", level: "L3" }),
  gc("redfish-run", "Redfish Run", "executive", { code: "077", phone: "352-750-6730", address: "2376 Nobelton Lane, The Villages, FL 32162", level: "L3" }),
  gc("richmond", "Richmond", "executive", { code: "101", phone: "352-751-7781", address: "4468 Burgess Drive, The Villages, FL 32163", level: "SG", note: "Specialty golf" }),
  gc("roosevelt", "Roosevelt", "executive", { code: "073", phone: "352-750-2374", address: "2735 Canal St, The Villages, FL 32162", level: "L4" }),
  gc("saddlebrook", "Saddlebrook", "executive", { code: "057", phone: "352-753-8201", address: "2980 Saddlebrook Ln, The Villages, FL 32159", level: "L2", note: "Night golf Tue, Thu & Sat · book via Glenview shop" }),
  gc("sandhill", "Sandhill", "executive", { code: "070", phone: "352-259-2128", address: "2580 Buena Vista Blvd, The Villages, FL 32162", level: "L2" }),
  gc("sarasota", "Sarasota", "executive", { code: "083", phone: "352-674-2706", address: "2991 Morse Blvd, The Villages, FL 32163", level: "L1" }),
  gc("silver-lake", "Silver Lake", "executive", { code: "050", phone: "352-753-5151", address: "679 Rainbow Blvd, The Villages, FL 32159", level: "L2" }),
  gc("southern-star", "Southern Star", "executive", { code: "075", phone: "352-259-3018", address: "2514 St. Charles Pl, The Villages, FL 32162", level: "L3" }),
  gc("sweetgum", "Sweetgum", "executive", { code: "080", phone: "352-751-2335", address: "3198 Hendry Drive, The Villages, FL 32163", level: "L3" }),
  gc("tarpon-boil", "Tarpon Boil", "executive", { code: "078", phone: "352-750-6730", address: "2376 Nobelton Lane, The Villages, FL 32162", level: "L3" }),
  gc("truman", "Truman", "executive", { code: "072", phone: "352-750-2374", address: "2735 Canal St, The Villages, FL 32162", level: "L4" }),
  gc("turtle-mound", "Turtle Mound", "executive", { code: "071", phone: "352-750-6907", address: "2605 Turtle Mound Path, The Villages, FL 32162", level: "L1" }),
  gc("volusia", "Volusia", "executive", { code: "082", phone: "352-674-2710", address: "128 Moyer Loop, The Villages, FL 32163", level: "L2" }),
  gc("walnut-grove", "Walnut Grove", "executive", { code: "059", phone: "352-259-2967", address: "8501 SE 172nd Legacy Ln, The Villages, FL 32159", level: "L3" }),
  gc("yankee-clipper", "Yankee Clipper", "executive", { code: "074", phone: "352-259-3018", address: "2514 St. Charles Pl, The Villages, FL 32162", level: "L3" }),
  gc("fenney-putt-play", "Fenney Putt & Play", "pitch-putt", { phone: "352-674-8460", address: "3200 Fenney Way, The Villages, FL 32163", note: "At Fenney Recreation Center · short-game fun" }),
  gc("clifton-cove", "Clifton Cove Putting Course", "putting", { phone: "352-674-1860", address: "769 Marilee Place, The Villages, FL 32163", note: "At Ezell Recreation Center" }),
  gc("first-responders-putting", "First Responders Putting Course", "putting", { phone: "352-674-1870", address: "7746 SE Highway 42, The Villages, FL", note: "At First Responders Recreation" }),
  gc("jubilee-putting", "Jubilee Putting Course", "putting", { phone: "352-674-1989", address: "6750 Meggison Road, The Villages, FL", note: "At Franklin Recreation" }),
  gc("saratoga-practice", "Palmer Legends Golf Academy", "practice", { phone: "352-259-8121", address: "1627 Palmer Way, The Villages, FL 32162", note: "Aqua range · lessons" }),
  gc("sarasota-range", "Sarasota Golf Center Range", "practice", { phone: "352-750-8320", address: "133 Moyer Loop, The Villages, FL 32163", note: "Range · academy 352-259-2077" }),
  gc("central-lake-range", "Central Lake Golf Shop & Range", "practice", { phone: "352-753-6658", address: "7034 Beebe Ct, The Villages, FL 33585", note: "Academy 352-753-6659 · 7152 Beebe Ct" }),
];

export type PickleCourt = {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  courts?: number;
  lighted?: boolean;
  indoor?: boolean;
  hub?: boolean;
  note?: string;
};

function pb(id: string, name: string, extra: Partial<PickleCourt> = {}): PickleCourt {
  return { id, name, ...extra };
}

/** Rec-center pickleball directory — phones/addresses from District / Hub rec catalog. */
export const PICKLE_COURTS: PickleCourt[] = [
  pb("rohan", "Rohan Recreation", { phone: "352-674-8400", address: "850 Kristine Way, The Villages, FL 32163", courts: 18, lighted: true, hub: true, note: "Biggest outdoor complex · lighted · open play magnet" }),
  pb("ezell", "Ezell Recreation", { phone: "352-674-1860", address: "769 Marilee Place, The Villages, FL 32163", courts: 12, hub: true, note: "Sawgrass Grove regional · 12 dedicated courts" }),
  pb("olympia", "Olympia Recreation", { phone: "352-674-1841", address: "1210 McPherson Terrace, The Villages, FL", courts: 12, hub: true }),
  pb("everglades", "Everglades Recreation", { phone: "352-674-8434", address: "5497 Marsh Bend Trail, The Villages, FL", courts: 12, hub: true }),
  pb("colony-cottage", "Colony Cottage Recreation", { phone: "352-750-1935", address: "510 Colony Blvd, The Villages, FL 32162", courts: 6, hub: true }),
  pb("lake-miona", "Lake Miona Recreation", { phone: "352-430-2950", address: "1526 Buena Vista Blvd, The Villages, FL 32162", hub: true, note: "Regional · intro classes often here" }),
  pb("eisenhower", "Eisenhower Recreation", { phone: "352-674-8390", address: "3560 Buena Vista Blvd, The Villages, FL", hub: true }),
  pb("st-tropez", "St. Tropez Recreation", { phone: "352-674-1854", address: "6341 McNeill Drive, The Villages, FL 33585", indoor: true, hub: true, courts: 6, note: "Indoor courts · heat/rain backup" }),
  pb("la-hacienda", "La Hacienda Recreation", { phone: "352-753-1716", address: "1200 Avenida Central, The Villages, FL", hub: true }),
  pb("fenney", "Fenney Recreation", { phone: "352-674-8460", address: "3200 Fenney Way, The Villages, FL 32163", hub: true, note: "Covered multi-sport · Fenney / Eastport side" }),
  pb("allamanda", "Allamanda Recreation", { phone: "352-750-1941", address: "1515 St. Charles Place, The Villages, FL" }),
  pb("aviary-recreation", "Aviary Recreation", { phone: "352-674-8417", address: "5748 Morse Boulevard, The Villages, FL", courts: 6 }),
  pb("bacall", "Bacall Recreation", { phone: "352-350-2281", address: "2041 Canal Street, The Villages, FL" }),
  pb("big-cypress", "Big Cypress Recreation", { phone: "352-674-8385", address: "3110 Hendry Dr, The Villages, FL" }),
  pb("blanchard", "Blanchard Recreation", { phone: "352-674-1838", address: "1512 Craig Court, The Villages, FL" }),
  pb("bradenton", "Bradenton Recreation", { phone: "352-674-8380", address: "1300 Pinellas Place, The Villages, FL" }),
  pb("burnsed", "Burnsed Recreation", { phone: "352-674-8430", address: "4019 Deskin Lane, The Villages, FL", courts: 6 }),
  pb("canal-street", "Canal Street Recreation", { phone: "352-205-8571", address: "1513 Canal Street, The Villages, FL" }),
  pb("captiva", "Captiva Recreation", { phone: "352-259-7422", address: "658 Pinellas Place, The Villages, FL" }),
  pb("cattail", "Cattail Recreation", { phone: "352-674-8468", address: "5219 Marsh Bend Trail, The Villages, FL" }),
  pb("chula-vista", "Chula Vista Recreation", { phone: "352-753-0002", address: "1011 Rio Grande Ave, The Villages, FL" }),
  pb("churchill-street", "Churchill Street Recreation", { phone: "352-751-6200", address: "2375 Churchill Downs, The Villages, FL" }),
  pb("clarendon", "Clarendon Recreation", { phone: "352-674-1887", address: "2796 Tharp Avenue, The Villages, FL" }),
  pb("coconut-cove", "Coconut Cove Recreation", { phone: "352-750-5870", address: "1398 Stillwater Trail, The Villages, FL", courts: 6 }),
  pb("cordoba", "Cordoba Recreation", { phone: "352-753-1716", address: "1233 Morse Boulevard, The Villages, FL" }),
  pb("el-santiago", "El Santiago Recreation", { phone: "352-753-1410", address: "2373 Enrique Drive, The Villages, FL" }),
  pb("first-responders", "First Responders Recreation", { phone: "352-674-1870", address: "7746 SE Highway 42, The Villages, FL", courts: 2 }),
  pb("fish-hawk", "Fish Hawk Recreation", { phone: "352-750-3525", address: "2318 Buttonwood Run, The Villages, FL" }),
  pb("franklin", "Franklin Recreation", { phone: "352-674-1989", address: "6750 Meggison Road, The Villages, FL" }),
  pb("hibiscus", "Hibiscus Recreation", { phone: "352-751-6761", address: "1740 Bailey Trail, The Villages, FL" }),
  pb("homestead", "Homestead Recreation", { phone: "352-674-1971", address: "6227 Meggison Road, The Villages, FL" }),
  pb("laurel-manor", "Laurel Manor Recreation", { phone: "352-751-7110", address: "1985 Laurel Manor Dr, The Villages, FL", courts: 4 }),
  pb("manatee", "Manatee Recreation", { phone: "352-674-8411", address: "1512 Hillsborough Trail, The Villages, FL" }),
  pb("moyer", "Moyer Recreation", { phone: "352-674-8440", address: "3000 Moyer Loop, The Villages, FL" }),
  pb("mulberry-grove", "Mulberry Grove Recreation", { phone: "352-259-6040", address: "8445 SE 165 Mulberry Lane, The Villages, FL" }),
  pb("odell", "Odell Recreation", { phone: "352-750-2700", address: "2260 Odell Circle, The Villages, FL" }),
  pb("paradise", "Paradise Recreation", { phone: "352-674-1800", address: "1403 Paradise Drive, The Villages, FL", courts: 2, note: "North-side neighborhood favorite" }),
  pb("pimlico", "Pimlico Recreation", { phone: "352-259-6990", address: "530 Belvedere Boulevard, The Villages, FL" }),
  pb("riverbend", "Riverbend Recreation", { phone: "352-674-8455", address: "1833 Corbin Trail, The Villages, FL" }),
  pb("saddlebrook", "Saddlebrook Recreation", { phone: "352-259-5377", address: "3010 Saddlebrook Lane, The Villages, FL" }),
  pb("saluki", "Saluki Recreation", { phone: "352-674-1833", address: "7504 Marsh Bend Trail, The Villages, FL" }),
  pb("seabreeze", "SeaBreeze Recreation", { phone: "352-750-2488", address: "2384 Buena Vista Blvd, The Villages, FL" }),
  pb("sterling-heights", "Sterling Heights Recreation", { phone: "352-753-4510", address: "2508 St. Charles Place, The Villages, FL" }),
  pb("truman", "Truman Recreation", { phone: "352-751-2650", address: "2705 Canal Street, The Villages, FL", courts: 6 }),
  pb("water-lily", "Water Lily Recreation", { phone: "352-674-1962", address: "4710 Marsh Bend Trail, The Villages, FL" }),
];

export function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function golfInfoUrl(c: GolfCourse) {
  if (c.kind === "championship") return GOLF_HUB.championship;
  if (c.kind === "executive" || c.kind === "pitch-putt") return GOLF_HUB.execGtv;
  return GOLF_HUB.golfTheVillages;
}
