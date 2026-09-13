/** Client-only: shrink oversized phone videos enough to upload. */

export const DEFAULT_VIDEO_MAX_BYTES = 18 * 1024 * 1024;
export const PHONE_VIDEO_MAX_BYTES = 60 * 1024 * 1024;

export type PreparedUploadVideo = {
  file: File;
  originalBytes: number;
  compressed: boolean;
};

function even(n: number) {
  return Math.max(2, Math.floor(n / 2) * 2);
}

function pickRecorderMime(): string {
  if (typeof MediaRecorder === "undefined") return "";
  const types = [
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp8",
    "video/webm",
    "video/mp4",
  ];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) || "";
}

function namedVideo(file: File, blob: Blob, mime: string): File {
  const ext = mime.includes("mp4") ? "mp4" : "webm";
  const base = (file.name || "workout").replace(/\.[^.]+$/, "") || "workout";
  return new File([blob], `${base}.${ext}`, {
    type: blob.type || `video/${ext}`,
  });
}

async function loadVideo(
  file: File
): Promise<{ video: HTMLVideoElement; url: string }> {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = url;
  await new Promise<void>((resolve, reject) => {
    const fail = () =>
      reject(new Error("Could not read this video on this phone."));
    video.onloadedmetadata = () => resolve();
    video.onerror = fail;
    window.setTimeout(fail, 20_000);
  });
  return { video, url };
}

async function transcodeVideo(
  file: File,
  maxEdge: number,
  bitsPerSecond: number
): Promise<File> {
  const mime = pickRecorderMime();
  if (!mime) {
    throw new Error(
      "This phone cannot shrink videos. Keep it on this phone, or record a shorter clip."
    );
  }

  const { video, url } = await loadVideo(file);
  try {
    const srcW = video.videoWidth || 1280;
    const srcH = video.videoHeight || 720;
    const scale = Math.min(1, maxEdge / Math.max(srcW, srcH));
    const w = even(srcW * scale);
    const h = even(srcH * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not shrink this video.");

    const canvasStream = canvas.captureStream(24);
    let audioTracks: MediaStreamTrack[] = [];
    try {
      const capture = (
        video as HTMLVideoElement & { captureStream?: () => MediaStream }
      ).captureStream?.();
      audioTracks = capture?.getAudioTracks() ?? [];
    } catch {
      audioTracks = [];
    }

    const mixed = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioTracks,
    ]);
    const rec = new MediaRecorder(mixed, {
      mimeType: mime,
      videoBitsPerSecond: bitsPerSecond,
    });
    const chunks: Blob[] = [];
    rec.ondataavailable = (e) => {
      if (e.data?.size) chunks.push(e.data);
    };

    const stopped = new Promise<Blob>((resolve, reject) => {
      rec.onstop = () =>
        resolve(new Blob(chunks, { type: mime.split(";")[0] }));
      rec.onerror = () => reject(new Error("Video shrink failed."));
      window.setTimeout(
        () => reject(new Error("Video shrink timed out. Try a shorter clip.")),
        120_000
      );
    });

    rec.start(250);
    video.currentTime = 0;
    try {
      await video.play();
    } catch {
      throw new Error("Could not play this video to shrink it.");
    }

    const draw = () => {
      if (video.paused || video.ended) return;
      ctx.drawImage(video, 0, 0, w, h);
      requestAnimationFrame(draw);
    };
    draw();
    await new Promise<void>((resolve, reject) => {
      const t = window.setTimeout(
        () => reject(new Error("Video shrink timed out. Try a shorter clip.")),
        110_000
      );
      video.onended = () => {
        window.clearTimeout(t);
        resolve();
      };
    });
    if (rec.state === "recording") rec.stop();
    canvasStream.getTracks().forEach((t) => t.stop());
    audioTracks.forEach((t) => t.stop());

    const blob = await stopped;
    if (!blob.size) throw new Error("Video shrink produced an empty file.");
    return namedVideo(file, blob, mime);
  } finally {
    video.pause();
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(url);
  }
}

/**
 * Leave small clips alone. Oversized phone videos are re-encoded at a
 * lower resolution until they fit, or we throw so the UI can keep them
 * on-device instead.
 */
export async function prepareUploadVideoFile(
  file: File,
  opts?: { maxBytes?: number }
): Promise<PreparedUploadVideo> {
  const maxBytes = opts?.maxBytes ?? DEFAULT_VIDEO_MAX_BYTES;
  const originalBytes = file.size;
  const name = file.name || "workout.mp4";
  const isVideo =
    file.type.startsWith("video/") || /\.(mp4|mov|webm|m4v)$/i.test(name);
  if (!isVideo) {
    return { file, originalBytes, compressed: false };
  }
  if (originalBytes <= maxBytes) {
    return { file, originalBytes, compressed: false };
  }

  const attempts = [
    { edge: 720, bits: 1_200_000 },
    { edge: 640, bits: 800_000 },
    { edge: 480, bits: 450_000 },
  ];
  let best: File | null = null;
  for (const attempt of attempts) {
    try {
      const out = await transcodeVideo(file, attempt.edge, attempt.bits);
      best = out;
      if (out.size <= maxBytes) {
        return { file: out, originalBytes, compressed: true };
      }
    } catch {
      /* try a smaller pass */
    }
  }

  if (best && best.size < originalBytes && best.size <= maxBytes * 1.12) {
    return { file: best, originalBytes, compressed: true };
  }

  throw new Error(
    `This video is still too large after shrinking (${Math.round(originalBytes / (1024 * 1024))} MB). Keep it on this phone, or record a shorter clip.`
  );
}
