"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { VillagesWeatherWidget } from "@/components/VillagesWeatherWidget";
import { PortfolioTracker } from "@/components/PortfolioTracker";
import {
  MySpaceCalendarBoard,
  MySpaceHealthLog,
  MySpacePetSchedule,
  MySpaceRoyaltyLounge,
} from "@/components/MySpaceModules";
import type { PopularClub } from "@/lib/clubs";
import type { PublicMember } from "@/lib/yardSaleTypes";
import {
  FEATURE_META,
  HUB_TIERS,
  type FeatureKey,
  type HubPlanId,
  tierRequiredFor,
} from "@/lib/membershipTiers";

type SpacePayload = {
  member: PublicMember;
  space: {
    plan: HubPlanId;
    planLabel: string;
    planTagline: string;
    planRank: number;
    favoriteClubIds: string[];
    spaceTitle?: string;
    hasSpaceAccess: boolean;
    isSubscriber: boolean;
    features: Record<FeatureKey, boolean>;
    tier: {
      id: HubPlanId;
      label: string;
      shortLabel: string;
      tagline: string;
      blurb: string;
    };
  };
  favoriteClubs: PopularClub[];
  upgradeTiers: {
    id: HubPlanId;
    label: string;
    tagline: string;
    blurb: string;
  }[];
};

function LockedTeaser({
  feature,
  currentLabel,
}: {
  feature: FeatureKey;
  currentLabel: string;
}) {
  const meta = FEATURE_META[feature];
  const need = tierRequiredFor(feature);
  return (
    <div className="about-panel ms-locked">
      <span className="pill">Locked · {need.label}+</span>
      <h3 style={{ margin: "0.5rem 0 0.35rem" }}>{meta.title}</h3>
      <p style={{ margin: 0, color: "var(--muted)" }}>{meta.teaser}</p>
      <p className="panel-hint" style={{ marginBottom: 0 }}>
        You’re on <strong>{currentLabel}</strong>. Upgrade to{" "}
        <strong>{need.label}</strong> (or higher) to unlock — or ask Studio to
        set your plan while testing.
      </p>
    </div>
  );
}

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
        .then(() => setNote("Welcome — your membership tier is unlocked."));
    }
    if (params.get("welcome") === "1") {
      setNote("Welcome — your My Space tier is ready.");
    }
  }, [load]);

  async function startSubscribe(tierId: HubPlanId) {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/members/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Checkout failed");
      if (j.url) window.location.href = j.url;
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setBusy(false);
    }
  }

  async function devUnlock(tierId: HubPlanId) {
    setBusy(true);
    try {
      const res = await fetch("/api/members/space", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ devUnlock: true, plan: tierId }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Unlock failed");
      await load();
      setNote(`Dev unlock applied — you are now ${j.space?.planLabel || tierId}.`);
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
          My Space is your private Villages dashboard — weather, clubs, health
          lanai, pet parade, and more, unlocked by membership tier. Same account
          as Yard Sale.
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

  const { member, space, favoriteClubs, upgradeTiers } = data;
  const f = space.features;
  const planLabel = space.planLabel;
  const showDev =
    process.env.NEXT_PUBLIC_HUB_MEMBER_DEV_UNLOCK === "true";

  return (
    <div className="my-space" id="ms-top">
      <div className="about-panel my-space-header">
        <div>
          <span className="kicker">
            {f.planBadge ? "👑 Square Royalty" : "Members only"}
          </span>
          <h2 style={{ margin: "0.35rem 0" }}>
            {space.spaceTitle || `${member.name.split(" ")[0]}’s Space`}
          </h2>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            {member.email}
            {member.village ? ` · ${member.village}` : ""} · Plan:{" "}
            <strong>{planLabel}</strong>
            {space.planTagline ? (
              <span className="ms-plan-tagline"> — {space.planTagline}</span>
            ) : null}
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

      {/* Tier ladder + upgrade */}
      <section className="my-space-block" id="ms-tiers">
        <h3 className="my-space-block-title">Membership tiers</h3>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          Climb the ladder from porch waves to square royalty. Each tier keeps
          everything below it.
        </p>
        <div className="ms-tier-grid">
          {HUB_TIERS.map((t) => {
            const current = t.id === space.plan;
            const unlocked = space.planRank >= t.rank;
            return (
              <article
                key={t.id}
                className={`about-panel ms-tier-card ${current ? "is-current" : ""} ${unlocked ? "is-unlocked" : ""}`}
              >
                <span className="pill">
                  {current ? "Your plan" : unlocked ? "Included" : t.shortLabel}
                </span>
                <h3>{t.label}</h3>
                <p className="ms-tier-tagline">{t.tagline}</p>
                <p className="ms-tier-blurb">{t.blurb}</p>
                {t.rank > 0 && !unlocked && member.status === "approved" && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={busy}
                    onClick={() => startSubscribe(t.id)}
                  >
                    {busy ? "Starting…" : `Become ${t.label}`}
                  </button>
                )}
                {t.rank > 0 && !unlocked && member.status !== "approved" && (
                  <p className="pf-form-error" style={{ marginBottom: 0 }}>
                    Account must be approved before upgrading.
                  </p>
                )}
                {showDev && t.rank > 0 && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={busy}
                    onClick={() => devUnlock(t.id)}
                  >
                    Dev → {t.shortLabel}
                  </button>
                )}
              </article>
            );
          })}
        </div>
        {upgradeTiers?.length === 0 && (
          <p className="mkt-disclaimer">
            Paid checkout uses Stripe price env vars (
            <code>STRIPE_MEMBER_PRICE_ID</code> or{" "}
            <code>STRIPE_PRICE_HUB</code> / <code>STRIPE_PRICE_PLUS</code> /{" "}
            <code>STRIPE_PRICE_PATRON</code>). Studio can set any plan for
            testing.
          </p>
        )}
      </section>

      <nav className="my-space-nav" aria-label="My Space sections">
        <a href="#ms-weather">Weather</a>
        <a href="#ms-clubs">Clubs</a>
        <a href="#ms-markets">Investments</a>
        <a href="#ms-health">Health</a>
        <a href="#ms-pets">Pets</a>
        <a href="#ms-calendar">Calendar</a>
        <a href="#ms-lounge">Royalty</a>
        <a href="#ms-links">Shortcuts</a>
      </nav>

      <section id="ms-weather" className="my-space-block">
        <h3 className="my-space-block-title">Villages weather</h3>
        {f.weather ? (
          <div className="my-space-weather-wrap">
            <VillagesWeatherWidget />
          </div>
        ) : (
          <LockedTeaser feature="weather" currentLabel={planLabel} />
        )}
      </section>

      <section id="ms-clubs" className="my-space-block">
        <div className="section-head" style={{ marginBottom: "0.75rem" }}>
          <div>
            <h3 className="my-space-block-title" style={{ margin: 0 }}>
              My favorite clubs
            </h3>
            <p style={{ margin: "0.25rem 0 0", color: "var(--muted)" }}>
              Star clubs on the Clubs page — they land here on Cart Path Regular+.
            </p>
          </div>
          <Link href="/club-zone" className="btn btn-ghost btn-sm">
            Edit favorites
          </Link>
        </div>
        {f.favoriteClubs ? (
          favoriteClubs.length === 0 ? (
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
                  <div className="club-card-art">
                    <Image
                      src={c.image}
                      alt=""
                      width={640}
                      height={640}
                      className="club-card-img"
                    />
                  </div>
                  <div className="club-card-body">
                    <span className="pill">{c.category}</span>
                    <h3>{c.name}</h3>
                    <p className="club-card-blurb">{c.blurb}</p>
                    <p className="club-card-meta">
                      <strong>Where:</strong> {c.areaHint}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )
        ) : (
          <LockedTeaser feature="favoriteClubs" currentLabel={planLabel} />
        )}
      </section>

      <section id="ms-markets" className="my-space-block">
        <h3 className="my-space-block-title">Investments</h3>
        {f.portfolio ? (
          <>
            <p style={{ color: "var(--muted)", marginTop: 0 }}>
              Your stock &amp; ETF board (saved on this browser). Same tool as
              the Wealth page — kept here for dashboard vibes.
            </p>
            <PortfolioTracker />
          </>
        ) : (
          <LockedTeaser feature="portfolio" currentLabel={planLabel} />
        )}
      </section>

      <section id="ms-health" className="my-space-block">
        <h3 className="my-space-block-title">Health lanai</h3>
        {f.healthLog ? (
          <MySpaceHealthLog />
        ) : (
          <LockedTeaser feature="healthLog" currentLabel={planLabel} />
        )}
      </section>

      <section id="ms-pets" className="my-space-block">
        <h3 className="my-space-block-title">Pet parade</h3>
        {f.petSchedule ? (
          <MySpacePetSchedule />
        ) : (
          <LockedTeaser feature="petSchedule" currentLabel={planLabel} />
        )}
      </section>

      <section id="ms-calendar" className="my-space-block">
        <h3 className="my-space-block-title">My calendar board</h3>
        {f.calendarBoard ? (
          <MySpaceCalendarBoard />
        ) : (
          <LockedTeaser feature="calendarBoard" currentLabel={planLabel} />
        )}
      </section>

      <section id="ms-lounge" className="my-space-block">
        <h3 className="my-space-block-title">Royalty lounge</h3>
        {f.exclusiveLounge ? (
          <MySpaceRoyaltyLounge />
        ) : (
          <LockedTeaser feature="exclusiveLounge" currentLabel={planLabel} />
        )}
      </section>

      <section id="ms-links" className="my-space-block">
        <h3 className="my-space-block-title">Hub shortcuts</h3>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          Open to every Porch Waver and above — no cart registration required.
        </p>
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
            <strong>Health hub</strong>
            <span>Site wellness topics</span>
          </Link>
          <Link href="/golf-zone" className="about-panel my-space-link-card">
            <strong>Golf</strong>
            <span>Trail fees &amp; maps</span>
          </Link>
          <Link href="/rec-centers" className="about-panel my-space-link-card">
            <strong>Rec Centers</strong>
            <span>Pools &amp; complexes</span>
          </Link>
          <Link href="/forums" className="about-panel my-space-link-card">
            <strong>Forums</strong>
            <span>Neighbor chat</span>
          </Link>
        </div>
      </section>

      <p className="mkt-disclaimer">
        Tiers:{" "}
        {HUB_TIERS.map((t) => t.label).join(" → ")}. Paid upgrades need Stripe
        price IDs; Studio can set plan for beta testing. Not affiliated with The
        Villages® operators.
      </p>
    </div>
  );
}
