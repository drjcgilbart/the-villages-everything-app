"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MAINT_KINDS,
  NEWS_TOPICS,
  emptyBoards,
  type EntertainmentBoard,
  type FoodBoard,
  type GolfLogBoard,
  type GymBoard,
  type MaintenanceBoard,
  type MemoriesBoard,
  type NewsBoard,
  type NoteItem,
  type PickleballLogBoard,
} from "@/lib/memberBoardModel";
import { useMemberBoard } from "@/components/useMemberBoard";

function newItem(text: string, extra?: string): NoteItem {
  return {
    id: `n-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
    text: text.trim().slice(0, 160),
    extra: extra?.trim().slice(0, 200) || undefined,
  };
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

function NoteRows({
  items,
  onRemove,
  onToggle,
}: {
  items: NoteItem[];
  onRemove: (id: string) => void;
  onToggle?: (id: string) => void;
}) {
  if (items.length === 0) {
    return <p className="panel-hint">Nothing here yet — add one above.</p>;
  }
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
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}

function AddRow({
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
        onAdd(text, extra);
        setText("");
        setExtra("");
      }}
    >
      <div className="field">
        <label>Add</label>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={textPh}
          required
        />
      </div>
      {extraPh ? (
        <div className="field">
          <label>Note</label>
          <input
            value={extra}
            onChange={(e) => setExtra(e.target.value)}
            placeholder={extraPh}
          />
        </div>
      ) : null}
      <button type="submit" className="btn btn-primary btn-sm">
        Save
      </button>
    </form>
  );
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

function Status({ error, saving }: { error: string | null; saving: boolean }) {
  if (error) return <p className="pf-form-error">{error}</p>;
  if (saving) return <p className="panel-hint">Saving to your account…</p>;
  return null;
}

export function MySpaceNewsBoard() {
  const empty = emptyBoards().news;
  const { value, save, ready, saving, error } = useMemberBoard<NewsBoard>(
    "news",
    empty,
    true
  );
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  if (!ready) return <p className="panel-hint">Loading news prefs…</p>;

  function toggle(id: string) {
    const has = value.topics.includes(id);
    const topics = has
      ? value.topics.filter((t) => t !== id)
      : [...value.topics, id].slice(0, 12);
    void save({ ...value, topics: topics.length ? topics : ["villages"] });
  }

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Pick the beats you care about and stash stories for the lanai. This is
        your mix — not the public Local News page.
      </p>
      <PublicHop href="/news" label="Local News" />
      <Status error={error} saving={saving} />
      <div className="ms-subnav" style={{ marginTop: "0.75rem" }}>
        {NEWS_TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`ms-subnav-btn ${value.topics.includes(t.id) ? "is-on" : ""}`}
            onClick={() => toggle(t.id)}
          >
            {t.emoji} {t.label}
          </button>
        ))}
      </div>
      <form
        className="form-grid ms-module-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          void save({
            ...value,
            saved: [
              {
                id: newItem(title).id,
                title: title.trim().slice(0, 80),
                url: url.trim().slice(0, 240),
              },
              ...value.saved,
            ].slice(0, 60),
          });
          setTitle("");
          setUrl("");
        }}
      >
        <div className="field">
          <label>Saved story</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Headline"
            required
          />
        </div>
        <div className="field">
          <label>Link</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Save
        </button>
      </form>
      <ul className="ms-cal-list">
        {value.saved.map((s) => (
          <li key={s.id}>
            <div>
              <strong>{s.title}</strong>
              {s.url ? (
                <span>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    Open
                  </a>
                </span>
              ) : null}
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                void save({
                  ...value,
                  saved: value.saved.filter((x) => x.id !== s.id),
                })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MySpaceEntertainmentBoard() {
  const empty = emptyBoards().entertainment;
  const { value, save, ready, saving, error } =
    useMemberBoard<EntertainmentBoard>("entertainment", empty, true);
  const [tab, setTab] = useState("tonight");
  const [square, setSquare] = useState<string | null>(null);
  const [notes, setNotes] = useState<string | null>(null);
  if (!ready) return <p className="panel-hint">Loading entertainment…</p>;
  const squareVal = square ?? value.tonightSquare;
  const notesVal = notes ?? value.tonightNotes;

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Your nights out: which square, which tickets, what to watch later.
      </p>
      <PublicHop href="/town-squares" label="Town Squares" />
      <Status error={error} saving={saving} />
      <SubNav
        tabs={[
          { id: "tonight", label: "Tonight" },
          { id: "shows", label: "Tickets" },
          { id: "watch", label: "Watch later" },
        ]}
        tab={tab}
        onTab={setTab}
      />
      {tab === "tonight" ? (
        <form
          className="form-grid ms-module-form"
          onSubmit={(e) => {
            e.preventDefault();
            void save({
              ...value,
              tonightSquare: squareVal.slice(0, 60),
              tonightNotes: notesVal.slice(0, 200),
            });
          }}
        >
          <div className="field">
            <label>Square</label>
            <input
              value={squareVal}
              onChange={(e) => setSquare(e.target.value)}
              placeholder="Spanish Springs, Brownwood…"
            />
          </div>
          <div className="field">
            <label>Notes</label>
            <input
              value={notesVal}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Band at 7 · cart by the fountain"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
            Save tonight
          </button>
        </form>
      ) : null}
      {tab === "shows" ? (
        <>
          <AddRow
            textPh="Show or ticket"
            extraPh="When / where"
            onAdd={(text, extra) =>
              void save({
                ...value,
                shows: [newItem(text, extra), ...value.shows].slice(0, 60),
              })
            }
          />
          <NoteRows
            items={value.shows}
            onRemove={(id) =>
              void save({
                ...value,
                shows: value.shows.filter((i) => i.id !== id),
              })
            }
          />
        </>
      ) : null}
      {tab === "watch" ? (
        <>
          <AddRow
            textPh="Show or movie"
            extraPh="Where to watch"
            onAdd={(text, extra) =>
              void save({
                ...value,
                watchLater: [newItem(text, extra), ...value.watchLater].slice(
                  0,
                  60
                ),
              })
            }
          />
          <NoteRows
            items={value.watchLater}
            onRemove={(id) =>
              void save({
                ...value,
                watchLater: value.watchLater.filter((i) => i.id !== id),
              })
            }
          />
        </>
      ) : null}
    </div>
  );
}

export function MySpaceFoodBoard() {
  const empty = emptyBoards().food;
  const { value, save, ready, saving, error } = useMemberBoard<FoodBoard>(
    "food",
    empty,
    true
  );
  const [tab, setTab] = useState("grocery");
  if (!ready) return <p className="panel-hint">Loading kitchen…</p>;

  function list(key: keyof FoodBoard) {
    const items = value[key];
    return (
      <>
        <AddRow
          textPh={key === "cellar" ? "Bottle or drink" : "Item"}
          extraPh={key === "recipes" ? "How you make it" : "Note"}
          onAdd={(text, extra) =>
            void save({
              ...value,
              [key]: [newItem(text, extra), ...items].slice(0, 60),
            })
          }
        />
        <NoteRows
          items={items}
          onToggle={
            key === "grocery"
              ? (id) =>
                  void save({
                    ...value,
                    grocery: value.grocery.map((g) =>
                      g.id === id ? { ...g, done: !g.done } : g
                    ),
                  })
              : undefined
          }
          onRemove={(id) =>
            void save({
              ...value,
              [key]: items.filter((i) => i.id !== id),
            })
          }
        />
      </>
    );
  }

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Grocery, recipes, and the cellar — your kitchen, not the public Dining
        ratings.
      </p>
      <PublicHop href="/dining" label="Dining" />
      <Status error={error} saving={saving} />
      <SubNav
        tabs={[
          { id: "grocery", label: "Grocery" },
          { id: "recipes", label: "Recipes" },
          { id: "cellar", label: "Wine & drinks" },
        ]}
        tab={tab}
        onTab={setTab}
      />
      {tab === "grocery" ? list("grocery") : null}
      {tab === "recipes" ? list("recipes") : null}
      {tab === "cellar" ? list("cellar") : null}
    </div>
  );
}

export function MySpaceGymBoard() {
  const empty = emptyBoards().gym;
  const { value, save, ready, saving, error } = useMemberBoard<GymBoard>(
    "gym",
    empty,
    true
  );
  const [tab, setTab] = useState("workouts");
  if (!ready) return <p className="panel-hint">Loading gym log…</p>;

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Personal training log — Fit Club, home gym, or the rec-center circuit.
      </p>
      <Status error={error} saving={saving} />
      <SubNav
        tabs={[
          { id: "workouts", label: "Workouts" },
          { id: "supplements", label: "Supplements" },
        ]}
        tab={tab}
        onTab={setTab}
      />
      {tab === "workouts" ? (
        <>
          <AddRow
            textPh="Workout"
            extraPh="Today · 30 min · Fit Club"
            onAdd={(text, extra) =>
              void save({
                ...value,
                workouts: [newItem(text, extra), ...value.workouts].slice(0, 60),
              })
            }
          />
          <NoteRows
            items={value.workouts}
            onRemove={(id) =>
              void save({
                ...value,
                workouts: value.workouts.filter((i) => i.id !== id),
              })
            }
          />
        </>
      ) : (
        <>
          <AddRow
            textPh="Supplement"
            extraPh="Dose / when"
            onAdd={(text, extra) =>
              void save({
                ...value,
                supplements: [newItem(text, extra), ...value.supplements].slice(
                  0,
                  60
                ),
              })
            }
          />
          <NoteRows
            items={value.supplements}
            onRemove={(id) =>
              void save({
                ...value,
                supplements: value.supplements.filter((i) => i.id !== id),
              })
            }
          />
        </>
      )}
    </div>
  );
}

export function MySpaceMaintenanceBoard() {
  const empty = emptyBoards().maintenance;
  const { value, save, ready, saving, error } =
    useMemberBoard<MaintenanceBoard>("maintenance", empty, true);
  const [kind, setKind] = useState("golf-cart");
  if (!ready) return <p className="panel-hint">Loading maintenance…</p>;

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Cart battery, HVAC filter, oil change — reminders that stay on your
        account.
      </p>
      <Status error={error} saving={saving} />
      <div className="ms-subnav">
        {MAINT_KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            className={`ms-subnav-btn ${kind === k.id ? "is-on" : ""}`}
            onClick={() => setKind(k.id)}
          >
            {k.emoji} {k.label}
          </button>
        ))}
      </div>
      <AddRow
        textPh="Job"
        extraPh="Due / miles"
        onAdd={(text, extra) => {
          const kindLabel =
            MAINT_KINDS.find((k) => k.id === kind)?.label || kind;
          void save({
            jobs: [
              newItem(text, `${kindLabel}${extra ? ` · ${extra}` : ""}`),
              ...value.jobs,
            ].slice(0, 60),
          });
        }}
      />
      <NoteRows
        items={value.jobs}
        onToggle={(id) =>
          void save({
            jobs: value.jobs.map((j) =>
              j.id === id ? { ...j, done: !j.done } : j
            ),
          })
        }
        onRemove={(id) =>
          void save({ jobs: value.jobs.filter((j) => j.id !== id) })
        }
      />
    </div>
  );
}

export function MySpaceMemoriesBoard() {
  const empty = emptyBoards().memories;
  const { value, save, ready, saving, error } = useMemberBoard<MemoriesBoard>(
    "memories",
    empty,
    true
  );
  if (!ready) return <p className="panel-hint">Loading photos…</p>;

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Private captions on your account. The public Photo Journal stays free.
      </p>
      <PublicHop href="/photos" label="Photo Journal" />
      <Status error={error} saving={saving} />
      <AddRow
        textPh="Caption"
        extraPh="Date or place"
        onAdd={(text, extra) =>
          void save({
            photos: [newItem(text, extra), ...value.photos].slice(0, 60),
          })
        }
      />
      <NoteRows
        items={value.photos}
        onRemove={(id) =>
          void save({ photos: value.photos.filter((p) => p.id !== id) })
        }
      />
    </div>
  );
}

export function MySpaceGolfLogBoard() {
  const empty = emptyBoards().golfLog;
  const { value, save, ready, saving, error } = useMemberBoard<GolfLogBoard>(
    "golfLog",
    empty,
    true
  );
  if (!ready) return <p className="panel-hint">Loading golf log…</p>;

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Personal scorecard notes. Public Golf (courses, leader board, foursomes)
        stays free on the Hub.
      </p>
      <PublicHop href="/golf-zone" label="Golf" />
      <Status error={error} saving={saving} />
      <AddRow
        textPh="Course"
        extraPh="Score · date · tees"
        onAdd={(text, extra) =>
          void save({
            rounds: [newItem(text, extra), ...value.rounds].slice(0, 60),
          })
        }
      />
      <NoteRows
        items={value.rounds}
        onRemove={(id) =>
          void save({ rounds: value.rounds.filter((r) => r.id !== id) })
        }
      />
    </div>
  );
}

export function MySpacePickleballLogBoard() {
  const empty = emptyBoards().pickleballLog;
  const { value, save, ready, saving, error } =
    useMemberBoard<PickleballLogBoard>("pickleballLog", empty, true);
  if (!ready) return <p className="panel-hint">Loading pickleball log…</p>;

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Personal match notes. Public Pickleball (DUPR board, find a game) stays
        free on the Hub.
      </p>
      <PublicHop href="/pickleball" label="Pickleball" />
      <Status error={error} saving={saving} />
      <AddRow
        textPh="Match / result"
        extraPh="Court · partner · date"
        onAdd={(text, extra) =>
          void save({
            matches: [newItem(text, extra), ...value.matches].slice(0, 60),
          })
        }
      />
      <NoteRows
        items={value.matches}
        onRemove={(id) =>
          void save({ matches: value.matches.filter((m) => m.id !== id) })
        }
      />
    </div>
  );
}
