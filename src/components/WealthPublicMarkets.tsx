"use client";

import { useEffect, useState } from "react";
import { MarketCharts } from "@/components/MarketCharts";
import { PortfolioTracker } from "@/components/PortfolioTracker";

/**
 * The investments board already shows these indexes with date ranges.
 * Neighbors who have not unlocked that board still get this public copy.
 */
export function WealthPublicMarkets() {
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/members/space", { cache: "no-store", credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        setShow(!data?.space?.features?.portfolio);
      })
      .catch(() => {
        if (!cancelled) setShow(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (show !== true) return null;
  return (
    <>
      <MarketCharts />
      <div data-privacy-block="Investments">
        <PortfolioTracker />
      </div>
    </>
  );
}
