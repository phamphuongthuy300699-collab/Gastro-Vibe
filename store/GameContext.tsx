import React, { ReactNode } from 'react';
import { UIProvider, useUIStore } from './UIContext';
import { DataProvider, useDataStore } from './DataContext';
import { Tab, OrderItem, Participant, Dish, TableSession, UserProfile, Visit, DietaryPreferences, Story, CollectionSet, Category, AppTheme } from '../types';

// The composite type that matches the old GameContext exactly
interface GameContextType {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isLoading: boolean;

  // Data State
  userProfile: UserProfile;
  session: TableSession;
  participants: Participant[];
  myParticipantId: string;
  visits: Visit[];
  menuItems: Dish[];
  categories: Category[];
  stories: Story[]; // New
  collections: CollectionSet[]; // New
  favorites: Set<string>;
  
  // Orders
  orderItems: OrderItem[];
  addToOrder: (item: Partial<OrderItem>) => void;
  removeFromOrder: (dishId: string) => void;
  
  // Actions
  openProduct: (dish: Dish | null) => void;
  selectedDish: Dish | null;
  payBill: (amount: number, tip: number) => Promise<void>;
  updatePreferences: (prefs: Partial<DietaryPreferences>) => void;
  toggleFavorite: (dishId: string) => Promise<void>;

  // Interactive Content
  activeStory: Story | null;
  openStory: (story: Story | null) => void;
  activeCollection: CollectionSet | null;
  openCollection: (collection: CollectionSet | null) => void;
  
  // UI States
  showConfetti: boolean;
  setShowConfetti: (v: boolean) => void;
  
  // Navigation & Theme
  isMenuOpen: boolean;
  setMenuOpen: (v: boolean) => void;
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;

  // Auth
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
}

// The wrapper provider
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <UIProvider>
      <DataProvider>
        {children}
      </DataProvider>
    </UIProvider>
  );
};

// The composite hook
export const useGameStore = (): GameContextType => {
  const ui = useUIStore();
  const data = useDataStore();

  return {
    ...ui,
    ...data
  };
};