'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Store,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Phone,
  MessageCircle,
  Clock,
  MapPin,
  Save,
  RotateCcw,
  Sparkles,
  Utensils,
  Image as ImageIcon,
  Flame,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  TrendingUp,
  Tag,
  Users,
  QrCode,
  Sliders,
  DollarSign,
  Search,
  Filter,
  ArrowRight,
  Eye,
  FileText,
  Printer,
  Copy,
  Layers,
  Megaphone,
  Download,
  Star,
  Coffee,
  CheckCheck,
  ShieldCheck,
  Building,
} from 'lucide-react';
import {
  MenuItem,
  RestaurantProfile,
  VegType,
  OrderStatus,
  OrderType,
  Coupon,
  CustomerRecord,
} from '@/lib/types';
import { VegBadge } from '@/components/ui/VegBadge';
import Image from 'next/image';

const IMAGE_PRESETS = [
  { label: 'Royal Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80' },
  { label: 'Tandoori Kebab', url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80' },
  { label: 'Butter Chicken / Curry', url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80' },
  { label: 'Dal Makhani', url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80' },
  { label: 'Tandoori Naan', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80' },
  { label: 'Royal Thali', url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=800&auto=format&fit=crop&q=80' },
  { label: 'Crispy Dosa', url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=800&auto=format&fit=crop&q=80' },
  { label: 'Artisan Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80' },
  { label: 'Gourmet Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80' },
  { label: 'Gulab Jamun / Sweet', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800&auto=format&fit=crop&q=80' },
  { label: 'Beverage / Lassi', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80' },
];

export const AdminMenuView: React.FC = () => {
  const {
    restaurantProfile,
    updateRestaurantProfile,
    restaurantMenu,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleMenuItemStock,
    resetMenuToDefault,
    pastOrders,
    updateOrderStatus,
    deleteOrder,
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
    adminCustomers,
    addAdminCustomer,
    updateAdminCustomer,
    deleteAdminCustomer,
    bulkUpdateMenuItemsAvailability,
    bulkDeleteMenuItems,
    exportFullDatabase,
    importFullDatabase,
    setIsKOTModalOpen,
    setIsInvoiceModalOpen,
    setViewingInvoiceOrder,
    navigateTo,
    showToast,
  } = useApp();

  type AdminTab =
    | 'overview'
    | 'orders'
    | 'menu'
    | 'categories'
    | 'offers'
    | 'announcements'
    | 'customers'
    | 'qr_tables'
    | 'settings';

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Menu Management State
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [dishSearch, setDishSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [dishVegFilter, setDishVegFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // Dish Form Fields
  const [dishName, setDishName] = useState('');
  const [dishCategory, setDishCategory] = useState(adminCategories[1] || 'Starters & Kebabs 🍢');
  const [dishPrice, setDishPrice] = useState<number>(250);
  const [dishOriginalPrice, setDishOriginalPrice] = useState<number>(300);
  const [dishVegType, setDishVegType] = useState<VegType>('veg');
  const [dishDescription, setDishDescription] = useState('');
  const [dishImage, setDishImage] = useState(IMAGE_PRESETS[0].url);
  const [dishPreparationTime, setDishPreparationTime] = useState('15-20 mins');
  const [dishPortionSize, setDishPortionSize] = useState('Serves 1-2');
  const [dishSpiceLevel, setDishSpiceLevel] = useState<0 | 1 | 2 | 3>(1);
  const [dishIsBestseller, setDishIsBestseller] = useState(false);
  const [dishIsAvailable, setDishIsAvailable] = useState(true);

  // Category Manager State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryOld, setEditingCategoryOld] = useState<string | null>(null);
  const [editingCategoryNew, setEditingCategoryNew] = useState('');

  // Orders Management State
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Coupons State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponTitle, setCouponTitle] = useState('');
  const [couponDesc, setCouponDesc] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [couponValue, setCouponValue] = useState<number>(20);
  const [couponMinOrder, setCouponMinOrder] = useState<number>(299);
  const [couponMaxDiscount, setCouponMaxDiscount] = useState<number>(100);

  // Customer Management State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custArea, setCustArea] = useState('');
  const [custAddress, setCustAddress] = useState('');
  const [custNotes, setCustNotes] = useState('');
  const [custIsVip, setCustIsVip] = useState(false);
  const [customerSearch, setCustomerSearch] = useState('');

  // Announcement State
  const [announcementEnabled, setAnnouncementEnabled] = useState(bannerAnnouncement.enabled);
  const [announcementText, setAnnouncementText] = useState(bannerAnnouncement.text);
  const [announcementBadge, setAnnouncementBadge] = useState(bannerAnnouncement.badge || 'FESTIVAL OFFER');

  // QR Tables State
  const [qrTableCount, setQrTableCount] = useState(12);
  const [selectedPreviewTable, setSelectedPreviewTable] = useState('1');
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
  const backupInputRef = useRef<HTMLInputElement>(null);

  // Restaurant Settings Form
  const [settingsForm, setSettingsForm] = useState<RestaurantProfile>(restaurantProfile);

  // Analytics Metrics Calculations
  const analytics = useMemo(() => {
    const totalSales = pastOrders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const totalOrdersCount = pastOrders.length;
    const aov = totalOrdersCount > 0 ? Math.round(totalSales / totalOrdersCount) : 0;
    const activeOrdersCount = pastOrders.filter((o) => ['placed', 'confirmed', 'preparing', 'on_the_way'].includes(o.status)).length;
    const dineInCount = pastOrders.filter((o) => o.orderType === 'dine_in').length;
    const deliveryCount = pastOrders.filter((o) => o.orderType === 'delivery').length;
    const pickupCount = pastOrders.filter((o) => o.orderType === 'pickup').length;

    // Item popularity
    const itemSalesMap: Record<string, { name: string; count: number; revenue: number; vegType: VegType }> = {};
    pastOrders.forEach((order) => {
      if (order.status === 'cancelled') return;
      order.items.forEach((item) => {
        if (!itemSalesMap[item.name]) {
          itemSalesMap[item.name] = { name: item.name, count: 0, revenue: 0, vegType: item.vegType };
        }
        itemSalesMap[item.name].count += item.quantity;
        itemSalesMap[item.name].revenue += item.price * item.quantity;
      });
    });

    const topDishes = Object.values(itemSalesMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalSales,
      totalOrdersCount,
      aov,
      activeOrdersCount,
      dineInCount,
      deliveryCount,
      pickupCount,
      topDishes,
    };
  }, [pastOrders]);

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return restaurantMenu.filter((item) => {
      const matchesCategory = selectedCategoryFilter === 'All' || item.category === selectedCategoryFilter;
      const matchesVeg =
        dishVegFilter === 'all'
          ? true
          : dishVegFilter === 'veg'
            ? item.vegType === 'veg'
            : item.vegType !== 'veg';
      const matchesSearch =
        item.name.toLowerCase().includes(dishSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(dishSearch.toLowerCase()) ||
        item.category.toLowerCase().includes(dishSearch.toLowerCase());
      return matchesCategory && matchesVeg && matchesSearch;
    });
  }, [restaurantMenu, selectedCategoryFilter, dishVegFilter, dishSearch]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return pastOrders.filter((order) => {
      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      const matchesType = orderTypeFilter === 'all' || order.orderType === orderTypeFilter;
      const query = orderSearchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        order.orderNumber.toLowerCase().includes(query) ||
        (order.customerName && order.customerName.toLowerCase().includes(query)) ||
        (order.customerPhone && order.customerPhone.includes(query)) ||
        (order.tableNumber && order.tableNumber.includes(query));
      return matchesStatus && matchesType && matchesSearch;
    });
  }, [pastOrders, orderStatusFilter, orderTypeFilter, orderSearchQuery]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    const q = customerSearch.toLowerCase();
    return adminCustomers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.area && c.area.toLowerCase().includes(q))
    );
  }, [adminCustomers, customerSearch]);

  // Handlers for Dishes
  const handleOpenAddDish = () => {
    setEditingDishId(null);
    setDishName('');
    setDishCategory(adminCategories[1] || 'Starters & Kebabs 🍢');
    setDishPrice(250);
    setDishOriginalPrice(300);
    setDishVegType('veg');
    setDishDescription('');
    setDishImage(IMAGE_PRESETS[0].url);
    setDishPreparationTime('15-20 mins');
    setDishPortionSize('Serves 1');
    setDishSpiceLevel(1);
    setDishIsBestseller(false);
    setDishIsAvailable(true);
    setIsDishModalOpen(true);
  };

  const handleOpenEditDish = (item: MenuItem) => {
    setEditingDishId(item.id);
    setDishName(item.name);
    setDishCategory(item.category);
    setDishPrice(item.price);
    setDishOriginalPrice(item.originalPrice || item.price);
    setDishVegType(item.vegType);
    setDishDescription(item.description);
    setDishImage(item.image);
    setDishPreparationTime(item.preparationTime || '15 mins');
    setDishPortionSize(item.portionSize || 'Serves 1');
    setDishSpiceLevel(item.spiceLevel || 0);
    setDishIsBestseller(!!item.isBestseller);
    setDishIsAvailable(item.isAvailable !== false);
    setIsDishModalOpen(true);
  };

  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) {
      showToast('Dish name is required', undefined, 'error');
      return;
    }

    if (editingDishId) {
      updateMenuItem(editingDishId, {
        name: dishName.trim(),
        category: dishCategory,
        price: Number(dishPrice),
        originalPrice: Number(dishOriginalPrice),
        vegType: dishVegType,
        description: dishDescription.trim(),
        image: dishImage.trim() || IMAGE_PRESETS[0].url,
        preparationTime: dishPreparationTime,
        portionSize: dishPortionSize,
        spiceLevel: dishSpiceLevel,
        isBestseller: dishIsBestseller,
        isAvailable: dishIsAvailable,
      });
      showToast('Dish Updated Successfully! ✨', dishName, 'success');
    } else {
      addMenuItem({
        name: dishName.trim(),
        category: dishCategory,
        price: Number(dishPrice),
        originalPrice: Number(dishOriginalPrice),
        vegType: dishVegType,
        description: dishDescription.trim(),
        image: dishImage.trim() || IMAGE_PRESETS[0].url,
        preparationTime: dishPreparationTime,
        portionSize: dishPortionSize,
        spiceLevel: dishSpiceLevel,
        isBestseller: dishIsBestseller,
        isAvailable: dishIsAvailable,
      });
      showToast('Dish Added to Menu! 🍽️', dishName, 'success');
    }
    setIsDishModalOpen(false);
  };

  // Handlers for Category
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addAdminCategory(newCategoryName.trim());
    setNewCategoryName('');
  };

  const handleUpdateCategory = (oldCat: string) => {
    if (!editingCategoryNew.trim()) return;
    updateAdminCategory(oldCat, editingCategoryNew.trim());
    setEditingCategoryOld(null);
    setEditingCategoryNew('');
  };

  // Handlers for Coupon
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const newCoupon: Coupon = {
      code: couponCode.trim().toUpperCase(),
      title: couponTitle.trim() || `${couponValue}% OFF`,
      description: couponDesc.trim() || `Min order ₹${couponMinOrder}`,
      discountType: couponType,
      discountValue: Number(couponValue),
      minOrderValue: Number(couponMinOrder),
      maxDiscount: couponType === 'percentage' ? Number(couponMaxDiscount) : undefined,
      validUntil: '31 Dec 2026',
    };
    addAdminCoupon(newCoupon);
    setIsCouponModalOpen(false);
    setCouponCode('');
    setCouponTitle('');
    setCouponDesc('');
  };

  // Handlers for Customers
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim() || !custPhone.trim()) {
      showToast('Name & Phone are required', undefined, 'error');
      return;
    }
    const newRecord: CustomerRecord = {
      id: `cust-${Date.now()}`,
      name: custName.trim(),
      phone: custPhone.trim(),
      email: custEmail.trim(),
      area: custArea.trim(),
      address: custAddress.trim(),
      totalOrders: 1,
      totalSpent: 450,
      lastOrderDate: 'Just added',
      isVip: custIsVip,
      notes: custNotes.trim(),
    };
    addAdminCustomer(newRecord);
    setIsCustomerModalOpen(false);
    setCustName('');
    setCustPhone('');
    setCustEmail('');
    setCustArea('');
    setCustAddress('');
    setCustNotes('');
    setCustIsVip(false);
  };

  // Handlers for Announcements
  const handleSaveAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    updateBannerAnnouncement({
      enabled: announcementEnabled,
      text: announcementText.trim(),
      badge: announcementBadge.trim(),
    });
  };

  // Save Restaurant Profile
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurantProfile(settingsForm);
  };

  // Direct Customer WhatsApp Dispatch for Order Status updates
  const sendOrderStatusWhatsApp = (order: (typeof pastOrders)[0], customMessage: string) => {
    const phone = (order.customerPhone || '').replace(/\D/g, '');
    if (!phone) {
      showToast('No customer phone number available', undefined, 'error');
      return;
    }
    const fullPhone = phone.startsWith('91') ? phone : `91${phone}`;
    const url = `https://wa.me/${fullPhone}?text=${encodeURIComponent(customMessage)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  // Download Customer CSV
  const exportCustomersCSV = () => {
    const headers = 'Name,Phone,Email,Area,TotalOrders,TotalSpent,LastOrderDate,IsVIP,Notes\n';
    const rows = adminCustomers
      .map(
        (c) =>
          `"${c.name}","${c.phone}","${c.email || ''}","${c.area || ''}",${c.totalOrders},${c.totalSpent},"${c.lastOrderDate}",${c.isVip ? 'Yes' : 'No'},"${c.notes || ''}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_${restaurantProfile.name.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Customer Directory Exported! 📥', 'CSV file downloaded', 'success');
  };

  return (
    <div id="admin-management-portal" className="min-h-screen bg-zinc-50 pb-28 text-zinc-900">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-zinc-200 shadow-xs">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white flex items-center justify-center font-black shadow-md shadow-orange-600/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-zinc-900 leading-tight">
                  {restaurantProfile.name}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700">
                  Manager Portal
                </span>
              </div>
              <p className="text-xs text-zinc-500 flex items-center gap-2">
                <span>WhatsApp: +{restaurantProfile.whatsappPhone}</span>
                <span>•</span>
                <span>{restaurantProfile.locality}, {restaurantProfile.city}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Store Status Toggle */}
            <button
              onClick={() => {
                const nextStatus = !restaurantProfile.isOpen;
                updateRestaurantProfile({ isOpen: nextStatus });
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs ${restaurantProfile.isOpen
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                }`}
            >
              <span className={`w-2 h-2 rounded-full ${restaurantProfile.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              {restaurantProfile.isOpen ? 'OPEN FOR ORDERS' : 'STORE CLOSED'}
            </button>

            {/* View Live Store */}
            <button
              onClick={() => navigateTo('home')}
              className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Customer View</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-x-auto no-scrollbar border-t border-zinc-100 flex gap-1 sm:gap-2 pt-1.5 pb-1.5">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'orders', label: 'Live Orders', icon: ShoppingBag, badge: analytics.activeOrdersCount },
            { id: 'menu', label: 'Menu & Dishes', icon: Utensils, count: restaurantMenu.length },
            { id: 'categories', label: 'Categories', icon: Layers, count: adminCategories.length },
            { id: 'offers', label: 'Offers & Coupons', icon: Tag, count: adminCoupons.length },
            { id: 'announcements', label: 'Announcement Banner', icon: Megaphone },
            { id: 'customers', label: 'Customer CRM', icon: Users, count: adminCustomers.length },
            { id: 'qr_tables', label: 'Table QR Standees', icon: QrCode },
            { id: 'settings', label: 'Restaurant Settings & UPI', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap flex items-center gap-2 transition-all shrink-0 ${isActive
                  ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/20'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${isActive ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-700'}`}>
                    {tab.badge}
                  </span>
                )}
                {tab.count !== undefined && !tab.badge && (
                  <span className={`text-[10px] opacity-75 font-semibold`}>
                    ({tab.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* ======================= 1. OVERVIEW & ANALYTICS TAB ======================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
              <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-500">Total Recorded Sales</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    ₹
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-zinc-900">
                  ₹{analytics.totalSales.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> Across {analytics.totalOrdersCount} orders
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-500">Active Kitchen Orders</span>
                  <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-orange-600">
                  {analytics.activeOrdersCount}
                </div>
                <p className="text-[11px] text-zinc-500 font-bold mt-1">
                  In cooking & delivery queue
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-500">Average Order Value</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-zinc-900">
                  ₹{analytics.aov}
                </div>
                <p className="text-[11px] text-zinc-500 font-bold mt-1">
                  Average bill size
                </p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-zinc-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-zinc-500">Registered Customers</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-zinc-900">
                  {adminCustomers.length}
                </div>
                <p className="text-[11px] text-purple-600 font-bold mt-1">
                  In WhatsApp Customer Directory
                </p>
              </div>
            </div>

            {/* Channel Breakdown & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Channels */}
              <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs">
                <h3 className="text-sm font-black text-zinc-900 mb-4 flex items-center justify-between">
                  <span>Order Mode Breakdown</span>
                  <span className="text-xs font-semibold text-zinc-400">Total: {analytics.totalOrdersCount}</span>
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1">
                      <span>🛵 Home Delivery</span>
                      <span>{analytics.deliveryCount} orders</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{
                          width: `${analytics.totalOrdersCount ? (analytics.deliveryCount / analytics.totalOrdersCount) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1">
                      <span>🪑 Dine-in Table Orders</span>
                      <span>{analytics.dineInCount} orders</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{
                          width: `${analytics.totalOrdersCount ? (analytics.dineInCount / analytics.totalOrdersCount) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-zinc-700 mb-1">
                      <span>🛍️ Counter Takeaway / Pickup</span>
                      <span>{analytics.pickupCount} orders</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{
                          width: `${analytics.totalOrdersCount ? (analytics.pickupCount / analytics.totalOrdersCount) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-semibold">Active Menu Catalog:</span>
                  <span className="font-black text-zinc-900">{restaurantMenu.length} dishes in {adminCategories.length} categories</span>
                </div>
              </div>

              {/* Bestselling Dishes */}
              <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-black text-zinc-900 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Top Ordered Dishes</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('menu')}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <span>Manage Menu</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {analytics.topDishes.length === 0 ? (
                  <p className="text-xs text-zinc-400 py-8 text-center">No order history available yet.</p>
                ) : (
                  <div className="divide-y divide-zinc-100">
                    {analytics.topDishes.map((dish, i) => (
                      <div key={dish.name} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-800 font-black text-xs flex items-center justify-center">
                            #{i + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <VegBadge type={dish.vegType} size="sm" />
                              <span className="text-xs font-extrabold text-zinc-800">{dish.name}</span>
                            </div>
                            <span className="text-[11px] text-zinc-400">{dish.count} portions sold</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-black text-zinc-900">₹{dish.revenue.toLocaleString('en-IN')}</div>
                          <span className="text-[10px] text-emerald-600 font-bold">Revenue</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-3xl p-6 text-white shadow-lg shadow-orange-600/15">
              <h3 className="text-base font-black mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Restaurant Management Quick Actions</span>
              </h3>
              <p className="text-xs text-orange-100 mb-4 max-w-xl">
                Quickly add new seasonal specials, print dining table QR codes, broadcast flash offers, and update live restaurant details.
              </p>

              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => {
                    setActiveTab('menu');
                    handleOpenAddDish();
                  }}
                  className="px-4 py-2.5 bg-white text-orange-700 hover:bg-orange-50 rounded-2xl text-xs font-black shadow-xs transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Dish</span>
                </button>

                <button
                  onClick={() => setActiveTab('qr_tables')}
                  className="px-4 py-2.5 bg-black/20 hover:bg-black/30 text-white rounded-2xl text-xs font-black backdrop-blur-xs transition-all flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Print Table QRs</span>
                </button>

                <button
                  onClick={() => setActiveTab('offers')}
                  className="px-4 py-2.5 bg-black/20 hover:bg-black/30 text-white rounded-2xl text-xs font-black backdrop-blur-xs transition-all flex items-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  <span>Create Discount Coupon</span>
                </button>

                <button
                  onClick={() => setActiveTab('announcements')}
                  className="px-4 py-2.5 bg-black/20 hover:bg-black/30 text-white rounded-2xl text-xs font-black backdrop-blur-xs transition-all flex items-center gap-2"
                >
                  <Megaphone className="w-4 h-4" />
                  <span>Update Announcement Marquee</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className="px-4 py-2.5 bg-black/20 hover:bg-black/30 text-white rounded-2xl text-xs font-black backdrop-blur-xs transition-all flex items-center gap-2"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Store & UPI Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================= 2. LIVE ORDERS & WHATSAPP LOG TAB ======================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearchQuery}
                    onChange={(e) => setOrderSearchQuery(e.target.value)}
                    placeholder="Search by Order #, Customer or Phone..."
                    className="pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="placed">Placed / New</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Cooking in Kitchen</option>
                  <option value="on_the_way">Out for Delivery / Table Ready</option>
                  <option value="delivered">Delivered / Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Type Filter */}
                <select
                  value={orderTypeFilter}
                  onChange={(e) => setOrderTypeFilter(e.target.value)}
                  className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Order Modes</option>
                  <option value="delivery">🛵 Delivery</option>
                  <option value="dine_in">🪑 Dine-in Table</option>
                  <option value="pickup">🛍️ Takeaway Pickup</option>
                </select>
              </div>

              <div className="text-xs font-extrabold text-zinc-500">
                Showing {filteredOrders.length} of {pastOrders.length} orders
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-zinc-200 text-center">
                <ShoppingBag className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-zinc-800">No orders found</h3>
                <p className="text-xs text-zinc-500 mt-1">Try changing your search filter or place an order from the customer view.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredOrders.map((order) => {
                  const statusColors: Record<OrderStatus, { bg: string; text: string; label: string }> = {
                    placed: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', label: 'Placed / Received' },
                    confirmed: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'Order Confirmed' },
                    preparing: { bg: 'bg-orange-50 border-orange-200', text: 'text-orange-700', label: 'Cooking in Kitchen' },
                    on_the_way: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', label: order.orderType === 'dine_in' ? 'Ready for Table' : 'Out for Delivery' },
                    delivered: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', label: 'Delivered / Completed' },
                    cancelled: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', label: 'Cancelled' },
                  };

                  const currentStatus = statusColors[order.status] || statusColors.confirmed;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs flex flex-col justify-between"
                    >
                      {/* Order Top Bar */}
                      <div>
                        <div className="flex items-start justify-between gap-2 pb-3 border-b border-zinc-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-zinc-900">{order.orderNumber}</span>
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${order.orderType === 'dine_in'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : order.orderType === 'pickup'
                                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                                    : 'bg-orange-50 text-orange-800 border-orange-200'
                                  }`}
                              >
                                {order.orderType === 'dine_in'
                                  ? `Table #${order.tableNumber || '1'}`
                                  : order.orderType === 'pickup'
                                    ? 'Takeaway'
                                    : 'Home Delivery'}
                              </span>
                            </div>
                            <span className="text-[11px] text-zinc-400 font-medium">{order.createdAt}</span>
                          </div>

                          {/* Status Select */}
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`text-xs font-black px-2.5 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${currentStatus.bg} ${currentStatus.text}`}
                          >
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="preparing">Cooking</option>
                            <option value="on_the_way">{order.orderType === 'dine_in' ? 'Table Served' : 'Out for Delivery'}</option>
                            <option value="delivered">Completed / Paid</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* Customer Information */}
                        <div className="py-3 bg-zinc-50/70 -mx-5 px-5 my-2 border-y border-zinc-100 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-black text-zinc-900 block">{order.customerName || 'Guest Customer'}</span>
                            <span className="text-zinc-500 text-[11px]">{order.customerPhone || 'Phone not provided'}</span>
                          </div>
                          {order.customerPhone && (
                            <a
                              href={`tel:${order.customerPhone}`}
                              className="px-2.5 py-1 bg-white border border-zinc-200 hover:bg-zinc-100 rounded-lg text-zinc-700 text-xs font-bold flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3 text-emerald-600" />
                              <span>Call</span>
                            </a>
                          )}
                        </div>

                        {/* Order Items */}
                        <div className="space-y-1.5 my-3">
                          {order.items.map((it, idx) => (
                            <div key={idx} className="flex items-start justify-between text-xs">
                              <div className="flex items-start gap-1.5">
                                <VegBadge type={it.vegType} size="sm" />
                                <span className="font-extrabold text-zinc-800">
                                  {it.quantity}x {it.name}
                                </span>
                              </div>
                              <span className="font-bold text-zinc-900">₹{it.price * it.quantity}</span>
                            </div>
                          ))}
                        </div>

                        {/* Total Bill summary */}
                        <div className="pt-2 border-t border-dashed border-zinc-200 flex items-center justify-between text-xs">
                          <span className="text-zinc-500 font-semibold">Grand Total ({order.paymentMethod}):</span>
                          <span className="text-sm font-black text-zinc-900">₹{order.grandTotal}</span>
                        </div>
                      </div>

                      {/* Order Action Buttons */}
                      <div className="pt-4 mt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-2">
                        {/* WhatsApp Customer Update Actions */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            onClick={() =>
                              sendOrderStatusWhatsApp(
                                order,
                                `Hello ${order.customerName || 'Customer'}! 👋 Your order ${order.orderNumber} at ${restaurantProfile.name} is CONFIRMED and our chef is cooking it fresh in the kitchen! 🍳🔥\n\nTotal: ₹${order.grandTotal}\nEstimated Time: ${order.estimatedDeliveryTime}`
                              )
                            }
                            title="Send WhatsApp update to customer"
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-[11px] font-black flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Notify Cooking</span>
                          </button>

                          <button
                            onClick={() =>
                              sendOrderStatusWhatsApp(
                                order,
                                `Hello ${order.customerName || 'Customer'}! 🛵 Your delicious food for order ${order.orderNumber} is READY / Out for Delivery! 🍽️\n\nThank you for choosing ${restaurantProfile.name}!`
                              )
                            }
                            title="Send Ready update to customer"
                            className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-[11px] font-black flex items-center gap-1"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Notify Ready</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Print Kitchen KOT */}
                          <button
                            onClick={() => {
                              setViewingInvoiceOrder(order);
                              setIsKOTModalOpen(true);
                            }}
                            title="Kitchen Order Ticket (KOT)"
                            className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>

                          {/* Print Invoice */}
                          <button
                            onClick={() => {
                              setViewingInvoiceOrder(order);
                              setIsInvoiceModalOpen(true);
                            }}
                            title="Print Tax Invoice"
                            className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => deleteOrder(order.id)}
                            title="Delete Order Log"
                            className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======================= 3. MENU & DISHES TAB ======================= */}
        {activeTab === 'menu' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Controls */}
            <div className="bg-white p-4 rounded-3xl border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={dishSearch}
                    onChange={(e) => setDishSearch(e.target.value)}
                    placeholder="Search dishes by name or spices..."
                    className="pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
                  />
                </div>

                {/* Category Filter */}
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="All">All Categories ({restaurantMenu.length})</option>
                  {adminCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat} ({restaurantMenu.filter((m) => m.category === cat).length})
                    </option>
                  ))}
                </select>

                {/* Veg Filter */}
                <select
                  value={dishVegFilter}
                  onChange={(e) => setDishVegFilter(e.target.value as any)}
                  className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Food Types</option>
                  <option value="veg">🟢 Pure Veg</option>
                  <option value="non-veg">🔴 Non-Veg / Egg</option>
                </select>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-end">
                {selectedMenuIds.length > 0 && (
                  <>
                    <button
                      onClick={() => bulkUpdateMenuItemsAvailability(selectedMenuIds, true)}
                      className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold"
                    >Mark In Stock ({selectedMenuIds.length})</button>
                    <button
                      onClick={() => bulkUpdateMenuItemsAvailability(selectedMenuIds, false)}
                      className="px-3 py-2 bg-amber-50 text-amber-700 rounded-xl text-xs font-bold"
                    >Mark Sold Out</button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete ${selectedMenuIds.length} selected dishes?`)) {
                          bulkDeleteMenuItems(selectedMenuIds);
                          setSelectedMenuIds([]);
                        }
                      }}
                      className="px-3 py-2 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold"
                    >Delete Selected</button>
                  </>
                )}
                <button
                  onClick={() => setSelectedMenuIds(filteredMenuItems.length === selectedMenuIds.length ? [] : filteredMenuItems.map((item) => item.id))}
                  className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold"
                >{selectedMenuIds.length === filteredMenuItems.length ? 'Clear Selection' : 'Select Visible'}</button>
                <button
                  onClick={resetMenuToDefault}
                  className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <button
                  onClick={handleOpenAddDish}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-md shadow-orange-600/20 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Dish</span>
                </button>
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMenuItems.map((item) => {
                const isAvailable = item.isAvailable !== false;

                return (
                  <div
                    key={item.id}
                    className={`bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs flex flex-col justify-between transition-all ${!isAvailable ? 'opacity-70 bg-zinc-50' : ''
                      }`}
                  >
                    <div>
                      {/* Photo Banner */}
                      <div className="relative h-40 w-full bg-zinc-100 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Badges on Image */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <VegBadge type={item.vegType} size="md" />
                          {item.isBestseller && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-zinc-950 shadow-xs flex items-center gap-1">
                              <Star className="w-3 h-3 fill-zinc-950" /> Bestseller
                            </span>
                          )}
                        </div>

                        {/* Category tag */}
                        <div className="absolute bottom-2.5 left-2.5">
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-black/60 backdrop-blur-xs text-white">
                            {item.category}
                          </span>
                        </div>

                        {/* In Stock toggle button on image */}
                        <div className="absolute top-2.5 right-2.5">
                          <button
                            onClick={() => toggleMenuItemStock(item.id)}
                            className={`px-2.5 py-1 rounded-xl text-[10px] font-black shadow-md backdrop-blur-md transition-all ${isAvailable
                              ? 'bg-emerald-600/90 text-white'
                              : 'bg-rose-600/90 text-white'
                              }`}
                          >
                            {isAvailable ? 'IN STOCK' : 'SOLD OUT'}
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <label className="flex items-center gap-2 mb-3 text-[11px] font-bold text-zinc-500">
                          <input
                            type="checkbox"
                            checked={selectedMenuIds.includes(item.id)}
                            onChange={(event) => setSelectedMenuIds((prev) => event.target.checked ? [...prev, item.id] : prev.filter((id) => id !== item.id))}
                            className="accent-orange-600"
                          />
                          Select for bulk action
                        </label>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-black text-zinc-900 leading-snug">{item.name}</h4>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-black text-zinc-900">₹{item.price}</span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-[10px] text-zinc-400 line-through block">₹{item.originalPrice}</span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>

                        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-zinc-100 text-[11px] text-zinc-500">
                          {item.preparationTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-zinc-400" />
                              {item.preparationTime}
                            </span>
                          )}
                          {item.spiceLevel !== undefined && item.spiceLevel > 0 && (
                            <span className="flex items-center gap-0.5 text-orange-600 font-bold">
                              <Flame className="w-3 h-3" />
                              {item.spiceLevel === 1 ? 'Mild' : item.spiceLevel === 2 ? 'Spicy' : 'Hot 🔥'}
                            </span>
                          )}
                          {item.portionSize && (
                            <span className="text-zinc-400">({item.portionSize})</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => toggleMenuItemStock(item.id)}
                        className={`text-xs font-bold py-1.5 px-3 rounded-xl transition-colors ${isAvailable
                          ? 'text-zinc-600 hover:bg-zinc-200'
                          : 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200'
                          }`}
                      >
                        {isAvailable ? 'Mark as Sold Out' : 'Mark In Stock'}
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditDish(item)}
                          className="p-2 bg-white hover:bg-orange-50 text-zinc-700 hover:text-orange-600 border border-zinc-200 rounded-xl transition-colors shadow-xs"
                          title="Edit Dish"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${item.name}" from your menu?`)) {
                              deleteMenuItem(item.id);
                            }
                          }}
                          className="p-2 bg-white hover:bg-rose-50 text-zinc-700 hover:text-rose-600 border border-zinc-200 rounded-xl transition-colors shadow-xs"
                          title="Delete Dish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= 4. CATEGORIES MANAGER TAB ======================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Add Category Form */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs">
              <h3 className="text-base font-black text-zinc-900 mb-2 flex items-center gap-2">
                <Layers className="w-5 h-5 text-orange-600" />
                <span>Menu Categories & Sections</span>
              </h3>
              <p className="text-xs text-zinc-500 mb-4">
                Organize your food items into clear menu sections. Add relevant emojis to make them visual and attractive.
              </p>

              <form onSubmit={handleAddCategory} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g. Tandoori Platters 🔥, Chef Specials ⭐"
                  className="flex-1 px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </form>
            </div>

            {/* Categories List */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-xs divide-y divide-zinc-100 overflow-hidden">
              {adminCategories.map((cat, idx) => {
                const dishCount = restaurantMenu.filter((m) => m.category === cat).length;
                const isEditing = editingCategoryOld === cat;

                return (
                  <div key={cat} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="w-6 h-6 rounded-full bg-zinc-100 text-zinc-500 text-xs font-black flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      {isEditing ? (
                        <div className="flex items-center gap-2 flex-1 max-w-sm">
                          <input
                            type="text"
                            value={editingCategoryNew}
                            onChange={(e) => setEditingCategoryNew(e.target.value)}
                            className="flex-1 px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-lg text-xs font-bold"
                          />
                          <button
                            onClick={() => handleUpdateCategory(cat)}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingCategoryOld(null)}
                            className="p-1.5 bg-zinc-200 text-zinc-700 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div>
                          <span className="text-sm font-black text-zinc-900">{cat}</span>
                          <span className="text-xs text-zinc-400 ml-2">({dishCount} dishes)</span>
                        </div>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingCategoryOld(cat);
                            setEditingCategoryNew(cat);
                          }}
                          className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl"
                          title="Rename Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {adminCategories.length > 2 && (
                          <button
                            onClick={() => {
                              if (confirm(`Delete category "${cat}"? Associated items will remain.`)) {
                                deleteAdminCategory(cat);
                              }
                            }}
                            className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl"
                            title="Delete Category"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= 5. OFFERS & COUPONS TAB ======================= */}
        {activeTab === 'offers' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-zinc-900">Discount Coupons & Offers</h3>
                <p className="text-xs text-zinc-500">Create promo codes that customers can apply directly in their shopping cart.</p>
              </div>
              <button
                onClick={() => setIsCouponModalOpen(true)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Promo Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminCoupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-amber-100 text-amber-900 font-black text-xs rounded-xl tracking-wider uppercase border border-amber-300">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm(`Delete coupon "${coupon.code}"?`)) {
                            deleteAdminCoupon(coupon.code);
                          }
                        }}
                        className="text-zinc-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-sm font-black text-zinc-900">{coupon.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{coupon.description}</p>

                    <div className="mt-3 pt-3 border-t border-zinc-100 text-[11px] text-zinc-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Discount:</span>
                        <strong className="text-zinc-900">
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `Flat ₹${coupon.discountValue} OFF`}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Min Order Bill:</span>
                        <strong className="text-zinc-900">₹{coupon.minOrderValue}</strong>
                      </div>
                      {coupon.maxDiscount && (
                        <div className="flex justify-between">
                          <span>Max Discount Cap:</span>
                          <strong className="text-zinc-900">₹{coupon.maxDiscount}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= 6. ANNOUNCEMENTS & CONTENT TAB ======================= */}
        {activeTab === 'announcements' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs max-w-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5 text-orange-600" />
                  <h3 className="text-base font-black text-zinc-900">Announcement Banner Marquee</h3>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={announcementEnabled}
                    onChange={(e) => setAnnouncementEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                  <span className="ml-2 text-xs font-bold text-zinc-700">
                    {announcementEnabled ? 'Active on Store' : 'Hidden'}
                  </span>
                </label>
              </div>

              <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
                This banner sits prominently on the top of the restaurant storefront to announce current promotions, holiday closures, or chef specials.
              </p>

              <form onSubmit={handleSaveAnnouncement} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={announcementBadge}
                    onChange={(e) => setAnnouncementBadge(e.target.value)}
                    placeholder="e.g. FESTIVAL OFFER, WEEKEND SPECIAL, NOTICE"
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Announcement Message Text</label>
                  <textarea
                    rows={3}
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    placeholder="e.g. Flat 20% OFF on all Tandoori Kebabs & Biryanis today! Use code ZAIKA20 on checkout."
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Live Preview */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-zinc-400 block mb-1.5 uppercase">Live Storefront Preview:</span>
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl text-white flex items-center gap-2.5 text-xs shadow-xs">
                    <span className="px-2 py-0.5 rounded-md bg-white text-orange-700 font-black text-[10px] uppercase">
                      {announcementBadge || 'NOTICE'}
                    </span>
                    <span className="font-bold truncate">{announcementText}</span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Announcement</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================= 7. CUSTOMER CRM DIRECTORY TAB ======================= */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-4 rounded-3xl border border-zinc-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search by customer name, phone or area..."
                    className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={exportCustomersCSV}
                  className="px-3.5 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={() => setIsCustomerModalOpen(true)}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Customer</span>
                </button>
              </div>
            </div>

            {/* Customers Table / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCustomers.map((cust) => {
                const phoneDigits = cust.phone.replace(/\D/g, '');
                const waPhone = phoneDigits.startsWith('91') ? phoneDigits : `91${phoneDigits}`;

                return (
                  <div
                    key={cust.id}
                    className="bg-white rounded-3xl border border-zinc-200/80 p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-black text-zinc-900">{cust.name}</h4>
                            {cust.isVip && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">
                                VIP
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-zinc-500">{cust.phone}</span>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Remove customer record for "${cust.name}"?`)) {
                              deleteAdminCustomer(cust.id);
                            }
                          }}
                          className="text-zinc-300 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {cust.area && (
                        <p className="text-xs text-zinc-500 flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                          <span className="truncate">{cust.address || cust.area}</span>
                        </p>
                      )}

                      {cust.notes && (
                        <p className="text-[11px] text-zinc-600 bg-zinc-50 p-2 rounded-xl mb-3 border border-zinc-100">
                          <strong>Note:</strong> {cust.notes}
                        </p>
                      )}

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-100 text-center">
                        <div className="bg-zinc-50 py-1.5 rounded-xl">
                          <span className="text-[10px] text-zinc-400 block font-semibold">Total Orders</span>
                          <strong className="text-xs font-black text-zinc-800">{cust.totalOrders}</strong>
                        </div>
                        <div className="bg-zinc-50 py-1.5 rounded-xl">
                          <span className="text-[10px] text-zinc-400 block font-semibold">Total Spent</span>
                          <strong className="text-xs font-black text-emerald-700">₹{cust.totalSpent}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-3 border-t border-zinc-100 flex items-center justify-between gap-2">
                      <a
                        href={`https://wa.me/${waPhone}?text=${encodeURIComponent(`Hello ${cust.name}! Greetings from ${restaurantProfile.name} 🍽️ We have exciting new chef specials today!`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Chat</span>
                      </a>
                      <a
                        href={`tel:${cust.phone}`}
                        className="p-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= 8. TABLE QR CODES & STANDEES TAB ======================= */}
        {activeTab === 'qr_tables' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Standee Settings & Generator */}
              <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs lg:col-span-1 space-y-4">
                <h3 className="text-base font-black text-zinc-900 flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-orange-600" />
                  <span>Dine-In Table QR Generator</span>
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Generate direct ordering QR codes for your dining tables. When guests scan the code, the menu opens with their table number pre-selected.
                </p>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Total Dine-In Tables</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={qrTableCount}
                    onChange={(e) => setQrTableCount(Number(e.target.value))}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Select Table to Preview</label>
                  <div className="grid grid-cols-4 gap-1.5 max-h-48 overflow-y-auto p-1 bg-zinc-50 rounded-xl border border-zinc-200">
                    {Array.from({ length: qrTableCount }, (_, i) => `${i + 1}`).map((tbl) => (
                      <button
                        key={tbl}
                        onClick={() => setSelectedPreviewTable(tbl)}
                        className={`py-1.5 rounded-lg text-xs font-black transition-all ${selectedPreviewTable === tbl
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-white text-zinc-700 hover:bg-zinc-200'
                          }`}
                      >
                        Table {tbl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.print();
                      }
                    }}
                    className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-black rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Table Standee</span>
                  </button>
                </div>
              </div>

              {/* Standee Visual Card Preview */}
              <div className="lg:col-span-2 flex items-center justify-center">
                <div
                  id="printable-table-standee"
                  className="bg-white border-2 border-orange-600 rounded-3xl p-8 max-w-sm w-full text-center shadow-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-orange-600 to-amber-500" />

                  <div className="w-14 h-14 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mx-auto mb-3 font-black text-xl shadow-inner">
                    🍽️
                  </div>

                  <h2 className="text-lg font-black text-zinc-900 uppercase tracking-wide">
                    {restaurantProfile.name}
                  </h2>
                  <p className="text-xs text-zinc-500 font-semibold mb-4">
                    Scan to view digital menu & order via WhatsApp
                  </p>

                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200 inline-block mb-4 shadow-inner">
                    <div className="relative w-48 h-48 mx-auto bg-white p-2 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-center">
                      <Image
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
                          typeof window !== 'undefined' ? `${window.location.origin}/?table=${selectedPreviewTable}` : `https://zaikakitchen.app/?table=${selectedPreviewTable}`
                        )}`}
                        alt={`QR Code for Table ${selectedPreviewTable}`}
                        fill
                        className="object-contain p-1"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>

                  <div className="bg-orange-600 text-white py-2 px-4 rounded-xl font-black text-sm uppercase tracking-widest inline-block shadow-md">
                    TABLE #{selectedPreviewTable}
                  </div>

                  <div className="mt-4 pt-4 border-t border-zinc-100 text-[10px] text-zinc-400 space-y-0.5">
                    <p className="font-bold text-zinc-600">No App Download • No Login Required</p>
                    <p>Orders sent directly to kitchen WhatsApp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= 9. RESTAURANT SETTINGS & UPI TAB ======================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-4xl">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* General Store Information */}
              <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-black text-zinc-900 flex items-center gap-2">
                  <Building className="w-5 h-5 text-orange-600" />
                  <span>Restaurant Identity & Contact</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Tagline & Cuisine Specialty</label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">
                      WhatsApp Order Receiving Number (Without +)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.whatsappPhone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsappPhone: e.target.value.replace(/\D/g, '') })}
                      placeholder="e.g. 919876543210"
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-emerald-700 font-mono"
                      required
                    />
                    <span className="text-[10px] text-zinc-400">Orders from website will be sent to this WhatsApp.</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Helpline Phone Number</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Locality</label>
                    <input
                      type="text"
                      value={settingsForm.locality}
                      onChange={(e) => setSettingsForm({ ...settingsForm, locality: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">City</label>
                    <input
                      type="text"
                      value={settingsForm.city}
                      onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">FSSAI License #</label>
                    <input
                      type="text"
                      value={settingsForm.fssaiNumber}
                      onChange={(e) => setSettingsForm({ ...settingsForm, fssaiNumber: e.target.value })}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Full Restaurant Address</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Direct UPI Payment Details */}
              <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-black text-zinc-900 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  <span>UPI Payment Settings (Direct to Bank)</span>
                </h3>
                <p className="text-xs text-zinc-500">
                  Configure your restaurant official UPI ID to receive payments straight from customers with zero commission.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Merchant UPI VPA ID</label>
                    <input
                      type="text"
                      value={settingsForm.upiId}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                      placeholder="e.g. zaika.kitchen@okhdfcbank"
                      className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono text-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Merchant Payee Name</label>
                    <input
                      type="text"
                      value={settingsForm.upiPayeeName}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upiPayeeName: e.target.value })}
                      placeholder="e.g. Zaika Grand Kitchen"
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery & Pricing Settings */}
              <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
                <h3 className="text-base font-black text-zinc-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-orange-600" />
                  <span>Delivery Charges & Tax Configuration</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Delivery Fee (₹)</label>
                    <input
                      type="number"
                      value={settingsForm.deliveryFee}
                      onChange={(e) => setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) })}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Free Delivery Above (₹)</label>
                    <input
                      type="number"
                      value={settingsForm.freeDeliveryThreshold}
                      onChange={(e) => setSettingsForm({ ...settingsForm, freeDeliveryThreshold: Number(e.target.value) })}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">GST / Tax (%)</label>
                    <input
                      type="number"
                      value={settingsForm.serviceTaxPercentage}
                      onChange={(e) => setSettingsForm({ ...settingsForm, serviceTaxPercentage: Number(e.target.value) })}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Estimated Delivery Time</label>
                    <input
                      type="text"
                      value={settingsForm.estimatedDeliveryTime}
                      onChange={(e) => setSettingsForm({ ...settingsForm, estimatedDeliveryTime: e.target.value })}
                      placeholder="e.g. 30-40 mins"
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Opening Hours</label>
                    <input
                      type="text"
                      value={settingsForm.openingHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                      placeholder="e.g. 11:00 AM - 11:30 PM (Mon - Sun)"
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-xs font-black shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </form>
            <section className="mt-6 bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs">
              <h3 className="text-base font-black text-zinc-900">Backup & Restore</h3>
              <p className="text-xs text-zinc-500 mt-1">Export or restore all menu, order, customer, coupon, category, profile, and banner data.</p>
              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(exportFullDatabase(), null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `zaika_backup_${new Date().toISOString().slice(0, 10)}.json`;
                    link.click();
                    URL.revokeObjectURL(url);
                    showToast('Backup exported', 'JSON download started', 'success');
                  }}
                  className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-xs font-black flex items-center gap-2"
                ><Download className="w-4 h-4" /> Export Full Backup</button>
                <button onClick={() => backupInputRef.current?.click()} className="px-4 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-black">Import Backup</button>
                <input ref={backupInputRef} type="file" accept="application/json,.json" className="hidden" onChange={async (event) => {
                  const file = event.target.files?.[0];
                  if (!file) return;
                  try {
                    const result = importFullDatabase(JSON.parse(await file.text()));
                    if (!result.success) showToast('Import failed', result.error, 'error');
                  } catch { showToast('Import failed', 'The selected file is not valid JSON.', 'error'); }
                  event.target.value = '';
                }} />
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ======================= MODAL: ADD / EDIT DISH ======================= */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Utensils className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-zinc-900">
                  {editingDishId ? 'Edit Menu Dish' : 'Add New Dish to Menu'}
                </h3>
              </div>
              <button
                onClick={() => setIsDishModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveDish} className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Dish Name</label>
                <input
                  type="text"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  placeholder="e.g. Murgh Dum Biryani (Royal)"
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Category</label>
                  <select
                    value={dishCategory}
                    onChange={(e) => setDishCategory(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {adminCategories.filter((c) => c !== 'All Items').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Food Type</label>
                  <select
                    value={dishVegType}
                    onChange={(e) => setDishVegType(e.target.value as VegType)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="veg">🟢 Pure Veg</option>
                    <option value="non-veg">🔴 Non-Veg</option>
                    <option value="egg">🟡 Contains Egg</option>
                    <option value="vegan">🌱 Vegan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={dishPrice}
                    onChange={(e) => setDishPrice(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-900"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Original MRP (₹, optional)</label>
                  <input
                    type="number"
                    min={0}
                    value={dishOriginalPrice}
                    onChange={(e) => setDishOriginalPrice(Number(e.target.value))}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-zinc-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Dish Description</label>
                <textarea
                  rows={2}
                  value={dishDescription}
                  onChange={(e) => setDishDescription(e.target.value)}
                  placeholder="Fresh aromatic spices, slow cooked over charcoal dum..."
                  className="w-full text-xs font-semibold px-3.5 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Photo Picker with Presets */}
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={dishImage}
                  onChange={(e) => setDishImage(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 mb-2"
                />

                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Or pick from food photo presets:
                </span>
                <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setDishImage(preset.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap border transition-all ${dishImage === preset.url
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100'
                        }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Prep Time</label>
                  <input
                    type="text"
                    value={dishPreparationTime}
                    onChange={(e) => setDishPreparationTime(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Portion Size</label>
                  <input
                    type="text"
                    value={dishPortionSize}
                    onChange={(e) => setDishPortionSize(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Spice Level</label>
                  <select
                    value={dishSpiceLevel}
                    onChange={(e) => setDishSpiceLevel(Number(e.target.value) as any)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={0}>0 - None / Sweet</option>
                    <option value={1}>1 - Mild 🌶️</option>
                    <option value={2}>2 - Medium 🌶️🌶️</option>
                    <option value={3}>3 - Extra Hot 🔥</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 flex items-center justify-between border-t border-zinc-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800">
                  <input
                    type="checkbox"
                    checked={dishIsBestseller}
                    onChange={(e) => setDishIsBestseller(e.target.checked)}
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <span>Mark as Chef Bestseller ⭐</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800">
                  <input
                    type="checkbox"
                    checked={dishIsAvailable}
                    onChange={(e) => setDishIsAvailable(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>Available In Stock</span>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-zinc-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-md shadow-orange-600/20"
                >
                  {editingDishId ? 'Update Dish' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL: CREATE COUPON ======================= */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <h3 className="text-base font-black text-zinc-900 flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-600" />
                <span>Create Promo Code</span>
              </h3>
              <button
                onClick={() => setIsCouponModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="e.g. FESTIVAL50, ZAIKA20"
                  className="w-full text-xs font-black px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono uppercase"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Offer Title</label>
                <input
                  type="text"
                  value={couponTitle}
                  onChange={(e) => setCouponTitle(e.target.value)}
                  placeholder="e.g. Flat 20% OFF on all orders"
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Discount Type</label>
                  <select
                    value={couponType}
                    onChange={(e) => setCouponType(e.target.value as any)}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="percentage">Percentage (% OFF)</option>
                    <option value="flat">Flat Cash (₹ OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Value ({couponType === 'percentage' ? '%' : '₹'})</label>
                  <input
                    type="number"
                    min={1}
                    value={couponValue}
                    onChange={(e) => setCouponValue(Number(e.target.value))}
                    className="w-full text-xs font-bold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Min Order Bill (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={couponMinOrder}
                    onChange={(e) => setCouponMinOrder(Number(e.target.value))}
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {couponType === 'percentage' && (
                  <div>
                    <label className="text-xs font-bold text-zinc-700 block mb-1">Max Cap (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={couponMaxDiscount}
                      onChange={(e) => setCouponMaxDiscount(Number(e.target.value))}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-xs"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================= MODAL: ADD CUSTOMER ======================= */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <h3 className="text-base font-black text-zinc-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-orange-600" />
                <span>Add Customer Contact</span>
              </h3>
              <button
                onClick={() => setIsCustomerModalOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Customer Full Name</label>
                <input
                  type="text"
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="e.g. Indrajit Ghosh"
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Phone Number (WhatsApp)</label>
                <input
                  type="text"
                  value={custPhone}
                  onChange={(e) => setCustPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Area / Locality</label>
                  <input
                    type="text"
                    value={custArea}
                    onChange={(e) => setCustArea(e.target.value)}
                    placeholder="Indiranagar"
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-zinc-700 block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Customer Preferences / Notes</label>
                <input
                  type="text"
                  value={custNotes}
                  onChange={(e) => setCustNotes(e.target.value)}
                  placeholder="Prefers extra spicy, weekend dinner regular"
                  className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800 pt-1">
                <input
                  type="checkbox"
                  checked={custIsVip}
                  onChange={(e) => setCustIsVip(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <span>Tag as VIP Regular Customer 👑</span>
              </label>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-zinc-600 hover:bg-zinc-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-black shadow-xs"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
