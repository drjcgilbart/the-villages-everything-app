import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSessionMember, requireApprovedMember } from "@/lib/memberAuth";
import {
  createListing,
  deleteListing,
  setListingStatus,
  updateListing,
} from "@/lib/yardSale";
import type { ListingStatus } from "@/lib/yardSaleTypes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const member = await requireApprovedMember();
    const body = await req.json();
    const listing = createListing(member.id, {
      title: body.title,
      description: body.description,
      price: body.price,
      isFree: body.isFree,
      condition: body.condition,
      category: body.category,
      meetupType: body.meetupType,
      meetupNotes: body.meetupNotes,
      contactMethod: body.contactMethod,
      images: body.images,
      videoUrl: body.videoUrl,
    });
    return NextResponse.json({ listing });
  } catch (err) {
    const code = (err as { code?: number })?.code || 400;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not create listing" },
      { status: code }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const isAdmin = await isAdminAuthenticated();
    const member = await getSessionMember();

    if (isAdmin && body.adminStatus) {
      const listing = setListingStatus(
        body.id,
        body.adminStatus as ListingStatus,
        body.adminNote
      );
      return NextResponse.json({ listing });
    }

    if (!member) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    if (body.markSold) {
      const existing = (
        await import("@/lib/yardSale")
      ).getListingById(body.id);
      if (!existing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      }
      if (existing.memberId !== member.id && !isAdmin) {
        return NextResponse.json({ error: "Not your listing" }, { status: 403 });
      }
      const listing = setListingStatus(body.id, "sold");
      return NextResponse.json({ listing });
    }

    const listing = updateListing(body.id, member.id, {
      ...body,
      isAdmin: false,
    });
    return NextResponse.json({ listing });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not update listing" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const isAdmin = await isAdminAuthenticated();
    if (isAdmin) {
      deleteListing(id, undefined, true);
      return NextResponse.json({ ok: true });
    }

    const member = await getSessionMember();
    if (!member) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }
    deleteListing(id, member.id, false);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete listing" },
      { status: 400 }
    );
  }
}
