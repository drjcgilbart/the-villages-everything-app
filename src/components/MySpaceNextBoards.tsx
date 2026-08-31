"use client";

import Link from "next/link";
import { useState } from "react";
import {
  NEWS_TOPICS,
  emptyBoards,
  type MemoriesBoard,
  type NewsBoard,
} from "@/lib/memberBoardModel";
import { useMemberBoard } from "@/components/useMemberBoard";

export {
  MySpaceEntertainmentBoard,
  MySpaceFoodBoard,
  MySpaceGolfLogBoard,
  MySpaceGymBoard,
  MySpaceMaintenanceBoard,
  MySpacePickleballLogBoard,
} from "@/components/MySpaceLifeBoards";

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
  const [custom, setCustom] = useState("");
  const [ytName, setYtName] = useState("");
  const [ytUrl, setYtUrl] = useState("");
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
        Pick beats, add your own topics and YouTube people, and stash stories.
        This mix is yours — not the public Local News page.
      </p>
      <p className="panel-hint">
        Public Hub page stays free:{" "}
        <Link href="/news" className="text-link">
          Local News
        </Link>
      </p>
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
          if (!custom.trim()) return;
          void save({
            ...value,
            customTopics: [...(value.customTopics || []), custom.trim()].slice(0, 12),
          });
          setCustom("");
        }}
      >
        <div className="field">
          <label>Your own topic</label>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="Medicare Advantage, SpaceX…"
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Add topic
        </button>
      </form>
      {(value.customTopics || []).length > 0 ? (
        <p className="panel-hint">{value.customTopics.join(" · ")}</p>
      ) : null}

      <form
        className="form-grid ms-module-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!ytName.trim()) return;
          void save({
            ...value,
            youtube: [
              {
                id: `yt-${Date.now().toString(36)}`,
                name: ytName.trim().slice(0, 60),
                url: ytUrl.trim().slice(0, 240),
              },
              ...(value.youtube || []),
            ].slice(0, 20),
          });
          setYtName("");
          setYtUrl("");
        }}
      >
        <div className="field">
          <label>YouTube person</label>
          <input
            value={ytName}
            onChange={(e) => setYtName(e.target.value)}
            placeholder="Skip Smith"
            required
          />
        </div>
        <div className="field">
          <label>Channel URL</label>
          <input value={ytUrl} onChange={(e) => setYtUrl(e.target.value)} placeholder="https://" />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Save person
        </button>
      </form>
      <ul className="ms-cal-list">
        {(value.youtube || []).map((y) => (
          <li key={y.id}>
            <div>
              <strong>{y.name}</strong>
              {y.url ? (
                <span>
                  <a href={y.url} target="_blank" rel="noopener noreferrer">
                    YouTube
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
                  youtube: value.youtube.filter((x) => x.id !== y.id),
                })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form
        className="form-grid ms-module-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          void save({
            ...value,
            saved: [
              {
                id: `s-${Date.now().toString(36)}`,
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

export function MySpaceMemoriesBoard() {
  const empty = emptyBoards().memories;
  const { value, save, ready, saving, error } = useMemberBoard<MemoriesBoard>(
    "memories",
    empty,
    true
  );
  const [caption, setCaption] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState("");
  if (!ready) return <p className="panel-hint">Loading photos…</p>;

  return (
    <div className="about-panel ms-module">
      <p className="ms-module-lead">
        Private album captions on your account. The public Photo Journal stays free.
      </p>
      <p className="panel-hint">
        Public Hub page stays free:{" "}
        <Link href="/photos" className="text-link">
          Photo Journal
        </Link>
      </p>
      <Status error={error} saving={saving} />
      <form
        className="form-grid ms-module-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!caption.trim()) return;
          void save({
            photos: [
              {
                id: `ph-${Date.now().toString(36)}`,
                caption: caption.trim().slice(0, 120),
                extra: place.trim().slice(0, 200) || undefined,
                date: date,
              },
              ...value.photos,
            ].slice(0, 60),
          });
          setCaption("");
          setPlace("");
          setDate("");
        }}
      >
        <div className="field">
          <label>Caption</label>
          <input value={caption} onChange={(e) => setCaption(e.target.value)} required />
        </div>
        <div className="field">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="field">
          <label>Place</label>
          <input value={place} onChange={(e) => setPlace(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          Add to album
        </button>
      </form>
      <ul className="ms-cal-list">
        {value.photos.map((p) => (
          <li key={p.id}>
            <div>
              <strong>{p.caption}</strong>
              <span>
                {[p.date, p.extra].filter(Boolean).join(" · ")}
              </span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                void save({ photos: value.photos.filter((x) => x.id !== p.id) })
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
