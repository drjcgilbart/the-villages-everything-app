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

async function collectImages(health: HealthLike, date: string, workouts: GymWorkout[]) {
  const snap = buildDaySnapshot(date, health, workouts);
  const out: { bytes: Uint8Array; caption: string; kind: "photo" | "video" }[] = [];
  for (const gym of snap.gyms) {
    for (const media of gym.media || []) {
      if (media.kind === "video") continue;
      try {
        let blob: Blob | null = null;
        if (media.storage === "account" && media.url) {
          const res = await fetch(media.url, { credentials: "include" });
          if (res.ok) blob = await res.blob();
        } else if (media.storage === "phone" && media.localId) {
          blob = await getDeviceMedia(media.localId);
        }
        if (!blob || !blob.type.startsWith("image/")) continue;
        out.push({
          bytes: new Uint8Array(await blob.arrayBuffer()),
          caption: media.name || gym.gymName,
          kind: "photo",
        });
      } catch {
        /* skip */
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
}): Promise<{ recap: DayRecap; source: string }> {
  const snap = buildDaySnapshot(opts.date, opts.health, opts.workouts);
  const res = await fetch("/api/members/space/health/day-recap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ snapshot: snap }),
  });
  const json = (await res.json().catch(() => ({}))) as {
    story?: DayRecapStory;
    source?: string;
    error?: string;
  };
  if (!res.ok) throw new Error(json.error || "Could not write recap");
  const story = json.story;
  if (!story) throw new Error("Empty recap");
  const images = await collectImages(opts.health, opts.date, opts.workouts);
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
    },
  };
}
