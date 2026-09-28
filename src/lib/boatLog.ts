import { readJsonFile, writeJsonFileAsync } from "@/lib/dataFs";

export type CatchReport = {
  id: string;
  lake: string;
  species: string;
  bait: string;
  note: string;
  by: string;
  createdAt: string;
};

export type BoatPhoto = {
  id: string;
  boat: string;
  catchName: string;
  caption: string;
  by: string;
  image: string;
  createdAt: string;
};

const FILE = "boat-log.json";

type Log = { reports?: CatchReport[]; photos?: BoatPhoto[] };

function readLog(): { reports: CatchReport[]; photos: BoatPhoto[] } {
  const data = readJsonFile<Log>(FILE);
  return {
    reports: Array.isArray(data?.reports) ? data.reports : [],
    photos: Array.isArray(data?.photos) ? data.photos : [],
  };
}

export function readBoatLog() {
  return readLog();
}

export async function addCatchReport(report: CatchReport) {
  const log = readLog();
  const reports = [report, ...log.reports].slice(0, 40);
  await writeJsonFileAsync(FILE, { ...log, reports });
  return { reports, photos: log.photos };
}

export async function addBoatPhoto(photo: BoatPhoto) {
  const log = readLog();
  const photos = [photo, ...log.photos].slice(0, 36);
  await writeJsonFileAsync(FILE, { ...log, photos });
  return { reports: log.reports, photos };
}
