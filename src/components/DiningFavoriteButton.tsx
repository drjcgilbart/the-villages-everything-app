"use client";

import { useEffect, useState, type MouseEvent } from "react";
import {
  isDiningFavorite,
  readDiningFavorites,
  toggleDiningFavorite,
  writeDiningFavorites,
} from "@/lib/diningFavorites";
import { FAVORITES_CHANGED_EVENT } from "@/lib/siteFavorites";

export function DiningFavoriteButton({
  restaurantId,
  name,
  variant = "icon",
}: {
  restaurantId: string;
  name: string;
  /** icon = compact star on cards; full = labeled button on detail pages */
  variant?: "icon" | "full";
}) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function refresh() {
      setFavorites(readDiningFavorites());
      setReady(true);
    }
    refresh();
    window.addEventListener(FAVORITES_CHANGED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(FAVORITES_CHANGED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const isFav = isDiningFavorite(restaurantId, favorites);

  function toggle(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleDiningFavorite(restaurantId, favorites);
    writeDiningFavorites(next);
    setFavorites(next);
  }

  if (!ready) {
    return (
      <button
        type="button"
        className={
          variant === "full"
            ? "btn btn-ghost btn-sm dining-fav-btn"
            : "dining-fav-icon"
        }
        disabled
        aria-hidden
      >
        {variant === "full" ? "☆ Favorite" : "☆"}
      </button>
    );
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        className={`btn ${isFav ? "btn-primary" : "btn-ghost"} btn-sm dining-fav-btn`}
        onClick={toggle}
        aria-pressed={isFav}
        title={
          isFav
            ? `Remove ${name} from favorites`
            : `Add ${name} to favorites`
        }
      >
        {isFav ? `★ ${name} is a favorite` : `☆ Favorite ${name}`}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`dining-fav-icon${isFav ? " is-fav" : ""}`}
      onClick={toggle}
      aria-pressed={isFav}
      aria-label={
        isFav
          ? `Remove ${name} from favorites`
          : `Add ${name} to favorites`
      }
      title={isFav ? "Remove from favorites" : "Add to favorites"}
    >
      {isFav ? "★" : "☆"}
    </button>
  );
}
