
import React from 'react';
import { useGameStore } from '../../store/GameContext';
import { Tab } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, orderItems, myParticipantId } = useGameStore();

  // Hide BottomNav on Admin, Auth, and Debug screens
  if (['admin', 'auth', 'debug'].includes(activeTab)) {
      return null;
  }

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: 'table', icon: 'table_restaurant', label: 'Визит' },
    { id: 'games', icon: 'diamond', label: 'Клуб' }, // Swapped to 2nd position
    { id: 'menu', icon: 'restaurant_menu', label: 'Меню' }, // Swapped to 3rd position
    { id: 'bill', icon: 'receipt_long', label: 'Счет' },
    { id: 'profile', icon: 'person', label: 'Профиль' },
  ];

  const myItemsCount = orderItems.filter(o => o.participantId === myParticipantId && o.status !== 'paid').length;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-black/5 pb-6 pt-3 px-6 z-30 shadow-[0_-5px_30px_rgba(0,0,0,0.03)] max-w-md mx-auto">
      <ul className="flex justify-between items-end">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <li key={item.id}>
              <button 
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 w-12 group transition-colors duration-300 relative ${isActive ? 'text-primary' : 'text-text-main/40 hover:text-primary'}`}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'transform -translate-y-1' : ''}`}>
                    <span className={`material-icons-round text-[26px] ${item.id === 'games' && isActive ? 'text-[30px]' : ''}`}>
                        {item.icon}
                    </span>
                </div>
                <span className={`text-[10px] font-semibold leading-none ${isActive ? 'font-bold' : ''}`}>
                    {item.label}
                </span>

                {/* Badge for Bill */}
                {item.id === 'bill' && myItemsCount > 0 && (
                   <div className="absolute top-0 right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></div>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
