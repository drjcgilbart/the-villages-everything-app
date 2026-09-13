"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { StoredBoardId } from "@/lib/memberBoardModel";
import { writeJsonStorage } from "@/lib/mySpaceStorage";

export function useMemberBoard<T>(
  board: StoredBoardId,
  fallback: T,
  enabled: boolean,
  opts?: {
    localKey?: string;
    debounceMs?: number;
  }
) {
  const [value, setValue] = useState<T>(fallback);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scopedKey =
    opts?.localKey && memberId ? `${opts.localKey}::${memberId}` : null;

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
      setValue(fallback);
      setReady(true);
      return;
    }
    let cancelled = false;
    fetch("/api/members/space/boards", {
      cache: "no-store",
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (json: { boards?: Record<string, T>; memberId?: string } | null) => {
          if (cancelled) return;
          const id = json?.memberId ? String(json.memberId) : null;
          setMemberId(id);
          const server = json?.boards?.[board];
          const key = opts?.localKey && id ? `${opts.localKey}::${id}` : null;
          // Logged-in boards come from this member’s server row only.
          // Never hydrate from another login’s unscoped localStorage.
          if (server != null) {
            setValue(server);
            if (key) writeJsonStorage(key, server);
          } else {
            setValue(fallback);
          }
          setReady(true);
        }
      )
      .catch(() => {
        if (!cancelled) {
          setValue(fallback);
          setReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, enabled, opts?.localKey]);

  const save = useCallback(
    async (next: T) => {
      setValue(next);
      if (scopedKey) writeJsonStorage(scopedKey, next);
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
    [enabled, opts?.debounceMs, put, scopedKey]
  );

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  return { value, save, ready, saving, error };
}
