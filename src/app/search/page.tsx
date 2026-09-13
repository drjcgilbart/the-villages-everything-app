import type { Metadata } from "next";
import { searchSite } from "@/lib/siteSearch";
import { SiteSearch } from "@/components/SiteSearch";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Search",
  description: "Search The Villages Everything App.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = String(q || "").trim();
  const hits = query.length >= 2 ? searchSite(query, 40) : [];

  return (
    <div className="shell page-narrow">
      <p className="kicker">Search this website</p>
      <h1>Find it on the app</h1>
      <SiteSearch />
      {query ? (
        <p className="panel-hint">
          {hits.length
            ? `${hits.length} match${hits.length === 1 ? "" : "es"} for “${query}”.`
            : `Nothing on this website matched “${query}”. Use Search X or Search the internet in the box above.`}
        </p>
      ) : (
        <p className="panel-hint">Type a village, restaurant, rec center, club, or topic.</p>
      )}
      {hits.length ? (
        <ul className="site-search-page-list">
          {hits.map((h) => (
            <li key={`${h.href}-${h.title}`}>
              <Link href={h.href}>
                <span className="site-search-kicker">{h.section}</span>
                <strong>{h.title}</strong>
                {h.snippet ? <p>{h.snippet}</p> : null}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
