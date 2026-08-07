import Link from "next/link";
import {
  CURATED_LINEUP,
  OFFICIAL_NIGHTLY_ENTERTAINMENT_URL,
  OFFICIAL_SUMMER_HOURS_URL,
  actTimeLabel,
  floridaDateKey,
  formatFriendlyDate,
  getAllSquaresTonight,
  getSquareDaySchedule,
  getUpcomingForSquare,
  type SquareDaySchedule,
  type SquareId,
  type SquareNightLineup,
} from "@/lib/squareEntertainment";

function formatUpdatedAt(iso: string | null): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return iso;
  }
}

/**
 * Main Town Squares page: tonight-at-a-glance board for every square.
 * Pass `lineup` / `tonightRows` from a Server Component (auto-refreshed data).
 */
export function SquareEntertainmentBoard({
  dateKey = floridaDateKey(),
  updatedAt = null,
  lineup = CURATED_LINEUP,
  tonightRows,
}: {
  dateKey?: string;
  updatedAt?: string | null;
  lineup?: SquareNightLineup[];
  tonightRows?: SquareDaySchedule[];
}) {
  const rows = tonightRows ?? getAllSquaresTonight(dateKey, lineup);
  const updatedLabel = formatUpdatedAt(updatedAt);

  return (
    <div className="ts-ent-board" id="whats-on">
      <div className="ts-ent-board-head about-panel">
        <div>
          <span className="kicker">Free live music · all squares</span>
          <h2 style={{ margin: "0.35rem 0 0.25rem" }}>
            What&apos;s on · {formatFriendlyDate(dateKey)}
          </h2>
          <p style={{ margin: 0, color: "var(--muted)" }}>
            Band names and times for each town square — who&apos;s playing,
            when it starts, and where. Lineups auto-update at least once a day
            from <strong>The Villages Entertainment</strong> official schedule
            (and can still change for weather or substitutions). Always
            double-check the official link before you cart over.
          </p>
          {updatedLabel ? (
            <p className="ts-ent-updated">
              Schedule last refreshed: <strong>{updatedLabel}</strong>
            </p>
          ) : (
            <p className="ts-ent-updated">
              Schedule will refresh automatically (daily cron + on visit when
              stale).
            </p>
          )}
        </div>
        <div className="ts-ent-board-actions">
          <a
            href={OFFICIAL_NIGHTLY_ENTERTAINMENT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            Official full schedule →
          </a>
          <a
            href={OFFICIAL_SUMMER_HOURS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-sm"
          >
            Season hours
          </a>
        </div>
      </div>

      <div className="ts-ent-grid">
        {rows.map((row) => (
          <SquareTonightCard key={row.squareId} schedule={row} />
        ))}
      </div>

      <p className="ts-ent-disclaimer">
        Not affiliated with The Villages® brand or developer. Free outdoor
        entertainment is provided by The Villages Entertainment; this site only
        helps neighbors find it.
      </p>
    </div>
  );
}

export function SquareTonightCard({
  schedule,
  showSquareLink = true,
}: {
  schedule: SquareDaySchedule;
  showSquareLink?: boolean;
}) {
  const href = `/town-squares/${schedule.squareId}#tonight`;

  return (
    <article
      className={`about-panel ts-ent-card${schedule.hasCuratedActs ? " has-acts" : ""}`}
    >
      <div className="ts-ent-card-top">
        <span className="pill ts-ent-when-pill">{schedule.hours.label}</span>
        <h3 className="ts-ent-card-title">
          {showSquareLink ? (
            <Link href={href}>{schedule.shortName}</Link>
          ) : (
            schedule.shortName
          )}
        </h3>
        <p className="ts-ent-stage-note">{schedule.stageNote}</p>
      </div>

      {schedule.hasCuratedActs ? (
        <ul className="ts-ent-act-list">
          {schedule.acts.map((act) => (
            <li key={act.name + (act.start || "")}>
              <strong className="ts-ent-act-name">{act.name}</strong>
              <span className="ts-ent-act-time">
                {actTimeLabel(act, schedule.hours)}
              </span>
              {act.blurb ? (
                <span className="ts-ent-act-blurb">{act.blurb}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="ts-ent-unknown">
          <p>
            <strong>Typical stage window:</strong> {schedule.hours.label}
          </p>
          <p>
            Tonight&apos;s band name isn&apos;t in our snapshot yet — open the
            official schedule for who&apos;s booked.
          </p>
        </div>
      )}

      {schedule.hours.note ? (
        <p className="ts-ent-hours-note">{schedule.hours.note}</p>
      ) : null}

      <div className="ts-ent-card-actions">
        {showSquareLink ? (
          <Link href={href} className="btn btn-ghost btn-sm">
            Square page
          </Link>
        ) : null}
        <a
          href={schedule.entertainmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-sm"
        >
          Official lineup →
        </a>
      </div>
    </article>
  );
}

/**
 * Single-square entertainment panel for detail pages.
 * Pass `lineup` from a Server Component when you have live auto-refreshed data.
 */
export function SquareTonightPanel({
  squareId,
  lineup = CURATED_LINEUP,
  updatedAt = null,
}: {
  squareId: SquareId;
  lineup?: SquareNightLineup[];
  updatedAt?: string | null;
}) {
  const todayKey = floridaDateKey();
  const tonight = getSquareDaySchedule(squareId, todayKey, lineup);
  const upcoming = getUpcomingForSquare(squareId, 14, todayKey, lineup).filter(
    (s) => s.hasCuratedActs
  );
  const updatedLabel = formatUpdatedAt(updatedAt);

  return (
    <div className="ts-ent-detail" id="tonight">
      <div className="ts-ent-detail-banner about-panel">
        <span className="kicker">Tonight at this square</span>
        <h2 style={{ margin: "0.35rem 0 0.25rem" }}>
          Who&apos;s playing · {tonight.friendlyDate}
        </h2>
        <p className="ts-ent-hours-big">
          <strong>{tonight.hours.label}</strong>
          {tonight.hours.note ? (
            <span className="ts-ent-hours-note"> · {tonight.hours.note}</span>
          ) : null}
        </p>
        {updatedLabel ? (
          <p className="ts-ent-updated">
            Schedule last refreshed: <strong>{updatedLabel}</strong>
          </p>
        ) : null}
      </div>

      <SquareTonightCard schedule={tonight} showSquareLink={false} />

      {upcoming.length > 0 && (
        <div
          className="about-panel ts-ent-upcoming"
          style={{ marginTop: "1rem" }}
        >
          <h3 style={{ marginTop: 0 }}>Coming up at {tonight.shortName}</h3>
          <p className="ts-detail-muted" style={{ marginTop: 0 }}>
            Curated from the official entertainment calendar. Subject to change.
          </p>
          <ol className="ts-ent-upcoming-list">
            {upcoming.slice(0, 8).map((s) => (
              <li key={s.date}>
                <div className="ts-ent-upcoming-date">
                  <strong>{formatFriendlyDate(s.date)}</strong>
                  <span>{s.hours.label}</span>
                </div>
                <ul className="ts-ent-act-list ts-ent-act-list-nested">
                  {s.acts.map((act) => (
                    <li key={act.name + (act.start || "")}>
                      <strong className="ts-ent-act-name">{act.name}</strong>
                      <span className="ts-ent-act-time">
                        {actTimeLabel(act, s.hours)}
                      </span>
                      {act.blurb ? (
                        <span className="ts-ent-act-blurb">{act.blurb}</span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
          <a
            href={tonight.entertainmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
          >
            Official full calendar →
          </a>
        </div>
      )}
    </div>
  );
}
