import { NextResponse } from "next/server";
import {
  listApprovedClubs,
  loadClubListingsAsync,
  submitClubListing,
} from "@/lib/clubListings";
import {
  CLUB_LISTING_CATEGORIES,
  CLUB_MEMBERSHIP_STATUSES,
  membershipLabel,
} from "@/lib/clubListingsTypes";

export const dynamic = "force-dynamic";

/** Public: approved club directory + form metadata */
export async function GET() {
  try {
    const data = await loadClubListingsAsync();
    const approved = listApprovedClubs(data);
    return NextResponse.json({
      listings: approved,
      categories: CLUB_LISTING_CATEGORIES,
      membershipStatuses: CLUB_MEMBERSHIP_STATUSES.map((id) => ({
        id,
        label: membershipLabel(id),
      })),
      pendingCount: data.listings.filter((l) => l.status === "pending").length,
      updatedAt: data.updatedAt,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not load clubs" },
      { status: 500 }
    );
  }
}

/** Public: submit new club info or an update for admin approval */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const listing = await submitClubListing({
      name: body.name,
      category: body.category,
      location: body.location,
      leaderName: body.leaderName,
      website: body.website,
      email: body.email,
      phone: body.phone,
      description: body.description,
      membershipStatus: body.membershipStatus,
      submittedByName: body.submittedByName,
      replacesId: body.replacesId,
    });
    return NextResponse.json({
      ok: true,
      listing: {
        id: listing.id,
        name: listing.name,
        status: listing.status,
        replacesId: listing.replacesId,
      },
      message: listing.replacesId
        ? "Update submitted! An admin will review it before the public page changes."
        : "Thanks! Your club listing is pending admin approval. Once approved, it appears on the Clubs page.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Submit failed" },
      { status: 400 }
    );
  }
}
