export type DeskIdea = {
  title: string;
  why: string;
  format: "short" | "long";
  shootList: string[];
  hook: string;
};

export type DeskYoutube = {
  title: string;
  description: string;
  tags: string[];
  hashtags: string[];
  chapters: string;
  thumbnailText: string;
  pinnedComment: string;
};

export type DeskWebsite = {
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  tags: string[];
};

export type DeskEverywhere = {
  facebook: string;
  instagram: string;
  tiktok: string;
  x: string;
  website: DeskWebsite;
};

export type CreatorProject = {
  id: string;
  title: string;
  notes: string;
  format: "short" | "long";
  ideas: DeskIdea[];
  hook: string;
  script: string;
  youtube: DeskYoutube;
  everywhere: DeskEverywhere;
  updatedAt: string;
};

function emptyYoutube(): DeskYoutube {
  return {
    title: "",
    description: "",
    tags: [],
    hashtags: [],
    chapters: "",
    thumbnailText: "",
    pinnedComment: "",
  };
}

function emptyEverywhere(): DeskEverywhere {
  return {
    facebook: "",
    instagram: "",
    tiktok: "",
    x: "",
    website: { title: "", slug: "", excerpt: "", body: "", tags: [] },
  };
}

export function emptyProject(partial?: Partial<CreatorProject>): CreatorProject {
  const now = new Date().toISOString();
  return {
    id: partial?.id || `desk-${Date.now().toString(36)}`,
    title: partial?.title || "",
    notes: partial?.notes || "",
    format: partial?.format === "short" ? "short" : "long",
    ideas: partial?.ideas || [],
    hook: partial?.hook || "",
    script: partial?.script || "",
    youtube: { ...emptyYoutube(), ...(partial?.youtube || {}) },
    everywhere: {
      ...emptyEverywhere(),
      ...(partial?.everywhere || {}),
      website: {
        ...emptyEverywhere().website,
        ...(partial?.everywhere?.website || {}),
      },
    },
    updatedAt: partial?.updatedAt || now,
  };
}
