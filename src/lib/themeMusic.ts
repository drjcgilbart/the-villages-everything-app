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
  setVolume: (v: number) => void;
  setTrack: (id: TrackId | string) => void;
  getTrackId: () => TrackId;
  isPlaying: () => boolean;
  dispose: () => void;
};

/**
 * HTML5 Audio engine — plays real MP3 files with loop + seamless mood switching.
 */
export function createThemeMusicEngine(initialTrack: TrackId = "sunny-morning"): MusicEngine {
  let audio: HTMLAudioElement | null = null;
  let playing = false;
  let volume = 0.35;
  let track = getTrack(initialTrack);
  let loadToken = 0;

  function ensureAudio() {
    if (!audio) {
      audio = new Audio();
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = volume;
      audio.addEventListener("error", () => {
        console.error("Theme music failed to load:", track.src);
      });
    }
    return audio;
  }

  function loadCurrentTrack() {
    const a = ensureAudio();
    const token = ++loadToken;
    const nextSrc = track.src;
    // Only reset src if it actually changed
    if (!a.src.endsWith(nextSrc) && !a.src.includes(encodeURI(nextSrc))) {
      a.src = nextSrc;
      a.load();
    }
    return { a, token };
  }

  return {
    async start() {
      const { a } = loadCurrentTrack();
      a.volume = volume;
      try {
        await a.play();
        playing = true;
      } catch (err) {
        playing = false;
        throw err;
      }
    },
    stop() {
      playing = false;
      if (audio) {
        audio.pause();
      }
    },
    setVolume(v: number) {
      volume = Math.min(1, Math.max(0, v));
      if (audio) audio.volume = volume;
    },
    setTrack(id: TrackId | string) {
      const next = getTrack(id);
      if (next.id === track.id) return;
      const wasPlaying = playing;
      const prevTime = audio?.currentTime || 0;
      track = next;
      const { a } = loadCurrentTrack();
      a.volume = volume;
      // Start new track from beginning (mood change)
      a.currentTime = 0;
      if (wasPlaying) {
        a.play().then(() => {
          playing = true;
        }).catch(() => {
          playing = false;
        });
      }
      void prevTime;
    },
    getTrackId() {
      return track.id;
    },
    isPlaying() {
      return playing && !!audio && !audio.paused;
    },
    dispose() {
      playing = false;
      if (audio) {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        audio = null;
      }
    },
  };
}
