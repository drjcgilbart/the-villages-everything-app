/**
 * Holiday Lights page only.
 * To add a song later, put an mp3 in public/music/holiday and add an entry to HOLIDAY_TRACKS.
 * The rest of the site keeps its own list in themeMusic.ts.
 */
import type { ThemeTrack } from "./themeMusic";
import type { TourHoliday } from "./lightTourShared";

export type HolidayTrack = ThemeTrack & {
  holiday: "halloween" | "christmas";
};

export const HOLIDAY_TRACKS: HolidayTrack[] = [
  {
    id: "mountain-king",
    holiday: "halloween",
    name: "In the Hall of the Mountain King",
    emoji: "🎃",
    blurb: "Czech National Symphony Orchestra. Quiet at first, then it takes off.",
    src: "/music/holiday/mountain-king.mp3",
    credit:
      "Edvard Grieg — Czech National Symphony Orchestra, for Musopen. Released to the public domain.",
  },
  {
    id: "witches-sabbath",
    holiday: "halloween",
    name: "A Dream of a Witches' Sabbath",
    emoji: "🦇",
    blurb: "The U.S. Marine Band plays the last movement of Symphonie fantastique.",
    src: "/music/holiday/witches-sabbath.mp3",
    credit:
      "Hector Berlioz, transcribed by Lt. Col. Jack T. Cline — United States Marine Band. Public domain.",
  },
  {
    id: "danse-macabre",
    holiday: "halloween",
    name: "Danse Macabre",
    emoji: "💀",
    blurb: "Philadelphia Orchestra with Leopold Stokowski. Death tunes the violin at midnight.",
    src: "/music/holiday/danse-macabre.mp3",
    credit:
      "Camille Saint-Saëns — Philadelphia Orchestra, Leopold Stokowski. Victor 6505, recorded April 29, 1925. Public domain in the United States.",
  },
  {
    id: "jingle-bells",
    holiday: "christmas",
    name: "Jingle Bells",
    emoji: "🔔",
    blurb: "U.S. Air Force Band of Mid-America, with Starlifter and Roots in Blue.",
    src: "/music/holiday/jingle-bells.mp3",
    credit: "United States Air Force Band of Mid-America, 2020. Public domain.",
  },
  {
    id: "merry-christmas",
    holiday: "christmas",
    name: "We Wish You a Merry Christmas",
    emoji: "🎄",
    blurb: "U.S. Air Force Band of Mid-America, with Starlifter and Roots in Blue.",
    src: "/music/holiday/merry-christmas.mp3",
    credit: "United States Air Force Band of Mid-America, 2020. Public domain.",
  },
];

export function holidayTracksFor(holiday: TourHoliday): HolidayTrack[] {
  if (holiday === "other") return HOLIDAY_TRACKS;
  return HOLIDAY_TRACKS.filter((track) => track.holiday === holiday);
}
