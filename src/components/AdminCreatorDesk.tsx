"use client";

import { useCallback, useEffect, useState } from "react";
import {
  emptyProject,
  type CreatorProject,
  type DeskWebsite,
} from "@/lib/creatorDeskTypes";

type DeskTab = "film" | "script" | "youtube" | "everywhere";

export function AdminCreatorDesk({
  onUseWebsite,
}: {
  onUseWebsite: (draft: DeskWebsite) => void;
}) {
  const [project, setProject] = useState<CreatorProject>(() => emptyProject());
  const [saved, setSaved] = useState<CreatorProject[]>([]);
  const [section, setSection] = useState<DeskTab>("film");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const flash = (kind: "ok" | "err", text: string) => setMsg({ kind, text });

  const refresh = useCallback(async () => {
    const res = await fetch("/api/creator-desk", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    const projects = Array.isArray(data.projects) ? (data.projects as CreatorProject[]) : [];
    setSaved(projects);
  }, []);

  useEffect(() => {
    refresh().catch(() => flash("err", "Could not load the channel desk"));
  }, [refresh]);

  async function run(action: "save" | "ideas" | "script" | "youtube" | "everywhere") {
    setBusy(action);
    setMsg(null);
    try {
      const res = await fetch("/api/creator-desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, project }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not write that");
      setProject(data.project);
      await refresh();
      const labels: Record<typeof action, string> = {
        save: "Saved on the channel desk",
        ideas: "Ideas are ready",
        script: "Script is ready",
        youtube: "YouTube listing is ready",
        everywhere: "Social posts and the website draft are ready",
      };
      flash("ok", labels[action]);
    } catch (err) {
      flash("err", err instanceof Error ? err.message : "Could not write that");
    } finally {
      setBusy(null);
    }
  }

  function applyIdea(idea: CreatorProject["ideas"][number]) {
    setProject((current) => ({
      ...current,
      title: idea.title,
      format: idea.format,
      notes: [current.notes, idea.why, idea.shootList.length ? `Shoot: ${idea.shootList.join(", ")}` : ""]
        .filter(Boolean)
        .join("\n\n"),
      hook: idea.hook || current.hook,
    }));
    setSection("script");
    flash("ok", "That idea is now the working title. Write the script when you are ready.");
  }

  return (
    <div>
      <p className="panel-hint" style={{ marginTop: 0 }}>
        This is the writing side of The Villages Content Creator, kept here for you as
        the admin. Suggest what to film, write the script, write the YouTube listing, and
        write the Facebook, Instagram, TikTok, X, and website versions. The website draft
        can drop straight into Blog. Joining GoPro chapters, building a slideshow, and
        recording the cloned voice still run in The Villages Content Creator on this PC.
        Those jobs need the video tools on this computer. The standalone app is unchanged.
      </p>

      {msg && <div className={`msg msg-${msg.kind}`}>{msg.text}</div>}

      <div className="form-row">
        <div className="field">
          <label>Working title</label>
          <input
            value={project.title}
            onChange={(e) => setProject((p) => ({ ...p, title: e.target.value }))}
            placeholder="Lightning protection in Edenfield"
          />
        </div>
        <div className="field">
          <label>Length</label>
          <select
            value={project.format}
            onChange={(e) =>
              setProject((p) => ({
                ...p,
                format: e.target.value === "short" ? "short" : "long",
              }))
            }
          >
            <option value="long">Regular video</option>
            <option value="short">YouTube Short</option>
          </select>
        </div>
      </div>
      <div className="field">
        <label>Notes from the shoot</label>
        <textarea
          value={project.notes}
          onChange={(e) => setProject((p) => ({ ...p, notes: e.target.value }))}
          placeholder="What you saw, who you talked to, what you want neighbors to know"
        />
      </div>

      <div className="admin-tabs">
        {(
          [
            ["film", "What to film"],
            ["script", "Script"],
            ["youtube", "YouTube listing"],
            ["everywhere", "Everywhere"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={section === id ? "active" : ""}
            onClick={() => setSection(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {section === "film" && (
        <>
          <div className="admin-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!!busy}
              onClick={() => void run("ideas")}
            >
              {busy === "ideas" ? "Thinking…" : "Suggest what to film"}
            </button>
          </div>
          <div className="admin-list" style={{ marginTop: "1rem" }}>
            {project.ideas.length === 0 && (
              <p style={{ color: "var(--muted)" }}>No ideas yet. Press the button above.</p>
            )}
            {project.ideas.map((idea, index) => (
              <div key={`${idea.title}-${index}`} className="admin-item">
                <div>
                  <strong>{idea.title}</strong>
                  <span>
                    {idea.format === "short" ? "Short" : "Regular video"}
                    {idea.why ? ` · ${idea.why}` : ""}
                  </span>
                </div>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => applyIdea(idea)}>
                  Use this
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {section === "script" && (
        <>
          <div className="admin-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!!busy}
              onClick={() => void run("script")}
            >
              {busy === "script" ? "Writing…" : "Write the script"}
            </button>
          </div>
          {project.hook && (
            <p className="panel-hint">
              <strong>Hook. </strong>
              {project.hook}
            </p>
          )}
          <div className="field">
            <label>Script</label>
            <textarea
              value={project.script}
              onChange={(e) => setProject((p) => ({ ...p, script: e.target.value }))}
              style={{ minHeight: "16rem" }}
            />
          </div>
        </>
      )}

      {section === "youtube" && (
        <>
          <div className="admin-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!!busy}
              onClick={() => void run("youtube")}
            >
              {busy === "youtube" ? "Writing…" : "Write the YouTube listing"}
            </button>
          </div>
          <CopyBlock label="Title" value={project.youtube.title} />
          <CopyBlock label="Thumbnail text" value={project.youtube.thumbnailText} />
          <CopyBlock label="Description" value={project.youtube.description} tall />
          <CopyBlock label="Chapters" value={project.youtube.chapters} tall />
          <CopyBlock label="Tags" value={project.youtube.tags.join(", ")} />
          <CopyBlock label="Hashtags" value={project.youtube.hashtags.map((tag) => `#${tag}`).join(" ")} />
          <CopyBlock label="Pinned comment" value={project.youtube.pinnedComment} tall />
        </>
      )}

      {section === "everywhere" && (
        <>
          <div className="admin-actions">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!!busy}
              onClick={() => void run("everywhere")}
            >
              {busy === "everywhere" ? "Writing…" : "Write the posts"}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={!project.everywhere.website.body && !project.everywhere.website.title}
              onClick={() => onUseWebsite(project.everywhere.website)}
            >
              Use the website post in Blog
            </button>
          </div>
          <CopyBlock label="Facebook" value={project.everywhere.facebook} tall />
          <CopyBlock label="Instagram" value={project.everywhere.instagram} tall />
          <CopyBlock label="TikTok" value={project.everywhere.tiktok} />
          <CopyBlock label="X" value={project.everywhere.x} />
          <CopyBlock label="Website title" value={project.everywhere.website.title} />
          <CopyBlock label="Website excerpt" value={project.everywhere.website.excerpt} />
          <CopyBlock
            label="Website story"
            value={project.everywhere.website.body}
            tall
          />
        </>
      )}

      <div className="admin-actions" style={{ marginTop: "1rem" }}>
        <button type="button" className="btn btn-ghost" disabled={!!busy} onClick={() => void run("save")}>
          {busy === "save" ? "Saving…" : "Save this desk"}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setProject(emptyProject());
            setMsg(null);
          }}
        >
          Start a new one
        </button>
      </div>

      <h2 style={{ marginTop: "1.75rem" }}>Saved desks</h2>
      <div className="admin-list">
        {saved.length === 0 && <p style={{ color: "var(--muted)" }}>None saved yet.</p>}
        {saved.map((item) => (
          <div key={item.id} className="admin-item">
            <div>
              <strong>{item.title || "Untitled"}</strong>
              <span>{item.updatedAt ? item.updatedAt.slice(0, 10) : ""}</span>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setProject(emptyProject(item))}
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CopyBlock({
  label,
  value,
  tall,
}: {
  label: string;
  value: string;
  tall?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  return (
    <div className="field">
      <label>{label}</label>
      <textarea readOnly value={value} style={{ minHeight: tall ? "8rem" : "3.2rem" }} />
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => {
          void navigator.clipboard.writeText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }}
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
