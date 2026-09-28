"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { saveCapeReminder } from "@/lib/capeCalendar";

const WATERS = [
  {
    id: "harris",
    name: "Lake Harris",
    minutes: 30,
    drive: "About 30 minutes",
    ramp: "Ski Beach at Venetian Gardens, Leesburg",
    address: "201 E. Lake Harris Drive, Leesburg, FL 34748",
    parking:
      "A city park lot inside Venetian Gardens. If the trailers have it full, Singletary Park at 1902 South 14th Street is the other Leesburg ramp on Harris, and it has a parking lot. Venetian Cove at 109 E. Dixie Avenue is a third launch in the same park system.",
    fee: "The Leesburg facilities page does not post a launch fee. Read the sign at the lot.",
    restroom: "Ski Beach lists restrooms, a beach, and docks. The Venetian Cove ramp line does not.",
    hours: "Sunrise to sunset, and the city says you may launch after hours. The park itself is listed 7 a.m. to 10 p.m.",
    pin: "The city page gives the street address and no GPS pin. Maps drops the pin from the address.",
    source: "https://www.leesburgflorida.gov/activities/recreation/facility_rentals/",
    sourceLabel: "City of Leesburg facilities",
    query: "201 E Lake Harris Drive Leesburg Florida boat ramp",
  },
  {
    id: "griffin",
    name: "Lake Griffin",
    minutes: 30,
    drive: "About 30 minutes to Leesburg",
    ramp: "Herlong Park, or Lake Griffin State Park if you want the floating dock",
    address: "Herlong Park, 700 East North Blvd., Leesburg, FL 34748. State park, 3089 U.S. Highway 441-27, Fruitland Park, FL 34731.",
    parking:
      "Herlong is a city park whose canals connect to Lake Griffin. The state park has a double-wide concrete ramp for trailers up to 25 feet. That lake is about a mile from the ramp by canal. Fruitland Park is the next town up U.S. 441, so the drive can run a little past the Leesburg figure. Maps wins.",
    fee: "Herlong’s city page does not post a launch fee. State park admission is $5 a vehicle, or $4 if you are alone in it.",
    restroom:
      "The state park has accessible restrooms in the picnic area. Herlong’s ramp listing names pavilions, picnic tables, water taps, and grills, and does not name a restroom.",
    hours: "Herlong: sunrise to sunset, launch allowed after hours. State park: 8 a.m. to sundown. After dark there needs a pass from the ranger station.",
    pin: "Neither page publishes a GPS pin. Use the street address.",
    source: "https://www.floridastateparks.org/parks-and-trails/lake-griffin-state-park/hours-fees",
    sourceLabel: "State park hours and fees",
    source2: "https://www.leesburgflorida.gov/activities/recreation/facility_rentals/",
    sourceLabel2: "Herlong Park, City of Leesburg",
    query: "Herlong Park boat ramp Leesburg Florida",
  },
  {
    id: "eustis",
    name: "Lake Eustis",
    minutes: 40,
    drive: "About 40 minutes, a planning figure",
    ramp: "The City of Eustis boat ramps on Lakeshore Drive",
    address: "Lakeshore Drive, Eustis. The city names the ramps and does not print a street number on the notices that mention them.",
    parking:
      "Trailer parking is at those ramps. Ferran Park, next door at 50 Ferran Park Drive, is the waterfront park with a kayak launch. It is not the trailer stall. Eustis sits past Leesburg, which is why 40 minutes is only a planning figure.",
    fee: "A current launch fee is not on the city pages that name these ramps. Read the sign.",
    restroom: "Ferran Park lists toilets. That is the park, not a promise about a building at the ramp.",
    hours: "The city has closed the Lakeshore Drive ramps for races and storms, then reopened them. Look before you tow.",
    pin: "Ferran Park’s city map pin is 28.855, -81.686. That pin is the park.",
    source: "https://www.eustis.org/Parks/Ferran-Park",
    sourceLabel: "Ferran Park, City of Eustis",
    query: "Eustis boat ramp Lakeshore Drive Florida",
  },
  {
    id: "withlacoochee",
    name: "Withlacoochee River",
    minutes: 45,
    drive: "About 45 minutes",
    ramp: "Inglis Dam: Lake Rousseau on the upstream side, the river on the downstream side",
    address: "10905 W. Riverwood Drive, Crystal River, FL 34428",
    parking:
      "Paved lots on both sides of the dam. Upstream is Lake Rousseau. Downstream is about a mile of the Withlacoochee to the barge canal. Rousseau has submerged stumps. Stay in the marked channel. The lock toward the Gulf keeps its own hours.",
    fee: "Florida State Parks lists no fee.",
    restroom: "The amenities page lists an accessible ramp, accessible parking, and picnic shelters. It does not list a restroom. Look when you arrive.",
    hours: "8 a.m. to sunset, every day.",
    pin: "The state parks page gives the street address and no GPS pin.",
    source: "https://www.floridastateparks.org/parks-and-trails/inglis-dam-island-recreation-area",
    sourceLabel: "Inglis Dam, Florida State Parks",
    query: "10905 W Riverwood Drive Crystal River Florida boat ramp",
  },
];

const BAIT = [
  {
    title: "Speckled perch",
    text: "Cold water. Small jigs and live minnows. Panasoffkee and the Harris Chain are the waters this page already names for them.",
  },
  {
    title: "Largemouth",
    text: "Spring, and the pads on Tsala and Panasoffkee. A plastic worm, or a topwater while the morning is still quiet.",
  },
  {
    title: "Bluegill and shellcracker",
    text: "Worms and crickets near the pads. The fish that were not invited are still the ones that save a slow morning.",
  },
  {
    title: "Once you clear the rivers",
    text: "Shrimp and cut bait for the redfish and trout already on the saltwater card. Sheepshead show up when the water cools.",
  },
];

const PACK = [
  { id: "jacket", label: "Life jacket on before the truck comes off the trailer" },
  { id: "kill", label: "Kill switch clipped" },
  { id: "id", label: "Florida ID if you are using the age-65 license exemption" },
  { id: "sun", label: "Sunscreen and a hat. The water reflects the sun back at you." },
  { id: "water", label: "Water, and more water than the cooler thinks you need" },
  { id: "meds", label: "Medications in the dry bag" },
  { id: "rain", label: "A rain jacket. The afternoon boom is not a surprise." },
  { id: "light", label: "Lights if there is any chance you are still out at dusk" },
];

function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function trafficPad(date: string, time: string) {
  if (!date || !time) return { minutes: 10, why: "A small cushion for the ramp line." };
  const day = new Date(`${date}T${time}:00`).getDay();
  const hour = Number(time.slice(0, 2));
  if ((day === 0 || day === 6) && hour < 10) {
    return { minutes: 20, why: "Weekend morning. The good ramp fills with trailers before the fish wake up." };
  }
  if (hour >= 13) return { minutes: 15, why: "Afternoon. You are racing the thunder more than the traffic." };
  return { minutes: 10, why: "A small cushion for the ramp line." };
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
function skyWords(code: number | null) {
  if (code == null) return null;
  if (code === 0) return "The code over town is clear.";
  if (code <= 3) return "Some clouds over town.";
  if (code === 45 || code === 48) return "Fog is in the code. The ramp can hide the trailer in front of you.";
  if (code >= 95) return "Thunder is in the code. Stay off the chain.";
  if (code >= 80) return "Showers are in the code.";
  if (code >= 51) return "Rain is in the code.";
  return "The sky code is odd. Look outside before you hitch up.";
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

type Report = { id: string; lake: string; species: string; bait: string; note: string; by: string };
type Photo = { id: string; boat: string; catchName: string; caption: string; by: string; image: string };
type Wind = { temp: number | null; wind: number | null; gust: number | null; code: number | null; rainChance: number | null };

export function BoatingDesk() {
  const [waterId, setWaterId] = useState("harris");
  const [tripDate, setTripDate] = useState("");
  const [arrive, setArrive] = useState("06:30");
  const [mapsMinutes, setMapsMinutes] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [wind, setWind] = useState<Wind | null>(null);
  const skipCheckWrite = useRef(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [catchForm, setCatchForm] = useState({ lake: "Lake Harris", species: "", bait: "", note: "" });
  const [boat, setBoat] = useState("");
  const [catchName, setCatchName] = useState("");
  const [caption, setCaption] = useState("");

  const water = WATERS.find((row) => row.id === waterId) || WATERS[0];
  const padInfo = trafficPad(tripDate, arrive);
  const typed = Number(mapsMinutes);
  const driveMinutes = Number.isFinite(typed) && typed > 0 ? Math.round(typed) : water.minutes;
  const total = driveMinutes + padInfo.minutes;
  const leave = useMemo(() => leaveBy(tripDate, arrive, total), [tripDate, arrive, total]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tvea-boat-check");
      if (saved) setChecks(JSON.parse(saved) as Record<string, boolean>);
    } catch {
      /* storage can refuse */
    }
    void fetch("/api/boating/wind")
      .then((res) => res.json())
      .then((json: Wind) => setWind(json))
      .catch(() => setWind({ temp: null, wind: null, gust: null, code: null, rainChance: null }));
    void fetch("/api/boating/log", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: { reports?: Report[]; photos?: Photo[] }) => {
        setReports(json.reports || []);
        setPhotos(json.photos || []);
      })
      .catch(() => {
        setReports([]);
        setPhotos([]);
      });
  }, []);

  useEffect(() => {
    if (skipCheckWrite.current) {
      skipCheckWrite.current = false;
      return;
    }
    localStorage.setItem("tvea-boat-check", JSON.stringify(checks));
  }, [checks]);

  async function saveLeave() {
    if (!leave) {
      setNote("Pick the date and the ramp time first.");
      return;
    }
    setBusy(true);
    setNote(
      await saveCapeReminder({
        title: `Leave for ${water.name}`,
        notes: `${water.ramp}. ${water.address} Aim to splash at ${arrive}. About ${total} minutes with the ramp-line cushion.`,
        startDate: leave.date,
        startTime: leave.time,
        endDate: tripDate,
        endTime: arrive,
        timerMinutes: null,
        timerEndsAt: null,
        timerPausedMs: null,
        alarmEnabled: true,
        done: false,
      })
    );
    setBusy(false);
  }

  async function postCatch() {
    setBusy(true);
    setNote(null);
    const res = await fetch("/api/boating/log", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "catch", ...catchForm }),
    });
    const json = (await res.json()) as { reports?: Report[]; error?: string };
    setBusy(false);
    if (!res.ok) {
      setNote(json.error || "The board did not take that report.");
      return;
    }
    setReports(json.reports || []);
    setCatchForm((row) => ({ ...row, species: "", bait: "", note: "" }));
    setNote("On the board. The fish still gets a vote.");
  }

  async function sharePhoto(file: File | null) {
    if (!file) return;
    setBusy(true);
    setNote(null);
    try {
      const image = await shrinkPhoto(file);
      const res = await fetch("/api/boating/log", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "photo", boat, catchName, caption, image }),
      });
      const json = (await res.json()) as { photos?: Photo[]; error?: string };
      if (!res.ok) {
        setNote(json.error || "The gallery did not take that one.");
        return;
      }
      setPhotos(json.photos || []);
      setCaption("");
      setNote("Hung on the wall. The bass does not get editorial control.");
    } catch (err) {
      setNote(err instanceof Error ? err.message : "The gallery did not take that one.");
    } finally {
      setBusy(false);
    }
  }

  const gust = wind?.gust;
  const sky = skyWords(wind?.code ?? null);
  const windLine =
    wind === null
      ? "Checking the wind and the sky over town…"
      : gust == null
        ? "The forecast did not answer. Look at the sky and the ramp before you splash."
        : gust >= 25 || (wind.code != null && wind.code >= 95)
          ? `Gusts around ${gust} mph${wind.temp != null ? `, about ${wind.temp}°` : ""}. A pontoon on the Harris Chain is a bad idea today. This is a reading over the middle of town, not at the ramp.`
          : gust >= 15
            ? `Gusts around ${gust} mph${wind.temp != null ? `, about ${wind.temp}°` : ""}. Small boats will feel it.`
            : `Wind about ${wind.wind ?? "—"} mph, gusts near ${gust}${wind.temp != null ? `, about ${wind.temp}°` : ""}. A kinder morning.`;

  return (
    <>
      <div className="ms-boat-section-art" id="ms-boat-drive">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/boating/ramp.jpg" alt="" />
        <h3 className="my-space-block-title">When to leave for the ramp</h3>
      </div>
      <div className="about-panel cruise-desk">
        <label>
          Water
          <select value={waterId} onChange={(event) => setWaterId(event.target.value)}>
            {WATERS.map((row) => (
              <option key={row.id} value={row.id}>{row.name}</option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={tripDate} onChange={(event) => setTripDate(event.target.value)} />
        </label>
        <label>
          Splash by
          <input type="time" value={arrive} onChange={(event) => setArrive(event.target.value)} />
        </label>
        <label>
          Minutes from maps, if you just looked
          <input inputMode="numeric" placeholder={String(water.minutes)} value={mapsMinutes} onChange={(event) => setMapsMinutes(event.target.value)} />
        </label>
        <p>
          <strong>{water.drive}, clear road, from the middle of The Villages.</strong> {padInfo.why}{" "}
          Plan on about {total} minutes. A number you type from maps replaces the planning figure.
        </p>
        <p>{water.ramp}. {water.address}</p>
        <p>{water.parking}</p>
        {leave ? <p className="cruise-leave">Leave by {formatWhen(leave.date, leave.time)}.</p> : <p>Add the date and the leave-by line will show up.</p>}
        <div className="hero-actions">
          <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void saveLeave()}>
            {busy ? "Saving…" : "Put the leave-by time on my calendar"}
          </button>
          <a className="btn btn-ghost" href={maps(water.query)} target="_blank" rel="noopener noreferrer">Ramp in maps</a>
          <Link className="btn btn-ghost" href="/golf-cart-hero">Beat the drive home in Golf Cart Hero</Link>
        </div>
        {note ? <p>{note}</p> : null}
      </div>

      <div className="ms-boat-section-art" id="ms-boat-directory">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/boating/gulf.jpg" alt="" />
        <h3 className="my-space-block-title">The four waters people mean</h3>
      </div>
      <p className="panel-hint" style={{ marginTop: 0 }}>
        Addresses, hours, fees, and restrooms below are the ones the city or the state park page actually prints.
        A blank fee means the page did not post one. The closer ramps are still in the cards above.
      </p>
      <div className="ms-boat-grid">
        {WATERS.map((row) => (
          <article key={row.id} className="about-panel ms-boat-card">
            <p className="ms-boat-meta">{row.drive}</p>
            <h3>{row.name}</h3>
            <p>{row.ramp}</p>
            <p>{row.address}</p>
            <p><strong>Parking.</strong> {row.parking}</p>
            <p><strong>Fee.</strong> {row.fee}</p>
            <p><strong>Restroom.</strong> {row.restroom}</p>
            <p><strong>Hours.</strong> {row.hours}</p>
            <p><strong>Pin.</strong> {row.pin}</p>
            <div className="hero-actions">
              <a className="btn btn-primary btn-sm" href={maps(row.query)} target="_blank" rel="noopener noreferrer">Open in maps</a>
              <a className="btn btn-ghost btn-sm" href={row.source} target="_blank" rel="noopener noreferrer">{row.sourceLabel}</a>
              {"source2" in row && row.source2 ? (
                <a className="btn btn-ghost btn-sm" href={row.source2} target="_blank" rel="noopener noreferrer">{row.sourceLabel2}</a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      <div className="hero-actions" style={{ margin: "0.75rem 0 1.25rem" }}>
        <a className="btn btn-ghost btn-sm" href="https://myfwc.com/boating/" target="_blank" rel="noopener noreferrer">FWC boating</a>
        <a className="btn btn-ghost btn-sm" href="#ms-boat-ramps">The closer ramps</a>
      </div>

      <div className="ms-boat-section-art" id="ms-boat-report">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/boating/bass.jpg" alt="" />
        <h3 className="my-space-block-title">What neighbors actually caught</h3>
      </div>
      <p className="panel-hint" style={{ marginTop: 0 }}>
        The bait cards are the usual pattern, the same seasons already on this page. The board under them is what a neighbor actually posted. It is not an FWC creel survey. The fish did not read either one.
      </p>
      <div className="ms-boat-grid">
        {BAIT.map((row) => (
          <article key={row.title} className="about-panel ms-boat-card">
            <h3>{row.title}</h3>
            <p>{row.text}</p>
          </article>
        ))}
      </div>
      <div className="about-panel cruise-desk">
        <label>
          Lake
          <input value={catchForm.lake} onChange={(event) => setCatchForm((row) => ({ ...row, lake: event.target.value }))} />
        </label>
        <label>
          Species
          <input value={catchForm.species} placeholder="Largemouth, speck, bluegill…" onChange={(event) => setCatchForm((row) => ({ ...row, species: event.target.value }))} />
        </label>
        <label>
          Bait or lure
          <input value={catchForm.bait} placeholder="What they would bite again" onChange={(event) => setCatchForm((row) => ({ ...row, bait: event.target.value }))} />
        </label>
        <label>
          Note
          <input value={catchForm.note} placeholder="Morning, pads, wind, or a skunk" onChange={(event) => setCatchForm((row) => ({ ...row, note: event.target.value }))} />
        </label>
        <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void postCatch()}>
          Post the report
        </button>
      </div>
      <div className="ms-boat-grid" style={{ marginTop: "1rem" }}>
        {reports.length === 0 ? (
          <p className="panel-hint">No neighbor reports yet. The first honest skunk still counts.</p>
        ) : reports.map((row) => (
          <article key={row.id} className="about-panel ms-boat-card">
            <p className="ms-boat-meta">{row.lake}</p>
            <h3>{row.species}</h3>
            {row.bait ? <p>Bait: {row.bait}</p> : null}
            {row.note ? <p>{row.note}</p> : null}
            <p className="ms-boat-meta">{row.by}</p>
          </article>
        ))}
      </div>

      <div className="ms-boat-section-art" id="ms-boat-wind">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/boating/gulf.jpg" alt="" />
        <h3 className="my-space-block-title">Wind before you splash</h3>
      </div>
      <div className="about-panel cruise-desk">
        <p>{windLine}</p>
        {sky ? <p>{sky}</p> : null}
        {wind?.rainChance != null ? (
          <p>Today’s rain chance over town is about {Math.round(wind.rainChance)} percent. Summer thunder still builds after lunch. If the sky goes pewter, the fish can wait.</p>
        ) : (
          <p>Summer thunder still builds after lunch. If the sky goes pewter, the fish can wait. The same rule as the golf course.</p>
        )}
        <a className="btn btn-ghost" href="https://www.nhc.noaa.gov/" target="_blank" rel="noopener noreferrer">National Hurricane Center</a>
      </div>

      <div className="ms-boat-section-art" id="ms-boat-senior">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/boating/pontoon.jpg" alt="" />
        <h3 className="my-space-block-title">Docks, knees, and a steep ramp</h3>
      </div>
      <div className="about-panel">
        <p>
          Lake Griffin State Park is the ramp on this page with an accessible floating dock beside a fixed dock. A floating dock is kinder on the knees than a steep concrete lane after rain.
        </p>
        <p>
          Life jacket on before the truck comes off the trailer. Non-slip shoes. Use a spotter when the lot tilts, and let them hold the bow line while you step aboard. If the gunwale is high, sit and swing a leg over. Do not march a cooler down a wet ramp. Stage the gear at the top.
        </p>
        <p>
          If the only parking is a hike from the water, pick another ramp on this page. Village ponds and golf-course lakes are still not the plan.
        </p>
      </div>

      <div className="ms-boat-section-art" id="ms-boat-pack">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/boating/bass.jpg" alt="" />
        <h3 className="my-space-block-title">What to pack for a boat day</h3>
      </div>
      <div className="about-panel cruise-desk">
        <ul className="cruise-checks">
          {PACK.map((item) => (
            <li key={item.id}>
              <label>
                <input
                  type="checkbox"
                  checked={!!checks[item.id]}
                  onChange={(event) => setChecks((current) => ({ ...current, [item.id]: event.target.checked }))}
                />
                {item.label}
              </label>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy}
          onClick={() => {
            if (!tripDate) {
              setNote("Pick the date first.");
              return;
            }
            const night = new Date(`${tripDate}T12:00:00`);
            night.setDate(night.getDate() - 1);
            const date = `${night.getFullYear()}-${pad(night.getMonth() + 1)}-${pad(night.getDate())}`;
            setBusy(true);
            void saveCapeReminder({
              title: "Pack for the boat",
              notes: "Life jacket, kill switch, ID, sunscreen, water, medications, rain jacket, lights.",
              startDate: date,
              startTime: "19:00",
              endDate: date,
              endTime: "19:30",
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
          Remind me to pack the night before
        </button>
      </div>

      <div className="ms-boat-section-art" id="ms-boat-photos">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/boating/bass.jpg" alt="" />
        <h3 className="my-space-block-title">Back at the ramp</h3>
      </div>
      <div className="about-panel cruise-desk">
        <p>Name the boat, name the catch if there was one, and skip the algorithm. A skunk photo is still a photo.</p>
        <label>
          Boat
          <input value={boat} onChange={(event) => setBoat(event.target.value)} placeholder="The boat, or the rental pontoon" />
        </label>
        <label>
          Catch
          <input value={catchName} onChange={(event) => setCatchName(event.target.value)} placeholder="Bass, speck, or nothing with fins" />
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
      </div>
      <div className="ms-boat-grid" style={{ marginTop: "1rem" }}>
        {photos.length === 0 ? <p className="panel-hint">The wall is empty. A ramp photo with no fish is still a ramp photo.</p> : null}
        {photos.map((photo) => (
          <article key={photo.id} className="about-panel trip-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.image} alt={photo.caption || "A boat-day photo"} />
            <div className="trip-card-body">
              <p className="ms-boat-meta">{photo.boat}{photo.catchName ? ` · ${photo.catchName}` : ""}</p>
              <h3>{photo.caption}</h3>
              <p className="ms-boat-meta">{photo.by}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
