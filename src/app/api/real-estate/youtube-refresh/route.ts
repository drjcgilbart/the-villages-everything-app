import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  ensureYoutubeCacheFresh,
  loadYoutubeCache,
  refreshRealEstateYoutube,
} from "@/lib/realEstateYoutube";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isCronRequest(req: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization") || "";
  const headerSecret = req.headers.get("x-cron-secret") || "";
  const vercelCron = req.headers.get("x-vercel-cron") === "1";
  if (vercelCron) return true;
  if (!cronSecret) return false;
  return auth === `Bearer ${cronSecret}` || headerSecret === cronSecret;
}

/**
 * Refresh Real Estate YouTube “latest Villages video” cache from public RSS.
 * - Vercel Cron GET daily
 * - Admin can force refresh
 * - Public soft-refresh when stale
 */
export async function GET(req: Request) {
  return handle(req, false);
}

export async function POST(req: Request) {
  let force = false;
  try {
    const body = await req.json().catch(() => ({}));
    force = Boolean(body?.force);
  } catch {
    /* ignore */
  }
  return handle(req, force);
}

async function handle(req: Request, force: boolean) {
  const isCron = isCronRequest(req);
  const isAdmin = await isAdminAuthenticated();

  try {
    const cache =
      isCron || isAdmin || (force && isAdmin)
        ? await refreshRealEstateYoutube({
            source: isCron ? "cron" : "manual",
          })
        : await ensureYoutubeCacheFresh(20);

    const creators = Object.fromEntries(
      Object.entries(cache.creators).map(([id, row]) => [
        id,
        {
          videoId: row.video?.videoId || null,
          title: row.video?.title || null,
          pickReason: row.video?.pickReason || null,
          candidatesChecked: row.candidatesChecked,
        },
      ])
    );

    return NextResponse.json({
      ok: true,
      mode: isCron ? "cron" : isAdmin ? "manual" : "stale-check",
      updatedAt: cache.updatedAt,
      lastError: cache.lastError,
      creators,
    });
  } catch (err) {
    const prev = loadYoutubeCache();
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "YouTube refresh failed",
        updatedAt: prev.updatedAt,
      },
      { status: 502 }
    );
  }
}
