"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PICKLEBALL_ART } from "@/lib/pickleballResources";
import { RecCenterMapLinks } from "@/components/RecCenterMapLinks";
import { getRecCenter } from "@/lib/recCenters";
import {
  PICKLEBALL_COURTS,
  pickleballMapsUrl,
  type PickleballCourt,
  type PickleballDuprLeader,
  type PickleballFormat,
  type PickleballLookingPost,
  type PickleballPlayersNeeded,
} from "@/lib/pickleballTypes";

type Feed = {
  duprLeaders: PickleballDuprLeader[];
  looking: PickleballLookingPost[];
  courts?: PickleballCourt[];
};

function fmtDupr(n: number | "") {
  if (n === "" || n == null) return "—";
  return Number(n).toFixed(3);
}

function recKindLabel(
  court: PickleballCourt,
  recType?: string
) {
  if (court.hub) return "Regional hub";
  if (recType === "village") return "Village center";
  if (recType === "neighborhood") return "Neighborhood";
  return "Rec center";
}

function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function PickleballHub() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [formatFilter, setFormatFilter] = useState<PickleballFormat | "all">(
    "all"
  );
  const [courtFilter, setCourtFilter] = useState<"all" | "hub">("all");
  const [courtQuery, setCourtQuery] = useState("");

  const [playerName, setPlayerName] = useState("");
  const [duprDoubles, setDuprDoubles] = useState("");
  const [duprSingles, setDuprSingles] = useState("");
  const [pcvg, setPcvg] = useState("");
  const [ratingCourt, setRatingCourt] = useState("");
  const [ratingNotes, setRatingNotes] = useState("");

  const [orgName, setOrgName] = useState("");
  const [format, setFormat] = useState<PickleballFormat>("doubles");
  const [needed, setNeeded] = useState<PickleballPlayersNeeded>(1);
  const [lookCourt, setLookCourt] = useState("");
  const [whenNote, setWhenNote] = useState("");
  const [lookMessage, setLookMessage] = useState("");
  const [contact, setContact] = useState("");
  const [duprNote, setDuprNote] = useState("");

  const courts = feed?.courts?.length ? feed.courts : PICKLEBALL_COURTS;

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/pickleball", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load");
      setFeed(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filteredLooking = useMemo(() => {
    const list = feed?.looking || [];
    if (formatFilter === "all") return list;
    return list.filter((p) => p.format === formatFilter);
  }, [feed, formatFilter]);

  const filteredCourts = useMemo(() => {
    const q = courtQuery.trim().toLowerCase();
    return courts.filter((c) => {
      if (courtFilter === "hub" && !c.hub) return false;
      if (!q) return true;
      return `${c.name} ${c.address || ""} ${c.note || ""}`
        .toLowerCase()
        .includes(q);
    });
  }, [courts, courtFilter, courtQuery]);

  async function postAction(body: Record<string, unknown>) {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/pickleball", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setNote(data.message || "Saved!");
      await load();
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function submitRating(e: React.FormEvent) {
    e.preventDefault();
    await postAction({
      action: "submit-rating",
      playerName,
      duprDoubles: duprDoubles === "" ? "" : Number(duprDoubles),
      duprSingles: duprSingles === "" ? "" : Number(duprSingles),
      pcvg: pcvg || undefined,
      courtName: ratingCourt || undefined,
      notes: ratingNotes || undefined,
    });
  }

  async function submitLooking(e: React.FormEvent) {
    e.preventDefault();
    await postAction({
      action: "submit-looking",
      organizerName: orgName,
      format,
      playersNeeded: needed,
      courtId: lookCourt || undefined,
      whenNote,
      message: lookMessage,
      contact,
      duprNote: duprNote || undefined,
    });
  }

  if (error && !feed) {
    return <div className="empty-state">{error}</div>;
  }
  if (!feed) {
    return <div className="empty-state">Loading pickleball…</div>;
  }

  return (
    <div className="golf-club">
      {note && <div className="golf-note about-panel">{note}</div>}

      <section className="golf-club-section" id="dupr-board">
        <div className="section-head golf-section-head-art">
          <div className="golf-section-badge" aria-hidden>
            <Image
              src={PICKLEBALL_ART.leaderboard}
              alt=""
              width={72}
              height={72}
              className="golf-section-badge-img"
            />
          </div>
          <div>
            <h2>DUPR leader board</h2>
            <p>
              Neighbor-reported DUPR snapshots. Official scores still go in the
              DUPR app — this board is The Villages book, after admin approval.
            </p>
          </div>
        </div>

        <div className="golf-leader-grid">
          <article className="about-panel golf-leader-card">
            <h3>Doubles first</h3>
            <p className="golf-muted">
              Highest approved doubles rating. Higher DUPR = stronger play.
            </p>
            {feed.duprLeaders.length === 0 ? (
              <p className="golf-muted">
                No ratings yet — submit yours below and we’ll post it after a
                quick check.
              </p>
            ) : (
              <ol className="golf-rank-list">
                {feed.duprLeaders.map((row, i) => (
                  <li key={row.playerName}>
                    <span className="golf-rank-num">{i + 1}</span>
                    <span className="golf-rank-name">{row.playerName}</span>
                    <span className="golf-rank-stat">
                      D {fmtDupr(row.duprDoubles)}
                      <em>
                        {row.duprSingles !== ""
                          ? ` · S ${fmtDupr(row.duprSingles)}`
                          : ""}
                        {row.pcvg ? ` · ${row.pcvg}` : ""}
                      </em>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </article>

          <article className="about-panel golf-leader-card">
            <h3>Submit your DUPR</h3>
            <p className="golf-muted">
              2.000–8.000. This does not replace DUPR.com.
            </p>
            <form className="form-grid" onSubmit={submitRating}>
              <div className="field">
                <label htmlFor="pb-name">Your name</label>
                <input
                  id="pb-name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  required
                  maxLength={60}
                  placeholder="As it appears on DUPR"
                />
              </div>
              <div className="field">
                <label htmlFor="pb-dupr-d">DUPR doubles</label>
                <input
                  id="pb-dupr-d"
                  type="number"
                  inputMode="decimal"
                  min={2}
                  max={8}
                  step="0.001"
                  value={duprDoubles}
                  onChange={(e) => setDuprDoubles(e.target.value)}
                  placeholder="3.750"
                />
              </div>
              <div className="field">
                <label htmlFor="pb-dupr-s">DUPR singles</label>
                <input
                  id="pb-dupr-s"
                  type="number"
                  inputMode="decimal"
                  min={2}
                  max={8}
                  step="0.001"
                  value={duprSingles}
                  onChange={(e) => setDuprSingles(e.target.value)}
                  placeholder="3.500"
                />
              </div>
              <div className="field">
                <label htmlFor="pb-pcvg">PCVG / self rating</label>
                <input
                  id="pb-pcvg"
                  value={pcvg}
                  onChange={(e) => setPcvg(e.target.value)}
                  maxLength={20}
                  placeholder="3.0 rec"
                />
              </div>
              <div className="field">
                <label htmlFor="pb-rating-court">Home rec center</label>
                <select
                  id="pb-rating-court"
                  value={ratingCourt}
                  onChange={(e) => setRatingCourt(e.target.value)}
                >
                  <option value="">Optional</option>
                  {courts.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="pb-rating-notes">Notes</label>
                <input
                  id="pb-rating-notes"
                  value={ratingNotes}
                  onChange={(e) => setRatingNotes(e.target.value)}
                  maxLength={400}
                  placeholder="Updated after TVCPC league"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={busy}
              >
                {busy ? "Saving…" : "Submit for the board"}
              </button>
            </form>
          </article>
        </div>
      </section>

      <section className="golf-club-section" id="find-game">
        <div className="section-head golf-section-head-art">
          <div className="golf-section-badge" aria-hidden>
            <Image
              src={PICKLEBALL_ART.findGame}
              alt=""
              width={72}
              height={72}
              className="golf-section-badge-img"
            />
          </div>
          <div>
            <h2>Find a game</h2>
            <p>
              Need one more paddle for doubles — or a singles opponent? Posts
              go live right away.
            </p>
          </div>
        </div>

        <div className="golf-filter-pills" style={{ marginBottom: "0.75rem" }}>
          {(["all", "doubles", "singles"] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`btn btn-sm ${
                formatFilter === f ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setFormatFilter(f)}
            >
              {f === "all" ? "All" : f === "doubles" ? "Doubles" : "Singles"}
            </button>
          ))}
        </div>

        {filteredLooking.length === 0 ? (
          <p className="golf-muted about-panel">
            Nobody is looking right now — be the first post of the morning.
          </p>
        ) : (
          <ul className="golf-foursome-grid">
            {filteredLooking.map((p) => (
              <li key={p.id} className="about-panel golf-foursome-card">
                <strong>
                  {p.organizerName} needs {p.playersNeeded} more
                </strong>
                <span className="golf-muted">
                  {p.format} · {p.whenNote}
                  {p.courtName ? ` · ${p.courtName}` : ""}
                  {p.duprNote ? ` · ${p.duprNote}` : ""}
                </span>
                <p>{p.message}</p>
                <p className="golf-muted">
                  Contact: {p.contact}
                  {p.createdAt ? ` · posted ${formatWhen(p.createdAt)}` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}

        <article className="about-panel" style={{ marginTop: "1rem" }}>
          <h3>Post that you need players</h3>
          <form className="form-grid" onSubmit={submitLooking}>
            <div className="field">
              <label htmlFor="pb-org">Your name</label>
              <input
                id="pb-org"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                maxLength={60}
              />
            </div>
            <div className="field">
              <label htmlFor="pb-format">Format</label>
              <select
                id="pb-format"
                value={format}
                onChange={(e) =>
                  setFormat(e.target.value as PickleballFormat)
                }
              >
                <option value="doubles">Doubles</option>
                <option value="singles">Singles</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="pb-need">Players needed</label>
              <select
                id="pb-need"
                value={needed}
                onChange={(e) =>
                  setNeeded(Number(e.target.value) as PickleballPlayersNeeded)
                }
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="pb-look-court">Rec center</label>
              <select
                id="pb-look-court"
                value={lookCourt}
                onChange={(e) => setLookCourt(e.target.value)}
              >
                <option value="">Optional</option>
                {courts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="pb-when">When</label>
              <input
                id="pb-when"
                value={whenNote}
                onChange={(e) => setWhenNote(e.target.value)}
                required
                maxLength={120}
                placeholder="Tomorrow 8 a.m. open play"
              />
            </div>
            <div className="field">
              <label htmlFor="pb-dupr-note">DUPR range</label>
              <input
                id="pb-dupr-note"
                value={duprNote}
                onChange={(e) => setDuprNote(e.target.value)}
                maxLength={40}
                placeholder="3.0–3.5 rec"
              />
            </div>
            <div className="field">
              <label htmlFor="pb-msg">Message</label>
              <input
                id="pb-msg"
                value={lookMessage}
                onChange={(e) => setLookMessage(e.target.value)}
                required
                maxLength={500}
                placeholder="Friendly rec doubles — dinkers welcome"
              />
            </div>
            <div className="field">
              <label htmlFor="pb-contact">Contact</label>
              <input
                id="pb-contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                maxLength={120}
                placeholder="Phone, email, or village"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Posting…" : "Post looking for a game"}
            </button>
          </form>
        </article>
      </section>

      <section className="golf-club-section" id="courts">
        <div className="section-head golf-section-head-art">
          <div className="golf-section-badge" aria-hidden>
            <Image
              src={PICKLEBALL_ART.courts}
              alt=""
              width={72}
              height={72}
              className="golf-section-badge-img"
            />
          </div>
          <div>
            <h2>Courts</h2>
            <p>
              Regional hubs (Rohan, Ezell, Olympia, Everglades…) are where open
              play and leagues live. Bring a resident or guest ID.{" "}
              <RecCenterMapLinks />
            </p>
          </div>
        </div>

        <div className="golf-filter-pills" style={{ marginBottom: "0.75rem" }}>
          {(["all", "hub"] as const).map((f) => (
            <button
              key={f}
              type="button"
              className={`btn btn-sm ${
                courtFilter === f ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setCourtFilter(f)}
            >
              {f === "all" ? "All" : "Regional hubs"}
            </button>
          ))}
        </div>
        <div className="field" style={{ maxWidth: 360, marginBottom: "1rem" }}>
          <label htmlFor="pb-court-search">Find a rec center</label>
          <input
            id="pb-court-search"
            type="search"
            value={courtQuery}
            onChange={(e) => setCourtQuery(e.target.value)}
            placeholder="Rohan, Ezell, Olympia…"
          />
        </div>

        <div className="pb-court-grid">
          {filteredCourts.map((c) => {
            const rec = getRecCenter(c.id);
            const official =
              rec?.officialPage ||
              `https://www.thevillages.com/recreation/${c.id}/`;
            const art = rec?.image || "/graphics/theme-rec-centers.jpg";
            const theme = rec?.theme;
            const maps = pickleballMapsUrl({
              ...c,
              address: c.address || rec?.address,
            });
            const phone = c.phone || rec?.phone;
            return (
              <article key={c.id} className="about-panel pb-court-card">
                <a
                  href={official}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pb-court-link"
                >
                  <div className="pb-court-art rc-preview-art">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={art}
                      alt=""
                      width={320}
                      height={320}
                      className="rc-preview-img"
                      decoding="async"
                    />
                  </div>
                  <div className="pb-court-copy">
                    {theme ? (
                      <p className="rc-preview-theme">{theme}</p>
                    ) : null}
                    <h3>{c.name}</h3>
                    <p>
                      {recKindLabel(c, rec?.type)}
                      {c.lighted ? " · lighted" : ""}
                      {c.courts ? ` · ${c.courts} courts` : ""}
                    </p>
                    {c.note ? <p className="golf-muted">{c.note}</p> : rec?.blurb ? (
                      <p className="golf-muted">{rec.blurb}</p>
                    ) : null}
                    <p className="golf-muted">
                      {c.address || rec?.address}
                    </p>
                    <span className="pb-court-official">Official Villages page →</span>
                  </div>
                </a>
                <div className="pb-court-actions">
                  {phone ? (
                    <a className="text-link" href={`tel:${phone.replace(/\D/g, "")}`}>
                      {phone}
                    </a>
                  ) : null}
                  {phone && maps ? " · " : null}
                  {maps ? (
                    <a
                      className="text-link"
                      href={maps}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Map
                    </a>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
