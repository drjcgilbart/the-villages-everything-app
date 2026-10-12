import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSessionMember } from "@/lib/memberAuth";
import { rejectIfCrossOrigin } from "@/lib/security";
import { holidayFrom, importPins, placePinImport, type PinImportResult } from "@/lib/lightTour";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

function importError(placed: PinImportResult) {
  if (placed.already && placed.missed) {
    return "Those houses are already on the tour. One more address could not be placed near The Villages.";
  }
  if (placed.missed) {
    return "No houses could be placed near The Villages. Check the street address, or add a Google Maps link or coordinates.";
  }
  return "No map points found. A Google Keep note needs a street address, a Google Maps link, or a latitude and longitude. CSV and GeoJSON points still work.";
}

function importMessage(added: number, placed: PinImportResult) {
  if (!added && placed.already && !placed.missed && !placed.capped) return "Those houses are already on the tour.";
  const parts = [`Added ${added} ${added === 1 ? "pin" : "pins"}.`];
  if (placed.skipped) {
    parts.push(
      `${placed.skipped} ${placed.skipped === 1 ? "note had" : "notes had"} no street address, map link, or coordinates.`
    );
  }
  if (placed.missed) {
    parts.push(`${placed.missed} ${placed.missed === 1 ? "address was" : "addresses were"} not found near The Villages.`);
  }
  if (placed.capped) parts.push("Import this same file again to look up the rest. Houses already saved are skipped.");
  return parts.join(" ");
}

export async function POST(req: Request) {
  const blocked = rejectIfCrossOrigin(req);
  if (blocked) return blocked;
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Sign in on the Admin page first." }, { status: 401 });
  }
  const body = (await req.json().catch(() => null)) as { text?: string; holiday?: string } | null;
  const holiday = holidayFrom(body?.holiday);
  const text = String(body?.text || "");
  if (!holiday) return NextResponse.json({ error: "Pick a holiday for this import." }, { status: 400 });
  if (text.length > 2_000_000) {
    return NextResponse.json({ error: "That file is too large." }, { status: 400 });
  }
  // Read the sign-in before any map lookup. A long download can drop the request context.
  const member = await getSessionMember();
  try {
    const placed = await placePinImport(text, holiday);
    if (!placed.pins.length) {
      if (placed.already && !placed.capped) {
        const missed = placed.missed
          ? " One more address could not be placed near The Villages."
          : "";
        return NextResponse.json({
          added: 0,
          message: `Those houses are already on the tour.${missed}`,
        });
      }
      return NextResponse.json({ error: importError(placed) }, { status: 400 });
    }
    const pins = await importPins(placed.pins.slice(0, 2000), member?.email || "admin");
    return NextResponse.json({
      added: pins.length,
      capped: placed.capped,
      message: importMessage(pins.length, placed),
    });
  } catch (err) {
    console.error("[light-tour] import failed", err);
    const full = err instanceof Error ? err.message.replace(/https?:\/\/\S+/g, "") : "";
    const blobAt = full.indexOf("Blob:");
    const detail = (blobAt >= 0 ? full.slice(blobAt) : full).slice(0, 240);
    const paused = /plan limits|fixed plan|has been suspended|over quota|hobby plan/i.test(full);
    const storage = /could not save|could not read|redis|blob|durable/i.test(detail);
    return NextResponse.json(
      {
        error: paused
          ? "Saving new houses is paused because the site's storage plan is full. Houses already on the map stay put."
          : storage
            ? "The houses were read, but saving them failed. Click Import pins again in a minute."
            : "The import did not finish. Click Import pins again.",
        detail,
      },
      { status: 500 }
    );
  }
}
