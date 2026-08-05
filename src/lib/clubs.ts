/**
 * Curated popular clubs & official club-finding resources for The Villages.
 * Names/locations are orientation notes — confirm meeting times via District
 * Recreation listings, Daily Sun club pages, or club leaders.
 */

export type ClubCategory =
  | "Sports & Recreation"
  | "Cards & Games"
  | "Music & Performance"
  | "Dance"
  | "Arts & Crafts"
  | "Fitness & Wellness"
  | "Social & Community"
  | "Books & Writing"
  | "Golf"
  | "Walking & Running"
  | "Regional & Heritage"
  | "Technology"
  | "Pets & Animals"
  | "Volunteering & Service";

export type PopularClub = {
  id: string;
  name: string;
  category: ClubCategory;
  blurb: string;
  /** Typical rec / area association when known */
  areaHint: string;
  whyPopular: string;
  /** Whimsical card art under /public/graphics/clubs */
  image: string;
  /** Optional deep link when a stable public URL exists */
  href?: string;
};

/** Card art path for a curated club id */
export function clubImagePath(id: string): string {
  return `/graphics/clubs/${id}.jpg`;
}

export type ClubResource = {
  id: string;
  label: string;
  href: string;
  note: string;
};

export const CLUB_OFFICIAL_RESOURCES: ClubResource[] = [
  {
    id: "tv-clubs",
    label: "The Villages · Recreation clubs",
    href: "https://www.thevillages.com/recreation/clubs/",
    note: "Official lifestyle overview — 3,000+ resident-run clubs",
  },
  {
    id: "district-clubs",
    label: "District · Resident lifestyle / clubs",
    href: "https://www.districtgov.org/recreation/clubs/",
    note: "Start a club + Club Contacts PDF from Recreation & Parks",
  },
  {
    id: "club-contacts-pdf",
    label: "Club Contacts directory (PDF)",
    href: "https://www.districtgov.org/wp-content/uploads/2026/07/Club-Contact-7.10.26.pdf",
    note: "Searchable contacts — activity, location, leader info (updates periodically)",
  },
  {
    id: "daily-sun-listings",
    label: "Daily Sun recreation club listings",
    href: "https://www.thevillagesdailysun.com/clublistings/",
    note: "Newspaper club listing tool used by many residents",
  },
  {
    id: "tv-calendar",
    label: "The Villages entertainment / calendar",
    href: "https://www.thevillages.com/calendar/",
    note: "What’s meeting or performing this week",
  },
  {
    id: "hub-calendar",
    label: "Hub calendar",
    href: "/calendar",
    note: "On-site calendar corner for planning cart-path days",
  },
  {
    id: "hub-rec",
    label: "Hub rec centers",
    href: "/rec-centers",
    note: "Find the complex where your club usually meets",
  },
];

/** Hand-picked “great starter” clubs & genres people talk about a lot. */
const POPULAR_CLUBS_BASE: Omit<PopularClub, "image">[] = [
  {
    id: "pickleball",
    name: "Pickleball clubs & open play",
    category: "Sports & Recreation",
    blurb:
      "The Villages’ unofficial second religion — open play, leagues, and skill levels from “just got a paddle” to competitive.",
    areaHint: "Rec centers community-wide",
    whyPopular: "Easy to try, social, and everywhere on the map.",
  },
  {
    id: "line-dancing",
    name: "Line dancing groups",
    category: "Dance",
    blurb:
      "From beginner shuffles to high-energy nights — a classic square-adjacent social workout.",
    areaHint: "Regional rec centers & squares",
    whyPopular: "No partner required; instant community.",
  },
  {
    id: "zumba",
    name: "Zumba classes & clubs",
    category: "Dance",
    blurb:
      "High-energy dance fitness with multiple leaders and locations (Rohan, Eisenhower, SeaBreeze, and more).",
    areaHint: "Multiple rec centers",
    whyPopular: "Fun cardio that doesn’t feel like a gym lecture.",
  },
  {
    id: "mah-jongg",
    name: "Mah-Jongg groups",
    category: "Cards & Games",
    blurb:
      "Tables fill fast across the map — Sterling Heights, Captiva, El Santiago, and beyond.",
    areaHint: "Village & regional centers",
    whyPopular: "Social strategy game with built-in regulars.",
  },
  {
    id: "karaoke",
    name: "Karaoke clubs",
    category: "Music & Performance",
    blurb:
      "Sundowners, Starlight Singers, Fun Timers — pick your courage level and a mic.",
    areaHint: "La Hacienda, Coconut Cove, Captiva, etc.",
    whyPopular: "Instant ice-breaker and weekly tradition.",
  },
  {
    id: "ukulele",
    name: "Ukulele & sing-along circles",
    category: "Music & Performance",
    blurb:
      "Low barrier instrument culture — bring a uke or just sing along.",
    areaHint: "Various gathering rooms",
    whyPopular: "Friendly for beginners; portable joy.",
  },
  {
    id: "photography",
    name: "Photography clubs",
    category: "Arts & Crafts",
    blurb:
      "Cart-path sunsets, wildlife, and critique nights — great if you carry a camera everywhere.",
    areaHint: "Regional rec centers",
    whyPopular: "Pairs perfectly with Florida light.",
  },
  {
    id: "quilting",
    name: "Quilting guild chapters (QGOTV & friends)",
    category: "Arts & Crafts",
    blurb:
      "Sterling Stitchers, Captiva Quilters, Mulberry Quilters — fabric community with serious skills.",
    areaHint: "Village centers across the map",
    whyPopular: "Deep craft culture and show-and-tell energy.",
  },
  {
    id: "book-clubs",
    name: "Book clubs & writers groups",
    category: "Books & Writing",
    blurb:
      "Fiction, nonfiction, and writing workshops — conversation over coffee optional but recommended.",
    areaHint: "Rec centers & libraries nearby",
    whyPopular: "Low cost, high conversation.",
  },
  {
    id: "walking",
    name: "Walk Away the Pounds & walking clubs",
    category: "Walking & Running",
    blurb:
      "Morning loops, social miles, and accountability without a gym membership.",
    areaHint: "Aviary, Captiva, Manatee, Moyer, and more",
    whyPopular: "Health + neighbors in one outing.",
  },
  {
    id: "cycling",
    name: "Cycling & EZ Riders groups",
    category: "Sports & Recreation",
    blurb:
      "Bike and e-bike social rides for different paces — cart paths and beyond.",
    areaHint: "Neighborhood & regional meetups",
    whyPopular: "Explore the map without burning cart battery.",
  },
  {
    id: "golf-social",
    name: "Golf social groups",
    category: "Golf",
    blurb:
      "Scrambles, ladies’ groups, and “we play for fun” leagues on executive and championship tracks.",
    areaHint: "Courses community-wide",
    whyPopular: "Golf is the infrastructure; clubs make the tee times social.",
    href: "/golf-zone",
  },
  {
    id: "bocce",
    name: "Bocce clubs & leagues",
    category: "Sports & Recreation",
    blurb:
      "Neighborhood courts and organized play — pure Villages outdoor social sport.",
    areaHint: "Neighborhood rec areas",
    whyPopular: "Easy to learn, hard to stop chatting.",
  },
  {
    id: "shuffleboard",
    name: "Shuffleboard clubs",
    category: "Sports & Recreation",
    blurb:
      "Table and outdoor shuffleboard crews with names as fun as the game (looking at you, Puckaneers).",
    areaHint: "Eisenhower, Tropez, neighborhood courts",
    whyPopular: "Classic retirement-community energy, competitive optional.",
  },
  {
    id: "singles",
    name: "Singles & social mixer clubs",
    category: "Social & Community",
    blurb:
      "50 Something, YOLO, Gals N Guys — meet people without waiting for a chance cart-path hello.",
    areaHint: "Regional complexes",
    whyPopular: "Built-in icebreakers for newcomers.",
  },
  {
    id: "state-clubs",
    name: "State & hometown clubs",
    category: "Regional & Heritage",
    blurb:
      "Ohio Buckeyes, Jersey Girls, Canadian clubs, California Club — find your old zip code’s diaspora.",
    areaHint: "Varies by state group",
    whyPopular: "Instant shared nostalgia.",
  },
  {
    id: "veterans",
    name: "Veterans & military clubs",
    category: "Volunteering & Service",
    blurb:
      "Service-branch groups, Coast Guard veterans, and community service circles.",
    areaHint: "Rec centers & VHA-related programs",
    whyPopular: "Camaraderie with purpose.",
  },
  {
    id: "technology",
    name: "Technology & BYTE Club style groups",
    category: "Technology",
    blurb:
      "Phones, computers, and “how do I print this?” mutual aid — essential modern Villages skillshare.",
    areaHint: "Chatham and other tech-friendly rooms",
    whyPopular: "Everyone needs tech help eventually.",
  },
  {
    id: "pets",
    name: "Pet & dog-friendly social groups",
    category: "Pets & Animals",
    blurb:
      "Dog park regulars and pet-lover meetups — because cart baskets were made for small dogs.",
    areaHint: "Dog parks & social clubs",
    whyPopular: "Four-legged icebreakers work every time.",
  },
  {
    id: "gardening",
    name: "Gardening & plant-based groups",
    category: "Fitness & Wellness",
    blurb:
      "Buds, blossoms, and Florida-friendly planting — plus plant-based potluck energy.",
    areaHint: "Mulberry, Riverbend, and garden clubs",
    whyPopular: "Green thumbs love company.",
  },
  {
    id: "theater",
    name: "Theater, improv & performance",
    category: "Music & Performance",
    blurb:
      "Improv for fun, community theater, and stage-adjacent clubs for performers and fans.",
    areaHint: "Bridgeport, Morse PAC orbit, rec theaters",
    whyPopular: "Creative outlet beyond the craft table.",
  },
  {
    id: "poker-cards",
    name: "Poker & card game clubs",
    category: "Cards & Games",
    blurb:
      "From friendly deals to serious tables — cards are a Villages love language.",
    areaHint: "Village centers community-wide",
    whyPopular: "Air-conditioned social sport.",
  },
  {
    id: "yoga",
    name: "Yoga groups (gentle → intermediate)",
    category: "Fitness & Wellness",
    blurb:
      "Beginner, gentle, and intermediate options across La Hacienda, Homestead, Okahumpka, and more.",
    areaHint: "Multiple rec centers",
    whyPopular: "Balances pickleball shoulders and golf backs.",
  },
  {
    id: "volunteer",
    name: "Service clubs (Lions, tutoring, H.U.G.)",
    category: "Volunteering & Service",
    blurb:
      "Eastport Lions, tutor clubs, and neighbor-help groups if you want purpose with your social calendar.",
    areaHint: "Regional & village centers",
    whyPopular: "Give back without leaving the cart-path network.",
  },
];

export const POPULAR_CLUBS: PopularClub[] = POPULAR_CLUBS_BASE.map((c) => ({
  ...c,
  image: clubImagePath(c.id),
}));

export function getClubById(id: string): PopularClub | undefined {
  return POPULAR_CLUBS.find((c) => c.id === id);
}

export function clubsByCategory(): { category: ClubCategory; clubs: PopularClub[] }[] {
  const map = new Map<ClubCategory, PopularClub[]>();
  for (const c of POPULAR_CLUBS) {
    const list = map.get(c.category) || [];
    list.push(c);
    map.set(c.category, list);
  }
  return [...map.entries()].map(([category, clubs]) => ({ category, clubs }));
}
