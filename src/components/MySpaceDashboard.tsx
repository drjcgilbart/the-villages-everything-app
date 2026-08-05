"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { VillagesWeatherWidget } from "@/components/VillagesWeatherWidget";
import { PortfolioTracker } from "@/components/PortfolioTracker";
import type { PopularClub } from "@/lib/clubs";
import type { PublicMember } from "@/lib/yardSaleTypes";

type SpacePayload = {
  member: PublicMember;
  space: {
    plan: string;
    favoriteClubIds: string[];
    spaceTitle?: string;
    hasSpaceAccess: boolean;
    isSubscriber: boolean;
  };
  favoriteClubs: PopularClub[];
};

export function MySpaceDashboard() {
  const [data, setData] = useState<SpacePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/members/space", { cache: "no-store" });
      if (res.status === 401) {
        setData(null);
        setError("signed_out");
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Could not load space");
      }
      const j = (await res.json()) as SpacePayload;
      setData(j);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (params.get("subscribed") === "1" && sessionId) {
      fetch("/api/members/subscribe/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then(() => load())
        .then(() => setNote("Welcome — your Hub Member space is unlocked."));
    }
    if (params.get("welcome") === "1") {
      setNote("Welcome — your Hub Member space is ready.");
    }
  }, [load]);

  async function startSubscribe() {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/members/subscribe", { method: "POST" });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Checkout failed");
      if (j.url) window.location.href = j.url;
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  async function devUnlock() {
    setBusy(true);
    try {
      const res = await fetch("/api/members/space", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ devUnlock: true }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Unlock failed");
      await load();
      setNote("Dev unlock applied — you are a subscriber.");
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Unlock failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="empty-state">Loading your space…</div>;
  }

  if (error === "signed_out" || !data) {
    return (
      <div className="about-panel my-space-gate">
        <h2 style={{ marginTop: 0 }}>Sign in to open My Space</h2>
        <p>
          Hub Member space is your private dashboard — weather, favorite clubs,
          markets, and quick links — inspired by the Villages daily dashboard
          app. Use the same membership account as Yard Sale (approved
          residents).
        </p>
        <div className="hero-actions">
          <Link href="/yard-sale/login" className="btn btn-primary">
            Sign in
          </Link>
          <Link href="/yard-sale/join" className="btn btn-ghost">
            Request membership
          </Link>
          <Link href="/club-zone" className="btn btn-ghost">
            Browse clubs
          </Link>
        </div>
      </div>
    );
  }

  const { member, space, favoriteClubs } = data;
  const locked = !space.hasSpaceAccess;

  return (
    <div className="my-space">
      <div className="about-panel my-space-header">
        <div>
          <span className="kicker">Members only</span>
          <h2 style={{ margin: "0.35rem 0" }}>
            {space.spaceTitle || `${member.name.split(" ")[0]}’s Space`}
          </h2>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            {member.email}
            {member.village ? ` · ${member.village}` : ""} · Plan:{" "}
            <strong>{space.isSubscriber ? "Hub Member" : "Free"}</strong>
          </p>
          {note && <p className="club-sync-note">{note}</p>}
        </div>
        <div className="hero-actions">
          <Link href="/club-zone" className="btn btn-ghost btn-sm">
            Clubs
          </Link>
          <Link href="/wealth#portfolio" className="btn btn-ghost btn-sm">
            Wealth
          </Link>
          <Link href="/yard-sale/dashboard" className="btn btn-ghost btn-sm">
            Yard sale
          </Link>
        </div>
      </div>

      {locked ? (
        <div className="about-panel my-space-upgrade">
          <h3 style={{ marginTop: 0 }}>Unlock your private dashboard</h3>
          <p>
            Hub Member includes a personal space with live Villages weather,
            your starred clubs, investment board, and shortcuts — similar to the
            standalone weather-app dashboard, nested inside this site for paying
            members.
          </p>
          <ul className="ts-tips-list">
            <li>Live local weather (same feed as the homepage bar)</li>
            <li>Favorite clubs synced from the Clubs page</li>
            <li>Stock &amp; ETF tracker with total portfolio</li>
            <li>Quick links to calendar, rec centers, news, and more</li>
          </ul>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={busy || member.status !== "approved"}
              onClick={startSubscribe}
            >
              {busy ? "Starting…" : "Become a Hub Member"}
            </button>
            {process.env.NEXT_PUBLIC_HUB_MEMBER_DEV_UNLOCK === "true" && (
              <button
                type="button"
                className="btn btn-ghost"
                disabled={busy}
                onClick={devUnlock}
              >
                Dev unlock
              </button>
            )}
          </div>
          {member.status !== "approved" && (
            <p className="pf-form-error">
              Your membership is {member.status}. An admin must approve you
              before you can subscribe.
            </p>
          )}
          <p className="mkt-disclaimer">
            Configure <code>STRIPE_MEMBER_PRICE_ID</code> or{" "}
            <code>NEXT_PUBLIC_MEMBER_PAYMENT_LINK</code> for paid checkout. Set{" "}
            <code>HUB_MEMBER_DEV_UNLOCK=true</code> (and{" "}
            <code>NEXT_PUBLIC_HUB_MEMBER_DEV_UNLOCK=true</code>) for local
            testing without Stripe.
          </p>
        </div>
      ) : (
        <>
          <nav className="my-space-nav" aria-label="My Space sections">
            <a href="#ms-weather">Weather</a>
            <a href="#ms-clubs">Clubs</a>
            <a href="#ms-markets">Investments</a>
            <a href="#ms-links">Shortcuts</a>
          </nav>

          <section id="ms-weather" className="my-space-block">
            <h3 className="my-space-block-title">Villages weather</h3>
            <div className="my-space-weather-wrap">
              <VillagesWeatherWidget />
            </div>
          </section>

          <section id="ms-clubs" className="my-space-block">
            <div className="section-head" style={{ marginBottom: "0.75rem" }}>
              <div>
                <h3 className="my-space-block-title" style={{ margin: 0 }}>
                  My favorite clubs
                </h3>
                <p style={{ margin: "0.25rem 0 0", color: "var(--muted)" }}>
                  Star clubs on the Clubs page — they land here on your account.
                </p>
              </div>
              <Link href="/club-zone" className="btn btn-ghost btn-sm">
                Edit favorites
              </Link>
            </div>
            {favoriteClubs.length === 0 ? (
              <div className="empty-state">
                No favorites yet.{" "}
                <Link href="/club-zone" className="text-link">
                  Browse clubs and star a few →
                </Link>
              </div>
            ) : (
              <div className="club-grid">
                {favoriteClubs.map((c) => (
                  <article key={c.id} className="about-panel club-card is-fav">
                    <span className="pill">{c.category}</span>
                    <h3>{c.name}</h3>
                    <p className="club-card-blurb">{c.blurb}</p>
                    <p className="club-card-meta">
                      <strong>Where:</strong> {c.areaHint}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section id="ms-markets" className="my-space-block">
            <h3 className="my-space-block-title">Investments</h3>
            <p style={{ color: "var(--muted)", marginTop: 0 }}>
              Your stock &amp; ETF board (saved on this browser). Same tool as
              the Wealth page — kept here for a dashboard feel.
            </p>
            <PortfolioTracker />
          </section>

          <section id="ms-links" className="my-space-block">
            <h3 className="my-space-block-title">Hub shortcuts</h3>
            <div className="my-space-links">
              <Link href="/news" className="about-panel my-space-link-card">
                <strong>Local News</strong>
                <span>Headlines &amp; desks</span>
              </Link>
              <Link href="/calendar" className="about-panel my-space-link-card">
                <strong>Calendar</strong>
                <span>What’s on this week</span>
              </Link>
              <Link href="/health" className="about-panel my-space-link-card">
                <strong>Health</strong>
                <span>Steps, habits, wellness</span>
              </Link>
              <Link href="/golf-zone" className="about-panel my-space-link-card">
                <strong>Golf</strong>
                <span>Trail fees &amp; maps</span>
              </Link>
              <Link
                href="/rec-centers"
                className="about-panel my-space-link-card"
              >
                <strong>Rec Centers</strong>
                <span>Pools &amp; complexes</span>
              </Link>
              <Link href="/forums" className="about-panel my-space-link-card">
                <strong>Forums</strong>
                <span>Neighbor chat</span>
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
