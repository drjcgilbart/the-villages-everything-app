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

export function ThemeMusicPlayer() {
  const engineRef = useRef<ReturnType<typeof createThemeMusicEngine> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [open, setOpen] = useState(false);
  const [trackId, setTrackId] = useState<TrackId>("sunny-morning");
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [inNativeApp, setInNativeApp] = useState(false);

  const active = THEME_TRACKS.find((t) => t.id === trackId) || THEME_TRACKS[0];

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
    } catch {
      /* ignore */
    }

    engineRef.current = createThemeMusicEngine(initial);
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
    engineRef.current?.setTrack(trackId);
    try {
      localStorage.setItem(STORAGE_TRACK, trackId);
    } catch {
      /* ignore */
    }
  }, [trackId]);

  async function togglePlay() {
    setError(null);
    const eng = engineRef.current;
    if (!eng) return;
    try {
      if (eng.isPlaying()) {
        eng.stop();
        setPlaying(false);
      } else {
        eng.setTrack(trackId);
        eng.setVolume(volume);
        await eng.start();
        setPlaying(true);
        setOpen(true);
      }
    } catch {
      setError("Could not start audio — try clicking Play again.");
      setPlaying(false);
    }
  }

  function selectTrack(id: TrackId) {
    setTrackId(id);
  }

  function nextTrack(dir: 1 | -1) {
    const idx = THEME_TRACKS.findIndex((t) => t.id === trackId);
    const next = THEME_TRACKS[(idx + dir + THEME_TRACKS.length) % THEME_TRACKS.length];
    selectTrack(next.id);
  }

  // Phone app WebView: no floating music control (desktop/browser still has it)
  if (!hydrated || inNativeApp) return null;

  return (
    <div className={`theme-music ${open ? "open" : ""} ${playing ? "playing" : ""}`}>
      <button
        type="button"
        className="theme-music-fab"
        onClick={() => (open ? togglePlay() : setOpen(true))}
        aria-label={playing ? "Pause theme music" : "Open theme music"}
        title="Theme music (optional)"
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
            Real royalty-free instrumentals (not browser beeps). Optional — pick a
            mood and hit Play. Loops while the page is open.
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

          <ul className="theme-music-list">
            {THEME_TRACKS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  className={`theme-music-chip ${t.id === trackId ? "active" : ""}`}
                  onClick={() => selectTrack(t.id)}
                >
                  <span aria-hidden="true">{t.emoji}</span>
                  <span>{t.name}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="theme-music-controls">
            <button type="button" className="btn btn-primary btn-sm" onClick={togglePlay}>
              {playing ? "Pause" : "Play"}
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
