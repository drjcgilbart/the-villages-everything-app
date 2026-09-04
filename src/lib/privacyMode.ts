/** Admin-only “Hide my data” for screen recording. Nothing is deleted. */

export const PRIVACY_STORAGE_KEY = "tve.privacyHidden";
export const PRIVACY_EVENT = "tve-privacy-change";

export function readPrivacyHidden(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(PRIVACY_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writePrivacyHidden(hidden: boolean) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRIVACY_STORAGE_KEY, hidden ? "1" : "0");
  } catch {
    /* private mode / quota */
  }
  window.dispatchEvent(new Event(PRIVACY_EVENT));
}

export function subscribePrivacy(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === PRIVACY_STORAGE_KEY || e.key === null) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(PRIVACY_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(PRIVACY_EVENT, onChange);
  };
}
