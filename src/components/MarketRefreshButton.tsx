"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MarketRefreshButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  async function refresh() {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/real-estate/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "manual" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Refresh failed");
      setNote("Market snapshot refreshed.");
      router.refresh();
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Refresh failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="market-refresh">
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={refresh}
        disabled={busy}
      >
        {busy ? "Refreshing…" : "Refresh market now"}
      </button>
      {note && <span className="market-refresh-note">{note}</span>}
    </div>
  );
}
