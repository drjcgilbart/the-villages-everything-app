"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  emptyBoards,
  RECIPE_CATEGORIES,
  type FoodBoard,
  type FoodCellar,
  type FoodFavorite,
  type FoodGrocery,
  type FoodHappyHour,
  type FoodRecipe,
} from "@/lib/memberBoardModel";
import { useMemberBoard } from "@/components/useMemberBoard";

type FoodTab =
  | "guide"
  | "favorites"
  | "recipes"
  | "happy"
  | "grocery"
  | "cellar"
  | "meals"
  | "tip";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const SQUARES = [
  { id: "spanish-springs", label: "Spanish Springs" },
  { id: "lake-sumter", label: "Lake Sumter Landing" },
  { id: "brownwood", label: "Brownwood Paddock Square" },
  { id: "neighborhood", label: "Neighborhood rec center" },
  { id: "nearby", label: "Nearby (441 / Lady Lake)" },
  { id: "other", label: "Other" },
];
const DINING = [
  { name: "City Fire American Oven & Bar", square: "spanish-springs", cuisine: "American · pizza · bar", note: "Flagship at the square — wood-fired pies and a busy happy hour." },
  { name: "The Bowery", square: "spanish-springs", cuisine: "Bar · late night", note: "Classic square watering hole after the nightly music." },
  { name: "Johnny Rockets", square: "spanish-springs", cuisine: "Burgers · shakes", note: "Easy with grandkids; also at the other two squares." },
  { name: "Nancy's", square: "spanish-springs", cuisine: "Ice cream · sweets", note: "Post-stroll dessert on the square." },
  { name: "Katie Belle's", square: "lake-sumter", cuisine: "Nightclub · late bites", note: "The Villages’ famous late-night dance floor at Lake Sumter Landing." },
  { name: "City Fire American Oven & Bar", square: "lake-sumter", cuisine: "American · pizza · bar", note: "Same menu family as Spanish Springs — handy if you’re already at the landing." },
  { name: "Rocco's Tacos", square: "lake-sumter", cuisine: "Mexican · tequila", note: "Lively patio; good for a festive dinner before the band." },
  { name: "Tommy Bahama Restaurant & Bar", square: "lake-sumter", cuisine: "Island American", note: "Island cocktails overlooking the square." },
  { name: "The Big House", square: "lake-sumter", cuisine: "American · sports bar", note: "Casual dinner and a game on the TVs." },
  { name: "World of Beer", square: "lake-sumter", cuisine: "Craft beer · pub food", note: "Big tap list if you want something beyond house wine." },
  { name: "Polo Grill & Bar", square: "brownwood", cuisine: "American · steaks", note: "Brownwood’s sit-down favorite after a square stroll." },
  { name: "City Fire American Oven & Bar", square: "brownwood", cuisine: "American · pizza · bar", note: "Third City Fire — handy if you live on the Brownwood side." },
  { name: "World of Beer", square: "brownwood", cuisine: "Craft beer · pub food", note: "Taps and shareable plates on the paddock square." },
  { name: "Beef 'O' Brady's", square: "brownwood", cuisine: "Sports pub", note: "Wings, specials, and a TV for the game." },
  { name: "Cody's Original Roadhouse", square: "nearby", cuisine: "Steaks · American", note: "On 441/27 — a regular night-out pick when you want a bigger dining room." },
  { name: "First Watch", square: "nearby", cuisine: "Breakfast · brunch", note: "Go early; Villages brunch lines move fast on weekends." },
  { name: "Publix", square: "nearby", cuisine: "Grocery", note: "Several Villages locations — use the Grocery tab for your list." },
  { name: "Total Wine", square: "nearby", cuisine: "Wine · spirits", note: "Lady Lake area — stock the cellar before a square night." },
];
const SUGGESTED_STORES = ["Publix", "Walmart", "Aldi", "Target", "Winn-Dixie", "Sam's Club"];
const CELLAR_KINDS = ["Wine", "Beer", "Cocktail", "Coffee", "Other"];
const RECIPE_LABELS: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  appetizer: "Appetizer",
  dessert: "Dessert",
  drink: "Drink",
  other: "Other",
};
const TABS: { id: FoodTab; label: string; icon: string }[] = [
  { id: "guide", label: "Dining guide", icon: "🍽" },
  { id: "favorites", label: "Favorites", icon: "⭐" },
  { id: "recipes", label: "Recipes", icon: "📖" },
  { id: "happy", label: "Happy hour", icon: "🍹" },
  { id: "grocery", label: "Grocery", icon: "🛒" },
  { id: "cellar", label: "Wine & drinks", icon: "🍷" },
  { id: "meals", label: "This week", icon: "📅" },
  { id: "tip", label: "Tip Calculator", icon: "🧮" },
];

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function todayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

function easternClock(): { day: string; hhmm: string } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return { day: get("weekday"), hhmm: `${hour}:${get("minute")}` };
}

function squareLabel(id: string) {
  return SQUARES.find((s) => s.id === id)?.label || id;
}

function mapUrl(name: string, square: string) {
  const sq = SQUARES.find((s) => s.id === square)?.label || "The Villages FL";
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${sq}`)}`;
}

function weekDates(today: string): string[] {
  const [y, m, d] = today.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dow = dt.getUTCDay();
  const mondayOffset = (dow + 6) % 7;
  dt.setUTCDate(dt.getUTCDate() - mondayOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(dt);
    x.setUTCDate(dt.getUTCDate() + i);
    return x.toISOString().slice(0, 10);
  });
}

function fmtWeekday(date: string) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function happyNow(h: FoodHappyHour, clock: { day: string; hhmm: string }) {
  if (!h.days.includes(clock.day)) return false;
  return clock.hhmm >= h.startTime && clock.hhmm <= h.endTime;
}

function printGrocery(items: FoodGrocery[], heading: string) {
  if (!items.length) {
    window.alert("Check the items you want on the printed list");
    return;
  }
  const groups = new Map<string, FoodGrocery[]>();
  for (const g of items) {
    const key = g.store || "Ungrouped";
    groups.set(key, [...(groups.get(key) || []), g]);
  }
  const body = [...groups.entries()]
    .map(
      ([store, rows]) =>
        `<section><h2>${esc(store)}</h2><ul>${rows
          .map(
            (g) =>
              `<li><span class="box"></span><span class="name">${esc(g.name)}</span>${
                g.aisle ? `<span class="aisle">${esc(g.aisle)}</span>` : ""
              }</li>`
          )
          .join("")}</ul></section>`
    )
    .join("");
  const html = `<!doctype html><html><head><title>${esc(heading)}</title>
<style>
body{font-family:Georgia,serif;margin:28px;color:#111}
h1{font-size:22px;margin:0 0 4px}
.meta{color:#444;margin:0 0 18px;font-size:14px}
h2{font-size:16px;text-transform:uppercase;border-bottom:2px solid #111;padding-bottom:4px}
ul{list-style:none;margin:0;padding:0}
li{display:flex;gap:10px;padding:7px 0;border-bottom:1px dotted #ccc;font-size:17px}
.box{width:16px;height:16px;border:2px solid #111;flex:0 0 16px}
.name{flex:1}.aisle{color:#555;font-size:13px}
</style></head><body>
<h1>${esc(heading)}</h1>
<p class="meta">${esc(new Date().toLocaleDateString("en-US"))} · ${items.length} item${items.length === 1 ? "" : "s"}</p>
${body}
<script>window.onload=function(){window.print()}<\/script>
</body></html>`;
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.write(html);
  w.document.close();
}

function esc(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Food & Beverages lanai — dining cheat sheet, favorites, recipes,
 * happy hour, grocery (with print), cellar, weekly meals, tip calculator.
 */
export function MySpaceFoodBoard() {
  const empty = emptyBoards().food;
  const { value, save, ready, saving, error } = useMemberBoard<FoodBoard>("food", empty, true);
  const [tab, setTab] = useState<FoodTab>("guide");
  const [guideSq, setGuideSq] = useState("all");
  const [favName, setFavName] = useState("");
  const [favSquare, setFavSquare] = useState("spanish-springs");
  const [favCuisine, setFavCuisine] = useState("");
  const [favNotes, setFavNotes] = useState("");
  const [rcpName, setRcpName] = useState("");
  const [rcpCat, setRcpCat] = useState("breakfast");
  const [rcpFrom, setRcpFrom] = useState("");
  const [rcpIng, setRcpIng] = useState("");
  const [rcpSteps, setRcpSteps] = useState("");
  const [rcpNotes, setRcpNotes] = useState("");
  const [rcpPhoto, setRcpPhoto] = useState("");
  const [hhPlace, setHhPlace] = useState("");
  const [hhSquare, setHhSquare] = useState("spanish-springs");
  const [hhDays, setHhDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [hhStart, setHhStart] = useState("15:00");
  const [hhEnd, setHhEnd] = useState("18:00");
  const [hhSpecials, setHhSpecials] = useState("");
  const [gName, setGName] = useState("");
  const [gStore, setGStore] = useState("Publix");
  const [gAisle, setGAisle] = useState("");
  const [gNewStore, setGNewStore] = useState("");
  const [printIds, setPrintIds] = useState<string[]>([]);
  const [cellarName, setCellarName] = useState("");
  const [cellarKind, setCellarKind] = useState("Wine");
  const [cellarNotes, setCellarNotes] = useState("");
  const [bill, setBill] = useState("250");
  const [tipPct, setTipPct] = useState(20);
  const [tipCustom, setTipCustom] = useState("18");
  const [useCustom, setUseCustom] = useState(false);
  const [split, setSplit] = useState(4);

  const today = todayKey();
  const clock = easternClock();
  const meals = value.meals || {};
  const groceryLeft = (value.grocery || []).filter((g) => !g.done).length;
  const stores = useMemo(() => {
    const saved = value.groceryStores || [];
    const fromItems = (value.grocery || []).map((g) => g.store).filter(Boolean);
    return [...new Set([...saved, ...fromItems])].sort((a, b) => a.localeCompare(b));
  }, [value.grocery, value.groceryStores]);

  function persist(next: FoodBoard) {
    void save(next);
  }

  function rememberStore(name: string, board: FoodBoard): FoodBoard {
    const n = name.trim();
    if (!n) return board;
    if (board.groceryStores.some((s) => s.toLowerCase() === n.toLowerCase())) return board;
    return { ...board, groceryStores: [...board.groceryStores, n].sort((a, b) => a.localeCompare(b)) };
  }

  if (!ready) return <p className="panel-hint">Loading kitchen…</p>;

  const pct = useCustom ? Number(tipCustom) || 0 : tipPct;
  const billN = Number(bill) || 0;
  const tipAmt = (billN * pct) / 100;
  const total = billN + tipAmt;
  const each = split > 0 ? total / split : total;
  const week = weekDates(today);
  const guideList = DINING.filter((d) => guideSq === "all" || d.square === guideSq);

  return (
    <div className="ms-food-board">
      <p className="ms-module-lead">
        Grocery, recipes, cellar, happy hour, and this week’s meals — your kitchen notebook. Public
        restaurant ratings stay on Dining.
      </p>
      <p className="panel-hint">
        Public Hub page stays free:{" "}
        <Link href="/dining" className="text-link">
          Dining guide
        </Link>
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
          {value.favorites.length} favorites · {value.recipes.length} recipes · {groceryLeft} grocery
        </span>
        <span className="panel-hint">Squares · Recipes · Grocery</span>
      </div>

      {tab === "guide" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            A Villages-focused dining cheat sheet — Spanish Springs, Lake Sumter Landing, Brownwood,
            and a few nearby workhorses. Save the ones you actually go to.
          </p>
          <div className="ms-h-quick">
            <button
              type="button"
              className={`ms-h-range-btn ${guideSq === "all" ? "active" : ""}`}
              onClick={() => setGuideSq("all")}
            >
              All squares
            </button>
            {SQUARES.filter((s) => s.id !== "other").map((s) => (
              <button
                key={s.id}
                type="button"
                className={`ms-h-range-btn ${guideSq === s.id ? "active" : ""}`}
                onClick={() => setGuideSq(s.id)}
              >
                {s.label}
              </button>
            ))}
          </div>
          <div className="ms-food-guide">
            {guideList.map((d, i) => (
              <article key={`${d.square}-${d.name}-${i}`} className="ms-food-card">
                <span className="panel-hint">{squareLabel(d.square).toUpperCase()}</span>
                <h4>{d.name}</h4>
                <p className="panel-hint">{d.cuisine}</p>
                <p>{d.note}</p>
                <div className="hero-actions">
                  <a className="btn btn-ghost btn-sm" href={mapUrl(d.name, d.square)} target="_blank" rel="noopener noreferrer">
                    Map
                  </a>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      persist({
                        ...value,
                        favorites: [
                          {
                            id: uid("fv"),
                            name: d.name,
                            square: d.square,
                            cuisine: d.cuisine,
                            notes: d.note,
                          },
                          ...value.favorites,
                        ].slice(0, 60),
                      })
                    }
                  >
                    Save favorite
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === "favorites" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            Your personal list — the square restaurants you actually like, plus the rec-center kitchen
            and that one place on 441.
          </p>
          <h4>Add a favorite</h4>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!favName.trim()) return;
              persist({
                ...value,
                favorites: [
                  {
                    id: uid("fv"),
                    name: favName.trim().slice(0, 120),
                    square: favSquare,
                    cuisine: favCuisine.trim().slice(0, 60),
                    notes: favNotes.trim().slice(0, 400),
                  },
                  ...value.favorites,
                ].slice(0, 60),
              });
              setFavName("");
              setFavCuisine("");
              setFavNotes("");
            }}
          >
            <div className="field">
              <label>Name of the restaurant or bar</label>
              <input value={favName} onChange={(e) => setFavName(e.target.value)} required />
            </div>
            <div className="field">
              <label>Where</label>
              <select value={favSquare} onChange={(e) => setFavSquare(e.target.value)}>
                {SQUARES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Kind of food</label>
              <input
                value={favCuisine}
                onChange={(e) => setFavCuisine(e.target.value)}
                placeholder="Italian, breakfast, bar…"
              />
            </div>
            <div className="field">
              <label>Notes</label>
              <input
                value={favNotes}
                onChange={(e) => setFavNotes(e.target.value)}
                placeholder="Best table, golf-cart parking, skip the grouper…"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save favorite
            </button>
          </form>
          {value.favorites.length === 0 ? (
            <p className="panel-hint">No favorites yet. Save spots from the Dining guide, or add your neighborhood place above.</p>
          ) : (
            <ul className="ms-cal-list">
              {value.favorites.map((f: FoodFavorite) => (
                <li key={f.id}>
                  <div>
                    <strong>{f.name}</strong>
                    <span>
                      {squareLabel(f.square)}
                      {f.cuisine ? ` · ${f.cuisine}` : ""}
                      {f.notes ? ` · ${f.notes}` : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      persist({ ...value, favorites: value.favorites.filter((x) => x.id !== f.id) })
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

      {tab === "recipes" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            Your own recipe box. Add the dish, snap a photo of the plate or the handwritten card, and
            write what you’d change next time — more salt, less oven time, hit at the square vs. at home.
          </p>
          <h4>Add a recipe</h4>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!rcpName.trim()) return;
              persist({
                ...value,
                recipes: [
                  {
                    id: uid("rc"),
                    name: rcpName.trim().slice(0, 120),
                    category: rcpCat,
                    source: rcpFrom.trim().slice(0, 120),
                    ingredients: rcpIng.trim().slice(0, 4000),
                    steps: rcpSteps.trim().slice(0, 4000),
                    notes: rcpNotes.trim().slice(0, 2000),
                    photoName: rcpPhoto,
                  },
                  ...value.recipes,
                ].slice(0, 60),
              });
              setRcpName("");
              setRcpFrom("");
              setRcpIng("");
              setRcpSteps("");
              setRcpNotes("");
              setRcpPhoto("");
            }}
          >
            <div className="field">
              <label>Add a recipe</label>
              <input
                value={rcpName}
                onChange={(e) => setRcpName(e.target.value)}
                placeholder="Lemon grouper, rec-center cookies…"
                required
              />
            </div>
            <div className="field">
              <label>Kind</label>
              <select value={rcpCat} onChange={(e) => setRcpCat(e.target.value)}>
                {RECIPE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {RECIPE_LABELS[c] || c}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>From (optional)</label>
              <input
                value={rcpFrom}
                onChange={(e) => setRcpFrom(e.target.value)}
                placeholder="Neighbor, cookbook, square…"
              />
            </div>
            <div className="field">
              <label>Ingredients</label>
              <textarea
                rows={3}
                value={rcpIng}
                onChange={(e) => setRcpIng(e.target.value)}
                placeholder="One per line is fine"
              />
            </div>
            <div className="field">
              <label>How to make it</label>
              <textarea
                rows={3}
                value={rcpSteps}
                onChange={(e) => setRcpSteps(e.target.value)}
                placeholder={'Oven 375°, 20 minutes…'}
              />
            </div>
            <div className="field">
              <label>Review notes</label>
              <textarea
                rows={2}
                value={rcpNotes}
                onChange={(e) => setRcpNotes(e.target.value)}
                placeholder="Too salty. Next time use less lemon. Neighbors loved it."
              />
            </div>
            <div className="field">
              <label>Photo (optional — stays on your phone)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setRcpPhoto(e.target.files?.[0]?.name || "")}
              />
              {rcpPhoto ? <span className="panel-hint">Filename: {rcpPhoto}</span> : null}
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save recipe
            </button>
          </form>
          {value.recipes.length === 0 ? (
            <p className="panel-hint">No recipes yet. Save the grouper, the rec-center casserole, or that neighbor’s cookie recipe.</p>
          ) : (
            <ul className="ms-cal-list">
              {value.recipes.map((r: FoodRecipe) => (
                <li key={r.id}>
                  <div>
                    <strong>{r.name}</strong>
                    <span>
                      {RECIPE_LABELS[r.category] || r.category}
                      {r.source ? ` · ${r.source}` : ""}
                      {r.photoName ? ` · ${r.photoName}` : ""}
                    </span>
                    {r.notes ? <span>{r.notes}</span> : null}
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      persist({ ...value, recipes: value.recipes.filter((x) => x.id !== r.id) })
                    }
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "happy" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            The Villages runs on 3–6pm. Track rec-center specials and square bars so you don’t cart
            over on a dark kitchen night.
          </p>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!hhPlace.trim()) return;
              persist({
                ...value,
                happyHours: [
                  {
                    id: uid("hh"),
                    place: hhPlace.trim().slice(0, 120),
                    square: hhSquare,
                    days: hhDays,
                    startTime: hhStart,
                    endTime: hhEnd,
                    specials: hhSpecials.trim().slice(0, 240),
                  },
                  ...value.happyHours,
                ].slice(0, 60),
              });
              setHhPlace("");
              setHhSpecials("");
            }}
          >
            <div className="field">
              <label>Place</label>
              <input
                value={hhPlace}
                onChange={(e) => setHhPlace(e.target.value)}
                placeholder="Eisenhower rec center, City Fire…"
                required
              />
            </div>
            <div className="field">
              <label>Area</label>
              <select value={hhSquare} onChange={(e) => setHhSquare(e.target.value)}>
                {SQUARES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Days</label>
              <div className="ms-food-days">
                {DAYS.map((d) => (
                  <label key={d} className={hhDays.includes(d) ? "on" : ""}>
                    <input
                      type="checkbox"
                      checked={hhDays.includes(d)}
                      onChange={(e) =>
                        setHhDays(
                          e.target.checked ? [...hhDays, d] : hhDays.filter((x) => x !== d)
                        )
                      }
                    />
                    {d}
                  </label>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Starts</label>
              <input type="time" value={hhStart} onChange={(e) => setHhStart(e.target.value)} />
            </div>
            <div className="field">
              <label>Ends</label>
              <input type="time" value={hhEnd} onChange={(e) => setHhEnd(e.target.value)} />
            </div>
            <div className="field">
              <label>Specials</label>
              <input
                value={hhSpecials}
                onChange={(e) => setHhSpecials(e.target.value)}
                placeholder="$3 drafts, half-price apps…"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save happy hour
            </button>
          </form>
          {value.happyHours.length === 0 ? (
            <p className="panel-hint">No happy hours saved. Rec centers often run 3–6pm; square bars vary.</p>
          ) : (
            <ul className="ms-cal-list">
              {value.happyHours.map((h: FoodHappyHour) => (
                <li key={h.id}>
                  <div>
                    <strong>
                      {h.place}
                      {happyNow(h, clock) ? " · happening now" : ""}
                    </strong>
                    <span>
                      {squareLabel(h.square)} · {h.days.join(", ") || "days?"} · {h.startTime}–{h.endTime}
                      {h.specials ? ` · ${h.specials}` : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      persist({
                        ...value,
                        happyHours: value.happyHours.filter((x) => x.id !== h.id),
                      })
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

      {tab === "grocery" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            {groceryLeft} item{groceryLeft === 1 ? "" : "s"} left. Tag each item with the store you
            buy it at — Publix, Walmart, or anywhere else you shop. Check Print for the items you want
            on paper, then print one store or the whole list.
          </p>
          <p className="panel-hint">
            {printIds.length} of {value.grocery.length} included for print
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                setPrintIds(value.grocery.filter((g) => !g.done).map((g) => g.id))
              }
            >
              Include remaining
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPrintIds([])}>
              Include none
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() =>
                printGrocery(
                  value.grocery.filter((g) => printIds.includes(g.id)),
                  "Grocery list"
                )
              }
            >
              Print list
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                persist({ ...value, grocery: value.grocery.filter((g) => !g.done) })
              }
            >
              Clear checked
            </button>
          </div>
          {[...new Set(value.grocery.map((g) => g.store || "Ungrouped"))].map((store) => {
            const items = value.grocery.filter((g) => (g.store || "Ungrouped") === store);
            const left = items.filter((g) => !g.done).length;
            return (
              <div key={store} className="ms-food-store">
                <div className="ms-panel-head">
                  <h4 style={{ margin: 0 }}>
                    {store} <span className="panel-hint">{left} left</span>
                  </h4>
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        setPrintIds([
                          ...new Set([...printIds, ...items.map((g) => g.id)]),
                        ])
                      }
                    >
                      Include store
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => printGrocery(items.filter((g) => printIds.includes(g.id)), store)}
                    >
                      Print store
                    </button>
                  </div>
                </div>
                <ul className="ms-cal-list">
                  {items.map((g: FoodGrocery) => (
                    <li key={g.id}>
                      <div>
                        <label className="ms-check">
                          <input
                            type="checkbox"
                            checked={printIds.includes(g.id)}
                            onChange={(e) =>
                              setPrintIds(
                                e.target.checked
                                  ? [...printIds, g.id]
                                  : printIds.filter((id) => id !== g.id)
                              )
                            }
                          />
                          Print
                        </label>
                        <label className="ms-check">
                          <input
                            type="checkbox"
                            checked={g.done}
                            onChange={() =>
                              persist({
                                ...value,
                                grocery: value.grocery.map((x) =>
                                  x.id === g.id ? { ...x, done: !x.done } : x
                                ),
                              })
                            }
                          />
                          <strong className={g.done ? "ms-note-done" : undefined}>{g.name}</strong>
                        </label>
                        {g.aisle ? <span className="panel-hint">{g.aisle}</span> : null}
                      </div>
                      <select
                        value={g.store}
                        onChange={(e) => {
                          const storeName = e.target.value;
                          persist(
                            rememberStore(storeName, {
                              ...value,
                              grocery: value.grocery.map((x) =>
                                x.id === g.id ? { ...x, store: storeName } : x
                              ),
                            })
                          );
                        }}
                      >
                        <option value="">Store…</option>
                        {stores.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() =>
                          persist({ ...value, grocery: value.grocery.filter((x) => x.id !== g.id) })
                        }
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!gName.trim()) return;
              const storeName = gStore === "__new__" ? gNewStore.trim() : gStore;
              persist(
                rememberStore(storeName, {
                  ...value,
                  grocery: [
                    {
                      id: uid("gr"),
                      name: gName.trim().slice(0, 120),
                      store: storeName,
                      aisle: gAisle.trim().slice(0, 40),
                      done: false,
                    },
                    ...value.grocery,
                  ].slice(0, 60),
                })
              );
              setGName("");
              setGAisle("");
              if (gStore === "__new__") {
                setGStore(storeName || "Publix");
                setGNewStore("");
              }
            }}
          >
            <div className="field">
              <label>Add item</label>
              <input
                value={gName}
                onChange={(e) => setGName(e.target.value)}
                placeholder="Boar’s Head turkey, bananas…"
                required
              />
            </div>
            <div className="field">
              <label>Store</label>
              <select value={gStore} onChange={(e) => setGStore(e.target.value)}>
                <option value="__new__">Add a new store…</option>
                {stores.length ? (
                  <optgroup label="Your stores">
                    {stores.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </optgroup>
                ) : null}
                <optgroup label="Suggestions">
                  {SUGGESTED_STORES.filter((s) => !stores.includes(s)).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </optgroup>
              </select>
              {gStore === "__new__" ? (
                <input
                  value={gNewStore}
                  onChange={(e) => setGNewStore(e.target.value)}
                  placeholder="Store name"
                  style={{ marginTop: "0.4rem" }}
                />
              ) : null}
            </div>
            <div className="field">
              <label>Aisle / note</label>
              <input
                value={gAisle}
                onChange={(e) => setGAisle(e.target.value)}
                placeholder="Deli, produce…"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Add
            </button>
          </form>
        </div>
      )}

      {tab === "cellar" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            Wine, beer, coffee, and “what did we drink at City Fire?” notes — so the next Publix or
            Total Wine trip isn’t a guess.
          </p>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!cellarName.trim()) return;
              persist({
                ...value,
                cellar: [
                  {
                    id: uid("ce"),
                    name: cellarName.trim().slice(0, 120),
                    kind: cellarKind.toLowerCase(),
                    notes: cellarNotes.trim().slice(0, 400),
                  },
                  ...value.cellar,
                ].slice(0, 60),
              });
              setCellarName("");
              setCellarNotes("");
            }}
          >
            <div className="field">
              <label>Bottle / drink</label>
              <input
                value={cellarName}
                onChange={(e) => setCellarName(e.target.value)}
                placeholder="Kim Crawford Sauvignon Blanc"
                required
              />
            </div>
            <div className="field">
              <label>Type</label>
              <select value={cellarKind} onChange={(e) => setCellarKind(e.target.value)}>
                {CELLAR_KINDS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Notes</label>
              <input
                value={cellarNotes}
                onChange={(e) => setCellarNotes(e.target.value)}
                placeholder="Buy at Total Wine · $14 · good with grouper"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save
            </button>
          </form>
          {value.cellar.length === 0 ? (
            <p className="panel-hint">Nothing in the cellar yet. Track a house wine, a Total Wine find, or the coffee you actually like at the square.</p>
          ) : (
            <ul className="ms-cal-list">
              {value.cellar.map((c: FoodCellar) => (
                <li key={c.id}>
                  <div>
                    <strong>{c.name}</strong>
                    <span>
                      {c.kind}
                      {c.notes ? ` · ${c.notes}` : ""}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      persist({ ...value, cellar: value.cellar.filter((x) => x.id !== c.id) })
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

      {tab === "meals" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            This week at a glance — who’s cooking, who’s hitting a square, and which night is leftover
            night. Tap a box and it saves.
          </p>
          <div className="ms-food-week">
            <div className="ms-food-week-head">
              <span />
              <span>Breakfast</span>
              <span>Lunch</span>
              <span>Dinner</span>
            </div>
            {week.map((date) => {
              const plan = meals[date] || { breakfast: "", lunch: "", dinner: "" };
              return (
                <div key={date} className="ms-food-week-row">
                  <strong>{fmtWeekday(date)}</strong>
                  {(["breakfast", "lunch", "dinner"] as const).map((slot) => (
                    <input
                      key={slot}
                      value={plan[slot]}
                      placeholder={`${slot}…`}
                      onChange={(e) =>
                        persist({
                          ...value,
                          meals: {
                            ...meals,
                            [date]: { ...plan, [slot]: e.target.value.slice(0, 80) },
                          },
                        })
                      }
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "tip" && (
        <div className="about-panel ms-module">
          <p className="panel-hint">
            After dinner at the square — type the check, tap a tip, and split it if you want. Nothing
            is sent anywhere; it stays on this account.
          </p>
          <div className="form-grid ms-module-form">
            <div className="field">
              <label>Cost of the meal</label>
              <input value={bill} onChange={(e) => setBill(e.target.value)} />
            </div>
            <div className="field">
              <label>Tip percent</label>
              <div className="ms-h-quick">
                {[5, 10, 15, 20, 25].map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`ms-h-range-btn ${!useCustom && tipPct === n ? "active" : ""}`}
                    onClick={() => {
                      setUseCustom(false);
                      setTipPct(n);
                      persist({ ...value, tipPct: n });
                    }}
                  >
                    {n}%
                  </button>
                ))}
                <button
                  type="button"
                  className={`ms-h-range-btn ${useCustom ? "active" : ""}`}
                  onClick={() => setUseCustom(true)}
                >
                  Custom
                </button>
              </div>
            </div>
            {useCustom ? (
              <div className="field">
                <label>Custom percent</label>
                <input value={tipCustom} onChange={(e) => setTipCustom(e.target.value)} />
              </div>
            ) : null}
            <div className="field">
              <label>Split between</label>
              <select value={split} onChange={(e) => setSplit(Number(e.target.value))}>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="ms-stat-row">
            <div className="ms-stat">
              <span>Tip ({pct}%)</span>
              <strong>${tipAmt.toFixed(2)}</strong>
            </div>
            <div className="ms-stat">
              <span>Total with tip</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
            <div className="ms-stat">
              <span>Each person ({split})</span>
              <strong>${each.toFixed(2)}</strong>
              <em>${(tipAmt / Math.max(1, split)).toFixed(2)} tip each</em>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
