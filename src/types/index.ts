export interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition?: 'Brand New' | 'Foreign Used (Tokunbo)' | 'Registered' | 'Refurbished' | string;
  images: string[];
  stock?: number;
  sku?: string;
  seller?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  tags?: string[];
  specs?: Record<string, string>;
  settlementFee?: string;
  brand?: string;
  warranty?: string;
  omittedFields?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'catalog_manager' | 'order_dispatcher' | 'inventory_controller';
  department: string;
  addedAt: string;
  addedBy?: string;
  isActive: boolean;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';
export type PaymentMethod = 'paystack' | 'bank_transfer' | 'cash_on_delivery';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  condition?: string;
}

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  timestamp: string;
  location: string;
  note?: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    deliveryMethod: 'door_delivery' | 'pickup_station';
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paystackReference?: string;
  orderStatus: OrderStatus;
  trackingNumber: string;
  trackingUpdates: TrackingStep[];
  createdAt: string;
  updatedAt: string;
}

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  isDefault: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  role: 'admin' | 'customer';
  mfaEnabled: boolean;
  mfaSecret?: string;
  addresses: UserAddress[];
  preferences: {
    currency: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    whatsappAlerts: boolean;
  };
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'system' | 'payment';
  read: boolean;
  createdAt: string;
  linkId?: string;
}

export interface GatewaySettings {
  paystackPublicKey: string;
  paystackEnabled: boolean;
  currency: string;
  bankAccountDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
}

export interface BrandSettings {
  logoUrl: string;
  brandName: string;
  tagline: string;
  supportPhone: string;
  supportEmail: string;
  whatsappNumber: string;
  address: string;
  updatedAt?: string;
}

