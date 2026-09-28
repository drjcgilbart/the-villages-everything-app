import { readJsonFile, writeJsonFileAsync } from "@/lib/dataFs";

export type TripPhoto = {
  id: string;
  place: string;
  caption: string;
  by: string;
  image: string;
  createdAt: string;
};

const FILE = "trip-gallery.json";
const MAX = 36;

export function readTripPhotos(): TripPhoto[] {
  const data = readJsonFile<{ photos?: TripPhoto[] }>(FILE);
  return Array.isArray(data?.photos) ? data.photos : [];
}

export async function addTripPhoto(photo: TripPhoto): Promise<TripPhoto[]> {
  const photos = [photo, ...readTripPhotos()].slice(0, MAX);
  await writeJsonFileAsync(FILE, { photos });
  return photos;
}
