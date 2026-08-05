"use client";

import { useCallback, useEffect, useState } from "react";
import type { VillagesWeather } from "@/lib/weather";

const POLL_MS = 2 * 60 * 1000; // real-time-ish refresh every 2 minutes

function formatUpdated(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function VillagesWeatherWidget() {
  const [weather, setWeather] = useState<VillagesWeather | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/weather", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Weather unavailable");
      }
      setWeather(data as VillagesWeather);
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
    const onVisible = () => {
      if (document.visibilityState === "visible") load(true);
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  return (
    <div className="wx-bar" aria-live="polite" aria-label="Local weather for The Villages">
      <div className="shell wx-bar-inner">
        {loading && !weather ? (
          <div className="wx-loading">
            <span className="wx-dot" aria-hidden />
            Loading Villages weather…
          </div>
        ) : error && !weather ? (
          <div className="wx-error">
            <span>Weather temporarily unavailable</span>
            <button type="button" className="wx-retry" onClick={() => load(false)}>
              Retry
            </button>
          </div>
        ) : weather ? (
          <>
            <div className="wx-primary">
              <span className="wx-emoji" aria-hidden>
                {weather.emoji}
              </span>
              <div className="wx-primary-text">
                <span className="wx-location">{weather.location}</span>
                <span className="wx-condition">{weather.condition}</span>
              </div>
              <div className="wx-temp-block">
                <span className="wx-temp">{weather.temperatureF}°</span>
                <span className="wx-feels">Feels {weather.feelsLikeF}°</span>
              </div>
            </div>

            <div className="wx-stats" role="list">
              {weather.highF != null && weather.lowF != null && (
                <div className="wx-stat" role="listitem">
                  <span className="wx-stat-label">Today</span>
                  <span className="wx-stat-value">
                    H {weather.highF}° · L {weather.lowF}°
                  </span>
                </div>
              )}
              {weather.rainChancePct != null && (
                <div className="wx-stat" role="listitem">
                  <span className="wx-stat-label">Rain</span>
                  <span className="wx-stat-value">{weather.rainChancePct}%</span>
                </div>
              )}
              <div className="wx-stat" role="listitem">
                <span className="wx-stat-label">Wind</span>
                <span className="wx-stat-value">{weather.windMph} mph</span>
              </div>
              <div className="wx-stat" role="listitem">
                <span className="wx-stat-label">Humidity</span>
                <span className="wx-stat-value">{weather.humidity}%</span>
              </div>
              {weather.uvIndex != null && (
                <div className="wx-stat" role="listitem">
                  <span className="wx-stat-label">UV</span>
                  <span className="wx-stat-value">{weather.uvIndex}</span>
                </div>
              )}
            </div>

            <div className="wx-meta">
              <span className="wx-live" title="Refreshes about every 2 minutes">
                <span className="wx-live-dot" aria-hidden />
                Live
              </span>
              <span className="wx-updated">
                Updated {formatUpdated(weather.updatedAt)} ET
              </span>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
