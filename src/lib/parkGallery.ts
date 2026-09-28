import { readJsonFile, writeJsonFileAsync } from "@/lib/dataFs";

export type ParkPhoto = {
  id: string;
  park: string;
  caption: string;
  by: string;
  image: string;
  createdAt: string;
};

const FILE = "park-gallery.json";
const MAX = 36;

export function readParkPhotos(): ParkPhoto[] {
  const data = readJsonFile<{ photos?: ParkPhoto[] }>(FILE);
  return Array.isArray(data?.photos) ? data.photos : [];
}

export async function addParkPhoto(photo: ParkPhoto): Promise<ParkPhoto[]> {
  const photos = [photo, ...readParkPhotos()].slice(0, MAX);
  await writeJsonFileAsync(FILE, { photos });
  return photos;
}
