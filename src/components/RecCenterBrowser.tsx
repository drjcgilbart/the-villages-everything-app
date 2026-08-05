"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  REC_CENTERS,
  getRecCenter,
  type RecCenterType,
  typeLabel,
} from "@/lib/recCenters";
import {
  isRecFavorite,
  readRecFavorites,
  sortWithFavoritesFirst,
  toggleRecFavorite,
  writeRecFavorites,
} from "@/lib/recCenterFavorites";

type FilterType = "all" | "favorites" | RecCenterType;

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "favorites", label: "★ Favorites" },
  { id: "all", label: "All centers" },
  { id: "regional", label: "Regional" },
  { id: "village", label: "Village" },
  { id: "neighborhood", label: "Neighborhood" },
];

export function RecCenterBrowser() {
  const [filter, setFilter] = useState<FilterType>("regional");
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [selectedId, setSelectedId] = useState(
    REC_CENTERS.find((c) => c.type === "regional")?.id ?? REC_CENTERS[0].id
  );

  useEffect(() => {
    setFavorites(readRecFavorites());
    setHydrated(true);
  }, []);

  const favoriteCenters = useMemo(
    () =>
      favorites
        .map((id) => getRecCenter(id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [favorites]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = REC_CENTERS.filter((c) => {
      if (filter === "favorites") {
        if (!favorites.includes(c.id)) return false;
      } else if (filter !== "all" && c.type !== filter) {
        return false;
      }
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.shortName.toLowerCase().includes(q) ||
        c.address.toLowerCase().includes(q) ||
        c.areaHint.toLowerCase().includes(q) ||
        c.theme.toLowerCase().includes(q)
      );
    });
    return sortWithFavoritesFirst(list, favorites);
  }, [filter, query, favorites]);

  const selected =
    filtered.find((c) => c.id === selectedId) ||
    filtered[0] ||
    REC_CENTERS[0];

  const activeId = filtered.some((c) => c.id === selectedId)
    ? selectedId
    : selected.id;

  const selectedIsFavorite = isRecFavorite(activeId, favorites);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = toggleRecFavorite(id, prev);
      writeRecFavorites(next);
      return next;
    });
  }

  return (
    <div className="rc-browser">
      {hydrated && favoriteCenters.length > 0 && filter !== "favorites" && (
        <div className="rc-favorites-banner about-panel">
          <div className="rc-favorites-banner-head">
            <div>
              <span className="kicker">Your favorites · this device</span>
              <h3 style={{ margin: "0.3rem 0 0.15rem" }}>
                {favoriteCenters.length} saved center
                {favoriteCenters.length === 1 ? "" : "s"}
              </h3>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
                Starred centers always sort to the top of the list.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setFilter("favorites")}
            >
              Show favorites only
            </button>
          </div>
          <div className="rc-favorites-strip">
            {favoriteCenters.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`rc-fav-chip${c.id === activeId ? " active" : ""}`}
                onClick={() => setSelectedId(c.id)}
              >
                <Image
                  src={c.image}
                  alt=""
                  width={48}
                  height={48}
                  className="rc-fav-chip-img"
                />
                <span>{c.shortName}</span>
                <span
                  className="rc-fav-chip-star"
                  aria-hidden
                >
                  ★
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="rc-browser-controls about-panel">
        <div className="rc-browser-row">
          <label className="rc-field">
            <span>Jump to a center</span>
            <select
              value={activeId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="rc-select"
            >
              {filtered.length === 0 ? (
                <option value="">No matches</option>
              ) : (
                filtered.map((c) => (
                  <option key={c.id} value={c.id}>
                    {favorites.includes(c.id) ? "★ " : ""}
                    {c.shortName} · {typeLabel(c.type)}
                  </option>
                ))
              )}
            </select>
          </label>
          <label className="rc-field rc-field-grow">
            <span>Search</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Name, street, theme…"
              className="rc-search"
            />
          </label>
        </div>
        <div className="rc-filter-pills" role="tablist" aria-label="Center type">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={`rc-filter-pill${filter === f.id ? " active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              {f.id === "favorites" && favorites.length > 0
                ? ` (${favorites.length})`
                : ""}
            </button>
          ))}
        </div>
        <p className="rc-browser-count">
          Showing <strong>{filtered.length}</strong>
          {filter === "favorites"
            ? " favorite"
            : ` of ${REC_CENTERS.length}`}{" "}
          center{filtered.length === 1 ? "" : "s"}
          {favorites.length > 0 && filter !== "favorites" && (
            <>
              {" "}
              · <strong>{favorites.length}</strong> starred (pinned on top)
            </>
          )}
        </p>
      </div>

      {selected && filtered.length > 0 && (
        <div className="rc-preview about-panel">
          <div className="rc-preview-art">
            <Image
              src={selected.image}
              alt=""
              width={480}
              height={480}
              className="rc-preview-img"
              priority
            />
          </div>
          <div className="rc-preview-copy">
            <div className="rc-preview-pills">
              <span className="pill pill-rank">{typeLabel(selected.type)}</span>
              {selectedIsFavorite && (
                <span className="pill rc-fav-pill">★ Favorite</span>
              )}
            </div>
            <h2 style={{ margin: "0.4rem 0 0.35rem" }}>{selected.name}</h2>
            <p className="rc-preview-theme">{selected.theme}</p>
            <p>{selected.blurb}</p>
            <ul className="restaurant-details-list">
              <li>
                <strong>Address</strong> {selected.address}
              </li>
              {selected.phone && (
                <li>
                  <strong>Phone</strong>{" "}
                  <a href={`tel:${selected.phone.replace(/\D/g, "")}`}>
                    {selected.phone}
                  </a>
                </li>
              )}
              <li>
                <strong>Area</strong> {selected.areaHint}
              </li>
            </ul>
            <div className="hero-actions" style={{ marginTop: "0.85rem" }}>
              <button
                type="button"
                className={`btn btn-sm ${selectedIsFavorite ? "btn-primary" : "btn-ghost"}`}
                onClick={() => toggleFavorite(selected.id)}
                aria-pressed={selectedIsFavorite}
              >
                {selectedIsFavorite
                  ? "★ Favorited"
                  : "☆ Add to favorites"}
              </button>
              <Link
                href={`/rec-centers/${selected.id}`}
                className="btn btn-primary btn-sm"
              >
                Full page →
              </Link>
              <a
                href={selected.officialPage}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-sm"
              >
                Official listing
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="rc-thumb-grid">
        {filtered.map((c) => {
          const isActive = c.id === activeId;
          const isFav = favorites.includes(c.id);
          return (
            <div
              key={c.id}
              className={`rc-thumb-wrap${isActive ? " active" : ""}${isFav ? " is-fav" : ""}`}
            >
              <button
                type="button"
                className={`rc-thumb${isActive ? " active" : ""}`}
                onClick={() => setSelectedId(c.id)}
                aria-pressed={isActive}
              >
                <span className="rc-thumb-art">
                  <Image
                    src={c.image}
                    alt=""
                    width={200}
                    height={200}
                    className="rc-thumb-img"
                  />
                </span>
                <span className="rc-thumb-body">
                  <strong>{c.shortName}</strong>
                  <span>{typeLabel(c.type)}</span>
                </span>
              </button>
              <button
                type="button"
                className={`rc-thumb-fav${isFav ? " is-on" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(c.id);
                }}
                aria-pressed={isFav}
                title={isFav ? "Remove from favorites" : "Add to favorites"}
                aria-label={
                  isFav
                    ? `Remove ${c.shortName} from favorites`
                    : `Add ${c.shortName} to favorites`
                }
              >
                {isFav ? "★" : "☆"}
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          {filter === "favorites"
            ? "No favorites yet. Star a center from the list or a center’s full page."
            : "No centers match that search. Try another name or clear the filter."}
        </div>
      )}
    </div>
  );
}

/** Star / unstar control for individual rec center detail pages. */
export function RecCenterFavoriteButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(isRecFavorite(id, readRecFavorites()));
  }, [id]);

  function toggle() {
    const next = toggleRecFavorite(id, readRecFavorites());
    writeRecFavorites(next);
    setIsFav(next.includes(id));
  }

  return (
    <button
      type="button"
      className={`btn btn-sm ${isFav ? "btn-primary" : "btn-ghost"}`}
      onClick={toggle}
      aria-pressed={isFav}
    >
      {isFav ? `★ ${name} is a favorite` : `☆ Favorite ${name}`}
    </button>
  );
}
