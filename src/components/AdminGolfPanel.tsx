"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  GolfAce,
  GolfFoursomePost,
  GolfRound,
} from "@/lib/golfClubTypes";

type AdminPayload = {
  rounds: GolfRound[];
  foursomes: GolfFoursomePost[];
  aces: GolfAce[];
};

export function AdminGolfPanel() {
  const [data, setData] = useState<AdminPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [tab, setTab] = useState<"rounds" | "aces" | "foursomes">("rounds");
  const [editingAceId, setEditingAceId] = useState<string | null>(null);
  const [aceDraft, setAceDraft] = useState({
    playerName: "",
    course: "",
    hole: "",
    playDate: "",
    clubUsed: "",
    story: "",
  });
  const [aceEditPhoto, setAceEditPhoto] = useState<File | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/golf/admin", { cache: "no-store" });
    const json = await res.json();
    if (res.ok) {
      setData({
        rounds: json.rounds || [],
        foursomes: json.foursomes || [],
        aces: json.aces || [],
      });
    }
  }, []);

  useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  async function act(
    kind: string,
    action: string,
    id: string,
    extra?: Record<string, unknown>
  ) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/golf/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, action, id, ...extra }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed");
      setMsg(
        action === "delete"
          ? "Hole-in-one deleted"
          : action === "update"
            ? "Hole-in-one saved"
            : `${kind} ${action}d`
      );
      if (action === "delete" || action === "update") {
        setEditingAceId(null);
        setAceEditPhoto(null);
      }
      await load();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  function startEditAce(a: GolfAce) {
    setEditingAceId(a.id);
    setAceEditPhoto(null);
    setAceDraft({
      playerName: a.playerName,
      course: a.course,
      hole: String(a.hole),
      playDate: a.playDate,
      clubUsed: a.clubUsed || "",
      story: a.story || "",
    });
  }

  async function saveAceEdit(a: GolfAce) {
    let photoUrl: string | null | undefined = undefined;
    if (aceEditPhoto) {
      const form = new FormData();
      form.append("file", aceEditPhoto);
      const up = await fetch("/api/golf/upload", { method: "POST", body: form });
      const upJson = await up.json();
      if (!up.ok) throw new Error(upJson.error || "Photo upload failed");
      photoUrl = upJson.url;
    }
    await act("ace", "update", a.id, {
      playerName: aceDraft.playerName,
      course: aceDraft.course,
      hole: Number(aceDraft.hole),
      playDate: aceDraft.playDate,
      clubUsed: aceDraft.clubUsed,
      story: aceDraft.story,
      ...(photoUrl ? { photoUrl } : {}),
    });
  }

  if (!data) {
    return <div className="empty-state">Loading golf moderation…</div>;
  }

  const pendingRounds = data.rounds.filter((r) => r.status === "pending");
  const pendingAces = data.aces.filter((a) => a.status === "pending");
  const openFoursomes = data.foursomes.filter((f) => f.status === "open");

  return (
    <div>
      <p style={{ color: "var(--muted)", marginTop: 0 }}>
        Approve rounds for the leaderboard, celebrate holes-in-one, and moderate
        foursome meetup posts.
      </p>
      {msg && <div className="msg msg-ok">{msg}</div>}

      <div className="hero-actions" style={{ marginBottom: "1rem" }}>
        <button
          type="button"
          className={`btn btn-sm ${tab === "rounds" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTab("rounds")}
        >
          Rounds ({pendingRounds.length} pending)
        </button>
        <button
          type="button"
          className={`btn btn-sm ${tab === "aces" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTab("aces")}
        >
          Aces ({pendingAces.length} pending)
        </button>
        <button
          type="button"
          className={`btn btn-sm ${tab === "foursomes" ? "btn-primary" : "btn-ghost"}`}
          onClick={() => setTab("foursomes")}
        >
          Foursomes ({openFoursomes.length} open)
        </button>
      </div>

      {tab === "rounds" && (
        <div className="admin-list">
          {data.rounds.length === 0 ? (
            <div className="empty-state">No rounds yet.</div>
          ) : (
            data.rounds.map((r) => (
              <article key={r.id} className="about-panel admin-list-item">
                <div className="card-meta">
                  <span className="pill">{r.status}</span>
                  <span className="pill">
                    {r.holes}h · {r.score}
                  </span>
                  {r.handicap !== null && (
                    <span className="pill">HCP {r.handicap}</span>
                  )}
                </div>
                <h3 style={{ margin: "0.4rem 0" }}>
                  {r.playerName} — {r.course}
                </h3>
                <p style={{ margin: "0 0 0.65rem", color: "var(--muted)" }}>
                  {r.playDate}
                  {r.playTime ? ` ${r.playTime}` : ""}
                  {r.notes ? ` — ${r.notes}` : ""}
                </p>
                <div className="hero-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={busy || r.status === "approved"}
                    onClick={() => act("round", "approve", r.id)}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={busy || r.status === "rejected"}
                    onClick={() => act("round", "reject", r.id)}
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {tab === "aces" && (
        <div className="admin-list">
          {data.aces.length === 0 ? (
            <div className="empty-state">No holes-in-one yet.</div>
          ) : (
            data.aces.map((a) => (
              <article key={a.id} className="about-panel admin-list-item">
                <div className="card-meta">
                  <span className="pill">{a.status}</span>
                  <span className="pill">
                    Hole {a.hole} · {a.course}
                  </span>
                </div>
                {a.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.photoUrl}
                    alt=""
                    className="golf-ace-photo"
                    style={{ marginTop: "0.5rem", maxHeight: 180 }}
                  />
                ) : null}
                <h3 style={{ margin: "0.4rem 0" }}>{a.playerName}</h3>
                {editingAceId === a.id ? (
                  <div className="form-grid" style={{ marginBottom: "0.75rem" }}>
                    <div className="form-row">
                      <div className="field">
                        <label>Player name</label>
                        <input
                          value={aceDraft.playerName}
                          onChange={(e) =>
                            setAceDraft((d) => ({
                              ...d,
                              playerName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Course</label>
                        <input
                          value={aceDraft.course}
                          onChange={(e) =>
                            setAceDraft((d) => ({
                              ...d,
                              course: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="field">
                        <label>Hole</label>
                        <input
                          type="number"
                          min={1}
                          max={18}
                          value={aceDraft.hole}
                          onChange={(e) =>
                            setAceDraft((d) => ({ ...d, hole: e.target.value }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Date</label>
                        <input
                          type="date"
                          value={aceDraft.playDate}
                          onChange={(e) =>
                            setAceDraft((d) => ({
                              ...d,
                              playDate: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="field">
                        <label>Club used</label>
                        <input
                          value={aceDraft.clubUsed}
                          onChange={(e) =>
                            setAceDraft((d) => ({
                              ...d,
                              clubUsed: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label>Story</label>
                      <textarea
                        rows={2}
                        value={aceDraft.story}
                        onChange={(e) =>
                          setAceDraft((d) => ({ ...d, story: e.target.value }))
                        }
                      />
                    </div>
                    <div className="field">
                      <label>Replace photo</label>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                        onChange={(e) =>
                          setAceEditPhoto(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                    {a.photoUrl ? (
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={busy}
                        onClick={() =>
                          act("ace", "update", a.id, { photoUrl: "" })
                        }
                      >
                        Remove photo
                      </button>
                    ) : null}
                    <div className="hero-actions">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={busy}
                        onClick={() => {
                          saveAceEdit(a).catch((e) =>
                            setMsg(
                              e instanceof Error ? e.message : "Could not save"
                            )
                          );
                        }}
                      >
                        Save changes
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={busy}
                        onClick={() => setEditingAceId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: "0 0 0.65rem", color: "var(--muted)" }}>
                    {a.playDate}
                    {a.clubUsed ? ` · ${a.clubUsed}` : ""}
                    {a.story ? ` — ${a.story}` : ""}
                  </p>
                )}
                <div className="hero-actions">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={busy || a.status === "approved"}
                    onClick={() => act("ace", "approve", a.id)}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={busy || a.status === "rejected"}
                    onClick={() => act("ace", "reject", a.id)}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={busy}
                    onClick={() => startEditAce(a)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={busy}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete this hole-in-one for ${a.playerName}? This cannot be undone.`
                        )
                      ) {
                        act("ace", "delete", a.id);
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}

      {tab === "foursomes" && (
        <div className="admin-list">
          {data.foursomes.length === 0 ? (
            <div className="empty-state">No foursome posts yet.</div>
          ) : (
            data.foursomes.map((f) => (
              <article key={f.id} className="about-panel admin-list-item">
                <div className="card-meta">
                  <span className="pill">{f.status}</span>
                  <span className="pill">{f.section}</span>
                  <span className="pill">needs {f.playersNeeded}</span>
                </div>
                <h3 style={{ margin: "0.4rem 0" }}>{f.organizerName}</h3>
                <p style={{ margin: "0 0 0.35rem" }}>{f.message}</p>
                <p style={{ margin: "0 0 0.65rem", color: "var(--muted)" }}>
                  {f.whenNote}
                  {f.course ? ` · ${f.course}` : ""} · {f.contact}
                </p>
                <div className="hero-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={busy || f.status === "open"}
                    onClick={() => act("foursome", "open", f.id)}
                  >
                    Reopen
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    disabled={busy || f.status === "filled"}
                    onClick={() => act("foursome", "filled", f.id)}
                  >
                    Mark filled
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    disabled={busy || f.status === "hidden"}
                    onClick={() => act("foursome", "hidden", f.id)}
                  >
                    Hide
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}
