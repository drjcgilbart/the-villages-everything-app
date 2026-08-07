import { notifyFavoritesChanged } from "./siteFavorites";

/** Browser localStorage key for favorite rec center ids (this device only). */
export const REC_FAVORITES_KEY = "tvh-rec-center-favorites";

export function readRecFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(REC_FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}

export function writeRecFavorites(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(REC_FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    /* quota / private mode */
  }
  notifyFavoritesChanged();
}

export function isRecFavorite(id: string, favorites: string[]): boolean {
  return favorites.includes(id);
}

export function toggleRecFavorite(
  id: string,
  favorites: string[]
): string[] {
  if (favorites.includes(id)) {
    return favorites.filter((f) => f !== id);
  }
  return [...favorites, id];
}

/** Sort so favorites come first, then keep a stable secondary order. */
export function sortWithFavoritesFirst<T extends { id: string; shortName: string }>(
  items: T[],
  favorites: string[]
): T[] {
  if (favorites.length === 0) {
    return [...items].sort((a, b) => a.shortName.localeCompare(b.shortName));
  }
  const favSet = new Set(favorites);
  const favIndex = new Map(favorites.map((id, i) => [id, i]));
  return [...items].sort((a, b) => {
    const aFav = favSet.has(a.id);
    const bFav = favSet.has(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    if (aFav && bFav) {
      return (favIndex.get(a.id) ?? 0) - (favIndex.get(b.id) ?? 0);
    }
    return a.shortName.localeCompare(b.shortName);
  });
}
