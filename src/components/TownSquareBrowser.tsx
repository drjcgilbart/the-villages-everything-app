"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  actTimeLabel,
  floridaDateKey,
  getSquareDaySchedule,
  type SquareDaySchedule,
  type SquareId,
} from "@/lib/squareEntertainment";
import { TOWN_SQUARES, getTownSquare } from "@/lib/townSquares";
import {
  isTownSquareFavorite,
  readTownSquareFavorites,
  sortSquaresWithFavoritesFirst,
  toggleTownSquareFavorite,
  writeTownSquareFavorites,
} from "@/lib/townSquareFavorites";

export function TownSquareBrowser({
  tonightBySquareId,
}: {
  /** Server-hydrated tonight schedules (auto-refreshed lineup). */
  tonightBySquareId?: Record<string, SquareDaySchedule>;
} = {}) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [liveTonight, setLiveTonight] = useState(tonightBySquareId || {});

  useEffect(() => {
    setFavorites(readTownSquareFavorites());
    setHydrated(true);
    // Keep cards in sync with auto-refreshed schedule API
    void fetch("/api/entertainment/schedule", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data.squares)) return;
        const map: Record<string, SquareDaySchedule> = {};
        for (const s of data.squares as SquareDaySchedule[]) {
          if (s?.squareId) map[s.squareId] = s;
        }
        setLiveTonight(map);
      })
      .catch(() => {
        /* keep server prop / local defaults */
      });
  }, []);

  const favoriteSquares = useMemo(
    () =>
      favorites
        .map((id) => getTownSquare(id))
        .filter((s): s is NonNullable<typeof s> => Boolean(s)),
    [favorites]
  );

  const ordered = useMemo(() => {
    const base = favoritesOnly
      ? TOWN_SQUARES.filter((s) => favorites.includes(s.id))
      : TOWN_SQUARES;
    return sortSquaresWithFavoritesFirst(base, favorites);
  }, [favorites, favoritesOnly]);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = toggleTownSquareFavorite(id, prev);
      writeTownSquareFavorites(next);
      return next;
    });
  }

  return (
    <div className="ts-browser">
      {hydrated && favoriteSquares.length > 0 && !favoritesOnly && (
        <div className="rc-favorites-banner about-panel ts-favorites-banner">
          <div className="rc-favorites-banner-head">
            <div>
              <span className="kicker">Your favorites · this device</span>
              <h3 style={{ margin: "0.3rem 0 0.15rem" }}>
                {favoriteSquares.length} favorite square
                {favoriteSquares.length === 1 ? "" : "s"}
              </h3>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.9rem" }}>
                Starred squares stay highlighted and sorted to the top.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setFavoritesOnly(true)}
            >
              Show favorites only
            </button>
          </div>
          <div className="rc-favorites-strip">
            {favoriteSquares.map((s) => (
              <Link
                key={s.id}
                href={`/town-squares/${s.id}`}
                className="rc-fav-chip ts-fav-chip-link"
              >
                <Image
                  src={s.photo.src}
                  alt=""
                  width={48}
                  height={48}
                  className="rc-fav-chip-img"
                />
                <span>{s.shortName}</span>
                <span className="rc-fav-chip-star" aria-hidden>
                  ★
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="ts-browser-toolbar">
        <p className="rc-browser-count" style={{ margin: 0 }}>
          {favoritesOnly ? (
            <>
              Showing <strong>{ordered.length}</strong> favorite
              {ordered.length === 1 ? "" : "s"}
            </>
          ) : (
            <>
              <strong>{TOWN_SQUARES.length}</strong> squares
              {favorites.length > 0 && (
                <>
                  {" "}
                  · <strong>{favorites.length}</strong> starred (pinned on top)
                </>
              )}
            </>
          )}
        </p>
        <div className="rc-filter-pills">
          <button
            type="button"
            className={`rc-filter-pill${!favoritesOnly ? " active" : ""}`}
            onClick={() => setFavoritesOnly(false)}
          >
            All squares
          </button>
          <button
            type="button"
            className={`rc-filter-pill${favoritesOnly ? " active" : ""}`}
            onClick={() => setFavoritesOnly(true)}
          >
            ★ Favorites
            {favorites.length > 0 ? ` (${favorites.length})` : ""}
          </button>
        </div>
      </div>

      <div className="ts-square-grid">
        {ordered.map((square) => {
          const isFav = favorites.includes(square.id);
          const tonight =
            liveTonight[square.id] ||
            getSquareDaySchedule(square.id as SquareId, floridaDateKey());
          return (
            <div
              key={square.id}
              className={`ts-square-card-wrap${isFav ? " is-fav" : ""}`}
            >
              <Link
                href={`/town-squares/${square.id}#tonight`}
                className="about-panel ts-square-card"
              >
                <div className="ts-square-card-art">
                  <Image
                    src={square.photo.src}
                    alt={square.photo.alt}
                    width={640}
                    height={400}
                    className="ts-square-card-img"
                  />
                </div>
                <div className="ts-square-card-body">
                  <div className="ts-square-card-title-row">
                    <h3>{square.name}</h3>
                    {isFav && (
                      <span className="pill rc-fav-pill">★ Favorite</span>
                    )}
                  </div>
                  <div className="ts-card-tonight">
                    <span className="ts-card-tonight-label">Tonight</span>
                    <strong className="ts-card-tonight-time">
                      {tonight.hours.label}
                    </strong>
                    {tonight.hasCuratedActs ? (
                      <ul className="ts-card-tonight-acts">
                        {tonight.acts.map((act) => (
                          <li key={act.name + (act.start || "")}>
                            <span className="ts-card-act-name">{act.name}</span>
                            <span className="ts-card-act-time">
                              {actTimeLabel(act, tonight.hours)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="ts-card-tonight-fallback">
                        Free live music most nights · see official lineup
                      </p>
                    )}
                  </div>
                  <p>{square.blurb}</p>
                  <p className="ts-cam-note">
                    <strong>Live cam:</strong> {square.camNote}
                  </p>
                  <span className="text-link">Who&apos;s playing →</span>
                </div>
              </Link>
              <button
                type="button"
                className={`rc-thumb-fav ts-square-fav${isFav ? " is-on" : ""}`}
                onClick={() => toggleFavorite(square.id)}
                aria-pressed={isFav}
                title={
                  isFav ? "Remove from favorites" : "Add to favorites"
                }
                aria-label={
                  isFav
                    ? `Remove ${square.shortName} from favorites`
                    : `Add ${square.shortName} to favorites`
                }
              >
                {isFav ? "★" : "☆"}
              </button>
            </div>
          );
        })}
      </div>

      {ordered.length === 0 && favoritesOnly && (
        <div className="empty-state">
          No favorites yet. Star a square from a card or its full page — they
          pin to the top on this device.
        </div>
      )}
    </div>
  );
}

/** Star / unstar for individual town square detail pages. */
export function TownSquareFavoriteButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    setIsFav(isTownSquareFavorite(id, readTownSquareFavorites()));
  }, [id]);

  function toggle() {
    const next = toggleTownSquareFavorite(id, readTownSquareFavorites());
    writeTownSquareFavorites(next);
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
