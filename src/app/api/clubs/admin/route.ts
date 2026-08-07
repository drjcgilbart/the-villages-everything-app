import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteClubListing,
  loadClubListingsAsync,
  setClubListingStatus,
} from "@/lib/clubListings";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await loadClubListingsAsync();
  return NextResponse.json({
    listings: data.listings,
    pending: data.listings.filter((l) => l.status === "pending"),
    approved: data.listings.filter((l) => l.status === "approved"),
    updatedAt: data.updatedAt,
  });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const action = String(body.action || "").toLowerCase();
    const id = String(body.id || "").trim();
    if (!id) throw new Error("id is required");

    if (action === "approve" || action === "reject" || action === "pending") {
      const listing = await setClubListingStatus(
        id,
        action === "approve"
          ? "approved"
          : action === "reject"
            ? "rejected"
            : "pending"
      );
      return NextResponse.json({
        ok: true,
        listing,
        message:
          action === "approve"
            ? `${listing.name} is now live on the Clubs page.`
            : `Listing marked ${action}.`,
      });
    }

    if (action === "delete") {
      await deleteClubListing(id);
      return NextResponse.json({ ok: true, message: "Listing deleted" });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Admin action failed" },
      { status: 400 }
    );
  }
}
