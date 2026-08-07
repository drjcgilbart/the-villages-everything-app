"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { CalendarEvent } from "@/lib/calendarEventsTypes";

type Feed = {
  year: number;
  month: number;
  todayKey: string;
  events: CalendarEvent[];
  upcoming: CalendarEvent[];
  past: CalendarEvent[];
  byDate: Record<string, number>;
  updatedAt: string | null;
  lastError?: string | null;
  eventCount: number;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthLabel(year: number, month: number) {
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatDayHeading(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

function buildGrid(year: number, month: number) {
  const first = new Date(year, month - 1, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: ({ day: number; key: string } | null)[] = [];
  for (let i = 0; i < startPad; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push({ day: d, key });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function EventCard({
  e,
  isPast,
}: {
  e: CalendarEvent;
  isPast?: boolean;
}) {
  return (
    <article className={`cal-event-card${isPast ? " is-past" : ""}`}>
      <div className="cal-event-card-top">
        <span className="pill cal-pill-cat">{e.category}</span>
        {e.timeLabel ? (
          <span className="cal-event-time">{e.timeLabel}</span>
        ) : null}
      </div>
      <h4>{e.title}</h4>
      {e.venue ? <p className="cal-event-venue">{e.venue}</p> : null}
      {e.description ? (
        <p className="cal-event-desc">{e.description}</p>
      ) : null}
      <div className="cal-event-foot">
        <span className="cal-event-source">{e.sourceLabel}</span>
        {e.url ? (
          <a href={e.url} target="_blank" rel="noopener noreferrer">
            Details →
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function EventsCalendar() {
  const now = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 };
  }, []);
  const [year, setYear] = useState(now.year);
  const [month, setMonth] = useState(now.month);
  const [feed, setFeed] = useState<Feed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (y: number, m: number) => {
    try {
      const res = await fetch(
        `/api/calendar/events?year=${y}&month=${m}`,
        { cache: "no-store" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not load");
      setFeed(data);
      setError(null);
      // Prefer today if in month, else first day with events, else 1st
      const todayKey = data.todayKey as string;
      if (todayKey.startsWith(`${y}-${String(m).padStart(2, "0")}`)) {
        setSelected(todayKey);
      } else if (data.events?.length) {
        setSelected(data.events[0].date);
      } else {
        setSelected(`${y}-${String(m).padStart(2, "0")}-01`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load");
    }
  }, []);

  useEffect(() => {
    load(year, month);
  }, [year, month, load]);

  async function forceRefresh() {
    setRefreshing(true);
    try {
      await fetch("/api/calendar/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: false }),
      });
      await load(year, month);
    } finally {
      setRefreshing(false);
    }
  }

  function shiftMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setYear(y);
    setMonth(m);
    setFeed(null);
  }

  if (error && !feed) {
    return <div className="empty-state">{error}</div>;
  }
  if (!feed) {
    return (
      <div className="empty-state">
        Loading local events… (first load may take a few seconds while we pull
        public listings)
      </div>
    );
  }

  const cells = buildGrid(year, month);
  const dayEvents = (feed.events || []).filter((e) => e.date === selected);
  const upcoming = feed.upcoming || [];
  const past = (feed.past || []).slice().reverse();

  return (
    <div className="events-cal">
      <div className="events-cal-toolbar">
        <div className="events-cal-nav">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => shiftMonth(-1)}
          >
            ← Prev
          </button>
          <h2 className="events-cal-month">{monthLabel(year, month)}</h2>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => shiftMonth(1)}
          >
            Next →
          </button>
        </div>
        <div className="events-cal-meta">
          <span>
            {feed.eventCount} events in snapshot
            {feed.updatedAt
              ? ` · updated ${new Date(feed.updatedAt).toLocaleString()}`
              : ""}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            disabled={refreshing}
            onClick={forceRefresh}
          >
            {refreshing ? "Refreshing…" : "Refresh listings"}
          </button>
        </div>
      </div>

      {feed.lastError ? (
        <p className="cal-warn">
          Note: some sources had issues last refresh — showing best available
          list.
        </p>
      ) : null}

      <div className="events-cal-layout">
        <div className="about-panel events-cal-grid-wrap">
          <div className="events-cal-weekdays">
            {WEEKDAYS.map((d) => (
              <div key={d} className="events-cal-wd">
                {d}
              </div>
            ))}
          </div>
          <div className="events-cal-grid">
            {cells.map((cell, i) => {
              if (!cell) {
                return <div key={`e-${i}`} className="events-cal-cell is-empty" />;
              }
              const count = feed.byDate[cell.key] || 0;
              const isToday = cell.key === feed.todayKey;
              const isSelected = cell.key === selected;
              const isPast = cell.key < feed.todayKey;
              return (
                <button
                  key={cell.key}
                  type="button"
                  className={`events-cal-cell${isToday ? " is-today" : ""}${
                    isSelected ? " is-selected" : ""
                  }${isPast ? " is-past" : ""}${count ? " has-events" : ""}`}
                  onClick={() => setSelected(cell.key)}
                >
                  <span className="events-cal-daynum">{cell.day}</span>
                  {count > 0 ? (
                    <span className="events-cal-dots" aria-label={`${count} events`}>
                      {Math.min(count, 3) === 1 && <i />}
                      {Math.min(count, 3) === 2 && (
                        <>
                          <i />
                          <i />
                        </>
                      )}
                      {Math.min(count, 3) >= 3 && (
                        <>
                          <i />
                          <i />
                          <i />
                        </>
                      )}
                      {count > 3 ? (
                        <em className="events-cal-more">+{count - 3}</em>
                      ) : null}
                    </span>
                  ) : (
                    <span className="events-cal-dots is-none" />
                  )}
                </button>
              );
            })}
          </div>
          <p className="events-cal-legend">
            <span className="events-cal-legend-item">
              <i className="is-today-swatch" /> Today
            </span>
            <span className="events-cal-legend-item">
              <i className="is-dot-swatch" /> Has events
            </span>
            <span className="events-cal-legend-item is-muted">
              Past days this month stay visible
            </span>
          </p>
        </div>

        <div className="events-cal-day-panel about-panel">
          <h3 style={{ marginTop: 0 }}>
            {selected ? formatDayHeading(selected) : "Pick a day"}
          </h3>
          {selected === feed.todayKey ? (
            <p className="cal-day-kicker">Today in The Villages area</p>
          ) : selected && selected < feed.todayKey ? (
            <p className="cal-day-kicker is-past">Earlier this month</p>
          ) : (
            <p className="cal-day-kicker">Coming up</p>
          )}
          {dayEvents.length === 0 ? (
            <p className="cal-muted">
              No scraped listings for this day yet — try another date or refresh.
            </p>
          ) : (
            <div className="cal-event-list">
              {dayEvents.map((e) => (
                <EventCard
                  key={e.id}
                  e={e}
                  isPast={e.date < feed.todayKey}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="events-cal-lists">
        <section className="about-panel">
          <h3 style={{ marginTop: 0 }}>Upcoming this month</h3>
          {upcoming.length === 0 ? (
            <p className="cal-muted">No upcoming events in this month view.</p>
          ) : (
            <ul className="cal-agenda">
              {upcoming.slice(0, 24).map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    className="cal-agenda-btn"
                    onClick={() => setSelected(e.date)}
                  >
                    <strong>{formatDayHeading(e.date)}</strong>
                    <span>{e.timeLabel || "All day-ish"}</span>
                    <em>{e.title}</em>
                    {e.venue ? <small>{e.venue}</small> : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="about-panel">
          <h3 style={{ marginTop: 0 }}>Already happened this month</h3>
          {past.length === 0 ? (
            <p className="cal-muted">
              Nothing past yet in this month — or listings start mid-month.
            </p>
          ) : (
            <ul className="cal-agenda cal-agenda-past">
              {past.slice(0, 18).map((e) => (
                <li key={e.id}>
                  <button
                    type="button"
                    className="cal-agenda-btn"
                    onClick={() => setSelected(e.date)}
                  >
                    <strong>{formatDayHeading(e.date)}</strong>
                    <span>{e.timeLabel || ""}</span>
                    <em>{e.title}</em>
                    {e.venue ? <small>{e.venue}</small> : null}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="cal-disclaimer">
        Listings are gathered from public entertainment calendars for orientation
        only — times change, rain moves shows, and we are not affiliated with The
        Villages®. Confirm on the source link before you cart over.
      </p>
    </div>
  );
}
