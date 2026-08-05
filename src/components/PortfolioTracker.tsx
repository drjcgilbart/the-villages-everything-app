"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  formatChange,
  formatChangePct,
  formatPrice,
  isValidTickerShape,
  normalizeTicker,
  type TickerQuote,
} from "@/lib/markets";
import {
  newHoldingId,
  readPortfolio,
  writePortfolio,
  type PortfolioHolding,
} from "@/lib/portfolioStorage";

const POLL_MS = 30_000;

type QuotesResponse = {
  quotes?: TickerQuote[];
  missing?: string[];
  fetchedAt?: string;
  error?: string;
};

export function PortfolioTracker() {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [quotes, setQuotes] = useState<Record<string, TickerQuote>>({});
  const [missing, setMissing] = useState<string[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tickerInput, setTickerInput] = useState("");
  const [sharesInput, setSharesInput] = useState("1");
  const [nicknameInput, setNicknameInput] = useState("");
  const [includeDefault, setIncludeDefault] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setHoldings(readPortfolio());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: PortfolioHolding[]) => {
    setHoldings(next);
    writePortfolio(next);
  }, []);

  const tickersKey = useMemo(
    () =>
      [...new Set(holdings.map((h) => normalizeTicker(h.ticker)))]
        .filter(Boolean)
        .sort()
        .join(","),
    [holdings]
  );

  const loadQuotes = useCallback(
    async (silent = false) => {
      if (!tickersKey) {
        setQuotes({});
        setMissing([]);
        setFetchedAt(null);
        return;
      }
      if (!silent) setLoading(true);
      try {
        const res = await fetch(
          `/api/markets/quotes?symbols=${encodeURIComponent(tickersKey)}`,
          { cache: "no-store" }
        );
        const data = (await res.json()) as QuotesResponse;
        if (!res.ok) {
          throw new Error(data.error || "Quotes unavailable");
        }
        const map: Record<string, TickerQuote> = {};
        for (const q of data.quotes || []) {
          map[normalizeTicker(q.symbol)] = q;
          // also key by requested form if Yahoo returns slightly different
          map[q.symbol.toUpperCase()] = q;
        }
        setQuotes(map);
        setMissing(data.missing || []);
        setFetchedAt(data.fetchedAt || new Date().toISOString());
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Quotes unavailable");
      } finally {
        setLoading(false);
      }
    },
    [tickersKey]
  );

  useEffect(() => {
    if (!hydrated) return;
    loadQuotes(false);
    if (!tickersKey) return;
    const id = window.setInterval(() => loadQuotes(true), POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") loadQuotes(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [hydrated, tickersKey, loadQuotes]);

  function quoteFor(ticker: string): TickerQuote | undefined {
    const t = normalizeTicker(ticker);
    return quotes[t] || quotes[ticker.toUpperCase()];
  }

  async function addHolding(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    const ticker = normalizeTicker(tickerInput);
    if (!ticker || !isValidTickerShape(ticker)) {
      setFormError("Enter a valid ticker (e.g. AAPL, VOO, BRK.B).");
      return;
    }
    const shares = Number(sharesInput);
    if (!Number.isFinite(shares) || shares < 0) {
      setFormError("Shares must be zero or a positive number.");
      return;
    }
    if (holdings.some((h) => normalizeTicker(h.ticker) === ticker)) {
      setFormError(`${ticker} is already in your list — edit shares below.`);
      return;
    }

    // Validate ticker exists before saving
    setLoading(true);
    try {
      const res = await fetch(
        `/api/markets/quotes?symbols=${encodeURIComponent(ticker)}`,
        { cache: "no-store" }
      );
      const data = (await res.json()) as QuotesResponse;
      if (!res.ok || !data.quotes?.length) {
        setFormError(
          data.missing?.includes(ticker)
            ? `Could not find ticker “${ticker}”. Check the symbol and try again.`
            : data.error || `Could not quote ${ticker}.`
        );
        return;
      }
      const q = data.quotes[0];
      setQuotes((prev) => ({
        ...prev,
        [normalizeTicker(q.symbol)]: q,
        [ticker]: q,
      }));

      const next: PortfolioHolding[] = [
        ...holdings,
        {
          id: newHoldingId(),
          ticker: normalizeTicker(q.symbol) || ticker,
          shares,
          includeInTotal: includeDefault,
          nickname: nicknameInput.trim() || undefined,
          addedAt: new Date().toISOString(),
        },
      ];
      persist(next);
      setTickerInput("");
      setSharesInput("1");
      setNicknameInput("");
    } catch {
      setFormError("Network error while checking ticker.");
    } finally {
      setLoading(false);
    }
  }

  function updateHolding(id: string, patch: Partial<PortfolioHolding>) {
    persist(
      holdings.map((h) => (h.id === id ? { ...h, ...patch } : h))
    );
  }

  function removeHolding(id: string) {
    persist(holdings.filter((h) => h.id !== id));
  }

  const totals = useMemo(() => {
    let value = 0;
    let previous = 0;
    let count = 0;
    for (const h of holdings) {
      if (!h.includeInTotal || h.shares <= 0) continue;
      const q = quoteFor(h.ticker);
      if (!q) continue;
      value += q.price * h.shares;
      previous += q.previousClose * h.shares;
      count += 1;
    }
    const change = value - previous;
    const changePct = previous !== 0 ? (change / previous) * 100 : 0;
    return { value, previous, change, changePct, count };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- quoteFor uses quotes map
  }, [holdings, quotes]);

  const updatedLabel = useMemo(() => {
    if (!fetchedAt) return "";
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date(fetchedAt));
    } catch {
      return "";
    }
  }, [fetchedAt]);

  if (!hydrated) {
    return (
      <section className="section" id="portfolio" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="empty-state">Loading your portfolio…</div>
        </div>
      </section>
    );
  }

  return (
    <section className="section pf-section" id="portfolio" style={{ paddingTop: 0 }}>
      <div className="shell">
        <div className="section-head">
          <div>
            <h2>My stocks &amp; ETFs</h2>
            <p>
              Add tickers you care about. Quotes refresh about every 30 seconds.
              Check the box to roll a holding into{" "}
              <strong>Total Portfolio</strong>. Saved on this computer only.
            </p>
          </div>
          <div className="mkt-live-meta">
            {tickersKey && (
              <span className="mkt-live">
                <span className="mkt-live-dot" aria-hidden />
                Live
              </span>
            )}
            {updatedLabel && (
              <span className="mkt-updated">As of {updatedLabel} ET</span>
            )}
          </div>
        </div>

        <div className="about-panel pf-total">
          <div className="pf-total-head">
            <div>
              <span className="kicker">Total portfolio</span>
              <h3 className="pf-total-value">
                {totals.count > 0 ? `$${formatPrice(totals.value)}` : "—"}
              </h3>
            </div>
            {totals.count > 0 ? (
              <div
                className={`pf-total-change ${
                  totals.change >= 0 ? "is-up" : "is-down"
                }`}
              >
                <span>
                  {formatChange(totals.change)} (
                  {formatChangePct(totals.changePct)})
                </span>
                <span className="pf-total-meta">
                  vs prior close · {totals.count} holding
                  {totals.count === 1 ? "" : "s"} included
                </span>
              </div>
            ) : (
              <p className="pf-total-empty">
                Check “In total” on holdings with share counts to see a rollup
                here.
              </p>
            )}
          </div>
        </div>

        <form className="about-panel pf-form" onSubmit={addHolding}>
          <h3 style={{ marginTop: 0 }}>Add a stock or ETF</h3>
          <div className="pf-form-grid">
            <label className="rc-field">
              <span>Ticker</span>
              <input
                className="rc-search"
                value={tickerInput}
                onChange={(e) => setTickerInput(e.target.value.toUpperCase())}
                placeholder="AAPL, VOO, QQQ…"
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            <label className="rc-field">
              <span>Shares</span>
              <input
                className="rc-search"
                type="number"
                min="0"
                step="any"
                value={sharesInput}
                onChange={(e) => setSharesInput(e.target.value)}
              />
            </label>
            <label className="rc-field">
              <span>Nickname (optional)</span>
              <input
                className="rc-search"
                value={nicknameInput}
                onChange={(e) => setNicknameInput(e.target.value)}
                placeholder="Retirement core"
              />
            </label>
            <label className="pf-check-label">
              <input
                type="checkbox"
                checked={includeDefault}
                onChange={(e) => setIncludeDefault(e.target.checked)}
              />
              Include in total portfolio
            </label>
          </div>
          {formError && <p className="pf-form-error">{formError}</p>}
          <div className="hero-actions" style={{ marginTop: "0.75rem" }}>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={loading}
            >
              {loading ? "Checking…" : "Add ticker"}
            </button>
            {tickersKey && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => loadQuotes(false)}
              >
                Refresh quotes
              </button>
            )}
          </div>
        </form>

        {error && holdings.length > 0 && (
          <p className="pf-form-error" style={{ marginTop: "0.75rem" }}>
            {error}{" "}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => loadQuotes(false)}
            >
              Retry
            </button>
          </p>
        )}

        {missing.length > 0 && (
          <p className="pf-warn">
            No quote for: {missing.join(", ")}. Check the symbol or try later.
          </p>
        )}

        {holdings.length === 0 ? (
          <div className="empty-state" style={{ marginTop: "1rem" }}>
            No holdings yet. Add a ticker above — it stays on this device for
            your next visit.
          </div>
        ) : (
          <div className="pf-table-wrap">
            <table className="pf-table">
              <thead>
                <tr>
                  <th scope="col">In total</th>
                  <th scope="col">Ticker</th>
                  <th scope="col">Price</th>
                  <th scope="col">Day chg</th>
                  <th scope="col">Shares</th>
                  <th scope="col">Market value</th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const q = quoteFor(h.ticker);
                  const up = (q?.change ?? 0) >= 0;
                  const mv =
                    q && h.shares > 0 ? q.price * h.shares : null;
                  return (
                    <tr
                      key={h.id}
                      className={h.includeInTotal ? "is-included" : ""}
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={h.includeInTotal}
                          onChange={(e) =>
                            updateHolding(h.id, {
                              includeInTotal: e.target.checked,
                            })
                          }
                          aria-label={`Include ${h.ticker} in total portfolio`}
                        />
                      </td>
                      <td>
                        <div className="pf-ticker-cell">
                          <strong>{h.ticker}</strong>
                          <span>
                            {h.nickname ||
                              q?.shortName ||
                              (loading ? "…" : "—")}
                          </span>
                        </div>
                      </td>
                      <td>
                        {q ? `$${formatPrice(q.price)}` : loading ? "…" : "—"}
                      </td>
                      <td className={up ? "is-up" : "is-down"}>
                        {q
                          ? `${formatChange(q.change)} (${formatChangePct(q.changePct)})`
                          : "—"}
                      </td>
                      <td>
                        <input
                          className="pf-shares-input"
                          type="number"
                          min="0"
                          step="any"
                          value={h.shares}
                          onChange={(e) => {
                            const n = Number(e.target.value);
                            updateHolding(h.id, {
                              shares:
                                Number.isFinite(n) && n >= 0 ? n : h.shares,
                            });
                          }}
                          aria-label={`Shares of ${h.ticker}`}
                        />
                      </td>
                      <td>
                        {mv != null ? `$${formatPrice(mv)}` : "—"}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => removeHolding(h.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p className="mkt-disclaimer">
          Saved in this browser only (localStorage) — not uploaded to our
          servers. Not investment advice. Quotes may be delayed. Clearing site
          data removes your list.
        </p>
      </div>
    </section>
  );
}
