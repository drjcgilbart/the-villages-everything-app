"use client";

import { useEffect, useMemo, useState } from "react";
import type { CalTask, CalendarBoard } from "@/lib/memberBoardModel";

type Port = {
  id: string;
  name: string;
  minutes: number;
  drive: string;
  lines: string;
  access: string;
  image: string;
  query: string;
};

const PORTS: Port[] = [
  {
    id: "canaveral",
    name: "Port Canaveral",
    minutes: 105,
    drive: "About 1 hour 45 minutes, clear road",
    lines:
      "Disney and Norwegian are the names neighbors say first. Carnival, Royal Caribbean, and MSC sail from here too. The weekly list is on the port’s own site.",
    access:
      "The port publishes garages and a tram. Tell the cruise line about a wheelchair or scooter when you book the cabin. This page does not publish a shuttle timetable.",
    image: "/graphics/cruises/canaveral.jpg",
    query: "Port Canaveral cruise terminal Florida",
  },
  {
    id: "tampa",
    name: "Port Tampa Bay",
    minutes: 120,
    drive: "About 2 hours, clear road",
    lines:
      "A Gulf sailing when Canaveral’s weekend is gone. Confirm which line is in this month, and confirm the terminal number. They are not the same building.",
    access:
      "Downtown terminals. Ask the cruise line for wheelchair assistance when you book. Photograph the garage row when you park.",
    image: "/graphics/cruises/tampa.jpg",
    query: "Port Tampa Bay cruise terminals",
  },
  {
    id: "jacksonville",
    name: "JAXPORT",
    minutes: 135,
    drive: "A bit over 2 hours, clear road",
    lines:
      "Carnival has been the line most Villages neighbors find here. Fewer ships, which is why embarkation morning is calmer. A ship that used to leave here may have moved.",
    access:
      "A smaller terminal. Same rule: tell the cruise line about a scooter when you book. Look up the current sailing before the group commits.",
    image: "/graphics/cruises/jacksonville.jpg",
    query: "JAXPORT cruise terminal Jacksonville Florida",
  },
  {
    id: "everglades",
    name: "Port Everglades",
    minutes: 240,
    drive: "About 4 hours, clear road",
    lines:
      "Royal Caribbean and Carnival both sail from Fort Lauderdale, along with Celebrity, Holland America, Princess, and Disney. Stay the night before. The morning drive is how people miss the ship.",
    access:
      "Some garage walks are long. Ask the line for assistance and a cabin near an elevator. Parking is listed on the port site, not on a hotel brochure.",
    image: "/graphics/cruises/everglades.jpg",
    query: "Port Everglades cruise terminal Fort Lauderdale",
  },
  {
    id: "miami",
    name: "PortMiami",
    minutes: 270,
    drive: "About 4 hours 30 minutes, clear road",
    lines:
      "Royal Caribbean and Carnival are the busy ones people make the drive for. Norwegian, MSC, Virgin, and Celebrity have ships here too. The ship you specifically wanted often sails from Miami and nowhere else in Florida.",
    access:
      "The terminals sit on a causeway. The building number on your documents is the plan. Request assistance when you book. A same-day drive home is a long one.",
    image: "/graphics/cruises/miami.jpg",
    query: "PortMiami cruise terminals",
  },
];

const CHECKS = [
  { id: "passport", label: "Passport book checked, and the name matches the ticket" },
  { id: "meds", label: "Medications in the carry-on, not the suitcase the ship takes overnight" },
  { id: "docs", label: "Online check-in done, and the arrival window is on the calendar" },
  { id: "pack", label: "Reef-safe sunscreen, a light layer for the dining room, and shoes that can get wet" },
  { id: "plug", label: "No power strip until the cruise line says yes" },
  { id: "motion", label: "The cruise line knows about a scooter or wheelchair" },
];

type Friend = { id: string; name: string; cabin: string; dining: string };
type Photo = {
  id: string;
  ship: string;
  port: string;
  caption: string;
  by: string;
  image: string;
};

function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function trafficPad(portId: string, date: string, time: string) {
  if (!date || !time) return { minutes: 15, why: "A small cushion. The maps app still wins the morning of." };
  const day = new Date(`${date}T${time}:00`).getDay();
  const hour = Number(time.slice(0, 2));
  const south = portId === "everglades" || portId === "miami" || portId === "tampa";
  if (day === 5 && hour >= 12) {
    return {
      minutes: south ? 50 : portId === "canaveral" ? 30 : 25,
      why: "Friday afternoon. The coast fills up, and I-75 does not care about your muster drill.",
    };
  }
  if (day === 6) {
    return { minutes: 20, why: "Saturday. Beach traffic plus everyone else who also had this idea." };
  }
  if (hour < 11) {
    return { minutes: 20, why: "Sail morning. The terminal line starts when the whole town leaves at once." };
  }
  return { minutes: 15, why: "A small cushion. The maps app still wins the morning of." };
}

function leaveBy(date: string, time: string, totalMinutes: number) {
  if (!date || !time) return null;
  const start = new Date(`${date}T${time}:00`);
  if (Number.isNaN(start.getTime())) return null;
  start.setMinutes(start.getMinutes() - totalMinutes);
  return {
    date: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
    time: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
  };
}

function formatWhen(date: string, time: string) {
  const d = new Date(`${date}T${time}:00`);
  return d.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

async function shrinkPhoto(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read that photo. Save it as a JPG and try again."));
      el.src = url;
    });
    const scale = Math.min(1, 900 / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not prepare that photo.");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.62);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function CruiseHarbor() {
  const [portId, setPortId] = useState("canaveral");
  const [sailDate, setSailDate] = useState("");
  const [boardTime, setBoardTime] = useState("11:00");
  const [mapsMinutes, setMapsMinutes] = useState("");
  const [calNote, setCalNote] = useState<string | null>(null);
  const [calBusy, setCalBusy] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [passport, setPassport] = useState("");
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friend, setFriend] = useState({ name: "", cabin: "", dining: "" });
  const [groupName, setGroupName] = useState("The card group");
  const [copied, setCopied] = useState(false);
  const [storms, setStorms] = useState<{ name: string; classification: string; advisory: string }[] | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [ship, setShip] = useState("");
  const [caption, setCaption] = useState("");
  const [photoNote, setPhotoNote] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);

  const port = PORTS.find((row) => row.id === portId) || PORTS[0];
  const padInfo = trafficPad(port.id, sailDate, boardTime);
  const typed = Number(mapsMinutes);
  const driveMinutes = Number.isFinite(typed) && typed > 0 ? Math.round(typed) : port.minutes;
  const total = driveMinutes + padInfo.minutes + 40;
  const leave = useMemo(() => leaveBy(sailDate, boardTime, total), [sailDate, boardTime, total]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tvea-cruise-check");
      if (saved) setChecks(JSON.parse(saved) as Record<string, boolean>);
      const group = localStorage.getItem("tvea-cruise-group");
      if (group) {
        const parsed = JSON.parse(group) as { name?: string; friends?: Friend[] };
        if (parsed.name) setGroupName(parsed.name);
        if (Array.isArray(parsed.friends)) setFriends(parsed.friends);
      }
    } catch {
      /* a private window can refuse storage */
    }
    void fetch("/api/cruises/storms")
      .then((res) => res.json())
      .then((json: { storms?: { name: string; classification: string; advisory: string }[] | null }) => {
        setStorms(json.storms || []);
      })
      .catch(() => setStorms([]));
    void fetch("/api/cruises/gallery", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: { photos?: Photo[] }) => setPhotos(json.photos || []))
      .catch(() => setPhotos([]));
  }, []);

  useEffect(() => {
    localStorage.setItem("tvea-cruise-check", JSON.stringify(checks));
  }, [checks]);

  useEffect(() => {
    localStorage.setItem("tvea-cruise-group", JSON.stringify({ name: groupName, friends }));
  }, [groupName, friends]);

  const passportWarn = useMemo(() => {
    if (!passport || !sailDate) return "";
    const exp = new Date(`${passport}T12:00:00`);
    const sail = new Date(`${sailDate}T12:00:00`);
    if (Number.isNaN(exp.getTime()) || Number.isNaN(sail.getTime())) return "";
    const months = (exp.getTime() - sail.getTime()) / (1000 * 60 * 60 * 24 * 30);
    if (months < 0) return "That passport is already expired on sail day. The ship will notice.";
    if (months < 6) return "Many lines want six months left on the book. Yours is inside that window. Ask the line before you pack the snorkel.";
    return "Six months of passport left on sail day. Still match the name to the ticket.";
  }, [passport, sailDate]);

  async function saveLeaveBy() {
    if (!leave) {
      setCalNote("Pick the sail date and the boarding time first.");
      return;
    }
    setCalBusy(true);
    setCalNote(null);
    try {
      const res = await fetch("/api/members/space/boards", { cache: "no-store", credentials: "include" });
      if (res.status === 401) {
        setCalNote("Sign in first. The personal planner keeps the leave-by time so it does not land on top of pickleball.");
        return;
      }
      const json = (await res.json()) as { boards?: { calendar?: CalendarBoard } };
      const tasks = json.boards?.calendar?.tasks || [];
      const row: CalTask = {
        id: `cal-cruise-${Date.now().toString(36)}`,
        title: `Leave for ${port.name}`,
        notes: `Boarding ${boardTime}. About ${total} minutes door to terminal, including the garage cushion. Confirm the ship the night before.`,
        startDate: leave.date,
        startTime: leave.time,
        endDate: sailDate,
        endTime: boardTime,
        timerMinutes: null,
        timerEndsAt: null,
        timerPausedMs: null,
        alarmEnabled: true,
        done: false,
      };
      const saved = await fetch("/api/members/space/boards", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ board: "calendar", data: { tasks: [row, ...tasks].slice(0, 80) } }),
      });
      const body = (await saved.json().catch(() => ({}))) as { error?: string };
      if (!saved.ok) {
        setCalNote(
          saved.status === 403
            ? "The personal planner is on Lanai Legend. The leave-by time is still on this page."
            : body.error || "The calendar did not take that reminder."
        );
        return;
      }
      setCalNote("On the personal planner. Pickleball can argue with a ship, and the ship will win.");
    } catch {
      setCalNote("The calendar did not answer. The leave-by time is still on this page.");
    } finally {
      setCalBusy(false);
    }
  }

  function addFriend() {
    const name = friend.name.trim();
    if (!name) return;
    setFriends((rows) => [
      ...rows,
      {
        id: `pal-${Date.now().toString(36)}`,
        name: name.slice(0, 40),
        cabin: friend.cabin.trim().slice(0, 80),
        dining: friend.dining.trim().slice(0, 40),
      },
    ]);
    setFriend({ name: "", cabin: "", dining: "" });
  }

  async function copyGroup() {
    const lines = [
      groupName,
      `${port.name} · sail ${sailDate || "date still a rumor"} · board ${boardTime}`,
      ...friends.map((row) => `${row.name}: cabin ${row.cabin || "undecided"}, dining ${row.dining || "undecided"}`),
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function sharePhoto(file: File | null) {
    if (!file) return;
    setPhotoBusy(true);
    setPhotoNote(null);
    try {
      const image = await shrinkPhoto(file);
      const res = await fetch("/api/cruises/gallery", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ship, port: port.name, caption, image }),
      });
      const json = (await res.json()) as { photos?: Photo[]; error?: string };
      if (!res.ok) {
        setPhotoNote(json.error || "The gallery did not take that one.");
        return;
      }
      setPhotos(json.photos || []);
      setCaption("");
      setShip("");
      setPhotoNote("Hung on the wall. Tag the ship so the next group knows which buffet to fear.");
    } catch (err) {
      setPhotoNote(err instanceof Error ? err.message : "The gallery did not take that one.");
    } finally {
      setPhotoBusy(false);
    }
  }

  return (
    <>
      <section className="section" id="cruise-drive" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>When to leave the house</h2>
              <p>
                Clear-road times start from the middle of The Villages, the same figures as the port cards.
                Friday traffic gets a cushion. If maps just gave you a number, type it in and that number wins.
              </p>
            </div>
          </div>
          <div className="about-panel cruise-desk">
            <label>
              Port
              <select value={portId} onChange={(event) => setPortId(event.target.value)}>
                {PORTS.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Sail date
              <input type="date" value={sailDate} onChange={(event) => setSailDate(event.target.value)} />
            </label>
            <label>
              Boarding time
              <input type="time" value={boardTime} onChange={(event) => setBoardTime(event.target.value)} />
            </label>
            <label>
              Minutes from maps, if you just looked
              <input
                inputMode="numeric"
                placeholder={String(port.minutes)}
                value={mapsMinutes}
                onChange={(event) => setMapsMinutes(event.target.value)}
              />
            </label>
            <p>
              <strong>{port.drive}.</strong> {padInfo.why} Plus 40 minutes to find the garage and the right terminal.
              Plan on about {Math.floor(total / 60)} hours
              {total % 60 ? ` ${total % 60} minutes` : ""}.
            </p>
            {leave ? (
              <p className="cruise-leave">
                Leave by {formatWhen(leave.date, leave.time)}.
                {leave.date !== sailDate ? " That is the day before. The ship does not wait for a town square." : ""}
              </p>
            ) : (
              <p>Add the sail date and the leave-by line will show up.</p>
            )}
            <div className="hero-actions">
              <button type="button" className="btn btn-primary" disabled={calBusy} onClick={() => void saveLeaveBy()}>
                {calBusy ? "Saving…" : "Put the leave-by time on my calendar"}
              </button>
              <a className="btn btn-ghost" href={maps(port.query)} target="_blank" rel="noopener noreferrer">
                Directions
              </a>
            </div>
            {calNote ? <p>{calNote}</p> : null}
          </div>
        </div>
      </section>

      <section className="section" id="cruise-compare" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Which port, which ships</h2>
              <p>
                Disney and Norwegian are the Canaveral conversation. Royal Caribbean and Carnival are why people
                drive to Miami and Fort Lauderdale. The port cards above still have the longer list. Ships move.
              </p>
            </div>
          </div>
          <div className="ms-boat-grid">
            {PORTS.map((row) => (
              <article key={row.id} className="about-panel trip-card cruise-compare">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={row.image} alt="" />
                <div className="trip-card-body">
                  <p className="ms-boat-meta">{row.drive}</p>
                  <h3>{row.name}</h3>
                  <p>{row.lines}</p>
                  <a className="btn btn-primary btn-sm" href={maps(row.query)} target="_blank" rel="noopener noreferrer">
                    Directions
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="cruise-pack" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Before you tell the group you are packed</h2>
              <p>
                A Florida cruise is heat, a dining room that thinks it is November, and one suitcase the ship
                takes away the night you need the toothbrush.
              </p>
            </div>
          </div>
          <div className="about-panel cruise-desk">
            <label>
              Passport expiration
              <input type="date" value={passport} onChange={(event) => setPassport(event.target.value)} />
            </label>
            {passportWarn ? <p>{passportWarn}</p> : null}
            <ul className="cruise-checks">
              {CHECKS.map((item) => (
                <li key={item.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={!!checks[item.id]}
                      onChange={(event) =>
                        setChecks((current) => ({ ...current, [item.id]: event.target.checked }))
                      }
                    />
                    {item.label}
                  </label>
                </li>
              ))}
            </ul>
            <h3>What to pack, Florida edition</h3>
            <p>
              A hat that will not fly into the pool, sandals you can walk a pier in, one nicer outfit, and a
              sweater for the dining room air conditioning. Medications stay in the bag you carry on. Sunscreen
              goes on before the sail-away photo, not after the shoulders have opinions. Leave the power strip
              at home until the cruise line’s packing list says yes. The birth-certificate rule for a closed-loop
              cruise is already on the documents card. The passport book is still the document that saves a
              ruined flight home.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="cruise-group" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>The group travels in a pack</h2>
              <p>
                This does not book the cabin. It keeps the friends, the cabin wishes, and the dining time in one
                note you can paste into the group text before someone reserves a table for two by accident.
              </p>
            </div>
          </div>
          <div className="about-panel cruise-desk">
            <label>
              Group name
              <input value={groupName} onChange={(event) => setGroupName(event.target.value)} />
            </label>
            <label>
              Friend
              <input
                value={friend.name}
                placeholder="Name"
                onChange={(event) => setFriend((row) => ({ ...row, name: event.target.value }))}
              />
            </label>
            <label>
              Cabin wish
              <input
                value={friend.cabin}
                placeholder="Connecting, balcony, near the elevator"
                onChange={(event) => setFriend((row) => ({ ...row, cabin: event.target.value }))}
              />
            </label>
            <label>
              Dining time
              <input
                value={friend.dining}
                placeholder="Early, late, or whenever the line allows"
                onChange={(event) => setFriend((row) => ({ ...row, dining: event.target.value }))}
              />
            </label>
            <div className="hero-actions">
              <button type="button" className="btn btn-primary" onClick={addFriend}>
                Add to the pack
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => void copyGroup()}>
                {copied ? "Copied" : "Copy the plan"}
              </button>
            </div>
            {friends.length ? (
              <ul className="cruise-checks">
                {friends.map((row) => (
                  <li key={row.id}>
                    <strong>{row.name}</strong>
                    {row.cabin ? ` · ${row.cabin}` : ""}
                    {row.dining ? ` · dining ${row.dining}` : ""}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nobody is on the list yet. The ship will still sail.</p>
            )}
          </div>
        </div>
      </section>

      <section className="section" id="cruise-access" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Getting from the car to the gangway</h2>
              <p>
                Scooters are common here. Cabin doors, tenders, and shore days are not all the same width.
                Ask the cruise line when you book. The port site wins over a rumor in the group text.
              </p>
            </div>
          </div>
          <div className="ms-boat-grid">
            {PORTS.map((row) => (
              <article key={row.id} className="about-panel">
                <h3>{row.name}</h3>
                <p>{row.access}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="cruise-weather" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Storms, before the group chat decides</h2>
              <p>
                Florida sailings get moved. This is the National Hurricane Center’s current Atlantic list, not a
                promise about your Tuesday. Read the advisory, then read the cruise line.
              </p>
            </div>
          </div>
          <div className="about-panel cruise-desk">
            {storms === null ? <p>Checking the hurricane center…</p> : null}
            {storms && storms.length === 0 ? (
              <p>No named Atlantic system on the current bulletin. Check again the week you sail.</p>
            ) : null}
            {storms && storms.length > 0 ? (
              <ul className="cruise-checks">
                {storms.map((storm) => (
                  <li key={storm.name}>
                    <a href={storm.advisory} target="_blank" rel="noopener noreferrer">
                      {storm.name}
                      {storm.classification ? ` (${storm.classification})` : ""}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
            <a className="btn btn-ghost" href="https://www.nhc.noaa.gov/" target="_blank" rel="noopener noreferrer">
              National Hurricane Center
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="cruise-photos" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Back from the ship</h2>
              <p>
                Hang the photo, name the ship, and skip the algorithm. Maximum chaos is allowed. A caption that
                only says “food” is also allowed.
              </p>
            </div>
          </div>
          <div className="about-panel cruise-desk">
            <label>
              Ship
              <input value={ship} onChange={(event) => setShip(event.target.value)} placeholder="The ship, not the buffet" />
            </label>
            <label>
              Caption
              <input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="What the photo is actually of" />
            </label>
            <label>
              Photo
              <input
                type="file"
                accept="image/*"
                disabled={photoBusy}
                onChange={(event) => {
                  const file = event.target.files?.[0] || null;
                  event.target.value = "";
                  void sharePhoto(file);
                }}
              />
            </label>
            {photoNote ? <p>{photoNote}</p> : null}
          </div>
          <div className="ms-boat-grid" style={{ marginTop: "1rem" }}>
            {photos.map((photo) => (
              <article key={photo.id} className="about-panel trip-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.image} alt="" />
                <div className="trip-card-body">
                  <p className="ms-boat-meta">{photo.ship}{photo.port ? ` · ${photo.port}` : ""}</p>
                  <h3>{photo.caption}</h3>
                  <p className="ms-boat-meta">{photo.by}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
