"use client";

import { useEffect } from "react";
import { useSyncExternalStore } from "react";
import {
  readPrivacyHidden,
  subscribePrivacy,
} from "@/lib/privacyMode";

function serverSnapshot() {
  return false;
}

/** Applies privacy-mode on the document when an admin has Hide my data on. */
export function PrivacyModeRoot({ isAdmin = false }: { isAdmin?: boolean }) {
  const stored = useSyncExternalStore(
    subscribePrivacy,
    readPrivacyHidden,
    serverSnapshot
  );
  const on = Boolean(isAdmin && stored);

  useEffect(() => {
    document.documentElement.classList.toggle("privacy-mode", on);
    return () => document.documentElement.classList.remove("privacy-mode");
  }, [on]);

  if (!on) return null;

  return (
    <div className="privacy-banner" role="status">
      Personal data is hidden for recording. Nothing was deleted. Press{" "}
      <strong>Show my data</strong> when you are done.
    </div>
  );
}
