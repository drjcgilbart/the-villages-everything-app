import { readJsonFile, writeJsonFileAsync } from "@/lib/dataFs";

export type LaunchPhoto = {
  id: string;
  launch: string;
  caption: string;
  by: string;
  image: string;
  createdAt: string;
};

const FILE = "launch-gallery.json";
const MAX = 36;

export function readLaunchPhotos(): LaunchPhoto[] {
  const data = readJsonFile<{ photos?: LaunchPhoto[] }>(FILE);
  return Array.isArray(data?.photos) ? data.photos : [];
}

export async function addLaunchPhoto(photo: LaunchPhoto): Promise<LaunchPhoto[]> {
  const photos = [photo, ...readLaunchPhotos()].slice(0, MAX);
  await writeJsonFileAsync(FILE, { photos });
  return photos;
}
