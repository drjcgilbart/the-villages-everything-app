"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { wealthTipOfDay } from "@/lib/wealthResources";

const STORAGE_KEY = "tvea-wealth-checkin-v1";

type DayLog = {
  dateKey: string;
  coffeeBudget: number;
  coffeeSpent: number;
  billsChecked: boolean;
  scamPause: boolean;
  note?: string;
  monthlyIncome: number;
  monthlySpend: number;
};

function todayKey() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const d = parts.find((p) => p.type === "day")?.value;
  return `${y}-${m}-${d}`;
}

function emptyLog(dateKey: string): DayLog {
  return {
    dateKey,
    coffeeBudget: 40,
    coffeeSpent: 0,
    billsChecked: false,
    scamPause: false,
    monthlyIncome: 0,
    monthlySpend: 0,
  };
}

function loadLog(): DayLog {
  if (typeof window === "undefined") return emptyLog(todayKey());
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyLog(todayKey());
    const parsed = JSON.parse(raw) as DayLog;
    const key = todayKey();
    // Keep monthly numbers across days; reset daily bits
    const base = emptyLog(key);
    return {
      ...base,
      coffeeBudget: Number(parsed.coffeeBudget) || 40,
      coffeeSpent:
        parsed.dateKey === key ? Number(parsed.coffeeSpent) || 0 : 0,
      billsChecked: parsed.dateKey === key ? !!parsed.billsChecked : false,
      scamPause: parsed.dateKey === key ? !!parsed.scamPause : false,
      note: parsed.dateKey === key ? parsed.note : undefined,
      monthlyIncome: Number(parsed.monthlyIncome) || 0,
      monthlySpend: Number(parsed.monthlySpend) || 0,
    };
  } catch {
    return emptyLog(todayKey());
  }
}

function saveLog(log: DayLog) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch {
    /* ignore */
  }
}

function money(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function WealthHub() {
  const [log, setLog] = useState<DayLog | null>(null);
  const [note, setNote] = useState("");
  const [flash, setFlash] = useState(false);
  const tip = useMemo(() => wealthTipOfDay(), []);

  useEffect(() => {
    const initial = loadLog();
    setLog(initial);
    setNote(initial.note || "");
  }, []);

  const update = useCallback((patch: Partial<DayLog>) => {
    setLog((prev) => {
      const base = prev || emptyLog(todayKey());
      const next = { ...base, ...patch, dateKey: todayKey() };
      saveLog(next);
      return next;
    });
  }, []);

  if (!log) {
    return <div className="empty-state">Loading money tools…</div>;
  }

  const day = log;
  const coffeeLeft = Math.max(0, day.coffeeBudget - day.coffeeSpent);
  const coffeePct = Math.min(
    100,
    Math.round((day.coffeeSpent / Math.max(day.coffeeBudget, 1)) * 100)
  );
  const cashFlow = day.monthlyIncome - day.monthlySpend;

  function saveNote() {
    update({ note: note.trim().slice(0, 240) });
    setFlash(true);
    setTimeout(() => setFlash(false), 2000);
  }

  return (
    <div className="wealth-hub">
      <div className="section-head">
        <div>
          <h2>Money tools (on this device)</h2>
          <p>
            Light trackers stored only in your browser — not linked to a bank.
            Fun budget energy, not a full accounting degree.
          </p>
        </div>
      </div>

      <div className="wealth-tools-grid">
        <article className="about-panel wealth-tool-card">
          <div className="wealth-tool-head">
            <span className="wealth-tool-emoji" aria-hidden>
              ☕
            </span>
            <div>
              <h3>Square / coffee budget</h3>
              <p className="wealth-muted">
                Weekly fun-money envelope for bands, lattes, and “we should get
                dessert.”
              </p>
            </div>
          </div>
          <p className="wealth-muted">
            Spent {money(day.coffeeSpent)} of {money(day.coffeeBudget)} ·{" "}
            <strong>{money(coffeeLeft)} left</strong>
          </p>
          <div className="wealth-meter">
            <div
              className="wealth-meter-bar"
              style={{ width: `${coffeePct}%` }}
            />
          </div>
          <div className="wealth-tool-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() =>
                update({ coffeeSpent: day.coffeeSpent + 5 })
              }
            >
              +$5
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                update({ coffeeSpent: day.coffeeSpent + 12 })
              }
            >
              +$12
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => update({ coffeeSpent: 0 })}
            >
              Reset week spend
            </button>
          </div>
          <label className="wealth-goal-label" htmlFor="coffee-budget">
            Weekly budget
          </label>
          <select
            id="coffee-budget"
            value={day.coffeeBudget}
            onChange={(e) =>
              update({ coffeeBudget: Number(e.target.value) })
            }
          >
            {[20, 30, 40, 50, 75, 100].map((n) => (
              <option key={n} value={n}>
                {money(n)} / week
              </option>
            ))}
          </select>
        </article>

        <article className="about-panel wealth-tool-card">
          <div className="wealth-tool-head">
            <span className="wealth-tool-emoji" aria-hidden>
              📅
            </span>
            <div>
              <h3>Monthly cash-flow sketch</h3>
              <p className="wealth-muted">
                Rough income vs spend — private on this device only.
              </p>
            </div>
          </div>
          <div className="wealth-field-row">
            <label>
              Monthly income (est.)
              <input
                type="number"
                min={0}
                step={100}
                value={day.monthlyIncome || ""}
                onChange={(e) =>
                  update({
                    monthlyIncome: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                placeholder="0"
              />
            </label>
            <label>
              Monthly spend (est.)
              <input
                type="number"
                min={0}
                step={100}
                value={day.monthlySpend || ""}
                onChange={(e) =>
                  update({
                    monthlySpend: Math.max(0, Number(e.target.value) || 0),
                  })
                }
                placeholder="0"
              />
            </label>
          </div>
          <p
            className={`wealth-cashflow${
              cashFlow < 0 ? " is-neg" : cashFlow > 0 ? " is-pos" : ""
            }`}
          >
            {day.monthlyIncome || day.monthlySpend
              ? `Sketch surplus / gap: ${money(cashFlow)}`
              : "Enter numbers to see a simple surplus or gap."}
          </p>
        </article>

        <article className="about-panel wealth-tool-card">
          <div className="wealth-tool-head">
            <span className="wealth-tool-emoji" aria-hidden>
              ✅
            </span>
            <div>
              <h3>Today&apos;s money hygiene</h3>
              <p className="wealth-muted">Tiny checkboxes. Big peace of mind.</p>
            </div>
          </div>
          <ul className="wealth-check-list">
            <li>
              <button
                type="button"
                className={`wealth-check${day.billsChecked ? " is-on" : ""}`}
                onClick={() => update({ billsChecked: !day.billsChecked })}
                aria-pressed={day.billsChecked}
              >
                <span aria-hidden>{day.billsChecked ? "✓" : "○"}</span>
                Peeked at bills / card activity today
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`wealth-check${day.scamPause ? " is-on" : ""}`}
                onClick={() => update({ scamPause: !day.scamPause })}
                aria-pressed={day.scamPause}
              >
                <span aria-hidden>{day.scamPause ? "✓" : "○"}</span>
                Practiced the 10-minute pause on any sales pitch
              </button>
            </li>
          </ul>
        </article>
      </div>

      <article className="about-panel wealth-tip-card">
        <span className="pill wealth-pill">Tip of the day</span>
        <p className="wealth-tip-text">{tip}</p>
      </article>

      <article className="about-panel wealth-note-card">
        <h3 style={{ marginTop: 0 }}>Pocket note</h3>
        <p className="wealth-muted">
          RMD due date, insurance renewal, “call the CPA” — stays on this
          browser only.
        </p>
        <textarea
          rows={2}
          maxLength={240}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Property tax due Nov · Medicare Open Enrollment Oct 15"
        />
        <div className="wealth-tool-actions">
          <button type="button" className="btn btn-primary btn-sm" onClick={saveNote}>
            Save note
          </button>
          {flash ? (
            <span className="wealth-saved">Saved on this browser</span>
          ) : null}
        </div>
      </article>
    </div>
  );
}
