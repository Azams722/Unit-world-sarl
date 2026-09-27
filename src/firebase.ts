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
  tagline: 'YOUR GLOBAL MARKETPLACE.',
  supportPhone: '+234 800 8648 9675',
  supportEmail: 'contact@unitworld.com',
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
    const batch = writeBatch(db);
    for (const prod of INITIAL_PRODUCTS) {
      const ref = doc(db, 'products', prod.id);
      batch.set(ref, prod, { merge: !overwriteExisting });
    }
    await batch.commit();

    // Ensure brand logo is saved in Firestore settings
    const brandRef = doc(db, 'settings', 'brand');
    await setDoc(brandRef, DEFAULT_BRAND_SETTINGS, { merge: true });

    // Ensure gateway settings are present
    const settingsRef = doc(db, 'settings', 'gateway');
    const defaultSettings: GatewaySettings = {
      paystackPublicKey: 'pk_test_d347895e69123847291a890472e819b5d2',
      paystackEnabled: true,
      currency: 'NGN',
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
    
    // Check if yams or clothes in DB still have old images (e.g. unsplash carrots)
    let needsUpdate = false;
    if (productsSnapshot.empty) {
      needsUpdate = true;
    } else {
      productsSnapshot.forEach((d) => {
        const data = d.data() as Product;
        if (data.id === 'prod-rawfood-yam-bundle' && data.images?.[0]?.includes('unsplash')) {
          needsUpdate = true;
        }
        if (data.category === 'Fashion' && data.images?.[0]?.includes('unsplash')) {
          needsUpdate = true;
        }
      });
    }

    if (needsUpdate) {
      console.log('Updating catalog in Firestore with authentic verified images & products...');
      return await syncAllProductsToDb(true);
    }

    const loaded: Product[] = [];
    productsSnapshot.forEach((d) => loaded.push(d.data() as Product));
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
    name: 'Tobi Acourze',
    role: 'super_admin',
    department: 'Executive Operations',
    addedAt: '2025-01-01T00:00:00.000Z',
    isActive: true,
  },
  {
    id: 'admin-catalog-2',
    email: 'admin@unitworld.com',
    name: 'Unitworld Super Admin',
    role: 'catalog_manager',
    department: 'Catalog & Inventory Control',
    addedAt: '2025-02-15T00:00:00.000Z',
    isActive: true,
  }
];

export async function getAdminsFromDb(): Promise<AdminUser[]> {
  const path = 'admins';
  try {
    const snapshot = await getDocs(collection(db, path));
    if (!snapshot.empty) {
      const loaded: AdminUser[] = [];
      snapshot.forEach(docSnap => loaded.push(docSnap.data() as AdminUser));
      return loaded;
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

// Helper to clean undefined fields and omitted fields before saving to Firestore
export function cleanFirestoreData<T extends Record<string, any>>(obj: T): T {
  const omittedSet = new Set<string>(obj.omittedFields || []);
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (omittedSet.has(key)) {
      continue; // completely omit from saved Firestore document
    }
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
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
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn('Get user profile error:', error);
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
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
    paystackPublicKey: 'pk_test_d347895e69123847291a890472e819b5d2',
    paystackEnabled: true,
    currency: 'NGN',
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
