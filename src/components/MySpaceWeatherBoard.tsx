"use client";

import { useCallback, useEffect, useState } from "react";
import type { VillagesForecast } from "@/lib/weather";
import { windDirLabel } from "@/lib/weather";

const POLL_MS = 5 * 60 * 1000;

function fmtTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

function fmtHour(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
    }).format(new Date(iso));
  } catch {
    return "—";
  }
}

function fmtDay(iso: string, index: number): string {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      weekday: "long",
    }).format(new Date(iso));
  } catch {
    return iso.slice(0, 10);
  }
}

/**
 * Full Villages weather dashboard ported from the desktop weather-app:
 * current conditions, metrics, next 24 hours, 7-day forecast.
 */
export function MySpaceWeatherBoard() {
  const [data, setData] = useState<VillagesForecast | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/weather/forecast", { cache: "no-store" });
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
    load(false);
    const id = window.setInterval(() => load(true), POLL_MS);
    return () => window.clearInterval(id);
  }, [load]);

  if (loading && !data) {
    return <p className="panel-hint">Loading Villages weather…</p>;
  }
  if (error && !data) {
    return (
      <div className="about-panel">
        <p className="pf-form-error">{error}</p>
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => load(false)}>
          Retry
        </button>
      </div>
    );
  }
  if (!data) return null;

  const metrics = [
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
  ];

  return (
    <div className="ms-dash-weather">
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
              {data.location} · ZIP {data.zip} · Open-Meteo · auto every 5 min
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
              <strong>{fmtTime(data.sunrise)}</strong>
            </div>
            <div>
              <span className="panel-hint">Sunset</span>
              <strong>{fmtTime(data.sunset)}</strong>
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => load(false)}>
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
              <span className="ms-wx-hour-time">{fmtHour(h.time)}</span>
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
              <span className="ms-wx-day-name">{fmtDay(d.date, i)}</span>
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
    </div>
  );
}
