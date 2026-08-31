"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { VillagesForecast } from "@/lib/weather";
import { VILLAGES_LAT, VILLAGES_LON, VILLAGES_TZ, windDirLabel } from "@/lib/weather";
import { useMemberBoard } from "@/components/useMemberBoard";
import { uid } from "@/lib/mySpaceStorage";

const POLL_MS = 5 * 60 * 1000;
const KEY = "tvea-ms-weather-locs-v1";

type WeatherPlace = {
  id: string;
  label: string;
  query: string;
  zip: string;
  name: string;
  admin1: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

type WeatherLocState = {
  activeId: string;
  locations: WeatherPlace[];
};

type SearchHit = {
  name: string;
  admin1: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  zip: string;
  label: string;
  query: string;
};

const HOME: WeatherPlace = {
  id: "loc-home",
  label: "The Villages, FL",
  query: "34762",
  zip: "34762",
  name: "The Villages",
  admin1: "Florida",
  country: "United States",
  countryCode: "US",
  latitude: VILLAGES_LAT,
  longitude: VILLAGES_LON,
  timezone: VILLAGES_TZ,
};

function defaultLocs(): WeatherLocState {
  return { activeId: HOME.id, locations: [{ ...HOME }] };
}

function hydrateLocs(raw: Record<string, unknown> | WeatherLocState): WeatherLocState {
  const r = (raw || {}) as Record<string, unknown>;
  const list = Array.isArray(r.locations) ? (r.locations as WeatherPlace[]) : [];
  const locations = list
    .map((l) => ({
      id: String(l.id || uid("loc")),
      label: String(l.label || l.name || "Saved location").slice(0, 80),
      query: String(l.query || ""),
      zip: String(l.zip || ""),
      name: String(l.name || ""),
      admin1: String(l.admin1 || ""),
      country: String(l.country || ""),
      countryCode: String(l.countryCode || ""),
      latitude: Number(l.latitude),
      longitude: Number(l.longitude),
      timezone: String(l.timezone || "auto"),
    }))
    .filter((l) => Number.isFinite(l.latitude) && Number.isFinite(l.longitude))
    .slice(0, 20);
  if (!locations.length) return defaultLocs();
  const activeId = String(r.activeId || "");
  const active = locations.find((l) => l.id === activeId) || locations[0];
  return { activeId: active.id, locations };
}

function locTitle(loc: WeatherPlace) {
  return (loc.label || loc.name || "Saved location").trim();
}

function locDetail(loc: WeatherPlace) {
  if (loc.zip) return `ZIP ${loc.zip}`;
  const bits = [loc.admin1, loc.country].filter(Boolean);
  if (bits.length) return bits.join(" · ");
  return `${loc.latitude.toFixed(2)}°, ${loc.longitude.toFixed(2)}°`;
}

function fmtTime(iso: string | null, tz: string): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz || VILLAGES_TZ,
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

function fmtHour(iso: string, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz || VILLAGES_TZ,
      hour: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

function fmtDay(iso: string, index: number, tz: string): string {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: tz || VILLAGES_TZ,
      weekday: "long",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

/**
 * Full Villages weather dashboard ported from My Retirement Reboot:
 * current conditions, metrics, next 24 hours, 7-day forecast,
 * plus saved locations (city / ZIP) you can cycle and manage.
 */
export function MySpaceWeatherBoard() {
  const { value, save, ready } = useMemberBoard<WeatherLocState>(
    "weather",
    defaultLocs(),
    true,
    { localKey: KEY, debounceMs: 500 }
  );
  const locs = useMemo(() => hydrateLocs(value || defaultLocs()), [value]);
  const active = locs.locations.find((l) => l.id === locs.activeId) || locs.locations[0];

  const [data, setData] = useState<VillagesForecast | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [manager, setManager] = useState(false);
  const [query, setQuery] = useState("");
  const [nickname, setNickname] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [searchStatus, setSearchStatus] = useState("");
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function persist(next: WeatherLocState) {
    void save(next);
  }

  const load = useCallback(async (loc: WeatherPlace, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const params = new URLSearchParams({
        lat: String(loc.latitude),
        lon: String(loc.longitude),
        tz: loc.timezone || "auto",
        name: locTitle(loc),
        zip: loc.zip || "",
      });
      const res = await fetch(`/api/weather/forecast?${params.toString()}`, {
        cache: "no-store",
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Weather unavailable");
      setData(j as VillagesForecast);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Weather unavailable");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!ready || !active) return;
    load(active, false);
    const id = window.setInterval(() => load(active, true), POLL_MS);
    return () => window.clearInterval(id);
  }, [ready, active?.id, load]);

  async function runSearch(q: string) {
    const text = q.trim();
    if (text.length < 2) {
      setHits([]);
      setSearchStatus("Type a city, town, or ZIP code.");
      return;
    }
    setSearching(true);
    setSearchStatus("Searching…");
    try {
      const res = await fetch(`/api/weather/search?q=${encodeURIComponent(text)}`, {
        cache: "no-store",
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Search failed");
      const results = (j.results || []) as SearchHit[];
      setHits(results);
      setSearchStatus(
        results.length
          ? `${results.length} match${results.length === 1 ? "" : "es"} — tap one to save.`
          : "No matches. Try a city name or ZIP code."
      );
    } catch (e) {
      setHits([]);
      setSearchStatus(e instanceof Error ? e.message : "Search failed");
    } finally {
      setSearching(false);
    }
  }

  function setActive(id: string) {
    const loc = locs.locations.find((l) => l.id === id);
    if (!loc) return;
    persist({ ...locs, activeId: loc.id });
  }

  function cycle(dir: number) {
    if (locs.locations.length < 2) return;
    const i = locs.locations.findIndex((l) => l.id === locs.activeId);
    const start = i < 0 ? 0 : i;
    const next = (start + dir + locs.locations.length) % locs.locations.length;
    setActive(locs.locations[next].id);
  }

  function saveHit(hit: SearchHit) {
    const nick = nickname.trim();
    const exists = locs.locations.find(
      (l) =>
        Math.abs(l.latitude - hit.latitude) < 0.01 &&
        Math.abs(l.longitude - hit.longitude) < 0.01
    );
    if (exists) {
      persist({ ...locs, activeId: exists.id });
    } else {
      const loc: WeatherPlace = {
        id: uid("loc"),
        label: (nick || hit.label || hit.name).slice(0, 80),
        query: hit.query || hit.name,
        zip: hit.zip || "",
        name: hit.name,
        admin1: hit.admin1,
        country: hit.country,
        countryCode: hit.countryCode,
        latitude: hit.latitude,
        longitude: hit.longitude,
        timezone: hit.timezone || "auto",
      };
      persist({
        activeId: loc.id,
        locations: [...locs.locations, loc].slice(0, 20),
      });
    }
    setQuery("");
    setNickname("");
    setHits([]);
    setSearchStatus("");
  }

  function renameLoc(id: string) {
    const loc = locs.locations.find((l) => l.id === id);
    if (!loc) return;
    const next = window.prompt("Name this location", locTitle(loc));
    if (next == null) return;
    const label = next.trim().slice(0, 80);
    if (!label) return;
    persist({
      ...locs,
      locations: locs.locations.map((l) => (l.id === id ? { ...l, label } : l)),
    });
  }

  function removeLoc(id: string) {
    if (locs.locations.length <= 1) return;
    const locations = locs.locations.filter((l) => l.id !== id);
    const activeId = locs.activeId === id ? locations[0].id : locs.activeId;
    persist({ activeId, locations });
  }

  const tz = data?.timezone || active?.timezone || VILLAGES_TZ;
  const many = locs.locations.length > 1;

  const metrics = data
    ? [
        { label: "Humidity", value: `${data.humidity}%`, sub: "Relative" },
        {
          label: "Wind",
          value: `${data.windMph} mph`,
          sub: `${windDirLabel(data.windDirDeg)}${data.windGustMph != null ? ` · gusts ${data.windGustMph}` : ""}`,
        },
        {
          label: "UV index",
          value: data.uvIndex != null ? String(data.uvIndex) : "—",
          sub: data.daily[0]?.uvMax != null ? `Max today ${data.daily[0].uvMax}` : "—",
        },
        {
          label: "Rain chance",
          value: data.rainChancePct != null ? `${data.rainChancePct}%` : "—",
          sub: data.precipIn ? `Precip ${data.precipIn}"` : "Today",
        },
        {
          label: "Pressure",
          value: data.pressureInHg != null ? `${data.pressureInHg}"` : "—",
          sub: "inHg",
        },
        {
          label: "Clouds",
          value: data.cloudCover != null ? `${data.cloudCover}%` : "—",
          sub: "Cover",
        },
        {
          label: "Visibility",
          value: data.visibilityMi != null ? `${data.visibilityMi} mi` : "—",
          sub: "—",
        },
        {
          label: "Feels like",
          value: `${data.feelsLikeF}°`,
          sub: data.condition,
        },
      ]
    : [];

  return (
    <div className="ms-dash-weather">
      <div className="ms-wx-locbar">
        <button
          type="button"
          className="btn btn-ghost btn-sm ms-wx-loc-arrow"
          onClick={() => cycle(-1)}
          disabled={!many}
          aria-label="Previous location"
        >
          ‹
        </button>
        <button
          type="button"
          className="ms-wx-loc-current"
          onClick={() => setManager((m) => !m)}
          aria-expanded={manager}
        >
          <span className="panel-hint">Weather for</span>
          <strong>{locTitle(active)}</strong>
          <span className="panel-hint">{locDetail(active)}</span>
          {many ? (
            <span className="ms-wx-dots" aria-hidden>
              {locs.locations.map((l) => (
                <i key={l.id} className={l.id === active.id ? "on" : ""} />
              ))}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm ms-wx-loc-arrow"
          onClick={() => cycle(1)}
          disabled={!many}
          aria-label="Next location"
        >
          ›
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setManager(true)}
        >
          Add location
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setManager((m) => !m)}
        >
          Manage
        </button>
      </div>

      {manager ? (
        <div className="about-panel ms-wx-manager">
          <div className="ms-panel-head">
            <h4 style={{ margin: 0 }}>Weather locations</h4>
            <span className="panel-hint">City, town, or ZIP — save as many as you like</span>
          </div>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              void runSearch(query);
            }}
          >
            <div className="field">
              <label>Search</label>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  const q = e.target.value.trim();
                  if (searchTimer.current) clearTimeout(searchTimer.current);
                  if (q.length >= 2) {
                    searchTimer.current = setTimeout(() => void runSearch(e.target.value), 280);
                  } else {
                    setHits([]);
                    setSearchStatus("");
                  }
                }}
                placeholder="Orlando, FL or 10001"
              />
            </div>
            <div className="field">
              <label>Nickname (optional)</label>
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Home, cabin, kids…"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm" disabled={searching}>
              Find
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setManager(false)}
            >
              Done
            </button>
          </form>
          {searchStatus ? <p className="panel-hint">{searchStatus}</p> : null}
          {hits.length > 0 ? (
            <ul className="ms-wx-hits">
              {hits.map((h, i) => (
                <li key={`${h.latitude}-${h.longitude}-${i}`}>
                  <div>
                    <strong>{h.label || h.name}</strong>
                    <span className="panel-hint">
                      {[h.admin1, h.country].filter(Boolean).join(" · ")}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => saveHit(h)}
                  >
                    Save
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <ul className="ms-wx-saved">
            {locs.locations.map((l) => {
              const showing = l.id === active.id;
              return (
                <li key={l.id} className={showing ? "is-showing" : ""}>
                  <div>
                    <strong>
                      {locTitle(l)}
                      {showing ? " · showing" : ""}
                    </strong>
                    <span className="panel-hint">{locDetail(l)}</span>
                  </div>
                  <div className="hero-actions">
                    {!showing ? (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => setActive(l.id)}
                      >
                        Show
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => renameLoc(l.id)}
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      disabled={locs.locations.length <= 1}
                      onClick={() => removeLoc(l.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {loading && !data ? <p className="panel-hint">Loading weather…</p> : null}
      {error && !data ? (
        <div className="about-panel">
          <p className="pf-form-error">{error}</p>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => load(active, false)}>
            Retry
          </button>
        </div>
      ) : null}

      {data ? (
        <>
          <div className="ms-wx-hero about-panel">
            <div className="ms-wx-hero-main">
              <span className="ms-wx-hero-emoji" aria-hidden>
                {data.emoji}
              </span>
              <div>
                <div className="ms-wx-hero-temp">{data.temperatureF}°</div>
                <div className="ms-wx-hero-feels">
                  Feels like {data.feelsLikeF}° · {data.condition}
                </div>
                <div className="panel-hint" style={{ marginBottom: 0 }}>
                  {data.location}
                  {data.zip ? ` · ZIP ${data.zip}` : ""} · Open-Meteo · auto every 5 min
                </div>
              </div>
            </div>
            <div className="ms-wx-hero-side">
              <div className="ms-wx-hilo">
                <span>
                  H <strong>{data.highF ?? "—"}°</strong>
                </span>
                <span>
                  L <strong>{data.lowF ?? "—"}°</strong>
                </span>
              </div>
              <div className="ms-wx-sun">
                <div>
                  <span className="panel-hint">Sunrise</span>
                  <strong>{fmtTime(data.sunrise, tz)}</strong>
                </div>
                <div>
                  <span className="panel-hint">Sunset</span>
                  <strong>{fmtTime(data.sunset, tz)}</strong>
                </div>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => load(active, false)}>
                Refresh
              </button>
            </div>
          </div>

          <div className="ms-wx-metrics">
            {metrics.map((m) => (
              <div key={m.label} className="about-panel ms-wx-metric">
                <span className="panel-hint">{m.label}</span>
                <strong>{m.value}</strong>
                <span className="ms-wx-metric-sub">{m.sub}</span>
              </div>
            ))}
          </div>

          <div className="about-panel">
            <div className="ms-panel-head">
              <h4 style={{ margin: 0 }}>Hourly forecast</h4>
              <span className="panel-hint">Next 24 hours</span>
            </div>
            <div className="ms-wx-hourly">
              {data.hourly.map((h) => (
                <div key={h.time} className="ms-wx-hour">
                  <span className="ms-wx-hour-time">{fmtHour(h.time, tz)}</span>
                  <span aria-hidden>{h.emoji}</span>
                  <strong>{h.tempF}°</strong>
                  <span className="panel-hint">
                    {h.precipProb != null ? `${h.precipProb}%` : "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="about-panel">
            <div className="ms-panel-head">
              <h4 style={{ margin: 0 }}>7-day forecast</h4>
              <span className="panel-hint">Daily high / low</span>
            </div>
            <ul className="ms-wx-daily">
              {data.daily.map((d, i) => (
                <li key={d.date}>
                  <span className="ms-wx-day-name">{fmtDay(d.date, i, tz)}</span>
                  <span aria-hidden className="ms-wx-day-emoji">
                    {d.emoji}
                  </span>
                  <span className="ms-wx-day-cond">{d.condition}</span>
                  <span className="ms-wx-day-temps">
                    <strong>{d.highF}°</strong>
                    <span className="panel-hint"> / {d.lowF}°</span>
                  </span>
                  <span className="panel-hint">
                    {d.precipProb != null ? `${d.precipProb}% rain` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
