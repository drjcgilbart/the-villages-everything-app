import Image from "next/image";
import Link from "next/link";
import { DiningFavoriteButton } from "@/components/DiningFavoriteButton";
import { MemberName } from "@/components/MemberName";
import { RestaurantCard } from "@/components/RestaurantCard";
import { RestaurantSuggestForm } from "@/components/RestaurantSuggestForm";
import { StarRating } from "@/components/StarRating";
import {
  allCuisineLeaders,
  diningSummary,
  getInterviews,
  loadDining,
  overallLeaders,
  recentReviews,
  withStats,
} from "@/lib/dining";
import { formatDate } from "@/lib/format";
import { CUISINE_ART, CUISINES } from "@/lib/diningTypes";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Dining",
  description:
    "Dining in and around The Villages — restaurant reviews, ratings, top 5 by cuisine, and staff interviews.",
};

export default function DiningPage() {
  const data = loadDining();
  const summary = diningSummary();
  const cuisineLeaders = allCuisineLeaders(5, 1);
  const topOverall = overallLeaders(5, 1);
  const interviews = getInterviews({ featuredOnly: false }).slice(0, 4);
  const recent = recentReviews(6);
  const allRestaurants = withStats(data.restaurants, data.reviews).sort(
    (a, b) => {
      if (b.stats.averageRating !== a.stats.averageRating) {
        return b.stats.averageRating - a.stats.averageRating;
      }
      return a.name.localeCompare(b.name);
    }
  );

  return (
    <>
      <div className="page-hero page-hero-graphic">
        <div className="shell page-hero-grid">
          <div>
            <span className="kicker">Menus · ratings · kitchen stories</span>
            <h1>Dining In &amp; Around The Villages</h1>
            <p>
              Community restaurant guide with live 1–5 star ratings, top 5
              leaderboards by cuisine, staff interviews, and honest reviews from
              people who actually eat here (often before 5 p.m.). Star a spot
              with ☆ — favorites land on{" "}
              <a href="/my-space#ms-favorites">My Space</a> too.
            </p>
            <div className="dining-summary-stats">
              <div className="stat">
                <strong>{summary.restaurantCount}</strong>
                <span>Restaurants</span>
              </div>
              <div className="stat">
                <strong>{summary.reviewCount}</strong>
                <span>Reviews</span>
              </div>
              <div className="stat">
                <strong>{summary.averageRating || "—"}</strong>
                <span>Avg rating</span>
              </div>
              <div className="stat">
                <strong>{summary.interviewCount}</strong>
                <span>Interviews</span>
              </div>
            </div>
          </div>
          <div className="page-hero-art">
            <Image
              src="/graphics/theme-dining-v2.jpg"
              alt=""
              width={260}
              height={260}
              className="page-hero-img"
            />
          </div>
        </div>
      </div>

      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="shell">
          <div className="dining-jump">
            <span className="dining-jump-label">Jump to cuisine</span>
            {CUISINES.map((c) => (
              <a key={c} href={`#cuisine-${c.toLowerCase()}`} className="dining-chip">
                {c}
              </a>
            ))}
            <a href="#all-restaurants" className="dining-chip">
              All spots
            </a>
            <a href="#suggest" className="dining-chip">
              Suggest a spot
            </a>
            <a href="#interviews" className="dining-chip">
              Interviews
            </a>
          </div>
        </div>
      </section>

      {topOverall.length > 0 && (
        <section className="section">
          <div className="shell">
            <div className="section-head">
              <div>
                <h2>Hall of Fame · Top overall</h2>
                <p>
                  Highest average ratings sitewide — updates the moment a new
                  review lands.
                </p>
              </div>
            </div>
            <div className="card-grid">
              {topOverall.map((r) => (
                <RestaurantCard
                  key={r.id}
                  restaurant={r}
                  stats={r.stats}
                  rank={r.rank}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Top 5 by cuisine</h2>
              <p>
                Live leaderboards for every cuisine with reviews. Rankings use
                average stars, then number of reviews as the tiebreaker.
              </p>
            </div>
          </div>

          {cuisineLeaders.length === 0 ? (
            <div className="empty-state">
              No ranked restaurants yet. Add a review to start the boards.
            </div>
          ) : (
            <div className="cuisine-boards">
              {cuisineLeaders.map(({ cuisine, leaders }) => (
                <div
                  key={cuisine}
                  id={`cuisine-${cuisine.toLowerCase()}`}
                  className="cuisine-board about-panel"
                >
                  <div className="cuisine-board-art">
                    <Image
                      src={CUISINE_ART[cuisine]}
                      alt=""
                      width={640}
                      height={640}
                      className="cuisine-board-img"
                    />
                  </div>
                  <div className="cuisine-board-head">
                    <h3>{cuisine}</h3>
                    <span>Top {leaders.length}</span>
                  </div>
                  <ol className="cuisine-leader-list">
                    {leaders.map((r) => (
                      <li key={r.id} className="cuisine-leader-row">
                        <Link href={`/dining/${r.slug}`} className="cuisine-leader-link">
                          <span className="leader-rank">{r.rank}</span>
                          <span className="leader-main">
                            <strong>{r.name}</strong>
                            <em>
                              {r.area} · {r.priceRange}
                            </em>
                          </span>
                          <span className="leader-score">
                            <StarRating value={r.stats.averageRating} size="sm" showValue />
                            <small>{r.stats.reviewCount} reviews</small>
                          </span>
                        </Link>
                        <DiningFavoriteButton
                          restaurantId={r.id}
                          name={r.name}
                          variant="icon"
                        />
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" id="interviews" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Kitchen interviews</h2>
              <p>
                Conversations with chefs, owners, and the people who make the
                plates happen.
              </p>
            </div>
          </div>
          {interviews.length === 0 ? (
            <div className="empty-state">
              Interviews coming soon — check Studio to publish one.
            </div>
          ) : (
            <div className="interview-grid">
              {interviews.map((interview) => {
                const rest = data.restaurants.find(
                  (r) => r.id === interview.restaurantId
                );
                return (
                  <article key={interview.id} className="card interview-card">
                    <div className="card-meta">
                      <span className="pill pill-interview">Interview</span>
                      <time dateTime={interview.publishedAt}>
                        {formatDate(interview.publishedAt)}
                      </time>
                    </div>
                    <h3>{interview.title}</h3>
                    <p className="interview-person">
                      <strong>{interview.personName}</strong>
                      <span>
                        {interview.role}
                        {rest ? ` · ${rest.name}` : ""}
                      </span>
                    </p>
                    {interview.quote && (
                      <blockquote className="interview-quote">
                        “{interview.quote}”
                      </blockquote>
                    )}
                    <p>{interview.excerpt}</p>
                    {rest && (
                      <Link href={`/dining/${rest.slug}`} className="text-link">
                        Visit restaurant →
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Latest reviews</h2>
              <p>Fresh takes from the dining community.</p>
            </div>
          </div>
          <div className="recent-reviews">
            {recent.map(({ review, restaurant }) => (
              <article key={review.id} className="recent-review about-panel">
                <div className="card-meta">
                  <StarRating value={review.rating} size="sm" />
                  <time dateTime={review.createdAt}>
                    {formatDate(review.createdAt)}
                  </time>
                </div>
                <h3>
                  {restaurant ? (
                    <Link href={`/dining/${restaurant.slug}`}>{review.title}</Link>
                  ) : (
                    review.title
                  )}
                </h3>
                <p className="recent-review-meta">
                  <MemberName
                    name={review.authorName}
                    memberId={review.authorMemberId}
                  />
                  {restaurant ? ` on ${restaurant.name}` : ""}
                  {review.dish ? ` · ordered ${review.dish}` : ""}
                </p>
                <p>{review.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="all-restaurants" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>All restaurants</h2>
              <p>
                Full directory — sorted by rating. Click any spot to rate it and
                move the leaderboards.
              </p>
            </div>
          </div>
          <div className="card-grid">
            {allRestaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} stats={r.stats} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="suggest" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div>
              <h2>Missing a favorite?</h2>
              <p>
                Suggest a restaurant in or around The Villages. After admin
                approval, it joins the Dining guide for reviews and ratings.
              </p>
            </div>
          </div>
          <div className="about-panel dining-suggest-panel">
            <RestaurantSuggestForm />
          </div>
        </div>
      </section>
    </>
  );
}
