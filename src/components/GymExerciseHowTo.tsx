"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  exerciseImageUrl,
  lookupExerciseDemo,
} from "@/lib/gymExerciseDemos";

export function GymExerciseHowTo({ name }: { name: string }) {
  const [pics, setPics] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<"idle" | "loading" | "ready" | "missing">(
    "idle"
  );
  const demo = lookupExerciseDemo(name);
  const label = demo?.name || name.trim();
  const stills = (demo?.images || []).slice(0, 2);

  useEffect(() => {
    if (!videoOpen || !label) return;
    let cancelled = false;
    setVideoStatus("loading");
    setVideoId(null);
    fetch(`/api/gym/video?q=${encodeURIComponent(label)}`)
      .then((res) => res.json())
      .then((j: { id?: string | null }) => {
        if (cancelled) return;
        if (j.id) {
          setVideoId(j.id);
          setVideoStatus("ready");
        } else setVideoStatus("missing");
      })
      .catch(() => {
        if (!cancelled) setVideoStatus("missing");
      });
    return () => {
      cancelled = true;
    };
  }, [videoOpen, label]);

  useEffect(() => {
    if (!videoOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVideoOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [videoOpen]);

  if (!label) return null;

  const popup =
    videoOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            className="ms-gym-video-scrim"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ms-gym-video-title"
            onClick={() => setVideoOpen(false)}
          >
            <div
              className="ms-gym-video-sheet"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="ms-gym-video-bar">
                <h3 id="ms-gym-video-title">{label}</h3>
                <button
                  type="button"
                  className="ms-gym-video-close"
                  onClick={() => setVideoOpen(false)}
                >
                  Close
                </button>
              </div>
              {videoStatus === "loading" ? (
                <p className="panel-hint">Loading a form video…</p>
              ) : null}
              {videoStatus === "ready" && videoId ? (
                <div className="ms-gym-video-frame">
                  <iframe
                    title={`${label} form video`}
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&rel=0&modestbranding=1`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                    allowFullScreen
                  />
                </div>
              ) : null}
              {videoStatus === "missing" ? (
                <p className="panel-hint">
                  Couldn’t load a video in this window. Use Pictures for the
                  stills, or try again.
                </p>
              ) : null}
              {stills.length && videoStatus !== "ready" ? (
                <div className="ms-gym-stills">
                  {stills.map((path) => (
                    <img
                      key={path}
                      src={exerciseImageUrl(path)}
                      alt={`${label} demonstration`}
                    />
                  ))}
                </div>
              ) : null}
              <button
                type="button"
                className="btn btn-primary ms-gym-video-done"
                onClick={() => setVideoOpen(false)}
              >
                Done — back to workout
              </button>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div className="ms-gym-howto">
      <button
        type="button"
        className="ms-gym-video-btn"
        onClick={() => setVideoOpen(true)}
      >
        ▶ Video
      </button>
      {stills.length ? (
        <button
          type="button"
          className="ms-gym-stills-btn"
          onClick={() => setPics((v) => !v)}
          aria-expanded={pics}
        >
          {pics ? "Hide pictures" : "Pictures"}
        </button>
      ) : null}
      {pics && stills.length ? (
        <div className="ms-gym-stills">
          {stills.map((path) => (
            <img
              key={path}
              src={exerciseImageUrl(path)}
              alt={`${label} demonstration`}
              width={160}
              height={160}
            />
          ))}
          {demo?.steps?.length ? (
            <ol>
              {demo.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          ) : null}
        </div>
      ) : null}
      {popup}
    </div>
  );
}
