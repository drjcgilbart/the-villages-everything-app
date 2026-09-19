import Link from "next/link";
import { ClubListRows } from "@/components/ClubListRows";
import { loadClubListingsAsync, searchApprovedClubs } from "@/lib/clubListings";
import { summarizeClub } from "@/lib/clubPaths";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = String(q || "").trim();
  return {
    title: query ? `Clubs matching “${query}”` : "Search clubs",
  };
}

export default async function ClubSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = String(q || "").trim();
  const data = await loadClubListingsAsync();
  const listings = query
    ? searchApprovedClubs(query, data).map(summarizeClub)
    : [];

  return (
    <div className="section">
      <div className="shell">
        <p className="kicker">
          <Link href="/club-zone#leader-directory" className="text-link">
            Club directory
          </Link>
        </p>
        <h1>Search clubs</h1>
        <form className="club-search-form" action="/club-zone/search" method="get">
          <label className="rc-field club-search-field">
            <span>Find a club</span>
            <input
              className="rc-search"
              name="q"
              defaultValue={query}
              placeholder="Name, rec center, leader…"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-sm">
            Search
          </button>
        </form>
        {query ? (
          <>
            <p style={{ color: "var(--muted)" }}>
              {listings.length.toLocaleString()} result
              {listings.length === 1 ? "" : "s"} for “{query}”.
            </p>
            <ClubListRows listings={listings} />
          </>
        ) : (
          <p className="panel-hint">Type a club name, rec center, or leader.</p>
        )}
      </div>
    </div>
  );
}
