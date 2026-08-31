"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  MAINT_KINDS,
  emptyBoards,
  type MaintAsset,
  type MaintTask,
  type MaintenanceBoard,
} from "@/lib/memberBoardModel";
import { useMemberBoard } from "@/components/useMemberBoard";
import {
  CART_SHOPS,
  MAINT_OFFICES,
  MAINT_OFFICIAL,
  MAINT_REPEAT_UNITS,
  MAINT_SUGGESTIONS,
  daysUntil,
  mapsUrl,
  shiftDate,
  telHref,
  unitLabel,
} from "@/lib/maintenanceCatalog";

type FilterId = "all" | (typeof MAINT_KINDS)[number]["id"];

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function todayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
}

function kindMeta(id: string) {
  return MAINT_KINDS.find((k) => k.id === id) || MAINT_KINDS[MAINT_KINDS.length - 1];
}

function emptyAsset(): Omit<MaintAsset, "id"> {
  return { name: "", kind: "golf-cart", year: "", make: "", model: "", meter: null, vendor: "", notes: "" };
}

function emptyJob(assetId: string): Omit<MaintTask, "id"> {
  return {
    assetId,
    title: "",
    notes: "",
    dueDate: "",
    dueMeter: null,
    repeatEvery: 6,
    repeatUnit: "months",
    repeatEnabled: false,
    autoRepeat: true,
    alarmEnabled: true,
    alarmTime: "08:00",
    remindDays: 7,
    done: false,
    doneDate: "",
    doneMeter: null,
    cost: "",
    doneNotes: "",
  };
}

function meterWord(kind: string) {
  return kindMeta(kind).meter || "miles / hours";
}

function jobStatus(t: MaintTask, asset: MaintAsset | undefined) {
  if (t.done) return "done" as const;
  const days = daysUntil(t.dueDate);
  const meterLeft =
    t.dueMeter != null && asset?.meter != null ? t.dueMeter - asset.meter : null;
  if ((days != null && days < 0) || (meterLeft != null && meterLeft <= 0)) return "overdue" as const;
  if ((days != null && days <= 14) || (meterLeft != null && meterLeft <= 500)) return "soon" as const;
  return "upcoming" as const;
}

function dueLine(t: MaintTask, asset: MaintAsset | undefined) {
  const bits: string[] = [];
  const days = daysUntil(t.dueDate);
  if (t.dueDate) {
    if (days == null) bits.push(t.dueDate);
    else if (days < 0) bits.push(`${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} overdue`);
    else if (days === 0) bits.push("Due today");
    else bits.push(`Due ${t.dueDate}`);
  }
  if (t.dueMeter != null) {
    const unit = meterWord(asset?.kind || "car");
    if (asset?.meter == null) bits.push(`at ${t.dueMeter} ${unit}`);
    else if (asset.meter >= t.dueMeter) bits.push(`${asset.meter - t.dueMeter} ${unit} past due`);
    else bits.push(`${t.dueMeter - asset.meter} ${unit} left`);
  }
  if (t.repeatEnabled) bits.push(`repeats every ${t.repeatEvery} ${unitLabel(t.repeatUnit, t.repeatEvery)}`);
  if (t.alarmEnabled) bits.push(`alarm ${t.alarmTime || "08:00"}${t.remindDays ? ` · ${t.remindDays}d early` : ""}`);
  return bits.join(" · ") || "No due date yet";
}

function nextFrom(t: MaintTask, asset: MaintAsset | undefined): MaintTask {
  const unit = t.repeatUnit;
  const every = t.repeatEvery || 1;
  let dueDate = t.dueDate;
  let dueMeter = t.dueMeter;
  if (unit === "miles" || unit === "hours") {
    const base = asset?.meter ?? t.dueMeter ?? 0;
    dueMeter = base + every;
    dueDate = "";
  } else {
    dueDate = shiftDate(t.dueDate || t.doneDate || todayKey(), every, unit);
  }
  return {
    ...t,
    id: uid("job"),
    done: false,
    doneDate: "",
    doneMeter: null,
    cost: "",
    doneNotes: "",
    dueDate,
    dueMeter,
  };
}

/**
 * Maintenance lanai — carts, cars, houses, HVAC, repeating jobs,
 * plus District utilities and Villages cart-shop pointers.
 */
export function MySpaceMaintenanceBoard() {
  const empty = emptyBoards().maintenance;
  const { value, save, ready, saving, error } = useMemberBoard<MaintenanceBoard>(
    "maintenance",
    empty,
    true
  );
  const [filter, setFilter] = useState<FilterId>("all");
  const [showAssetForm, setShowAssetForm] = useState(false);
  const [editAssetId, setEditAssetId] = useState<string | null>(null);
  const [assetForm, setAssetForm] = useState(emptyAsset());
  const [jobForm, setJobForm] = useState(emptyJob(""));
  const [editJobId, setEditJobId] = useState<string | null>(null);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [doneNotes, setDoneNotes] = useState("");
  const [doneCost, setDoneCost] = useState("");

  const assets = value.assets;
  const active = assets.find((a) => a.id === value.activeAssetId) || assets[0] || null;
  const shown = useMemo(
    () => (filter === "all" ? assets : assets.filter((a) => a.kind === filter)),
    [assets, filter]
  );

  const open = value.tasks.filter((t) => !t.done);
  const history = value.tasks.filter((t) => t.done);
  const overdue = open.filter((t) => jobStatus(t, assets.find((a) => a.id === t.assetId)) === "overdue").length;
  const soon = open.filter((t) => jobStatus(t, assets.find((a) => a.id === t.assetId)) === "soon").length;

  function persist(next: MaintenanceBoard) {
    void save(next);
  }

  function selectAsset(id: string) {
    persist({ ...value, activeAssetId: id });
    setShowAssetForm(false);
    setEditAssetId(null);
  }

  function saveAsset() {
    const name = assetForm.name.trim();
    if (!name) return;
    const row: MaintAsset = {
      id: editAssetId || uid("asset"),
      name: name.slice(0, 80),
      kind: assetForm.kind,
      year: assetForm.year.trim().slice(0, 8),
      make: assetForm.make.trim().slice(0, 60),
      model: assetForm.model.trim().slice(0, 60),
      meter: assetForm.meter,
      vendor: assetForm.vendor.trim().slice(0, 80),
      notes: assetForm.notes.trim().slice(0, 400),
    };
    const assetsNext = editAssetId
      ? assets.map((a) => (a.id === editAssetId ? row : a))
      : [row, ...assets].slice(0, 40);
    persist({ ...value, assets: assetsNext, activeAssetId: row.id });
    setShowAssetForm(false);
    setEditAssetId(null);
    setAssetForm(emptyAsset());
  }

  function addSuggested(s: { title: string; notes: string; repeatEvery: number; repeatUnit: string }) {
    if (!active) return;
    persist({
      ...value,
      tasks: [
        {
          ...emptyJob(active.id),
          id: uid("job"),
          title: s.title,
          notes: s.notes,
          repeatEvery: s.repeatEvery,
          repeatUnit: s.repeatUnit,
          repeatEnabled: true,
          autoRepeat: true,
        },
        ...value.tasks,
      ].slice(0, 80),
    });
  }

  function saveJob() {
    const title = jobForm.title.trim();
    if (!title) return;
    const row: MaintTask = {
      ...jobForm,
      id: editJobId || uid("job"),
      title: title.slice(0, 120),
      notes: jobForm.notes.trim().slice(0, 800),
      assetId: jobForm.assetId || active?.id || "",
      dueMeter: jobForm.dueMeter,
      repeatEvery: Math.max(1, Number(jobForm.repeatEvery) || 1),
      remindDays: Math.max(0, Math.min(90, Number(jobForm.remindDays) || 0)),
    };
    persist({
      ...value,
      tasks: editJobId
        ? value.tasks.map((t) => (t.id === editJobId ? row : t))
        : [row, ...value.tasks].slice(0, 80),
    });
    setEditJobId(null);
    setJobForm(emptyJob(active?.id || ""));
  }

  function markDone(t: MaintTask) {
    const asset = assets.find((a) => a.id === t.assetId);
    const finished: MaintTask = {
      ...t,
      done: true,
      doneDate: todayKey(),
      doneMeter: asset?.meter ?? t.doneMeter,
      doneNotes: doneNotes.trim().slice(0, 400),
      cost: doneCost.trim().slice(0, 20),
    };
    let tasks = value.tasks.map((x) => (x.id === t.id ? finished : x));
    if (t.autoRepeat && t.repeatEnabled) {
      tasks = [nextFrom(t, asset), ...tasks].slice(0, 80);
    }
    persist({ ...value, tasks });
    setDoneId(null);
    setDoneNotes("");
    setDoneCost("");
  }

  if (!ready) return <p className="panel-hint">Loading maintenance…</p>;

  const suggestions = active
    ? MAINT_SUGGESTIONS[active.kind] || MAINT_SUGGESTIONS.other
    : [];

  return (
    <div className="ms-ent-board">
      <p className="ms-module-lead">
        Track the golf cart, the car, the house, and anything else — by date, miles, or both.
        Repeating jobs drop onto Upcoming automatically.
      </p>
      <p className="panel-hint">
        Neighbor shops stay free on{" "}
        <Link href="/local-pros" className="text-link">
          Local Pros
        </Link>
        {" · "}
        <a href="https://www.districtgov.org/services/utilities/" className="text-link" target="_blank" rel="noopener noreferrer">
          District utilities
        </a>
        {" · "}
        irrigation, trash, and cart barns below.
      </p>
      {error ? <p className="pf-form-error">{error}</p> : null}
      {saving ? <p className="panel-hint">Saving to your account…</p> : null}

      <div className="ms-h-toolbar">
        <span className="ms-h-pill">
          {overdue} overdue · {soon} due soon · {open.length} open
        </span>
        <span className="panel-hint">Cart · Car · House · HVAC</span>
      </div>

      <div className="ms-h-quick">
        <button
          type="button"
          className={`ms-h-range-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        {MAINT_KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            className={`ms-h-range-btn ${filter === k.id ? "active" : ""}`}
            onClick={() => setFilter(k.id)}
          >
            {k.emoji} {k.label}
          </button>
        ))}
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={() => {
            setEditAssetId(null);
            setAssetForm(emptyAsset());
            setShowAssetForm(true);
          }}
        >
          Add item
        </button>
      </div>

      {assets.length === 0 && !showAssetForm ? (
        <p className="panel-hint">
          Nothing to track yet. Add a golf cart, car, house, A/C, or anything else. Then schedule oil,
          batteries, filters, and the jobs you always forget.
        </p>
      ) : (
        <div className="ms-food-guide">
          {shown.map((a) => {
            const k = kindMeta(a.kind);
            const openN = open.filter((t) => t.assetId === a.id).length;
            const od = open.filter(
              (t) => t.assetId === a.id && jobStatus(t, a) === "overdue"
            ).length;
            return (
              <button
                key={a.id}
                type="button"
                className={`ms-food-card ms-maint-card ${active?.id === a.id ? "is-on" : ""}`}
                onClick={() => selectAsset(a.id)}
              >
                <span className="panel-hint">{k.label.toUpperCase()}</span>
                <h4>
                  {k.emoji} {a.name}
                </h4>
                <p className="panel-hint">
                  {od ? `${od} overdue` : `${openN} open`}
                  {a.meter != null ? ` · ${a.meter} ${k.meter || "units"}` : ""}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {showAssetForm ? (
        <form
          className="form-grid ms-module-form about-panel ms-module"
          onSubmit={(e) => {
            e.preventDefault();
            saveAsset();
          }}
        >
          <div className="field">
            <label>{editAssetId ? "Edit this item" : "What are you tracking?"}</label>
            <input
              value={assetForm.name}
              onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
              placeholder="Yamaha cart, the Civic, 3388 Red Oak…"
              required
            />
          </div>
          <div className="field">
            <label>Type</label>
            <select
              value={assetForm.kind}
              onChange={(e) => setAssetForm({ ...assetForm, kind: e.target.value })}
            >
              {MAINT_KINDS.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.emoji} {k.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Year (optional)</label>
            <input
              value={assetForm.year}
              onChange={(e) => setAssetForm({ ...assetForm, year: e.target.value })}
              placeholder="2018"
            />
          </div>
          <div className="field">
            <label>Make (optional)</label>
            <input
              value={assetForm.make}
              onChange={(e) => setAssetForm({ ...assetForm, make: e.target.value })}
              placeholder="Yamaha, Toyota…"
            />
          </div>
          <div className="field">
            <label>Model (optional)</label>
            <input
              value={assetForm.model}
              onChange={(e) => setAssetForm({ ...assetForm, model: e.target.value })}
              placeholder="Drive2, Camry…"
            />
          </div>
          <div className="field">
            <label>Current miles / hours (optional)</label>
            <input
              type="number"
              min={0}
              value={assetForm.meter ?? ""}
              onChange={(e) =>
                setAssetForm({
                  ...assetForm,
                  meter: e.target.value === "" ? null : Number(e.target.value),
                })
              }
              placeholder="12450"
            />
          </div>
          <div className="field">
            <label>Shop (optional)</label>
            <input
              value={assetForm.vendor}
              onChange={(e) => setAssetForm({ ...assetForm, vendor: e.target.value })}
              placeholder="Cart barn, dealer, HVAC guy…"
            />
          </div>
          <div className="field">
            <label>Notes</label>
            <input
              value={assetForm.notes}
              onChange={(e) => setAssetForm({ ...assetForm, notes: e.target.value })}
              placeholder="VIN, battery type, filter size…"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
            {editAssetId ? "Save changes" : "Save item"}
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setShowAssetForm(false);
              setEditAssetId(null);
            }}
          >
            Cancel
          </button>
        </form>
      ) : null}

      {active && !showAssetForm ? (
        <div className="about-panel ms-module">
          <h4>
            {kindMeta(active.kind).emoji} {active.name}
          </h4>
          <p className="panel-hint">
            {[active.year, active.make, active.model, kindMeta(active.kind).label]
              .filter(Boolean)
              .join(" · ")}
            {active.vendor ? ` · Shop: ${active.vendor}` : ""}
          </p>
          {active.notes ? <p>{active.notes}</p> : null}
          {kindMeta(active.kind).meter ? (
            <form
              className="form-grid ms-module-form"
              onSubmit={(e) => {
                e.preventDefault();
                persist({
                  ...value,
                  assets: assets.map((a) => (a.id === active.id ? { ...a, meter: active.meter } : a)),
                });
              }}
            >
              <div className="field">
                <label>Current {kindMeta(active.kind).meter}</label>
                <input
                  type="number"
                  min={0}
                  value={active.meter ?? ""}
                  onChange={(e) =>
                    persist({
                      ...value,
                      assets: assets.map((a) =>
                        a.id === active.id
                          ? { ...a, meter: e.target.value === "" ? null : Number(e.target.value) }
                          : a
                      ),
                    })
                  }
                />
              </div>
              <button type="submit" className="btn btn-ghost btn-sm">
                Update {kindMeta(active.kind).meter}
              </button>
            </form>
          ) : null}
          <p className="panel-hint">Common jobs for a {kindMeta(active.kind).label}:</p>
          <div className="ms-h-quick">
            {suggestions.map((s) => (
              <button
                key={s.title}
                type="button"
                className="ms-h-range-btn"
                onClick={() => addSuggested(s)}
              >
                {s.title}
              </button>
            ))}
          </div>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setEditAssetId(active.id);
                setAssetForm({
                  name: active.name,
                  kind: active.kind,
                  year: active.year,
                  make: active.make,
                  model: active.model,
                  meter: active.meter,
                  vendor: active.vendor,
                  notes: active.notes,
                });
                setShowAssetForm(true);
              }}
            >
              Edit this item
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                if (!window.confirm("Remove this item and its jobs?")) return;
                const nextAssets = assets.filter((a) => a.id !== active.id);
                persist({
                  ...value,
                  assets: nextAssets,
                  tasks: value.tasks.filter((t) => t.assetId !== active.id),
                  activeAssetId: nextAssets[0]?.id || "",
                });
              }}
            >
              Remove this item
            </button>
          </div>
        </div>
      ) : null}

      <div className="about-panel ms-module">
        <h4>Upcoming</h4>
        {open.length === 0 ? (
          <p className="panel-hint">No upcoming jobs. Add one below, or tap a common job on the item card.</p>
        ) : (
          <div className="ms-food-guide">
            {open.map((t) => {
              const asset = assets.find((a) => a.id === t.assetId);
              const status = jobStatus(t, asset);
              return (
                <article key={t.id} className="ms-food-card">
                  <span className="panel-hint">
                    {kindMeta(asset?.kind || "other").emoji} {asset?.name || "Item"} ·{" "}
                    {status === "overdue" ? "OVERDUE" : status === "soon" ? "DUE SOON" : "UPCOMING"}
                  </span>
                  <h4>{t.title}</h4>
                  <p className="panel-hint">{dueLine(t, asset)}</p>
                  {t.notes ? <p>{t.notes}</p> : null}
                  {doneId === t.id ? (
                    <form
                      className="form-grid ms-module-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        markDone(t);
                      }}
                    >
                      <div className="field">
                        <label>Notes for the log</label>
                        <input
                          value={doneNotes}
                          onChange={(e) => setDoneNotes(e.target.value)}
                          placeholder="Shop, parts, what you found"
                        />
                      </div>
                      <div className="field">
                        <label>Cost (optional)</label>
                        <input
                          value={doneCost}
                          onChange={(e) => setDoneCost(e.target.value)}
                          placeholder="87.50"
                        />
                      </div>
                      <button type="submit" className="btn btn-primary btn-sm">
                        Save to history
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDoneId(null)}>
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div className="hero-actions">
                      <button type="button" className="btn btn-primary btn-sm" onClick={() => setDoneId(t.id)}>
                        Mark done
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() =>
                          persist({
                            ...value,
                            tasks: [nextFrom(t, asset), ...value.tasks].slice(0, 80),
                          })
                        }
                      >
                        Add next
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setEditJobId(t.id);
                          setJobForm({ ...t });
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() =>
                          persist({ ...value, tasks: value.tasks.filter((x) => x.id !== t.id) })
                        }
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {assets.length ? (
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              saveJob();
            }}
          >
            <div className="field">
              <label>{editJobId ? "Edit job" : "Add a job"}</label>
              <input
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                placeholder="Oil change, battery water, A/C filter…"
                required
              />
            </div>
            <div className="field">
              <label>For</label>
              <select
                value={jobForm.assetId || active?.id || ""}
                onChange={(e) => setJobForm({ ...jobForm, assetId: e.target.value })}
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {kindMeta(a.kind).emoji} {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Due date</label>
              <input
                type="date"
                value={jobForm.dueDate}
                onChange={(e) => setJobForm({ ...jobForm, dueDate: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Due {meterWord(assets.find((a) => a.id === (jobForm.assetId || active?.id))?.kind || "car")} (optional)</label>
              <input
                type="number"
                min={0}
                value={jobForm.dueMeter ?? ""}
                onChange={(e) =>
                  setJobForm({
                    ...jobForm,
                    dueMeter: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
                placeholder="Optional"
              />
            </div>
            <div className="field">
              <label>What needs to be done</label>
              <input
                value={jobForm.notes}
                onChange={(e) => setJobForm({ ...jobForm, notes: e.target.value })}
                placeholder="Parts, shop, “don’t forget the cabin filter”…"
              />
            </div>
            <label className={jobForm.alarmEnabled ? "on" : ""}>
              <input
                type="checkbox"
                checked={jobForm.alarmEnabled}
                onChange={(e) => setJobForm({ ...jobForm, alarmEnabled: e.target.checked })}
              />
              Alarm on due date
            </label>
            <div className="field">
              <label>Alarm time</label>
              <input
                type="time"
                value={jobForm.alarmTime}
                onChange={(e) => setJobForm({ ...jobForm, alarmTime: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Remind days early</label>
              <input
                type="number"
                min={0}
                max={90}
                value={jobForm.remindDays}
                onChange={(e) => setJobForm({ ...jobForm, remindDays: Number(e.target.value) || 0 })}
              />
            </div>
            <label className={jobForm.repeatEnabled ? "on" : ""}>
              <input
                type="checkbox"
                checked={jobForm.repeatEnabled}
                onChange={(e) => setJobForm({ ...jobForm, repeatEnabled: e.target.checked })}
              />
              Repeat this job
            </label>
            <div className="field">
              <label>Every</label>
              <input
                type="number"
                min={1}
                value={jobForm.repeatEvery}
                onChange={(e) => setJobForm({ ...jobForm, repeatEvery: Number(e.target.value) || 1 })}
              />
            </div>
            <div className="field">
              <label>Interval</label>
              <select
                value={jobForm.repeatUnit}
                onChange={(e) => setJobForm({ ...jobForm, repeatUnit: e.target.value })}
              >
                {MAINT_REPEAT_UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
            <label className={jobForm.autoRepeat ? "on" : ""}>
              <input
                type="checkbox"
                checked={jobForm.autoRepeat}
                onChange={(e) => setJobForm({ ...jobForm, autoRepeat: e.target.checked })}
              />
              When I mark it done, add the next one to Upcoming
            </label>
            <button type="submit" className="btn btn-primary btn-sm">
              {editJobId ? "Save job" : "Add to upcoming"}
            </button>
            {editJobId ? (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setEditJobId(null);
                  setJobForm(emptyJob(active?.id || ""));
                }}
              >
                Cancel
              </button>
            ) : null}
          </form>
        ) : null}

        <h4>History</h4>
        {history.length === 0 ? (
          <p className="panel-hint">Finished jobs land here — date, miles, cost, and notes.</p>
        ) : (
          <ul className="ms-cal-list">
            {history.slice(0, 20).map((t) => {
              const asset = assets.find((a) => a.id === t.assetId);
              return (
                <li key={t.id}>
                  <div>
                    <strong className="ms-note-done">{t.title}</strong>
                    <span>
                      {asset?.name || ""}
                      {t.doneDate ? ` · ${t.doneDate}` : ""}
                      {t.doneMeter != null ? ` · ${t.doneMeter} ${meterWord(asset?.kind || "car")}` : ""}
                      {t.cost ? ` · $${t.cost}` : ""}
                      {t.doneNotes ? ` · ${t.doneNotes}` : ""}
                    </span>
                  </div>
                  <div className="hero-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        persist({
                          ...value,
                          tasks: [nextFrom(t, asset), ...value.tasks].slice(0, 80),
                        })
                      }
                    >
                      Add next
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() =>
                        persist({ ...value, tasks: value.tasks.filter((x) => x.id !== t.id) })
                      }
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="about-panel ms-module">
        <h4>Villages utilities &amp; home</h4>
        <p className="panel-hint">
          Combined amenity / water / irrigation / trash bill. Customer service Mon–Fri 8am–5pm.
          Standard irrigation is suspended Apr 3–Oct 1, 2026 under the Phase III water-shortage order
          — confirm current watering rules on DistrictGov before you run the clocks.
        </p>
        <div className="hero-actions">
          {MAINT_OFFICIAL.map((l) => (
            <a key={l.href} className="btn btn-ghost btn-sm" href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
          <Link href="/local-pros" className="btn btn-primary btn-sm">
            Hub Local Pros
          </Link>
        </div>
        <ul className="ms-cal-list">
          {MAINT_OFFICES.map((o) => (
            <li key={o.name}>
              <div>
                <strong>{o.name}</strong>
                <span>
                  {o.hours} · {o.address}
                  {o.phone ? ` · ${o.phone}` : ""}
                  {o.note ? ` · ${o.note}` : ""}
                </span>
              </div>
              {o.phone ? (
                <a className="btn btn-ghost btn-sm" href={telHref(o.phone)}>
                  Call
                </a>
              ) : null}
            </li>
          ))}
        </ul>
        <h4>Golf cart shops</h4>
        <p className="panel-hint">
          Public dealer listings near The Villages — confirm hours before you roll over. Neighbor
          recommendations live on Local Pros.
        </p>
        <div className="ms-food-guide">
          {CART_SHOPS.map((s) => (
            <article key={s.name} className="ms-food-card">
              <span className="panel-hint">{s.kind.toUpperCase()}</span>
              <h4>{s.name}</h4>
              <p className="panel-hint">{s.address}</p>
              <p>
                <a className="text-link" href={telHref(s.phone)}>
                  {s.phone}
                </a>
              </p>
              <p>{s.note}</p>
              <div className="hero-actions">
                <a className="btn btn-ghost btn-sm" href={mapsUrl(s.address)} target="_blank" rel="noopener noreferrer">
                  Map
                </a>
                <a className="btn btn-ghost btn-sm" href={s.page} target="_blank" rel="noopener noreferrer">
                  Website
                </a>
                <a className="btn btn-primary btn-sm" href={telHref(s.phone)}>
                  Call
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
