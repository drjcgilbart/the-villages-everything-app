export type MarketSymbolId =
  | "sp500"
  | "nasdaq100"
  | "russell2000"
  | "dowjones";

export type MarketIndexDef = {
  id: MarketSymbolId;
  label: string;
  shortLabel: string;
  /** Yahoo Finance symbol */
  yahoo: string;
  blurb: string;
};

export const MARKET_INDICES: MarketIndexDef[] = [
  {
    id: "sp500",
    label: "S&P 500",
    shortLabel: "S&P 500",
    yahoo: "^GSPC",
    blurb: "Large-cap U.S. equities benchmark",
  },
  {
    id: "nasdaq100",
    label: "Nasdaq 100",
    shortLabel: "NDX",
    yahoo: "^NDX",
    blurb: "100 largest non-financial Nasdaq names",
  },
  {
    id: "russell2000",
    label: "Russell 2000",
    shortLabel: "RUT",
    yahoo: "^RUT",
    blurb: "Small-cap U.S. equities snapshot",
  },
  {
    id: "dowjones",
    label: "Dow Jones",
    shortLabel: "DJIA",
    yahoo: "^DJI",
    blurb: "30 blue-chip industrials average",
  },
];

export type MarketQuote = {
  id: MarketSymbolId;
  label: string;
  shortLabel: string;
  blurb: string;
  symbol: string;
  price: number;
  previousClose: number;
  change: number;
  changePct: number;
  currency: string;
  exchangeName: string;
  marketState: string;
  /** Chart series (oldest → newest), nulls removed */
  series: { t: number; v: number }[];
  updatedAt: string;
};

function encodeYahooSymbol(symbol: string): string {
  return encodeURIComponent(symbol);
}

async function fetchYahooChart(
  yahooSymbol: string,
  range: string,
  interval: string
): Promise<{
  meta: Record<string, unknown>;
  points: { t: number; v: number }[];
} | null> {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeYahooSymbol(yahooSymbol)}` +
    `?interval=${interval}&range=${range}&includePrePost=false`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "TheVillagesHub/1.0 (markets widget; educational)",
    },
    // Always fresh on server; clients poll the API route
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = (await res.json()) as {
    chart?: {
      result?: Array<{
        meta?: Record<string, unknown>;
        timestamp?: number[];
        indicators?: { quote?: Array<{ close?: Array<number | null> }> };
      }>;
      error?: unknown;
    };
  };

  const result = data.chart?.result?.[0];
  if (!result?.meta || !result.timestamp?.length) return null;

  const closes = result.indicators?.quote?.[0]?.close ?? [];
  const points: { t: number; v: number }[] = [];
  for (let i = 0; i < result.timestamp.length; i++) {
    const v = closes[i];
    if (v != null && Number.isFinite(v)) {
      points.push({ t: result.timestamp[i] * 1000, v });
    }
  }

  return { meta: result.meta, points };
}

export async function fetchMarketIndex(
  def: MarketIndexDef,
  yahooRange = "1d",
  interval = "5m"
): Promise<MarketQuote | null> {
  // Prefer requested range; fall back to a wider window if the session just opened
  let chart = await fetchYahooChart(def.yahoo, yahooRange, interval);
  if ((!chart || chart.points.length < 6) && yahooRange === "1d") {
    const wider = await fetchYahooChart(def.yahoo, "5d", "15m");
    if (wider && wider.points.length > (chart?.points.length ?? 0)) {
      chart = wider;
    }
  }
  if (!chart) return null;

  const meta = chart.meta;
  const priceRaw =
    (meta.regularMarketPrice as number | undefined) ??
    chart.points[chart.points.length - 1]?.v;
  const prevRaw =
    (meta.chartPreviousClose as number | undefined) ??
    (meta.previousClose as number | undefined) ??
    chart.points[0]?.v;

  if (priceRaw == null || prevRaw == null) return null;

  const price = Number(priceRaw);
  const previousClose = Number(prevRaw);
  const change = price - previousClose;
  const changePct = previousClose !== 0 ? (change / previousClose) * 100 : 0;

  return {
    id: def.id,
    label: def.label,
    shortLabel: def.shortLabel,
    blurb: def.blurb,
    symbol: String(meta.symbol ?? def.yahoo),
    price,
    previousClose,
    change,
    changePct,
    currency: String(meta.currency ?? "USD"),
    exchangeName: String(meta.exchangeName ?? meta.fullExchangeName ?? ""),
    marketState: String(meta.marketState ?? "UNKNOWN"),
    series: chart.points,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchAllMarketIndices(
  yahooRange = "1d",
  interval = "5m"
): Promise<MarketQuote[]> {
  const results = await Promise.all(
    MARKET_INDICES.map((def) => fetchMarketIndex(def, yahooRange, interval))
  );
  return results.filter((q): q is MarketQuote => q != null);
}

export type TickerQuote = {
  symbol: string;
  shortName: string;
  price: number;
  previousClose: number;
  change: number;
  changePct: number;
  currency: string;
  marketState: string;
  series: { t: number; v: number }[];
  updatedAt: string;
};

/** Normalize user ticker input (AAPL, brk.b, voo → AAPL, BRK.B, VOO). */
export function normalizeTicker(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/\//g, "-");
}

export function isValidTickerShape(ticker: string): boolean {
  // Letters, numbers, dots, hyphens — e.g. AAPL, BRK.B, BRK-B, ^GSPC
  return /^[\^]?[A-Z0-9][A-Z0-9.\-=]{0,14}$/.test(ticker);
}

/** Quote any Yahoo-compatible stock/ETF/index symbol. */
export async function fetchTickerQuote(
  yahooSymbol: string
): Promise<TickerQuote | null> {
  const symbol = normalizeTicker(yahooSymbol);
  if (!symbol || !isValidTickerShape(symbol)) return null;

  let chart = await fetchYahooChart(symbol, "1d", "5m");
  if (!chart || chart.points.length < 4) {
    const wider = await fetchYahooChart(symbol, "5d", "15m");
    if (wider && wider.points.length > (chart?.points.length ?? 0)) {
      chart = wider;
    }
  }
  if (!chart) return null;

  const meta = chart.meta;
  const priceRaw =
    (meta.regularMarketPrice as number | undefined) ??
    chart.points[chart.points.length - 1]?.v;
  const prevRaw =
    (meta.chartPreviousClose as number | undefined) ??
    (meta.previousClose as number | undefined) ??
    chart.points[0]?.v;

  if (priceRaw == null || prevRaw == null) return null;

  const price = Number(priceRaw);
  const previousClose = Number(prevRaw);
  const change = price - previousClose;
  const changePct = previousClose !== 0 ? (change / previousClose) * 100 : 0;

  const shortName =
    (meta.shortName as string | undefined) ||
    (meta.longName as string | undefined) ||
    String(meta.symbol ?? symbol);

  return {
    symbol: String(meta.symbol ?? symbol),
    shortName,
    price,
    previousClose,
    change,
    changePct,
    currency: String(meta.currency ?? "USD"),
    marketState: String(meta.marketState ?? "UNKNOWN"),
    series: chart.points,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchTickerQuotes(
  symbols: string[]
): Promise<{ quotes: TickerQuote[]; missing: string[] }> {
  const unique = [...new Set(symbols.map(normalizeTicker).filter(Boolean))];
  const results = await Promise.all(
    unique.map(async (s) => {
      const q = await fetchTickerQuote(s);
      return { symbol: s, quote: q };
    })
  );
  const quotes: TickerQuote[] = [];
  const missing: string[] = [];
  for (const r of results) {
    if (r.quote) quotes.push(r.quote);
    else missing.push(r.symbol);
  }
  return { quotes, missing };
}

export function formatPrice(n: number): string {
  if (n >= 1000) {
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatChange(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}`;
}

export function formatChangePct(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}
