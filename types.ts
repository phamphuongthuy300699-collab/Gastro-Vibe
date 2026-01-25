
// 1. Core: Restaurant & Tables
export interface Restaurant {
    id: string;
    name: string;
    currency: string;
    defaultTipPercentage: number;
}
  
export interface Table {
    id: string;
    restaurantId: string;
    number: number;
    zone: string; // 'Chill-out', 'VIP', 'Terrace'
    floor: string;
    qrHash: string;
}

// 2. Sessions & Participants (Shared Context)
export interface TableSession {
    id: string;
    tableId: string;
    status: 'active' | 'closed';
    createdAt: string;
}

export interface Participant {
    id: string; // UUID
    sessionId: string;
    userId?: string; // Nullable for anonymous guests
    nickname: string;
    avatarUrl: string;
    isLeader: boolean; // Who opened the table
    // UI Helper state (not strictly in DB, but needed for UI)
    status: 'active' | 'paid' | 'left';
}

// 6. Gamification & Profile (Loyalty)
export interface DietaryPreferences {
    spicyTolerance: number; // 0 to 3
    isVegan: boolean;
    isFasting: boolean; // Постное
    avoidGluten: boolean;
    avoidLactose: boolean;
    avoidNuts: boolean;
}

export interface Visit {
    id: string;
    restaurantName: string;
    date: string;
    totalAmount: number;
    xpEarned: number;
    previewImages: string[]; // URLs of dish images
}

// Maps to 'profiles' table linked to auth.users
export interface UserProfile {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
    totalXp: number;
    level: number;
    livesCount: number;
    balanceGP: number; // Virtual currency
    preferences: DietaryPreferences;
}

// 3. Digital Menu (Content)
export interface Category {
    id: string;
    name: string;
    sortOrder: number;
}

// Legacy / Frontend View Type (Used in current ProductSheet)
export interface DishModifier {
    id: string;
    dishId?: string;
    name: string;
    priceDelta: number;
    group?: string; // e.g. "milk", "syrup"
    isSingleSelect?: boolean;
}

// --- NEW RELATIONAL DB TYPES ---
export interface DbModifierGroup {
    id: string;
    restaurant_id?: string;
    name: string;
    min_selection: number;
    max_selection: number;
    required: boolean;
}

export interface DbModifier {
    id: string;
    group_id: string;
    name: string;
    price: number;
    is_available: boolean;
    sort_order: number;
}
// ------------------------------

export interface DishVariant {
    id: string;
    name: string; // "0.3", "0.5", "Std", "Lrg"
    price: number; // Full override price
    volume: string; // "300 ml"
}

export interface Nutrition {
    calories: number;
    protein: number;
    fats: number;
    carbs: number;
}

export interface Dish {
    id: string;
    slug?: string; // Human readable ID for cross-linking (e.g. 'steak_ribeye')
    categoryId: string;
    type: 'food' | 'drink'; // New field
    name: string;
    description: string;
    price: number; // Base price
    oldPrice?: number;
    videoUrl?: string; // Shorts
    imageUrl: string; // Grid preview
    xpReward: number;
    calories?: number; // Legacy simple field
    nutrition?: Nutrition; // Detailed macros
    badges: string[]; // 'Spicy', 'New'
    ingredients?: string[]; // List of base ingredients (e.g. "Bun", "Tomato")
    modifiers: DishModifier[]; // Keep for UI compatibility for now
    variants?: DishVariant[]; // New field for sizes
    abv?: number; // Alcohol by volume
    relatedItemIds?: string[]; // IDs for Cross-selling (matches slug or id)
}

// Stories & Collections
export interface StorySlide {
    id: string;
    imageUrl: string;
    title: string;
    subtitle?: string;
    dishId?: string; // Link to a dish
}

export interface Story {
    id: string;
    title: string;
    previewImage: string;
    colorRing: string;
    slides: StorySlide[];
}

export interface CollectionCourse {
    courseName: string; // e.g. "Salad", "Hot"
    defaultDishId: string;
    options: string[]; // List of Dish IDs available for swap
}

export interface CollectionSet {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    courses: CollectionCourse[];
}

// Events
export interface RestaurantEvent {
    id: string;
    title: string;
    description: string;
    date: string; // ISO date string or "2023-12-31"
    time: string; // "19:00"
    imageUrl: string;
    type: 'music' | 'kids' | 'tasting' | 'party' | 'masterclass';
    price?: number; // Optional entry price
}

// 4. Orders & Cart (Real-time Order)
export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'served' | 'paid';

export interface OrderItem {
    id: string;
    sessionId: string;
    participantId: string; // Who ordered this
    dishId: string;
    quantity: number;
    priceAtOrder: number;
    status: OrderStatus;
    selectedModifiers: string[]; // IDs of modifiers (Added extras)
    selectedVariantId?: string; // ID of the size variant
    excludedIngredients?: string[]; // Names of removed base ingredients
    // Hydrated fields for UI convenience (joined in query)
    dish?: Dish; 
}

// 5. Finance
export type SplitType = 'personal' | 'equal' | 'manual';

// App Navigation
export type Tab = 'table' | 'menu' | 'games' | 'bill' | 'profile' | 'admin' | 'settings' | 'debug' | 'auth' | 'events';

export type AppTheme = 'light' | 'dark' | 'system';

export interface Game {
  id: string;
  title: string;
  description: string;
  image: string;
  type: 'quiz' | 'pvp' | 'luck';
  label: string;
  color: string;
}

// --- ADMIN 2.1 TYPES ---
export type TableStatus = 'free' | 'busy' | 'alert' | 'reserved';
export type AdminRole = 'admin' | 'kitchen' | 'waiter';
export type ZoneId = 'hall' | 'terrace';
export type LifecycleState = 'seated' | 'ordered' | 'waiting_food' | 'eating' | 'paying' | 'cleaning';
export type CourseType = 'starter' | 'main' | 'dessert' | 'drink';

export interface Wall {
    x: number;
    y: number;
    w: number;
    h: number;
    type: 'wall' | 'window' | 'entrance' | 'bar' | 'wc';
}

export interface AdminTable {
    id: string;
    label: string; // "12"
    zoneId: ZoneId;
    x: number; // % from left
    y: number; // % from top
    shape: 'round' | 'rect';
    width: number; // pixel width
    height: number;
    rotation?: number; // degrees
    chairs?: ('top' | 'bottom' | 'left' | 'right')[]; // Visual placement
    
    // State
    status: TableStatus;
    lifecycle?: LifecycleState; // New: More granular state
    guests?: number;
    timeSeated?: string; // "18:30"
    durationMin?: number; // 45 (minutes seated)
    currentBill?: number;
    alertMessage?: string; // "Счет", "Официант"
    
    // Rich Info (New for 2.1)
    waiterId?: string;
    waiterName?: string;
    nextReservation?: string; // "21:00"
    guestName?: string; // "Ivanov (VIP)"
    notes?: string; // "Birthday", "Allergy"
    orderSummary?: string[]; // ["Steak x2", "Wine"]
}

export interface KitchenTicketItem {
    name: string;
    qty: number;
    mods: string[];
    station: 'kitchen' | 'bar';
    course: CourseType; // New: Grouping
}

export interface KitchenTicket {
    id: string;
    tableLabel: string;
    serverName: string;
    timeCreated: string; // "19:12"
    elapsedMin: number; // 12 (min)
    items: KitchenTicketItem[];
    status: 'new' | 'cooking' | 'ready';
}

// Waiter specific types
export interface WaiterNotification {
    id: string;
    type: 'kitchen_ready' | 'bar_ready' | 'guest_call';
    tableLabel: string;
    message: string;
    time: string;
}
