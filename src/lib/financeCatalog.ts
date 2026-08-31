/** Finance helpers + Villages-area money resources (educational only). */

export const HOLDING_KINDS = [
  { id: "stock", label: "Stock" },
  { id: "etf", label: "ETF" },
  { id: "bitcoin", label: "Bitcoin" },
  { id: "cash", label: "Cash" },
] as const;

export const DIV_FREQ = [
  { id: "none", label: "None", perYear: 0 },
  { id: "monthly", label: "Monthly", perYear: 12 },
  { id: "quarterly", label: "Quarterly", perYear: 4 },
  { id: "semiannual", label: "Semi-annual", perYear: 2 },
  { id: "annual", label: "Annual", perYear: 1 },
] as const;

export const MARKET_RANGES = [
  { id: "1d", label: "Today", yahooRange: "1d", interval: "5m" },
  { id: "5d", label: "5 days", yahooRange: "5d", interval: "15m" },
  { id: "1mo", label: "1 month", yahooRange: "1mo", interval: "1d" },
  { id: "6mo", label: "6 months", yahooRange: "6mo", interval: "1d" },
  { id: "1y", label: "1 year", yahooRange: "1y", interval: "1wk" },
] as const;

export const SNAPSHOT_SYMBOLS = [
  { id: "tnx", symbol: "^TNX", label: "10-year Treasury", kind: "yield" },
  { id: "gold", symbol: "GC=F", label: "Gold", kind: "price" },
  { id: "vix", symbol: "^VIX", label: "Market nerves", kind: "index" },
  { id: "btc", symbol: "BTC-USD", label: "Bitcoin", kind: "price" },
] as const;

export const FINANCE_OFFICIAL = [
  {
    label: "Social Security (ssa.gov)",
    href: "https://www.ssa.gov/",
    note: "my Social Security · 1-800-772-1213",
  },
  {
    label: "SSA office locator",
    href: "https://secure.ssa.gov/ICON/main",
    note: "Nearest field office — Leesburg serves The Villages",
  },
  {
    label: "Medicare.gov",
    href: "https://www.medicare.gov/",
    note: "Plans, enrollment windows · 1-800-MEDICARE",
  },
  {
    label: "IRS.gov",
    href: "https://www.irs.gov/",
    note: "Federal tax, RMDs, forms · 1-800-829-1040",
  },
  {
    label: "Required minimum distributions",
    href: "https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs",
    note: "RMD rules still apply in Florida (no state income tax)",
  },
  {
    label: "Florida Dept. of Revenue",
    href: "https://floridarevenue.com/",
    note: "No personal income tax — property / business tax still live here",
  },
  {
    label: "Florida homestead exemption",
    href: "https://floridarevenue.com/property/Pages/Corep_PresHomestead.aspx",
    note: "File with your county property appraiser",
  },
  {
    label: "FINRA BrokerCheck",
    href: "https://brokercheck.finra.org/",
    note: "Look up an advisor before you hand over a dime",
  },
  {
    label: "Investor.gov (SEC)",
    href: "https://www.investor.gov/",
    note: "Plain-English investing — not a hot tip from the square",
  },
  {
    label: "Report a scam (FTC)",
    href: "https://reportfraud.ftc.gov/",
    note: "Gift cards / wires / “your grandson is in jail”",
  },
];

export const FINANCE_LOCAL = [
  {
    name: "SSA field office — Leesburg",
    kind: "Social Security",
    address: "900 N 14th St, Suite 100, Leesburg, FL 34748",
    phone: "866-836-3623",
    hours: "Mon–Fri 9:00 AM–4:00 PM (confirm on ssa.gov; appointments recommended)",
    href: "https://secure.ssa.gov/ICON/main",
    note: "Closest SSA office to The Villages / Lady Lake (~8 miles). National line 1-800-772-1213.",
  },
  {
    name: "Sumter County Property Appraiser",
    kind: "Property tax",
    address: "The Villages / Bushnell — Sumter County",
    phone: "",
    hours: "Confirm on county site",
    href: "https://www.sumterpa.com/",
    note: "Homestead, TRIM notice, and assessed value for Sumter-side villages.",
  },
  {
    name: "Lake County Property Appraiser",
    kind: "Property tax",
    address: "Lake County, FL",
    phone: "",
    hours: "Confirm on county site",
    href: "https://www.lakecopropappr.com/",
    note: "Spanish Springs / Lady Lake / Lake County parcels.",
  },
  {
    name: "Marion County Property Appraiser",
    kind: "Property tax",
    address: "Marion County, FL",
    phone: "",
    hours: "Confirm on county site",
    href: "https://www.pa.marionfl.org/",
    note: "Marion-side villages and nearby parcels.",
  },
  {
    name: "Florida SHIP (Medicare counseling)",
    kind: "Medicare",
    address: "Statewide · local SHIP counselors",
    phone: "1-800-963-5337",
    hours: "",
    href: "https://www.floridaship.org/",
    note: "Free, unbiased Medicare counseling — useful before Open Enrollment.",
  },
];

export function money(n: number | null | undefined, digits = 2) {
  if (n == null || !Number.isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function signedMoney(n: number | null | undefined) {
  if (n == null || !Number.isFinite(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return sign + money(n);
}

export function signedPct(n: number | null | undefined) {
  if (n == null || !Number.isFinite(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function glClass(n: number | null | undefined) {
  if (n == null || Math.abs(n) < 0.005) return "flat";
  return n > 0 ? "up" : "down";
}

export function periodsPerYear(freq: string) {
  return DIV_FREQ.find((f) => f.id === freq)?.perYear ?? 0;
}

export function quoteSymbol(kind: string, symbol: string) {
  if (kind === "cash") return "";
  if (kind === "bitcoin") return symbol || "BTC-USD";
  return symbol;
}
