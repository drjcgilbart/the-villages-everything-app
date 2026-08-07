import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  bomMonthKey,
  castBomVoteAsync,
  ensurePastMonthsTabulatedAsync,
  getResultsForFeaturedMonth,
  isBomCategory,
  listApprovedForMonth,
  submitBomEntryAsync,
  voterChoicesThisMonth,
} from "@/lib/bestOfMonth";
import type { BomCategory, BomFileType } from "@/lib/bestOfMonthTypes";
import { BOM_CATEGORIES, BOM_CATEGORY_META } from "@/lib/bestOfMonthTypes";

export const dynamic = "force-dynamic";

const VOTER_COOKIE = "tvh_bom_voter";

async function getOrCreateVoterKey(): Promise<{
  key: string;
  setCookie?: string;
}> {
  const jar = await cookies();
  const existing = jar.get(VOTER_COOKIE)?.value;
  if (existing && existing.length >= 8) return { key: existing };
  const key = `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  return { key, setCookie: key };
}

export async function GET() {
  let data = await ensurePastMonthsTabulatedAsync();
  const monthKey = bomMonthKey();
  const { key: voterKey, setCookie } = await getOrCreateVoterKey();

  const byCategory = Object.fromEntries(
    BOM_CATEGORIES.map((cat) => [
      cat,
      listApprovedForMonth(data, monthKey, cat),
    ])
  ) as Record<BomCategory, ReturnType<typeof listApprovedForMonth>>;

  const featured = getResultsForFeaturedMonth(data, monthKey);
  const featuredEntries = featured
    ? Object.fromEntries(
        featured.categories.map((c) => {
          return [
            c.category,
            {
              ...c,
              winner: c.winnerEntryId
                ? data.entries.find((e) => e.id === c.winnerEntryId) || null
                : null,
              honorableMentions: c.honorableMentionIds
                .map((id) => data.entries.find((e) => e.id === id))
                .filter(Boolean),
            },
          ];
        })
      )
    : null;

  const res = NextResponse.json({
    monthKey,
    categories: BOM_CATEGORY_META,
    categoryIds: BOM_CATEGORIES,
    entriesByCategory: byCategory,
    myVotes: voterChoicesThisMonth(data, voterKey, monthKey),
    lastMonthResults: featured
      ? {
          monthKey: featured.monthKey,
          tabulatedAt: featured.tabulatedAt,
          categories: featuredEntries,
        }
      : null,
    pendingCount: data.entries.filter((e) => e.status === "pending").length,
  });

  if (setCookie) {
    res.cookies.set(VOTER_COOKIE, setCookie, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 400,
    });
  }
  return res;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = String(body.action || "submit").toLowerCase();

    if (action === "submit") {
      const category = String(body.category || "");
      if (!isBomCategory(category)) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      }
      const entry = await submitBomEntryAsync({
        category,
        title: body.title,
        description: body.description,
        submitterName: body.submitterName,
        imageUrl: body.imageUrl,
        fileType: (body.fileType === "pdf" ? "pdf" : "image") as BomFileType,
      });
      return NextResponse.json({
        ok: true,
        entry: { id: entry.id, status: entry.status, category: entry.category },
        message:
          "Thanks! Your entry is pending admin approval. Once approved, it appears for voting this month.",
      });
    }

    if (action === "vote") {
      const { key: voterKey, setCookie } = await getOrCreateVoterKey();
      const result = await castBomVoteAsync({
        entryId: String(body.entryId || ""),
        voterKey,
      });
      const res = NextResponse.json({
        ok: true,
        entryId: result.entry.id,
        votes: result.votes,
        category: result.entry.category,
        message: "Vote recorded — thanks!",
      });
      if (setCookie) {
        res.cookies.set(VOTER_COOKIE, setCookie, {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 400,
        });
      }
      return res;
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed" },
      { status: 400 }
    );
  }
}
