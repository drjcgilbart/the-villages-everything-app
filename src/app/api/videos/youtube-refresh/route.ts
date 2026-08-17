import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  ensureChannelYoutubeFresh,
  loadChannelYoutubeCache,
  refreshChannelYoutube,
} from "@/lib/channelYoutube";

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
 * Pull latest uploads from The Villages Everything App YouTube channel
 * into My Retirement Reboot → Videos. Public RSS, no API key.
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
      force || isCron || isAdmin
        ? await refreshChannelYoutube({
            source: isCron ? "cron" : "manual",
          })
        : await ensureChannelYoutubeFresh(1);

    return NextResponse.json({
      ok: true,
      mode: isCron ? "cron" : isAdmin || force ? "manual" : "stale-check",
      updatedAt: cache.updatedAt,
      lastError: cache.lastError,
      count: cache.videos.length,
      latest: cache.videos[0]
        ? { videoId: cache.videos[0].videoId, title: cache.videos[0].title }
        : null,
    });
  } catch (err) {
    const prev = loadChannelYoutubeCache();
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
