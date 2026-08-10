/** Browser-side helpers for forum author edit tokens + display name. */

export const FORUM_NAME_KEY = "tvi-forum-display-name";
const TOKEN_KEY = "tvi-forum-edit-tokens";

type TokenMap = Record<string, string>;

function readTokens(): TokenMap {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as TokenMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeTokens(map: TokenMap) {
  try {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(map));
  } catch {
    /* quota / private mode */
  }
}

export function saveForumEditToken(postId: string, token: string) {
  if (!postId || !token) return;
  const map = readTokens();
  map[postId] = token;
  // Cap map size so localStorage doesn't grow forever
  const keys = Object.keys(map);
  if (keys.length > 200) {
    for (const k of keys.slice(0, keys.length - 200)) {
      delete map[k];
    }
  }
  writeTokens(map);
}

export function getForumEditToken(postId: string): string | null {
  if (!postId) return null;
  const map = readTokens();
  return map[postId] || null;
}

export function clearForumEditToken(postId: string) {
  const map = readTokens();
  if (map[postId]) {
    delete map[postId];
    writeTokens(map);
  }
}
