/** Title rules for the Local News shelf. No server imports, so the page player can use them. */

export function isDailyNewsRoundup(title: string, description = ""): boolean {
  const t = title.trim();
  if (
    /^the villages news\b/i.test(t) ||
    /^the week ahead\b/i.test(t) ||
    /^this weekend in the villages\b/i.test(t)
  ) {
    return true;
  }
  // Newer roundups lead with the story ("The Villages Is Borrowing…")
  // and say "news round-up" in the description.
  return /news round-?up/i.test(`${t}\n${description}`);
}

export function isChannelShort(video: { title: string; short?: boolean }): boolean {
  return Boolean(video.short) || /#shorts\b/i.test(video.title);
}
