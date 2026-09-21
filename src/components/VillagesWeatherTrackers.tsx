"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { VillagesForecast } from "@/lib/weather";
import { heatBand, uvBand } from "@/lib/weather";
import type { FloridaWeatherExtra } from "@/lib/weatherFlorida";
import { openExternalUrl } from "@/lib/nativeAppShell";

function stormHours(data: VillagesForecast) {
  return data.hourly.filter((h) => h.weatherCode >= 95).slice(0, 6);
}

function rainWindow(data: VillagesForecast) {
  const next = data.hourly.slice(0, 6);
  const wet = next.filter((h) => (h.precipProb ?? 0) >= 40);
  const dry = next.filter((h) => (h.precipProb ?? 0) < 30);
  return { next, wet, dry };
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
  const [mapLayer, setMapLayer] = useState<"lightning" | "radar">("lightning");
  const [here, setHere] = useState({ lat, lon, label: "The Villages" });

  useEffect(() => {
    setHere({ lat, lon, label: "Saved weather location" });
  }, [lat, lon]);

  useEffect(() => {
    if (!stormDesk) return;
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setHere({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          label: "Your location",
        });
      },
      () => {
        /* keep Villages / saved pin */
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 120000 }
    );
  }, [stormDesk]);

  useEffect(() => {
    if (!stormDesk) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStormDesk(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [stormDesk]);

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
            Tap for a live lightning map, radar, and power-outage links. 30-30
            rule: if thunder follows lightning by 30 seconds or less, get
            inside.
          </p>
        </button>

        <article
          className={`about-panel ms-wx-card ${
            nwsCane.length || (extra?.storms.length ?? 0) ? "is-alert" : "is-ok"
          }`}
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
          {extra?.storms && extra.storms.length > 1 ? (
            <ul className="ms-wx-storm-list">
              {extra.storms.slice(1, 4).map((s) => (
                <li key={s.id}>
                  {s.classificationLabel} {s.name}
                  {s.milesFromVillages != null ? ` · ${s.milesFromVillages} mi` : ""}
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

      {stormDesk && typeof document !== "undefined"
        ? createPortal(
            <div
              className="ms-gym-video-scrim"
              role="dialog"
              aria-modal="true"
              aria-labelledby="ms-wx-storm-title"
              onClick={() => setStormDesk(false)}
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
                <div className="ms-wx-map-frame">
                  {mapLayer === "lightning" ? (
                    <iframe
                      title="Live lightning map"
                      src={`https://map.blitzortung.org/index.php?interactive=1#8/${here.lat.toFixed(3)}/${here.lon.toFixed(3)}`}
                    />
                  ) : (
                    <iframe
                      title="Live weather radar"
                      src={`https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=in&metricTemp=%C2%B0F&metricWind=mph&zoom=8&overlay=radar&product=ecmwf&level=surface&lat=${here.lat.toFixed(3)}&lon=${here.lon.toFixed(3)}&detailLat=${here.lat.toFixed(3)}&detailLon=${here.lon.toFixed(3)}&detail=true&message=true`}
                    />
                  )}
                </div>
                <h4 className="ms-wx-outage-head">Power outages</h4>
                <p className="panel-hint">
                  The Villages is mostly SECO Energy, with Duke Energy and
                  Withlacoochee River Electric in nearby pockets. Report with
                  the co-op on your bill.
                </p>
                <div className="ms-wx-outage-links">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      openExternalUrl("https://secoenergy.com/storm-center")
                    }
                  >
                    SECO StormCenter · report / map
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      openExternalUrl(
                        "https://www.duke-energy.com/outages/current-outages"
                      )
                    }
                  >
                    Duke Energy outages
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      openExternalUrl("https://www.wrec.net/outages")
                    }
                  >
                    WREC outages
                  </button>
                  <a className="ms-wx-phone" href="tel:3527933801">
                    SECO phone (352) 793-3801
                  </a>
                </div>
                <h4 className="ms-wx-outage-head">Outage news</h4>
                <div className="ms-wx-outage-links">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      openExternalUrl(
                        "https://www.villages-news.com/?s=power+outage"
                      )
                    }
                  >
                    Villages-News.com
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      openExternalUrl(
                        "https://news.google.com/search?q=The+Villages+Florida+power+outage&hl=en-US&gl=US&ceid=US:en"
                      )
                    }
                  >
                    Google News · local outages
                  </button>
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
    </div>
  );
}
