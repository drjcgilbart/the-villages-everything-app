export type TopicSlug =
  | "health"
  | "wealth"
  | "neighbors"
  | "golf-zone"
  | "pickleball"
  | "club-zone"
  | "arts-and-crafts"
  | "calendar"
  | "dining"
  | "town-squares"
  | "rec-centers"
  | "my-village"
  | "real-estate"
  | "community-resources"
  | "best-of-the-month";

export type TopicDef = {
  slug: TopicSlug;
  href: string;
  /** Short label for nav */
  navLabel: string;
  title: string;
  kicker: string;
  description: string;
  image: string;
  /** Tags that pull related posts/videos/photos onto this page */
  tags: string[];
  highlights: { title: string; body: string }[];
  quote: string;
};

/** Pure topic metadata — safe for client components (no Node/fs). */
export const TOPICS: TopicDef[] = [
  {
    slug: "health",
    href: "/health",
    navLabel: "Health",
    title: "Health",
    kicker: "The long game",
    description:
      "Local hospitals & ERs, emergency numbers, ER-vs-urgent-care guidance, and light wellness tools — steps, water, and honest check-ins without the cult energy.",
    image: "/graphics/theme-health.jpg",
    tags: [
      "health",
      "wellness",
      "fitness",
      "walk",
      "walking",
      "meds",
      "medicine",
      "weight",
      "steps",
      "doctor",
      "exercise",
      "pickleball",
      "hospital",
      "emergency",
    ],
    highlights: [
      {
        title: "Local care contacts",
        body: "Hospitals, freestanding ERs, and helplines with call + maps buttons.",
      },
      {
        title: "Know where to go",
        body: "Plain-language ER vs urgent care vs primary — when in doubt, 911.",
      },
      {
        title: "Wellness tools",
        body: "Daily mood, water, steps, and tiny wins stored on your device only.",
      },
      {
        title: "Move like a villager",
        body: "Rec centers, cart paths, and consistency over heroic resolutions.",
      },
    ],
    quote:
      "I didn’t come here to become a wellness influencer. I came here to feel better — and maybe laugh about the process.",
  },
  {
    slug: "wealth",
    href: "/wealth",
    navLabel: "Wealth",
    title: "Wealth",
    kicker: "Money & markets",
    description:
      "Live markets and a personal portfolio board, plus local banks, Social Security & Medicare links, scam watch, and light money tools — without the hard sell.",
    image: "/graphics/theme-wealth.jpg",
    tags: [
      "wealth",
      "money",
      "market",
      "markets",
      "invest",
      "investing",
      "investment",
      "stock",
      "stocks",
      "finance",
      "retirement",
      "budget",
      "broker",
      "social-security",
      "medicare",
      "scam",
    ],
    highlights: [
      {
        title: "Live markets + portfolio",
        body: "Index charts and a private on-device stock/ETF board.",
      },
      {
        title: "Local banks & credit unions",
        body: "Places Villagers actually bank — with maps and websites.",
      },
      {
        title: "Official retirement links",
        body: "SSA, Medicare, IRS, Investor.gov, and BrokerCheck.",
      },
      {
        title: "Scam watch + money tools",
        body: "Common traps, plus coffee budget and cash-flow sketches on your device.",
      },
    ],
    quote:
      "Compound interest isn’t a love language — but it sure tries hard.",
  },
  {
    slug: "neighbors",
    href: "/neighbors",
    navLabel: "Neighbors",
    title: "Meet Your Neighbors",
    kicker: "Community roll call",
    description:
      "The people who make The Villages feel like a village — stories, faces, friendships, and the social plot twists of starting over in a new zip code.",
    image: "/graphics/theme-chaos.jpg",
    tags: [
      "neighbor",
      "neighbors",
      "community",
      "people",
      "friends",
      "friendship",
      "resident",
      "residents",
      "meet",
      "social",
    ],
    highlights: [
      {
        title: "New faces",
        body: "Introductions to villagers you might pass on a cart path and never forget.",
      },
      {
        title: "Shared tables",
        body: "Clubs, dinners, and the accidental friends who become the whole point.",
      },
      {
        title: "Local legends",
        body: "The characters, helpers, and good neighbors who keep this place spinning.",
      },
    ],
    quote:
      "You don’t really move to The Villages. You move into a thousand little hellos.",
  },
  {
    slug: "golf-zone",
    href: "/golf-zone",
    navLabel: "Golf",
    title: "Golf",
    kicker: "Fairways & cart paths",
    description:
      "Leader Board by handicap and best games, find a foursome, celebrate holes-in-one, plus executive trail resources, maps, and cart-path tips.",
    image: "/graphics/theme-golf.jpg",
    tags: [
      "golf",
      "golfing",
      "course",
      "courses",
      "cart",
      "carts",
      "golf-cart",
      "golf-carts",
      "fairway",
      "putting",
      "range",
      "executive",
      "leaderboard",
      "foursome",
      "hole-in-one",
    ],
    highlights: [
      {
        title: "The Villages Leader Board",
        body: "Track neighbor handicaps and best scores by course — upload your game for approval.",
      },
      {
        title: "Find a foursome",
        body: "Men, women, or mixed — post when you need 1–3 more players.",
      },
      {
        title: "Holes in One",
        body: "Report an ace and get a proper congratulations on the Ace Wall.",
      },
      {
        title: "Maps & fees",
        body: "Official course maps, trail-pass portals, and FAQs linked below.",
      },
    ],
    quote:
      "In The Villages, the golf cart isn’t transportation. It’s a personality type.",
  },
  {
    slug: "pickleball",
    href: "/pickleball",
    navLabel: "Pickleball",
    title: "Pickleball",
    kicker: "Paddles · DUPR · open play",
    description:
      "The Villages is pickleball country — DUPR leader board, find a game, rec-center courts, and official links for open play, leagues, and the kitchen line.",
    image: "/graphics/theme-pickleball.jpg",
    tags: [
      "pickleball",
      "paddle",
      "dupr",
      "open-play",
      "rec",
      "kitchen",
      "nvz",
      "league",
    ],
    highlights: [
      {
        title: "DUPR leader board",
        body: "Neighbor-reported doubles and singles ratings — admin-approved so the board stays honest.",
      },
      {
        title: "Find a game",
        body: "Need one more for doubles? Post when and where — like a foursome, but for paddles.",
      },
      {
        title: "Courts all over town",
        body: "Rohan, Ezell, Olympia, Everglades, and rec-center courts all over town — bring a resident or guest ID.",
      },
      {
        title: "Stay out of the kitchen",
        body: "Official Villages pickleball page, Pickleballers clubs, DUPR, and the court diagram.",
      },
    ],
    quote:
      "You don’t really understand The Villages until you’ve argued about court times and still made three new friends at the NVZ.",
  },
  {
    slug: "club-zone",
    href: "/club-zone",
    navLabel: "Clubs",
    title: "Clubs",
    kicker: "Join the fun",
    description:
      "Clubs, groups, and hobby hangouts across The Villages — from first-timer drop-ins to the crews that feel like family. What’s meeting, what’s worth joining, and how to find your people.",
    image: "/graphics/theme-club-zone.jpg",
    tags: [
      "club",
      "clubs",
      "club-zone",
      "group",
      "groups",
      "hobby",
      "hobbies",
      "membership",
      "meetup",
      "recreation",
      "social-club",
    ],
    highlights: [
      {
        title: "Find your crew",
        body: "Clubs for every interest — music, games, fitness, food, and beautifully niche hobbies.",
      },
      {
        title: "How to join",
        body: "First-meeting tips, what to expect, and the gentle art of showing up once.",
      },
      {
        title: "Club spotlights",
        body: "Field notes from meetings, parties, and the groups that keep calendars full.",
      },
    ],
    quote:
      "In The Villages, if you can dream it, there’s probably a club for it — and a second club arguing about the bylaws.",
  },
  {
    slug: "arts-and-crafts",
    href: "/arts-and-crafts",
    navLabel: "Art",
    title: "Art",
    kicker: "Make something beautiful",
    description:
      "Studios, shows, DIY projects, and creative chaos — plus The Villages Artisan Guild marketplace for local pottery, glass, and paintings. Share what you’re making and where to learn.",
    image: "/graphics/theme-arts-crafts-v2.jpg",
    tags: [
      "art",
      "arts",
      "craft",
      "crafts",
      "arts-and-crafts",
      "painting",
      "pottery",
      "quilting",
      "sewing",
      "woodworking",
      "creative",
      "studio",
      "handmade",
      "diy",
      "artisan",
      "guild",
    ],
    highlights: [
      {
        title: "The Villages Artisan Guild",
        body: "Featured local marketplace — shop pottery, glass, and paintings, or consign your own work.",
      },
      {
        title: "Projects in progress",
        body: "Works-in-progress, finished pieces, and the glorious mess in between.",
      },
      {
        title: "Where to create",
        body: "Classes, studios, and rec-center tables where the glue sticks live.",
      },
      {
        title: "Shows & shares",
        body: "Exhibits, craft fairs, and neighbor-to-neighbor inspiration.",
      },
    ],
    quote:
      "Retirement is the perfect excuse to finally make the thing you’ve been meaning to make — glitter optional, pride mandatory.",
  },
  {
    slug: "calendar",
    href: "/calendar",
    navLabel: "Calendar",
    title: "Calendar of Events",
    kicker: "What’s on this week",
    description:
      "Concerts, markets, rec-center happenings, holidays, and can’t-miss local dates — a living calendar of Villages life so you don’t miss the good stuff (or double-book pickleball).",
    image: "/graphics/theme-calendar.jpg",
    tags: [
      "calendar",
      "event",
      "events",
      "schedule",
      "happening",
      "concert",
      "market",
      "festival",
      "holiday",
      "date",
      "dates",
      "upcoming",
      "this-week",
    ],
    highlights: [
      {
        title: "Coming up",
        body: "The week’s (and month’s) worth of things worth putting on the fridge calendar.",
      },
      {
        title: "Recurring favorites",
        body: "Standing gigs, markets, and rituals that define the social season.",
      },
      {
        title: "Don’t miss it",
        body: "One-off shows, holidays, and the events everyone will ask if you went to.",
      },
    ],
    quote:
      "In The Villages, FOMO isn’t a social media problem — it’s a square-dance, concert, and early-bird buffet problem.",
  },
  {
    slug: "dining",
    href: "/dining",
    navLabel: "Dining",
    title: "Dining",
    kicker: "Menus & ratings",
    description:
      "Dining in and around The Villages — live restaurant ratings, top 5 by cuisine, kitchen interviews, and community reviews that actually move the leaderboards.",
    image: "/graphics/theme-dining-v2.jpg",
    tags: [
      "dining",
      "restaurant",
      "restaurants",
      "food",
      "eat",
      "brunch",
      "dinner",
      "review",
      "reviews",
    ],
    highlights: [
      {
        title: "Live ratings",
        body: "1–5 star community scores with would-return tallies on every restaurant.",
      },
      {
        title: "Top 5 by cuisine",
        body: "Leaderboards that update the moment someone posts a new review.",
      },
      {
        title: "Kitchen interviews",
        body: "Chefs, owners, and staff stories from the places Villagers love.",
      },
    ],
    quote:
      "In The Villages, dinner plans are a competitive sport — and everyone has a favorite early-bird table.",
  },
  {
    slug: "town-squares",
    href: "/town-squares",
    navLabel: "Town Squares",
    title: "Town Squares",
    kicker: "Shop · dine · dance",
    description:
      "The social heart of The Villages — Spanish Springs, Lake Sumter Landing, Brownwood Paddock Square, plus newer spots like Eastport and Sawgrass Grove. Free live entertainment most nights, shopping, dining, and the eternal debate over which square has the best dancing.",
    image: "/graphics/theme-town-squares.jpg",
    tags: [
      "town-square",
      "town-squares",
      "square",
      "squares",
      "spanish-springs",
      "lake-sumter",
      "brownwood",
      "eastport",
      "sawgrass",
      "entertainment",
      "live-music",
      "dancing",
      "shopping",
      "nightlife",
    ],
    highlights: [
      {
        title: "The big three (and friends)",
        body: "Spanish Springs (southwest vibe), Lake Sumter Landing (waterfront market square), Brownwood Paddock Square (southern ranch energy) — plus Eastport, Sawgrass Grove, and more as the map grows.",
      },
      {
        title: "Free nightly entertainment",
        body: "Outdoor stages, live bands, and dancing nearly every night of the year — cart over, grab a table, and join the crowd.",
      },
      {
        title: "Official live webcams",
        body: "Check the squares from home via The Villages’ official Live Web Cameras page — we link out rather than re-hosting streams.",
      },
      {
        title: "Shop, dine, people-watch",
        body: "Boutiques, restaurants, happy hours, and the best people-watching sport in Central Florida.",
      },
    ],
    quote:
      "In The Villages, “going out” often means a golf cart, a town square, and a band that knows every song from 1965.",
  },
  {
    slug: "rec-centers",
    href: "/rec-centers",
    navLabel: "Rec Centers",
    title: "Rec Centers",
    kicker: "Come out & play",
    description:
      "The Villages’ recreation centers are the everyday playgrounds — regional complexes, village centers, and neighborhood spots with pools, pickleball, billiards, fitness, arts rooms, and gathering spaces. Thousands of activities a week, usually just a cart ride away.",
    image: "/graphics/theme-rec-centers.jpg",
    tags: [
      "rec",
      "rec-center",
      "rec-centers",
      "recreation",
      "pool",
      "pools",
      "pickleball",
      "fitness",
      "billiards",
      "bocce",
      "shuffleboard",
      "amenities",
      "sports",
      "activities",
    ],
    highlights: [
      {
        title: "Three flavors of fun",
        body: "Regional complexes (biggest amenity menus), village centers (pools, cards, billiards, meeting rooms), and neighborhood centers (adult pools, bocce, shuffleboard, horseshoes).",
      },
      {
        title: "Stay active",
        body: "Pickleball, swimming, fitness classes, tennis, bocce, and more — the calendar is fuller than your fridge magnets.",
      },
      {
        title: "Meet people indoors & out",
        body: "Gathering rooms, clubs, craft spaces, and the soft social magic of “I saw you at the rec center.”",
      },
    ],
    quote:
      "You don’t really understand The Villages until you’ve argued about pickleball court times and still made three new friends at the pool.",
  },
  {
    slug: "my-village",
    href: "/my-village",
    navLabel: "The Villages",
    title: "The Villages",
    kicker: "Find your neighborhood",
    description:
      "The Villages is made of many individual villages — Edenfield, Fenney, Bonnybrook, and 100+ more. Search or browse by area, then open a village’s landing page. Member favorites and saved picks live under My Space.",
    image: "/graphics/theme-my-village.jpg",
    tags: [
      "village",
      "villages",
      "my-village",
      "neighborhood",
      "edenfield",
      "eastport",
      "fenney",
      "district",
      "cdd",
      "local",
    ],
    highlights: [
      {
        title: "Search & filter",
        body: "Jump straight to Edenfield or any village — or browse by Historic Side, North of 466, Eastport, and more.",
      },
      {
        title: "Village landing pages",
        body: "Each village gets its own page with area context, CDD when known, and nearby square energy.",
      },
      {
        title: "Save in My Space",
        body: "Star your home village and other favorites — member-saved stuff lives under My Space.",
      },
    ],
    quote:
      "I don’t just live in The Villages — I live in my village. (And yes, that’s a whole different zip-code energy.)",
  },
  {
    slug: "real-estate",
    href: "/real-estate",
    navLabel: "Real Estate",
    title: "Real Estate",
    kicker: "Buy · sell · get introduced",
    description:
      "Featured homes in The Villages, live market searches that stay current, and soft introductions to partner agents — without turning the whole site into a billboard.",
    image: "/graphics/theme-real-estate.jpg",
    tags: [
      "real-estate",
      "homes",
      "for-sale",
      "housing",
      "realtor",
      "agent",
      "buyer",
      "seller",
      "listing",
      "listings",
      "mls",
    ],
    highlights: [
      {
        title: "Live market + featured homes",
        body: "Jump to current public searches, plus site-curated featured listings from partner agents.",
      },
      {
        title: "Hourly / on-demand refresh",
        body: "Market snapshot updates when you hit Refresh — and hourly when cron is configured on deploy.",
      },
      {
        title: "Agent introductions",
        body: "Buyers and sellers can request a local intro — preferred partners help keep the lights on.",
      },
    ],
    quote:
      "The best Villages real estate advice isn’t just price per square foot — it’s which cart path you’ll actually enjoy at 4:15 p.m.",
  },
  {
    slug: "community-resources",
    href: "/community-resources",
    navLabel: "Community Resources",
    title: "Community Resources",
    kicker: "Yard sale · monthly picks",
    description:
      "Community yard sale and Best of the Month — plus links to other public tools. Town Squares, Rec Centers, and Real Estate have their own main tabs. Meet Your Neighbors lives on each village page under The Villages.",
    image: "/graphics/theme-community-resources.jpg",
    tags: [
      "community",
      "resources",
      "town-square",
      "rec",
      "real-estate",
      "yard-sale",
    ],
    highlights: [
      {
        title: "Town squares & rec",
        body: "Entertainment hubs and everyday recreation facilities.",
      },
      {
        title: "Homes & marketplace",
        body: "Real estate tools and the community yard sale.",
      },
      {
        title: "Monthly highlights",
        body: "The best-of-the-month reel from around the hub.",
      },
    ],
    quote:
      "When you need the square, the rec center, or a realtor tip — start here. Neighbors? That’s on your village page.",
  },
  {
    slug: "best-of-the-month",
    href: "/best-of-the-month",
    navLabel: "Best of Month",
    title: "Best of the Month Club",
    kicker: "Monthly highlight reel",
    description:
      "The reboot’s monthly picks — best posts, clips, photos, finds, and Florida plot twists worth replaying. One club. Zero dues. Maximum chaos.",
    image: "/graphics/theme-best-of-month.jpg",
    tags: [
      "best-of",
      "best-of-month",
      "monthly",
      "month",
      "highlights",
      "botmc",
      "best",
      "featured",
    ],
    highlights: [
      {
        title: "This month’s picks",
        body: "The stories, videos, and photos that earned a spot on the highlight reel.",
      },
      {
        title: "Member energy",
        body: "No password, no dues — just a standing invitation to celebrate the good stuff.",
      },
      {
        title: "Catch up anytime",
        body: "Past months stick around so you can binge the reboot like a season.",
      },
    ],
    quote:
      "If it made us laugh, learn, or take the long cart path home — it’s club material.",
  },
];

export function getTopic(slug: TopicSlug): TopicDef {
  const topic = TOPICS.find((t) => t.slug === slug);
  if (!topic) throw new Error(`Unknown topic: ${slug}`);
  return topic;
}

/**
 * Primary top-level topics for The Villages Everything App (main banner).
 * Member-only / saved tools live under My Space (utility bar).
 */
export const MAIN_TOPICS: {
  href: string;
  label: string;
  /** Paths that should highlight this nav item */
  matchPrefixes?: string[];
  blurb: string;
  image: string;
}[] = [
  {
    href: "/town-squares",
    label: "Town Squares",
    matchPrefixes: ["/town-squares"],
    blurb:
      "Spanish Springs, Lake Sumter, Brownwood — free bands, shopping, and dancing after dark.",
    image: "/graphics/theme-town-squares.jpg",
  },
  {
    href: "/rec-centers",
    label: "Rec Centers",
    matchPrefixes: ["/rec-centers"],
    blurb:
      "Pools, pickleball diplomacy, billiards, and “see you at the rec center.”",
    image: "/graphics/theme-rec-centers.jpg",
  },
  {
    href: "/my-village",
    label: "The Villages",
    matchPrefixes: ["/my-village"],
    blurb:
      "Edenfield, Fenney, and 100+ villages — search, browse by area, and open each village’s landing page.",
    image: "/graphics/theme-my-village.jpg",
  },
  {
    href: "/dining",
    label: "Dining",
    blurb:
      "Rate the early-bird, crown the top 5 by cuisine, and argue about tacos like it’s a sport.",
    image: "/graphics/theme-dining-v2.jpg",
  },
  {
    href: "/health",
    label: "Health",
    blurb:
      "Hospitals & ERs, emergency numbers, and light wellness tools for real villagers.",
    image: "/graphics/theme-health.jpg",
  },
  {
    href: "/wealth",
    label: "Wealth",
    blurb:
      "Markets, local banks, Social Security links, scam watch, and light money tools.",
    image: "/graphics/theme-wealth.jpg",
  },
  {
    href: "/news",
    label: "Local News",
    matchPrefixes: ["/news"],
    blurb:
      "Local headlines, current events, and YouTube news desks like Skip Smith.",
    image: "/graphics/theme-local-news.jpg",
  },
  {
    href: "/real-estate",
    label: "Real Estate",
    matchPrefixes: ["/real-estate"],
    blurb:
      "Featured homes, live market rabbit holes, and agents who speak “village.”",
    image: "/graphics/theme-real-estate.jpg",
  },
  {
    href: "/support-local-villagers",
    label: "Support Local",
    matchPrefixes: ["/support-local-villagers"],
    blurb:
      "Neighbor services — handyman, lawn, lessons, pets, tech, and more. Submit your listing for approval.",
    image: "/graphics/theme-community-resources.jpg",
  },
  {
    href: "/local-pros",
    label: "Local Pros",
    matchPrefixes: ["/local-pros"],
    blurb:
      "Area trades serving The Villages — electricians, plumbers, pools, screens, pavers, lightning protection, and more.",
    image: "/graphics/theme-community-resources.jpg",
  },
  {
    href: "/official-map",
    label: "Official Map",
    matchPrefixes: ["/official-map"],
    blurb:
      "District recreation map PDF — all the centers on one official cart-path cheat sheet.",
    image: "/graphics/theme-rec-centers.jpg",
  },
  {
    href: "/golf-zone",
    label: "Golf",
    blurb:
      "Executive trail, trail fees, course maps, and cart-path optimism — just one more hole.",
    image: "/graphics/theme-golf.jpg",
  },
  {
    href: "/pickleball",
    label: "Pickleball",
    matchPrefixes: ["/pickleball"],
    blurb:
      "DUPR board, find a game, rec-center courts, and the kitchen line — paddle diplomacy included.",
    image: "/graphics/theme-pickleball.jpg",
  },
  {
    href: "/club-zone",
    label: "Clubs",
    blurb:
      "Popular clubs, official directories, and member favorites — pickleball to mah-jongg.",
    image: "/graphics/theme-club-zone.jpg",
  },
  {
    href: "/arts-and-crafts",
    label: "Art",
    blurb:
      "Paint, pottery, glitter optional — plus The Villages Artisan Guild for local makers.",
    image: "/graphics/theme-arts-crafts-v2.jpg",
  },
  {
    href: "/calendar",
    label: "Calendar",
    blurb:
      "What’s on so you don’t double-book pickleball and a square-dance again.",
    image: "/graphics/theme-calendar.jpg",
  },
  {
    href: "/future-development",
    label: "Future Development",
    matchPrefixes: ["/future-development"],
    blurb:
      "Drone flyovers, construction watch, and “wait, that wasn’t there last month” energy.",
    image: "/graphics/theme-future-development.jpg",
  },
  {
    href: "/forums",
    label: "Community Forums",
    matchPrefixes: ["/forums"],
    blurb:
      "Public neighbor chat — pick a topic, start a conversation, talk back and forth.",
    image: "/graphics/theme-chaos.jpg",
  },
  {
    href: "/yard-sale",
    label: "Yard Sale",
    matchPrefixes: ["/yard-sale"],
    blurb:
      "One neighbor’s “why do I own this?” is another’s treasure — with photos. Posting is under My Space.",
    image: "/graphics/theme-wealth.jpg",
  },
  {
    href: "/best-of-the-month",
    label: "Best of the Month",
    matchPrefixes: ["/best-of-the-month"],
    blurb:
      "The monthly highlight reel — no dues, maximum chaos, zero algorithm anxiety.",
    image: "/graphics/theme-best-of-month.jpg",
  },
];

export function isMainTopicActive(pathname: string, item: (typeof MAIN_TOPICS)[number]) {
  const prefixes = item.matchPrefixes || [item.href];
  return prefixes.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}
