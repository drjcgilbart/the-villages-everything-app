"use client";

import { useEffect, useState } from "react";

/** Re-export full boards (ported from My Retirement Reboot). */
export { MySpaceHealthBoard as MySpaceHealthLog } from "@/components/MySpaceHealthBoard";
export { MySpacePetBoard as MySpacePetSchedule } from "@/components/MySpacePetBoard";

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
