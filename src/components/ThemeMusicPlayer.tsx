"use client";

import { useEffect, useRef, useState } from "react";
import { isNativeAppShell } from "@/lib/nativeAppShell";
import {
  THEME_TRACKS,
  createThemeMusicEngine,
  type TrackId,
} from "@/lib/themeMusic";

const STORAGE_VOL = "tvi-theme-vol";
const STORAGE_OPEN = "tvi-theme-music-open";
const STORAGE_TRACK = "tvi-theme-track";
const STORAGE_LOOP = "tvi-theme-loop-ids";

const ALL_TRACK_IDS = THEME_TRACKS.map((t) => t.id);

function parseLoopIds(raw: string | null): TrackId[] {
  if (!raw) return [...ALL_TRACK_IDS];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [...ALL_TRACK_IDS];
    const ids = parsed.filter((id): id is TrackId =>
      THEME_TRACKS.some((t) => t.id === id)
    );
    return ids.length ? ids : [...ALL_TRACK_IDS];
  } catch {
    return [...ALL_TRACK_IDS];
  }
}

export function ThemeMusicPlayer() {
  const engineRef = useRef<ReturnType<typeof createThemeMusicEngine> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [open, setOpen] = useState(false);
  const [trackId, setTrackId] = useState<TrackId>("sunny-morning");
  const [loopIds, setLoopIds] = useState<TrackId[]>([...ALL_TRACK_IDS]);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [inNativeApp, setInNativeApp] = useState(false);
  const loopIdsRef = useRef<TrackId[]>(loopIds);
  const playTrackRef = useRef<(id: TrackId) => Promise<void>>(async () => undefined);

  const active = THEME_TRACKS.find((t) => t.id === trackId) || THEME_TRACKS[0];
  loopIdsRef.current = loopIds;

  useEffect(() => {
    setHydrated(true);
    setInNativeApp(isNativeAppShell());
  }, []);

  useEffect(() => {
    if (!hydrated || inNativeApp) return;

    let initial: TrackId = "sunny-morning";
    try {
      const v = localStorage.getItem(STORAGE_VOL);
      if (v != null) setVolume(Math.min(1, Math.max(0, Number(v) || 0.35)));
      const o = localStorage.getItem(STORAGE_OPEN);
      if (o === "1") setOpen(true);
      const t = localStorage.getItem(STORAGE_TRACK);
      if (t && THEME_TRACKS.some((x) => x.id === t)) {
        initial = t as TrackId;
        setTrackId(initial);
      }
      setLoopIds(parseLoopIds(localStorage.getItem(STORAGE_LOOP)));
    } catch {
      /* ignore */
    }

    engineRef.current = createThemeMusicEngine(initial);
    engineRef.current.setOnEnded((endedId) => {
      const list = loopIdsRef.current.length ? loopIdsRef.current : ALL_TRACK_IDS;
      if (list.length <= 1) return;
      const i = list.indexOf(endedId);
      const next = list[(i + 1 + list.length) % list.length];
      void playTrackRef.current(next);
    });
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [hydrated, inNativeApp]);

  useEffect(() => {
    engineRef.current?.setVolume(volume);
    try {
      localStorage.setItem(STORAGE_VOL, String(volume));
    } catch {
      /* ignore */
    }
  }, [volume]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_OPEN, open ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [open]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TRACK, trackId);
    } catch {
      /* ignore */
    }
  }, [trackId]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LOOP, JSON.stringify(loopIds));
    } catch {
      /* ignore */
    }
    engineRef.current?.setRepeatOne(loopIds.length <= 1);
  }, [loopIds]);

  function stopAll() {
    engineRef.current?.stopAll();
    setPlaying(false);
    setError(null);
  }

  async function playTrack(id: TrackId) {
    setError(null);
    setTrackId(id);
    const eng = engineRef.current;
    if (!eng) return;
    try {
      eng.setRepeatOne(loopIdsRef.current.length <= 1);
      eng.stopAll();
      eng.setTrack(id);
      eng.setVolume(volume);
      await eng.start();
      setPlaying(true);
      setOpen(true);
    } catch {
      setError("Could not start audio — try Play again.");
      setPlaying(false);
    }
  }
  playTrackRef.current = playTrack;

  function stopTrack(id: TrackId) {
    const eng = engineRef.current;
    if (!eng) return;
    if (eng.getTrackId() === id) stopAll();
  }

  async function togglePlay() {
    if (playing) {
      stopAll();
      return;
    }
    await playTrack(trackId);
  }

  async function selectTrack(id: TrackId) {
    if (playing && id !== trackId) {
      await playTrack(id);
      return;
    }
    setTrackId(id);
    engineRef.current?.setTrack(id);
  }

  async function nextTrack(dir: 1 | -1) {
    const list = loopIds.length ? loopIds : ALL_TRACK_IDS;
    const idx = list.indexOf(trackId);
    const from = idx >= 0 ? idx : 0;
    const next = list[(from + dir + list.length) % list.length];
    await selectTrack(next);
  }

  function toggleLoop(id: TrackId) {
    setLoopIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((x) => x !== id);
        return next.length ? next : prev;
      }
      return ALL_TRACK_IDS.filter((x) => prev.includes(x) || x === id);
    });
  }

  function loopAll() {
    setLoopIds([...ALL_TRACK_IDS]);
  }

  function loopThisOnly() {
    setLoopIds([trackId]);
  }

  // Phone app WebView: no floating music control (desktop/browser still has it)
  if (!hydrated || inNativeApp) return null;

  return (
    <div className={`theme-music ${open ? "open" : ""} ${playing ? "playing" : ""}`}>
      <button
        type="button"
        className="theme-music-fab"
        onClick={() => {
          if (playing) stopAll();
          else if (!open) setOpen(true);
          else void togglePlay();
        }}
        aria-label={
          playing ? "Stop all theme music" : open ? "Play theme music" : "Open theme music"
        }
        title={playing ? "Stop all music" : "Theme music (optional)"}
      >
        <span className="theme-music-icon" aria-hidden="true">
          {playing ? active.emoji : "🎵"}
        </span>
        {playing && <span className="theme-music-pulse" aria-hidden="true" />}
      </button>

      {open && (
        <div className="theme-music-panel" role="region" aria-label="Theme music controls">
          <div className="theme-music-head">
            <strong>Theme music</strong>
            <button
              type="button"
              className="theme-music-close"
              onClick={() => setOpen(false)}
              aria-label="Collapse music panel"
            >
              ✕
            </button>
          </div>
          <p className="theme-music-note">
            Optional royalty-free instrumentals. Check the moods to rotate. When a
            track ends, the next checked one plays so it doesn’t get stale. Check
            all to hear everything.
          </p>

          <div className="theme-music-now">
            <span className="theme-music-now-emoji" aria-hidden="true">
              {active.emoji}
            </span>
            <div>
              <div className="theme-music-now-name">{active.name}</div>
              <div className="theme-music-now-blurb">{active.blurb}</div>
            </div>
          </div>

          <div className="theme-music-switcher">
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => nextTrack(-1)}
              aria-label="Previous mood"
            >
              ←
            </button>
            <label className="theme-music-select-wrap">
              <span className="sr-only">Mood</span>
              <select
                className="theme-music-select"
                value={trackId}
                onChange={(e) => selectTrack(e.target.value as TrackId)}
                aria-label="Choose music mood"
              >
                {THEME_TRACKS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.emoji} {t.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => nextTrack(1)}
              aria-label="Next mood"
            >
              →
            </button>
          </div>

          <div className="theme-music-loop-bar">
            <span>
              Rotate {loopIds.length} of {THEME_TRACKS.length}
            </span>
            <button type="button" className="btn btn-ghost btn-sm" onClick={loopAll}>
              All moods
            </button>
            <button type="button" className="btn btn-ghost btn-sm" onClick={loopThisOnly}>
              This mood only
            </button>
          </div>

          <ul className="theme-music-tracks">
            {THEME_TRACKS.map((t) => {
              const on = playing && t.id === trackId;
              const inLoop = loopIds.includes(t.id);
              return (
                <li
                  key={t.id}
                  className={`theme-music-track ${on ? "playing" : ""} ${t.id === trackId ? "selected" : ""}`}
                >
                  <label className="theme-music-loop-check">
                    <input
                      type="checkbox"
                      checked={inLoop}
                      onChange={() => toggleLoop(t.id)}
                      aria-label={`Include ${t.name} in the rotation`}
                    />
                  </label>
                  <button
                    type="button"
                    className="theme-music-track-label"
                    onClick={() => (on ? stopTrack(t.id) : playTrack(t.id))}
                  >
                    <span aria-hidden="true">{t.emoji}</span>
                    <span>{t.name}</span>
                    {on ? <span className="theme-music-live">Playing</span> : null}
                  </button>
                  {on ? (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => stopTrack(t.id)}
                    >
                      Stop
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => playTrack(t.id)}
                    >
                      Play
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="theme-music-controls">
            <button
              type="button"
              className="btn btn-sm theme-music-stop-all"
              onClick={stopAll}
              disabled={!playing}
            >
              Stop all music
            </button>
            <label className="theme-music-vol">
              <span>Volume</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                aria-label="Music volume"
              />
            </label>
          </div>
          <p className="theme-music-credit">{active.credit}</p>
          {error && <p className="theme-music-error">{error}</p>}
        </div>
      )}
    </div>
  );
}
