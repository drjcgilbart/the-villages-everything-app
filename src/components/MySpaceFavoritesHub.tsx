"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { POPULAR_CLUBS } from "@/lib/clubs";
import {
  readDiningFavorites,
  toggleDiningFavorite,
  writeDiningFavorites,
} from "@/lib/diningFavorites";
import type { Restaurant } from "@/lib/diningTypes";
import { getRecCenter } from "@/lib/recCenters";
import {
  readRecFavorites,
  toggleRecFavorite,
  writeRecFavorites,
} from "@/lib/recCenterFavorites";
import {
  FAVORITES_CHANGED_EVENT,
  readClubFavoritesLocal,
  readMyVillageSlug,
  writeClubFavoritesLocal,
  writeMyVillageSlug,
} from "@/lib/siteFavorites";
import { getTownSquare } from "@/lib/townSquares";
import {
  readTownSquareFavorites,
  toggleTownSquareFavorite,
  writeTownSquareFavorites,
} from "@/lib/townSquareFavorites";
import { getRegion, getVillageBySlug } from "@/lib/villages";

type FavSnapshot = {
  villageSlug: string | null;
  squareIds: string[];
  recIds: string[];
  clubIds: string[];
  diningIds: string[];
};

type DiningListItem = Pick<
  Restaurant,
  "id" | "name" | "slug" | "cuisine" | "area" | "priceRange" | "description"
>;

function readAll(): FavSnapshot {
  return {
    villageSlug: readMyVillageSlug(),
    squareIds: readTownSquareFavorites(),
    recIds: readRecFavorites(),
    clubIds: readClubFavoritesLocal(),
    diningIds: readDiningFavorites(),
  };
}

/**
 * Aggregates every site-wide favorite (home village, squares, rec centers,
 * clubs, dining) into My Space while leaving starring on the original pages
 * unchanged.
 */
export function MySpaceFavoritesHub() {
  const [snap, setSnap] = useState<FavSnapshot>({
    villageSlug: null,
    squareIds: [],
    recIds: [],
    clubIds: [],
    diningIds: [],
  });
  const [diningCatalog, setDiningCatalog] = useState<DiningListItem[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setSnap(readAll());
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener(FAVORITES_CHANGED_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/dining/restaurants", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const list = Array.isArray(data.restaurants) ? data.restaurants : [];
        if (!cancelled) {
          setDiningCatalog(
            list.map(
              (r: DiningListItem & { stats?: unknown }) =>
                ({
                  id: r.id,
                  name: r.name,
                  slug: r.slug,
                  cuisine: r.cuisine,
                  area: r.area,
                  priceRange: r.priceRange,
                  description: r.description,
                }) satisfies DiningListItem
            )
          );
        }
      } catch {
        /* offline */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const homeVillage = useMemo(
    () => (snap.villageSlug ? getVillageBySlug(snap.villageSlug) : null),
    [snap.villageSlug]
  );

  const squares = useMemo(
    () =>
      snap.squareIds
        .map((id) => getTownSquare(id))
        .filter((s): s is NonNullable<typeof s> => Boolean(s)),
    [snap.squareIds]
  );

  const recCenters = useMemo(
    () =>
      snap.recIds
        .map((id) => getRecCenter(id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [snap.recIds]
  );

  const clubs = useMemo(
    () =>
      snap.clubIds
        .map((id) => POPULAR_CLUBS.find((c) => c.id === id))
        .filter((c): c is NonNullable<typeof c> => Boolean(c)),
    [snap.clubIds]
  );

  const restaurants = useMemo(
    () =>
      snap.diningIds
        .map((id) => diningCatalog.find((r) => r.id === id))
        .filter((r): r is DiningListItem => Boolean(r)),
    [snap.diningIds, diningCatalog]
  );

  const total =
    (homeVillage ? 1 : 0) +
    squares.length +
    recCenters.length +
    clubs.length +
    snap.diningIds.length;

  function removeSquare(id: string) {
    writeTownSquareFavorites(toggleTownSquareFavorite(id, snap.squareIds));
    refresh();
  }

  function removeRec(id: string) {
    writeRecFavorites(toggleRecFavorite(id, snap.recIds));
    refresh();
  }

  function removeClub(id: string) {
    const next = snap.clubIds.filter((x) => x !== id);
    writeClubFavoritesLocal(next);
    refresh();
    // Best-effort account sync when signed in
    void fetch("/api/members/space", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ favoriteClubIds: next }),
    }).catch(() => {
      /* keep local */
    });
  }

  function clearHomeVillage() {
    writeMyVillageSlug(null);
    refresh();
  }

  function removeRestaurant(id: string) {
    writeDiningFavorites(toggleDiningFavorite(id, snap.diningIds));
    refresh();
  }

  if (!ready) {
    return (
      <section id="ms-favorites" className="my-space-block">
        <h3 className="my-space-block-title">My favorites</h3>
        <p className="panel-hint">Loading your stars…</p>
      </section>
    );
  }

  return (
    <section id="ms-favorites" className="my-space-block">
      <div className="section-head" style={{ marginBottom: "0.75rem" }}>
        <div>
          <h3 className="my-space-block-title" style={{ margin: 0 }}>
            My favorites
          </h3>
          <p style={{ margin: "0.25rem 0 0", color: "var(--muted)" }}>
            Everything you star across the site lands here — home village, town
            squares, rec centers, clubs, and dining. Star or unstar on those
            pages (or remove here). Saved on this browser
            {total > 0 ? (
              <>
                {" "}
                · <strong>{total}</strong> pick{total === 1 ? "" : "s"}
              </>
            ) : null}
            .
          </p>
        </div>
      </div>

      {total === 0 ? (
        <div className="empty-state about-panel">
          <p style={{ marginTop: 0 }}>
            No favorites yet. Star items on these pages and they&apos;ll show up
            here automatically:
          </p>
          <div className="ms-fav-start-links">
            <Link href="/my-village" className="btn btn-ghost btn-sm">
              The Villages
            </Link>
            <Link href="/town-squares" className="btn btn-ghost btn-sm">
              Town Squares
            </Link>
            <Link href="/rec-centers" className="btn btn-ghost btn-sm">
              Rec Centers
            </Link>
            <Link href="/dining" className="btn btn-ghost btn-sm">
              Dining
            </Link>
            <Link href="/club-zone" className="btn btn-ghost btn-sm">
              Clubs
            </Link>
          </div>
        </div>
      ) : (
        <div className="ms-fav-groups">
          <FavGroup
            title="My home village"
            browseHref="/my-village"
            browseLabel="Browse villages"
            empty={!homeVillage}
            emptyHint="Save a village as “mine” on The Villages page."
          >
            {homeVillage ? (
              <article className="about-panel ms-fav-card">
                <div className="ms-fav-card-body">
                  <span className="pill">Home · ★</span>
                  <h4 style={{ margin: "0.4rem 0 0.25rem" }}>
                    <Link href={`/my-village/${homeVillage.slug}`}>
                      {homeVillage.name}
                    </Link>
                  </h4>
                  <p className="ms-fav-meta">
                    {getRegion(homeVillage.region).label} ·{" "}
                    {getRegion(homeVillage.region).nearestSquare}
                  </p>
                  <p className="ms-fav-blurb">{homeVillage.blurb}</p>
                  <div className="ms-fav-actions">
                    <Link
                      href={`/my-village/${homeVillage.slug}`}
                      className="btn btn-ghost btn-sm"
                    >
                      Open
                    </Link>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={clearHomeVillage}
                    >
                      Clear home
                    </button>
                  </div>
                </div>
              </article>
            ) : null}
          </FavGroup>

          <FavGroup
            title="Town squares"
            browseHref="/town-squares"
            browseLabel="Town Squares"
            empty={squares.length === 0}
            emptyHint="Star squares on the Town Squares page."
          >
            <div className="ms-fav-grid">
              {squares.map((s) => (
                <article key={s.id} className="about-panel ms-fav-card">
                  <Link href={`/town-squares/${s.id}`} className="ms-fav-thumb-link">
                    <Image
                      src={s.photo.src}
                      alt=""
                      width={320}
                      height={320}
                      className="ms-fav-thumb"
                    />
                  </Link>
                  <div className="ms-fav-card-body">
                    <span className="pill">Square · ★</span>
                    <h4 style={{ margin: "0.4rem 0 0.25rem" }}>
                      <Link href={`/town-squares/${s.id}`}>{s.shortName}</Link>
                    </h4>
                    <p className="ms-fav-blurb">{s.blurb}</p>
                    <div className="ms-fav-actions">
                      <Link
                        href={`/town-squares/${s.id}`}
                        className="btn btn-ghost btn-sm"
                      >
                        Open
                      </Link>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => removeSquare(s.id)}
                      >
                        Unstar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </FavGroup>

          <FavGroup
            title="Rec centers"
            browseHref="/rec-centers"
            browseLabel="Rec Centers"
            empty={recCenters.length === 0}
            emptyHint="Star rec centers on the Rec Centers page."
          >
            <div className="ms-fav-grid">
              {recCenters.map((c) => (
                <article key={c.id} className="about-panel ms-fav-card">
                  <Link href={`/rec-centers/${c.id}`} className="ms-fav-thumb-link">
                    <Image
                      src={c.image}
                      alt=""
                      width={320}
                      height={320}
                      className="ms-fav-thumb"
                    />
                  </Link>
                  <div className="ms-fav-card-body">
                    <span className="pill">
                      {c.type} · ★
                    </span>
                    <h4 style={{ margin: "0.4rem 0 0.25rem" }}>
                      <Link href={`/rec-centers/${c.id}`}>{c.shortName}</Link>
                    </h4>
                    <p className="ms-fav-meta">{c.areaHint}</p>
                    <p className="ms-fav-blurb">{c.blurb}</p>
                    <div className="ms-fav-actions">
                      <Link
                        href={`/rec-centers/${c.id}`}
                        className="btn btn-ghost btn-sm"
                      >
                        Open
                      </Link>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => removeRec(c.id)}
                      >
                        Unstar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </FavGroup>

          <FavGroup
            title="Dining"
            browseHref="/dining"
            browseLabel="Dining"
            empty={restaurants.length === 0 && snap.diningIds.length === 0}
            emptyHint="Star restaurants on the Dining page."
          >
            {snap.diningIds.length > 0 && restaurants.length === 0 ? (
              <p className="panel-hint" style={{ marginBottom: 0 }}>
                Loading restaurant details…
              </p>
            ) : (
              <div className="ms-fav-grid">
                {restaurants.map((r) => (
                  <article key={r.id} className="about-panel ms-fav-card">
                    <div className="ms-fav-card-body">
                      <span className="pill">
                        {r.cuisine} · ★
                      </span>
                      <h4 style={{ margin: "0.4rem 0 0.25rem" }}>
                        <Link href={`/dining/${r.slug}`}>{r.name}</Link>
                      </h4>
                      <p className="ms-fav-meta">
                        {r.area} · {r.priceRange}
                      </p>
                      <p className="ms-fav-blurb">{r.description}</p>
                      <div className="ms-fav-actions">
                        <Link
                          href={`/dining/${r.slug}`}
                          className="btn btn-ghost btn-sm"
                        >
                          Open
                        </Link>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => removeRestaurant(r.id)}
                        >
                          Unstar
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </FavGroup>

          <FavGroup
            title="Clubs"
            browseHref="/club-zone"
            browseLabel="Clubs"
            empty={clubs.length === 0}
            emptyHint="Star clubs on the Clubs page."
          >
            <div className="ms-fav-grid">
              {clubs.map((c) => (
                <article key={c.id} className="about-panel ms-fav-card">
                  <Link href="/club-zone" className="ms-fav-thumb-link">
                    <Image
                      src={c.image}
                      alt=""
                      width={320}
                      height={320}
                      className="ms-fav-thumb"
                    />
                  </Link>
                  <div className="ms-fav-card-body">
                    <span className="pill">{c.category} · ★</span>
                    <h4 style={{ margin: "0.4rem 0 0.25rem" }}>{c.name}</h4>
                    <p className="ms-fav-meta">{c.areaHint}</p>
                    <p className="ms-fav-blurb">{c.blurb}</p>
                    <div className="ms-fav-actions">
                      <Link href="/club-zone" className="btn btn-ghost btn-sm">
                        Clubs
                      </Link>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => removeClub(c.id)}
                      >
                        Unstar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </FavGroup>
        </div>
      )}
    </section>
  );
}

function FavGroup({
  title,
  browseHref,
  browseLabel,
  empty,
  emptyHint,
  children,
}: {
  title: string;
  browseHref: string;
  browseLabel: string;
  empty: boolean;
  emptyHint: string;
  children: ReactNode;
}) {
  return (
    <div className="ms-fav-group about-panel">
      <div className="ms-fav-group-head">
        <h4 style={{ margin: 0 }}>{title}</h4>
        <Link href={browseHref} className="text-link">
          {browseLabel} →
        </Link>
      </div>
      {empty ? (
        <p className="panel-hint" style={{ marginBottom: 0 }}>
          {emptyHint}
        </p>
      ) : (
        children
      )}
    </div>
  );
}
