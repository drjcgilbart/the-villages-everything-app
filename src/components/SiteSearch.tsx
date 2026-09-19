"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Hit = {
  title: string;
  href?: string;
  snippet: string;
  section?: string;
};

export function SiteSearch({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hits, setHits] = useState<Hit[]>([]);
  const [empty, setEmpty] = useState(false);
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
      return;
    }
    setBusy(true);
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
              <p>Nothing on this website matched “{q.trim()}”.</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
