"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StoredBoardId } from "@/lib/memberBoardModel";
import { readJsonStorage, writeJsonStorage } from "@/lib/mySpaceStorage";

function looksEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value !== "object") return false;
  const rec = value as Record<string, unknown>;
  const keys = Object.keys(rec);
  if (keys.length === 0) return true;
  if (keys.length === 1 && Array.isArray(rec.items) && rec.items.length === 0) {
    return true;
  }
  if (
    keys.length === 1 &&
    Array.isArray(rec.holdings) &&
    rec.holdings.length === 0
  ) {
    return true;
  }
  return false;
}

export function useMemberBoard<T>(
  board: StoredBoardId,
  fallback: T,
  enabled: boolean,
  opts?: {
    localKey?: string;
    debounceMs?: number;
    isEmpty?: (value: T) => boolean;
  }
) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const emptyCheck = opts?.isEmpty || looksEmpty;

  const put = useCallback(
    async (next: T) => {
      if (!enabled) return;
      setSaving(true);
      setError(null);
      try {
        const res = await fetch("/api/members/space/boards", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ board, data: next }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || "Could not save");
        if (json.data) setValue(json.data as T);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not save");
      } finally {
        setSaving(false);
      }
    },
    [board, enabled]
  );

  useEffect(() => {
    if (!enabled) {
      if (opts?.localKey) {
        setValue(readJsonStorage(opts.localKey, fallback));
      }
      setReady(true);
      return;
    }
    let cancelled = false;
    fetch("/api/members/space/boards", {
      cache: "no-store",
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { boards?: Record<string, T> } | null) => {
        if (cancelled) return;
        const server = json?.boards?.[board];
        const local = opts?.localKey
          ? readJsonStorage<T>(opts.localKey, fallback)
          : fallback;
        if (server && !emptyCheck(server)) {
          setValue(server);
        } else if (!emptyCheck(local) && local !== fallback) {
          setValue(local);
          void put(local);
        } else if (server) {
          setValue(server);
        }
        setReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          if (opts?.localKey) {
            setValue(readJsonStorage(opts.localKey, fallback));
          }
          setReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
    // fallback is a stable empty factory from callers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, enabled, opts?.localKey, put]);

  const save = useCallback(
    async (next: T) => {
      setValue(next);
      if (opts?.localKey) writeJsonStorage(opts.localKey, next);
      if (!enabled) return;
      const wait = opts?.debounceMs ?? 0;
      if (wait <= 0) {
        await put(next);
        return;
      }
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        void put(next);
      }, wait);
    },
    [enabled, opts?.debounceMs, opts?.localKey, put]
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { value, save, ready, saving, error };
}
