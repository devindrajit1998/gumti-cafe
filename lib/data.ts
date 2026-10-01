import { Restaurant, Category, Coupon, DeliveryAddress, Order } from './types';

export const CATEGORIES: Category[] = [
  {
    id: 'biryani',
    name: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&auto=format&fit=crop&q=80',
    cuisineMatch: 'Biryani',
    badge: 'Popular',
  },
  {
    id: 'pizza',
    name: 'Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80',
    cuisineMatch: 'Pizza',
  },
  {
    id: 'burgers',
    name: 'Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&auto=format&fit=crop&q=80',
    cuisineMatch: 'Burgers',
    badge: 'Trending',
  },
  {
    id: 'north-indian',
    name: 'North Indian',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&auto=format&fit=crop&q=80',
    cuisineMatch: 'North Indian',
  },
  {
    id: 'south-indian',
    name: 'South Indian',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=300&auto=format&fit=crop&q=80',
    cuisineMatch: 'South Indian',
  },
  {
    id: 'chinese',
    name: 'Chinese',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=300&auto=format&fit=crop&q=80',
    cuisineMatch: 'Chinese',
  },
  {
    id: 'rolls',
    name: 'Rolls & Wraps',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=300&auto=format&fit=crop&q=80',
    cuisineMatch: 'Rolls',
  },
  {
    id: 'momos',
    name: 'Momos',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=300&auto=format&fit=crop&q=80',
    cuisineMatch: 'Momos',
  },
  {
    id: 'desserts',
    name: 'Desserts',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=300&auto=format&fit=crop&q=80',
    cuisineMatch: 'Desserts',
  },
  {
    id: 'cakes',
    name: 'Cakes & Bakery',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&auto=format&fit=crop&q=80',
    cuisineMatch: 'Bakery',
  },
  {
    id: 'thali',
    name: 'Royal Thali',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?w=300&auto=format&fit=crop&q=80',
    cuisineMatch: 'Thali',
    badge: 'Value',
  },
  {
    id: 'healthy',
    name: 'Healthy Bowls',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300&auto=format&fit=crop&q=80',
    cuisineMatch: 'Healthy Food',
  },
  {
    id: 'street-food',
    name: 'Street Chaat',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80',
    cuisineMatch: 'Street Food',
  },
  {
    id: 'beverages',
    name: 'Chai & Shakes',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=300&auto=format&fit=crop&q=80',
    cuisineMatch: 'Beverages',
  },
];

export const PROMO_BANNERS = [
  {
    id: 'banner-1',
    title: '50% OFF on First Order',
    subtitle: 'Use code WELCOME50 â€¢ Min. order â‚¹199',
    code: 'WELCOME50',
    tag: 'FIRST BITE SPECIAL',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    color: 'from-amber-600 to-orange-700',
  },
  {
    id: 'banner-2',
    title: 'Free Delivery Weekend',
    subtitle: 'Zero delivery fee on all top-rated restaurants',
    code: 'FREEDEL',
    tag: 'LIMITED TIME',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    color: 'from-rose-600 to-red-700',
  },
  {
    id: 'banner-3',
    title: 'Flat â‚¹150 OFF Gourmet Feast',
    subtitle: 'Indulge in authentic regional delicacies above â‚¹499',
    code: 'FEAST150',
    tag: 'GOURMET CURATION',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    color: 'from-emerald-700 to-teal-800',
  },
];

export const CRAVINGS = [
  {
    name: 'Dum Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80',
    cuisine: 'Biryani',
    count: '34+ Outlets',
  },
  {
    name: 'Artisan Pizza',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80',
    cuisine: 'Pizza',
    count: '28+ Outlets',
  },
  {
    name: 'Smash Burgers',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80',
    cuisine: 'Burgers',
    count: '22+ Outlets',
  },
  {
    name: 'Butter Chicken & Naan',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=400&auto=format&fit=crop&q=80',
    cuisine: 'North Indian',
    count: '45+ Outlets',
  },
  {
    name: 'Crispy Dosas',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400&auto=format&fit=crop&q=80',
    cuisine: 'South Indian',
    count: '19+ Outlets',
  },
  {
    name: 'Steamed Momos',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&auto=format&fit=crop&q=80',
    cuisine: 'Momos',
    count: '15+ Outlets',
  },
  {
    name: 'Kathi Rolls',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=400&auto=format&fit=crop&q=80',
    cuisine: 'Rolls',
    count: '26+ Outlets',
  },
  {
    name: 'Gulab Jamun & Sweets',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=400&auto=format&fit=crop&q=80',
    cuisine: 'Desserts',
    count: '18+ Outlets',
  },
];

export const COUPONS: Coupon[] = [];

export const RESTAURANTS: Restaurant[] = [];

export const SAMPLE_ADDRESSES: DeliveryAddress[] = [];

export const INITIAL_PAST_ORDERS: Order[] = [];

export const DEFAULT_RESTAURANT_PROFILE: import('./types').RestaurantProfile = {
  name: 'gumti cafe',
  tagline: 'Coffee, chai, comfort food and plates made for good conversations.',
  phone: '+91 75067 52280',
  whatsappPhone: '917506752280',
  email: 'hello@ghuticafe.com',
  address: 'gumti cafe',
  locality: 'gumti cafe',
  city: 'Kolkata',
  pincode: '700001',
  fssaiNumber: '11223344556677',
  openingHours: '8:00 AM - 11:00 PM (Mon - Sun)',
  isOpen: true,
  bannerImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80',
  bannerImageMobile: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=700&auto=format&fit=crop&q=80',
  logoImage: '/logo-gumti.png',
  upiId: 'ghuticafe@upi',
  upiPayeeName: 'gumti cafe',
  minOrderDelivery: 199,
  deliveryFee: 30,
  freeDeliveryThreshold: 499,
  estimatedDeliveryTime: '30-40 mins',
  estimatedPickupTime: '15-20 mins',
  serviceTaxPercentage: 5,
  enableDelivery: true,
  enablePickup: true,
  enableDineIn: true,
  socialInstagram: '@ghuticafe',
  googleMapsUrl: 'https://maps.google.com/?q=Ghuti+Cafe',
};

export const RESTAURANT_MENU_CATEGORIES = [
  'All Items',
  'Coffee',
  'Tea',
  'Burger',
  'Sandwich',
  'Pizzas',
  'Momo',
  'Noodles / Combos',
  'Small Bites',
  'Mutton Magic on Your Plate',
  'Soup',
  'Shake / Coolers',
];

// All menu items across catalog for fast retrieval & AI assistance
export const ALL_MENU_ITEMS: import('./types').MenuItem[] = RESTAURANTS.flatMap((r) => r.menu);

export const DEFAULT_CUSTOMERS: import('./types').CustomerRecord[] = [];

export const DEFAULT_ANNOUNCEMENT: import('./types').BannerAnnouncement = {
  enabled: true,
  text: 'ðŸŽ‰ Chef Special: Flat 20% OFF on all royal biryanis and tandoor grills! Use code ZAIKA20 on checkout.',
  badge: 'FESTIVAL SPECIAL',
  linkText: 'Order Now',
  couponCode: 'ZAIKA20',
};

export const DEFAULT_BANNERS: import('./types').BannerRecord[] = [
  {
    id: 'default-announcement',
    type: 'announcement',
    enabled: true,
    badge: 'FESTIVAL SPECIAL',
    title: 'ðŸŽ‰ Chef Special: Flat 20% OFF on all royal biryanis and tandoor grills! Use code ZAIKA20 on checkout.',
    couponCode: 'ZAIKA20',
    theme: 'orange',
    sortOrder: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'hero-banner-1',
    type: 'hero',
    enabled: true,
    badge: 'CHEF SPECIAL',
    title: 'Royal Dum Biryani Fiesta',
    subtitle: 'Slow-cooked fragrant basmati rice with royal saffron, rich spices & tender meat.',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=1200&auto=format&fit=crop',
    ctaText: 'Order Biryani Now',
    ctaLink: 'menu',
    theme: 'orange',
    sortOrder: 0,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'hero-banner-2',
    type: 'hero',
    enabled: true,
    badge: 'BUY 2 GET 1',
    title: 'Himalayan Steamed Momos',
    subtitle: 'Juicy, handcrafted chicken & vegetable momos served with spicy red chutney.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1200&auto=format&fit=crop',
    ctaText: 'Grab Momo Deal',
    ctaLink: 'menu',
    theme: 'rose',
    sortOrder: 1,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'hero-banner-3',
    type: 'hero',
    enabled: true,
    badge: 'SUMMER COOLERS',
    title: 'Artisan Shakes & Cold Brews',
    subtitle: 'Thick Belgian chocolate, Alphonso mango shakes & fresh espresso coolers.',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?q=80&w=1200&auto=format&fit=crop',
    ctaText: 'Explore Drinks',
    ctaLink: 'menu',
    theme: 'emerald',
    sortOrder: 2,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'hero-banner-4',
    type: 'hero',
    enabled: true,
    badge: 'CHEESY BITES',
    title: 'Gourmet Smashed Burgers',
    subtitle: 'Double crispy patties, melted cheddar cheese & house signature secret sauce.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop',
    ctaText: 'Order Burgers',
    ctaLink: 'menu',
    theme: 'violet',
    sortOrder: 3,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'hero-banner-5',
    type: 'hero',
    enabled: true,
    badge: 'WOOD-FIRED',
    title: 'Stone Oven Classic Pizzas',
    subtitle: 'Crispy thin crust topped with fresh mozzarella, basil & gourmet toppings.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop',
    ctaText: 'View Pizza Menu',
    ctaLink: 'menu',
    theme: 'orange',
    sortOrder: 4,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  },
];

/**
 * Migrates a legacy BannerAnnouncement into the new BannerRecord system.
 * Returns an announcement-type BannerRecord seeded from the old data.
 */
export const migrateLegacyAnnouncement = (
  legacy: import('./types').BannerAnnouncement,
): import('./types').BannerRecord => ({
  id: 'legacy-announcement',
  type: 'announcement',
  enabled: legacy.enabled,
  badge: legacy.badge,
  title: legacy.text,
  couponCode: legacy.couponCode,
  theme: 'orange',
  sortOrder: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
});

export const DEFAULT_TABLE_BOOKING_CONFIG: import('./types').TableBookingConfig = {
  enableBookings: true,
  requireEmail: false,
  showEmailField: true,
  showSeatingArea: true,
  showSpecialOccasion: true,
  showSpecialNotes: true,
  minGuests: 1,
  maxGuests: 10,
  timeSlots: [
    '08:30 AM',
    '09:30 AM',
    '10:30 AM',
    '11:30 AM',
    '12:30 PM',
    '01:30 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
    '06:30 PM',
    '07:30 PM',
    '08:30 PM',
    '09:30 PM',
    '10:00 PM',
  ],
  seatingOptions: [
    { id: 'indoor', label: 'Indoor AC Dining', icon: 'â„ï¸', desc: 'Cozy cafe ambience with curated soft music' },
    { id: 'outdoor', label: 'Outdoor Garden & Verandah', icon: 'ðŸŒ¿', desc: 'Open air breeze & evening mood lighting' },
    { id: 'rooftop', label: 'Adda Corner / Lounge', icon: 'âœ¨', desc: 'Spacious group tables & comfortable couches' },
    { id: 'any', label: 'First Available Table', icon: 'âš¡', desc: 'Fastest seating upon arrival' },
  ],
  occasions: [
    { id: 'none', label: 'Casual Dine-in', icon: 'ðŸ½ï¸' },
    { id: 'birthday', label: 'Birthday Celebration ðŸŽ‚', icon: 'ðŸŽ‰' },
    { id: 'anniversary', label: 'Anniversary ðŸ’–', icon: 'ðŸ¥‚' },
    { id: 'date', label: 'Coffee Date â˜•', icon: 'ðŸŒ¹' },
    { id: 'family', label: 'Family Get-Together ðŸ‘¨â€ðŸ‘©â€ðŸ‘§â€ðŸ‘¦', icon: 'ðŸ¥˜' },
    { id: 'business', label: 'Work & Adda ðŸ’¼', icon: 'ðŸ’»' },
  ],
  noticeHours: 1,
};

