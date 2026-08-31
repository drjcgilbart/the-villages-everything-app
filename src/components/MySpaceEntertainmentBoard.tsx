"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  emptyBoards,
  type EntertainmentBoard,
  type EntClub,
  type EntShow,
  type EntWatch,
  type GolfLogBoard,
  type PickleballLogBoard,
} from "@/lib/memberBoardModel";
import { useMemberBoard } from "@/components/useMemberBoard";
import {
  BOX_OFFICES,
  ENT_FACEBOOK,
  GOLF_COURSES,
  GOLF_HUB,
  KNOW_BEFORE,
  LIVE_CAMS,
  MORE_VENUES,
  NIGHTLY,
  PICKLE_COURTS,
  PICKLE_HUB,
  PLAYHOUSE,
  POLO_SITE,
  SHOW_VENUES,
  SQUARES,
  SQUARES_HUB,
  SUMMER_HOURS,
  TICKETS_ACCOUNT,
  TICKETS_EVENTS,
  TICKETS_HOME,
  TICKETS_LOCATIONS,
  TICKET_WALLET,
  VENUES,
  golfInfoUrl,
  mapsUrl,
  telHref,
  type GolfCourse,
  type PickleCourt,
} from "@/lib/entertainmentCatalog";


type EntTab = "squares" | "shows" | "clubs" | "watch" | "golf" | "pickle";
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CLUB_KINDS = [
  { id: "weekly", label: "Every week" },
  { id: "monthly-week", label: "A few times a month" },
  { id: "monthly-dates", label: "Same dates each month" },
  { id: "dates", label: "Specific dates" },
];
const TABS: { id: EntTab; label: string; icon: string }[] = [
  { id: "squares", label: "Town squares", icon: "🎵" },
  { id: "shows", label: "Shows & tickets", icon: "🎟" },
  { id: "clubs", label: "Rec clubs", icon: "🎲" },
  { id: "watch", label: "Watch later", icon: "🎬" },
  { id: "golf", label: "Golf", icon: "⛳" },
  { id: "pickle", label: "Pickleball", icon: "🏓" },
];

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function todayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

function fmtWhen(s: EntShow) {
  const bits = [s.venue || "Venue TBD"];
  if (s.date) bits.push(s.date);
  if (s.time) bits.push(s.time);
  if (s.confirmation) bits.push(`conf ${s.confirmation}`);
  return bits.join(" · ");
}

/**
 * Entertainment lanai — squares, ticket drawer, rec clubs, watch later,
 * plus Villages golf/pickleball directories with official links.
 */
export function MySpaceEntertainmentBoard() {
  const empty = emptyBoards().entertainment;
  const { value, save, ready, saving, error } = useMemberBoard<EntertainmentBoard>(
    "entertainment",
    empty,
    true
  );
  const golf = useMemberBoard<GolfLogBoard>("golfLog", emptyBoards().golfLog, true);
  const pickle = useMemberBoard<PickleballLogBoard>(
    "pickleballLog",
    emptyBoards().pickleballLog,
    true
  );
  const [tab, setTab] = useState<EntTab>("squares");
  const [golfSub, setGolfSub] = useState<"courses" | "play">("courses");
  const [pickleSub, setPickleSub] = useState<"courts" | "play">("courts");
  const [golfKind, setGolfKind] = useState("all");
  const [golfQ, setGolfQ] = useState("");
  const [golfPlayCourse, setGolfPlayCourse] = useState("");
  const [pickleKind, setPickleKind] = useState("all");
  const [pickleQ, setPickleQ] = useState("");
  const [picklePlayCourt, setPicklePlayCourt] = useState("");
  const [showForm, setShowForm] = useState({
    title: "",
    venue: "",
    venueOther: "",
    date: "",
    time: "",
    confirmation: "",
    notes: "",
  });
  const [editShowId, setEditShowId] = useState<string | null>(null);
  const [clubName, setClubName] = useState("");
  const [clubLoc, setClubLoc] = useState("");
  const [clubKind, setClubKind] = useState("weekly");
  const [clubDays, setClubDays] = useState<string[]>(["Tue"]);
  const [clubInterval, setClubInterval] = useState(1);
  const [clubTime, setClubTime] = useState("");
  const [clubNotes, setClubNotes] = useState("");
  const [clubExtraDate, setClubExtraDate] = useState("");
  const [clubExtraTime, setClubExtraTime] = useState("");
  const [clubExtras, setClubExtras] = useState<{ date: string; time: string }[]>([]);
  const [watch, setWatch] = useState({
    title: "",
    type: "movie",
    where: "",
    date: "",
    time: "",
    days: [] as string[],
    notes: "",
  });
  const [tonightNote, setTonightNote] = useState("");

  const today = todayKey();
  const going = value.tonightDate === today ? value.tonightSquare : "";

  function persist(next: EntertainmentBoard) {
    void save(next);
  }

  const golfList = useMemo(() => {
    const q = golfQ.trim().toLowerCase();
    return GOLF_COURSES.filter((c) => {
      if (golfKind === "fav") return value.golfFavs.includes(c.id);
      if (golfKind !== "all" && c.kind !== golfKind) return false;
      if (!q) return true;
      return `${c.name} ${c.code || ""} ${c.address || ""}`.toLowerCase().includes(q);
    });
  }, [golfKind, golfQ, value.golfFavs]);

  const pickleList = useMemo(() => {
    const q = pickleQ.trim().toLowerCase();
    return PICKLE_COURTS.filter((c) => {
      if (pickleKind === "fav") return value.pickleFavs.includes(c.id);
      if (pickleKind === "hub" && !c.hub) return false;
      if (pickleKind === "indoor" && !c.indoor) return false;
      if (!q) return true;
      return `${c.name} ${c.address || ""} ${c.note || ""}`.toLowerCase().includes(q);
    });
  }, [pickleKind, pickleQ, value.pickleFavs]);

  function saveShow() {
    const venue =
      showForm.venue === "__other__" ? showForm.venueOther.trim() : showForm.venue;
    const title = showForm.title.trim();
    if (!title) return;
    const row: EntShow = {
      id: editShowId || uid("sh"),
      title: title.slice(0, 160),
      venue,
      date: showForm.date,
      time: showForm.time,
      confirmation: showForm.confirmation.trim().slice(0, 80),
      notes: showForm.notes.trim().slice(0, 400),
      when: [showForm.date, showForm.time].filter(Boolean).join(" "),
    };
    persist({
      ...value,
      shows: editShowId
        ? value.shows.map((s) => (s.id === editShowId ? row : s))
        : [row, ...value.shows].slice(0, 60),
    });
    setEditShowId(null);
    setShowForm({
      title: "",
      venue: "",
      venueOther: "",
      date: "",
      time: "",
      confirmation: "",
      notes: "",
    });
  }

  if (!ready) return <p className="panel-hint">Loading entertainment…</p>;

  return (
    <div className="ms-ent-board">
      <p className="ms-module-lead">
        Tonight at the square, tickets, rec clubs, and watch-later — your nights. Public square
        lineups stay free on Town Squares.
      </p>
      <p className="panel-hint">
        Public Hub page stays free:{" "}
        <Link href="/town-squares" className="text-link">
          Town Squares
        </Link>
        {" · "}
        <a href={TICKETS_HOME} className="text-link" target="_blank" rel="noopener noreferrer">
          The Villages Entertainment tickets
        </a>
      </p>
      {error ? <p className="pf-form-error">{error}</p> : null}
      {saving ? <p className="panel-hint">Saving to your account…</p> : null}

      <div className="ms-h-tiles" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`ms-h-tile ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <span aria-hidden="true">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
      <div className="ms-h-toolbar">
        <span className="ms-h-pill">
          {value.shows.length} upcoming · {value.clubs.length} clubs
        </span>
        <span className="panel-hint">Town squares · Shows · Golf · Pickleball</span>
      </div>

      {tab === "squares" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            Town squares, live music most nights. Pick where you’re rolling the cart tonight —
            Spanish Springs, Lake Sumter Landing, Brownwood, plus Sawgrass Grove and Eastport.
            Bring chairs — seat-saving without someone in the party is not allowed. No coolers,
            outside drinks, or tables on the square.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary btn-sm" href={NIGHTLY} target="_blank" rel="noopener noreferrer">
              Nightly lineup
            </a>
            <a className="btn btn-ghost btn-sm" href={SUMMER_HOURS} target="_blank" rel="noopener noreferrer">
              Summer hours
            </a>
            <a className="btn btn-ghost btn-sm" href={LIVE_CAMS} target="_blank" rel="noopener noreferrer">
              Live cams
            </a>
            <a className="btn btn-ghost btn-sm" href={SQUARES_HUB} target="_blank" rel="noopener noreferrer">
              Official squares
            </a>
            <a className="btn btn-ghost btn-sm" href={ENT_FACEBOOK} target="_blank" rel="noopener noreferrer">
              Entertainment on Facebook
            </a>
            <Link href="/town-squares" className="btn btn-ghost btn-sm">
              Hub Town Squares
            </Link>
          </div>
          <div className="ms-food-guide">
            {SQUARES.map((s) => (
              <article key={s.id} className={`ms-food-card ${going === s.id ? "is-on" : ""}`}>
                <span className="panel-hint">{going === s.id ? "TONIGHT" : "TOWN SQUARE"}</span>
                <h4>{s.label}</h4>
                <p className="panel-hint">{s.town}</p>
                <p>{s.hours}</p>
                <p className="panel-hint">{s.address}</p>
                <div className="hero-actions">
                  <a className="btn btn-ghost btn-sm" href={mapsUrl(s.map)} target="_blank" rel="noopener noreferrer">
                    Map
                  </a>
                  <a className="btn btn-ghost btn-sm" href={s.page} target="_blank" rel="noopener noreferrer">
                    Lineup
                  </a>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      persist({
                        ...value,
                        tonightSquare: s.id,
                        tonightDate: today,
                        tonightNotes: tonightNote || value.tonightNotes,
                      });
                    }}
                  >
                    {going === s.id ? "Going here" : "We’re going here"}
                  </button>
                </div>
              </article>
            ))}
          </div>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              persist({
                ...value,
                tonightNotes: tonightNote.trim().slice(0, 400),
                tonightDate: value.tonightDate || today,
              });
            }}
          >
            <div className="field">
              <label>Tonight’s notes</label>
              <input
                value={tonightNote || (value.tonightDate === today ? value.tonightNotes : "")}
                onChange={(e) => setTonightNote(e.target.value)}
                placeholder="Meet at 5:30 by the fountain · bring chairs"
              />
            </div>
            <button type="submit" className="btn btn-ghost btn-sm">
              Save note
            </button>
          </form>
          <h4>Venues</h4>
          <div className="ms-food-guide">
            {VENUES.map((v) => (
              <article key={v.id} className="ms-food-card">
                <span className="panel-hint">{v.kind.toUpperCase()}</span>
                <h4>{v.name}</h4>
                <p>{v.note}</p>
                {v.address ? <p className="panel-hint">{v.address}</p> : null}
                {v.phone ? (
                  <p>
                    <a className="text-link" href={telHref(v.phone)}>
                      {v.phone}
                    </a>
                  </p>
                ) : null}
                <div className="hero-actions">
                  {v.address ? (
                    <a className="btn btn-ghost btn-sm" href={mapsUrl(v.address || v.name)} target="_blank" rel="noopener noreferrer">
                      Map
                    </a>
                  ) : null}
                  <a className="btn btn-ghost btn-sm" href={v.page} target="_blank" rel="noopener noreferrer">
                    Info
                  </a>
                  <a className="btn btn-primary btn-sm" href={v.tickets} target="_blank" rel="noopener noreferrer">
                    Tickets
                  </a>
                </div>
              </article>
            ))}
          </div>
          <h4>Box offices</h4>
          <ul className="ms-cal-list">
            {BOX_OFFICES.map((b) => (
              <li key={b.name}>
                <div>
                  <strong>{b.name}</strong>
                  <span>
                    {b.hours} · {b.address}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <p className="panel-hint">
            Official tickets only:{" "}
            <a href={TICKETS_EVENTS} className="text-link" target="_blank" rel="noopener noreferrer">
              upcoming performances
            </a>
            {" · "}
            <a href={TICKETS_LOCATIONS} className="text-link" target="_blank" rel="noopener noreferrer">
              theatres &amp; locations
            </a>
            {" · "}
            <a href={KNOW_BEFORE} className="text-link" target="_blank" rel="noopener noreferrer">
              know before you go
            </a>
            {" · "}
            <a href={MORE_VENUES} className="text-link" target="_blank" rel="noopener noreferrer">
              polo &amp; stadium
            </a>
            . Parking is free; golf cars are encouraged. Authorized sellers:
            TheVillagesEntertainment.com, thetracy.com, and official box offices only.
          </p>
        </div>
      )}

      {tab === "shows" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            Ticket drawer for The Sharon, Savannah Center, The Tracy, SigPro Studio, Old Mill
            Playhouse, and one-off concerts. Date, time, confirmation number — saved on your Hub
            account.
          </p>
          {value.shows.length === 0 ? (
            <p className="panel-hint">No shows saved. Add The Sharon, Savannah Center, or a square concert so the tickets aren’t only in email.</p>
          ) : (
            <ul className="ms-cal-list">
              {value.shows.map((s: EntShow) => (
                <li key={s.id}>
                  <div>
                    <strong>{s.title}</strong>
                    <span>{fmtWhen(s)}</span>
                    {s.notes ? <span>{s.notes}</span> : null}
                  </div>
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setEditShowId(s.id);
                        setShowForm({
                          title: s.title,
                          venue: SHOW_VENUES.includes(s.venue) ? s.venue : s.venue ? "__other__" : "",
                          venueOther: SHOW_VENUES.includes(s.venue) ? "" : s.venue,
                          date: s.date,
                          time: s.time,
                          confirmation: s.confirmation,
                          notes: s.notes,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        persist({ ...value, shows: value.shows.filter((x) => x.id !== s.id) })
                      }
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              saveShow();
            }}
          >
            <div className="field">
              <label>{editShowId ? "Edit show" : "Show"}</label>
              <input
                value={showForm.title}
                onChange={(e) => setShowForm({ ...showForm, title: e.target.value })}
                placeholder="Jersey Boys, tribute band, movie…"
                required
              />
            </div>
            <div className="field">
              <label>Venue</label>
              <select
                value={showForm.venue}
                onChange={(e) => setShowForm({ ...showForm, venue: e.target.value })}
              >
                <option value="">Choose a venue</option>
                {SHOW_VENUES.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
                <option value="__other__">Other (type it)</option>
              </select>
            </div>
            {showForm.venue === "__other__" ? (
              <div className="field">
                <label>Venue name</label>
                <input
                  value={showForm.venueOther}
                  onChange={(e) => setShowForm({ ...showForm, venueOther: e.target.value })}
                  placeholder="Type the place"
                />
              </div>
            ) : null}
            <div className="field">
              <label>Date</label>
              <input
                type="date"
                value={showForm.date}
                onChange={(e) => setShowForm({ ...showForm, date: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Time</label>
              <input
                type="time"
                value={showForm.time}
                onChange={(e) => setShowForm({ ...showForm, time: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Confirmation</label>
              <input
                value={showForm.confirmation}
                onChange={(e) => setShowForm({ ...showForm, confirmation: e.target.value })}
                placeholder="Order # or row/seat"
              />
            </div>
            <div className="field">
              <label>Notes</label>
              <input
                value={showForm.notes}
                onChange={(e) => setShowForm({ ...showForm, notes: e.target.value })}
                placeholder="Park at the rec center · dinner first"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              {editShowId ? "Save changes" : "Save show"}
            </button>
            {editShowId ? (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setEditShowId(null);
                  setShowForm({
                    title: "",
                    venue: "",
                    venueOther: "",
                    date: "",
                    time: "",
                    confirmation: "",
                    notes: "",
                  });
                }}
              >
                Cancel
              </button>
            ) : null}
          </form>
          <p className="panel-hint">
            Buy tickets only from{" "}
            <a href={TICKETS_HOME} className="text-link" target="_blank" rel="noopener noreferrer">
              thevillagesentertainment.com
            </a>
            {" · "}
            <a href={TICKETS_ACCOUNT} className="text-link" target="_blank" rel="noopener noreferrer">
              ticket account
            </a>
            {" · "}
            <a href={TICKET_WALLET} className="text-link" target="_blank" rel="noopener noreferrer">
              ticket wallet
            </a>
            {" · "}
            <a href={PLAYHOUSE} className="text-link" target="_blank" rel="noopener noreferrer">
              Old Mill Playhouse
            </a>
            {" · "}
            <a href={POLO_SITE} className="text-link" target="_blank" rel="noopener noreferrer">
              Polo Club
            </a>
            . Remote box office: (352) 753-3229 · tickets@thevillages.com. Resident discount needs
            one valid Resident ID on the purchase. Print-at-home PDFs usually arrive ~7 days before
            the show.
          </p>
        </div>
      )}

      {tab === "clubs" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            Rec-center life is half the entertainment calendar. Weekly clubs, 1st-and-3rd-Wednesday
            groups, or a couple of one-time dates — pick what matches the flyer.
          </p>
          <p className="panel-hint">
            Official rec directory:{" "}
            <a href={PICKLE_HUB.centers} className="text-link" target="_blank" rel="noopener noreferrer">
              DistrictGov recreation centers
            </a>
            {" · "}
            <Link href="/club-zone" className="text-link">
              Hub Clubs
            </Link>
          </p>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!clubName.trim()) return;
              persist({
                ...value,
                clubs: [
                  {
                    id: uid("cl"),
                    name: clubName.trim().slice(0, 120),
                    when: [clubDays.join(", "), clubTime].filter(Boolean).join(" · "),
                    rec: clubLoc.trim(),
                    location: clubLoc.trim().slice(0, 80),
                    kind: clubKind,
                    days: clubDays,
                    interval: clubInterval,
                    time: clubTime,
                    extraDates: clubExtras,
                    notes: clubNotes.trim().slice(0, 400),
                  },
                  ...value.clubs,
                ].slice(0, 60),
              });
              setClubName("");
              setClubLoc("");
              setClubNotes("");
              setClubExtras([]);
            }}
          >
            <div className="field">
              <label>Club or activity</label>
              <input
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="Line dancing, bingo, mahjong…"
                required
              />
            </div>
            <div className="field">
              <label>Rec center / place</label>
              <input
                value={clubLoc}
                onChange={(e) => setClubLoc(e.target.value)}
                placeholder="Eisenhower, Lake Miona…"
              />
            </div>
            <div className="field">
              <label>How often?</label>
              <div className="ms-h-quick">
                {CLUB_KINDS.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    className={`ms-h-range-btn ${clubKind === k.id ? "active" : ""}`}
                    onClick={() => setClubKind(k.id)}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Days of the week</label>
              <div className="ms-food-days">
                {DAYS.map((d) => (
                  <label key={d} className={clubDays.includes(d) ? "on" : ""}>
                    <input
                      type="checkbox"
                      checked={clubDays.includes(d)}
                      onChange={(e) =>
                        setClubDays(
                          e.target.checked ? [...clubDays, d] : clubDays.filter((x) => x !== d)
                        )
                      }
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>
            {clubKind === "weekly" ? (
              <div className="field">
                <label>Repeat</label>
                <div className="ms-h-quick">
                  <button
                    type="button"
                    className={`ms-h-range-btn ${clubInterval === 1 ? "active" : ""}`}
                    onClick={() => setClubInterval(1)}
                  >
                    Every week
                  </button>
                  <button
                    type="button"
                    className={`ms-h-range-btn ${clubInterval === 2 ? "active" : ""}`}
                    onClick={() => setClubInterval(2)}
                  >
                    Every other week
                  </button>
                </div>
              </div>
            ) : null}
            <div className="field">
              <label>Usual time</label>
              <input type="time" value={clubTime} onChange={(e) => setClubTime(e.target.value)} />
            </div>
            <div className="field">
              <label>Extra one-time dates (optional)</label>
              <div className="hero-actions">
                <input type="date" value={clubExtraDate} onChange={(e) => setClubExtraDate(e.target.value)} />
                <input type="time" value={clubExtraTime} onChange={(e) => setClubExtraTime(e.target.value)} />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => {
                    if (!clubExtraDate) return;
                    setClubExtras([...clubExtras, { date: clubExtraDate, time: clubExtraTime }]);
                    setClubExtraDate("");
                    setClubExtraTime("");
                  }}
                >
                  Add date
                </button>
              </div>
              {clubExtras.length === 0 ? (
                <p className="panel-hint">No specific dates added yet.</p>
              ) : (
                <p className="panel-hint">{clubExtras.map((d) => `${d.date} ${d.time}`).join(" · ")}</p>
              )}
            </div>
            <div className="field">
              <label>Notes</label>
              <input
                value={clubNotes}
                onChange={(e) => setClubNotes(e.target.value)}
                placeholder="Bring a card, court 4, beginners welcome"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save club
            </button>
          </form>
          {value.clubs.length === 0 ? (
            <p className="panel-hint">No clubs yet. Add bingo, mahjong, line dancing, duplicate bridge, or the Thursday pickleball social.</p>
          ) : (
            <ul className="ms-cal-list">
              {value.clubs.map((c: EntClub) => (
                <li key={c.id}>
                  <div>
                    <strong>{c.name}</strong>
                    <span>
                      {c.location || c.rec}
                      {c.days.length ? ` · ${c.days.join(", ")}` : ""}
                      {c.time ? ` · ${c.time}` : ""}
                      {c.notes ? ` · ${c.notes}` : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      persist({ ...value, clubs: value.clubs.filter((x) => x.id !== c.id) })
                    }
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "watch" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            Rainy-day and stay-in list. Put a date and time on anything you actually plan to watch.
            Add a movie at Old Mill Playhouse, a Netflix title, or a concert special.
          </p>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!watch.title.trim()) return;
              persist({
                ...value,
                watchLater: [
                  {
                    id: uid("wl"),
                    title: watch.title.trim().slice(0, 120),
                    type: watch.type,
                    where: watch.where.trim().slice(0, 80),
                    date: watch.date,
                    time: watch.time,
                    days: watch.days,
                    notes: watch.notes.trim().slice(0, 400),
                    done: false,
                  },
                  ...value.watchLater,
                ].slice(0, 60),
              });
              setWatch({ title: "", type: "movie", where: "", date: "", time: "", days: [], notes: "" });
            }}
          >
            <div className="field">
              <label>Title</label>
              <input
                value={watch.title}
                onChange={(e) => setWatch({ ...watch, title: e.target.value })}
                placeholder="Movie, series, or special"
                required
              />
            </div>
            <div className="field">
              <label>Type</label>
              <select value={watch.type} onChange={(e) => setWatch({ ...watch, type: e.target.value })}>
                <option value="movie">Movie</option>
                <option value="series">Series</option>
                <option value="concert">Concert / special</option>
              </select>
            </div>
            <div className="field">
              <label>Where</label>
              <input
                value={watch.where}
                onChange={(e) => setWatch({ ...watch, where: e.target.value })}
                placeholder="Old Mill, Netflix, The Sharon…"
              />
            </div>
            <div className="field">
              <label>Date</label>
              <input
                type="date"
                value={watch.date}
                onChange={(e) => setWatch({ ...watch, date: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Time</label>
              <input
                type="time"
                value={watch.time}
                onChange={(e) => setWatch({ ...watch, time: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Repeats every week on (optional)</label>
              <div className="ms-food-days">
                {DAYS.map((d) => (
                  <label key={d} className={watch.days.includes(d) ? "on" : ""}>
                    <input
                      type="checkbox"
                      checked={watch.days.includes(d)}
                      onChange={(e) =>
                        setWatch({
                          ...watch,
                          days: e.target.checked
                            ? [...watch.days, d]
                            : watch.days.filter((x) => x !== d),
                        })
                      }
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Notes</label>
              <input
                value={watch.notes}
                onChange={(e) => setWatch({ ...watch, notes: e.target.value })}
                placeholder="With Lucy · popcorn"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Add
            </button>
          </form>
          {value.watchLater.length === 0 ? (
            <p className="panel-hint">Nothing queued yet.</p>
          ) : (
            <ul className="ms-cal-list">
              {value.watchLater.map((w: EntWatch) => (
                <li key={w.id}>
                  <div>
                    <strong className={w.done ? "ms-note-done" : undefined}>{w.title}</strong>
                    <span>
                      {w.type}
                      {w.where ? ` · ${w.where}` : ""}
                      {w.date ? ` · ${w.date}` : ""}
                      {w.time ? ` ${w.time}` : ""}
                    </span>
                  </div>
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        persist({
                          ...value,
                          watchLater: value.watchLater.map((x) =>
                            x.id === w.id ? { ...x, done: !x.done } : x
                          ),
                        })
                      }
                    >
                      {w.done ? "Undo" : "Watched"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        persist({
                          ...value,
                          watchLater: value.watchLater.filter((x) => x.id !== w.id),
                        })
                      }
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "golf" && (
        <div className="about-panel ms-module">
          <div className="ms-h-quick" style={{ marginBottom: "0.85rem" }}>
            <button
              type="button"
              className={`ms-h-range-btn ${golfSub === "courses" ? "active" : ""}`}
              onClick={() => setGolfSub("courses")}
            >
              Courses
            </button>
            <button
              type="button"
              className={`ms-h-range-btn ${golfSub === "play" ? "active" : ""}`}
              onClick={() => setGolfSub("play")}
            >
              Scorecard / tees
            </button>
          </div>
          {golfSub === "play" ? (
            golf.ready ? (
              <GolfPlay golf={golf} courses={GOLF_COURSES} initialCourse={golfPlayCourse} />
            ) : (
              <p className="panel-hint">Loading golf log…</p>
            )
          ) : (
            <>
              <p className="panel-hint">
                Championship clubs, executive trail courses, pitch &amp; putt, and practice ranges —
                with maps, starter phones, and official pages. Greens fees on executive courses are
                included in the amenity fee; a trail pass is required to use your own cart.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary btn-sm" href={GOLF_HUB.map} target="_blank" rel="noopener noreferrer">
                  Golf trail map (PDF)
                </a>
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.phoneGuide} target="_blank" rel="noopener noreferrer">
                  Course directory / phones
                </a>
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.locator} target="_blank" rel="noopener noreferrer">
                  Course locator
                </a>
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.golfTheVillages} target="_blank" rel="noopener noreferrer">
                  GolfTheVillages.com
                </a>
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.championship} target="_blank" rel="noopener noreferrer">
                  Championship clubs
                </a>
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.execGtv} target="_blank" rel="noopener noreferrer">
                  Executive trail
                </a>
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.trailFees} target="_blank" rel="noopener noreferrer">
                  Trail fees
                </a>
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.trailBuy} target="_blank" rel="noopener noreferrer">
                  Buy trail pass
                </a>
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.currentRates} target="_blank" rel="noopener noreferrer">
                  Current rates (PDF)
                </a>
                <a className="btn btn-ghost btn-sm" href={GOLF_HUB.goodGolf} target="_blank" rel="noopener noreferrer">
                  Good Golf Guide
                </a>
                <a className="btn btn-ghost btn-sm" href={telHref(GOLF_HUB.phone)}>
                  Tee times {GOLF_HUB.phone}
                </a>
                <Link href="/golf-zone" className="btn btn-ghost btn-sm">
                  Hub Golf
                </Link>
              </div>
              <div className="ms-h-quick">
                {["all", "championship", "executive", "pitch-putt", "putting", "practice", "fav"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={`ms-h-range-btn ${golfKind === k ? "active" : ""}`}
                    onClick={() => setGolfKind(k)}
                  >
                    {k === "fav" ? "Favorites" : k === "pitch-putt" ? "Pitch & putt" : k[0].toUpperCase() + k.slice(1)}
                  </button>
                ))}
              </div>
              <div className="field">
                <label>Find a course</label>
                <input
                  value={golfQ}
                  onChange={(e) => setGolfQ(e.target.value)}
                  placeholder="Hacienda, Fenney, 018…"
                />
              </div>
              {golfList.length === 0 ? (
                <p className="panel-hint">No courses match that filter. Try All, or search by name / course code.</p>
              ) : null}
              <div className="ms-food-guide">
                {golfList.map((c: GolfCourse) => (
                  <article key={c.id} className="ms-food-card">
                    <span className="panel-hint">
                      {c.kind.toUpperCase()} · {c.holes} HOLES
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
                      {c.address ? (
                        <a className="btn btn-ghost btn-sm" href={mapsUrl(c.address)} target="_blank" rel="noopener noreferrer">
                          Map
                        </a>
                      ) : (
                        <a className="btn btn-ghost btn-sm" href={mapsUrl(`${c.name} golf The Villages FL`)} target="_blank" rel="noopener noreferrer">
                          Map
                        </a>
                      )}
                      <a className="btn btn-ghost btn-sm" href={golfInfoUrl(c)} target="_blank" rel="noopener noreferrer">
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
                          const on = value.golfFavs.includes(c.id);
                          persist({
                            ...value,
                            golfFavs: on
                              ? value.golfFavs.filter((id) => id !== c.id)
                              : [...value.golfFavs, c.id],
                          });
                        }}
                      >
                        {value.golfFavs.includes(c.id) ? "★ Favorite" : "☆ Favorite"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setGolfPlayCourse(c.name);
                          setGolfSub("play");
                        }}
                      >
                        Play here
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {tab === "pickle" && (
        <div className="about-panel ms-module">
          <div className="ms-h-quick" style={{ marginBottom: "0.85rem" }}>
            <button
              type="button"
              className={`ms-h-range-btn ${pickleSub === "courts" ? "active" : ""}`}
              onClick={() => setPickleSub("courts")}
            >
              Courts
            </button>
            <button
              type="button"
              className={`ms-h-range-btn ${pickleSub === "play" ? "active" : ""}`}
              onClick={() => setPickleSub("play")}
            >
              DUPR / matches
            </button>
          </div>
          {pickleSub === "play" ? (
            pickle.ready ? (
              <PicklePlay pickle={pickle} courts={PICKLE_COURTS} initialCourt={picklePlayCourt} />
            ) : (
              <p className="panel-hint">Loading pickleball log…</p>
            )
          ) : (
            <>
              <p className="panel-hint">
                Rec-center courts across The Villages. Typical open play 7–10 a.m. (Oct–Mar); summer
                windows shift. Rec play stops if the heat index hits 104° or the temperature is 35°
                or lower. Indoor backup: St. Tropez. Confirm at the rec desk.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary btn-sm" href={PICKLE_HUB.home} target="_blank" rel="noopener noreferrer">
                  Official pickleball page
                </a>
                <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.pickleballers} target="_blank" rel="noopener noreferrer">
                  Pickleballers clubs
                </a>
                <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.sports} target="_blank" rel="noopener noreferrer">
                  District sports
                </a>
                <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.centers} target="_blank" rel="noopener noreferrer">
                  Rec centers
                </a>
                <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.recMap} target="_blank" rel="noopener noreferrer">
                  Rec map (PDF)
                </a>
                <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.dupr} target="_blank" rel="noopener noreferrer">
                  DUPR.com
                </a>
                <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.duprDash} target="_blank" rel="noopener noreferrer">
                  DUPR dashboard
                </a>
                <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.tvcpc} target="_blank" rel="noopener noreferrer">
                  Competitive club (TVCPC)
                </a>
                <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.lessons} target="_blank" rel="noopener noreferrer">
                  Clinics
                </a>
                <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.usap} target="_blank" rel="noopener noreferrer">
                  Court diagram
                </a>
                <Link href="/pickleball" className="btn btn-ghost btn-sm">
                  Hub Pickleball
                </Link>
                <Link href="/rec-centers" className="btn btn-ghost btn-sm">
                  Hub Rec Centers
                </Link>
              </div>
              <div className="ms-h-quick">
                {["all", "hub", "indoor", "fav"].map((k) => (
                  <button
                    key={k}
                    type="button"
                    className={`ms-h-range-btn ${pickleKind === k ? "active" : ""}`}
                    onClick={() => setPickleKind(k)}
                  >
                    {k === "fav" ? "Favorites" : k === "hub" ? "Regional hubs" : k[0].toUpperCase() + k.slice(1)}
                  </button>
                ))}
              </div>
              <div className="field">
                <label>Find a court</label>
                <input
                  value={pickleQ}
                  onChange={(e) => setPickleQ(e.target.value)}
                  placeholder="Rohan, Ezell, indoor…"
                />
              </div>
              {pickleList.length === 0 ? (
                <p className="panel-hint">No courts match that filter. Try All, Regional hubs, or Indoor.</p>
              ) : null}
              <div className="ms-food-guide">
                {pickleList.map((c: PickleCourt) => (
                  <article key={c.id} className="ms-food-card">
                    <span className="panel-hint">
                      {c.indoor ? "INDOOR" : "OUTDOOR"}
                      {c.courts ? ` · ${c.courts} COURTS` : ""}
                      {c.lighted ? " · LIGHTED" : ""}
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
                        href={mapsUrl(`${c.name} The Villages FL ${c.address || ""}`)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Map
                      </a>
                      <a className="btn btn-ghost btn-sm" href={PICKLE_HUB.centers} target="_blank" rel="noopener noreferrer">
                        Rec info
                      </a>
                      {c.phone ? (
                        <a className="btn btn-ghost btn-sm" href={telHref(c.phone)}>
                          Call rec
                        </a>
                      ) : null}
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          const on = value.pickleFavs.includes(c.id);
                          persist({
                            ...value,
                            pickleFavs: on
                              ? value.pickleFavs.filter((id) => id !== c.id)
                              : [...value.pickleFavs, c.id],
                          });
                        }}
                      >
                        {value.pickleFavs.includes(c.id) ? "★ Favorite" : "☆ Favorite"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setPicklePlayCourt(c.name);
                          setPickleSub("play");
                        }}
                      >
                        Play here
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function GolfPlay({
  golf,
  courses,
  initialCourse,
}: {
  golf: ReturnType<typeof useMemberBoard<GolfLogBoard>>;
  courses: GolfCourse[];
  initialCourse: string;
}) {
  const [playTab, setPlayTab] = useState<"scorecard" | "tees" | "pair" | "history">("scorecard");
  const [date, setDate] = useState(todayKey());
  const [course, setCourse] = useState(initialCourse);
  const [holes, setHoles] = useState<9 | 18>(9);
  const [scores, setScores] = useState<(number | "")[]>(Array(9).fill(""));
  const [notes, setNotes] = useState("");
  const [ttDate, setTtDate] = useState("");
  const [ttTime, setTtTime] = useState("");
  const [ttCourse, setTtCourse] = useState(initialCourse);
  const [look, setLook] = useState("");
  const par = Array(holes).fill(3) as number[];
  const total = scores.reduce<number>((s, n) => s + (typeof n === "number" ? n : 0), 0);
  const parTotal = par.reduce((s, n) => s + n, 0);

  function bump(i: number, delta: number) {
    setScores((prev) => {
      const next = [...prev];
      const cur = typeof next[i] === "number" ? (next[i] as number) : 0;
      next[i] = Math.max(1, Math.min(15, cur + delta));
      return next;
    });
  }

  function setHoleCount(n: 9 | 18) {
    setHoles(n);
    setScores((prev) => {
      const next = [...prev];
      while (next.length < n) next.push("");
      return next.slice(0, n);
    });
  }

  return (
    <>
      <p className="panel-hint">
        Keep a card for 9 or 18. Totals update as you go. Tee times and looking-for-a-group save to
        the same Golf log as the rest of My Space. Championship tee times: 3 days ahead at
        GolfTheVillages.com. Day-of, call the shop. Executive greens are in the amenity fee; a trail
        pass is required to use your own cart.
      </p>
      <div className="ms-h-quick" style={{ marginBottom: "0.85rem" }}>
        {(
          [
            ["scorecard", "Scorecard"],
            ["tees", "Tee times"],
            ["pair", "Find a group"],
            ["history", "History"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`ms-h-range-btn ${playTab === id ? "active" : ""}`}
            onClick={() => setPlayTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {playTab === "scorecard" ? (
        <>
      <h4>Scorecard</h4>
      <div className="form-grid ms-module-form">
        <div className="field">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label>Course</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">Pick a Villages course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="ms-h-quick">
        <button type="button" className={`ms-h-range-btn ${holes === 9 ? "active" : ""}`} onClick={() => setHoleCount(9)}>
          9 holes
        </button>
        <button type="button" className={`ms-h-range-btn ${holes === 18 ? "active" : ""}`} onClick={() => setHoleCount(18)}>
          18 holes
        </button>
      </div>
      <div className="ms-score-grid">
        {scores.map((s, i) => (
          <label key={i} className="ms-score-hole">
            <em>
              {i + 1} · par {par[i]}
            </em>
            <span className="ms-score-pm">
              <button type="button" aria-label={`minus hole ${i + 1}`} onClick={() => bump(i, -1)}>
                −
              </button>
              <input
                type="number"
                min={1}
                max={15}
                value={s}
                onChange={(e) => {
                  const next = [...scores];
                  next[i] = e.target.value === "" ? "" : Number(e.target.value);
                  setScores(next);
                }}
              />
              <button type="button" aria-label={`plus hole ${i + 1}`} onClick={() => bump(i, 1)}>
                +
              </button>
            </span>
          </label>
        ))}
      </div>
      <p>
        Out / total <strong>{total || "—"}</strong>
        {" · "}par {parTotal}
        {total ? ` · ${total - parTotal >= 0 ? "+" : ""}${total - parTotal}` : ""}
      </p>
      <div className="field">
        <label>Round notes</label>
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Cart path only · breakfast ball on 3 · beer on 19"
        />
      </div>
      <button
        type="button"
        className="btn btn-primary btn-sm"
        onClick={() => {
          void golf.save({
            ...golf.value,
            rounds: [
              {
                id: uid("gr"),
                date: date || todayKey(),
                course: course || "Villages course",
                holes,
                scores,
                par,
                notes: notes.slice(0, 400),
              },
              ...golf.value.rounds,
            ].slice(0, 60),
          });
          setNotes("");
          setScores(Array(holes).fill(""));
          setPlayTab("history");
        }}
      >
        Save finished round
      </button>
        </>
      ) : null}
      {playTab === "tees" ? (
        <>
      <h4>Tee times</h4>
      <p className="panel-hint">
        Championship: book 3 days ahead at{" "}
        <a href={GOLF_HUB.golfTheVillages} className="text-link" target="_blank" rel="noopener noreferrer">
          GolfTheVillages.com
        </a>
        {" "}or {GOLF_HUB.phone}. Day-of, call the shop. Questions: {GOLF_HUB.questions}. Tuesday is
        Men’s Day and Wednesday is Ladies Day at most championship clubs (priority + GHIN).
      </p>
      <form
        className="form-grid ms-module-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!ttDate || !ttCourse) return;
          void golf.save({
            ...golf.value,
            teeTimes: [
              { id: uid("tt"), date: ttDate, time: ttTime, course: ttCourse, notes: "" },
              ...golf.value.teeTimes,
            ].slice(0, 40),
          });
          setTtDate("");
          setTtTime("");
        }}
      >
        <input type="date" value={ttDate} onChange={(e) => setTtDate(e.target.value)} required />
        <input type="time" value={ttTime} onChange={(e) => setTtTime(e.target.value)} />
        <select value={ttCourse} onChange={(e) => setTtCourse(e.target.value)} required>
          <option value="">Course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary btn-sm">
          Save tee time
        </button>
      </form>
      <ul className="ms-cal-list">
        {golf.value.teeTimes.map((t) => (
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
                void golf.save({
                  ...golf.value,
                  teeTimes: golf.value.teeTimes.filter((x) => x.id !== t.id),
                })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
        </>
      ) : null}
      {playTab === "pair" ? (
        <>
      <h4>Find a group</h4>
      <p className="panel-hint">
        Public foursome board stays free on{" "}
        <Link href="/golf-zone" className="text-link">
          Hub Golf
        </Link>
        . This list is just your personal reminder.
      </p>
      <form
        className="form-grid ms-module-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!look.trim()) return;
          void golf.save({
            ...golf.value,
            looking: [{ id: uid("gl"), text: look.trim(), extra: "" }, ...golf.value.looking].slice(0, 40),
          });
          setLook("");
        }}
      >
        <input value={look} onChange={(e) => setLook(e.target.value)} placeholder="Saturday 8am · 9 holes · Hacienda" />
        <button type="submit" className="btn btn-ghost btn-sm">
          Post
        </button>
      </form>
      <ul className="ms-cal-list">
        {golf.value.looking.map((item) => (
          <li key={item.id}>
            <div>
              <strong>{item.text}</strong>
              {item.extra ? <span>{item.extra}</span> : null}
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                void golf.save({
                  ...golf.value,
                  looking: golf.value.looking.filter((x) => x.id !== item.id),
                })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
        </>
      ) : null}
      {playTab === "history" ? (
        <>
      <h4>History</h4>
      <ul className="ms-cal-list">
        {golf.value.rounds.map((r) => {
          const tot = r.scores.reduce<number>((s, n) => s + (typeof n === "number" ? n : 0), 0);
          const pt = (r.par || []).reduce((s, n) => s + n, 0);
          return (
          <li key={r.id}>
            <div>
              <strong>{r.course}</strong>
              <span>
                {r.date} · {r.holes} holes · {tot || "—"}
                {pt ? ` / par ${pt}` : ""}
                {r.notes ? ` · ${r.notes}` : ""}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                void golf.save({
                  ...golf.value,
                  rounds: golf.value.rounds.filter((x) => x.id !== r.id),
                })
              }
            >
              Remove
            </button>
          </li>
          );
        })}
      </ul>
        </>
      ) : null}
    </>
  );
}

function PicklePlay({
  pickle,
  courts,
  initialCourt,
}: {
  pickle: ReturnType<typeof useMemberBoard<PickleballLogBoard>>;
  courts: PickleCourt[];
  initialCourt: string;
}) {
  const p = pickle.value.profile;
  const [playTab, setPlayTab] = useState<"dupr" | "matches" | "people" | "find">("dupr");
  const [match, setMatch] = useState({
    date: todayKey(),
    time: "",
    format: "Doubles",
    court: initialCourt,
    partner: "",
    opponent: "",
    score: "",
    win: true,
  });
  const [look, setLook] = useState("");
  const [person, setPerson] = useState("");
  const wins = pickle.value.matches.filter((m) => m.win).length;

  return (
    <>
      <p className="panel-hint">
        DUPR ratings and rec matches stay on this account. Official ratings live on{" "}
        <a href={PICKLE_HUB.dupr} className="text-link" target="_blank" rel="noopener noreferrer">
          DUPR.com
        </a>
        {" / "}
        <a href={PICKLE_HUB.duprDash} className="text-link" target="_blank" rel="noopener noreferrer">
          dashboard
        </a>
        — don’t double-book your memory. Game scores are usually to 11, win by 2.
      </p>
      <div className="ms-h-quick" style={{ marginBottom: "0.85rem" }}>
        {(
          [
            ["dupr", "DUPR & record"],
            ["matches", "Matches"],
            ["people", "People"],
            ["find", "Find a game"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`ms-h-range-btn ${playTab === id ? "active" : ""}`}
            onClick={() => setPlayTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {playTab === "dupr" ? (
        <>
      <h4>DUPR &amp; record</h4>
      <div className="ms-stat-row">
        <div className="ms-stat">
          <span>Matches</span>
          <strong>{pickle.value.matches.length}</strong>
        </div>
        <div className="ms-stat">
          <span>Wins</span>
          <strong>{wins}</strong>
        </div>
      </div>
      <div className="form-grid ms-module-form">
        <div className="field">
          <label>Your name</label>
          <input
            value={p.name}
            onChange={(e) =>
              void pickle.save({ ...pickle.value, profile: { ...p, name: e.target.value.slice(0, 60) } })
            }
          />
        </div>
        <div className="field">
          <label>DUPR singles</label>
          <input
            value={p.duprSingles}
            onChange={(e) =>
              void pickle.save({
                ...pickle.value,
                profile: { ...p, duprSingles: e.target.value.slice(0, 8) },
              })
            }
          />
        </div>
        <div className="field">
          <label>DUPR doubles</label>
          <input
            value={p.duprDoubles}
            onChange={(e) =>
              void pickle.save({
                ...pickle.value,
                profile: { ...p, duprDoubles: e.target.value.slice(0, 8) },
              })
            }
          />
        </div>
      </div>
        </>
      ) : null}
      {playTab === "matches" ? (
        <>
      <h4>Log a match</h4>
      <form
        className="form-grid ms-module-form"
        onSubmit={(e) => {
          e.preventDefault();
          void pickle.save({
            ...pickle.value,
            matches: [
              {
                id: uid("pm"),
                date: match.date,
                partner: match.partner,
                opponent: match.opponent,
                score: match.score,
                court: match.court,
                win: match.win,
              },
              ...pickle.value.matches,
            ].slice(0, 80),
          });
          setMatch({ ...match, partner: "", opponent: "", score: "" });
        }}
      >
        <input type="date" value={match.date} onChange={(e) => setMatch({ ...match, date: e.target.value })} />
        <input type="time" value={match.time} onChange={(e) => setMatch({ ...match, time: e.target.value })} />
        <select value={match.format} onChange={(e) => setMatch({ ...match, format: e.target.value })}>
          <option>Doubles</option>
          <option>Singles</option>
        </select>
        <select value={match.court} onChange={(e) => setMatch({ ...match, court: e.target.value })}>
          <option value="">Court / rec center</option>
          {courts.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          value={match.partner}
          onChange={(e) => setMatch({ ...match, partner: e.target.value })}
          placeholder="Partner"
        />
        <input
          value={match.opponent}
          onChange={(e) => setMatch({ ...match, opponent: e.target.value })}
          placeholder="Opponent"
        />
        <input
          value={match.score}
          onChange={(e) => setMatch({ ...match, score: e.target.value })}
          placeholder="11-7, 11-9"
        />
        <label className={match.win ? "on" : ""}>
          <input
            type="checkbox"
            checked={match.win}
            onChange={(e) => setMatch({ ...match, win: e.target.checked })}
          />
          Win
        </label>
        <button type="submit" className="btn btn-primary btn-sm">
          Save match
        </button>
      </form>
      <ul className="ms-cal-list">
        {pickle.value.matches.map((m) => (
          <li key={m.id}>
            <div>
              <strong>
                {m.win ? "W" : "L"} · {m.score || "score?"}
              </strong>
              <span>
                {m.date}
                {m.court ? ` · ${m.court}` : ""}
                {m.partner ? ` · with ${m.partner}` : ""}
                {m.opponent ? ` · vs ${m.opponent}` : ""}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                void pickle.save({
                  ...pickle.value,
                  matches: pickle.value.matches.filter((x) => x.id !== m.id),
                })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
        </>
      ) : null}
      {playTab === "people" ? (
        <>
          <h4>People</h4>
          <p className="panel-hint">Partners, regulars, and the neighbor who always wants one more game.</p>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!person.trim()) return;
              void pickle.save({
                ...pickle.value,
                people: [
                  { id: uid("pp"), name: person.trim().slice(0, 60), notes: "" },
                  ...pickle.value.people,
                ].slice(0, 40),
              });
              setPerson("");
            }}
          >
            <input value={person} onChange={(e) => setPerson(e.target.value)} placeholder="Name" />
            <button type="submit" className="btn btn-primary btn-sm">
              Add
            </button>
          </form>
          <ul className="ms-cal-list">
            {pickle.value.people.map((row) => (
              <li key={row.id}>
                <div>
                  <strong>{row.name}</strong>
                  {row.notes ? <span>{row.notes}</span> : null}
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    void pickle.save({
                      ...pickle.value,
                      people: pickle.value.people.filter((x) => x.id !== row.id),
                    })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {playTab === "find" ? (
        <>
      <h4>Find a game</h4>
      <p className="panel-hint">
        Public “need a paddle” board stays free on{" "}
        <Link href="/pickleball" className="text-link">
          Hub Pickleball
        </Link>
        .
      </p>
      <form
        className="form-grid ms-module-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!look.trim()) return;
          void pickle.save({
            ...pickle.value,
            looking: [{ id: uid("pl"), text: look.trim() }, ...pickle.value.looking].slice(0, 40),
          });
          setLook("");
        }}
      >
        <input value={look} onChange={(e) => setLook(e.target.value)} placeholder="Rohan 8am · 3.5 doubles" />
        <button type="submit" className="btn btn-ghost btn-sm">
          Post
        </button>
      </form>
      <ul className="ms-cal-list">
        {pickle.value.looking.map((item) => (
          <li key={item.id}>
            <div>
              <strong>{item.text}</strong>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                void pickle.save({
                  ...pickle.value,
                  looking: pickle.value.looking.filter((x) => x.id !== item.id),
                })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
        </>
      ) : null}
    </>
  );
}
