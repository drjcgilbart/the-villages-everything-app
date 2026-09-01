/**
 * Curated My Space Golf → Practice shelf.
 * Hand-picked clips and tools — not a live YouTube search.
 */

import { GOLF_HUB } from "./entertainmentCatalog";

export type GolfPracticeTopic = "putting" | "chipping" | "tempo" | "driver" | "rules";

export type GolfPracticeVideo = {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  topic: GolfPracticeTopic;
  minutes: string;
  why: string;
};

export type GolfPracticeTool = {
  id: string;
  label: string;
  href: string;
  job: string;
  villages: string;
};

export const GOLF_PRACTICE_TOPICS: { id: GolfPracticeTopic | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "putting", label: "Putting" },
  { id: "chipping", label: "Chipping" },
  { id: "tempo", label: "Tempo" },
  { id: "driver", label: "Driver" },
  { id: "rules", label: "Rules" },
];

export const GOLF_PRACTICE_VIDEOS: GolfPracticeVideo[] = [
  {
    id: "putt-control",
    youtubeId: "QADoxlMZJn8",
    title: "The Key to Controlled Putting",
    channel: "Me and My Golf",
    topic: "putting",
    minutes: "1 min",
    why: "Smooth stroke, same pace — the 3-putt killer on executive greens.",
  },
  {
    id: "putt-pace",
    youtubeId: "Xm5UScOYneo",
    title: "One Drill That Will Change Your Putting Forever",
    channel: "Me and My Golf",
    topic: "putting",
    minutes: "9 min",
    why: "Lag-putt ladder so the second putt is a tap-in, not a comebacker.",
  },
  {
    id: "chip-5min",
    youtubeId: "p-9N2YfdZ78",
    title: "I Wish a Coach Had Told Me How to Chip Like This Sooner",
    channel: "Danny Maude",
    topic: "chipping",
    minutes: "5 min",
    why: "Three-step chip you can run on the practice green before a 9-hole.",
  },
  {
    id: "chip-strike",
    youtubeId: "A9_vNT2qew8",
    title: "Strike Your Chip Shots — One Super Simple Tip",
    channel: "Danny Maude",
    topic: "chipping",
    minutes: "6 min",
    why: "Toe-down, putting-style chip. Fewer fats and thins around the collar.",
  },
  {
    id: "chip-8iron",
    youtubeId: "HUsvrBEMIKI",
    title: "Average Golfers Must Watch This",
    channel: "Rick Shiels Golf",
    topic: "chipping",
    minutes: "1 min",
    why: "Bump-and-run with an 8-iron when there is nothing to fly over.",
  },
  {
    id: "simple-nine",
    youtubeId: "iUwNDb643u0",
    title: "9 Really Simple Tips All Golfers Need to Know",
    channel: "Rick Shiels Golf",
    topic: "chipping",
    minutes: "8 min",
    why: "Putter off the green, safer clubs, fewer hero flop shots.",
  },
  {
    id: "tempo-senior",
    youtubeId: "wJRfwmFLNoI",
    title: "3 Tempo Drills That Help Seniors Hit It Better",
    channel: "US GOLF TV",
    topic: "tempo",
    minutes: "4 min",
    why: "Rhythm over speed. Built for a smoother swing, not a 320-yard flex.",
  },
  {
    id: "driver-senior",
    youtubeId: "DNDcI_ygBD8",
    title: "This Move Unleashes Longer Drives — Senior Golfers",
    channel: "The Average Golfer",
    topic: "driver",
    minutes: "8 min",
    why: "A little heel lift for a fuller turn if the back does not love a stacked coil.",
  },
  {
    id: "rules-path",
    youtubeId: "VL9bpkIbbbM",
    title: "Golf Rules 101: Free Relief from Cart Paths",
    channel: "SwingU",
    topic: "rules",
    minutes: "2 min",
    why: "Executive holes keep carts on the path. This is the drop when you are on it.",
  },
  {
    id: "rules-relief",
    youtubeId: "vg9pfOxACxE",
    title: "This Free-Relief Rule Could Save You Strokes",
    channel: "USGA",
    topic: "rules",
    minutes: "1 min",
    why: "Official USGA short — use it at the cart, not in the clubhouse argument.",
  },
];

export const GOLF_PRACTICE_TOOLS: GolfPracticeTool[] = [
  {
    id: "gtv",
    label: "Golf The Villages",
    href: GOLF_HUB.golfTheVillages,
    job: "Championship tee times",
    villages:
      "Book championship / country-club times here. Residents: 3 days ahead. Day-of, call the shop. Executive nines are amenity-fee greens — this site is for the paid 18s.",
  },
  {
    id: "ghin",
    label: "GHIN / USGA handicap",
    href: GOLF_HUB.ghin,
    job: "Official handicap",
    villages:
      "Post scores if you play in a club or want a real index. Executive-only neighbors can skip this and still use the in-app scorecard.",
  },
  {
    id: "usga-rules",
    label: "USGA Rules of Golf",
    href: "https://www.usga.org/rules-hub.html",
    job: "Is that a free drop?",
    villages:
      "Cart path, sprinkler head, and casual water come up on the executive trail. Look it up here instead of inventing a local rule on 7.",
  },
  {
    id: "18birdies",
    label: "18Birdies",
    href: "https://18birdies.com/",
    job: "GPS + extra score",
    villages:
      "Phone-in-the-cup-holder GPS if you want it. Your My Space scorecard still lives here — you do not have to double-enter rounds.",
  },
  {
    id: "swingu",
    label: "SwingU",
    href: "https://www.swingu.com/",
    job: "Structured lessons",
    villages:
      "Optional paid coaching library. For a 4-minute tip before the round, stay on the video shelf above.",
  },
  {
    id: "mamg",
    label: "Me and My Golf",
    href: "https://www.meandmygolf.com/",
    job: "Lesson plans",
    villages:
      "Same coaches as two of the putting clips. Use the site if you want a program; use the clips if you just want today’s drill.",
  },
];
