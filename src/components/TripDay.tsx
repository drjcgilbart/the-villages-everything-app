"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CalTask, CalendarBoard } from "@/lib/memberBoardModel";

type Spot = {
  id: string;
  name: string;
  minutes: number;
  drive: string;
  why: string;
  season: string;
  senior: string;
  image: string;
  query: string;
  kind: "spring" | "critter" | "beach" | "grand";
};

const SPOTS: Spot[] = [
  {
    id: "rainbow",
    name: "Rainbow Springs",
    minutes: 40,
    drive: "About 40 minutes",
    why: "The close clear river. Grandkids refuse to get out.",
    season: "The water stays near 72 degrees all year. August thinks that is a gift. January thinks it is a dare.",
    senior: "The headspring park is the easier walk. A long tube is the younger plan. State park paths are the benches.",
    image: "/graphics/day-trips/rainbow.jpg",
    query: "Rainbow Springs State Park Dunnellon",
    kind: "spring",
  },
  {
    id: "ichetucknee",
    name: "Ichetucknee Springs",
    minutes: 80,
    drive: "About 1 hour 20 minutes",
    why: "The classic tube run, on a weekday if you want the river to yourselves.",
    season: "Summer is the tube season, and the park caps how many people go in. A holiday is a full river. A Tuesday is the nicer one.",
    senior: "Tubing is the visit. The tram, when it is running, is the relief. This is not the scooter day.",
    image: "/graphics/day-trips/ichetucknee.jpg",
    query: "Ichetucknee Springs State Park",
    kind: "spring",
  },
  {
    id: "weeki",
    name: "Weeki Wachee",
    minutes: 75,
    drive: "About 1 hour 15 minutes",
    why: "Mermaids and water so blue it looks invented.",
    season: "The mermaid show is the reason. Buccaneer Bay opens by season. Check the show list the night before.",
    senior: "The theater is the good seat. The water park, when it is open, is a second and wetter plan.",
    image: "/graphics/day-trips/weeki.jpg",
    query: "Weeki Wachee Springs State Park",
    kind: "spring",
  },
  {
    id: "gatorland",
    name: "Gatorland",
    minutes: 75,
    drive: "About 1 hour 15 minutes",
    why: "Shows and a boardwalk, for the child who has only met a pond alligator.",
    season: "Show times are on Gatorland’s own site. Morning is the cooler visit. July midday is how a grown-up gets voted off the trip.",
    senior: "Most of the walk is boardwalk. Shade is a rumor at noon. Sit for a show and let the gators do the work.",
    image: "/graphics/day-trips/gatorland.jpg",
    query: "Gatorland Orlando",
    kind: "critter",
  },
  {
    id: "homosassa",
    name: "Homosassa Springs",
    minutes: 60,
    drive: "About 1 hour",
    why: "Manatees under the glass, and Lu the hippo, who has outlasted several fads.",
    season: "Manatees are here year-round. The cold months, roughly November through March, are when the springs get famous. The refuge site says when a pass is required at Crystal River.",
    senior: "Boardwalk and strollers. Lu stays behind the fence. The manatee windows are the stop you do not rush.",
    image: "/graphics/day-trips/homosassa.jpg",
    query: "Ellie Schiller Homosassa Springs Wildlife State Park",
    kind: "critter",
  },
  {
    id: "silver",
    name: "Silver Springs",
    minutes: 50,
    drive: "About 50 minutes",
    why: "A glass-bottom boat and a walk that does not require a castle ticket.",
    season: "The river is clear all year. Monkeys are a maybe, not a booking. Morning is the kinder walk.",
    senior: "The boat is the seated version of the day. The trails are the extra. Do not promise both if the knees already voted.",
    image: "/graphics/day-trips/silver.jpg",
    query: "Silver Springs State Park Ocala",
    kind: "critter",
  },
  {
    id: "clearwater",
    name: "Clearwater Beach",
    minutes: 120,
    drive: "About 2 hours",
    why: "The postcard Gulf afternoon. Weekday, or accept the parking hunt.",
    season: "Spring break and summer weekends fill the sand. A fall weekday is the version that still feels like a day trip. Sunset means a late drive home.",
    senior: "Pier 60 is the easy walk if someone does not want to swim. The garage-to-sand stroll is longer than the map suggests. Red flag means stay out.",
    image: "/graphics/day-trips/clearwater.jpg",
    query: "Clearwater Beach Florida Pier 60",
    kind: "beach",
  },
  {
    id: "stpete",
    name: "St. Pete Beach",
    minutes: 135,
    drive: "About 2 hours 15 minutes",
    why: "The Gulf without making Clearwater do all the work. Still a dawn-ish departure.",
    season: "Same crowd calendar as Clearwater. Weekends in season are a parking project. The two-hour St. Pete garden cards on this page are the version that skips the sand.",
    senior: "Pick a public access with a restroom before you leave the villa. The pier and the sand are not the same walk. Confirm the lot on the city’s site.",
    image: "/graphics/day-trips/clearwater.jpg",
    query: "St. Pete Beach Florida",
    kind: "beach",
  },
  {
    id: "daytona",
    name: "Daytona Beach",
    minutes: 75,
    drive: "About 1 hour 15 minutes",
    why: "The closest big beach. Pier and Boardwalk for the grandkids. Sand driving only where it is marked.",
    season: "Bike weeks and summer weekends are the crowded ones. A plain Tuesday is the beach. Afternoon storms still close the pretty part.",
    senior: "The Boardwalk is the grandkid version that does not require a swim. Read the tide signs before anyone drives on the sand.",
    image: "/graphics/day-trips/daytona.jpg",
    query: "Daytona Beach Boardwalk",
    kind: "beach",
  },
  {
    id: "ksc",
    name: "Kennedy Space Center",
    minutes: 105,
    drive: "About 1 hour 45 minutes",
    why: "Rockets, a shuttle, and one hall if the little ones fade.",
    season: "A launch day is a different trip and a different traffic jam. Check the visitor schedule. One building is a full visit for small children.",
    senior: "The bus tour, when it is running, is the seated stretch. The campus is a lot of walking. Rent a chair if the day is the whole complex.",
    image: "/graphics/day-trips/ksc.jpg",
    query: "Kennedy Space Center Visitor Complex",
    kind: "grand",
  },
  {
    id: "bok",
    name: "Bok Tower Gardens",
    minutes: 75,
    drive: "About 1 hour 15 minutes",
    why: "A singing tower and a hill Florida insists on calling a mountain.",
    season: "The carillon plays at set times. Gardens are kindest when it is not July noon. You listen. You do not climb the tower.",
    senior: "Paths, benches, and shade if you do not sprint the hill. This is the day nobody wanted a roller coaster.",
    image: "/graphics/day-trips/bok.jpg",
    query: "Bok Tower Gardens Lake Wales",
    kind: "grand",
  },
  {
    id: "osc",
    name: "Orlando Science Center",
    minutes: 80,
    drive: "About 1 hour 20 minutes",
    why: "Indoor science for a hot day, in the same part of Orlando as the Leu Gardens card.",
    season: "Rainy afternoons and July are why this building exists. Hours and exhibits are on their site. It is not a theme park and should not be stapled to one.",
    senior: "Air conditioning is the amenity. Elevators and exhibits you can do sitting down. Confirm today’s hours before you promise the dinosaurs.",
    image: "/graphics/day-trips/town.jpg",
    query: "Orlando Science Center Loch Haven Park",
    kind: "grand",
  },
];

const PACK = [
  { id: "sun", label: "Sunscreen before you leave the villa" },
  { id: "hat", label: "Hats" },
  { id: "shoes", label: "Water shoes if the day is a spring" },
  { id: "bug", label: "Bug spray" },
  { id: "meds", label: "Medications in the bag you carry" },
  { id: "towel", label: "Towels, and a bag for the wet ones" },
  { id: "ticket", label: "A look at hours, passes, and flags the night before" },
];

function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function trafficPad(date: string, time: string) {
  if (!date || !time) return { minutes: 15, why: "A small cushion. Maps still win the morning of." };
  const day = new Date(`${date}T${time}:00`).getDay();
  const hour = Number(time.slice(0, 2));
  if (day === 5 && hour >= 12) return { minutes: 35, why: "Friday afternoon. The coast and I-75 had the same idea." };
  if (day === 0 || day === 6) return { minutes: 25, why: "Weekend. Beaches and springs fill up with other people’s grandkids." };
  if (hour >= 15) return { minutes: 30, why: "After midafternoon the drive home is the second outing." };
  return { minutes: 15, why: "A small cushion. Maps still win the morning of." };
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
function kidPlan(age: string, interest: string) {
  if (interest === "spring" && age === "little") {
    return "Rainbow Springs or the Weeki Wachee mermaid show. A long Ichetucknee tube is cold and it goes on. Little ones do better at a headspring and a show than a two-hour float.";
  }
  if (interest === "spring") {
    return "Ichetucknee on a weekday, or Weeki Wachee if they want mermaids more than a tube. One spring. A beach the same day is how someone melts in the back seat.";
  }
  if (interest === "critter" && age === "little") {
    return "Homosassa. Boardwalk, manatees, Lu the hippo. Gatorland is wonderful and also a lot of sun for a short person.";
  }
  if (interest === "critter") {
    return "Gatorland in the morning for the shows, or Homosassa if they want the hippo and the manatees. Silver Springs is the boat day. Do not stack all three.";
  }
  if (interest === "beach") {
    return age === "little"
      ? "Daytona’s Boardwalk, not a sunset commitment in Clearwater. Red flag means stay out of the water. A theme park the same day is a no."
      : "Clearwater or St. Pete Beach on a weekday, Daytona if you want the closer sand. The beach is the whole day. A park after it is how the car vote fails.";
  }
  return age === "little"
    ? "Kennedy Space Center, one hall, then the gift shop. Bok Tower if they can do a garden. The Science Center is the rainy indoor backup. Not also a beach."
    : "Kennedy Space Center or Bok Tower. The Orlando Science Center is the thunderstorm plan. Pairing a beach and a park is two trips. Pick one.";
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

export function TripDay() {
  const [spotId, setSpotId] = useState("rainbow");
  const [tripDate, setTripDate] = useState("");
  const [arrive, setArrive] = useState("10:00");
  const [mapsMinutes, setMapsMinutes] = useState("");
  const [calNote, setCalNote] = useState<string | null>(null);
  const [calBusy, setCalBusy] = useState(false);
  const [age, setAge] = useState("kid");
  const [interest, setInterest] = useState("spring");
  const [troops, setTroops] = useState(true);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [storms, setStorms] = useState<{ name: string; classification: string; advisory: string }[] | null>(null);
  const [photos, setPhotos] = useState<{ id: string; place: string; caption: string; by: string; image: string }[]>([]);
  const [caption, setCaption] = useState("");
  const [photoNote, setPhotoNote] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);

  const spot = SPOTS.find((row) => row.id === spotId) || SPOTS[0];
  const padInfo = trafficPad(tripDate, arrive);
  const typed = Number(mapsMinutes);
  const driveMinutes = Number.isFinite(typed) && typed > 0 ? Math.round(typed) : spot.minutes;
  const total = driveMinutes + padInfo.minutes + 15;
  const leave = useMemo(() => leaveBy(tripDate, arrive, total), [tripDate, arrive, total]);
  const meals = [
    { name: "Cody's Original Roadhouse", slug: "codys-lake-sumter", area: "Lake Sumter Landing", troops: true, note: "Burgers after the river." },
    { name: "R.J. Gator's", slug: "rj-gators-lake-sumter", area: "Lake Sumter Landing", troops: true, note: "A noisy room for a sandy crew." },
    { name: "Portillo's", slug: "portillos-middleton", area: "Middleton", troops: true, note: "Nobody has to decide. The menu already did." },
    { name: "4 Rivers Smokehouse", slug: "4-rivers-smokehouse-middleton", area: "Middleton", troops: true, note: "A pile of food and a line that moves." },
    { name: "Fiesta Grande", slug: "fiesta-grande-brownwood", area: "Brownwood", troops: true, note: "Chips first. Diplomacy second." },
    { name: "City Fire", slug: "city-fire-lake-sumter", area: "Lake Sumter Landing", troops: true, note: "Back on a town square, which is the correct ending." },
    { name: "Chop House at Lake Sumter", slug: "chop-house-at-lake-sumter", area: "Lake Sumter Landing", troops: false, note: "If the grandkids are already asleep in the car." },
  ].filter((row) => (troops ? row.troops : true));

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tvea-trip-check");
      if (saved) setChecks(JSON.parse(saved) as Record<string, boolean>);
    } catch {
      /* storage can refuse */
    }
    void fetch("/api/cruises/storms")
      .then((res) => res.json())
      .then((json: { storms?: { name: string; classification: string; advisory: string }[] | null }) => setStorms(json.storms || []))
      .catch(() => setStorms([]));
    void fetch("/api/trips/gallery", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: { photos?: typeof photos }) => setPhotos(json.photos || []))
      .catch(() => setPhotos([]));
  }, []);

  useEffect(() => {
    localStorage.setItem("tvea-trip-check", JSON.stringify(checks));
  }, [checks]);

  async function saveTask(title: string, notes: string, date: string, time: string, end: string) {
    setCalBusy(true);
    setCalNote(null);
    try {
      const res = await fetch("/api/members/space/boards", { cache: "no-store", credentials: "include" });
      if (res.status === 401) {
        setCalNote("Sign in first. The personal planner is what keeps pickleball off a spring morning.");
        return;
      }
      const json = (await res.json()) as { boards?: { calendar?: CalendarBoard } };
      const tasks = json.boards?.calendar?.tasks || [];
      const row: CalTask = {
        id: `cal-trip-${Date.now().toString(36)}`,
        title,
        notes,
        startDate: date,
        startTime: time,
        endDate: date,
        endTime: end,
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
      if (!saved.ok) {
        setCalNote(saved.status === 403 ? "The personal planner is on Lanai Legend. The reminder is still on this page." : "The calendar did not take that reminder.");
        return;
      }
      setCalNote("On the personal planner.");
    } catch {
      setCalNote("The calendar did not answer. The time is still on this page.");
    } finally {
      setCalBusy(false);
    }
  }

  async function sharePhoto(file: File | null) {
    if (!file) return;
    setPhotoBusy(true);
    setPhotoNote(null);
    try {
      const image = await shrinkPhoto(file);
      const res = await fetch("/api/trips/gallery", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ place: spot.name, caption, image }),
      });
      const json = (await res.json()) as { photos?: typeof photos; error?: string };
      if (!res.ok) {
        setPhotoNote(json.error || "The gallery did not take that one.");
        return;
      }
      setPhotos(json.photos || []);
      setCaption("");
      setPhotoNote("Hung on the wall. The spring does not grade the photo.");
    } catch (err) {
      setPhotoNote(err instanceof Error ? err.message : "The gallery did not take that one.");
    } finally {
      setPhotoBusy(false);
    }
  }

  return (
    <>
      <section className="section" id="trip-drive" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>When to leave for the fun</h2>
              <p>
                Clear-road times match the cards already on this page, from the middle of The Villages.
                Weekends and Friday afternoons get a cushion. Maps, if you just looked, win.
              </p>
            </div>
          </div>
          <div className="about-panel cruise-desk">
            <label>
              Where
              <select value={spotId} onChange={(event) => setSpotId(event.target.value)}>
                {SPOTS.map((row) => (
                  <option key={row.id} value={row.id}>{row.name}</option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input type="date" value={tripDate} onChange={(event) => setTripDate(event.target.value)} />
            </label>
            <label>
              Arrive by
              <input type="time" value={arrive} onChange={(event) => setArrive(event.target.value)} />
            </label>
            <label>
              Minutes from maps, if you just looked
              <input inputMode="numeric" placeholder={String(spot.minutes)} value={mapsMinutes} onChange={(event) => setMapsMinutes(event.target.value)} />
            </label>
            <p>
              <strong>{spot.drive}, clear road.</strong> {padInfo.why} Plus 15 minutes to park and find the right gate.
              Plan on about {Math.floor(total / 60)} hours{total % 60 ? ` ${total % 60} minutes` : ""}.
            </p>
            {leave ? <p className="cruise-leave">Leave by {formatWhen(leave.date, leave.time)}.</p> : <p>Add the date and the leave-by line will show up.</p>}
            <div className="hero-actions">
              <button
                type="button"
                className="btn btn-primary"
                disabled={calBusy}
                onClick={() =>
                  leave &&
                  void saveTask(
                    `Leave for ${spot.name}`,
                    `Aim to arrive ${arrive}. About ${total} minutes door to gate.`,
                    leave.date,
                    leave.time,
                    arrive
                  )
                }
              >
                {calBusy ? "Saving…" : "Put the leave-by time on my calendar"}
              </button>
              <a className="btn btn-ghost" href={maps(spot.query)} target="_blank" rel="noopener noreferrer">Directions</a>
              <Link className="btn btn-ghost" href="/golf-cart-hero">Beat the drive home in Golf Cart Hero</Link>
            </div>
            {calNote ? <p>{calNote}</p> : null}
          </div>
        </div>
      </section>

      <section className="section" id="trip-cards" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>The short list people actually mean</h2>
              <p>Springs, critters, beaches, and the grandkid stops. The longer lists are still below. These are the ones the group text argues about.</p>
            </div>
          </div>
          {(["spring", "critter", "beach", "grand"] as const).map((kind) => (
            <div key={kind} style={{ marginBottom: "1.25rem" }}>
              <h3>
                {kind === "spring" ? "Springs" : kind === "critter" ? "Critters" : kind === "beach" ? "Beaches" : "Grandkid-sized"}
              </h3>
              <div className="ms-boat-grid">
                {SPOTS.filter((row) => row.kind === kind).map((row) => (
                  <article key={row.id} className="about-panel trip-card cruise-compare">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={row.image} alt="" />
                    <div className="trip-card-body">
                      <p className="ms-boat-meta">{row.drive}</p>
                      <h3>{row.name}</h3>
                      <p>{row.why}</p>
                      <a className="btn btn-primary btn-sm" href={maps(row.query)} target="_blank" rel="noopener noreferrer">Directions</a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="trip-kids" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Build the day around the kids</h2>
              <p>One outing. A beach and a park on the same Saturday is how someone cries on I-4.</p>
            </div>
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
            <label>
              What they asked for
              <select value={interest} onChange={(event) => setInterest(event.target.value)}>
                <option value="spring">A spring</option>
                <option value="critter">Animals</option>
                <option value="beach">The beach</option>
                <option value="grand">Rockets, a tower, or indoor science</option>
              </select>
            </label>
            <p>{kidPlan(age, interest)}</p>
          </div>
        </div>
      </section>

      <section className="section" id="trip-season" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>The month matters</h2>
              <p>Manatees like the cold. Tubes like summer. Beaches like a weekday. Show times live on the attraction’s site, not in a group text.</p>
            </div>
          </div>
          <div className="ms-boat-grid">
            {SPOTS.map((row) => (
              <article key={row.id} className="about-panel">
                <h3>{row.name}</h3>
                <p>{row.season}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="trip-senior" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Benches, boardwalks, and the clean-enough plan</h2>
              <p>This page does not grade restrooms. A weekday morning and the park’s own access note beat a rumor.</p>
            </div>
          </div>
          <div className="ms-boat-grid">
            {SPOTS.map((row) => (
              <article key={row.id} className="about-panel">
                <h3>{row.name}</h3>
                <p>{row.senior}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="trip-dinner" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Dinner after the adventure</h2>
              <p>
                Lunch at the spring or the beach is that town’s problem. Dinner back in The Villages is the Dining list.
                The drive home is the same one you already drove out.
              </p>
            </div>
          </div>
          <div className="hero-actions" style={{ marginBottom: "1rem" }}>
            <button type="button" className={`btn btn-sm ${troops ? "btn-primary" : "btn-ghost"}`} onClick={() => setTroops(true)}>Feed the troops</button>
            <button type="button" className={`btn btn-sm ${troops ? "btn-ghost" : "btn-primary"}`} onClick={() => setTroops(false)}>All of these</button>
            <Link className="btn btn-ghost btn-sm" href="/dining">All of Dining</Link>
          </div>
          <div className="ms-boat-grid">
            {meals.map((row) => (
              <article key={row.slug} className="about-panel">
                <p className="ms-boat-meta">{row.area} · about {spot.drive} back from {spot.name}</p>
                <h3>{row.name}</h3>
                <p>{row.note}</p>
                <Link className="btn btn-primary btn-sm" href={`/dining/${row.slug}`}>On the Dining page</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="trip-pack" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>What to pack for a Florida day trip</h2>
              <p>A towel, a hat, and the humility to check a flag or a show time before you leave the driveway.</p>
            </div>
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
              disabled={calBusy}
              onClick={() => {
                if (!tripDate) {
                  setCalNote("Pick the date first.");
                  return;
                }
                const night = new Date(`${tripDate}T12:00:00`);
                night.setDate(night.getDate() - 1);
                const date = `${night.getFullYear()}-${pad(night.getMonth() + 1)}-${pad(night.getDate())}`;
                void saveTask("Pack for the day trip", "Sunscreen, hats, water shoes, bug spray, medications, towels.", date, "19:00", "19:30");
              }}
            >
              Remind me to pack the night before
            </button>
          </div>
        </div>
      </section>

      <section className="section" id="trip-weather" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Storms cancel the pretty part</h2>
              <p>Springs still flow. Beaches and boat rides do not argue with a red flag or lightning. This is the hurricane center’s Atlantic list.</p>
            </div>
          </div>
          <div className="about-panel cruise-desk">
            {storms === null ? <p>Checking the hurricane center…</p> : null}
            {storms && storms.length === 0 ? <p>No named Atlantic system on the current bulletin. A summer afternoon storm can still end a boat ride.</p> : null}
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
        </div>
      </section>

      <section className="section" id="trip-photos" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Back from the trip</h2>
              <p>Hang the photo, name the place, and skip the algorithm. Maximum chaos is allowed.</p>
            </div>
          </div>
          <div className="about-panel cruise-desk">
            <label>
              Caption
              <input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="What the photo is actually of" />
            </label>
            <p className="ms-boat-meta">Tagged place: {spot.name}.</p>
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
                  <p className="ms-boat-meta">{photo.place}</p>
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
