/** Official watch page — views, ads, and related videos stay on YouTube. */
export function youtubeWatchUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${encodeURIComponent(youtubeId)}`;
}
