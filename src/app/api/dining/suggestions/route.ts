import { NextResponse } from "next/server";
import { notifyAdminOfApprovalRequest } from "@/lib/adminNotify";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  approveRestaurantSuggestion,
  deleteRestaurantSuggestion,
  listRestaurantSuggestions,
  rejectRestaurantSuggestion,
  submitRestaurantSuggestion,
} from "@/lib/dining";

export const dynamic = "force-dynamic";

/** Public: submit a suggestion. Admin: list suggestions (?status=pending|all). */
export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const status = (searchParams.get("status") || "all") as
    | "pending"
    | "approved"
    | "rejected"
    | "all";
  const suggestions = listRestaurantSuggestions({ status });
  return NextResponse.json({
    suggestions,
    pendingCount: listRestaurantSuggestions({ status: "pending" }).length,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = String(body.action || "submit").toLowerCase();
    if (action === "submit") {
      const { rateLimitResponse } = await import("@/lib/authRateLimit");
      const limited = rateLimitResponse(req, "dining-suggest", 8, 15 * 60 * 1000);
      if (limited) return limited;
    }

    if (action === "submit") {
      const suggestion = submitRestaurantSuggestion({
        name: body.name,
        cuisine: body.cuisine,
        area: body.area,
        address: body.address,
        phone: body.phone,
        website: body.website,
        priceRange: body.priceRange,
        description: body.description,
        specialties: body.specialties,
        tags: body.tags,
        suggestedBy: body.suggestedBy,
        suggestedByEmail: body.suggestedByEmail,
        note: body.note,
      });
      await notifyAdminOfApprovalRequest({
        topic: "Dining",
        title: suggestion.name,
        submittedBy: suggestion.suggestedBy,
        createdAt: suggestion.createdAt,
        details: {
          restaurant: suggestion.name,
          cuisine: suggestion.cuisine,
          area: suggestion.area,
          address: suggestion.address,
          phone: suggestion.phone,
          website: suggestion.website,
          description: suggestion.description,
          suggestedBy: suggestion.suggestedBy,
          suggestedByEmail: suggestion.suggestedByEmail,
          note: suggestion.note,
        },
      });
      return NextResponse.json({
        ok: true,
        suggestion: {
          id: suggestion.id,
          name: suggestion.name,
          status: suggestion.status,
        },
        message:
          "Thanks! Your suggestion was sent for admin review. Once approved, it will appear in Dining.",
      });
    }

    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = String(body.id || "").trim();
    if (!id) {
      return NextResponse.json({ error: "Missing suggestion id" }, { status: 400 });
    }

    if (action === "approve") {
      const result = approveRestaurantSuggestion(id);
      return NextResponse.json({
        ok: true,
        ...result,
        message: `Approved — ${result.restaurant.name} is now listed in Dining.`,
      });
    }

    if (action === "reject") {
      const suggestion = rejectRestaurantSuggestion(id, body.reason);
      return NextResponse.json({
        ok: true,
        suggestion,
        message: "Suggestion rejected.",
      });
    }

    if (action === "delete") {
      deleteRestaurantSuggestion(id);
      return NextResponse.json({ ok: true, message: "Suggestion removed." });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not process suggestion" },
      { status: 400 }
    );
  }
}
