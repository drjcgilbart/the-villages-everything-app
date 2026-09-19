"use client";

import { useEffect, useState, type MouseEvent } from "react";
import {
  FAVORITES_CHANGED_EVENT,
  readClubFavoritesLocal,
  writeClubFavoritesLocal,
} from "@/lib/siteFavorites";

export function ClubFavoriteButton({
  clubId,
  name,
  variant = "icon",
}: {
  clubId: string;
  name: string;
  variant?: "icon" | "full";
}) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function refresh() {
      setFavorites(readClubFavoritesLocal());
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

  const isFav = favorites.includes(clubId);

  async function toggle(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = isFav
      ? favorites.filter((id) => id !== clubId)
      : [...favorites, clubId];
    setFavorites(next);
    writeClubFavoritesLocal(next);
    try {
      await fetch("/api/members/space", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoriteClubIds: next }),
      });
    } catch {
      /* keep local */
    }
  }

  if (!ready) {
    return (
      <button
        type="button"
        className={variant === "full" ? "btn btn-ghost btn-sm" : "dining-fav-icon"}
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
          isFav ? `Remove ${name} from favorites` : `Add ${name} to favorites`
        }
      >
        {isFav ? `★ ${name} is a favorite` : `☆ Favorite ${name}`}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`dining-fav-icon ${isFav ? "is-fav" : ""}`}
      onClick={toggle}
      aria-pressed={isFav}
      aria-label={
        isFav ? `Remove ${name} from favorites` : `Add ${name} to favorites`
      }
      title={isFav ? "Remove favorite" : "Add to My Space favorites"}
    >
      {isFav ? "★" : "☆"}
    </button>
  );
}
