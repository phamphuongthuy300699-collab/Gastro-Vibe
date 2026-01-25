
import React from 'react';
import { GameProvider, useGameStore } from './store/GameContext';
import { BottomNav } from './components/Layout/BottomNav';
import { TableScreen } from './components/Screens/TableScreen';
import { MenuScreen } from './components/Screens/MenuScreen';
import { BillScreen } from './components/Screens/BillScreen';
import { GamesScreen } from './components/Screens/GamesScreen';
import { ProfileScreen } from './components/Screens/ProfileScreen';
import { AdminScreen } from './components/Screens/AdminScreen';
import { SettingsScreen } from './components/Screens/SettingsScreen';
import { DebugScreen } from './components/Debug/DebugScreen';
import { AuthScreen } from './components/Screens/AuthScreen';
import { EventsScreen } from './components/Screens/EventsScreen';
import { ProductSheet } from './components/Modals/ProductSheet';
import { StoryViewer } from './components/Modals/StoryViewer';
import { CollectionSelector } from './components/Modals/CollectionSelector';
import { BurgerMenu } from './components/Layout/BurgerMenu';
import { AnimatePresence, motion } from 'framer-motion';

const ScreenRenderer: React.FC = () => {
  const { activeTab } = useGameStore();

  const renderScreen = () => {
    switch (activeTab) {
      case 'table': return <TableScreen />;
      case 'menu': return <MenuScreen />;
      case 'bill': return <BillScreen />;
      case 'games': return <GamesScreen />;
      case 'profile': return <ProfileScreen />;
      case 'admin': return <AdminScreen />;
      case 'auth': return <AuthScreen />;
      case 'settings': return <SettingsScreen />;
      case 'debug': return <DebugScreen />;
      case 'events': return <EventsScreen />;
      default: return <TableScreen />;
    }
  };

  return (
    <div className="flex-1 w-full h-full overflow-hidden bg-background-light dark:bg-background-dark">
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full h-full"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  // Logic to determine if global nav should be shown
  const NavWrapper = () => {
      const { activeTab } = useGameStore();
      // Hide bottom nav for Events as well to give it full screen focus (similar to Admin/Auth)
      // or keep it. Let's hide it for Events to match the "modal-like" feel of Story transition.
      const hideNavTabs = ['admin', 'auth', 'debug', 'events'];
      
      if (hideNavTabs.includes(activeTab)) return null;
      return <BottomNav />;
  };

  return (
    <GameProvider>
      <div className="flex flex-col h-[100dvh] w-full max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden relative">
        <ScreenRenderer />
        <NavWrapper />
        <BurgerMenu />
        <ProductSheet />
        <StoryViewer />
        <CollectionSelector />
      </div>
    </GameProvider>
  );
};

export default App;
