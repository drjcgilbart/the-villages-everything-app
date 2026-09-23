import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/authRateLimit";
import {
  generateEverywhere,
  generateIdeas,
  generateScript,
  generateYoutube,
  loadCreatorDesk,
  upsertCreatorProject,
} from "@/lib/creatorDesk";
import { emptyProject, type CreatorProject } from "@/lib/creatorDeskTypes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

async function requireAdmin() {
  if (await isAdminAuthenticated()) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const desk = await loadCreatorDesk();
  return NextResponse.json(desk);
}

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "creator-desk", 40, 15 * 60 * 1000);
  if (limited) return limited;
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: {
    action?: string;
    project?: Partial<CreatorProject>;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const project = emptyProject(body.project);
  const action = body.action || "save";

  try {
    if (action === "ideas") {
      project.ideas = await generateIdeas(project.notes);
    } else if (action === "script") {
      const written = await generateScript({
        title: project.title,
        notes: project.notes,
        format: project.format,
      });
      project.hook = written.hook;
      project.script = written.script;
    } else if (action === "youtube") {
      if (!project.script.trim() && !project.notes.trim()) {
        return NextResponse.json(
          { error: "Write a script or some notes first." },
          { status: 400 }
        );
      }
      project.youtube = await generateYoutube({
        title: project.title,
        notes: project.notes,
        script: project.script,
        format: project.format,
      });
      if (!project.title && project.youtube.title) project.title = project.youtube.title;
    } else if (action === "everywhere") {
      if (!project.script.trim() && !project.notes.trim() && !project.title.trim()) {
        return NextResponse.json(
          { error: "Add a title, notes, or a script first." },
          { status: 400 }
        );
      }
      project.everywhere = await generateEverywhere({
        title: project.title,
        notes: project.notes,
        script: project.script,
      });
    } else if (action !== "save") {
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const saved = await upsertCreatorProject(project);
    return NextResponse.json({ project: saved });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not write that";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
