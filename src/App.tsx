import React, { useState, useEffect, useRef } from 'react';
import { 
  Car, 
  Shirt, 
  ShoppingBag, 
  Smartphone, 
  Tv, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Award, 
  ChevronRight, 
  MessageSquareQuote, 
  Flame, 
  CheckCircle2, 
  Filter, 
  ArrowUpDown,
  Laptop,
  Wrench
} from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { 
  auth, 
  db, 
  testConnection, 
  seedProductsIfEmpty, 
  syncAllProductsToDb,
  createProductInDb, 
  updateProductInDb, 
  deleteProductFromDb, 
  createOrderInDb, 
  updateOrderStatusInDb, 
  getGatewaySettings, 
  saveGatewaySettings, 
  getBrandSettings,
  saveBrandSettings,
  DEFAULT_BRAND_SETTINGS,
  saveUserProfile, 
  getUserProfile,
  getAllUsersFromDb,
  INITIAL_USERS,
  getAdminsFromDb,
  addAdminToDb,
  removeAdminFromDb,
  toggleAdminStatusInDb,
  DEFAULT_ADMINS,
  isAuthorizedAdminEmail,
  saveActiveSession,
  loadActiveSession,
  createServiceBookingInDb,
  updateServiceBookingStatusInDb
} from './firebase';
import { Product, Order, OrderItem, UserProfile, GatewaySettings, BrandSettings, AppNotification, OrderStatus, AdminUser, ServiceBooking, ServiceBookingStatus } from './types';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { NotificationToast } from './components/common/NotificationToast';
import { ProductCard } from './components/shop/ProductCard';
import { ProductDetailModal } from './components/shop/ProductDetailModal';
import { ProductPage } from './components/shop/ProductPage';
import { CartDrawer } from './components/shop/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/orders/OrderTrackingModal';
import { AuthModal } from './components/auth/AuthModal';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { AdminPortal } from './components/admin/AdminPortal';
import { RefundPolicyModal } from './components/common/RefundPolicyModal';
import { MediaViewer } from './components/common/MediaViewer';
import { ServicesPage } from './components/services/ServicesPage';
import { QuickServiceStrip } from './components/services/QuickServiceStrip';
import { NewProductsHeroCarousel } from './components/shop/NewProductsHeroCarousel';
import { formatCurrency, generateProductSlug } from './utils/formatters';
import { CATEGORIES, INITIAL_PRODUCTS } from './data/initialProducts';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => loadActiveSession());
  const [gatewaySettings, setGatewaySettings] = useState<GatewaySettings>({
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
  });

  const [brandSettings, setBrandSettings] = useState<BrandSettings>(DEFAULT_BRAND_SETTINGS);

  const [selectedCategory, setSelectedCategory] = useState<string>('All Departments');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under100k' | 'under10m' | 'above10m'>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'rating'>('featured');

  // Modals & Navigation
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productPageProduct, setProductPageProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRefundPolicyOpen, setIsRefundPolicyOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [servicesCategoryId, setServicesCategoryId] = useState<string | undefined>(undefined);
  const [serviceBookings, setServiceBookings] = useState<ServiceBooking[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>(DEFAULT_ADMINS);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);

  // URL Navigation helper to sync address bar without page reload
  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
  };

  const handleSelectProduct = (product: Product) => {
    const slug = generateProductSlug(product);
    setIsServicesOpen(false);
    setProductPageProduct(product);
    setSelectedProduct(null);
    navigateTo(`/product/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenServicesPage = (categoryId?: string) => {
    setProductPageProduct(null);
    setSelectedProduct(null);
    setServicesCategoryId(categoryId);
    setIsServicesOpen(true);
    setMobileTab('services');
    navigateTo(categoryId ? `/services/${categoryId}` : '/services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromProductPage = () => {
    setProductPageProduct(null);
    setIsServicesOpen(false);
    setMobileTab('home');
    navigateTo('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = () => {
    setIsAuthOpen(true);
    navigateTo('/auth');
  };

  const closeAuthModal = () => {
    setIsAuthOpen(false);
    const path = window.location.pathname.toLowerCase();
    if (path === '/auth' || path === '/login' || path === '/signup' || path === '/register') {
      navigateTo('/');
    }
  };

  const openDashboardModal = () => {
    setIsDashboardOpen(true);
    navigateTo('/dashboard');
  };

  const closeDashboardModal = () => {
    setIsDashboardOpen(false);
    const path = window.location.pathname.toLowerCase();
    if (path === '/dashboard' || path === '/account' || path === '/profile') {
      navigateTo('/');
    }
  };

  const openAdminModal = () => {
    setIsAdminOpen(true);
    navigateTo('/admin');
  };

  const closeAdminModal = () => {
    setIsAdminOpen(false);
    const path = window.location.pathname.toLowerCase();
    if (path === '/admin' || path === '/portal') {
      navigateTo('/');
    }
  };

  const openTrackingModal = () => {
    setIsTrackingOpen(true);
    navigateTo('/tracking');
  };

  const closeTrackingModal = () => {
    setIsTrackingOpen(false);
    const path = window.location.pathname.toLowerCase();
    if (path === '/tracking' || path === '/track' || path === '/orders') {
      navigateTo('/');
    }
  };

  const openRefundPolicyModal = () => {
    setIsRefundPolicyOpen(true);
    navigateTo('/refund-policy');
  };

  const closeRefundPolicyModal = () => {
    setIsRefundPolicyOpen(false);
    const path = window.location.pathname.toLowerCase();
    if (path === '/refund-policy' || path === '/refund-and-cancellation-policy' || path === '/returns') {
      navigateTo('/');
    }
  };

  const productsRef = useRef<Product[]>(products);
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  // Sync URL Path on Initial Load and Browser Back/Forward navigation (Vercel SPA routing)
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      if (path.startsWith('/product/') || path.startsWith('/item/')) {
        const slug = path.replace(/^\/(product|item)\//, '').trim();
        const curProducts = productsRef.current;
        if (slug && curProducts.length > 0) {
          const match = curProducts.find(
            (p) =>
              (p.slug && p.slug.toLowerCase() === slug) ||
              generateProductSlug(p).toLowerCase() === slug ||
              p.id.toLowerCase() === slug
          );
          if (match) {
            setProductPageProduct(match);
            setSelectedProduct(null);
            return;
          }
        }
      } else {
        setProductPageProduct(null);
      }

      if (path === '/services' || path.startsWith('/services/')) {
        const subCat = path.replace(/^\/services\/?/, '').trim();
        setServicesCategoryId(subCat || undefined);
        setIsServicesOpen(true);
        setMobileTab('services');
      } else {
        setIsServicesOpen(false);
      }

      if (path === '/auth' || path === '/login' || path === '/signup' || path === '/register') {
        setIsAuthOpen(true);
      } else if (path === '/dashboard' || path === '/account' || path === '/profile') {
        setIsDashboardOpen(true);
      } else if (path === '/admin' || path === '/portal') {
        setIsAdminOpen(true);
      } else if (path === '/tracking' || path === '/track' || path === '/orders') {
        setIsTrackingOpen(true);
      } else if (path === '/cart') {
        setIsCartOpen(true);
      } else if (path === '/checkout') {
        setIsCheckoutOpen(true);
      } else if (path === '/refund-policy' || path === '/refund-and-cancellation-policy' || path === '/returns') {
        setIsRefundPolicyOpen(true);
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  // Hydrate productPageProduct when products are loaded from database
  useEffect(() => {
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    if ((path.startsWith('/product/') || path.startsWith('/item/')) && products.length > 0) {
      const slug = path.replace(/^\/(product|item)\//, '').trim();
      const match = products.find(
        (p) =>
          (p.slug && p.slug.toLowerCase() === slug) ||
          generateProductSlug(p).toLowerCase() === slug ||
          p.id.toLowerCase() === slug
      );
      if (match) {
        setProductPageProduct(match);
      }
    }
  }, [products]);

  // Mobile Bottom Tab
  const [mobileTab, setMobileTab] = useState<'home' | 'categories' | 'services' | 'cart' | 'account'>('home');

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  // 1. Initial Connection and Firestore Seeding
  useEffect(() => {
    testConnection();

    // Ensure database contains products and real images without overwriting newly created items
    seedProductsIfEmpty().then((initial) => {
      if (initial && initial.length > 0) {
        setProducts((prev) => {
          const merged = new Map<string, Product>();
          initial.forEach((p) => merged.set(p.id, p));
          prev.forEach((p) => {
            const existing = merged.get(p.id);
            if (!existing || new Date(p.updatedAt || 0).getTime() >= new Date(existing.updatedAt || 0).getTime()) {
              merged.set(p.id, p);
            }
          });
          return Array.from(merged.values());
        });
      }
    });

    getGatewaySettings().then((settings) => {
      if (settings) setGatewaySettings(settings);
    });

    getBrandSettings().then((brand) => {
      if (brand) setBrandSettings(brand);
    });

    // Global keyboard shortcut (Ctrl+Shift+A) for staff admin portal
    const handleKeyShortcut = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyShortcut);

    // Real-time listener for products
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      if (!snapshot.empty) {
        const liveProducts: Product[] = [];
        snapshot.forEach((d) => {
          const raw = d.data() as Partial<Product>;
          const prodId = typeof raw.id === 'string' && raw.id.trim() ? raw.id : d.id;
          if (
            !raw ||
            raw.isArchived ||
            typeof raw.title !== 'string' ||
            !raw.title.trim() ||
            typeof raw.category !== 'string' ||
            !raw.category.trim() ||
            typeof raw.price !== 'number' ||
            !Number.isFinite(raw.price) ||
            prodId === 'prod-dettol-antiseptic-1l' ||
            prodId === 'prod-jumia-dettol-antiseptic-1l' ||
            prodId.startsWith('prod-jumia-') ||
            (typeof raw.sku === 'string' && raw.sku.includes('HEALTH')) ||
            (Array.isArray(raw.tags) && raw.tags.includes('First Aid'))
          ) {
            return;
          }
          const normalizedImages = Array.isArray(raw.images)
            ? raw.images
                .filter((img): img is string => typeof img === 'string' && img.length > 0)
                .map((img: string) =>
                  img.startsWith('/src/assets/images/')
                    ? img.replace('/src/assets/images/', '/assets/images/')
                    : img
                )
            : [];
          liveProducts.push({
            ...raw,
            id: prodId,
            images: normalizedImages,
            videos: Array.isArray(raw.videos)
              ? raw.videos.filter((v): v is string => typeof v === 'string' && v.length > 0)
              : undefined,
            tags: Array.isArray(raw.tags)
              ? raw.tags.filter((t): t is string => typeof t === 'string')
              : undefined,
          } as Product);
        });
        if (liveProducts.length > 0) {
          setProducts(liveProducts);
        }
      }
    }, (err) => {
      console.warn('Real-time products snapshot notice:', err);
    });

    // Real-time listener for orders
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      if (!snapshot.empty) {
        const liveOrders: Order[] = [];
        snapshot.forEach((d) => liveOrders.push(d.data() as Order));
        liveOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(liveOrders);
      }
    }, (err) => {
      console.warn('Real-time orders snapshot notice:', err);
    });

    // Real-time listener for service bookings
    const unsubBookings = onSnapshot(collection(db, 'serviceBookings'), (snapshot) => {
      const liveBookings: ServiceBooking[] = [];
      snapshot.forEach((d) => liveBookings.push(d.data() as ServiceBooking));
      liveBookings.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setServiceBookings(liveBookings);
    }, (err) => {
      console.warn('Service bookings snapshot notice:', err);
    });

    // Auth state listener
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAdmin = await isAuthorizedAdminEmail(user.email);
        const profile = await getUserProfile(user.uid);
        if (profile) {
          const synced: UserProfile = { ...profile, role: isAdmin ? 'admin' : profile.role || 'customer' };
          setCurrentUser(synced);
          saveActiveSession(synced);
          setUsers((prev) => {
            const exists = prev.some((u) => u.uid === synced.uid);
            return exists ? prev.map((u) => (u.uid === synced.uid ? synced : u)) : [synced, ...prev];
          });
        } else {
          const userProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || user.email?.split('@')[0] || 'Customer',
            role: isAdmin ? 'admin' : 'customer',
            mfaEnabled: false,
            preferences: {
              currency: 'NGN',
              emailNotifications: true,
              smsNotifications: true,
              whatsappAlerts: true,
            },
            addresses: [],
            createdAt: new Date().toISOString(),
          };
          setCurrentUser(userProfile);
          saveActiveSession(userProfile);
          saveUserProfile(userProfile);
          setUsers((prev) => [userProfile, ...prev.filter((u) => u.uid !== userProfile.uid)]);
        }
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKeyShortcut);
      unsubProducts();
      unsubOrders();
      unsubBookings();
      unsubAuth();
    };
  }, []);

  // Load admin & registered user directories only when signed in as an administrator
  useEffect(() => {
    if (currentUser?.role === 'admin') {
      getAdminsFromDb().then((loaded) => {
        if (loaded && loaded.length > 0) {
          setAdmins(loaded);
        }
      });
      getAllUsersFromDb().then((loadedUsers) => {
        if (loadedUsers && loadedUsers.length > 0) {
          setUsers(loadedUsers);
        }
      });
    } else {
      setAdmins([]);
      setUsers([]);
    }
  }, [currentUser?.role]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          title: product.title,
          price: product.price,
          quantity,
          image: product.images[0],
          category: product.category,
          condition: product.condition,
        },
      ];
    });

    // Trigger toast notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser?.uid || 'guest',
      title: 'Item Added to Cart',
      message: `${quantity}x ${product.title} added to your shopping cart.`,
      type: 'order',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
    setActiveToast(notif);
  };

  const handleInstantBuy = (product: Product) => {
    handleAddToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleOrderCompleted = async (newOrder: Order) => {
    await createOrderInDb(newOrder);
    setCart([]);
    setOrders((prev) => [newOrder, ...prev]);

    // Push notification
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId: newOrder.userId,
      title: 'Order Placed Successfully!',
      message: `Order #${newOrder.orderNumber} is now assigned to the warehouse dispatch team.`,
      type: 'order',
      read: false,
      createdAt: new Date().toISOString(),
      linkId: newOrder.id,
    };
    setNotifications((prev) => [notif, ...prev]);
    setActiveToast(notif);
  };

  const handleSignOut = async () => {
    saveActiveSession(null);
    setCurrentUser(null);
    try {
      await signOut(auth);
    } catch {
      // Ignore if signed in via session store only
    }
  };

  const handleDirectDm = (product: Product) => {
    const text = encodeURIComponent(
      `Hello Unitworld Sarl (07070554285), I am interested in: ${product.title}\nPrice: ${formatCurrency(product.price)}\nSKU: ${product.sku}\nPlease let me know inspection and acquisition details.`
    );
    const link = document.createElement('a');
    link.href = `https://wa.me/2347070554285?text=${text}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  const handleSubmitServiceBooking = async (booking: ServiceBooking): Promise<ServiceBooking> => {
    const saved = await createServiceBookingInDb(booking);
    setServiceBookings((prev) => [saved, ...prev.filter((b) => b.id !== saved.id)]);

    const notif: AppNotification = {
      id: `notif-srv-${Date.now()}`,
      userId: booking.userId || currentUser?.uid || 'guest',
      title: `Service Booked (${saved.bookingCode})`,
      message: `${saved.serviceCategory} requested at ${saved.location}. Hotline: 07070554285.`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [notif, ...prev]);
    setActiveToast(notif);
    return saved;
  };

  // Filter & Search Logic
  const filteredProducts = products.filter((p) => {
    const cat = typeof p.category === 'string' ? p.category : '';
    const title = typeof p.title === 'string' ? p.title : '';
    const desc = typeof p.description === 'string' ? p.description : '';
    const sku = typeof p.sku === 'string' ? p.sku : '';
    const tags = Array.isArray(p.tags) ? p.tags : [];

    const matchesCategory =
      selectedCategory === 'All Departments' ||
      cat.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === 'Hair & Luxury Wigs' && (cat === 'Hair & Luxury Wigs' || tags.includes('Human Hair Wig'))) ||
      (selectedCategory === 'Beauty & Personal Care' && (cat === 'Hair & Luxury Wigs' || cat === 'Beauty & Personal Care'));

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      title.toLowerCase().includes(q) ||
      desc.toLowerCase().includes(q) ||
      cat.toLowerCase().includes(q) ||
      tags.some((t) => typeof t === 'string' && t.toLowerCase().includes(q)) ||
      sku.toLowerCase().includes(q);

    const matchesCondition =
      conditionFilter === 'all' || p.condition === conditionFilter;

    let matchesPrice = true;
    if (priceFilter === 'under100k') matchesPrice = p.price < 100000;
    else if (priceFilter === 'under10m') matchesPrice = p.price < 10000000;
    else if (priceFilter === 'above10m') matchesPrice = p.price >= 10000000;

    return matchesCategory && matchesSearch && matchesCondition && matchesPrice;
  });

  // Sort logic (newest created items float to top within featured/regular tiers)
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
    const featDiff = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (featDiff !== 0) return featDiff;
    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  // Category subsets for curated homepage sections
  const carProducts = products.filter((p) => p.category === 'Automobiles & Cars');
  const hairProducts = products.filter((p) => p.category === 'Hair & Luxury Wigs' || (Array.isArray(p.tags) && p.tags.includes('Human Hair Wig')));
  const fashionProducts = products.filter((p) => p.category === 'Fashion');
  const groceryProducts = products.filter((p) => p.category === 'Supermarket & Raw Foods');
  const techProducts = products.filter((p) => p.category === 'Phones & Tablets' || p.category === 'Electronics');
  const everydayProducts = products.filter((p) => {
    const id = typeof p.id === 'string' ? p.id : '';
    return p.category === 'Appliances' || (Array.isArray(p.tags) && p.tags.includes('Household')) || id.startsWith('prod-indomie-') || id.startsWith('prod-oraimo-') || id.startsWith('prod-itel-') || id.startsWith('prod-nivea-') || id.startsWith('prod-golden-') || id.startsWith('prod-milo-') || id.startsWith('prod-morningfresh-') || id.startsWith('prod-silvercrest-') || id.startsWith('prod-binatone-');
  });

  // 0. Dedicated Full-Page Admin Dashboard View (Not a Modal)
  if (isAdminOpen) {
    return (
      <AdminPortal
        isOpen={true}
        onClose={closeAdminModal}
        currentUser={currentUser}
        onAdminLoginSuccess={(profile) => {
          setCurrentUser(profile);
          saveActiveSession(profile);
          saveUserProfile(profile);
        }}
        onAdminSignOut={() => {
          handleSignOut();
        }}
        products={products}
        orders={orders}
        users={users}
        gatewaySettings={gatewaySettings}
        brandSettings={brandSettings}
        admins={admins}
        onCreateProduct={async (newProduct) => {
          await createProductInDb(newProduct);
          setProducts((prev) => [newProduct, ...prev.filter((p) => p.id !== newProduct.id)]);
        }}
        onUpdateProduct={async (productId, updates) => {
          await updateProductInDb(productId, updates);
          setProducts((prev) =>
            prev.map((p) => (p.id === productId ? { ...p, ...updates } : p))
          );
        }}
        onDeleteProduct={async (productId) => {
          await deleteProductFromDb(productId);
          setProducts((prev) => prev.filter((p) => p.id !== productId));
        }}
        onUpdateOrderStatus={updateOrderStatusInDb}
        onUpdateUser={async (updated) => {
          await saveUserProfile(updated);
          setUsers((prev) => prev.map((u) => (u.uid === updated.uid ? updated : u)));
        }}
        onSaveGatewaySettings={async (settings) => {
          await saveGatewaySettings(settings);
          setGatewaySettings(settings);
        }}
        onSaveBrandSettings={async (brand) => {
          await saveBrandSettings(brand);
          setBrandSettings(brand);
        }}
        onSyncCatalogToDb={async () => {
          const fresh = await syncAllProductsToDb(true);
          setProducts(fresh);
        }}
        onAddAdmin={async (newAdmin) => {
          await addAdminToDb(newAdmin);
          setAdmins((prev) => [newAdmin, ...prev.filter((a) => a.id !== newAdmin.id)]);
        }}
        onRemoveAdmin={async (adminId) => {
          await removeAdminFromDb(adminId);
          setAdmins((prev) => prev.filter((a) => a.id !== adminId));
        }}
        onToggleAdminStatus={async (adminId, isActive) => {
          await toggleAdminStatusInDb(adminId, isActive);
          setAdmins((prev) =>
            prev.map((a) => (a.id === adminId ? { ...a, isActive } : a))
          );
        }}
        serviceBookings={serviceBookings}
        onUpdateServiceBookingStatus={async (bookingId, status) => {
          await updateServiceBookingStatusInDb(bookingId, status);
          setServiceBookings((prev) =>
            prev.map((b) => (b.id === bookingId ? { ...b, status, updatedAt: new Date().toISOString() } : b))
          );
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 pb-16 md:pb-0">
      {/* 1. Header */}
      <Header
        brandLogoUrl={brandSettings.logoUrl}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenAuth={openAuthModal}
        onSignOut={handleSignOut}
        onOpenDashboard={openDashboardModal}
        onSelectCategory={(cat) => {
          setProductPageProduct(null);
          setIsServicesOpen(false);
          setSelectedCategory(cat);
          setMobileTab('categories');
          navigateTo('/');
        }}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          if (productPageProduct) setProductPageProduct(null);
          if (isServicesOpen) setIsServicesOpen(false);
          setSearchQuery(q);
        }}
        onOpenTracking={openTrackingModal}
        notifications={notifications}
        onGoHome={handleBackFromProductPage}
        onOpenAdmin={openAdminModal}
        onOpenServices={handleOpenServicesPage}
        isServicesActive={isServicesOpen}
      />

      {/* 2. Main Content Body: Dedicated Services Page, Product Page, or Storefront Home */}
      {isServicesOpen ? (
        <ServicesPage
          initialCategoryId={servicesCategoryId}
          userId={currentUser?.uid}
          defaultCustomerName={currentUser?.displayName || ''}
          defaultCustomerPhone={currentUser?.phone || ''}
          onBack={handleBackFromProductPage}
          onSubmitBooking={handleSubmitServiceBooking}
        />
      ) : productPageProduct ? (
        <ProductPage
          product={productPageProduct}
          allProducts={products}
          onBack={handleBackFromProductPage}
          onSelectProduct={handleSelectProduct}
          onAddToCart={handleAddToCart}
          onInstantBuy={handleInstantBuy}
          onUpdateProduct={async (updated) => {
            setProductPageProduct(updated);
            await updateProductInDb(updated.id, updated);
            setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          }}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* HERO SHOWCASE / CAMPAIGN BANNER (Only on Homepage & All Departments) */}
        {selectedCategory === 'All Departments' && !searchQuery && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Category Quick Navigation (Desktop) */}
            <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
                Store Departments
              </h3>
              <div className="space-y-0.5">
                {CATEGORIES.slice(1, 10).map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#0284C7] hover:bg-sky-50/60 rounded-xl transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0284C7] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Central New Products Carousel Header */}
            <div className="lg:col-span-6">
              <NewProductsHeroCarousel
                products={products}
                onSelectProduct={handleSelectProduct}
                onAddToCart={(prod) => handleAddToCart(prod, 1)}
                onBrowseCategory={(cat) => setSelectedCategory(cat)}
                onOpenServices={() => handleOpenServicesPage()}
              />
            </div>

            {/* Right Mini Cards (Spotlight Cards) */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {/* Card 1: 2025 Land Cruiser spotlight */}
              <div 
                onClick={() => {
                  const lc = products.find(p => p.sku === 'UW-CAR-LC2025-VXR');
                  if (lc) handleSelectProduct(lc);
                }}
                className="flex-1 bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-bold text-sky-700 uppercase mb-1">
                    <span>VIP Super Car</span>
                    <span className="text-amber-500 font-extrabold">NEW ENTRY</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 line-clamp-1">
                    Toyota Land Cruiser 2025 VXR
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    5 Months Reg · Twin Turbo · Direct Unitworld Sale
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-sm font-black text-slate-900 tabular-nums">₦149,000,000</span>
                  <span className="text-xs text-[#0284C7] font-bold">Inspect →</span>
                </div>
              </div>

              {/* Card 2: Fashion 25k spotlight */}
              <div 
                onClick={() => setSelectedCategory('Fashion')}
                className="flex-1 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-slate-950 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="bg-slate-950 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                    FLAT RATE
                  </span>
                  <h4 className="text-base font-black text-slate-950 mt-1 leading-tight">
                    All Clothes ₦25,000
                  </h4>
                  <p className="text-xs text-slate-900 font-medium mt-0.5">
                    Designer 2-piece sets, fleece shorts, and vintage striped polos.
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between font-black text-xs">
                  <span>Shop Apparel</span>
                  <span>Explore →</span>
                </div>
              </div>
            </div>
            {/* Hero Section Video (if uploaded by admin) */}
            {brandSettings.sectionVideos?.hero && (
              <div className="lg:col-span-12 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-md">
                <div className="aspect-video max-h-[420px] w-full">
                  <MediaViewer
                    url={brandSettings.sectionVideos.hero}
                    isVideo={true}
                    controls={true}
                    muted={true}
                    loop={true}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </section>
        )}

        {/* 3. SHOWCASE SECTION 1: AUTOMOBILES & CARS SHOWROOM */}
        {(selectedCategory === 'All Departments' || selectedCategory === 'Automobiles & Cars') && !searchQuery && (
          <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#0284C7] flex items-center justify-center">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-playfair text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Automobiles & Heavy Motors Showroom
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Physical Lagos inspections in Igando, Lekki & Victoria Island. Customs Exit certified and sold directly by Unitworld Sarl.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCategory('Automobiles & Cars')}
                className="text-xs font-bold text-[#0284C7] hover:text-[#0369a1] flex items-center gap-1 cursor-pointer"
              >
                <span>View All Cars ({carProducts.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {brandSettings.sectionVideos?.automobiles && (
              <div className="rounded-xl overflow-hidden bg-black border border-slate-200 aspect-video max-h-[360px]">
                <MediaViewer
                  url={brandSettings.sectionVideos.automobiles}
                  isVideo={true}
                  controls={true}
                  muted={true}
                  loop={true}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {carProducts.map((car) => (
                <ProductCard
                  key={car.id}
                  product={car}
                  onSelect={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  onDirectDm={handleDirectDm}
                />
              ))}
            </div>

            <QuickServiceStrip
              title="Need a Mechanic, Auto AC Tech, or Pre-Purchase Inspector?"
              subtitle="Book a certified mobile vehicle technician — just share your location and what you need checked."
              defaultCategoryId="auto-mechanic"
              allowedCategoryIds={['auto-mechanic', 'electrical', 'welding-fabrication']}
              sourceSection="homepage_automobiles"
              userId={currentUser?.uid}
              onSubmitBooking={handleSubmitServiceBooking}
              onOpenFullServicesPage={(catId) => handleOpenServicesPage(catId)}
            />
          </section>
        )}

        {/* 3B. SHOWCASE SECTION: EVERYDAY ESSENTIALS & HOME APPLIANCES */}
        {selectedCategory === 'All Departments' && !searchQuery && everydayProducts.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-xs">
                  <Flame className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-playfair text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      Everyday Essentials & Home Appliances
                    </h2>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                      Popular In Demand
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Authentic Nigerian household favorites: Indomie cartons, high-capacity power banks, rechargeable standing fans, commercial heavy-duty blenders, smartphones, and pantry provisions.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Direct Stock ({everydayProducts.length} items)</span>
              </div>
            </div>

            {brandSettings.sectionVideos?.everyday && (
              <div className="rounded-xl overflow-hidden bg-black border border-slate-200 aspect-video max-h-[360px]">
                <MediaViewer
                  url={brandSettings.sectionVideos.everyday}
                  isVideo={true}
                  controls={true}
                  muted={true}
                  loop={true}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
              {everydayProducts.slice(0, 6).map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onSelect={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  onDirectDm={handleDirectDm}
                />
              ))}
            </div>

            {everydayProducts.length > 6 && (
              <div className="pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
                  {everydayProducts.slice(6).map((item) => (
                    <ProductCard
                      key={item.id}
                      product={item}
                      onSelect={handleSelectProduct}
                      onAddToCart={handleAddToCart}
                      onDirectDm={handleDirectDm}
                    />
                  ))}
                </div>
              </div>
            )}

            <QuickServiceStrip
              title="Book a Plumber, Carpenter, Electrician or AC Technician"
              subtitle="Fast home & office repairs — enter your location and details of what needs fixing or built."
              defaultCategoryId="plumbing"
              allowedCategoryIds={['carpentry', 'plumbing', 'electrical', 'ac-appliances', 'painting-renovation', 'cleaning-fumigation', 'welding-fabrication']}
              sourceSection="homepage_everyday_essentials"
              userId={currentUser?.uid}
              onSubmitBooking={handleSubmitServiceBooking}
              onOpenFullServicesPage={(catId) => handleOpenServicesPage(catId)}
            />
          </section>
        )}

        {/* 4. SHOWCASE SECTION: LUXURY HUMAN HAIR & WIGS */}
        {(selectedCategory === 'All Departments' || selectedCategory === 'Hair & Luxury Wigs' || selectedCategory === 'Beauty & Personal Care') && !searchQuery && (
          <section className="bg-white rounded-2xl border border-rose-100 p-4 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-rose-100/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-playfair text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      Luxury Human Hair & Wigs Collection
                    </h2>
                    <span className="bg-rose-100 text-rose-800 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                      100% Virgin Hair
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    100% Virgin double drawn human hair: Luxury 5x5 Bounce (₦60,000), SDD Celebrity Fringe (₦61,000), Jerry Curl 4x4 (₦27,000), Pixie Curl (₦20,000). Video demos & multi-angle galleries available.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedCategory('Hair & Luxury Wigs')}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <span>Explore Wigs Catalog ({hairProducts.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {brandSettings.sectionVideos?.hair && (
              <div className="rounded-xl overflow-hidden bg-black border border-rose-200 aspect-video max-h-[360px]">
                <MediaViewer
                  url={brandSettings.sectionVideos.hair}
                  isVideo={true}
                  controls={true}
                  muted={true}
                  loop={true}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {hairProducts.map((hair) => (
                <ProductCard
                  key={hair.id}
                  product={hair}
                  onSelect={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  onDirectDm={handleDirectDm}
                />
              ))}
            </div>
          </section>
        )}

        {/* 5. SHOWCASE SECTION 3: FASHION HUB - FLAT ₦25,000 */}
        {(selectedCategory === 'All Departments' || selectedCategory === 'Fashion') && !searchQuery && (
          <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Shirt className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-playfair text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Fashion Hub — All Clothes Flat ₦25,000</span>
                    <span className="text-[10px] font-sans bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-black">
                      BEST VALUE
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Casablanca ribbed sets, abstract resort wear, zebra half-split, DG fleece shorts.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCategory('Fashion')}
                className="text-xs font-bold text-[#0284C7] hover:text-[#0369a1] flex items-center gap-1 cursor-pointer"
              >
                <span>View All Fashion ({fashionProducts.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {brandSettings.sectionVideos?.fashion && (
              <div className="rounded-xl overflow-hidden bg-black border border-slate-200 aspect-video max-h-[360px]">
                <MediaViewer
                  url={brandSettings.sectionVideos.fashion}
                  isVideo={true}
                  controls={true}
                  muted={true}
                  loop={true}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {fashionProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onSelect={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  onDirectDm={handleDirectDm}
                />
              ))}
            </div>
          </section>
        )}

        {/* 5. SHOWCASE SECTION 3: SUPERMARKET & RAW FOODS */}
        {(selectedCategory === 'All Departments' || selectedCategory === 'Supermarket & Raw Foods') && !searchQuery && (
          <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-playfair text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    Supermarket & Farm Raw Foods
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Supplied and sold directly from Unitworld Sarl depots. 50kg Royal Stallion Rice, Benue Yams, Pure Delta Palm Oil.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCategory('Supermarket & Raw Foods')}
                className="text-xs font-bold text-[#0284C7] hover:text-[#0369a1] flex items-center gap-1 cursor-pointer"
              >
                <span>View Groceries ({groceryProducts.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {brandSettings.sectionVideos?.groceries && (
              <div className="rounded-xl overflow-hidden bg-black border border-slate-200 aspect-video max-h-[360px]">
                <MediaViewer
                  url={brandSettings.sectionVideos.groceries}
                  isVideo={true}
                  controls={true}
                  muted={true}
                  loop={true}
                  className="w-full h-full object-contain"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groceryProducts.map((gro) => (
                <ProductCard
                  key={gro.id}
                  product={gro}
                  onSelect={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  onDirectDm={handleDirectDm}
                />
              ))}
            </div>

            <QuickServiceStrip
              title="Custom Kitchen Carpentry, Plumbing & Deep Cleaning"
              subtitle="Setting up a kitchen, store, or home? Submit your location & details below or browse all sub-services."
              defaultCategoryId="carpentry"
              sourceSection="homepage_groceries_home"
              userId={currentUser?.uid}
              onSubmitBooking={handleSubmitServiceBooking}
              onOpenFullServicesPage={(catId) => handleOpenServicesPage(catId)}
            />
          </section>
        )}

        {/* 6. COMPLETE SHOP CATALOG & FILTERABLE VIEW */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="font-playfair text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory}
              </h2>
              <p className="text-xs text-slate-500">
                Showing {sortedProducts.length} items from live Firestore catalog
              </p>
            </div>

            {/* Filter pills & sort selectors */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Condition Filter */}
              <select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
                className="py-1.5 px-2.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
              >
                <option value="all">All Conditions</option>
                <option value="Brand New">Brand New</option>
                <option value="Foreign Used (Tokunbo)">Tokunbo (Foreign Used)</option>
                <option value="Registered">Registered (Nigeria Used)</option>
              </select>

              {/* Price Filter */}
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value as any)}
                className="py-1.5 px-2.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
              >
                <option value="all">Any Price</option>
                <option value="under100k">Under ₦100,000</option>
                <option value="under10m">Under ₦10,000,000</option>
                <option value="above10m">₦10,000,000+ (Vehicles)</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="py-1.5 px-2.5 text-xs font-semibold border border-slate-200 rounded-lg bg-slate-50 text-slate-700"
              >
                <option value="featured">Featured First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center space-y-3 border border-slate-200">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No matching products found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for Toyota Land Cruiser, Camry, Highlander, Lexus, Casablanca set, rice, or yam.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All Departments');
                  setSearchQuery('');
                  setConditionFilter('all');
                  setPriceFilter('all');
                }}
                className="py-2 px-4 bg-[#0284C7] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
              {sortedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelect={handleSelectProduct}
                  onAddToCart={handleAddToCart}
                  onDirectDm={handleDirectDm}
                />
              ))}
            </div>
          )}
        </section>
      </main>
      )}

      {/* 7. Footer with discrete staff link and refund policy */}
      <Footer 
        logoUrl={brandSettings.logoUrl} 
        onOpenAdmin={openAdminModal} 
        onOpenRefundPolicy={openRefundPolicyModal}
        onOpenServices={handleOpenServicesPage}
      />

      {/* 8. Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={mobileTab}
        onSelectTab={(tab) => {
          setMobileTab(tab);
          if (tab === 'cart') setIsCartOpen(true);
          else if (tab === 'account') {
            if (currentUser) openDashboardModal();
            else openAuthModal();
          } else if (tab === 'services') {
            handleOpenServicesPage();
          } else if (tab === 'categories') {
            setIsServicesOpen(false);
            setProductPageProduct(null);
            setSelectedCategory('All Departments');
            navigateTo('/');
          } else if (tab === 'home') {
            handleBackFromProductPage();
          }
        }}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
      />

      {/* 9. Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onInstantBuy={handleInstantBuy}
        onOpenProductPage={handleSelectProduct}
        onUpdateProduct={async (updated) => {
          setSelectedProduct(updated);
          await updateProductInDb(updated.id, updated);
          setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currentUser={currentUser}
        gatewaySettings={gatewaySettings}
        onOrderCompleted={handleOrderCompleted}
        onOpenAuth={openAuthModal}
        onOpenRefundPolicy={openRefundPolicyModal}
      />

      <RefundPolicyModal
        isOpen={isRefundPolicyOpen}
        onClose={closeRefundPolicyModal}
      />

      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={closeTrackingModal}
        orders={orders}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={closeAuthModal}
        onAuthSuccess={(profile) => {
          setCurrentUser(profile);
          saveActiveSession(profile);
          saveUserProfile(profile);
          setUsers((prev) => [profile, ...prev.filter((u) => u.uid !== profile.uid)]);
          closeAuthModal();
        }}
      />

      {currentUser && (
        <CustomerDashboard
          isOpen={isDashboardOpen}
          onClose={closeDashboardModal}
          user={currentUser}
          orders={orders}
          onUpdateProfile={(updated) => {
            setCurrentUser(updated);
            saveActiveSession(updated);
            saveUserProfile(updated);
          }}
          onTrackOrder={(ord) => {
            closeDashboardModal();
            openTrackingModal();
          }}
        />
      )}

      {/* Real-time Push Notification Toast */}
      <NotificationToast
        notification={activeToast}
        onDismiss={() => setActiveToast(null)}
        onClick={() => {
          setActiveToast(null);
          setIsTrackingOpen(true);
        }}
      />
    </div>
  );
}
