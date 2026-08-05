export type TopicSlug =
  | "health"
  | "wealth"
  | "neighbors"
  | "golf-zone"
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
      "Steps, sleep, meds, meals, and the occasional “I walked to the rec center on purpose.” Wellness without the wellness cult energy.",
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
    ],
    highlights: [
      {
        title: "Moving more",
        body: "Cart paths, rec centers, and the gentle art of choosing the long way home.",
      },
      {
        title: "Feeling better",
        body: "Doctors, routines, and small wins that don’t require a new personality.",
      },
      {
        title: "Honest check-ins",
        body: "What worked, what didn’t, and what we’re still negotiating with ourselves about.",
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
      "Portfolios, pensions, compound interest, and pretending quarterly statements are mystery novels. Money lessons from the reboot — without the hard sell.",
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
    ],
    highlights: [
      {
        title: "Markets, demystified",
        body: "What’s actually going on — in plain English, with room for healthy skepticism.",
      },
      {
        title: "Retirement money",
        body: "How the reboot treats cash flow, risk, and the emotional support spreadsheet.",
      },
      {
        title: "Lessons learned",
        body: "Wins, oops moments, and the stuff they don’t put on the brochure.",
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
      "Golf courses, golf carts, range days, and the beautiful absurdity of a community designed around the green. Tips, tales, and trail reports from the reboot.",
    image: "/graphics/hero-golf-cart.jpg",
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
    ],
    highlights: [
      {
        title: "Executive Trail",
        body: "40+ resident-friendly executive courses — free greens for residents; trail fee if you ride your cart.",
      },
      {
        title: "On the course",
        body: "Rounds, mishits, and the eternal optimism of “just one more hole.”",
      },
      {
        title: "Cart culture",
        body: "Decorated rides, path rules, and why everything here is a cart trip.",
      },
      {
        title: "Maps & fees",
        body: "Official course maps, trail-pass portals, and FAQs linked from this page.",
      },
    ],
    quote:
      "In The Villages, the golf cart isn’t transportation. It’s a personality type.",
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
    navLabel: "My Village",
    title: "My Village",
    kicker: "Find your neighborhood",
    description:
      "The Villages is made of many individual villages — Edenfield, Fenney, Bonnybrook, and 100+ more. Search or browse by area, open your village’s landing page, and star it so it’s always easy to find.",
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
        title: "Your landing page",
        body: "Each village gets its own page with area context, CDD when known, and nearby square energy.",
      },
      {
        title: "Save “Mine”",
        body: "Star your village on this device for a one-click return next visit.",
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
    kicker: "Squares · rec · homes · neighbors",
    description:
      "Town squares, recreation centers, real estate, yard sale, and monthly highlights — everyday Villages resources in one place. (Meet Your Neighbors lives on each village page under My Village.)",
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
 * Primary top-level topics for The Villages Hub.
 * Everything else lives under Community Resources (or Media & story).
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
    href: "/my-village",
    label: "My Village",
    blurb:
      "Edenfield, Fenney, and 100+ villages — search, star yours, and meet neighbors unique to your village.",
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
      "Steps, sleep, and “I walked to the rec center on purpose” — wellness without the cult.",
    image: "/graphics/theme-health.jpg",
  },
  {
    href: "/wealth",
    label: "Wealth",
    blurb:
      "Markets, money lessons, and pretending compound interest is a love language.",
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
    href: "/golf-zone",
    label: "Golf",
    blurb:
      "Executive trail, trail fees, course maps, and cart-path optimism — just one more hole.",
    image: "/graphics/hero-golf-cart.jpg",
  },
  {
    href: "/club-zone",
    label: "Clubs",
    blurb:
      "Popular clubs, official directories, and Hub Member favorites — pickleball to mah-jongg.",
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
    href: "/community-resources",
    label: "Community Resources",
    matchPrefixes: [
      "/community-resources",
      "/town-squares",
      "/rec-centers",
      "/real-estate",
      "/yard-sale",
      "/best-of-the-month",
    ],
    blurb:
      "Squares, rec centers, real estate, yard sale — the “everything else” drawer, organized.",
    image: "/graphics/theme-community-resources.jpg",
  },
];

/** Nested tools under Community Resources */
export const COMMUNITY_RESOURCES: {
  href: string;
  label: string;
  blurb: string;
  image: string;
}[] = [
  {
    href: "/town-squares",
    label: "Town Squares",
    blurb:
      "Spanish Springs, Lake Sumter, Brownwood — free bands, shopping, and dancing after dark.",
    image: "/graphics/theme-town-squares.jpg",
  },
  {
    href: "/rec-centers",
    label: "Rec Centers",
    blurb:
      "Pools, pickleball diplomacy, billiards, and “see you at the rec center.”",
    image: "/graphics/theme-rec-centers.jpg",
  },
  {
    href: "/real-estate",
    label: "Real Estate",
    blurb:
      "Featured homes, live market rabbit holes, and agents who speak “village.”",
    image: "/graphics/theme-real-estate.jpg",
  },
  {
    href: "/yard-sale",
    label: "Yard Sale",
    blurb:
      "One neighbor’s “why do I own this?” is another’s treasure — with photos.",
    image: "/graphics/theme-wealth.jpg",
  },
  {
    href: "/best-of-the-month",
    label: "Best of the Month",
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
