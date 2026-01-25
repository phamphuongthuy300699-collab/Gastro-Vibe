
import React from 'react';
import { useGameStore } from '../../store/GameContext';
import { AppTheme } from '../../types';

export const SettingsScreen: React.FC = () => {
  const { theme, setTheme, setActiveTab, setMenuOpen } = useGameStore();

  const themes: { id: AppTheme; label: string; icon: string }[] = [
    { id: 'light', label: 'Светлая', icon: 'light_mode' },
    { id: 'dark', label: 'Темная', icon: 'dark_mode' },
    { id: 'system', label: 'Системная', icon: 'settings_brightness' },
  ];

  const handleBack = () => {
      // Go back to table or last screen logic could be implemented, 
      // but for now defaulting to table as 'home'
      setActiveTab('table');
  }

  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-anthracite text-text-main dark:text-text-light overflow-y-auto">
      
      {/* Header */}
      <header className="flex items-center px-6 py-4 bg-white/95 dark:bg-black/20 backdrop-blur-md border-b border-black/5 dark:border-white/10 sticky top-0 z-10">
        <button 
          onClick={() => setMenuOpen(true)}
          className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition text-text-main dark:text-white"
        >
          <span className="material-icons-round text-3xl">menu</span>
        </button>
        <h1 className="ml-4 text-xl font-bold uppercase tracking-widest font-sans">Настройки</h1>
      </header>

      <div className="p-6">
        
        {/* Theme Section */}
        <section className="mb-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-text-main/50 dark:text-white/50 mb-4 ml-1">Оформление</h2>
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
                {themes.map((t, idx) => (
                    <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`w-full flex items-center justify-between p-4 transition-colors hover:bg-black/5 dark:hover:bg-white/5 ${idx !== themes.length - 1 ? 'border-b border-black/5 dark:border-white/10' : ''}`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="material-icons-round text-text-main/70 dark:text-white/70">{t.icon}</span>
                            <span className="font-sans font-medium text-sm">{t.label}</span>
                        </div>
                        {theme === t.id && (
                            <span className="material-icons-round text-primary text-xl">check</span>
                        )}
                    </button>
                ))}
            </div>
        </section>

        {/* System Area (Debug) */}
        <section className="mt-12">
            <button 
                onClick={() => setActiveTab('debug')}
                className="w-full p-4 border border-dashed border-black/10 dark:border-white/10 rounded-xl text-center text-xs uppercase tracking-widest text-text-main/30 hover:text-primary hover:border-primary/50 transition-all"
            >
                System Diagnostics
            </button>
        </section>

      </div>
    </div>
  );
};
