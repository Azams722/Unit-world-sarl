import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
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
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { Product, Order, UserProfile, GatewaySettings, BrandSettings, AppNotification, AdminUser } from './types';
import { INITIAL_PRODUCTS } from './data/initialProducts';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const DEFAULT_BRAND_LOGO = 'https://res.cloudinary.com/dgc6ootad/image/upload/v1790464730/Unitworld_Trustworthy_Ecommerce_Marketplace_rmlqq8.png';

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  logoUrl: DEFAULT_BRAND_LOGO,
  brandName: 'UNITWORLD SARL',
  tagline: 'OFFICIAL DIRECT STORE.',
  supportPhone: '+234 800 8648 9675',
  supportEmail: 'contact@unit-world-sarl.com',
  whatsappNumber: '+234 812 345 6789',
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

// 2. Database Auto-Seeder & Product Sync: Ensures products come directly from Firebase database
export async function syncAllProductsToDb(overwriteExisting = true): Promise<Product[]> {
  const path = 'products';
  try {
    console.log('Syncing all verified products and real images to Firestore database...');
    // Delete any old medical/dettol product from Firestore
    try {
      await deleteDoc(doc(db, 'products', 'prod-dettol-antiseptic-1l'));
    } catch {}

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

    return INITIAL_PRODUCTS;
  } catch (err) {
    console.warn('Sync to database notice:', err);
    return INITIAL_PRODUCTS;
  }
}

export async function seedProductsIfEmpty(): Promise<Product[]> {
  const path = 'products';
  try {
    const productsSnapshot = await getDocs(collection(db, path));
    
    // Check if hair products or updated products exist in Firestore
    let needsUpdate = false;
    if (productsSnapshot.empty) {
      needsUpdate = true;
    } else {
      const existingIds = new Set<string>();
      productsSnapshot.forEach((d) => {
        const data = d.data() as Product;
        existingIds.add(data.id);
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
        // Purge old medical or Dettol items from Firestore
        if (data.id === 'prod-dettol-antiseptic-1l' || data.sku?.includes('HEALTH')) {
          needsUpdate = true;
          deleteDoc(d.ref).catch(() => {});
        }
      });

      // If new catalog essentials or hair products are missing from DB, trigger sync
      if (
        !existingIds.has('prod-indomie-chicken-carton') ||
        !existingIds.has('prod-oraimo-powerbank-30000mah') ||
        !existingIds.has('prod-binatone-rechargeable-fan') ||
        !existingIds.has('prod-hair-luxury-5x5-bounce') ||
        !existingIds.has('prod-hair-sdd-celebrity-fringe') ||
        !existingIds.has('prod-morningfresh-lemon-1l') ||
        existingIds.has('prod-dettol-antiseptic-1l')
      ) {
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      console.log('Updating catalog in Firestore with direct Unitworld Sarl product details...');
      return await syncAllProductsToDb(false);
    }

    const loaded: Product[] = [];
    productsSnapshot.forEach((d) => {
      const prod = d.data() as Product;
      // Filter out any medical/health items
      if (prod.id === 'prod-dettol-antiseptic-1l' || prod.sku?.includes('HEALTH') || prod.tags?.includes('First Aid')) {
        deleteDoc(d.ref).catch(() => {});
        return;
      }
      if (prod.category === 'Health & Beauty') {
        prod.category = 'Beauty & Personal Care';
        updateDoc(d.ref, { category: 'Beauty & Personal Care' }).catch(() => {});
      }
      if (prod.images) {
        prod.images = prod.images.map((img: string) =>
          typeof img === 'string' && img.startsWith('/src/assets/images/')
            ? img.replace('/src/assets/images/', '/assets/images/')
            : img
        );
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
      if (!data.logoUrl || data.logoUrl.includes('assets/images') || !data.logoUrl.includes('cloudinary.com')) {
        data.logoUrl = DEFAULT_BRAND_LOGO;
        saveBrandSettings({ ...data, logoUrl: DEFAULT_BRAND_LOGO }).catch(() => {});
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
    await setDoc(doc(db, 'settings', 'brand'), {
      ...settings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 2b. Admin Management Functions
export const DEFAULT_ADMINS: AdminUser[] = [
  {
    id: 'admin-super-1',
    email: 'tobi@acourze.com',
    name: 'Tobi',
    role: 'super_admin',
    department: 'Executive Operations',
    addedAt: '2025-01-01T00:00:00.000Z',
    isActive: true,
  }
];

export async function getAdminsFromDb(): Promise<AdminUser[]> {
  const path = 'admins';
  try {
    const snapshot = await getDocs(collection(db, path));
    if (!snapshot.empty) {
      const loaded: AdminUser[] = [];
      snapshot.forEach(docSnap => {
        const adm = docSnap.data() as AdminUser;
        if (adm.email?.toLowerCase() !== 'tobi@acourze.com') {
          deleteDoc(docSnap.ref).catch(() => {});
        } else {
          loaded.push(adm);
        }
      });
      if (loaded.length > 0) return loaded;
    }
  } catch (err) {
    console.warn('Get admins read notice (using defaults if permission restricted):', err);
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
    const cleaned = cleanFirestoreData({
      ...updates,
      updatedAt: new Date().toISOString()
    });
    // setDoc replaces document so omitted fields are truly removed from Firestore
    await setDoc(doc(db, 'products', productId), cleaned);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProductFromDb(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
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
export const INITIAL_USERS: UserProfile[] = [
  {
    uid: 'user-tobi-admin',
    email: 'tobi@acourze.com',
    displayName: 'Tobi',
    phone: '+234 800 8648 967',
    role: 'admin',
    mfaEnabled: true,
    status: 'active',
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Tobi',
        phone: '+234 800 8648 967',
        street: '14B Admiralty Way, Lekki Phase 1',
        city: 'Lagos',
        state: 'Lagos State',
        isDefault: true
      }
    ],
    preferences: {
      currency: 'NGN',
      emailNotifications: true,
      smsNotifications: true,
      whatsappAlerts: true,
    },
    createdAt: '2025-01-10T08:30:00.000Z',
    lastLoginAt: '2026-10-22T08:00:00.000Z'
  }
];

export async function getAllUsersFromDb(): Promise<UserProfile[]> {
  const path = 'users';
  let dbUsers: UserProfile[] = [];
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

  // Retrieve cached local registered users
  let localUsers: UserProfile[] = [];
  try {
    const raw = localStorage.getItem('unitworld_registered_users');
    if (raw) {
      localUsers = JSON.parse(raw);
    }
  } catch (e) {}

  const userMap = new Map<string, UserProfile>();
  INITIAL_USERS.forEach(u => userMap.set(u.uid, u));
  localUsers.forEach(u => userMap.set(u.uid, u));
  dbUsers.forEach(u => userMap.set(u.uid, u));

  return Array.from(userMap.values());
}

export async function findUserByEmail(email: string): Promise<UserProfile | null> {
  const normalized = email.trim().toLowerCase();
  if (normalized === 'tobi@acourze.com') {
    return INITIAL_USERS[0];
  }

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

  try {
    await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
  } catch (error) {
    console.warn('Firestore user profile save notice:', error);
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
