
export type Tab = 'table' | 'menu' | 'bill' | 'games' | 'profile' | 'events' | 'admin' | 'settings' | 'auth' | 'debug';
export type AppTheme = 'light' | 'dark' | 'system';
export type SplitType = 'personal' | 'equal' | 'manual';
export type AdminRole = 'admin' | 'kitchen' | 'waiter';
export type ZoneId = 'hall' | 'terrace';
export type TableStatus = 'free' | 'busy' | 'reserved' | 'alert';
export type LifecycleState = 'seated' | 'ordered' | 'waiting_food' | 'eating' | 'paying' | 'cleaning';

export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

export interface DishModifier {
    id: string;
    name: string;
    priceDelta: number;
    group?: string;
    isSingleSelect?: boolean;
}

export interface DishVariant {
    id: string;
    name: string;
    price: number;
    volume: string;
}

export interface Dish {
    id: string;
    slug?: string;
    name: string;
    description?: string;
    price: number;
    oldPrice?: number;
    imageUrl: string;
    videoUrl?: string;
    type?: 'food' | 'drink';
    categoryId?: string;
    modifiers?: DishModifier[];
    ingredients?: string[];
    variants?: DishVariant[];
    badges?: string[];
    relatedItemIds?: string[];
    xpReward?: number;
    abv?: number;
    calories?: number;
    nutrition?: {
        protein: number;
        fats: number;
        carbs: number;
    };
}

export interface Participant {
    id: string;
    sessionId: string;
    userId?: string;
    nickname: string;
    avatarUrl: string;
    isLeader: boolean;
    status: 'active' | 'paid' | 'left';
}

export interface TableSession {
    id: string;
    tableId: string;
    status: 'active' | 'closed';
    createdAt: string;
}

export interface Visit {
    id: string;
    restaurantName: string;
    date: string;
    totalAmount: number;
}

export interface StorySlide {
    id: string;
    imageUrl: string;
    title: string;
    subtitle: string;
    dishId?: string;
}

export interface Story {
    id: string;
    title: string;
    colorRing: string;
    previewImage: string;
    slides: StorySlide[];
}

export interface CollectionCourse {
    courseName: string;
    defaultDishId: string;
    options: string[];
}

export interface CollectionSet {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    courses: CollectionCourse[];
}

export interface Game {
    id: string;
    title: string;
    description: string;
    image: string;
    type: 'luck' | 'skill' | 'quiz';
    label: string;
    color: string;
}

export interface DietaryPreferences {
    spicyTolerance: boolean | number;
    isVegan: boolean;
    isFasting: boolean;
    avoidGluten: boolean;
    avoidLactose: boolean;
    avoidNuts: boolean;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
    totalXp: number;
    level: number;
    livesCount: number;
    balanceGP: number;
    preferences: DietaryPreferences;
}

export interface OrderItem {
    id: string;
    sessionId: string;
    participantId: string;
    dishId: string;
    quantity: number;
    priceAtOrder: number;
    status: 'pending' | 'cooking' | 'served' | 'paid';
    selectedModifiers: string[];
    excludedIngredients: string[];
    selectedVariantId?: string;
    dish?: Dish;
}

export interface AdminTable {
    id: string;
    label: string;
    zoneId: ZoneId;
    x: number;
    y: number;
    shape: 'rect' | 'round';
    width: number;
    height: number;
    chairs?: ('top' | 'bottom' | 'left' | 'right')[];
    status: TableStatus;
    lifecycle?: LifecycleState;
    guests?: number;
    timeSeated?: string;
    durationMin?: number;
    currentBill?: number;
    waiterName?: string;
    guestName?: string;
    notes?: string;
    orderSummary?: string[];
    nextReservation?: string;
    alertMessage?: string;
}

export interface KitchenTicketItem {
    name: string;
    qty: number;
    mods: string[];
    station: 'kitchen' | 'bar';
    course: 'starter' | 'main' | 'dessert' | 'drink';
}

export interface KitchenTicket {
    id: string;
    tableLabel: string;
    serverName: string;
    timeCreated: string;
    elapsedMin: number;
    status: 'new' | 'cooking' | 'ready';
    items: KitchenTicketItem[];
}

export interface Wall {
    x: number;
    y: number;
    w: number;
    h: number;
    type: 'wall' | 'window' | 'entrance' | 'wc' | 'bar';
}

export interface WaiterNotification {
    id: string;
    type: 'kitchen_ready' | 'bar_ready';
    tableLabel: string;
    message: string;
    time: string;
}

export interface Category {
    id: string;
    name: string;
    sortOrder: number;
}

export interface RestaurantEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    imageUrl: string;
    type: 'music' | 'kids' | 'tasting' | 'masterclass';
    price?: number;
}
