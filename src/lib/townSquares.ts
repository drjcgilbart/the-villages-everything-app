/**
 * Town Squares hub + per-square detail data.
 *
 * Live cams: outbound link only to the official The Villages® Live Web Cameras page.
 * We do not embed stream players. Curated links are public pages (official, maps,
 * entertainment calendars, independent guides) — not affiliation claims.
 */
export const OFFICIAL_LIVE_CAMS_URL =
  "https://www.thevillages.com/entertainment/live-cams/";

export const OFFICIAL_TOWN_SQUARES_HUB =
  "https://www.thevillages.com/entertainment/town-squares/";

export type CuratedLink = {
  label: string;
  href: string;
  note: string;
  /** Prefer "official" for The Villages / District pages */
  kind?: "official" | "map" | "guide" | "local";
};

export type SquarePhoto = {
  /** Path under /public */
  src: string;
  alt: string;
  /** Short credit line shown under the photo */
  credit: string;
};

export type TownSquare = {
  id: string;
  name: string;
  shortName: string;
  blurb: string;
  /** Longer intro for the square’s own page */
  about: string;
  theme: string;
  area: string;
  address: string;
  cityStateZip: string;
  /** Google Maps destination query */
  mapQuery: string;
  camNote: string;
  /** Primary card + hero image */
  photo: SquarePhoto;
  /** Optional extra gallery photos on the detail page */
  gallery?: SquarePhoto[];
  officialPage: string;
  entertainmentPage?: string;
  highlights: string[];
  coolBits: { title: string; body: string }[];
  knownSpots: { name: string; kind: string }[];
  tips: string[];
  links: CuratedLink[];
};

export const TOWN_SQUARES: TownSquare[] = [
  {
    id: "spanish-springs",
    name: "Spanish Springs Town Square",
    shortName: "Spanish Springs",
    blurb:
      "The original social main stage — adobe-ish charm, shops, restaurants, and free outdoor bands most nights.",
    about:
      "Spanish Springs is the OG town square — southwest-plaza energy with stucco, fountains, and the “we’ve been doing free outdoor bands longer than your cart has existed” pedigree. It’s the classic first stop for visitors and still a weeknight default for residents who know every lamppost by heart.",
    theme: "Southwest plaza · original square",
    area: "North / historic side of The Villages",
    address: "1051 Main Street",
    cityStateZip: "The Villages, FL 32159",
    mapQuery: "Spanish Springs Town Square, 1051 Main St, The Villages, FL 32159",
    camNote: "Main view and East Entrance cams when online.",
    photo: {
      src: "/graphics/town-squares/spanish-springs-v2.jpg",
      alt: "Whimsical cartoon of Spanish Springs — adobe plaza, fountain, red-tile roofs, and outdoor stage",
      credit:
        "Original whimsical illustration for The Villages Everything App",
    },
    officialPage:
      "https://www.thevillages.com/shopping-dining/spanish-springs/",
    entertainmentPage:
      "https://www.thevillagesentertainment.com/spanish-springs/",
    highlights: [
      "Free live outdoor entertainment most nights (hours shift seasonally)",
      "Dense mix of restaurants, boutiques, and services around Main Street",
      "Near the Sharon L. Morse Performing Arts Center",
      "Classic car cruise-ins and plaza people-watching are local traditions",
    ],
    coolBits: [
      {
        title: "Oldest square energy",
        body: "Built first, still packing the plaza. If someone says “meet me on the square” without specifying which, Spanish Springs is often what they mean.",
      },
      {
        title: "Stage + shopping loop",
        body: "Do a full lap: band, gelato or ice cream, a boutique window, then back for the next set. Cart parking fills early on big nights — plan the approach.",
      },
      {
        title: "Performing arts next door",
        body: "The Sharon L. Morse Performing Arts Center sits in the Spanish Springs orbit — useful when you want seats and a program instead of dancing on bricks.",
      },
    ],
    knownSpots: [
      { name: "Banner Mercantile (Villages Logo Store)", kind: "Shopping" },
      { name: "World of Beer", kind: "Dining / drinks" },
      { name: "Flippers Pizza", kind: "Dining" },
      { name: "Bella Vita Italian Steakhouse", kind: "Dining" },
      { name: "Kilwin’s Chocolate & Ice Cream", kind: "Treats" },
      { name: "Spanish Springs Lanes", kind: "Bowling" },
      { name: "The Corkscrew Winery", kind: "Wine" },
      { name: "Sharon L. Morse Performing Arts Center", kind: "Shows" },
    ],
    tips: [
      "Summer entertainment hours often run later than winter — check the current schedule before you cart over.",
      "Happy hour windows at square bars change; the entertainment site is the least-stale place to peek.",
      "If you’re bringing guests, this is the easiest “wow, this is a thing” first square.",
    ],
    links: [
      {
        label: "Official Spanish Springs page",
        href: "https://www.thevillages.com/shopping-dining/spanish-springs/",
        note: "Shop, dine, and square overview from The Villages",
        kind: "official",
      },
      {
        label: "Nightly entertainment schedule",
        href: "https://www.thevillagesentertainment.com/spanish-springs/",
        note: "Who’s playing and when",
        kind: "official",
      },
      {
        label: "Official live webcams",
        href: OFFICIAL_LIVE_CAMS_URL,
        note: "Main + East Entrance angles when live",
        kind: "official",
      },
      {
        label: "Google Maps",
        href: "https://www.google.com/maps/search/?api=1&query=Spanish+Springs+Town+Square+The+Villages+FL",
        note: "Directions by car or for cart-path planning",
        kind: "map",
      },
      {
        label: "Inside the Bubble guide",
        href: "https://www.insidethebubble.net/spanish-springs-town-square/",
        note: "Independent long-form square overview",
        kind: "guide",
      },
      {
        label: "All town squares (official hub)",
        href: OFFICIAL_TOWN_SQUARES_HUB,
        note: "Compare squares on thevillages.com",
        kind: "official",
      },
    ],
  },
  {
    id: "lake-sumter",
    name: "Lake Sumter Landing Market Square",
    shortName: "Lake Sumter Landing",
    blurb:
      "Lakeside market energy with the lighthouse silhouette, shopping, dining, and a packed entertainment calendar.",
    about:
      "Lake Sumter Landing is the waterfront market square — lighthouse silhouette, boardwalk-adjacent vibes, and a “seaside town that somehow landed in Central Florida” set piece. It’s a natural meet-in-the-middle square for a lot of cart-path routes.",
    theme: "Waterfront market square · lighthouse",
    area: "Central The Villages",
    address: "1000 Lake Sumter Landing",
    cityStateZip: "The Villages, FL 32162",
    mapQuery: "Lake Sumter Landing Market Square, 1000 Lake Sumter Landing, The Villages, FL 32162",
    camNote: "Main and Gazebo views — sometimes offline for adjustments.",
    photo: {
      src: "/graphics/town-squares/lake-sumter-landing-v2.jpg",
      alt: "Whimsical cartoon of Lake Sumter Landing — lighthouse, long pier, market stalls, and lake sunset",
      credit:
        "Original whimsical illustration for The Villages Everything App",
    },
    officialPage:
      "https://www.thevillages.com/shopping-dining/lake-sumter-landing/",
    entertainmentPage:
      "https://www.thevillagesentertainment.com/",
    highlights: [
      "Lakeside setting with lighthouse landmark energy",
      "Market-square shopping and restaurant density",
      "Gazebo-area gathering and photo ops",
      "Central location that works as a cart-path crossroads",
    ],
    coolBits: [
      {
        title: "Lighthouse as wayfinding",
        body: "If you can see the lighthouse, you’re close enough to start arguing about parking. It’s the square’s skyline emoji.",
      },
      {
        title: "Golden-hour square",
        body: "Water + lights + live music is why this one shows up in so many visitor photos. Even the “we’re just walking” crowd ends up here.",
      },
      {
        title: "Cameras with a gazebo angle",
        body: "When the official cams are online, the gazebo view is a fun pre-check for crowd size before you leave the driveway.",
      },
    ],
    knownSpots: [
      { name: "Lighthouse-area waterfront views", kind: "Landmark" },
      { name: "Market Square shops & boutiques", kind: "Shopping" },
      { name: "Square restaurants & outdoor seating", kind: "Dining" },
      { name: "Gazebo / plaza stage area", kind: "Entertainment" },
    ],
    tips: [
      "Cameras sometimes show “adjustments happening” — if the live feed is dark, trust the entertainment schedule instead.",
      "Weekends get dense; weeknights can feel more neighborly.",
      "Pair a square night with a lakeside stroll if the band break is long.",
    ],
    links: [
      {
        label: "Official Lake Sumter Landing page",
        href: "https://www.thevillages.com/shopping-dining/lake-sumter-landing/",
        note: "Shopping, dining, and square overview",
        kind: "official",
      },
      {
        label: "Entertainment calendar hub",
        href: "https://www.thevillagesentertainment.com/",
        note: "Find who’s on which square tonight",
        kind: "official",
      },
      {
        label: "Official live webcams",
        href: OFFICIAL_LIVE_CAMS_URL,
        note: "Main + Gazebo when available",
        kind: "official",
      },
      {
        label: "Google Maps",
        href: "https://www.google.com/maps/search/?api=1&query=Lake+Sumter+Landing+Market+Square+The+Villages+FL",
        note: "Pin for 1000 Lake Sumter Landing",
        kind: "map",
      },
      {
        label: "Free entertainment overview",
        href: "https://www.thevillages.com/free-entertainment/",
        note: "How free nightly entertainment works across squares",
        kind: "official",
      },
      {
        label: "All town squares (official hub)",
        href: OFFICIAL_TOWN_SQUARES_HUB,
        note: "Compare squares side by side",
        kind: "official",
      },
    ],
  },
  {
    id: "brownwood",
    name: "Brownwood Paddock Square",
    shortName: "Brownwood",
    blurb:
      "Ranch-town square with big-night energy, boutiques, restaurants, and the dance-floor gravity well of the south end.",
    about:
      "Brownwood Paddock Square leans into Florida cattle-ranch heritage — wooden storefronts, western flair, and a big open square that turns into a dance floor when the band hits. South-end residents treat it like their living room with better lighting.",
    theme: "Florida ranch · paddock square",
    area: "South / central-south The Villages",
    address: "2705 West Torch Lake Drive",
    cityStateZip: "The Villages, FL 32163",
    mapQuery:
      "Brownwood Paddock Square, 2705 West Torch Lake Drive, The Villages, FL 32163",
    camNote: "Main view and Northeast Entrance cams when online.",
    photo: {
      src: "/graphics/town-squares/brownwood-v2.jpg",
      alt: "Whimsical cartoon of Brownwood Paddock Square — ranch western storefronts, dance paddock, and cowboy boot stage",
      credit:
        "Original whimsical illustration for The Villages Everything App",
    },
    officialPage: "https://www.thevillages.com/shopping-dining/brownwood/",
    entertainmentPage: "https://www.thevillagesentertainment.com/",
    highlights: [
      "Ranch / Old Florida aesthetic with big open plaza",
      "Strong nightlife and dancing reputation among residents",
      "Shopping and dining ring around the paddock square",
      "Golf-cart accessible from the expanding south-end villages",
    ],
    coolBits: [
      {
        title: "Paddock as dance floor",
        body: "When the band is right, the square stops being architecture and becomes choreography. Wear shoes you can forgive.",
      },
      {
        title: "Lofts & lifestyle edge",
        body: "Newer residential products near Brownwood mean the square often feels like the social HQ of the growth edge.",
      },
      {
        title: "Two-cam reconnaissance",
        body: "Main + Northeast Entrance cams (when live) are handy for “is it packed already?” triage.",
      },
    ],
    knownSpots: [
      { name: "Paddock Square stage & plaza", kind: "Entertainment" },
      { name: "Western-themed storefronts & boutiques", kind: "Shopping" },
      { name: "Restaurants ringing the square", kind: "Dining" },
      { name: "Northeast entrance approach", kind: "Wayfinding" },
    ],
    tips: [
      "Big-band nights fill cart parking fast — have a plan B row.",
      "Ranch theme photographs well at dusk; bring a non-phone camera if you’re that friend.",
      "Square-hoppers often do Brownwood + another stop the same night if energy allows.",
    ],
    links: [
      {
        label: "Official Brownwood page",
        href: "https://www.thevillages.com/shopping-dining/brownwood/",
        note: "Shop, dine, and square overview",
        kind: "official",
      },
      {
        label: "Entertainment calendar hub",
        href: "https://www.thevillagesentertainment.com/",
        note: "Nightly lineup across squares",
        kind: "official",
      },
      {
        label: "Official live webcams",
        href: OFFICIAL_LIVE_CAMS_URL,
        note: "Main + Northeast Entrance angles",
        kind: "official",
      },
      {
        label: "Google Maps",
        href: "https://www.google.com/maps/search/?api=1&query=Brownwood+Paddock+Square+The+Villages+FL",
        note: "2705 West Torch Lake Drive area",
        kind: "map",
      },
      {
        label: "Directions (official)",
        href: "https://www.thevillages.com/directions/",
        note: "Sales / visitor orientation pins including Brownwood",
        kind: "official",
      },
      {
        label: "All town squares (official hub)",
        href: OFFICIAL_TOWN_SQUARES_HUB,
        note: "See every square at a glance",
        kind: "official",
      },
    ],
  },
  {
    id: "eastport",
    name: "Eastport",
    shortName: "Eastport",
    blurb:
      "Newer square energy on the growth edge — shopping, dining, and entertainment as the map keeps expanding.",
    about:
      "Eastport is one of the newer gathering centers — proof the cart-path social network keeps growing. Expect a more modern downtown feel than the classic three squares, with free entertainment, shops, and restaurants filling in as the east/south growth story continues.",
    theme: "Newer downtown · growth-edge square",
    area: "Expanding east / south corridor",
    address: "6980 Central Lake Drive",
    cityStateZip: "The Villages, FL 34762",
    mapQuery: "Eastport, 6980 Central Lake Drive, The Villages, FL",
    camNote: "Official cam listed; availability can read “coming soon.”",
    photo: {
      src: "/graphics/town-squares/eastport-v2.jpg",
      alt: "Whimsical cartoon of Eastport — modern glass shops, contemporary fountain, and new plaza stage",
      credit:
        "Original whimsical illustration for The Villages Everything App",
    },
    officialPage: "https://www.thevillages.com/shopping-dining/eastport/",
    entertainmentPage: "https://www.thevillagesentertainment.com/",
    highlights: [
      "Newer square on the growth edge of The Villages",
      "Shopping, dining, and free entertainment in the mix",
      "Live cam presence on the official cams page (status varies)",
      "Handy orientation point near Welcome Home / sales area energy",
    ],
    coolBits: [
      {
        title: "Watch a square grow up",
        body: "Eastport is still writing its “what’s classic here?” lore. Visiting now is like watching a neighborhood invent its default table.",
      },
      {
        title: "Growth-corridor pairing",
        body: "Pair an Eastport evening with Future Development rubbernecking if you like dirt piles and “that wasn’t there last month” energy.",
      },
      {
        title: "Cam status roulette",
        body: "If the official cam says “available soon,” treat it as a teaser trailer — the square itself is the feature film.",
      },
    ],
    knownSpots: [
      { name: "Eastport square plaza & stage", kind: "Entertainment" },
      { name: "Emerging shop & restaurant mix", kind: "Shop / dine" },
      { name: "Central Lake Drive approach", kind: "Wayfinding" },
    ],
    tips: [
      "Confirm entertainment times on the official calendar — newer squares still settle into rhythms.",
      "Combine with a Future Development watch if you’re mapping the next villages.",
      "Hours can follow the same seasonal summer shift as other squares.",
    ],
    links: [
      {
        label: "Official Eastport page",
        href: "https://www.thevillages.com/shopping-dining/eastport/",
        note: "Shop, dine, and square overview",
        kind: "official",
      },
      {
        label: "Entertainment calendar hub",
        href: "https://www.thevillagesentertainment.com/",
        note: "Who’s playing tonight",
        kind: "official",
      },
      {
        label: "Official live webcams",
        href: OFFICIAL_LIVE_CAMS_URL,
        note: "Eastport cam when the site says it’s live",
        kind: "official",
      },
      {
        label: "Google Maps",
        href: "https://www.google.com/maps/search/?api=1&query=Eastport+6980+Central+Lake+Drive+The+Villages+FL",
        note: "Pin near Central Lake Drive",
        kind: "map",
      },
      {
        label: "Future Development (this hub)",
        href: "/future-development",
        note: "Drone flyovers and growth corridors nearby",
        kind: "local",
      },
      {
        label: "All town squares (official hub)",
        href: OFFICIAL_TOWN_SQUARES_HUB,
        note: "Official multi-square overview",
        kind: "official",
      },
    ],
  },
  {
    id: "sawgrass-grove",
    name: "Sawgrass Grove",
    shortName: "Sawgrass Grove",
    blurb:
      "One of the newer gathering spots — another place to cart in, people-watch, and catch live music when it’s on.",
    about:
      "Sawgrass Grove is a newer social node with its own flavor (think railroad-depot / grove character more than a classic “town square” label). It’s part of the modern Villages entertainment map: free music, shopping, dining, and another reason to leave the recliner.",
    theme: "Grove / depot character · newer gathering spot",
    area: "South growth area",
    address: "766 Marilee Place",
    cityStateZip: "The Villages, FL 32163",
    mapQuery: "Sawgrass Grove, 766 Marilee Place, The Villages, FL",
    camNote: "Main view on the official Live Web Cameras page.",
    photo: {
      src: "/graphics/town-squares/sawgrass-grove-v2.jpg",
      alt: "Whimsical cartoon of Sawgrass Grove — railroad depot, clock tower, gazebo, sawgrass, and golf carts",
      credit:
        "Original whimsical illustration for The Villages Everything App",
    },
    officialPage: "https://www.thevillages.com/shopping-dining/sawgrass-grove/",
    entertainmentPage: "https://www.thevillagesentertainment.com/",
    highlights: [
      "Newer gathering place on the official entertainment map",
      "Shopping and dining alongside free live entertainment",
      "Live cam listed on the official cams page",
      "Midday entertainment notes sometimes differ from other squares",
    ],
    coolBits: [
      {
        title: "Not just “the big three”",
        body: "Locals who only name Spanish Springs, Lake Sumter, and Brownwood are living in last decade’s playlist. Sawgrass Grove is on the setlist.",
      },
      {
        title: "Midday vs night rhythm",
        body: "Official summer notes have sometimes kept midday entertainment patterns here while night hours shift elsewhere — always double-check the schedule.",
      },
      {
        title: "Cam before cart",
        body: "Main cam on the official page is a quick “worth the battery?” check before you roll out.",
      },
    ],
    knownSpots: [
      { name: "Sawgrass Grove plaza & stage", kind: "Entertainment" },
      { name: "Shop & restaurant cluster", kind: "Shop / dine" },
      { name: "Marilee Place approach", kind: "Wayfinding" },
    ],
    tips: [
      "Check whether midday entertainment is running the day you visit — this spot sometimes has a different daytime pattern.",
      "Great “second stop” on a square-hopping night if the first square is packed.",
      "Sales / welcome outposts in the area mean visitor traffic can spike midday.",
    ],
    links: [
      {
        label: "Official Sawgrass Grove page",
        href: "https://www.thevillages.com/shopping-dining/sawgrass-grove/",
        note: "Shop, dine, and square overview",
        kind: "official",
      },
      {
        label: "Entertainment calendar hub",
        href: "https://www.thevillagesentertainment.com/",
        note: "Nightly (and sometimes midday) lineup",
        kind: "official",
      },
      {
        label: "Official live webcams",
        href: OFFICIAL_LIVE_CAMS_URL,
        note: "Main view when online",
        kind: "official",
      },
      {
        label: "Google Maps",
        href: "https://www.google.com/maps/search/?api=1&query=Sawgrass+Grove+Marilee+Place+The+Villages+FL",
        note: "Marilee Place area pin",
        kind: "map",
      },
      {
        label: "Summer entertainment hours note",
        href: "https://www.thevillagesentertainment.com/entertainment-summer-hours/",
        note: "Seasonal hour shifts across squares",
        kind: "official",
      },
      {
        label: "All town squares (official hub)",
        href: OFFICIAL_TOWN_SQUARES_HUB,
        note: "Official multi-square overview",
        kind: "official",
      },
    ],
  },
];

export function getTownSquare(id: string): TownSquare | undefined {
  return TOWN_SQUARES.find((s) => s.id === id);
}

export function otherTownSquares(id: string): TownSquare[] {
  return TOWN_SQUARES.filter((s) => s.id !== id);
}

export function mapsUrl(square: TownSquare): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(square.mapQuery)}`;
}
