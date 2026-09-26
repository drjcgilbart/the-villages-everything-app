"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { VillagesForecast } from "@/lib/weather";
import { heatBand, uvBand } from "@/lib/weather";
import type { FloridaWeatherExtra, HurricaneStorm } from "@/lib/weatherFlorida";
import { isNativeAppShell, openExternalUrl } from "@/lib/nativeAppShell";

function ExtLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (isNativeAppShell()) {
          e.preventDefault();
          openExternalUrl(href);
        }
      }}
    >
      {children}
    </a>
  );
}

function stormHours(data: VillagesForecast) {
  return data.hourly.filter((h) => h.weatherCode >= 95).slice(0, 6);
}

function rainWindow(data: VillagesForecast) {
  const next = data.hourly.slice(0, 6);
  const wet = next.filter((h) => (h.precipProb ?? 0) >= 40);
  const dry = next.filter((h) => (h.precipProb ?? 0) < 30);
  return { next, wet, dry };
}

type CaneLayer = "satellite" | "radar" | "wind";

function windyMap(lat: number, lon: number, zoom: number, overlay: CaneLayer) {
  const latS = lat.toFixed(3);
  const lonS = lon.toFixed(3);
  const params = new URLSearchParams({
    type: "map",
    location: "coordinates",
    metricRain: "in",
    metricTemp: "°F",
    metricWind: "mph",
    zoom: String(zoom),
    overlay,
    product: "ecmwf",
    level: "surface",
    lat: latS,
    lon: lonS,
    detailLat: latS,
    detailLon: lonS,
    detail: "",
    message: "true",
    marker: "true",
    calendar: "now",
    radarRange: "-1",
    menu: "",
    pressure: overlay === "wind" ? "true" : "",
  });
  return `https://embed.windy.com/embed.html?${params.toString()}`;
}

function caneCenter(target: HurricaneStorm | "basin") {
  if (target === "basin" || target.latitude == null || target.longitude == null) {
    return { lat: 24, lon: -62, zoom: 4 };
  }
  const miles = target.milesFromVillages ?? 2000;
  const zoom = miles < 400 ? 6 : miles < 1200 ? 5 : 4;
  return { lat: target.latitude, lon: target.longitude, zoom };
}

function fmtCoord(lat: number, lon: number) {
  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(1)}°${ns}, ${Math.abs(lon).toFixed(1)}°${ew}`;
}

function uvPeakHour(data: VillagesForecast) {
  let best = data.hourly[0];
  for (const h of data.hourly) {
    if ((h.uvIndex ?? -1) > (best?.uvIndex ?? -1)) best = h;
  }
  return best;
}

export function VillagesWeatherTrackers({
  data,
  lat,
  lon,
  tz,
  fmtHour,
}: {
  data: VillagesForecast;
  lat: number;
  lon: number;
  tz: string;
  fmtHour: (iso: string, tz: string) => string;
}) {
  const [extra, setExtra] = useState<FloridaWeatherExtra | null>(null);
  const [stormDesk, setStormDesk] = useState(false);
  const [cane, setCane] = useState<HurricaneStorm | "basin" | null>(null);
  const [caneLayer, setCaneLayer] = useState<CaneLayer>("satellite");
  const [mapsReady, setMapsReady] = useState(false);
  const [mapLayer, setMapLayer] = useState<"lightning" | "radar">("lightning");
  const [here, setHere] = useState({ lat, lon, label: "The Villages" });
  const [mapPin, setMapPin] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    setHere({ lat, lon, label: "Saved weather location" });
  }, [lat, lon]);

  useEffect(() => {
    if (!stormDesk) return;
    setMapsReady(true);
    if (mapPin) return;
    const fallback = { lat, lon };
    if (!navigator.geolocation) {
      setMapPin(fallback);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHere({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          label: "Your location",
        });
        setMapPin({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => {
        setMapPin(fallback);
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 300000 }
    );
  }, [stormDesk, lat, lon, mapPin]);

  const deskOpen = stormDesk || cane != null;

  function openCane(target: HurricaneStorm | "basin") {
    setCane(target);
    const miles = target === "basin" ? 9999 : (target.milesFromVillages ?? 9999);
    setCaneLayer(miles < 400 ? "radar" : "satellite");
  }

  useEffect(() => {
    if (!deskOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setStormDesk(false);
      setCane(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [deskOpen]);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/weather/florida?lat=${lat}&lon=${lon}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled && !j.error) setExtra(j as FloridaWeatherExtra);
      })
      .catch(() => {
        /* keep forecast-only */
      });
    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  const uv = uvBand(data.uvIndex);
  const heat = heatBand(data.feelsLikeF);
  const storms = stormHours(data);
  const rain = rainWindow(data);
  const peak = uvPeakHour(data);
  const nwsStorms = extra?.alerts.filter((a) => a.kind === "storm") || [];
  const nwsCane = extra?.alerts.filter((a) => a.kind === "hurricane") || [];
  const nwsHeat = extra?.alerts.filter((a) => a.kind === "heat") || [];
  const nwsFlood = extra?.alerts.filter((a) => a.kind === "flood") || [];
  const nwsFreeze = extra?.alerts.filter((a) => a.kind === "freeze") || [];
  const overnight = data.daily[0]?.lowF;

  return (
    <div className="ms-wx-trackers">
      {extra?.alerts.length ? (
        <div className="about-panel ms-wx-alert-list">
          <h4 style={{ margin: "0 0 0.45rem" }}>National Weather Service</h4>
          <ul>
            {extra.alerts.slice(0, 6).map((a) => (
              <li key={a.id} className={`ms-wx-alert is-${a.kind}`}>
                <strong>{a.event}</strong>
                <span>{a.headline}</span>
                {a.instruction ? <em>{a.instruction}</em> : null}
              </li>
            ))}
          </ul>
          <p className="panel-hint" style={{ marginBottom: 0 }}>
            Official NWS for this point. If it’s a warning, treat it as real — not a
            suggestion.
          </p>
        </div>
      ) : null}

      <div className="ms-wx-tracker-grid">
        <article className={`about-panel ms-wx-card is-${uv.tone}`}>
          <p className="ms-wx-kicker">UV index</p>
          <h4>
            {data.uvIndex != null ? data.uvIndex : "—"}{" "}
            <span>{uv.level}</span>
          </h4>
          <p>{uv.tip}</p>
          <p className="panel-hint">
            Peak today{" "}
            {data.daily[0]?.uvMax != null ? data.daily[0].uvMax : "—"}
            {peak?.uvIndex != null ? ` · around ${fmtHour(peak.time, tz)}` : ""}
          </p>
        </article>

        <article className={`about-panel ms-wx-card is-${heat.tone}`}>
          <p className="ms-wx-kicker">Heat · cart caution</p>
          <h4>
            Feels {data.feelsLikeF}° <span>{heat.level}</span>
          </h4>
          <p>{heat.tip}</p>
          {nwsHeat[0] ? (
            <p className="panel-hint">{nwsHeat[0].event}: {nwsHeat[0].headline}</p>
          ) : (
            <p className="panel-hint">Humidity {data.humidity}% · Florida tax included</p>
          )}
        </article>

        <button
          type="button"
          className={`about-panel ms-wx-card ms-wx-card-btn ${
            nwsStorms.length || storms.length ? "is-warn" : "is-ok"
          }`}
          onClick={() => setStormDesk(true)}
        >
          <p className="ms-wx-kicker">Lightning · storms</p>
          <h4>
            {nwsStorms.length
              ? nwsStorms[0].event
              : storms.length
                ? "Thunder in the forecast"
                : "No storm alert"}
          </h4>
          <p>
            {nwsStorms[0]?.headline ||
              (storms.length
                ? `Thunderstorm weather as soon as ${fmtHour(storms[0].time, tz)}. Cart path to a building — not a tree.`
                : "No thunderstorm warning on the NWS feed right now. Still: if you hear it, clear the course.")}
          </p>
          <p className="panel-hint">
            30-30 rule: if thunder follows lightning by 30 seconds or less, get
            inside. Wait 30 minutes after the last boom.
          </p>
          <span className="ms-wx-card-cta">Open live map →</span>
        </button>

        <article
          className={`about-panel ms-wx-card ${
            nwsCane.length || (extra?.storms.length ?? 0) ? "is-alert" : "is-ok"
          }`}
        >
          <button
            type="button"
            className="ms-wx-cane-main"
            onClick={() => openCane(extra?.storms[0] ?? "basin")}
          >
            <p className="ms-wx-kicker">Hurricane desk</p>
            {nwsCane[0] ? (
              <>
                <h4>{nwsCane[0].event}</h4>
                <p>{nwsCane[0].headline}</p>
              </>
            ) : extra?.storms.length ? (
              <>
                <h4>
                  {extra.storms[0].classificationLabel} {extra.storms[0].name}
                </h4>
                <p>
                  {extra.storms[0].windMph != null
                    ? `${extra.storms[0].windMph} mph winds`
                    : extra.storms[0].classificationLabel}
                  {extra.storms[0].milesFromVillages != null
                    ? ` · about ${extra.storms[0].milesFromVillages} miles from The Villages`
                    : ""}
                  . {extra.storms[0].movement}.
                </p>
              </>
            ) : (
              <>
                <h4>Atlantic quiet here</h4>
                <p>
                  No tropical watch or warning on the local NWS feed, and no named
                  storm is flagged as nearby in the NHC list.
                </p>
              </>
            )}
            <span className="ms-wx-card-cta">Open live map →</span>
          </button>
          {extra?.storms && extra.storms.length > 1 ? (
            <ul className="ms-wx-storm-list">
              {extra.storms.slice(1).map((s) => (
                <li key={s.id}>
                  <button type="button" className="ms-wx-storm-pick" onClick={() => openCane(s)}>
                    <span>
                      {s.classificationLabel} {s.name}
                      {s.milesFromVillages != null ? ` · ${s.milesFromVillages} mi` : ""}
                    </span>
                    <span aria-hidden="true">→</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          <p className="panel-hint">
            <a href="https://www.nhc.noaa.gov/" target="_blank" rel="noopener noreferrer">
              National Hurricane Center
            </a>
            {" · "}
            <a
              href="https://www.weather.gov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              weather.gov
            </a>
          </p>
        </article>

        <article className="about-panel ms-wx-card is-ok">
          <p className="ms-wx-kicker">Rain window</p>
          <h4>
            {rain.wet.length
              ? `${rain.wet[0].precipProb}% as soon as ${fmtHour(rain.wet[0].time, tz)}`
              : "Next 6 hours look playable"}
          </h4>
          <p>
            {rain.wet.length
              ? "Maybe swap pickleball for a lanai stretch if you melt in a drizzle."
              : rain.dry.length
                ? "Decent window for golf, pickleball, or a square stroll."
                : "Keep an eye on the hourly strip below."}
          </p>
        </article>

        <article className="about-panel ms-wx-card is-ok">
          <p className="ms-wx-kicker">Air quality</p>
          <h4>
            {extra?.air.usAqi != null ? extra.air.usAqi : "—"}{" "}
            <span>{extra?.air.label || "—"}</span>
          </h4>
          <p>{extra?.air.tip || "Checking the air…"}</p>
          {extra?.air.pm25 != null ? (
            <p className="panel-hint">PM2.5 {extra.air.pm25} µg/m³</p>
          ) : null}
        </article>

        {overnight != null && overnight <= 42 ? (
          <article className="about-panel ms-wx-card is-watch">
            <p className="ms-wx-kicker">Overnight chill</p>
            <h4>Low {overnight}°</h4>
            <p>
              {nwsFreeze[0]?.headline ||
                "Cool for The Villages. Cover tender plants if you’re the neighbor who still has tomatoes."}
            </p>
          </article>
        ) : null}

        {nwsFlood[0] ? (
          <article className="about-panel ms-wx-card is-warn">
            <p className="ms-wx-kicker">Flood</p>
            <h4>{nwsFlood[0].event}</h4>
            <p>{nwsFlood[0].headline}</p>
          </article>
        ) : null}
      </div>

      {mapsReady && mapPin && typeof document !== "undefined"
        ? createPortal(
            <div
              className={stormDesk ? "ms-gym-video-scrim" : "ms-wx-maps-park"}
              role={stormDesk ? "dialog" : undefined}
              aria-modal={stormDesk ? true : undefined}
              aria-hidden={!stormDesk}
              aria-labelledby={stormDesk ? "ms-wx-storm-title" : undefined}
              onClick={() => stormDesk && setStormDesk(false)}
            >
              <div
                className="ms-gym-video-sheet ms-wx-storm-sheet"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="ms-gym-video-bar">
                  <div>
                    <p className="ms-wx-kicker">Live nearby</p>
                    <h3 id="ms-wx-storm-title">Lightning · storms</h3>
                    <p className="panel-hint" style={{ margin: 0 }}>
                      Centered on {here.label}. Volunteer lightning network +
                      radar — not a substitute for NWS warnings.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ms-gym-video-close"
                    onClick={() => setStormDesk(false)}
                  >
                    Close
                  </button>
                </div>
                <div className="ms-wx-map-tabs">
                  <button
                    type="button"
                    className={mapLayer === "lightning" ? "is-on" : ""}
                    onClick={() => setMapLayer("lightning")}
                  >
                    Lightning
                  </button>
                  <button
                    type="button"
                    className={mapLayer === "radar" ? "is-on" : ""}
                    onClick={() => setMapLayer("radar")}
                  >
                    Radar
                  </button>
                </div>
                <div className={`ms-wx-map-frame${mapLayer === "radar" ? " is-radar" : ""}`}>
                  {mapsReady && mapPin ? (
                    <>
                      <iframe
                        title="Live lightning map"
                        className={mapLayer === "lightning" ? "is-show" : "is-hide"}
                        src={`https://map.blitzortung.org/index.php?interactive=1#8/${mapPin.lat.toFixed(3)}/${mapPin.lon.toFixed(3)}`}
                      />
                      <iframe
                        title="Live weather radar"
                        className={mapLayer === "radar" ? "is-show" : "is-hide"}
                        src={windyMap(mapPin.lat, mapPin.lon, 8, "radar")}
                      />
                    </>
                  ) : (
                    <p className="panel-hint" style={{ padding: "1rem" }}>
                      Centering the map…
                    </p>
                  )}
                </div>
                <div className="ms-wx-sheet-rest">
                <h4 className="ms-wx-outage-head">Power outages</h4>
                <p className="panel-hint">
                  The Villages is mostly SECO Energy, with Duke Energy and
                  Withlacoochee River Electric in nearby pockets. Report with
                  the co-op on your bill.
                </p>
                <div className="ms-wx-outage-links">
                  <ExtLink
                    className="btn btn-primary btn-sm"
                    href="https://secoenergy.com/storm-center"
                  >
                    SECO StormCenter · report / map
                  </ExtLink>
                  <ExtLink
                    className="btn btn-ghost btn-sm"
                    href="https://www.duke-energy.com/outages/current-outages"
                  >
                    Duke Energy outages
                  </ExtLink>
                  <ExtLink className="btn btn-ghost btn-sm" href="https://www.wrec.net/outages">
                    WREC outages
                  </ExtLink>
                  <a className="ms-wx-phone" href="tel:3527933801">
                    SECO phone (352) 793-3801
                  </a>
                </div>
                <h4 className="ms-wx-outage-head">Outage news</h4>
                <div className="ms-wx-outage-links">
                  <ExtLink
                    className="btn btn-ghost btn-sm"
                    href="https://www.villages-news.com/?s=power+outage"
                  >
                    Villages-News.com
                  </ExtLink>
                  <ExtLink
                    className="btn btn-ghost btn-sm"
                    href="https://news.google.com/search?q=The+Villages+Florida+power+outage&hl=en-US&gl=US&ceid=US:en"
                  >
                    Google News · local outages
                  </ExtLink>
                </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary ms-gym-video-done"
                  onClick={() => setStormDesk(false)}
                >
                  Done — back to weather
                </button>
              </div>
            </div>,
            document.body
          )
        : null}
      {cane && typeof document !== "undefined"
        ? createPortal(
            <div
              className="ms-gym-video-scrim"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ms-wx-cane-title"
              onClick={() => setCane(null)}
            >
              <div
                className="ms-gym-video-sheet ms-wx-storm-sheet"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="ms-gym-video-bar">
                  <div>
                    <p className="ms-wx-kicker">Hurricane desk</p>
                    <h3 id="ms-wx-cane-title">
                      {cane === "basin"
                        ? "Hurricane activity"
                        : `${cane.classificationLabel} ${cane.name}`}
                    </h3>
                    <p className="panel-hint" style={{ margin: 0 }}>
                      {cane === "basin"
                        ? "Live satellite across the Atlantic. Choose a storm for a closer map."
                        : "Centered on this storm. Satellite shows the clouds over open water. Radar fills in near the U.S. coast."}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ms-gym-video-close"
                    onClick={() => setCane(null)}
                  >
                    Close
                  </button>
                </div>
                <div className="ms-wx-map-tabs is-wrap">
                  <button
                    type="button"
                    className={cane === "basin" ? "is-on" : ""}
                    onClick={() => openCane("basin")}
                  >
                    Atlantic
                  </button>
                  {(extra?.storms || []).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={cane !== "basin" && cane.id === s.id ? "is-on" : ""}
                      onClick={() => openCane(s)}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
                <div className="ms-wx-map-tabs">
                  <button
                    type="button"
                    className={caneLayer === "satellite" ? "is-on" : ""}
                    onClick={() => setCaneLayer("satellite")}
                  >
                    Satellite
                  </button>
                  <button
                    type="button"
                    className={caneLayer === "radar" ? "is-on" : ""}
                    onClick={() => setCaneLayer("radar")}
                  >
                    Radar
                  </button>
                  <button
                    type="button"
                    className={caneLayer === "wind" ? "is-on" : ""}
                    onClick={() => setCaneLayer("wind")}
                  >
                    Wind
                  </button>
                </div>
                {cane !== "basin" ? (
                  <ul className="ms-wx-cane-facts">
                    <li>
                      <strong>Winds</strong>{" "}
                      {cane.windMph != null ? `${cane.windMph} mph` : "not listed"}
                    </li>
                    <li>
                      <strong>Pressure</strong>{" "}
                      {cane.pressureMb != null ? `${cane.pressureMb} mb` : "not listed"}
                    </li>
                    <li>
                      <strong>Distance</strong>{" "}
                      {cane.milesFromVillages != null
                        ? `${cane.milesFromVillages} mi from The Villages`
                        : "not listed"}
                    </li>
                    <li>
                      <strong>Motion</strong> {cane.movement}
                    </li>
                    {cane.latitude != null && cane.longitude != null ? (
                      <li>
                        <strong>Position</strong> {fmtCoord(cane.latitude, cane.longitude)}
                      </li>
                    ) : null}
                  </ul>
                ) : null}
                <div className="ms-wx-map-frame is-radar">
                  <iframe
                    title={
                      cane === "basin"
                        ? "Live Atlantic hurricane map"
                        : `Live map of ${cane.name}`
                    }
                    className="is-show"
                    src={windyMap(
                      caneCenter(cane).lat,
                      caneCenter(cane).lon,
                      caneCenter(cane).zoom,
                      caneLayer
                    )}
                  />
                </div>
                <div className="ms-wx-sheet-rest">
                  <div className="ms-wx-outage-links">
                    {cane !== "basin" && cane.advisoryUrl ? (
                      <ExtLink className="btn btn-primary btn-sm" href={cane.advisoryUrl}>
                        Public advisory
                      </ExtLink>
                    ) : null}
                    {cane !== "basin" && cane.graphicsUrl ? (
                      <ExtLink className="btn btn-ghost btn-sm" href={cane.graphicsUrl}>
                        Track and cone
                      </ExtLink>
                    ) : null}
                    {cane !== "basin" && cane.discussionUrl ? (
                      <ExtLink className="btn btn-ghost btn-sm" href={cane.discussionUrl}>
                        Forecast discussion
                      </ExtLink>
                    ) : null}
                    <ExtLink className="btn btn-ghost btn-sm" href="https://www.nhc.noaa.gov/">
                      National Hurricane Center
                    </ExtLink>
                    {cane === "basin" ? (
                      <ExtLink
                        className="btn btn-ghost btn-sm"
                        href="https://www.nhc.noaa.gov/gtwo.php"
                      >
                        Atlantic outlook
                      </ExtLink>
                    ) : null}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary ms-gym-video-done"
                  onClick={() => setCane(null)}
                >
                  Done — back to weather
                </button>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
