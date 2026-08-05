"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  donationTierForAmount,
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

  const earnedTier =
    amountUsd != null ? donationTierForAmount(amountUsd) : null;

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
      const data = (await res.json()) as {
        url?: string;
        error?: string;
        code?: string;
      };
      if (!res.ok || !data.url) {
        if (data.code === "MEMBER_REQUIRED_FOR_BADGE") {
          throw new Error(
            data.error ||
              "Sign in as a Hub member first so we can attach your tip badge."
          );
        }
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
        {DONATION_PRESETS.map((p) => {
          const isTop = p.badgeId === "golden_loofah";
          return (
            <button
              key={p.id}
              type="button"
              role="listitem"
              className={`donate-preset ${selected === p.id ? "active" : ""} ${isTop ? "donate-preset-loofah" : ""}`}
              onClick={() => setSelected(p.id)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.badgeImage}
                alt=""
                className="donate-preset-badge"
                width={56}
                height={56}
              />
              <strong>${p.amountUsd}</strong>
              <span>{p.label}</span>
              <em>{p.blurb}</em>
            </button>
          );
        })}
        <button
          type="button"
          role="listitem"
          className={`donate-preset ${selected === "custom" ? "active" : ""}`}
          onClick={() => setSelected("custom")}
        >
          <strong>Custom</strong>
          <span>Your amount</span>
          <em>$3+ earns a tip badge</em>
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

      {earnedTier && (
        <div className="donate-loofah-callout about-panel">
          <Image
            src={earnedTier.badgeImage}
            alt={`${earnedTier.label} badge`}
            width={72}
            height={72}
            className="donate-loofah-img"
          />
          <div>
            <strong>{earnedTier.label} badge at this amount</strong>
            <p style={{ margin: "0.25rem 0 0", color: "var(--muted)" }}>
              Sign in as a Hub member so this funny badge shows next to your
              name site-wide.{" "}
              <Link href="/yard-sale/login" className="text-link">
                Member sign-in
              </Link>
              {" · "}
              <Link href="/yard-sale/join" className="text-link">
                Request membership
              </Link>
            </p>
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
            ? earnedTier
              ? `Donate $${amountUsd.toFixed(2)} · claim ${earnedTier.label}`
              : `Donate $${amountUsd.toFixed(2)}`
            : "Donate"}
      </button>

      <p className="donate-secure-note">
        Secure checkout powered by Stripe. Each tip tier has its own badge —
        Cup of Joe ($3), Fancy Latte ($5), Early-Bird Brunch ($10), and Golden
        Loofah ($25). Sign in first so badges attach to your account.
      </p>
    </div>
  );
}
