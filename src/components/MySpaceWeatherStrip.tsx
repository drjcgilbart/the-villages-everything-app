"use client";

import { useEffect, useState } from "react";
import type { VillagesForecast } from "@/lib/weather";

/**
 * One-line Villages condition for Porch Wavers / visitors.
 * Full hourly + 7-day board stays behind Cart Path Regular.
 */
export function MySpaceWeatherStrip() {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/weather/forecast", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: VillagesForecast | null) => {
        if (cancelled || data == null || typeof data.temperatureF !== "number") {
          return;
        }
        const emoji = data.emoji || "🌤";
        const label = data.condition || "Villages weather";
        setText(`${emoji} ${data.location || "The Villages"} · ${Math.round(data.temperatureF)}° · ${label}`);
      })
      .catch(() => {
        /* strip is optional */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!text) return null;

  return (
    <p className="ms-weather-strip" role="status">
      {text}
      <span className="panel-hint"> Full forecast unlocks with Cart Path Regular.</span>
    </p>
  );
}
