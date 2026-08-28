"use client";

import { useEffect } from "react";
import { isNativeAppShell } from "@/lib/nativeAppShell";

/** Marks the document when running inside the store WebView. */
export function NativeAppBoot() {
  useEffect(() => {
    if (isNativeAppShell()) {
      document.documentElement.dataset.appShell = "native";
    }
  }, []);
  return null;
}
