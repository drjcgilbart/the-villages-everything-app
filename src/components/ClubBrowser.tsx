"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CLUB_OFFICIAL_RESOURCES,
  POPULAR_CLUBS,
  type PopularClub,
} from "@/lib/clubs";
import {
  readClubFavoritesLocal,
  writeClubFavoritesLocal,
} from "@/lib/siteFavorites";

export function ClubBrowser() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [signedIn, setSignedIn] = useState(false);
  const [syncNote, setSyncNote] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const syncFromServer = useCallback(async () => {
    try {
      const res = await fetch("/api/members/space", { cache: "no-store" });
      if (res.status === 401) {
        setSignedIn(false);
        return;
      }
      if (!res.ok) return;
      const data = await res.json();
      setSignedIn(true);
      if (Array.isArray(data.space?.favoriteClubIds)) {
        setFavorites(data.space.favoriteClubIds);
        writeClubFavoritesLocal(data.space.favoriteClubIds);
      }
    } catch {
      /* offline */
    }
  }, []);

  useEffect(() => {
    const local = readClubFavoritesLocal();
    setFavorites(local);
    setHydrated(true);
    syncFromServer();
  }, [syncFromServer]);

  const categories = useMemo(() => {
    const set = new Set(POPULAR_CLUBS.map((c) => c.category));
    return ["all", ...[...set].sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return POPULAR_CLUBS.filter((c) => {
      if (category !== "all" && c.category !== category) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.blurb.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.areaHint.toLowerCase().includes(q)
      );
    }).sort((a, b) => {
      const af = favorites.includes(a.id) ? 0 : 1;
      const bf = favorites.includes(b.id) ? 0 : 1;
      if (af !== bf) return af - bf;
      return a.name.localeCompare(b.name);
    });
  }, [query, category, favorites]);

  async function toggleFavorite(club: PopularClub) {
    const next = favorites.includes(club.id)
      ? favorites.filter((id) => id !== club.id)
      : [...favorites, club.id];
    setFavorites(next);
    writeClubFavoritesLocal(next);

    if (!signedIn) {
      setSyncNote(
        "Saved on this device. Sign in as a member to sync favorites to My Space."
      );
      return;
    }

    try {
      const res = await fetch("/api/members/space", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoriteClubIds: next }),
      });
      if (res.ok) {
        setSyncNote(
          "Saved on this device and to My Space · My favorites."
        );
      } else {
        const data = await res.json().catch(() => ({}));
        setSyncNote(data.error || "Could not sync to account — kept on this device.");
      }
    } catch {
      setSyncNote("Offline — favorites kept on this device.");
    }
  }

  if (!hydrated) {
    return <div className="empty-state">Loading clubs…</div>;
  }

  return (
    <div className="club-browser">
      <div className="about-panel club-resources">
        <h2 style={{ marginTop: 0 }}>Find any club (official)</h2>
        <p className="ts-detail-muted" style={{ marginTop: 0 }}>
          There are 2,700–3,500+ resident-run clubs depending on who&apos;s
          counting this month. Use the official directories for contacts and
          meeting times — then star favorites here.
        </p>
        <ul className="ts-links-list">
          {CLUB_OFFICIAL_RESOURCES.map((r) => (
            <li key={r.id}>
              {r.href.startsWith("/") ? (
                <Link href={r.href}>{r.label}</Link>
              ) : (
                <a href={r.href} target="_blank" rel="noopener noreferrer">
                  {r.label}
                </a>
              )}
              <span>{r.note}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="about-panel club-fav-banner">
        <div>
          <span className="kicker">Your favorites</span>
          <h3 style={{ margin: "0.35rem 0" }}>
            {favorites.length === 0
              ? "Star clubs you love"
              : `${favorites.length} favorite club${favorites.length === 1 ? "" : "s"}`}
          </h3>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.92rem" }}>
            Starred clubs stay on this page and are copied into{" "}
            <Link href="/my-space#ms-favorites" className="text-link">
              My Space · My favorites
            </Link>{" "}
            with your home village, town squares, and rec centers.
            {signedIn ? " Synced to your account when signed in." : null}
          </p>
          {syncNote && (
            <p className="club-sync-note">{syncNote}</p>
          )}
        </div>
        <Link href="/my-space" className="btn btn-primary btn-sm">
          Open My Space →
        </Link>
      </div>

      <div className="club-toolbar">
        <label className="rc-field club-search-field">
          <span>Search curated list</span>
          <input
            className="rc-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pickleball, karaoke, Ohio…"
          />
        </label>
        <label className="rc-field">
          <span>Category</span>
          <select
            className="rc-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === "all" ? "All categories" : c}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="club-grid">
        {filtered.map((club) => {
          const isFav = favorites.includes(club.id);
          return (
            <article
              key={club.id}
              className={`about-panel club-card${isFav ? " is-fav" : ""}`}
            >
              <div className="club-card-art">
                <Image
                  src={club.image}
                  alt=""
                  width={640}
                  height={640}
                  className="club-card-img"
                />
                <button
                  type="button"
                  className={`rc-thumb-fav club-star club-star-on-art${isFav ? " is-on" : ""}`}
                  onClick={() => toggleFavorite(club)}
                  aria-pressed={isFav}
                  title={isFav ? "Remove favorite" : "Add favorite"}
                >
                  {isFav ? "★" : "☆"}
                </button>
              </div>
              <div className="club-card-body">
                <div className="club-card-top">
                  <span className="pill">{club.category}</span>
                </div>
                <h3>{club.name}</h3>
                <p className="club-card-blurb">{club.blurb}</p>
                <p className="club-card-meta">
                  <strong>Where:</strong> {club.areaHint}
                </p>
                <p className="club-card-meta">
                  <strong>Why it&apos;s a hit:</strong> {club.whyPopular}
                </p>
                {club.href && (
                  <p style={{ marginBottom: 0 }}>
                    {club.href.startsWith("/") ? (
                      <Link href={club.href} className="text-link">
                        Related hub page →
                      </Link>
                    ) : (
                      <a
                        href={club.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-link"
                      >
                        Learn more →
                      </a>
                    )}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          No curated clubs match that search — try the official Club Contacts
          PDF above for the full directory.
        </div>
      )}
    </div>
  );
}
