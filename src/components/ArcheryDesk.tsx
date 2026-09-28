"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { saveCapeReminder } from "@/lib/capeCalendar";

const RANGES = [
  {
    id: "villages",
    name: "Shooters World, The Villages",
    minutes: 15,
    drive: "About 15 minutes, a planning figure. It is in town.",
    outdoor: false,
    address: "4988 County Road 44A, The Villages, FL 32163",
    hours:
      "Sunday through Friday 10 a.m. to 7 p.m. Saturday 9 a.m. to 7 p.m. The last new shooter is taken 60 minutes before close. A full hour on the lane means checking in 90 minutes before the door locks.",
    fee: "Their pricing page lists 15- and 25-yard lanes at $20 an hour, plus $10 for another shooter on the same lane. The 100-yard lanes are $30 an hour, plus $15 for another shooter. A shooter card is $10 a year. Rented eyes are $2, ears $3, electronic ears $5, and a paper target $1. Monday is ladies day: non-member women shoot free on an open lane.",
    classes:
      "First Shots is 2 hours, ages 11 and up, $10. They supply a .22 rifle, five rounds, and eyes and ears. Intro to Handguns is 3 hours, ages 21 and up, $100, and you bring a pistol and 25 rounds unless you come with a second adult and use one of theirs. Dated seats are on the Book Your Villages Class buttons. They do not print a fixed weekly grid.",
    href: "https://shootersworld.com/shooting-range-gun-store-locations/the-villages-indoor-shooting-range/",
    hrefLabel: "Villages range",
    classHref: "https://shootersworld.com/training/first-shots/",
    classLabel: "First Shots",
    query: "Shooters World 4988 County Road 44A The Villages Florida",
  },
  {
    id: "blackjack",
    name: "Blackjack Sporting Clays",
    minutes: 25,
    drive: "About 25 minutes",
    outdoor: true,
    address: "3372 County Road 526, Sumterville, FL 33585",
    hours:
      "The card above lists Wednesday through Friday 8 a.m. to 2 p.m., and Saturday and Sunday 8 a.m. to 3 p.m., closed Monday and Tuesday. The homepage does not repeat a clock. Confirm before you load the car.",
    fee: "Round prices are a download on their site. This page will not guess one.",
    classes:
      "They rent Beretta shotguns and eyes and ears, first come, first served. A dated beginner class is not posted on the homepage. Call (352) 569-9469.",
    href: "https://www.blackjackclays.com/",
    hrefLabel: "Blackjack",
    classHref: "https://www.blackjackclays.com/rates",
    classLabel: "Rates download",
    query: "Blackjack Sporting Clays 3372 County Road 526 Sumterville",
  },
  {
    id: "eustis",
    name: "Eustis Gun Club",
    minutes: 40,
    drive: "About 40 minutes",
    outdoor: true,
    address: "12950 Frankies Road, Tavares, FL 32778",
    hours:
      "The hours block says Monday and Friday 7 a.m. to 5 p.m., Tuesday through Thursday 7 a.m. to 7 p.m., and weekends 7 a.m. to 5 p.m. The tour paragraph on the same page says Tuesday through Thursday until 5. Call (352) 408-8869 and believe the person who answers.",
    fee: "It is a membership club. The range itself is for members. A tour needs no appointment: check in at the office with the range officer. The card above mentions trap or skeet around $6 a round. Confirm the clay price and the guest rule before you drive.",
    classes:
      "No beginner-class calendar is printed on the homepage. Lake County Pistoleros shoot every third Saturday in the western town. The start time for that shoot is not on the page.",
    href: "https://www.eustisgunclub.org/",
    hrefLabel: "Eustis Gun Club",
    classHref: "https://www.eustisgunclub.org/",
    classLabel: "Club home",
    query: "Eustis Gun Club 12950 Frankies Road Tavares Florida",
  },
  {
    id: "ocala",
    name: "Ocala Shooting Range",
    minutes: 50,
    drive: "About 50 minutes",
    outdoor: true,
    address: "Forest Road 11, north of State Road 40. FWC prints 29°11'16.80\"N, 81°46'14.15\"W.",
    hours: "Sunrise to sunset. Closed Wednesday until 2 p.m. for maintenance. Also closed from sunset to sunrise.",
    fee: "Free. You bring the targets, the clays, and the thrower. Target frames are there. Vault toilets are the restroom.",
    classes:
      "Nobody is on site to teach. FWC's hunter-safety course is the class, and it lives on MyFWC, not at this gate. Phone (352) 625-2804 if the gate does not match the page.",
    href: "https://myfwc.com/hunting/safety-education/shooting-ranges/ocala/",
    hrefLabel: "FWC range page",
    classHref: "https://myfwc.com/hunting/safety-education/",
    classLabel: "Hunter safety",
    query: "Ocala Shooting Range Forest Road 11 Ocala National Forest",
  },
  {
    id: "robinson",
    name: "Robinson Ranch Trap and Skeet",
    minutes: 50,
    drive: "About 50 minutes",
    outdoor: true,
    address: "19730 Southeast 127th Terrace, Dunnellon, FL 34431",
    hours:
      "Tuesday, Wednesday, Thursday, Saturday, and Sunday, 8:30 a.m. to 1 p.m. Closed Monday and Friday, and closed on holidays. Five-stand and crazy quail are closed on Thursday. Call if you will arrive after noon: (352) 572-7339.",
    fee: "They say the prices are competitive and they do not print a round price on the homepage. Call.",
    classes: "They say the coaches welcome newcomers. A dated beginner grid is not on the homepage.",
    href: "https://robinsonranch-trap-skeet.com/",
    hrefLabel: "Robinson Ranch",
    classHref: "https://robinsonranch-trap-skeet.com/",
    classLabel: "Club home",
    query: "Robinson Ranch Trap and Skeet Dunnellon Florida",
  },
  {
    id: "tenoroc",
    name: "Tenoroc Public Shooting Range",
    minutes: 80,
    drive: "About 1 hour 20 minutes",
    outdoor: true,
    address: "3755 Tenoroc Mine Road, Lakeland, FL 33805. FWC prints 28°05'29.23\"N, 81°52'58.82\"W.",
    hours:
      "Monday, Thursday, and Friday 9 a.m. to 5 p.m. Saturday and Sunday 8 a.m. to 5 p.m. Closed Tuesday, Wednesday, Easter, Thanksgiving, Christmas, and New Year's Day. FWC says to read the updates at the top of the range page, because these are the normal hours.",
    fee: "The FWC page now lists rifle and handgun at $15 plus tax a day, and archery only at $15 plus tax. A rifle or handgun fee also covers the archery ranges that day. Sporting clays are $45 per 100 targets. Trap and 5-stand are 45 cents a clay. An electric cart is $25. A push cart is $5. Youth 15 and under are free on the rifle and handgun ranges with a paying adult 21 or older. The card higher on this page still quotes an older posting of $12 and $38. The office charges the number on the range page the week you go.",
    classes:
      "The page says the range takes hunter-safety students. It does not publish a separate weekly beginner grid. The course itself is on MyFWC. Phone (863) 606-0093.",
    href: "https://myfwc.com/hunting/safety-education/shooting-ranges/tenoroc/",
    hrefLabel: "FWC range page",
    classHref: "https://myfwc.com/hunting/safety-education/",
    classLabel: "Hunter safety",
    query: "Tenoroc Public Shooting Range Lakeland Florida",
  },
  {
    id: "ridge",
    name: "Ridge Archers",
    minutes: 80,
    drive: "About 1 hour 20 minutes, same gate as Tenoroc",
    outdoor: true,
    address: "3755 Tenoroc Mine Road, Lakeland, FL 33805",
    hours:
      "Except on a club shoot, you check in at the FWC office, so the FWC clock above is the clock. Members may be on the course outside those hours and should carry the membership card.",
    fee: "Their 2026 membership is $80 for a single or a family, January through December. Fun-shoot registration is $15 for members, $20 for everyone else, and free for kids 12 and under. Qualifier fees vary. Their range page tells non-members to expect a $12.50 FWC check-in. FWC's own archery line is $15 plus tax. Pay the number the window asks. Broadheads stay home unless the event says otherwise.",
    classes:
      "The published beginner-friendly dates are the club fun shoots. Registration at 8 a.m., shooting at 9. The 2026 sheet they posted runs through July. Next year's dates go on that same schedule page when they hang them.",
    href: "https://ridgearchersattenoroc.com/schedule-3/",
    hrefLabel: "2026 schedule",
    classHref: "https://ridgearchersattenoroc.com/membership/",
    classLabel: "Membership",
    query: "Ridge Archers Tenoroc Mine Road Lakeland",
  },
  {
    id: "orlando",
    name: "Shooters World Orlando",
    minutes: 80,
    drive: "About 1 hour 20 minutes",
    outdoor: false,
    address: "4850 Lawing Lane, Orlando",
    hours: "Hours are on their Orlando page. Confirm them before the longer drive. The Villages store is the closer lane.",
    fee: "The company pricing page is the same one quoted for The Villages: $20 an hour on the shorter lanes, $30 on the long ones, eyes and ears extra. Confirm the Orlando lane list on their site.",
    classes: "First Shots and Intro to Handguns are offered in Orlando too. Book the Orlando button, not the Villages one.",
    href: "https://shootersworld.com/",
    hrefLabel: "Shooters World",
    classHref: "https://shootersworld.com/training/introduction-to-handguns-class/",
    classLabel: "Intro to Handguns",
    query: "Shooters World 4850 Lawing Lane Orlando Florida",
  },
];

const RIDGE_2026 = [
  ["January 11", "Grimes Memorial Shoot"],
  ["February 8", "ASA qualifier and club fun shoot"],
  ["March 15", "Florida 3D Circuit qualifier and club fun shoot"],
  ["May 16", "FAA 3D and club fun shoot"],
  ["June 28", "Club fun shoot"],
  ["July 11", "Year-end 3D shoot"],
  ["July 18 and 19", "ASA State Championship, hosted at Tampa Bay Sporting Clays"],
];

const PACK = [
  { id: "eyes", label: "Eye protection. On before you step to the line, not after the first bang." },
  { id: "ears", label: "Ear protection over the ears. Earbuds that play music are not ear protection." },
  { id: "shoes", label: "Closed-toe shoes. Shooters World also turns away tank tops." },
  { id: "id", label: "Photo ID. Under 18, a legal guardian comes on the lane with you." },
  { id: "rules", label: "The range's own rule page, read once in the parking lot." },
  { id: "targets", label: "Targets, if that range does not sell them. Ocala does not." },
  { id: "water", label: "Water. An outdoor berm in July is a sauna with a rule book." },
  { id: "sun", label: "Hat and sunscreen when the range is outside." },
  { id: "meds", label: "Medications in a pocket you can find without dumping the range bag." },
  { id: "heads", label: "Broadheads stay home unless the event sheet says they are welcome." },
];

const BOW_TARGETS = [
  ["Double D Hunting printable targets", "https://doubledhunting.com/printable-shooting-targets"],
  ["Targets.ws", "https://targets.ws"],
  ["Waterproof Paper targets", "https://waterproofpaper.com/targets"],
];

const GUN_TARGETS = [
  ["GunRanges.org shooting targets", "https://gunranges.org/shooting-targets"],
  ["Targets.ws", "https://targets.ws"],
  ["Mossy Oak free printable targets", "https://www.mossyoak.com/our-obsession/blogs/hunting/free-printable-shooting-targets"],
];

function maps(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function trafficPad(date: string, time: string) {
  if (!date || !time) return { minutes: 10, why: "A small cushion for the parking lot and the waiver." };
  const day = new Date(`${date}T${time}:00`).getDay();
  const hour = Number(time.slice(0, 2));
  if ((day === 0 || day === 6) && hour < 11) {
    return { minutes: 20, why: "Weekend morning. The good stalls fill before the first shot." };
  }
  if (hour >= 13) return { minutes: 15, why: "Afternoon. You are sharing the road with everyone who waited out the heat." };
  return { minutes: 10, why: "A small cushion for the parking lot and the waiver." };
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
  if (code === 45 || code === 48) return "Fog is in the code. A forest road hides the car in front of you.";
  if (code >= 95) return "Thunder is in the code. An outdoor berm is the wrong place to debate it.";
  if (code >= 80) return "Showers are in the code.";
  if (code >= 51) return "Rain is in the code.";
  return "The sky code is odd. Look outside before you case anything.";
}
function nextThirdSaturday(today = new Date()) {
  const cursor = new Date(today.getFullYear(), today.getMonth(), 1, 12);
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  for (let i = 0; i < 14; i += 1) {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1, 12);
    const offset = (6 - first.getDay() + 7) % 7;
    const third = new Date(first);
    third.setDate(first.getDate() + offset + 14);
    const key = `${third.getFullYear()}-${pad(third.getMonth() + 1)}-${pad(third.getDate())}`;
    if (key >= todayKey) return key;
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return "";
}
function prettyDate(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
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

type Photo = { id: string; range: string; gear: string; caption: string; by: string; image: string };
type Sky = { temp: number | null; wind: number | null; gust: number | null; code: number | null; rainChance: number | null };

export function ArcheryDesk() {
  const [rangeId, setRangeId] = useState("villages");
  const [tripDate, setTripDate] = useState("");
  const [arrive, setArrive] = useState("09:00");
  const [mapsMinutes, setMapsMinutes] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [sky, setSky] = useState<Sky | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [rangeName, setRangeName] = useState("");
  const [gear, setGear] = useState("");
  const [caption, setCaption] = useState("");
  const skipCheckWrite = useRef(true);
  const range = RANGES.find((row) => row.id === rangeId) || RANGES[0];
  const padInfo = trafficPad(tripDate, arrive);
  const typed = Number(mapsMinutes);
  const driveMinutes = Number.isFinite(typed) && typed > 0 ? Math.round(typed) : range.minutes;
  const total = driveMinutes + padInfo.minutes;
  const leave = useMemo(() => leaveBy(tripDate, arrive, total), [tripDate, arrive, total]);
  const thirdSaturday = useMemo(() => nextThirdSaturday(), []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("tvea-range-check");
      if (saved) setChecks(JSON.parse(saved) as Record<string, boolean>);
    } catch {
      /* storage can refuse */
    }
    void fetch("/api/archery/weather")
      .then((res) => res.json())
      .then((json: Sky) => setSky(json))
      .catch(() => setSky({ temp: null, wind: null, gust: null, code: null, rainChance: null }));
    void fetch("/api/archery/log", { cache: "no-store" })
      .then((res) => res.json())
      .then((json: { photos?: Photo[] }) => setPhotos(json.photos || []))
      .catch(() => setPhotos([]));
  }, []);

  useEffect(() => {
    if (skipCheckWrite.current) {
      skipCheckWrite.current = false;
      return;
    }
    localStorage.setItem("tvea-range-check", JSON.stringify(checks));
  }, [checks]);

  async function saveLeave() {
    if (!leave) {
      setNote("Pick the date and the time you want to be there.");
      return;
    }
    setBusy(true);
    setNote(
      await saveCapeReminder({
        title: `Leave for ${range.name}`,
        notes: `${range.address} Aim to arrive at ${arrive}. About ${total} minutes with the parking-lot cushion.`,
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

  async function savePack() {
    if (!tripDate) {
      setNote("Pick the date first.");
      return;
    }
    const night = new Date(`${tripDate}T12:00:00`);
    night.setDate(night.getDate() - 1);
    const date = `${night.getFullYear()}-${pad(night.getMonth() + 1)}-${pad(night.getDate())}`;
    setBusy(true);
    setNote(
      await saveCapeReminder({
        title: "Eyes and ears for the range",
        notes: "Eye protection, ear protection, closed-toe shoes, ID, the range rules, targets if they do not sell them, water, hat, medications.",
        startDate: date,
        startTime: "19:00",
        endDate: date,
        endTime: "19:30",
        timerMinutes: null,
        timerEndsAt: null,
        timerPausedMs: null,
        alarmEnabled: true,
        done: false,
      })
    );
    setBusy(false);
  }

  async function saveSaturday() {
    if (!thirdSaturday) return;
    setBusy(true);
    setNote(
      await saveCapeReminder({
        title: "Eustis Gun Club third-Saturday shoot",
        notes: "Lake County Pistoleros. Their site says every third Saturday. The start time is not printed. The club opens at 7 a.m. on weekends. Call (352) 408-8869. 12950 Frankies Road, Tavares.",
        startDate: thirdSaturday,
        startTime: "07:00",
        endDate: thirdSaturday,
        endTime: "11:00",
        timerMinutes: null,
        timerEndsAt: null,
        timerPausedMs: null,
        alarmEnabled: true,
        done: false,
      })
    );
    setBusy(false);
  }

  async function sharePhoto(file: File | null) {
    if (!file) return;
    setBusy(true);
    setNote(null);
    try {
      const image = await shrinkPhoto(file);
      const res = await fetch("/api/archery/log", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ range: rangeName, gear, caption, image }),
      });
      const json = (await res.json()) as { photos?: Photo[]; error?: string };
      if (!res.ok) {
        setNote(json.error || "The wall did not take that one.");
        return;
      }
      setPhotos(json.photos || []);
      setCaption("");
      setNote("Hung on the wall. No score. No algorithm. The target does not get a vote.");
    } catch (err) {
      setNote(err instanceof Error ? err.message : "The wall did not take that one.");
    } finally {
      setBusy(false);
    }
  }

  const gust = sky?.gust;
  const thunder = sky?.code != null && sky.code >= 95;
  const weatherLine =
    sky === null
      ? "Checking the sky over town…"
      : gust == null
        ? "The forecast did not answer. Look at the sky before you leave the cart barn."
        : !range.outdoor
          ? `This lane is indoors. Over town it is about ${sky.temp ?? "—"}°, wind ${sky.wind ?? "—"} mph, gusts near ${gust}. Thunder still owns the parking lot and the drive.`
          : gust >= 20 || thunder
            ? `Outdoor range. Gusts around ${gust} mph${sky.temp != null ? `, about ${sky.temp}°` : ""}. Paper targets become kites, and lightning sends everybody to the car. This is a reading over town, not at the berm.`
            : `Outdoor range. Wind about ${sky.wind ?? "—"} mph, gusts near ${gust}${sky.temp != null ? `, about ${sky.temp}°` : ""}. Still watch the sky after lunch.`;

  return (
    <>
      <div className="ms-boat-section-art" id="ms-arch-drive">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/outdoors/archery.jpg" alt="" />
        <h3 className="my-space-block-title">When to leave for the range</h3>
      </div>
      <div className="about-panel cruise-desk">
        <label>
          Range
          <select value={rangeId} onChange={(event) => setRangeId(event.target.value)}>
            {RANGES.map((row) => (
              <option key={row.id} value={row.id}>{row.name}</option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input type="date" value={tripDate} onChange={(event) => setTripDate(event.target.value)} />
        </label>
        <label>
          Be there by
          <input type="time" value={arrive} onChange={(event) => setArrive(event.target.value)} />
        </label>
        <label>
          Minutes from maps, if you just looked
          <input inputMode="numeric" placeholder={String(range.minutes)} value={mapsMinutes} onChange={(event) => setMapsMinutes(event.target.value)} />
        </label>
        <p>
          <strong>{range.drive}</strong> From the middle of The Villages. {padInfo.why} Plan on about {total} minutes.
          A number you type from maps replaces the planning figure.
        </p>
        <p>{range.address}</p>
        <p><strong>Hours.</strong> {range.hours}</p>
        <p><strong>Fee.</strong> {range.fee}</p>
        <p><strong>A first class.</strong> {range.classes}</p>
        {leave ? <p className="cruise-leave">Leave by {formatWhen(leave.date, leave.time)}.</p> : <p>Add the date and the leave-by line will show up.</p>}
        <div className="hero-actions">
          <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void saveLeave()}>
            {busy ? "Saving…" : "Put the leave-by time on my calendar"}
          </button>
          <a className="btn btn-ghost" href={maps(range.query)} target="_blank" rel="noopener noreferrer">Range in maps</a>
          <a className="btn btn-ghost" href={range.href} target="_blank" rel="noopener noreferrer">{range.hrefLabel}</a>
          <a className="btn btn-ghost" href={range.classHref} target="_blank" rel="noopener noreferrer">{range.classLabel}</a>
          <Link className="btn btn-ghost" href="/golf-cart-hero">Beat the drive home in Golf Cart Hero</Link>
        </div>
        {note ? <p>{note}</p> : null}
      </div>

      <div className="ms-boat-section-art" id="ms-arch-new">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/outdoors/archery.jpg" alt="" />
        <h3 className="my-space-block-title">New to this, and that is fine</h3>
      </div>
      <div className="ms-boat-grid">
        <article className="about-panel ms-boat-card">
          <h3>A bow, first</h3>
          <p>
            A bow is a rubber band with opinions. Start where someone will hand you an arm guard and tell you which eye is in charge. The recreation centers run archery for residents. Tenoroc has a known-distance archery range with a range officer in the building. Ridge Archers is the woods course through the same gate, and a fun shoot is the friendliest way to see it.
          </p>
          <p>
            Nock an arrow only when the ground in front of you is empty. Dry-firing a bow, which is letting the string go with no arrow, can split the limb. Broadheads are for a hunt the event sheet named, not for the practice course.
          </p>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>A gun, first</h3>
          <p>
            A gun does not care that you are new. Four habits cover the first day. Treat every one as loaded. Keep the muzzle pointed downrange, or in the rack they named. Finger off the trigger until the sights are on the target. Know what is behind the target, because the berm is the plan and the tree line is not.
          </p>
          <p>
            If you have never fired one, Shooters World First Shots is the class that says so out loud: two hours, a .22 they provide, five rounds, eyes and ears. Intro to Handguns is the longer next step. FWC hunter safety is the class for the woods, and the card above already links it.
          </p>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>A clay, first</h3>
          <p>
            Trap is the usual first flying target: it leaves a house in front of you and goes away. Call for the bird only when it is your turn, the gun is mounted the way the post showed you, and the muzzle is pointed where that field wants it. Do not load while you are walking between posts.
          </p>
          <p>
            Blackjack is the close course. Robinson Ranch and Eustis Gun Club are the trap and skeet grounds. Tenoroc is the public one with a fee on the FWC page. Eyes and ears still come first. A flying orange disc is not quieter than a paper target.
          </p>
        </article>
      </div>

      <div className="ms-boat-section-art" id="ms-arch-pack">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/outdoors/archery.jpg" alt="" />
        <h3 className="my-space-block-title">What to pack for a range day</h3>
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
        <button type="button" className="btn btn-primary" disabled={busy} onClick={() => void savePack()}>
          Remind me about eyes and ears the night before
        </button>
      </div>

      <div className="ms-boat-section-art" id="ms-arch-league">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/outdoors/archery.jpg" alt="" />
        <h3 className="my-space-block-title">Shoots the clubs actually posted</h3>
      </div>
      <p className="panel-hint" style={{ marginTop: 0 }}>
        A dated league only shows up here when the club printed the date. Blackjack, Robinson Ranch, and Shooters World do not publish a season sheet this page can copy. Their buttons are above.
      </p>
      <div className="ms-boat-grid">
        <article className="about-panel ms-boat-card">
          <h3>Ridge Archers, 2026 sheet</h3>
          <p>Registration at 8 a.m. Shooting at 9. Fun shoots are $15 for members, $20 otherwise, and free for kids 12 and under.</p>
          <ul className="cruise-checks">
            {RIDGE_2026.map(([when, name]) => (
              <li key={when}><strong>{when}.</strong> {name}</li>
            ))}
          </ul>
          <p>That sheet ends in July. The next dates go on their schedule page when they hang them.</p>
          <a className="btn btn-ghost btn-sm" href="https://ridgearchersattenoroc.com/schedule-3/" target="_blank" rel="noopener noreferrer">Ridge schedule</a>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Every third Saturday at Eustis</h3>
          <p>
            Eustis Gun Club says Lake County Pistoleros shoot in the western town every third Saturday. The start time is not printed.
            {thirdSaturday ? ` The next third Saturday on the calendar is ${prettyDate(thirdSaturday)}.` : ""}
            {" "}The club can still cancel it. Call before you tow.
          </p>
          <button type="button" className="btn btn-primary" disabled={busy || !thirdSaturday} onClick={() => void saveSaturday()}>
            Put that Saturday on my calendar
          </button>
        </article>
      </div>

      <div className="ms-boat-section-art" id="ms-arch-sky">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/outdoors/archery.jpg" alt="" />
        <h3 className="my-space-block-title">Sky before an outdoor range day</h3>
      </div>
      <div className="about-panel cruise-desk">
        <p>{weatherLine}</p>
        {skyWords(sky?.code ?? null) ? <p>{skyWords(sky?.code ?? null)}</p> : null}
        {sky?.rainChance != null ? (
          <p>Today’s rain chance over town is about {Math.round(sky.rainChance)} percent. Summer thunder still builds after lunch. If the sky goes pewter, the target can wait.</p>
        ) : (
          <p>Summer thunder still builds after lunch. If the sky goes pewter, the target can wait. The same rule as the golf course.</p>
        )}
        <a className="btn btn-ghost" href="https://www.nhc.noaa.gov/" target="_blank" rel="noopener noreferrer">National Hurricane Center</a>
      </div>

      <div className="ms-boat-section-art" id="ms-arch-safe">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/outdoors/archery.jpg" alt="" />
        <h3 className="my-space-block-title">How a polite person acts on a range</h3>
      </div>
      <div className="ms-boat-grid">
        <article className="about-panel ms-boat-card">
          <h3>The line</h3>
          <p>
            Eyes and ears go on in the parking lot. A cold range means the action is open, the muzzle points downrange or in the rack they named, and nobody walks forward until the line is called. Do not pick up brass while the line is hot. The brass will wait. Your eardrums will not.
          </p>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>When nobody is in charge</h3>
          <p>
            Ocala is unsupervised. You are the grown-up. Agree on a cold range with the people already there before you uncase. If you cannot see who is downrange, you are not ready. FWC’s safety page is linked on the card above, and it is the one to read in the car.
          </p>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Manners</h3>
          <p>
            The person at full draw, or about to call pull, is the only person whose shot matters. Save the story for the cart ride. If you do not know the command, ask the range officer before you uncase. Pick up what their sign says to pick up. Alcohol stays in the cooler at home.
          </p>
          <p>
            Shooters World adds its own list: no open-toed shoes, no tank tops, no reloaded ammunition, and no bows. Their range-rules page is the rest of that list.
          </p>
          <a className="btn btn-ghost btn-sm" href="https://shootersworld.com/indoor-shooting-range/range-rules-policies/" target="_blank" rel="noopener noreferrer">Shooters World rules</a>
        </article>
      </div>

      <div className="ms-boat-section-art" id="ms-arch-targets">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/outdoors/archery.jpg" alt="" />
        <h3 className="my-space-block-title">Targets you can print</h3>
      </div>
      <p className="panel-hint" style={{ marginTop: 0 }}>
        These sheets live on other people’s sites. Print them at home. Staple the paper flat so the wind does not steer the arrow.
      </p>
      <div className="ms-boat-grid">
        <article className="about-panel ms-boat-card">
          <h3>Archery</h3>
          <div className="hero-actions">
            {BOW_TARGETS.map(([label, href]) => (
              <a key={href} className="btn btn-primary btn-sm" href={href} target="_blank" rel="noopener noreferrer">{label}</a>
            ))}
          </div>
        </article>
        <article className="about-panel ms-boat-card">
          <h3>Pistol and rifle</h3>
          <div className="hero-actions">
            {GUN_TARGETS.map(([label, href]) => (
              <a key={href + label} className="btn btn-primary btn-sm" href={href} target="_blank" rel="noopener noreferrer">{label}</a>
            ))}
          </div>
        </article>
      </div>

      <div className="ms-boat-section-art" id="ms-arch-photos">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/graphics/outdoors/archery.jpg" alt="" />
        <h3 className="my-space-block-title">Back from the range</h3>
      </div>
      <div className="about-panel cruise-desk">
        <p>
          Hang the photo. There is no score, no ranking, and no algorithm deciding your group was not chaotic enough. A torn target, a quiet bow, and a golf-cart grin all count.
        </p>
        <label>
          Range
          <input value={rangeName} onChange={(event) => setRangeName(event.target.value)} placeholder="Which range, or which rec-center lane" />
        </label>
        <label>
          What you shot
          <input value={gear} onChange={(event) => setGear(event.target.value)} placeholder="Bow, pistol, trap, or a .22 that behaved" />
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
        {photos.length === 0 ? <p className="panel-hint">The wall is empty. A target with one lonely hole is still a photo.</p> : null}
        {photos.map((photo) => (
          <article key={photo.id} className="about-panel trip-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.image} alt={photo.caption || "A range-day photo"} />
            <div className="trip-card-body">
              <p className="ms-boat-meta">{photo.range}{photo.gear ? ` · ${photo.gear}` : ""}</p>
              <h3>{photo.caption}</h3>
              <p className="ms-boat-meta">{photo.by}</p>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
