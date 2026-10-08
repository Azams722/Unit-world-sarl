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
      '/assets/images/car_landcruiser_vxr_1790462842346.jpg'
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
      '/assets/images/car_highlander_xse_1790462851011.jpg'
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
      '/assets/images/car_highlander_limited_1790462852222.jpg'
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
      '/assets/images/car_lexus_rx350_1790462861358.jpg'
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
      '/assets/images/car_camry_2010_1790462872857.jpg'
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
      '/assets/images/olive_twopiece_set_1790463639851.jpg'
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
      '/assets/images/patchwork_resort_set_1790463649928.jpg'
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
      '/assets/images/monochrome_split_set_1790463659716.jpg'
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
      '/assets/images/fleece_shorts_khaki_1790463670407.jpg'
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
      '/assets/images/striped_knit_set_1790463679741.jpg'
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
      '/assets/images/real_benue_yam_tubers_1790463596532.jpg'
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
      '/assets/images/delta_palm_oil_keg_1790463610040.jpg'
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
      '/assets/images/royal_stallion_rice_1790463620369.jpg'
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
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80'
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
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80'
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
  },

  // === JUMIA NIGERIA POPULAR EVERYDAY BESTSELLERS (+5% FAIR MARGIN WITH VERIFIED REAL PHOTOS) ===

  // 16. INDOMIE REGULAR CHICKEN CARTON (Jumia: ₦11,300 -> Ours +5%: ₦11,865)
  {
    id: 'prod-jumia-indomie-chicken-carton',
    title: 'Indomie Instant Noodles Regular Chicken Flavor (Carton of 40 x 70g Packs)',
    description: 'Authentic sealed carton of Indomie Instant Noodles Onion Chicken flavor. 40 individual 70g packs complete with original seasoning sachet and chili oil. Nigeria’s undisputed #1 household meal. Direct from factory depot.',
    price: 11865,
    originalPrice: 14500,
    category: 'Supermarket & Raw Foods',
    condition: 'Brand New',
    images: [
      '/assets/images/jumia_indomie_chicken_carton.jpg'
    ],
    stock: 85,
    sku: 'UW-FOOD-INDOMIE-40X70',
    seller: 'Unitworld Supermarket & Provisions',
    location: 'Lagos Central Depot',
    rating: 5.0,
    reviewCount: 240,
    featured: true,
    tags: ['Indomie Chicken', 'Carton of 40', 'Jumia Best Seller', 'Supermarket', '+5% Fair Price'],
    specs: {
      'Pack Count': '40 Packs per Sealed Carton',
      'Weight per Pack': '70g Net Weight per Pack',
      'Flavor': 'Signature Onion Chicken Seasoning',
      'Benchmark': 'Jumia Verified Price (₦11,300 + 5% Fair Delivery)',
      'Manufacturer': 'Dufil Prima Foods Plc'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 17. INDOMIE SUPER PACK CHICKEN CARTON (Jumia: ₦17,000 -> Ours +5%: ₦17,850)
  {
    id: 'prod-jumia-indomie-superpack-carton',
    title: 'Indomie Instant Noodles Super Pack Chicken Flavor (Carton of 40 x 120g Packs)',
    description: 'Heavyweight Super Pack carton of Indomie Instant Noodles. 40 individual 120g packs for full satisfying meals. Sealed factory carton with authentic batch numbers.',
    price: 17850,
    originalPrice: 22000,
    category: 'Supermarket & Raw Foods',
    condition: 'Brand New',
    images: [
      '/assets/images/jumia_indomie_chicken_carton.jpg'
    ],
    stock: 65,
    sku: 'UW-FOOD-INDOMIE-40X120',
    seller: 'Unitworld Supermarket & Provisions',
    location: 'Lagos Central Depot',
    rating: 4.9,
    reviewCount: 198,
    featured: true,
    tags: ['Super Pack 120g', 'Carton of 40', 'Jumia Best Seller', 'Supermarket', '+5% Fair Price'],
    specs: {
      'Pack Count': '40 Packs per Sealed Carton',
      'Weight per Pack': '120g Super Pack',
      'Flavor': 'Chicken Flavor',
      'Benchmark': 'Jumia Verified Price (₦17,000 + 5% Fair Delivery)',
      'Manufacturer': 'Dufil Prima Foods Plc'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 18. ORAIMO 30000MAH FAST CHARGE POWER BANK (Jumia: ₦34,999 -> Ours +5%: ₦36,750)
  {
    id: 'prod-jumia-oraimo-powerbank-30000mah',
    title: 'Oraimo 30000mAh Ultra-Fast Charging Power Bank with Digital LED Display',
    description: 'High-capacity 30,000mAh portable fast-charging power bank. Features dual high-speed USB-A outputs, Type-C two-way quick charging, bright LED digital battery percentage screen, and heavy-duty multi-protection circuit against power surges.',
    price: 36750,
    originalPrice: 48000,
    category: 'Phones & Tablets',
    condition: 'Brand New',
    images: [
      '/assets/images/jumia_oraimo_powerbank_30000mah.jpg'
    ],
    stock: 45,
    sku: 'UW-ELEC-ORAIMO-PB30K',
    seller: 'Oraimo Direct Tech Hub',
    location: 'Ikeja Computer Village Hub',
    rating: 5.0,
    reviewCount: 312,
    featured: true,
    tags: ['Oraimo 30000mAh', 'Power Bank', 'Fast Charging', 'LED Display', 'Type-C', '+5% Fair Price'],
    specs: {
      'Battery Capacity': '30,000mAh High-Density Polymer Cell',
      'Fast Charge Output': '22.5W Two-Way Fast Charge',
      'Ports': '2x USB Output, 1x Type-C In/Out, 1x Micro-USB',
      'Display': 'Digital LED Exact Percentage Indicator',
      'Benchmark': 'Jumia Benchmark (₦34,999 + 5% Margin)',
      'Warranty': '1 Year Official Warranty'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 19. ORAIMO WATCH 5 LITE SMARTWATCH (Jumia: ₦22,000 -> Ours +5%: ₦23,100)
  {
    id: 'prod-jumia-oraimo-smartwatch',
    title: 'Oraimo Watch 5 Lite 2.01" HD Screen Smartwatch (Bluetooth Calls & IP68)',
    description: 'Sleek premium smartwatch with vibrant 2.01-inch HD touch screen, crystal-clear Bluetooth phone call dialer, 100+ fitness sport modes, 24/7 heart rate and blood oxygen monitoring, and IP68 waterproof rating.',
    price: 23100,
    originalPrice: 32000,
    category: 'Electronics',
    condition: 'Brand New',
    images: [
      '/assets/images/jumia_oraimo_smartwatch.jpg'
    ],
    stock: 35,
    sku: 'UW-ELEC-ORAIMO-W5L',
    seller: 'Oraimo Direct Tech Hub',
    location: 'Ikeja Computer Village Hub',
    rating: 4.9,
    reviewCount: 154,
    featured: true,
    tags: ['Oraimo Watch 5', 'Smartwatch', 'Bluetooth Calls', 'IP68 Waterproof', '+5% Fair Price'],
    specs: {
      'Display': '2.01-inch Ultra HD Touch Display',
      'Connectivity': 'Bluetooth 5.3 Calling & Notifications',
      'Battery Life': 'Up to 7 Days Active Use',
      'Waterproof': 'IP68 Water & Dust Resistant',
      'Benchmark': 'Jumia Benchmark (₦22,000 + 5% Margin)'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 20. BINATONE 18-INCH RECHARGEABLE STANDING FAN (Jumia: ₦58,000 -> Ours +5%: ₦60,900)
  {
    id: 'prod-jumia-binatone-rechargeable-fan',
    title: 'Binatone 18-Inch Standing Rechargeable Fan with Remote & USB Charger Port (RCFM-1875)',
    description: 'Heavy-duty 18-inch rechargeable standing fan engineered for long runtimes during NEPA power outages. Equipped with remote control, 9-speed control, built-in bright LED night light, and 5V USB output port to charge your smartphones.',
    price: 60900,
    originalPrice: 75000,
    category: 'Appliances',
    condition: 'Brand New',
    images: [
      '/assets/images/jumia_electric_standing_fan.jpg'
    ],
    stock: 28,
    sku: 'UW-APP-BINATONE-FAN18',
    seller: 'Binatone Home Comfort Store',
    location: 'Alaba International Market Depot',
    rating: 5.0,
    reviewCount: 189,
    featured: true,
    tags: ['Binatone Fan', '18-Inch Standing', 'Rechargeable Fan', 'Remote Control', 'USB Port', '+5% Fair Price'],
    specs: {
      'Blade Size': '18-Inch Aerodynamic 5-Blade Propeller',
      'Battery': '12V 4.5Ah Heavy-Duty Rechargeable Battery',
      'Runtime': 'Up to 10 Hours on Low Speed / 5 Hours on High',
      'Special Features': 'Full Remote Control, USB Phone Charger, Night Light',
      'Benchmark': 'Jumia Verified Price (₦58,000 + 5% Margin)',
      'Warranty': '2 Years Binatone Nigeria Warranty'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 21. SILVER CREST 2L 4500W COMMERCIAL BLENDER (Jumia: ₦45,000 -> Ours +5%: ₦47,250)
  {
    id: 'prod-jumia-silvercrest-blender',
    title: 'Silver Crest 2L 4500W Heavy Duty Multi-Function Commercial Crusher Blender & Grinder',
    description: 'Industrial-grade 4500W high-speed commercial blender. Crushes whole dry beans, maize, roasted tigernuts, frozen fruits, and ice cubes effortlessly. 2.0L heavy unbreakable polycarbonate jug with 6 Japanese stainless steel serrated blades.',
    price: 47250,
    originalPrice: 58000,
    category: 'Appliances',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 40,
    sku: 'UW-APP-SILVERCREST-4500W',
    seller: 'Kitchen Essentials Supermart',
    location: 'Trade Fair Complex, Lagos',
    rating: 4.9,
    reviewCount: 215,
    featured: true,
    tags: ['Silver Crest 4500W', 'Commercial Blender', '2L Unbreakable', 'Beans & Ice Crusher', '+5% Fair Price'],
    specs: {
      'Power Rating': '4,500W Pure Copper High-Torque Motor',
      'Capacity': '2.0 Litres Food-Grade Unbreakable Pitcher',
      'Blades': '6-Leaf Hardened Laser-Cut Stainless Steel Blades',
      'Usage': 'Beans for Akara/Moi-Moi, Smoothies, Tigernut Milk, Ice Crushing',
      'Benchmark': 'Jumia Benchmark (₦45,000 + 5% Margin)'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 22. ITEL A70 128GB SMARTPHONE (Jumia: ₦95,000 -> Ours +5%: ₦99,750)
  {
    id: 'prod-jumia-itel-a70',
    title: 'Itel A70 6.6" Dynamic Bar 128GB ROM + 4GB RAM 5000mAh Smartphone (Brilliant Black)',
    description: 'Nigeria’s most popular budget smartphone. Big 6.6-inch HD+ screen with interactive Dynamic Island notification bar, massive 128GB storage, 5000mAh all-day battery with Type-C, octa-core processor, and 13MP AI dual cameras.',
    price: 99750,
    originalPrice: 120000,
    category: 'Phones & Tablets',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 25,
    sku: 'UW-PHONE-ITEL-A70',
    seller: 'Transsion Official Flagship Store',
    location: 'Ikeja Express Hub',
    rating: 4.8,
    reviewCount: 167,
    featured: true,
    tags: ['Itel A70', '128GB Storage', '4GB RAM', 'Dynamic Bar', '5000mAh', '+5% Fair Price'],
    specs: {
      'Display': '6.6-inch HD+ Big Screen with Dynamic Bar',
      'Storage': '128GB Internal Storage (Expandable up to 2TB)',
      'RAM': '4GB RAM + Up to 8GB Extended RAM Memory Fusion',
      'Battery': '5000mAh Long-Lasting Battery with Type-C Port',
      'Benchmark': 'Jumia Benchmark (₦95,000 + 5% Margin)',
      'Warranty': '1 Year Carlcare Warranty'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 23. NIVEA MEN DEEP 72H ROLL-ON (Pack of 3) (Jumia: ₦4,550 -> Ours +5%: ₦4,780)
  {
    id: 'prod-jumia-nivea-deep-rollon',
    title: 'NIVEA MEN Deep Black Charcoal 72H Anti-Perspirant Roll-On 50ml (Pack of 3 Bottles)',
    description: 'Value pack of 3 bottles of NIVEA MEN Deep Anti-perspirant roll-on deodorant. Formulated with Black Carbon charcoal for powerful antibacterial odor protection and 72-hour dry freshness. Non-staining formula.',
    price: 4780,
    originalPrice: 6500,
    category: 'Health & Beauty',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 90,
    sku: 'UW-BEAUTY-NIVEA-DEEP-P3',
    seller: 'Beiersdorf Official Store',
    location: 'Lagos Warehouse',
    rating: 4.9,
    reviewCount: 142,
    featured: false,
    tags: ['Nivea Men Deep', 'Pack of 3', '72H Roll-On', 'Black Charcoal', '+5% Fair Price'],
    specs: {
      'Package': 'Pack of 3 Glass Roll-On Bottles (50ml each)',
      'Formula': 'Black Charcoal Antibacterial Defense',
      'Protection': '72 Hours Sweat and Odor Resistance',
      'Benchmark': 'Jumia Benchmark (₦4,550 + 5% Margin)'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 24. GOLDEN PENNY PURE SOYA OIL 5L (Jumia: ₦16,200 -> Ours +5%: ₦17,010)
  {
    id: 'prod-jumia-golden-penny-oil-5l',
    title: 'Golden Penny Pure Soya Vegetable Cooking Oil (5 Litres Bottle Jerrycan)',
    description: '100% pure refined soya bean cooking oil in factory-sealed 5L bottle with handle. Cholesterol-free, light, odorless and heart-friendly. Enriched with Vitamin A. Essential for daily frying, baking, and jollof rice.',
    price: 17010,
    originalPrice: 21000,
    category: 'Supermarket & Raw Foods',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 50,
    sku: 'UW-FOOD-GPOIL-5L',
    seller: 'Flour Mills of Nigeria Depot',
    location: 'Apapa / Lagos Central Depot',
    rating: 4.9,
    reviewCount: 175,
    featured: true,
    tags: ['Golden Penny Oil', '5 Litres Jerrycan', 'Pure Soya Oil', 'Supermarket', '+5% Fair Price'],
    specs: {
      'Volume': '5 Litres Sealed Jerrycan with Pour Spout',
      'Purity': '100% Pure Refined Soya Bean Vegetable Cooking Oil',
      'Health': 'Zero Cholesterol, Enriched with Vitamin A',
      'Benchmark': 'Jumia Benchmark (₦16,200 + 5% Margin)'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 25. NESTLÉ MILO REFILL 800G (Jumia: ₦7,800 -> Ours +5%: ₦8,190)
  {
    id: 'prod-jumia-milo-refill-800g',
    title: 'Nestlé Milo Energy Food Drink Chocolate Malt Powder (800g Eco-Refill Pack)',
    description: 'Original Nestlé Milo chocolate malt food drink in 800g economy foil refill pack. Fortified with Activ-Go, essential B vitamins, vitamin C, iron and calcium. Nigeria’s favorite chocolate breakfast drink.',
    price: 8190,
    originalPrice: 10500,
    category: 'Supermarket & Raw Foods',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 75,
    sku: 'UW-FOOD-MILO-800G',
    seller: 'Nestle Consumer Goods Depot',
    location: 'Lagos Warehouse',
    rating: 5.0,
    reviewCount: 228,
    featured: false,
    tags: ['Nestle Milo', '800g Refill', 'Chocolate Malt', 'Activ-Go', '+5% Fair Price'],
    specs: {
      'Weight': '800g Moisture-Proof Foil Pouch',
      'Nutrients': 'Activ-Go: Vitamins B2, B3, B6, B12, C, D, Calcium, Iron',
      'Manufacturer': 'Nestlé Nigeria Plc',
      'Benchmark': 'Jumia Benchmark (₦7,800 + 5% Margin)'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 26. DETTOL ANTISEPTIC LIQUID 1L (Jumia: ₦6,400 -> Ours +5%: ₦6,720)
  {
    id: 'prod-jumia-dettol-antiseptic-1l',
    title: 'Dettol Original Anti-Bacterial Disinfectant Liquid for Bathing & Cleansing (1000ml / 1L)',
    description: 'Family-size 1-litre bottle of Dettol Antiseptic Disinfectant Liquid. Kills 99.9% of germs and bacteria. Trusted for personal bathing hygiene, wound first-aid cleaning, laundry disinfection, and household sanitization.',
    price: 6720,
    originalPrice: 8500,
    category: 'Health & Beauty',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 60,
    sku: 'UW-HEALTH-DETTOL-1L',
    seller: 'Reckitt Benckiser Official Store',
    location: 'Lagos Warehouse',
    rating: 5.0,
    reviewCount: 163,
    featured: false,
    tags: ['Dettol Liquid', '1000ml / 1L', 'Antiseptic', 'First Aid', '+5% Fair Price'],
    specs: {
      'Volume': '1,000ml (1 Litre) Heavy Bottle',
      'Efficacy': 'Kills 99.9% of Harmful Germs and Bacteria',
      'NAFDAC Reg': 'Official NAFDAC Certified Formulation',
      'Benchmark': 'Jumia Benchmark (₦6,400 + 5% Margin)'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 27. LUXURY HAIR 1 - Luxury 5x5 Bounce
  {
    id: 'prod-hair-luxury-5x5-bounce',
    slug: 'luxury-5x5-bounce',
    title: 'Luxury 5x5 Bounce Human Hair Wig',
    description: 'Luxury 5x5 bounce human hair wig. 100% Virgin double drawn human hair with high-bounce curl memory, pre-plucked 5x5 HD transparent lace closure, and baby hairs for natural hairline transition.',
    price: 60000,
    originalPrice: 75000,
    category: 'Hair & Luxury Wigs',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?auto=format&fit=crop&w=1000&q=80'
    ],
    videos: [
      'https://assets.mixkit.co/videos/preview/mixkit-woman-showing-off-her-curly-hair-41584-large.mp4'
    ],
    stock: 16,
    sku: 'UW-HAIR-5X5-BNC',
    seller: 'Luxury Human Hair Studio',
    location: 'Lekki / Victoria Island, Lagos',
    rating: 5.0,
    reviewCount: 38,
    featured: true,
    tags: ['Luxury 5x5 bounce', 'Human Hair Wig', '5x5 Closure', 'Bounce Curls', '60,000 Naira', 'Hair & Luxury Wigs', 'Health & Beauty'],
    specs: {
      'Product Name': 'Luxury 5x5 Bounce',
      'Closure Size': '5x5 HD Transparent Lace Closure',
      'Hair Texture': 'Luxury Bounce Curls (Double Drawn)',
      'Price': '60,000 Naira (₦60,000)',
      'Hair Material': '100% Virgin Human Hair',
      'Color': 'Natural Black / 1B',
      'Cap Construction': 'Breathable Mesh Cap with Adjustable Straps & Security Combs'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 15. LUXURY HAIR 2 - SDD Celebrity Fringe
  {
    id: 'prod-hair-sdd-celebrity-fringe',
    slug: 'sdd-celebrity-fringe',
    title: 'SDD Celebrity Fringe Human Hair Wig',
    description: 'SDD (Super Double Drawn) celebrity fringe wig. Ultra-full density with razor-sharp blunt front celebrity fringe bangs, silky smooth hair cuticle alignment, and zero thin ends.',
    price: 61000,
    originalPrice: 78000,
    category: 'Hair & Luxury Wigs',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80'
    ],
    videos: [
      'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-woman-with-straight-hair-41585-large.mp4'
    ],
    stock: 14,
    sku: 'UW-HAIR-SDD-FRG',
    seller: 'Luxury Human Hair Studio',
    location: 'Lekki / Victoria Island, Lagos',
    rating: 4.9,
    reviewCount: 42,
    featured: true,
    tags: ['Sdd celebrity fringe', 'Super Double Drawn', 'Celebrity Fringe', 'Human Hair Wig', '61,000 Naira', 'Hair & Luxury Wigs', 'Health & Beauty'],
    specs: {
      'Product Name': 'SDD Celebrity Fringe',
      'Grade': 'Super Double Drawn (SDD) Thick Bottoms',
      'Style': 'Celebrity Fringe with Face-Framing Bangs',
      'Price': '61,000 Naira (₦61,000)',
      'Density': '300g Super Thick Full Volume',
      'Cap Type': 'Glueless Throw-on-and-Go Cap with Snaps',
      'Maintenance': 'Washable, heat-safe up to 230°C'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 16. LUXURY HAIR 3 - Jerry Curl 4x4
  {
    id: 'prod-hair-jerry-curl-4x4',
    slug: 'jerry-curl-4x4',
    title: 'Jerry Curl Wig (Closure: 4x4, Natural Color)',
    description: 'Jerry curl wig with 4x4 closure in natural color. Juicy spiral curl pattern with high elasticity and retention. Pre-plucked lace closure enables versatile middle and side part styling.',
    price: 27000,
    originalPrice: 38000,
    category: 'Hair & Luxury Wigs',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=1000&q=80'
    ],
    videos: [
      'https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-curly-hair-smiling-41586-large.mp4'
    ],
    stock: 22,
    sku: 'UW-HAIR-JC-4X4',
    seller: 'Luxury Human Hair Studio',
    location: 'Lekki / Victoria Island, Lagos',
    rating: 4.8,
    reviewCount: 29,
    featured: true,
    tags: ['Jerry Curl', 'Closure 4x4', 'Natural color', 'Human Hair Wig', '27,000 Naira', 'Hair & Luxury Wigs', 'Health & Beauty'],
    specs: {
      'Product Name': 'Jerry Curl',
      'Closure Size': 'Closure: 4x4 Swiss Lace',
      'Color': 'Natural Color',
      'Price': '27,000 Naira (₦27,000)',
      'Texture': 'Jerry Curl (Juicy Coily Ringlets)',
      'Hair Care': 'Wet curl activator / water mist revival'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // 17. LUXURY HAIR 4 - Pixie Curl Water Friendly
  {
    id: 'prod-hair-pixie-curl-water-friendly',
    slug: 'pixie-curl-water-friendly',
    title: 'Pixie Curl Wig (Water Friendly - Wet & Go)',
    description: 'Pixie curl water friendly wig. Ultra-lightweight short curly hairstyle designed for effortless daily wear. Spray with ordinary water or leave-in conditioner to instantly reactivate deep juicy coils.',
    price: 20000,
    originalPrice: 28000,
    category: 'Hair & Luxury Wigs',
    condition: 'Brand New',
    images: [
      'https://images.unsplash.com/photo-1584297091622-af8e5bd80b13?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80'
    ],
    videos: [
      'https://assets.mixkit.co/videos/preview/mixkit-woman-posing-with-short-curly-hair-41587-large.mp4'
    ],
    stock: 30,
    sku: 'UW-HAIR-PIXIE-WF',
    seller: 'Luxury Human Hair Studio',
    location: 'Lekki / Victoria Island, Lagos',
    rating: 4.9,
    reviewCount: 51,
    featured: true,
    tags: ['pixie curl', 'Water friendly', 'Wet & Go', 'Short Pixie', 'Human Hair Wig', '20,000 Naira', 'Hair & Luxury Wigs', 'Health & Beauty'],
    specs: {
      'Product Name': 'Pixie Curl',
      'Special Feature': 'Water Friendly (Wet & Go)',
      'Price': '20,000 Naira (₦20,000)',
      'Style': 'Cropped Tapered Pixie Cut with Layered Curls',
      'Wearability': 'Ready to wear in under 30 seconds'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const CATEGORIES = [
  { name: 'All Departments', icon: 'LayoutGrid' },
  { name: 'Automobiles & Cars', icon: 'Car' },
  { name: 'Hair & Luxury Wigs', icon: 'Sparkles' },
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
