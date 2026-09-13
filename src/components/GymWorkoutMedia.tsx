"use client";

import { useEffect, useRef, useState } from "react";
import { prepareUploadImageFile } from "@/lib/browserImage";
import {
  DEFAULT_VIDEO_MAX_BYTES,
  PHONE_VIDEO_MAX_BYTES,
  prepareUploadVideoFile,
} from "@/lib/browserVideo";
import {
  deleteDeviceMedia,
  deleteDeviceMediaMany,
  getDeviceMedia,
  putDeviceMedia,
} from "@/lib/deviceMediaStore";
import type { GymMediaItem, GymMediaStorage } from "@/lib/memberBoardModel";
import { isNativeAppShell } from "@/lib/nativeAppShell";

const MAX_PHOTOS = 3;

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function sizeLabel(bytes: number) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;
}

export function phoneLocalIds(items: GymMediaItem[]): string[] {
  return items
    .filter((item) => item.storage === "phone" && item.localId)
    .map((item) => item.localId);
}

export async function forgetPhoneMedia(items: GymMediaItem[]) {
  await deleteDeviceMediaMany(phoneLocalIds(items));
}

function useMediaSrc(item: GymMediaItem): string {
  const [src, setSrc] = useState(item.storage === "account" ? item.url : "");

  useEffect(() => {
    if (item.storage === "account") {
      setSrc(item.url);
      return;
    }
    let revoked = "";
    let cancelled = false;
    getDeviceMedia(item.localId)
      .then((blob) => {
        if (cancelled) return;
        if (!blob) {
          setSrc("");
          return;
        }
        revoked = URL.createObjectURL(blob);
        setSrc(revoked);
      })
      .catch(() => {
        if (!cancelled) setSrc("");
      });
    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [item.storage, item.url, item.localId]);

  return src;
}

function Thumb({
  item,
  onRemove,
}: {
  item: GymMediaItem;
  onRemove?: () => void;
}) {
  const src = useMediaSrc(item);
  const missing =
    item.storage === "phone"
      ? "This file stays on the phone that saved it."
      : "Photo missing";
  return (
    <figure className="ms-gym-media-thumb">
      {item.kind === "video" && src ? (
        <video src={src} controls playsInline preload="metadata" />
      ) : src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={item.name || "Workout photo"} />
      ) : (
        <div className="ms-photo-missing">{missing}</div>
      )}
      <span className="ms-gym-media-badge">
        {item.storage === "phone" ? "This phone" : "Account"}
        {item.bytes ? ` · ${sizeLabel(item.bytes)}` : ""}
      </span>
      {onRemove ? (
        <button
          type="button"
          className="btn btn-ghost btn-sm ms-gym-media-remove"
          onClick={onRemove}
        >
          Remove
        </button>
      ) : null}
    </figure>
  );
}

export function GymWorkoutMediaStrip({ items }: { items: GymMediaItem[] }) {
  if (!items.length) return null;
  return (
    <div className="ms-gym-media-grid ms-gym-media-grid-view">
      {items.map((item) => (
        <Thumb key={item.id} item={item} />
      ))}
    </div>
  );
}

export function GymWorkoutMediaPicker({
  items,
  onChange,
  protectedLocalIds = [],
  disabled,
}: {
  items: GymMediaItem[];
  onChange: (next: GymMediaItem[]) => void;
  /** Already-saved phone files — do not wipe them until the workout is saved or deleted. */
  protectedLocalIds?: string[];
  disabled?: boolean;
}) {
  const native = isNativeAppShell();
  const photosRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [storage, setStorage] = useState<GymMediaStorage>("account");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const hasVideo = items.some((item) => item.kind === "video");
  const photoCount = items.filter((item) => item.kind === "photo").length;
  const canAddPhoto = !hasVideo && photoCount < MAX_PHOTOS;
  const canAddVideo = items.length === 0;

  async function addFiles(list: FileList | null, forceKind?: "photo" | "video") {
    const files = [...(list || [])];
    if (!files.length) return;
    setBusy(true);
    setErr(null);
    setNote(null);
    const next = [...items];
    try {
      for (const file of files) {
        const asVideo =
          forceKind === "video" ||
          file.type.startsWith("video/") ||
          /\.(mp4|mov|webm|m4v)$/i.test(file.name);
        if (asVideo) {
          if (next.length > 0) {
            throw new Error("Remove photos first to add a video (one video or up to 3 photos).");
          }
          setNote("Shrinking video if needed…");
          const maxBytes =
            storage === "phone" ? PHONE_VIDEO_MAX_BYTES : DEFAULT_VIDEO_MAX_BYTES;
          let prepared = { file, originalBytes: file.size, compressed: false };
          try {
            prepared = await prepareUploadVideoFile(file, { maxBytes });
          } catch (e) {
            if (storage === "phone" && file.size <= PHONE_VIDEO_MAX_BYTES) {
              setNote("Could not shrink this clip; keeping the original on this phone.");
            } else if (storage === "account") {
              throw new Error(
                `${e instanceof Error ? e.message : "Video is too large."} Switch to “Keep on this phone” if you still want to attach it.`
              );
            } else {
              throw e;
            }
          }
          const send = prepared.file;
          const item = await persistFile(send, "video", storage, prepared);
          next.push(item);
          onChange([...next]);
          setNote(
            prepared.compressed
              ? `Video shrunk ${sizeLabel(prepared.originalBytes)} → ${sizeLabel(send.size)}.`
              : storage === "phone"
                ? "Video kept on this phone."
                : "Video uploaded to your account."
          );
          break;
        }

        if (next.some((item) => item.kind === "video")) {
          throw new Error("Remove the video first to add photos.");
        }
        if (next.filter((item) => item.kind === "photo").length >= MAX_PHOTOS) {
          throw new Error("Maximum 3 photos per workout.");
        }
        setNote("Shrinking photo if needed…");
        const prepared = await prepareUploadImageFile(file);
        const send = prepared.file;
        const item = await persistFile(send, "photo", storage, prepared);
        next.push(item);
        onChange([...next]);
        setNote(
          prepared.compressed
            ? `Photo shrunk ${sizeLabel(prepared.originalBytes)} → ${sizeLabel(send.size)}.`
            : storage === "phone"
              ? "Photo kept on this phone."
              : "Photo uploaded to your account."
        );
      }
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not add that file");
    } finally {
      setBusy(false);
      if (photosRef.current) photosRef.current.value = "";
      if (cameraRef.current) cameraRef.current.value = "";
      if (videoRef.current) videoRef.current.value = "";
    }
  }

  async function persistFile(
    file: File,
    kind: "photo" | "video",
    dest: GymMediaStorage,
    prepared: { compressed: boolean }
  ): Promise<GymMediaItem> {
    if (dest === "phone") {
      const localId = uid("gymloc");
      await putDeviceMedia(localId, file, {
        name: file.name || (kind === "video" ? "workout.mp4" : "workout.jpg"),
        type: file.type,
      });
      return {
        id: uid("gm"),
        kind,
        storage: "phone",
        name: (file.name || kind).slice(0, 80),
        url: "",
        localId,
        bytes: file.size,
      };
    }

    setNote(
      prepared.compressed
        ? `Uploading (${sizeLabel(file.size)})…`
        : "Uploading…"
    );
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/members/space/gym/upload", {
      method: "POST",
      credentials: "include",
      body: fd,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Upload failed");
    return {
      id: uid("gm"),
      kind: json.type === "video" ? "video" : "photo",
      storage: "account",
      name: String(json.name || file.name || kind).slice(0, 80),
      url: String(json.url || ""),
      localId: "",
      bytes: file.size,
    };
  }

  async function removeItem(id: string) {
    const target = items.find((item) => item.id === id);
    onChange(items.filter((item) => item.id !== id));
    if (
      target?.storage === "phone" &&
      target.localId &&
      !protectedLocalIds.includes(target.localId)
    ) {
      await deleteDeviceMedia(target.localId).catch(() => undefined);
    }
  }

  return (
    <div className="ms-gym-media">
      <h4>Photos or a video</h4>
      <p className="panel-hint">
        Up to 3 photos, or 1 short video — not both. Large phone files shrink automatically so they
        can upload. Or keep them on this phone only (they will not show on other devices).
      </p>
      {native ? (
        <p className="panel-hint">
          You&apos;re in the phone app. Camera Roll is enough — we shrink first, then upload or keep
          the file here.
        </p>
      ) : null}

      <div className="ms-photo-chips" role="radiogroup" aria-label="Where to save workout media">
        <button
          type="button"
          role="radio"
          aria-checked={storage === "account"}
          className={`ms-photo-chip${storage === "account" ? " is-on" : ""}`}
          onClick={() => setStorage("account")}
          disabled={busy || disabled}
        >
          Save to my account
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={storage === "phone"}
          className={`ms-photo-chip${storage === "phone" ? " is-on" : ""}`}
          onClick={() => setStorage("phone")}
          disabled={busy || disabled}
        >
          Keep on this phone
        </button>
      </div>
      <p className="panel-hint">
        {storage === "phone"
          ? "Stays in this phone’s storage. Signing in elsewhere will not show it."
          : "Follows this membership on the website and the store apps."}
      </p>

      <div className="hero-actions" style={{ marginTop: "0.55rem" }}>
        <button
          type="button"
          className="btn btn-primary btn-sm"
          disabled={busy || disabled || !canAddPhoto}
          onClick={() => photosRef.current?.click()}
        >
          Add photos
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={busy || disabled || !canAddPhoto}
          onClick={() => cameraRef.current?.click()}
        >
          Take a photo
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          disabled={busy || disabled || !canAddVideo}
          onClick={() => videoRef.current?.click()}
        >
          Add a video
        </button>
      </div>
      <input
        ref={photosRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => void addFiles(e.target.files, "photo")}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => void addFiles(e.target.files, "photo")}
      />
      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        hidden
        onChange={(e) => void addFiles(e.target.files, "video")}
      />

      {busy ? <p className="panel-hint">{note || "Working…"}</p> : null}
      {!busy && note ? <p className="panel-hint">{note}</p> : null}
      {err ? <p className="pf-form-error">{err}</p> : null}

      {items.length ? (
        <div className="ms-gym-media-grid">
          {items.map((item) => (
            <Thumb
              key={item.id}
              item={item}
              onRemove={busy || disabled ? undefined : () => void removeItem(item.id)}
            />
          ))}
        </div>
      ) : (
        <p className="panel-hint">No photo or video on this workout yet.</p>
      )}
    </div>
  );
}
