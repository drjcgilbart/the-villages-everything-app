/**
 * Local News hub — pure data (client-safe).
 * Creators and outlets are independent; not affiliated with this hub
 * or The Villages® developer.
 */

export type NewsCreator = {
  id: string;
  name: string;
  handle: string;
  channelUrl: string;
  /** YouTube uploads playlist id (usually UU + channel id without UC) for live feed embed */
  uploadsPlaylistId?: string;
  blurb: string;
  strengths: string[];
  featuredVideoId?: string;
  featuredVideoTitle?: string;
};

export type NewsOutlet = {
  id: string;
  name: string;
  url: string;
  blurb: string;
  kind: "newspaper" | "web" | "government" | "video";
};

export type NewsBeat = {
  id: string;
  title: string;
  emoji: string;
  blurb: string;
  links: { label: string; url: string }[];
};

/**
 * Channel UCMd3d4-lsElMm2ytCWsWjkQ → uploads playlist UUMd3d4-lsElMm2ytCWsWjkQ
 */
export const NEWS_CREATORS: NewsCreator[] = [
  {
    id: "skip-smith",
    name: "The Villages Skip Smith",
    handle: "@TheVillagesSkipSmith",
    channelUrl: "https://www.youtube.com/@TheVillagesSkipSmith",
    uploadsPlaylistId: "UUMd3d4-lsElMm2ytCWsWjkQ",
    blurb:
      "One of the longest-running Villages YouTube voices — news roundups, cart-path takes, and the good/bad/ugly with zero corporate brochure gloss.",
    strengths: [
      "Regular Villages news updates",
      "Long-timer perspective (decades of context)",
      "Porch-settin’ chat energy",
    ],
    featuredVideoId: "vklF4dN3UmM",
    featuredVideoTitle: "The Villages News Updated",
  },
  {
    id: "villages-news-yt",
    name: "Villages-News.com",
    handle: "@VillagesNews",
    channelUrl: "https://www.youtube.com/@VillagesNews",
    uploadsPlaylistId: undefined, // channel handle works via channel link; playlist optional
    blurb:
      "Video updates paired with Villages-News.com — local headlines, government, community, and “what just happened?” coverage.",
    strengths: [
      "Local news clips",
      "Government & community stories",
      "Companion site for full articles",
    ],
    featuredVideoId: "UEbp2sjDjPQ",
    featuredVideoTitle: "Latest from Villages-News.com",
  },
  {
    id: "gold-wingnut-news",
    name: "Gold Wingnut",
    handle: "@GoldWingnut",
    channelUrl: "https://www.youtube.com/@GoldWingnut",
    uploadsPlaylistId: "UUSo2ryYtJMOtYArrjDHj8Ag",
    blurb:
      "Construction progress, community news, and live Q&A — when “current events” means dirt piles and district drama.",
    strengths: [
      "Construction update series",
      "Weekly live streams",
      "Sumter County context",
    ],
    featuredVideoId: "rhW2CbphsJc",
    featuredVideoTitle: "Construction / community updates",
  },
  {
    id: "gary-abbott",
    name: "Gary Abbott",
    handle: "@GaryAbbott",
    channelUrl: "https://www.youtube.com/@GaryAbbott",
    // UC n2JLUrRmBLWuYNVhQa2Nug → UU uploads playlist
    uploadsPlaylistId: "UUn2JLUrRmBLWuYNVhQa2Nug",
    blurb:
      "Essential Villages resource channel — market and cost-of-living breakdowns, lifestyle tours, and practical “should I move here?” guidance from a long-running local voice.",
    strengths: [
      "Market & cost-of-living explainers",
      "Village-by-village perspective",
      "Retiree lifestyle & planning tips",
    ],
    featuredVideoId: "ROeoWfs9Iag",
    featuredVideoTitle: "Can You Afford to Live in The Villages?",
  },
  {
    id: "michael-tiffany",
    name: "Michael & Tiffany",
    handle: "@MichaelTiffanyTVE",
    channelUrl: "https://www.youtube.com/@MichaelTiffanyTVE",
    // UC oaPwHit-FPAU_-tDy5wSKg → UU uploads playlist
    uploadsPlaylistId: "UUoaPwHit-FPAU_-tDy5wSKg",
    blurb:
      "Real-life experiences and expenses after moving to The Villages — home tours, budgets, cart culture, and the day-to-day of full-time living here.",
    strengths: [
      "Real expense & budget trackers",
      "Home tours & move diaries",
      "Lifestyle vlogs for newcomers",
    ],
    featuredVideoId: "cRcDRSO34DA",
    featuredVideoTitle: "Moving from California to Florida — new home tour",
  },
];

export const NEWS_OUTLETS: NewsOutlet[] = [
  {
    id: "daily-sun",
    name: "The Villages Daily Sun",
    url: "https://www.thevillagesdailysun.com/",
    blurb:
      "The big local paper — events, breaking stories, and the “what’s in print today?” habit.",
    kind: "newspaper",
  },
  {
    id: "villages-news",
    name: "Villages-News.com",
    url: "https://www.villages-news.com/",
    blurb:
      "Independent web news — government, crime, community, letters, and same-day headlines.",
    kind: "web",
  },
  {
    id: "districtgov",
    name: "Districtgov.org",
    url: "https://www.districtgov.org/whats-happening/",
    blurb:
      "Official district “what’s happening” — utilities, meetings, and resident notices.",
    kind: "government",
  },
  {
    id: "thevillages-entertainment",
    name: "The Villages entertainment calendar",
    url: "https://www.thevillages.com/free-entertainment/",
    blurb:
      "Official free entertainment lineup across the squares — live music nights.",
    kind: "web",
  },
];

export const NEWS_BEATS: NewsBeat[] = [
  {
    id: "breaking-local",
    title: "Local headlines",
    emoji: "📰",
    blurb: "Start with independent + paper sources, then dig into video takes.",
    links: [
      { label: "Villages-News.com", url: "https://www.villages-news.com/" },
      {
        label: "Daily Sun",
        url: "https://www.thevillagesdailysun.com/",
      },
    ],
  },
  {
    id: "government",
    title: "Government & districts",
    emoji: "🏛️",
    blurb: "Meetings, notices, and the boring stuff that actually matters.",
    links: [
      {
        label: "District what’s happening",
        url: "https://www.districtgov.org/whats-happening/",
      },
      {
        label: "Find my district",
        url: "https://www.districtgov.org/districts/finder/",
      },
    ],
  },
  {
    id: "weather-safety",
    title: "Weather & safety",
    emoji: "⛈️",
    blurb: "Storm prep is a Villages sport. Check official weather before the cart parade.",
    links: [
      {
        label: "NWS Tampa Bay",
        url: "https://www.weather.gov/tbw/",
      },
      {
        label: "Florida Division of Emergency Management",
        url: "https://www.floridadisaster.org/",
      },
    ],
  },
  {
    id: "entertainment",
    title: "Squares & entertainment",
    emoji: "🎶",
    blurb: "Who’s playing where — and when to leave so you get a table.",
    links: [
      {
        label: "Free entertainment",
        url: "https://www.thevillages.com/free-entertainment/",
      },
      { label: "Hub Calendar", url: "/calendar" },
    ],
  },
  {
    id: "growth",
    title: "Growth & construction",
    emoji: "🚧",
    blurb: "Dirt piles as current events — pair news with drone flyovers.",
    links: [
      { label: "Future Development hub", url: "/future-development" },
      {
        label: "Gold Wingnut on YouTube",
        url: "https://www.youtube.com/@GoldWingnut",
      },
    ],
  },
];

export function newsCreatorById(id: string) {
  return NEWS_CREATORS.find((c) => c.id === id) || null;
}
