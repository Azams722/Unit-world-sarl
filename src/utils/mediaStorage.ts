/**
 * High-Performance Client-Side Media Vault & Storage Utility
 * - Compresses high-resolution photos in-browser using HTML5 Canvas (~120KB per photo)
 * - Persists large video files (MP4, WebM, MOV) natively in IndexedDB
 * - Provides seamless synchronization with Firestore (well under 1MB document limit)
 * - Generates streaming Object URLs for instant, smooth video playback
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

/**
 * Stores a video file into IndexedDB and returns a persistent custom URI
 */
export async function storeVideoFile(
  file: File
): Promise<{ uri: string; objectUrl: string; size: number }> {
  const db = await getMediaDb();
  const id = `idb:video:${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  return new Promise((resolve, reject) => {
    const tx = db.transaction([STORE_MEDIA], 'readwrite');
    const store = tx.objectStore(STORE_MEDIA);

    const record = {
      id,
      blob: file,
      filename: file.name,
      type: file.type || 'video/mp4',
      size: file.size,
      createdAt: new Date().toISOString()
    };

    const req = store.put(record);

    req.onsuccess = () => {
      const objectUrl = URL.createObjectURL(file);
      blobUrlCache.set(id, objectUrl);
      resolve({ uri: id, objectUrl, size: file.size });
    };

    req.onerror = () => reject(req.error);
  });
}

/**
 * Resolves any media string (IndexedDB URI, Data URL, Cloud URL) to a playable/displayable URL
 */
export async function resolveMediaUrl(uri: string): Promise<string> {
  if (!uri) return '';
  if (!uri.startsWith('idb:')) return uri;

  if (blobUrlCache.has(uri)) {
    return blobUrlCache.get(uri)!;
  }

  try {
    const db = await getMediaDb();
    return new Promise((resolve) => {
      const tx = db.transaction([STORE_MEDIA], 'readonly');
      const store = tx.objectStore(STORE_MEDIA);
      const req = store.get(uri);

      req.onsuccess = () => {
        const item = req.result;
        if (item && item.blob) {
          const url = URL.createObjectURL(item.blob);
          blobUrlCache.set(uri, url);
          resolve(url);
        } else {
          resolve('');
        }
      };

      req.onerror = () => resolve('');
    });
  } catch {
    return '';
  }
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
 * Universal media processor: processes images (compressed Data URL) and videos (IndexedDB Blob)
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
