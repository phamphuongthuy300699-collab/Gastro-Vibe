
import React from 'react';
import { useGameStore } from '../../store/GameContext';
import { Tab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useGameStore();

  if (['admin', 'auth', 'debug'].includes(activeTab)) {
    return null;
  }

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: 'menu', icon: 'restaurant_menu', label: 'Меню' },
    { id: 'vibe', icon: 'play_circle', label: 'VIBE' },
    { id: 'games', icon: 'diamond', label: 'Клуб' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-black/5 pb-6 pt-3 px-8 z-30 shadow-[0_-5px_30px_rgba(0,0,0,0.03)] max-w-md mx-auto">
      <ul className="flex justify-around items-end">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 min-w-16 group transition-colors duration-300 relative ${isActive ? 'text-primary' : 'text-text-main/40 hover:text-primary'}`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'transform -translate-y-1' : ''}`}>
                  <span className={`material-icons-round text-[26px] ${item.id === 'vibe' && isActive ? 'text-[30px]' : ''}`}>
                    {item.icon}
                  </span>
                </div>
                <span className={`text-[10px] font-semibold leading-none ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
