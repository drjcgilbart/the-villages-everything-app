"use client";

import { useEffect, useState } from "react";

/** Hide floating chrome on phones after a short idle; scroll brings it back. */
const IDLE_MS = 2800;
const PHONE_MQ = "(max-width: 720px)";

let idle = false;
let timer: number | null = null;
let listening = false;
const subs = new Set<() => void>();

function isPhone() {
  return typeof window !== "undefined" && window.matchMedia(PHONE_MQ).matches;
}

function notify() {
  for (const fn of subs) fn();
}

export function pingPhoneChrome() {
  if (typeof window === "undefined") return;
  if (!isPhone()) {
    if (idle) {
      idle = false;
      notify();
    }
    return;
  }
  if (idle) {
    idle = false;
    notify();
  }
  if (timer != null) window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    idle = true;
    notify();
  }, IDLE_MS);
}

function ensureListening() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  const show = () => pingPhoneChrome();
  window.addEventListener("scroll", show, { passive: true });
  window.addEventListener("touchmove", show, { passive: true });
  window.addEventListener("wheel", show, { passive: true });
  window.addEventListener(
    "touchstart",
    (e) => {
      const y = e.touches[0]?.clientY ?? 0;
      if (y > window.innerHeight - 110) pingPhoneChrome();
    },
    { passive: true }
  );
}

/** Hide a floating control after idle; scroll / wheel / touch brings it back. Works on desktop too. */
export function useIdleHide(idleMs = 3200): boolean {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let hidden = false;
    let timer: number | null = null;
    const ping = () => {
      if (hidden) {
        hidden = false;
        setIsIdle(false);
      }
      if (timer != null) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        hidden = true;
        setIsIdle(true);
      }, idleMs);
    };
    ping();
    window.addEventListener("scroll", ping, { passive: true });
    window.addEventListener("wheel", ping, { passive: true });
    window.addEventListener("touchmove", ping, { passive: true });
    return () => {
      if (timer != null) window.clearTimeout(timer);
      window.removeEventListener("scroll", ping);
      window.removeEventListener("wheel", ping);
      window.removeEventListener("touchmove", ping);
    };
  }, [idleMs]);

  return isIdle;
}

/** True when phone floating controls should slide away. */
export function usePhoneChromeIdle(): boolean {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    const sync = () => setIsIdle(isPhone() ? idle : false);
    subs.add(sync);
    ensureListening();
    pingPhoneChrome();
    sync();
    return () => {
      subs.delete(sync);
    };
  }, []);

  return isIdle;
}
