"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useMemberBoard } from "@/components/useMemberBoard";
import {
  emptyBoards,
  type NewsBoard,
  type NewsPerson,
  type NewsTopicFollow,
} from "@/lib/memberBoardModel";
import {
  NEWS_OUTLET_LINKS,
  NEWS_PRESETS,
  SUGGESTED_CREATORS,
  formatHeadlineDate,
  googleNewsSearch,
  type NewsHeadline,
  yahooNewsSearch,
  youtubeSearch,
} from "@/lib/newsCatalog";

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`;
}

function presetFollow(id: string): NewsTopicFollow | null {
  const p = NEWS_PRESETS.find((x) => x.id === id);
  if (!p) return null;
  return {
    id: uid("top"),
    presetId: p.id,
    label: p.label,
    query: p.query,
    ticker: p.ticker,
    emoji: p.emoji,
  };
}

/**
 * Household news briefing — topics, YouTube people, Save/Hide,
 * plus live Google News headlines (not your neighbor’s feed).
 */
export function MySpaceNewsBoard() {
  const empty = emptyBoards().news;
  const { value, save, ready, saving, error } = useMemberBoard<NewsBoard>(
    "news",
    empty,
    true
  );
  const [customize, setCustomize] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [headlines, setHeadlines] = useState<Record<string, NewsHeadline[]>>({});
  const [scanErr, setScanErr] = useState<string | null>(null);
  const [personName, setPersonName] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [creatorUrl, setCreatorUrl] = useState("");
  const [muteWord, setMuteWord] = useState("");
  const [rename, setRename] = useState("");

  const people = value.people;
  const active = people.find((p) => p.id === value.activePersonId) || people[0];

  const usedPresets = new Set((active?.topics || []).map((t) => t.presetId).filter(Boolean));

  function persist(next: Partial<NewsBoard> & { people?: NewsPerson[] }) {
    void save({ ...value, ...next });
  }

  function patchPerson(id: string, patch: Partial<NewsPerson>) {
    persist({
      people: people.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
  }

  async function scan() {
    if (!active) return;
    setScanning(true);
    setScanErr(null);
    const next: Record<string, NewsHeadline[]> = {};
    try {
      await Promise.all(
        active.topics.slice(0, 8).map(async (t) => {
          const res = await fetch(`/api/news/scan?q=${encodeURIComponent(t.query || t.label)}`, {
            cache: "no-store",
          });
          const data = await res.json();
          next[t.id] = Array.isArray(data.items) ? data.items : [];
        })
      );
      setHeadlines(next);
    } catch (e) {
      setScanErr(e instanceof Error ? e.message : "Could not scan headlines");
    } finally {
      setScanning(false);
    }
  }

  const muted = (title: string) =>
    (active?.muteWords || []).some((w) => title.toLowerCase().includes(w.toLowerCase()));

  const visible = (items: NewsHeadline[]) =>
    items.filter((h) => !active?.hidden.includes(h.link) && !muted(h.title));

  const todayHeadlines = useMemo(() => {
    const all: (NewsHeadline & { topic: string })[] = [];
    for (const t of active?.topics || []) {
      for (const h of visible(headlines[t.id] || [])) {
        all.push({ ...h, topic: t.label });
      }
    }
    return all.slice(0, 8);
  }, [active, headlines]);

  if (!ready) return <p className="panel-hint">Loading news prefs…</p>;
  if (!active) return <p className="panel-hint">No reader yet.</p>;

  return (
    <div className="ms-ent-board">
      <div className="ms-h-toolbar">
        <div>
          <p className="ms-module-lead" style={{ marginBottom: 0 }}>
            News for {active.name}
          </p>
          <p className="panel-hint">
            {active.topics.length} topics · {active.creators.length} YouTube people · Public Hub
            page stays free:{" "}
            <Link href="/news" className="text-link">
              Local News
            </Link>
          </p>
        </div>
        <div className="hero-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setCustomize((v) => !v)}>
            {customize ? "Done" : "My topics"}
          </button>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => void scan()} disabled={scanning}>
            {scanning ? "Scanning…" : "Scan now"}
          </button>
        </div>
      </div>
      {error ? <p className="pf-form-error">{error}</p> : null}
      {saving ? <p className="panel-hint">Saving to your account…</p> : null}
      {scanErr ? <p className="pf-form-error">{scanErr}</p> : null}

      <div className="about-panel ms-module">
        <span className="panel-hint">WHO’S READING</span>
        <div className="ms-h-quick">
          {people.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`ms-h-range-btn ${p.id === active.id ? "active" : ""}`}
              onClick={() => persist({ activePersonId: p.id })}
            >
              {p.name}
            </button>
          ))}
        </div>
        {people.length < 8 ? (
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const name = personName.trim();
              if (!name) return;
              const row: NewsPerson = {
                id: uid("who"),
                name: name.slice(0, 40),
                topics: [presetFollow("villages")!].filter(Boolean),
                creators: [],
                muteWords: [],
                saved: [],
                hidden: [],
              };
              persist({ people: [...people, row], activePersonId: row.id });
              setPersonName("");
              setCustomize(true);
            }}
          >
            <input
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Add a name"
              maxLength={40}
            />
            <button type="submit" className="btn btn-ghost btn-sm">
              Add
            </button>
          </form>
        ) : null}
      </div>

      {customize ? (
        <div className="about-panel ms-module">
          <h4>What {active.name} wants to see</h4>
          <p className="panel-hint">
            Tap a topic to follow it. Type anything else. Each person on this account keeps their
            own list — we don’t copy anyone else’s Tesla or SpaceX mix.
          </p>
          <p className="panel-hint">Topics {active.name} follows</p>
          <div className="ms-h-quick">
            {active.topics.map((t) => (
              <span key={t.id} className="ms-h-pill">
                {t.emoji} {t.label}
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    patchPerson(active.id, {
                      topics: active.topics.filter((x) => x.id !== t.id),
                    })
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="ms-h-quick">
            {NEWS_PRESETS.filter((p) => !usedPresets.has(p.id)).map((p) => (
              <button
                key={p.id}
                type="button"
                className="ms-h-range-btn"
                onClick={() => {
                  const f = presetFollow(p.id);
                  if (!f) return;
                  patchPerson(active.id, { topics: [...active.topics, f].slice(0, 12) });
                }}
              >
                + {p.emoji} {p.label}
              </button>
            ))}
          </div>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const label = customTopic.trim();
              if (!label) return;
              patchPerson(active.id, {
                topics: [
                  ...active.topics,
                  {
                    id: uid("top"),
                    presetId: "",
                    label: label.slice(0, 60),
                    query: label.slice(0, 120),
                    ticker: "",
                    emoji: "📌",
                  },
                ].slice(0, 12),
              });
              setCustomTopic("");
            }}
          >
            <input
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Or type your own, like Medicare Advantage"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Follow this
            </button>
          </form>

          <h4>YouTube people {active.name} follows</h4>
          <div className="ms-h-quick">
            {active.creators.map((c) => (
              <span key={c.id} className="ms-h-pill">
                {c.name}
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    patchPerson(active.id, {
                      creators: active.creators.filter((x) => x.id !== c.id),
                    })
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="ms-h-quick">
            {(SUGGESTED_CREATORS[active.topics[0]?.presetId || "villages"] || SUGGESTED_CREATORS.villages)
              .filter((s) => !active.creators.some((c) => c.name === s.name))
              .map((s) => (
                <button
                  key={s.name}
                  type="button"
                  className="ms-h-range-btn"
                  onClick={() =>
                    patchPerson(active.id, {
                      creators: [...active.creators, { id: uid("yt"), name: s.name, url: s.url }].slice(
                        0,
                        16
                      ),
                    })
                  }
                >
                  + {s.name}
                </button>
              ))}
          </div>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!creatorName.trim()) return;
              patchPerson(active.id, {
                creators: [
                  {
                    id: uid("yt"),
                    name: creatorName.trim().slice(0, 80),
                    url: creatorUrl.trim().slice(0, 240),
                  },
                  ...active.creators,
                ].slice(0, 16),
              });
              setCreatorName("");
              setCreatorUrl("");
            }}
          >
            <input
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
              placeholder="Search a YouTube name, like Everyday Astronaut"
            />
            <input
              value={creatorUrl}
              onChange={(e) => setCreatorUrl(e.target.value)}
              placeholder="Channel URL (optional)"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Follow
            </button>
          </form>

          <h4>Quiet words — hide stories that mention</h4>
          <div className="ms-h-quick">
            {active.muteWords.map((w) => (
              <span key={w} className="ms-h-pill">
                {w}
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    patchPerson(active.id, {
                      muteWords: active.muteWords.filter((x) => x !== w),
                    })
                  }
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const w = muteWord.trim();
              if (!w) return;
              patchPerson(active.id, {
                muteWords: [...active.muteWords, w.slice(0, 40)].slice(0, 20),
              });
              setMuteWord("");
            }}
          >
            <input
              value={muteWord}
              onChange={(e) => setMuteWord(e.target.value)}
              placeholder="e.g. lawsuit"
            />
            <button type="submit" className="btn btn-ghost btn-sm">
              Hide this word
            </button>
          </form>

          <h4>This person’s name</h4>
          <form
            className="form-grid ms-module-form"
            onSubmit={(e) => {
              e.preventDefault();
              const n = (rename || active.name).trim();
              if (!n) return;
              patchPerson(active.id, { name: n.slice(0, 40) });
            }}
          >
            <input
              defaultValue={active.name}
              key={active.id}
              onChange={(e) => setRename(e.target.value)}
            />
            <button type="submit" className="btn btn-ghost btn-sm">
              Save name
            </button>
            {people.length > 1 ? (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  const next = people.filter((p) => p.id !== active.id);
                  persist({ people: next, activePersonId: next[0]?.id || "" });
                }}
              >
                Remove {active.name}
              </button>
            ) : null}
          </form>
        </div>
      ) : null}

      <div className="about-panel ms-module">
        <h4>Today for {active.name}</h4>
        <p className="panel-hint">Headlines + channels you follow. Scan now pulls Google News RSS for each topic.</p>
        {todayHeadlines.length === 0 && !scanning ? (
          <p className="panel-hint">No headlines yet. Tap Scan now, or follow a topic under My topics.</p>
        ) : (
          <ul className="ms-cal-list">
            {todayHeadlines.map((h) => (
              <li key={h.link}>
                <div>
                  <span className="panel-hint">
                    {h.source || h.topic} · {formatHeadlineDate(h.date)}
                  </span>
                  <strong>{h.title}</strong>
                  <a className="text-link" href={h.link} target="_blank" rel="noopener noreferrer">
                    Read article ↗
                  </a>
                </div>
                <div className="hero-actions">
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      patchPerson(active.id, {
                        saved: [
                          { id: uid("s"), title: h.title.slice(0, 80), url: h.link },
                          ...active.saved,
                        ].slice(0, 40),
                      })
                    }
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() =>
                      patchPerson(active.id, { hidden: [...active.hidden, h.link].slice(0, 80) })
                    }
                  >
                    Hide
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="panel-hint">YouTube people {active.name} follows</p>
        {active.creators.length === 0 ? (
          <p className="panel-hint">No channels yet — add some under My topics.</p>
        ) : (
          <ul className="ms-cal-list">
            {active.creators.map((c) => (
              <li key={c.id}>
                <div>
                  <strong>{c.name}</strong>
                </div>
                <div className="hero-actions">
                  {c.url ? (
                    <a className="btn btn-primary btn-sm" href={c.url} target="_blank" rel="noopener noreferrer">
                      Watch here
                    </a>
                  ) : (
                    <a
                      className="btn btn-ghost btn-sm"
                      href={youtubeSearch(c.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      YouTube
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {active.topics.map((t) => {
        const items = visible(headlines[t.id] || []);
        return (
          <div key={t.id} className="about-panel ms-module">
            <div className="ms-h-toolbar">
              <h4>
                {t.emoji} {t.label}
              </h4>
              <div className="hero-actions">
                {t.ticker ? (
                  <a
                    className="btn btn-ghost btn-sm"
                    href={yahooNewsSearch(t.ticker)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Yahoo
                  </a>
                ) : null}
                <a
                  className="btn btn-ghost btn-sm"
                  href={googleNewsSearch(t.query || t.label)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google News
                </a>
                <a
                  className="btn btn-ghost btn-sm"
                  href={youtubeSearch(t.query || t.label)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </a>
              </div>
            </div>
            {items.length === 0 ? (
              <p className="panel-hint">
                Scan now to fill this beat, or open Google News / YouTube from the links above.
              </p>
            ) : (
              <ul className="ms-cal-list">
                {items.map((h) => (
                  <li key={h.link}>
                    <div>
                      <span className="panel-hint">
                        {h.source} · {formatHeadlineDate(h.date)}
                      </span>
                      <strong>{h.title}</strong>
                      <a className="text-link" href={h.link} target="_blank" rel="noopener noreferrer">
                        Read article ↗
                      </a>
                    </div>
                    <div className="hero-actions">
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() =>
                          patchPerson(active.id, {
                            saved: [
                              { id: uid("s"), title: h.title.slice(0, 80), url: h.link },
                              ...active.saved,
                            ].slice(0, 40),
                          })
                        }
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() =>
                          patchPerson(active.id, {
                            hidden: [...active.hidden, h.link].slice(0, 80),
                          })
                        }
                      >
                        Hide
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}

      {active.saved.length > 0 ? (
        <div className="about-panel ms-module">
          <h4>Saved stories</h4>
          <ul className="ms-cal-list">
            {active.saved.map((s) => (
              <li key={s.id}>
                <div>
                  <strong>{s.title}</strong>
                  {s.url ? (
                    <a className="text-link" href={s.url} target="_blank" rel="noopener noreferrer">
                      Open
                    </a>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    patchPerson(active.id, { saved: active.saved.filter((x) => x.id !== s.id) })
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="about-panel ms-module">
        <h4>Villages news desk</h4>
        <p className="panel-hint">
          Local paper, independent web news, district notices, and WVLG. Not affiliated — confirm on
          the source.
        </p>
        <div className="ms-food-guide">
          {NEWS_OUTLET_LINKS.map((o) => (
            <article key={o.href} className="ms-food-card">
              <h4>{o.name}</h4>
              <p>{o.note}</p>
              <a className="btn btn-ghost btn-sm" href={o.href} target="_blank" rel="noopener noreferrer">
                Open
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
