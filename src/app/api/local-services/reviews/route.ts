import { NextResponse } from "next/server";
import {
  addLocalServiceReview,
  computeServiceStats,
  listReviewsForListing,
  loadLocalServicesAsync,
} from "@/lib/localServices";
import { getSessionMember } from "@/lib/memberAuth";
import { rateLimitResponse } from "@/lib/authRateLimit";

export const dynamic = "force-dynamic";

/** Public: list reviews for a listing (+ stats) */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const listingId = String(searchParams.get("listingId") || "").trim();
    if (!listingId) {
      return NextResponse.json(
        { error: "listingId is required" },
        { status: 400 }
      );
    }
    const data = await loadLocalServicesAsync();
    const reviews = listReviewsForListing(listingId, data);
    const stats = computeServiceStats(listingId, data.reviews);
    return NextResponse.json({ reviews, stats });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not load reviews" },
      { status: 500 }
    );
  }
}

/** Public: submit a 1–5 star rating for an approved listing */
export async function POST(req: Request) {
  const limited = rateLimitResponse(req, "local-svc-review", 12, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const body = await req.json();
    const session = await getSessionMember();
    const review = await addLocalServiceReview({
      listingId: body.listingId,
      authorName: body.authorName || session?.name,
      rating: body.rating,
      body: body.body,
      authorMemberId: session?.id || null,
    });
    const data = await loadLocalServicesAsync();
    const stats = computeServiceStats(review.listingId, data.reviews);
    return NextResponse.json({
      ok: true,
      review: {
        id: review.id,
        listingId: review.listingId,
        rating: review.rating,
        createdAt: review.createdAt,
      },
      stats,
      message: "Thanks for your rating!",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save rating" },
      { status: 400 }
    );
  }
}
