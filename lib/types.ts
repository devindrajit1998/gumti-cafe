export type VegType = 'veg' | 'non-veg' | 'egg' | 'vegan';

export type OrderType = 'delivery' | 'pickup' | 'dine_in';

export interface FoodCustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface FoodCustomizationGroup {
  id: string;
  title: string;
  type: 'radio' | 'checkbox';
  min?: number;
  max?: number;
  options: FoodCustomizationOption[];
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  vegType: VegType;
  rating: number;
  ratingCount: number;
  isBestseller?: boolean;
  isSpicy?: boolean;
  spiceLevel?: 0 | 1 | 2 | 3;
  isAvailable?: boolean;
  preparationTime?: string;
  portionSize?: string;
  calories?: number;
  customizationGroups?: FoodCustomizationGroup[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RestaurantProfile {
  name: string;
  tagline: string;
  phone: string;
  whatsappPhone: string;
  email: string;
  address: string;
  locality: string;
  city: string;
  pincode: string;
  fssaiNumber: string;
  openingHours: string;
  isOpen: boolean;
  bannerImage: string;
  bannerImageMobile?: string;
  logoImage: string;
  upiId: string;
  upiPayeeName: string;
  minOrderDelivery: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  estimatedDeliveryTime: string;
  estimatedPickupTime: string;
  serviceTaxPercentage: number;
  enableDelivery: boolean;
  enablePickup: boolean;
  enableDineIn: boolean;
  socialInstagram?: string;
  googleMapsUrl?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  image: string;
  coverImage: string;
  cuisines: string[];
  rating: number;
  ratingCount: string;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  distanceKm: number;
  priceForTwo: number;
  offer: string;
  offerCode?: string;
  isPureVeg: boolean;
  isTopRated?: boolean;
  isFeatured?: boolean;
  address: string;
  locality: string;
  city: string;
  categories: string[];
  menu: MenuItem[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  cuisineMatch: string;
  badge?: string;
  description?: string;
}

export interface Coupon {
  code: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  maxDiscount?: number;
  minOrderValue: number;
  validUntil: string;
}

export interface CartItemCustomization {
  groupId: string;
  groupTitle: string;
  selectedOptions: FoodCustomizationOption[];
}

export interface CartItem {
  id: string; // unique item instance id
  menuItemId: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  price: number;
  vegType: VegType;
  image: string;
  quantity: number;
  customizations?: CartItemCustomization[];
  specialInstructions?: string;
  orderedBy?: string; // For Group Order tracking
}

export interface DeliveryAddress {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  label?: string;
  street: string;
  area: string;
  city: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
}

export type OrderStatus = 'placed' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  restaurantId: string;
  restaurantName: string;
  restaurantImage: string;
  restaurantAddress: string;
  items: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  taxes: number;
  discount: number;
  platformFee: number;
  tip: number;
  grandTotal: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
  estimatedDeliveryTime: string;
  deliveryAddress: DeliveryAddress;
  paymentMethod: string;
  orderType?: OrderType;
  tableNumber?: string;
  customerName?: string;
  customerPhone?: string;
  scheduledDelivery?: string;
  isGroupOrder?: boolean;
  groupCode?: string;
  adminWhatsAppPhone?: string;
  whatsappOrderUrl?: string;
  deliveryPartner?: {
    name: string;
    phone: string;
    rating: number;
    avatar: string;
    vehicleNumber: string;
  };
}

export interface FilterOptions {
  sortBy: 'relevance' | 'rating' | 'deliveryTime' | 'costLowToHigh' | 'costHighToLow';
  pureVegOnly: boolean;
  fastDelivery: boolean;
  offersOnly: boolean;
  cuisines: string[];
  ratingAbove4: boolean;
  priceRange: string[];
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  area?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  isVip?: boolean;
  notes?: string;
}

export interface BannerAnnouncement {
  enabled: boolean;
  text: string;
  badge?: string;
  linkText?: string;
  couponCode?: string;
}

export type BannerType = 'announcement' | 'hero';

export type BannerTheme = 'orange' | 'rose' | 'emerald' | 'violet' | 'zinc';

export interface BannerRecord {
  id: string;
  type: BannerType;
  enabled: boolean;
  badge?: string;
  title: string;
  subtitle?: string;
  image?: string; // ImageKit URL (hero/promo banners)
  ctaText?: string;
  ctaLink?: string; // ActiveView route (e.g. 'menu', 'offers') or external URL
  couponCode?: string;
  theme?: BannerTheme;
  startDate?: string; // ISO date string (YYYY-MM-DD) — banner becomes visible
  endDate?: string; // ISO date string (YYYY-MM-DD) — banner auto-hides after
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

/** Returns true when a banner is enabled and within its scheduled window. */
export const isBannerActive = (banner: BannerRecord, now: Date = new Date()): boolean => {
  if (!banner.enabled) return false;
  if (banner.startDate) {
    const start = new Date(`${banner.startDate}T00:00:00`);
    if (now < start) return false;
  }
  if (banner.endDate) {
    const end = new Date(`${banner.endDate}T23:59:59`);
    if (now > end) return false;
  }
  return true;
};

export type TableBookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'completed';

export interface TableBookingConfig {
  enableBookings: boolean;
  requireEmail: boolean;
  showEmailField: boolean;
  showSeatingArea: boolean;
  showSpecialOccasion: boolean;
  showSpecialNotes: boolean;
  minGuests: number;
  maxGuests: number;
  timeSlots: string[];
  seatingOptions: { id: string; label: string; icon?: string; desc?: string }[];
  occasions: { id: string; label: string; icon?: string }[];
  noticeHours: number; // minimum notice in hours
}

export interface TableBooking {
  id: string;
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  guestsCount: number;
  bookingDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "07:30 PM"
  seatingArea?: string;
  specialOccasion?: string;
  specialNotes?: string;
  status: TableBookingStatus;
  tableNumber?: string;
  createdAt: string;
}

export interface ZaikaBackupData {
  version: 1;
  exportedAt: string;
  profile: RestaurantProfile;
  menu: MenuItem[];
  orders: Order[];
  bookings?: TableBooking[];
  categories: string[];
  coupons: Coupon[];
  customers: CustomerRecord[];
  announcement: BannerAnnouncement;
  banners?: BannerRecord[];
}

export type ActiveView =
  | 'home'
  | 'menu'
  | 'category-detail'
  | 'book-table'
  | 'restaurants'
  | 'restaurant-detail'
  | 'item-detail'
  | 'search'
  | 'offers'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'order-tracking'
  | 'favorites'
  | 'profile'
  | 'admin-menu'
  | 'qr-code'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'terms';



