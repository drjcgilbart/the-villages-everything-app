/** News presets, Villages outlets, and search-link helpers. */

export const NEWS_PRESETS = [
  { id: "villages", label: "The Villages", query: "The Villages Florida news", ticker: "", emoji: "🏡" },
  { id: "florida", label: "Florida", query: "Florida news", ticker: "", emoji: "🌴" },
  { id: "storms", label: "Storms & hurricanes", query: "Florida hurricane tropical storm weather", ticker: "", emoji: "🌀" },
  { id: "medicare", label: "Medicare & health", query: "Medicare Social Security health news seniors", ticker: "", emoji: "💚" },
  { id: "golf", label: "Golf", query: "golf PGA Tour news", ticker: "", emoji: "⛳" },
  { id: "pickleball", label: "Pickleball", query: "pickleball news", ticker: "", emoji: "🏓" },
  { id: "markets", label: "Markets", query: "stock market Dow S&P 500 news", ticker: "", emoji: "📊" },
  { id: "travel", label: "Travel", query: "travel deals senior travel news", ticker: "", emoji: "✈️" },
  { id: "tesla", label: "Tesla", query: "Tesla TSLA stock", ticker: "TSLA", emoji: "⚡" },
  { id: "space", label: "Space travel", query: "SpaceX Starship NASA space travel", ticker: "", emoji: "🚀" },
  { id: "cooking", label: "Cooking", query: "easy recipes cooking tips", ticker: "", emoji: "🍲" },
  { id: "garden", label: "Gardening", query: "Florida gardening lawn care", ticker: "", emoji: "🌿" },
  { id: "cars", label: "Classic cars", query: "classic cars collector car news", ticker: "", emoji: "🚗" },
  { id: "tech", label: "Technology", query: "technology news gadgets", ticker: "", emoji: "💻" },
  { id: "sports", label: "Sports", query: "NFL college football sports news", ticker: "", emoji: "🏈" },
  { id: "grandkids", label: "Family & grandkids", query: "grandchildren family activities", ticker: "", emoji: "👨‍👩‍👧" },
] as const;

export const NEWS_OUTLET_LINKS = [
  {
    name: "The Villages Daily Sun",
    href: "https://www.thevillagesdailysun.com/",
    note: "Local paper · 984 Old Mill Run, Lake Sumter Landing",
  },
  {
    name: "Villages-News.com",
    href: "https://www.villages-news.com/",
    note: "Independent web news — government, crime, community",
  },
  {
    name: "District What’s Happening",
    href: "https://www.districtgov.org/whats-happening/",
    note: "Official notices, utilities, meetings",
  },
  {
    name: "WVLG 640 AM / 102.7 FM",
    href: "https://www.thevillagesdailysun.com/links/wvlg/",
    note: "Villages radio · classic hits + local news (Fox News Radio)",
  },
  {
    name: "National Hurricane Center",
    href: "https://www.nhc.noaa.gov/",
    note: "The storm desk — not a Facebook graphic",
  },
  {
    name: "NWS Tampa Bay",
    href: "https://www.weather.gov/tbw/",
    note: "Forecast office covering much of The Villages",
  },
];

export const SUGGESTED_CREATORS: Record<string, { name: string; url: string }[]> = {
  villages: [
    { name: "The Villages Skip Smith", url: "https://www.youtube.com/@TheVillagesSkipSmith" },
    { name: "Villages-News.com", url: "https://www.youtube.com/@VillagesNews" },
    { name: "Gold Wingnut", url: "https://www.youtube.com/@GoldWingnut" },
    { name: "Gary Abbott", url: "https://www.youtube.com/@GaryAbbott" },
    { name: "THE VILLAGES FLORIDA NEWCOMERS", url: "https://www.youtube.com/@JERRYANDLINDA" },
  ],
  storms: [{ name: "National Hurricane Center", url: "https://www.youtube.com/@NHCLive" }],
  golf: [{ name: "PGA TOUR", url: "https://www.youtube.com/@PGATOUR" }],
  markets: [{ name: "CNBC Television", url: "https://www.youtube.com/@CNBCtelevision" }],
  cooking: [{ name: "America's Test Kitchen", url: "https://www.youtube.com/@AmericasTestKitchen" }],
  tech: [{ name: "Marques Brownlee", url: "https://www.youtube.com/@mkbhd" }],
  space: [
    { name: "Everyday Astronaut", url: "https://www.youtube.com/@EverydayAstronaut" },
    { name: "NASA", url: "https://www.youtube.com/@NASA" },
  ],
};

export function googleNewsSearch(query: string) {
  return `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
}

export function googleNewsRss(query: string) {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
}

export function yahooNewsSearch(query: string) {
  return `https://news.search.yahoo.com/search?p=${encodeURIComponent(query)}`;
}

export function youtubeSearch(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export type NewsHeadline = {
  title: string;
  link: string;
  source: string;
  date: string;
};

export function decodeXml(s: string) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export function parseNewsRss(xml: string, limit = 6): NewsHeadline[] {
  const out: NewsHeadline[] = [];
  const re = /<item>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) && out.length < limit) {
    const block = m[1];
    const title = decodeXml((block.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || "").trim();
    const link = decodeXml((block.match(/<link>([\s\S]*?)<\/link>/i) || [])[1] || "").trim();
    const source = decodeXml((block.match(/<source[^>]*>([\s\S]*?)<\/source>/i) || [])[1] || "").trim();
    const date = decodeXml((block.match(/<pubDate>([\s\S]*?)<\/pubDate>/i) || [])[1] || "").trim();
    if (!title || !link) continue;
    out.push({ title: title.slice(0, 220), link: link.slice(0, 500), source: source.slice(0, 80), date });
  }
  return out;
}

export function formatHeadlineDate(raw: string) {
  const d = Date.parse(raw);
  if (!Number.isFinite(d)) return "";
  return new Date(d).toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
