/**
 * Theme music: real royalty-free instrumental MP3s + optional player API.
 * Tracks live in /public/music/ (see public/music/CREDITS.md).
 */

export type TrackId =
  | "sunny-morning"
  | "evening-jazz"
  | "poolside-pickleball"
  | "golden-hour"
  | "cart-parade"
  | "lanai-lullaby";

export type ThemeTrack = {
  id: TrackId;
  name: string;
  emoji: string;
  blurb: string;
  /** Path under /public */
  src: string;
  credit: string;
};

export const THEME_TRACKS: ThemeTrack[] = [
  {
    id: "sunny-morning",
    name: "Sunny Morning",
    emoji: "☀️",
    blurb: "Bright tropical lounge — coffee on the lanai energy.",
    src: "/music/sunny-morning.mp3",
    credit: "Royalty-free instrumental (Pixabay Content License)",
  },
  {
    id: "evening-jazz",
    name: "Evening Jazz Cart Ride",
    emoji: "🌙",
    blurb: "Smooth café / lounge instrumental for a slow night roll.",
    src: "/music/evening-jazz.mp3",
    credit: "Royalty-free instrumental (Pixabay Content License)",
  },
  {
    id: "poolside-pickleball",
    name: "Poolside Pickleball",
    emoji: "🏓",
    blurb: "Upbeat, carefree instrumental — sweat equity optional.",
    src: "/music/poolside.mp3",
    credit: "Royalty-free instrumental (Pixabay Content License)",
  },
  {
    id: "golden-hour",
    name: "Golden Hour Portfolio",
    emoji: "📈",
    blurb: "Warm acoustic vibe for watching charts like a sunset.",
    src: "/music/golden-hour.mp3",
    credit: "Royalty-free instrumental (Pixabay Content License)",
  },
  {
    id: "cart-parade",
    name: "Parade of Golf Carts",
    emoji: "⛳",
    blurb: "Lively neighborhood procession energy. Wave politely.",
    src: "/music/cart-parade.mp3",
    credit: "Royalty-free instrumental (Pixabay Content License)",
  },
  {
    id: "lanai-lullaby",
    name: "Lanai Lullaby",
    emoji: "🌴",
    blurb: "Soft atmospheric instrumental for quiet Florida nights.",
    src: "/music/lanai.mp3",
    credit: "Royalty-free instrumental (Pixabay Content License)",
  },
];

export function getTrack(id: TrackId | string): ThemeTrack {
  return THEME_TRACKS.find((t) => t.id === id) || THEME_TRACKS[0];
}

export type MusicEngine = {
  start: () => Promise<void>;
  stop: () => void;
  stopAll: () => void;
  setVolume: (v: number) => void;
  setTrack: (id: TrackId | string) => void;
  getTrackId: () => TrackId;
  isPlaying: () => boolean;
  isTrackPlaying: (id: TrackId | string) => boolean;
  dispose: () => void;
};

/** One shared element for the whole tab — never two overlapping players. */
let sharedAudio: HTMLAudioElement | null = null;
let sharedGeneration = 0;

function getSharedAudio(): HTMLAudioElement {
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.loop = true;
    sharedAudio.preload = "auto";
  }
  return sharedAudio;
}

function silenceAudio(a: HTMLAudioElement) {
  try {
    a.pause();
  } catch {
    /* ignore */
  }
  try {
    a.currentTime = 0;
  } catch {
    /* ignore */
  }
}

function srcMatches(a: HTMLAudioElement, path: string) {
  const abs = a.src || "";
  return abs.endsWith(path) || abs.includes(encodeURI(path));
}

/**
 * HTML5 Audio engine — one MP3 at a time. Switching moods always silences
 * the previous track before the next one starts.
 */
export function createThemeMusicEngine(
  initialTrack: TrackId = "sunny-morning"
): MusicEngine {
  let playing = false;
  let volume = 0.35;
  let track = getTrack(initialTrack);

  function stopAll() {
    sharedGeneration += 1;
    playing = false;
    if (!sharedAudio) return;
    silenceAudio(sharedAudio);
    try {
      sharedAudio.removeAttribute("src");
      sharedAudio.load();
    } catch {
      /* ignore */
    }
  }

  async function playCurrent() {
    const gen = (sharedGeneration += 1);
    const a = getSharedAudio();
    silenceAudio(a);
    a.loop = true;
    a.volume = volume;
    if (!srcMatches(a, track.src)) {
      a.src = track.src;
    }
    try {
      await a.play();
    } catch (err) {
      if (gen !== sharedGeneration) return;
      playing = false;
      throw err;
    }
    if (gen !== sharedGeneration) {
      silenceAudio(a);
      return;
    }
    playing = !a.paused;
  }

  return {
    async start() {
      await playCurrent();
    },
    stop() {
      stopAll();
    },
    stopAll,
    setVolume(v: number) {
      volume = Math.min(1, Math.max(0, v));
      if (sharedAudio) sharedAudio.volume = volume;
    },
    setTrack(id: TrackId | string) {
      track = getTrack(id);
    },
    getTrackId() {
      return track.id;
    },
    isPlaying() {
      return playing && !!sharedAudio && !sharedAudio.paused;
    },
    isTrackPlaying(id: TrackId | string) {
      return playing && !!sharedAudio && !sharedAudio.paused && track.id === id;
    },
    dispose() {
      stopAll();
    },
  };
}
