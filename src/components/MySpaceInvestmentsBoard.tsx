"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MarketCharts } from "@/components/MarketCharts";
import { useMemberBoard } from "@/components/useMemberBoard";
import {
  emptyBoards,
  type FinAccount,
  type FinHolding,
  type PortfolioBoard,
} from "@/lib/memberBoardModel";
import {
  DIV_FREQ,
  FINANCE_LOCAL,
  FINANCE_OFFICIAL,
  HOLDING_KINDS,
  SNAPSHOT_SYMBOLS,
  glClass,
  money,
  periodsPerYear,
  quoteSymbol,
  signedMoney,
  signedPct,
} from "@/lib/financeCatalog";
import {
  WEALTH_LOCAL,
  WEALTH_OFFICIAL,
  WEALTH_SCAM_TIPS,
} from "@/lib/wealthResources";
import {
  isValidTickerShape,
  normalizeTicker,
  type TickerQuote,
} from "@/lib/markets";

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function emptyHolding(): Omit<FinHolding, "id"> {
  return {
    kind: "stock",
    symbol: "",
    shares: 0,
    avgCost: 0,
    divShare: 0,
    divFreq: "none",
    exDiv: "",
    payDate: "",
    divGot: 0,
  };
}

function cashPrice(kind: string, symbol: string, q?: TickerQuote) {
  if (kind === "cash") return 1;
  return q?.price ?? 0;
}

/**
 * Household finance board — accounts, holdings, watch list, dividends.
 * Educational quotes only. Does not trade, hold, or transfer money.
 */
export function MySpaceInvestmentsBoard() {
  const empty = emptyBoards().portfolio;
  const { value, save, ready, saving, error } = useMemberBoard<PortfolioBoard>(
    "portfolio",
    empty,
    true
  );
  const [watchInput, setWatchInput] = useState("");
  const [quotes, setQuotes] = useState<Record<string, TickerQuote>>({});
  const [snap, setSnap] = useState<Record<string, TickerQuote>>({});
  const [qErr, setQErr] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, Omit<FinHolding, "id">>>({});
  const [edit, setEdit] = useState<{ acct: string; hold: string } | null>(null);

  const accounts = value.accounts;
  const watchlist = value.watchlist;

  const symbols = useMemo(() => {
    const set = new Set<string>();
    for (const a of accounts) {
      for (const h of a.holdings) {
        const s = quoteSymbol(h.kind, h.symbol);
        if (s && isValidTickerShape(normalizeTicker(s))) set.add(normalizeTicker(s));
      }
    }
    for (const w of watchlist) {
      if (isValidTickerShape(w)) set.add(w);
    }
    return [...set].slice(0, 36);
  }, [accounts, watchlist]);

  const loadQuotes = useCallback(async () => {
    const extra = SNAPSHOT_SYMBOLS.map((s) => s.symbol).join(",");
    const all = [...symbols, ...SNAPSHOT_SYMBOLS.map((s) => s.symbol)];
    if (!all.length) return;
    try {
      const res = await fetch(
        `/api/markets/quotes?symbols=${encodeURIComponent([...symbols, extra].filter(Boolean).join(","))}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Quotes unavailable");
      const map: Record<string, TickerQuote> = {};
      for (const q of (data.quotes || []) as TickerQuote[]) {
        map[normalizeTicker(q.symbol)] = q;
        map[q.symbol.toUpperCase()] = q;
      }
      setQuotes(map);
      setSnap(map);
      setQErr(null);
    } catch (e) {
      setQErr(e instanceof Error ? e.message : "Quotes unavailable");
    }
  }, [symbols]);

  useEffect(() => {
    if (!ready) return;
    void loadQuotes();
    const id = window.setInterval(() => void loadQuotes(), 30000);
    return () => window.clearInterval(id);
  }, [ready, loadQuotes]);

  function q(symbol: string) {
    const t = normalizeTicker(symbol);
    return quotes[t];
  }

  function persist(next: Partial<PortfolioBoard>) {
    const accountsNext = next.accounts ?? accounts;
    const merged = new Map<
      string,
      { id: string; ticker: string; shares: number; includeInTotal: boolean; costBasis: number; addedAt: string }
    >();
    for (const a of accountsNext) {
      if (!a.included) continue;
      for (const h of a.holdings) {
        if (h.kind === "cash" || !h.symbol) continue;
        const ticker = normalizeTicker(h.symbol);
        const prev = merged.get(ticker);
        if (!prev) {
          merged.set(ticker, {
            id: h.id,
            ticker,
            shares: h.shares,
            includeInTotal: true,
            costBasis: h.avgCost,
            addedAt: new Date().toISOString(),
          });
        } else {
          const tot = prev.shares + h.shares;
          prev.costBasis = tot ? (prev.costBasis * prev.shares + h.avgCost * h.shares) / tot : 0;
          prev.shares = tot;
        }
      }
    }
    const holdings = [...merged.values()];
    void save({
      holdings,
      accounts: accountsNext,
      watchlist: next.watchlist ?? watchlist,
    });
  }

  const stats = useMemo(() => {
    let valueSum = 0;
    let costSum = 0;
    let prevSum = 0;
    let annualDiv = 0;
    let divGot = 0;
    const byKind: Record<string, number> = { stock: 0, etf: 0, bitcoin: 0, cash: 0 };
    const bySymbol = new Map<
      string,
      { name: string; kind: string; value: number; cost: number; shares: number; change: number; changePct: number; rows: { acct: string; shares: number; avg: number }[] }
    >();
    let holdingCount = 0;
    const enabled = accounts.filter((a) => a.included);
    for (const a of enabled) {
      for (const h of a.holdings) {
        holdingCount += 1;
        const quote = h.kind === "cash" ? undefined : q(quoteSymbol(h.kind, h.symbol));
        const price = cashPrice(h.kind, h.symbol, quote);
        const val = price * h.shares;
        const cost = h.avgCost * h.shares;
        const prev = (quote?.previousClose ?? price) * h.shares;
        valueSum += val;
        costSum += cost;
        prevSum += prev;
        annualDiv += h.shares * h.divShare * periodsPerYear(h.divFreq);
        divGot += h.divGot;
        byKind[h.kind] = (byKind[h.kind] || 0) + val;
        if (h.kind !== "cash" && h.symbol) {
          const key = normalizeTicker(h.symbol);
          const cur = bySymbol.get(key) || {
            name: quote?.shortName || key,
            kind: h.kind,
            value: 0,
            cost: 0,
            shares: 0,
            change: quote?.change ?? 0,
            changePct: quote?.changePct ?? 0,
            rows: [],
          };
          cur.value += val;
          cur.cost += cost;
          cur.shares += h.shares;
          cur.rows.push({ acct: a.name, shares: h.shares, avg: h.avgCost });
          bySymbol.set(key, cur);
        }
      }
    }
    const gl = valueSum - costSum;
    const glPct = costSum ? (gl / costSum) * 100 : 0;
    const day = valueSum - prevSum;
    const dayPct = prevSum ? (day / prevSum) * 100 : 0;
    const movers = [...bySymbol.entries()]
      .map(([symbol, row]) => ({ symbol, ...row, dayDollar: (row.changePct / 100) * row.value }))
      .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct));
    const featured = [...bySymbol.entries()]
      .map(([symbol, row]) => ({ symbol, ...row }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 2);
    return {
      valueSum,
      costSum,
      gl,
      glPct,
      day,
      dayPct,
      annualDiv,
      divGot,
      byKind,
      holdingCount,
      enabledCount: enabled.length,
      unique: bySymbol.size,
      movers,
      featured,
    };
  }, [accounts, quotes]);

  const comingDiv = useMemo(() => {
    const today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
    const rows: { symbol: string; acct: string; exDiv: string; payDate: string; amt: number }[] = [];
    for (const a of accounts) {
      if (!a.included) continue;
      for (const h of a.holdings) {
        if (!h.exDiv || h.exDiv < today) continue;
        rows.push({
          symbol: h.symbol,
          acct: a.name,
          exDiv: h.exDiv,
          payDate: h.payDate,
          amt: h.shares * h.divShare,
        });
      }
    }
    return rows.sort((a, b) => a.exDiv.localeCompare(b.exDiv)).slice(0, 12);
  }, [accounts]);

  function addAccount() {
    persist({
      accounts: [
        ...accounts,
        { id: uid("acct"), name: `Account ${accounts.length + 1}`, included: true, holdings: [] },
      ],
    });
  }

  function saveHolding(acctId: string) {
    const f = form[acctId] || emptyHolding();
    const kind = f.kind;
    let symbol = normalizeTicker(f.symbol);
    if (kind === "cash") symbol = "CASH";
    if (kind === "bitcoin" && !symbol) symbol = "BTC-USD";
    if (kind !== "cash" && (!symbol || !isValidTickerShape(symbol))) return;
    const row: FinHolding = {
      ...f,
      id: edit?.acct === acctId ? edit.hold : uid("fh"),
      kind,
      symbol,
      shares: Number(f.shares) || 0,
      avgCost: kind === "cash" ? 1 : Number(f.avgCost) || 0,
    };
    persist({
      accounts: accounts.map((a) => {
        if (a.id !== acctId) return a;
        const holdings =
          edit?.acct === acctId
            ? a.holdings.map((h) => (h.id === edit.hold ? row : h))
            : [...a.holdings, row];
        return { ...a, holdings: holdings.slice(0, 40) };
      }),
    });
    setForm({ ...form, [acctId]: emptyHolding() });
    setEdit(null);
  }

  if (!ready) return <p className="panel-hint">Loading investments…</p>;

  return (
    <div className="ms-ent-board">
      <p className="ms-module-lead">Finance &amp; personal notes</p>
      <p className="panel-hint">
        Public market quotes and notes you type yourself. Not a brokerage, bank, crypto wallet, or
        financial advisor. We do not trade, hold, or transfer money.{" "}
        <Link href="/wealth" className="text-link">
          Public Wealth hub
        </Link>
      </p>
      {error ? <p className="pf-form-error">{error}</p> : null}
      {saving ? <p className="panel-hint">Saving to your account…</p> : null}
      {qErr ? <p className="panel-hint">{qErr}</p> : null}

      <div className="ms-h-toolbar">
        <span className="ms-h-pill">Live quotes · delayed a few minutes</span>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => {
            if (!window.confirm("Clear all finance data on this account? Charts stay.")) return;
            persist({ accounts: [], watchlist: [] });
          }}
        >
          Clear finance data
        </button>
      </div>

      <MarketCharts compact withRanges />

      <div className="ms-fin-snap">
        {SNAPSHOT_SYMBOLS.map((s) => {
          const qt = snap[normalizeTicker(s.symbol)] || snap[s.symbol];
          const up = (qt?.change ?? 0) >= 0;
          return (
            <article key={s.id} className="ms-fin-snap-card">
              <span className="panel-hint">{s.label.toUpperCase()}</span>
              <strong>
                {qt
                  ? s.kind === "yield"
                    ? `${qt.price.toFixed(2)}%`
                    : money(qt.price)
                  : "—"}
              </strong>
              <span className={up ? "is-up" : "is-down"}>
                {qt ? signedPct(qt.changePct) : ""}
              </span>
            </article>
          );
        })}
      </div>

      <div className={`ms-fin-hero gl-${glClass(stats.gl)}`}>
        <p className="panel-hint">TOTAL PORTFOLIO VALUE</p>
        <h3>{stats.holdingCount ? money(stats.valueSum) : "—"}</h3>
        <div className="ms-fin-metrics">
          <div>
            <span>Cost basis</span>
            <strong>{money(stats.costSum)}</strong>
          </div>
          <div>
            <span>Unrealized G/L</span>
            <strong className={glClass(stats.gl)}>{signedMoney(stats.gl)}</strong>
          </div>
          <div>
            <span>Return</span>
            <strong className={glClass(stats.glPct)}>{signedPct(stats.glPct)}</strong>
          </div>
          <div>
            <span>Today</span>
            <strong className={glClass(stats.day)}>
              {signedMoney(stats.day)} ({signedPct(stats.dayPct)})
            </strong>
          </div>
          <div>
            <span>Est. annual dividends</span>
            <strong>{money(stats.annualDiv)}</strong>
          </div>
          <div>
            <span>Dividends received (all-time)</span>
            <strong>{money(stats.divGot)}</strong>
          </div>
        </div>
        <p className="panel-hint">
          {stats.enabledCount} account{stats.enabledCount === 1 ? "" : "s"} selected ·{" "}
          {stats.holdingCount} holdings · {stats.unique} symbols · stocks, ETFs, BTC &amp; cash
        </p>
      </div>

      <div className="ms-fin-split">
        <div className="about-panel ms-module">
          <h4>Where your money sits</h4>
          {(["stock", "etf", "bitcoin", "cash"] as const).map((k) => {
            const v = stats.byKind[k] || 0;
            const pct = stats.valueSum ? (v / stats.valueSum) * 100 : 0;
            return (
              <div key={k} className="ms-fin-alloc">
                <span>{k === "etf" ? "ETFs" : k[0].toUpperCase() + k.slice(1)}</span>
                <span>
                  {pct.toFixed(0)}% · {money(v)}
                </span>
                <i style={{ width: `${Math.min(100, pct)}%` }} />
              </div>
            );
          })}
          <h4>Today’s movers</h4>
          {stats.movers.length === 0 ? (
            <p className="panel-hint">Add holdings to see movers.</p>
          ) : (
            <ul className="ms-cal-list">
              {stats.movers.slice(0, 6).map((m) => (
                <li key={m.symbol}>
                  <div>
                    <strong>{m.symbol}</strong>
                    <span>{m.name}</span>
                  </div>
                  <span className={glClass(m.changePct)}>
                    {signedPct(m.changePct)} · {signedMoney(m.dayDollar)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="about-panel ms-module">
          <h4>Watch list</h4>
          <p className="panel-hint">Type a symbol to keep an eye on a stock you don’t own yet.</p>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const t = normalizeTicker(watchInput);
              if (!t || !isValidTickerShape(t)) return;
              if (watchlist.includes(t)) return;
              persist({ watchlist: [t, ...watchlist].slice(0, 40) });
              setWatchInput("");
            }}
          >
            <input
              value={watchInput}
              onChange={(e) => setWatchInput(e.target.value)}
              placeholder="Add a symbol, like AAPL"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Watch
            </button>
          </form>
          <ul className="ms-cal-list">
            {watchlist.map((s) => {
              const qt = q(s);
              return (
                <li key={s}>
                  <div>
                    <strong>{s}</strong>
                    <span>{qt?.shortName || ""}</span>
                  </div>
                  <span className={glClass(qt?.changePct)}>
                    {qt ? `${money(qt.price)} · ${signedPct(qt.changePct)}` : "—"}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => persist({ watchlist: watchlist.filter((x) => x !== s) })}
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
          <h4>Coming dividends</h4>
          {comingDiv.length === 0 ? (
            <p className="panel-hint">
              Add an ex-dividend date on a holding to see what’s coming up.
            </p>
          ) : (
            <ul className="ms-cal-list">
              {comingDiv.map((d) => (
                <li key={`${d.acct}-${d.symbol}-${d.exDiv}`}>
                  <div>
                    <strong>{d.symbol}</strong>
                    <span>
                      {d.acct} · ex {d.exDiv}
                      {d.payDate ? ` · pay ${d.payDate}` : ""}
                    </span>
                  </div>
                  <span>{money(d.amt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="about-panel ms-module">
        <div className="ms-h-toolbar">
          <h4>Brokerage accounts &amp; holdings</h4>
          <button type="button" className="btn btn-primary btn-sm" onClick={addAccount}>
            + Add account
          </button>
        </div>
        <p className="panel-hint">
          Check accounts to include in totals. Add any stock, ETF, Bitcoin (BTC), or cash — each
          with its own cost basis and dividend info. This is a notebook, not a trade ticket.
        </p>
        {accounts.length === 0 ? (
          <p className="panel-hint">No accounts yet. Add one to start tracking holdings.</p>
        ) : null}
        {accounts.map((a) => {
          const f = form[a.id] || emptyHolding();
          let acctVal = 0;
          let acctGl = 0;
          for (const h of a.holdings) {
            const price = cashPrice(h.kind, h.symbol, q(quoteSymbol(h.kind, h.symbol)));
            acctVal += price * h.shares;
            acctGl += price * h.shares - h.avgCost * h.shares;
          }
          return (
            <article key={a.id} className="ms-fin-acct">
              <div className="ms-h-toolbar">
                <label className={a.included ? "on" : ""}>
                  <input
                    type="checkbox"
                    checked={a.included}
                    onChange={(e) =>
                      persist({
                        accounts: accounts.map((x) =>
                          x.id === a.id ? { ...x, included: e.target.checked } : x
                        ),
                      })
                    }
                  />
                  Include in totals
                </label>
                <span>
                  Value {money(acctVal)} · G/L {signedMoney(acctGl)}
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  disabled={accounts.length <= 1}
                  onClick={() => persist({ accounts: accounts.filter((x) => x.id !== a.id) })}
                >
                  Delete
                </button>
              </div>
              <div className="field">
                <label>Account name</label>
                <input
                  value={a.name}
                  onChange={(e) =>
                    persist({
                      accounts: accounts.map((x) =>
                        x.id === a.id ? { ...x, name: e.target.value.slice(0, 80) } : x
                      ),
                    })
                  }
                />
              </div>
              <ul className="ms-cal-list">
                {a.holdings.map((h) => {
                  const price = cashPrice(h.kind, h.symbol, q(quoteSymbol(h.kind, h.symbol)));
                  const val = price * h.shares;
                  return (
                    <li key={h.id}>
                      <div>
                        <strong>
                          {h.symbol} <em className="panel-hint">{h.kind.toUpperCase()}</em>
                        </strong>
                        <span>
                          {h.shares} units · avg {money(h.avgCost)} · {money(val)}
                        </span>
                      </div>
                      <div className="hero-actions">
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => {
                            setEdit({ acct: a.id, hold: h.id });
                            setForm({ ...form, [a.id]: { ...h } });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() =>
                            persist({
                              accounts: accounts.map((x) =>
                                x.id === a.id
                                  ? { ...x, holdings: x.holdings.filter((y) => y.id !== h.id) }
                                  : x
                              ),
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <form
                className="form-grid ms-module-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  saveHolding(a.id);
                }}
              >
                <p className="panel-hint">
                  {edit?.acct === a.id ? "Edit holding" : `Add holding to ${a.name}`}
                </p>
                <div className="field">
                  <label>Type</label>
                  <select
                    value={f.kind}
                    onChange={(e) => setForm({ ...form, [a.id]: { ...f, kind: e.target.value } })}
                  >
                    {HOLDING_KINDS.map((k) => (
                      <option key={k.id} value={k.id}>
                        {k.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Symbol</label>
                  <input
                    value={f.symbol}
                    onChange={(e) => setForm({ ...form, [a.id]: { ...f, symbol: e.target.value } })}
                    placeholder="TSLA, VOO, BTC…"
                    disabled={f.kind === "cash"}
                  />
                </div>
                <div className="field">
                  <label>Shares / units / $ cash</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={f.shares || ""}
                    onChange={(e) =>
                      setForm({ ...form, [a.id]: { ...f, shares: Number(e.target.value) || 0 } })
                    }
                  />
                </div>
                <div className="field">
                  <label>Avg cost / unit ($)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={f.avgCost || ""}
                    onChange={(e) =>
                      setForm({ ...form, [a.id]: { ...f, avgCost: Number(e.target.value) || 0 } })
                    }
                    placeholder="cost basis"
                    disabled={f.kind === "cash"}
                  />
                </div>
                <div className="field">
                  <label>Div / share (per period)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={f.divShare || ""}
                    onChange={(e) =>
                      setForm({ ...form, [a.id]: { ...f, divShare: Number(e.target.value) || 0 } })
                    }
                    placeholder="e.g. 0.45"
                  />
                </div>
                <div className="field">
                  <label>Dividend frequency</label>
                  <select
                    value={f.divFreq}
                    onChange={(e) => setForm({ ...form, [a.id]: { ...f, divFreq: e.target.value } })}
                  >
                    {DIV_FREQ.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label>Ex-dividend date</label>
                  <input
                    type="date"
                    value={f.exDiv}
                    onChange={(e) => setForm({ ...form, [a.id]: { ...f, exDiv: e.target.value } })}
                  />
                </div>
                <div className="field">
                  <label>Pay date</label>
                  <input
                    type="date"
                    value={f.payDate}
                    onChange={(e) => setForm({ ...form, [a.id]: { ...f, payDate: e.target.value } })}
                  />
                </div>
                <div className="field">
                  <label>Total dividends received ($)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={f.divGot || ""}
                    onChange={(e) =>
                      setForm({ ...form, [a.id]: { ...f, divGot: Number(e.target.value) || 0 } })
                    }
                    placeholder="lifetime"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">
                  {edit?.acct === a.id ? "Save holding" : "Add holding"}
                </button>
                {edit?.acct === a.id ? (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      setEdit(null);
                      setForm({ ...form, [a.id]: emptyHolding() });
                    }}
                  >
                    Cancel
                  </button>
                ) : null}
              </form>
            </article>
          );
        })}
      </div>

      {stats.featured.length > 0 ? (
        <div className="about-panel ms-module">
          <h4>
            Featured holdings · {stats.featured.map((f) => f.symbol).join(" & ")}
          </h4>
          <div className="ms-fin-feat">
            {stats.featured.map((f) => {
              const gl = f.value - f.cost;
              const qt = q(f.symbol);
              return (
                <article key={f.symbol} className="ms-food-card">
                  <span className="panel-hint">FEATURED · {f.kind.toUpperCase()}</span>
                  <h4>{f.symbol}</h4>
                  <p>{f.name}</p>
                  <p>
                    <strong>{qt ? money(qt.price) : "—"}</strong>{" "}
                    <span className={glClass(qt?.changePct)}>
                      {qt ? `${signedMoney(qt.change)} ${signedPct(qt.changePct)}` : ""}
                    </span>
                  </p>
                  <p className="panel-hint">
                    Total shares {f.shares} · blended avg {money(f.shares ? f.cost / f.shares : 0)}
                  </p>
                  <p>
                    Market value <strong>{money(f.value)}</strong>
                  </p>
                  <p>
                    Cost basis {money(f.cost)} · G/L{" "}
                    <span className={glClass(gl)}>
                      {signedMoney(gl)} ({signedPct(f.cost ? (gl / f.cost) * 100 : 0)})
                    </span>
                  </p>
                  <ul className="ms-cal-list">
                    {f.rows.map((r) => (
                      <li key={r.acct}>
                        <span>
                          {r.acct} · {r.shares} sh @ {money(r.avg)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="about-panel ms-module">
        <h4>All holdings</h4>
        <div className="ms-fin-table-wrap">
          <table className="ms-fin-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Avg cost</th>
                <th>Value</th>
                <th>Cost basis</th>
                <th>G/L</th>
                <th>Ann. income</th>
              </tr>
            </thead>
            <tbody>
              {accounts
                .filter((a) => a.included)
                .flatMap((a) => a.holdings)
                .reduce<FinHolding[]>((acc, h) => {
                  const key = `${h.kind}:${h.symbol}`;
                  const i = acc.findIndex((x) => `${x.kind}:${x.symbol}` === key);
                  if (i < 0) acc.push({ ...h });
                  else {
                    const tot = acc[i].shares + h.shares;
                    acc[i] = {
                      ...acc[i],
                      avgCost: tot ? (acc[i].avgCost * acc[i].shares + h.avgCost * h.shares) / tot : 0,
                      shares: tot,
                      divGot: acc[i].divGot + h.divGot,
                      divShare: acc[i].divShare || h.divShare,
                      divFreq: acc[i].divFreq !== "none" ? acc[i].divFreq : h.divFreq,
                    };
                  }
                  return acc;
                }, [])
                .sort((a, b) => {
                  const pa = cashPrice(a.kind, a.symbol, q(quoteSymbol(a.kind, a.symbol))) * a.shares;
                  const pb = cashPrice(b.kind, b.symbol, q(quoteSymbol(b.kind, b.symbol))) * b.shares;
                  return pb - pa;
                })
                .map((h) => {
                  const price = cashPrice(h.kind, h.symbol, q(quoteSymbol(h.kind, h.symbol)));
                  const val = price * h.shares;
                  const cost = h.avgCost * h.shares;
                  const gl = val - cost;
                  return (
                    <tr key={`${h.kind}-${h.symbol}`}>
                      <td>
                        <strong>{h.symbol}</strong>
                      </td>
                      <td>{h.kind}</td>
                      <td>{h.shares}</td>
                      <td>{money(price)}</td>
                      <td>{money(h.avgCost)}</td>
                      <td>{money(val)}</td>
                      <td>{money(cost)}</td>
                      <td className={glClass(gl)}>{signedMoney(gl)}</td>
                      <td>{money(h.shares * h.divShare * periodsPerYear(h.divFreq))}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <h4>Dividend tracker</h4>
        <p className="panel-hint">
          When you add a stock or ETF, fill in div / share, frequency, ex-dividend date, and total
          dividends received. Portfolio est. annual dividends: <strong>{money(stats.annualDiv)}</strong>
          {" · "}
          All-time received: <strong>{money(stats.divGot)}</strong>
        </p>
      </div>

      <div className="about-panel ms-module">
        <h4>Villages money desk</h4>
        <p className="panel-hint">
          Orientation only. Confirm hours and whether you need an appointment. Hang up on anyone
          who wants gift cards or a same-day wire.
        </p>
        <div className="hero-actions">
          {FINANCE_OFFICIAL.map((l) => (
            <a key={l.href} className="btn btn-ghost btn-sm" href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </div>
        <div className="ms-food-guide">
          {FINANCE_LOCAL.map((s) => (
            <article key={s.name} className="ms-food-card">
              <span className="panel-hint">{s.kind.toUpperCase()}</span>
              <h4>{s.name}</h4>
              <p className="panel-hint">{s.address}</p>
              {s.phone ? (
                <p>
                  <a className="text-link" href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}>
                    {s.phone}
                  </a>
                </p>
              ) : null}
              {s.hours ? <p className="panel-hint">{s.hours}</p> : null}
              <p>{s.note}</p>
              <a className="btn btn-ghost btn-sm" href={s.href} target="_blank" rel="noopener noreferrer">
                Official page
              </a>
            </article>
          ))}
        </div>
        <h4>Local banks &amp; official desks</h4>
        <div className="hero-actions">
          {WEALTH_LOCAL.slice(0, 6).map((b) =>
            b.href ? (
              <a key={b.id} className="btn btn-ghost btn-sm" href={b.href} target="_blank" rel="noopener noreferrer">
                {b.name}
              </a>
            ) : null
          )}
          {WEALTH_OFFICIAL.slice(0, 6).map((b) => (
            <a key={b.id} className="btn btn-ghost btn-sm" href={b.href} target="_blank" rel="noopener noreferrer">
              {b.name}
            </a>
          ))}
        </div>
        <h4>Scam radar</h4>
        <ul className="ms-cal-list">
          {WEALTH_SCAM_TIPS.map((t) => (
            <li key={t.title}>
              <div>
                <strong>{t.title}</strong>
                <span>{t.body}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
