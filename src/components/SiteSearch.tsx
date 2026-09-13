"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Hit = {
  title: string;
  href?: string;
  url?: string;
  snippet: string;
  section?: string;
};

export function SiteSearch({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [empty, setEmpty] = useState(false);
  const [expandHits, setExpandHits] = useState<Hit[]>([]);
  const [expandSource, setExpandSource] = useState<"web" | "x" | null>(null);
  const [expandBusy, setExpandBusy] = useState(false);
  const [expandNote, setExpandNote] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  async function runSiteSearch(query: string) {
    const text = query.trim();
    if (text.length < 2) {
      setHits([]);
      setEmpty(false);
      setExpandHits([]);
      setExpandSource(null);
      return;
    }
    setBusy(true);
    setExpandHits([]);
    setExpandSource(null);
    setExpandNote(null);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(text)}`, {
        cache: "no-store",
      });
      const json = (await res.json().catch(() => ({}))) as {
        hits?: Hit[];
        empty?: boolean;
      };
      setHits(json.hits || []);
      setEmpty(Boolean(json.empty) || !(json.hits || []).length);
      setOpen(true);
    } catch {
      setHits([]);
      setEmpty(true);
      setOpen(true);
    } finally {
      setBusy(false);
    }
  }

  function onChange(value: string) {
    setQ(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void runSiteSearch(value), 280);
  }

  async function expand(source: "web" | "x") {
    setExpandBusy(true);
    setExpandSource(source);
    setExpandNote(
      source === "x"
        ? "Searching X…"
        : "Searching the rest of the internet…"
    );
    try {
      const res = await fetch("/api/search/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: q.trim(), source }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        hits?: Hit[];
        moreUrl?: string;
        error?: string;
      };
      const next = json.hits || [];
      setExpandHits(next);
      if (!next.length) {
        setExpandNote(
          json.moreUrl
            ? "No tidy list came back. Open the full search instead."
            : json.error || "Nothing extra turned up."
        );
        if (json.moreUrl) {
          setExpandHits([
            {
              title: source === "x" ? "Search X for this" : "Search the web for this",
              url: json.moreUrl,
              snippet: "Opens a full search in a new tab.",
            },
          ]);
        }
      } else {
        setExpandNote(null);
      }
    } catch {
      setExpandNote("Could not expand the search. Try again.");
    } finally {
      setExpandBusy(false);
    }
  }

  return (
    <div className={`site-search${compact ? " is-compact" : ""}`} ref={boxRef}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          void runSiteSearch(q);
        }}
      >
        <label className="sr-only" htmlFor={compact ? "site-search-mobile" : "site-search"}>
          Search this website
        </label>
        <input
          id={compact ? "site-search-mobile" : "site-search"}
          type="search"
          value={q}
          placeholder="Search this website"
          autoComplete="off"
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (hits.length || empty) setOpen(true);
          }}
        />
        <button type="submit" className="btn btn-sm btn-primary" disabled={busy}>
          {busy ? "…" : "Search"}
        </button>
      </form>
      {open ? (
        <div className="site-search-panel" role="listbox" aria-label="Search results">
          {busy ? <p className="panel-hint">Looking around the site…</p> : null}
          {!busy && hits.length ? (
            <ul>
              {hits.map((h) => (
                <li key={`${h.href}-${h.title}`}>
                  <Link href={h.href || "/"} onClick={() => setOpen(false)}>
                    <span className="site-search-kicker">{h.section}</span>
                    <strong>{h.title}</strong>
                    {h.snippet ? <em>{h.snippet}</em> : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {!busy && empty ? (
            <div className="site-search-empty">
              <p>
                Nothing on this website matched “{q.trim()}”. Want to expand the
                search?
              </p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  disabled={expandBusy}
                  onClick={() => void expand("x")}
                >
                  Search X
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  disabled={expandBusy}
                  onClick={() => void expand("web")}
                >
                  Search the internet
                </button>
              </div>
            </div>
          ) : null}
          {expandBusy ? <p className="panel-hint">{expandNote}</p> : null}
          {expandHits.length ? (
            <div className="site-search-expand">
              <p className="site-search-kicker">
                {expandSource === "x" ? "From X" : "From the internet"}
              </p>
              <ul>
                {expandHits.map((h) => (
                  <li key={h.url || h.title}>
                    <a href={h.url || h.href} target="_blank" rel="noreferrer">
                      <strong>{h.title}</strong>
                      {h.snippet ? <em>{h.snippet}</em> : null}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {!expandBusy && expandNote && !expandHits.length ? (
            <p className="panel-hint">{expandNote}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
