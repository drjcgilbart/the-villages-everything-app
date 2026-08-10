export type ForumCategory = {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Short emoji or symbol for the list */
  emoji: string;
  order: number;
};

export type ForumThread = {
  id: string;
  categoryId: string;
  title: string;
  authorName: string;
  /** Hub member id when posted while signed in — powers badges + ownership */
  authorMemberId?: string | null;
  /**
   * SHA-256 of one-time edit token given to the author at create time.
   * Never send this to browsers; used to prove ownership for guest posts.
   */
  editTokenHash?: string | null;
  /** Opening post body (first message) */
  body: string;
  createdAt: string;
  updatedAt: string;
  /** Last author/admin edit of title or body */
  editedAt?: string | null;
  pinned?: boolean;
  locked?: boolean;
  hidden?: boolean;
};

export type ForumReply = {
  id: string;
  threadId: string;
  authorName: string;
  authorMemberId?: string | null;
  editTokenHash?: string | null;
  body: string;
  createdAt: string;
  updatedAt?: string | null;
  editedAt?: string | null;
  hidden?: boolean;
};

/** Safe for API/JSON responses — strips editTokenHash */
export type PublicForumThread = Omit<ForumThread, "editTokenHash">;
export type PublicForumReply = Omit<ForumReply, "editTokenHash">;

export type ForumData = {
  categories: ForumCategory[];
  threads: ForumThread[];
  replies: ForumReply[];
  updatedAt: string | null;
};
