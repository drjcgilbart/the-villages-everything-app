"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  exerciseImageUrl,
  lookupExerciseDemo,
} from "@/lib/gymExerciseDemos";

export function GymExerciseHowTo({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [frame, setFrame] = useState(0);
  const demo = lookupExerciseDemo(name);
  const label = demo?.name || name.trim();
  const stills = (demo?.images || []).slice(0, 2);

  useEffect(() => {
    if (!open || stills.length < 2) return;
    const id = window.setInterval(() => {
      setFrame((n) => (n + 1) % stills.length);
    }, 900);
    return () => window.clearInterval(id);
  }, [open, stills.length]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!label) return null;

  const popup =
    open && typeof document !== "undefined"
      ? createPortal(
          <div
            className="ms-gym-video-scrim"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ms-gym-video-title"
            onClick={() => setOpen(false)}
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
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
              {stills.length ? (
                <div className="ms-gym-video-stage">
                  <img
                    src={exerciseImageUrl(stills[frame] || stills[0])}
                    alt={`${label} demonstration`}
                  />
                  {stills.length > 1 ? (
                    <p className="panel-hint">Playing the two demo stills as a loop.</p>
                  ) : null}
                </div>
              ) : (
                <p className="panel-hint">No demo pictures for this move yet.</p>
              )}
              {demo?.steps?.length ? (
                <ol className="ms-gym-video-steps">
                  {demo.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              ) : null}
              <button
                type="button"
                className="btn btn-primary ms-gym-video-done"
                onClick={() => setOpen(false)}
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
        onClick={() => {
          setFrame(0);
          setOpen(true);
        }}
      >
        ▶ Video
      </button>
      {popup}
    </div>
  );
}
