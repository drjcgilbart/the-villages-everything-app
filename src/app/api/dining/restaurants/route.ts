import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteRestaurant,
  loadDining,
  upsertRestaurant,
  withStats,
} from "@/lib/dining";
import type { Cuisine, PriceRange } from "@/lib/diningTypes";
import { CUISINES, PRICE_RANGES } from "@/lib/diningTypes";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = loadDining();
  return NextResponse.json({
    restaurants: withStats(data.restaurants, data.reviews),
  });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const cuisine = CUISINES.includes(body.cuisine) ? (body.cuisine as Cuisine) : "Other";
    const priceRange = PRICE_RANGES.includes(body.priceRange)
      ? (body.priceRange as PriceRange)
      : "$$";
    const tags = String(body.tags || "")
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
    const specialties = String(body.specialties || "")
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);
    const data = upsertRestaurant({
      id: body.id || undefined,
      name: body.name,
      slug: body.slug,
      cuisine,
      tags,
      area: body.area,
      address: body.address,
      phone: body.phone,
      website: body.website,
      priceRange,
      description: body.description,
      specialties,
      imageUrl: body.imageUrl,
      featured: !!body.featured,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save restaurant" },
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
    const data = deleteRestaurant(id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete restaurant" },
      { status: 400 }
    );
  }
}
