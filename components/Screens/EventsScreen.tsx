
import React, { useState } from 'react';
import { useGameStore } from '../../store/GameContext';
import { EVENTS } from '../../constants';
import { motion } from 'framer-motion';

export const EventsScreen: React.FC = () => {
  const { setActiveTab, setMenuOpen } = useGameStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'music' | 'kids' | 'tasting'>('all');

  const filteredEvents = activeFilter === 'all' 
    ? EVENTS 
    : EVENTS.filter(e => e.type === activeFilter);

  // Helper to format date "27 ОКТ"
  const formatDateBadge = (dateStr: string) => {
      const date = new Date(dateStr);
      const day = date.getDate();
      const month = date.toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '').toUpperCase();
      return { day, month };
  };

  const getFilterLabel = (key: string) => {
      switch(key) {
          case 'music': return 'Музыка';
          case 'kids': return 'Детям';
          case 'tasting': return 'Дегустации';
          default: return 'Все';
      }
  };

  return (
    <div className="flex flex-col h-full bg-background-light text-text-main font-sans overflow-hidden">
        
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-black/5 sticky top-0 z-20 shadow-sm">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setMenuOpen(true)}
                    className="p-2 -ml-2 rounded-full hover:bg-black/5 transition text-text-main"
                >
                    <span className="material-icons-round text-3xl">menu</span>
                </button>
                <h1 className="text-xl font-logo font-bold uppercase tracking-[0.15em] text-text-main">Афиша</h1>
            </div>
            <button 
                onClick={() => setActiveTab('menu')}
                className="text-sm font-bold text-text-main/50 hover:text-text-main uppercase tracking-widest"
            >
                Закрыть
            </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
            
            {/* Filters */}
            <div className="px-6 py-6 overflow-x-auto no-scrollbar flex gap-2 sticky top-0 bg-background-light z-10">
                {['all', 'music', 'kids', 'tasting'].map((filter) => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter as any)}
                        className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${
                            activeFilter === filter 
                            ? 'bg-anthracite text-primary border-anthracite shadow-lg' 
                            : 'bg-white text-text-main border-black/10 hover:border-black/30'
                        }`}
                    >
                        {getFilterLabel(filter)}
                    </button>
                ))}
            </div>

            {/* Events List */}
            <div className="px-6 pb-32 space-y-8">
                {filteredEvents.map((event) => {
                    const { day, month } = formatDateBadge(event.date);
                    
                    return (
                        <motion.div 
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-[24px] overflow-hidden shadow-xl border border-[#F0EAE5] group"
                        >
                            {/* Image Container */}
                            <div className="relative h-64 overflow-hidden">
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('${event.imageUrl}')` }}></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                
                                {/* Date Badge */}
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md rounded-xl p-2 flex flex-col items-center min-w-[60px] shadow-lg">
                                    <span className="text-2xl font-logo font-bold text-anthracite leading-none">{day}</span>
                                    <span className="text-[9px] font-bold text-primary uppercase tracking-widest">{month}</span>
                                </div>

                                {/* Type Badge */}
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full border border-white/10">
                                    <span className="text-[9px] font-bold uppercase tracking-widest">
                                        {event.type === 'music' ? 'Концерт' : event.type === 'kids' ? 'Kids' : 'Event'}
                                    </span>
                                </div>

                                {/* Title Overlay */}
                                <div className="absolute bottom-0 left-0 w-full p-6">
                                    <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest mb-2">
                                        <span className="material-icons-round text-sm">schedule</span>
                                        {event.time}
                                    </div>
                                    <h2 className="text-2xl font-serif text-white leading-tight drop-shadow-md">{event.title}</h2>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6 pt-4">
                                <p className="text-sm text-text-main/70 leading-relaxed mb-6 font-sans">
                                    {event.description}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-[#F0EAE5]">
                                    <div>
                                        {event.price ? (
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-text-main/40 uppercase font-bold tracking-widest">Вход</span>
                                                <span className="text-lg font-bold text-anthracite font-mono">{event.price} ₽</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm font-bold text-status-green uppercase tracking-widest bg-green-50 px-2 py-1 rounded">Бесплатно</span>
                                        )}
                                    </div>

                                    <button 
                                        className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 active:scale-95"
                                        onClick={() => alert('Бронирование столика для события')}
                                    >
                                        Записаться
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                
                {filteredEvents.length === 0 && (
                    <div className="text-center py-10 text-text-main/40">
                        <span className="material-icons-round text-4xl mb-2">event_busy</span>
                        <p className="text-sm font-medium">Нет событий в этой категории</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
