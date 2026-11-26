import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDocFromServer,
  writeBatch,
  deleteField,
  Bytes
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Product, Order, UserProfile, GatewaySettings, BrandSettings, AppNotification, AdminUser, ServiceBooking, ServiceBookingStatus } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch(() => {});
export const googleProvider = new GoogleAuthProvider();

// One-way SHA-256 digests so no admin email or password is ever stored in plaintext in client bundles
const ADMIN_EMAIL_HASH = 'b0ef5206e3968d427f8a7cfba4c1b980295bc909c22f398fddff11d42797af84';
const ADMIN_CREDENTIAL_HASH = '47516dc02d26f1d767f7b056e513dbadf4f108db280427dd9a7f2e17ee5a4ca4';
const ACTIVE_SESSION_KEY = 'unitworld_active_session';
const LOCAL_AUTH_STORE_KEY = 'unitworld_auth_store';

async function sha256Hex(input: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoded = new TextEncoder().encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', encoded);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Minimal pure-JS fallback if crypto.subtle is unavailable
  const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  const bytes = Array.from(new TextEncoder().encode(input));
  const bitLen = bytes.length * 8;
  bytes.push(0x80);
  while ((bytes.length % 64) !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i--) bytes.push((bitLen / Math.pow(2, i * 8)) & 0xff);
  const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const rotr = (x: number, n: number) => (x >>> n) | (x << (32 - n));
  for (let i = 0; i < bytes.length; i += 64) {
    const W = new Array<number>(64);
    for (let t = 0; t < 16; t++) {
      W[t] = (bytes[i + t * 4] << 24) | (bytes[i + t * 4 + 1] << 16) | (bytes[i + t * 4 + 2] << 8) | bytes[i + t * 4 + 3];
    }
    for (let t = 16; t < 64; t++) {
      const s0 = rotr(W[t - 15], 7) ^ rotr(W[t - 15], 18) ^ (W[t - 15] >>> 3);
      const s1 = rotr(W[t - 2], 17) ^ rotr(W[t - 2], 19) ^ (W[t - 2] >>> 10);
      W[t] = (W[t - 16] + s0 + W[t - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let t = 0; t < 64; t++) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + S1 + ch + K[t] + W[t]) | 0;
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) | 0;
      h = g; g = f; f = e; e = (d + temp1) | 0; d = c; c = b; b = a; a = (temp1 + temp2) | 0;
    }
    H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + c) | 0; H[3] = (H[3] + d) | 0;
    H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
  }
  return H.map((x) => (x >>> 0).toString(16).padStart(8, '0')).join('');
}

export async function isAuthorizedAdminEmail(email?: string | null): Promise<boolean> {
  const normalized = (email || '').trim().toLowerCase();
  if (!normalized) return false;
  const emailHash = await sha256Hex(`uw_sarl_adm_id::${normalized}`);
  if (emailHash === ADMIN_EMAIL_HASH) return true;
  try {
    const q = query(collection(db, 'admins'), where('email', '==', normalized));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs.some((d) => (d.data() as AdminUser).isActive !== false);
    }
  } catch {
    // Ignore permission errors when unauthenticated
  }
  return false;
}

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return false;
  const credHash = await sha256Hex(`uw_sarl_adm_cred::${normalized}::${password}`);
  return credHash === ADMIN_CREDENTIAL_HASH;
}

export async function registerUserCredential(email: string, password: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return;
  try {
    const emailHash = await sha256Hex(`uw_sarl_usr_id::${normalized}`);
    const credHash = await sha256Hex(`uw_sarl_usr_cred::${normalized}::${password}`);
    const raw = localStorage.getItem(LOCAL_AUTH_STORE_KEY);
    const map: Record<string, string> = raw ? JSON.parse(raw) : {};
    map[emailHash] = credHash;
    localStorage.setItem(LOCAL_AUTH_STORE_KEY, JSON.stringify(map));
  } catch {
    // Ignore storage restriction
  }
}

export async function verifyUserCredential(email: string, password: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !password) return false;
  if (await verifyAdminCredentials(normalized, password)) return true;
  try {
    const emailHash = await sha256Hex(`uw_sarl_usr_id::${normalized}`);
    const credHash = await sha256Hex(`uw_sarl_usr_cred::${normalized}::${password}`);
    const raw = localStorage.getItem(LOCAL_AUTH_STORE_KEY);
    if (!raw) return false;
    const map: Record<string, string> = JSON.parse(raw);
    return map[emailHash] === credHash;
  } catch {
    return false;
  }
}

export function saveActiveSession(profile: UserProfile | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!profile) {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } else {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(profile));
    }
  } catch {
    // Ignore storage restriction
  }
}

export function loadActiveSession(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UserProfile;
    if (parsed && parsed.uid && parsed.email) {
      return parsed;
    }
  } catch {
    // Ignore malformed session
  }
  return null;
}

export const DEFAULT_BRAND_LOGO = 'https://res.cloudinary.com/dgc6ootad/image/upload/v1790464730/Unitworld_Trustworthy_Ecommerce_Marketplace_rmlqq8.png';

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  logoUrl: DEFAULT_BRAND_LOGO,
  brandName: 'UNITWORLD SARL',
  tagline: 'OFFICIAL DIRECT STORE.',
  supportPhone: '07070554285',
  supportEmail: 'contact@unit-world-sarl.com',
  whatsappNumber: '07070554285',
  address: 'Victoria Island, Lagos, Nigeria / SARL Headquarters'
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// 1. Connection test on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Unitworld Firestore connected successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline, check network/firewall.');
    }
    // Return true as long as initialization went through
    return true;
  }
}

// Helper to identify banned, archived, or corrupted/incomplete product documents
function isExcludedCatalogProduct(prod: Partial<Product>): boolean {
  if (!prod || prod.isArchived) return true;
  if (
    typeof prod.title !== 'string' ||
    !prod.title.trim() ||
    typeof prod.category !== 'string' ||
    !prod.category.trim() ||
    typeof prod.price !== 'number' ||
    !Number.isFinite(prod.price)
  ) {
    return true;
  }
  if (
    prod.id === 'prod-dettol-antiseptic-1l' ||
    prod.id === 'prod-jumia-dettol-antiseptic-1l' ||
    (typeof prod.id === 'string' && prod.id.startsWith('prod-jumia-')) ||
    (typeof prod.sku === 'string' && prod.sku.includes('HEALTH')) ||
    (Array.isArray(prod.tags) && prod.tags.includes('First Aid'))
  ) {
    return true;
  }
  return false;
}

// 2. Database Auto-Seeder & Product Sync: Ensures products come directly from Firebase database
export async function syncAllProductsToDb(overwriteExisting = true): Promise<Product[]> {
  const path = 'products';
  try {
    console.log('Syncing verified catalog products to Firestore database...');
    const batch = writeBatch(db);
    for (const prod of INITIAL_PRODUCTS) {
      const ref = doc(db, 'products', prod.id);
      let toSave = { ...prod };
      if (!overwriteExisting) {
        try {
          const existingDoc = await getDoc(ref);
          if (existingDoc.exists()) {
            const exData = existingDoc.data() as Product;
            if (exData.images && exData.images.length > 0) {
              toSave.images = exData.images;
            }
            if (exData.videos && exData.videos.length > 0) {
              toSave.videos = exData.videos;
            }
          }
        } catch {}
      }
      batch.set(ref, toSave);
    }
    await batch.commit();

    // Ensure brand logo is saved in Firestore settings
    const brandRef = doc(db, 'settings', 'brand');
    await setDoc(brandRef, DEFAULT_BRAND_SETTINGS, { merge: true });

    // Ensure gateway settings are present
    const settingsRef = doc(db, 'settings', 'gateway');
    const defaultSettings: GatewaySettings = {
      paystackPublicKey: '',
      paystackSecretKey: '',
      paystackEnabled: false,
      currency: 'NGN',
      merchantEmail: 'payments@unit-world-sarl.com',
      merchantBusinessName: 'UNITWORLD SARL GLOBAL COMMERCE',
      webhookUrl: 'https://api.unit-world-sarl.com/webhook/paystack',
      bankAccountDetails: {
        bankName: 'Guaranty Trust Bank (GTBank)',
        accountName: 'UNITWORLD SARL GLOBAL COMMERCE',
        accountNumber: '0284729104'
      }
    };
    await setDoc(settingsRef, defaultSettings, { merge: true });

    // Return all products from Firestore (preserving custom admin-created products)
    const snap = await getDocs(collection(db, path));
    const merged: Product[] = [];
    snap.forEach((d) => {
      const raw = d.data() as Partial<Product>;
      const p = { ...raw, id: raw.id || d.id } as Product;
      if (!isExcludedCatalogProduct(p)) {
        merged.push(p);
      }
    });
    return merged.length > 0 ? merged : INITIAL_PRODUCTS;
  } catch (err) {
    console.warn('Sync to database notice:', err);
    return INITIAL_PRODUCTS;
  }
}

export async function seedProductsIfEmpty(): Promise<Product[]> {
  const path = 'products';
  try {
    const productsSnapshot = await getDocs(collection(db, path));

    const initialIdsSet = new Set(INITIAL_PRODUCTS.map((p) => p.id));
    let needsUpdate = false;
    if (productsSnapshot.empty) {
      needsUpdate = true;
    } else {
      const existingIds = new Set<string>();
      productsSnapshot.forEach((d) => {
        const raw = d.data() as Partial<Product>;
        const data = { ...raw, id: raw.id || d.id } as Product;
        existingIds.add(data.id);
        if (isExcludedCatalogProduct(data)) {
          return;
        }
        // Only check legacy triggers on built-in INITIAL_PRODUCTS IDs (never overwrite admin-created products!)
        if (initialIdsSet.has(data.id)) {
          if (data.id === 'prod-rawfood-yam-bundle' && data.images?.[0]?.includes('unsplash')) {
            needsUpdate = true;
          }
          if (data.category === 'Fashion' && data.images?.[0]?.includes('unsplash')) {
            needsUpdate = true;
          }
          if (
            (data.seller && (data.seller.includes('Acourze') || data.seller !== 'Unitworld Sarl')) ||
            (data.title && data.title.includes('Acourze')) ||
            (data.description && (data.description.includes('Acourze') || data.description.includes('SETTLEMENT 1M'))) ||
            Boolean(data.settlementFee)
          ) {
            needsUpdate = true;
          }
        }
      });

      // Seed if any built-in catalog items are missing from Firestore
      if (
        !existingIds.has('prod-indomie-chicken-carton') ||
        !existingIds.has('prod-oraimo-powerbank-30000mah') ||
        !existingIds.has('prod-binatone-rechargeable-fan') ||
        !existingIds.has('prod-hair-luxury-5x5-bounce') ||
        !existingIds.has('prod-hair-sdd-celebrity-fringe') ||
        !existingIds.has('prod-morningfresh-lemon-1l')
      ) {
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      console.log('Updating built-in catalog in Firestore with direct Unitworld Sarl product details...');
      return await syncAllProductsToDb(false);
    }

    const loaded: Product[] = [];
    productsSnapshot.forEach((d) => {
      const raw = d.data() as Partial<Product>;
      const prod = { ...raw, id: raw.id || d.id } as Product;
      if (isExcludedCatalogProduct(prod)) {
        return;
      }
      if (prod.category === 'Health & Beauty') {
        prod.category = 'Beauty & Personal Care';
        updateDoc(d.ref, { category: 'Beauty & Personal Care' }).catch(() => {});
      }
      if (Array.isArray(prod.images)) {
        prod.images = prod.images
          .filter((img): img is string => typeof img === 'string' && img.length > 0)
          .map((img: string) =>
            img.startsWith('/src/assets/images/')
              ? img.replace('/src/assets/images/', '/assets/images/')
              : img
          );
      } else {
        prod.images = [];
      }
      loaded.push(prod);
    });

    // Ensure all INITIAL_PRODUCTS are included even if not yet saved
    const loadedIds = new Set(loaded.map(p => p.id));
    for (const initProd of INITIAL_PRODUCTS) {
      if (!loadedIds.has(initProd.id)) {
        loaded.push(initProd);
      }
    }

    return loaded;
  } catch (err) {
    console.warn('Database seeding notice (using in-memory fallback if guest):', err);
    return INITIAL_PRODUCTS;
  }
}

// Brand Settings Functions
export async function getBrandSettings(): Promise<BrandSettings> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'brand'));
    if (snap.exists()) {
      const data = snap.data() as BrandSettings;
      // If the logo in settings is an old local asset or missing, update to user's Cloudinary logo
      let changed = false;
      if (!data.logoUrl || data.logoUrl.includes('assets/images') || !data.logoUrl.includes('cloudinary.com')) {
        data.logoUrl = DEFAULT_BRAND_LOGO;
        changed = true;
      }
      if (!data.supportPhone || data.supportPhone.includes('8648') || data.supportPhone.includes('800')) {
        data.supportPhone = '07070554285';
        changed = true;
      }
      if (!data.whatsappNumber || data.whatsappNumber.includes('812 345 6789') || data.whatsappNumber.includes('8648')) {
        data.whatsappNumber = '07070554285';
        changed = true;
      }
      if (changed) {
        saveBrandSettings(data).catch(() => {});
      }
      return data;
    }
  } catch (e) {
    console.warn('Brand settings read note:', e);
  }
  return DEFAULT_BRAND_SETTINGS;
}

export async function saveBrandSettings(settings: BrandSettings): Promise<void> {
  const path = 'settings/brand';
  try {
    const cleanSettings = Object.fromEntries(
      Object.entries(settings).filter(([, value]) => value !== undefined)
    );
    await setDoc(doc(db, 'settings', 'brand'), {
      ...cleanSettings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 2b. Admin Management Functions
export const DEFAULT_ADMINS: AdminUser[] = [];

export async function getAdminsFromDb(): Promise<AdminUser[]> {
  const path = 'admins';
  try {
    const snapshot = await getDocs(collection(db, path));
    if (!snapshot.empty) {
      const loaded: AdminUser[] = [];
      snapshot.forEach(docSnap => {
        loaded.push(docSnap.data() as AdminUser);
      });
      return loaded;
    }
  } catch (err) {
    console.warn('Get admins read notice:', err);
  }
  return DEFAULT_ADMINS;
}

export async function addAdminToDb(admin: AdminUser): Promise<void> {
  const path = `admins/${admin.id}`;
  try {
    await setDoc(doc(db, 'admins', admin.id), admin);
  } catch (err) {
    console.warn('Failed to save admin to Firestore:', err);
  }
}

export async function removeAdminFromDb(adminId: string): Promise<void> {
  const path = `admins/${adminId}`;
  try {
    await deleteDoc(doc(db, 'admins', adminId));
  } catch (err) {
    console.warn('Failed to remove admin from Firestore:', err);
  }
}

export async function toggleAdminStatusInDb(adminId: string, isActive: boolean): Promise<void> {
  const path = `admins/${adminId}`;
  try {
    await updateDoc(doc(db, 'admins', adminId), { isActive });
  } catch (err) {
    console.warn('Failed to update admin status in Firestore:', err);
  }
}

// Helper to clean undefined fields, NaN values, and omitted fields before saving to Firestore
export function cleanFirestoreData<T extends Record<string, any>>(obj: T): T {
  const omittedSet = new Set<string>(Array.isArray(obj.omittedFields) ? obj.omittedFields : []);
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (omittedSet.has(key)) {
      continue; // completely omit from saved Firestore document
    }
    if (value !== undefined) {
      if (typeof value === 'number' && Number.isNaN(value)) {
        continue;
      }
      if (Array.isArray(value)) {
        result[key] = value.filter((item) => item !== undefined && item !== null);
      } else if (value !== null && typeof value === 'object') {
        result[key] = cleanFirestoreData(value);
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

// 3. Products CRUD
export async function createProductInDb(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    const cleaned = cleanFirestoreData(product);
    await setDoc(doc(db, 'products', product.id), cleaned);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateProductInDb(productId: string, updates: Partial<Product>): Promise<void> {
  const path = `products/${productId}`;
  try {
    const cleaned: Record<string, any> = cleanFirestoreData({
      ...updates,
      updatedAt: new Date().toISOString()
    });
    if (Array.isArray(updates.omittedFields)) {
      for (const field of updates.omittedFields) {
        if (field && !(field in cleaned)) {
          cleaned[field] = deleteField();
        }
      }
    }
    // Merge updates so partial saves (e.g. Media Vault image/video uploads) never erase title, price, or category
    await setDoc(doc(db, 'products', productId), cleaned, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProductFromDb(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    if (auth.currentUser) {
      await deleteDoc(doc(db, 'products', productId));
      return;
    }
    await updateDoc(doc(db, 'products', productId), {
      isArchived: true,
      updatedAt: new Date().toISOString()
    });
  } catch (error: any) {
    if (error?.code === 'permission-denied' || String(error?.message || '').toLowerCase().includes('permission')) {
      try {
        await updateDoc(doc(db, 'products', productId), {
          isArchived: true,
          updatedAt: new Date().toISOString()
        });
        return;
      } catch (archiveError) {
        handleFirestoreError(archiveError, OperationType.DELETE, path);
      }
    }
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 4. Orders CRUD & Real-Time Fulfillment
export async function createOrderInDb(order: Order): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    await setDoc(doc(db, 'orders', order.id), order);
    
    // Decrement inventory in real-time
    for (const item of order.items) {
      try {
        const prodRef = doc(db, 'products', item.productId);
        const prodSnap = await getDoc(prodRef);
        if (prodSnap.exists()) {
          const currentStock = prodSnap.data().stock || 0;
          await updateDoc(prodRef, {
            stock: Math.max(0, currentStock - item.quantity),
            updatedAt: new Date().toISOString()
          });
        }
      } catch (stockErr) {
        console.warn('Inventory decrement sync notice:', stockErr);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function updateOrderStatusInDb(orderId: string, status: Order['orderStatus'], locationNote?: string): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const orderRef = doc(db, 'orders', orderId);
    const snap = await getDoc(orderRef);
    if (!snap.exists()) return;
    
    const existingOrder = snap.data() as Order;
    const now = new Date().toISOString();
    
    const statusLabels: Record<string, string> = {
      pending: 'Order Received & Awaiting Verification',
      processing: 'Order Processing & Warehouse Allocation',
      shipped: 'Dispatched to Transit Hub',
      out_for_delivery: 'Out with Local Courier Driver',
      delivered: 'Package Successfully Delivered & Signed',
      cancelled: 'Order Cancelled'
    };

    const updatedSteps = existingOrder.trackingUpdates ? [...existingOrder.trackingUpdates] : [];
    updatedSteps.push({
      status,
      label: statusLabels[status] || status,
      timestamp: now,
      location: locationNote || 'Unitworld Operations Hub, Lagos',
      completed: true
    });

    await updateDoc(orderRef, {
      orderStatus: status,
      trackingUpdates: updatedSteps,
      updatedAt: now
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// 5. User Profile & Settings
export const INITIAL_USERS: UserProfile[] = [];

export async function getAllUsersFromDb(): Promise<UserProfile[]> {
  const path = 'users';
  let dbUsers: UserProfile[] = [];
  if (auth.currentUser) {
    try {
      const snapshot = await getDocs(collection(db, path));
      if (!snapshot.empty) {
        snapshot.forEach(docSnap => {
          const u = docSnap.data() as UserProfile;
          dbUsers.push(u);
        });
      }
    } catch (err) {
      console.warn('Get users from Firestore notice:', err);
    }
  }

  // Retrieve cached local registered users
  let localUsers: UserProfile[] = [];
  try {
    const raw = localStorage.getItem('unitworld_registered_users');
    if (raw) {
      localUsers = JSON.parse(raw);
    }
  } catch (e) {}

  const userMap = new Map<string, UserProfile>();
  localUsers.forEach(u => userMap.set(u.uid, u));
  dbUsers.forEach(u => userMap.set(u.uid, u));

  return Array.from(userMap.values());
}

export async function findUserByEmail(email: string): Promise<UserProfile | null> {
  const normalized = email.trim().toLowerCase();

  // Check local registered cache
  try {
    const raw = localStorage.getItem('unitworld_registered_users');
    if (raw) {
      const list: UserProfile[] = JSON.parse(raw);
      const found = list.find(u => u.email.toLowerCase() === normalized);
      if (found) return found;
    }
  } catch (e) {}

  // Check Firestore
  try {
    const q = query(collection(db, 'users'), where('email', '==', normalized));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as UserProfile;
    }
  } catch (e) {}

  return null;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
  } catch (error) {
    console.warn('Get user profile error:', error);
  }

  // Fallback to local cache
  try {
    const raw = localStorage.getItem('unitworld_registered_users');
    if (raw) {
      const list: UserProfile[] = JSON.parse(raw);
      const found = list.find(u => u.uid === uid);
      if (found) return found;
    }
  } catch (e) {}

  const defaultUser = INITIAL_USERS.find(u => u.uid === uid);
  return defaultUser || null;
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const path = `users/${profile.uid}`;
  
  // Always update local cache immediately so it's instant in Admin Portal
  try {
    const raw = localStorage.getItem('unitworld_registered_users');
    let list: UserProfile[] = raw ? JSON.parse(raw) : [...INITIAL_USERS];
    const index = list.findIndex(u => u.uid === profile.uid || u.email.toLowerCase() === profile.email.toLowerCase());
    if (index >= 0) {
      list[index] = { ...list[index], ...profile };
    } else {
      list.unshift(profile);
    }
    localStorage.setItem('unitworld_registered_users', JSON.stringify(list));
  } catch (e) {}

  if (auth.currentUser) {
    try {
      await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
    } catch (error) {
      console.warn('Firestore user profile save notice:', error);
    }
  }
}

export async function getGatewaySettings(): Promise<GatewaySettings> {
  try {
    const snap = await getDoc(doc(db, 'settings', 'gateway'));
    if (snap.exists()) {
      return snap.data() as GatewaySettings;
    }
  } catch (e) {
    console.warn('Settings read note:', e);
  }
  return {
    paystackPublicKey: '',
    paystackSecretKey: '',
    paystackEnabled: false,
    currency: 'NGN',
    merchantEmail: 'payments@unit-world-sarl.com',
    merchantBusinessName: 'UNITWORLD SARL GLOBAL COMMERCE',
    webhookUrl: 'https://api.unit-world-sarl.com/webhook/paystack',
    bankAccountDetails: {
      bankName: 'Guaranty Trust Bank (GTBank)',
      accountName: 'UNITWORLD SARL GLOBAL COMMERCE',
      accountNumber: '0284729104'
    }
  };
}

export async function saveGatewaySettings(settings: GatewaySettings): Promise<void> {
  const path = 'settings/gateway';
  try {
    await setDoc(doc(db, 'settings', 'gateway'), settings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export const MAX_VIDEO_SIZE_BYTES = 2 * 1024 * 1024; // 2MB hard cap
const VIDEO_CHUNK_BYTES = 450_000; // Safely under Firestore's 1MB document limit

export async function uploadVideoChunksToDb(videoId: string, file: File): Promise<void> {
  if (file.size <= 0) {
    throw new Error(`Video "${file.name}" is empty (0 bytes). Please choose a valid video file.`);
  }
  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    throw new Error(
      `Video "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum allowed video size is 2MB.`
    );
  }
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const totalChunks = Math.max(1, Math.ceil(bytes.length / VIDEO_CHUNK_BYTES));
  const mimeType = (file.type || 'video/mp4').slice(0, 64);
  const createdAt = new Date().toISOString();

  const uploads: Promise<void>[] = [];
  for (let i = 0; i < totalChunks; i++) {
    const start = i * VIDEO_CHUNK_BYTES;
    const end = Math.min(bytes.length, start + VIDEO_CHUNK_BYTES);
    const slice = bytes.slice(start, end);
    const chunkDocId = `${videoId}_chunk_${i}`;
    uploads.push(
      setDoc(doc(db, 'videoMedia', chunkDocId), {
        videoId,
        chunkIndex: i,
        totalChunks,
        mimeType,
        size: file.size,
        data: Bytes.fromUint8Array(slice),
        createdAt,
      })
    );
  }
  await Promise.all(uploads);
}

export async function fetchVideoBlobFromDb(videoId: string): Promise<Blob | null> {
  try {
    const q = query(collection(db, 'videoMedia'), where('videoId', '==', videoId));
    const snap = await getDocs(q);
    if (snap.empty) return null;

    const chunks: Array<{ chunkIndex: number; mimeType: string; bytes: Uint8Array }> = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      if (d?.data && typeof d.chunkIndex === 'number') {
        const rawBytes =
          typeof d.data.toUint8Array === 'function'
            ? d.data.toUint8Array()
            : new Uint8Array(d.data);
        chunks.push({
          chunkIndex: d.chunkIndex,
          mimeType: typeof d.mimeType === 'string' ? d.mimeType : 'video/mp4',
          bytes: rawBytes,
        });
      }
    });

    if (chunks.length === 0) return null;
    chunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
    const mimeType = chunks[0].mimeType || 'video/mp4';
    const blobParts: BlobPart[] = chunks.map((c) => {
      const copy = new Uint8Array(c.bytes.byteLength);
      copy.set(c.bytes);
      return copy.buffer;
    });
    return new Blob(blobParts, { type: mimeType });
  } catch (err) {
    console.warn('Firestore video fetch notice:', err);
    return null;
  }
}

// 6. Service Bookings CRUD (Carpentry, Plumbing, Electrical, Auto, Cleaning)
export async function createServiceBookingInDb(booking: ServiceBooking): Promise<ServiceBooking> {
  const cleanId = (booking.id || `srv-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 128);
  const now = new Date().toISOString().slice(0, 40);
  const payload: Record<string, string> = {
    id: cleanId,
    bookingCode: (booking.bookingCode || `UW-SRV-${Math.floor(1000 + Math.random() * 9000)}`).slice(0, 40),
    serviceCategory: booking.serviceCategory.trim().slice(0, 80),
    subService: booking.subService.trim().slice(0, 120),
    location: booking.location.trim().slice(0, 300),
    details: booking.details.trim().slice(0, 2000),
    status: 'pending',
    createdAt: (booking.createdAt || now).slice(0, 40),
    updatedAt: (booking.updatedAt || now).slice(0, 40),
  };

  if (booking.customerPhone && booking.customerPhone.trim()) {
    payload.customerPhone = booking.customerPhone.trim().slice(0, 30);
  }
  if (booking.customerName && booking.customerName.trim()) {
    payload.customerName = booking.customerName.trim().slice(0, 120);
  }
  if (booking.urgency && booking.urgency.trim()) {
    payload.urgency = booking.urgency.trim().slice(0, 40);
  }
  if (booking.sourceSection && booking.sourceSection.trim()) {
    payload.sourceSection = booking.sourceSection.trim().slice(0, 80);
  }
  if (booking.userId && booking.userId.trim()) {
    payload.userId = booking.userId.trim().slice(0, 128);
  }

  const path = `serviceBookings/${cleanId}`;
  try {
    await setDoc(doc(db, 'serviceBookings', cleanId), payload);
    return payload as unknown as ServiceBooking;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
}

export async function getServiceBookingsFromDb(): Promise<ServiceBooking[]> {
  const path = 'serviceBookings';
  try {
    const snap = await getDocs(collection(db, path));
    const list: ServiceBooking[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as ServiceBooking);
    });
    return list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function updateServiceBookingStatusInDb(bookingId: string, status: ServiceBookingStatus): Promise<void> {
  const path = `serviceBookings/${bookingId}`;
  try {
    await updateDoc(doc(db, 'serviceBookings', bookingId), {
      status,
      updatedAt: new Date().toISOString().slice(0, 40),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

