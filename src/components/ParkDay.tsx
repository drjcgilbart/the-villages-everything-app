"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { CalTask, CalendarBoard } from "@/lib/memberBoardModel";

type Gate = {
  id: string;
  name: string;
  minutes: number;
  drive: string;
  best: string;
  senior: string;
  crowd: string;
  image: string;
  query: string;
  tickets: string;
};

const GATES: Gate[] = [
  {
    id: "magic",
    name: "Magic Kingdom",
    minutes: 90,
    drive: "About 1 hour 30 minutes",
    best: "The classics. Castle, parade, fireworks, and the day the little ones came for.",
    senior: "Rent a wheelchair or scooter at the park. Main Street has benches. The lands are a lot of walking between them. Shows and the boat rides are the shaded breaks.",
    crowd: "Weekends and school holidays are the heavy days. Tuesday through Thursday is often kinder outside those weeks. Be at the rope when it drops.",
    image: "/graphics/theme-parks/castle.jpg",
    query: "Magic Kingdom Walt Disney World",
    tickets: "https://disneyworld.disney.go.com/",
  },
  {
    id: "universal",
    name: "Universal Orlando",
    minutes: 85,
    drive: "About 1 hour 25 minutes",
    best: "Movies and coasters. Read whether the ticket is one park, park-to-park, or Epic Universe. Those are not the same gate.",
    senior: "CityWalk is the flat dinner street and does not need a park ticket. Inside the parks, rent the scooter at guest services and ask which rides let it roll up to the line.",
    crowd: "Saturdays fill first. A weekday morning is the kind hour. The big rides are a morning job, not a 3 p.m. idea.",
    image: "/graphics/day-trips/universal.jpg",
    query: "Universal Orlando theme parks",
    tickets: "https://www.universalorlando.com/",
  },
  {
    id: "seaworld",
    name: "SeaWorld Orlando",
    minutes: 80,
    drive: "About 1 hour 20 minutes",
    best: "Animals and a few coasters, with shows that give the group a seat.",
    senior: "The shows are the benches. Rent a chair at the park if the day is long. Outdoor queues still happen. A hat is not optional.",
    crowd: "Weekends are busier. Weekday morning is when the animals and the group are both awake.",
    image: "/graphics/theme-parks/water.jpg",
    query: "SeaWorld Orlando",
    tickets: "https://seaworld.com/orlando/",
  },
  {
    id: "busch",
    name: "Busch Gardens Tampa",
    minutes: 110,
    drive: "About 1 hour 50 minutes",
    best: "Animals in the morning and coasters for the taller grandkids. One Tampa park. Not also a water park.",
    senior: "The animal paths are pretty and long. Rent the scooter early. Shade is better before lunch. The coasters can wait until someone else is holding the snacks.",
    crowd: "Weekends draw Tampa and The Villages at once. Morning for the animals and the big rides. Afternoon is heat.",
    image: "/graphics/day-trips/animals.jpg",
    query: "Busch Gardens Tampa",
    tickets: "https://buschgardens.com/tampa/",
  },
  {
    id: "lego",
    name: "LEGOLAND Florida",
    minutes: 75,
    drive: "About 1 hour 15 minutes",
    best: "The younger grandkids. Built for them, which is the compliment and the warning.",
    senior: "Shorter day, still a lot of sun. Benches by the shows. The water park next door is a second ticket and a second set of wet clothes.",
    crowd: "School holidays and Saturdays. A Tuesday with five-year-olds is the version that still feels like a park and not a parking lot.",
    image: "/graphics/day-trips/town.jpg",
    query: "LEGOLAND Florida Winter Haven",
    tickets: "https://www.legoland.com/florida/",
  },
];

const DINING = [
  {
    name: "Cody's Original Roadhouse",
    slug: "codys-lake-sumter",
    area: "Lake Sumter Landing",
    troops: true,
    note: "Burgers and a booth that can absorb a damp grandchild.",
  },
  {
    name: "City Fire",
    slug: "city-fire-lake-sumter",
    area: "Lake Sumter Landing",
    troops: true,
    note: "A square dinner when the car is finally back in town.",
  },
  {
    name: "Johnny Rockets",
    slug: "johnny-rockets-lake-sumter",
    area: "Lake Sumter Landing",
    troops: true,
    note: "The kids already know the menu. That is a gift.",
  },
  {
    name: "R.J. Gator's",
    slug: "rj-gators-lake-sumter",
    area: "Lake Sumter Landing",
    troops: true,
    note: "Casual, loud enough that a meltdown does not echo.",
  },
  {
    name: "Portillo's",
    slug: "portillos-middleton",
    area: "Middleton",
    troops: true,
    note: "Hot dogs and cake shakes for a big, tired table.",
  },
  {
    name: "4 Rivers Smokehouse",
    slug: "4-rivers-smokehouse-middleton",
    area: "Middleton",
    troops: true,
    note: "A line, then a lot of food. Good when nobody wants a white tablecloth.",
  },
  {
    name: "Fiesta Grande",
    slug: "fiesta-grande-brownwood",
    area: "Brownwood",
    troops: true,
    note: "Chips on the table before anyone argues about the day.",
  },
  {
    name: "Chop House at Lake Sumter",
    slug: "chop-house-at-lake-sumter",
    area: "Lake Sumter Landing",
    troops: false,
    note: "The grown-up dinner if the grandkids already went to bed.",
  },
];

const PACK = [
  { id: "sun", label: "Sunscreen on before the parking tram, not after the first land" },
  { id: "hat", label: "Hats that stay on a Florida head" },
  { id: "shoes", label: "Shoes that have already met a sidewalk" },
  { id: "meds", label: "Medications in the bag you carry, not the one in the car" },
  { id: "kids", label: "A change of clothes for the kids, and a bag for the wet ones" },
  { id: "water", label: "A refillable bottle if that park allows it" },
  { id: "poncho", label: "A poncho. The afternoon storm is not a surprise." },
  { id: "ticket", label: "Ticket screenshot. Gates do not care that the app is thinking." },
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
  if (day === 5 && hour >= 12) {
    return { minutes: 40, why: "Friday afternoon. I-4 collects people who also had this idea." };
  }
  if (day === 0 || day === 6) {
    return { minutes: 25, why: "Weekend. The parks and the highway had the same thought." };
  }
  if (hour < 8) {
    return { minutes: 15, why: "Early is the kind version of I-4. Still leave a cushion for the parking lot." };
  }
  if (hour >= 15) {
    return { minutes: 35, why: "After midafternoon the highway becomes a parking lot with opinions." };
  }
  return { minutes: 15, why: "A small cushion. Maps still win the morning of." };
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
  return new Date(`${date}T${time}:00`).toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function planFor(age: string, interest: string) {
  if (age === "little") {
    return "Magic Kingdom, and stop there. Gentle rides, a parade, a show, and a nap that happens whether you scheduled it or not. Coasters can wait until the child is taller and less likely to file a complaint. LEGOLAND or Peppa Pig is the other honest day if the castle is not the point.";
  }
  if (age === "kid") {
    if (interest === "animals") return "Animal Kingdom in the morning, while the animals are awake, then a show and the car. Do not add a second gate.";
    if (interest === "water") return "One water park. Blizzard Beach, Typhoon Lagoon, or LEGOLAND’s water park. Not also a castle. Wet clothes end the diplomacy.";
    return "Magic Kingdom or LEGOLAND. A few bigger rides if they clear the height line, which you look up the night before. A show is the air-conditioned treaty.";
  }
  if (age === "bigger") {
    if (interest === "coasters") return "Hollywood Studios or Islands of Adventure. Rope drop the big ride. A show after lunch. Home before I-4 becomes a second theme park.";
    if (interest === "animals") return "Animal Kingdom or Busch Gardens, morning safari or animals first, one big ride if the height sign says yes.";
    if (interest === "shows") return "EPCOT or SeaWorld. Food, a seat, and one ride so the day still feels like a park.";
    return "One gate. Hollywood Studios if they want the big lines. Magic Kingdom if the younger cousin is also in the car. Do not make them share a hopper ticket and a mood.";
  }
  if (interest === "coasters") return "Islands of Adventure, Hollywood Studios, or Busch Gardens. One park. Early entry only if that ticket actually includes it. Disney’s paid ride hold changes its name and its price. Read the park’s app the week you go.";
  if (interest === "water") return "Volcano Bay, Aquatica, or a Disney water park. A separate day from the castle. Thunder closes the slides. Pack the dry clothes.";
  return "They can handle a full gate. Still one park. The meltdown is usually the second park, the heat, and a grown-up who promised both.";
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

export function ParkDay() {
  const [gateId, setGateId] = useState("magic");
  const [parkDate, setParkDate] = useState("");
  const [openTime, setOpenTime] = useState("09:00");
  const [mapsMinutes, setMapsMinutes] = useState("");
  const [calNote, setCalNote] = useState<string | null>(null);
  const [calBusy, setCalBusy] = useState(false);
  const [age, setAge] = useState("kid");
  const [interest, setInterest] = useState("characters");
  const [troops, setTroops] = useState(true);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [storms, setStorms] = useState<{ name: string; classification: string; advisory: string }[] | null>(null);
  const [photos, setPhotos] = useState<{ id: string; park: string; caption: string; by: string; image: string }[]>([]);
  const [caption, setCaption] = useState("");
  const [photoNote, setPhotoNote] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);

  const gate = GATES.find((row) => row.id === gateId) || GATES[0];
  const padInfo = trafficPad(parkDate, openTime);
  const typed = Number(mapsMinutes);
  const driveMinutes = Number.isFinite(typed) && typed > 0 ? Math.round(typed) : gate.minutes;
  const total = driveMinutes + padInfo.minutes + 25;
  const leave = useMemo(() => leaveBy(parkDate, openTime, total), [parkDate, openTime, total]);
  const meals = DINING.filter((row) => (troops ? row.troops : true));

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tvea-park-check");
      if (saved) setChecks(JSON.parse(saved) as Record<string, boolean>);
    } catch {
      /* private windows can refuse storage */
    }
    void fetch("/api/cruises/storms")
      .then((res) => res.json())
      .then((json: { storms?: { name: string; classification: string; advisory: string }[] | null }) => {
        setStorms(json.storms || []);
      })
      .catch(() => setStorms([]));
    void fetch("/api/parks/gallery", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: { photos?: { id: string; park: string; caption: string; by: string; image: string }[] }) => {
        setPhotos(json.photos || []);
      })
      .catch(() => setPhotos([]));
  }, []);

  useEffect(() => {
    localStorage.setItem("tvea-park-check", JSON.stringify(checks));
  }, [checks]);

  async function saveLeaveBy() {
    if (!leave) {
      setCalNote("Pick the date and the rope-drop time first.");
      return;
    }
    setCalBusy(true);
    setCalNote(null);
    try {
      const res = await fetch("/api/members/space/boards", { cache: "no-store", credentials: "include" });
      if (res.status === 401) {
        setCalNote("Sign in first. The personal planner is what keeps pickleball from landing on a park morning.");
        return;
      }
      const json = (await res.json()) as { boards?: { calendar?: CalendarBoard } };
      const tasks = json.boards?.calendar?.tasks || [];
      const row: CalTask = {
        id: `cal-park-${Date.now().toString(36)}`,
        title: `Leave for ${gate.name}`,
        notes: `Gate aim ${openTime}. About ${total} minutes door to parking, including the lot cushion. One park.`,
        startDate: leave.date,
        startTime: leave.time,
        endDate: parkDate,
        endTime: openTime,
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
      setCalNote("On the personal planner. Pickleball can reschedule. The parking tram will not.");
    } catch {
      setCalNote("The calendar did not answer. The leave-by time is still on this page.");
    } finally {
      setCalBusy(false);
    }
  }

  async function savePackReminder() {
    if (!parkDate) {
      setCalNote("Pick the park date first, then the packing reminder has somewhere to sit.");
      return;
    }
    setCalBusy(true);
    setCalNote(null);
    try {
      const res = await fetch("/api/members/space/boards", { cache: "no-store", credentials: "include" });
      if (res.status === 401) {
        setCalNote("Sign in first if you want the packing list on the personal planner.");
        return;
      }
      const json = (await res.json()) as { boards?: { calendar?: CalendarBoard } };
      const tasks = json.boards?.calendar?.tasks || [];
      const night = new Date(`${parkDate}T12:00:00`);
      night.setDate(night.getDate() - 1);
      const date = `${night.getFullYear()}-${pad(night.getMonth() + 1)}-${pad(night.getDate())}`;
      const row: CalTask = {
        id: `cal-pack-${Date.now().toString(36)}`,
        title: `Pack for ${gate.name}`,
        notes: "Sunscreen, hats, shoes, medications, a change of clothes for the kids, ponchos, ticket screenshot.",
        startDate: date,
        startTime: "19:00",
        endDate: date,
        endTime: "19:30",
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
        setCalNote(saved.status === 403 ? "The personal planner is on Lanai Legend." : "The calendar did not take the packing reminder.");
        return;
      }
      setCalNote("Packing reminder is the night before, on the personal planner.");
    } catch {
      setCalNote("The calendar did not answer.");
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
      const res = await fetch("/api/parks/gallery", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ park: gate.name, caption, image }),
      });
      const json = (await res.json()) as { photos?: typeof photos; error?: string };
      if (!res.ok) {
        setPhotoNote(json.error || "The gallery did not take that one.");
        return;
      }
      setPhotos(json.photos || []);
      setCaption("");
      setPhotoNote("Hung on the wall. The castle does not get a vote.");
    } catch (err) {
      setPhotoNote(err instanceof Error ? err.message : "The gallery did not take that one.");
    } finally {
      setPhotoBusy(false);
    }
  }

  return (
    <>
      <section className="section" id="park-drive" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>When the grandkids are actually here</h2>
              <p>
                Most of these days happen because someone small is visiting. One park. Leave in the morning.
                The golf cart stays home. There is no cart path at the castle.
              </p>
            </div>
          </div>
          <div className="about-panel cruise-desk">
            <label>
              Park
              <select value={gateId} onChange={(event) => setGateId(event.target.value)}>
                {GATES.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Park date
              <input type="date" value={parkDate} onChange={(event) => setParkDate(event.target.value)} />
            </label>
            <label>
              Rope-drop time you are aiming for
              <input type="time" value={openTime} onChange={(event) => setOpenTime(event.target.value)} />
            </label>
            <label>
              Minutes from maps, if you just looked
              <input
                inputMode="numeric"
                placeholder={String(gate.minutes)}
                value={mapsMinutes}
                onChange={(event) => setMapsMinutes(event.target.value)}
              />
            </label>
            <p>
              <strong>{gate.drive}, clear road, from the middle of The Villages.</strong> {padInfo.why} Plus 25
              minutes for the parking lot and the tram. Plan on about {Math.floor(total / 60)} hours
              {total % 60 ? ` ${total % 60} minutes` : ""}.
            </p>
            {leave ? (
              <p className="cruise-leave">Leave by {formatWhen(leave.date, leave.time)}.</p>
            ) : (
              <p>Add the date and the leave-by line will show up.</p>
            )}
            <div className="hero-actions">
              <button type="button" className="btn btn-primary" disabled={calBusy} onClick={() => void saveLeaveBy()}>
                {calBusy ? "Saving…" : "Put the leave-by time on my calendar"}
              </button>
              <a className="btn btn-ghost" href={maps(gate.query)} target="_blank" rel="noopener noreferrer">
                Directions
              </a>
              <Link className="btn btn-ghost" href="/golf-cart-hero">
                Beat the drive home in Golf Cart Hero
              </Link>
            </div>
            {calNote ? <p>{calNote}</p> : null}
          </div>
        </div>
      </section>

      <section className="section" id="park-compare" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>What the day is actually for</h2>
              <p>Disney for the classics. Universal for the movies and the coasters. SeaWorld for a seat and an animal. Busch Gardens when the taller kids want Tampa.</p>
            </div>
          </div>
          <div className="ms-boat-grid">
            {GATES.slice(0, 4).map((row) => (
              <article key={row.id} className="about-panel trip-card cruise-compare">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={row.image} alt="" />
                <div className="trip-card-body">
                  <p className="ms-boat-meta">{row.drive}</p>
                  <h3>{row.name}</h3>
                  <p>{row.best}</p>
                  <a className="btn btn-primary btn-sm" href={maps(row.query)} target="_blank" rel="noopener noreferrer">
                    Directions
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="park-kids" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Build the day around the kids</h2>
              <p>Ages first. Interests second. A second park is how a good morning becomes a congressional hearing in the car.</p>
            </div>
          </div>
          <div className="about-panel cruise-desk">
            <label>
              Youngest grandkid in the car
              <select value={age} onChange={(event) => setAge(event.target.value)}>
                <option value="little">Under 5</option>
                <option value="kid">5 to 8</option>
                <option value="bigger">9 to 12</option>
                <option value="teen">Teenager, allegedly</option>
              </select>
            </label>
            <label>
              What they will actually do
              <select value={interest} onChange={(event) => setInterest(event.target.value)}>
                <option value="characters">Characters and the castle</option>
                <option value="coasters">The big rides</option>
                <option value="animals">Animals</option>
                <option value="shows">Shows and a seat</option>
                <option value="water">Water</option>
              </select>
            </label>
            <p>{planFor(age, interest)}</p>
            <p>
              Splitting one day between two parks only works when the ticket says hopper or park-to-park, and
              even then the second gate is a maybe. Height rules are posted at the ride. They do not bend for a
              birthday. Rider switch, where a park offers it, lets two adults take turns without leaving a small
              child alone. Look that up on the park’s site the week you go.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="park-tickets" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Tickets, passes, and whether this year is the year</h2>
              <p>
                Prices move. Parking is usually extra. The number on a blog is how people arrive at a turnstile
                with the wrong barcode. The park’s own site is the price.
              </p>
            </div>
          </div>
          <div className="ms-boat-grid">
            {GATES.map((row) => (
              <article key={row.id} className="about-panel">
                <h3>{row.name}</h3>
                <p>
                  A day ticket is the grandkid visit. An annual pass is for the neighbor who goes again after the
                  children leave. Both are sold on the park’s site, and Florida-resident offers show up there when
                  the park feels like it. This page will not invent today’s number.
                </p>
                <a className="btn btn-primary btn-sm" href={row.tickets} target="_blank" rel="noopener noreferrer">
                  Current tickets
                </a>
              </article>
            ))}
          </div>
          <div className="about-panel" style={{ marginTop: "1rem" }}>
            <h3>Is it worth it this year?</h3>
            <p>
              If the grandkids are here for two days, buy two day tickets and stop doing math. If you are the one
              who goes every month whether or not a child is attached, look at that park’s annual pass on its own
              site and count the trips you will really take. A pass you use twice is a souvenir. A hopper ticket
              on a 95-degree day is how someone cries in a parking tram. AAA, Costco, or Sam’s only count if you
              already belong and the price is the real one.
            </p>
          </div>
        </div>
      </section>

      <section className="section" id="park-crowds" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>When the park is full of other people’s grandkids</h2>
              <p>These are the usual weeks, not a live wait-time board. Holidays ignore the polite days.</p>
            </div>
          </div>
          <div className="ms-boat-grid">
            {GATES.map((row) => (
              <article key={row.id} className="about-panel">
                <h3>{row.name}</h3>
                <p>{row.crowd}</p>
                <p>
                  Early entry only counts when your ticket or hotel says you have it. Disney’s paid way to hold a
                  ride time changes its name and its price. Read it in the park’s app the week you go. The big
                  rides are a morning errand.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="park-senior" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Knees, scooters, and the good bench</h2>
              <p>
                A scooter is a tool. The big parks rent wheelchairs and scooters on site. The disability pass
                each company offers has changed more than once. Read this year’s rule on that park’s site.
              </p>
            </div>
          </div>
          <div className="ms-boat-grid">
            {GATES.map((row) => (
              <article key={row.id} className="about-panel">
                <h3>{row.name}</h3>
                <p>{row.senior}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="park-dinner" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Feed the troops</h2>
              <p>
                Dinner next to the gate is Disney Springs or CityWalk, already on this page, and neither needs a
                second theme-park ticket. Dinner back in The Villages is the Dining list. The drive home is the
                same drive you already survived.
              </p>
            </div>
          </div>
          <div className="hero-actions" style={{ marginBottom: "1rem" }}>
            <a className="btn btn-ghost btn-sm" href="#springs">Disney Springs</a>
            <a className="btn btn-ghost btn-sm" href="#citywalk">CityWalk</a>
            <button type="button" className={`btn btn-sm ${troops ? "btn-primary" : "btn-ghost"}`} onClick={() => setTroops(true)}>
              Feed the troops
            </button>
            <button type="button" className={`btn btn-sm ${troops ? "btn-ghost" : "btn-primary"}`} onClick={() => setTroops(false)}>
              All of these
            </button>
          </div>
          <div className="ms-boat-grid">
            {meals.map((row) => (
              <article key={row.slug} className="about-panel">
                <p className="ms-boat-meta">{row.area} · about {gate.drive} back from {gate.name}</p>
                <h3>{row.name}</h3>
                <p>{row.note}</p>
                <Link className="btn btn-primary btn-sm" href={`/dining/${row.slug}`}>
                  On the Dining page
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="park-pack" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>What to pack for a Florida park day</h2>
              <p>The sun is not a suggestion. Neither is the thunderstorm that shows up after lunch like it was invited.</p>
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
            <p>
              Comfortable shoes means shoes you have walked in. A new pair debuts as a blister. Medications stay
              with you. The change of clothes is for the child who met a fountain, a splash pad, or their own
              drink. Put the ticket on the phone and take a screenshot before you lose signal in the parking garage.
            </p>
            <button type="button" className="btn btn-primary" disabled={calBusy} onClick={() => void savePackReminder()}>
              Remind me to pack the night before
            </button>
          </div>
        </div>
      </section>

      <section className="section" id="park-weather" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Lightning will close the pretty rides</h2>
              <p>
                Outdoor rides and every water slide stop when thunder is close. This is the hurricane center’s
                current Atlantic list, plus the ordinary afternoon storm that does not get a name.
              </p>
            </div>
          </div>
          <div className="about-panel cruise-desk">
            {storms === null ? <p>Checking the hurricane center…</p> : null}
            {storms && storms.length === 0 ? <p>No named Atlantic system on the current bulletin. The 3 p.m. thunderstorm still has a reservation.</p> : null}
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

      <section className="section" id="park-photos" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Proof the grandkids were here</h2>
              <p>Hang the photo, name the park, and skip the algorithm. Maximum chaos is the house style.</p>
            </div>
          </div>
          <div className="about-panel cruise-desk">
            <label>
              Caption
              <input value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="What the photo is actually of" />
            </label>
            <p className="ms-boat-meta">Tagged park: {gate.name}. Change it in the leave-by box above if this was a different gate.</p>
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
                  <p className="ms-boat-meta">{photo.park}</p>
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
