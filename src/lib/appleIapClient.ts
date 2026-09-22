"use client";

import { isNativeAppShell } from "@/lib/nativeAppShell";
import type { HubPlanId } from "@/lib/membershipTiers";

type DoneDetail = {
  ok?: boolean;
  error?: string;
  plan?: string;
  planLabel?: string;
  active?: boolean;
};

type WebViewWindow = Window & {
  ReactNativeWebView?: { postMessage: (data: string) => void };
  VillagesAppleIAP?: boolean;
};

function webViewWindow(): WebViewWindow | null {
  if (typeof window === "undefined") return null;
  return window as WebViewWindow;
}

export function isIosNativeApp(): boolean {
  if (!isNativeAppShell() || typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function appleIapBridgeReady(): boolean {
  return Boolean(webViewWindow()?.VillagesAppleIAP);
}

function postToApp(payload: unknown) {
  const view = webViewWindow()?.ReactNativeWebView;
  if (!view) {
    throw new Error("Update The Villages Everything App from the App Store, then try again.");
  }
  view.postMessage(JSON.stringify(payload));
}

function waitForApple(timeoutMs = 5 * 60 * 1000): Promise<DoneDetail> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      window.removeEventListener("vea-apple-done", onDone);
      reject(
        new Error(
          "Apple checkout timed out. If Apple already charged you, tap Restore Apple purchase."
        )
      );
    }, timeoutMs);
    function onDone(ev: Event) {
      window.clearTimeout(timer);
      window.removeEventListener("vea-apple-done", onDone);
      const detail = ((ev as CustomEvent).detail || {}) as DoneDetail;
      if (!detail.ok) reject(new Error(detail.error || "Apple purchase did not finish"));
      else resolve(detail);
    }
    window.addEventListener("vea-apple-done", onDone);
  });
}

/** iPhone app: Apple payment sheet. Website callers should use Stripe instead. */
export async function requestAppleSubscription(tier: HubPlanId) {
  if (!isIosNativeApp() || !appleIapBridgeReady()) {
    throw new Error(
      "Subscribe with Apple is in the latest iPhone app. Update The Villages Everything App from the App Store, then try again."
    );
  }
  const res = await fetch("/api/members/apple/prepare", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tier }),
  });
  const data = (await res.json()) as { error?: string; productId?: string; appAccountToken?: string };
  if (!res.ok || !data.productId || !data.appAccountToken) {
    throw new Error(data.error || "Could not start Apple checkout");
  }
  const pending = waitForApple();
  postToApp({
    type: "apple-purchase",
    productId: data.productId,
    appAccountToken: data.appAccountToken,
  });
  return pending;
}

export async function restoreAppleSubscription() {
  if (!isIosNativeApp() || !appleIapBridgeReady()) {
    throw new Error("Update The Villages Everything App from the App Store, then try again.");
  }
  const pending = waitForApple();
  postToApp({ type: "apple-restore" });
  return pending;
}
