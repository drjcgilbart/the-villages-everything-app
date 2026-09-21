"use client";

import { useState } from "react";
import {
  exerciseImageUrl,
  exerciseVideoUrl,
  lookupExerciseDemo,
} from "@/lib/gymExerciseDemos";

export function GymExerciseHowTo({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const demo = lookupExerciseDemo(name);
  const label = demo?.name || name.trim();
  if (!label) return null;
  const video = exerciseVideoUrl(label);
  const stills = (demo?.images || []).slice(0, 2);

  return (
    <div className="ms-gym-howto">
      <a
        className="ms-gym-video-btn"
        href={video}
        target="_blank"
        rel="noopener noreferrer"
      >
        ▶ Video
      </a>
      {stills.length ? (
        <button
          type="button"
          className="ms-gym-stills-btn"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          {open ? "Hide pictures" : "Pictures"}
        </button>
      ) : null}
      {open && stills.length ? (
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
          <p className="panel-hint">
            Stills from the public-domain Free Exercise DB. Video opens a YouTube
            search for proper form.
          </p>
        </div>
      ) : null}
    </div>
  );
}
