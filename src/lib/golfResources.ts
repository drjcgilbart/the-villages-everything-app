/**
 * Curated golf resources for The Villages.
 * Public official / well-known links for orientation — confirm fees & rules on the source sites.
 */

export type GolfResource = {
  id: string;
  label: string;
  href: string;
  note: string;
  kind: "official" | "map" | "guide" | "fees" | "local";
};

export type GolfLinkGroup = {
  title: string;
  blurb: string;
  links: GolfResource[];
};

export const GOLF_HUB = {
  name: "Golf in The Villages",
  blurb:
    "Executive Trail free greens for residents (trail fee if you ride your cart), plus championship / country-club play through Golf The Villages. Cart paths are a lifestyle; the fairways are the hobby.",
} as const;

export const GOLF_SNAPSHOT = [
  {
    title: "Executive Golf Trail",
    body: "40+ nine-hole executive courses (mostly par 3s, occasional par 4). Greens fees free for residents via amenity fee; trail fee required to use your personal cart on the path network.",
  },
  {
    title: "Difficulty levels 1–4",
    body: "Executive courses are rated Level 1 (friendliest) through Level 4 (more challenge) so you can match the day to your game — or your guests.",
  },
  {
    title: "Championship & clubs",
    body: "Championship and Golf & Country Club courses are a separate system (developer / club side) with green fees and tee-time culture. Great when you want a full 18 and a different vibe.",
  },
  {
    title: "Cart path reality",
    body: "On par-3 executive holes, carts stay on the path. Par 4s may allow off-path under normal conditions. Wet turf = restrictions. Don’t invent new cart rules mid-round.",
  },
] as const;

export const GOLF_LINK_GROUPS: GolfLinkGroup[] = [
  {
    title: "Official hubs",
    blurb: "Start here before you invent a course list from a group chat.",
    links: [
      {
        id: "gtv-home",
        label: "Golf The Villages",
        href: "https://www.golfthevillages.com/",
        note: "Course directory, maps, news, and the main golf ops site",
        kind: "official",
      },
      {
        id: "tv-executive",
        label: "Executive courses overview",
        href: "https://www.thevillages.com/golf/executive/",
        note: "Levels 1–4, free resident play overview, guides & turf talk",
        kind: "official",
      },
      {
        id: "district-exec",
        label: "District executive golf",
        href: "https://www.districtgov.org/golf/executive/",
        note: "CDD-operated executive trails, amenity-supported play",
        kind: "official",
      },
      {
        id: "tv-golf-rates",
        label: "Golf rates & fees",
        href: "https://www.thevillages.com/golf/rates/",
        note: "Trail pass, championship fees, household cart use notes",
        kind: "fees",
      },
    ],
  },
  {
    title: "Trail fees & cart play",
    blurb: "The cart is free to own; the trail pass is how it becomes legal on the executive courses.",
    links: [
      {
        id: "trail-fees",
        label: "Trail fees (District)",
        href: "https://www.districtgov.org/golf/trail-fees/",
        note: "Monthly / 6-month / annual pass options — confirm current prices",
        kind: "fees",
      },
      {
        id: "trail-purchase",
        label: "Purchase trail pass online",
        href: "https://membership.golfthevillages.com/",
        note: "Membership / trail fee purchase portal",
        kind: "fees",
      },
      {
        id: "trail-app-pdf",
        label: "Trail fee application (PDF)",
        href: "https://www.golfthevillages.com/executive-golf/images/trailfeeapp.pdf",
        note: "Paper / mail / rec-center path when you prefer analog",
        kind: "fees",
      },
      {
        id: "exec-faq",
        label: "Executive Golf Trail FAQ",
        href: "https://www.golfthevillages.com/executive-golf/faq.asp",
        note: "Cart guidelines, rentals, delays, scrambles, Super Seniors",
        kind: "guide",
      },
    ],
  },
  {
    title: "Maps & find-a-course",
    blurb: "Because “third left after the roundabout” is not a tee sheet.",
    links: [
      {
        id: "golf-map-pdf",
        label: "Golf courses map (PDF)",
        href: "https://www.golfthevillages.com/images/thevillagesgolfmap.pdf",
        note: "Executive + country club layout overview",
        kind: "map",
      },
      {
        id: "course-locator",
        label: "Interactive course locator",
        href: "https://www.golfthevillages.com/locator/index.asp",
        note: "Find championship / club courses on the map",
        kind: "map",
      },
      {
        id: "exec-list",
        label: "Executive course home / list",
        href: "https://www.golfthevillages.com/executive-golf/",
        note: "Per-course pages, scorecards, directions",
        kind: "map",
      },
      {
        id: "phone-dir",
        label: "Course addresses & phone directory (PDF)",
        href: "https://www.golfthevillages.com/images/TelephoneDirectory.pdf?v=1217",
        note: "Starter shack contact list when GPS gets creative",
        kind: "map",
      },
    ],
  },
  {
    title: "Guides & good golf",
    blurb: "Rules, etiquette, and “how we play here” without the lecture tone.",
    links: [
      {
        id: "good-golf-guide",
        label: "Good Golf Guide (PDF)",
        href: "https://www.golfthevillages.com/golf-in-the-villages/goodgolfguide.pdf",
        note: "Policies including guest play notes — read before you bring friends",
        kind: "guide",
      },
      {
        id: "exec-overview",
        label: "Executive trail overview page",
        href: "https://www.golfthevillages.com/executive-golf/",
        note: "Resident free greens + trail fee structure in plain language",
        kind: "guide",
      },
      {
        id: "tv-map",
        label: "The Villages community map",
        href: "https://www.thevillages.com/map/",
        note: "Broader map for rec, shopping, and “where am I again?”",
        kind: "map",
      },
    ],
  },
  {
    title: "Nearby hub tools",
    blurb: "Golf pairs well with a rec-center cool-down and a square band after dark.",
    links: [
      {
        id: "rec-centers",
        label: "Rec Centers (this hub)",
        href: "/rec-centers",
        note: "Pools, pickleball, and regional complexes after nine holes",
        kind: "local",
      },
      {
        id: "town-squares",
        label: "Town Squares (this hub)",
        href: "/town-squares",
        note: "Celebrate (or mourn) the round with free live music",
        kind: "local",
      },
      {
        id: "calendar",
        label: "Calendar (this hub)",
        href: "/calendar",
        note: "What’s on so you don’t double-book the scramble",
        kind: "local",
      },
      {
        id: "health",
        label: "Health (this hub)",
        href: "/health",
        note: "Stretching, steps, and “my back after 27 holes” energy",
        kind: "local",
      },
    ],
  },
];

export const GOLF_TIPS = [
  "Residents: amenity fee covers executive greens; trail fee is the cart-path passport — buy before you invent a workaround.",
  "Guest rules matter. Check the Good Golf Guide before promising friends “we’ll just hop on any course.”",
  "Level 1–2 executive courses are friendlier for new golfers and visiting grandkids; Level 4 is for the competitive mood.",
  "Weather and turf maintenance close or restrict carts — wet Florida afternoons are not a suggestion.",
  "Starter shacks know the day’s path rules. Be nice; they run the show.",
  "Pair a short executive nine with a rec-center pool or square evening — classic Villages pacing.",
] as const;
