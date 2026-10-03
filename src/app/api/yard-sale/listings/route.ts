import { NextResponse } from "next/server";
import { notifyAdminOfApprovalRequest } from "@/lib/adminNotify";
import { isAdminAuthenticated } from "@/lib/auth";
import { rateLimitResponse } from "@/lib/authRateLimit";
import { getSessionMember } from "@/lib/memberAuth";
import {
  applyListingAction,
  createListing,
  deleteListing,
  getListingById,
  getMemberById,
  hydrateYardSale,
  loadYardSale,
  saveYardSaleAsync,
  setListingStatus,
  updateListing,
  type ListingAction,
} from "@/lib/yardSale";
import type { ListingStatus } from "@/lib/yardSaleTypes";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const limited = rateLimitResponse(req, "yard-sale-post", 8, 15 * 60 * 1000);
    if (limited) return limited;
    await hydrateYardSale();
    const member = await getSessionMember();
    const signedIn = member && member.status === "approved" ? member : null;
    const body = await req.json();
    const listing = createListing(signedIn?.id || null, {
      title: body.title,
      description: body.description,
      price: body.price,
      isFree: body.isFree,
      condition: body.condition,
      category: body.category,
      meetupType: body.meetupType,
      meetupNotes: body.meetupNotes,
      contactMethod: body.contactMethod,
      contactBy: body.contactBy,
      images: body.images,
      videoUrl: body.videoUrl,
      sellerName: body.sellerName,
      sellerEmail: body.sellerEmail,
      sellerPhone: body.sellerPhone,
      sellerVillage: body.sellerVillage,
    });
    if (listing.status === "pending") {
      await notifyAdminOfApprovalRequest({
        topic: "Marketplace",
        title: listing.title,
        submittedBy: listing.submittedByName || "Guest",
        createdAt: listing.createdAt,
        details: {
          title: listing.title,
          category: listing.category,
          price: listing.isFree ? "Free" : listing.price,
          condition: listing.condition,
          description: listing.description,
          seller: listing.sellerName,
          sellerEmail: listing.sellerEmail,
          sellerPhone: listing.sellerPhone,
          sellerVillage: listing.sellerVillage,
          postedBy: listing.submittedByName || "Guest",
          photos: listing.images?.length,
        },
      });
    }
    await saveYardSaleAsync(loadYardSale());
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
    await hydrateYardSale();
    const body = await req.json();
    const isAdmin = await isAdminAuthenticated();
    const member = await getSessionMember();

    if (
      body.action === "archive" ||
      body.action === "refresh" ||
      body.action === "remove"
    ) {
      if (!isAdmin && (!member || member.status !== "approved")) {
        return NextResponse.json(
          { error: "An approved membership is required" },
          { status: 401 }
        );
      }
      const listing = applyListingAction(body.id, body.action as ListingAction, {
        memberId: member?.id || "",
        memberEmail: member?.email || "",
        isAdmin,
      });
      await saveYardSaleAsync(loadYardSale());
      return NextResponse.json({ listing });
    }

    if (isAdmin && body.adminEdit) {
      const listing = updateListing(body.id, member?.id || "", {
        title: body.title,
        description: body.description,
        price: body.price,
        isFree: body.isFree,
        condition: body.condition,
        category: body.category,
        meetupType: body.meetupType,
        meetupNotes: body.meetupNotes,
        contactMethod: body.contactMethod,
        contactBy: body.contactBy,
        sellerName: body.sellerName,
        sellerEmail: body.sellerEmail,
        sellerPhone: body.sellerPhone,
        sellerVillage: body.sellerVillage,
        images: body.images,
        videoUrl: body.videoUrl,
        isAdmin: true,
      });
      await saveYardSaleAsync(loadYardSale());
      return NextResponse.json({ listing });
    }

    if (isAdmin && body.adminStatus) {
      const listing = setListingStatus(
        body.id,
        body.adminStatus as ListingStatus,
        body.adminNote
      );
      await saveYardSaleAsync(loadYardSale());
      return NextResponse.json({ listing });
    }

    if (!member || member.status !== "approved") {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }

    if (body.markSold) {
      const existing = getListingById(body.id);
      if (!existing) {
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      }
      if (existing.memberId !== member.id && !isAdmin) {
        return NextResponse.json({ error: "Not your listing" }, { status: 403 });
      }
      const listing = setListingStatus(body.id, "sold");
      await saveYardSaleAsync(loadYardSale());
      return NextResponse.json({ listing });
    }

    const before = getListingById(body.id);
    const listing = updateListing(body.id, member.id, {
      ...body,
      isAdmin: false,
      actorEmail: member.email,
    });
    if (listing.status === "pending" && before?.status === "rejected") {
      const seller = getMemberById(listing.memberId);
      await notifyAdminOfApprovalRequest({
        topic: "Marketplace",
        title: listing.title,
        submittedBy: seller?.name || member.name,
        createdAt: listing.updatedAt || listing.createdAt,
        details: {
          title: listing.title,
          category: listing.category,
          price: listing.isFree ? "Free" : listing.price,
          condition: listing.condition,
          description: listing.description,
          seller: seller?.name || member.name,
          sellerEmail: seller?.email || member.email,
          note: "Member edited this rejected listing and sent it back for approval.",
        },
      });
    }
    await saveYardSaleAsync(loadYardSale());
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
    await hydrateYardSale();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const isAdmin = await isAdminAuthenticated();
    if (isAdmin) {
      deleteListing(id, undefined, true);
      await saveYardSaleAsync(loadYardSale());
      return NextResponse.json({ ok: true });
    }

    const member = await getSessionMember();
    if (!member) {
      return NextResponse.json({ error: "Sign in required" }, { status: 401 });
    }
    deleteListing(id, member.id, false, member.email);
    await saveYardSaleAsync(loadYardSale());
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete listing" },
      { status: 400 }
    );
  }
}
