"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminBestOfMonthPanel } from "@/components/AdminBestOfMonthPanel";
import { AdminClubsPanel } from "@/components/AdminClubsPanel";
import { AdminDiningPanel } from "@/components/AdminDiningPanel";
import { AdminForumPanel } from "@/components/AdminForumPanel";
import { AdminGolfPanel } from "@/components/AdminGolfPanel";
import { AdminLocalServicesPanel } from "@/components/AdminLocalServicesPanel";
import { AdminMembersPanel } from "@/components/AdminMembersPanel";
import { AdminRealEstatePanel } from "@/components/AdminRealEstatePanel";
import { AdminSiteGatePanel } from "@/components/AdminSiteGatePanel";
import { AdminYardSalePanel } from "@/components/AdminYardSalePanel";

type PortalTab =
  | "members"
  | "yard"
  | "dining"
  | "realestate"
  | "bestof"
  | "golf"
  | "clubs"
  | "localsvc"
  | "forums"
  | "access";

/**
 * Site-owner Admin Portal — memberships, listings, dining, clubs, golf, site access.
 * Content publishing lives in Creator Studio (/studio).
 */
export function AdminPortal() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<PortalTab>("members");
  const [pendingCount, setPendingCount] = useState(0);
  const [bomPendingCount, setBomPendingCount] = useState(0);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null
  );
  const [busy, setBusy] = useState(false);

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth", { cache: "no-store" });
    const data = await res.json();
    setAuthed(!!data.authenticated);
  }, []);

  useEffect(() => {
    checkAuth().catch(() => setAuthed(false));
  }, [checkAuth]);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/members/admin", { cache: "no-store", credentials: "same-origin" })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.members)) {
          setPendingCount(
            data.members.filter(
              (m: { status?: string }) => m.status === "pending"
            ).length
          );
        }
      })
      .catch(() => {});

    // Public feed exposes pendingCount without listing content — badge the tab
    const loadBomPending = () =>
      fetch("/api/best-of-month/entries", {
        cache: "no-store",
        credentials: "same-origin",
      })
        .then((r) => r.json())
        .then((data) => {
          if (typeof data.pendingCount === "number") {
            setBomPendingCount(data.pendingCount);
          }
        })
        .catch(() => {});

    loadBomPending();
    const t = setInterval(loadBomPending, 15_000);
    return () => clearInterval(t);
  }, [authed, tab]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setAuthed(true);
      setPassword("");
      flash("ok", "Welcome to the Admin Portal");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthed(false);
  }

  if (authed === null) {
    return (
      <div className="admin-shell admin-portal-shell">
        <div className="admin-card">Checking Admin access…</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="admin-shell admin-portal-shell">
        <div className="admin-card admin-portal-login">
          <h1>Sign in</h1>
          <p style={{ color: "var(--muted)", marginTop: 0 }}>
            Owner tools. Visitors do not need this page.
          </p>
          {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}
          <form className="form-grid" onSubmit={login}>
            <div className="field">
              <label htmlFor="portal-pass">Admin password</label>
              <input
                id="portal-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                autoFocus
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-shell admin-portal-shell">
      <div className="admin-card">
        <div className="admin-portal-header">
          <div>
            <span className="kicker">The Villages Everything App · owner tools</span>
            <h1 style={{ margin: "0.25rem 0" }}>Admin Portal</h1>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Memberships, badges, and site moderation — separate from Creator
              Studio.
            </p>
          </div>
          <div className="admin-portal-header-actions">
            <Link href="/studio" className="btn btn-ghost btn-sm">
              Creator Studio
            </Link>
            <Link href="/" className="btn btn-ghost btn-sm">
              View site
            </Link>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={logout}
            >
              Sign out
            </button>
          </div>
        </div>

        {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}

        <div className="admin-tabs admin-portal-tabs">
          <button
            type="button"
            className={tab === "members" ? "active" : ""}
            onClick={() => setTab("members")}
          >
            Members
            {pendingCount > 0 ? (
              <span className="admin-tab-badge">{pendingCount}</span>
            ) : null}
          </button>
          <button
            type="button"
            className={tab === "yard" ? "active" : ""}
            onClick={() => setTab("yard")}
          >
            Yard Sale
          </button>
          <button
            type="button"
            className={tab === "dining" ? "active" : ""}
            onClick={() => setTab("dining")}
          >
            Dining
          </button>
          <button
            type="button"
            className={tab === "realestate" ? "active" : ""}
            onClick={() => setTab("realestate")}
          >
            Real Estate
          </button>
          <button
            type="button"
            className={tab === "bestof" ? "active" : ""}
            onClick={() => setTab("bestof")}
          >
            Best of Month
            {bomPendingCount > 0 ? (
              <span className="admin-tab-badge">{bomPendingCount}</span>
            ) : null}
          </button>
          <button
            type="button"
            className={tab === "golf" ? "active" : ""}
            onClick={() => setTab("golf")}
          >
            Golf
          </button>
          <button
            type="button"
            className={tab === "clubs" ? "active" : ""}
            onClick={() => setTab("clubs")}
          >
            Clubs
          </button>
          <button
            type="button"
            className={tab === "localsvc" ? "active" : ""}
            onClick={() => setTab("localsvc")}
          >
            Local services
          </button>
          <button
            type="button"
            className={tab === "forums" ? "active" : ""}
            onClick={() => setTab("forums")}
          >
            Forums
          </button>
          <button
            type="button"
            className={tab === "access" ? "active" : ""}
            onClick={() => setTab("access")}
          >
            Site access
          </button>
        </div>

        {tab === "members" && <AdminMembersPanel />}
        {tab === "yard" && <AdminYardSalePanel />}
        {tab === "dining" && <AdminDiningPanel />}
        {tab === "realestate" && <AdminRealEstatePanel />}
        {tab === "bestof" && <AdminBestOfMonthPanel />}
        {tab === "golf" && <AdminGolfPanel />}
        {tab === "clubs" && <AdminClubsPanel />}
        {tab === "localsvc" && <AdminLocalServicesPanel />}
        {tab === "forums" && <AdminForumPanel />}
        {tab === "access" && <AdminSiteGatePanel />}
      </div>
    </div>
  );
}
