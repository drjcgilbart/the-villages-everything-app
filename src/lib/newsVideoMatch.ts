/** Title rules for the Local News shelf. No server imports, so the page player can use them. */

export function isDailyNewsRoundup(title: string): boolean {
  const t = title.trim();
  return (
    /^the villages news\b/i.test(t) ||
    /^the week ahead\b/i.test(t) ||
    /^this weekend in the villages\b/i.test(t)
  );
}

export function isChannelShort(video: { title: string; short?: boolean }): boolean {
  return Boolean(video.short) || /#shorts\b/i.test(video.title);
}
