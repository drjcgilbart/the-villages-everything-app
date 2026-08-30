/**
 * Curated pickleball resources for The Villages.
 * Official / well-known links — confirm court times on the source sites.
 */

export type PickleballResource = {
  id: string;
  label: string;
  href: string;
  note: string;
};

export type PickleballLinkGroup = {
  title: string;
  blurb: string;
  links: PickleballResource[];
};

export const PICKLEBALL_HUB = {
  name: "Pickleball in The Villages",
  blurb:
    "Rec-center courts all over town, morning paddle stacks, DUPR for leagues and ladders, and a kitchen line that will humble anyone. Bring a resident or guest ID.",
} as const;

export const PICKLEBALL_ART = {
  theme: "/graphics/theme-pickleball.jpg",
  leaderboard: "/graphics/pickleball/leaderboard.jpg",
  findGame: "/graphics/pickleball/find-game.jpg",
  courts: "/graphics/pickleball/courts.jpg",
  kitchen: "/graphics/pickleball/kitchen.jpg",
} as const;

export const PICKLEBALL_FEATURE_CARDS = [
  {
    id: "dupr-board",
    href: "#dupr-board",
    title: "DUPR board",
    blurb: "Neighbor-reported doubles and singles ratings — admin-approved.",
    image: PICKLEBALL_ART.leaderboard,
  },
  {
    id: "find-game",
    href: "#find-game",
    title: "Find a game",
    blurb: "Need one more for doubles? Post when, where, and how many paddles.",
    image: PICKLEBALL_ART.findGame,
  },
  {
    id: "courts",
    href: "#courts",
    title: "Courts",
    blurb: "Rohan, Ezell, Olympia, Everglades — pickleball country at rec centers.",
    image: PICKLEBALL_ART.courts,
  },
  {
    id: "resources",
    href: "#resources",
    title: "Kitchen & official links",
    blurb: "DUPR, Pickleballers clubs, rec calendar, and the court diagram.",
    image: PICKLEBALL_ART.kitchen,
  },
] as const;

export const PICKLEBALL_SNAPSHOT = [
  {
    title: "Open play 7–10 a.m.",
    body: "Drop your paddle in the stack, play your game, then stack again. Morning open play is often 3.0+ — beginners should use intro times and clinics.",
    image: PICKLEBALL_ART.courts,
  },
  {
    title: "Stay out of the kitchen",
    body: "The non-volley zone is the 7-foot kitchen. Volleying in it (or on the line) is a fault. Dinks win Villages rec games.",
    image: PICKLEBALL_ART.kitchen,
  },
  {
    title: "Heat policy",
    body: "Rec Department play stops if the heat index hits 104° or the temperature is 35° or lower. Check Weather before you cart over.",
    image: PICKLEBALL_ART.findGame,
  },
  {
    title: "DUPR is the handicap",
    body: "Locals use DUPR for leagues, ladders, and balanced games. This site keeps a Villages book — official scores still go in the DUPR app.",
    image: PICKLEBALL_ART.leaderboard,
  },
] as const;

export const PICKLEBALL_LINK_GROUPS: PickleballLinkGroup[] = [
  {
    title: "Official Villages pickleball",
    blurb: "Court culture, clubs, and the rec calendar from the source.",
    links: [
      {
        id: "home",
        label: "Villages pickleball",
        href: "https://www.thevillages.com/recreation/pickleball/",
        note: "Official rec page",
      },
      {
        id: "pickleballers",
        label: "Pickleballers clubs",
        href: "https://www.thevillages.com/recreation/pickleballers/",
        note: "Club directory",
      },
      {
        id: "calendar",
        label: "Rec calendar",
        href: "https://www.thevillages.com/calendar/",
        note: "Open play & events",
      },
      {
        id: "sports",
        label: "District sports",
        href: "https://www.districtgov.org/recreation/sports/",
        note: "Amenity side",
      },
      {
        id: "flipbook",
        label: "Flipbook rec map",
        href: "https://online.flippingbook.com/view/10419946/",
        note: "Page-turner map of rec centers",
      },
      {
        id: "rec-map-pdf",
        label: "District rec map PDF",
        href: "https://www.districtgov.org/wp-content/uploads/2026/03/Recreation-Map-Update-0326.pdf",
        note: "March 2026 update",
      },
    ],
  },
  {
    title: "DUPR & competitive play",
    blurb: "Ratings live on DUPR. TVCPC runs the competitive club.",
    links: [
      {
        id: "dupr",
        label: "DUPR.com",
        href: "https://www.dupr.com/",
        note: "Official ratings",
      },
      {
        id: "dupr-dash",
        label: "DUPR dashboard",
        href: "https://dashboard.dupr.com/",
        note: "Log verified scores",
      },
      {
        id: "tvcpc",
        label: "TVCPC",
        href: "https://www.tvcpc.com/",
        note: "The Villages Competitive Pickleball Club",
      },
      {
        id: "tvcpc-faq",
        label: "TVCPC FAQ",
        href: "https://www.tvcpc.com/faq/",
        note: "How leagues work",
      },
    ],
  },
  {
    title: "Learn the game",
    blurb: "Clinics, court diagram, and a reminder that the kitchen is real.",
    links: [
      {
        id: "lessons",
        label: "Clinics",
        href: "https://pickleballcommunity.com/",
        note: "Lessons around The Villages",
      },
      {
        id: "usap",
        label: "Court diagram",
        href: "https://usapickleball.org/what-is-pickleball/court-diagram/",
        note: "USA Pickleball NVZ / kitchen",
      },
    ],
  },
];
