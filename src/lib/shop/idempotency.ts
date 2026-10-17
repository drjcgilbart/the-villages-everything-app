// Dedupe store for processed shop Stripe sessions.
// Production: Upstash Redis REST (the site already documents UPSTASH_REDIS_REST_URL/TOKEN; KV_REST_API_* also work).
// Talks to the REST API with fetch, so no extra npm dependency.
// Fallback: in-memory + a JSON file in .data/ (fine locally; NOT shared across Vercel instances).
// Printful's `external_id` (derived from the session id) is a second line of defence against double orders.
import fs from "fs";
import path from "path";

export interface DedupeStore {
  has(id: string): Promise<boolean>;
  add(id: string): Promise<void>;
  remove(id: string): Promise<void>;
  /** Atomically claim an id. Returns false if it was already claimed. */
  claim?(id: string): Promise<boolean>;
}

export function memoryStore(): DedupeStore {
  const s = new Set<string>();
  return {
    has: async (id) => s.has(id),
    add: async (id) => void s.add(id),
    remove: async (id) => void s.delete(id),
    claim: async (id) => (s.has(id) ? false : (s.add(id), true)),
  };
}

export function fileStore(file = path.join(process.cwd(), ".data", "shop-processed-sessions.json")): DedupeStore {
  const read = (): string[] => { try { return JSON.parse(fs.readFileSync(file, "utf8")); } catch { return []; } };
  const write = (ids: string[]) => { try { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(ids)); } catch { /* read-only FS */ } };
  const mem = new Set(read());
  return {
    has: async (id) => mem.has(id),
    add: async (id) => { mem.add(id); write([...mem]); },
    remove: async (id) => { mem.delete(id); write([...mem]); },
  };
}

const KEY = (id: string) => `shop:stripe-session:${id}`;
const TTL_SECONDS = 60 * 60 * 24 * 90;

export function redisRestStore(url: string, token: string, fetchImpl: typeof fetch = fetch): DedupeStore {
  const cmd = async (args: (string | number)[]) => {
    const res = await fetchImpl(url.replace(/\/$/, ""), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(args),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Redis ${res.status}`);
    return ((await res.json()) as { result?: unknown }).result;
  };
  return {
    has: async (id) => (await cmd(["GET", KEY(id)])) !== null,
    add: async (id) => { await cmd(["SET", KEY(id), Date.now(), "EX", TTL_SECONDS]); },
    remove: async (id) => { await cmd(["DEL", KEY(id)]); },
    claim: async (id) => (await cmd(["SET", KEY(id), Date.now(), "NX", "EX", TTL_SECONDS])) === "OK",
  };
}

let defaultStore: DedupeStore | null = null;
export function getDedupeStore() {
  if (defaultStore) return defaultStore;
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  return (defaultStore = url && token ? redisRestStore(url, token) : fileStore());
}
