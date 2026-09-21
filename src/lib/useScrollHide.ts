"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hide chrome after a real downward swipe; show after a real upward swipe.
 * Tiny jitter and layout jumps from showing/hiding menus are ignored.
 */
export function useScrollHide(opts?: {
  enabled?: boolean;
  downPx?: number;
  upPx?: number;
  lockMs?: number;
  topPx?: number;
}) {
  const enabled = opts?.enabled !== false;
  const downPx = opts?.downPx ?? 64;
  const upPx = opts?.upPx ?? 64;
  const lockMs = opts?.lockMs ?? 720;
  const topPx = opts?.topPx ?? 6;

  const [hidden, setHiddenState] = useState(false);
  const hiddenRef = useRef(false);
  const lastY = useRef(0);
  const acc = useRef(0);
  const lockUntil = useRef(0);

  const apply = useCallback((next: boolean) => {
    if (hiddenRef.current === next) return;
    hiddenRef.current = next;
    setHiddenState(next);
    lockUntil.current = Date.now() + lockMs;
    acc.current = 0;
    lastY.current =
      typeof window === "undefined"
        ? 0
        : window.scrollY || document.documentElement.scrollTop || 0;
  }, [lockMs]);

  const show = useCallback(() => apply(false), [apply]);
  const hide = useCallback(() => apply(true), [apply]);

  useEffect(() => {
    if (!enabled) {
      apply(false);
      return;
    }
    lastY.current = window.scrollY || document.documentElement.scrollTop || 0;
    acc.current = 0;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        if (Date.now() < lockUntil.current) {
          lastY.current = y;
          acc.current = 0;
          return;
        }
        const delta = y - lastY.current;
        lastY.current = y;
        if (Math.abs(delta) < 1) return;
        if (y <= topPx) {
          acc.current = 0;
          apply(false);
          return;
        }
        if ((delta > 0 && acc.current < 0) || (delta < 0 && acc.current > 0)) {
          acc.current = 0;
        }
        acc.current += delta;
        if (acc.current >= downPx) apply(true);
        else if (acc.current <= -upPx) apply(false);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [enabled, downPx, upPx, topPx, apply]);

  return { hidden, show, hide };
}
