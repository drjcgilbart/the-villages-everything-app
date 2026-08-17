import { getPhotos, getPhotosAsync, getPosts, getPostsAsync, getVideos, getVideosAsync } from "./content";
import { getTopic, type TopicSlug } from "./topics";
import type { Photo, Post, Video } from "./types";

function matchesTags(itemTags: string[] | undefined, keywords: string[]) {
  const tags = (itemTags || []).map((t) => t.toLowerCase());
  if (tags.length === 0) return false;
  return keywords.some((keyword) => {
    const k = keyword.toLowerCase();
    return tags.some((t) => t === k || t.includes(k) || k.includes(t));
  });
}

/** Server-only: reads content from disk and filters by topic tags. */
export function getTopicContent(slug: TopicSlug): {
  posts: Post[];
  videos: Video[];
  photos: Photo[];
} {
  const topic = getTopic(slug);
  const keywords = topic.tags;

  // Best of the Month also surfaces studio "featured" items
  const includeFeatured = slug === "best-of-the-month";

  const posts = getPosts().filter(
    (p) =>
      matchesTags(p.tags, keywords) || (includeFeatured && Boolean(p.featured))
  );
  const videos = getVideos().filter(
    (v) =>
      matchesTags(v.tags, keywords) || (includeFeatured && Boolean(v.featured))
  );
  const photos = getPhotos().filter(
    (p) =>
      matchesTags(p.tags, keywords) || (includeFeatured && Boolean(p.featured))
  );

  return { posts, videos, photos };
}

export async function getTopicContentAsync(slug: TopicSlug): Promise<{
  posts: Post[];
  videos: Video[];
  photos: Photo[];
}> {
  const topic = getTopic(slug);
  const keywords = topic.tags;
  const includeFeatured = slug === "best-of-the-month";

  const [allPosts, allVideos, allPhotos] = await Promise.all([
    getPostsAsync(),
    getVideosAsync(),
    getPhotosAsync(),
  ]);

  const posts = allPosts.filter(
    (p) =>
      matchesTags(p.tags, keywords) || (includeFeatured && Boolean(p.featured))
  );
  const videos = allVideos.filter(
    (v) =>
      matchesTags(v.tags, keywords) || (includeFeatured && Boolean(v.featured))
  );
  const photos = allPhotos.filter(
    (p) =>
      matchesTags(p.tags, keywords) || (includeFeatured && Boolean(p.featured))
  );

  return { posts, videos, photos };
}
