"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  GOLF_COURSES,
  GOLF_HUB,
  golfTrailPageUrl,
  type GolfCourse,
} from "@/lib/entertainmentCatalog";
import { GolfScorecardButton } from "@/components/GolfScorecardButton";
import {
  emptyBoards,
  type GolfLogBoard,
  type GolfLookingNote,
  type GolfPlayerCard,
} from "@/lib/memberBoardModel";
import { useMemberBoard } from "@/components/useMemberBoard";
import { MySpaceGolfPractice } from "@/components/MySpaceGolfPractice";

const KINDS = [
  { id: "all", label: "All" },
  { id: "championship", label: "Championship" },
  { id: "executive", label: "Executive" },
  { id: "pitch-putt", label: "Pitch & putt" },
  { id: "putting", label: "Putting" },
  { id: "practice", label: "Practice" },
  { id: "fav", label: "Favorites" },
] as const;

const NEED_OPTS = [
  "1 more (twosome or fill a foursome)",
  "2 more",
  "3 more (I have a tee time)",
  "Looking for a group",
];

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}
function today() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}
function mapsUrl(q: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q + ", The Villages FL")}`;
}
function telHref(phone?: string) {
  const d = String(phone || "").replace(/[^\d+]/g, "");
  return d ? `tel:${d}` : "";
}
function kindLabel(kind: string) {
  if (kind === "championship") return "Championship";
  if (kind === "executive") return "Executive";
  if (kind === "pitch-putt") return "Pitch & putt";
  if (kind === "putting") return "Putting";
  if (kind === "practice") return "Practice";
  return kind;
}
function defaultPar(kind: string, holes: 9 | 18) {
  if (kind === "championship") {
    const nine = [4, 3, 4, 5, 4, 4, 3, 4, 5];
    return holes === 18 ? [...nine, ...nine] : nine;
  }
  return Array(holes).fill(3) as number[];
}
function grossOf(scores: (number | "")[]) {
  return scores.reduce<number>((s, n) => s + (typeof n === "number" ? n : 0), 0);
}
function netOf(gross: number, hdcp: string, holes: number) {
  const h = Number(hdcp);
  if (!Number.isFinite(h) || !h) return null;
  return gross - Math.round((h * holes) / 18);
}
function emptyPlayers(holes: 9 | 18, name = "", hdcp = ""): GolfPlayerCard[] {
  return [
    { name, hdcp, scores: Array(holes).fill("") },
    { name: "", hdcp: "", scores: Array(holes).fill("") },
    { name: "", hdcp: "", scores: Array(holes).fill("") },
    { name: "", hdcp: "", scores: Array(holes).fill("") },
  ];
}
function copy(text: string) {
  void navigator.clipboard?.writeText(text);
}

function lookingLine(n: GolfLookingNote) {
  return [
    `Looking for golfers: ${n.need || "a group"}.`,
    n.date || n.time ? `When: ${[n.date, n.time].filter(Boolean).join(" ")}` : "",
    n.hdcp ? `Handicap around ${n.hdcp}` : "",
    n.notes || "",
    n.name || n.phone ? `Ask for ${[n.name, n.phone].filter(Boolean).join(" · ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function MySpaceGolfLogBoard() {
  const empty = emptyBoards().golfLog;
  const { value, save, ready, saving, error } = useMemberBoard<GolfLogBoard>(
    "golfLog",
    empty,
    true
  );
  const [tab, setTab] = useState("scorecard");
  const [date, setDate] = useState(today());
  const [courseId, setCourseId] = useState("");
  const [holes, setHoles] = useState<9 | 18>(9);
  const [notes, setNotes] = useState("");
  const [players, setPlayers] = useState<GolfPlayerCard[]>(() => emptyPlayers(9));
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("all");
  const [q, setQ] = useState("");
  const [ttDate, setTtDate] = useState("");
  const [ttTime, setTtTime] = useState("");
  const [ttCourse, setTtCourse] = useState("");
  const [copied, setCopied] = useState("");

  const course = GOLF_COURSES.find((c) => c.id === courseId);
  const par = defaultPar(course?.kind || "executive", holes);

  const favs = useMemo(() => new Set(value.favoriteCourseIds || []), [value.favoriteCourseIds]);
  const courses = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return GOLF_COURSES.filter((c) => {
      if (kind === "fav") return favs.has(c.id);
      if (kind !== "all" && c.kind !== kind) return false;
      if (!needle) return true;
      return `${c.name} ${c.address || ""} ${c.code || ""} ${c.note || ""}`
        .toLowerCase()
        .includes(needle);
    });
  }, [kind, q, favs]);

  function persist(next: GolfLogBoard) {
    void save(next);
  }
  function bump(pi: number, hi: number, d: number) {
    setPlayers((prev) => {
      const next = prev.map((p) => ({ ...p, scores: [...p.scores] }));
      const cur = next[pi].scores[hi];
      const n = (typeof cur === "number" ? cur : par[hi] || 3) + d;
      next[pi].scores[hi] = Math.max(1, Math.min(20, n));
      return next;
    });
  }
  function setPlayer(i: number, patch: Partial<GolfPlayerCard>) {
    setPlayers((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }
  function applyHoles(h: 9 | 18) {
    setHoles(h);
    setPlayers((prev) =>
      prev.map((p) => {
        const scores = p.scores.slice(0, h);
        while (scores.length < h) scores.push("");
        return { ...p, scores };
      })
    );
  }
  function playHere(c: GolfCourse) {
    setCourseId(c.id);
    applyHoles(c.holes >= 18 ? 18 : 9);
    setTab("scorecard");
  }
  function flash(msg: string) {
    setCopied(msg);
    window.setTimeout(() => setCopied(""), 2000);
  }

  if (!ready) return <p className="panel-hint">Loading golf log…</p>;

  const namedPlayers = players.filter((p) => p.name.trim());
  const tabs = [
    { id: "scorecard", label: "Scorecard" },
    { id: "courses", label: "Courses" },
    { id: "tees", label: "Tee times" },
    { id: "pair", label: "Find a group" },
    { id: "history", label: "History" },
    { id: "practice", label: "Practice" },
  ];

  return (
    <div className="ms-ent-board">
      <p className="ms-module-lead">Golf in The Villages</p>
      <p className="panel-hint">
        Keep a card for up to four players on 9 or 18 holes. Tap + / − per hole — no tiny
        scorecard pencils required. Practice holds short tips and a few tools. Public{" "}
        <Link href="/golf-zone" className="text-link">
          Golf hub
        </Link>{" "}
        stays free.
      </p>
      {error ? <p className="pf-form-error">{error}</p> : null}
      {saving ? <p className="panel-hint">Saving to your account…</p> : null}
      {copied ? <p className="panel-hint">{copied}</p> : null}

      <div className="ms-subnav">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`ms-subnav-btn ${tab === t.id ? "is-on" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "scorecard" && (
        <div className="about-panel ms-module ms-golf-print">
          <div className="form-grid ms-module-form">
            <div className="field">
              <label>Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="field">
              <label>Course</label>
              <select
                value={courseId}
                onChange={(e) => {
                  const id = e.target.value;
                  setCourseId(id);
                  const c = GOLF_COURSES.find((x) => x.id === id);
                  if (c) applyHoles(c.holes >= 18 ? 18 : 9);
                }}
              >
                <option value="">Pick a Villages course</option>
                {GOLF_COURSES.filter((c) => c.kind !== "practice" && c.kind !== "putting").map(
                  (c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                      {c.code ? ` · ${c.code}` : ""} · {kindLabel(c.kind)}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>
          <div className="ms-photo-chips" style={{ margin: "0.65rem 0" }}>
            <button
              type="button"
              className={`ms-photo-chip${holes === 9 ? " is-on" : ""}`}
              onClick={() => applyHoles(9)}
            >
              9 holes
            </button>
            <button
              type="button"
              className={`ms-photo-chip${holes === 18 ? " is-on" : ""}`}
              onClick={() => applyHoles(18)}
            >
              18 holes
            </button>
          </div>
          <div className="ms-golf-scroll">
            <table className="ms-golf-card">
              <thead>
                <tr>
                  <th>Hole</th>
                  {par.map((_, i) => (
                    <th key={i}>{i + 1}</th>
                  ))}
                  <th>Out</th>
                </tr>
                <tr>
                  <th>Par</th>
                  {par.map((p, i) => (
                    <td key={i}>{p}</td>
                  ))}
                  <td>{par.reduce((s, n) => s + n, 0)}</td>
                </tr>
              </thead>
              <tbody>
                {players.map((pl, pi) => {
                  const g = grossOf(pl.scores);
                  return (
                    <tr key={pi}>
                      <th>
                        <input
                          value={pl.name}
                          placeholder={pi === 0 ? "Your name" : `Player ${pi + 1}`}
                          onChange={(e) => setPlayer(pi, { name: e.target.value.slice(0, 40) })}
                        />
                        <input
                          value={pl.hdcp}
                          placeholder="Hdcp"
                          onChange={(e) => setPlayer(pi, { hdcp: e.target.value.slice(0, 8) })}
                        />
                      </th>
                      {pl.scores.map((s, hi) => (
                        <td key={hi}>
                          <div className="ms-score-pm">
                            <button type="button" onClick={() => bump(pi, hi, -1)}>
                              −
                            </button>
                            <strong>{s === "" ? "—" : s}</strong>
                            <button type="button" onClick={() => bump(pi, hi, 1)}>
                              +
                            </button>
                          </div>
                        </td>
                      ))}
                      <td>
                        <strong>{g || "—"}</strong>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="ms-stat-row" style={{ marginTop: "0.75rem" }}>
            {namedPlayers.map((pl) => {
              const g = grossOf(pl.scores);
              const n = netOf(g, pl.hdcp, holes);
              return (
                <div key={pl.name} className="ms-stat">
                  <span>{pl.name}</span>
                  <strong>Gross {g || "—"}</strong>
                  <em>{n == null ? "Add hdcp for net" : `Net ${n}`}</em>
                </div>
              );
            })}
          </div>
          <div className="field">
            <label>Round notes</label>
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cart path only · breakfast ball on 3 · beer on 19"
            />
          </div>
          <div className="hero-actions" style={{ marginTop: "0.75rem" }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                const cname = course?.name || "Villages course";
                const used = players.filter((p) => p.name.trim() || p.scores.some((s) => s !== ""));
                if (!used.length) return;
                persist({
                  ...value,
                  myName: used[0].name || value.myName,
                  myHdcp: used[0].hdcp || value.myHdcp,
                  rounds: [
                    {
                      id: uid("rd"),
                      date,
                      course: cname,
                      courseId,
                      holes,
                      scores: used[0].scores,
                      par,
                      notes: notes.trim(),
                      players: used,
                    },
                    ...value.rounds,
                  ].slice(0, 80),
                });
                flash("Round saved to History");
              }}
            >
              Save finished round
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                const lines = namedPlayers.map((pl) => {
                  const g = grossOf(pl.scores);
                  const n = netOf(g, pl.hdcp, holes);
                  return `${pl.name}: ${pl.scores.map((s) => s || "—").join(" ")} · gross ${g}${n == null ? "" : ` · net ${n}`}`;
                });
                copy(
                  [`${course?.name || "Round"} ${date} · ${holes} holes`, notes, ...lines]
                    .filter(Boolean)
                    .join("\n")
                );
                flash("Scores copied");
              }}
            >
              Copy scores
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => window.print()}>
              Print card
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setPlayers(emptyPlayers(holes, value.myName, value.myHdcp));
                setNotes("");
                setDate(today());
              }}
            >
              New round
            </button>
          </div>
        </div>
      )}

      {tab === "courses" && (
        <>
          <p className="panel-hint">
            Every championship club, executive trail course, pitch &amp; putt, and practice range
            in The Villages — maps, starter phone, and the official scorecard page. Confirm hours
            with the shop; trail fees apply if you ride your own car on executive courses.
          </p>
          <div className="hero-actions">
            <a className="btn btn-ghost btn-sm" href={GOLF_HUB.map} target="_blank" rel="noopener noreferrer">
              Golf trail map (PDF)
            </a>
            <a className="btn btn-ghost btn-sm" href={GOLF_HUB.locator} target="_blank" rel="noopener noreferrer">
              Course directory
            </a>
            <a className="btn btn-ghost btn-sm" href={GOLF_HUB.home} target="_blank" rel="noopener noreferrer">
              Villages Golf hub
            </a>
            <a className="btn btn-ghost btn-sm" href={GOLF_HUB.golfTheVillages} target="_blank" rel="noopener noreferrer">
              GolfTheVillages.com
            </a>
          </div>
          <div className="ms-photo-chips" style={{ margin: "0.75rem 0" }}>
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                className={`ms-photo-chip${kind === k.id ? " is-on" : ""}`}
                onClick={() => setKind(k.id)}
              >
                {k.label}
              </button>
            ))}
          </div>
          <div className="field">
            <label>Find a course</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Hacienda, Fenney, 018…"
            />
          </div>
          <div className="ms-food-guide">
            {courses.map((c) => (
              <article key={c.id} className="ms-food-card">
                <span className="panel-hint">
                  {kindLabel(c.kind).toUpperCase()}
                  {c.holes ? ` · ${c.holes} HOLES` : ""}
                  {c.code ? ` · CODE ${c.code}` : ""}
                  {c.level ? ` · ${c.level}` : ""}
                </span>
                <h4>{c.name}</h4>
                {c.address ? <p className="panel-hint">{c.address}</p> : null}
                {c.phone ? (
                  <p>
                    <a className="text-link" href={telHref(c.phone)}>
                      {c.phone}
                    </a>
                  </p>
                ) : null}
                {c.note ? <p>{c.note}</p> : null}
                <div className="hero-actions">
                  <a
                    className="btn btn-ghost btn-sm"
                    href={mapsUrl(c.address || c.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Map
                  </a>
                  <GolfScorecardButton course={c} />
                  <a
                    className="btn btn-ghost btn-sm"
                    href={golfTrailPageUrl(c)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Trail / info
                  </a>
                  {c.phone ? (
                    <a className="btn btn-ghost btn-sm" href={telHref(c.phone)}>
                      Call starter
                    </a>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      const next = favs.has(c.id)
                        ? value.favoriteCourseIds.filter((id) => id !== c.id)
                        : [c.id, ...value.favoriteCourseIds].slice(0, 80);
                      persist({ ...value, favoriteCourseIds: next });
                    }}
                  >
                    {favs.has(c.id) ? "★ Favorite" : "☆ Favorite"}
                  </button>
                  {c.kind !== "practice" && c.kind !== "putting" ? (
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => playHere(c)}>
                      Play here
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {tab === "tees" && (
        <>
          <p className="panel-hint">
            Tee times in The Villages use a <strong>points system — not first-come, first-served</strong>.
            Golfers with the fewest rolling 7-day points get first assignment. Request 4–7 days
            ahead, reserve 1–3 days ahead, or call the shop the day of play. System is on 23 hours
            a day (offline midnight–1 a.m.).
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-sm" href={GOLF_HUB.tees} target="_blank" rel="noopener noreferrer">
              Official tee times page
            </a>
            <a className="btn btn-ghost btn-sm" href={GOLF_HUB.golfTheVillages} target="_blank" rel="noopener noreferrer">
              Book online (GolfTheVillages.net)
            </a>
            <a className="btn btn-ghost btn-sm" href="tel:3527534653">
              Call 352-753-GOLF
            </a>
          </div>
          <div className="ms-food-guide">
            <article className="ms-food-card">
              <span className="panel-hint">OPTION 1 · 4–7 DAYS OUT</span>
              <h4>Request a tee time</h4>
              <p>Use the automated system by phone or online. Fewest rolling 7-day points get first assignment.</p>
              <div className="hero-actions">
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.requestPdf} target="_blank" rel="noopener noreferrer">
                  Request worksheet (PDF)
                </a>
                <a className="btn btn-ghost btn-sm" href="tel:3527534653">
                  352-753-GOLF
                </a>
              </div>
            </article>
            <article className="ms-food-card">
              <span className="panel-hint">OPTION 2 · 1–3 DAYS OUT</span>
              <h4>Make a reservation</h4>
              <p>Grab an open slot through the same phone/online system. Have course codes handy (they’re on each course card).</p>
              <div className="hero-actions">
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.ivrPdf} target="_blank" rel="noopener noreferrer">
                  How-to (PDF)
                </a>
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.phoneGuide} target="_blank" rel="noopener noreferrer">
                  Course phone directory
                </a>
              </div>
            </article>
            <article className="ms-food-card">
              <span className="panel-hint">OPTION 3 · DAY OF PLAY</span>
              <h4>Call the shop or starter</h4>
              <p>Championship: call that club’s golf shop. Executive: call the starter building. Open times go to whoever calls.</p>
              <a className="btn btn-ghost btn-sm" href={GOLF_HUB.locator} target="_blank" rel="noopener noreferrer">
                Course phone directory
              </a>
            </article>
            <article className="ms-food-card">
              <span className="panel-hint">TRAIL FEES · EXECUTIVE</span>
              <h4>Personal golf car on the trail</h4>
              <p>Residents play executive courses free (amenity fee). A trail fee applies if you ride your own car. Walk or pull-cart is free.</p>
              <div className="hero-actions">
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.rates} target="_blank" rel="noopener noreferrer">
                  Rates &amp; fees
                </a>
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.trailApp} target="_blank" rel="noopener noreferrer">
                  Trail fee form
                </a>
              </div>
            </article>
            <article className="ms-food-card">
              <span className="panel-hint">NEED HELP?</span>
              <h4>Tee time office</h4>
              <p>Questions about a request, points, or Good Golf School: 352-750-4558. System is 23 hours a day.</p>
              <a className="btn btn-ghost btn-sm" href="tel:3527504558">
                Call 352-750-4558
              </a>
            </article>
            <article className="ms-food-card">
              <span className="panel-hint">HANDICAP · GHIN</span>
              <h4>Post championship scores</h4>
              <p>Championship courses have USGA ratings — post those rounds. Executive trail courses do not have slope/index.</p>
              <div className="hero-actions">
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.ghin} target="_blank" rel="noopener noreferrer">
                  GHIN
                </a>
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.goodGolf} target="_blank" rel="noopener noreferrer">
                  Good Golf guide
                </a>
              </div>
            </article>
            <article className="ms-food-card">
              <span className="panel-hint">TURF TALK</span>
              <h4>Closures &amp; cart-path only</h4>
              <p>Check maintenance, aeration, and weather delays before you roll over.</p>
              <div className="hero-actions">
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.whatsNew} target="_blank" rel="noopener noreferrer">
                  What’s new / Turf Talk
                </a>
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.execGtv} target="_blank" rel="noopener noreferrer">
                  Executive schedules
                </a>
              </div>
            </article>
            <article className="ms-food-card">
              <span className="panel-hint">NIGHT GOLF</span>
              <h4>Saddlebrook &amp; Escambia</h4>
              <p>
                Saddlebrook: Tue / Thu / Sat (call Glenview 352-753-3345). Escambia: Wed / Fri
                (call Belle Glade 352-674-2700). Groups of 3+.
              </p>
            </article>
          </div>
          <h4>My tee times</h4>
          <p className="panel-hint">Personal reminders on this account — not an official booking.</p>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              persist({
                ...value,
                teeTimes: [
                  {
                    id: uid("tt"),
                    date: ttDate,
                    time: ttTime,
                    course: ttCourse,
                    notes: "",
                  },
                  ...value.teeTimes,
                ].slice(0, 40),
              });
              setTtDate("");
              setTtTime("");
              setTtCourse("");
            }}
          >
            <div className="field">
              <label>Date</label>
              <input type="date" value={ttDate} onChange={(e) => setTtDate(e.target.value)} />
            </div>
            <div className="field">
              <label>Time</label>
              <input type="time" value={ttTime} onChange={(e) => setTtTime(e.target.value)} />
            </div>
            <div className="field">
              <label>Course</label>
              <input
                value={ttCourse}
                onChange={(e) => setTtCourse(e.target.value)}
                list="ms-golf-courses"
                required
              />
              <datalist id="ms-golf-courses">
                {GOLF_COURSES.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save tee time
            </button>
          </form>
          <ul className="ms-cal-list">
            {value.teeTimes.map((t) => (
              <li key={t.id}>
                <div>
                  <strong>{t.course}</strong>
                  <span>
                    {t.date} {t.time}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    persist({ ...value, teeTimes: value.teeTimes.filter((x) => x.id !== t.id) })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "pair" && (
        <>
          <p className="panel-hint">
            Need a partner? Book a 2-some and the starter often fills the rest. Men’s Day (Tue)
            and Ladies’ Day (Wed) scramble pairings are posted on Golf The Villages. Keep your
            own looking-for-players note here, then copy it to a text.
          </p>
          <div className="hero-actions">
            <a className="btn btn-ghost btn-sm" href={GOLF_HUB.mensLadies} target="_blank" rel="noopener noreferrer">
              Men’s &amp; Ladies’ Day pairings
            </a>
            <a className="btn btn-ghost btn-sm" href={GOLF_HUB.pairings} target="_blank" rel="noopener noreferrer">
              Super Seniors pairings
            </a>
            <a className="btn btn-ghost btn-sm" href={GOLF_HUB.tees} target="_blank" rel="noopener noreferrer">
              Tee time system
            </a>
          </div>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              persist({
                ...value,
                looking: [
                  {
                    id: uid("lk"),
                    name: value.myName,
                    phone: "",
                    date: ttDate,
                    time: ttTime,
                    need: NEED_OPTS[0],
                    hdcp: value.myHdcp,
                    notes: notes.trim() || "Prefer 8am · ride in two carts",
                  },
                  ...value.looking,
                ].slice(0, 40),
              });
              setNotes("");
            }}
          >
            <div className="field">
              <label>Your name</label>
              <input
                value={value.myName}
                onChange={(e) => persist({ ...value, myName: e.target.value.slice(0, 60) })}
              />
            </div>
            <div className="field">
              <label>Your handicap</label>
              <input
                value={value.myHdcp}
                onChange={(e) => persist({ ...value, myHdcp: e.target.value.slice(0, 8) })}
              />
            </div>
            <div className="field">
              <label>Date</label>
              <input type="date" value={ttDate} onChange={(e) => setTtDate(e.target.value)} />
            </div>
            <div className="field">
              <label>Tee time</label>
              <input type="time" value={ttTime} onChange={(e) => setTtTime(e.target.value)} />
            </div>
            <div className="field">
              <label>Notes</label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Prefer 8am · ride in two carts · executive or championship"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save looking-for-players note
            </button>
          </form>
          <ul className="ms-cal-list">
            {value.looking.map((n) => (
              <li key={n.id}>
                <div>
                  <strong>
                    {n.name || "Looking"} · {n.need}
                  </strong>
                  <span>
                    {[n.date, n.time, n.hdcp && `hdcp ${n.hdcp}`, n.notes].filter(Boolean).join(" · ")}
                  </span>
                </div>
                <div className="hero-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      copy(lookingLine(n));
                      flash("Copied — paste into a text");
                    }}
                  >
                    Copy text
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      persist({ ...value, looking: value.looking.filter((x) => x.id !== n.id) })
                    }
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h4>Regulars</h4>
          <GolfRegularForm
            onSave={(reg) =>
              persist({ ...value, regulars: [reg, ...value.regulars].slice(0, 40) })
            }
          />
          <ul className="ms-cal-list">
            {value.regulars.map((r) => (
              <li key={r.id}>
                <div>
                  <strong>{r.name}</strong>
                  <span>
                    {[r.hdcp && `hdcp ${r.hdcp}`, r.phone].filter(Boolean).join(" · ")}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    persist({ ...value, regulars: value.regulars.filter((x) => x.id !== r.id) })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "history" && (
        <>
          <p className="panel-hint">
            Finished rounds land here. Save a card from the Scorecard tab after the 19th hole.
          </p>
          {value.rounds.length === 0 ? (
            <p className="panel-hint">No saved rounds yet.</p>
          ) : (
            <ul className="ms-cal-list">
              {value.rounds.map((r) => {
                const folks = r.players?.length ? r.players : [{ name: "Me", hdcp: "", scores: r.scores }];
                return (
                  <li key={r.id}>
                    <div>
                      <strong>
                        {r.course} · {r.holes} holes
                      </strong>
                      <span>
                        {r.date}
                        {folks
                          .map((p) => {
                            const g = grossOf(p.scores || []);
                            return p.name ? ` · ${p.name} ${g || "—"}` : "";
                          })
                          .join("")}
                        {r.notes ? ` · ${r.notes}` : ""}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        persist({ ...value, rounds: value.rounds.filter((x) => x.id !== r.id) })
                      }
                    >
                      Remove
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}

      {tab === "practice" && <MySpaceGolfPractice />}
    </div>
  );
}

function GolfRegularForm({
  onSave,
}: {
  onSave: (r: { id: string; name: string; hdcp: string; phone: string }) => void;
}) {
  const [name, setName] = useState("");
  const [hdcp, setHdcp] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <form
      className="form-grid ms-module-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSave({ id: uid("gr"), name: name.trim(), hdcp: hdcp.trim(), phone: phone.trim() });
        setName("");
        setHdcp("");
        setPhone("");
      }}
    >
      <div className="field">
        <label>Playing partner</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="field">
        <label>Handicap</label>
        <input value={hdcp} onChange={(e) => setHdcp(e.target.value)} />
      </div>
      <div className="field">
        <label>Phone</label>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} />
      </div>
      <button type="submit" className="btn btn-primary btn-sm">
        Save regular
      </button>
    </form>
  );
}
