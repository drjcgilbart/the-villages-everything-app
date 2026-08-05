"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  VILLAGE_REGIONS,
  VILLAGES,
  type Village,
  type VillageRegionId,
  cddLabel,
  getRegion,
} from "@/lib/villages";

const STORAGE_KEY = "tvi-my-village-slug";

const REGION_IDS = new Set(VILLAGE_REGIONS.map((r) => r.id));

export function VillageBrowser() {
  const searchParams = useSearchParams();
  const regionParam = searchParams.get("region");
  const qParam = searchParams.get("q") || "";

  const [query, setQuery] = useState(qParam);
  const [region, setRegion] = useState<VillageRegionId | "all">(
    regionParam && REGION_IDS.has(regionParam as VillageRegionId)
      ? (regionParam as VillageRegionId)
      : "all"
  );
  const [mySlug, setMySlug] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMySlug(saved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (regionParam && REGION_IDS.has(regionParam as VillageRegionId)) {
      setRegion(regionParam as VillageRegionId);
    }
    if (qParam) setQuery(qParam);
  }, [regionParam, qParam]);

  const myVillage = useMemo(
    () => (mySlug ? VILLAGES.find((v) => v.slug === mySlug) || null : null),
    [mySlug]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return VILLAGES.filter((v) => {
      if (region !== "all" && v.region !== region) return false;
      if (!q) return true;
      const reg = getRegion(v.region);
      return (
        v.name.toLowerCase().includes(q) ||
        v.slug.includes(q) ||
        v.blurb.toLowerCase().includes(q) ||
        reg.label.toLowerCase().includes(q) ||
        reg.nearestSquare.toLowerCase().includes(q) ||
        (v.cdd != null && String(v.cdd).includes(q))
      );
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [query, region]);

  const grouped = useMemo(() => {
    const map = new Map<VillageRegionId, Village[]>();
    for (const r of VILLAGE_REGIONS) map.set(r.id, []);
    for (const v of filtered) {
      map.get(v.region)?.push(v);
    }
    return VILLAGE_REGIONS.map((r) => ({
      region: r,
      villages: map.get(r.id) || [],
    })).filter((g) => g.villages.length > 0);
  }, [filtered]);

  function setAsMine(slug: string) {
    try {
      localStorage.setItem(STORAGE_KEY, slug);
      setMySlug(slug);
    } catch {
      /* ignore */
    }
  }

  function clearMine() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setMySlug(null);
    } catch {
      /* ignore */
    }
  }

  const letters = useMemo(() => {
    const set = new Set(filtered.map((v) => v.name[0]?.toUpperCase() || "#"));
    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((L) => set.has(L));
  }, [filtered]);

  return (
    <div className="village-browser">
      {myVillage && (
        <div className="my-village-banner about-panel">
          <div>
            <span className="kicker">Your saved village</span>
            <h2 style={{ margin: "0.35rem 0" }}>
              Village of {myVillage.name}
            </h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              {getRegion(myVillage.region).shortLabel} ·{" "}
              {cddLabel(myVillage.cdd)} · near{" "}
              {getRegion(myVillage.region).nearestSquare}
            </p>
          </div>
          <div className="my-village-banner-actions">
            <Link
              href={`/my-village/${myVillage.slug}`}
              className="btn btn-primary btn-sm"
            >
              Open my village
            </Link>
            <button type="button" className="btn btn-ghost btn-sm" onClick={clearMine}>
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="village-toolbar about-panel">
        <div className="field" style={{ margin: 0 }}>
          <label htmlFor="village-search">Find your village</label>
          <input
            id="village-search"
            type="search"
            placeholder="Try Edenfield, Fenney, Spanish Springs area…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="village-region-filters" role="group" aria-label="Filter by area">
          <button
            type="button"
            className={region === "all" ? "active" : ""}
            onClick={() => setRegion("all")}
          >
            All areas ({VILLAGES.length})
          </button>
          {VILLAGE_REGIONS.map((r) => {
            const count = VILLAGES.filter((v) => v.region === r.id).length;
            return (
              <button
                key={r.id}
                type="button"
                className={region === r.id ? "active" : ""}
                onClick={() => setRegion(r.id)}
              >
                {r.shortLabel} ({count})
              </button>
            );
          })}
        </div>
        {letters.length > 0 && (
          <div className="village-az" aria-label="Jump by letter">
            {letters.map((L) => (
              <a key={L} href={`#letter-${L}`}>
                {L}
              </a>
            ))}
          </div>
        )}
        <p className="village-result-count">
          Showing <strong>{filtered.length}</strong> village
          {filtered.length === 1 ? "" : "s"}
          {query ? ` matching “${query}”` : ""}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          No villages match that search. Try a shorter name or pick an area filter.
        </div>
      ) : region === "all" && !query.trim() ? (
        <div className="village-region-blocks">
          {grouped.map(({ region: r, villages }) => (
            <section key={r.id} id={`region-${r.id}`} className="village-region-block">
              <div className="section-head">
                <div>
                  <h2>{r.label}</h2>
                  <p>
                    {r.description} Nearest square energy:{" "}
                    <strong>{r.nearestSquare}</strong>.
                  </p>
                </div>
              </div>
              <div className="village-chip-grid">
                {villages.map((village) => (
                  <VillageChip
                    key={village.slug}
                    village={village}
                    isMine={mySlug === village.slug}
                    onSetMine={() => setAsMine(village.slug)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="village-alpha-list">
          {letters.map((L) => {
            const group = filtered.filter(
              (v) => v.name[0]?.toUpperCase() === L
            );
            if (!group.length) return null;
            return (
              <section key={L} id={`letter-${L}`} className="village-letter-block">
                <h2 className="village-letter-head">{L}</h2>
                <div className="village-chip-grid">
                  {group.map((village) => (
                    <VillageChip
                      key={village.slug}
                      village={village}
                      isMine={mySlug === village.slug}
                      onSetMine={() => setAsMine(village.slug)}
                      showRegion
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function VillageChip({
  village,
  isMine,
  onSetMine,
  showRegion = false,
}: {
  village: Village;
  isMine: boolean;
  onSetMine: () => void;
  showRegion?: boolean;
}) {
  const region = getRegion(village.region);
  return (
    <article className={`village-chip ${isMine ? "is-mine" : ""}`}>
      <Link href={`/my-village/${village.slug}`} className="village-chip-main">
        <strong>Village of {village.name}</strong>
        {showRegion && <span>{region.shortLabel}</span>}
        <span className="village-chip-meta">
          {cddLabel(village.cdd)} · near {region.nearestSquare.split("·")[0].trim()}
        </span>
      </Link>
      <button
        type="button"
        className="village-chip-save"
        onClick={onSetMine}
        aria-pressed={isMine}
        title={isMine ? "This is your saved village" : "Save as my village"}
      >
        {isMine ? "★ Mine" : "☆ Mine"}
      </button>
    </article>
  );
}

export function VillageSaveButton({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const [isMine, setIsMine] = useState(false);

  useEffect(() => {
    try {
      setIsMine(localStorage.getItem(STORAGE_KEY) === slug);
    } catch {
      /* ignore */
    }
  }, [slug]);

  function toggle() {
    try {
      if (isMine) {
        localStorage.removeItem(STORAGE_KEY);
        setIsMine(false);
      } else {
        localStorage.setItem(STORAGE_KEY, slug);
        setIsMine(true);
      }
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      className={`btn ${isMine ? "btn-primary" : "btn-ghost"} btn-sm`}
      onClick={toggle}
    >
      {isMine ? `★ ${name} is my village` : `☆ Save ${name} as my village`}
    </button>
  );
}
