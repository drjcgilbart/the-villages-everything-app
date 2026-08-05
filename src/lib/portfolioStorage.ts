/** Local portfolio holdings — this device only. */

export const PORTFOLIO_STORAGE_KEY = "tvh-wealth-portfolio-v1";

export type PortfolioHolding = {
  id: string;
  ticker: string;
  /** Share / unit count for portfolio value */
  shares: number;
  /** Include in Total Portfolio rollup */
  includeInTotal: boolean;
  nickname?: string;
  addedAt: string;
};

export function readPortfolio(): PortfolioHolding[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PORTFOLIO_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (h): h is PortfolioHolding =>
          h &&
          typeof h === "object" &&
          typeof (h as PortfolioHolding).id === "string" &&
          typeof (h as PortfolioHolding).ticker === "string" &&
          typeof (h as PortfolioHolding).shares === "number"
      )
      .map((h) => ({
        ...h,
        includeInTotal: Boolean(h.includeInTotal),
        shares: Number.isFinite(h.shares) && h.shares >= 0 ? h.shares : 0,
      }));
  } catch {
    return [];
  }
}

export function writePortfolio(holdings: PortfolioHolding[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(holdings));
  } catch {
    /* quota / private mode */
  }
}

export function newHoldingId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `h-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
