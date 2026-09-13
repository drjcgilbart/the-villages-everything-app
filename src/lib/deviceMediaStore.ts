/**
 * Phone-only blobs for My Space (IndexedDB).
 * These stay on this device and do not follow the member to other phones.
 */

const DB_NAME = "tvea-device-media";
const STORE = "blobs";
const VERSION = 1;

type MediaRecord = {
  id: string;
  blob: Blob;
  name: string;
  type: string;
  savedAt: string;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("This phone cannot keep files locally."));
      return;
    }
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () =>
      reject(req.error || new Error("Could not open local photo storage."));
  });
}

export async function putDeviceMedia(
  id: string,
  blob: Blob,
  meta: { name: string; type: string }
): Promise<void> {
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () =>
        reject(tx.error || new Error("Could not save that file on this phone."));
      tx.objectStore(STORE).put({
        id,
        blob,
        name: meta.name.slice(0, 80),
        type: meta.type || blob.type || "application/octet-stream",
        savedAt: new Date().toISOString(),
      } satisfies MediaRecord);
    });
  } finally {
    db.close();
  }
}

export async function getDeviceMedia(id: string): Promise<Blob | null> {
  if (!id) return null;
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(id);
      req.onsuccess = () => {
        const rec = req.result as MediaRecord | undefined;
        resolve(rec?.blob || null);
      };
      req.onerror = () =>
        reject(req.error || new Error("Could not read that local file."));
    });
  } finally {
    db.close();
  }
}

export async function deleteDeviceMedia(id: string): Promise<void> {
  if (!id) return;
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error("Could not delete local file."));
      tx.objectStore(STORE).delete(id);
    });
  } finally {
    db.close();
  }
}

export async function deleteDeviceMediaMany(ids: string[]): Promise<void> {
  const unique = [...new Set(ids.filter(Boolean))];
  for (const id of unique) {
    try {
      await deleteDeviceMedia(id);
    } catch {
      /* leftover local files are harmless */
    }
  }
}
