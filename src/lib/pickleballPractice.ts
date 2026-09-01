/**
 * Curated My Space Pickleball → Practice shelf.
 * Hand-picked clips and tools — not a live YouTube search.
 */

import { PICKLE_HUB } from "./entertainmentCatalog";

export type PicklePracticeTopic = "dink" | "kitchen" | "serve" | "third" | "rules";

export type PicklePracticeVideo = {
  id: string;
  youtubeId: string;
  title: string;
  channel: string;
  topic: PicklePracticeTopic;
  minutes: string;
  why: string;
};

export type PicklePracticeTool = {
  id: string;
  label: string;
  href: string;
  job: string;
  villages: string;
};

export const PICKLE_PRACTICE_TOPICS: { id: PicklePracticeTopic | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "dink", label: "Dink" },
  { id: "kitchen", label: "Kitchen" },
  { id: "serve", label: "Serve" },
  { id: "third", label: "Third shot" },
  { id: "rules", label: "Rules" },
];

export const PICKLE_PRACTICE_VIDEOS: PicklePracticeVideo[] = [
  {
    id: "dink-right",
    youtubeId: "5-ty-cyg6sI",
    title: "How to Dink the Right Way",
    channel: "PlayPickleball.com",
    topic: "dink",
    minutes: "6 min",
    why: "Soft grip, paddle out front — fewer pop-ups at Rohan’s kitchen line.",
  },
  {
    id: "dink-drills",
    youtubeId: "J4EG6gOo5XA",
    title: "Top 3 Beginner Pickleball Drills",
    channel: "Pickleball Central",
    topic: "dink",
    minutes: "5 min",
    why: "Lift dink, volley dink, block volley — a 5-minute warm-up before open play.",
  },
  {
    id: "kitchen-usa",
    youtubeId: "HVTQ-_vQhK8",
    title: "What Is the Kitchen in Pickleball",
    channel: "USA Pickleball",
    topic: "kitchen",
    minutes: "3 min",
    why: "Official NVZ in plain English. The line counts. Momentum counts.",
  },
  {
    id: "kitchen-rules",
    youtubeId: "JCXWSDlDL38",
    title: "Rules to Remember at the Kitchen",
    channel: "PlayPickleball.com",
    topic: "rules",
    minutes: "3 min",
    why: "You may step in — you just cannot volley from there. Rec-court myth buster.",
  },
  {
    id: "kitchen-four",
    youtubeId: "oJaa2UZsk30",
    title: "4 Kitchen Rules & Strategy",
    channel: "PlayPickleball.com",
    topic: "kitchen",
    minutes: "5 min",
    why: "Hug the line, don’t treat it like lava, re-establish both feet after a lob.",
  },
  {
    id: "serve-legal",
    youtubeId: "HtaMX3f5zyE",
    title: "How to Serve Legally",
    channel: "PlayPickleball.com",
    topic: "serve",
    minutes: "3 min",
    why: "Upward arc, paddle below the wrist, contact below the waist — plus the drop serve.",
  },
  {
    id: "third-3min",
    youtubeId: "7oxAspMvJUc",
    title: "How to Hit a 3rd Shot Drop in Under 3 Minutes",
    channel: "tanner.pickleball",
    topic: "third",
    minutes: "3 min",
    why: "Bean-bag toss, not a tennis stroke. Miss long, not in the net.",
  },
  {
    id: "third-50",
    youtubeId: "9fPvk4iTsjQ",
    title: "The Best Third Shot Drop for 50+ Players",
    channel: "The Pickleball Clinic",
    topic: "third",
    minutes: "10 min",
    why: "Slower, higher drop so you have time to walk in. Split-step, don’t jump.",
  },
  {
    id: "third-drill",
    youtubeId: "4x78S6Nc2iY",
    title: "3rd Shot Drop Drill for Beginner & Intermediate",
    channel: "Selkirk TV",
    topic: "third",
    minutes: "5 min",
    why: "Toss first, then drop-and-hit. Compact swing, contact out front.",
  },
  {
    id: "dink-pro",
    youtubeId: "XW3gyKe20f0",
    title: "How to Dink Like a Pro",
    channel: "tanner.pickleball",
    topic: "dink",
    minutes: "7 min",
    why: "Kitchen line is a magnet. One-foot steps, loose grip, let the ball hit you.",
  },
];

export const PICKLE_PRACTICE_TOOLS: PicklePracticeTool[] = [
  {
    id: "dupr",
    label: "DUPR",
    href: PICKLE_HUB.dupr,
    job: "Official rating",
    villages:
      "Ladders and leagues here use DUPR. Rec open play at Rohan does not require it. This board keeps your Villages book; DUPR stays the rating.",
  },
  {
    id: "dupr-dash",
    label: "DUPR dashboard",
    href: PICKLE_HUB.duprDash,
    job: "Log rated matches",
    villages:
      "Post a league or ladder match here. Friendly rec games can stay on Matches in My Space.",
  },
  {
    id: "usap-rules",
    label: "USA Pickleball rules",
    href: "https://usapickleball.org/what-is-pickleball/official-rules/",
    job: "Kitchen / NVZ arguments",
    villages:
      "The line is the kitchen. Momentum after a volley still counts. Look it up here instead of a 20-minute debate on court 7.",
  },
  {
    id: "villages-pb",
    label: "The Villages pickleball",
    href: PICKLE_HUB.home,
    job: "Where to play",
    villages:
      "Official rec page: courts, open play, guest IDs. Rohan has the big lighted complex; St. Tropez is indoor when it’s 95°.",
  },
  {
    id: "tvcpc",
    label: "TVCPC",
    href: PICKLE_HUB.tvcpc,
    job: "Competitive club",
    villages:
      "The Villages Competitive Pickleball Club — ladders, FAQ, and the folks who actually care about DUPR. Rec-only neighbors can skip it.",
  },
  {
    id: "lessons",
    label: "Pickleball Community",
    href: PICKLE_HUB.lessons,
    job: "Local lessons",
    villages:
      "Instruction in and around The Villages. For a 4-minute tip before open play, stay on the video shelf above.",
  },
];
