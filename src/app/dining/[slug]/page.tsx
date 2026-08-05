import Link from "next/link";
import { notFound } from "next/navigation";
import { ReviewForm } from "@/components/ReviewForm";
import { StarRating } from "@/components/StarRating";
import {
  computeStats,
  getInterviews,
  getRestaurantBySlug,
  getVisibleReviews,
  loadDining,
  topByCuisine,
} from "@/lib/dining";
import { formatDate, paragraphs } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = getRestaurantBySlug(slug);
  if (!restaurant) return { title: "Restaurant" };
  return {
    title: restaurant.name,
    description: restaurant.description,
  };
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  const data = loadDining();
  const stats = computeStats(restaurant.id, data.reviews);
  const reviews = getVisibleReviews(data.reviews, restaurant.id);
  const interviews = getInterviews({ restaurantId: restaurant.id });
  const peers = topByCuisine(restaurant.cuisine, 5, 1);
  const myRank = peers.find((p) => p.id === restaurant.id)?.rank;

  const maxBar = Math.max(1, ...Object.values(stats.breakdown));

  return (
    <article>
      <div className="article-hero">
        <div className="shell">
          <div className="card-meta">
            <span className="pill pill-cuisine">{restaurant.cuisine}</span>
            <span>{restaurant.priceRange}</span>
            <span>{restaurant.area}</span>
            {myRank != null && (
              <span className="pill pill-rank">#{myRank} in {restaurant.cuisine}</span>
            )}
          </div>
          <h1>{restaurant.name}</h1>
          <p className="subtitle">{restaurant.description}</p>
          <div className="restaurant-hero-rating">
            <StarRating value={stats.averageRating} size="lg" showValue />
            <div>
              <strong>
                {stats.reviewCount
                  ? `${stats.reviewCount} community review${stats.reviewCount === 1 ? "" : "s"}`
                  : "No reviews yet — be the first"}
              </strong>
              {stats.reviewCount > 0 && (
                <p>{stats.wouldReturnPct}% would return</p>
              )}
            </div>
          </div>
          {restaurant.specialties?.length > 0 && (
            <p className="restaurant-specialties-hero">
              Must-try: {restaurant.specialties.join(" · ")}
            </p>
          )}
          <p style={{ marginTop: "1rem" }}>
            <Link href="/dining" className="text-link">
              ← All dining
            </Link>
          </p>
        </div>
      </div>

      <div className="section">
        <div className="shell dining-detail-grid">
          <div>
            {stats.reviewCount > 0 && (
              <div className="about-panel rating-breakdown">
                <h2>Rating breakdown</h2>
                {([5, 4, 3, 2, 1] as const).map((star) => (
                  <div key={star} className="rating-bar-row">
                    <span>{star}★</span>
                    <div className="rating-bar-track">
                      <div
                        className="rating-bar-fill"
                        style={{
                          width: `${(stats.breakdown[star] / maxBar) * 100}%`,
                        }}
                      />
                    </div>
                    <span>{stats.breakdown[star]}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="about-panel" style={{ marginTop: "1rem" }}>
              <h2>Details</h2>
              <ul className="restaurant-details-list">
                <li>
                  <strong>Cuisine</strong> {restaurant.cuisine}
                </li>
                <li>
                  <strong>Area</strong> {restaurant.area}
                </li>
                {restaurant.address && (
                  <li>
                    <strong>Address</strong> {restaurant.address}
                  </li>
                )}
                {restaurant.phone && (
                  <li>
                    <strong>Phone</strong> {restaurant.phone}
                  </li>
                )}
                {restaurant.website && (
                  <li>
                    <strong>Web</strong>{" "}
                    <a href={restaurant.website} target="_blank" rel="noreferrer">
                      Visit site
                    </a>
                  </li>
                )}
                <li>
                  <strong>Price</strong> {restaurant.priceRange}
                </li>
                {restaurant.tags?.length > 0 && (
                  <li>
                    <strong>Tags</strong> {restaurant.tags.join(", ")}
                  </li>
                )}
              </ul>
            </div>

            {peers.length > 0 && (
              <div className="about-panel" style={{ marginTop: "1rem" }}>
                <h2>Top {restaurant.cuisine} right now</h2>
                <ol className="cuisine-leader-list compact">
                  {peers.map((p) => (
                    <li key={p.id} className={p.id === restaurant.id ? "is-self" : ""}>
                      <Link href={`/dining/${p.slug}`}>
                        <span className="leader-rank">{p.rank}</span>
                        <span className="leader-main">
                          <strong>{p.name}</strong>
                        </span>
                        <span className="leader-score">
                          <StarRating value={p.stats.averageRating} size="sm" showValue />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <div>
            <div className="about-panel">
              <ReviewForm
                restaurantId={restaurant.id}
                restaurantName={restaurant.name}
              />
            </div>

            <div style={{ marginTop: "1.5rem" }}>
              <h2 className="dining-section-title">
                Reviews ({reviews.length})
              </h2>
              {reviews.length === 0 ? (
                <div className="empty-state">No reviews yet. Yours could be #1.</div>
              ) : (
                <div className="review-list">
                  {reviews.map((review) => (
                    <article key={review.id} className="about-panel review-item">
                      <div className="card-meta">
                        <StarRating value={review.rating} size="sm" />
                        <time dateTime={review.createdAt}>
                          {formatDate(review.createdAt)}
                        </time>
                      </div>
                      <h3>{review.title}</h3>
                      <p className="recent-review-meta">
                        {review.authorName}
                        {review.dish ? ` · ${review.dish}` : ""}
                        {review.wouldReturn ? " · Would return" : " · Might skip next time"}
                      </p>
                      <p>{review.body}</p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {interviews.length > 0 && (
              <div style={{ marginTop: "1.75rem" }}>
                <h2 className="dining-section-title">Staff interviews</h2>
                <div className="review-list">
                  {interviews.map((interview) => (
                    <article key={interview.id} className="about-panel">
                      <div className="card-meta">
                        <span className="pill pill-interview">Interview</span>
                        <time dateTime={interview.publishedAt}>
                          {formatDate(interview.publishedAt)}
                        </time>
                      </div>
                      <h3>{interview.title}</h3>
                      <p className="interview-person">
                        <strong>{interview.personName}</strong>
                        <span>{interview.role}</span>
                      </p>
                      {interview.quote && (
                        <blockquote className="interview-quote">
                          “{interview.quote}”
                        </blockquote>
                      )}
                      {paragraphs(interview.body).map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
