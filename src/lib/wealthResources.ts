/**
 * Wealth hub content for The Villages Everything App.
 * Links and phones are public orientation info — confirm before you rely on them.
 * Educational only — not financial, tax, or legal advice.
 */

export type WealthResourceKind =
  | "bank"
  | "credit-union"
  | "government"
  | "education"
  | "scam"
  | "tax"
  | "insurance"
  | "local";

export type WealthResource = {
  id: string;
  name: string;
  kind: WealthResourceKind;
  emoji: string;
  blurb: string;
  address?: string;
  city?: string;
  phone?: string;
  hours?: string;
  href?: string;
  mapsQuery?: string;
  accent: "palm" | "coral" | "gold" | "sky" | "lilac";
};

export const WEALTH_HUB = {
  name: "Wealth in The Villages",
  blurb:
    "Markets and a personal portfolio board, plus local banks, official retirement links, scam radar, and light money tools that fit a cart-path life. No hard sell — just orientation.",
  disclaimer:
    "Educational only — not financial, tax, investment, or legal advice. Product availability, rates, and branch details change. Confirm with the institution or a licensed professional before you act.",
} as const;

export const WEALTH_SNAPSHOT = [
  {
    title: "Florida tax flavor",
    body: "No state personal income tax is a real headline — but property taxes, insurance, and RMDs still show up to the party. Plan for the boring stuff.",
    emoji: "🌴",
  },
  {
    title: "Cash-flow first",
    body: "Markets are interesting; paying HOA, groceries, and golf trail fees on time is the actual lifestyle engine.",
    emoji: "💵",
  },
  {
    title: "Scam radar on",
    body: "If someone rushes you about gift cards, wire transfers, or “your grandson is in jail,” hang up and verify. Villagers are prime targets.",
    emoji: "🛡️",
  },
  {
    title: "Paperwork that ages well",
    body: "Beneficiaries, a simple will/trust conversation, and a folder labeled “If I’m in the ER” beats heroic last-minute drama.",
    emoji: "📁",
  },
] as const;

/** Local / regional money places Villagers commonly use */
export const WEALTH_LOCAL: WealthResource[] = [
  {
    id: "midflorida",
    name: "MidFlorida Credit Union",
    kind: "credit-union",
    emoji: "🏦",
    blurb:
      "Regional credit union with a strong Central Florida footprint — branches and ATMs many Villagers already use for checking, savings, and everyday banking.",
    city: "Multiple locations · The Villages area",
    phone: "(866) 913-3733",
    href: "https://www.midflorida.com/",
    mapsQuery: "MidFlorida Credit Union The Villages FL",
    accent: "palm",
  },
  {
    id: "southstate",
    name: "SouthState Bank",
    kind: "bank",
    emoji: "🏧",
    blurb:
      "Regional bank with Villages-area presence — useful if you prefer full-service branch banking close to the cart path.",
    city: "The Villages / nearby",
    href: "https://www.southstatebank.com/",
    mapsQuery: "SouthState Bank The Villages FL",
    accent: "sky",
  },
  {
    id: "wells-fargo-tv",
    name: "Wells Fargo (local branches)",
    kind: "bank",
    emoji: "🏛️",
    blurb:
      "National bank with branches around The Villages corridor — convenient if your accounts already live there.",
    city: "The Villages / Lady Lake / nearby",
    href: "https://www.wellsfargo.com/locator/",
    mapsQuery: "Wells Fargo The Villages FL",
    accent: "gold",
  },
  {
    id: "bank-of-america-tv",
    name: "Bank of America (local branches)",
    kind: "bank",
    emoji: "💳",
    blurb:
      "Another national option with area branches and ATMs — map the closest one before you need a notary or a cashier’s check.",
    city: "The Villages area",
    href: "https://locators.bankofamerica.com/",
    mapsQuery: "Bank of America The Villages FL",
    accent: "coral",
  },
  {
    id: "publix-banking",
    name: "In-store banking & ATMs",
    kind: "local",
    emoji: "🛒",
    blurb:
      "Publix and shopping plazas near squares often host ATMs and partner banking kiosks — handy when you only need cash for the farmers market.",
    city: "Near town squares & plazas",
    mapsQuery: "ATM near The Villages FL",
    accent: "lilac",
  },
  {
    id: "insurance-shop",
    name: "Florida homeowners / auto insurance",
    kind: "insurance",
    emoji: "🏠",
    blurb:
      "Insurance is a Florida sport. Compare quotes annually; Citizens and private carriers both matter. Your agent (or a trusted neighbor referral) is the move.",
    href: "https://www.floir.com/",
    accent: "gold",
  },
];

/** Official / educational national resources */
export const WEALTH_OFFICIAL: WealthResource[] = [
  {
    id: "ssa",
    name: "Social Security Administration",
    kind: "government",
    emoji: "🇺🇸",
    blurb:
      "Create or sign in to my Social Security for benefit estimates, direct deposit, Medicare premiums, and official letters — skip the “random Facebook post” version of the rules.",
    href: "https://www.ssa.gov/",
    phone: "1-800-772-1213",
    accent: "palm",
  },
  {
    id: "medicare",
    name: "Medicare.gov",
    kind: "government",
    emoji: "💙",
    blurb:
      "Official Medicare coverage, plan finders, and enrollment windows. Open Enrollment season is a calendar event — put it next to the holiday lights.",
    href: "https://www.medicare.gov/",
    phone: "1-800-633-4227",
    accent: "sky",
  },
  {
    id: "irs",
    name: "IRS.gov",
    kind: "tax",
    emoji: "📄",
    blurb:
      "Tax forms, refund status, and official guidance. Florida has no state income tax, but federal rules (and RMDs) still apply.",
    href: "https://www.irs.gov/",
    phone: "1-800-829-1040",
    accent: "coral",
  },
  {
    id: "florida-revenue",
    name: "Florida Dept. of Revenue",
    kind: "tax",
    emoji: "🍊",
    blurb:
      "State tax portal for business, sales tax, and other Florida-specific items — not usually personal income tax, but useful if you still file or sell things.",
    href: "https://floridarevenue.com/",
    accent: "gold",
  },
  {
    id: "investor-gov",
    name: "Investor.gov (SEC)",
    kind: "education",
    emoji: "📚",
    blurb:
      "Plain-English investing basics from the SEC — great antidote to hot tips at the pickleball courts.",
    href: "https://www.investor.gov/",
    accent: "lilac",
  },
  {
    id: "finra",
    name: "FINRA BrokerCheck",
    kind: "education",
    emoji: "🔍",
    blurb:
      "Look up brokers and firms before you hand anyone your life savings. Takes five minutes; saves years of regret.",
    href: "https://brokercheck.finra.org/",
    accent: "palm",
  },
  {
    id: "cfpb",
    name: "Consumer Financial Protection Bureau",
    kind: "education",
    emoji: "🛡️",
    blurb:
      "Guides on mortgages, credit cards, debt collection, and retirement money products — without the sales pitch.",
    href: "https://www.consumerfinance.gov/",
    accent: "sky",
  },
  {
    id: "ftc-scams",
    name: "FTC · ReportFraud.ftc.gov",
    kind: "scam",
    emoji: "🚨",
    blurb:
      "Report scams and learn the latest tricks. If it feels rushed, secret, or “only gift cards,” it is almost never your bank calling.",
    href: "https://reportfraud.ftc.gov/",
    accent: "coral",
  },
];

export const WEALTH_SCAM_TIPS = [
  {
    title: "Government imposters",
    body: "Real SSA, IRS, or Medicare will not demand gift cards, crypto, or same-day wire under threat. Hang up; call the official number on ssa.gov / irs.gov / medicare.gov.",
  },
  {
    title: "Grandparent / family emergency",
    body: "“Don’t tell Mom — wire money now” is a classic. Call the family member on a known number before you send a dollar.",
  },
  {
    title: "Tech support pop-ups",
    body: "Windows/Apple will not call you from a banner ad. Don’t give remote access to random “support.”",
  },
  {
    title: "Too-good investments",
    body: "Guaranteed huge returns with “limited seats” are usually fiction. Check BrokerCheck and sleep on it.",
  },
] as const;

export const WEALTH_MONEY_PATH = [
  {
    id: "day-to-day",
    title: "Day-to-day cash flow",
    emoji: "☕",
    items: [
      "Checking + high-yield savings you can actually find in the app",
      "Automatic bill pay for HOA, utilities, insurance",
      "A weekly “fun money” number so golf and squares stay joyful",
    ],
  },
  {
    id: "retirement-income",
    title: "Retirement income stack",
    emoji: "📊",
    items: [
      "Social Security timing (official estimate on ssa.gov)",
      "Pensions, annuities, RMDs — know the calendar",
      "Portfolio withdrawals planned, not panic-sold on red days",
    ],
  },
  {
    id: "protect",
    title: "Protect the nest egg",
    emoji: "🔒",
    items: [
      "Beneficiaries updated after moves and life changes",
      "Fraud alerts / credit freezes if you want less drama",
      "Say no to rushed “once in a lifetime” pitches",
    ],
  },
] as const;

export const WEALTH_TIPS = [
  "Check your Social Security account once a quarter — boredom is cheaper than surprises.",
  "If the market is loud, your written plan should be louder.",
  "Shop insurance annually. Loyalty is cute; premiums are not always loyal back.",
  "Keep 3–6 months of expenses in something boring and accessible.",
  "Name beneficiaries. Then tell someone where the folder lives.",
  "A fee you don’t understand is a fee you shouldn’t ignore.",
  "Screenshot scam texts for the FTC report, then block the number.",
  "Property tax + insurance + HOA: put them on the calendar like birthdays.",
  "Before a big rollover, sleep on it and call the plan’s official number.",
  "Your portfolio tracker here is a notebook — not a crystal ball.",
] as const;

export function mapsUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export function wealthTipOfDay(d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 0);
  const day = Math.floor((d.getTime() - start.getTime()) / 86400000);
  return WEALTH_TIPS[day % WEALTH_TIPS.length];
}

export function resourceKindLabel(kind: WealthResourceKind) {
  switch (kind) {
    case "bank":
      return "Bank";
    case "credit-union":
      return "Credit union";
    case "government":
      return "Official";
    case "education":
      return "Learn";
    case "scam":
      return "Scam watch";
    case "tax":
      return "Tax";
    case "insurance":
      return "Insurance";
    case "local":
      return "Local";
    default:
      return kind;
  }
}
