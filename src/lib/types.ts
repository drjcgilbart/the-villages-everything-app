export type PostType = "blog" | "vlog";

export type Post = {
  id: string;
  type: PostType;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage?: string;
  publishedAt: string;
  tags: string[];
  featured?: boolean;
};

export type VideoSource = "youtube" | "upload";

export type Video = {
  id: string;
  title: string;
  description: string;
  source: VideoSource;
  youtubeId?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  publishedAt: string;
  tags: string[];
  featured?: boolean;
};

/** One image inside a photo-journal entry */
export type PhotoImage = {
  id: string;
  url: string;
  /** Optional note for this specific image */
  caption?: string;
};

/**
 * A photo-journal entry (album-style): title + description + multiple images.
 * One image is featured (hero); the rest appear as scrollable thumbnails.
 */
export type Photo = {
  id: string;
  title: string;
  /** Short description for the whole entry */
  caption: string;
  images: PhotoImage[];
  /** Which image is featured (defaults to first) */
  featuredImageId?: string;
  /** @deprecated legacy single-image field — migrated to images[] */
  imageUrl?: string;
  publishedAt: string;
  tags: string[];
  /** Featured entry on home / listings */
  featured?: boolean;
};

export type SiteContent = {
  site: {
    name: string;
    tagline: string;
    subtitle: string;
    location: string;
  };
  posts: Post[];
  videos: Video[];
  photos: Photo[];
  updatedAt: string | null;
};
