"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PICKLE_COURTS, PICKLE_HUB } from "@/lib/entertainmentCatalog";
import {
  emptyBoards,
  type PickleLookingNote,
  type PickleballLogBoard,
} from "@/lib/memberBoardModel";
import { useMemberBoard } from "@/components/useMemberBoard";

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
function copy(text: string) {
  void navigator.clipboard?.writeText(text);
}
function lookingLine(n: PickleLookingNote) {
  return [
    `Looking for ${n.need || "1"} pickleball player${n.need === "1" ? "" : "s"} (${n.format || "doubles"}).`,
    n.courtName ? `Where: ${n.courtName}` : "",
    [n.date, n.time].filter(Boolean).join(" ")
      ? `When: ${[n.date, n.time].filter(Boolean).join(" ")}`
      : "",
    n.contact ? `Contact ${n.name} at ${n.contact}` : n.name ? `Ask for ${n.name}` : "",
    n.notes || "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function MySpacePickleballLogBoard() {
  const empty = emptyBoards().pickleballLog;
  const { value, save, ready, saving, error } = useMemberBoard<PickleballLogBoard>(
    "pickleballLog",
    empty,
    true
  );
  const [tab, setTab] = useState("dashboard");
  const [filter, setFilter] = useState<"all" | "hub" | "indoor" | "fav">("all");
  const [q, setQ] = useState("");
  const [copied, setCopied] = useState("");
  const [partner, setPartner] = useState("");
  const [opp1, setOpp1] = useState("");
  const [opp2, setOpp2] = useState("");
  const [score, setScore] = useState("");
  const [courtId, setCourtId] = useState("");
  const [win, setWin] = useState(true);
  const [format, setFormat] = useState("doubles");
  const [posted, setPosted] = useState(false);
  const [mNotes, setMNotes] = useState("");
  const [person, setPerson] = useState("");
  const [pDupr, setPDupr] = useState("");
  const [pKind, setPKind] = useState("both");
  const [pPhone, setPPhone] = useState("");
  const [lkNeed, setLkNeed] = useState("1");
  const [lkCourt, setLkCourt] = useState("");
  const [lkDate, setLkDate] = useState(today());
  const [lkTime, setLkTime] = useState("");
  const [lkNotes, setLkNotes] = useState("");
  const [lgName, setLgName] = useState("");
  const [lgWhen, setLgWhen] = useState("");

  const favs = useMemo(() => new Set(value.favoriteCourtIds || []), [value.favoriteCourtIds]);
  const courts = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PICKLE_COURTS.filter((c) => {
      if (filter === "fav") return favs.has(c.id);
      if (filter === "hub" && !c.hub) return false;
      if (filter === "indoor" && !c.indoor) return false;
      if (!needle) return true;
      return `${c.name} ${c.address || ""} ${c.note || ""}`.toLowerCase().includes(needle);
    });
  }, [filter, q, favs]);

  const wins = value.matches.filter((m) => m.win).length;
  const losses = value.matches.length - wins;
  const winPct = value.matches.length
    ? Math.round((wins / value.matches.length) * 100)
    : 0;
  const postedN = value.matches.filter((m) => m.postedDupr).length;

  const h2h = useMemo(() => {
    const map = new Map<string, { name: string; wins: number; losses: number; asPartner: number }>();
    const bump = (name: string, kind: "opp" | "part", win: boolean) => {
      const key = name.trim().toLowerCase();
      if (!key) return;
      const row = map.get(key) || { name: name.trim(), wins: 0, losses: 0, asPartner: 0 };
      if (kind === "part") row.asPartner += 1;
      else if (win) row.wins += 1;
      else row.losses += 1;
      map.set(key, row);
    };
    for (const m of value.matches) {
      bump(m.partner, "part", m.win);
      bump(m.opp1 || m.opponent, "opp", m.win);
      bump(m.opp2, "opp", m.win);
    }
    return [...map.values()].sort((a, b) => b.wins + b.losses + b.asPartner - (a.wins + a.losses + a.asPartner));
  }, [value.matches]);

  function persist(next: PickleballLogBoard) {
    void save(next);
  }
  function flash(msg: string) {
    setCopied(msg);
    window.setTimeout(() => setCopied(""), 2000);
  }

  if (!ready) return <p className="panel-hint">Loading pickleball log…</p>;

  const tabs = [
    { id: "dashboard", label: "DUPR & record" },
    { id: "matches", label: "Matches" },
    { id: "people", label: "People" },
    { id: "courts", label: "Courts" },
    { id: "play", label: "Find a game" },
  ];

  return (
    <div className="ms-ent-board">
      <p className="ms-module-lead">Pickleball country</p>
      <p className="panel-hint">
        DUPR is pickleball’s handicap — locals use it for leagues, ladders, and balanced games.
        This screen does not replace DUPR; it keeps your Villages book. Public{" "}
        <Link href="/pickleball" className="text-link">
          Pickleball hub
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

      {tab === "dashboard" && (
        <>
          <div className="hero-actions">
            <a className="btn btn-primary btn-sm" href={PICKLE_HUB.dupr} target="_blank" rel="noopener noreferrer">
              DUPR.com
            </a>
            <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.duprDash} target="_blank" rel="noopener noreferrer">
              DUPR dashboard
            </a>
            <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.tvcpc} target="_blank" rel="noopener noreferrer">
              Competitive club (TVCPC)
            </a>
            <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.home} target="_blank" rel="noopener noreferrer">
              Villages pickleball
            </a>
          </div>
          <div className="ms-stat-row" style={{ marginTop: "0.85rem" }}>
            <div className="ms-stat">
              <span>DUPR doubles</span>
              <strong>{value.profile.duprDoubles || "—"}</strong>
            </div>
            <div className="ms-stat">
              <span>DUPR singles</span>
              <strong>{value.profile.duprSingles || "—"}</strong>
            </div>
            <div className="ms-stat">
              <span>Record</span>
              <strong>
                {wins}–{losses}
              </strong>
              <em>{value.matches.length ? `${winPct}% wins` : "Log a match"}</em>
            </div>
            <div className="ms-stat">
              <span>Posted to DUPR</span>
              <strong>{postedN}</strong>
            </div>
          </div>
          <div className="form-grid ms-module-form">
            <div className="field">
              <label>Your name</label>
              <input
                value={value.profile.name}
                onChange={(e) =>
                  persist({ ...value, profile: { ...value.profile, name: e.target.value.slice(0, 60) } })
                }
                placeholder="As it appears on DUPR"
              />
            </div>
            <div className="field">
              <label>Phone</label>
              <input
                value={value.profile.phone}
                onChange={(e) =>
                  persist({ ...value, profile: { ...value.profile, phone: e.target.value.slice(0, 40) } })
                }
              />
            </div>
            <div className="field">
              <label>DUPR doubles</label>
              <input
                value={value.profile.duprDoubles}
                onChange={(e) =>
                  persist({
                    ...value,
                    profile: { ...value.profile, duprDoubles: e.target.value.slice(0, 8) },
                  })
                }
                placeholder="3.750"
              />
            </div>
            <div className="field">
              <label>DUPR singles</label>
              <input
                value={value.profile.duprSingles}
                onChange={(e) =>
                  persist({
                    ...value,
                    profile: { ...value.profile, duprSingles: e.target.value.slice(0, 8) },
                  })
                }
                placeholder="3.500"
              />
            </div>
            <div className="field">
              <label>PCVG / self rating</label>
              <input
                value={value.profile.pcvg}
                onChange={(e) =>
                  persist({ ...value, profile: { ...value.profile, pcvg: e.target.value.slice(0, 20) } })
                }
                placeholder="3.0 rec"
              />
            </div>
            <div className="field">
              <label>Notes</label>
              <input
                value={value.profile.notes}
                onChange={(e) =>
                  persist({ ...value, profile: { ...value.profile, notes: e.target.value.slice(0, 400) } })
                }
              />
            </div>
          </div>
          <div className="ms-food-guide" style={{ marginTop: "1rem" }}>
            <article className="ms-food-card">
              <span className="panel-hint">STAY OUT OF THE KITCHEN</span>
              <h4>NVZ reminder</h4>
              <p>The non-volley zone is the 7-foot kitchen. Volleying in it (or on the line) is a fault. Dinks win Villages rec games.</p>
              <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.usap} target="_blank" rel="noopener noreferrer">
                Court diagram
              </a>
            </article>
            <article className="ms-food-card">
              <span className="panel-hint">OPEN PLAY 7–10 A.M.</span>
              <h4>Paddle stack</h4>
              <p>Drop your paddle in the queue, play your game, then stack again. Morning open play is often 3.0+ — beginners should use intro times and clinics.</p>
            </article>
            <article className="ms-food-card">
              <span className="panel-hint">HEAT POLICY</span>
              <h4>104° / 35°</h4>
              <p>Rec Department play stops if the heat index hits 104° or the temperature is 35° or lower. Check Weather before you cart over.</p>
            </article>
          </div>
        </>
      )}

      {tab === "matches" && (
        <>
          <p className="panel-hint">
            Log a rec game or league match. Use game scores (usually to 11, win by 2). Check
            “posted to DUPR” after you enter it in the DUPR app so you don’t double-book your
            memory.
          </p>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const court = PICKLE_COURTS.find((c) => c.id === courtId);
              persist({
                ...value,
                matches: [
                  {
                    id: uid("pm"),
                    date: today(),
                    time: "",
                    format,
                    partner,
                    opponent: opp1,
                    opp1,
                    opp2,
                    score,
                    court: court?.name || "",
                    courtId,
                    win,
                    postedDupr: posted,
                    notes: mNotes.trim(),
                  },
                  ...value.matches,
                ].slice(0, 80),
              });
              setPartner("");
              setOpp1("");
              setOpp2("");
              setScore("");
              setMNotes("");
              setPosted(false);
            }}
          >
            <div className="field">
              <label>Format</label>
              <select value={format} onChange={(e) => setFormat(e.target.value)}>
                <option value="doubles">Doubles</option>
                <option value="singles">Singles</option>
              </select>
            </div>
            <div className="field">
              <label>Court / rec center</label>
              <select value={courtId} onChange={(e) => setCourtId(e.target.value)}>
                <option value="">Optional</option>
                {PICKLE_COURTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {format === "doubles" ? (
              <div className="field">
                <label>Partner</label>
                <input value={partner} onChange={(e) => setPartner(e.target.value)} list="ms-pb-people" />
              </div>
            ) : null}
            <div className="field">
              <label>Opponent 1</label>
              <input value={opp1} onChange={(e) => setOpp1(e.target.value)} list="ms-pb-people" />
            </div>
            {format === "doubles" ? (
              <div className="field">
                <label>Opponent 2</label>
                <input value={opp2} onChange={(e) => setOpp2(e.target.value)} list="ms-pb-people" />
              </div>
            ) : null}
            <datalist id="ms-pb-people">
              {value.people.map((p) => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>
            <div className="field">
              <label>Score</label>
              <input
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="11-7, 11-9"
              />
            </div>
            <div className="field">
              <label>Notes</label>
              <input
                value={mNotes}
                onChange={(e) => setMNotes(e.target.value)}
                placeholder="Third-shot drop working · they poached on 8"
              />
            </div>
            <label className="ms-check">
              <input type="checkbox" checked={win} onChange={(e) => setWin(e.target.checked)} />
              We won
            </label>
            <label className="ms-check">
              <input type="checkbox" checked={posted} onChange={(e) => setPosted(e.target.checked)} />
              I posted this score in the DUPR app
            </label>
            <button type="submit" className="btn btn-primary btn-sm">
              Save match
            </button>
          </form>
          <ul className="ms-cal-list">
            {value.matches.map((m) => (
              <li key={m.id}>
                <div>
                  <strong>
                    {m.win ? "W" : "L"} {m.score || "match"} · {m.format}
                  </strong>
                  <span>
                    {m.date}
                    {m.court ? ` · ${m.court}` : ""}
                    {m.partner ? ` · with ${m.partner}` : ""}
                    {m.opp1 ? ` vs ${[m.opp1, m.opp2].filter(Boolean).join(" & ")}` : ""}
                    {m.postedDupr ? " · DUPR" : ""}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    persist({ ...value, matches: value.matches.filter((x) => x.id !== m.id) })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "people" && (
        <>
          <p className="panel-hint">
            Who you’ve played with and against — partners, rivals, and DUPR if you know it.
            Head-to-head wins are when they were on the other side of the net.
          </p>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!person.trim()) return;
              persist({
                ...value,
                people: [
                  {
                    id: uid("pp"),
                    name: person.trim(),
                    notes: "",
                    dupr: pDupr.trim(),
                    kind: pKind,
                    phone: pPhone.trim(),
                  },
                  ...value.people,
                ].slice(0, 40),
              });
              setPerson("");
              setPDupr("");
              setPPhone("");
            }}
          >
            <div className="field">
              <label>Name</label>
              <input value={person} onChange={(e) => setPerson(e.target.value)} required />
            </div>
            <div className="field">
              <label>DUPR</label>
              <input value={pDupr} onChange={(e) => setPDupr(e.target.value)} />
            </div>
            <div className="field">
              <label>Usually</label>
              <select value={pKind} onChange={(e) => setPKind(e.target.value)}>
                <option value="partner">Partner</option>
                <option value="rival">Opponent</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div className="field">
              <label>Phone</label>
              <input value={pPhone} onChange={(e) => setPPhone(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save person
            </button>
          </form>
          {h2h.length ? (
            <>
              <h4>Head-to-head</h4>
              <ul className="ms-cal-list">
                {h2h.slice(0, 12).map((row) => (
                  <li key={row.name}>
                    <div>
                      <strong>{row.name}</strong>
                      <span>
                        {row.wins}–{row.losses} vs them · partnered {row.asPartner}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="panel-hint">Head-to-head fills in after you log matches.</p>
          )}
          <ul className="ms-cal-list">
            {value.people.map((p) => (
              <li key={p.id}>
                <div>
                  <strong>{p.name}</strong>
                  <span>
                    {[p.kind, p.dupr && `DUPR ${p.dupr}`, p.phone, p.notes].filter(Boolean).join(" · ")}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    persist({ ...value, people: value.people.filter((x) => x.id !== p.id) })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "courts" && (
        <>
          <p className="panel-hint">
            Rec-center courts all over town. Regional hubs (Rohan, Ezell, Olympia, Everglades)
            are where open play and leagues live. Bring a resident or guest ID.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-sm" href={PICKLE_HUB.home} target="_blank" rel="noopener noreferrer">
              Official pickleball page
            </a>
            <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.pickleballers} target="_blank" rel="noopener noreferrer">
              Pickleballers clubs
            </a>
            <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.calendar} target="_blank" rel="noopener noreferrer">
              Rec calendar
            </a>
            <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.lessons} target="_blank" rel="noopener noreferrer">
              Clinics
            </a>
          </div>
          <div className="ms-photo-chips" style={{ margin: "0.75rem 0" }}>
            {(
              [
                ["all", "All"],
                ["hub", "Regional hubs"],
                ["indoor", "Indoor"],
                ["fav", "Favorites"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`ms-photo-chip${filter === id ? " is-on" : ""}`}
                onClick={() => setFilter(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="field">
            <label>Find a rec center</label>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rohan, Ezell, indoor…"
            />
          </div>
          <div className="ms-food-guide">
            {courts.map((c) => (
              <article key={c.id} className="ms-food-card">
                <span className="panel-hint">
                  {c.indoor ? "INDOOR" : "OUTDOOR"}
                  {c.lighted ? " · LIGHTED" : ""}
                  {c.courts ? ` · ${c.courts} COURTS` : ""}
                  {c.hub ? " · HUB" : ""}
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
                  {c.phone ? (
                    <a className="btn btn-ghost btn-sm" href={telHref(c.phone)}>
                      Call
                    </a>
                  ) : null}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      const next = favs.has(c.id)
                        ? value.favoriteCourtIds.filter((id) => id !== c.id)
                        : [c.id, ...value.favoriteCourtIds].slice(0, 80);
                      persist({ ...value, favoriteCourtIds: next });
                    }}
                  >
                    {favs.has(c.id) ? "★ Favorite" : "☆ Favorite"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {tab === "play" && (
        <>
          <p className="panel-hint">
            Need a fourth? Save a note and copy a text. Competitive league scores often go into
            DUPR via TVCPC. Rec Department social leagues run fall and winter — register on
            DistrictGov.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-sm" href={PICKLE_HUB.tvcpc} target="_blank" rel="noopener noreferrer">
              TVCPC competitive league
            </a>
            <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.sports} target="_blank" rel="noopener noreferrer">
              District social leagues
            </a>
            <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.calendar} target="_blank" rel="noopener noreferrer">
              Events calendar
            </a>
            <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.clubs} target="_blank" rel="noopener noreferrer">
              Resident clubs
            </a>
          </div>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const court = PICKLE_COURTS.find((c) => c.id === lkCourt);
              persist({
                ...value,
                looking: [
                  {
                    id: uid("pl"),
                    name: value.profile.name || "Me",
                    need: lkNeed,
                    format: "doubles",
                    court: lkCourt,
                    courtName: court?.name || "",
                    date: lkDate,
                    time: lkTime,
                    contact: value.profile.phone,
                    notes: lkNotes.trim(),
                  },
                  ...value.looking,
                ].slice(0, 40),
              });
              setLkNotes("");
            }}
          >
            <div className="field">
              <label>Need</label>
              <select value={lkNeed} onChange={(e) => setLkNeed(e.target.value)}>
                <option value="1">1 more</option>
                <option value="2">2 more</option>
                <option value="3">3 more</option>
              </select>
            </div>
            <div className="field">
              <label>Rec center</label>
              <select value={lkCourt} onChange={(e) => setLkCourt(e.target.value)}>
                <option value="">Any</option>
                {PICKLE_COURTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Date</label>
              <input type="date" value={lkDate} onChange={(e) => setLkDate(e.target.value)} />
            </div>
            <div className="field">
              <label>Time</label>
              <input type="time" value={lkTime} onChange={(e) => setLkTime(e.target.value)} />
            </div>
            <div className="field">
              <label>Notes</label>
              <input
                value={lkNotes}
                onChange={(e) => setLkNotes(e.target.value)}
                placeholder="3.5–4.0 · Rohan after 9am · no poaching on 3rd shot"
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
                    {n.name} · need {n.need} · {n.format}
                  </strong>
                  <span>
                    {[n.courtName, n.date, n.time, n.notes].filter(Boolean).join(" · ")}
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
          <h4>Leagues I play</h4>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!lgName.trim()) return;
              persist({
                ...value,
                leagues: [
                  { id: uid("lg"), name: lgName.trim(), when: lgWhen.trim(), notes: "" },
                  ...value.leagues,
                ].slice(0, 20),
              });
              setLgName("");
              setLgWhen("");
            }}
          >
            <div className="field">
              <label>League</label>
              <input value={lgName} onChange={(e) => setLgName(e.target.value)} required />
            </div>
            <div className="field">
              <label>When</label>
              <input value={lgWhen} onChange={(e) => setLgWhen(e.target.value)} placeholder="Tue 8 a.m. Rohan" />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save league
            </button>
          </form>
          <ul className="ms-cal-list">
            {value.leagues.map((l) => (
              <li key={l.id}>
                <div>
                  <strong>{l.name}</strong>
                  <span>{l.when}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    persist({ ...value, leagues: value.leagues.filter((x) => x.id !== l.id) })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
