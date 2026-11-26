import { uploadVideoChunksToDb, fetchVideoBlobFromDb, MAX_VIDEO_SIZE_BYTES } from '../firebase';

/**
 * High-Performance Client-Side Media Vault & Storage Utility
 * - Compresses high-resolution photos in-browser using HTML5 Canvas (~120KB per photo)
 * - Uploads <=2MB videos in binary chunks to Firestore so all storefront visitors can play them
 * - Caches media locally in IndexedDB & Object URLs for instant replay
 */

const DB_NAME = 'unitworld_media_vault_v2';
const DB_VERSION = 1;
const STORE_MEDIA = 'media_files';

let dbInstance: IDBDatabase | null = null;
const blobUrlCache = new Map<string, string>();

/**
 * Initializes or returns the native IndexedDB instance
 */
export async function getMediaDb(): Promise<IDBDatabase> {
  if (dbInstance) return dbInstance;

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_MEDIA)) {
        db.createObjectStore(STORE_MEDIA, { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      dbInstance = (event.target as IDBOpenDBRequest).result;
      resolve(dbInstance);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });
}

/**
 * Compresses an image file in-browser to a compact, crisp JPEG data URL
 * Max dimension: 1400px, quality: 0.82
 * Typically shrinks 4MB-10MB WhatsApp images to ~100KB-150KB
 */
export async function compressImageToDataUrl(
  file: File,
  maxDimension = 1400,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw with high quality smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('FileReader error on image'));
    reader.readAsDataURL(file);
  });
}

/**
 * Re-compresses an existing image data URL to a smaller dimension/quality
 * so multi-photo product payloads stay safely under Firestore's 1MB document limit.
 */
export async function recompressDataUrl(
  dataUrl: string,
  maxDimension = 900,
  quality = 0.65
): Promise<string> {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) {
    return dataUrl;
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);
      const smaller = canvas.toDataURL('image/jpeg', quality);
      resolve(smaller.length < dataUrl.length ? smaller : dataUrl);
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export { MAX_VIDEO_SIZE_BYTES };

export const STORE_VIDEO_SECTIONS = [
  { key: 'hero', label: 'Hero Showcase Banner' },
  { key: 'automobiles', label: 'Automobiles & Heavy Motors Showroom' },
  { key: 'everyday', label: 'Everyday Essentials & Home Appliances' },
  { key: 'hair', label: 'Luxury Human Hair & Wigs Collection' },
  { key: 'fashion', label: 'Fashion Hub (All Clothes ₦25,000)' },
  { key: 'groceries', label: 'Supermarket & Farm Raw Foods' },
] as const;

async function cacheBlobInIndexedDb(id: string, blob: Blob, filename: string): Promise<void> {
  try {
    const db = await getMediaDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([STORE_MEDIA], 'readwrite');
      const store = tx.objectStore(STORE_MEDIA);
      const req = store.put({
        id,
        blob,
        filename,
        type: blob.type || 'video/mp4',
        size: blob.size,
        createdAt: new Date().toISOString(),
      });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Ignore IndexedDB quota/privacy issues when Firestore cloud backup succeeds
  }
}

async function readBlobFromIndexedDb(id: string): Promise<Blob | null> {
  try {
    const db = await getMediaDb();
    return await new Promise<Blob | null>((resolve) => {
      const tx = db.transaction([STORE_MEDIA], 'readonly');
      const store = tx.objectStore(STORE_MEDIA);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result?.blob || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Validates 2MB max limit, stores video chunks in Firestore (so all visitors can play it),
 * and caches locally in IndexedDB for instant playback.
 */
export async function storeVideoFile(
  file: File
): Promise<{ uri: string; objectUrl: string; size: number }> {
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    throw new Error(
      `Video "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(2)}MB, exceeding the 2MB maximum video limit.`
    );
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 60);
  const videoId = `vid_${Date.now()}_${safeName}`;
  const uri = `fs:video:${videoId}`;

  await uploadVideoChunksToDb(videoId, file);
  await cacheBlobInIndexedDb(uri, file, file.name);

  const objectUrl = URL.createObjectURL(file);
  blobUrlCache.set(uri, objectUrl);
  return { uri, objectUrl, size: file.size };
}

/**
 * Resolves any media string (Firestore video URI, IndexedDB URI, Data URL, Cloud URL) to a playable/displayable URL
 */
export async function resolveMediaUrl(uri: string): Promise<string> {
  if (!uri) return '';
  if (!uri.startsWith('idb:') && !uri.startsWith('fs:video:')) return uri;

  if (blobUrlCache.has(uri)) {
    return blobUrlCache.get(uri)!;
  }

  const cachedBlob = await readBlobFromIndexedDb(uri);
  if (cachedBlob) {
    const url = URL.createObjectURL(cachedBlob);
    blobUrlCache.set(uri, url);
    return url;
  }

  if (uri.startsWith('fs:video:')) {
    const videoId = uri.slice('fs:video:'.length);
    const remoteBlob = await fetchVideoBlobFromDb(videoId);
    if (remoteBlob) {
      await cacheBlobInIndexedDb(uri, remoteBlob, videoId);
      const url = URL.createObjectURL(remoteBlob);
      blobUrlCache.set(uri, url);
      return url;
    }
  }

  return '';
}

export interface ProcessedMediaItem {
  id: string;
  url: string;
  displayUrl: string;
  isVideo: boolean;
  filename: string;
  size: number;
}

/**
 * Universal media processor: processes images (compressed Data URL) and videos (2MB max -> Firestore + IndexedDB cache)
 */
export async function processMediaFile(file: File): Promise<ProcessedMediaItem> {
  const isVideo = file.type.startsWith('video/') || /\.(mp4|mov|webm|mkv|avi)$/i.test(file.name);

  if (isVideo) {
    const stored = await storeVideoFile(file);
    return {
      id: stored.uri,
      url: stored.uri,
      displayUrl: stored.objectUrl,
      isVideo: true,
      filename: file.name,
      size: stored.size
    };
  }

  // Otherwise, compress image
  const dataUrl = await compressImageToDataUrl(file);
  return {
    id: `img:${Date.now()}-${file.name.slice(0, 10)}`,
    url: dataUrl,
    displayUrl: dataUrl,
    isVideo: false,
    filename: file.name,
    size: dataUrl.length
  };
}

/**
 * Legacy wrapper for compatibility with existing components
 */
export async function uploadMediaFile(
  file: File
): Promise<{ url: string; isVideo: boolean; name: string }> {
  const res = await processMediaFile(file);
  return {
    url: res.url,
    isVideo: res.isVideo,
    name: res.filename
  };
}
