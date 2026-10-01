'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  ActiveView,
  CartItem,
  CartItemCustomization,
  Coupon,
  DeliveryAddress,
  FilterOptions,
  MenuItem,
  Order,
  OrderStatus,
  OrderType,
  Restaurant,
  RestaurantProfile,
  VegType,
  CustomerRecord,
  BannerAnnouncement,
  BannerRecord,
  BannerType,
  isBannerActive,
  TableBooking,
  TableBookingStatus,
  TableBookingConfig,
  ZaikaBackupData,
} from '@/lib/types';
import {
  DEFAULT_RESTAURANT_PROFILE,
  RESTAURANTS,
  ALL_MENU_ITEMS,
  DEFAULT_ANNOUNCEMENT,
  DEFAULT_BANNERS,
  migrateLegacyAnnouncement,
  DEFAULT_TABLE_BOOKING_CONFIG,
  RESTAURANT_MENU_CATEGORIES,
} from '@/lib/data';
import { GHUTI_CAFE_MENU, GHUTI_CAFE_MENU_VERSION } from '@/lib/ghutiMenu';
import { saveRestaurantCloudData, subscribeToRestaurantCloudData } from '@/lib/firebase';
import { formatOrderForWhatsApp, generateWhatsAppUrl, DEFAULT_ADMIN_WHATSAPP } from '@/lib/whatsapp';

let dishCounter = 100;
function generateDishId(): string {
  dishCounter += 1;
  return `ghuti-dish-${Date.now()}-${dishCounter}-${Math.random().toString(36).slice(2, 6)}`;
}

let groupOrderCounter = 1000;
function createNewGroupCode(): string {
  groupOrderCounter += 1;
  return `GC-${groupOrderCounter}`;
}

let bannerCounter = 0;
function createBannerId(): string {
  bannerCounter += 1;
  return `banner-${Date.now()}-${bannerCounter}-${Math.random().toString(36).slice(2, 7)}`;
}

function createBannerTimestamp(): string {
  return new Date().toISOString();
}

export interface GuestCustomerInfo {
  name: string;
  phone: string;
  street: string;
  area: string;
  city: string;
  pincode: string;
  specialNotes: string;
}

interface AppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  recentSearches: string[];
  addRecentSearch: (term: string) => void;
  clearRecentSearches: () => void;

  // Restaurant Profile & Menu (Owner Managed)
  restaurantProfile: RestaurantProfile;
  updateRestaurantProfile: (updated: Partial<RestaurantProfile>) => void;
  isLoadingMenu: boolean;
  isFirebaseConnected: boolean;
  restaurantMenu: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id' | 'restaurantId' | 'rating' | 'ratingCount'>) => void;
  updateMenuItem: (id: string, updated: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  toggleMenuItemStock: (id: string) => void;
  bulkUpdateMenuItemsAvailability: (ids: string[], isAvailable: boolean) => void;
  bulkDeleteMenuItems: (ids: string[]) => void;
  resetMenuToDefault: () => void;
  exportFullDatabase: () => ZaikaBackupData;
  importFullDatabase: (data: unknown) => { success: boolean; error?: string };

  // Order Modes & Dine-In Table
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;

  // No-Login Guest Customer Information (Persisted in browser)
  guestCustomer: GuestCustomerInfo;
  setGuestCustomer: React.Dispatch<React.SetStateAction<GuestCustomerInfo>>;
  updateGuestCustomer: (info: Partial<GuestCustomerInfo>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity?: number,
    customizations?: CartItemCustomization[],
    instructions?: string,
    orderedBy?: string
  ) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartItemCount: number;
  itemTotal: number;
  deliveryFee: number;
  taxes: number;
  discountAmount: number;
  platformFee: number;
  deliveryTip: number;
  setDeliveryTip: (tip: number) => void;
  deliveryInstructions: string[];
  toggleDeliveryInstruction: (inst: string) => void;
  cutleryNeeded: boolean;
  setCutleryNeeded: (needed: boolean) => void;
  grandTotal: number;

  // Coupon
  appliedCoupon: Coupon | null;
  applyCoupon: (coupon: Coupon) => boolean;
  removeCoupon: () => void;

  // Orders & WhatsApp Dispatch
  activeOrder: Order | null;
  pastOrders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  placeOrder: (options?: {
    customAdminPhone?: string;
    specialNotes?: string;
    overrideOrderType?: OrderType;
    overrideTableNumber?: string;
    overrideCustomer?: Partial<GuestCustomerInfo>;
  }) => Promise<{ orderId: string; whatsappUrl: string; message: string }>;
  reorder: (order: Order) => void;
  trackOrder: (order: Order) => void;
  cancelActiveOrder: () => void;

  // Admin Management: Coupons, Categories, Announcements, Customers
  adminCoupons: Coupon[];
  addAdminCoupon: (coupon: Coupon) => void;
  updateAdminCoupon: (code: string, updated: Partial<Coupon>) => void;
  deleteAdminCoupon: (code: string) => void;
  adminCategories: string[];
  addAdminCategory: (category: string) => void;
  updateAdminCategory: (oldCat: string, newCat: string) => void;
  deleteAdminCategory: (category: string) => void;
  bannerAnnouncement: BannerAnnouncement;
  updateBannerAnnouncement: (updated: Partial<BannerAnnouncement>) => void;
  adminBanners: BannerRecord[];
  addAdminBanner: (banner: Omit<BannerRecord, 'id' | 'createdAt' | 'updatedAt' | 'sortOrder'>) => BannerRecord;
  updateAdminBanner: (id: string, updated: Partial<BannerRecord>) => void;
  deleteAdminBanner: (id: string) => void;
  toggleAdminBanner: (id: string) => void;
  moveAdminBanner: (id: string, direction: 'up' | 'down') => void;
  activeAnnouncementBanners: BannerRecord[];
  activeHeroBanners: BannerRecord[];
  activeHeroBanner: BannerRecord | null;
  activePromoBanners: BannerRecord[];
  adminCustomers: CustomerRecord[];
  addAdminCustomer: (customer: CustomerRecord) => void;
  updateAdminCustomer: (id: string, updated: Partial<CustomerRecord>) => void;
  deleteAdminCustomer: (id: string) => void;

  // Table Bookings System
  tableBookings: TableBooking[];
  tableBookingConfig: TableBookingConfig;
  updateTableBookingConfig: (updated: Partial<TableBookingConfig>) => void;
  createTableBooking: (booking: Omit<TableBooking, 'id' | 'createdAt' | 'status'>) => Promise<TableBooking>;
  updateTableBookingStatus: (id: string, status: TableBookingStatus, tableNumber?: string) => void;
  deleteTableBooking: (id: string) => void;

  // Filters
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  resetFilters: () => void;

  // Modals & UI States
  customizingItem: MenuItem | null;
  setCustomizingItem: (item: MenuItem | null) => void;
  isFilterModalOpen: boolean;
  setIsFilterModalOpen: (open: boolean) => void;
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCartWarningModalOpen: boolean;
  setIsCartWarningModalOpen: (open: boolean) => void;
  pendingRestaurantItem: any;
  setPendingRestaurantItem: (item: any) => void;
  confirmCartOverride: () => void;

  // User & Addresses
  user: { isLoggedIn: boolean; name: string; phone: string; email: string };
  loginUser: (name: string, phone: string, email?: string) => void;
  logoutUser: () => void;
  currentAddress: DeliveryAddress | null;
  setCurrentAddress: (addr: DeliveryAddress | null) => void;
  savedAddresses: DeliveryAddress[];
  setSavedAddresses: (addrs: DeliveryAddress[]) => void;
  favoriteRestaurants: string[];
  toggleFavoriteRestaurant: (id: string) => void;
  isRestaurantFavorite: (id: string) => boolean;
  selectedRestaurantId: string;
  setSelectedRestaurantId: (id: string) => void;
  cartRestaurant: Restaurant | null;

  // Advanced Features: AI Assistant, Group Order, Invoice & KOT, Scheduling
  isAiAssistantOpen: boolean;
  setIsAiAssistantOpen: (open: boolean) => void;
  isGroupOrderModalOpen: boolean;
  setIsGroupOrderModalOpen: (open: boolean) => void;
  isKOTModalOpen: boolean;
  setIsKOTModalOpen: (open: boolean) => void;
  isInvoiceModalOpen: boolean;
  setIsInvoiceModalOpen: (open: boolean) => void;
  viewingInvoiceOrder: Order | null;
  setViewingInvoiceOrder: (order: Order | null) => void;
  scheduledDelivery: string;
  setScheduledDelivery: (time: string) => void;
  groupOrder: { isGroup: boolean; code: string; hostName: string; currentMember: string };
  startGroupOrder: (hostName?: string) => string;
  joinGroupOrder: (code: string, memberName: string) => void;
  leaveGroupOrder: () => void;
  setGroupOrderMember: (name: string) => void;

  // Selected Food Item for Details View
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  selectedItem: MenuItem | null;

  // Navigation Helper
  navigateTo: (
    view: ActiveView,
    options?: { category?: string; query?: string; orderId?: string; table?: string; restaurantId?: string; itemId?: string }
  ) => void;

  // Toast
  toast: { title: string; desc?: string; type?: 'success' | 'info' | 'error' } | null;
  showToast: (title: string, desc?: string, type?: 'success' | 'info' | 'error') => void;
}

const defaultFilters: FilterOptions = {
  sortBy: 'relevance',
  pureVegOnly: false,
  fastDelivery: false,
  offersOnly: false,
  cuisines: [],
  ratingAbove4: false,
  priceRange: [],
};

const AppContext = createContext<AppContextType | undefined>(undefined);


export const AppProvider: React.FC<{
  children: React.ReactNode;
  initialView?: ActiveView;
  initialCategory?: string | null;
}> = ({ children, initialView = 'home', initialCategory = null }) => {
  // Toast Notification System
  const [toast, setToast] = useState<{ title: string; desc?: string; type?: 'success' | 'info' | 'error' } | null>(null);

  const showToast = useCallback((title: string, desc?: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ title, desc, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [activeView, setActiveView] = useState<ActiveView>(initialView);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Murgh Dum Biryani',
    'Butter Naan',
    'Paneer Butter Masala',
    'Tandoori Tikka',
  ]);

  // Restaurant Profile — loaded exclusively from Firebase
  const [restaurantProfile, setRestaurantProfile] = useState<RestaurantProfile>(DEFAULT_RESTAURANT_PROFILE);

  // Restaurant Menu — loaded exclusively from Firebase
  const [restaurantMenu, setRestaurantMenu] = useState<MenuItem[]>([]);

  // Order Modes & Dine-in table
  const [orderType, setOrderType] = useState<OrderType>(() => {
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('table')) return 'dine_in';
      } catch { }
    }
    return 'delivery';
  });

  const [tableNumber, setTableNumber] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const table = urlParams.get('table');
        if (table) return table;
      } catch { }
    }
    return '1';
  });

  // No-login guest customer details
  const [guestCustomer, setGuestCustomer] = useState<GuestCustomerInfo>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('gumti_guest_customer');
        if (saved) return JSON.parse(saved);
      } catch { }
    }
    return {
      name: '',
      phone: '',
      street: '',
      area: '',
      city: '',
      pincode: '',
      specialNotes: '',
    };
  });

  // Update restaurant profile
  const updateRestaurantProfile = (updated: Partial<RestaurantProfile>) => {
    setRestaurantProfile((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('gumti_cafe_profile', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast('Restaurant Profile Updated! ✅', 'Changes are saved live to the menu', 'success');
  };

  // Add menu item
  const addMenuItem = (item: Omit<MenuItem, 'id' | 'restaurantId' | 'rating' | 'ratingCount'>) => {
    const now = new Date().toISOString();
    const newItem: MenuItem = {
      ...item,
      id: generateDishId(),
      restaurantId: 'my-restaurant',
      rating: 5.0,
      ratingCount: 1,
      isAvailable: item.isAvailable !== false,
      createdAt: now,
      updatedAt: now,
    };

    setRestaurantMenu((prev) => {
      const next = [newItem, ...prev];
      try {
        localStorage.setItem('gumti_cafe_menu', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast('Item Added to Menu! 🍽️', `${newItem.name} is now available`, 'success');
  };

  // Update menu item
  const updateMenuItem = (id: string, updated: Partial<MenuItem>) => {
    setRestaurantMenu((prev) => {
      const next = prev.map((it) => (it.id === id ? { ...it, ...updated, updatedAt: new Date().toISOString() } : it));
      try {
        localStorage.setItem('gumti_cafe_menu', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast('Dish Updated', 'Menu refreshed', 'success');
  };

  // Delete menu item
  const deleteMenuItem = (id: string) => {
    setRestaurantMenu((prev) => {
      const next = prev.filter((it) => it.id !== id);
      try {
        localStorage.setItem('gumti_cafe_menu', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast('Dish Removed from Menu', undefined, 'info');
  };

  // Toggle item in-stock status
  const toggleMenuItemStock = (id: string) => {
    setRestaurantMenu((prev) => {
      const next = prev.map((it) => {
        if (it.id === id) {
          const current = it.isAvailable !== false;
          return { ...it, isAvailable: !current };
        }
        return it;
      });
      try {
        localStorage.setItem('gumti_cafe_menu', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const bulkUpdateMenuItemsAvailability = (ids: string[], isAvailable: boolean) => {
    const selectedIds = new Set(ids);
    setRestaurantMenu((prev) => {
      const next = prev.map((item) => selectedIds.has(item.id) ? { ...item, isAvailable, updatedAt: new Date().toISOString() } : item);
      try { localStorage.setItem('gumti_cafe_menu', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
    showToast(`${ids.length} dishes updated`, isAvailable ? 'Marked in stock' : 'Marked sold out', 'success');
  };

  const bulkDeleteMenuItems = (ids: string[]) => {
    const selectedIds = new Set(ids);
    setRestaurantMenu((prev) => {
      const next = prev.filter((item) => !selectedIds.has(item.id));
      try { localStorage.setItem('gumti_cafe_menu', JSON.stringify(next)); } catch (e) { console.error(e); }
      return next;
    });
    showToast(`${ids.length} dishes deleted`, 'Menu catalog updated', 'info');
  };

  // Reset menu
  const resetMenuToDefault = () => {
    setRestaurantMenu(GHUTI_CAFE_MENU);
    try {
      localStorage.removeItem('gumti_cafe_menu');
    } catch (e) {
      console.error(e);
    }
    showToast('Menu Reset to Defaults', undefined, 'info');
  };

  // Update guest customer helper
  const updateGuestCustomer = (info: Partial<GuestCustomerInfo>) => {
    setGuestCustomer((prev) => {
      const next = { ...prev, ...info };
      try {
        localStorage.setItem('gumti_guest_customer', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('gumti_cart');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  // Sync cart to local storage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('gumti_cart', JSON.stringify(cart));
      } catch (e) {
        console.error('Failed to save cart:', e);
      }
    }
  }, [cart]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [deliveryTip, setDeliveryTip] = useState<number>(20);
  const [deliveryInstructions, setDeliveryInstructions] = useState<string[]>(['Avoid calling unless needed']);
  const [cutleryNeeded, setCutleryNeeded] = useState<boolean>(true);

  // Orders State
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  // Orders are loaded exclusively from Firebase via subscribeToRestaurantCloudData below.
  // Do NOT seed from localStorage or hardcoded data - Firebase is the single source of truth.
  const [pastOrders, setPastOrders] = useState<Order[]>([]);



  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updatedOrders = pastOrders.map((ord) => (ord.id === orderId ? { ...ord, status } : ord));
    setPastOrders(() => {
      try { localStorage.setItem('gumti_past_orders', JSON.stringify(updatedOrders)); } catch (e) { console.error(e); }
      return updatedOrders;
    });
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder((prev) => (prev ? { ...prev, status } : null));
    }
    // Directly push to Firebase so the customer tracking page updates in real-time
    void saveRestaurantCloudData({ orders: updatedOrders }).catch((err: unknown) => {
      console.warn('Direct status sync to Firebase failed:', err);
    });
    showToast(`Order Status Updated: ${status.toUpperCase()} 🔄`, `Order ID: ${orderId}`, 'success');
  };

  const deleteOrder = (orderId: string) => {
    const updatedOrders = pastOrders.filter((ord) => ord.id !== orderId);
    setPastOrders(() => {
      try { localStorage.setItem('gumti_past_orders', JSON.stringify(updatedOrders)); } catch (e) { console.error(e); }
      return updatedOrders;
    });
    // Directly push to Firebase so admin panel stays in sync
    void saveRestaurantCloudData({ orders: updatedOrders }).catch((err: unknown) => {
      console.warn('Direct delete sync to Firebase failed:', err);
    });
    showToast('Order Deleted from Logs 🗑️', undefined, 'info');
  };

  // Admin Coupons — loaded exclusively from Firebase
  const [adminCoupons, setAdminCoupons] = useState<Coupon[]>([]);

  const addAdminCoupon = (coupon: Coupon) => {
    setAdminCoupons((prev) => {
      const next = [coupon, ...prev.filter((c) => c.code !== coupon.code)];
      try {
        localStorage.setItem('gumti_coupons', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast(`Coupon Added: ${coupon.code} 🎟️`, coupon.title, 'success');
  };

  const updateAdminCoupon = (code: string, updated: Partial<Coupon>) => {
    setAdminCoupons((prev) => {
      const next = prev.map((c) => (c.code === code ? { ...c, ...updated } : c));
      try {
        localStorage.setItem('gumti_coupons', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast(`Coupon ${code} Updated`, undefined, 'success');
  };

  const deleteAdminCoupon = (code: string) => {
    setAdminCoupons((prev) => {
      const next = prev.filter((c) => c.code !== code);
      try {
        localStorage.setItem('gumti_coupons', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast(`Coupon ${code} Deleted`, undefined, 'info');
  };

  // Admin Categories — loaded exclusively from Firebase
  const [adminCategories, setAdminCategories] = useState<string[]>(RESTAURANT_MENU_CATEGORIES);

  const addAdminCategory = (category: string) => {
    const trimmed = category.trim();
    if (!trimmed) return;
    setAdminCategories((prev) => {
      if (prev.includes(trimmed)) return prev;
      const next = [...prev, trimmed];
      try {
        localStorage.setItem('gumti_categories', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast(`Category Added: ${trimmed} 📑`, undefined, 'success');
  };

  const updateAdminCategory = (oldCat: string, newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    setAdminCategories((prev) => {
      const next = prev.map((c) => (c === oldCat ? trimmed : c));
      try {
        localStorage.setItem('gumti_categories', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    // Update dishes with old category
    setRestaurantMenu((prev) => {
      const next = prev.map((item) => (item.category === oldCat ? { ...item, category: trimmed } : item));
      try {
        localStorage.setItem('gumti_cafe_menu', JSON.stringify(next));
      } catch { }
      return next;
    });
    showToast(`Category Renamed to "${trimmed}"`, undefined, 'success');
  };

  const deleteAdminCategory = (category: string) => {
    setAdminCategories((prev) => {
      const next = prev.filter((c) => c !== category);
      try {
        localStorage.setItem('gumti_categories', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast(`Category "${category}" Deleted`, undefined, 'info');
  };

  // Table Bookings Management
  const [tableBookingConfig, setTableBookingConfig] = useState<TableBookingConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('gumti_table_booking_config');
        if (saved) return JSON.parse(saved);
      } catch { }
    }
    return DEFAULT_TABLE_BOOKING_CONFIG;
  });

  const updateTableBookingConfig = (updated: Partial<TableBookingConfig>) => {
    setTableBookingConfig((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('gumti_table_booking_config', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast('Reservation Form Settings Saved! ⚙️', 'Customer booking form updated', 'success');
  };

  const [tableBookings, setTableBookings] = useState<TableBooking[]>([]);

  const createTableBooking = useCallback(
    async (
      booking: Omit<TableBooking, 'id' | 'createdAt' | 'status'>
    ): Promise<TableBooking> => {
      const bookingId = `tb-${Date.now()}`;
      const newBooking: TableBooking = {
        ...booking,
        id: bookingId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const updatedBookings = [newBooking, ...tableBookings];
      setTableBookings(() => {
        try { localStorage.setItem('gumti_table_bookings', JSON.stringify(updatedBookings)); } catch (e) { console.error(e); }
        return updatedBookings;
      });

      // Directly push to Firebase
      void saveRestaurantCloudData({ bookings: updatedBookings }).catch((err: unknown) => {
        console.warn('Direct booking sync to Firebase failed:', err);
      });

      // Generate WhatsApp Booking confirmation URL
      const occasionText = booking.specialOccasion && booking.specialOccasion !== 'none' ? ` (${booking.specialOccasion.toUpperCase()})` : '';
      const seatingText = booking.seatingArea ? `\n*Seating:* ${booking.seatingArea.toUpperCase()}${occasionText}` : occasionText ? `\n*Occasion:* ${occasionText}` : '';
      const message = `*Table Reservation Request - ${restaurantProfile.name}* 🍽️\n\n*Guest:* ${booking.guestName}\n*Phone:* ${booking.guestPhone}\n*Guests:* ${booking.guestsCount} People\n*Date:* ${booking.bookingDate}\n*Time:* ${booking.timeSlot}${seatingText}\n${booking.specialNotes ? `*Notes:* ${booking.specialNotes}\n` : ''}\n_Please confirm our table reservation._`;
      const whatsappUrl = generateWhatsAppUrl(message, restaurantProfile.whatsappPhone);

      showToast('Table Reservation Requested! 🍽️', `For ${booking.guestsCount} guests on ${booking.bookingDate}`, 'success');

      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }

      return newBooking;
    },
    [restaurantProfile.name, restaurantProfile.whatsappPhone, showToast]
  );

  const updateTableBookingStatus = (id: string, status: TableBookingStatus, tableNumber?: string) => {
    const updatedBookings = tableBookings.map((b) => (b.id === id ? { ...b, status, ...(tableNumber ? { tableNumber } : {}) } : b));
    setTableBookings(() => {
      try { localStorage.setItem('gumti_table_bookings', JSON.stringify(updatedBookings)); } catch (e) { console.error(e); }
      return updatedBookings;
    });

    // Directly push to Firebase
    void saveRestaurantCloudData({ bookings: updatedBookings }).catch((err: unknown) => {
      console.warn('Direct booking status sync to Firebase failed:', err);
    });
    showToast(`Booking ${status.toUpperCase()} 🍽️`, undefined, 'success');
  };

  const deleteTableBooking = (id: string) => {
    const updatedBookings = tableBookings.filter((b) => b.id !== id);
    setTableBookings(() => {
      try { localStorage.setItem('gumti_table_bookings', JSON.stringify(updatedBookings)); } catch (e) { console.error(e); }
      return updatedBookings;
    });

    // Directly push to Firebase
    void saveRestaurantCloudData({ bookings: updatedBookings }).catch((err: unknown) => {
      console.warn('Direct booking delete sync to Firebase failed:', err);
    });
    showToast('Booking Removed from Records 🗑️', undefined, 'info');
  };

  const exportFullDatabase = (): ZaikaBackupData => ({
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: restaurantProfile,
    menu: restaurantMenu,
    orders: pastOrders,
    bookings: tableBookings,
    categories: adminCategories,
    coupons: adminCoupons,
    customers: adminCustomers,
    announcement: bannerAnnouncement,
    banners: adminBanners,
  });

  const importFullDatabase = (data: unknown): { success: boolean; error?: string } => {
    if (!data || typeof data !== 'object') return { success: false, error: 'Backup must be a JSON object.' };
    const backup = data as Partial<ZaikaBackupData>;
    if (backup.version !== 1 || !backup.profile || !Array.isArray(backup.menu) || !Array.isArray(backup.orders) || !Array.isArray(backup.categories) || !Array.isArray(backup.coupons) || !Array.isArray(backup.customers) || !backup.announcement) {
      return { success: false, error: 'Invalid Zaika backup format or missing sections.' };
    }
    try {
      setRestaurantProfile(backup.profile);
      setRestaurantMenu(backup.menu);
      setPastOrders(backup.orders);
      if (Array.isArray(backup.bookings)) setTableBookings(backup.bookings);
      setAdminCategories(backup.categories);
      setAdminCoupons(backup.coupons);
      setAdminCustomers(backup.customers);
      setBannerAnnouncement(backup.announcement);
      if (Array.isArray(backup.banners)) {
        setAdminBanners(backup.banners);
        localStorage.setItem('gumti_banners', JSON.stringify(backup.banners));
      }
      localStorage.setItem('gumti_cafe_profile', JSON.stringify(backup.profile));
      localStorage.setItem('gumti_cafe_menu', JSON.stringify(backup.menu));
      localStorage.setItem('gumti_past_orders', JSON.stringify(backup.orders));
      localStorage.setItem('gumti_categories', JSON.stringify(backup.categories));
      localStorage.setItem('gumti_coupons', JSON.stringify(backup.coupons));
      localStorage.setItem('gumti_customers', JSON.stringify(backup.customers));
      localStorage.setItem('gumti_banner_announcement', JSON.stringify(backup.announcement));
      showToast('Backup restored successfully', 'All restaurant data is now active.', 'success');
      return { success: true };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unable to restore backup.' };
    }
  };

  // Banner Announcement
  const [bannerAnnouncement, setBannerAnnouncement] = useState<BannerAnnouncement>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('gumti_banner_announcement');
        if (saved) return JSON.parse(saved);
      } catch { }
    }
    return DEFAULT_ANNOUNCEMENT;
  });

  const updateBannerAnnouncement = (updated: Partial<BannerAnnouncement>) => {
    setBannerAnnouncement((prev) => {
      const next = { ...prev, ...updated };
      try {
        localStorage.setItem('gumti_banner_announcement', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast('Banner Announcement Updated! 📢', undefined, 'success');
  };

  // Banner Management System (announcement / hero / promo banners)
  const [adminBanners, setAdminBanners] = useState<BannerRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('gumti_banners');
        if (saved) {
          const parsed = JSON.parse(saved) as BannerRecord[];
          if (Array.isArray(parsed)) return parsed;
        }
        // Migrate legacy announcement banner on first load
        const legacySaved = localStorage.getItem('gumti_banner_announcement');
        if (legacySaved) {
          const legacy = JSON.parse(legacySaved) as BannerAnnouncement;
          const migrated = migrateLegacyAnnouncement(legacy);
          return [
            migrated,
            ...DEFAULT_BANNERS.filter((b) => b.type !== 'announcement'),
          ];
        }
      } catch { }
    }
    return DEFAULT_BANNERS;
  });

  const persistBanners = (banners: BannerRecord[]) => {
    try {
      localStorage.setItem('gumti_banners', JSON.stringify(banners));
    } catch (e) {
      console.error(e);
    }
  };

  const addAdminBanner = (banner: Omit<BannerRecord, 'id' | 'createdAt' | 'updatedAt' | 'sortOrder'>): BannerRecord => {
    const now = createBannerTimestamp();
    const typeOrder = adminBanners.filter((b) => b.type === banner.type).length;
    const newBanner: BannerRecord = {
      ...banner,
      id: createBannerId(),
      sortOrder: typeOrder,
      createdAt: now,
      updatedAt: now,
    };
    const next = [...adminBanners, newBanner];
    setAdminBanners(next);
    persistBanners(next);
    showToast('Banner Created! 🎉', undefined, 'success');
    return newBanner;
  };

  const updateAdminBanner = (id: string, updated: Partial<BannerRecord>) => {
    const next = adminBanners.map((b) =>
      b.id === id ? { ...b, ...updated, updatedAt: new Date().toISOString() } : b,
    );
    setAdminBanners(next);
    persistBanners(next);
    showToast('Banner Updated! ✅', undefined, 'success');
  };

  const deleteAdminBanner = (id: string) => {
    const next = adminBanners.filter((b) => b.id !== id);
    setAdminBanners(next);
    persistBanners(next);
    showToast('Banner Deleted', undefined, 'info');
  };

  const toggleAdminBanner = (id: string) => {
    const next = adminBanners.map((b) =>
      b.id === id ? { ...b, enabled: !b.enabled, updatedAt: new Date().toISOString() } : b,
    );
    setAdminBanners(next);
    persistBanners(next);
  };

  const moveAdminBanner = (id: string, direction: 'up' | 'down') => {
    const banner = adminBanners.find((b) => b.id === id);
    if (!banner) return;
    const sameType = adminBanners
      .filter((b) => b.type === banner.type)
      .toSorted((a, b) => a.sortOrder - b.sortOrder);
    const idx = sameType.findIndex((b) => b.id === id);
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sameType.length) return;

    const reordered = [...sameType];
    [reordered[idx], reordered[swapIdx]] = [reordered[swapIdx], reordered[idx]];
    const sortOrderMap = new Map(reordered.map((b, i) => [b.id, i]));
    const next = adminBanners.map((b) =>
      sortOrderMap.has(b.id)
        ? { ...b, sortOrder: sortOrderMap.get(b.id)!, updatedAt: new Date().toISOString() }
        : b,
    );
    setAdminBanners(next);
    persistBanners(next);
  };

  // Scheduling-aware selectors: banners that are enabled AND within their date window.
  // Computed directly (no useMemo): the array is tiny, the context value is rebuilt
  // on each render anyway, and direct computation keeps the React Compiler happy.
  const activeAnnouncementBanners = adminBanners
    .filter((b) => b.type === 'announcement' && isBannerActive(b))
    .toSorted((a, b) => a.sortOrder - b.sortOrder);

  const activeHeroBanners = adminBanners
    .filter((b) => b.type === 'hero' && isBannerActive(b))
    .toSorted((a, b) => a.sortOrder - b.sortOrder);

  const activeHeroBanner = activeHeroBanners[0] ?? null;
  const activePromoBanners = activeHeroBanners;

  // Customer CRM Records — loaded exclusively from Firebase
  const [adminCustomers, setAdminCustomers] = useState<CustomerRecord[]>([]);

  const addAdminCustomer = (customer: CustomerRecord) => {
    setAdminCustomers((prev) => {
      const next = [customer, ...prev.filter((c) => c.phone !== customer.phone)];
      try {
        localStorage.setItem('gumti_customers', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast(`Customer ${customer.name} Saved 👤`, undefined, 'success');
  };

  const updateAdminCustomer = (id: string, updated: Partial<CustomerRecord>) => {
    setAdminCustomers((prev) => {
      const next = prev.map((c) => (c.id === id ? { ...c, ...updated } : c));
      try {
        localStorage.setItem('gumti_customers', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast('Customer Details Updated', undefined, 'success');
  };

  const deleteAdminCustomer = (id: string) => {
    setAdminCustomers((prev) => {
      const next = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem('gumti_customers', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
    showToast('Customer Record Removed', undefined, 'info');
  };

  // Modals & Advanced Features
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCartWarningModalOpen, setIsCartWarningModalOpen] = useState<boolean>(false);
  const [pendingRestaurantItem, setPendingRestaurantItem] = useState<any>(null);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<string[]>([]);
  const [currentAddress, setCurrentAddress] = useState<DeliveryAddress | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [user, setUser] = useState({
    isLoggedIn: false,
    name: '',
    phone: '',
    email: '',
  });

  const loginUser = (name: string, phone: string, email?: string) => {
    setUser({
      isLoggedIn: true,
      name,
      phone,
      email: email || `${phone}@guest.zaika`,
    });
    setGuestCustomer((prev) => ({ ...prev, name, phone }));
  };

  const logoutUser = () => {
    setUser({
      isLoggedIn: false,
      name: '',
      phone: '',
      email: '',
    });
  };

  const toggleFavoriteRestaurant = (id: string) => {
    setFavoriteRestaurants((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const isRestaurantFavorite = (id: string) => favoriteRestaurants.includes(id);

  const confirmCartOverride = () => {
    clearCart();
    setIsCartWarningModalOpen(false);
    if (pendingRestaurantItem) {
      addToCart(pendingRestaurantItem);
      setPendingRestaurantItem(null);
    }
  };

  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>('rest-1');
  const cartRestaurant = RESTAURANTS[0] || null;
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [isGroupOrderModalOpen, setIsGroupOrderModalOpen] = useState<boolean>(false);
  const [isKOTModalOpen, setIsKOTModalOpen] = useState<boolean>(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [viewingInvoiceOrder, setViewingInvoiceOrder] = useState<Order | null>(null);
  const [scheduledDelivery, setScheduledDelivery] = useState<string>('now');

  const [groupOrder, setGroupOrder] = useState<{
    isGroup: boolean;
    code: string;
    hostName: string;
    currentMember: string;
  }>({
    isGroup: false,
    code: '',
    hostName: '',
    currentMember: 'Indrajit Ghosh',
  });

  const startGroupOrder = (hostName: string = 'Indrajit Ghosh') => {
    const code = createNewGroupCode();
    setGroupOrder({
      isGroup: true,
      code,
      hostName,
      currentMember: hostName,
    });
    showToast('Group Order Started! 👥', `Share Code: ${code} with friends`, 'success');
    return code;
  };

  const joinGroupOrder = (code: string, memberName: string) => {
    setGroupOrder({
      isGroup: true,
      code: code.toUpperCase(),
      hostName: 'Host',
      currentMember: memberName,
    });
    showToast(`Joined Group Order #${code.toUpperCase()}! 🎉`, `Adding items as ${memberName}`, 'success');
  };

  const leaveGroupOrder = () => {
    setGroupOrder({
      isGroup: false,
      code: '',
      hostName: '',
      currentMember: guestCustomer.name || 'Guest',
    });
    showToast('Left group order session', undefined, 'info');
  };

  const setGroupOrderMember = (name: string) => {
    setGroupOrder((prev) => ({ ...prev, currentMember: name }));
  };

  // Add to cart
  const addToCart = (
    item: MenuItem,
    quantity: number = 1,
    customizations?: CartItemCustomization[],
    instructions?: string,
    orderedBy?: string
  ) => {
    // Calculate total item price including customizations
    const customizationAddonPrice =
      customizations?.reduce((acc, grp) => {
        return acc + grp.selectedOptions.reduce((oAcc, opt) => oAcc + opt.price, 0);
      }, 0) || 0;

    const finalUnitPrice = item.price + customizationAddonPrice;

    // Check if identical item (same menu id and same customization signature) already exists
    const customizationKey = JSON.stringify(customizations || []);
    const existingIndex = cart.findIndex(
      (ci) => ci.menuItemId === item.id && JSON.stringify(ci.customizations || []) === customizationKey
    );

    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      const newCartItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        menuItemId: item.id,
        restaurantId: 'my-restaurant',
        restaurantName: restaurantProfile.name,
        name: item.name,
        price: finalUnitPrice,
        vegType: item.vegType,
        image: item.image,
        quantity,
        customizations,
        specialInstructions: instructions,
        orderedBy: orderedBy || (groupOrder.isGroup ? groupOrder.currentMember : undefined),
      };
      setCart([...cart, newCartItem]);
    }

    showToast(`Added to cart`, `${quantity}x ${item.name}`, 'success');
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item)));
  };

  const removeFromCart = (cartItemId: string) => {
    const item = cart.find((c) => c.id === cartItemId);
    setCart((prev) => prev.filter((c) => c.id !== cartItemId));
    if (item) {
      showToast('Removed from cart', item.name, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    showToast('Cart cleared', undefined, 'info');
  };

  // Bill Calculations
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const itemTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Delivery fee logic: Delivery has standard fee unless threshold reached; Dine-in & Pickup have 0 delivery fee
  const rawDeliveryFee =
    orderType === 'delivery'
      ? itemTotal >= restaurantProfile.freeDeliveryThreshold || itemTotal === 0
        ? 0
        : restaurantProfile.deliveryFee
      : 0;

  const platformFee = 0; // No platform fee for direct restaurant ordering!
  const taxes = Math.round(itemTotal * (restaurantProfile.serviceTaxPercentage / 100));

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon && itemTotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.code === 'FREEDEL') {
      discountAmount = rawDeliveryFee;
    } else if (appliedCoupon.discountType === 'percentage') {
      const calc = (itemTotal * appliedCoupon.discountValue) / 100;
      discountAmount = appliedCoupon.maxDiscount ? Math.min(calc, appliedCoupon.maxDiscount) : calc;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
    discountAmount = Math.min(discountAmount, itemTotal);
  }

  const deliveryFee = appliedCoupon?.code === 'FREEDEL' ? 0 : rawDeliveryFee;
  const grandTotal = Math.max(0, itemTotal + deliveryFee + platformFee + taxes + (orderType === 'delivery' ? deliveryTip : 0) - discountAmount);

  // Coupon handling
  const applyCoupon = (coupon: Coupon): boolean => {
    if (itemTotal < coupon.minOrderValue) {
      showToast(
        'Coupon Cannot be Applied',
        `Add ₹${coupon.minOrderValue - itemTotal} more items to apply ${coupon.code}`,
        'error'
      );
      return false;
    }
    setAppliedCoupon(coupon);
    showToast(`Coupon Applied: ${coupon.code} 🎉`, coupon.description, 'success');
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', undefined, 'info');
  };

  const toggleDeliveryInstruction = (inst: string) => {
    setDeliveryInstructions((prev) =>
      prev.includes(inst) ? prev.filter((i) => i !== inst) : [...prev, inst]
    );
  };

  const placeOrder = async (options?: {
      customAdminPhone?: string;
      specialNotes?: string;
      overrideOrderType?: OrderType;
      overrideTableNumber?: string;
      overrideCustomer?: Partial<GuestCustomerInfo>;
    }): Promise<{ orderId: string; whatsappUrl: string; message: string }> => {
    if (cart.length === 0) return { orderId: '', whatsappUrl: '', message: '' };
    if (!isFirebaseConnected || !firebaseReadyRef.current) {
      throw new Error('The restaurant ordering service is unavailable. Please try again in a moment.');
    }

    const finalOrderType = options?.overrideOrderType || orderType;
    const finalTable = options?.overrideTableNumber || tableNumber;
    const targetAdminPhone = options?.customAdminPhone || restaurantProfile.whatsappPhone || DEFAULT_ADMIN_WHATSAPP;
    const orderId = `ord-${Date.now()}`;
    const orderNum = `GC-${Math.floor(10000 + Math.random() * 90000)}`;

    const customerData = { ...guestCustomer, ...options?.overrideCustomer };

    const deliveryAddressObj: DeliveryAddress = {
      id: 'guest-addr',
      type: 'Home',
      label: finalOrderType === 'dine_in' ? `Dine-in Table #${finalTable}` : finalOrderType === 'pickup' ? 'Counter Pickup' : 'Delivery Address',
      street: customerData.street || '',
      area: customerData.area || '',
      city: customerData.city || '',
      pincode: customerData.pincode || '',
      phone: customerData.phone || '',
      isDefault: true,
    };

    const formattedMessage = formatOrderForWhatsApp({
      id: orderId,
      orderNumber: orderNum,
      restaurantName: restaurantProfile.name,
      restaurantAddress: `${restaurantProfile.address}, ${restaurantProfile.city}`,
      items: [...cart],
      itemTotal,
      taxes,
      deliveryFee,
      platformFee,
      discount: discountAmount,
      tip: finalOrderType === 'delivery' ? deliveryTip : 0,
      grandTotal,
      orderType: finalOrderType,
      tableNumber: finalTable,
      deliveryAddress: deliveryAddressObj,
      customerName: customerData.name || 'Guest',
      customerPhone: customerData.phone || '',
      deliveryInstructions,
      specialNotes: options?.specialNotes || guestCustomer.specialNotes,
      cutleryNeeded,
      appliedCouponCode: appliedCoupon?.code,
      scheduledDelivery: scheduledDelivery !== 'now' ? scheduledDelivery : undefined,
      isGroupOrder: groupOrder.isGroup,
      groupCode: groupOrder.code,
    });

    const whatsappUrl = generateWhatsAppUrl(formattedMessage, targetAdminPhone);

    const newOrder: Order = {
      id: orderId,
      orderNumber: orderNum,
      restaurantId: 'my-restaurant',
      restaurantName: restaurantProfile.name,
      restaurantImage: restaurantProfile.logoImage,
      restaurantAddress: restaurantProfile.address,
      items: [...cart],
      itemTotal,
      deliveryFee,
      taxes,
      discount: discountAmount,
      platformFee,
      tip: finalOrderType === 'delivery' ? deliveryTip : 0,
      grandTotal,
      status: 'placed',
      createdAt: new Date().toISOString(),
      orderType: finalOrderType,
      tableNumber: finalTable,
      customerName: customerData.name || 'Guest',
      customerPhone: customerData.phone || '-',
      estimatedDeliveryTime:
        scheduledDelivery !== 'now'
          ? scheduledDelivery
          : finalOrderType === 'dine_in'
            ? '10-15 mins to Table'
            : finalOrderType === 'pickup'
              ? restaurantProfile.estimatedPickupTime
              : restaurantProfile.estimatedDeliveryTime,
      deliveryAddress: deliveryAddressObj,
      paymentMethod: 'Pay at Counter / Cash on Delivery / UPI',
      scheduledDelivery: scheduledDelivery !== 'now' ? scheduledDelivery : undefined,
      isGroupOrder: groupOrder.isGroup,
      groupCode: groupOrder.code,
      adminWhatsAppPhone: targetAdminPhone,
      whatsappOrderUrl: whatsappUrl,
    };

    const updatedOrders = [newOrder, ...pastOrders];
    // Persist first so a failed Firebase write never looks like a placed order.
    await saveRestaurantCloudData({ orders: updatedOrders });
    setActiveOrder(newOrder);
    setPastOrders(updatedOrders);
    setCart([]);
    setAppliedCoupon(null);
    try { localStorage.setItem('gumti_active_order_id', orderId); } catch { }

    // Save customer info
    updateGuestCustomer(customerData);

    // Navigate to order tracking
    setActiveView('order-tracking');
    showToast('Order Created! 📲', 'Opening WhatsApp to send to restaurant', 'success');

    return { orderId, whatsappUrl, message: formattedMessage };
  };

  const reorder = (prevOrder: Order) => {
    for (const item of prevOrder.items) {
      const match = restaurantMenu.find((m) => m.id === item.menuItemId || m.name === item.name);
      if (match) {
        addToCart(match, item.quantity, item.customizations, item.specialInstructions);
      }
    }
    setActiveView('cart');
    showToast('Items added to cart', 'Ready for WhatsApp checkout', 'success');
  };

  const trackOrder = (order: Order) => {
    setActiveOrder(order);
    setActiveView('order-tracking');
  };

  const cancelActiveOrder = () => {
    if (activeOrder) {
      setActiveOrder((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
      showToast('Order Cancelled', undefined, 'info');
    }
  };

  const firebaseReadyRef = useRef(false);
  const skipFirebaseSyncRef = useRef(false);
  const currentRestaurantStateRef = useRef({
    restaurantProfile,
    restaurantMenu,
    pastOrders,
    tableBookings,
    tableBookingConfig,
    adminCategories,
    adminCoupons,
    adminCustomers,
    bannerAnnouncement,
    adminBanners,
  });
  useEffect(() => {
    currentRestaurantStateRef.current = {
      restaurantProfile,
      restaurantMenu,
      pastOrders,
      tableBookings,
      tableBookingConfig,
      adminCategories,
      adminCoupons,
      adminCustomers,
      bannerAnnouncement,
      adminBanners,
    };
  }, [
    isFirebaseConnected,
    restaurantProfile,
    restaurantMenu,
    pastOrders,
    tableBookings,
    tableBookingConfig,
    adminCategories,
    adminCoupons,
    adminCustomers,
    bannerAnnouncement,
    adminBanners,
  ]);

  useEffect(() => {
    const unsubscribe = subscribeToRestaurantCloudData((cloudData) => {
      skipFirebaseSyncRef.current = true;
      setIsFirebaseConnected(true);
      
      if (cloudData.profile) {
        setRestaurantProfile(cloudData.profile as RestaurantProfile);
        try { localStorage.setItem('gumti_cafe_profile', JSON.stringify(cloudData.profile)); } catch { }
      }
      
      // The Firebase document is the only source of menu data.
      const menuData = Array.isArray(cloudData.menu) ? cloudData.menu : [];
      setRestaurantMenu(menuData as MenuItem[]);
      try { localStorage.setItem('gumti_cafe_menu', JSON.stringify(menuData)); } catch { }
      
      const cloudOrders = Array.isArray(cloudData.orders) ? cloudData.orders as Order[] : [];
      setPastOrders(cloudOrders);
      let activeOrderId = '';
      try { activeOrderId = localStorage.getItem('gumti_active_order_id') || ''; } catch { }
      setActiveOrder(cloudOrders.find((order) => order.id === activeOrderId && !['delivered', 'cancelled'].includes(order.status)) || null);
      if (cloudData.bookings) setTableBookings(cloudData.bookings as TableBooking[]);
      if (cloudData.bookingConfig) setTableBookingConfig(cloudData.bookingConfig as TableBookingConfig);
      if (cloudData.categories) setAdminCategories(cloudData.categories as string[]);
      if (cloudData.coupons) setAdminCoupons(cloudData.coupons as Coupon[]);
      if (cloudData.customers) setAdminCustomers(cloudData.customers as CustomerRecord[]);
      if (cloudData.announcement) setBannerAnnouncement(cloudData.announcement as BannerAnnouncement);
      if (cloudData.banners) setAdminBanners(cloudData.banners as BannerRecord[]);

      firebaseReadyRef.current = true;
      setIsLoadingMenu(false);
    }, (error) => {
      console.error('Firebase sync unavailable; ordering and cloud changes are disabled.', error.message);
      setIsFirebaseConnected(false);
      setIsLoadingMenu(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!firebaseReadyRef.current || !isFirebaseConnected) return;
    if (skipFirebaseSyncRef.current) {
      skipFirebaseSyncRef.current = false;
      return;
    }

    void saveRestaurantCloudData({
      profile: restaurantProfile,
      menu: restaurantMenu,
      menuVersion: GHUTI_CAFE_MENU_VERSION,
      orders: pastOrders,
      bookings: tableBookings,
      bookingConfig: tableBookingConfig,
      categories: adminCategories,
      coupons: adminCoupons,
      customers: adminCustomers,
      announcement: bannerAnnouncement,
      banners: adminBanners,
    }).catch((error: unknown) => {
      console.warn('Firebase write failed; local data remains available.', error);
    });
  }, [
    restaurantProfile,
    restaurantMenu,
    pastOrders,
    tableBookings,
    tableBookingConfig,
    adminCategories,
    adminCoupons,
    adminCustomers,
    bannerAnnouncement,
    adminBanners,
  ]);

  // Automatic live order status ticker removed for production

  // Search & Navigation
  const addRecentSearch = (term: string) => {
    if (!term.trim()) return;
    setRecentSearches((prev) => [term, ...prev.filter((t) => t.toLowerCase() !== term.toLowerCase())].slice(0, 6));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const [filterOptions, setFilterOptions] = useState<FilterOptions>(defaultFilters);
  const resetFilters = () => setFilterOptions(defaultFilters);

  // Selected Food Item for Details View
  const [selectedItemId, setSelectedItemId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const itemParam = urlParams.get('item');
        if (itemParam) return itemParam;
      } catch { }
    }
    return null;
  });

  const selectedItem = useMemo(() => {
    if (!selectedItemId) return null;
    return restaurantMenu.find((item) => item.id === selectedItemId) || null;
  }, [selectedItemId, restaurantMenu]);

  // Sync route to pathname + query params
  const getPathForView = (
    view: ActiveView,
    options?: { category?: string; query?: string; table?: string; itemId?: string; restaurantId?: string }
  ) => {
    const targetItemId = options?.itemId !== undefined ? options.itemId : selectedItemId;
    const targetCategory = options?.category !== undefined ? options.category : selectedCategory;
    const targetQuery = options?.query !== undefined ? options.query : searchQuery;

    switch (view) {
      case 'home':
        return '/';
      case 'item-detail':
        return targetItemId ? `/item-detail?item=${encodeURIComponent(targetItemId)}` : '/item-detail';
      case 'category-detail':
        return targetCategory ? `/category-detail?cat=${encodeURIComponent(targetCategory)}` : '/category-detail';
      case 'search':
        return targetQuery ? `/search?q=${encodeURIComponent(targetQuery)}` : '/search';
      case 'about':
      case 'cart':
      case 'checkout':
      case 'book-table':
      case 'contact':
      case 'offers':
      case 'orders':
      case 'order-tracking':
      case 'favorites':
      case 'profile':
      case 'qr-code':
      case 'privacy':
      case 'terms':
        return `/${view}`;
      default:
        return `/${view}`;
    }
  };

  const navigateTo = (
    view: ActiveView,
    options?: { category?: string; query?: string; orderId?: string; table?: string; restaurantId?: string; itemId?: string }
  ) => {
    if (options?.category !== undefined) {
      setSelectedCategory(options.category);
    }
    if (options?.query !== undefined) {
      setSearchQuery(options.query);
      addRecentSearch(options.query);
    }
    if (options?.table !== undefined) {
      setTableNumber(options.table);
      setOrderType('dine_in');
    }
    if (options?.restaurantId !== undefined) {
      setSelectedRestaurantId(options.restaurantId);
    }
    if (options?.itemId !== undefined) {
      setSelectedItemId(options.itemId);
    }

    setActiveView(view);

    // Update browser address bar without full page reload
    if (typeof window !== 'undefined') {
      try {
        const targetUrl = getPathForView(view, options);
        if (window.location.pathname + window.location.search !== targetUrl) {
          window.history.pushState({ view, ...options }, '', targetUrl);
        }
      } catch (err) {
        console.error('History pushState error:', err);
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Restore app state from the current URL (shared by popstate + initial deep-link load)
  const restoreStateFromUrl = () => {
    const path = window.location.pathname.replace(/^\/+/, '').split('/')[0] || 'home';
    const searchParams = new URLSearchParams(window.location.search);
    const itemParam = searchParams.get('item');
    const catParam = searchParams.get('cat');
    const qParam = searchParams.get('q');
    const tableParam = searchParams.get('table');

    if (itemParam) setSelectedItemId(itemParam);
    if (catParam) setSelectedCategory(catParam);
    if (qParam) setSearchQuery(qParam);
    if (tableParam) {
      setTableNumber(tableParam);
      setOrderType('dine_in');
    }

    const validViews: ActiveView[] = [
      'home',
      'about',
      'menu',
      'cart',
      'checkout',
      'book-table',
      'contact',
      'offers',
      'orders',
      'order-tracking',
      'favorites',
      'profile',
      'qr-code',
      'privacy',
      'terms',
      'item-detail',
      'category-detail',
      'search',
    ];

    const matchedView = validViews.includes(path as ActiveView) ? (path as ActiveView) : 'home';
    setActiveView(matchedView);
  };

  // On first mount, honor deep-link query params (e.g. /item-detail?item=..., /search?q=..., /category-detail?cat=...)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasDeepLinkParams = window.location.search.length > 0;
    if (hasDeepLinkParams) {
      restoreStateFromUrl();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for browser Back and Forward navigation buttons
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      restoreStateFromUrl();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        restaurantProfile,
        updateRestaurantProfile,
        isLoadingMenu,
        isFirebaseConnected,
        restaurantMenu,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        toggleMenuItemStock,
        bulkUpdateMenuItemsAvailability,
        bulkDeleteMenuItems,
        resetMenuToDefault,
        exportFullDatabase,
        importFullDatabase,
        orderType,
        setOrderType,
        tableNumber,
        setTableNumber,
        guestCustomer,
        setGuestCustomer,
        updateGuestCustomer,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartItemCount,
        itemTotal,
        deliveryFee,
        taxes,
        discountAmount,
        platformFee,
        deliveryTip,
        setDeliveryTip,
        deliveryInstructions,
        toggleDeliveryInstruction,
        cutleryNeeded,
        setCutleryNeeded,
        grandTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        activeOrder,
        pastOrders,
        updateOrderStatus,
        deleteOrder,
        placeOrder,
        reorder,
        trackOrder,
        cancelActiveOrder,
        adminCoupons,
        addAdminCoupon,
        updateAdminCoupon,
        deleteAdminCoupon,
        adminCategories,
        addAdminCategory,
        updateAdminCategory,
        deleteAdminCategory,
        bannerAnnouncement,
        updateBannerAnnouncement,
        adminBanners,
        addAdminBanner,
        updateAdminBanner,
        deleteAdminBanner,
        toggleAdminBanner,
        moveAdminBanner,
        activeAnnouncementBanners,
        activeHeroBanners,
        activeHeroBanner,
        activePromoBanners,
        adminCustomers,
        addAdminCustomer,
        updateAdminCustomer,
        deleteAdminCustomer,
        tableBookings,
        tableBookingConfig,
        updateTableBookingConfig,
        createTableBooking,
        updateTableBookingStatus,
        deleteTableBooking,
        filterOptions,
        setFilterOptions,
        resetFilters,
        customizingItem,
        setCustomizingItem,
        isFilterModalOpen,
        setIsFilterModalOpen,
        isHelpModalOpen,
        setIsHelpModalOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCartWarningModalOpen,
        setIsCartWarningModalOpen,
        pendingRestaurantItem,
        setPendingRestaurantItem,
        confirmCartOverride,
        user,
        loginUser,
        logoutUser,
        currentAddress,
        setCurrentAddress,
        savedAddresses,
        setSavedAddresses,
        favoriteRestaurants,
        toggleFavoriteRestaurant,
        isRestaurantFavorite,
        selectedRestaurantId,
        setSelectedRestaurantId,
        cartRestaurant,
        isAiAssistantOpen,
        setIsAiAssistantOpen,
        isGroupOrderModalOpen,
        setIsGroupOrderModalOpen,
        isKOTModalOpen,
        setIsKOTModalOpen,
        isInvoiceModalOpen,
        setIsInvoiceModalOpen,
        viewingInvoiceOrder,
        setViewingInvoiceOrder,
        scheduledDelivery,
        setScheduledDelivery,
        groupOrder,
        startGroupOrder,
        joinGroupOrder,
        leaveGroupOrder,
        setGroupOrderMember,
        selectedItemId,
        setSelectedItemId,
        selectedItem,
        navigateTo,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
