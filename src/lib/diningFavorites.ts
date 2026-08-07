import { notifyFavoritesChanged } from "./siteFavorites";

/** Browser localStorage key for favorite restaurant ids (this device only). */
export const DINING_FAVORITES_KEY = "tvh-dining-favorites";

export function readDiningFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DINING_FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string" && id.length > 0);
  } catch {
    return [];
  }
}

export function writeDiningFavorites(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DINING_FAVORITES_KEY, JSON.stringify([...new Set(ids)]));
  } catch {
    /* quota / private mode */
  }
  notifyFavoritesChanged();
}

export function isDiningFavorite(id: string, favorites: string[]): boolean {
  return favorites.includes(id);
}

export function toggleDiningFavorite(
  id: string,
  favorites: string[]
): string[] {
  if (favorites.includes(id)) {
    return favorites.filter((f) => f !== id);
  }
  return [...favorites, id];
}
