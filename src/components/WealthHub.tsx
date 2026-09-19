"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { wealthTipOfDay } from "@/lib/wealthResources";
import { PocketNoteCard } from "@/components/PocketNoteCard";

const STORAGE_KEY = "tvea-wealth-tools-v2";
const LEGACY_KEY = "tvea-wealth-checkin-v1";

type MoneyLine = { id: string; label: string; amount: number };
type HygieneItem = { id: string; label: string; done: boolean };
type MoneyDate = { id: string; label: string; date: string };
type EnvelopeHit = { id: string; label: string; amount: number; at: string };

type WealthTools = {
  envelopeName: string;
  envelopeBudget: number;
  envelopeSpent: number;
  envelopeWeekKey: string;
  envelopeQuick: number[];
  envelopeHits: EnvelopeHit[];
  incomeLines: MoneyLine[];
  spendLines: MoneyLine[];
  hygieneDateKey: string;
  hygiene: HygieneItem[];
  note: string;
  moneyDates: MoneyDate[];
};

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function floridaYmd(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function weekStartKey(ymd = floridaYmd()) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d, 12));
  const back = (dt.getUTCDay() + 6) % 7;
  dt.setUTCDate(dt.getUTCDate() - back);
  return dt.toISOString().slice(0, 10);
}

function money(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function defaultHygiene(): HygieneItem[] {
  return [
    { id: "bills", label: "Peeked at bills / card activity today", done: false },
    {
      id: "scam",
      label: "Practiced the 10-minute pause on any sales pitch",
      done: false,
    },
    { id: "balance", label: "Checked checking / savings balance", done: false },
  ];
}

function emptyTools(): WealthTools {
  const today = floridaYmd();
  return {
    envelopeName: "Square / coffee",
    envelopeBudget: 40,
    envelopeSpent: 0,
    envelopeWeekKey: weekStartKey(today),
    envelopeQuick: [5, 12, 20],
    envelopeHits: [],
    incomeLines: [],
    spendLines: [],
    hygieneDateKey: today,
    hygiene: defaultHygiene(),
    note: "",
    moneyDates: [],
  };
}

function migrateLegacy(raw: Record<string, unknown>): WealthTools {
  const base = emptyTools();
  const income = Number(raw.monthlyIncome) || 0;
  const spend = Number(raw.monthlySpend) || 0;
  return {
    ...base,
    envelopeBudget: Number(raw.coffeeBudget) || 40,
    envelopeSpent: Number(raw.coffeeSpent) || 0,
    envelopeHits: [],
    incomeLines: income
      ? [{ id: uid("inc"), label: "Monthly income", amount: income }]
      : [],
    spendLines: spend
      ? [{ id: uid("sp"), label: "Monthly spend", amount: spend }]
      : [],
    hygiene: defaultHygiene().map((h) => {
      if (h.id === "bills") return { ...h, done: !!raw.billsChecked };
      if (h.id === "scam") return { ...h, done: !!raw.scamPause };
      return h;
    }),
    note: String(raw.note || "").slice(0, 800),
  };
}

function normalize(raw: Partial<WealthTools>): WealthTools {
  const base = emptyTools();
  const numList = Array.isArray(raw.envelopeQuick)
    ? raw.envelopeQuick
        .map((n) => Math.round(Number(n)))
        .filter((n) => n > 0 && n <= 500)
        .slice(0, 6)
    : base.envelopeQuick;
  return {
    envelopeName: String(raw.envelopeName || base.envelopeName).slice(0, 40),
    envelopeBudget: Math.max(0, Number(raw.envelopeBudget) || 0),
    envelopeSpent: Math.max(0, Number(raw.envelopeSpent) || 0),
    envelopeWeekKey: String(raw.envelopeWeekKey || base.envelopeWeekKey),
    envelopeQuick: numList.length ? numList : base.envelopeQuick,
    envelopeHits: Array.isArray(raw.envelopeHits)
      ? raw.envelopeHits.slice(-20)
      : [],
    incomeLines: Array.isArray(raw.incomeLines) ? raw.incomeLines.slice(0, 16) : [],
    spendLines: Array.isArray(raw.spendLines) ? raw.spendLines.slice(0, 16) : [],
    hygieneDateKey: String(raw.hygieneDateKey || base.hygieneDateKey),
    hygiene: Array.isArray(raw.hygiene) && raw.hygiene.length
      ? raw.hygiene.slice(0, 12)
      : defaultHygiene(),
    note: String(raw.note || "").slice(0, 800),
    moneyDates: Array.isArray(raw.moneyDates) ? raw.moneyDates.slice(0, 16) : [],
  };
}

function loadTools(): WealthTools {
  if (typeof window === "undefined") return emptyTools();
  try {
    const v2 = localStorage.getItem(STORAGE_KEY);
    if (v2) return normalize(JSON.parse(v2) as Partial<WealthTools>);
    const v1 = localStorage.getItem(LEGACY_KEY);
    if (v1) return migrateLegacy(JSON.parse(v1) as Record<string, unknown>);
  } catch {
    /* ignore */
  }
  return emptyTools();
}

function saveTools(tools: WealthTools) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tools));
  } catch {
    /* ignore */
  }
}

function rollForward(tools: WealthTools): WealthTools {
  const today = floridaYmd();
  const week = weekStartKey(today);
  let next = tools;
  if (tools.envelopeWeekKey !== week) {
    next = {
      ...next,
      envelopeWeekKey: week,
      envelopeSpent: 0,
      envelopeHits: [],
    };
  }
  if (tools.hygieneDateKey !== today) {
    next = {
      ...next,
      hygieneDateKey: today,
      hygiene: next.hygiene.map((h) => ({ ...h, done: false })),
    };
  }
  return next;
}

export function WealthHub() {
  const [tools, setTools] = useState<WealthTools | null>(null);
  const [note, setNote] = useState("");
  const [flash, setFlash] = useState(false);
  const [customSpend, setCustomSpend] = useState("");
  const [newQuick, setNewQuick] = useState("");
  const [incLabel, setIncLabel] = useState("");
  const [incAmt, setIncAmt] = useState("");
  const [spLabel, setSpLabel] = useState("");
  const [spAmt, setSpAmt] = useState("");
  const [hygLabel, setHygLabel] = useState("");
  const [dateLabel, setDateLabel] = useState("");
  const [dateVal, setDateVal] = useState("");
  const tip = useMemo(() => wealthTipOfDay(), []);

  useEffect(() => {
    const initial = rollForward(loadTools());
    setTools(initial);
    setNote(initial.note || "");
    saveTools(initial);
  }, []);

  const update = useCallback((patch: Partial<WealthTools>) => {
    setTools((prev) => {
      const base = prev || emptyTools();
      const next = rollForward({ ...base, ...patch });
      saveTools(next);
      return next;
    });
  }, []);

  if (!tools) {
    return <div className="empty-state">Loading money tools…</div>;
  }

  const data = tools;
  const coffeeLeft = Math.max(0, data.envelopeBudget - data.envelopeSpent);
  const coffeePct = Math.min(
    100,
    Math.round((data.envelopeSpent / Math.max(data.envelopeBudget, 1)) * 100)
  );
  const incomeTotal = data.incomeLines.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const spendTotal = data.spendLines.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const cashFlow = incomeTotal - spendTotal;
  const today = floridaYmd();
  const upcomingDates = [...data.moneyDates]
    .filter((d) => d.date)
    .sort((a, b) => a.date.localeCompare(b.date));

  function addSpend(amount: number, label?: string) {
    if (!(amount > 0)) return;
    update({
      envelopeSpent: data.envelopeSpent + amount,
      envelopeHits: [
        ...data.envelopeHits,
        {
          id: uid("hit"),
          label: (label || data.envelopeName).slice(0, 40),
          amount,
          at: new Date().toISOString(),
        },
      ].slice(-20),
    });
  }

  function saveNote() {
    update({ note: note.trim().slice(0, 800) });
    setFlash(true);
    setTimeout(() => setFlash(false), 2000);
  }

  return (
    <div className="wealth-hub">
      <div className="section-head">
        <div>
          <h2>Money tools (on this device)</h2>
          <p>
            Customize the envelopes, line items, and checklists. Stored only in
            this browser — not linked to a bank, and not financial advice.
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
              <h3>Weekly fun-money envelope</h3>
              <p className="wealth-muted">
                Name it, set the budget, tap a chip, or type any amount. Resets
                each Monday.
              </p>
            </div>
          </div>
          <label className="wealth-goal-label" htmlFor="env-name">
            Envelope name
          </label>
          <input
            id="env-name"
            className="wealth-full-input"
            value={tools.envelopeName}
            maxLength={40}
            onChange={(e) => update({ envelopeName: e.target.value.slice(0, 40) })}
            placeholder="Square / coffee"
          />
          <p className="wealth-muted">
            Spent {money(tools.envelopeSpent)} of {money(tools.envelopeBudget)} ·{" "}
            <strong>{money(coffeeLeft)} left</strong>
          </p>
          <div className="wealth-meter">
            <div
              className="wealth-meter-bar"
              style={{ width: `${coffeePct}%` }}
            />
          </div>
          <div className="wealth-tool-actions">
            {tools.envelopeQuick.map((n) => (
              <button
                key={n}
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => addSpend(n)}
              >
                +{money(n)}
              </button>
            ))}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => update({ envelopeSpent: 0, envelopeHits: [] })}
            >
              Reset this week
            </button>
          </div>
          <div className="wealth-inline-add">
            <input
              className="wealth-full-input"
              type="number"
              min={1}
              inputMode="decimal"
              placeholder="Other amount"
              value={customSpend}
              onChange={(e) => setCustomSpend(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                addSpend(Math.round(Number(customSpend) || 0), "Custom");
                setCustomSpend("");
              }}
            >
              Add
            </button>
          </div>
          <label className="wealth-goal-label" htmlFor="env-budget">
            Weekly budget
          </label>
          <input
            id="env-budget"
            className="wealth-full-input"
            type="number"
            min={0}
            step={5}
            inputMode="decimal"
            value={tools.envelopeBudget || ""}
            onChange={(e) =>
              update({ envelopeBudget: Math.max(0, Number(e.target.value) || 0) })
            }
          />
          <p className="wealth-muted" style={{ marginTop: "0.65rem" }}>
            Quick-add chips — add or remove to match how you actually spend.
          </p>
          <div className="wealth-chip-row">
            {tools.envelopeQuick.map((n) => (
              <button
                key={`q-${n}`}
                type="button"
                className="wealth-chip"
                onClick={() =>
                  update({
                    envelopeQuick: tools.envelopeQuick.filter((x) => x !== n),
                  })
                }
                title="Remove chip"
              >
                {money(n)} ×
              </button>
            ))}
          </div>
          <div className="wealth-inline-add">
            <input
              className="wealth-full-input"
              type="number"
              min={1}
              inputMode="decimal"
              placeholder="New chip ($)"
              value={newQuick}
              onChange={(e) => setNewQuick(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                const n = Math.round(Number(newQuick) || 0);
                if (n > 0 && !tools.envelopeQuick.includes(n)) {
                  update({ envelopeQuick: [...tools.envelopeQuick, n].slice(0, 6) });
                }
                setNewQuick("");
              }}
            >
              Add chip
            </button>
          </div>
          {tools.envelopeHits.length > 0 ? (
            <ul className="wealth-hit-list">
              {[...tools.envelopeHits].reverse().slice(0, 6).map((h) => (
                <li key={h.id}>
                  <span>{h.label}</span>
                  <strong>{money(h.amount)}</strong>
                </li>
              ))}
            </ul>
          ) : null}
        </article>

        <article className="about-panel wealth-tool-card">
          <div className="wealth-tool-head">
            <span className="wealth-tool-emoji" aria-hidden>
              📅
            </span>
            <div>
              <h3>Monthly cash-flow sketch</h3>
              <p className="wealth-muted">
                Add your own income and spend lines — HOA, trail fees, Social
                Security, whatever you actually have.
              </p>
            </div>
          </div>
          <h4 className="wealth-subhead">Income</h4>
          {tools.incomeLines.map((line) => (
            <div key={line.id} className="wealth-line-row">
              <input
                className="wealth-full-input"
                value={line.label}
                maxLength={40}
                onChange={(e) =>
                  update({
                    incomeLines: tools.incomeLines.map((l) =>
                      l.id === line.id
                        ? { ...l, label: e.target.value.slice(0, 40) }
                        : l
                    ),
                  })
                }
              />
              <input
                className="wealth-amt-input"
                type="number"
                min={0}
                inputMode="decimal"
                value={line.amount || ""}
                onChange={(e) =>
                  update({
                    incomeLines: tools.incomeLines.map((l) =>
                      l.id === line.id
                        ? { ...l, amount: Math.max(0, Number(e.target.value) || 0) }
                        : l
                    ),
                  })
                }
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  update({
                    incomeLines: tools.incomeLines.filter((l) => l.id !== line.id),
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}
          <div className="wealth-line-row">
            <input
              className="wealth-full-input"
              placeholder="e.g. Social Security"
              value={incLabel}
              onChange={(e) => setIncLabel(e.target.value)}
            />
            <input
              className="wealth-amt-input"
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="$"
              value={incAmt}
              onChange={(e) => setIncAmt(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                const label = incLabel.trim();
                if (!label) return;
                update({
                  incomeLines: [
                    ...tools.incomeLines,
                    {
                      id: uid("inc"),
                      label: label.slice(0, 40),
                      amount: Math.max(0, Number(incAmt) || 0),
                    },
                  ],
                });
                setIncLabel("");
                setIncAmt("");
              }}
            >
              Add
            </button>
          </div>

          <h4 className="wealth-subhead">Spend</h4>
          {tools.spendLines.map((line) => (
            <div key={line.id} className="wealth-line-row">
              <input
                className="wealth-full-input"
                value={line.label}
                maxLength={40}
                onChange={(e) =>
                  update({
                    spendLines: tools.spendLines.map((l) =>
                      l.id === line.id
                        ? { ...l, label: e.target.value.slice(0, 40) }
                        : l
                    ),
                  })
                }
              />
              <input
                className="wealth-amt-input"
                type="number"
                min={0}
                inputMode="decimal"
                value={line.amount || ""}
                onChange={(e) =>
                  update({
                    spendLines: tools.spendLines.map((l) =>
                      l.id === line.id
                        ? { ...l, amount: Math.max(0, Number(e.target.value) || 0) }
                        : l
                    ),
                  })
                }
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  update({
                    spendLines: tools.spendLines.filter((l) => l.id !== line.id),
                  })
                }
              >
                Remove
              </button>
            </div>
          ))}
          <div className="wealth-line-row">
            <input
              className="wealth-full-input"
              placeholder="e.g. HOA + insurance"
              value={spLabel}
              onChange={(e) => setSpLabel(e.target.value)}
            />
            <input
              className="wealth-amt-input"
              type="number"
              min={0}
              inputMode="decimal"
              placeholder="$"
              value={spAmt}
              onChange={(e) => setSpAmt(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                const label = spLabel.trim();
                if (!label) return;
                update({
                  spendLines: [
                    ...tools.spendLines,
                    {
                      id: uid("sp"),
                      label: label.slice(0, 40),
                      amount: Math.max(0, Number(spAmt) || 0),
                    },
                  ],
                });
                setSpLabel("");
                setSpAmt("");
              }}
            >
              Add
            </button>
          </div>
          <p
            className={`wealth-cashflow${
              cashFlow < 0 ? " is-neg" : cashFlow > 0 ? " is-pos" : ""
            }`}
          >
            {incomeTotal || spendTotal
              ? `In ${money(incomeTotal)} · out ${money(spendTotal)} · ${
                  cashFlow >= 0 ? "surplus" : "gap"
                } ${money(cashFlow)}`
              : "Add a couple of lines to see surplus or gap."}
          </p>
        </article>

        <article className="about-panel wealth-tool-card">
          <div className="wealth-tool-head">
            <span className="wealth-tool-emoji" aria-hidden>
              ✅
            </span>
            <div>
              <h3>Today&apos;s money hygiene</h3>
              <p className="wealth-muted">
                Your checklist. Add or drop items — they reset each Florida
                morning.
              </p>
            </div>
          </div>
          <ul className="wealth-check-list">
            {tools.hygiene.map((h) => (
              <li key={h.id} className="wealth-check-row">
                <button
                  type="button"
                  className={`wealth-check${h.done ? " is-on" : ""}`}
                  onClick={() =>
                    update({
                      hygiene: tools.hygiene.map((x) =>
                        x.id === h.id ? { ...x, done: !x.done } : x
                      ),
                    })
                  }
                  aria-pressed={h.done}
                >
                  <span aria-hidden>{h.done ? "✓" : "○"}</span>
                  {h.label}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    update({
                      hygiene: tools.hygiene.filter((x) => x.id !== h.id),
                    })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="wealth-inline-add">
            <input
              className="wealth-full-input"
              placeholder="Add a daily check…"
              value={hygLabel}
              maxLength={80}
              onChange={(e) => setHygLabel(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                const label = hygLabel.trim();
                if (!label) return;
                update({
                  hygiene: [
                    ...tools.hygiene,
                    { id: uid("hyg"), label: label.slice(0, 80), done: false },
                  ].slice(0, 12),
                });
                setHygLabel("");
              }}
            >
              Add
            </button>
          </div>

          <h4 className="wealth-subhead">Money dates</h4>
          <p className="wealth-muted">
            RMDs, insurance, property tax — a tiny calendar you control.
          </p>
          <ul className="wealth-date-list">
            {upcomingDates.map((d) => {
              const soon = d.date <= today;
              return (
                <li key={d.id}>
                  <span>
                    <strong>{d.label}</strong>
                    <em className={soon ? "is-due" : ""}>
                      {d.date}
                      {soon ? " · due / past" : ""}
                    </em>
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      update({
                        moneyDates: tools.moneyDates.filter((x) => x.id !== d.id),
                      })
                    }
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="wealth-line-row">
            <input
              className="wealth-full-input"
              placeholder="e.g. Property tax"
              value={dateLabel}
              onChange={(e) => setDateLabel(e.target.value)}
            />
            <input
              className="wealth-amt-input"
              type="date"
              value={dateVal}
              onChange={(e) => setDateVal(e.target.value)}
            />
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                const label = dateLabel.trim();
                if (!label || !dateVal) return;
                update({
                  moneyDates: [
                    ...tools.moneyDates,
                    { id: uid("dt"), label: label.slice(0, 40), date: dateVal },
                  ].slice(0, 16),
                });
                setDateLabel("");
                setDateVal("");
              }}
            >
              Add
            </button>
          </div>
        </article>
      </div>

      <article className="about-panel wealth-tip-card">
        <span className="pill wealth-pill">Tip of the day</span>
        <p className="wealth-tip-text">{tip}</p>
      </article>

      <PocketNoteCard
        hint="RMD due date, insurance renewal, “call the CPA” — stays on this browser only. Signed-in neighbors also get a Pocket note on My Space → Investments."
        placeholder="e.g. Property tax due Nov · Medicare Open Enrollment Oct 15"
        value={note}
        onChange={setNote}
        onSave={saveNote}
        savedLabel={flash ? "Saved on this browser" : null}
      />
    </div>
  );
}
