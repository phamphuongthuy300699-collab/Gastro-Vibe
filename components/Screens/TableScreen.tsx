
import React, { useState } from 'react';
import { useGameStore } from '../../store/GameContext';
import { motion, AnimatePresence } from 'framer-motion';
import { OrderItem } from '../../types';

const OrderItemRow: React.FC<{ item: OrderItem }> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const modifierNames = item.selectedModifiers.map((modId: string) => {
          const mod = item.dish?.modifiers?.find((m: any) => m.id === modId);
          return mod ? mod.name : null;
    }).filter(Boolean) as string[];
    
    const hasExtras = (item.excludedIngredients?.length || 0) > 0 || modifierNames.length > 0;

    // Icon Logic
    const getIcon = () => {
        if (item.dish?.type === 'drink') return '🍹';
        if (item.dish?.categoryId === 'cat_steaks') return '🥩';
        if (item.dish?.categoryId === 'cat_pizza') return '🍕';
        if (item.dish?.categoryId === 'cat_dessert') return '🍰';
        if (item.dish?.categoryId === 'cat_soups') return '🍜';
        if (item.dish?.categoryId === 'cat_salads') return '🥗';
        if (item.dish?.categoryId === 'cat_hot') return '🍗';
        return '🍽️';
    };

    return (
      <div className="flex flex-col mb-3 pb-3 border-b border-dashed border-gray-100 last:border-0 last:pb-0">
          <div className="flex items-start justify-between w-full" onClick={() => hasExtras && setIsOpen(!isOpen)}>
              <div className="flex items-center gap-3 max-w-[75%]">
                  <span className="text-xl shrink-0">{getIcon()}</span>
                  <div className="flex flex-col">
                      <span className="text-sm font-bold text-text-main uppercase tracking-wide leading-tight">
                          {item.dish?.name || 'Блюдо'} 
                      </span>
                  </div>
                  {hasExtras && (
                      <button className={`text-primary transition-transform duration-200 self-center ${isOpen ? 'rotate-180' : ''}`}>
                          <span className="material-icons-round text-lg">expand_more</span>
                      </button>
                  )}
              </div>
              <span className="text-sm font-bold tabular-nums text-text-main">
                  {item.priceAtOrder * item.quantity}
              </span>
          </div>
          
          {item.quantity > 1 && (
                  <div className="text-xs text-text-main/50 font-bold mt-0.5 ml-8">
                      {item.priceAtOrder} x {item.quantity}
                  </div>
          )}

          {/* Collapsible Details */}
          <AnimatePresence>
              {isOpen && hasExtras && (
                  <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden ml-8"
                  >
                      <div className="flex flex-wrap gap-1 mt-2 p-2 bg-background-soft rounded-lg">
                          {item.excludedIngredients?.map((ing: string) => (
                              <span key={ing} className="text-[9px] font-bold text-red-400 border border-red-100 px-1.5 py-0.5 rounded-sm uppercase tracking-wider line-through decoration-red-400 bg-white">
                                  {ing}
                              </span>
                          ))}
                          {modifierNames.map((modName: string, idx: number) => (
                              <span key={idx} className="text-[9px] font-bold text-primary border border-primary/20 px-1.5 py-0.5 rounded-sm uppercase tracking-wider bg-white">
                                  + {modName}
                              </span>
                          ))}
                      </div>
                  </motion.div>
              )}
          </AnimatePresence>

          <div className="flex items-center gap-2 mt-1 ml-8">
              <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'served' ? 'bg-status-green' : 'bg-primary animate-pulse'}`}></div>
              <span className={`text-[9px] font-bold uppercase tracking-widest ${item.status === 'served' ? 'text-status-green' : 'text-primary'}`}>
                  {item.status === 'served' ? 'Подано' : 'Готовится'}
              </span>
          </div>
      </div>
    );
};

export const TableScreen: React.FC = () => {
  const { setActiveTab, participants, session, orderItems, myParticipantId, setMenuOpen } = useGameStore();

  const totalBill = orderItems.reduce((acc, i) => acc + (i.priceAtOrder * i.quantity), 0);
  
  // Group orders by participant
  const groupedOrders = participants.map(p => ({
      participant: p,
      items: orderItems.filter(o => o.participantId === p.id)
  })).filter(g => g.items.length > 0);

  return (
    <div className="relative flex h-full w-full flex-col bg-background-light text-text-main overflow-y-auto no-scrollbar pb-24">
      
      {/* Brand Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-4 flex justify-between items-center bg-white/95 backdrop-blur-sm max-w-md mx-auto border-b border-black/5">
        <button 
            onClick={() => setMenuOpen(true)}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 transition text-text-main"
        >
            <span className="material-icons-round text-3xl">menu</span>
        </button>
        
        <div className="flex flex-col items-center">
            <h1 className="text-2xl font-logo font-bold text-text-main tracking-widest uppercase leading-none">
                МАРГАРИТА
            </h1>
            <span className="text-[9px] font-sans text-primary tracking-[0.3em] lowercase mt-1">
                семейный ресторан
            </span>
        </div>

        <button className="p-2 -mr-2 rounded-full hover:bg-black/5 transition text-text-main">
            <span className="material-icons-round text-2xl">notifications_none</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-24 px-4">
        
        {/* Hero Card */}
        <div className="relative w-full h-64 overflow-hidden rounded-[24px] shadow-lg mx-auto mb-6 group bg-anthracite">
            {/* Background Image - UPDATED URL */}
            <div className="absolute inset-0 bg-cover bg-center opacity-90 transition-transform duration-1000 group-hover:scale-105" 
                 style={{ backgroundImage: "url('https://klbpsnplbufsrmmpincy.supabase.co/storage/v1/object/public/Pictures/screen.png')" }}>
            </div>
            
            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 pt-4 bg-black/20">
                <h2 className="text-5xl font-logo font-bold tracking-widest uppercase drop-shadow-md text-white">
                    {session.tableId.replace('table_', '')}
                </h2>
                <div className="h-[1px] w-12 bg-white/80 my-3"></div>
                <p className="text-[10px] font-sans font-medium opacity-90 tracking-[0.2em] uppercase text-white">Зал • 1 этаж</p>
            </div>
        </div>

        <div className="space-y-6">
            
            {/* Atmosphere Widget */}
            <div className="bg-white border border-[#F0EAE5] rounded-2xl p-4 flex items-center shadow-sm shadow-gray-100">
                <div className="w-12 h-12 rounded-full bg-anthracite flex items-center justify-center mr-4 shrink-0 animate-[spin_10s_linear_infinite]">
                    <span className="material-icons-round text-primary text-2xl">album</span>
                </div>
                <div>
                    <h3 className="font-logo font-bold text-lg leading-tight uppercase tracking-wide text-text-main">Атмосфера</h3>
                    <p className="text-xs text-text-main/60 font-medium tracking-wide">Вечерний Джаз</p>
                </div>
                <div className="ml-auto">
                    <span className="material-icons-round text-primary/50 text-2xl">graphic_eq</span>
                </div>
            </div>

            {/* Participants */}
            <div className="flex items-center justify-between px-1">
                <div className="flex -space-x-3 overflow-hidden p-1">
                    {participants.slice(0, 3).map((p) => (
                         <img key={p.id} alt={p.nickname} className="inline-block h-10 w-10 rounded-full ring-2 ring-white object-cover grayscale hover:grayscale-0 transition-all" src={p.avatarUrl} />
                    ))}
                    {participants.length > 3 && (
                        <div className="h-10 w-10 rounded-full ring-2 ring-white bg-[#F5F0EB] text-text-main flex items-center justify-center text-xs font-bold">
                            +{participants.length - 3}
                        </div>
                    )}
                </div>
                <button className="text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/30 px-5 py-2.5 rounded-full hover:bg-primary hover:text-white transition-colors">
                    Пригласить
                </button>
            </div>

            {/* Gold Zigzag (MOVED ABOVE ORDER CARD) */}
            <div className="w-full h-10 restaurant-wall"></div>

            {/* Order Card */}
            <div className="bg-white border border-[#F0EAE5] rounded-2xl p-6 shadow-sm shadow-gray-100 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                     <h3 className="text-sm font-bold uppercase tracking-widest text-text-main">Общий заказ</h3>
                     <span className="text-[10px] bg-primary/10 text-primary px-2 py-1 rounded font-bold uppercase tracking-wider">
                         {session.status === 'active' ? 'Открыт' : 'Закрыт'}
                     </span>
                </div>
                
                <div className="space-y-6 relative z-10">
                    {groupedOrders.length === 0 ? (
                        <div className="text-center py-6 text-text-main/40 italic text-sm font-serif">
                            Здесь появятся ваши блюда
                        </div>
                    ) : (
                        groupedOrders.map((group) => (
                            <div key={group.participant.id} className="relative">
                                {/* Participant Header */}
                                <div className="flex items-center gap-2 mb-3 bg-background-soft p-2 rounded-lg">
                                    <img src={group.participant.avatarUrl} className="w-6 h-6 rounded-full object-cover" />
                                    <span className="text-xs font-bold uppercase text-text-main tracking-wide">{group.participant.nickname}</span>
                                    {group.participant.id === myParticipantId && (
                                        <span className="text-[9px] bg-anthracite text-white px-1.5 rounded ml-auto">ВЫ</span>
                                    )}
                                </div>
                                
                                <div className="pl-2">
                                    {group.items.map(item => (
                                        <OrderItemRow key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-6 pt-4 border-t border-black/5 flex justify-between items-end relative z-10">
                    <span className="text-[10px] font-bold opacity-60 text-text-main uppercase tracking-widest">Общий счет</span>
                    <span className="text-2xl font-bold tabular-nums text-primary font-mono">{totalBill.toLocaleString()} ₽</span>
                </div>
            </div>

        </div>
      </main>

      {/* Floating CTA */}
      <div className="fixed bottom-24 right-5 z-20">
        <button 
            onClick={() => setActiveTab('menu')}
            className="w-14 h-14 bg-anthracite text-primary rounded-full shadow-2xl shadow-black/20 active:scale-95 transition-all flex items-center justify-center border border-primary/20 hover:bg-black"
        >
            <span className="material-icons-round text-3xl">add</span>
        </button>
      </div>
    </div>
  );
};
