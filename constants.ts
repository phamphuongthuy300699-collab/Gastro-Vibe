
import { Dish, Participant, TableSession, Visit, Story, CollectionSet, Game, UserProfile, AdminTable, KitchenTicket, Wall, WaiterNotification, Category, RestaurantEvent } from './types';
import { SEED_DATA } from './data/seedData';

// Mock Profiles (Fallback)
export const CURRENT_USER_PROFILE: UserProfile = {
    id: 'user_auth_1',
    email: 'guest@gastrovibe.com',
    name: 'Гость',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACpULh3gMIju5W9zOFzeIVoAMLmZ51HN-LWCRHftfWApS_o4z0ciRJmuaEZQtQlH2Y9UAzd0nQT1RLka9pju2-RBkxWEF3XyShT-vwtkgnJT6-62qFVWoiJRW_lbP7TtmbUGiuDbTeYynlDGW_WqSdz8s-N90qx8O1aF4OBuspmvCx1v6baojKATaxMoc4jx6whHQ2y9bnf9eL-xfuXJZqVqNuYOAy6hu8Q3ekXaBvGv-LYN-NqveczkRsOmwwF07cDq5R4uH5',
    totalXp: 750,
    level: 5,
    livesCount: 2,
    balanceGP: 1250,
    preferences: {
        spicyTolerance: 1,
        isVegan: false,
        isFasting: false,
        avoidGluten: false,
        avoidLactose: true,
        avoidNuts: false
    }
};

export const MOCK_VISITS: Visit[] = [];
export const CURRENT_SESSION: TableSession = {
    id: 'sess_123',
    tableId: 'table_12',
    status: 'active',
    createdAt: new Date().toISOString()
};
export const PARTICIPANTS: Participant[] = [
  {
    id: 'p1', 
    sessionId: 'sess_123',
    userId: 'user_auth_1',
    nickname: 'Вы',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACpULh3gMIju5W9zOFzeIVoAMLmZ51HN-LWCRHftfWApS_o4z0ciRJmuaEZQtQlH2Y9UAzd0nQT1RLka9pju2-RBkxWEF3XyShT-vwtkgnJT6-62qFVWoiJRW_lbP7TtmbUGiuDbTeYynlDGW_WqSdz8s-N90qx8O1aF4OBuspmvCx1v6baojKATaxMoc4jx6whHQ2y9bnf9eL-xfuXJZqVqNuYOAy6hu8Q3ekXaBvGv-LYN-NqveczkRsOmwwF07cDq5R4uH5',
    isLeader: true,
    status: 'active'
  }
];

// --- MENU ITEMS ---
// Flatten the SEED_DATA to create a searchable list of items for the mock
// Updated to provide defaults for all array fields
export const DEFAULT_MENU_ITEMS: Dish[] = SEED_DATA.flatMap(category => 
    category.items.map(item => ({
        modifiers: [],
        ingredients: [],
        variants: [],
        badges: [],
        relatedItemIds: [],
        ...item,
        categoryId: category.id // Ensure category link
    } as Dish))
);

export const STORIES: Story[] = [
    {
        id: 'st_new',
        title: 'Новое\nМеню',
        colorRing: 'border-gold',
        previewImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=200',
        slides: [
            { id: 'sl1', imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800', title: 'Завтраки весь день', subtitle: 'Попробуйте наши новые бриоши' }
        ]
    },
    {
        id: 'st_chef',
        title: 'Выбор\nШефа',
        colorRing: 'border-primary',
        previewImage: 'https://images.unsplash.com/photo-1577106263724-2c8e03bfe9cf?auto=format&fit=crop&q=80&w=200',
        slides: [
             { id: 'sl2', imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800', title: 'Стейк Рибай', subtitle: 'Идеальная прожарка', dishId: 'stk_ribeye' }
        ]
    },
    {
         id: 'st_wine',
         title: 'Винная\nКарта',
         colorRing: 'border-primary/50',
         previewImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=200',
         slides: [
              { id: 'sl3', imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=800', title: 'Новые поступления', subtitle: 'Попробуйте наше Prosecco' }
         ]
    }
];

export const EVENTS: RestaurantEvent[] = [
    {
        id: 'ev_jazz',
        title: 'Вечер Джаза',
        description: 'Живая музыка от трио "Blue Moon". Саксофон, контрабас и вокал. Атмосфера Нью-Йорка 30-х годов.',
        date: '2023-10-27',
        time: '20:00',
        imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800',
        type: 'music'
    },
    {
        id: 'ev_kids',
        title: 'Детский Утренник',
        description: 'Аниматоры, аквагрим и мастер-класс по приготовлению пиццы для самых маленьких гостей.',
        date: '2023-10-29',
        time: '12:00',
        imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=800',
        type: 'kids',
        price: 500
    },
    {
        id: 'ev_wine',
        title: 'Винная Дегустация',
        description: 'Пробуем новинки из региона Тоскана. Сомелье расскажет о тонкостях сочетания вина и сыров.',
        date: '2023-11-02',
        time: '19:30',
        imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
        type: 'tasting',
        price: 2500
    },
    {
        id: 'ev_chef',
        title: 'Гастро-ужин с Шефом',
        description: 'Авторский сет из 5 курсов. Презентация нового осеннего меню от шеф-повара.',
        date: '2023-11-10',
        time: '19:00',
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800',
        type: 'masterclass',
        price: 4000
    }
];

export const COLLECTIONS: CollectionSet[] = [
    {
        id: 'col_business',
        title: 'Бизнес-ланч',
        description: 'Быстрый и сытный обед по будням с 12 до 16',
        imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=600',
        price: 990,
        courses: [
            { courseName: 'Суп', defaultDishId: 'soup_chicken', options: ['soup_borsch', 'soup_mushroom'] },
            { courseName: 'Горячее', defaultDishId: 'hot_cutlets', options: ['hot_turkey', 'pst_carb'] },
            { courseName: 'Напиток', defaultDishId: 'dr_mors', options: ['tea_classic', 'cof_esp'] }
        ]
    },
    {
        id: 'col_family',
        title: 'Семейный ужин',
        description: 'Для всей семьи: пицца, десерты и напитки',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=600',
        price: 2100,
        courses: [
            { courseName: 'Пицца (Основа)', defaultDishId: 'piz_pep', options: ['piz_4cheese', 'piz_margo'] },
            { courseName: 'Детское / Десерт', defaultDishId: 'des_milkshake', options: ['des_classic', 'sd_fries'] },
            { courseName: 'Напиток (Графин)', defaultDishId: 'lem_berry', options: ['lem_mango', 'tea_sea'] }
        ]
    },
    {
        id: 'col_rom',
        title: 'Романтический ужин',
        description: 'Идеальный вечер для двоих с вином и изысканными блюдами',
        imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600',
        price: 2500,
        courses: [
            { courseName: 'Закуска', defaultDishId: 'st_wineplate', options: ['brusc_tomato', 'brusc_shrimp'] },
            { courseName: 'Горячее (x2)', defaultDishId: 'hot_salmon', options: ['hot_seabass', 'stk_machete'] },
            { courseName: 'Десерт', defaultDishId: 'des_pavlova', options: ['des_basque', 'des_tira'] }
        ]
    },
    {
        id: 'col_friends',
        title: 'Для друзей',
        description: 'Большой сет закусок и пиццы для веселой компании',
        imageUrl: 'https://images.unsplash.com/photo-1561758033-d8f3c6654d7d?auto=format&fit=crop&q=80&w=600',
        price: 3200,
        courses: [
             { courseName: 'Стартер', defaultDishId: 'st_cheese_sticks', options: ['st_croutons', 'st_bread'] },
             { courseName: 'Пицца', defaultDishId: 'piz_pep', options: ['piz_4cheese', 'piz_margo_strat'] },
             { courseName: 'Напитки (4 шт)', defaultDishId: 'beer_spaten', options: ['beer_margo', 'dr_cola'] }
        ]
    }
];

// Updated Mocks for Games & Club
export const SECRET_MENU_ITEMS = [
    { id: 'sec_1', name: 'Трюфельный Бургер', price: 990, unlockLevel: 5, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400' },
    { id: 'sec_2', name: 'Золотой Стейк', price: 5000, unlockLevel: 10, imageUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&q=80&w=400' },
    { id: 'sec_3', name: 'Коктейль "Авиация"', price: 650, unlockLevel: 3, imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400' },
];

export const REDEEM_ITEMS = [
    { id: 'r_coffee', name: 'Капучино', priceGP: 150, imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=300' },
    { id: 'r_dessert', name: 'Чизкейк', priceGP: 300, imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=300' },
    { id: 'r_cocktail', name: 'Коктейль дня', priceGP: 500, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=300' },
];

export const QUIZ_QUESTIONS = [
    { 
        id: 1, 
        question: 'Какой сыр традиционно используют в Тирамису?', 
        options: ['Рикотта', 'Маскарпоне', 'Филадельфия', 'Моцарелла'], 
        answer: 1 
    },
    { 
        id: 2, 
        question: 'Что означает слово "Al dente"?', 
        options: ['На зубок', 'Очень мягко', 'Сырое', 'С соусом'], 
        answer: 0 
    },
    { 
        id: 3, 
        question: 'Из чего делают настоящее Карпаччо?', 
        options: ['Вареная курица', 'Сырая говядина', 'Жареная рыба', 'Тушеные овощи'], 
        answer: 1 
    },
    {
        id: 4,
        question: 'Родина пиццы Маргарита?',
        options: ['Рим', 'Милан', 'Неаполь', 'Флоренция'],
        answer: 2
    }
];

export const GAMES: Game[] = [
    { id: 'g_roulette', title: 'Рулетка счета', description: 'Выиграй скидку на весь чек', image: '', type: 'luck', label: 'Win', color: '#A65321' },
    { id: 'g_match3', title: 'Вкусный ряд', description: 'Собирай еду 3-в-ряд и получай XP', image: '', type: 'luck', label: 'Play', color: '#6B8E23' }
];

// --- ADMIN 2.1 MOCK DATA ---

// Architectural Elements
export const MOCK_WALLS_HALL: Wall[] = [
    { x: 0, y: 0, w: 2, h: 100, type: 'wall' }, // Left Wall
    { x: 0, y: 0, w: 100, h: 2, type: 'wall' }, // Top Wall
    { x: 98, y: 0, w: 2, h: 100, type: 'wall' }, // Right Wall
    { x: 45, y: 98, w: 10, h: 2, type: 'entrance' }, // Bottom Entrance
    { x: 20, y: 0, w: 15, h: 2, type: 'window' }, // Top Window 1
    { x: 65, y: 0, w: 15, h: 2, type: 'window' }, // Top Window 2
    { x: 85, y: 85, w: 10, h: 10, type: 'wc' }, // WC
    { x: 10, y: 85, w: 15, h: 10, type: 'bar' }, // Bar
];

export const MOCK_WALLS_TERRACE: Wall[] = [
    { x: 0, y: 0, w: 2, h: 80, type: 'wall' }, // Left Wall (Fence)
    { x: 0, y: 0, w: 100, h: 2, type: 'wall' }, // House Wall
    { x: 98, y: 0, w: 2, h: 80, type: 'wall' }, // Right Wall (Fence)
    { x: 0, y: 80, w: 100, h: 2, type: 'window' }, // Railing
];

export const MOCK_FLOOR_PLAN: AdminTable[] = [
    // --- MAIN HALL ---
    { 
        id: 't1', label: '1', zoneId: 'hall', x: 15, y: 20, shape: 'rect', width: 60, height: 40, chairs: ['left', 'right'],
        status: 'busy', lifecycle: 'eating', guests: 2, timeSeated: '19:00', durationMin: 45, currentBill: 3400,
        waiterName: 'Алексей', guestName: 'Иванов (VIP)', notes: 'День рождения', orderSummary: ['Стейк x2', 'Вино x2']
    },
    { 
        id: 't2', label: '2', zoneId: 'hall', x: 15, y: 50, shape: 'rect', width: 60, height: 40, chairs: ['left', 'right'],
        status: 'free', nextReservation: '21:00'
    },
    { 
        id: 't3', label: '3', zoneId: 'hall', x: 15, y: 80, shape: 'rect', width: 60, height: 40, chairs: ['left', 'right'],
        status: 'free' 
    },
    
    { 
        id: 't4', label: '4', zoneId: 'hall', x: 40, y: 35, shape: 'round', width: 50, height: 50, chairs: ['top', 'right', 'bottom'],
        status: 'busy', lifecycle: 'waiting_food', guests: 3, timeSeated: '18:15', durationMin: 90, currentBill: 8200, 
        waiterName: 'Мария', notes: 'Без лука', orderSummary: ['Паста x3', 'Кола']
    },
    { 
        id: 't5', label: '5', zoneId: 'hall', x: 60, y: 35, shape: 'round', width: 50, height: 50, chairs: ['top', 'bottom'],
        status: 'alert', lifecycle: 'paying', alertMessage: 'Счет', guests: 2, currentBill: 2100, 
        waiterName: 'Алексей', orderSummary: ['Кофе', 'Десерт']
    },
    
    { 
        id: 't6', label: '6', zoneId: 'hall', x: 85, y: 20, shape: 'rect', width: 40, height: 60, chairs: ['top', 'bottom'],
        status: 'reserved', nextReservation: '20:00' 
    },
    { 
        id: 't7', label: '7', zoneId: 'hall', x: 85, y: 50, shape: 'rect', width: 40, height: 60, chairs: ['top', 'bottom'],
        status: 'free' 
    },
    { 
        id: 't8', label: 'VIP', zoneId: 'hall', x: 50, y: 80, shape: 'round', width: 70, height: 70, chairs: ['top', 'right', 'bottom', 'left', 'top', 'bottom'],
        status: 'busy', lifecycle: 'ordered', guests: 6, timeSeated: '19:15', durationMin: 30, currentBill: 15400,
        waiterName: 'Иван', guestName: 'Газпром', orderSummary: ['Виски Бутылка', 'Сырная тарелка']
    },

    // --- TERRACE ---
    { id: 'tr1', label: 'T1', zoneId: 'terrace', x: 20, y: 30, shape: 'round', width: 45, height: 45, status: 'busy', lifecycle: 'eating', guests: 2, timeSeated: '19:25', durationMin: 20, currentBill: 1200, chairs: ['left', 'right'], waiterName: 'Мария' },
    { id: 'tr2', label: 'T2', zoneId: 'terrace', x: 50, y: 30, shape: 'round', width: 45, height: 45, status: 'free', chairs: ['left', 'right'] },
    { id: 'tr3', label: 'T3', zoneId: 'terrace', x: 80, y: 30, shape: 'round', width: 45, height: 45, status: 'free', chairs: ['left', 'right'] },
    { id: 'tr4', label: 'T4', zoneId: 'terrace', x: 35, y: 60, shape: 'rect', width: 50, height: 40, status: 'busy', lifecycle: 'seated', guests: 4, timeSeated: '18:50', durationMin: 55, currentBill: 4500, chairs: ['top', 'bottom'], waiterName: 'Иван' },
    { id: 'tr5', label: 'T5', zoneId: 'terrace', x: 65, y: 60, shape: 'rect', width: 50, height: 40, status: 'free', chairs: ['top', 'bottom'] }
];

export const MOCK_KITCHEN_TICKETS: KitchenTicket[] = [
    {
        id: 'k1', tableLabel: '4', serverName: 'Алексей', timeCreated: '19:20', elapsedMin: 22, status: 'cooking',
        items: [
            { name: 'Стейк Рибай', qty: 1, mods: ['Медиум'], station: 'kitchen', course: 'main' },
            { name: 'Овощи гриль', qty: 1, mods: [], station: 'kitchen', course: 'main' },
        ]
    },
    {
        id: 'k2', tableLabel: '5', serverName: 'Мария', timeCreated: '19:35', elapsedMin: 7, status: 'new',
        items: [
            { name: 'Карбонара', qty: 2, mods: [], station: 'kitchen', course: 'main' },
            { name: 'Тирамису', qty: 1, mods: [], station: 'kitchen', course: 'dessert' },
        ]
    },
    {
        id: 'k3', tableLabel: 'VIP', serverName: 'Алексей', timeCreated: '19:38', elapsedMin: 4, status: 'new',
        items: [
            { name: 'Ассорти сыров', qty: 1, mods: [], station: 'kitchen', course: 'starter' },
            { name: 'Prosecco (Бут)', qty: 2, mods: [], station: 'bar', course: 'drink' },
            { name: 'Aperol Spritz', qty: 4, mods: [], station: 'bar', course: 'drink' },
        ]
    },
    {
        id: 'k4', tableLabel: 'T1', serverName: 'Иван', timeCreated: '19:28', elapsedMin: 14, status: 'cooking',
        items: [
            { name: 'Бургер', qty: 2, mods: ['Без лука'], station: 'kitchen', course: 'main' },
        ]
    }
];

export const MOCK_WAITER_NOTIFICATIONS: WaiterNotification[] = [
    { id: 'n1', type: 'kitchen_ready', tableLabel: '4', message: 'Стейк Рибай - Готово', time: 'Сейчас' },
    { id: 'n2', type: 'bar_ready', tableLabel: 'VIP', message: 'Коктейли (6) - Бар', time: '2 мин' },
];

export const WAITER_PENDING_ORDERS = [
    { id: 'po1', tableLabel: 'T4', items: ['Фокачча', 'Лимонад Манго'], status: 'pending_approval' },
    { id: 'po2', tableLabel: '2', items: ['Кофе Капучино', 'Вода'], status: 'pending_approval' }
];
