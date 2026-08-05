import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/auth";
import {
  deleteInterview,
  getInterviews,
  upsertInterview,
} from "@/lib/dining";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ interviews: getInterviews() });
}

export async function POST(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const data = upsertInterview({
      id: body.id || undefined,
      restaurantId: body.restaurantId,
      personName: body.personName,
      role: body.role,
      title: body.title,
      excerpt: body.excerpt,
      body: body.body,
      quote: body.quote,
      imageUrl: body.imageUrl,
      featured: !!body.featured,
      publishedAt: body.publishedAt,
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not save interview" },
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
    const data = deleteInterview(id);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Could not delete interview" },
      { status: 400 }
    );
  }
}
