"use client";
import { useCallback, useMemo, useSyncExternalStore } from "react";

/** badge: the buyer's text for a custom name badge (the theme is in the sku). Same sku + different text = new line.
 *  material: name badges only (custom and ready-made), a BADGE_MATERIALS id. Different material = new line. */
export type CartBadge = { name: string; village?: string };
export type CartItem = { sku: string; qty: number; badge?: CartBadge; material?: string };

/** Identity of a cart line. */
export function lineKey(i: { sku: string; badge?: CartBadge; material?: string }) {
  const m = i.material ? `|${i.material}` : "";
  return i.badge ? `${i.sku}|${i.badge.name}|${i.badge.village ?? ""}${m}` : `${i.sku}${m}`;
}
const KEY = "tvea-shop-cart-v1";
const MAX = 10;
const EMPTY: CartItem[] = [];
const listeners = new Set<() => void>();
let cache: { raw: string | null; items: CartItem[] } = { raw: null, items: EMPTY };

function read(): CartItem[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cache.raw) return cache.items;
  let items: CartItem[] = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) {
      items = parsed
        .filter((i): i is CartItem => typeof i?.sku === "string" && Number.isInteger(i?.qty))
        .map((i) => {
          const b = (i as { badge?: unknown }).badge as { name?: unknown; village?: unknown } | undefined;
          const badge = b && typeof b.name === "string" ? { name: b.name.slice(0, 40), ...(typeof b.village === "string" && b.village ? { village: b.village.slice(0, 40) } : {}) } : undefined;
          const m = (i as { material?: unknown }).material;
          const material = typeof m === "string" && /^[a-z-]{1,40}$/.test(m) ? m : undefined;
          return { sku: i.sku, qty: Math.max(1, Math.min(MAX, i.qty)), ...(badge ? { badge } : {}), ...(material ? { material } : {}) };
        });
    }
  } catch {
    items = EMPTY;
  }
  cache = { raw, items };
  return items;
}

function write(items: CartItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* storage blocked */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** Cart kept in localStorage. `ready` is false during server render and hydration. */
export function useCart() {
  const items = useSyncExternalStore(subscribe, read, () => EMPTY);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);

  // `key` is lineKey(item); for ordinary products that is just the sku, so existing callers are unchanged.
  const add = useCallback((sku: string, qty = 1, badge?: CartBadge, material?: string) => {
    const cur = read();
    const key = lineKey({ sku, badge, material });
    const found = cur.find((i) => lineKey(i) === key);
    write(
      found
        ? cur.map((i) => (lineKey(i) === key ? { ...i, qty: Math.min(MAX, i.qty + qty) } : i))
        : [...cur, { sku, qty, ...(badge ? { badge } : {}), ...(material ? { material } : {}) }]
    );
  }, []);
  const setQty = useCallback((key: string, qty: number) => {
    const n = Number.isFinite(qty) ? Math.round(qty) : 1;
    write(read().map((i) => (lineKey(i) === key ? { ...i, qty: Math.max(1, Math.min(MAX, n)) } : i)));
  }, []);
  const remove = useCallback((key: string) => write(read().filter((i) => lineKey(i) !== key)), []);
  const clear = useCallback(() => write([]), []);
  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);

  return { items, add, setQty, remove, clear, count, ready };
}
