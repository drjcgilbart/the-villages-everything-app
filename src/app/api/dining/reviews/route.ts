import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  addReview,
  deleteReview,
  getVisibleReviews,
  loadDining,
  setReviewHidden,
} from "@/lib/dining";
import { getSessionMember } from "@/lib/memberAuth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const restaurantId = searchParams.get("restaurantId") || undefined;
  const includeHidden = searchParams.get("all") === "1";
  const data = loadDining();
  const admin = includeHidden ? await isAdminAuthenticated() : false;
  let reviews = admin
    ? data.reviews
        .filter((r) => (restaurantId ? r.restaurantId === restaurantId : true))
        .slice()
        .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    : getVisibleReviews(data.reviews, restaurantId);
  return NextResponse.json({ reviews });
}

export async function POST(req: Request) {
  const { rateLimitResponse } = await import("@/lib/authRateLimit");
  const limited = rateLimitResponse(req, "dining-review", 12, 15 * 60 * 1000);
  if (limited) return limited;
  try {
    const body = await req.json();
    const session = await getSessionMember();
    const review = addReview({
      restaurantId: String(body.restaurantId || ""),
      authorName: String(body.authorName || session?.name || ""),
      rating: Number(body.rating),
      title: String(body.title || ""),
      body: String(body.body || ""),
      wouldReturn: body.wouldReturn !== false,
      dish: body.dish ? String(body.dish) : undefined,
      authorMemberId: session?.id || null,
    });
    return NextResponse.json({ review });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save review" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const data = setReviewHidden(id, !!body.hidden);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update review" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    const data = deleteReview(id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete review" },
      { status: 400 }
    );
  }
}
