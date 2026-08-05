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
  /** Opening post body (first message) */
  body: string;
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
  locked?: boolean;
  hidden?: boolean;
};

export type ForumReply = {
  id: string;
  threadId: string;
  authorName: string;
  body: string;
  createdAt: string;
  hidden?: boolean;
};

export type ForumData = {
  categories: ForumCategory[];
  threads: ForumThread[];
  replies: ForumReply[];
  updatedAt: string | null;
};
