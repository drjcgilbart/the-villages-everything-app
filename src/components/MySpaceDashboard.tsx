"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MySpaceInvestmentsBoard } from "@/components/MySpaceInvestmentsBoard";
import {
  MySpaceCalendarBoard,
  MySpaceHealthLog,
  MySpacePetSchedule,
  MySpaceRoyaltyLounge,
} from "@/components/MySpaceModules";
import {
  MySpaceEntertainmentBoard,
  MySpaceFoodBoard,
  MySpaceGolfLogBoard,
  MySpaceMaintenanceBoard,
  MySpaceMemoriesBoard,
  MySpaceNewsBoard,
  MySpacePickleballLogBoard,
} from "@/components/MySpaceNextBoards";
import { GlassDoorPreview } from "@/components/GlassDoorPreview";
import { MySpaceWeatherBoard } from "@/components/MySpaceWeatherBoard";
import { MySpaceWeatherStrip } from "@/components/MySpaceWeatherStrip";
import { MySpaceFavoritesHub } from "@/components/MySpaceFavoritesHub";
import { MemberBadgesRow } from "@/components/MemberBadgesRow";
import type { PopularClub } from "@/lib/clubs";
import type { BadgeDef } from "@/lib/memberBadgeTypes";
import type { PublicMember } from "@/lib/yardSaleTypes";
import { MySpaceHouseholdPanel } from "@/components/MySpaceHouseholdPanel";
import type { HouseholdClient } from "@/lib/householdTypes";
import {
  HUB_TIERS,
  formatHouseholdSeats,
  formatMembershipPrice,
  type FeatureKey,
  type HubPlanId,
} from "@/lib/membershipTiers";
import { isNativeAppShell } from "@/lib/nativeAppShell";
import {
  PRODUCT_NAMES,
  TIER_SUMMARY,
  boardIsLocked,
  getBoard,
  type BoardId,
} from "@/lib/mySpaceProduct";
import { SAMPLE_HINT } from "@/lib/sampleBoards";
import { RoyaltyTrialOffer } from "@/components/RoyaltyTrialOffer";
import { DeleteAccountPanel } from "@/components/DeleteAccountPanel";

/** Explicit badge art for tier cards (client-safe; always present). */
const TIER_CARD_BADGES: Record<
  HubPlanId,
  { src: string; alt: string }
> = {
  porch_waver: {
    src: "/graphics/badges/porch-waver.jpg",
    alt: "Porch Waver badge",
  },
  cart_path_regular: {
    src: "/graphics/badges/cart-path-regular.jpg",
    alt: "Cart Path Regular badge",
  },
  lanai_legend: {
    src: "/graphics/badges/lanai-legend.jpg",
    alt: "Lanai Legend badge",
  },
  square_royalty: {
    src: "/graphics/badges/square-royalty.jpg",
    alt: "Square Royalty badge",
  },
};

type SpacePayload = {
  member: PublicMember;
  badges?: BadgeDef[];
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
    trialActive?: boolean;
    trialExpiresAt?: string | null;
    trialAvailable?: boolean;
    standingPlan?: HubPlanId;
    standingPlanLabel?: string;
    householdOwnerId?: string | null;
    householdSeats?: number;
    household?: HouseholdClient;
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

type DashTab =
  | "home"
  | "weather"
  | "health"
  | "pets"
  | "food"
  | "entertainment"
  | "maintenance"
  | "investments"
  | "news"
  | "calendar"
  | "memories"
  | "golfLog"
  | "pickleballLog"
  | "favorites"
  | "membership"
  | "lounge"
  | "links";

export function MySpaceDashboard() {
  const [data, setData] = useState<SpacePayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [tab, setTab] = useState<DashTab>("home");
  const [inNativeApp, setInNativeApp] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/members/space", {
        cache: "no-store",
        credentials: "include",
      });
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
    setInNativeApp(isNativeAppShell());
    load();
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    if (params.get("subscribed") === "1" && sessionId) {
      fetch("/api/members/subscribe/confirm", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      })
        .then(() => load())
        .then(() => setNote("Welcome — your membership tier is unlocked."));
    }
    if (params.get("welcome") === "1") {
      setNote("Welcome — your My Space tier is ready.");
    }
    if (params.get("trial") === "1") {
      setNote("Square Royalty is unlocked for one month. Poke every board. Subscribe if you want to keep it.");
    }
    const tabParam = (params.get("tab") || "").toLowerCase();
    if (
      tabParam === "plans" ||
      tabParam === "membership" ||
      tabParam === "tiers" ||
      window.location.hash === "#ms-tiers"
    ) {
      setTab("membership");
    }
    if (params.get("joined") === "household") {
      setNote("You’re on the household. Your boards stay on this login.");
      setTab("membership");
    }
    const householdToken = params.get("household");
    if (householdToken && householdToken.length >= 16) {
      fetch("/api/members/household", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "accept", token: householdToken }),
      })
        .then(async (res) => {
          const j = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(j.error || "Could not join household");
          await load();
          setNote("You’re on the household. Your boards stay on this login.");
          setTab("membership");
        })
        .catch((e) => {
          const msg = e instanceof Error ? e.message : "Could not join household";
          if (/sign in/i.test(msg)) {
            setNote(
              "Sign in — or request a neighbor account with that invite link — then this household can attach to your login."
            );
          } else {
            setNote(msg);
          }
          setTab("membership");
        });
    }
  }, [load]);

  async function startTrial() {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/members/trial", {
        method: "POST",
        credentials: "include",
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "Could not start the free month");
      await load();
      setNote(
        `Square Royalty is on the house until ${
          j.trialExpiresAt
            ? new Date(j.trialExpiresAt).toLocaleDateString()
            : "the end of the month"
        }. Then you keep whatever you subscribe to.`
      );
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Could not start the free month");
    } finally {
      setBusy(false);
    }
  }

  async function startSubscribe(tierId: HubPlanId) {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/members/subscribe", {
        method: "POST",
        credentials: "include",
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
        credentials: "include",
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

  if (error && error !== "signed_out") {
    return (
      <div className="empty-state">
        <p className="pf-form-error">{error}</p>
      </div>
    );
  }

  const visitor = !data;
  const member = data?.member;
  const space = data?.space;
  const f = space?.features;
  const planLabel = space?.planLabel || "Visitor";
  const planRank = visitor ? -1 : space?.planRank ?? 0;
  const approved = member?.status === "approved";
  const showDev =
    process.env.NEXT_PUBLIC_HUB_MEMBER_DEV_UNLOCK === "true";
  const upgradeTiers = data?.upgradeTiers;

  function locked(boardId: BoardId): boolean {
    return boardIsLocked(boardId, { visitor, planRank });
  }

  const sampleHint = (
    <p className="panel-hint ms-sample-hint">{SAMPLE_HINT}</p>
  );

  const glass = (boardId: BoardId) => (
    <GlassDoorPreview
      boardId={boardId}
      visitor={visitor}
      currentLabel={visitor ? undefined : planLabel}
      approved={approved}
      nativeApp={inNativeApp}
      busy={busy}
      onUnlock={startSubscribe}
    />
  );

  const tabs: { id: DashTab; label: string; icon: string; boardId: BoardId }[] =
    [
      { id: "home", label: "Home", icon: "🏠", boardId: "home" },
      { id: "weather", label: getBoard("weather").label, icon: "🌤", boardId: "weather" },
      { id: "health", label: getBoard("health").label, icon: "💚", boardId: "health" },
      { id: "pets", label: getBoard("pets").label, icon: "🐾", boardId: "pets" },
      { id: "food", label: getBoard("food").label, icon: "🍷", boardId: "food" },
      {
        id: "entertainment",
        label: getBoard("entertainment").label,
        icon: "🎭",
        boardId: "entertainment",
      },
      {
        id: "maintenance",
        label: getBoard("maintenance").label,
        icon: "🔧",
        boardId: "maintenance",
      },
      {
        id: "investments",
        label: getBoard("investments").label,
        icon: "📈",
        boardId: "investments",
      },
      { id: "news", label: getBoard("news").label, icon: "📰", boardId: "news" },
      {
        id: "calendar",
        label: getBoard("calendar").label,
        icon: "📅",
        boardId: "calendar",
      },
      {
        id: "memories",
        label: getBoard("memories").label,
        icon: "📷",
        boardId: "memories",
      },
      { id: "golfLog", label: getBoard("golfLog").label, icon: "⛳", boardId: "golfLog" },
      {
        id: "pickleballLog",
        label: getBoard("pickleballLog").label,
        icon: "🏓",
        boardId: "pickleballLog",
      },
      { id: "favorites", label: "Favorites", icon: "⭐", boardId: "favorites" },
      { id: "membership", label: "Plans", icon: "🎟", boardId: "membership" },
      { id: "lounge", label: "Royalty", icon: "👑", boardId: "lounge" },
      { id: "links", label: "Shortcuts", icon: "🔗", boardId: "shortcuts" },
    ];

  const onPlans = tab === "membership";

  return (
    <div className="my-space" id="ms-top">
      {onPlans ? (
        <div className="page-hero page-hero-graphic ms-plans-page-hero">
          <div className="shell ms-plans-hero-stack">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/graphics/mascot-support.jpg"
              alt="Golf-ball mascot looking broke — empty mug, empty wallet"
              width={180}
              height={180}
            />
            <span className="kicker">Membership</span>
            <h1>Plans</h1>
            <p>
              Four rungs: Porch Waver (free, 1 login) → Cart Path Regular ($1,
              2 logins) → Lanai Legend ($2, 3 logins) → Square Royalty ($3, 4
              logins). Each plan keeps everything below it. Extra household
              people get their own password and boards.
              {inNativeApp
                ? " Paid plans are bought on thevillageseverythingapp.com, then you sign in here."
                : ""}
            </p>
            {visitor ? (
              <p className="hero-actions" style={{ marginBottom: 0 }}>
                <Link
                  href={`/yard-sale/login?next=${encodeURIComponent("/my-space?tab=plans")}`}
                  className="btn btn-primary btn-sm"
                >
                  Sign in
                </Link>
                <Link href="/yard-sale/join" className="btn btn-ghost btn-sm">
                  Request membership
                </Link>
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="page-hero page-hero-graphic">
          <div className="shell page-hero-grid">
            <div>
              <span className="kicker">{PRODUCT_NAMES.doorKicker}</span>
              <h1>{PRODUCT_NAMES.doorTitle}</h1>
              <p>
                {PRODUCT_NAMES.doorBlurb} Public Hub pages stay free. Private
                boards unlock by plan.
              </p>
            </div>
            <div className="page-hero-art">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/graphics/mascot-myspace.jpg"
                alt="My Space mascot — golf ball with a house key and a tiny screened lanai"
                width={280}
                height={280}
                className="about-mascot about-mascot-round"
              />
            </div>
          </div>
        </div>
      )}

      <section className="section">
        <div className="shell">
      {onPlans ? null : (
      <div className="about-panel my-space-header">
        <div>
          <span className="kicker">
            {visitor
              ? PRODUCT_NAMES.doorKicker
              : f?.planBadge
                ? "👑 Square Royalty"
                : PRODUCT_NAMES.doorKicker}
          </span>
          {visitor ? (
            <>
              <h2 style={{ margin: "0.35rem 0" }}>
                {PRODUCT_NAMES.doorTitle}
              </h2>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                {PRODUCT_NAMES.doorBlurb}
              </p>
            </>
          ) : (
            <>
              <h2 style={{ margin: "0.35rem 0" }} className="member-name">
                <span className="member-name-text">
                  {space?.spaceTitle ||
                    `${member?.name.split(" ")[0] || "Neighbor"}’s Space`}
                </span>
                <MemberBadgesRow badges={data?.badges || []} />
              </h2>
              <p style={{ margin: 0, color: "var(--muted)" }}>
                <span className="member-name">
                  <span className="member-name-text">{member?.name}</span>
                  <MemberBadgesRow badges={data?.badges || []} />
                </span>
                {member?.village ? ` · ${member.village}` : ""} · Plan:{" "}
                <strong>{planLabel}</strong>
                {space?.household?.role === "member" && space.household.ownerName
                  ? ` (on ${space.household.ownerName}’s household)`
                  : ""}
                {space?.planTagline ? (
                  <span className="ms-plan-tagline"> — {space.planTagline}</span>
                ) : null}
              </p>
            </>
          )}
          <p className="panel-hint" style={{ marginBottom: 0 }}>
            Personalized boards stay on your membership. Public Hub pages
            (Dining, Golf, Calendar of Events, Golf Cart Hero) stay free.
          </p>
          {note && <p className="club-sync-note">{note}</p>}
        </div>
        <div className="hero-actions">
          {visitor ? (
            <>
              <Link
                href="/yard-sale/login?next=/my-space"
                className="btn btn-primary btn-sm"
              >
                Sign in
              </Link>
              <Link href="/yard-sale/join" className="btn btn-ghost btn-sm">
                Request membership
              </Link>
            </>
          ) : (
            <>
              <Link href="/club-zone" className="btn btn-ghost btn-sm">
                Clubs
              </Link>
              <Link href="/wealth#portfolio" className="btn btn-ghost btn-sm">
                Wealth
              </Link>
              <Link href="/yard-sale/dashboard" className="btn btn-ghost btn-sm">
                Yard sale
              </Link>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={async () => {
                  await fetch("/api/members/logout", {
                    method: "POST",
                    credentials: "include",
                  });
                  window.location.href = "/my-space";
                }}
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
      )}

      <nav className="ms-dash-nav" aria-label="My Space dashboard">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`ms-dash-nav-btn ${tab === t.id ? "active" : ""} ${locked(t.boardId) ? "is-locked" : ""}`}
            onClick={() => setTab(t.id)}
            aria-selected={tab === t.id}
          >
            <span className="ms-dash-nav-icon" aria-hidden>
              {t.icon}
            </span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {tab === "home" && (
        <section className="my-space-block">
          <h3 className="my-space-block-title">Your daily hub</h3>
          <p style={{ color: "var(--muted)", marginTop: 0 }}>
            Boards are grouped by membership. Each paid tier keeps everything
            below it. Locked ones show a sample — never another neighbor’s real
            notes.
          </p>
          {locked("weather") ? <MySpaceWeatherStrip /> : null}
          {HUB_TIERS.map((tier) => {
            const group = tabs.filter(
              (t) =>
                t.id !== "home" && getBoard(t.boardId).minRank === tier.rank
            );
            if (group.length === 0) return null;
            const included = !visitor && planRank >= tier.rank;
            const current = !visitor && space?.plan === tier.id;
            return (
              <div key={tier.id} className="ms-hub-group">
                <div className="ms-hub-group-head">
                  <h4 className="ms-hub-group-title">{tier.label}</h4>
                  <span className="ms-hub-group-price">
                    {formatMembershipPrice(tier)} · {formatHouseholdSeats(tier.householdSeats)}
                  </span>
                  <span className="pill">
                    {current ? "Your plan" : included ? "Included" : tier.shortLabel}
                  </span>
                </div>
                <p className="panel-hint ms-hub-group-tagline">{tier.tagline}</p>
                <div className="ms-home-grid">
                  {group.map((t) => {
                    const isLocked = locked(t.boardId);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        className={`about-panel ms-home-card ${isLocked ? "is-locked" : ""}`}
                        onClick={() => setTab(t.id)}
                      >
                        <span aria-hidden className="ms-home-card-icon">
                          {t.icon}
                        </span>
                        <strong>
                          {t.label}
                          {isLocked ? " 🔒" : ""}
                        </strong>
                        <span className="panel-hint">
                          {isLocked
                            ? visitor && getBoard(t.boardId).minRank === 0
                              ? "Sign in to use"
                              : `Unlock with ${tier.label}`
                            : "Open"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          <div style={{ marginTop: "1.25rem" }}>
            <MySpaceFavoritesHub />
          </div>
        </section>
      )}

      {tab === "membership" && (
      <section className="my-space-block" id="ms-tiers">
        <RoyaltyTrialOffer
          signedIn={!visitor}
          approved={approved}
          trialAvailable={!!space?.trialAvailable}
          trialActive={!!space?.trialActive}
          trialExpiresAt={space?.trialExpiresAt || null}
          standingPlanLabel={space?.standingPlanLabel || "Porch Waver"}
          native={inNativeApp}
          busy={busy}
          error={null}
          onStart={() => void startTrial()}
        />
        <div className="ms-tier-grid">
          {HUB_TIERS.map((t) => {
            const current = !visitor && t.id === space?.plan;
            const unlocked = !visitor && planRank >= t.rank;
            const badge = TIER_CARD_BADGES[t.id];
            const badgeSrc = badge?.src || t.badgeImage;
            return (
              <article
                key={t.id}
                className={`about-panel ms-tier-card ${current ? "is-current" : ""} ${unlocked ? "is-unlocked" : ""}`}
              >
                <div className="ms-tier-badge-wrap" aria-hidden={false}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={badgeSrc}
                    alt={badge?.alt || `${t.label} membership badge`}
                    title={`${t.label} — ${t.tagline}`}
                    width={112}
                    height={112}
                    className="ms-tier-badge-img"
                    loading="eager"
                    decoding="async"
                    style={{
                      width: "7rem",
                      height: "7rem",
                      display: "block",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <span className="pill">
                  {current && space?.trialActive && t.id === "square_royalty"
                    ? "Free month"
                    : current
                      ? "Your plan"
                      : unlocked
                        ? "Included"
                        : t.shortLabel}
                </span>
                <h3>{t.label}</h3>
                <p className="ms-tier-price">{formatMembershipPrice(t)}</p>
                <p className="ms-tier-seats">{formatHouseholdSeats(t.householdSeats)}</p>
                <p className="ms-tier-tagline">{t.tagline}</p>
                <p className="ms-tier-blurb">{TIER_SUMMARY[t.id].blurb}</p>
                <p className="panel-hint">{TIER_SUMMARY[t.id].includes}</p>
                {visitor && t.rank === 0 ? (
                  <Link href="/yard-sale/join" className="btn btn-primary btn-sm">
                    Request membership
                  </Link>
                ) : null}
                {t.rank > 0 &&
                  !unlocked &&
                  !visitor &&
                  approved &&
                  !inNativeApp &&
                  space?.household?.role !== "member" && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm hide-in-native-app"
                    disabled={busy}
                    onClick={() => startSubscribe(t.id)}
                  >
                    {busy
                      ? "Starting…"
                      : `Unlock with ${t.label} · ${formatMembershipPrice(t)}`}
                  </button>
                )}
                {t.rank > 0 &&
                  !unlocked &&
                  !visitor &&
                  space?.household?.role === "member" && (
                  <p className="panel-hint" style={{ marginBottom: 0 }}>
                    Ask {space.household.ownerName || "the paying neighbor"} to
                    upgrade — or leave the household to buy your own plan.
                  </p>
                )}
                {t.rank > 0 && !unlocked && !visitor && approved && inNativeApp && (
                  <p className="panel-hint" style={{ marginBottom: 0 }}>
                    Membership isn’t sold in the store app. Subscribe at
                    thevillageseverythingapp.com, then sign in here.
                  </p>
                )}
                {t.rank > 0 && !unlocked && !visitor && !approved && (
                  <p className="pf-form-error" style={{ marginBottom: 0 }}>
                    Account must be approved before upgrading.
                  </p>
                )}
                {t.rank > 0 && visitor ? (
                  <Link
                    href="/yard-sale/login?next=/my-space"
                    className="btn btn-ghost btn-sm"
                  >
                    Sign in to unlock
                  </Link>
                ) : null}
                {showDev && t.rank > 0 && !visitor && (
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
        {!visitor && space?.household ? (
          <div style={{ marginTop: "1.1rem" }}>
            <MySpaceHouseholdPanel
              household={space.household}
              onChanged={load}
              onNote={setNote}
            />
          </div>
        ) : null}
        {!visitor ? (
          <div style={{ marginTop: "1.1rem" }}>
            <DeleteAccountPanel />
          </div>
        ) : null}
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
      )}

      {tab === "favorites" && (
        <section className="my-space-block">
          <MySpaceFavoritesHub />
        </section>
      )}

      {tab === "weather" && (
      <section id="ms-weather" className="my-space-block">
        <h3 className="my-space-block-title">{getBoard("weather").label}</h3>
        {!locked("weather") && f?.weather ? (
          <>
            {sampleHint}
            <MySpaceWeatherBoard />
          </>
        ) : (
          glass("weather")
        )}
      </section>
      )}

      {tab === "investments" && (
      <section id="ms-markets" className="my-space-block">
        <h3 className="my-space-block-title">{getBoard("investments").label}</h3>
        {!locked("investments") && f?.portfolio ? (
          <>
            {sampleHint}
            <MySpaceInvestmentsBoard />
          </>
        ) : (
          glass("investments")
        )}
      </section>
      )}

      {tab === "news" && (
      <section id="ms-news" className="my-space-block">
        <h3 className="my-space-block-title">{getBoard("news").label}</h3>
        {!locked("news") && f?.newsPrefs ? (
          <>
            {sampleHint}
            <MySpaceNewsBoard />
          </>
        ) : (
          glass("news")
        )}
      </section>
      )}

      {tab === "health" && (
      <section id="ms-health" className="my-space-block">
        <h3 className="my-space-block-title">{getBoard("health").label}</h3>
        {!locked("health") && f?.healthLog ? (
          <>
            {sampleHint}
            <MySpaceHealthLog />
          </>
        ) : (
          glass("health")
        )}
      </section>
      )}

      {tab === "pets" && (
      <section id="ms-pets" className="my-space-block">
        <h3 className="my-space-block-title">{getBoard("pets").label}</h3>
        {!locked("pets") && f?.petSchedule ? (
          <>
            {sampleHint}
            <MySpacePetSchedule />
          </>
        ) : (
          glass("pets")
        )}
      </section>
      )}

      {tab === "food" && (
      <section id="ms-food" className="my-space-block">
        <h3 className="my-space-block-title">{getBoard("food").label}</h3>
        {!locked("food") && f?.foodLog ? (
          <>
            {sampleHint}
            <MySpaceFoodBoard />
          </>
        ) : (
          glass("food")
        )}
      </section>
      )}

      {tab === "entertainment" && (
      <section id="ms-entertainment" className="my-space-block">
        <h3 className="my-space-block-title">{getBoard("entertainment").label}</h3>
        {!locked("entertainment") && f?.entertainmentLog ? (
          <>
            {sampleHint}
            <MySpaceEntertainmentBoard />
          </>
        ) : (
          glass("entertainment")
        )}
      </section>
      )}

      {tab === "maintenance" && (
      <section id="ms-maintenance" className="my-space-block">
        <h3 className="my-space-block-title">{getBoard("maintenance").label}</h3>
        {!locked("maintenance") && f?.maintenanceLog ? (
          <>
            {sampleHint}
            <MySpaceMaintenanceBoard />
          </>
        ) : (
          glass("maintenance")
        )}
      </section>
      )}

      {tab === "calendar" && (
      <section id="ms-calendar" className="my-space-block">
        <h3 className="my-space-block-title">{getBoard("calendar").label}</h3>
        {!locked("calendar") && f?.calendarBoard ? (
          <>
            {sampleHint}
            <MySpaceCalendarBoard />
          </>
        ) : (
          glass("calendar")
        )}
      </section>
      )}

      {tab === "memories" && (
      <section id="ms-memories" className="my-space-block">
        <h3 className="my-space-block-title">{getBoard("memories").label}</h3>
        {!locked("memories") && f?.memoriesAlbum ? (
          <>
            {sampleHint}
            <MySpaceMemoriesBoard />
          </>
        ) : (
          glass("memories")
        )}
      </section>
      )}

      {tab === "golfLog" && (
      <section id="ms-golf-log" className="my-space-block">
        <h3 className="my-space-block-title">{getBoard("golfLog").label}</h3>
        {!locked("golfLog") && f?.golfLog ? (
          <>
            {sampleHint}
            <MySpaceGolfLogBoard />
          </>
        ) : (
          glass("golfLog")
        )}
      </section>
      )}

      {tab === "pickleballLog" && (
      <section id="ms-pb-log" className="my-space-block">
        <h3 className="my-space-block-title">{getBoard("pickleballLog").label}</h3>
        {!locked("pickleballLog") && f?.pickleballLog ? (
          <>
            {sampleHint}
            <MySpacePickleballLogBoard />
          </>
        ) : (
          glass("pickleballLog")
        )}
      </section>
      )}

      {tab === "lounge" && (
      <section id="ms-lounge" className="my-space-block">
        <h3 className="my-space-block-title">{getBoard("lounge").label}</h3>
        {!locked("lounge") && f?.exclusiveLounge ? (
          <MySpaceRoyaltyLounge />
        ) : (
          glass("lounge")
        )}
      </section>
      )}

      {tab === "links" && (
      <section id="ms-links" className="my-space-block">
        <h3 className="my-space-block-title">Site shortcuts</h3>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          Jump back to public directories — your saved favorites and tools stay
          on this My Space page.
        </p>
        <div className="my-space-links">
          <Link href="/my-village" className="about-panel my-space-link-card">
            <strong>The Villages</strong>
            <span>100+ village directory</span>
          </Link>
          <Link href="/town-squares" className="about-panel my-space-link-card">
            <strong>Town Squares</strong>
            <span>Bands, shopping, dancing</span>
          </Link>
          <Link href="/rec-centers" className="about-panel my-space-link-card">
            <strong>Rec Centers</strong>
            <span>Pools &amp; complexes</span>
          </Link>
          <Link href="/real-estate" className="about-panel my-space-link-card">
            <strong>Real Estate</strong>
            <span>Homes &amp; market</span>
          </Link>
          <Link href="/calendar" className="about-panel my-space-link-card">
            <strong>Calendar</strong>
            <span>What’s on this week</span>
          </Link>
          <Link href="/news" className="about-panel my-space-link-card">
            <strong>Local News</strong>
            <span>Headlines &amp; desks</span>
          </Link>
          <Link href="/golf-zone" className="about-panel my-space-link-card">
            <strong>Golf</strong>
            <span>Trail fees &amp; maps</span>
          </Link>
          <Link href="/pickleball" className="about-panel my-space-link-card">
            <strong>Pickleball</strong>
            <span>DUPR · find a game · courts</span>
          </Link>
          <Link href="/forums" className="about-panel my-space-link-card">
            <strong>Forums</strong>
            <span>Neighbor chat</span>
          </Link>
          <Link href="/yard-sale" className="about-panel my-space-link-card">
            <strong>Yard Sale</strong>
            <span>Browse · post from dashboard</span>
          </Link>
        </div>
      </section>
      )}

      <p className="mkt-disclaimer">
        Plans:{" "}
        {HUB_TIERS.map((t) => `${t.label} (${formatHouseholdSeats(t.householdSeats)})`).join(" → ")}.
        Extra household members get their own login and boards. Locked boards
        show sample chrome only — never another neighbor’s notes. Membership is
        sold on the website, not in the iPhone/Android store apps. Not
        affiliated with The Villages® operators.
      </p>
        </div>
      </section>
    </div>
  );
}
