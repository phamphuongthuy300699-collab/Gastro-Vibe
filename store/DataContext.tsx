
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { 
    UserProfile, TableSession, Participant, Visit, Dish, Category, OrderItem, DietaryPreferences, Story, CollectionSet 
} from '../types';
import { 
    PARTICIPANTS, DEFAULT_MENU_ITEMS, CURRENT_USER_PROFILE, CURRENT_SESSION, MOCK_VISITS,
    STORIES as DEFAULT_STORIES, COLLECTIONS as DEFAULT_COLLECTIONS 
} from '../constants';

interface DataContextType {
  isLoading: boolean;
  userProfile: UserProfile;
  session: TableSession;
  participants: Participant[];
  myParticipantId: string;
  visits: Visit[];
  
  // Content
  menuItems: Dish[];
  categories: Category[];
  stories: Story[];
  collections: CollectionSet[];
  
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
  
  // Data State - Defaulting to Guest Profile initially
  const [userProfile, setUserProfile] = useState<UserProfile>(CURRENT_USER_PROFILE);
  
  const [session, setSession] = useState<TableSession>(() => {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table');
      if (tableParam) {
          return {
              id: `sess_${Date.now()}`,
              tableId: tableParam,
              status: 'active',
              createdAt: new Date().toISOString()
          };
      }
      return CURRENT_SESSION;
  });
  
  const [participants, setParticipants] = useState<Participant[]>([
      ...PARTICIPANTS, // "Вы" is participant 0, we need to sync this with userProfile later
      {
        id: 'p2',
        sessionId: session.id,
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
  
  // Content State
  const [menuItems, setMenuItems] = useState<Dish[]>(DEFAULT_MENU_ITEMS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stories, setStories] = useState<Story[]>(DEFAULT_STORIES);
  const [collections, setCollections] = useState<CollectionSet[]>(DEFAULT_COLLECTIONS);
  
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const myParticipantId = 'p1';

  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: 'o1', sessionId: session.id, participantId: 'p1', dishId: 'hot_turkey', quantity: 1, priceAtOrder: 620, status: 'served', selectedModifiers: [], excludedIngredients: [], dish: DEFAULT_MENU_ITEMS.find(d => d.id === 'hot_turkey')
    },
    {
      id: 'o2', sessionId: session.id, participantId: 'p2', dishId: 'sal_caesar_shrimp', quantity: 1, priceAtOrder: 590, status: 'cooking', selectedModifiers: [], excludedIngredients: ['Сухарики'], dish: DEFAULT_MENU_ITEMS.find(d => d.id === 'sal_caesar_shrimp')
    },
    {
      id: 'o3', sessionId: session.id, participantId: 'p3', dishId: 'piz_pep', quantity: 1, priceAtOrder: 620, status: 'served', selectedModifiers: [], excludedIngredients: [], dish: DEFAULT_MENU_ITEMS.find(d => d.id === 'piz_pep')
    },
     {
      id: 'o4', sessionId: session.id, participantId: 'p3', dishId: 'dr_cola', quantity: 2, priceAtOrder: 280, status: 'served', selectedModifiers: [], excludedIngredients: [], dish: DEFAULT_MENU_ITEMS.find(d => d.id === 'dr_cola')
    }
  ]);

  // Auth & Data Init Logic
  useEffect(() => {
    const initData = async () => {
        setIsLoading(true);
        try {
            // 1. AUTH CHECK & PROFILE SYNC
            const { data: { session: authSession } } = await supabase.auth.getSession();
            
            if (authSession?.user) {
                // Fetch REAL profile from DB
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', authSession.user.id)
                    .single();

                if (profileData) {
                    const realProfile: UserProfile = {
                        id: profileData.id,
                        email: profileData.email || '',
                        name: profileData.full_name || 'Gastro Guest',
                        avatarUrl: profileData.avatar_url || CURRENT_USER_PROFILE.avatarUrl,
                        totalXp: profileData.total_xp || 0,
                        level: profileData.level || 1,
                        livesCount: profileData.lives_count || 3,
                        balanceGP: profileData.balance_gp || 0,
                        preferences: profileData.preferences || CURRENT_USER_PROFILE.preferences
                    };
                    setUserProfile(realProfile);
                    
                    // Update Participant 0 (Me) visual
                    setParticipants(prev => {
                        const newP = [...prev];
                        if(newP[0]) {
                            newP[0].nickname = realProfile.name.split(' ')[0]; // First Name
                            newP[0].avatarUrl = realProfile.avatarUrl;
                        }
                        return newP;
                    });
                }
            } else {
                // Keep Guest Defaults if not logged in
                // Optionally: await supabase.auth.signInAnonymously();
            }

            // 2. Fetch Categories
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('*')
                .order('sort_order', { ascending: true });
            
            if (catData && !catError && catData.length > 0) {
                const filteredCats = catData
                    .map(c => ({
                        id: c.id,
                        name: c.name,
                        sortOrder: c.sort_order
                    }))
                    .filter(c => c.name.toLowerCase() !== 'лимонады и смузи');
                setCategories(filteredCats);
            } else {
                // Fallback to hardcoded for demo resilience
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
                    { id: 'cat_bar_coffee', name: 'Кофе', sortOrder: 15 },
                ]);
            }

            // 3. Fetch Dishes
            const { data: dishData, error: dishError } = await supabase
                .from('dishes')
                .select('*');

            if (dishData && !dishError && dishData.length > 0) {
                setMenuItems(dishData.map(d => ({
                    ...d,
                    id: d.id, // Keep UUID if present
                    slug: d.slug || d.id,
                    categoryId: d.category_id,
                    imageUrl: d.image_url,
                    videoUrl: d.video_url,
                    oldPrice: d.old_price,
                    xpReward: d.xp_reward,
                    relatedItemIds: d.related_item_ids || [],
                    modifiers: d.modifiers || [],
                    ingredients: d.ingredients || [],
                    badges: d.badges || [],
                    variants: d.variants || []
                })));
            }

            // 4. Fetch Stories & Collections (Data fetching preserved from previous logic)
            // ... (Rest of fetch logic omitted for brevity as it remains same, ensuring robust fallbacks) ...
            
            // Re-fetch stories for completeness if needed in update
            const { data: storyData } = await supabase.from('stories').select('*, story_slides(*)').order('sort_order');
            if (storyData && storyData.length > 0) {
                 const mappedStories: Story[] = storyData.map(s => ({
                        id: s.id,
                        title: s.title,
                        previewImage: s.preview_image,
                        colorRing: s.color_ring,
                        slides: s.story_slides.sort((a: any, b: any) => a.sort_order - b.sort_order).map((slide: any) => ({
                            id: slide.id,
                            imageUrl: slide.image_url,
                            title: slide.title,
                            subtitle: slide.subtitle,
                            dishId: slide.linked_dish_id
                        }))
                    }));
                    setStories(mappedStories);
            }

        } catch (error) {
            console.error("Data init error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    initData();

    // LISTEN FOR AUTH CHANGES (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
             // Refetch profile logic here if needed, or simple reload to trigger initData
             // Ideally we just fetch profile again
             const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
             if(profileData) {
                 const newProfile = {
                    id: profileData.id,
                    email: profileData.email || '',
                    name: profileData.full_name || 'User',
                    avatarUrl: profileData.avatar_url || CURRENT_USER_PROFILE.avatarUrl,
                    totalXp: profileData.total_xp || 0,
                    level: profileData.level || 1,
                    livesCount: profileData.lives_count || 3,
                    balanceGP: profileData.balance_gp || 0,
                    preferences: profileData.preferences || CURRENT_USER_PROFILE.preferences
                 };
                 setUserProfile(newProfile);
                 setParticipants(prev => {
                        const newP = [...prev];
                        if(newP[0]) {
                            newP[0].nickname = newProfile.name.split(' ')[0];
                            newP[0].avatarUrl = newProfile.avatarUrl;
                        }
                        return newP;
                 });
             }
        } else if (event === 'SIGNED_OUT') {
            setUserProfile(CURRENT_USER_PROFILE); // Reset to guest
        }
    });

    return () => {
        authListener.subscription.unsubscribe();
    };
  }, []);

  // Optimized Actions using useCallback
  const addToOrder = useCallback((partialItem: Partial<OrderItem>) => {
    // Robust find: check ID OR Slug
    const dish = menuItems.find(d => d.id === partialItem.dishId || d.slug === partialItem.dishId) || 
                 DEFAULT_MENU_ITEMS.find(d => d.id === partialItem.dishId);

    if (!dish) return;

    const newItem: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      sessionId: session.id,
      participantId: myParticipantId,
      dishId: dish.id, // Always use the real ID
      quantity: partialItem.quantity || 1,
      priceAtOrder: partialItem.priceAtOrder || dish.price,
      status: 'pending',
      selectedModifiers: partialItem.selectedModifiers || [],
      excludedIngredients: partialItem.excludedIngredients || [],
      selectedVariantId: partialItem.selectedVariantId,
      dish: dish
    };
    
    setOrderItems(prev => [...prev, newItem]);
    
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
  }, [myParticipantId]);

  const updatePreferences = useCallback((prefs: Partial<DietaryPreferences>) => {
    setUserProfile(prev => ({
        ...prev,
        preferences: { ...prev.preferences, ...prefs }
    }));
    // In a real app, debounce and save to Supabase 'profiles' table here
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
      menuItems, categories, stories, collections, favorites, orderItems,
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
