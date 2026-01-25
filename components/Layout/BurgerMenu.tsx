
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/GameContext';

export const BurgerMenu: React.FC = () => {
  const { isMenuOpen, setMenuOpen, setActiveTab, isAdmin } = useGameStore();

  const handleNavigate = (tab: any) => {
    // Check auth for admin
    if (tab === 'admin' && !isAdmin) {
        setActiveTab('auth');
    } else {
        setActiveTab(tab);
    }
    setMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-anthracite/80 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-[300px] bg-background-light z-50 shadow-2xl flex flex-col border-r border-primary/20"
          >
            <div className="p-10 pb-6 bg-anthracite">
              <h2 className="font-logo text-2xl text-primary font-bold tracking-[0.15em] uppercase">МАРГАРИТА</h2>
              <p className="text-white/40 text-[10px] font-sans mt-2 tracking-widest uppercase">семейный ресторан</p>
            </div>

            <div className="flex-1 overflow-y-auto py-6">
              <nav className="flex flex-col space-y-1">
                <button 
                  onClick={() => handleNavigate('settings')}
                  className="px-8 py-4 flex items-center gap-4 text-text-main hover:bg-primary/10 transition-colors group"
                >
                  <span className="material-icons-round text-2xl text-text-main/40 group-hover:text-primary transition-colors">settings</span>
                  <span className="font-sans font-bold text-xs uppercase tracking-widest group-hover:text-primary transition-colors">Настройки</span>
                </button>
                
                 <button 
                  onClick={() => handleNavigate('admin')}
                  className="px-8 py-4 flex items-center gap-4 text-text-main hover:bg-primary/10 transition-colors group"
                >
                  <span className="material-icons-round text-2xl text-text-main/40 group-hover:text-primary transition-colors">admin_panel_settings</span>
                  <span className="font-sans font-bold text-xs uppercase tracking-widest group-hover:text-primary transition-colors">Админка</span>
                </button>
              </nav>
            </div>

            <div className="p-8 border-t border-black/5 flex justify-center">
               <div className="w-10 h-1 bg-primary/20 rounded-full"></div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
