export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferred: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(event: BeforeInstallPromptEvent | null) => void>();

export function getDeferredInstall(): BeforeInstallPromptEvent | null {
  return deferred;
}

export function subscribeInstallPrompt(
  fn: (event: BeforeInstallPromptEvent | null) => void
): () => void {
  listeners.add(fn);
  fn(deferred);
  return () => {
    listeners.delete(fn);
  };
}

export function captureInstallPrompt(event: BeforeInstallPromptEvent) {
  deferred = event;
  listeners.forEach((fn) => fn(event));
}

export function clearInstallPrompt() {
  deferred = null;
  listeners.forEach((fn) => fn(null));
}

export function isStandaloneApp(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: window-controls-overlay)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}
