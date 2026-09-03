import { loadDining, saveDining } from "./dining";
import { loadForum, saveForumAsync } from "./forum";
import { leaveHousehold, removeHouseholdMember } from "./household";
import { deleteMemberBoards } from "./memberBoards";
import {
  findMemberSpace,
  loadMemberSpaces,
  saveMemberSpacesAsync,
} from "./memberSpace";
import { removeBlocksInvolving } from "./safety";
import { loadYardSale, saveYardSaleAsync } from "./yardSale";

const DELETED_NAME = "Deleted neighbor";

/**
 * Apple 5.1.1(v): members who can create an account must be able to delete it
 * in the app. Scrubs PII, drops private boards, anonymizes leftover public posts.
 */
export async function deleteMemberAccount(memberId: string) {
  const id = String(memberId || "").trim();
  if (!id) throw new Error("Missing member");

  const space = findMemberSpace(id);
  if (space?.householdOwnerId && space.householdOwnerId !== id) {
    try {
      leaveHousehold(id);
    } catch {
      /* already gone */
    }
  } else if (space?.household?.memberIds?.length) {
    for (const extraId of [...space.household.memberIds]) {
      try {
        removeHouseholdMember(id, extraId);
      } catch {
        /* extra already off the household */
      }
    }
  }

  const yard = loadYardSale();
  yard.members = yard.members.filter((m) => m.id !== id);
  yard.listings = yard.listings.map((listing) =>
    listing.memberId === id
      ? {
          ...listing,
          status: "removed" as const,
          adminNote: listing.adminNote || "Removed because the seller deleted their account",
        }
      : listing
  );
  await saveYardSaleAsync(yard);

  const spaces = loadMemberSpaces();
  spaces.spaces = spaces.spaces.filter((s) => s.memberId !== id);
  await saveMemberSpacesAsync(spaces);

  await deleteMemberBoards(id);
  await removeBlocksInvolving(id);

  const forum = loadForum();
  let forumChanged = false;
  for (const thread of forum.threads) {
    if (thread.authorMemberId === id) {
      thread.authorName = DELETED_NAME;
      thread.authorMemberId = null;
      thread.editTokenHash = null;
      forumChanged = true;
    }
  }
  for (const reply of forum.replies) {
    if (reply.authorMemberId === id) {
      reply.authorName = DELETED_NAME;
      reply.authorMemberId = null;
      reply.editTokenHash = null;
      forumChanged = true;
    }
  }
  if (forumChanged) await saveForumAsync(forum);

  const dining = loadDining();
  let diningChanged = false;
  for (const review of dining.reviews) {
    if (review.authorMemberId === id) {
      review.authorName = DELETED_NAME;
      review.authorMemberId = null;
      diningChanged = true;
    }
  }
  if (diningChanged) saveDining(dining);
}
