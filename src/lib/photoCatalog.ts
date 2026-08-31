/** Villages photo/movie destinations and local resources (educational links). */

export const PHOTO_SECTIONS = [
  {
    id: "private",
    label: "Private album",
    emoji: "📷",
    href: "",
    note: "Stays in My Space Photos — synced on this account.",
  },
  {
    id: "health",
    label: "Health",
    emoji: "💚",
    href: "",
    note: "Progress shots. Health also has its own Photos tab.",
  },
  {
    id: "pets",
    label: "Pets",
    emoji: "🐾",
    href: "",
    note: "Dog / cat portraits for the Pets board.",
  },
  {
    id: "food",
    label: "Food",
    emoji: "🍽️",
    href: "",
    note: "Plates, recipes, and happy-hour evidence.",
  },
  {
    id: "golf",
    label: "Golf",
    emoji: "⛳",
    href: "/golf-zone",
    note: "Cart-path glory. Public Golf hub stays free.",
  },
  {
    id: "pickleball",
    label: "Pickleball",
    emoji: "🏓",
    href: "/pickleball",
    note: "Court photos. Public Pickleball hub stays free.",
  },
  {
    id: "entertainment",
    label: "Entertainment",
    emoji: "🎭",
    href: "/town-squares",
    note: "Squares, shows, and nights out.",
  },
  {
    id: "calendar",
    label: "Calendar",
    emoji: "📅",
    href: "/calendar",
    note: "Event snapshots. Public Calendar stays free.",
  },
  {
    id: "yard-sale",
    label: "Yard sale",
    emoji: "🏷️",
    href: "/yard-sale",
    note: "Listing photos — post them on Yard Sale when you’re ready.",
  },
  {
    id: "best-of-month",
    label: "Best of the Month",
    emoji: "🏆",
    href: "/best-of-the-month",
    note: "Contest entries go through Best of the Month, not this album.",
  },
  {
    id: "forums",
    label: "Forums",
    emoji: "💬",
    href: "/forums",
    note: "Share a still in Community Forums if the thread allows it.",
  },
  {
    id: "photos-journal",
    label: "Public Photo Journal",
    emoji: "🌅",
    href: "/photos",
    note: "Studio publishes the public journal. This album stays private.",
  },
] as const;

export type PhotoSectionId = (typeof PHOTO_SECTIONS)[number]["id"];

export const PHOTO_CLUBS = [
  {
    name: "The Villages Photography Club",
    kind: "Club",
    address: "Rohan Recreation · 850 Kristine Way, The Villages, FL 32163",
    phone: "352-674-8400",
    hours: "2nd & 4th Wednesday, Sep–May · doors 12:30 p.m., meeting 1:00 p.m. · informal summer sessions Jun–Aug",
    note: "Residents · all skill levels, including phones. Dues under $20/year. Presentations, critiques, field trips. Annual showcase often fills Eisenhower Recreation.",
    href: "https://www.thevillagesphotoclub.org/",
  },
  {
    name: "Intermediate Photography Club",
    kind: "Club",
    address: "Bradenton Recreation · 1300 Pinellas Place, The Villages, FL",
    phone: "352-674-8380",
    hours: "2nd & 4th Thursday · social 12:30 p.m., meeting 1:00 p.m.",
    note: "Residents who already know camera basics. Membership capped (about 125). Confirm the rec-center room on the club calendar.",
    href: "https://www.villagesipc.com/",
  },
  {
    name: "Sunset Pointe Photography Club",
    kind: "Club",
    address: "Lake Miona Recreation · 1526 Buena Vista Blvd, The Villages, FL",
    phone: "352-430-2950",
    hours: "1st, 3rd & 5th Thursday, Sep–Jun · 9:30 a.m.",
    note: "Casual / beginner-friendly. Smartphones welcome. Club email: spointe.photo@gmail.com.",
    href: "https://photoclubsp.org/",
  },
];

export const PHOTO_SPOTS = [
  {
    name: "Spanish Springs Town Square",
    kind: "Square",
    address: "1051 Main St, The Villages, FL 32159",
    phone: "352-750-5411",
    hours: "Live music most nights · typically 5–9 p.m.; summer Jun 1–Sep 30 often 6–10 p.m.",
    note: "Golden-hour facades, the fountain, and the evening crowd. Bring a resident or guest ID for rec amenities nearby.",
    href: "https://www.thevillagesentertainment.com/spanish-springs/",
  },
  {
    name: "Lake Sumter Landing",
    kind: "Square",
    address: "1020 Lake Sumter Landing, The Villages, FL 32162",
    phone: "352-750-5411",
    hours: "Same nightly-music window as the other squares — confirm on the entertainment calendar.",
    note: "Lighthouse, boardwalk, and water reflections after rain. Old Mill Playhouse is a short walk.",
    href: "https://www.thevillagesentertainment.com/lake-sumter-landing/",
  },
  {
    name: "Brownwood Paddock Square",
    kind: "Square",
    address: "Brownwood Paddock Square, The Villages, FL 32163",
    phone: "352-750-5411",
    hours: "Square hours follow The Villages Entertainment calendar.",
    note: "Western storefronts and wide skies — a favorite sunset stop on the south map.",
    href: "https://www.thevillagesentertainment.com/brownwood/",
  },
  {
    name: "Eisenhower Recreation",
    kind: "Rec center",
    address: "3560 Buena Vista Blvd, The Villages, FL",
    phone: "352-674-8390",
    hours: "At Your Service desk · weekend hours on the District list",
    note: "Home of the big January photography-club showcase. Rec ID required for indoor amenities.",
    href: "https://www.thevillages.com/recreation/eisenhower/",
  },
  {
    name: "Rohan Recreation",
    kind: "Rec center",
    address: "850 Kristine Way, The Villages, FL 32163",
    phone: "352-674-8400",
    hours: "Regional rec hours · weekend At Your Service on the District list",
    note: "Photography Club meeting site. Irish-themed campus photographs well after a storm.",
    href: "https://www.thevillages.com/recreation/rohan/",
  },
  {
    name: "Lake Miona Recreation",
    kind: "Rec center",
    address: "1526 Buena Vista Blvd, The Villages, FL",
    phone: "352-430-2950",
    hours: "Regional rec hours · weekend desk coverage on the District list",
    note: "Nautical campus and the lake itself — Sunset Pointe club meets here.",
    href: "https://www.thevillages.com/recreation/lake-miona/",
  },
];

export const MOVIE_HOUSES = [
  {
    name: "Epic Theatres Old Mill Playhouse",
    kind: "Movies",
    address: "1000 Old Mill Run, The Villages, FL 32162",
    phone: "352-259-1111",
    hours: "Showtimes vary · box office typically late morning through evening",
    note: "The in-town movie house at Lake Sumter Landing — new releases plus playhouse performances. Confirm titles on Epic Theatres.",
    href: "https://www.epictheatres.com/our-theatres/g0205-epic-theatres-old-mill-playhouse/",
  },
  {
    name: "AMC Lake Square 12",
    kind: "Movies",
    address: "10401-015 US Hwy 441 S, Leesburg, FL 34788",
    phone: "352-728-5980",
    hours: "Showtimes on AMC — recliners and reserved seating on many screens",
    note: "About 15 minutes south of Lake Sumter. Online tickets at AMC.",
    href: "https://www.amctheatres.com/movie-theatres/orlando/amc-lake-square-12",
  },
  {
    name: "Epic Theatres of Ocala",
    kind: "Movies",
    address: "4414 SW College Rd, Ocala, FL 34474",
    phone: "352-441-3120",
    hours: "Showtimes on Epic Theatres",
    note: "Larger multiplex if Old Mill is packed. About 20 minutes north.",
    href: "https://www.epictheatres.com/our-theatres/g0148-epic-theatres-of-ocala/",
  },
  {
    name: "Ocala Drive-In",
    kind: "Drive-in",
    address: "4850 S Pine Ave, Ocala, FL 34480",
    phone: "352-629-1325",
    hours: "Gates typically evening · double features; confirm on their site",
    note: "Classic Florida drive-in. Bring a radio (or the car speakers) and bug spray.",
    href: "https://www.ocaladrivein.com/",
  },
];

export const PHOTO_OFFICIAL = [
  {
    label: "Photographers (The Villages recreation)",
    href: "https://www.thevillages.com/recreation/photographers/",
    note: "Resident lifestyle groups — search the directory for the latest clubs",
  },
  {
    label: "Recreation & Parks (District)",
    href: "https://www.districtgov.org/recreation/",
    note: "Rec centers, programs, IDs · 352-674-1800",
  },
  {
    label: "Recreation centers directory",
    href: "https://www.districtgov.org/recreation/centers/",
    note: "Rohan, Eisenhower, Lake Miona, Bradenton, and the rest",
  },
  {
    label: "The Enrichment Academy",
    href: "https://www.theenrichmentacademy.org/",
    note: "Occasional photography / editing classes (Colony Cottage and others)",
  },
  {
    label: "Live cams",
    href: "https://www.thevillages.com/entertainment/live-cams/",
    note: "Square cams when you want the light before you roll",
  },
  {
    label: "Public Photo Journal",
    href: "/photos",
    note: "The Hub’s free public snapshots — not your private album",
  },
];

export function sectionLabel(id: string) {
  return PHOTO_SECTIONS.find((s) => s.id === id)?.label || "Private album";
}

export function sectionMeta(id: string) {
  return PHOTO_SECTIONS.find((s) => s.id === id) || PHOTO_SECTIONS[0];
}
