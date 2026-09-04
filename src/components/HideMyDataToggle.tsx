"use client";

import { useSyncExternalStore } from "react";
import {
  readPrivacyHidden,
  subscribePrivacy,
  writePrivacyHidden,
} from "@/lib/privacyMode";

function serverSnapshot() {
  return false;
}

/**
 * Admin-only. Hides personal My Space notes for recording.
 * Does not delete anything. Neighbors never see this control.
 */
export function HideMyDataToggle({ isAdmin = false }: { isAdmin?: boolean }) {
  const hidden = useSyncExternalStore(
    subscribePrivacy,
    readPrivacyHidden,
    serverSnapshot
  );

  if (!isAdmin) return null;

  return (
    <button
      type="button"
      className={`local-dev-btn local-dev-privacy${hidden ? " privacy-on" : ""}`}
      aria-pressed={hidden}
      title={
        hidden
          ? "Personal notes are hidden. Press again to show them. Nothing was deleted."
          : "Hide personal notes for screen recording. Nothing is deleted."
      }
      onClick={() => writePrivacyHidden(!hidden)}
    >
      <span aria-hidden="true">{hidden ? "🙈" : "👁"}</span>
      {hidden ? "Show my data" : "Hide my data"}
    </button>
  );
}
