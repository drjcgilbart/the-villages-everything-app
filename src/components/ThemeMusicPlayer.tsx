"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { isNativeAppShell } from "@/lib/nativeAppShell";
import { THEME_TRACKS, createThemeMusicEngine, type ThemeTrack } from "@/lib/themeMusic";

type Props = {
  /** Page-specific songs. The site-wide player leaves this empty. */
  tracks?: readonly ThemeTrack[];
  /** Keeps this page's volume and song list out of the rest of the site. */
  storagePrefix?: string;
  title?: string;
  note?: string;
  fabTitle?: string;
};

const SITE_KEYS = {
  vol: "tvi-theme-vol",
  open: "tvi-theme-music-open",
  track: "tvi-theme-track",
  loop: "tvi-theme-loop-ids",
};

function storageKeys(prefix?: string) {
  if (!prefix) return SITE_KEYS;
  return {
    vol: `${prefix}-vol`,
    open: `${prefix}-open`,
    track: `${prefix}-track`,
    loop: `${prefix}-loop`,
  };
}

function parseLoopIds(raw: string | null, list: readonly ThemeTrack[]): string[] {
  const all = list.map((track) => track.id);
  if (!raw) return all;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return all;
    const ids = parsed.filter(
      (id): id is string => typeof id === "string" && list.some((track) => track.id === id)
    );
    return ids.length ? ids : all;
  } catch {
    return all;
  }
}

export function ThemeMusicPlayer({
  tracks,
  storagePrefix,
  title = "Theme music",
  note,
  fabTitle,
}: Props = {}) {
  const pathname = usePathname();
  const catalog = tracks && tracks.length ? tracks : THEME_TRACKS;
  const custom = Boolean(tracks && tracks.length);
  const hideForTour = !custom && pathname === "/tour";
  const keys = useMemo(() => storageKeys(storagePrefix), [storagePrefix]);
  const noun = custom ? "song" : "mood";
  const catalogKey = catalog.map((track) => track.id).join("|");
  const catalogRef = useRef(catalog);
  catalogRef.current = catalog;
  const defaultNote =
    note ||
    "Optional royalty-free instrumentals. Check the moods to rotate. When a track ends, the next checked one plays so it doesn’t get stale. Check all to hear everything.";

  const engineRef = useRef<ReturnType<typeof createThemeMusicEngine> | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.35);
  const [open, setOpen] = useState(false);
  const [trackId, setTrackId] = useState(catalog[0]?.id || "sunny-morning");
  const [loopIds, setLoopIds] = useState<string[]>(catalog.map((track) => track.id));
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [inNativeApp, setInNativeApp] = useState(false);
  const loopIdsRef = useRef<string[]>(loopIds);
  const trackIdRef = useRef(trackId);
  const playTrackRef = useRef<(id: string) => Promise<void>>(async () => undefined);
  const skipCatalog = useRef(true);

  const active = catalog.find((track) => track.id === trackId) || catalog[0];
  loopIdsRef.current = loopIds;
  trackIdRef.current = trackId;

  useEffect(() => {
    setHydrated(true);
    setInNativeApp(isNativeAppShell());
  }, []);

  useEffect(() => {
    if (!hydrated || inNativeApp || hideForTour) return;
    const list = catalogRef.current;
    const all = list.map((track) => track.id);

    let initial = all[0] || "sunny-morning";
    try {
      const v = localStorage.getItem(keys.vol);
      if (v != null) setVolume(Math.min(1, Math.max(0, Number(v) || 0.35)));
      const o = localStorage.getItem(keys.open);
      if (o === "1") setOpen(true);
      const saved = localStorage.getItem(keys.track);
      if (saved && list.some((track) => track.id === saved)) initial = saved;
      setTrackId(initial);
      setLoopIds(parseLoopIds(localStorage.getItem(keys.loop), list));
    } catch {
      /* ignore */
    }

    engineRef.current = createThemeMusicEngine(initial, list);
    engineRef.current.setOnEnded((endedId) => {
      const rotation = loopIdsRef.current.length ? loopIdsRef.current : catalogRef.current.map((track) => track.id);
      if (rotation.length <= 1) return;
      const i = rotation.indexOf(endedId);
      const next = rotation[(i + 1 + rotation.length) % rotation.length];
      void playTrackRef.current(next);
    });
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [hydrated, inNativeApp, hideForTour, keys]);

  useEffect(() => {
    if (skipCatalog.current) {
      skipCatalog.current = false;
      return;
    }
    const list = catalogRef.current;
    const eng = engineRef.current;
    if (!eng || !list.length) return;
    const ids = list.map((track) => track.id);
    eng.setCatalog(list);
    if (!ids.includes(trackIdRef.current)) {
      eng.stopAll();
      setPlaying(false);
      setTrackId(ids[0]);
      eng.setTrack(ids[0]);
    }
    setLoopIds((prev) => {
      const next = prev.filter((id) => ids.includes(id));
      return next.length ? next : ids;
    });
  }, [catalogKey]);

  useEffect(() => {
    if (hideForTour) return;
    engineRef.current?.setVolume(volume);
    try {
      localStorage.setItem(keys.vol, String(volume));
    } catch {
      /* ignore */
    }
  }, [volume, keys, hideForTour]);

  useEffect(() => {
    if (hideForTour) return;
    try {
      localStorage.setItem(keys.open, open ? "1" : "0");
    } catch {
      /* ignore */
    }
    document.body.classList.toggle("theme-music-open", open);
    return () => document.body.classList.remove("theme-music-open");
  }, [open, keys, hideForTour]);

  useEffect(() => {
    if (hideForTour) return;
    try {
      localStorage.setItem(keys.track, trackId);
    } catch {
      /* ignore */
    }
  }, [trackId, keys, hideForTour]);

  useEffect(() => {
    if (hideForTour) return;
    try {
      localStorage.setItem(keys.loop, JSON.stringify(loopIds));
    } catch {
      /* ignore */
    }
    engineRef.current?.setRepeatOne(loopIds.length <= 1);
  }, [loopIds, keys, hideForTour]);

  function stopAll() {
    engineRef.current?.stopAll();
    setPlaying(false);
    setError(null);
  }

  async function playTrack(id: string) {
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
    } catch {
      setError("Could not start audio — try Play again.");
      setPlaying(false);
    }
  }
  playTrackRef.current = playTrack;

  function stopTrack(id: string) {
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

  async function selectTrack(id: string) {
    if (playing && id !== trackId) {
      await playTrack(id);
      return;
    }
    setTrackId(id);
    engineRef.current?.setTrack(id);
  }

  async function nextTrack(dir: 1 | -1) {
    const list = loopIds.length ? loopIds : catalog.map((track) => track.id);
    const idx = list.indexOf(trackId);
    const from = idx >= 0 ? idx : 0;
    const next = list[(from + dir + list.length) % list.length];
    await selectTrack(next);
  }

  function toggleLoop(id: string) {
    setLoopIds((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((item) => item !== id);
        return next.length ? next : prev;
      }
      return catalog.map((track) => track.id).filter((item) => prev.includes(item) || item === id);
    });
  }

  function loopAll() {
    setLoopIds(catalog.map((track) => track.id));
  }

  function loopThisOnly() {
    setLoopIds([trackId]);
  }

  if (!hydrated || inNativeApp || hideForTour || !active) return null;

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
        aria-label={playing ? `Stop ${title}` : open ? `Play ${title}` : `Open ${title}`}
        title={playing ? "Stop all music" : fabTitle || title}
      >
        <span className="theme-music-icon" aria-hidden="true">
          {playing ? active.emoji : "🎵"}
        </span>
        {playing && <span className="theme-music-pulse" aria-hidden="true" />}
      </button>

      {open && (
        <div className="theme-music-panel" role="region" aria-label={`${title} controls`}>
          <div className="theme-music-head">
            <strong>{title}</strong>
            <button
              type="button"
              className="theme-music-close"
              onClick={() => setOpen(false)}
              aria-label="Collapse music panel"
            >
              ✕
            </button>
          </div>
          <div className="theme-music-body">
            <p className="theme-music-note">{defaultNote}</p>

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
                aria-label={`Previous ${noun}`}
              >
                ←
              </button>
              <label className="theme-music-select-wrap">
                <span className="sr-only">{noun}</span>
                <select
                  className="theme-music-select"
                  value={trackId}
                  onChange={(e) => selectTrack(e.target.value)}
                  aria-label={`Choose ${noun}`}
                >
                  {catalog.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.emoji} {track.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => nextTrack(1)}
                aria-label={`Next ${noun}`}
              >
                →
              </button>
            </div>

            <div className="theme-music-loop-bar">
              <span>
                Rotate {loopIds.length} of {catalog.length}
              </span>
              <button type="button" className="btn btn-ghost btn-sm" onClick={loopAll}>
                All {noun}s
              </button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={loopThisOnly}>
                This {noun} only
              </button>
            </div>

            <ul className="theme-music-tracks">
              {catalog.map((track) => {
                const on = playing && track.id === trackId;
                const inLoop = loopIds.includes(track.id);
                return (
                  <li
                    key={track.id}
                    className={`theme-music-track ${on ? "playing" : ""} ${track.id === trackId ? "selected" : ""}`}
                  >
                    <label className="theme-music-loop-check">
                      <input
                        type="checkbox"
                        checked={inLoop}
                        onChange={() => toggleLoop(track.id)}
                        aria-label={`Include ${track.name} in the rotation`}
                      />
                    </label>
                    <button
                      type="button"
                      className="theme-music-track-label"
                      onClick={() => (on ? stopTrack(track.id) : playTrack(track.id))}
                    >
                      <span aria-hidden="true">{track.emoji}</span>
                      <span>{track.name}</span>
                      {on ? <span className="theme-music-live">Playing</span> : null}
                    </button>
                    {on ? (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => stopTrack(track.id)}>
                        Stop
                      </button>
                    ) : (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => playTrack(track.id)}>
                        Play
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="theme-music-controls">
            <button type="button" className="btn btn-sm theme-music-stop-all" onClick={stopAll} disabled={!playing}>
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
            <p className="theme-music-credit">{active.credit}</p>
            {error ? <p className="theme-music-error">{error}</p> : null}
          </div>
        </div>
      )}
    </div>
  );
}
