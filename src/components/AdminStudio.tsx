"use client";

import { useCallback, useEffect, useState } from "react";
import type { Photo, Post, PostType, SiteContent, Video, VideoSource } from "@/lib/types";
type Tab = "posts" | "videos" | "photos";

type PostForm = {
  id: string;
  type: PostType;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  tags: string;
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
  const [uploading, setUploading] = useState(false);

  const flash = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 4000);
  };

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
      setPostForm(emptyPost);
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
    if (postForm.id === id) setPostForm(emptyPost);
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
    setPostForm({
      id: p.id,
      type: p.type,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      body: p.body,
      tags: (p.tags || []).join(", "),
      featured: !!p.featured,
    });
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

  async function onUpload(file: File | null, kind: "video" | "thumb" | "photo") {
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
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
        const fd = new FormData();
        fd.append("file", file);
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
          <h1>Studio login</h1>
          <p style={{ color: "var(--muted)", marginTop: 0 }}>
            Publish blogs, video episodes, photos, YouTube links, and uploaded videos.
            Default local password is in <code>.env.local</code>.
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
              {busy ? "Signing in…" : "Enter Studio"}
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
              Publish blogs, videos, and photos. Membership approvals and site
              moderation live in the{" "}
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

        {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}

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
                <label>Body</label>
                <textarea
                  required
                  value={postForm.body}
                  onChange={(e) => setPostForm((f) => ({ ...f, body: e.target.value }))}
                  placeholder="Separate paragraphs with a blank line"
                />
              </div>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={postForm.featured}
                  onChange={(e) => setPostForm((f) => ({ ...f, featured: e.target.checked }))}
                />
                Featured
              </label>
              <div className="admin-actions">
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {busy ? "Saving…" : postForm.id ? "Update post" : "Publish post"}
                </button>
                {postForm.id && (
                  <button type="button" className="btn btn-ghost" onClick={() => setPostForm(emptyPost)}>
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

        {tab === "videos" && (
          <>
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
              Add several photos to one entry. Mark one as <strong>Featured</strong> — visitors
              see that first, then can scroll the rest as thumbnails.
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
    </div>
  );
}
