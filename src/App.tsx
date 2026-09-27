import React, { useState, useEffect } from 'react';
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
  Laptop
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
  DEFAULT_ADMINS
} from './firebase';
import { Product, Order, OrderItem, UserProfile, GatewaySettings, BrandSettings, AppNotification, OrderStatus, AdminUser } from './types';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { NotificationToast } from './components/common/NotificationToast';
import { ProductCard } from './components/shop/ProductCard';
import { ProductDetailModal } from './components/shop/ProductDetailModal';
import { CartDrawer } from './components/shop/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/orders/OrderTrackingModal';
import { AuthModal } from './components/auth/AuthModal';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { AdminPortal } from './components/admin/AdminPortal';
import { formatCurrency } from './utils/formatters';
import { CATEGORIES, INITIAL_PRODUCTS } from './data/initialProducts';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [gatewaySettings, setGatewaySettings] = useState<GatewaySettings>({
    paystackPublicKey: 'pk_test_d347895e69123847291a890472e819b5d2',
    paystackEnabled: true,
    currency: 'NGN',
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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [admins, setAdmins] = useState<AdminUser[]>(DEFAULT_ADMINS);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_USERS);

  // URL Navigation helper to sync address bar without page reload
  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
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

  // Sync URL Path on Initial Load and Browser Back/Forward navigation (Vercel SPA routing)
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
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
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    return () => window.removeEventListener('popstate', handleUrlRoute);
  }, []);

  // Mobile Bottom Tab
  const [mobileTab, setMobileTab] = useState<'home' | 'categories' | 'shop' | 'cart' | 'account'>('home');

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  // 1. Initial Connection and Firestore Seeding
  useEffect(() => {
    testConnection();

    // Ensure database contains products and real images
    seedProductsIfEmpty().then((initial) => {
      if (initial && initial.length > 0) {
        setProducts(initial);
      }
    });

    getGatewaySettings().then((settings) => {
      if (settings) setGatewaySettings(settings);
    });

    getBrandSettings().then((brand) => {
      if (brand) setBrandSettings(brand);
    });

    getAdminsFromDb().then((loaded) => {
      if (loaded && loaded.length > 0) {
        setAdmins(loaded);
      }
    });

    // Load registered users directory
    getAllUsersFromDb().then((loadedUsers) => {
      if (loadedUsers && loadedUsers.length > 0) {
        setUsers(loadedUsers);
      }
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
        snapshot.forEach((d) => liveProducts.push(d.data() as Product));
        setProducts(liveProducts);
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

    // Auth state listener
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setCurrentUser(profile);
          setUsers((prev) => {
            const exists = prev.some((u) => u.uid === profile.uid);
            return exists ? prev.map((u) => (u.uid === profile.uid ? profile : u)) : [profile, ...prev];
          });
        } else {
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || 'customer@unitworld.com',
            displayName: user.displayName || user.email?.split('@')[0] || 'Customer',
            role: user.email === 'tobi@acourze.com' ? 'admin' : 'customer',
            mfaEnabled: user.email === 'tobi@acourze.com',
            preferences: {
              currency: 'NGN',
              emailNotifications: true,
              smsNotifications: true,
              whatsappAlerts: true,
            },
            addresses: [],
            createdAt: new Date().toISOString(),
          };
          setCurrentUser(newProfile);
          saveUserProfile(newProfile);
          setUsers((prev) => [newProfile, ...prev.filter((u) => u.uid !== newProfile.uid)]);
        }
      }
    });

    return () => {
      window.removeEventListener('keydown', handleKeyShortcut);
      unsubProducts();
      unsubOrders();
      unsubAuth();
    };
  }, []);

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
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch {
      setCurrentUser(null);
    }
  };

  const handleDirectDm = (product: Product) => {
    const text = encodeURIComponent(
      `Hello Unitworld Sarl, I am interested in: ${product.title}\nPrice: ${formatCurrency(product.price)}\nSKU: ${product.sku}\nPlease let me know inspection and acquisition details.`
    );
    window.open(`https://wa.me/2348008648967?text=${text}`, '_blank');
  };

  // Filter & Search Logic
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All Departments' ||
      p.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description ? p.description.toLowerCase().includes(searchQuery.toLowerCase()) : false) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (p.sku ? p.sku.toLowerCase().includes(searchQuery.toLowerCase()) : false);

    const matchesCondition =
      conditionFilter === 'all' || p.condition === conditionFilter;

    let matchesPrice = true;
    if (priceFilter === 'under100k') matchesPrice = p.price < 100000;
    else if (priceFilter === 'under10m') matchesPrice = p.price < 10000000;
    else if (priceFilter === 'above10m') matchesPrice = p.price >= 10000000;

    return matchesCategory && matchesSearch && matchesCondition && matchesPrice;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating ?? 0) - (a.rating ?? 0);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  // Category subsets for curated homepage sections
  const carProducts = products.filter((p) => p.category === 'Automobiles & Cars');
  const fashionProducts = products.filter((p) => p.category === 'Fashion');
  const groceryProducts = products.filter((p) => p.category === 'Supermarket & Raw Foods');
  const techProducts = products.filter((p) => p.category === 'Phones & Tablets' || p.category === 'Electronics');

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 pb-16 md:pb-0">
      {/* 1. Jumia-Style Header */}
      <Header
        brandLogoUrl={brandSettings.logoUrl}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        currentUser={currentUser}
        onOpenAuth={openAuthModal}
        onSignOut={handleSignOut}
        onOpenDashboard={openDashboardModal}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setMobileTab('shop');
        }}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenTracking={openTrackingModal}
        notifications={notifications}
      />

      {/* 2. Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6 sm:space-y-8">
        {/* HERO SHOWCASE / JUMIA CAMPAIGN BANNER (Only on Homepage & All Departments) */}
        {selectedCategory === 'All Departments' && !searchQuery && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Category Quick Navigation (Desktop) */}
            <div className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-3 py-2">
                Marketplace Hubs
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

            {/* Central Campaign Hero Banner */}
            <div className="lg:col-span-6 relative rounded-2xl overflow-hidden min-h-[300px] sm:min-h-[360px] bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-end p-6 sm:p-8">
              <img
                src="/src/assets/images/hero_marketplace_jumia_1790462828695.jpg"
                alt="Unitworld Global Marketplace"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

              <div className="relative z-10 space-y-3">
                <span className="bg-[#0284C7] text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-xs inline-block">
                  OFFICIAL DEALERSHIP & MARKETPLACE
                </span>
                <h1 className="font-playfair text-xl sm:text-3xl font-bold text-white leading-tight text-balance">
                  Luxury Vehicles, Fashion Wear, Tech & Farm Produce
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
                  Verified Tokunbo & Registered cars with physical Lagos inspection, all designer sets flat ₦25,000, and integrated Paystack settlement.
                </p>

                <div className="pt-2 flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setSelectedCategory('Automobiles & Cars')}
                    className="py-2.5 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Car className="w-4 h-4" />
                    <span>View Motors Showroom</span>
                  </button>
                  <button
                    onClick={() => setSelectedCategory('Fashion')}
                    className="py-2.5 px-4 bg-white/90 hover:bg-white text-slate-900 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Shirt className="w-4 h-4" />
                    <span>Fashion Hub (₦25,000)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Mini Cards (Jumia Side Spotlights) */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              {/* Card 1: 2025 Land Cruiser spotlight */}
              <div 
                onClick={() => {
                  const lc = products.find(p => p.sku === 'UW-CAR-LC2025-VXR');
                  if (lc) setSelectedProduct(lc);
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
                    5 Months Reg · Twin Turbo · Settlement 1M
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
                    Physical Lagos inspections in Igando, Lekki & Victoria Island. Settlement and Customs Exit certified.
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {carProducts.map((car) => (
                <ProductCard
                  key={car.id}
                  product={car}
                  onSelect={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                  onDirectDm={handleDirectDm}
                />
              ))}
            </div>
          </section>
        )}

        {/* 4. SHOWCASE SECTION 2: FASHION HUB - FLAT ₦25,000 */}
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

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
              {fashionProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                  onSelect={setSelectedProduct}
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
                    Direct from certified millers & Benue farms. 50kg Royal Stallion Rice, Benue Yams, Pure Delta Palm Oil.
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groceryProducts.map((gro) => (
                <ProductCard
                  key={gro.id}
                  product={gro}
                  onSelect={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                  onDirectDm={handleDirectDm}
                />
              ))}
            </div>
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
                  onSelect={setSelectedProduct}
                  onAddToCart={handleAddToCart}
                  onDirectDm={handleDirectDm}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* 7. Footer with discrete staff link */}
      <Footer logoUrl={brandSettings.logoUrl} onOpenAdmin={openAdminModal} />

      {/* 8. Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={mobileTab}
        onSelectTab={(tab) => {
          setMobileTab(tab);
          if (tab === 'cart') setIsCartOpen(true);
          else if (tab === 'account') {
            if (currentUser) openDashboardModal();
            else openAuthModal();
          } else if (tab === 'categories') {
            setSelectedCategory('All Departments');
          } else if (tab === 'shop') {
            setSelectedCategory('Automobiles & Cars');
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
            saveUserProfile(updated);
          }}
          onTrackOrder={(ord) => {
            closeDashboardModal();
            openTrackingModal();
          }}
        />
      )}

      {/* Admin ERP Portal */}
      <AdminPortal
        isOpen={isAdminOpen}
        onClose={closeAdminModal}
        products={products}
        orders={orders}
        users={users}
        gatewaySettings={gatewaySettings}
        brandSettings={brandSettings}
        admins={admins}
        onCreateProduct={createProductInDb}
        onUpdateProduct={updateProductInDb}
        onDeleteProduct={deleteProductFromDb}
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
        onMakeCurrentUserAdmin={() => {
          if (currentUser) {
            const updated: UserProfile = { ...currentUser, role: 'admin' };
            setCurrentUser(updated);
            saveUserProfile(updated);
            const existing = admins.find((a) => a.email.toLowerCase() === currentUser.email.toLowerCase());
            if (!existing) {
              const newAdmin: AdminUser = {
                id: `admin-${currentUser.uid}`,
                email: currentUser.email,
                name: currentUser.displayName || currentUser.email.split('@')[0],
                role: 'super_admin',
                department: 'Executive Administration',
                addedAt: new Date().toISOString(),
                isActive: true,
              };
              addAdminToDb(newAdmin).then(() => {
                setAdmins((prev) => [newAdmin, ...prev]);
              });
            }
          } else {
            const demoAdmin: UserProfile = {
              uid: 'demo-super-admin',
              email: 'admin@unitworld.com',
              displayName: 'Unitworld Super Admin',
              role: 'admin',
              mfaEnabled: true,
              preferences: {
                currency: 'NGN',
                emailNotifications: true,
                smsNotifications: true,
                whatsappAlerts: true,
              },
              addresses: [],
              createdAt: new Date().toISOString(),
            };
            setCurrentUser(demoAdmin);
          }
        }}
      />

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
