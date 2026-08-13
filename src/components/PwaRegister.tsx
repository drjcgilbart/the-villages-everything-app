"use client";

import { useEffect } from "react";
import { isNativeAppShell } from "@/lib/nativeAppShell";
import {
  captureInstallPrompt,
  clearInstallPrompt,
  type BeforeInstallPromptEvent,
} from "@/lib/pwaInstall";

/** Registers the tiny service worker so Chrome/Edge can install the site as an app. */
export function PwaRegister() {
  useEffect(() => {
    if (isNativeAppShell()) return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* private mode / blocked */
    });

    const onPrompt = (event: Event) => {
      event.preventDefault();
      captureInstallPrompt(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => clearInstallPrompt();

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return null;
}
