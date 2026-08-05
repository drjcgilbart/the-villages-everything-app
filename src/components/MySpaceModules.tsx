"use client";

import { useEffect, useState } from "react";

/** Lightweight localStorage boards for Lanai Legend+ modules */

function useLocalJson<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);

  function save(next: T) {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  return { value, save, ready };
}

export function MySpaceHealthLog() {
  const { value, save, ready } = useLocalJson("tvi-ms-health", {
    weight: "",
    note: "",
    walked: false,
    meds: false,
  });

  if (!ready) return <p className="panel-hint">Loading health lanai…</p>;

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Private on this browser — no wellness cult required. Just honest
        checkboxes and optional numbers.
      </p>
      <div className="form-grid ms-module-form">
        <div className="field">
          <label>Weight (optional)</label>
          <input
            value={value.weight}
            onChange={(e) => save({ ...value, weight: e.target.value })}
            placeholder="e.g. 168"
            inputMode="decimal"
          />
        </div>
        <div className="field">
          <label>Today’s note</label>
          <input
            value={value.note}
            onChange={(e) => save({ ...value, note: e.target.value })}
            placeholder="Walked the long way home…"
          />
        </div>
        <label className="ms-check">
          <input
            type="checkbox"
            checked={value.walked}
            onChange={(e) => save({ ...value, walked: e.target.checked })}
          />
          I moved on purpose today
        </label>
        <label className="ms-check">
          <input
            type="checkbox"
            checked={value.meds}
            onChange={(e) => save({ ...value, meds: e.target.checked })}
          />
          Meds / vitamins checked off
        </label>
      </div>
    </div>
  );
}

export function MySpacePetSchedule() {
  const { value, save, ready } = useLocalJson("tvi-ms-pet", {
    petName: "The Real CEO",
    morningWalk: false,
    eveningWalk: false,
    breakfast: false,
    dinner: false,
    note: "",
  });

  if (!ready) return <p className="panel-hint">Loading pet parade…</p>;

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Walks, meals, and reminders that Florida dogs have strong opinions about
        3 p.m. thunderstorms.
      </p>
      <div className="form-grid ms-module-form">
        <div className="field">
          <label>Pet name / title</label>
          <input
            value={value.petName}
            onChange={(e) => save({ ...value, petName: e.target.value })}
          />
        </div>
        <label className="ms-check">
          <input
            type="checkbox"
            checked={value.morningWalk}
            onChange={(e) => save({ ...value, morningWalk: e.target.checked })}
          />
          Morning walk
        </label>
        <label className="ms-check">
          <input
            type="checkbox"
            checked={value.eveningWalk}
            onChange={(e) => save({ ...value, eveningWalk: e.target.checked })}
          />
          Evening walk
        </label>
        <label className="ms-check">
          <input
            type="checkbox"
            checked={value.breakfast}
            onChange={(e) => save({ ...value, breakfast: e.target.checked })}
          />
          Breakfast
        </label>
        <label className="ms-check">
          <input
            type="checkbox"
            checked={value.dinner}
            onChange={(e) => save({ ...value, dinner: e.target.checked })}
          />
          Dinner
        </label>
        <div className="field">
          <label>Note</label>
          <input
            value={value.note}
            onChange={(e) => save({ ...value, note: e.target.value })}
            placeholder="Squirrel incident under control"
          />
        </div>
      </div>
    </div>
  );
}

type CalItem = { id: string; text: string; when: string };

export function MySpaceCalendarBoard() {
  const { value, save, ready } = useLocalJson<{ items: CalItem[] }>(
    "tvi-ms-calendar",
    { items: [] }
  );
  const [text, setText] = useState("");
  const [when, setWhen] = useState("");

  if (!ready) return <p className="panel-hint">Loading calendar board…</p>;

  function addItem(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    const item: CalItem = {
      id: `c-${Date.now().toString(36)}`,
      text: t.slice(0, 120),
      when: when.trim().slice(0, 40) || "Sometime soon",
    };
    save({ items: [item, ...value.items].slice(0, 40) });
    setText("");
    setWhen("");
  }

  function remove(id: string) {
    save({ items: value.items.filter((i) => i.id !== id) });
  }

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Your personal sticky notes for square nights, doctor days, and “don’t
        forget the pickleball bag.” Not the official district calendar.
      </p>
      <form className="form-grid ms-module-form" onSubmit={addItem}>
        <div className="field">
          <label>What</label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Brownwood band night"
            required
          />
        </div>
        <div className="field">
          <label>When</label>
          <input
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            placeholder="Fri 7pm / next Tuesday"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Add to board
        </button>
      </form>
      {value.items.length === 0 ? (
        <p className="panel-hint" style={{ marginBottom: 0 }}>
          Nothing pinned yet — add your first cart-path appointment.
        </p>
      ) : (
        <ul className="ms-cal-list">
          {value.items.map((i) => (
            <li key={i.id}>
              <div>
                <strong>{i.text}</strong>
                <span>{i.when}</span>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => remove(i.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function MySpaceRoyaltyLounge() {
  return (
    <div className="about-panel ms-module ms-lounge">
      <p className="ms-module-lead">
        Welcome to the metaphorical front row. Parking is still a contact sport;
        the badge is free (with your plan).
      </p>
      <ul className="ts-tips-list">
        <li>
          <strong>Early peeks</strong> — experimental Hub features land here
          first when we ship them.
        </li>
        <li>
          <strong>Parade energy</strong> — you’re on the short list for
          member-only notes and soft launches.
        </li>
        <li>
          <strong>Bragging rights</strong> — Square Royalty flair on your My
          Space header. Use responsibly at dinner.
        </li>
      </ul>
      <p className="mkt-disclaimer" style={{ marginBottom: 0 }}>
        This lounge is a living space — more exclusive content can be added from
        Studio as the Hub grows. Not affiliated with any official square, parade
        committee, or golf cart mafia.
      </p>
    </div>
  );
}
