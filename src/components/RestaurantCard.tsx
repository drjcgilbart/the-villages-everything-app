import Image from "next/image";
import Link from "next/link";
import type { Restaurant, RestaurantStats } from "@/lib/diningTypes";
import { cuisineArtPath } from "@/lib/diningTypes";
import { DiningFavoriteButton } from "@/components/DiningFavoriteButton";
import { StarRating } from "@/components/StarRating";

export function RestaurantCard({
  restaurant,
  stats,
  rank,
}: {
  restaurant: Restaurant;
  stats: RestaurantStats;
  rank?: number;
}) {
  return (
    <article className="card restaurant-card">
      <div className="restaurant-card-fav">
        <DiningFavoriteButton
          restaurantId={restaurant.id}
          name={restaurant.name}
          variant="icon"
        />
      </div>
      <Link href={`/dining/${restaurant.slug}`} className="restaurant-card-link">
        <div className="restaurant-card-cuisine-art">
          <Image
            src={cuisineArtPath(restaurant.cuisine)}
            alt=""
            width={640}
            height={360}
            className="restaurant-card-cuisine-img"
          />
        </div>
        <div className="restaurant-card-top">
          {rank != null && <span className="restaurant-rank">#{rank}</span>}
          <div>
            <h3>{restaurant.name}</h3>
            <p className="restaurant-meta">
              <span className="pill pill-cuisine">{restaurant.cuisine}</span>
              <span>{restaurant.priceRange}</span>
              <span>{restaurant.area}</span>
            </p>
          </div>
        </div>
        <div className="restaurant-card-rating">
          <StarRating value={stats.averageRating} showValue />
          <span className="restaurant-review-count">
            {stats.reviewCount
              ? `${stats.reviewCount} review${stats.reviewCount === 1 ? "" : "s"}`
              : "No reviews yet"}
          </span>
        </div>
        <p className="restaurant-card-desc">{restaurant.description}</p>
        {restaurant.specialties?.length > 0 && (
          <p className="restaurant-specialties">
            Must-try: {restaurant.specialties.slice(0, 2).join(" · ")}
          </p>
        )}
        {stats.reviewCount > 0 && (
          <p className="restaurant-return">
            {stats.wouldReturnPct}% would return
          </p>
        )}
      </Link>
    </article>
  );
}
