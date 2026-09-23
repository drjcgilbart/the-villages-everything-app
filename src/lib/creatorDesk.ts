import {
  cacheDurableJson,
  durableConfigured,
  ensureDurableHydrated,
  isEphemeralHost,
  pullDurableJson,
  readJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import { slugify } from "./content";
import {
  emptyProject,
  type CreatorProject,
  type DeskEverywhere,
  type DeskIdea,
  type DeskWebsite,
  type DeskYoutube,
} from "./creatorDeskTypes";
import { grokJson } from "./xaiChat";

const FILE = "creator-desk.json";

export type { CreatorProject, DeskWebsite } from "./creatorDeskTypes";
export { emptyProject } from "./creatorDeskTypes";

export type CreatorDeskFile = {
  projects: CreatorProject[];
  updatedAt: string | null;
};

const FOLLOW = `Follow along:
Website: https://www.thevillageseverythingapp.com
YouTube: https://www.youtube.com/@TheVillagesEverythingApp`;

function asList(value: unknown, max = 12) {
  return (Array.isArray(value) ? value : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, max);
}

export async function loadCreatorDesk(): Promise<CreatorDeskFile> {
  if (isEphemeralHost() && durableConfigured()) {
    try {
      const text = await pullDurableJson(FILE);
      if (text) cacheDurableJson(FILE, text);
    } catch (err) {
      console.error("[creator-desk] durable pull failed", err);
      await ensureDurableHydrated().catch(() => undefined);
    }
  } else {
    await ensureDurableHydrated().catch(() => undefined);
  }
  const raw = readJsonFile<CreatorDeskFile>(FILE);
  return {
    projects: Array.isArray(raw?.projects) ? raw.projects : [],
    updatedAt: raw?.updatedAt || null,
  };
}

export async function saveCreatorDesk(projects: CreatorProject[]) {
  const file: CreatorDeskFile = {
    projects: projects.slice(0, 40),
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFileAsync(FILE, file);
  return file;
}

export async function upsertCreatorProject(project: CreatorProject) {
  const desk = await loadCreatorDesk();
  const next = emptyProject({ ...project, updatedAt: new Date().toISOString() });
  const projects = desk.projects.some((p) => p.id === next.id)
    ? desk.projects.map((p) => (p.id === next.id ? next : p))
    : [next, ...desk.projects];
  await saveCreatorDesk(projects);
  return next;
}

const VOICE = `You write for Jonathan, host of The Villages Everything App.
Audience: retirement-age people in or considering The Villages, Florida, plus their adult kids.
Tone: a neighbor on the lanai. Warm, clear, a little wry. No "hey guys", no slang a 75-year-old has to look up.
Do not invent HOA fees, gate times, prices, or restaurant hours. If a fact is not in the notes, leave it out.`;

export async function generateIdeas(notes: string): Promise<DeskIdea[]> {
  const result = await grokJson<{ ideas?: DeskIdea[] }>(
    `${VOICE}
Invent 6 things he can film this week with a phone in one outing around The Villages.
Use his notes when he wrote some. Otherwise use evergreen shoots: town squares, cart paths, pickleball, dining, newcomer tips.
format is "short" for a YouTube Short or "long" for a regular video.
JSON: {"ideas":[{"title":"","why":"","format":"long","shootList":["one clip"],"hook":"first sentence on camera"}]}`,
    `Notes:\n${notes.trim() || "(none — use evergreen Villages ideas)"}`
  );
  return (result.ideas || [])
    .map((idea) => ({
      title: String(idea.title || "").trim().slice(0, 140),
      why: String(idea.why || "").trim().slice(0, 400),
      format: idea.format === "short" ? ("short" as const) : ("long" as const),
      shootList: asList(idea.shootList, 6),
      hook: String(idea.hook || "").trim().slice(0, 300),
    }))
    .filter((idea) => idea.title)
    .slice(0, 8);
}

export async function generateScript(input: {
  title: string;
  notes: string;
  format: "short" | "long";
}): Promise<{ hook: string; script: string }> {
  const result = await grokJson<{ hook?: string; script?: string }>(
    `${VOICE}
Write a spoken script he can read on camera.
${input.format === "short" ? "This is a YouTube Short: 80 to 130 spoken words." : "This is a regular video: 350 to 700 spoken words. Short sentences. A hook in the first two sentences."}
Do not add stage directions except a blank line between beats.
JSON: {"hook":"first sentence","script":"the full script"}`,
    `Title: ${input.title || "(untitled)"}
Notes:\n${input.notes || "(none)"}`
  );
  const script = String(result.script || "").trim();
  if (script.length < 40) throw new Error("The script came back too short. Try again.");
  return {
    hook: String(result.hook || "").trim().slice(0, 300),
    script: script.slice(0, 8000),
  };
}

export async function generateYoutube(input: {
  title: string;
  notes: string;
  script: string;
  format: "short" | "long";
}): Promise<DeskYoutube> {
  const result = await grokJson<DeskYoutube>(
    `${VOICE}
Write the YouTube listing.
Title under 70 characters. Description: two lines that say what the video is, then chapters if this is a regular video, then a short close. End with 5 to 8 hashtags.
Tags: 12 to 18 items, no # symbol, each 2–30 characters.
JSON: {"title":"","description":"","tags":[],"hashtags":["TheVillages"],"chapters":"0:00 Hook","thumbnailText":"3 to 5 words","pinnedComment":""}`,
    `Post as: ${input.format === "short" ? "YouTube Short" : "regular YouTube video"}
Working title: ${input.title}
Notes: ${input.notes}
Script:\n${input.script.slice(0, 6000)}`
  );
  let description = String(result.description || "").trim();
  if (description && !description.includes("thevillageseverythingapp.com")) {
    description = `${description}\n\n${FOLLOW}`;
  }
  return {
    title: String(result.title || input.title).trim().slice(0, 100),
    description: description.slice(0, 4500),
    tags: asList(result.tags, 22),
    hashtags: asList(result.hashtags, 10).map((tag) => tag.replace(/^#+/, "")),
    chapters: String(result.chapters || "").trim().slice(0, 1500),
    thumbnailText: String(result.thumbnailText || "").trim().slice(0, 40),
    pinnedComment: String(result.pinnedComment || "").trim().slice(0, 500),
  };
}

export async function generateEverywhere(input: {
  title: string;
  notes: string;
  script: string;
}): Promise<DeskEverywhere> {
  const result = await grokJson<{
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    x?: string;
    website?: Partial<DeskWebsite>;
  }>(
    `${VOICE}
Write the same story for each place, in that place's length.
facebook under 500 characters. instagram under 300, hashtags at the end. tiktok under 150. x under 240.
website is the blog post: a real title, a hyphenated slug, a one-sentence excerpt, and a body of 3 to 6 short paragraphs separated by a blank line. tags are 3 to 6 lowercase labels.
The website is https://www.thevillageseverythingapp.com — mention it once on Facebook and Instagram, not as a hard sell.
JSON: {"facebook":"","instagram":"","tiktok":"","x":"","website":{"title":"","slug":"","excerpt":"","body":"","tags":["the-villages"]}}`,
    `Title: ${input.title}
Notes: ${input.notes}
Script:\n${input.script.slice(0, 6000)}`
  );
  const site = result.website || {};
  const title = String(site.title || input.title).trim().slice(0, 200);
  return {
    facebook: String(result.facebook || "").trim().slice(0, 800),
    instagram: String(result.instagram || "").trim().slice(0, 500),
    tiktok: String(result.tiktok || "").trim().slice(0, 220),
    x: String(result.x || "").trim().slice(0, 280),
    website: {
      title,
      slug: slugify(String(site.slug || title)),
      excerpt: String(site.excerpt || "").trim().slice(0, 400),
      body: String(site.body || "").trim().slice(0, 8000),
      tags: asList(site.tags, 6).map((tag) => tag.toLowerCase().replace(/\s+/g, "-")),
    },
  };
}
