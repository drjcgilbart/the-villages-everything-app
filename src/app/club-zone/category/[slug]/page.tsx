import Link from "next/link";
import { notFound } from "next/navigation";
import { ClubListRows } from "@/components/ClubListRows";
import {
  listApprovedClubsByCategory,
  loadClubListingsAsync,
} from "@/lib/clubListings";
import {
  CLUB_CATEGORY_ICONS,
  clubCategoryFromSlug,
  summarizeClub,
} from "@/lib/clubPaths";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = clubCategoryFromSlug(slug);
  if (!category) return { title: "Club category" };
  return {
    title: `${category} clubs`,
    description: `Resident clubs in ${category} from The Villages District Recreation directory.`,
  };
}

export default async function ClubCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = clubCategoryFromSlug(slug);
  if (!category) notFound();
  const data = await loadClubListingsAsync();
  const listings = listApprovedClubsByCategory(category, data).map(summarizeClub);

  return (
    <div className="section">
      <div className="shell">
        <p className="kicker">
          <Link href="/club-zone#leader-directory" className="text-link">
            Club directory
          </Link>
        </p>
        <h1>
          <span aria-hidden>{CLUB_CATEGORY_ICONS[category]} </span>
          {category}
        </h1>
        <p style={{ color: "var(--muted)", marginTop: 0 }}>
          {listings.length.toLocaleString()} club
          {listings.length === 1 ? "" : "s"} · tap a name for contacts, or star
          it for My Space.
        </p>
        <ClubListRows listings={listings} />
      </div>
    </div>
  );
}
