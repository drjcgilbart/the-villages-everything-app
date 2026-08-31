"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MAINT_KINDS,
  RECIPE_CATEGORIES,
  emptyBoards,
  type EntertainmentBoard,
  type FoodBoard,
  type GolfLogBoard,
  type MaintenanceBoard,
  type NoteItem,
  type PickleballLogBoard,
} from "@/lib/memberBoardModel";
import { useMemberBoard } from "@/components/useMemberBoard";

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function today() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

function SubNav({
  tabs,
  tab,
  onTab,
}: {
  tabs: { id: string; label: string }[];
  tab: string;
  onTab: (id: string) => void;
}) {
  return (
    <div className="ms-subnav">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          className={`ms-subnav-btn ${tab === t.id ? "is-on" : ""}`}
          onClick={() => onTab(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function Status({ error, saving }: { error: string | null; saving: boolean }) {
  if (error) return <p className="pf-form-error">{error}</p>;
  if (saving) return <p className="panel-hint">Saving to your account…</p>;
  return null;
}

function PublicHop({ href, label }: { href: string; label: string }) {
  return (
    <p className="panel-hint">
      Public Hub page stays free:{" "}
      <Link href={href} className="text-link">
        {label}
      </Link>
    </p>
  );
}

function NoteRows({
  items,
  onRemove,
  onToggle,
}: {
  items: NoteItem[];
  onRemove: (id: string) => void;
  onToggle?: (id: string) => void;
}) {
  if (!items.length) return <p className="panel-hint">Nothing here yet.</p>;
  return (
    <ul className="ms-cal-list">
      {items.map((item) => (
        <li key={item.id}>
          <div>
            <strong className={item.done ? "ms-note-done" : undefined}>
              {onToggle ? (
                <label className="ms-check">
                  <input
                    type="checkbox"
                    checked={!!item.done}
                    onChange={() => onToggle(item.id)}
                  />
                  {item.text}
                </label>
              ) : (
                item.text
              )}
            </strong>
            {item.extra ? <span>{item.extra}</span> : null}
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onRemove(item.id)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}

function AddNote({
  onAdd,
  textPh,
  extraPh,
}: {
  onAdd: (text: string, extra: string) => void;
  textPh: string;
  extraPh?: string;
}) {
  const [text, setText] = useState("");
  const [extra, setExtra] = useState("");
  return (
    <form
      className="form-grid ms-module-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onAdd(text.trim(), extra.trim());
        setText("");
        setExtra("");
      }}
    >
      <div className="field">
        <label>Add</label>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={textPh} required />
      </div>
      {extraPh ? (
        <div className="field">
          <label>Note</label>
          <input value={extra} onChange={(e) => setExtra(e.target.value)} placeholder={extraPh} />
        </div>
      ) : null}
      <button type="submit" className="btn btn-primary btn-sm">
        Save
      </button>
    </form>
  );
}

export function MySpaceFoodBoard() {
  const empty = emptyBoards().food;
  const { value, save, ready, saving, error } = useMemberBoard<FoodBoard>("food", empty, true);
  const [tab, setTab] = useState("grocery");
  const [bill, setBill] = useState("48.50");
  const [recipeName, setRecipeName] = useState("");
  const [recipeCat, setRecipeCat] = useState("dinner");
  const [recipeNotes, setRecipeNotes] = useState("");
  if (!ready) return <p className="panel-hint">Loading kitchen…</p>;
  const meals = value.meals || {};
  const day = today();
  const plan = meals[day] || { breakfast: "", lunch: "", dinner: "" };
  const billN = Number(bill);
  const tip = Number.isFinite(billN) ? (billN * (value.tipPct || 18)) / 100 : 0;

  function patchMeals(part: Partial<typeof plan>) {
    void save({
      ...value,
      meals: { ...meals, [day]: { ...plan, ...part } },
    });
  }

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Grocery, recipes, cellar, happy hour, and this week’s meals — your kitchen notebook. Public
        restaurant ratings stay on Dining.
      </p>
      <PublicHop href="/dining" label="Dining guide" />
      <Status error={error} saving={saving} />
      <SubNav
        tabs={[
          { id: "guide", label: "Dining guide" },
          { id: "favorites", label: "Favorites" },
          { id: "recipes", label: "Recipes" },
          { id: "happy", label: "Happy hour" },
          { id: "grocery", label: "Grocery" },
          { id: "cellar", label: "Wine & drinks" },
          { id: "meals", label: "This week" },
          { id: "tip", label: "Tip calculator" },
        ]}
        tab={tab}
        onTab={setTab}
      />
      {tab === "guide" ? (
        <p className="panel-hint" style={{ marginBottom: 0 }}>
          Rate restaurants and crown cuisine leaders on the public{" "}
          <Link href="/dining" className="text-link">
            Dining
          </Link>{" "}
          page. Star spots there and they land in My Space favorites too.
        </p>
      ) : null}
      {tab === "favorites" ? (
        <>
          <AddNote
            textPh="Spot you love"
            extraPh="Why / usual order"
            onAdd={(text, extra) =>
              void save({
                ...value,
                favorites: [{ id: uid("fv"), text, extra }, ...value.favorites].slice(0, 60),
              })
            }
          />
          <NoteRows
            items={value.favorites}
            onRemove={(id) =>
              void save({ ...value, favorites: value.favorites.filter((i) => i.id !== id) })
            }
          />
        </>
      ) : null}
      {tab === "happy" ? (
        <>
          <AddNote
            textPh="Happy hour"
            extraPh="Days / hours / deal"
            onAdd={(text, extra) =>
              void save({
                ...value,
                happyHours: [{ id: uid("hh"), text, extra }, ...value.happyHours].slice(0, 60),
              })
            }
          />
          <NoteRows
            items={value.happyHours}
            onRemove={(id) =>
              void save({ ...value, happyHours: value.happyHours.filter((i) => i.id !== id) })
            }
          />
        </>
      ) : null}
      {tab === "grocery" ? (
        <>
          <AddNote
            textPh="Item"
            extraPh="Store / aisle"
            onAdd={(text, extra) =>
              void save({
                ...value,
                grocery: [{ id: uid("gr"), text, extra, done: false }, ...value.grocery].slice(
                  0,
                  60
                ),
              })
            }
          />
          <NoteRows
            items={value.grocery}
            onToggle={(id) =>
              void save({
                ...value,
                grocery: value.grocery.map((g) => (g.id === id ? { ...g, done: !g.done } : g)),
              })
            }
            onRemove={(id) =>
              void save({ ...value, grocery: value.grocery.filter((i) => i.id !== id) })
            }
          />
        </>
      ) : null}
      {tab === "cellar" ? (
        <>
          <AddNote
            textPh="Bottle or drink"
            extraPh="Vintage / notes"
            onAdd={(text, extra) =>
              void save({
                ...value,
                cellar: [{ id: uid("ce"), text, extra }, ...value.cellar].slice(0, 60),
              })
            }
          />
          <NoteRows
            items={value.cellar}
            onRemove={(id) =>
              void save({ ...value, cellar: value.cellar.filter((i) => i.id !== id) })
            }
          />
        </>
      ) : null}
      {tab === "recipes" ? (
        <>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!recipeName.trim()) return;
              void save({
                ...value,
                recipes: [
                  {
                    id: uid("rc"),
                    name: recipeName.trim().slice(0, 80),
                    category: recipeCat,
                    notes: recipeNotes.trim().slice(0, 400),
                  },
                  ...value.recipes,
                ].slice(0, 60),
              });
              setRecipeName("");
              setRecipeNotes("");
            }}
          >
            <div className="field">
              <label>Recipe</label>
              <input value={recipeName} onChange={(e) => setRecipeName(e.target.value)} required />
            </div>
            <div className="field">
              <label>Category</label>
              <select value={recipeCat} onChange={(e) => setRecipeCat(e.target.value)}>
                {RECIPE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>How you make it</label>
              <textarea
                rows={3}
                value={recipeNotes}
                onChange={(e) => setRecipeNotes(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save recipe
            </button>
          </form>
          <ul className="ms-cal-list">
            {value.recipes.map((r) => (
              <li key={r.id}>
                <div>
                  <strong>{r.name}</strong>
                  <span>
                    {r.category}
                    {r.notes ? ` · ${r.notes}` : ""}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    void save({ ...value, recipes: value.recipes.filter((x) => x.id !== r.id) })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {tab === "meals" ? (
        <div className="form-grid ms-module-form">
          <p className="panel-hint">Plan for {day} (Eastern).</p>
          {(["breakfast", "lunch", "dinner"] as const).map((slot) => (
            <div className="field" key={slot}>
              <label>{slot}</label>
              <input
                value={plan[slot]}
                onChange={(e) => patchMeals({ [slot]: e.target.value.slice(0, 80) })}
                placeholder={`What’s for ${slot}?`}
              />
            </div>
          ))}
        </div>
      ) : null}
      {tab === "tip" ? (
        <div className="form-grid ms-module-form">
          <div className="field">
            <label>Bill</label>
            <input value={bill} onChange={(e) => setBill(e.target.value)} />
          </div>
          <div className="field">
            <label>Tip %</label>
            <input
              type="number"
              min={0}
              max={40}
              value={value.tipPct}
              onChange={(e) =>
                void save({ ...value, tipPct: Math.min(40, Math.max(0, Number(e.target.value) || 0)) })
              }
            />
          </div>
          <p className="ms-stat">
            Tip <strong>${tip.toFixed(2)}</strong> · Total{" "}
            <strong>${(Number.isFinite(billN) ? billN + tip : 0).toFixed(2)}</strong>
          </p>
        </div>
      ) : null}
    </div>
  );
}

export { MySpaceGymBoard } from "@/components/MySpaceGymBoard";

export function MySpaceEntertainmentBoard() {
  const empty = emptyBoards().entertainment;
  const { value, save, ready, saving, error } = useMemberBoard<EntertainmentBoard>(
    "entertainment",
    empty,
    true
  );
  const [tab, setTab] = useState("squares");
  const [showTitle, setShowTitle] = useState("");
  const [showWhen, setShowWhen] = useState("");
  const [showVenue, setShowVenue] = useState("");
  const [clubName, setClubName] = useState("");
  const [clubWhen, setClubWhen] = useState("");
  if (!ready) return <p className="panel-hint">Loading entertainment…</p>;

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Tonight at the square, tickets, rec clubs, and watch-later — your nights. Public square
        lineups stay free on Town Squares.
      </p>
      <PublicHop href="/town-squares" label="Town Squares" />
      <Status error={error} saving={saving} />
      <SubNav
        tabs={[
          { id: "squares", label: "Town squares" },
          { id: "shows", label: "Shows & tickets" },
          { id: "clubs", label: "Rec clubs" },
          { id: "watch", label: "Watch later" },
          { id: "golf", label: "Golf" },
          { id: "pickleball", label: "Pickleball" },
        ]}
        tab={tab}
        onTab={setTab}
      />
      {tab === "squares" ? (
        <div className="form-grid ms-module-form">
          <div className="field">
            <label>Tonight’s square</label>
            <input
              value={value.tonightSquare}
              onChange={(e) => void save({ ...value, tonightSquare: e.target.value.slice(0, 60) })}
              placeholder="Spanish Springs / Brownwood / Lake Sumter…"
            />
          </div>
          <div className="field">
            <label>Notes</label>
            <input
              value={value.tonightNotes}
              onChange={(e) => void save({ ...value, tonightNotes: e.target.value.slice(0, 200) })}
              placeholder="Band starts at 7 · chairs"
            />
          </div>
        </div>
      ) : null}
      {tab === "shows" ? (
        <>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!showTitle.trim()) return;
              void save({
                ...value,
                shows: [
                  {
                    id: uid("sh"),
                    title: showTitle.trim(),
                    when: showWhen,
                    venue: showVenue,
                    notes: "",
                  },
                  ...value.shows,
                ].slice(0, 60),
              });
              setShowTitle("");
              setShowWhen("");
              setShowVenue("");
            }}
          >
            <div className="field">
              <label>Show</label>
              <input value={showTitle} onChange={(e) => setShowTitle(e.target.value)} required />
            </div>
            <div className="field">
              <label>When</label>
              <input value={showWhen} onChange={(e) => setShowWhen(e.target.value)} />
            </div>
            <div className="field">
              <label>Venue</label>
              <input value={showVenue} onChange={(e) => setShowVenue(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save ticket
            </button>
          </form>
          <ul className="ms-cal-list">
            {value.shows.map((s) => (
              <li key={s.id}>
                <div>
                  <strong>{s.title}</strong>
                  <span>
                    {[s.when, s.venue].filter(Boolean).join(" · ")}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    void save({ ...value, shows: value.shows.filter((x) => x.id !== s.id) })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {tab === "clubs" ? (
        <>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!clubName.trim()) return;
              void save({
                ...value,
                clubs: [
                  { id: uid("cl"), name: clubName.trim(), when: clubWhen, rec: "" },
                  ...value.clubs,
                ].slice(0, 60),
              });
              setClubName("");
              setClubWhen("");
            }}
          >
            <div className="field">
              <label>Club</label>
              <input value={clubName} onChange={(e) => setClubName(e.target.value)} required />
            </div>
            <div className="field">
              <label>When / rec center</label>
              <input value={clubWhen} onChange={(e) => setClubWhen(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Save
            </button>
          </form>
          <PublicHop href="/club-zone" label="Clubs directory" />
          <ul className="ms-cal-list">
            {value.clubs.map((c) => (
              <li key={c.id}>
                <div>
                  <strong>{c.name}</strong>
                  <span>{c.when}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    void save({ ...value, clubs: value.clubs.filter((x) => x.id !== c.id) })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {tab === "watch" ? (
        <>
          <AddNote
            textPh="Show or movie"
            extraPh="Where to watch"
            onAdd={(text, extra) =>
              void save({
                ...value,
                watchLater: [{ id: uid("wl"), text, extra, done: false }, ...value.watchLater].slice(
                  0,
                  60
                ),
              })
            }
          />
          <NoteRows
            items={value.watchLater}
            onToggle={(id) =>
              void save({
                ...value,
                watchLater: value.watchLater.map((w) =>
                  w.id === id ? { ...w, done: !w.done } : w
                ),
              })
            }
            onRemove={(id) =>
              void save({
                ...value,
                watchLater: value.watchLater.filter((w) => w.id !== id),
              })
            }
          />
        </>
      ) : null}
      {tab === "golf" ? (
        <p className="panel-hint" style={{ marginBottom: 0 }}>
          Personal scorecards, tee times, and looking-for-a-group live on the{" "}
          <strong>Golf log</strong> board in this same My Space menu. Public courses stay on{" "}
          <Link href="/golf-zone" className="text-link">
            Golf
          </Link>
          .
        </p>
      ) : null}
      {tab === "pickleball" ? (
        <p className="panel-hint" style={{ marginBottom: 0 }}>
          DUPR, matches, and find-a-game live on the <strong>Pickleball log</strong> board. Public
          courts stay on{" "}
          <Link href="/pickleball" className="text-link">
            Pickleball
          </Link>
          .
        </p>
      ) : null}
    </div>
  );
}

export function MySpaceMaintenanceBoard() {
  const empty = emptyBoards().maintenance;
  const { value, save, ready, saving, error } = useMemberBoard<MaintenanceBoard>(
    "maintenance",
    empty,
    true
  );
  const [tab, setTab] = useState("jobs");
  const [assetName, setAssetName] = useState("");
  const [assetKind, setAssetKind] = useState("golf-cart");
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [assetId, setAssetId] = useState("");
  const [repeatEvery, setRepeatEvery] = useState("6");
  const [repeatUnit, setRepeatUnit] = useState("months");
  if (!ready) return <p className="panel-hint">Loading maintenance…</p>;

  const open = value.tasks.filter((t) => !t.done);
  const done = value.tasks.filter((t) => t.done);

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Golf cart, car, house, HVAC — jobs by date, repeating reminders, and a list of your stuff.
      </p>
      <Status error={error} saving={saving} />
      <SubNav
        tabs={[
          { id: "jobs", label: "Upcoming" },
          { id: "assets", label: "Items" },
          { id: "done", label: "History" },
        ]}
        tab={tab}
        onTab={setTab}
      />
      {tab === "assets" ? (
        <>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!assetName.trim()) return;
              void save({
                ...value,
                assets: [
                  {
                    id: uid("asset"),
                    name: assetName.trim(),
                    kind: assetKind,
                    make: "",
                    model: "",
                    meter: null,
                    notes: "",
                  },
                  ...value.assets,
                ].slice(0, 40),
              });
              setAssetName("");
            }}
          >
            <div className="field">
              <label>Item</label>
              <input value={assetName} onChange={(e) => setAssetName(e.target.value)} required />
            </div>
            <div className="field">
              <label>Kind</label>
              <select value={assetKind} onChange={(e) => setAssetKind(e.target.value)}>
                {MAINT_KINDS.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.emoji} {k.label}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Add item
            </button>
          </form>
          <ul className="ms-cal-list">
            {value.assets.map((a) => (
              <li key={a.id}>
                <div>
                  <strong>{a.name}</strong>
                  <span>{MAINT_KINDS.find((k) => k.id === a.kind)?.label || a.kind}</span>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    void save({
                      ...value,
                      assets: value.assets.filter((x) => x.id !== a.id),
                      tasks: value.tasks.filter((t) => t.assetId !== a.id),
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
      {tab === "jobs" ? (
        <>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim()) return;
              void save({
                ...value,
                tasks: [
                  {
                    id: uid("job"),
                    assetId,
                    title: title.trim(),
                    notes: "",
                    dueDate: due,
                    dueMeter: null,
                    repeatEvery: Math.max(1, Number(repeatEvery) || 1),
                    repeatUnit,
                    done: false,
                    alarmEnabled: true,
                  },
                  ...value.tasks,
                ].slice(0, 80),
              });
              setTitle("");
              setDue("");
            }}
          >
            <div className="field">
              <label>Job</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Battery water / oil change / filter"
                required
              />
            </div>
            <div className="field">
              <label>Item</label>
              <select value={assetId} onChange={(e) => setAssetId(e.target.value)}>
                <option value="">(none)</option>
                {value.assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Due date</label>
              <input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>
            <div className="field">
              <label>Repeat every</label>
              <input value={repeatEvery} onChange={(e) => setRepeatEvery(e.target.value)} />
            </div>
            <div className="field">
              <label>Unit</label>
              <select value={repeatUnit} onChange={(e) => setRepeatUnit(e.target.value)}>
                {["days", "weeks", "months", "years", "miles"].map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Add job
            </button>
          </form>
          <ul className="ms-cal-list">
            {open.map((t) => (
              <li key={t.id}>
                <div>
                  <strong>{t.title}</strong>
                  <span>
                    {t.dueDate ? `Due ${t.dueDate}` : "No date"} · repeats every {t.repeatEvery}{" "}
                    {t.repeatUnit}
                    {t.assetId
                      ? ` · ${value.assets.find((a) => a.id === t.assetId)?.name || ""}`
                      : ""}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() =>
                    void save({
                      ...value,
                      tasks: value.tasks.map((x) => (x.id === t.id ? { ...x, done: true } : x)),
                    })
                  }
                >
                  Done
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {tab === "done" ? (
        <ul className="ms-cal-list">
          {done.map((t) => (
            <li key={t.id}>
              <div>
                <strong className="ms-note-done">{t.title}</strong>
                <span>{t.dueDate}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

const DEFAULT_PAR_9 = [4, 3, 4, 5, 4, 3, 4, 4, 5];
const DEFAULT_PAR_18 = [...DEFAULT_PAR_9, 4, 4, 3, 5, 4, 4, 3, 4, 5];

export function MySpaceGolfLogBoard() {
  const empty = emptyBoards().golfLog;
  const { value, save, ready, saving, error } = useMemberBoard<GolfLogBoard>(
    "golfLog",
    empty,
    true
  );
  const [tab, setTab] = useState("scorecard");
  const [course, setCourse] = useState("");
  const [holes, setHoles] = useState<9 | 18>(9);
  const [scores, setScores] = useState<(number | "")[]>(Array(9).fill(""));
  const [ttDate, setTtDate] = useState("");
  const [ttTime, setTtTime] = useState("");
  const [ttCourse, setTtCourse] = useState("");
  if (!ready) return <p className="panel-hint">Loading golf log…</p>;

  const par = holes === 18 ? DEFAULT_PAR_18 : DEFAULT_PAR_9;
  const total = scores.reduce<number>((s, n) => s + (typeof n === "number" ? n : 0), 0);
  const parTotal = par.reduce((s, n) => s + n, 0);

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Scorecards, tee times, and looking-for-a-foursome. Public Golf on the Hub stays free.
      </p>
      <PublicHop href="/golf-zone" label="Golf" />
      <Status error={error} saving={saving} />
      <SubNav
        tabs={[
          { id: "scorecard", label: "Scorecard" },
          { id: "tees", label: "Tee times" },
          { id: "pair", label: "Find a group" },
          { id: "history", label: "History" },
        ]}
        tab={tab}
        onTab={setTab}
      />
      {tab === "scorecard" ? (
        <>
          <div className="form-grid ms-module-form">
            <div className="field">
              <label>Course</label>
              <input value={course} onChange={(e) => setCourse(e.target.value)} required />
            </div>
            <div className="field">
              <label>Holes</label>
              <select
                value={holes}
                onChange={(e) => {
                  const h = Number(e.target.value) === 18 ? 18 : 9;
                  setHoles(h);
                  setScores(Array(h).fill(""));
                }}
              >
                <option value={9}>9</option>
                <option value={18}>18</option>
              </select>
            </div>
          </div>
          <div className="ms-score-grid">
            {scores.map((s, i) => (
              <label key={i} className="ms-score-hole">
                <span>
                  {i + 1}
                  <em> par {par[i]}</em>
                </span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={s}
                  onChange={(e) => {
                    const next = [...scores];
                    const n = Number(e.target.value);
                    next[i] = e.target.value === "" ? "" : n;
                    setScores(next);
                  }}
                />
              </label>
            ))}
          </div>
          <p className="panel-hint">
            Total {total || "—"} · Par {parTotal}
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (!course.trim()) return;
              void save({
                ...value,
                rounds: [
                  {
                    id: uid("rd"),
                    date: today(),
                    course: course.trim(),
                    holes,
                    scores,
                    par,
                    notes: "",
                  },
                  ...value.rounds,
                ].slice(0, 80),
              });
              setCourse("");
              setScores(Array(holes).fill(""));
            }}
          >
            Save round
          </button>
        </>
      ) : null}
      {tab === "tees" ? (
        <>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              void save({
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
              <input value={ttCourse} onChange={(e) => setTtCourse(e.target.value)} required />
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
                    void save({
                      ...value,
                      teeTimes: value.teeTimes.filter((x) => x.id !== t.id),
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
      {tab === "pair" ? (
        <>
          <AddNote
            textPh="Looking for a group"
            extraPh="Day / course / handicap"
            onAdd={(text, extra) =>
              void save({
                ...value,
                looking: [{ id: uid("lk"), text, extra }, ...value.looking].slice(0, 40),
              })
            }
          />
          <NoteRows
            items={value.looking}
            onRemove={(id) =>
              void save({ ...value, looking: value.looking.filter((x) => x.id !== id) })
            }
          />
        </>
      ) : null}
      {tab === "history" ? (
        <ul className="ms-cal-list">
          {value.rounds.map((r) => {
            const tot = r.scores.reduce<number>(
              (s, n) => s + (typeof n === "number" ? n : 0),
              0
            );
            return (
              <li key={r.id}>
                <div>
                  <strong>
                    {r.course} · {r.holes} holes
                  </strong>
                  <span>
                    {r.date} · {tot || "—"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function MySpacePickleballLogBoard() {
  const empty = emptyBoards().pickleballLog;
  const { value, save, ready, saving, error } = useMemberBoard<PickleballLogBoard>(
    "pickleballLog",
    empty,
    true
  );
  const [tab, setTab] = useState("dashboard");
  const [partner, setPartner] = useState("");
  const [opp, setOpp] = useState("");
  const [score, setScore] = useState("");
  const [court, setCourt] = useState("");
  const [win, setWin] = useState(true);
  const [person, setPerson] = useState("");
  if (!ready) return <p className="panel-hint">Loading pickleball log…</p>;
  const wins = value.matches.filter((m) => m.win).length;

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        DUPR, match log, people, and find-a-game. Public courts stay on Pickleball.
      </p>
      <PublicHop href="/pickleball" label="Pickleball" />
      <Status error={error} saving={saving} />
      <SubNav
        tabs={[
          { id: "dashboard", label: "DUPR & record" },
          { id: "matches", label: "Matches" },
          { id: "people", label: "People" },
          { id: "play", label: "Find a game" },
        ]}
        tab={tab}
        onTab={setTab}
      />
      {tab === "dashboard" ? (
        <div className="form-grid ms-module-form">
          <div className="ms-stat-row">
            <div className="ms-stat">
              <span>Matches</span>
              <strong>{value.matches.length}</strong>
            </div>
            <div className="ms-stat">
              <span>Wins</span>
              <strong>{wins}</strong>
            </div>
          </div>
          <div className="field">
            <label>Your name</label>
            <input
              value={value.profile.name}
              onChange={(e) =>
                void save({
                  ...value,
                  profile: { ...value.profile, name: e.target.value.slice(0, 60) },
                })
              }
            />
          </div>
          <div className="field">
            <label>DUPR singles</label>
            <input
              value={value.profile.duprSingles}
              onChange={(e) =>
                void save({
                  ...value,
                  profile: { ...value.profile, duprSingles: e.target.value.slice(0, 8) },
                })
              }
            />
          </div>
          <div className="field">
            <label>DUPR doubles</label>
            <input
              value={value.profile.duprDoubles}
              onChange={(e) =>
                void save({
                  ...value,
                  profile: { ...value.profile, duprDoubles: e.target.value.slice(0, 8) },
                })
              }
            />
          </div>
          <div className="field">
            <label>Notes</label>
            <textarea
              rows={2}
              value={value.profile.notes}
              onChange={(e) =>
                void save({
                  ...value,
                  profile: { ...value.profile, notes: e.target.value.slice(0, 400) },
                })
              }
            />
          </div>
        </div>
      ) : null}
      {tab === "matches" ? (
        <>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              void save({
                ...value,
                matches: [
                  {
                    id: uid("pm"),
                    date: today(),
                    partner,
                    opponent: opp,
                    score,
                    court,
                    win,
                  },
                  ...value.matches,
                ].slice(0, 80),
              });
              setPartner("");
              setOpp("");
              setScore("");
              setCourt("");
            }}
          >
            <div className="field">
              <label>Partner</label>
              <input value={partner} onChange={(e) => setPartner(e.target.value)} />
            </div>
            <div className="field">
              <label>Opponent</label>
              <input value={opp} onChange={(e) => setOpp(e.target.value)} />
            </div>
            <div className="field">
              <label>Score</label>
              <input value={score} onChange={(e) => setScore(e.target.value)} placeholder="11-7, 11-9" />
            </div>
            <div className="field">
              <label>Court</label>
              <input value={court} onChange={(e) => setCourt(e.target.value)} />
            </div>
            <label className="ms-check">
              <input type="checkbox" checked={win} onChange={(e) => setWin(e.target.checked)} />
              We won
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
                    {m.win ? "W" : "L"} {m.score || "match"}
                  </strong>
                  <span>
                    {m.date} · {m.court} {m.partner ? `· with ${m.partner}` : ""}{" "}
                    {m.opponent ? `vs ${m.opponent}` : ""}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {tab === "people" ? (
        <>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!person.trim()) return;
              void save({
                ...value,
                people: [{ id: uid("pp"), name: person.trim(), notes: "" }, ...value.people].slice(
                  0,
                  40
                ),
              });
              setPerson("");
            }}
          >
            <div className="field">
              <label>Player</label>
              <input value={person} onChange={(e) => setPerson(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">
              Add
            </button>
          </form>
          <ul className="ms-cal-list">
            {value.people.map((p) => (
              <li key={p.id}>
                <div>
                  <strong>{p.name}</strong>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}
      {tab === "play" ? (
        <>
          <AddNote
            textPh="Looking for a game"
            extraPh="Skill / court / time"
            onAdd={(text, extra) =>
              void save({
                ...value,
                looking: [{ id: uid("pl"), text, extra }, ...value.looking].slice(0, 40),
              })
            }
          />
          <NoteRows
            items={value.looking}
            onRemove={(id) =>
              void save({ ...value, looking: value.looking.filter((x) => x.id !== id) })
            }
          />
        </>
      ) : null}
    </div>
  );
}
