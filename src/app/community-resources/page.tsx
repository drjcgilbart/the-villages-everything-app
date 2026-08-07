import { redirect } from "next/navigation";

/**
 * Community Resources was removed from the main banner.
 * Yard Sale and Best of the Month are top-level tabs now.
 * Keep this path as a redirect for old bookmarks/links.
 */
export default function CommunityResourcesPage() {
  redirect("/yard-sale");
}
