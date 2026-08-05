"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatChange,
  formatChangePct,
  formatPrice,
  type MarketQuote,
} from "@/lib/markets";

const POLL_MS = 30_000; // ~real-time refresh every 30s

type ApiResponse = {
  quotes?: MarketQuote[];
  fetchedAt?: string;
  disclaimer?: string;
  error?: string;
};

function Sparkline({
  series,
  up,
  id,
}: {
  series: { t: number; v: number }[];
  up: boolean;
  id: string;
}) {
  const path = useMemo(() => {
    if (series.length < 2) return null;
    const w = 320;
    const h = 96;
    const pad = 4;
    const values = series.map((p) => p.v);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = max - min || 1;

    const coords = series.map((p, i) => {
      const x = pad + (i / (series.length - 1)) * (w - pad * 2);
      const y = pad + (1 - (p.v - min) / span) * (h - pad * 2);
      return { x, y };
    });

    const line = coords
      .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(2)},${c.y.toFixed(2)}`)
      .join(" ");
    const area =
      line +
      ` L${coords[coords.length - 1].x.toFixed(2)},${h - pad}` +
      ` L${coords[0].x.toFixed(2)},${h - pad} Z`;

    return { line, area, w, h };
  }, [series]);

  if (!path) {
    return (
      <div className="mkt-spark-empty" aria-hidden>
        Waiting for chart points…
      </div>
    );
  }

  const stroke = up ? "var(--palm)" : "var(--sunset)";
  const fill = up ? "url(#mkt-up-" + id + ")" : "url(#mkt-down-" + id + ")";

  return (
    <svg
      className="mkt-spark"
      viewBox={`0 0 ${path.w} ${path.h}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Intraday price chart"
    >
      <defs>
        <linearGradient id={`mkt-up-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(31, 107, 74, 0.35)" />
          <stop offset="100%" stopColor="rgba(31, 107, 74, 0)" />
        </linearGradient>
        <linearGradient id={`mkt-down-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(232, 93, 76, 0.35)" />
          <stop offset="100%" stopColor="rgba(232, 93, 76, 0)" />
        </linearGradient>
      </defs>
      <path d={path.area} fill={fill} />
      <path
        d={path.line}
        fill="none"
        stroke={stroke}
        strokeWidth="2.25"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function MarketCard({ quote }: { quote: MarketQuote }) {
  const up = quote.change >= 0;
  const dirClass = up ? "is-up" : "is-down";

  return (
    <article className={`mkt-card about-panel ${dirClass}`}>
      <header className="mkt-card-head">
        <div>
          <h3 className="mkt-card-title">{quote.label}</h3>
          <p className="mkt-card-blurb">{quote.blurb}</p>
        </div>
        <span className="mkt-symbol">{quote.symbol}</span>
      </header>

      <div className="mkt-price-row">
        <span className="mkt-price">{formatPrice(quote.price)}</span>
        <span className={`mkt-change ${dirClass}`}>
          {formatChange(quote.change)} ({formatChangePct(quote.changePct)})
        </span>
      </div>

      <div className="mkt-spark-wrap">
        <Sparkline series={quote.series} up={up} id={quote.id} />
      </div>

      <footer className="mkt-card-foot">
        <span>
          Prev close {formatPrice(quote.previousClose)}
        </span>
        <span className="mkt-state">{quote.marketState.replace(/_/g, " ")}</span>
      </footer>
    </article>
  );
}

export function MarketCharts() {
  const [quotes, setQuotes] = useState<MarketQuote[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/markets", { cache: "no-store" });
      const data = (await res.json()) as ApiResponse;
      if (!res.ok || !data.quotes?.length) {
        throw new Error(data.error || "Markets unavailable");
      }
      setQuotes(data.quotes);
      setFetchedAt(data.fetchedAt ?? new Date().toISOString());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Markets unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(false);
    const id = window.setInterval(() => load(true), POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") load(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

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

  return (
    <section className="section mkt-section" id="markets" aria-labelledby="mkt-heading">
      <div className="shell">
        <div className="section-head">
          <div>
            <h2 id="mkt-heading">Live market board</h2>
            <p>
              S&amp;P 500, Nasdaq 100, Russell 2000, and Dow Jones — price, day
              change, and intraday chart. Refreshes about every 30 seconds.
            </p>
          </div>
          <div className="mkt-live-meta">
            <span className="mkt-live">
              <span className="mkt-live-dot" aria-hidden />
              Live
            </span>
            {updatedLabel && (
              <span className="mkt-updated">As of {updatedLabel} ET</span>
            )}
          </div>
        </div>

        {loading && quotes.length === 0 ? (
          <div className="empty-state">Loading market quotes…</div>
        ) : error && quotes.length === 0 ? (
          <div className="empty-state">
            {error}{" "}
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => load(false)}>
              Retry
            </button>
          </div>
        ) : (
          <div className="mkt-grid">
            {quotes.map((q) => (
              <MarketCard key={q.id} quote={q} />
            ))}
          </div>
        )}

        <p className="mkt-disclaimer">
          For orientation only. Quotes may be delayed and can fail when market
          data providers rate-limit. Not investment advice — cart paths over
          hot tips.
        </p>
      </div>
    </section>
  );
}
