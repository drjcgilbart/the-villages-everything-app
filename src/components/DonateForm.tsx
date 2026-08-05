"use client";

import { useMemo, useState } from "react";
import {
  DONATION_MAX_USD,
  DONATION_MIN_USD,
  DONATION_PRESETS,
  parseDonationAmount,
} from "@/lib/donations";

export function DonateForm({
  paymentLink,
  stripeReady,
}: {
  paymentLink: string | null;
  stripeReady: boolean;
}) {
  const [selected, setSelected] = useState<string>(DONATION_PRESETS[0].id);
  const [custom, setCustom] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountUsd = useMemo(() => {
    if (selected === "custom") return parseDonationAmount(custom);
    const preset = DONATION_PRESETS.find((p) => p.id === selected);
    return preset ? preset.amountUsd : null;
  }, [selected, custom]);

  async function checkout() {
    setError(null);

    if (!stripeReady) {
      if (paymentLink) {
        window.location.href = paymentLink;
        return;
      }
      setError(
        "Donations aren’t wired up yet. Add Stripe keys in .env.local (see README)."
      );
      return;
    }

    if (amountUsd == null) {
      setError(`Pick a preset or enter $${DONATION_MIN_USD}–$${DONATION_MAX_USD}.`);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/donate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountUsd }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setBusy(false);
    }
  }

  return (
    <div className="donate-form">
      <div className="donate-presets" role="list">
        {DONATION_PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            role="listitem"
            className={`donate-preset ${selected === p.id ? "active" : ""}`}
            onClick={() => setSelected(p.id)}
          >
            <strong>${p.amountUsd}</strong>
            <span>{p.label}</span>
            <em>{p.blurb}</em>
          </button>
        ))}
        <button
          type="button"
          role="listitem"
          className={`donate-preset ${selected === "custom" ? "active" : ""}`}
          onClick={() => setSelected("custom")}
        >
          <strong>Custom</strong>
          <span>Your amount</span>
          <em>You choose</em>
        </button>
      </div>

      {selected === "custom" && (
        <div className="field donate-custom-field">
          <label htmlFor="donate-custom">Amount (USD)</label>
          <div className="donate-custom-input">
            <span>$</span>
            <input
              id="donate-custom"
              type="number"
              min={DONATION_MIN_USD}
              max={DONATION_MAX_USD}
              step="0.01"
              placeholder="5.00"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
          </div>
        </div>
      )}

      {error && <div className="msg msg-err">{error}</div>}

      <button
        type="button"
        className="btn btn-primary donate-submit"
        disabled={busy}
        onClick={checkout}
      >
        {busy
          ? "Opening checkout…"
          : amountUsd != null
            ? `Donate $${amountUsd.toFixed(2)}`
            : "Donate"}
      </button>

      <p className="donate-secure-note">
        Secure checkout powered by Stripe. Tips go toward hosting, tools, coffee,
        and keeping this reboot online.
      </p>
    </div>
  );
}
