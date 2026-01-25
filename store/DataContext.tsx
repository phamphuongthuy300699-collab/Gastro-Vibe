
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { 
    UserProfile, TableSession, Participant, Visit, Dish, Category, OrderItem, DietaryPreferences 
} from '../types';
import { 
    PARTICIPANTS, DEFAULT_MENU_ITEMS, CURRENT_USER_PROFILE, CURRENT_SESSION, MOCK_VISITS 
} from '../constants';

interface DataContextType {
  isLoading: boolean;
  userProfile: UserProfile;
  session: TableSession;
  participants: Participant[];
  myParticipantId: string;
  visits: Visit[];
  menuItems: Dish[];
  categories: Category[];
  favorites: Set<string>;
  orderItems: OrderItem[];
  
  // Actions
  addToOrder: (item: Partial<OrderItem>) => void;
  removeFromOrder: (dishId: string) => void;
  payBill: (amount: number, tip: number) => Promise<void>;
  updatePreferences: (prefs: Partial<DietaryPreferences>) => void;
  toggleFavorite: (dishId: string) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Data State
  const [userProfile, setUserProfile] = useState<UserProfile>(CURRENT_USER_PROFILE);
  
  // --- SESSION INITIALIZATION LOGIC (QR Code Support) ---
  const [session, setSession] = useState<TableSession>(() => {
      // Check URL params for ?table=ID
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table');

      if (tableParam) {
          // If launched via QR code, create a fresh session for this table
          return {
              id: `sess_${Date.now()}`, // Unique session ID
              tableId: tableParam,      // e.g. "12" or "table_5"
              status: 'active',
              createdAt: new Date().toISOString()
          };
      }
      
      // Fallback to mock session for dev/demo
      return CURRENT_SESSION;
  });
  
  // --- MOCK PARTICIPANTS FOR DEMO ---
  const [participants, setParticipants] = useState<Participant[]>([
      ...PARTICIPANTS, // You (p1)
      {
        id: 'p2',
        sessionId: session.id, // Ensure they belong to current session
        nickname: 'Алиса',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
        isLeader: false,
        status: 'active'
      },
      {
        id: 'p3',
        sessionId: session.id,
        nickname: 'Борис',
        avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
        isLeader: false,
        status: 'active'
      }
  ]);

  const [visits, setVisits] = useState<Visit[]>(MOCK_VISITS);
  const [menuItems, setMenuItems] = useState<Dish[]>(DEFAULT_MENU_ITEMS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  
  const myParticipantId = 'p1';

  // Cart State (Hydrated with friends' orders)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: 'o1',
      sessionId: session.id,
      participantId: 'p1',
      dishId: 'hot_turkey',
      quantity: 1,
      priceAtOrder: 620,
      status: 'served',
      selectedModifiers: [],
      excludedIngredients: [],
      dish: DEFAULT_MENU_ITEMS.find(d => d.id === 'hot_turkey')
    },
    {
      id: 'o2',
      sessionId: session.id,
      participantId: 'p2',
      dishId: 'sal_caesar_shrimp',
      quantity: 1,
      priceAtOrder: 590,
      status: 'cooking',
      selectedModifiers: [],
      excludedIngredients: ['Сухарики'],
      dish: DEFAULT_MENU_ITEMS.find(d => d.id === 'sal_caesar_shrimp')
    },
    {
      id: 'o3',
      sessionId: session.id,
      participantId: 'p3',
      dishId: 'piz_pep',
      quantity: 1,
      priceAtOrder: 620,
      status: 'served',
      selectedModifiers: [],
      excludedIngredients: [],
      dish: DEFAULT_MENU_ITEMS.find(d => d.id === 'piz_pep')
    },
     {
      id: 'o4',
      sessionId: session.id,
      participantId: 'p3',
      dishId: 'dr_cola',
      quantity: 2,
      priceAtOrder: 280,
      status: 'served',
      selectedModifiers: [],
      excludedIngredients: [],
      dish: DEFAULT_MENU_ITEMS.find(d => d.id === 'dr_cola')
    }
  ]);

  // Initial Fetch Logic
  useEffect(() => {
    const initData = async () => {
        setIsLoading(true);
        try {
            // Auth Check (Keep logic for admin access, but don't block menu)
            let { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // Silently attempt anon sign in, but don't fail hard if it doesn't work
                try {
                    await supabase.auth.signInAnonymously();
                } catch (e) {
                    console.warn("Auth skipped in dev mode");
                }
            }

            // --- FORCE LOCAL DATA FOR MENU (Fixing the ghost items issue) ---
            // Instead of fetching from DB (which might have stale data), we use the 
            // updated seedData.ts which correctly separates Extras from Breakfast.
            
            setCategories([
                { id: 'cat_breakfast', name: 'Завтраки', sortOrder: 1 },
                { id: 'cat_starters', name: 'Закуски', sortOrder: 2 },
                { id: 'cat_salads', name: 'Салаты', sortOrder: 3 },
                { id: 'cat_pizza', name: 'Пицца', sortOrder: 4 },
                { id: 'cat_soups', name: 'Супы', sortOrder: 5 },
                { id: 'cat_steaks', name: 'Стейки', sortOrder: 6 },
                { id: 'cat_hot', name: 'Горячее', sortOrder: 7 },
                { id: 'cat_sides', name: 'Гарниры', sortOrder: 8 },
                { id: 'cat_pasta', name: 'Паста', sortOrder: 9 },
                { id: 'cat_dessert', name: 'Десерты', sortOrder: 10 },
                { id: 'cat_bar_cocktails', name: 'Коктейли', sortOrder: 11 },
                { id: 'cat_bar_lemonades', name: 'Лимонады', sortOrder: 12 },
                { id: 'cat_bar_smoothies', name: 'Смузи', sortOrder: 13 },
                { id: 'cat_bar_milkshakes', name: 'Милкшейки', sortOrder: 14 },
                { id: 'cat_bar_coffee', name: 'Кофе', sortOrder: 15 },
                { id: 'cat_bar_soft', name: 'Напитки', sortOrder: 16 },
                { id: 'cat_bar_fresh', name: 'Фреши', sortOrder: 17 },
                { id: 'cat_bar_tea', name: 'Чай', sortOrder: 18 },
                { id: 'cat_bar_alcohol', name: 'Алкоголь', sortOrder: 19 }
            ]);

            // Use the updated DEFAULT_MENU_ITEMS which has the correct categoryId mapping
            setMenuItems(DEFAULT_MENU_ITEMS);

        } catch (error) {
            console.error("Data init error:", error);
        } finally {
            setIsLoading(false);
        }
    };
    initData();
  }, []);

  // Optimized Actions using useCallback
  const addToOrder = useCallback((partialItem: Partial<OrderItem>) => {
    // We use functional state update to ensure we have the latest menuItems if needed, 
    // but here we need menuItems from closure. Since menuItems changes rarely after load, this is safe.
    // Ideally, we'd add menuItems to dependency array, but it's large.
    const dish = menuItems.find(d => d.id === partialItem.dishId) || 
                 DEFAULT_MENU_ITEMS.find(d => d.id === partialItem.dishId);

    if (!dish) return;

    const newItem: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      sessionId: session.id,
      participantId: myParticipantId,
      dishId: partialItem.dishId!,
      quantity: partialItem.quantity || 1,
      priceAtOrder: partialItem.priceAtOrder || dish.price,
      status: 'pending',
      selectedModifiers: partialItem.selectedModifiers || [],
      excludedIngredients: partialItem.excludedIngredients || [],
      selectedVariantId: partialItem.selectedVariantId,
      dish: dish
    };
    
    setOrderItems(prev => [...prev, newItem]);
    
    // Simulate Cooking
    setTimeout(() => {
        setOrderItems(prev => prev.map(o => o.id === newItem.id ? { ...o, status: 'cooking' } : o));
    }, 2000);
  }, [menuItems, session.id, myParticipantId]);

  const removeFromOrder = useCallback((dishId: string) => {
      setOrderItems(prev => {
          const index = [...prev].reverse().findIndex(item => 
              item.dishId === dishId && 
              item.participantId === myParticipantId && 
              item.status !== 'paid'
          );
          if (index !== -1) {
              const realIndex = prev.length - 1 - index;
              const newItems = [...prev];
              newItems.splice(realIndex, 1);
              return newItems;
          }
          return prev;
      });
  }, [myParticipantId]);

  const payBill = useCallback(async (amount: number, tip: number) => {
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    await new Promise<void>((resolve) => setTimeout(resolve, 1000));
    setParticipants(prev => prev.map(p => 
        p.id === myParticipantId ? { ...p, status: 'paid' } : p
    ));
    // Confetti logic handled in UI Component listening to this state change or callback
  }, [myParticipantId]);

  const updatePreferences = useCallback((prefs: Partial<DietaryPreferences>) => {
    setUserProfile(prev => ({
        ...prev,
        preferences: { ...prev.preferences, ...prefs }
    }));
  }, []);

  const toggleFavorite = useCallback(async (dishId: string) => {
      setFavorites(prev => {
          const next = new Set(prev);
          if (next.has(dishId)) next.delete(dishId);
          else next.add(dishId);
          return next;
      });
  }, []);

  return (
    <DataContext.Provider value={{
      isLoading, userProfile, session, participants, myParticipantId, visits,
      menuItems, categories, favorites, orderItems,
      addToOrder, removeFromOrder, payBill, updatePreferences, toggleFavorite
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataStore = () => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useDataStore must be used within a DataProvider');
  return context;
};
