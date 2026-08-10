import crypto from "crypto";
import {
  ensureDurableHydrated,
  readJsonFile,
  writeJsonFile,
  writeJsonFileAsync,
} from "./dataFs";
import type {
  ForumCategory,
  ForumData,
  ForumReply,
  ForumThread,
} from "./forumTypes";

const FORUM_FILE = "forum.json";

function uid(prefix = "id") {
  return `${prefix}-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`;
}

export function slugify(text: string) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function seedCategories(): ForumCategory[] {
  return [
    {
      id: "cat-welcome",
      slug: "new-to-the-villages",
      title: "New to The Villages",
      description:
        "Just arrived (or still packing)? Ask anything — cart rules, villages, rec passes, and “why does every street sound like a country club?”",
      emoji: "🌴",
      order: 1,
    },
    {
      id: "cat-dining",
      slug: "dining-and-food",
      title: "Dining & Food",
      description:
        "Early-bird intel, “where should we eat?”, kitchen disasters, and sacred opinions about tacos.",
      emoji: "🍽️",
      order: 2,
    },
    {
      id: "cat-golf",
      slug: "golf-and-carts",
      title: "Golf & Cart Life",
      description:
        "Courses, mishits, cart decorations, traffic at 9 a.m., and the philosophy of “just one more hole.”",
      emoji: "⛳",
      order: 3,
    },
    {
      id: "cat-clubs",
      slug: "clubs-and-hobbies",
      title: "Clubs & Hobbies",
      description:
        "Finding your people — cards, crafts, music, weirdly specific clubs, and first-meeting nerves.",
      emoji: "🎯",
      order: 4,
    },
    {
      id: "cat-health",
      slug: "health-and-wellness",
      title: "Health & Wellness",
      description:
        "Walking goals, doctors, sleep, “I went to the rec center on purpose,” and cheering each other on.",
      emoji: "💪",
      order: 5,
    },
    {
      id: "cat-squares",
      slug: "squares-and-events",
      title: "Squares, Music & Events",
      description:
        "Which square tonight? Bands, dancing, holidays, and “meet us by the fountain.”",
      emoji: "🎶",
      order: 6,
    },
    {
      id: "cat-homes",
      slug: "homes-and-moving",
      title: "Homes & Moving",
      description:
        "Buying, selling, building, downsizing, and surviving the great furniture debate.",
      emoji: "🏠",
      order: 7,
    },
    {
      id: "cat-neighbors",
      slug: "village-life",
      title: "Village Life & Neighbors",
      description:
        "HOA questions (keep it kind), pets, lost-and-found, and the soft magic of a good wave from a cart.",
      emoji: "🤝",
      order: 8,
    },
    {
      id: "cat-tech",
      slug: "tech-help",
      title: "Tech Help",
      description:
        "Phones, streaming, printers that hate us, and “how do I get this off my screen?”",
      emoji: "📱",
      order: 9,
    },
    {
      id: "cat-watercooler",
      slug: "water-cooler",
      title: "Water Cooler",
      description:
        "Off-topic, jokes, grandkid brags, weather complaints, and pure cart-path chatter.",
      emoji: "☕",
      order: 10,
    },
  ];
}

function seedData(): ForumData {
  const now = new Date().toISOString();
  const day = (n: number) => new Date(Date.now() - n * 86400000).toISOString();
  const categories = seedCategories();

  const threads: ForumThread[] = [
    {
      id: "thread-seed-1",
      categoryId: "cat-welcome",
      title: "Week one: what I wish someone told me",
      authorName: "CartNewbie",
      body: "Three roundabouts later… any tips for not getting lost on the way to Spanish Springs? Asking for a friend (me).",
      createdAt: day(2),
      updatedAt: day(1),
    },
    {
      id: "thread-seed-2",
      categoryId: "cat-dining",
      title: "Best early-bird that still feels special?",
      authorName: "DinnerDetective",
      body: "Not looking for fancy — just good food before 5 without feeling like we rushed a wedding.",
      createdAt: day(3),
      updatedAt: day(1),
    },
  ];

  const replies: ForumReply[] = [
    {
      id: "reply-seed-1",
      threadId: "thread-seed-1",
      authorName: "LongTimer",
      body: "Phone GPS is not optional the first month. Also: every gate looks the same at dusk. Welcome!",
      createdAt: day(1),
    },
    {
      id: "reply-seed-2",
      threadId: "thread-seed-2",
      authorName: "EarlyBirdEddie",
      body: "If they have outdoor seating and a fish sandwich, I’m in. Check the Dining ratings on this hub too!",
      createdAt: day(1),
    },
  ];

  return { categories, threads, replies, updatedAt: now };
}

export function loadForum(): ForumData {
  const raw = readJsonFile<ForumData>(FORUM_FILE);
  if (!raw) return seedData();
  return {
    categories: Array.isArray(raw.categories) ? raw.categories : seedCategories(),
    threads: Array.isArray(raw.threads) ? raw.threads : [],
    replies: Array.isArray(raw.replies) ? raw.replies : [],
    updatedAt: raw.updatedAt || null,
  };
}

/** Prefer in API routes so Redis/Blob is hydrated before read on Vercel. */
export async function loadForumAsync(): Promise<ForumData> {
  await ensureDurableHydrated();
  return loadForum();
}

export function saveForum(data: ForumData) {
  data.updatedAt = new Date().toISOString();
  writeJsonFile(FORUM_FILE, data);
  return data;
}

/**
 * Prefer in API routes so durable storage finishes before the response.
 * On Vercel, sync writeJsonFile only hits memory//tmp and skips Redis/Blob —
 * that caused new posts to 404 after redirect (other instances never saw them).
 */
export async function saveForumAsync(data: ForumData) {
  data.updatedAt = new Date().toISOString();
  try {
    await writeJsonFileAsync(FORUM_FILE, data);
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Could not save forum data on this host"
    );
  }
  return data;
}

function cleanName(name: string) {
  return String(name || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 40);
}

function cleanBody(body: string) {
  return String(body || "").trim().slice(0, 5000);
}

export function getCategories() {
  return loadForum()
    .categories.slice()
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getCategoryBySlug(slug: string): ForumCategory | null {
  return loadForum().categories.find((c) => c.slug === slug) || null;
}

export function getCategoryById(id: string): ForumCategory | null {
  return loadForum().categories.find((c) => c.id === id) || null;
}

export function getVisibleThreads(categoryId?: string) {
  return loadForum()
    .threads.filter((t) => !t.hidden)
    .filter((t) => (categoryId ? t.categoryId === categoryId : true))
    .slice()
    .sort((a, b) => {
      if (Boolean(b.pinned) !== Boolean(a.pinned)) {
        return Number(b.pinned) - Number(a.pinned);
      }
      return String(b.updatedAt).localeCompare(String(a.updatedAt));
    });
}

export function getThreadById(id: string): ForumThread | null {
  const t = loadForum().threads.find((x) => x.id === id) || null;
  if (t?.hidden) return null;
  return t;
}

export function getRepliesForThread(threadId: string) {
  return loadForum()
    .replies.filter((r) => r.threadId === threadId && !r.hidden)
    .slice()
    .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}

export function countReplies(threadId: string) {
  return loadForum().replies.filter(
    (r) => r.threadId === threadId && !r.hidden
  ).length;
}

export function categoryStats(categoryId: string) {
  const threads = getVisibleThreads(categoryId);
  const data = loadForum();
  let replies = 0;
  for (const t of threads) {
    replies += data.replies.filter(
      (r) => r.threadId === t.id && !r.hidden
    ).length;
  }
  return { threadCount: threads.length, replyCount: replies };
}

export async function createThread(input: {
  categoryId: string;
  title: string;
  authorName: string;
  body: string;
  authorMemberId?: string | null;
}) {
  const data = await loadForumAsync();
  if (!data.categories.some((c) => c.id === input.categoryId)) {
    throw new Error("Forum topic not found");
  }
  const authorName = cleanName(input.authorName);
  const title = String(input.title || "").trim().slice(0, 140);
  const body = cleanBody(input.body);
  if (authorName.length < 2) throw new Error("Please enter a display name");
  if (title.length < 4) throw new Error("Give your conversation a clearer title");
  if (body.length < 8) throw new Error("Say a little more to get the chat going");

  const now = new Date().toISOString();
  const thread: ForumThread = {
    id: uid("thread"),
    categoryId: input.categoryId,
    title,
    authorName,
    authorMemberId: input.authorMemberId || null,
    body,
    createdAt: now,
    updatedAt: now,
  };
  data.threads.unshift(thread);
  await saveForumAsync(data);
  return thread;
}

export async function createReply(input: {
  threadId: string;
  authorName: string;
  body: string;
  authorMemberId?: string | null;
}) {
  const data = await loadForumAsync();
  const thread = data.threads.find((t) => t.id === input.threadId);
  if (!thread || thread.hidden) throw new Error("Conversation not found");
  if (thread.locked) throw new Error("This conversation is locked");

  const authorName = cleanName(input.authorName);
  const body = cleanBody(input.body);
  if (authorName.length < 2) throw new Error("Please enter a display name");
  if (body.length < 2) throw new Error("Message is empty");

  const now = new Date().toISOString();
  const reply: ForumReply = {
    id: uid("reply"),
    threadId: input.threadId,
    authorName,
    authorMemberId: input.authorMemberId || null,
    body,
    createdAt: now,
  };
  data.replies.push(reply);
  thread.updatedAt = now;
  await saveForumAsync(data);
  return reply;
}

export async function setThreadHidden(id: string, hidden: boolean) {
  const data = await loadForumAsync();
  const idx = data.threads.findIndex((t) => t.id === id);
  if (idx < 0) throw new Error("Thread not found");
  data.threads[idx] = { ...data.threads[idx], hidden: !!hidden };
  return saveForumAsync(data);
}

export async function setReplyHidden(id: string, hidden: boolean) {
  const data = await loadForumAsync();
  const idx = data.replies.findIndex((r) => r.id === id);
  if (idx < 0) throw new Error("Reply not found");
  data.replies[idx] = { ...data.replies[idx], hidden: !!hidden };
  return saveForumAsync(data);
}

export function forumSummary() {
  const data = loadForum();
  return {
    categoryCount: data.categories.length,
    threadCount: data.threads.filter((t) => !t.hidden).length,
    replyCount: data.replies.filter((r) => !r.hidden).length,
  };
}
