import type { BoardId } from "@/lib/mySpaceProduct";
import type { FeatureKey } from "@/lib/membershipTiers";
import type { StoredBoardId } from "@/lib/memberBoardModel";

/** My Space tool tabs that open a Hub page instead of a second copy of the topic. */
export const MY_SPACE_HUB_JUMPS: Partial<Record<string, string>> = {
  golfLog: "/golf-zone#my-scorecard",
  pickleballLog: "/pickleball#my-pickleball",
  health: "/health#my-health",
  investments: "/wealth#my-investments",
  news: "/news#my-news",
  calendar: "/calendar#my-calendar",
  entertainment: "/town-squares#my-nights",
};

export type HubMemberSlot = {
  boardId: BoardId;
  feature: FeatureKey;
  sectionId: string;
  heading: string;
  blurb: string;
  inviteLead: string;
  publicStay: string;
  loginPath: string;
  privacyBoard: StoredBoardId;
  extraBoards?: StoredBoardId[];
};

export const HUB_MEMBER_SLOTS: Record<string, HubMemberSlot> = {
  golf: {
    boardId: "golfLog",
    feature: "golfLog",
    sectionId: "my-scorecard",
    heading: "Your live scorecard",
    blurb:
      "Hole-by-hole scores on this phone. Maps, the Leader Board, and holes-in-one below stay free for everyone.",
    inviteLead: "Keep score here after you unlock",
    publicStay:
      "One Golf page for everyone. The trail, maps, and aces stay free. The live scorecard, tee times, and round history unlock with",
    loginPath: "/golf-zone#my-scorecard",
    privacyBoard: "golfLog",
  },
  pickleball: {
    boardId: "pickleballLog",
    feature: "pickleballLog",
    sectionId: "my-pickleball",
    heading: "Your pickleball log",
    blurb:
      "DUPR, matches, and practice on this phone. The public board, find-a-game, and courts stay free below.",
    inviteLead: "Log matches here after you unlock",
    publicStay:
      "One Pickleball page for everyone. Courts and the public DUPR board stay free. Your personal log unlocks with",
    loginPath: "/pickleball#my-pickleball",
    privacyBoard: "pickleballLog",
  },
  health: {
    boardId: "health",
    feature: "healthLog",
    sectionId: "my-health",
    heading: "Your health board",
    blurb:
      "Meds, movement, gym, sleep, and journal on your account. Hospitals, ERs, and on-device wellness tools stay free.",
    inviteLead: "Keep your health notes here after you unlock",
    publicStay:
      "One Health page for everyone. Emergency numbers and wellness tools stay free. Your private board unlocks with",
    loginPath: "/health#my-health",
    privacyBoard: "health",
    extraBoards: ["gym"],
  },
  wealth: {
    boardId: "investments",
    feature: "portfolio",
    sectionId: "my-investments",
    heading: "Your investments board",
    blurb:
      "Watchlist and totals saved to your membership. Live markets and on-device money tools stay free.",
    inviteLead: "Save a real portfolio here after you unlock",
    publicStay:
      "One Wealth page for everyone. Markets, banks, and browser tools stay free. Your account board unlocks with",
    loginPath: "/wealth#my-investments",
    privacyBoard: "portfolio",
  },
  news: {
    boardId: "news",
    feature: "newsPrefs",
    sectionId: "my-news",
    heading: "Your news mix",
    blurb:
      "Pick desks and topics once; they stay on this login. Public Local News outlets stay free below.",
    inviteLead: "Save your headline mix here after you unlock",
    publicStay:
      "One Local News page for everyone. Creators and outlets stay free. Your saved mix unlocks with",
    loginPath: "/news#my-news",
    privacyBoard: "news",
  },
  calendar: {
    boardId: "calendar",
    feature: "calendarBoard",
    sectionId: "my-calendar",
    heading: "Your personal dates",
    blurb:
      "Tee times, grandkids, and sticky notes on this login. The public Calendar of Events stays free.",
    inviteLead: "Keep personal dates here after you unlock",
    publicStay:
      "One Calendar page for everyone. District events stay free. Your private dates unlock with",
    loginPath: "/calendar#my-calendar",
    privacyBoard: "calendar",
  },
  entertainment: {
    boardId: "entertainment",
    feature: "entertainmentLog",
    sectionId: "my-nights",
    heading: "Your nights out",
    blurb:
      "Tickets and watch-later on this login. Tonight’s square lineup stays free for everyone.",
    inviteLead: "Save shows and tickets here after you unlock",
    publicStay:
      "One Town Squares page for everyone. Who’s playing tonight stays free. Your personal log unlocks with",
    loginPath: "/town-squares#my-nights",
    privacyBoard: "entertainment",
  },
};
