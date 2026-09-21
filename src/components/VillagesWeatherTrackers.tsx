"use client";

import { useEffect, useState } from "react";
import type { VillagesForecast } from "@/lib/weather";
import { heatBand, uvBand } from "@/lib/weather";
import type { FloridaWeatherExtra } from "@/lib/weatherFlorida";

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

        <article
          className={`about-panel ms-wx-card ${
            nwsStorms.length || storms.length ? "is-warn" : "is-ok"
          }`}
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
        </article>

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
    </div>
  );
}
