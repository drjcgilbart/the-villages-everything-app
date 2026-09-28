"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { saveCapeReminder } from "@/lib/capeCalendar";

const DESTINATIONS = [
  {
    id: "canaveral",
    name: "Port Canaveral",
    minutes: 105,
    drive: "About 1 hour 45 minutes",
    query: "Port Canaveral Florida",
  },
  {
    id: "ksc",
    name: "Kennedy Space Center Visitor Complex",
    minutes: 105,
    drive: "About 1 hour 45 minutes",
    query: "Kennedy Space Center Visitor Complex",
  },
  {
    id: "titusville",
    name: "Titusville launch viewing",
    minutes: 90,
    drive: "About 1 hour 30 minutes",
    query: "Space View Park Titusville Florida",
  },
];

function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function trafficPad(date: string, time: string) {
  if (!date || !time) return { minutes: 20, why: "A small cushion. Launch mornings fill the eastbound roads." };
  const day = new Date(`${date}T${time}:00`).getDay();
  const hour = Number(time.slice(0, 2));
  if (day === 5 && hour >= 12) return { minutes: 35, why: "Friday afternoon. The coast fills up before the countdown does." };
  if (day === 0 || day === 6) return { minutes: 25, why: "Weekend. Beach traffic and launch traffic are the same highway." };
  if (hour < 9) return { minutes: 20, why: "A launch morning. Leave earlier than the map’s cheerful estimate." };
  return { minutes: 15, why: "A small cushion. Maps still win the morning you drive." };
}
function leaveBy(date: string, time: string, total: number) {
  if (!date || !time) return null;
  const start = new Date(`${date}T${time}:00`);
  if (Number.isNaN(start.getTime())) return null;
  start.setMinutes(start.getMinutes() - total);
  return {
    date: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-${pad(start.getDate())}`,
    time: `${pad(start.getHours())}:${pad(start.getMinutes())}`,
  };
}
function formatWhen(date: string, time: string) {
  return new Date(`${date}T${time}:00`).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
function kidPlan(age: string) {
  if (age === "little") {
    return "One hall. The shuttle building is the one they talk about later. A full bus tour plus every exhibit is how a short person files a formal complaint. A launch-viewing package and a regular ticket are different purchases.";
  }
  if (age === "kid") {
    return "Atlantis, then one more hall if the legs still agree. The bus tour, when it is running, is the seated stretch. Stop before the gift shop becomes the whole personality of the day.";
  }
  return "They can do the complex. Still read which ticket is in the cart. General admission and a launch-viewing package are not the same afternoon.";
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

export function SpaceCoastDesk() {
  const [destId, setDestId] = useState("ksc");
  const [whenDate, setWhenDate] = useState("");
  const [whenTime, setWhenTime] = useState("09:00");
  const [mapsMinutes, setMapsMinutes] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [age, setAge] = useState("kid");
  const [storms, setStorms] = useState<{ name: string; classification: string; advisory: string }[] | null>(null);
  const [photos, setPhotos] = useState<{ id: string; launch: string; caption: string; by: string; image: string }[]>([]);
  const [launchName, setLaunchName] = useState("");
  const [caption, setCaption] = useState("");
  const [photoNote, setPhotoNote] = useState<string | null>(null);

  const dest = DESTINATIONS.find((row) => row.id === destId) || DESTINATIONS[0];
  const padInfo = trafficPad(whenDate, whenTime);
  const typed = Number(mapsMinutes);
  const driveMinutes = Number.isFinite(typed) && typed > 0 ? Math.round(typed) : dest.minutes;
  const total = driveMinutes + padInfo.minutes + 15;
  const leave = useMemo(() => leaveBy(whenDate, whenTime, total), [whenDate, whenTime, total]);

  useEffect(() => {
    void fetch("/api/cruises/storms")
      .then((res) => res.json())
      .then((json: { storms?: { name: string; classification: string; advisory: string }[] | null }) => setStorms(json.storms || []))
      .catch(() => setStorms([]));
    void fetch("/api/launches/gallery", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: { photos?: typeof photos }) => setPhotos(json.photos || []))
      .catch(() => setPhotos([]));
  }, []);

  async function sharePhoto(file: File | null) {
    if (!file) return;
    setBusy(true);
    setPhotoNote(null);
    try {
      const image = await shrinkPhoto(file);
      const res = await fetch("/api/launches/gallery", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ launch: launchName, caption, image }),
      });
      const json = (await res.json()) as { photos?: typeof photos; error?: string };
      if (!res.ok) {
        setPhotoNote(json.error || "The gallery did not take that one.");
        return;
      }
      setPhotos(json.photos || []);
      setCaption("");
      setLaunchName("");
      setPhotoNote("Hung on the wall. A scrub still counts as a story.");
    } catch (err) {
      setPhotoNote(err instanceof Error ? err.message : "The gallery did not take that one.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="ms-boat-section-art" id="ms-space-drive">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/cruises/launch.jpg" alt="" />
        <h3 className="my-space-block-title">When to leave</h3>
      </div>
      <div className="about-panel cruise-desk">
        <label>
          Where
          <select value={destId} onChange={(event) => setDestId(event.target.value)}>
            {DESTINATIONS.map((row) => (
              <option key={row.id} value={row.id}>{row.name}</option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={whenDate} onChange={(event) => setWhenDate(event.target.value)} />
        </label>
        <label>
          Be there by
          <input type="time" value={whenTime} onChange={(event) => setWhenTime(event.target.value)} />
        </label>
        <label>
          Minutes from maps, if you just looked
          <input inputMode="numeric" placeholder={String(dest.minutes)} value={mapsMinutes} onChange={(event) => setMapsMinutes(event.target.value)} />
        </label>
        <p>
          <strong>{dest.drive}, clear road, from the middle of The Villages.</strong> {padInfo.why} Plus 15 minutes to park without inventing a shoulder.
          Plan on about {Math.floor(total / 60)} hours{total % 60 ? ` ${total % 60} minutes` : ""}.
        </p>
        {leave ? <p className="cruise-leave">Leave by {formatWhen(leave.date, leave.time)}.</p> : <p>Add the date and the leave-by line will show up.</p>}
        <div className="hero-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy}
            onClick={() => {
              if (!leave) {
                setNote("Pick the date and the time first.");
                return;
              }
              setBusy(true);
              void saveCapeReminder({
                title: `Leave for ${dest.name}`,
                notes: `Be there by ${whenTime}. About ${total} minutes, including the cushion. A Go can still scrub.`,
                startDate: leave.date,
                startTime: leave.time,
                endDate: whenDate,
                endTime: whenTime,
                timerMinutes: null,
                timerEndsAt: null,
                timerPausedMs: null,
                alarmEnabled: true,
                done: false,
              }).then((message) => {
                setNote(message);
                setBusy(false);
              });
            }}
          >
            {busy ? "Saving…" : "Put the leave-by time on my calendar"}
          </button>
          <a className="btn btn-ghost" href={maps(dest.query)} target="_blank" rel="noopener noreferrer">Directions</a>
          <Link className="btn btn-ghost" href="/golf-cart-hero">Beat the drive home in Golf Cart Hero</Link>
        </div>
        {note ? <p>{note}</p> : null}
      </div>

      <div className="ms-boat-section-art" id="ms-space-guides">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/day-trips/beach.jpg" alt="" />
        <h3 className="my-space-block-title">SpaceX and NASA, where to stand</h3>
      </div>
      <div className="ms-boat-grid">
        <article className="about-panel ms-boat-card">
          <h3>SpaceX</h3>
          <p>
            A Falcon from Launch Complex 39A is a Titusville lawn: Space View Park first, then Sand Point or Rotary Riverfront when that grass is already chairs. Falcon Heavy uses 39A too. A Falcon from SLC-40 faces the southern pads, so Cocoa Beach, Jetty Park, and State Road 401 are the seats. The tracker names the pad. There is no published headcount here. A popular night launch fills the free lawns. Arrive early, park in a real space, and do not stop on the Max Brewer Bridge.
          </p>
          <a className="btn btn-primary btn-sm" href="#ms-space-watch">The viewing spots</a>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>NASA</h3>
          <p>
            Artemis leaves from Launch Complex 39B when the mission is real. That is a rare day. The west-bank parks in Titusville are the free seats for a 39B or 39A flight. A Visitor Complex launch-viewing package is a different ticket from a regular day inside the gates. Playalinda is closer to 39A and often closes. If the beach gate is shut, Titusville still works.
          </p>
          <a className="btn btn-ghost btn-sm" href="https://www.nasa.gov/" target="_blank" rel="noopener noreferrer">NASA</a>
        </article>
      </div>

      <div className="ms-boat-section-art" id="ms-space-kids">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/day-trips/ksc.jpg" alt="" />
        <h3 className="my-space-block-title">Kennedy with grandkids</h3>
      </div>
      <div className="about-panel cruise-desk">
        <label>
          Youngest in the car
          <select value={age} onChange={(event) => setAge(event.target.value)}>
            <option value="little">Under 5</option>
            <option value="kid">5 to 8</option>
            <option value="bigger">9 and up</option>
          </select>
        </label>
        <p>{kidPlan(age)}</p>
        <p>
          Tickets, bus-tour days, and launch-viewing packages are on the Kennedy Space Center site. This page will not invent today’s price. One hall is a victory. The whole campus plus a night launch is a negotiation.
        </p>
        <a className="btn btn-primary btn-sm" href="https://www.kennedyspacecenter.com/" target="_blank" rel="noopener noreferrer">
          Kennedy Space Center
        </a>
      </div>

      <div className="ms-boat-section-art" id="ms-space-weather">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/cruises/launch.jpg" alt="" />
        <h3 className="my-space-block-title">Weather can scrub the show</h3>
      </div>
      <div className="about-panel cruise-desk">
        <p>
          A named storm is a reason to read the advisory and the launch page. An ordinary Florida thunderstorm is a reason a countdown slips. The range decides. Look again the morning you drive.
        </p>
        {storms === null ? <p>Checking the hurricane center…</p> : null}
        {storms && storms.length === 0 ? <p>No named Atlantic system on the current bulletin. A scrub can still happen without a name.</p> : null}
        {storms && storms.length > 0 ? (
          <ul className="cruise-checks">
            {storms.map((storm) => (
              <li key={storm.name}>
                <a href={storm.advisory} target="_blank" rel="noopener noreferrer">
                  {storm.name}{storm.classification ? ` (${storm.classification})` : ""}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <a className="btn btn-ghost" href="https://www.nhc.noaa.gov/" target="_blank" rel="noopener noreferrer">National Hurricane Center</a>
      </div>

      <div className="ms-boat-section-art" id="ms-space-photos">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/day-trips/ksc.jpg" alt="" />
        <h3 className="my-space-block-title">After the fire</h3>
      </div>
      <div className="about-panel cruise-desk">
        <p>Hang the photo, name the launch, and skip the algorithm. A scrub photo is still a photo. Maximum chaos is allowed.</p>
        <label>
          Launch
          <input value={launchName} onChange={(event) => setLaunchName(event.target.value)} placeholder="The rocket, or the scrub" />
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
            disabled={busy}
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
              <p className="ms-boat-meta">{photo.launch}</p>
              <h3>{photo.caption}</h3>
              <p className="ms-boat-meta">{photo.by}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
