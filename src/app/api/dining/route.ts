import { NextResponse } from "next/server";
import {
  allCuisineLeaders,
  diningSummary,
  getInterviews,
  loadDiningAsync,
  overallLeaders,
  withStats,
} from "@/lib/dining";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await loadDiningAsync();
  const restaurants = withStats(data.restaurants, data.reviews).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  return NextResponse.json({
    restaurants,
    interviews: getInterviews(),
    cuisineLeaders: allCuisineLeaders(5, 1),
    overallLeaders: overallLeaders(10, 1),
    summary: diningSummary(),
    updatedAt: data.updatedAt,
  });
}
