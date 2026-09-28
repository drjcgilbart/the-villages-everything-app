import { readJsonFile, writeJsonFileAsync } from "@/lib/dataFs";

export type RangePhoto = {
  id: string;
  range: string;
  gear: string;
  caption: string;
  by: string;
  image: string;
  createdAt: string;
};

const FILE = "range-gallery.json";

type Log = { photos?: RangePhoto[] };

export function readRangeGallery() {
  const data = readJsonFile<Log>(FILE);
  return { photos: Array.isArray(data?.photos) ? data.photos : [] };
}

export async function addRangePhoto(photo: RangePhoto) {
  const log = readRangeGallery();
  const photos = [photo, ...log.photos].slice(0, 36);
  await writeJsonFileAsync(FILE, { photos });
  return { photos };
}
