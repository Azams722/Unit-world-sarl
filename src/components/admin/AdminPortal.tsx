import React, { useState } from 'react';
import { 
  X, 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Settings, 
  Truck, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  Check, 
  RefreshCw, 
  Eye, 
  Building, 
  Sliders, 
  Image as ImageIcon, 
  Tag, 
  Star, 
  ListPlus, 
  ArrowUp, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  UserCheck, 
  UserPlus, 
  EyeOff, 
  Award, 
  Layers,
  Users,
  Upload,
  Mail,
  Phone,
  ExternalLink,
  Film
} from 'lucide-react';
import { Product, Order, GatewaySettings, BrandSettings, OrderStatus, AdminUser, UserProfile } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CATEGORIES } from '../../data/initialProducts';
import { UnitworldLogo } from '../common/UnitworldLogo';
import { DEFAULT_BRAND_LOGO } from '../../firebase';
import { processMediaFile } from '../../utils/mediaStorage';
import { MediaViewer } from '../common/MediaViewer';
import { MediaUploaderModal } from './MediaUploaderModal';

const PRESET_IMAGE_ASSETS = [
  { label: '2025 Land Cruiser VXR Front', url: '/assets/images/car_landcruiser_vxr_1790462842346.jpg' },
  { label: '2021 Highlander XSE Exterior', url: '/assets/images/car_highlander_xse_1790462851011.jpg' },
  { label: '2017 Highlander Limited Luxury', url: '/assets/images/car_highlander_limited_1790462852222.jpg' },
  { label: '2017 Lexus RX350 Luxury', url: '/assets/images/car_lexus_rx350_1790462861358.jpg' },
  { label: '2010 Toyota Camry Toks', url: '/assets/images/car_camry_2010_1790462872857.jpg' },
  { label: 'Indomie Chicken Flavor Carton', url: '/assets/images/jumia_indomie_chicken_carton.jpg' },
  { label: 'Oraimo 30000mAh Power Bank', url: '/assets/images/jumia_oraimo_powerbank_30000mah.jpg' },
  { label: 'Oraimo Watch 5 Lite Smartwatch', url: '/assets/images/jumia_oraimo_smartwatch.jpg' },
  { label: 'Binatone 18" Standing Fan', url: '/assets/images/jumia_electric_standing_fan.jpg' },
  { label: 'Silver Crest 4500W Blender', url: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Itel A70 128GB Smartphone', url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80' },
  { label: 'Nivea Men 72H Roll-On 3-Pack', url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80' },
  { label: 'Golden Penny Soya Oil 5L', url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Nestle Milo Refill Pack 800g', url: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&w=800&q=80' },
  { label: 'Dettol Disinfectant Liquid 1L', url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80' },
  { label: 'Benue Farm Fresh Yam Tubers', url: '/assets/images/real_benue_yam_tubers_1790463596532.jpg' },
  { label: 'Pure Delta Palm Oil 25L Keg', url: '/assets/images/delta_palm_oil_keg_1790463610040.jpg' },
  { label: '50kg Royal Stallion Rice Bag', url: '/assets/images/royal_stallion_rice_1790463620369.jpg' },
  { label: 'Olive Ribbed 2-Piece Set', url: '/assets/images/olive_twopiece_set_1790463639851.jpg' },
  { label: 'Patchwork Resort Set', url: '/assets/images/patchwork_resort_set_1790463649928.jpg' },
  { label: 'Monochrome Split Set', url: '/assets/images/monochrome_split_set_1790463659716.jpg' },
  { label: 'Khaki Fleece Shorts', url: '/assets/images/fleece_shorts_khaki_1790463670407.jpg' },
  { label: 'Striped Knit Polo & Shorts', url: '/assets/images/striped_knit_set_1790463679741.jpg' },
  { label: 'iPhone 16 Pro Max Desert', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sony Bravia 4K 65-Inch TV', url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Luxury 5x5 Bounce Human Hair', url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1000&q=80' },
  { label: 'SDD Celebrity Fringe Human Hair', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Jerry Curl 4x4 Natural Color', url: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Pixie Curl Water Friendly', url: 'https://images.unsplash.com/photo-1584297091622-af8e5bd80b13?auto=format&fit=crop&w=1000&q=80' },
];

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  users: UserProfile[];
  gatewaySettings: GatewaySettings;
  brandSettings: BrandSettings;
  admins: AdminUser[];
  onCreateProduct: (product: Product) => Promise<void>;
  onUpdateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (productId: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => Promise<void>;
  onSaveGatewaySettings: (settings: GatewaySettings) => Promise<void>;
  onSaveBrandSettings: (settings: BrandSettings) => Promise<void>;
  onSyncCatalogToDb: () => Promise<void>;
  onAddAdmin: (admin: AdminUser) => Promise<void>;
  onRemoveAdmin: (adminId: string) => Promise<void>;
  onToggleAdminStatus: (adminId: string, isActive: boolean) => Promise<void>;
  onMakeCurrentUserAdmin?: () => void;
  onUpdateUser?: (updated: UserProfile) => Promise<void>;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  users,
  gatewaySettings,
  brandSettings,
  admins,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onSaveGatewaySettings,
  onSaveBrandSettings,
  onSyncCatalogToDb,
  onAddAdmin,
  onRemoveAdmin,
  onToggleAdminStatus,
  onMakeCurrentUserAdmin,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'media' | 'orders' | 'users' | 'admins' | 'settings'>('products');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');
  const [isBatchMediaOpen, setIsBatchMediaOpen] = useState(false);
  const [batchMediaInitialProduct, setBatchMediaInitialProduct] = useState<string | undefined>(undefined);
  const [selectedMediaProductId, setSelectedMediaProductId] = useState<string>('');
  const [mediaTabStatus, setMediaTabStatus] = useState<string | null>(null);
  const [mediaTabUploading, setMediaTabUploading] = useState(false);

  // User management states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'all' | 'customer' | 'admin'>('all');
  const [selectedUserForModal, setSelectedUserForModal] = useState<UserProfile | null>(null);
  const [userSuccessMsg, setUserSuccessMsg] = useState('');

  // Product CRUD states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Set of field keys explicitly omitted by admin for the active product
  const [omittedFields, setOmittedFields] = useState<Set<string>>(new Set());

  // Form field states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Automobiles & Cars');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [formCustomCategory, setFormCustomCategory] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(0);
  const [formStock, setFormStock] = useState<number>(1);
  const [formCondition, setFormCondition] = useState<string>('Registered');
  const [formDescription, setFormDescription] = useState('');
  const [formSeller, setFormSeller] = useState('Unitworld Direct');
  const [formLocation, setFormLocation] = useState('Victoria Island, Lagos');
  const [formSettlement, setFormSettlement] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formWarranty, setFormWarranty] = useState('100% Escrow Protected by Unitworld Sarl');
  const [formFeatured, setFormFeatured] = useState(true);
  const [formRating, setFormRating] = useState<number>(5.0);
  const [formReviewCount, setFormReviewCount] = useState<number>(1);

  // Gallery images
  const [formImages, setFormImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Tags
  const [formTags, setFormTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');

  // Specs
  const [formSpecs, setFormSpecs] = useState<{ id: string; key: string; value: string }[]>([]);

  // Custom attributes
  const [formCustomAttributes, setFormCustomAttributes] = useState<{ id: string; key: string; value: string }[]>([]);

  // Add Admin form states
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<AdminUser['role']>('catalog_manager');
  const [newAdminDept, setNewAdminDept] = useState('Inventory & Catalog');
  const [adminSaving, setAdminSaving] = useState(false);

  // Gateway Settings
  const [paystackKey, setPaystackKey] = useState(gatewaySettings.paystackPublicKey);
  const [paystackActive, setPaystackActive] = useState(gatewaySettings.paystackEnabled);
  const [bankName, setBankName] = useState(gatewaySettings.bankAccountDetails.bankName);
  const [accountName, setAccountName] = useState(gatewaySettings.bankAccountDetails.accountName);
  const [accountNumber, setAccountNumber] = useState(gatewaySettings.bankAccountDetails.accountNumber);

  // Brand Settings
  const [brandLogoUrl, setBrandLogoUrl] = useState(brandSettings.logoUrl || DEFAULT_BRAND_LOGO);
  const [brandNameState, setBrandNameState] = useState(brandSettings.brandName);
  const [brandTagline, setBrandTagline] = useState(brandSettings.tagline);
  const [brandPhone, setBrandPhone] = useState(brandSettings.supportPhone);
  const [brandEmail, setBrandEmail] = useState(brandSettings.supportEmail);
  const [brandWhatsApp, setBrandWhatsApp] = useState(brandSettings.whatsappNumber);
  const [brandAddress, setBrandAddress] = useState(brandSettings.address);

  // Order fulfillment state
  const [statusNote, setStatusNote] = useState('');

  if (!isOpen) return null;

  // Toggle Omission for any field
  const toggleOmitField = (fieldName: string) => {
    setOmittedFields((prev) => {
      const next = new Set(prev);
      if (next.has(fieldName)) {
        next.delete(fieldName);
      } else {
        next.add(fieldName);
      }
      return next;
    });
  };

  const isOmitted = (fieldName: string) => omittedFields.has(fieldName);

  const handleSyncCatalog = async () => {
    setIsSyncing(true);
    try {
      await onSyncCatalogToDb();
      setSyncSuccessMsg('All catalog items and verified real product images were successfully synchronized to Firestore database!');
      setTimeout(() => setSyncSuccessMsg(''), 6000);
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveBrandSettings({
      logoUrl: brandLogoUrl || DEFAULT_BRAND_LOGO,
      brandName: brandNameState,
      tagline: brandTagline,
      supportPhone: brandPhone,
      supportEmail: brandEmail,
      whatsappNumber: brandWhatsApp,
      address: brandAddress,
    });
    setSyncSuccessMsg('Official Unitworld brand settings & logo were saved to Firebase database!');
    setTimeout(() => setSyncSuccessMsg(''), 5000);
  };

  // Add new admin handler
  const handleAddNewAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim() || !newAdminName.trim()) return;

    setAdminSaving(true);
    const newAdminObj: AdminUser = {
      id: `admin-${Date.now()}`,
      email: newAdminEmail.trim().toLowerCase(),
      name: newAdminName.trim(),
      role: newAdminRole,
      department: newAdminDept.trim() || 'General Operations',
      addedAt: new Date().toISOString(),
      isActive: true,
    };

    try {
      await onAddAdmin(newAdminObj);
      setSyncSuccessMsg(`Administrator ${newAdminObj.name} (${newAdminObj.email}) granted ${newAdminObj.role} privileges!`);
      setNewAdminName('');
      setNewAdminEmail('');
      setTimeout(() => setSyncSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Failed to add admin:', err);
    } finally {
      setAdminSaving(false);
    }
  };

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'processing').length;
  const lowStockCount = products.filter(p => p.stock !== undefined && p.stock <= 2).length;
  const totalInventoryUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);

  // Category breakdown
  const categorySales: Record<string, number> = {};
  orders.forEach(o => {
    o.items.forEach(item => {
      categorySales[item.category] = (categorySales[item.category] || 0) + item.price * item.quantity;
    });
  });

  // Images helpers
  const handleAddImage = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!formImages.includes(trimmed)) {
      setFormImages(prev => [...prev, trimmed]);
    }
    setNewImageUrl('');
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      try {
        const processed = await processMediaFile(file);
        if (processed && processed.url) {
          setFormImages((prev) => prev.includes(processed.url) ? prev : [...prev, processed.url]);
        }
      } catch (err) {
        console.error('Failed to compress and process image:', err);
      }
    }
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setFormImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index <= 0) return;
    setFormImages(prev => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
  };

  const handleMoveImage = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= formImages.length) return;
    setFormImages(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  // Tags helpers
  const handleAddTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    if (!formTags.includes(trimmed)) {
      setFormTags(prev => [...prev, trimmed]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const handleClearAllTags = () => {
    setFormTags([]);
    toggleOmitField('tags');
  };

  // Dynamic Specs helpers
  const handleAddSpec = (key = '', value = '') => {
    setFormSpecs(prev => [
      ...prev,
      { id: `spec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, key, value }
    ]);
  };

  const handleUpdateSpec = (id: string, field: 'key' | 'value', val: string) => {
    setFormSpecs(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const handleRemoveSpec = (id: string) => {
    setFormSpecs(prev => prev.filter(s => s.id !== id));
  };

  const handleClearAllSpecs = () => {
    setFormSpecs([]);
    toggleOmitField('specs');
  };

  // Custom attributes helpers
  const handleAddCustomAttribute = () => {
    setFormCustomAttributes(prev => [
      ...prev,
      { id: `attr-${Date.now()}`, key: '', value: '' }
    ]);
  };

  const handleUpdateCustomAttribute = (id: string, field: 'key' | 'value', val: string) => {
    setFormCustomAttributes(prev => prev.map(a => a.id === id ? { ...a, [field]: val } : a));
  };

  const handleRemoveCustomAttribute = (id: string) => {
    setFormCustomAttributes(prev => prev.filter(a => a.id !== id));
  };

  const handleGenerateSku = () => {
    const prefix = isCustomCategory && formCustomCategory 
      ? formCustomCategory.slice(0, 3).toUpperCase() 
      : formCategory.slice(0, 3).toUpperCase();
    setFormSku(`UW-${prefix}-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const handleStartCreate = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormCategory('Automobiles & Cars');
    setIsCustomCategory(false);
    setFormCustomCategory('');
    setFormSku(`UW-CAR-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormPrice(0);
    setFormOriginalPrice(0);
    setFormStock(1);
    setFormCondition('Registered');
    setFormDescription('');
    setFormSeller('Unitworld Direct Autos');
    setFormLocation('Victoria Island, Lagos');
    setFormSettlement('');
    setFormBrand('');
    setFormWarranty('100% Escrow Protected by Unitworld Sarl');
    setFormFeatured(true);
    setFormRating(5.0);
    setFormReviewCount(1);
    setFormImages(['/assets/images/car_landcruiser_vxr_1790462842346.jpg']);
    setNewImageUrl('');
    setFormTags(['Verified', 'In Stock']);
    setNewTagInput('');
    setFormSpecs([
      { id: `spec-1-${Date.now()}`, key: 'Condition', value: 'Physical inspection verified, grade A+' },
      { id: `spec-2-${Date.now()}`, key: 'Warranty & Escrow', value: '100% Escrow Protected by Unitworld Sarl' }
    ]);
    setFormCustomAttributes([]);

    // Default omitted fields for fresh creation
    setOmittedFields(new Set(['settlementFee', 'brand', 'originalPrice']));
    setIsCreatingProduct(true);
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod);
    setFormTitle(prod.title || '');
    
    const isStd = CATEGORIES.some(c => c.name === prod.category && c.name !== 'All Departments');
    if (isStd) {
      setFormCategory(prod.category);
      setIsCustomCategory(false);
      setFormCustomCategory('');
    } else {
      setFormCategory('Custom');
      setIsCustomCategory(true);
      setFormCustomCategory(prod.category || '');
    }

    setFormSku(prod.sku || `UW-${Date.now().toString().slice(-5)}`);
    setFormPrice(prod.price || 0);
    setFormOriginalPrice(prod.originalPrice || 0);
    setFormStock(prod.stock ?? 1);
    setFormCondition(prod.condition || 'Brand New');
    setFormDescription(prod.description || '');
    setFormSeller(prod.seller || 'Unitworld Direct');
    setFormLocation(prod.location || '');
    setFormSettlement(prod.settlementFee || '');
    setFormBrand(prod.brand || '');
    setFormWarranty(prod.warranty || '100% Escrow Protected by Unitworld Sarl');
    setFormFeatured(prod.featured ?? false);
    setFormRating(prod.rating ?? 5.0);
    setFormReviewCount(prod.reviewCount ?? 1);

    // Images gallery
    setFormImages(prod.images && prod.images.length > 0 ? [...prod.images] : []);
    setNewImageUrl('');

    // Tags
    setFormTags(prod.tags && prod.tags.length > 0 ? [...prod.tags] : []);
    setNewTagInput('');

    // Specs
    if (prod.specs && Object.keys(prod.specs).length > 0) {
      const specsArr = Object.entries(prod.specs).map(([k, v], idx) => ({
        id: `spec-${idx}-${Date.now()}`,
        key: k,
        value: v
      }));
      setFormSpecs(specsArr);
    } else {
      setFormSpecs([]);
    }

    setFormCustomAttributes([]);

    // Set omitted fields: either from prod.omittedFields, or auto-detect undefined/empty optional fields
    const omitted = new Set<string>(prod.omittedFields || []);
    if (!prod.originalPrice) omitted.add('originalPrice');
    if (!prod.settlementFee) omitted.add('settlementFee');
    if (!prod.location) omitted.add('location');
    if (!prod.brand) omitted.add('brand');
    if (!prod.warranty) omitted.add('warranty');
    if (!prod.description) omitted.add('description');
    if (!prod.condition) omitted.add('condition');
    if (prod.stock === undefined) omitted.add('stock');
    if (prod.rating === undefined) omitted.add('rating');
    if (!prod.tags || prod.tags.length === 0) omitted.add('tags');
    if (!prod.specs || Object.keys(prod.specs).length === 0) omitted.add('specs');

    setOmittedFields(omitted);
    setIsCreatingProduct(false);
  };

  const handleSaveProductForm = async (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const finalCategory = isCustomCategory && formCustomCategory.trim() 
      ? formCustomCategory.trim() 
      : formCategory;

    // Assemble specs record (omit empty rows)
    const specsRecord: Record<string, string> = {};
    if (!omittedFields.has('specs')) {
      formSpecs.forEach(s => {
        const k = s.key.trim();
        const v = s.value.trim();
        if (k && v) {
          specsRecord[k] = v;
        }
      });
      // also merge custom attributes
      formCustomAttributes.forEach(a => {
        const k = a.key.trim();
        const v = a.value.trim();
        if (k && v) {
          specsRecord[k] = v;
        }
      });
    }

    const finalImages = formImages.length > 0 
      ? formImages 
      : ['/assets/images/hero_marketplace_jumia_1790462828695.jpg'];

    const omittedArray = Array.from(omittedFields);

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      title: formTitle.trim(),
      category: finalCategory,
      price: Number(formPrice),
      images: finalImages,
      omittedFields: omittedArray,

      // Include or omit each field based on user's omission choice
      sku: !omittedFields.has('sku') && formSku.trim() ? formSku.trim() : undefined,
      originalPrice: !omittedFields.has('originalPrice') && Number(formOriginalPrice) > 0 ? Number(formOriginalPrice) : undefined,
      stock: !omittedFields.has('stock') ? Number(formStock) : undefined,
      condition: !omittedFields.has('condition') && formCondition ? formCondition : undefined,
      description: !omittedFields.has('description') && formDescription.trim() ? formDescription.trim() : undefined,
      seller: !omittedFields.has('seller') && formSeller.trim() ? formSeller.trim() : undefined,
      location: !omittedFields.has('location') && formLocation.trim() ? formLocation.trim() : undefined,
      settlementFee: !omittedFields.has('settlementFee') && formSettlement.trim() ? formSettlement.trim() : undefined,
      brand: !omittedFields.has('brand') && formBrand.trim() ? formBrand.trim() : undefined,
      warranty: !omittedFields.has('warranty') && formWarranty.trim() ? formWarranty.trim() : undefined,
      featured: !omittedFields.has('featured') ? formFeatured : undefined,
      rating: !omittedFields.has('rating') ? Number(formRating) : undefined,
      reviewCount: !omittedFields.has('reviewCount') ? Number(formReviewCount) : undefined,
      tags: !omittedFields.has('tags') && formTags.length > 0 ? formTags : undefined,
      specs: !omittedFields.has('specs') && Object.keys(specsRecord).length > 0 ? specsRecord : undefined,

      createdAt: editingProduct ? editingProduct.createdAt : now,
      updatedAt: now,
    };

    if (editingProduct) {
      await onUpdateProduct(editingProduct.id, productPayload);
      setSyncSuccessMsg(`Product "${formTitle}" updated with full field modifications and omitted fields removed in Firestore!`);
      setEditingProduct(null);
    } else {
      await onCreateProduct(productPayload);
      setSyncSuccessMsg(`Product "${formTitle}" created and saved to Firestore database!`);
      setIsCreatingProduct(false);
    }
    setTimeout(() => setSyncSuccessMsg(''), 5000);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: GatewaySettings = {
      paystackPublicKey: paystackKey,
      paystackEnabled: paystackActive,
      currency: 'NGN',
      bankAccountDetails: {
        bankName,
        accountName,
        accountNumber,
      }
    };
    await onSaveGatewaySettings(updated);
    setSyncSuccessMsg('Paystack Gateway & Escrow Settings updated in Firestore!');
    setTimeout(() => setSyncSuccessMsg(''), 5000);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
                          (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()));
    const matchesCat = selectedCategoryFilter === 'All' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-6xl w-full shadow-2xl overflow-hidden border border-slate-200 my-4 flex flex-col h-[94vh]">
        {/* Top Navbar of ERP */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500 text-slate-950 flex items-center justify-center font-black">
              ERP
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight flex items-center gap-2">
                <span>Unitworld Sarl</span>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded-full font-bold">
                  Management Center
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Products (CRUD & Omissions), Galleries, Admins & Staff, Logistics, and Paystack Gateway
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close ERP"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notification Banner */}
        {syncSuccessMsg && (
          <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {syncSuccessMsg}
            </span>
            <button onClick={() => setSyncSuccessMsg('')} className="p-0.5 hover:bg-emerald-700 rounded cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab Navigation Navigation Bar (5 TABS) */}
        <div className="flex border-b border-slate-200 bg-slate-100 px-4 sm:px-6 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('products');
              setEditingProduct(null);
              setIsCreatingProduct(false);
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#0284C7] text-[#0284C7] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('media');
              setEditingProduct(null);
              setIsCreatingProduct(false);
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'media'
                ? 'border-[#0284C7] text-[#0284C7] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4 text-amber-500" />
            <span>Upload Media & Galleries</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('orders');
              setEditingProduct(null);
              setIsCreatingProduct(false);
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#0284C7] text-[#0284C7] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders & Dispatch ({orders.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('users');
              setEditingProduct(null);
              setIsCreatingProduct(false);
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'users'
                ? 'border-[#0284C7] text-[#0284C7] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-sky-600" />
            <span>Users & Signups ({users.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('admins');
              setEditingProduct(null);
              setIsCreatingProduct(false);
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'admins'
                ? 'border-[#0284C7] text-[#0284C7] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Staff & Admin Roles ({admins.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('analytics');
              setEditingProduct(null);
              setIsCreatingProduct(false);
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-[#0284C7] text-[#0284C7] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Analytics & GMV</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('settings');
              setEditingProduct(null);
              setIsCreatingProduct(false);
            }}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[#0284C7] text-[#0284C7] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Brand Logo & Paystack</span>
          </button>
        </div>

        {/* ERP Main Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50">
          {/* TAB: MEDIA VAULT & GALLERIES (ADMIN BACKEND ONLY) */}
          {activeTab === 'media' && (() => {
            const currentSelectedProduct = products.find(p => p.id === (selectedMediaProductId || (products[0]?.id || ''))) || products[0];

            const handleMediaTabUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
              const files = e.target.files;
              if (!files || files.length === 0 || !currentSelectedProduct) return;

              setMediaTabUploading(true);
              setMediaTabStatus(`Processing & compressing ${files.length} media file(s)...`);

              const newImages = [...(currentSelectedProduct.images || [])];
              const newVideos = [...(currentSelectedProduct.videos || [])];

              try {
                for (const file of Array.from(files)) {
                  setMediaTabStatus(`Compressing and storing ${file.name}...`);
                  const processed = await processMediaFile(file);
                  if (processed.isVideo) {
                    if (!newVideos.includes(processed.url)) newVideos.unshift(processed.url);
                  } else {
                    if (!newImages.includes(processed.url)) newImages.unshift(processed.url);
                  }
                }

                await onUpdateProduct(currentSelectedProduct.id, {
                  images: newImages,
                  videos: newVideos,
                  updatedAt: new Date().toISOString()
                });

                setMediaTabStatus(`Successfully uploaded to ${currentSelectedProduct.title}!`);
                setTimeout(() => setMediaTabStatus(null), 4000);
              } catch (err: any) {
                console.error('Media upload error:', err);
                setMediaTabStatus(`Error: ${err?.message || 'Failed to upload media'}`);
              } finally {
                setMediaTabUploading(false);
                e.target.value = '';
              }
            };

            const handleRemoveMediaItem = async (urlToRemove: string, isVideo: boolean) => {
              if (!currentSelectedProduct) return;
              const newImages = (currentSelectedProduct.images || []).filter(u => u !== urlToRemove);
              const newVideos = (currentSelectedProduct.videos || []).filter(u => u !== urlToRemove);

              await onUpdateProduct(currentSelectedProduct.id, {
                images: newImages,
                videos: newVideos,
                updatedAt: new Date().toISOString()
              });
              setMediaTabStatus('Removed media item from product.');
              setTimeout(() => setMediaTabStatus(null), 3000);
            };

            const handleMakeCoverPhoto = async (imageUrl: string) => {
              if (!currentSelectedProduct) return;
              const currentImgs = (currentSelectedProduct.images || []).filter(u => u !== imageUrl);
              const newImages = [imageUrl, ...currentImgs];

              await onUpdateProduct(currentSelectedProduct.id, {
                images: newImages,
                updatedAt: new Date().toISOString()
              });
              setMediaTabStatus('Cover photo updated.');
              setTimeout(() => setMediaTabStatus(null), 3000);
            };

            return (
              <div className="space-y-6">
                {/* Header card */}
                <div className="p-5 bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Upload className="w-6 h-6 text-amber-400" />
                      <h3 className="text-base font-black uppercase tracking-tight">
                        Backend Media Vault & Gallery Manager (Admins Only)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-300 max-w-xl">
                      Upload high-resolution WhatsApp vehicle pictures, fashion recordings, and raw foods. Photos are automatically compressed to ~120KB JPEG for fast database storage, and videos are streamed smoothly.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setBatchMediaInitialProduct(currentSelectedProduct?.id);
                      setIsBatchMediaOpen(true);
                    }}
                    className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Launch Batch Uploader Modal</span>
                  </button>
                </div>

                {/* Product Selection Bar */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="w-full sm:w-auto flex-1">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Select Product to Manage Media:
                      </label>
                      <select
                        value={currentSelectedProduct?.id || ''}
                        onChange={(e) => setSelectedMediaProductId(e.target.value)}
                        className="w-full max-w-xl p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            [{p.category}] {p.title} — {formatCurrency(p.price)} ({p.images?.length || 0} photos, {p.videos?.length || 0} videos)
                          </option>
                        ))}
                      </select>
                    </div>

                    {currentSelectedProduct && (
                      <div className="text-xs text-slate-500 sm:text-right">
                        <span className="font-mono text-slate-800 font-bold block">SKU: {currentSelectedProduct.sku || 'N/A'}</span>
                        <span className="text-[11px]">
                          {(currentSelectedProduct.images?.length || 0) + (currentSelectedProduct.videos?.length || 0)} Total Media Files
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {currentSelectedProduct && (
                  <div className="space-y-6">
                    {/* Upload Card */}
                    <div className="p-6 bg-white rounded-2xl border-2 border-dashed border-sky-300 hover:border-sky-500 bg-sky-50/20 transition-all text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">
                          Upload Photos & Videos for "{currentSelectedProduct.title}"
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                          Select multiple mobile images (JPG, PNG, WEBP) or recordings (MP4, WEBM). Files will be compressed & stored permanently in the database.
                        </p>
                      </div>

                      <label className="inline-flex items-center gap-2 py-2.5 px-5 bg-[#0284C7] hover:bg-[#0369a1] text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Choose Photos / Videos from Device</span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          disabled={mediaTabUploading}
                          onChange={handleMediaTabUpload}
                          className="hidden"
                        />
                      </label>

                      {mediaTabStatus && (
                        <div className="text-xs font-bold text-sky-800 bg-sky-100/80 py-2 px-4 rounded-lg max-w-md mx-auto animate-pulse">
                          {mediaTabStatus}
                        </div>
                      )}
                    </div>

                    {/* Existing Gallery Display */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-sky-600" />
                          <span>Current Product Gallery ({currentSelectedProduct.images?.length || 0} Photos, {currentSelectedProduct.videos?.length || 0} Videos)</span>
                        </h4>
                        <span className="text-[11px] text-slate-500">
                          Photo #1 is the Primary Cover display shown on marketplace cards.
                        </span>
                      </div>

                      {((currentSelectedProduct.images?.length || 0) + (currentSelectedProduct.videos?.length || 0) === 0) ? (
                        <div className="p-8 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl">
                          No media files uploaded yet for this product. Use the uploader above.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {/* Videos first */}
                          {(currentSelectedProduct.videos || []).map((videoUrl, vIdx) => (
                            <div key={`vid-${vIdx}`} className="bg-slate-900 border border-slate-300 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
                              <div className="relative aspect-[4/3] bg-black">
                                <MediaViewer url={videoUrl} isVideo={true} className="w-full h-full object-contain" />
                                <span className="absolute top-1.5 left-1.5 bg-red-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
                                  Video #{vIdx + 1}
                                </span>
                              </div>
                              <div className="p-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                                <span className="text-[10px] text-slate-500 font-semibold truncate">Video Showcase</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMediaItem(videoUrl, true)}
                                  className="text-rose-600 hover:text-rose-800 p-1 text-xs cursor-pointer"
                                  title="Remove video"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Images */}
                          {(currentSelectedProduct.images || []).map((imgUrl, imgIdx) => (
                            <div key={`img-${imgIdx}`} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
                              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                                <MediaViewer url={imgUrl} alt={`Photo ${imgIdx + 1}`} className="w-full h-full object-cover" />
                                {imgIdx === 0 ? (
                                  <span className="absolute top-1.5 left-1.5 bg-[#0284C7] text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow">
                                    Primary Cover
                                  </span>
                                ) : (
                                  <span className="absolute top-1.5 left-1.5 bg-black/70 text-white font-bold text-[9px] px-1.5 py-0.5 rounded">
                                    #{imgIdx + 1}
                                  </span>
                                )}
                              </div>
                              <div className="p-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                                {imgIdx > 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => handleMakeCoverPhoto(imgUrl)}
                                    className="text-[10px] text-sky-700 font-bold hover:underline cursor-pointer"
                                  >
                                    Set as Cover
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                                    <Check className="w-3 h-3" /> Cover
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMediaItem(imgUrl, false)}
                                  className="text-rose-600 hover:text-rose-800 p-1 text-xs cursor-pointer"
                                  title="Remove photo"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 1: PRODUCT INVENTORY CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {(isCreatingProduct || editingProduct) ? (
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <span>{editingProduct ? `Edit Product: ${editingProduct.title}` : 'Add New Product as Admin'}</span>
                        <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-mono">
                          {editingProduct?.sku || 'NEW'}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        You can edit every single field below and omit those you don't need with 1 click.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setIsCreatingProduct(false);
                      }}
                      className="py-1.5 px-3 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs font-bold text-slate-700 cursor-pointer"
                    >
                      Cancel & Return
                    </button>
                  </div>

                  <form onSubmit={handleSaveProductForm} className="space-y-6 text-xs">
                    {/* TOP ACTIVE FIELDS & OMISSION CONTROL CENTER */}
                    <div className="p-4 bg-sky-50/70 border border-sky-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-[#0284C7]" />
                          Product Field Inclusions & Omission Manager
                        </span>
                        <span className="text-[11px] text-sky-800 font-semibold">
                          Click any pill to toggle Include / Omit
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { key: 'description', label: 'Description' },
                          { key: 'originalPrice', label: 'Strike-through Price' },
                          { key: 'condition', label: 'Item Condition' },
                          { key: 'stock', label: 'Stock Quantity' },
                          { key: 'sku', label: 'SKU Code' },
                          { key: 'seller', label: 'Merchant / Seller' },
                          { key: 'location', label: 'Inspection Hub / Location' },
                          { key: 'settlementFee', label: 'Settlement Fee' },
                          { key: 'brand', label: 'Brand / Manufacturer' },
                          { key: 'warranty', label: 'Warranty Policy' },
                          { key: 'rating', label: 'Star Rating & Reviews' },
                          { key: 'featured', label: 'VIP Showcase Spotlight' },
                          { key: 'tags', label: 'Tags & Badges' },
                          { key: 'specs', label: 'Technical Specifications' },
                        ].map((field) => {
                          const omitted = isOmitted(field.key);
                          return (
                            <button
                              key={field.key}
                              type="button"
                              onClick={() => toggleOmitField(field.key)}
                              className={`py-1 px-2.5 rounded-lg font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer border ${
                                omitted
                                  ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                              }`}
                            >
                              {omitted ? (
                                <>
                                  <EyeOff className="w-3 h-3 text-rose-500" />
                                  <span className="line-through">{field.label} (Omitted)</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>{field.label} (Included)</span>
                                </>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* CARD 1: CORE ESSENTIALS */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-[#0284C7]" />
                          1. Core Product Identity & Category
                        </span>
                        {!isOmitted('featured') && (
                          <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-slate-700">
                            <input
                              type="checkbox"
                              checked={formFeatured}
                              onChange={(e) => setFormFeatured(e.target.checked)}
                              className="w-4 h-4 text-[#0284C7] rounded"
                            />
                            <span>Feature on Homepage Spotlight</span>
                          </label>
                        )}
                      </div>

                      {/* Title (Required) */}
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                        <input
                          type="text"
                          required
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="e.g. TOYOTA LAND CRUISER 2025 MODEL VXR V6 TWIN TURBO"
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Category */}
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Department Category *</label>
                          <select
                            value={isCustomCategory ? 'Custom' : formCategory}
                            onChange={(e) => {
                              if (e.target.value === 'Custom') {
                                setIsCustomCategory(true);
                              } else {
                                setIsCustomCategory(false);
                                setFormCategory(e.target.value);
                              }
                            }}
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                          >
                            {CATEGORIES.filter(c => c.name !== 'All Departments').map(c => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                            <option value="Custom">+ Custom Category...</option>
                          </select>
                          {isCustomCategory && (
                            <input
                              type="text"
                              required
                              placeholder="Enter custom category name"
                              value={formCustomCategory}
                              onChange={(e) => setFormCustomCategory(e.target.value)}
                              className="mt-1.5 w-full p-2 bg-white border border-sky-300 rounded-lg text-xs"
                            />
                          )}
                        </div>

                        {/* Condition (Omittable) */}
                        <div>
                          {isOmitted('condition') ? (
                            <div className="p-2 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-between">
                              <span className="text-slate-400 italic">Condition omitted</span>
                              <button type="button" onClick={() => toggleOmitField('condition')} className="text-sky-600 font-bold hover:underline">
                                + Include
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-semibold text-slate-700">Item Condition</label>
                                <button type="button" onClick={() => toggleOmitField('condition')} className="text-rose-600 hover:text-rose-800 text-[10px] font-bold">
                                  Omit
                                </button>
                              </div>
                              <select
                                value={formCondition}
                                onChange={(e) => setFormCondition(e.target.value)}
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                              >
                                <option value="Brand New">Brand New</option>
                                <option value="Foreign Used (Tokunbo)">Foreign Used (Tokunbo)</option>
                                <option value="Registered">Registered (Nigeria Used)</option>
                                <option value="Refurbished">Refurbished</option>
                              </select>
                            </div>
                          )}
                        </div>

                        {/* SKU (Omittable) */}
                        <div>
                          {isOmitted('sku') ? (
                            <div className="p-2 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-between">
                              <span className="text-slate-400 italic">SKU Code omitted</span>
                              <button type="button" onClick={() => toggleOmitField('sku')} className="text-sky-600 font-bold hover:underline">
                                + Include
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-semibold text-slate-700">SKU / Item Code</label>
                                <div className="flex items-center gap-2">
                                  <button type="button" onClick={handleGenerateSku} className="text-[10px] text-sky-600 font-bold hover:underline">
                                    Generate
                                  </button>
                                  <button type="button" onClick={() => toggleOmitField('sku')} className="text-rose-600 hover:text-rose-800 text-[10px] font-bold">
                                    Omit
                                  </button>
                                </div>
                              </div>
                              <input
                                type="text"
                                value={formSku}
                                onChange={(e) => setFormSku(e.target.value)}
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Stock Quantity (Omittable) */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          {isOmitted('stock') ? (
                            <div className="p-2 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-between">
                              <span className="text-slate-400 italic">Stock tracking omitted</span>
                              <button type="button" onClick={() => toggleOmitField('stock')} className="text-sky-600 font-bold hover:underline">
                                + Include
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-semibold text-slate-700">Stock Units</label>
                                <button type="button" onClick={() => toggleOmitField('stock')} className="text-rose-600 hover:text-rose-800 text-[10px] font-bold">
                                  Omit
                                </button>
                              </div>
                              <input
                                type="number"
                                min={0}
                                value={formStock}
                                onChange={(e) => setFormStock(Number(e.target.value))}
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                              />
                            </div>
                          )}
                        </div>

                        {/* Star Rating (Omittable) */}
                        <div>
                          {isOmitted('rating') ? (
                            <div className="p-2 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-between">
                              <span className="text-slate-400 italic">Rating omitted</span>
                              <button type="button" onClick={() => toggleOmitField('rating')} className="text-sky-600 font-bold hover:underline">
                                + Include
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-semibold text-slate-700">Star Rating</label>
                                <button type="button" onClick={() => toggleOmitField('rating')} className="text-rose-600 hover:text-rose-800 text-[10px] font-bold">
                                  Omit
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min={1}
                                  max={5}
                                  step={0.1}
                                  value={formRating}
                                  onChange={(e) => setFormRating(Number(e.target.value))}
                                  className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                                />
                                <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Review Count (Omittable) */}
                        <div>
                          {isOmitted('rating') ? null : (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-semibold text-slate-700">Verified Reviews Count</label>
                              </div>
                              <input
                                type="number"
                                min={0}
                                value={formReviewCount}
                                onChange={(e) => setFormReviewCount(Number(e.target.value))}
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description (Omittable) */}
                      <div>
                        {isOmitted('description') ? (
                          <div className="p-2.5 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-between">
                            <span className="text-slate-400 italic">Description omitted from this product</span>
                            <button type="button" onClick={() => toggleOmitField('description')} className="text-sky-600 font-bold hover:underline">
                              + Include Description
                            </button>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="font-semibold text-slate-700">Overview & Description</label>
                              <button type="button" onClick={() => toggleOmitField('description')} className="text-rose-600 hover:text-rose-800 text-[10px] font-bold">
                                Omit
                              </button>
                            </div>
                            <textarea
                              rows={3}
                              value={formDescription}
                              onChange={(e) => setFormDescription(e.target.value)}
                              placeholder="Enter full item description..."
                              className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs leading-relaxed"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CARD 2: PRICING & OMISSIONS */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-4">
                      <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-2 border-b border-slate-200">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        2. Pricing, Strike-Through & Escrow Fee (Edit & Omit)
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Base Price (Required) */}
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Selling Price (₦ Naira) *</label>
                          <input
                            type="number"
                            required
                            min={0}
                            value={formPrice}
                            onChange={(e) => setFormPrice(Number(e.target.value))}
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg font-mono font-black text-slate-900 text-sm"
                          />
                          <p className="text-[10px] text-slate-500 mt-1 font-semibold">
                            Formatted: {formatCurrency(formPrice)}
                          </p>
                        </div>

                        {/* Original Price / Strikethrough (Omittable) */}
                        <div>
                          {isOmitted('originalPrice') ? (
                            <div className="p-2.5 bg-slate-100 rounded-lg border border-dashed border-slate-300 h-full flex flex-col justify-center items-center text-center">
                              <span className="text-slate-400 italic mb-1">Strike-through price omitted</span>
                              <button type="button" onClick={() => toggleOmitField('originalPrice')} className="text-sky-600 font-bold hover:underline">
                                + Include Strike-Through
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-semibold text-slate-700">Strike-through Original Price</label>
                                <button type="button" onClick={() => toggleOmitField('originalPrice')} className="text-rose-600 hover:text-rose-800 text-[10px] font-bold">
                                  Omit
                                </button>
                              </div>
                              <input
                                type="number"
                                min={0}
                                value={formOriginalPrice}
                                onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg font-mono text-xs"
                              />
                              <p className="text-[10px] text-slate-500 mt-1">Shows discount slash price on card</p>
                            </div>
                          )}
                        </div>

                        {/* Settlement Fee (Omittable) */}
                        <div>
                          {isOmitted('settlementFee') ? (
                            <div className="p-2.5 bg-slate-100 rounded-lg border border-dashed border-slate-300 h-full flex flex-col justify-center items-center text-center">
                              <span className="text-slate-400 italic mb-1">Settlement fee omitted</span>
                              <button type="button" onClick={() => toggleOmitField('settlementFee')} className="text-sky-600 font-bold hover:underline">
                                + Include Settlement Fee
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-semibold text-slate-700">Broker Settlement Escrow Fee</label>
                                <button type="button" onClick={() => toggleOmitField('settlementFee')} className="text-rose-600 hover:text-rose-800 text-[10px] font-bold">
                                  Omit
                                </button>
                              </div>
                              <input
                                type="text"
                                value={formSettlement}
                                onChange={(e) => setFormSettlement(e.target.value)}
                                placeholder="e.g. ₦1,000,000 Settlement"
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                              <p className="text-[10px] text-slate-500 mt-1">Special badge for high-ticket vehicle deals</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CARD 3: BRAND, SELLER & LOCATION */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-4">
                      <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5 pb-2 border-b border-slate-200">
                        <Building className="w-3.5 h-3.5 text-amber-600" />
                        3. Merchant, Brand & Location (Edit & Omit)
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Seller (Omittable) */}
                        <div>
                          {isOmitted('seller') ? (
                            <div className="p-2.5 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-between">
                              <span className="text-slate-400 italic">Seller omitted</span>
                              <button type="button" onClick={() => toggleOmitField('seller')} className="text-sky-600 font-bold hover:underline">
                                + Include
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-semibold text-slate-700">Merchant / Seller</label>
                                <button type="button" onClick={() => toggleOmitField('seller')} className="text-rose-600 hover:text-rose-800 text-[10px] font-bold">
                                  Omit
                                </button>
                              </div>
                              <input
                                type="text"
                                value={formSeller}
                                onChange={(e) => setFormSeller(e.target.value)}
                                placeholder="e.g. Unitworld Premium Motors"
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            </div>
                          )}
                        </div>

                        {/* Location (Omittable) */}
                        <div>
                          {isOmitted('location') ? (
                            <div className="p-2.5 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-between">
                              <span className="text-slate-400 italic">Location omitted</span>
                              <button type="button" onClick={() => toggleOmitField('location')} className="text-sky-600 font-bold hover:underline">
                                + Include
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-semibold text-slate-700 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                  Inspection Hub / Location
                                </label>
                                <button type="button" onClick={() => toggleOmitField('location')} className="text-rose-600 hover:text-rose-800 text-[10px] font-bold">
                                  Omit
                                </button>
                              </div>
                              <input
                                type="text"
                                value={formLocation}
                                onChange={(e) => setFormLocation(e.target.value)}
                                placeholder="e.g. Victoria Island, Lagos"
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            </div>
                          )}
                        </div>

                        {/* Brand (Omittable) */}
                        <div>
                          {isOmitted('brand') ? (
                            <div className="p-2.5 bg-slate-100 rounded-lg border border-dashed border-slate-300 flex items-center justify-between">
                              <span className="text-slate-400 italic">Brand omitted</span>
                              <button type="button" onClick={() => toggleOmitField('brand')} className="text-sky-600 font-bold hover:underline">
                                + Include
                              </button>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="font-semibold text-slate-700 flex items-center gap-1">
                                  <Award className="w-3.5 h-3.5 text-sky-600" />
                                  Brand / Manufacturer
                                </label>
                                <button type="button" onClick={() => toggleOmitField('brand')} className="text-rose-600 hover:text-rose-800 text-[10px] font-bold">
                                  Omit
                                </button>
                              </div>
                              <input
                                type="text"
                                value={formBrand}
                                onChange={(e) => setFormBrand(e.target.value)}
                                placeholder="e.g. Toyota, Apple, Unitworld Luxury"
                                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Warranty Policy (Omittable) */}
                      {!isOmitted('warranty') && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="font-semibold text-slate-700">Warranty & Protection Note</label>
                            <button type="button" onClick={() => toggleOmitField('warranty')} className="text-rose-600 hover:text-rose-800 text-[10px] font-bold">
                              Omit
                            </button>
                          </div>
                          <input
                            type="text"
                            value={formWarranty}
                            onChange={(e) => setFormWarranty(e.target.value)}
                            placeholder="e.g. 6 Months Warranty or 100% Escrow Protected"
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      )}
                    </div>

                    {/* CARD 4: PRODUCT PHOTO GALLERY (ADD, REORDER, OMIT) */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <div>
                          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-[#0284C7]" />
                            4. Product Photo Gallery ({formImages.length} Photos)
                          </span>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Photos are displayed in this exact order. Photo #1 is the Primary Cover display.
                          </p>
                        </div>
                        {formImages.length > 0 && (
                          <span className="text-[11px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                            {formImages.length} In Gallery
                          </span>
                        )}
                      </div>

                      {/* Active Gallery Grid */}
                      {formImages.length === 0 ? (
                        <div className="p-5 bg-white border border-dashed border-slate-300 rounded-xl text-center text-slate-400">
                          No photos in gallery. Add a photo URL or click quick presets below.
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {formImages.map((imgUrl, idx) => (
                            <div key={idx} className="relative group bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col justify-between">
                              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                                <img
                                  src={imgUrl}
                                  alt={`Gallery photo ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/assets/images/hero_marketplace_jumia_1790462828695.jpg';
                                  }}
                                />
                                {idx === 0 ? (
                                  <span className="absolute top-1.5 left-1.5 bg-[#0284C7] text-white font-bold text-[9px] px-1.5 py-0.5 rounded shadow-sm">
                                    Cover Photo
                                  </span>
                                ) : (
                                  <span className="absolute top-1.5 left-1.5 bg-black/70 text-white font-bold text-[9px] px-1.5 py-0.5 rounded">
                                    #{idx + 1}
                                  </span>
                                )}
                              </div>

                              <div className="p-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px]">
                                <div className="flex items-center gap-1">
                                  {idx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMoveImage(idx, 'left')}
                                      className="p-1 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"
                                      title="Move Left"
                                    >
                                      <ArrowLeft className="w-3 h-3" />
                                    </button>
                                  )}
                                  {idx < formImages.length - 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMoveImage(idx, 'right')}
                                      className="p-1 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"
                                      title="Move Right"
                                    >
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  )}
                                  {idx > 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetPrimaryImage(idx)}
                                      className="text-sky-600 hover:underline font-bold px-1"
                                      title="Set as Cover"
                                    >
                                      Make 1st
                                    </button>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                                  title="Remove from Gallery"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Image URL & File Upload Row */}
                      <div className="pt-2 flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="Paste image URL (https://...) or local asset path..."
                          className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddImage(newImageUrl)}
                          disabled={!newImageUrl.trim()}
                          className="py-2 px-3.5 bg-[#0284C7] hover:bg-[#0369a1] disabled:bg-slate-300 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add URL</span>
                        </button>

                        <label className="py-2 px-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs">
                          <Upload className="w-3.5 h-3.5 text-sky-400" />
                          <span>Upload Photos / Video</span>
                          <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={handleImageFileUpload}
                          />
                        </label>
                      </div>

                      {/* Presets */}
                      <div className="pt-2">
                        <p className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          Quick-Add Verified Sample Assets to Gallery:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_IMAGE_ASSETS.map((asset) => (
                            <button
                              key={asset.label}
                              type="button"
                              onClick={() => handleAddImage(asset.url)}
                              className="py-1 px-2 bg-white hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded text-[10px] font-medium text-slate-700 transition-colors cursor-pointer"
                            >
                              + {asset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CARD 5: TAGS & SEARCH KEYWORDS (EDIT & OMIT) */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-purple-600" />
                          5. Tags & Search Badges (Edit & Omit)
                        </span>
                        {isOmitted('tags') ? (
                          <button type="button" onClick={() => toggleOmitField('tags')} className="text-sky-600 font-bold hover:underline">
                            + Include Tags
                          </button>
                        ) : (
                          <button type="button" onClick={() => toggleOmitField('tags')} className="text-rose-600 font-bold hover:underline text-[11px]">
                            Omit All Tags
                          </button>
                        )}
                      </div>

                      {!isOmitted('tags') && (
                        <>
                          <div className="flex flex-wrap gap-1.5">
                            {formTags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center gap-1 py-1 px-2.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-full text-xs font-semibold"
                              >
                                <span>#{tag}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTag(tag)}
                                  className="text-purple-600 hover:text-rose-600 p-0.5 rounded-full cursor-pointer"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newTagInput}
                              onChange={(e) => setNewTagInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                              placeholder="Type tag (e.g. Tokunbo, Moscow AC, VXR, 2-Piece)..."
                              className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                            />
                            <button
                              type="button"
                              onClick={handleAddTag}
                              disabled={!newTagInput.trim()}
                              className="py-2 px-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Tag</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* CARD 6: DETAILED SPECIFICATIONS (ROW BY ROW EDIT & OMIT) */}
                    <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <div>
                          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                            <ListPlus className="w-3.5 h-3.5 text-[#0284C7]" />
                            6. Technical Specifications Table ({formSpecs.length} Rows)
                          </span>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Add, edit or omit individual spec rows (e.g. Model Year, Engine, Transmission, Fabric, Origin).
                          </p>
                        </div>

                        {isOmitted('specs') ? (
                          <button type="button" onClick={() => toggleOmitField('specs')} className="text-sky-600 font-bold hover:underline">
                            + Include Specs
                          </button>
                        ) : (
                          <button type="button" onClick={() => toggleOmitField('specs')} className="text-rose-600 font-bold hover:underline text-[11px]">
                            Omit All Specs
                          </button>
                        )}
                      </div>

                      {!isOmitted('specs') && (
                        <div className="space-y-2">
                          {formSpecs.map((s) => (
                            <div key={s.id} className="flex gap-2 items-center bg-white p-2 rounded-lg border border-slate-200">
                              <input
                                type="text"
                                value={s.key}
                                onChange={(e) => handleUpdateSpec(s.id, 'key', e.target.value)}
                                placeholder="Attribute Key (e.g. Model Year)"
                                className="w-1/3 p-1.5 border border-slate-300 rounded text-xs font-semibold"
                              />
                              <input
                                type="text"
                                value={s.value}
                                onChange={(e) => handleUpdateSpec(s.id, 'value', e.target.value)}
                                placeholder="Value (e.g. 2025 VXR V6 Twin Turbo)"
                                className="flex-1 p-1.5 border border-slate-300 rounded text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveSpec(s.id)}
                                className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                                title="Omit this row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => handleAddSpec()}
                            className="py-1.5 px-3 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Specification Row</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* SUBMIT BUTTONS */}
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProduct(null);
                          setIsCreatingProduct(false);
                        }}
                        className="py-2.5 px-4 text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="py-3 px-6 bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-xl font-bold flex items-center gap-2 shadow-sm text-sm cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>{editingProduct ? 'Save Product Changes' : 'Create & Publish Product'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                /* PRODUCT LIST OVERVIEW */
                <div className="space-y-4">
                  {/* Toolbar */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search catalog by title, SKU..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none"
                        />
                      </div>

                      <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                      >
                        <option value="All">All Categories</option>
                        {CATEGORIES.filter(c => c.name !== 'All Departments').map(c => (
                          <option key={c.name} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => {
                          setActiveTab('media');
                        }}
                        className="py-2 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        title="Upload photos and videos as administrator"
                      >
                        <Upload className="w-3.5 h-3.5 text-slate-950" />
                        <span>Upload Media (Admin)</span>
                      </button>

                      <button
                        onClick={handleSyncCatalog}
                        disabled={isSyncing}
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        title="Sync Verified Catalog & Real Photos to Firestore"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'Syncing...' : 'Sync Catalog to Firebase'}</span>
                      </button>

                      <button
                        onClick={handleStartCreate}
                        className="py-2 px-3.5 bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Product (Admin)</span>
                      </button>
                    </div>
                  </div>

                  {/* Catalog Table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            <th className="p-3">Product</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Gallery</th>
                            <th className="p-3">Omitted Fields</th>
                            <th className="p-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                              <td className="p-3">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={p.images?.[0] || '/assets/images/hero_marketplace_jumia_1790462828695.jpg'}
                                    alt={p.title}
                                    className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                                  />
                                  <div>
                                    <p className="font-bold text-slate-900 line-clamp-1 max-w-xs">{p.title}</p>
                                    <span className="text-[10px] font-mono text-slate-400">{p.sku || 'No SKU'}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded text-[11px]">
                                  {p.category}
                                </span>
                              </td>
                              <td className="p-3 font-mono font-bold text-slate-900">
                                {formatCurrency(p.price)}
                              </td>
                              <td className="p-3">
                                {p.stock !== undefined ? (
                                  <span className={`font-mono font-bold ${p.stock <= 2 ? 'text-rose-600' : 'text-emerald-700'}`}>
                                    {p.stock} units
                                  </span>
                                ) : (
                                  <span className="text-slate-400 italic">Uncounted</span>
                                )}
                              </td>
                              <td className="p-3">
                                <span className="bg-slate-100 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                                  <ImageIcon className="w-3 h-3 text-sky-600" />
                                  {p.images?.length || 1} photos
                                </span>
                              </td>
                              <td className="p-3">
                                {p.omittedFields && p.omittedFields.length > 0 ? (
                                  <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded font-mono">
                                    {p.omittedFields.length} omitted
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">All included</span>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleStartEdit(p)}
                                    className="p-1.5 hover:bg-sky-50 text-sky-700 rounded-md transition-colors cursor-pointer"
                                    title="Edit Product and Omit Fields"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (confirm(`Delete "${p.title}" from catalog database?`)) {
                                        await onDeleteProduct(p.id);
                                        setSyncSuccessMsg(`Product "${p.title}" deleted.`);
                                        setTimeout(() => setSyncSuccessMsg(''), 4000);
                                      }
                                    }}
                                    className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-md transition-colors cursor-pointer"
                                    title="Delete product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SECTION TO ADD AS ADMIN (Staff & Admin Roles Management) */}
          {activeTab === 'admins' && (
            <div className="space-y-6">
              {/* Header card */}
              <div className="p-5 bg-gradient-to-r from-slate-900 to-sky-950 text-white rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-base font-black uppercase tracking-tight">
                      Unitworld Administrator & Staff Access
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 max-w-xl">
                    Add new administrators, assign catalog & logistics roles, or grant instant admin privileges to your current session.
                  </p>
                </div>

                {onMakeCurrentUserAdmin && (
                  <button
                    onClick={() => {
                      onMakeCurrentUserAdmin();
                      setSyncSuccessMsg('Your current user account has been granted Super Administrator privileges!');
                      setTimeout(() => setSyncSuccessMsg(''), 5000);
                    }}
                    className="py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md transition-transform hover:scale-102 cursor-pointer shrink-0"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Grant Admin to My Current Session</span>
                  </button>
                )}
              </div>

              {/* Form: Add New Admin */}
              <div className="p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-5 h-5 text-[#0284C7]" />
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                      Add New Administrator
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500">
                    Saves directly to Firebase Firestore administrators collection
                  </span>
                </div>

                <form onSubmit={handleAddNewAdmin} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Administrator Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        placeholder="e.g. Chidi Okonjo"
                        className="w-full p-2.5 border border-slate-300 rounded-lg font-medium focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Admin Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="e.g. partner@unitworld.com"
                        className="w-full p-2.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Role & Permissions *
                      </label>
                      <select
                        value={newAdminRole}
                        onChange={(e) => setNewAdminRole(e.target.value as AdminUser['role'])}
                        className="w-full p-2.5 border border-slate-300 rounded-lg font-bold text-sky-900 bg-white"
                      >
                        <option value="super_admin">Super Administrator (Full System Control)</option>
                        <option value="catalog_manager">Catalog & Product Manager (CRUD & Omit Fields)</option>
                        <option value="order_dispatcher">Logistics & Dispatch Officer (Orders)</option>
                        <option value="inventory_controller">Financial Escrow & Inventory Controller</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Department
                      </label>
                      <input
                        type="text"
                        value={newAdminDept}
                        onChange={(e) => setNewAdminDept(e.target.value)}
                        placeholder="e.g. Inventory, Operations"
                        className="w-full p-2.5 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={adminSaving}
                      className="py-2.5 px-5 bg-[#0284C7] hover:bg-[#0369a1] disabled:bg-slate-300 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{adminSaving ? 'Adding...' : 'Add as Admin'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Admins List Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Authorized Administrator Accounts ({admins.length})
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    All accounts listed possess active ERP access
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Administrator</th>
                        <th className="p-3">Role</th>
                        <th className="p-3">Department</th>
                        <th className="p-3">Granted Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {admins.map((adm) => (
                        <tr key={adm.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 font-black flex items-center justify-center text-xs shrink-0">
                                {adm.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{adm.name}</p>
                                <p className="text-[11px] font-mono text-slate-500">{adm.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-[11px] px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200">
                              {adm.role.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3 text-slate-600 font-medium">
                            {adm.department}
                          </td>
                          <td className="p-3 font-mono text-slate-500 text-[11px]">
                            {formatDate(adm.addedAt)}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => onToggleAdminStatus(adm.id, !adm.isActive)}
                              className={`py-0.5 px-2 rounded font-bold text-[10px] cursor-pointer ${
                                adm.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {adm.isActive ? 'Active' : 'Suspended'}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={async () => {
                                if (confirm(`Remove administrator privileges for ${adm.name} (${adm.email})?`)) {
                                  await onRemoveAdmin(adm.id);
                                  setSyncSuccessMsg(`Admin ${adm.name} removed.`);
                                  setTimeout(() => setSyncSuccessMsg(''), 4000);
                                }
                              }}
                              className="text-rose-600 hover:text-rose-800 p-1 font-bold cursor-pointer"
                              title="Remove Admin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS & DISPATCH */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Customer Orders & Real-Time Logistics Tracking ({orders.length})
                  </h3>
                </div>

                <div className="divide-y divide-slate-100">
                  {orders.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      No orders placed yet. Add items to cart and complete checkout to see real-time orders here.
                    </div>
                  ) : (
                    orders.map((ord) => (
                      <div key={ord.id} className="p-4 sm:p-5 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                          <div>
                            <span className="font-mono font-bold text-slate-900 text-sm">{ord.orderNumber}</span>
                            <span className="text-slate-400 text-xs ml-2">· {formatDate(ord.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-slate-900 text-sm">
                              {formatCurrency(ord.totalAmount)}
                            </span>
                            <span className={`py-0.5 px-2 rounded text-[11px] font-bold uppercase ${
                              ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.paymentStatus}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <p className="text-slate-500 font-semibold">Customer:</p>
                            <p className="font-bold text-slate-900">{ord.customerName}</p>
                            <p className="text-slate-500 font-mono text-[11px]">{ord.customerEmail}</p>
                            <p className="text-slate-500 font-mono text-[11px]">{ord.customerPhone}</p>
                          </div>

                          <div>
                            <p className="text-slate-500 font-semibold">Delivery Address:</p>
                            <p className="text-slate-800">{ord.shippingAddress?.street}, {ord.shippingAddress?.city}, {ord.shippingAddress?.state}</p>
                            <p className="text-sky-700 font-semibold mt-0.5">Method: {ord.shippingAddress?.deliveryMethod}</p>
                          </div>

                          <div>
                            <p className="text-slate-500 font-semibold">Dispatch Logistics Status:</p>
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as OrderStatus, statusNote)}
                              className="mt-1 w-full p-2 bg-slate-50 border border-slate-300 rounded font-bold text-sky-900"
                            >
                              <option value="pending">Pending Verification</option>
                              <option value="processing">Processing & Warehouse Allocation</option>
                              <option value="shipped">Dispatched to Transit Hub</option>
                              <option value="out_for_delivery">Out for Delivery</option>
                              <option value="delivered">Delivered & Signed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: USERS & SIGNUPS SECTION */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              {/* Header Banner */}
              <div className="p-5 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-sky-400" />
                    <h3 className="text-base font-black uppercase tracking-tight">
                      Customer Accounts & Registered Sign-ups ({users.length})
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    View and manage all shoppers who registered on Unitworld Sarl. Inspect order histories, delivery addresses, verify credentials, and manage role permissions.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-400" />
                    Live Firestore User Sync
                  </span>
                </div>
              </div>

              {/* Metric Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Registered Accounts</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{users.length}</p>
                  <p className="text-[11px] text-sky-600 font-semibold mt-1">Direct Signups & Google Auth</p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Shopper / Customer Accounts</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {users.filter(u => u.role !== 'admin').length}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">Active Buying Customers</p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Staff & Admin Users</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                  <p className="text-[11px] text-purple-600 font-semibold mt-1">With Management Privileges</p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Orders Handled</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{orders.length}</p>
                  <p className="text-[11px] text-amber-600 font-semibold mt-1">Across all user accounts</p>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by name, email, phone, UID..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                  />
                  {userSearch && (
                    <button
                      onClick={() => setUserSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
                  <span className="text-xs font-semibold text-slate-500 mr-1 hidden sm:inline">Role:</span>
                  {(['all', 'customer', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setUserRoleFilter(r)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-colors cursor-pointer whitespace-nowrap ${
                        userRoleFilter === r
                          ? 'bg-[#0284C7] text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {r === 'all' ? 'All Roles' : `${r}s`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 text-slate-600 border-b border-slate-200 uppercase font-mono text-[10px]">
                      <tr>
                        <th className="p-3.5">Customer / User</th>
                        <th className="p-3.5">Email & Phone</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5">Date Registered</th>
                        <th className="p-3.5">Orders & Spend</th>
                        <th className="p-3.5">Saved Addresses</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {users
                        .filter((u) => {
                          const q = userSearch.toLowerCase();
                          const matchesSearch =
                            !q ||
                            u.displayName?.toLowerCase().includes(q) ||
                            u.email?.toLowerCase().includes(q) ||
                            u.phone?.toLowerCase().includes(q) ||
                            u.uid?.toLowerCase().includes(q);
                          const matchesRole =
                            userRoleFilter === 'all' || u.role === userRoleFilter;
                          return matchesSearch && matchesRole;
                        })
                        .map((u) => {
                          const userOrders = orders.filter(
                            (o) =>
                              o.userId === u.uid ||
                              o.customerEmail.toLowerCase() === u.email.toLowerCase()
                          );
                          const totalSpent = userOrders.reduce(
                            (sum, o) => sum + (o.totalAmount || 0),
                            0
                          );
                          const initials = (u.displayName || u.email || 'UW')
                            .slice(0, 2)
                            .toUpperCase();

                          return (
                            <tr key={u.uid} className="hover:bg-sky-50/40 transition-colors">
                              {/* Name & Avatar */}
                              <td className="p-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-sky-700 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0">
                                    {initials}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 leading-tight">
                                      {u.displayName || u.email.split('@')[0]}
                                    </p>
                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                      ID: {u.uid.slice(0, 14)}...
                                    </p>
                                  </div>
                                </div>
                              </td>

                              {/* Email & Phone */}
                              <td className="p-3.5">
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                    <span>{u.email}</span>
                                  </div>
                                  {u.phone ? (
                                    <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                                      <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                                      <span>{u.phone}</span>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic">No phone attached</span>
                                  )}
                                </div>
                              </td>

                              {/* Role */}
                              <td className="p-3.5">
                                {u.role === 'admin' ? (
                                  <span className="bg-purple-100 text-purple-800 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase flex items-center gap-1 w-fit border border-purple-200">
                                    <ShieldCheck className="w-3 h-3 text-purple-600" />
                                    Admin
                                  </span>
                                ) : (
                                  <span className="bg-sky-100 text-sky-800 font-bold text-[10px] px-2.5 py-1 rounded-full uppercase flex items-center gap-1 w-fit border border-sky-200">
                                    <UserCheck className="w-3 h-3 text-sky-600" />
                                    Customer
                                  </span>
                                )}
                              </td>

                              {/* Registered Date */}
                              <td className="p-3.5 text-slate-600">
                                {formatDate(u.createdAt)}
                              </td>

                              {/* Orders & Spend */}
                              <td className="p-3.5">
                                <div>
                                  <span className="font-bold text-slate-900">
                                    {userOrders.length} {userOrders.length === 1 ? 'Order' : 'Orders'}
                                  </span>
                                  {totalSpent > 0 && (
                                    <p className="text-[11px] font-black text-emerald-700">
                                      {formatCurrency(totalSpent)}
                                    </p>
                                  )}
                                </div>
                              </td>

                              {/* Saved Addresses */}
                              <td className="p-3.5">
                                {u.addresses && u.addresses.length > 0 ? (
                                  <div className="text-slate-700">
                                    <span className="font-semibold text-slate-900">
                                      {u.addresses[0].city}, {u.addresses[0].state}
                                    </span>
                                    {u.addresses.length > 1 && (
                                      <span className="text-[10px] text-slate-500 block">
                                        +{u.addresses.length - 1} more address
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic text-[11px]">No addresses</span>
                                )}
                              </td>

                              {/* Status */}
                              <td className="p-3.5">
                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                                  {u.status || 'Active'}
                                </span>
                              </td>

                              {/* Action Buttons */}
                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedUserForModal(u)}
                                    className="py-1.5 px-3 bg-sky-50 hover:bg-sky-100 text-[#0284C7] font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                    title="View full account details & order history"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                    <span>Details</span>
                                  </button>

                                  {onUpdateUser && (
                                    <button
                                      onClick={async () => {
                                        const newRole = u.role === 'admin' ? 'customer' : 'admin';
                                        const confirmMsg = u.role === 'admin' 
                                          ? `Revoke Admin privileges for ${u.displayName || u.email}?`
                                          : `Promote ${u.displayName || u.email} to Administrator?`;
                                        if (confirm(confirmMsg)) {
                                          await onUpdateUser({ ...u, role: newRole });
                                          setUserSuccessMsg(`Role for ${u.displayName || u.email} updated to ${newRole}.`);
                                          setTimeout(() => setUserSuccessMsg(''), 4000);
                                        }
                                      }}
                                      className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100 cursor-pointer"
                                      title={u.role === 'admin' ? 'Revert to Customer' : 'Make Admin'}
                                    >
                                      {u.role === 'admin' ? (
                                        <EyeOff className="w-3.5 h-3.5 text-purple-600" />
                                      ) : (
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                {users.length === 0 && (
                  <div className="p-8 text-center text-slate-400">
                    No users registered yet.
                  </div>
                )}
              </div>

              {userSuccessMsg && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{userSuccessMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ANALYTICS & GMV */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">Gross Revenue (GMV)</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                    {formatCurrency(totalRevenue)}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Live Settled GMV
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                    <ShoppingCart className="w-4 h-4 text-sky-600" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                    {totalOrders}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    {pendingOrders} awaiting fulfillment
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">Catalog SKUs</span>
                    <Package className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900 tabular-nums">
                    {products.length}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    {totalInventoryUnits} physical units
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">Low Stock Warnings</span>
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-rose-600 tabular-nums">
                    {lowStockCount} items
                  </p>
                  <p className="text-[11px] text-rose-500 font-medium mt-1">
                    Threshold: 2 units or fewer
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BRAND LOGO & GATEWAY SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Brand Logo & Corporate Identity Settings */}
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#0284C7]" />
                    <span>Brand & Official Logo Settings</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">Live Firebase Synchronization</span>
                </div>

                {/* Logo Preview */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-700 uppercase mb-2">Live Logo Display</p>
                    <UnitworldLogo logoUrl={brandLogoUrl} className="h-12" />
                  </div>
                  <button
                    type="button"
                    onClick={handleSyncCatalog}
                    disabled={isSyncing}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Catalog to Firebase'}</span>
                  </button>
                </div>

                <form onSubmit={handleSaveBrand} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Official Logo Image Asset URL *
                    </label>
                    <input
                      type="text"
                      required
                      value={brandLogoUrl}
                      onChange={(e) => setBrandLogoUrl(e.target.value)}
                      placeholder="https://res.cloudinary.com/... or image path"
                      className="w-full p-2.5 border border-slate-300 rounded-lg font-mono focus:outline-none focus:border-sky-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Current: <span className="font-mono text-sky-700 break-all">{DEFAULT_BRAND_LOGO}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Brand Name</label>
                      <input
                        type="text"
                        value={brandNameState}
                        onChange={(e) => setBrandNameState(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tagline</label>
                      <input
                        type="text"
                        value={brandTagline}
                        onChange={(e) => setBrandTagline(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Support Phone</label>
                      <input
                        type="text"
                        value={brandPhone}
                        onChange={(e) => setBrandPhone(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Support Email</label>
                      <input
                        type="email"
                        value={brandEmail}
                        onChange={(e) => setBrandEmail(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">WhatsApp Number</label>
                      <input
                        type="text"
                        value={brandWhatsApp}
                        onChange={(e) => setBrandWhatsApp(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Brand Identity & Logo to Firebase</span>
                  </button>
                </form>
              </div>

              {/* Paystack Gateway Form */}
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#0284C7]" />
                    <span>Paystack & Direct Escrow Bank Configuration</span>
                  </h3>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Paystack Public Key</label>
                      <input
                        type="text"
                        value={paystackKey}
                        onChange={(e) => setPaystackKey(e.target.value)}
                        className="w-full p-2.5 border border-slate-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Gateway Status</label>
                      <select
                        value={paystackActive ? 'enabled' : 'disabled'}
                        onChange={(e) => setPaystackActive(e.target.value === 'enabled')}
                        className="w-full p-2.5 border border-slate-300 rounded-lg font-bold"
                      >
                        <option value="enabled">Enabled (Live Paystack)</option>
                        <option value="disabled">Disabled (Test / Bank Transfer Only)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Bank Name</label>
                      <input
                        type="text"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Account Name</label>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Account Number</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg font-mono font-bold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#0284C7] hover:bg-[#0369a1] text-white rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm text-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Paystack & Escrow Settings to Firebase</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* USER ACCOUNT DETAIL MODAL */}
        {selectedUserForModal && (
          <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-black text-sm uppercase">
                    {(selectedUserForModal.displayName || selectedUserForModal.email).slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {selectedUserForModal.displayName || selectedUserForModal.email.split('@')[0]}
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">UID: {selectedUserForModal.uid}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUserForModal(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 overflow-y-auto space-y-6 text-xs">
                {/* Account overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-500">Email Address</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedUserForModal.email}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-500">Phone Number</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {selectedUserForModal.phone || 'Not specified'}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-500">Role Status</span>
                    <p className="font-bold text-slate-900 mt-0.5 capitalize">
                      {selectedUserForModal.role}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="font-semibold text-slate-500">Joined Date</span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {formatDate(selectedUserForModal.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Saved Delivery Addresses */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    Saved Delivery Addresses ({selectedUserForModal.addresses?.length || 0})
                  </h4>
                  {selectedUserForModal.addresses && selectedUserForModal.addresses.length > 0 ? (
                    <div className="space-y-2">
                      {selectedUserForModal.addresses.map((addr) => (
                        <div key={addr.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{addr.fullName}</span>
                            <span className="text-slate-500 font-normal">{addr.phone}</span>
                          </div>
                          <p className="text-slate-600 mt-1">
                            {addr.street}, {addr.city}, {addr.state}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 italic">
                      No delivery addresses registered yet.
                    </p>
                  )}
                </div>

                {/* Order History */}
                <div>
                  <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-[#0284C7]" />
                    Order History for this User
                  </h4>
                  {(() => {
                    const userOrders = orders.filter(
                      (o) =>
                        o.userId === selectedUserForModal.uid ||
                        o.customerEmail.toLowerCase() === selectedUserForModal.email.toLowerCase()
                    );

                    if (userOrders.length === 0) {
                      return (
                        <p className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-400 italic">
                          No orders placed yet by this customer.
                        </p>
                      );
                    }

                    return (
                      <div className="space-y-2.5">
                        {userOrders.map((ord) => (
                          <div key={ord.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                              <span className="font-mono font-black text-emerald-700">
                                {formatCurrency(ord.totalAmount)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                              <span>{formatDate(ord.createdAt)}</span>
                              <span className="capitalize font-bold text-sky-700">{ord.orderStatus}</span>
                            </div>
                            <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                              Items: {ord.items.map(i => `${i.quantity}x ${i.title}`).join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
                <button
                  onClick={() => setSelectedUserForModal(null)}
                  className="py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Batch Media Uploader Modal for Admin */}
        <MediaUploaderModal
          isOpen={isBatchMediaOpen}
          onClose={() => setIsBatchMediaOpen(false)}
          products={products}
          initialProductId={batchMediaInitialProduct}
          onUpdateProduct={async (updated) => {
            await onUpdateProduct(updated.id, updated);
          }}
        />
      </div>
    </div>
  );
};
