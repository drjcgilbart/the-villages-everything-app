import { readJsonFile, writeJsonFileAsync } from "@/lib/dataFs";

export type CruisePhoto = {
  id: string;
  ship: string;
  port: string;
  caption: string;
  by: string;
  image: string;
  createdAt: string;
};

const FILE = "cruise-gallery.json";
const MAX = 36;

export function readCruisePhotos(): CruisePhoto[] {
  const data = readJsonFile<{ photos?: CruisePhoto[] }>(FILE);
  return Array.isArray(data?.photos) ? data.photos : [];
}

export async function addCruisePhoto(photo: CruisePhoto): Promise<CruisePhoto[]> {
  const photos = [photo, ...readCruisePhotos()].slice(0, MAX);
  await writeJsonFileAsync(FILE, { photos });
  return photos;
}
