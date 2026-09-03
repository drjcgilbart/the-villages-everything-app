"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AdminBestOfMonthPanel } from "@/components/AdminBestOfMonthPanel";
import { AdminClubsPanel } from "@/components/AdminClubsPanel";
import { AdminDiningPanel } from "@/components/AdminDiningPanel";
import { AdminForumPanel } from "@/components/AdminForumPanel";
import { AdminGolfPanel } from "@/components/AdminGolfPanel";
import { AdminPickleballPanel } from "@/components/AdminPickleballPanel";
import { AdminLocalServicesPanel } from "@/components/AdminLocalServicesPanel";
import { AdminMembersPanel } from "@/components/AdminMembersPanel";
import { AdminPendingPanel } from "@/components/AdminPendingPanel";
import { AdminRealEstatePanel } from "@/components/AdminRealEstatePanel";
import { AdminSafetyPanel } from "@/components/AdminSafetyPanel";
import { AdminSiteGatePanel } from "@/components/AdminSiteGatePanel";
import { AdminYardSalePanel } from "@/components/AdminYardSalePanel";
import type { PendingTab } from "@/lib/pendingApprovals";

type PortalTab =
  | "pending"
  | "members"
  | "yard"
  | "dining"
  | "realestate"
  | "bestof"
  | "golf"
  | "pickleball"
  | "clubs"
  | "localsvc"
  | "forums"
  | "safety"
  | "access";

/**
 * Site-owner Admin Portal — memberships, listings, dining, clubs, golf, site access.
 * Content publishing lives in Creator Studio (/studio).
 */
export function AdminPortal() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<PortalTab>("pending");
  const [pendingTotal, setPendingTotal] = useState(0);
  const [tabCounts, setTabCounts] = useState<Partial<Record<PendingTab, number>>>(
    {}
  );
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
    const loadPending = () =>
      fetch("/api/admin/pending", {
        cache: "no-store",
        credentials: "same-origin",
      })
        .then((r) => r.json())
        .then((data) => {
          if (typeof data.total === "number") setPendingTotal(data.total);
          if (data.counts && typeof data.counts === "object") {
            setTabCounts(data.counts);
          }
        })
        .catch(() => {});

    loadPending();
    const t = setInterval(loadPending, 15_000);
    return () => clearInterval(t);
  }, [authed, tab]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      if (email.trim()) {
        const memberRes = await fetch("/api/members/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        });
        const memberData = await memberRes.json().catch(() => ({}));
        if (memberRes.ok && memberData.isAdmin) {
          window.location.assign("/admin");
          return;
        }
        if (memberRes.ok && !memberData.isAdmin) {
          throw new Error(
            "That Hub login works, but it isn’t the owner account. Sign in with your administrator email."
          );
        }
      }
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
            Sign in with your Hub email and password. Neighbors never see this
            page.
          </p>
          {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}
          <form className="form-grid" onSubmit={login}>
            <div className="field">
              <label htmlFor="portal-email">Email</label>
              <input
                id="portal-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="portal-pass">Password</label>
              <input
                id="portal-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
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
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setTab("pending")}
            >
              All pending
              {pendingTotal > 0 ? ` (${pendingTotal})` : ""}
            </button>
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
            className={tab === "pending" ? "active" : ""}
            onClick={() => setTab("pending")}
          >
            Pending
            {pendingTotal > 0 ? (
              <span className="admin-tab-badge">{pendingTotal}</span>
            ) : null}
          </button>
          <button
            type="button"
            className={tab === "members" ? "active" : ""}
            onClick={() => setTab("members")}
          >
            Members
            {(tabCounts.members || 0) > 0 ? (
              <span className="admin-tab-badge">{tabCounts.members}</span>
            ) : null}
          </button>
          <button
            type="button"
            className={tab === "yard" ? "active" : ""}
            onClick={() => setTab("yard")}
          >
            Yard Sale
            {(tabCounts.yard || 0) > 0 ? (
              <span className="admin-tab-badge">{tabCounts.yard}</span>
            ) : null}
          </button>
          <button
            type="button"
            className={tab === "dining" ? "active" : ""}
            onClick={() => setTab("dining")}
          >
            Dining
            {(tabCounts.dining || 0) > 0 ? (
              <span className="admin-tab-badge">{tabCounts.dining}</span>
            ) : null}
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
            {(tabCounts.bestof || 0) > 0 ? (
              <span className="admin-tab-badge">{tabCounts.bestof}</span>
            ) : null}
          </button>
          <button
            type="button"
            className={tab === "golf" ? "active" : ""}
            onClick={() => setTab("golf")}
          >
            Golf
            {(tabCounts.golf || 0) > 0 ? (
              <span className="admin-tab-badge">{tabCounts.golf}</span>
            ) : null}
          </button>
          <button
            type="button"
            className={tab === "pickleball" ? "active" : ""}
            onClick={() => setTab("pickleball")}
          >
            Pickleball
            {(tabCounts.pickleball || 0) > 0 ? (
              <span className="admin-tab-badge">{tabCounts.pickleball}</span>
            ) : null}
          </button>
          <button
            type="button"
            className={tab === "clubs" ? "active" : ""}
            onClick={() => setTab("clubs")}
          >
            Clubs
            {(tabCounts.clubs || 0) > 0 ? (
              <span className="admin-tab-badge">{tabCounts.clubs}</span>
            ) : null}
          </button>
          <button
            type="button"
            className={tab === "localsvc" ? "active" : ""}
            onClick={() => setTab("localsvc")}
          >
            Local services
            {(tabCounts.localsvc || 0) > 0 ? (
              <span className="admin-tab-badge">{tabCounts.localsvc}</span>
            ) : null}
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
            className={tab === "safety" ? "active" : ""}
            onClick={() => setTab("safety")}
          >
            Safety
          </button>
          <button
            type="button"
            className={tab === "access" ? "active" : ""}
            onClick={() => setTab("access")}
          >
            Site access
          </button>
        </div>

        {tab === "pending" && (
          <AdminPendingPanel onOpenTab={(next) => setTab(next)} />
        )}
        {tab === "members" && <AdminMembersPanel />}
        {tab === "yard" && <AdminYardSalePanel />}
        {tab === "dining" && <AdminDiningPanel />}
        {tab === "realestate" && <AdminRealEstatePanel />}
        {tab === "bestof" && <AdminBestOfMonthPanel />}
        {tab === "golf" && <AdminGolfPanel />}
        {tab === "pickleball" && <AdminPickleballPanel />}
        {tab === "clubs" && <AdminClubsPanel />}
        {tab === "localsvc" && <AdminLocalServicesPanel />}
        {tab === "forums" && <AdminForumPanel />}
        {tab === "safety" && <AdminSafetyPanel />}
        {tab === "access" && <AdminSiteGatePanel />}
      </div>
    </div>
  );
}
