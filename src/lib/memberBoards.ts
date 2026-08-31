import { readJsonFile, writeJsonFileAsync } from "./dataFs";
import {
  type MemberBoards,
  type StoredBoardId,
  emptyBoards,
  sanitizeBoard,
} from "./memberBoardModel";

export * from "./memberBoardModel";

const FILE = "member-boards.json";

type FileShape = {
  members: Record<string, Partial<MemberBoards>>;
  updatedAt: string | null;
};

function loadFile(): FileShape {
  const raw = readJsonFile<FileShape>(FILE);
  if (!raw || typeof raw !== "object") return { members: {}, updatedAt: null };
  return {
    members: raw.members && typeof raw.members === "object" ? raw.members : {},
    updatedAt: raw.updatedAt || null,
  };
}

export function getMemberBoards(memberId: string): MemberBoards {
  const rec = loadFile().members[memberId] || {};
  return {
    news: sanitizeBoard("news", rec.news) as MemberBoards["news"],
    entertainment: sanitizeBoard(
      "entertainment",
      rec.entertainment
    ) as MemberBoards["entertainment"],
    food: sanitizeBoard("food", rec.food) as MemberBoards["food"],
    gym: sanitizeBoard("gym", rec.gym) as MemberBoards["gym"],
    maintenance: sanitizeBoard(
      "maintenance",
      rec.maintenance
    ) as MemberBoards["maintenance"],
    memories: sanitizeBoard("memories", rec.memories) as MemberBoards["memories"],
    golfLog: sanitizeBoard("golfLog", rec.golfLog) as MemberBoards["golfLog"],
    pickleballLog: sanitizeBoard(
      "pickleballLog",
      rec.pickleballLog
    ) as MemberBoards["pickleballLog"],
    health: sanitizeBoard("health", rec.health) as MemberBoards["health"],
    pets: sanitizeBoard("pets", rec.pets) as MemberBoards["pets"],
    calendar: sanitizeBoard("calendar", rec.calendar) as MemberBoards["calendar"],
    portfolio: sanitizeBoard(
      "portfolio",
      rec.portfolio
    ) as MemberBoards["portfolio"],
    weather: sanitizeBoard("weather", rec.weather) as MemberBoards["weather"],
  };
}

export async function saveMemberBoard(
  memberId: string,
  boardId: StoredBoardId,
  data: unknown
) {
  const file = loadFile();
  const current = getMemberBoards(memberId);
  const next: MemberBoards = {
    ...emptyBoards(),
    ...current,
    [boardId]: sanitizeBoard(boardId, data),
  };
  file.members[memberId] = next;
  file.updatedAt = new Date().toISOString();
  await writeJsonFileAsync(FILE, file);
  return next[boardId];
}
