"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  MAINT_KINDS,
  emptyBoards,
  type MaintAsset,
  type MaintTask,
  type MaintenanceBoard,
} from "@/lib/memberBoardModel";
import { useMemberBoard } from "@/components/useMemberBoard";
import {
  CAL_DAYS,
  CAL_HOURS,
  datesInRange,
  formatTime,
  hourOf,
  shiftAnchor,
  shortDate,
  viewRange,
  viewTitle,
  weekdayOf,
  type CalView,
} from "@/lib/calendarCatalog";
import {
  CART_SHOPS,
  MAINT_OFFICES,
  MAINT_OFFICIAL,
  MAINT_REPEAT_UNITS,
  MAINT_SUGGESTIONS,
  daysUntil,
  maintKindForm,
  mapsUrl,
  shiftDate,
  telHref,
  unitLabel,
  type MaintField,
  type MaintSuggest,
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

function MaintFieldInput({
  field,
  assetForm,
  onChange,
}: {
  field: MaintField;
  assetForm: Omit<MaintAsset, "id">;
  onChange: (next: Omit<MaintAsset, "id">) => void;
}) {
  if (field.id === "meter") {
    return (
      <div className="field">
        <label>{field.label}</label>
        <input
          type="number"
          min={0}
          value={assetForm.meter ?? ""}
          placeholder={field.placeholder}
          onChange={(e) =>
            onChange({
              ...assetForm,
              meter: e.target.value === "" ? null : Number(e.target.value),
            })
          }
        />
      </div>
    );
  }
  const value = assetForm[field.id];
  return (
    <div className="field">
      <label>{field.label}</label>
      <input
        value={value}
        placeholder={field.placeholder}
        onChange={(e) => onChange({ ...assetForm, [field.id]: e.target.value })}
      />
    </div>
  );
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

function firstDue(job: { repeatEvery: number; repeatUnit: string }, meter: number | null) {
  if (job.repeatUnit === "miles" || job.repeatUnit === "hours") {
    return {
      dueDate: "",
      dueMeter: meter != null ? meter + Math.max(1, job.repeatEvery) : null,
    };
  }
  return {
    dueDate: shiftDate(todayKey(), job.repeatEvery, job.repeatUnit),
    dueMeter: null,
  };
}

function scheduleLine(job: { repeatEvery: number; repeatUnit: string }) {
  return `Every ${job.repeatEvery} ${unitLabel(job.repeatUnit, job.repeatEvery)}`;
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
  const [pickedJobs, setPickedJobs] = useState<string[]>([]);
  const [extraJobs, setExtraJobs] = useState<MaintSuggest[]>([]);
  const [extraTitle, setExtraTitle] = useState("");
  const [extraEvery, setExtraEvery] = useState(6);
  const [extraUnit, setExtraUnit] = useState("months");
  const [planView, setPlanView] = useState<CalView>("week");
  const [planAnchor, setPlanAnchor] = useState(todayKey);
  const [planTaskId, setPlanTaskId] = useState<string | null>(null);
  const addFormRef = useRef<HTMLFormElement>(null);

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

  function resetJobPicks() {
    setPickedJobs([]);
    setExtraJobs([]);
    setExtraTitle("");
    setExtraEvery(6);
    setExtraUnit("months");
  }

  function openAddForm() {
    setEditAssetId(null);
    setAssetForm(emptyAsset());
    resetJobPicks();
    setShowAssetForm(true);
  }

  useEffect(() => {
    if (!showAssetForm) return;
    addFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [showAssetForm]);

  useEffect(() => {
    if (!planTaskId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlanTaskId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [planTaskId]);

  function changeKind(kind: string) {
    const ids = new Set(maintKindForm(kind).fields.map((f) => f.id));
    setAssetForm((prev) => ({
      ...prev,
      kind,
      year: ids.has("year") ? prev.year : "",
      make: ids.has("make") ? prev.make : "",
      model: ids.has("model") ? prev.model : "",
      meter: ids.has("meter") ? prev.meter : null,
      vendor: ids.has("vendor") ? prev.vendor : "",
    }));
    setPickedJobs([]);
  }

  function addExtraJob() {
    const title = extraTitle.trim().slice(0, 120);
    if (!title) return;
    setExtraJobs((prev) => [
      ...prev,
      {
        title,
        notes: "",
        repeatEvery: Math.max(1, Number(extraEvery) || 1),
        repeatUnit: extraUnit || "months",
      },
    ]);
    setExtraTitle("");
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
    const suggestions = (MAINT_SUGGESTIONS[row.kind] || MAINT_SUGGESTIONS.other).filter((s) =>
      pickedJobs.includes(s.title)
    );
    const typed = extraTitle.trim();
    const chosen: MaintSuggest[] = [
      ...suggestions,
      ...extraJobs,
      ...(typed
        ? [
            {
              title: typed.slice(0, 120),
              notes: "",
              repeatEvery: Math.max(1, Number(extraEvery) || 1),
              repeatUnit: extraUnit || "months",
            },
          ]
        : []),
    ];
    const already = new Set(
      value.tasks
        .filter((t) => t.assetId === row.id)
        .map((t) => t.title.trim().toLowerCase())
    );
    const added: MaintTask[] = [];
    for (const job of chosen) {
      const title = job.title.trim().slice(0, 120);
      if (!title || already.has(title.toLowerCase())) continue;
      already.add(title.toLowerCase());
      const due = firstDue(job, row.meter);
      added.push({
        ...emptyJob(row.id),
        id: uid("job"),
        title,
        notes: job.notes.slice(0, 800),
        repeatEvery: Math.max(1, job.repeatEvery || 1),
        repeatUnit: job.repeatUnit || "months",
        repeatEnabled: true,
        autoRepeat: true,
        ...due,
      });
    }
    const assetsNext = editAssetId
      ? assets.map((a) => (a.id === editAssetId ? row : a))
      : [row, ...assets].slice(0, 40);
    persist({
      ...value,
      assets: assetsNext,
      activeAssetId: row.id,
      tasks: [...added, ...value.tasks].slice(0, 80),
    });
    setShowAssetForm(false);
    setEditAssetId(null);
    setAssetForm(emptyAsset());
    resetJobPicks();
  }

  function addSuggested(s: { title: string; notes: string; repeatEvery: number; repeatUnit: string }) {
    if (!active) return;
    const exists = value.tasks.some(
      (t) =>
        t.assetId === active.id &&
        !t.done &&
        t.title.trim().toLowerCase() === s.title.trim().toLowerCase()
    );
    if (exists) return;
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

  function openPlanSlot(iso: string, time: string) {
    setEditJobId(null);
    setPlanTaskId(null);
    setJobForm({
      ...emptyJob(active?.id || assets[0]?.id || ""),
      dueDate: iso,
      alarmTime: time || "08:00",
      alarmEnabled: true,
    });
    document.getElementById("ms-maint-job")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
  const kindProfile = maintKindForm(assetForm.kind);
  const kindSuggestions = MAINT_SUGGESTIONS[assetForm.kind] || MAINT_SUGGESTIONS.other;
  const today = todayKey();
  const planRange = viewRange(planAnchor, planView);
  const planDays = datesInRange(planRange.start, planRange.end);
  const planTasks = open.filter((t) => {
    if (filter === "all") return true;
    const asset = assets.find((a) => a.id === t.assetId);
    return asset?.kind === filter;
  });
  const datedTasks = planTasks.filter((t) => /^\d{4}-\d{2}-\d{2}$/.test(t.dueDate));
  const undatedTasks = planTasks.filter((t) => !/^\d{4}-\d{2}-\d{2}$/.test(t.dueDate));
  const nextDated = [...datedTasks]
    .filter((t) => t.dueDate >= today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  const visibleCount = datedTasks.filter(
    (t) => t.dueDate >= planRange.start && t.dueDate <= planRange.end
  ).length;
  const hourNow = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      hour: "numeric",
      hourCycle: "h23",
    }).format(new Date())
  );
  const planTask = planTaskId ? value.tasks.find((t) => t.id === planTaskId) || null : null;
  const trackedTitles = new Set(
    editAssetId
      ? value.tasks
          .filter((t) => t.assetId === editAssetId)
          .map((t) => t.title.trim().toLowerCase())
      : []
  );

  return (
    <div className="ms-ent-board">
      <p className="ms-module-lead">
        Track the golf cart, the car, the house, and anything else — by date, miles, or both.
        Jobs sit on a maintenance planner here, and the due day also shows on your personal planner.
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
          onClick={openAddForm}
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
          id="ms-maint-add"
          ref={addFormRef}
          className="form-grid ms-module-form about-panel ms-module"
          onSubmit={(e) => {
            e.preventDefault();
            saveAsset();
          }}
        >
          <div className="field">
            <label>Type</label>
            <select value={assetForm.kind} onChange={(e) => changeKind(e.target.value)}>
              {MAINT_KINDS.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.emoji} {k.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>{editAssetId ? "Name" : kindProfile.nameLabel}</label>
            <input
              value={assetForm.name}
              onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
              placeholder={kindProfile.namePlaceholder}
              required
            />
          </div>
          <p className="panel-hint" style={{ margin: 0 }}>
            {kindProfile.blurb}
          </p>
          {kindProfile.fields.map((field) => (
            <MaintFieldInput
              key={field.id}
              field={field}
              assetForm={assetForm}
              onChange={setAssetForm}
            />
          ))}
          <div className="ms-maint-jobs">
            <div className="ms-maint-jobs-bar">
              <p className="ms-maint-jobs-title">
                Jobs to track on this {kindMeta(assetForm.kind).label.toLowerCase()}
              </p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    setPickedJobs(
                      kindSuggestions.filter((s) => !trackedTitles.has(s.title.toLowerCase())).map((s) => s.title)
                    )
                  }
                >
                  Check all
                </button>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPickedJobs([])}>
                  Clear
                </button>
              </div>
            </div>
            <div className="ms-maint-picks">
              {kindSuggestions.map((s) => {
                const tracked = trackedTitles.has(s.title.toLowerCase());
                const on = tracked || pickedJobs.includes(s.title);
                return (
                  <label key={s.title} className={`ms-maint-pick${on ? " is-on" : ""}`}>
                    <input
                      type="checkbox"
                      checked={on}
                      disabled={tracked}
                      onChange={(e) =>
                        setPickedJobs((prev) =>
                          e.target.checked
                            ? [...prev, s.title]
                            : prev.filter((title) => title !== s.title)
                        )
                      }
                    />
                    <span>
                      <strong>{s.title}</strong>
                      <span>
                        {scheduleLine(s)}
                        {tracked ? " · Already on this item" : ""}
                        {s.notes ? ` · ${s.notes}` : ""}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
            {extraJobs.length ? (
              <ul className="ms-maint-extra-list">
                {extraJobs.map((job, index) => (
                  <li key={`${job.title}-${index}`}>
                    <span>
                      <strong>{job.title}</strong>
                      <span>{scheduleLine(job)}</span>
                    </span>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setExtraJobs((prev) => prev.filter((_, i) => i !== index))}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="ms-maint-extra">
              <div className="field">
                <label>Add something else</label>
                <input
                  value={extraTitle}
                  onChange={(e) => setExtraTitle(e.target.value)}
                  placeholder="Termite bond, garage door, boat bottom paint…"
                />
              </div>
              <div className="field">
                <label>Every</label>
                <input
                  type="number"
                  min={1}
                  value={extraEvery}
                  onChange={(e) => setExtraEvery(Number(e.target.value) || 1)}
                />
              </div>
              <div className="field">
                <label>Interval</label>
                <select value={extraUnit} onChange={(e) => setExtraUnit(e.target.value)}>
                  {MAINT_REPEAT_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <button type="button" className="btn btn-ghost btn-sm" onClick={addExtraJob}>
                Add this job
              </button>
            </div>
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
              resetJobPicks();
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
            {suggestions.map((s) => {
              const onList = value.tasks.some(
                (t) =>
                  t.assetId === active.id &&
                  !t.done &&
                  t.title.trim().toLowerCase() === s.title.trim().toLowerCase()
              );
              return (
                <button
                  key={s.title}
                  type="button"
                  className="ms-h-range-btn"
                  disabled={onList}
                  onClick={() => addSuggested(s)}
                >
                  {onList ? `${s.title} · on your list` : s.title}
                </button>
              );
            })}
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
                resetJobPicks();
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
        <h4>Maintenance planner</h4>
        <p className="panel-hint">
          Only maintenance jobs. Click a chip to mark it done or edit it. Click an empty spot to add a job on that day.
          The same due day also shows in the all-day row of your personal planner.
        </p>
        <div className="ms-h-quick">
          {(
            [
              ["day", "Day"],
              ["three", "3 day"],
              ["week", "Week"],
              ["month", "Month"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`ms-h-range-btn ${planView === id ? "active" : ""}`}
              onClick={() => setPlanView(id)}
            >
              {label}
            </button>
          ))}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPlanAnchor(shiftAnchor(planAnchor, planView, -1))}>
            ‹
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPlanAnchor(today)}>
            Today
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPlanAnchor(shiftAnchor(planAnchor, planView, 1))}>
            ›
          </button>
          <strong>{viewTitle(planAnchor, planView)}</strong>
        </div>
        {visibleCount === 0 && nextDated ? (
          <p className="panel-hint">
            Nothing due in this {planView}. Next up is {nextDated.title} on {shortDate(nextDated.dueDate)}.{" "}
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setPlanAnchor(nextDated.dueDate);
                setPlanView("week");
              }}
            >
              Show that week
            </button>
          </p>
        ) : null}
        {planView === "month" ? (
          <div className="ms-cal-month">
            {CAL_DAYS.map((d) => (
              <div key={d} className="ms-cal-dow">
                {d}
              </div>
            ))}
            {planDays.map((iso) => {
              const inMonth = iso.slice(0, 7) === planAnchor.slice(0, 7);
              const evs = datedTasks.filter((t) => t.dueDate === iso);
              return (
                <button
                  key={iso}
                  type="button"
                  className={`ms-cal-mcell ${inMonth ? "" : "out"} ${iso === today ? "is-today" : ""}`}
                  onClick={() => {
                    setPlanAnchor(iso);
                    setPlanView("day");
                  }}
                >
                  <em>{Number(iso.slice(8, 10))}</em>
                  {evs.slice(0, 3).map((t) => (
                    <span key={t.id} className={`ms-cal-chip kind-maint${jobStatus(t, assets.find((a) => a.id === t.assetId)) === "overdue" ? " is-overdue" : ""}`}>
                      {t.title}
                    </span>
                  ))}
                  {evs.length > 3 ? <span className="panel-hint">+{evs.length - 3}</span> : null}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="ms-cal-week" style={{ gridTemplateColumns: `3rem repeat(${planDays.length}, minmax(0, 1fr))` }}>
            <div className="ms-cal-gutter" />
            {planDays.map((iso) => (
              <button
                key={iso}
                type="button"
                className={`ms-cal-head ${iso === today ? "is-today" : ""}`}
                onClick={() => {
                  setPlanAnchor(iso);
                  setPlanView("day");
                }}
              >
                {CAL_DAYS[weekdayOf(iso)]} {Number(iso.slice(8, 10))}
              </button>
            ))}
            <div className="ms-cal-gutter">all</div>
            {planDays.map((iso) => {
              const allDay = datedTasks.filter((t) => {
                if (t.dueDate !== iso) return false;
                const at = hourOf(t.alarmTime || "");
                return at == null || !CAL_HOURS.includes(at);
              });
              return (
                <div
                  key={`ad-${iso}`}
                  className="ms-cal-slot ms-cal-allday"
                  onClick={() => openPlanSlot(iso, "")}
                >
                  {allDay.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`ms-cal-chip kind-maint${jobStatus(t, assets.find((a) => a.id === t.assetId)) === "overdue" ? " is-overdue" : ""}`}
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setPlanTaskId(t.id);
                      }}
                    >
                      {t.title}
                    </button>
                  ))}
                </div>
              );
            })}
            {CAL_HOURS.map((h) => (
              <div key={`row-${h}`} style={{ display: "contents" }}>
                <div className="ms-cal-gutter">
                  {h > 12 ? h - 12 : h}
                  {h >= 12 ? "p" : "a"}
                </div>
                {planDays.map((iso) => {
                  const timed = datedTasks.filter((t) => t.dueDate === iso && hourOf(t.alarmTime || "") === h);
                  return (
                    <div
                      key={`${iso}-${h}`}
                      className={`ms-cal-slot${iso === today && h === hourNow ? " is-now" : ""}`}
                      onClick={() => openPlanSlot(iso, `${String(h).padStart(2, "0")}:00`)}
                    >
                      {timed.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          className={`ms-cal-chip kind-maint${jobStatus(t, assets.find((a) => a.id === t.assetId)) === "overdue" ? " is-overdue" : ""}`}
                          onClick={(ev) => {
                            ev.stopPropagation();
                            setPlanTaskId(t.id);
                          }}
                        >
                          {formatTime(t.alarmTime)} · {t.title}
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
        {undatedTasks.length ? (
          <>
            <h4>No date yet</h4>
            <p className="panel-hint">These follow miles or hours, so they stay off the grid until you give them a day.</p>
            <ul className="ms-cal-list">
              {undatedTasks.map((t) => {
                const asset = assets.find((a) => a.id === t.assetId);
                return (
                  <li key={t.id}>
                    <div>
                      <strong>{t.title}</strong>
                      <span>{dueLine(t, asset)}</span>
                    </div>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setPlanTaskId(t.id)}>
                      Open
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}

        {assets.length ? (
          <form
            id="ms-maint-job"
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
      {planTask && typeof document !== "undefined"
        ? createPortal(
            <div className="ms-cal-pop-scrim" onClick={() => setPlanTaskId(null)}>
              <div
                className="ms-cal-pop"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ms-maint-pop-title"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="ms-cal-pop-bar">
                  <p className="panel-hint">
                    {kindMeta(assets.find((a) => a.id === planTask.assetId)?.kind || "other").emoji}{" "}
                    {assets.find((a) => a.id === planTask.assetId)?.name || "Item"}
                  </p>
                  <button type="button" className="ms-cal-pop-close" onClick={() => setPlanTaskId(null)}>
                    Close
                  </button>
                </div>
                <h3 id="ms-maint-pop-title">{planTask.title}</h3>
                <p>{dueLine(planTask, assets.find((a) => a.id === planTask.assetId))}</p>
                {planTask.notes ? <p>{planTask.notes}</p> : null}
                {doneId === planTask.id ? (
                  <form
                    className="form-grid ms-module-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      markDone(planTask);
                      setPlanTaskId(null);
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
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setDoneNotes("");
                        setDoneCost("");
                        setDoneId(planTask.id);
                      }}
                    >
                      Mark done
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        const asset = assets.find((a) => a.id === planTask.assetId);
                        persist({
                          ...value,
                          tasks: [nextFrom(planTask, asset), ...value.tasks].slice(0, 80),
                        });
                        setPlanTaskId(null);
                      }}
                    >
                      Add next
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        setEditJobId(planTask.id);
                        setJobForm({ ...planTask });
                        setPlanTaskId(null);
                        document.getElementById("ms-maint-job")?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => {
                        persist({ ...value, tasks: value.tasks.filter((x) => x.id !== planTask.id) });
                        setPlanTaskId(null);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
