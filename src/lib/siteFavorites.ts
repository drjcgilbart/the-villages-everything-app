/**
 * Cross-site favorites: each directory page still saves locally;
 * My Space reads the same keys so every starred pick shows up there.
 */

export const FAVORITES_CHANGED_EVENT = "tvh-favorites-changed";

export const MY_VILLAGE_KEY = "tvi-my-village-slug";
export const CLUB_FAVORITES_LOCAL_KEY = "tvh-club-favorites-local";

/** Fire after any favorite write so My Space (and others) can re-read. */
export function notifyFavoritesChanged(): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent(FAVORITES_CHANGED_EVENT));
  } catch {
    /* ignore */
  }
}

function readStringArray(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string" && id.length > 0);
  } catch {
    return [];
  }
}

function writeStringArray(key: string, ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify([...new Set(ids)]));
  } catch {
    /* quota / private mode */
  }
  notifyFavoritesChanged();
}

export function readMyVillageSlug(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(MY_VILLAGE_KEY);
    return v && v.trim() ? v.trim() : null;
  } catch {
    return null;
  }
}

export function writeMyVillageSlug(slug: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (slug) localStorage.setItem(MY_VILLAGE_KEY, slug);
    else localStorage.removeItem(MY_VILLAGE_KEY);
  } catch {
    /* ignore */
  }
  notifyFavoritesChanged();
}

export function readClubFavoritesLocal(): string[] {
  return readStringArray(CLUB_FAVORITES_LOCAL_KEY);
}

export function writeClubFavoritesLocal(ids: string[]): void {
  writeStringArray(CLUB_FAVORITES_LOCAL_KEY, ids);
}
