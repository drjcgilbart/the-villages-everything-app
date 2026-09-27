"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Photo, Post, PostType, SiteContent, Video, VideoSource } from "@/lib/types";
import { prepareStudioImageFile } from "@/lib/browserImage";
import { isPdfMediaUrl, isPdfUpload } from "@/lib/mediaKind";
import { parseBodyChunks, serializeBodyChunks, type BodyChunk } from "@/lib/postDraft";
import { AdminCreatorDesk } from "@/components/AdminCreatorDesk";
import { PdfLinkCard } from "@/components/PdfLinkCard";
import type { DeskWebsite } from "@/lib/creatorDeskTypes";
type Tab = "posts" | "videos" | "photos" | "channel";

type PostForm = {
  id: string;
  type: PostType;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  tags: string;
  images: PhotoFormImage[];
  featuredImageId: string;
  featured: boolean;
};

type VideoForm = {
  id: string;
  title: string;
  description: string;
  source: VideoSource;
  youtubeId: string;
  videoUrl: string;
  thumbnailUrl: string;
  tags: string;
  featured: boolean;
};

type PhotoFormImage = {
  id: string;
  url: string;
  caption: string;
};

function firstPictureId(images: PhotoFormImage[], preferred?: string) {
  if (
    preferred &&
    images.some((img) => img.id === preferred && !isPdfMediaUrl(img.url))
  ) {
    return preferred;
  }
  return images.find((img) => !isPdfMediaUrl(img.url))?.id || "";
}

type PhotoForm = {
  id: string;
  title: string;
  caption: string;
  images: PhotoFormImage[];
  featuredImageId: string;
  tags: string;
  featured: boolean;
};

const emptyPost: PostForm = {
  id: "",
  type: "blog",
  title: "",
  slug: "",
  excerpt: "",
  body: "",
  tags: "",
  images: [],
  featuredImageId: "",
  featured: false,
};

const emptyVideo: VideoForm = {
  id: "",
  title: "",
  description: "",
  source: "youtube",
  youtubeId: "",
  videoUrl: "",
  thumbnailUrl: "",
  tags: "",
  featured: false,
};

const emptyPhoto: PhotoForm = {
  id: "",
  title: "",
  caption: "",
  images: [],
  featuredImageId: "",
  tags: "",
  featured: false,
};

function photoImagesFromEntry(p: Photo): PhotoFormImage[] {
  if (Array.isArray(p.images) && p.images.length) {
    return p.images
      .filter((i) => i?.url)
      .map((i) => ({
        id: i.id,
        url: i.url,
        caption: i.caption || "",
      }));
  }
  if (p.imageUrl) {
    return [{ id: "legacy", url: p.imageUrl, caption: "" }];
  }
  return [];
}

export function AdminStudio() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("posts");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [postForm, setPostForm] = useState<PostForm>(emptyPost);
  const [videoForm, setVideoForm] = useState<VideoForm>(emptyVideo);
  const [photoForm, setPhotoForm] = useState<PhotoForm>(emptyPhoto);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [filling, setFilling] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const [chunks, setChunks] = useState<BodyChunk[]>([{ kind: "text", text: "" }]);
  const [activeChunk, setActiveChunk] = useState(0);
  const [tableAsk, setTableAsk] = useState<{ rows: string; cols: string } | null>(null);
  const [ytPulling, setYtPulling] = useState(false);

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 8000);
  };

  useEffect(() => {
    const body = serializeBodyChunks(chunks);
    setPostForm((current) => (current.body === body ? current : { ...current, body }));
  }, [chunks]);

  useEffect(() => {
    if (!tableAsk) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTableAsk(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tableAsk]);

  function loadStory(body: string) {
    setChunks(parseBodyChunks(body));
    setActiveChunk(0);
  }

  function clearStory() {
    setChunks([{ kind: "text", text: "" }]);
    setActiveChunk(0);
    setPostForm(emptyPost);
  }

  useEffect(() => {
    if (!msg) return;
    document
      .getElementById("studio-status-msg")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [msg]);

  const statusBanner = msg ? (
    <div
      id="studio-status-msg"
      className={`msg msg-${msg.kind} studio-status-msg`}
      role="status"
      aria-live="polite"
    >
      {msg.text}
    </div>
  ) : null;

  const refresh = useCallback(async () => {
    const res = await fetch("/api/content", { cache: "no-store" });
    const data = await res.json();
    setContent(data);
  }, []);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((d) => setAuthed(!!d.authenticated))
      .catch(() => setAuthed(false));
  }, []);

  useEffect(() => {
    if (authed) refresh().catch(() => flash("err", "Could not load content"));
  }, [authed, refresh]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Login failed");
      setAuthed(true);
      setPassword("");
      flash("ok", "Welcome to the Studio");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthed(false);
    setContent(null);
  }

  async function savePost(e: React.FormEvent) {
    e.preventDefault();
    if (!serializeBodyChunks(chunks).trim()) {
      flash("err", "Write the story in the body first.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setContent(data);
      clearStory();
      flash("ok", postForm.id ? "Post updated" : "Post published");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function saveVideo(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(videoForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setContent(data);
      setVideoForm(emptyVideo);
      flash("ok", videoForm.id ? "Video updated" : "Video published");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function removePost(id: string) {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/posts?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) return flash("err", data.error || "Delete failed");
    setContent(data);
    if (postForm.id === id) clearStory();
    flash("ok", "Post deleted");
  }

  async function removeVideo(id: string) {
    if (!confirm("Delete this video?")) return;
    const res = await fetch(`/api/videos?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) return flash("err", data.error || "Delete failed");
    setContent(data);
    if (videoForm.id === id) setVideoForm(emptyVideo);
    flash("ok", "Video deleted");
  }

  async function savePhoto(e: React.FormEvent) {
    e.preventDefault();
    if (!photoForm.images.length) {
      flash("err", "Upload at least one photo");
      return;
    }
    setBusy(true);
    try {
      const featuredImageId =
        photoForm.featuredImageId &&
        photoForm.images.some((i) => i.id === photoForm.featuredImageId)
          ? photoForm.featuredImageId
          : photoForm.images[0].id;
      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: photoForm.id || undefined,
          title: photoForm.title,
          caption: photoForm.caption,
          tags: photoForm.tags,
          featured: photoForm.featured,
          featuredImageId,
          images: photoForm.images,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setContent(data);
      setPhotoForm(emptyPhoto);
      flash("ok", photoForm.id ? "Photo entry updated" : "Photo entry published");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function removePhoto(id: string) {
    if (!confirm("Delete this photo?")) return;
    const res = await fetch(`/api/photos?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) return flash("err", data.error || "Delete failed");
    setContent(data);
    if (photoForm.id === id) setPhotoForm(emptyPhoto);
    flash("ok", "Photo deleted");
  }

  function editPost(p: Post) {
    setTab("posts");
    const images = Array.isArray(p.images)
      ? p.images
          .filter((img) => img?.url)
          .map((img) => ({
            id: img.id,
            url: img.url,
            caption: img.caption || "",
          }))
      : [];
    setPostForm({
      id: p.id,
      type: p.type,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      body: p.body,
      tags: (p.tags || []).join(", "),
      images,
      featuredImageId: firstPictureId(images, p.featuredImageId),
      featured: !!p.featured,
    });
    loadStory(p.body || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function useWebsiteDraft(draft: DeskWebsite) {
    setTab("posts");
    setPostForm({
      ...emptyPost,
      type: "blog",
      title: draft.title || "",
      slug: draft.slug || "",
      excerpt: draft.excerpt || "",
      body: draft.body || "",
      tags: (draft.tags || []).join(", "),
    });
    loadStory(draft.body || "");
    flash("ok", "Website draft is in the blog form. Add pictures, then publish.");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editVideo(v: Video) {
    setTab("videos");
    setVideoForm({
      id: v.id,
      title: v.title,
      description: v.description,
      source: v.source,
      youtubeId: v.youtubeId || "",
      videoUrl: v.videoUrl || "",
      thumbnailUrl: v.thumbnailUrl || "",
      tags: (v.tags || []).join(", "),
      featured: !!v.featured,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function editPhoto(p: Photo) {
    setTab("photos");
    const images = photoImagesFromEntry(p);
    setPhotoForm({
      id: p.id,
      title: p.title,
      caption: p.caption || "",
      images,
      featuredImageId:
        p.featuredImageId && images.some((i) => i.id === p.featuredImageId)
          ? p.featuredImageId
          : images[0]?.id || "",
      tags: (p.tags || []).join(", "),
      featured: !!p.featured,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function pullYouTube() {
    setYtPulling(true);
    try {
      const res = await fetch("/api/videos/youtube-refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "YouTube pull failed");
      const latest = data.latest?.title ? ` Latest: ${data.latest.title}.` : "";
      flash(
        "ok",
        `YouTube synced (${data.count || 0} on the channel).${latest} They appear on My Retirement Reboot → Videos.`
      );
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "YouTube pull failed");
    } finally {
      setYtPulling(false);
    }
  }

  async function onUpload(file: File | null, kind: "video" | "thumb" | "photo") {
    if (!file) return;
    setUploading(true);
    try {
      const ready =
        kind === "video" ? file : await prepareStudioImageFile(file);
      const fd = new FormData();
      fd.append("file", ready);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (kind === "video") {
        setVideoForm((f) => ({
          ...f,
          source: "upload",
          videoUrl: data.url,
        }));
      } else if (kind === "photo") {
        const newImg: PhotoFormImage = {
          id: `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          url: data.url,
          caption: "",
        };
        setPhotoForm((f) => ({
          ...f,
          images: [...f.images, newImg],
          featuredImageId: f.featuredImageId || newImg.id,
        }));
      } else {
        setVideoForm((f) => ({ ...f, thumbnailUrl: data.url }));
      }
      flash("ok", "Upload complete");
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onUploadManyPhotos(fileList: FileList | null) {
    if (!fileList?.length) return;
    setUploading(true);
    try {
      const added: PhotoFormImage[] = [];
      for (const file of Array.from(fileList)) {
        const ready = await prepareStudioImageFile(file);
        const fd = new FormData();
        fd.append("file", ready);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Upload failed: ${file.name}`);
        added.push({
          id: `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          url: data.url,
          caption: "",
        });
      }
      setPhotoForm((f) => ({
        ...f,
        images: [...f.images, ...added],
        featuredImageId: f.featuredImageId || added[0]?.id || "",
      }));
      flash("ok", added.length === 1 ? "Photo uploaded" : `${added.length} photos uploaded`);
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function onUploadPostPhotos(fileList: FileList | null) {
    if (!fileList?.length) return;
    setUploading(true);
    try {
      const added: PhotoFormImage[] = [];
      let pdfCount = 0;
      for (const file of Array.from(fileList)) {
        const pdf = isPdfUpload(file);
        if (pdf) pdfCount += 1;
        const ready = pdf ? file : await prepareStudioImageFile(file);
        const fd = new FormData();
        fd.append("file", ready);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Upload failed: ${file.name}`);
        added.push({
          id: `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          url: data.url,
          caption: "",
        });
      }
      setPostForm((f) => {
        const images = [...f.images, ...added];
        return {
          ...f,
          images,
          featuredImageId: firstPictureId(images, f.featuredImageId),
        };
      });
      const pictureCount = added.length - pdfCount;
      const parts = [
        pictureCount ? `${pictureCount} picture${pictureCount === 1 ? "" : "s"}` : "",
        pdfCount ? `${pdfCount} PDF${pdfCount === 1 ? "" : "s"}` : "",
      ].filter(Boolean);
      flash("ok", `${parts.join(" and ")} uploaded`);
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function removePostImage(imageId: string) {
    setPostForm((f) => {
      const images = f.images.filter((img) => img.id !== imageId);
      return {
        ...f,
        images,
        featuredImageId: firstPictureId(
          images,
          f.featuredImageId === imageId ? "" : f.featuredImageId
        ),
      };
    });
    setChunks((prev) =>
      parseBodyChunks(
        serializeBodyChunks(prev)
          .split(`[[photo:${imageId}]]`)
          .join("")
          .replace(/\n{3,}/g, "\n\n")
      )
    );
  }

  function confirmTable() {
    const rows = Math.min(24, Math.max(2, Math.floor(Number(tableAsk?.rows))));
    const cols = Math.min(6, Math.max(1, Math.floor(Number(tableAsk?.cols))));
    if (!Number.isFinite(rows) || !Number.isFinite(cols)) {
      flash("err", "Enter how many rows and columns you want.");
      return;
    }
    const grid = Array.from({ length: rows }, () => Array.from({ length: cols }, () => ""));
    setChunks((prev) => {
      const next = prev.map((chunk) =>
        chunk.kind === "text"
          ? { kind: "text" as const, text: chunk.text }
          : { kind: "table" as const, rows: chunk.rows.map((row) => row.slice()) }
      );
      const index = next[activeChunk]?.kind === "text" ? activeChunk : next.findIndex((chunk) => chunk.kind === "text");
      const at = index >= 0 ? index : next.length;
      const chunk = next[at];
      if (!chunk || chunk.kind !== "text") {
        next.push({ kind: "table", rows: grid });
        next.push({ kind: "text", text: "" });
        return next;
      }
      const el = bodyRef.current;
      const start = el && activeChunk === at ? el.selectionStart : chunk.text.length;
      const end = el && activeChunk === at ? el.selectionEnd : start;
      next.splice(
        at,
        1,
        { kind: "text", text: chunk.text.slice(0, start) },
        { kind: "table", rows: grid },
        { kind: "text", text: chunk.text.slice(end) }
      );
      return next;
    });
    setTableAsk(null);
  }

  function setChunkText(index: number, text: string) {
    setChunks((prev) =>
      prev.map((chunk, i) => (i === index && chunk.kind === "text" ? { kind: "text", text } : chunk))
    );
  }

  function setTableCell(chunkIndex: number, rowIndex: number, colIndex: number, value: string) {
    const clean = value.replace(/\|/g, "/");
    setChunks((prev) =>
      prev.map((chunk, i) => {
        if (i !== chunkIndex || chunk.kind !== "table") return chunk;
        return {
          kind: "table",
          rows: chunk.rows.map((row, r) =>
            r === rowIndex ? row.map((cell, c) => (c === colIndex ? clean : cell)) : row
          ),
        };
      })
    );
  }

  function pasteTable(chunkIndex: number, rowIndex: number, colIndex: number, text: string) {
    if (!text.includes("\t") && !text.includes("\n")) return false;
    const grid = text
      .replace(/\r/g, "")
      .split("\n")
      .map((line) => line.split("\t"));
    if (grid.length && grid[grid.length - 1].length === 1 && grid[grid.length - 1][0] === "") {
      grid.pop();
    }
    if (!grid.length) return false;
    setChunks((prev) =>
      prev.map((chunk, i) => {
        if (i !== chunkIndex || chunk.kind !== "table") return chunk;
        const pastedWidth = Math.max(...grid.map((row) => row.length));
        const width = Math.min(6, Math.max(chunk.rows[0]?.length || 1, colIndex + pastedWidth));
        const height = Math.min(24, Math.max(chunk.rows.length, rowIndex + grid.length));
        const rows = Array.from({ length: height }, (_, r) => {
          const existing = chunk.rows[r] || [];
          return Array.from({ length: width }, (_, c) => {
            const sourceRow = r - rowIndex;
            const sourceCol = c - colIndex;
            if (sourceRow >= 0 && sourceRow < grid.length && sourceCol >= 0 && sourceCol < grid[sourceRow].length) {
              return grid[sourceRow][sourceCol].replace(/\|/g, "/");
            }
            return existing[c] || "";
          });
        });
        return { kind: "table", rows };
      })
    );
    return true;
  }

  function removeTable(index: number) {
    setChunks((prev) => {
      const merged: BodyChunk[] = [];
      prev.forEach((chunk, i) => {
        if (i === index) return;
        const last = merged[merged.length - 1];
        if (chunk.kind === "text" && last?.kind === "text") {
          last.text += chunk.text;
          return;
        }
        merged.push(
          chunk.kind === "text"
            ? { kind: "text", text: chunk.text }
            : { kind: "table", rows: chunk.rows.map((row) => row.slice()) }
        );
      });
      return merged.length ? merged : [{ kind: "text", text: "" }];
    });
  }

  function placePictureInStory(imageId: string) {
    const token = `[[photo:${imageId}]]`;
    setChunks((prev) => {
      if (serializeBodyChunks(prev).includes(token)) return prev;
      const next = prev.map((chunk) =>
        chunk.kind === "text"
          ? { kind: "text" as const, text: chunk.text }
          : { kind: "table" as const, rows: chunk.rows.map((row) => row.slice()) }
      );
      let index = next.length - 1;
      while (index >= 0 && next[index].kind !== "text") index -= 1;
      if (index < 0) {
        next.push({ kind: "text", text: `${token}\n` });
        return next;
      }
      const chunk = next[index];
      if (chunk.kind !== "text") return next;
      next[index] = {
        kind: "text",
        text: chunk.text.trim() ? `${chunk.text.trim()}\n\n${token}\n` : `${token}\n`,
      };
      return next;
    });
  }

  async function fillFromStory() {
    if (postForm.body.trim().length < 20) {
      flash("err", "Write the story in the body first. A sentence or two is enough to start.");
      return;
    }
    setFilling(true);
    try {
      const res = await fetch("/api/posts/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: postForm.title, body: postForm.body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not fill the fields");
      setPostForm((f) => ({
        ...f,
        title: f.title.trim() ? f.title : String(data.title || ""),
        slug: String(data.slug || ""),
        excerpt: String(data.excerpt || ""),
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : f.tags,
      }));
      flash(
        "ok",
        data.source === "grok"
          ? "Slug, excerpt, and tags are filled from the story. Change anything that does not sound like you."
          : "Slug, excerpt, and tags are filled from the story. Grok was not used, so the wording is simple."
      );
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Could not fill the fields");
    } finally {
      setFilling(false);
    }
  }

  function removePhotoImage(imageId: string) {
    setPhotoForm((f) => {
      const images = f.images.filter((i) => i.id !== imageId);
      const featuredImageId =
        f.featuredImageId === imageId ? images[0]?.id || "" : f.featuredImageId;
      return { ...f, images, featuredImageId };
    });
  }

  if (authed === null) {
    return (
      <div className="admin-shell">
        <div className="admin-card">Checking Studio access…</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="admin-shell">
        <div className="admin-card" style={{ maxWidth: 440, margin: "0 auto" }}>
          <h1>Sign in</h1>
          <p style={{ color: "var(--muted)", marginTop: 0 }}>
            Owner tools. Visitors do not need this page.
          </p>
          {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}
          <form className="form-grid" onSubmit={login}>
            <div className="field">
              <label htmlFor="admin-pass">Password</label>
              <input
                id="admin-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const posts = content?.posts || [];
  const videos = content?.videos || [];
  const photos = content?.photos || [];

  return (
    <div className="admin-shell">
      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <h1>Creator Studio</h1>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              Publish blogs, videos, and photos, and write the channel pieces.
              Only you can open this page. Membership approvals live in the{" "}
              <a href="/admin" className="text-link">
                Admin Portal
              </a>
              .
            </p>
          </div>
          <div className="admin-portal-header-actions">
            <a href="/admin" className="btn btn-ghost btn-sm">
              Admin Portal
            </a>
            <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>
              Sign out
            </button>
          </div>
        </div>

        <div className="admin-tabs">
          <button type="button" className={tab === "posts" ? "active" : ""} onClick={() => setTab("posts")}>
            Blog &amp; Video episodes
          </button>
          <button type="button" className={tab === "photos" ? "active" : ""} onClick={() => setTab("photos")}>
            Photo Journal
          </button>
          <button type="button" className={tab === "videos" ? "active" : ""} onClick={() => setTab("videos")}>
            Videos
          </button>
          <button type="button" className={tab === "channel" ? "active" : ""} onClick={() => setTab("channel")}>
            Channel desk
          </button>
        </div>

        {tab === "posts" && (
          <>
            <h2>{postForm.id ? "Edit post" : "New post"}</h2>
            <form className="form-grid" onSubmit={savePost}>
              <div className="form-row">
                <div className="field">
                  <label>Type</label>
                  <select
                    value={postForm.type}
                    onChange={(e) =>
                      setPostForm((f) => ({
                        ...f,
                        type: e.target.value === "vlog" ? "vlog" : "blog",
                      }))
                    }
                  >
                    <option value="blog">Blog</option>
                    <option value="vlog">Video episode (written)</option>
                  </select>
                </div>
                <div className="field">
                  <label>Tags (comma-separated)</label>
                  <input
                    value={postForm.tags}
                    onChange={(e) => setPostForm((f) => ({ ...f, tags: e.target.value }))}
                    placeholder="health, wealth, golf-carts"
                  />
                </div>
              </div>
              <div className="field">
                <label>Title</label>
                <input
                  required
                  value={postForm.title}
                  onChange={(e) => setPostForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Slug (optional)</label>
                <input
                  value={postForm.slug}
                  onChange={(e) => setPostForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="auto-from-title"
                />
              </div>
              <div className="field">
                <label>Excerpt</label>
                <input
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm((f) => ({ ...f, excerpt: e.target.value }))}
                  placeholder="One-line teaser"
                />
              </div>
              <div className="field">
                <label htmlFor="post-body">Body</label>
                <div className="studio-story">
                  {chunks.map((chunk, index) =>
                    chunk.kind === "text" ? (
                      <textarea
                        key={`text-${index}`}
                        id={index === 0 ? "post-body" : undefined}
                        className="studio-body"
                        ref={index === activeChunk ? bodyRef : undefined}
                        value={chunk.text}
                        placeholder={index === 0 ? "Separate paragraphs with a blank line" : "Story continues here"}
                        onFocus={() => setActiveChunk(index)}
                        onChange={(e) => setChunkText(index, e.target.value)}
                      />
                    ) : (
                      <div key={`table-${index}`} className="studio-table">
                        <table>
                          <tbody>
                            {chunk.rows.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((cell, colIndex) => (
                                  <td key={colIndex}>
                                    <input
                                      aria-label={
                                        rowIndex === 0
                                          ? `Header column ${colIndex + 1}`
                                          : `Row ${rowIndex} column ${colIndex + 1}`
                                      }
                                      value={cell}
                                      onChange={(e) =>
                                        setTableCell(index, rowIndex, colIndex, e.target.value)
                                      }
                                      onPaste={(e) => {
                                        const text = e.clipboardData.getData("text");
                                        if (pasteTable(index, rowIndex, colIndex, text)) {
                                          e.preventDefault();
                                        }
                                      }}
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => removeTable(index)}
                        >
                          Remove table
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setTableAsk({ rows: "4", cols: "2" })}
                >
                  Insert a table
                </button>
              </div>
              <p className="panel-hint" style={{ marginTop: 0 }}>
                Insert a table asks how many rows and columns you want, then puts
                that grid in the story. The first row is the header. Type in the
                cells, or paste a block copied from a spreadsheet.
              </p>
              <div className="admin-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  disabled={filling || busy}
                  onClick={() => void fillFromStory()}
                >
                  {filling ? "Reading the story…" : "Fill slug, excerpt, and tags from the story"}
                </button>
              </div>
              <p className="panel-hint" style={{ marginTop: 0 }}>
                Write the story first, then press that button. It fills the slug, the
                one-line excerpt, and the tags above. Your title stays as you typed it.
                You can still edit every field.
              </p>
              <div className="field">
                <label>
                  Pictures and PDFs {uploading ? "(uploading…)" : ""} — select one or many
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf,application/pdf"
                  multiple
                  onChange={(e) => {
                    void onUploadPostPhotos(e.target.files);
                    e.target.value = "";
                  }}
                />
                <p className="panel-hint">
                  The cover picture is the photo on the blog list and at the top of
                  the post. Place in the story drops a picture or a PDF where you
                  want it. Anything you do not place still shows at the end. A PDF
                  shows as a document graphic, and clicking it opens the file in a
                  new window.
                </p>
              </div>
              {postForm.images.length > 0 && (
                <div className="admin-photo-grid">
                  {postForm.images.map((img, idx) => {
                    const pdf = isPdfMediaUrl(img.url);
                    const isFeatured = !pdf && img.id === postForm.featuredImageId;
                    const placed = postForm.body.includes(`[[photo:${img.id}]]`);
                    return (
                      <div
                        key={img.id}
                        className={`admin-photo-tile ${isFeatured ? "featured" : ""}`}
                      >
                        {pdf ? (
                          <PdfLinkCard href={img.url} label={img.caption || "Open the PDF"} compact />
                        ) : (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={img.url} alt="" />
                        )}
                        <div className="admin-photo-tile-actions">
                          {pdf ? (
                            <span className="admin-photo-feature">PDF</span>
                          ) : (
                            <label className="admin-photo-feature">
                              <input
                                type="radio"
                                name="featured-post-image"
                                checked={isFeatured}
                                onChange={() =>
                                  setPostForm((f) => ({ ...f, featuredImageId: img.id }))
                                }
                              />
                              Cover
                            </label>
                          )}
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => placePictureInStory(img.id)}
                          >
                            {placed ? "In the story" : "Place in the story"}
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removePostImage(img.id)}
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          className="admin-photo-caption-input"
                          placeholder={pdf ? "Name readers will see on the PDF" : `Caption for picture ${idx + 1}`}
                          value={img.caption}
                          onChange={(e) => {
                            const caption = e.target.value;
                            setPostForm((f) => ({
                              ...f,
                              images: f.images.map((item) =>
                                item.id === img.id ? { ...item, caption } : item
                              ),
                            }));
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={postForm.featured}
                  onChange={(e) => setPostForm((f) => ({ ...f, featured: e.target.checked }))}
                />
                Featured
              </label>
              {statusBanner}
              <div className="admin-actions">
                <button type="submit" className="btn btn-primary" disabled={busy || uploading || filling}>
                  {busy ? "Saving…" : postForm.id ? "Update post" : "Publish post"}
                </button>
                {postForm.id && (
                  <button type="button" className="btn btn-ghost" onClick={clearStory}>
                    Cancel edit
                  </button>
                )}
              </div>
            </form>

            <h2 style={{ marginTop: "1.75rem" }}>Existing posts</h2>
            <div className="admin-list">
              {posts.length === 0 && <p style={{ color: "var(--muted)" }}>None yet.</p>}
              {posts.map((p) => (
                <div key={p.id} className="admin-item">
                  <div>
                    <strong>{p.title}</strong>
                    <span>
                      {p.type} · /blog/{p.slug}
                    </span>
                  </div>
                  <div className="admin-actions">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => editPost(p)}>
                      Edit
                    </button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removePost(p.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "channel" && (
          <AdminCreatorDesk onUseWebsite={useWebsiteDraft} />
        )}

        {tab === "videos" && (
          <>
            <p className="panel-hint" style={{ marginTop: 0 }}>
              Uploads on{" "}
              <strong>@TheVillagesEverythingApp</strong> appear automatically on
              My Retirement Reboot → Videos. Use this form only for extra clips
              or a custom title.{" "}
              <button
                type="button"
                className="text-link"
                onClick={pullYouTube}
                disabled={ytPulling}
                style={{
                  background: "none",
                  border: 0,
                  padding: 0,
                  font: "inherit",
                  cursor: ytPulling ? "wait" : "pointer",
                }}
              >
                {ytPulling ? "Pulling from YouTube…" : "Pull latest from YouTube now"}
              </button>
            </p>
            <h2>{videoForm.id ? "Edit video" : "New video"}</h2>
            <form className="form-grid" onSubmit={saveVideo}>
              <div className="form-row">
                <div className="field">
                  <label>Source</label>
                  <select
                    value={videoForm.source}
                    onChange={(e) =>
                      setVideoForm((f) => ({
                        ...f,
                        source: e.target.value === "upload" ? "upload" : "youtube",
                      }))
                    }
                  >
                    <option value="youtube">YouTube link</option>
                    <option value="upload">Direct upload</option>
                  </select>
                </div>
                <div className="field">
                  <label>Tags (comma-separated)</label>
                  <input
                    value={videoForm.tags}
                    onChange={(e) => setVideoForm((f) => ({ ...f, tags: e.target.value }))}
                    placeholder="intro, tour, markets"
                  />
                </div>
              </div>
              <div className="field">
                <label>Title</label>
                <input
                  required
                  value={videoForm.title}
                  onChange={(e) => setVideoForm((f) => ({ ...f, title: e.target.value }))}
                />
              </div>
              <div className="field">
                <label>Description</label>
                <textarea
                  value={videoForm.description}
                  onChange={(e) => setVideoForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              {videoForm.source === "youtube" ? (
                <div className="field">
                  <label>YouTube URL or video ID</label>
                  <input
                    required
                    value={videoForm.youtubeId}
                    onChange={(e) => setVideoForm((f) => ({ ...f, youtubeId: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=…"
                  />
                </div>
              ) : (
                <>
                  <div className="field">
                    <label>Upload video file {uploading ? "(uploading…)" : ""}</label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => onUpload(e.target.files?.[0] || null, "video")}
                    />
                    {videoForm.videoUrl && (
                      <p style={{ margin: "0.4rem 0 0", fontSize: "0.85rem", color: "var(--palm)" }}>
                        Uploaded: {videoForm.videoUrl}
                      </p>
                    )}
                  </div>
                  <div className="field">
                    <label>Optional thumbnail image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => onUpload(e.target.files?.[0] || null, "thumb")}
                    />
                  </div>
                </>
              )}

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={videoForm.featured}
                  onChange={(e) => setVideoForm((f) => ({ ...f, featured: e.target.checked }))}
                />
                Featured
              </label>
              {statusBanner}
              <div className="admin-actions">
                <button type="submit" className="btn btn-primary" disabled={busy || uploading}>
                  {busy ? "Saving…" : videoForm.id ? "Update video" : "Publish video"}
                </button>
                {videoForm.id && (
                  <button type="button" className="btn btn-ghost" onClick={() => setVideoForm(emptyVideo)}>
                    Cancel edit
                  </button>
                )}
              </div>
            </form>

            <h2 style={{ marginTop: "1.75rem" }}>Existing videos</h2>
            <div className="admin-list">
              {videos.length === 0 && <p style={{ color: "var(--muted)" }}>None yet.</p>}
              {videos.map((v) => (
                <div key={v.id} className="admin-item">
                  <div>
                    <strong>{v.title}</strong>
                    <span>
                      {v.source}
                      {v.youtubeId ? ` · ${v.youtubeId}` : ""}
                      {v.videoUrl ? ` · ${v.videoUrl}` : ""}
                    </span>
                  </div>
                  <div className="admin-actions">
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => editVideo(v)}>
                      Edit
                    </button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={() => removeVideo(v.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "photos" && (
          <>
            <h2>{photoForm.id ? "Edit photo entry" : "New photo journal entry"}</h2>
            <p className="panel-hint" style={{ marginTop: 0 }}>
              Publish / Update goes live immediately on My Retirement Reboot →
              Photos. No Admin Portal approval.
            </p>
            <form className="form-grid" onSubmit={savePhoto}>
              <div className="field">
                <label>Title</label>
                <input
                  required
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Sunset over the rec center"
                />
              </div>
              <div className="field">
                <label>Short description (for the whole entry)</label>
                <textarea
                  value={photoForm.caption}
                  onChange={(e) => setPhotoForm((f) => ({ ...f, caption: e.target.value }))}
                  placeholder="A short note about this set of photos"
                />
              </div>
              <div className="field">
                <label>Tags (comma-separated)</label>
                <input
                  value={photoForm.tags}
                  onChange={(e) => setPhotoForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="sunset, carts, neighbors"
                />
              </div>
              <div className="field">
                <label>
                  Upload photos {uploading ? "(uploading…)" : ""} — select multiple files
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    void onUploadManyPhotos(e.target.files);
                    e.target.value = "";
                  }}
                />
              </div>

              {photoForm.images.length > 0 && (
                <div className="admin-photo-grid">
                  {photoForm.images.map((img, idx) => {
                    const isFeatured = img.id === photoForm.featuredImageId;
                    return (
                      <div
                        key={img.id}
                        className={`admin-photo-tile ${isFeatured ? "featured" : ""}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt="" />
                        <div className="admin-photo-tile-actions">
                          <label className="admin-photo-feature">
                            <input
                              type="radio"
                              name="featured-photo-image"
                              checked={isFeatured}
                              onChange={() =>
                                setPhotoForm((f) => ({ ...f, featuredImageId: img.id }))
                              }
                            />
                            Featured
                          </label>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removePhotoImage(img.id)}
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          className="admin-photo-caption-input"
                          placeholder={`Optional caption for photo ${idx + 1}`}
                          value={img.caption}
                          onChange={(e) => {
                            const caption = e.target.value;
                            setPhotoForm((f) => ({
                              ...f,
                              images: f.images.map((x) =>
                                x.id === img.id ? { ...x, caption } : x
                              ),
                            }));
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={photoForm.featured}
                  onChange={(e) => setPhotoForm((f) => ({ ...f, featured: e.target.checked }))}
                />
                Feature this entry on the site
              </label>
              {statusBanner}
              <div className="admin-actions">
                <button type="submit" className="btn btn-primary" disabled={busy || uploading}>
                  {busy
                    ? "Saving…"
                    : photoForm.id
                      ? "Update entry"
                      : "Publish entry"}
                </button>
                {photoForm.id && (
                  <button type="button" className="btn btn-ghost" onClick={() => setPhotoForm(emptyPhoto)}>
                    Cancel edit
                  </button>
                )}
              </div>
            </form>

            <h2 style={{ marginTop: "1.75rem" }}>Existing photo entries</h2>
            <div className="admin-list">
              {photos.length === 0 && <p style={{ color: "var(--muted)" }}>None yet.</p>}
              {photos.map((p) => {
                const imgs = photoImagesFromEntry(p);
                const cover =
                  imgs.find((i) => i.id === p.featuredImageId)?.url ||
                  imgs[0]?.url ||
                  p.imageUrl ||
                  "";
                return (
                  <div key={p.id} className="admin-item">
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      {cover ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cover}
                          alt=""
                          style={{
                            width: 56,
                            height: 56,
                            objectFit: "cover",
                            borderRadius: 10,
                            border: "1px solid var(--line)",
                          }}
                        />
                      ) : null}
                      <div>
                        <strong>{p.title}</strong>
                        <span>
                          {imgs.length} photo{imgs.length === 1 ? "" : "s"}
                          {p.caption ? ` · ${p.caption.slice(0, 60)}` : ""}
                        </span>
                      </div>
                    </div>
                    <div className="admin-actions">
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => editPhoto(p)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removePhoto(p.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
      {tableAsk
        ? createPortal(
            <div className="fav-site-overlay" onClick={() => setTableAsk(null)}>
              <div
                className="fav-site-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="table-ask-title"
                onClick={(event) => event.stopPropagation()}
              >
                <h2 id="table-ask-title">Insert a table</h2>
                <p className="fav-site-lead">
                  How many rows and columns should this table have? The first row
                  is the header. After it lands in the story, type in the cells or
                  paste from a spreadsheet.
                </p>
                <div className="form-row">
                  <div className="field">
                    <label htmlFor="table-rows">Rows</label>
                    <input
                      id="table-rows"
                      type="number"
                      min={2}
                      max={24}
                      value={tableAsk.rows}
                      onChange={(event) =>
                        setTableAsk({ ...tableAsk, rows: event.target.value })
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="table-cols">Columns</label>
                    <input
                      id="table-cols"
                      type="number"
                      min={1}
                      max={6}
                      value={tableAsk.cols}
                      onChange={(event) =>
                        setTableAsk({ ...tableAsk, cols: event.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="admin-actions">
                  <button type="button" className="btn btn-primary" onClick={confirmTable}>
                    Put the table in the story
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setTableAsk(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
