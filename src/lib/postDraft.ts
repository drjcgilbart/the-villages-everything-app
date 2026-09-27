import { slugify } from "./content";
import { plainStory } from "./storyBlocks";
import { grokJson, xaiConfigured } from "./xaiChat";

export {
  blocksForPost,
  parseBodyChunks,
  photosNotInBody,
  serializeBodyChunks,
} from "./storyBlocks";
export type { BodyChunk, PostBlock, PostTable } from "./storyBlocks";

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


