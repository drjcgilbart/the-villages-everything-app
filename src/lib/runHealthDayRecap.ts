"use client";

import { buildHealthDayPdf } from "./healthDayPdf";
import { getDeviceMedia } from "./deviceMediaStore";
import {
  buildDaySnapshot,
  type DayRecap,
  type DayRecapStory,
  type HealthLike,
} from "./healthDayRecap";
import type { GymWorkout } from "./memberBoardModel";
import { uid } from "./mySpaceStorage";

const GROK_PREF = "tvea-ms-day-use-grok";

export function readUseGrok(): boolean {
  try {
    return localStorage.getItem(GROK_PREF) === "1";
  } catch {
    return false;
  }
}

export function writeUseGrok(on: boolean) {
  try {
    localStorage.setItem(GROK_PREF, on ? "1" : "0");
  } catch {
    /* ignore */
  }
}

async function blobToJpegBytes(blob: Blob): Promise<Uint8Array | null> {
  try {
    const bmp = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    const max = 1400;
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height, 1));
    canvas.width = Math.max(1, Math.round(bmp.width * scale));
    canvas.height = Math.max(1, Math.round(bmp.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const jpeg = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/jpeg", 0.84)
    );
    if (!jpeg) return null;
    return new Uint8Array(await jpeg.arrayBuffer());
  } catch {
    return null;
  }
}

function recapPhotoMeta(workouts: GymWorkout[], date: string): DayRecap["photos"] {
  const out: DayRecap["photos"] = [];
  for (const w of workouts) {
    if (w.date !== date) continue;
    for (const media of w.media || []) {
      if (media.kind === "video") continue;
      if (!media.url && !media.localId) continue;
      out.push({
        url: media.url || "",
        localId: media.localId || "",
        caption: media.name || w.gymName || "Workout photo",
      });
      if (out.length >= 6) return out;
    }
  }
  return out;
}

async function collectImages(date: string, workouts: GymWorkout[]) {
  const out: { bytes: Uint8Array; caption: string; kind: "photo" | "video" }[] = [];
  for (const gym of workouts) {
    if (gym.date !== date) continue;
    for (const media of gym.media || []) {
      if (media.kind === "video") continue;
      try {
        let blob: Blob | null = null;
        if (media.storage === "account" && media.url) {
          const res = await fetch(media.url, { credentials: "include" });
          if (res.ok) blob = await res.blob();
        } else if (media.localId) {
          blob = await getDeviceMedia(media.localId);
        }
        if (!blob) continue;
        const jpeg = await blobToJpegBytes(blob);
        if (!jpeg) continue;
        out.push({
          bytes: jpeg,
          caption: media.name || gym.gymName,
          kind: "photo",
        });
      } catch {
        /* skip a bad file */
      }
      if (out.length >= 6) return out;
    }
  }
  return out;
}

export async function runHealthDayRecap(opts: {
  date: string;
  health: HealthLike;
  workouts: GymWorkout[];
  auto?: boolean;
  favorite?: boolean;
  useGrok?: boolean;
}): Promise<{ recap: DayRecap; source: string; grokConfigured?: boolean }> {
  const snap = buildDaySnapshot(opts.date, opts.health, opts.workouts);
  const useGrok = opts.useGrok ?? readUseGrok();
  const res = await fetch("/api/members/space/health/day-recap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ snapshot: snap, useGrok }),
  });
  const json = (await res.json().catch(() => ({}))) as {
    story?: DayRecapStory;
    source?: string;
    error?: string;
    grokConfigured?: boolean;
  };
  if (!res.ok) throw new Error(json.error || "Could not write recap");
  const story = json.story;
  if (!story) throw new Error("Empty recap");
  const images = await collectImages(opts.date, opts.workouts);
  const pdfBytes = await buildHealthDayPdf(story, snap, images);
  const file = new File([new Uint8Array(pdfBytes)], `my-day-${opts.date}.pdf`, {
    type: "application/pdf",
  });
  const fd = new FormData();
  fd.append("file", file);
  const up = await fetch("/api/members/space/health/day-recap/upload", {
    method: "POST",
    credentials: "include",
    body: fd,
  });
  const upJson = (await up.json().catch(() => ({}))) as { url?: string; error?: string };
  if (!up.ok) throw new Error(upJson.error || "Could not save PDF");
  return {
    source: json.source || "local",
    grokConfigured: json.grokConfigured,
    recap: {
      id: uid("recap"),
      date: opts.date,
      generatedAt: new Date().toISOString(),
      auto: !!opts.auto,
      favorite: !!opts.favorite,
      title: story.title,
      headline: story.headline,
      article: story.article,
      highlights: story.highlights,
      improve: story.improve,
      bestMoment: story.bestMoment,
      closer: story.closer,
      pdfUrl: String(upJson.url || ""),
      mood: snap.journals[0]?.mood || "",
      photos: recapPhotoMeta(opts.workouts, opts.date),
    },
  };
}
