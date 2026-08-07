"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  GolfAce,
  GolfCourseLeader,
  GolfFoursomePost,
  GolfFoursomeSection,
  GolfHandicapLeader,
  GolfHoles,
  GolfPlayersNeeded,
  GolfRound,
} from "@/lib/golfClubTypes";
import { FOURSOME_SECTIONS, GOLF_COURSES } from "@/lib/golfClubTypes";

type Feed = {
  handicapLeaders: GolfHandicapLeader[];
  courseLeaders: GolfCourseLeader[];
  recentRounds: GolfRound[];
  foursomes: GolfFoursomePost[];
  aces: GolfAce[];
  courses?: string[];
  sections?: typeof FOURSOME_SECTIONS;
};

function formatDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function GolfClubHub() {
  const [feed, setFeed] = useState<Feed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [foursomeFilter, setFoursomeFilter] = useState<
    GolfFoursomeSection | "all"
  >("all");
  const [courseBoardFilter, setCourseBoardFilter] = useState<GolfHoles | "all">(
    "all"
  );

  // Round form
  const [playerName, setPlayerName] = useState("");
  const [handicap, setHandicap] = useState("");
  const [roundCourse, setRoundCourse] = useState<string>(GOLF_COURSES[0]);
  const [playDate, setPlayDate] = useState("");
  const [playTime, setPlayTime] = useState("");
  const [holes, setHoles] = useState<GolfHoles>(9);
  const [score, setScore] = useState("");
  const [roundNotes, setRoundNotes] = useState("");

  // Foursome form
  const [orgName, setOrgName] = useState("");
  const [section, setSection] = useState<GolfFoursomeSection>("mixed");
  const [needed, setNeeded] = useState<GolfPlayersNeeded>(1);
  const [fsCourse, setFsCourse] = useState("");
  const [whenNote, setWhenNote] = useState("");
  const [fsMessage, setFsMessage] = useState("");
  const [contact, setContact] = useState("");

  // Ace form
  const [aceName, setAceName] = useState("");
  const [aceCourse, setAceCourse] = useState<string>(GOLF_COURSES[0]);
  const [aceHole, setAceHole] = useState("1");
  const [aceDate, setAceDate] = useState("");
  const [aceClub, setAceClub] = useState("");
  const [aceStory, setAceStory] = useState("");

  const courses = feed?.courses?.length ? feed.courses : [...GOLF_COURSES];

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/golf", { cache: "no-store" });
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

  const filteredFoursomes = useMemo(() => {
    const list = feed?.foursomes || [];
    if (foursomeFilter === "all") return list;
    return list.filter((f) => f.section === foursomeFilter);
  }, [feed, foursomeFilter]);

  const filteredCourseLeaders = useMemo(() => {
    const list = feed?.courseLeaders || [];
    if (courseBoardFilter === "all") return list;
    return list.filter((c) => c.holes === courseBoardFilter);
  }, [feed, courseBoardFilter]);

  async function postAction(body: Record<string, unknown>, okMsg?: string) {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/golf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setNote(okMsg || data.message || "Saved!");
      await load();
      return true;
    } catch (e) {
      setNote(e instanceof Error ? e.message : "Failed");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function onSubmitRound(e: React.FormEvent) {
    e.preventDefault();
    const ok = await postAction({
      action: "submit-round",
      playerName,
      handicap: handicap === "" ? null : Number(handicap),
      course: roundCourse,
      playDate,
      playTime: playTime || undefined,
      holes,
      score: Number(score),
      notes: roundNotes || undefined,
    });
    if (ok) {
      setScore("");
      setRoundNotes("");
      setPlayTime("");
    }
  }

  async function onSubmitFoursome(e: React.FormEvent) {
    e.preventDefault();
    const ok = await postAction({
      action: "submit-foursome",
      organizerName: orgName,
      section,
      playersNeeded: needed,
      course: fsCourse || undefined,
      whenNote,
      message: fsMessage,
      contact,
    });
    if (ok) {
      setWhenNote("");
      setFsMessage("");
      setContact("");
      setFsCourse("");
    }
  }

  async function onSubmitAce(e: React.FormEvent) {
    e.preventDefault();
    const ok = await postAction({
      action: "submit-ace",
      playerName: aceName,
      course: aceCourse,
      hole: Number(aceHole),
      playDate: aceDate,
      clubUsed: aceClub || undefined,
      story: aceStory || undefined,
    });
    if (ok) {
      setAceStory("");
      setAceClub("");
      setAceHole("1");
    }
  }

  if (error && !feed) {
    return <div className="empty-state">{error}</div>;
  }
  if (!feed) {
    return <div className="empty-state">Loading The Villages Leader Board…</div>;
  }

  return (
    <div className="golf-club">
      {note && <div className="golf-note about-panel">{note}</div>}

      {/* —— Leaderboard —— */}
      <section className="golf-club-section" id="leaderboard">
        <div className="section-head">
          <div>
            <h2>The Villages Leader Board</h2>
            <p>
              Neighbor-reported handicaps and best scores by course. Upload a
              round below — after admin approval it ranks here.
            </p>
          </div>
        </div>

        <div className="golf-leader-grid">
          <article className="about-panel golf-leader-card">
            <h3>Best handicaps</h3>
            <p className="golf-muted">
              Lowest reported handicap index from approved rounds.
            </p>
            {feed.handicapLeaders.length === 0 ? (
              <p className="golf-muted">
                No handicaps yet — be the first approved board member.
              </p>
            ) : (
              <ol className="golf-rank-list">
                {feed.handicapLeaders.map((row, i) => (
                  <li key={row.playerName}>
                    <span className="golf-rank-num">{i + 1}</span>
                    <span className="golf-rank-name">{row.playerName}</span>
                    <span className="golf-rank-stat">
                      {row.handicap.toFixed(1)}
                      <em>
                        {" "}
                        · {row.roundsCount} round
                        {row.roundsCount === 1 ? "" : "s"}
                      </em>
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </article>

          <article className="about-panel golf-leader-card">
            <div className="golf-leader-head">
              <div>
                <h3>Best games by course</h3>
                <p className="golf-muted">
                  Lowest approved gross score per course (9 &amp; 18 separate).
                </p>
              </div>
              <div className="golf-filter-pills">
                {(["all", 9, 18] as const).map((h) => (
                  <button
                    key={String(h)}
                    type="button"
                    className={`btn btn-sm ${
                      courseBoardFilter === h ? "btn-primary" : "btn-ghost"
                    }`}
                    onClick={() => setCourseBoardFilter(h)}
                  >
                    {h === "all" ? "All" : `${h} holes`}
                  </button>
                ))}
              </div>
            </div>
            {filteredCourseLeaders.length === 0 ? (
              <p className="golf-muted">No course records yet.</p>
            ) : (
              <div className="golf-table-wrap">
                <table className="golf-table">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Holes</th>
                      <th>Player</th>
                      <th>Score</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCourseLeaders.map((row) => (
                      <tr key={row.roundId}>
                        <td>{row.course}</td>
                        <td>{row.holes}</td>
                        <td>{row.playerName}</td>
                        <td>
                          <strong>{row.score}</strong>
                        </td>
                        <td>{formatDate(row.playDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </div>

        {feed.recentRounds.length > 0 && (
          <div className="about-panel golf-recent-rounds">
            <h3 style={{ marginTop: 0 }}>Recently approved rounds</h3>
            <ul className="golf-round-chips">
              {feed.recentRounds.slice(0, 12).map((r) => (
                <li key={r.id}>
                  <strong>{r.playerName}</strong>
                  <span>
                    {r.score} · {r.holes}h · {r.course}
                  </span>
                  <em>{formatDate(r.playDate)}</em>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* —— Upload round —— */}
      <section className="golf-club-section" id="upload-round">
        <div className="section-head">
          <div>
            <h2>Upload a best game</h2>
            <p>
              Course, date, time, score, and optional handicap. Entries need a
              quick admin OK before they hit the leaderboard.
            </p>
          </div>
        </div>
        <form className="form-grid about-panel" onSubmit={onSubmitRound}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="gc-player">Your name</label>
              <input
                id="gc-player"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                required
                maxLength={60}
                placeholder="Name on the leaderboard"
              />
            </div>
            <div className="field">
              <label htmlFor="gc-hcp">Handicap index (optional)</label>
              <input
                id="gc-hcp"
                type="number"
                step="0.1"
                min={-10}
                max={54}
                value={handicap}
                onChange={(e) => setHandicap(e.target.value)}
                placeholder="e.g. 18.2"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="gc-course">Course</label>
              <select
                id="gc-course"
                value={roundCourse}
                onChange={(e) => setRoundCourse(e.target.value)}
              >
                {courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="gc-holes">Holes</label>
              <select
                id="gc-holes"
                value={holes}
                onChange={(e) => setHoles(Number(e.target.value) as GolfHoles)}
              >
                <option value={9}>9 holes</option>
                <option value={18}>18 holes</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="gc-date">Date</label>
              <input
                id="gc-date"
                type="date"
                value={playDate}
                onChange={(e) => setPlayDate(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="gc-time">Tee time (optional)</label>
              <input
                id="gc-time"
                type="time"
                value={playTime}
                onChange={(e) => setPlayTime(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="gc-score">Gross score</label>
              <input
                id="gc-score"
                type="number"
                min={18}
                max={200}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
                placeholder="Total strokes"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="gc-notes">Notes (optional)</label>
            <textarea
              id="gc-notes"
              rows={2}
              maxLength={400}
              value={roundNotes}
              onChange={(e) => setRoundNotes(e.target.value)}
              placeholder="Wind, cart-path only, personal best…"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Sending…" : "Submit round for approval"}
          </button>
        </form>
      </section>

      {/* —— Foursome meetup —— */}
      <section className="golf-club-section" id="foursome">
        <div className="section-head">
          <div>
            <h2>Find a foursome</h2>
            <p>
              Need 1, 2, or 3 more players? Post in Men, Women, or Mixed and
              connect with neighbors ready to tee it up.
            </p>
          </div>
        </div>

        <div className="golf-filter-pills" style={{ marginBottom: "0.85rem" }}>
          {(
            [
              ["all", "All"],
              ["men", "Men"],
              ["women", "Women"],
              ["mixed", "Mixed"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`btn btn-sm ${
                foursomeFilter === id ? "btn-primary" : "btn-ghost"
              }`}
              onClick={() => setFoursomeFilter(id)}
            >
              {label}
              {id !== "all" && (
                <span className="golf-pill-count">
                  {
                    (feed.foursomes || []).filter((f) => f.section === id)
                      .length
                  }
                </span>
              )}
            </button>
          ))}
        </div>

        {filteredFoursomes.length === 0 ? (
          <div className="empty-state about-panel">
            No open posts in this section yet — be the first to look for a
            group.
          </div>
        ) : (
          <div className="golf-foursome-grid">
            {filteredFoursomes.map((f) => {
              const meta = FOURSOME_SECTIONS.find((s) => s.id === f.section);
              return (
                <article key={f.id} className="about-panel golf-foursome-card">
                  <div className="golf-foursome-top">
                    <span className={`pill golf-section-${f.section}`}>
                      {meta?.label || f.section}
                    </span>
                    <span className="pill bom-pill-open">
                      Needs {f.playersNeeded}
                    </span>
                  </div>
                  <h3>{f.organizerName}</h3>
                  <p className="golf-foursome-msg">{f.message}</p>
                  <ul className="golf-foursome-meta">
                    <li>
                      <strong>When:</strong> {f.whenNote}
                    </li>
                    {f.course ? (
                      <li>
                        <strong>Course:</strong> {f.course}
                      </li>
                    ) : (
                      <li>
                        <strong>Course:</strong> Flexible
                      </li>
                    )}
                    <li>
                      <strong>Contact:</strong> {f.contact}
                    </li>
                  </ul>
                </article>
              );
            })}
          </div>
        )}

        <form
          className="form-grid about-panel"
          style={{ marginTop: "1rem" }}
          onSubmit={onSubmitFoursome}
        >
          <h3 style={{ margin: "0 0 0.25rem" }}>Post a meetup</h3>
          <p className="golf-muted" style={{ marginTop: 0 }}>
            Posts go live immediately. Keep contact info you&apos;re comfortable
            sharing with neighbors.
          </p>
          <div className="form-row">
            <div className="field">
              <label htmlFor="fs-name">Your name</label>
              <input
                id="fs-name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
                maxLength={60}
              />
            </div>
            <div className="field">
              <label htmlFor="fs-section">Section</label>
              <select
                id="fs-section"
                value={section}
                onChange={(e) =>
                  setSection(e.target.value as GolfFoursomeSection)
                }
              >
                {FOURSOME_SECTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="fs-need">Players needed</label>
              <select
                id="fs-need"
                value={needed}
                onChange={(e) =>
                  setNeeded(Number(e.target.value) as GolfPlayersNeeded)
                }
              >
                <option value={1}>1 more (make 2 total with you)</option>
                <option value={2}>2 more</option>
                <option value={3}>3 more (full foursome)</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="fs-when">Preferred day / time</label>
              <input
                id="fs-when"
                value={whenNote}
                onChange={(e) => setWhenNote(e.target.value)}
                required
                maxLength={120}
                placeholder="Tue mornings · next Thu 8:30a · this weekend"
              />
            </div>
            <div className="field">
              <label htmlFor="fs-course">Course (optional)</label>
              <select
                id="fs-course"
                value={fsCourse}
                onChange={(e) => setFsCourse(e.target.value)}
              >
                <option value="">Any / flexible</option>
                {courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="field">
            <label htmlFor="fs-msg">Message</label>
            <textarea
              id="fs-msg"
              rows={2}
              maxLength={500}
              value={fsMessage}
              onChange={(e) => setFsMessage(e.target.value)}
              required
              placeholder="Pace of play, cart or walk, social vs competitive…"
            />
          </div>
          <div className="field">
            <label htmlFor="fs-contact">Contact</label>
            <input
              id="fs-contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              maxLength={120}
              placeholder="Phone, email, or “text John in Edenfield”"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Posting…" : "Post looking for players"}
          </button>
        </form>
      </section>

      {/* —— Holes in one —— */}
      <section className="golf-club-section" id="aces">
        <div className="section-head">
          <div>
            <h2>Holes in One</h2>
            <p>
              Ring the bell — share your ace. After approval it lands on the Ace
              Wall with a proper Villages congratulations.
            </p>
          </div>
        </div>

        <div className="about-panel golf-ace-banner">
          <div className="golf-ace-banner-emoji" aria-hidden="true">
            ⛳
          </div>
          <div>
            <strong>Congratulations, ace heroes!</strong>
            <p>
              A hole-in-one in The Villages is part skill, part luck, and part
              perfect Florida light. We celebrate every one — drinks on the
              porch energy, forever.
            </p>
          </div>
        </div>

        {feed.aces.length === 0 ? (
          <div className="empty-state about-panel">
            No aces on the wall yet. Make history — and upload it.
          </div>
        ) : (
          <div className="golf-ace-grid">
            {feed.aces.map((a) => (
              <article key={a.id} className="about-panel golf-ace-card">
                <span className="pill golf-ace-pill">Hole-in-one</span>
                <h3>{a.playerName}</h3>
                <p className="golf-ace-congrats">
                  Congratulations, {a.playerName.split(" ")[0]}! An ace on hole{" "}
                  {a.hole} at {a.course}
                  {a.clubUsed ? ` with the ${a.clubUsed}` : ""} — pure Villages
                  magic.
                </p>
                <p className="golf-muted">
                  {formatDate(a.playDate)}
                  {a.clubUsed ? ` · ${a.clubUsed}` : ""}
                </p>
                {a.story ? <p className="golf-ace-story">{a.story}</p> : null}
              </article>
            ))}
          </div>
        )}

        <form
          className="form-grid about-panel"
          style={{ marginTop: "1rem" }}
          onSubmit={onSubmitAce}
        >
          <h3 style={{ margin: "0 0 0.25rem" }}>Report a hole-in-one</h3>
          <p className="golf-muted" style={{ marginTop: 0 }}>
            Admin-approved before it goes public — keep the bragging honest.
          </p>
          <div className="form-row">
            <div className="field">
              <label htmlFor="ace-name">Player name</label>
              <input
                id="ace-name"
                value={aceName}
                onChange={(e) => setAceName(e.target.value)}
                required
                maxLength={60}
              />
            </div>
            <div className="field">
              <label htmlFor="ace-course">Course</label>
              <select
                id="ace-course"
                value={aceCourse}
                onChange={(e) => setAceCourse(e.target.value)}
              >
                {courses.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="ace-hole">Hole #</label>
              <input
                id="ace-hole"
                type="number"
                min={1}
                max={18}
                value={aceHole}
                onChange={(e) => setAceHole(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="ace-date">Date</label>
              <input
                id="ace-date"
                type="date"
                value={aceDate}
                onChange={(e) => setAceDate(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="ace-club">Club used (optional)</label>
              <input
                id="ace-club"
                value={aceClub}
                onChange={(e) => setAceClub(e.target.value)}
                maxLength={40}
                placeholder="7-iron, hybrid…"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="ace-story">Story (optional)</label>
            <textarea
              id="ace-story"
              rows={2}
              maxLength={500}
              value={aceStory}
              onChange={(e) => setAceStory(e.target.value)}
              placeholder="Witnesses, bounce, pure strike, cart dance…"
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Sending…" : "Submit hole-in-one"}
          </button>
        </form>
      </section>
    </div>
  );
}
