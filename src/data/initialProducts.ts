import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // 1. TOYOTA LAND CRUISER 2025 MODEL (User prompt verbatim)
  {
    id: 'prod-landcruiser-2025',
    title: 'TOYOTA LAND CRUISER 2025 MODEL VXR V6 TWIN TURBO',
    description: '5 MONTHS REGISTERED BUT NOT USED. VXR V6 Twin Turbo Engine working perfectly. Available for sale DM ASAP, pictures available. 149m. SETTLEMENT 1M.',
    price: 149000000,
    originalPrice: 155000000,
    category: 'Automobiles & Cars',
    condition: 'Registered',
    images: [
      '/src/assets/images/car_landcruiser_vxr_1790462842346.jpg',
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 1,
    sku: 'UW-CAR-LC2025-VXR',
    seller: 'Unitworld Premium Motors',
    location: 'Victoria Island, Lagos',
    rating: 5.0,
    reviewCount: 14,
    featured: true,
    settlementFee: '₦1,000,000 Settlement',
    tags: ['VXR', 'V6 Twin Turbo', '5 Months Reg', 'Barely Used', 'Settlement 1M'],
    specs: {
      'Model Year': '2025',
      'Engine': 'VXR V6 Twin Turbo Working Perfectly',
      'Registration': '5 Months Registered - Never Used',
      'Transmission': '10-Speed Automatic',
      'Mileage': '1,420 km',
      'Interior': 'Luxury Dual-Tone Leather with Rear Entertainment',
      'Exterior': 'Obsidian Black Firstbody',
      'Settlement Fee': '₦1,000,000'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 2. TOYOTA HIGHLANDER XSE 2021 (User prompt verbatim)
  {
    id: 'prod-highlander-2021',
    title: 'Foreign Used [Toks] Toyota Highlander XSE 2021 Model (Custom Exit 2026)',
    description: 'URGENT SALES NOW NOW!!! Foreign used [Toks] Toyota Highlander XSE 2021 Model Accident free, perfect condition Nothing to fix. CUSTOM EXIT 2026. PRICE: 55 MILLIONS. PICTURES AVAILABLE.',
    price: 55000000,
    originalPrice: 58000000,
    category: 'Automobiles & Cars',
    condition: 'Foreign Used (Tokunbo)',
    images: [
      '/src/assets/images/car_highlander_xse_1790462851011.jpg',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 1,
    sku: 'UW-CAR-HL2021-XSE',
    seller: 'Unitworld Premium Motors',
    location: 'Lekki Phase 1, Lagos',
    rating: 4.9,
    reviewCount: 11,
    featured: true,
    tags: ['Tokunbo', 'Urgent Sales', 'Custom Exit 2026', 'Accident Free', 'Nothing to Fix'],
    specs: {
      'Model Year': '2021',
      'Trim': 'XSE Sport Edition',
      'Engine': '3.5L V6 24V DOHC',
      'Condition': 'Foreign Used [Toks], Accident Free',
      'Customs': 'Custom Exit 2026 Fully Cleared',
      'Interior': '3 Rows Sport Leather Seats',
      'Status': 'Nothing to Fix, Perfect Condition'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 3. TOYOTA HIGHLANDER LIMITED EDITION (User prompt verbatim)
  {
    id: 'prod-highlander-limited',
    title: 'TOYOTA HIGHLANDER TOKUNBO LIMITED EDITION (3 Row Leather)',
    description: 'TOYOTA HIGHLANDER TOKUNBO, LIMITED EDITION, 3 ROLL WITH LEATHER SEAT, WORKING PERFECTLY IS AVAILABLE. DM ASAP, PICTURES AVAILABLE.',
    price: 38500000,
    originalPrice: 41000000,
    category: 'Automobiles & Cars',
    condition: 'Foreign Used (Tokunbo)',
    images: [
      '/src/assets/images/car_highlander_xse_1790462851011.jpg',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 1,
    sku: 'UW-CAR-HL-LIMITED',
    seller: 'Unitworld Auto Link',
    location: 'Berger Auto Yard, Lagos',
    rating: 4.8,
    reviewCount: 8,
    featured: false,
    tags: ['Tokunbo', 'Limited Edition', '3 Row Leather', 'Working Perfectly'],
    specs: {
      'Edition': 'Limited Edition',
      'Seating': '3 Roll with Premium Leather Seat',
      'Condition': 'Tokunbo - Working Perfectly',
      'Transmission': 'Automatic Smooth Gear',
      'AC Status': 'Factory Chilling AC'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 4. LEXUS RX350 F-SPORTS 2017 (User prompt verbatim)
  {
    id: 'prod-lexus-rx350-2017',
    title: 'Registered but Barely Driven 2017 Lexus RX350 Fsports (Grade A+++)',
    description: 'Registered but Barely Driven 2017 Lexus RX350 Fsports🚗💯. Firstbody✔️ Sunroof✔️ Untouched low mileage✔️ No single check light✔️ Fuel Efficient✔️ Factory Navigation screen✔️ Reverse camera✔️ All exhaust catalyst intact✔️💯 Factory leather seats and interior Like brand new✔️ Factory Alloy Wheels fitted✔️ Powerboot Active 💯. Engine: Excellent condition. Gear: Very smooth. Grade: A+++.',
    price: 42500000,
    originalPrice: 45000000,
    category: 'Automobiles & Cars',
    condition: 'Registered',
    images: [
      '/src/assets/images/car_lexus_rx350_1790462861358.jpg',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 1,
    sku: 'UW-CAR-RX350-2017',
    seller: 'Unitworld Direct Autos',
    location: 'Ikeja GRA, Lagos',
    rating: 5.0,
    reviewCount: 19,
    featured: true,
    tags: ['Fsports', 'Firstbody', 'Sunroof', 'Grade A+++', 'Powerboot Active'],
    specs: {
      'Model Year': '2017',
      'Trim': 'F-Sport Edition',
      'Body': '100% Firstbody Original Paint',
      'Sunroof': 'Factory Panoramic Glass Sunroof',
      'Catalysts': 'All Exhaust Catalysts 100% Intact',
      'Mileage': 'Untouched Low Mileage',
      'Dashboard': 'No Single Check Light',
      'Features': 'Factory Nav Screen, Reverse Cam, Active Powerboot',
      'Grade': 'Grade A+++ Barely Driven'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 5. TOYOTA CAMRY 2010 (User prompt verbatim)
  {
    id: 'prod-camry-2010',
    title: 'NEW ENTRY Toks Foreign 010 Toyota Camry v4 (Moscow Standard AC)',
    description: 'NEW ENTRY (Money Needed). Toks Foreign 010 Toyota Camry, v4, Fabrics seats, Engine 💯, Gear 💯, AC Moscow standard, Car clean in and out, Duty fully paid, Alloy and more. Price: 8.7m. Location: Igando. Pictures available.',
    price: 8700000,
    originalPrice: 9500000,
    category: 'Automobiles & Cars',
    condition: 'Foreign Used (Tokunbo)',
    images: [
      '/src/assets/images/car_camry_2010_1790462872857.jpg',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 1,
    sku: 'UW-CAR-CAMRY2010-TOK',
    seller: 'Igando Auto Hub',
    location: 'Igando, Lagos',
    rating: 4.8,
    reviewCount: 15,
    featured: true,
    tags: ['Tokunbo', 'Moscow Standard AC', 'Duty Fully Paid', 'Engine 100%', 'Clean In & Out'],
    specs: {
      'Model Year': '2010',
      'Engine': 'V4 Engine 100%',
      'Gearbox': 'Gear 100% Smooth Shift',
      'AC Status': 'AC Moscow Standard Ice Cold',
      'Seats': 'Original Factory Fabric Seats',
      'Customs': 'Duty Fully Paid',
      'Location': 'Igando, Lagos'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 6. FASHION ITEM 1 - All clothes are ₦25,000 naira!
  {
    id: 'prod-fashion-olive-polo',
    title: 'Textured Olive Ribbed Quarter-Zip Polo & Trouser Luxury 2-Piece Set',
    description: 'High-end men’s designer two-piece outfit featuring premium textured ribbed quarter-zip polo shirt and matching tailored relaxed trousers. Fine cotton knit, luxury finish, comfortable for both smart casual and streetwear.',
    price: 25000,
    originalPrice: 38000,
    category: 'Fashion',
    condition: 'Brand New',
    images: [
      '/src/assets/images/olive_twopiece_set_1790463639851.jpg',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 20,
    sku: 'UW-FASH-001',
    seller: 'Unitworld Fashion House',
    location: 'Lagos Warehouse',
    rating: 4.9,
    reviewCount: 46,
    featured: true,
    tags: ['2-Piece Set', '₦25,000 Flat', 'Textured Knit', 'Men Fashion', 'Quarter-Zip'],
    specs: {
      'Price Policy': '₦25,000 Flat Promo Price',
      'Set Includes': '1 Quarter-Zip Polo + 1 Matching Trousers',
      'Fabric': 'High-Density Textured Ribbed Cotton',
      'Fit': 'Tailored Relaxed Fit',
      'Sizes': 'M, L, XL, XXL'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 7. FASHION ITEM 2 - All clothes are ₦25,000 naira!
  {
    id: 'prod-fashion-tan-patchwork',
    title: 'Cuban Collar Abstract Geometric Patchwork Short-Sleeve & Pants Set',
    description: 'Exclusive resort-wear luxury set featuring two-tone Cuban camp collar button-down shirt with modern geometric earth-tone patchwork and matching premium tailored khaki lounge trousers.',
    price: 25000,
    originalPrice: 35000,
    category: 'Fashion',
    condition: 'Brand New',
    images: [
      '/src/assets/images/patchwork_resort_set_1790463649928.jpg',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 22,
    sku: 'UW-FASH-002',
    seller: 'Unitworld Fashion House',
    location: 'Lagos Warehouse',
    rating: 4.8,
    reviewCount: 34,
    featured: true,
    tags: ['Cuban Collar', '₦25,000 Flat', 'Abstract Patchwork', '2-Piece Set'],
    specs: {
      'Price Policy': '₦25,000 Flat Promo Price',
      'Set Includes': '1 Short-Sleeve Resort Shirt + 1 Matching Chino Pants',
      'Fabric': 'Soft Lyocell & Linen Finish',
      'Collar': 'Cuban Camp Collar',
      'Sizes': 'M, L, XL, XXL'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 8. FASHION ITEM 3 - All clothes are ₦25,000 naira!
  {
    id: 'prod-fashion-zebra-split',
    title: 'Monochrome Half-Split Contrast Luxury Shirt & Trouser Set',
    description: 'Statement luxury set featuring dual-face split front shirt (solid black and graphic pattern) with crisp buttons and matching black tailored trousers with ankle cuff details.',
    price: 25000,
    originalPrice: 36000,
    category: 'Fashion',
    condition: 'Brand New',
    images: [
      '/src/assets/images/monochrome_split_set_1790463659716.jpg',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 18,
    sku: 'UW-FASH-003',
    seller: 'Unitworld Fashion House',
    location: 'Lagos Warehouse',
    rating: 5.0,
    reviewCount: 29,
    featured: true,
    tags: ['Monochrome Split', '₦25,000 Flat', '2-Piece Set', 'Street Luxury'],
    specs: {
      'Price Policy': '₦25,000 Flat Promo Price',
      'Set Includes': '1 Split-Design Button Shirt + 1 Tailored Black Trousers',
      'Fabric': 'Matte Rayon Cotton Weave',
      'Sizes': 'M, L, XL, XXL'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 9. FASHION ITEM 4 - All clothes are ₦25,000 naira!
  {
    id: 'prod-fashion-dg-shorts',
    title: 'Heavyweight French Terry Fleece Casual Shorts (Warm Khaki)',
    description: 'Designer heavyweight fleece cotton casual shorts with thick elastic waistband, white tipped drawstrings, embroidered monogram crest, and deep side welt pockets. High comfort casual wear.',
    price: 25000,
    originalPrice: 32000,
    category: 'Fashion',
    condition: 'Brand New',
    images: [
      '/src/assets/images/fleece_shorts_khaki_1790463670407.jpg',
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 25,
    sku: 'UW-FASH-004',
    seller: 'Unitworld Fashion House',
    location: 'Lagos Warehouse',
    rating: 4.8,
    reviewCount: 23,
    tags: ['Fleece Shorts', '₦25,000 Flat', 'Heavyweight Terry', 'Warm Khaki'],
    specs: {
      'Price Policy': '₦25,000 Flat Promo Price',
      'Fabric': '420 GSM Heavyweight French Terry Cotton',
      'Waistband': 'Ribbed Elastic with Heavyweight Dipped Cords',
      'Sizes': 'S, M, L, XL'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 10. FASHION ITEM 5 - All clothes are ₦25,000 naira!
  {
    id: 'prod-fashion-striped-knit',
    title: 'Retro Tri-Color Striped Quarter-Zip Knit Polo & Shorts 2-Piece Set',
    description: 'Vintage-inspired resort set featuring cream, tan and black horizontal striped quarter-zip knit polo with matching striped border knit shorts. Ultra-soft breathable luxury knit.',
    price: 25000,
    originalPrice: 35000,
    category: 'Fashion',
    condition: 'Brand New',
    images: [
      '/src/assets/images/striped_knit_set_1790463679741.jpg',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 16,
    sku: 'UW-FASH-005',
    seller: 'Unitworld Fashion House',
    location: 'Lagos Warehouse',
    rating: 4.9,
    reviewCount: 39,
    tags: ['Striped Knit', '₦25,000 Flat', '2-Piece Set', 'Retro Luxury'],
    specs: {
      'Price Policy': '₦25,000 Flat Promo Price',
      'Set Includes': '1 Striped Knit Zip Polo + 1 Matching Knit Shorts',
      'Fabric': 'Cotton Pique & Fine Acrylic Knit',
      'Sizes': 'M, L, XL, XXL'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 11. SUPERMARKET & RAW FOODS - REAL BENUE YAM TUBERS (Fixed: Authentic Yams, No Carrots!)
  {
    id: 'prod-rawfood-yam-bundle',
    title: 'Benue Fresh Farm Jumbo Yam Tubers (Bundle of 5 Large Tubers)',
    description: 'Authentic freshly harvested jumbo Benue white yams direct from the farm. Guaranteed large, dry, sweet and heavy tubers. Perfect for delicious pounded yam, boiled yam with palm oil, roasted yam or porridge. Genuine agricultural produce.',
    price: 18500,
    originalPrice: 22000,
    category: 'Supermarket & Raw Foods',
    condition: 'Brand New',
    images: [
      '/src/assets/images/real_benue_yam_tubers_1790463596532.jpg',
      'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 45,
    sku: 'UW-FOOD-YAM-B5',
    seller: 'Unitworld Agro Hub',
    location: 'Mile 12 Market Depot / Direct Farm',
    rating: 4.9,
    reviewCount: 118,
    featured: true,
    tags: ['Benue Yam', 'Raw Foods', 'Farm Fresh', 'Bundle of 5 Large Tubers', 'No Carrots'],
    specs: {
      'Quantity': '5 Jumbo Heavy Brown Tubers',
      'Origin': 'Benue State Farm Harvest',
      'Variety': 'Authentic White Yam (Dioscorea rotundata)',
      'Condition': 'Dry, Solid, Sweet, Zero Decay'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 12. SUPERMARKET & RAW FOODS - REAL DELTA PALM OIL 25L KEG
  {
    id: 'prod-rawfood-palmoil-25l',
    title: 'Pure Unadulterated Delta Red Palm Oil (25 Litres Yellow Keg)',
    description: '100% natural, unadulterated virgin red palm oil freshly processed in Delta State. Rich deep red color, sweet natural aroma, zero artificial coloring or additives. Supplied in heavy-duty yellow 25L jerrycan with sealed red cap.',
    price: 38000,
    originalPrice: 42000,
    category: 'Supermarket & Raw Foods',
    condition: 'Brand New',
    images: [
      '/src/assets/images/delta_palm_oil_keg_1790463610040.jpg',
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 35,
    sku: 'UW-FOOD-PALMOIL-25L',
    seller: 'Delta Organic Mills',
    location: 'Lagos Warehouse',
    rating: 5.0,
    reviewCount: 95,
    featured: true,
    tags: ['Palm Oil', '25L Keg', 'Raw Food', 'Delta Original', 'Pure Unadulterated'],
    specs: {
      'Volume': '25 Litres Heavy-Duty Jerrycan',
      'Purity': '100% Virgin Grade Red Palm Oil',
      'Origin': 'Delta State Traditional Press',
      'Packaging': 'Factory Sealed Yellow Keg'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 13. SUPERMARKET & RAW FOODS - REAL ROYAL STALLION RICE 50KG
  {
    id: 'prod-rawfood-rice-50kg',
    title: 'Premium Royal Stallion Long Grain Parboiled Rice (50kg Bag)',
    description: 'Supreme grade stone-free long grain parboiled rice. Fluffy, non-sticky when cooked, naturally aged with zero debris. Packed in heavy-duty woven polypropylene sack bag with authentic stallion seal.',
    price: 84000,
    originalPrice: 92000,
    category: 'Supermarket & Raw Foods',
    condition: 'Brand New',
    images: [
      '/src/assets/images/royal_stallion_rice_1790463620369.jpg',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1000&q=80'
    ],
    stock: 60,
    sku: 'UW-FOOD-RICE-50KG',
    seller: 'Unitworld Food Mart',
    location: 'Alaba Rago / Lagos Central Depot',
    rating: 4.9,
    reviewCount: 182,
    featured: true,
    tags: ['Raw Food', '50kg Bag', 'Stone Free', 'Stallion Rice', 'Non-Sticky'],
    specs: {
      'Net Weight': '50kg Net Weight',
      'Grain Type': 'Long Grain Parboiled White Rice',
      'Quality': '100% Stone-Free and Sortex Cleaned',
      'Packaging': 'Reinforced Moisture-Proof Woven Sack'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 14. PHONES & TABLETS
  {
    id: 'prod-iphone-16-pro-max',
    title: 'Apple iPhone 16 Pro Max 256GB - Desert Titanium (1 Year Apple Care)',
    description: 'Super Retina XDR OLED display, A18 Pro chip, 48MP Fusion camera system with 5x Telephoto optical zoom, Camera Control button, and Grade 5 Titanium design. Brand new sealed with official warranty.',
    price: 2150000,
    originalPrice: 2300000,
    category: 'Phones & Tablets',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 8,
    sku: 'UW-PHONE-IP16PM-256',
    seller: 'Apple Authorized Dealer',
    location: 'Lagos Express Hub',
    rating: 5.0,
    reviewCount: 94,
    featured: true,
    tags: ['Desert Titanium', 'A18 Pro', '256GB', 'Official Warranty'],
    specs: {
      'Display': '6.9-inch Super Retina XDR OLED 120Hz ProMotion',
      'Processor': 'A18 Pro Chip with 6-core GPU',
      'Camera': '48MP Main + 48MP Ultra Wide + 12MP 5x Telephoto',
      'Storage': '256GB NVMe',
      'Warranty': '1 Year International Apple Warranty'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 15. ELECTRONICS
  {
    id: 'prod-elec-sony-tv-65',
    title: 'Sony 65-Inch Bravia 4K Ultra HD HDR Smart Google TV (2025 Model)',
    description: '4K HDR Processor X1, Triluminos Pro color, Google TV with Google Assistant, Dolby Vision & Atmos sound, HDMI 2.1 for PS5 gaming at 120fps.',
    price: 890000,
    originalPrice: 980000,
    category: 'Electronics',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1577979749830-f1d742b96791?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 12,
    sku: 'UW-ELEC-SONY65',
    seller: 'Sony World Nigeria',
    location: 'Ikeja Hub',
    rating: 4.9,
    reviewCount: 68,
    featured: true,
    tags: ['4K Ultra HD', 'Sony Bravia', 'Google TV', '120Hz Gaming'],
    specs: {
      'Screen Size': '65-inch 4K LED Display',
      'Audio': 'Dolby Atmos 20W Acoustic Multi-Audio',
      'Smart OS': 'Google TV with Play Store & Netflix',
      'Ports': '4x HDMI (2x HDMI 2.1), 2x USB, Optical, LAN'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const CATEGORIES = [
  { name: 'All Departments', icon: 'LayoutGrid' },
  { name: 'Automobiles & Cars', icon: 'Car' },
  { name: 'Fashion', icon: 'Shirt' },
  { name: 'Supermarket & Raw Foods', icon: 'ShoppingBag' },
  { name: 'Phones & Tablets', icon: 'Smartphone' },
  { name: 'Electronics', icon: 'Tv' },
  { name: 'Appliances', icon: 'Refrigerator' },
  { name: 'Computing', icon: 'Laptop' },
  { name: 'Health & Beauty', icon: 'Sparkles' },
  { name: 'Home & Office', icon: 'Armchair' },
  { name: 'Baby Products', icon: 'Baby' },
  { name: 'Gaming', icon: 'Gamepad2' },
  { name: 'Official Store', icon: 'Award' },
];
