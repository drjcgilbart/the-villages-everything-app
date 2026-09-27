import type { PhotoImage } from "./types";
import { slugify } from "./content";
import { grokJson, xaiConfigured } from "./xaiChat";

function isTableRule(line: string): boolean {
  return /^[\s|:-]+$/.test(line) && line.includes("-");
}

function storyParts(body: string): string[] {
  return body.split(
    /(\[\[photo:[a-zA-Z0-9_-]+\]\]|\[\[table\]\][\s\S]*?\[\[\/table\]\])/g
  );
}

export type PostSuggestion = {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  source: "grok" | "local";
};

const TOPIC_TAGS: [RegExp, string][] = [
  [/lightning/, "lightning"],
  [/golf[\s-]*cart/, "golf-carts"],
  [/pickleball/, "pickleball"],
  [/\bgolf\b/, "golf"],
  [/health|wellness|doctor/, "health"],
  [/wealth|invest|money|retire/, "wealth"],
  [/dining|restaurant|happy hour/, "dining"],
  [/hurricane|storm/, "weather"],
  [/edenfield/, "edenfield"],
  [/spanish springs/, "spanish-springs"],
  [/brownwood/, "brownwood"],
  [/sumter landing/, "sumter-landing"],
  [/newcomer|moving/, "newcomers"],
];

/** Works with no API key: first line of the story, a short teaser, and a few real topics. */
export function suggestPostLocally(title: string, body: string): PostSuggestion {
  const cleanTitle = title.trim().slice(0, 200);
  const text = plainStory(body);
  const sentence = text.split(/(?<=[.!?])\s/)[0] || text;
  const excerpt = sentence.slice(0, 180).trim();
  const hay = `${cleanTitle} ${text}`.toLowerCase();
  const tags: string[] = [];
  for (const [re, tag] of TOPIC_TAGS) {
    if (re.test(hay) && !tags.includes(tag)) tags.push(tag);
  }
  if (!tags.length) tags.push("the-villages");
  const slugSource = cleanTitle || sentence.slice(0, 80);
  return {
    title: cleanTitle,
    slug: slugify(slugSource),
    excerpt: excerpt.slice(0, 400),
    tags: tags.slice(0, 6),
    source: "local",
  };
}

export async function suggestPostFields(
  title: string,
  body: string
): Promise<PostSuggestion> {
  const local = suggestPostLocally(title, body);
  if (!xaiConfigured() || body.trim().length < 40) return local;
  try {
    const result = await grokJson<{
      title?: string;
      slug?: string;
      excerpt?: string;
      tags?: string[];
    }>(
      `You prepare a blog post for The Villages Everything App.
Audience: retirement-age neighbors in The Villages, Florida.
From the story, write:
- title: keep the author's title if one was given; otherwise a clear title under 90 characters
- slug: lowercase hyphenated URL, no dates unless the story is about a specific day
- excerpt: one plain sentence, under 180 characters, no hashtags
- tags: 3 to 6 short labels, lowercase, hyphenated when needed (example: golf-carts). Only topics that are actually in the story.
Do not invent prices, company names, or places that are not in the story.
JSON: {"title":"","slug":"","excerpt":"","tags":["health"]}`,
      `Author title: ${title.trim() || "(none yet)"}
Story:\n${plainStory(body).slice(0, 8000)}`
    );
    const tags = (result.tags || [])
      .map((t) =>
        String(t || "")
          .toLowerCase()
          .replace(/^#+/, "")
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .slice(0, 32)
      )
      .filter((t) => t.length > 1);
    const nextTitle = (title.trim() || result.title || local.title).trim().slice(0, 200);
    const slug = slugify(result.slug || nextTitle || local.slug);
    const excerpt = String(result.excerpt || local.excerpt).trim().slice(0, 400);
    if (!excerpt || tags.length < 2) return { ...local, title: nextTitle || local.title };
    return {
      title: nextTitle,
      slug,
      excerpt,
      tags: tags.slice(0, 6),
      source: "grok",
    };
  } catch (err) {
    console.error("[post-suggest]", err instanceof Error ? err.message : err);
    return local;
  }
}

export type PostTable = {
  headers: string[];
  rows: string[][];
};

export type PostBlock =
  | { kind: "text"; text: string }
  | { kind: "photo"; image: PhotoImage }
  | ({ kind: "table" } & PostTable);

/** Story text without picture tokens, for excerpts and tag suggestions. */
export function plainStory(body: string): string {
  return String(body || "")
    .replace(/\[\[table\]\]([\s\S]*?)\[\[\/table\]\]/g, (_, inner: string) =>
      ` ${String(inner).replace(/\|/g, " ")} `
    )
    .replace(/\[\[photo:[a-zA-Z0-9_-]+\]\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tableCells(line: string): string[] {
  return line
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim().slice(0, 200));
}

/** First line is the header. Later lines are rows. Columns are split on |. */
export function parseStoryTable(raw: string): PostTable | null {
  const lines = String(raw || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !isTableRule(line));
  const grid = lines.map(tableCells).slice(0, 41);
  if (grid.length < 2) return null;
  const width = Math.min(6, Math.max(...grid.map((row) => row.length), 1));
  const sized = grid.map((row) => {
    const next = row.slice(0, width);
    while (next.length < width) next.push("");
    return next;
  });
  const [headers, ...rows] = sized;
  return { headers, rows };
}

export type BodyChunk =
  | { kind: "text"; text: string }
  | { kind: "table"; rows: string[][] };

/** Story editor blocks. Tables stay a grid even before the cells are filled in. */
export function parseBodyChunks(body: string): BodyChunk[] {
  const chunks: BodyChunk[] = [];
  for (const part of storyParts(String(body || ""))) {
    if (!part) continue;
    const table = part.match(/^\[\[table\]\]([\s\S]*)\[\[\/table\]\]$/);
    if (table) {
      const parsed = parseStoryTable(table[1]);
      if (parsed) {
        chunks.push({ kind: "table", rows: [parsed.headers, ...parsed.rows] });
        continue;
      }
    }
    const prev = chunks[chunks.length - 1];
    if (prev && prev.kind === "text") prev.text += part;
    else chunks.push({ kind: "text", text: part });
  }
  if (!chunks.length) chunks.push({ kind: "text", text: "" });
  return chunks;
}

export function serializeBodyChunks(chunks: BodyChunk[]): string {
  return chunks
    .map((chunk) => {
      if (chunk.kind === "text") return chunk.text;
      const lines = chunk.rows.map(
        (row) => `| ${row.map((cell) => cell.replace(/\|/g, "/")).join(" | ")} |`
      );
      return `\n[[table]]\n${lines.join("\n")}\n[[/table]]\n`;
    })
    .join("");
}

/** Split a story into paragraphs, [[photo:id]] pictures, and [[table]] blocks. */
export function blocksForPost(body: string, images: PhotoImage[]): PostBlock[] {
  const byId = new Map(images.map((img) => [img.id, img]));
  const parts = storyParts(String(body || ""));
  const blocks: PostBlock[] = [];
  for (const part of parts) {
    const token = part.match(/^\[\[photo:([a-zA-Z0-9_-]+)\]\]$/);
    if (token) {
      const image = byId.get(token[1]);
      if (image) blocks.push({ kind: "photo", image });
      continue;
    }
    const table = part.match(/^\[\[table\]\]([\s\S]*)\[\[\/table\]\]$/);
    if (table) {
      const parsed = parseStoryTable(table[1]);
      const filled = parsed
        ? {
            headers: parsed.headers,
            rows: parsed.rows.filter((row) => row.some(Boolean)),
          }
        : null;
      const hasText =
        filled &&
        (filled.headers.some(Boolean) || filled.rows.some((row) => row.some(Boolean)));
      if (filled && hasText) blocks.push({ kind: "table", ...filled });
      continue;
    }
    const paras = part
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);
    for (const text of paras) blocks.push({ kind: "text", text });
  }
  return blocks;
}

export function photosNotInBody(body: string, images: PhotoImage[], coverId?: string) {
  const used = new Set(
    [...String(body || "").matchAll(/\[\[photo:([a-zA-Z0-9_-]+)\]\]/g)].map((m) => m[1])
  );
  return images.filter((img) => img.id !== coverId && !used.has(img.id));
}
