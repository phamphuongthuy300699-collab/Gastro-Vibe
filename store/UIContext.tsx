
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Tab, AppTheme, Dish, Story, CollectionSet } from '../types';

interface UIContextType {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  
  // Modals & Overlays
  selectedDish: Dish | null;
  openProduct: (dish: Dish | null) => void;
  activeStory: Story | null;
  openStory: (story: Story | null) => void;
  activeCollection: CollectionSet | null;
  openCollection: (collection: CollectionSet | null) => void;
  
  // Visual Effects
  showConfetti: boolean;
  setShowConfetti: (v: boolean) => void;
  
  // Navigation
  isMenuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  
  // Theme
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;

  // Auth
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<Tab>('table');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeCollection, setActiveCollection] = useState<CollectionSet | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<AppTheme>('light');
  const [isAdmin, setIsAdmin] = useState(false);

  // Theme Side Effect
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Memoize handlers to prevent re-renders in children
  const openProduct = useCallback((dish: Dish | null) => setSelectedDish(dish), []);
  const openStory = useCallback((story: Story | null) => setActiveStory(story), []);
  const openCollection = useCallback((collection: CollectionSet | null) => setActiveCollection(collection), []);

  return (
    <UIContext.Provider value={{
      activeTab, setActiveTab,
      selectedDish, openProduct,
      activeStory, openStory,
      activeCollection, openCollection,
      showConfetti, setShowConfetti,
      isMenuOpen, setMenuOpen,
      theme, setTheme,
      isAdmin, setIsAdmin
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUIStore = () => {
  const context = useContext(UIContext);
  if (context === undefined) throw new Error('useUIStore must be used within a UIProvider');
  return context;
};
