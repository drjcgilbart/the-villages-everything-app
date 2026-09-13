/** Per-login, per-board “Hide my data” — covers the screen, does not delete. */

import type { StoredBoardId } from "./memberBoardModel";

export const PAGE_HIDE_EVENT = "tvea-ms-page-hide";

const HIDE_PREFIX = "tvea-ms-page-hide-v1";

export type MySpacePrivacyTarget = StoredBoardId | "favorites";

function hideKey(memberId: string, board: MySpacePrivacyTarget) {
  return `${HIDE_PREFIX}::${memberId}::${board}`;
}

export function readPageHidden(memberId: string, board: MySpacePrivacyTarget) {
  if (typeof window === "undefined" || !memberId) return false;
  try {
    return localStorage.getItem(hideKey(memberId, board)) === "1";
  } catch {
    return false;
  }
}

export function writePageHidden(
  memberId: string,
  board: MySpacePrivacyTarget,
  hidden: boolean
) {
  if (typeof window === "undefined" || !memberId) return;
  try {
    const key = hideKey(memberId, board);
    if (hidden) localStorage.setItem(key, "1");
    else localStorage.removeItem(key);
  } catch {
    /* quota / private mode */
  }
  window.dispatchEvent(new Event(PAGE_HIDE_EVENT));
}

export function subscribePageHidden(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (!e.key || e.key.startsWith(HIDE_PREFIX) || e.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(PAGE_HIDE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(PAGE_HIDE_EVENT, onChange);
  };
}

const SCOPED_BOARD_KEYS: Partial<Record<StoredBoardId, string>> = {
  health: "tvea-ms-health-v2",
  pets: "tvea-ms-pet-v2",
  weather: "tvea-ms-weather-locs-v1",
  portfolio: "tvh-wealth-portfolio-v1",
};

export function clearScopedBoardCache(
  memberId: string,
  boards: StoredBoardId[]
) {
  if (typeof window === "undefined" || !memberId) return;
  try {
    for (const board of boards) {
      const base = SCOPED_BOARD_KEYS[board];
      if (base) localStorage.removeItem(`${base}::${memberId}`);
    }
  } catch {
    /* ignore */
  }
}
