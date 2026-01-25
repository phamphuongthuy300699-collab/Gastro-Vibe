
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/GameContext';
import { AdminRole, AdminTable, TableStatus, LifecycleState } from '../../types';
import { MOCK_FLOOR_PLAN } from '../../constants'; // Import initial mock

// Sub-views
import { AdminHostView } from '../Admin/AdminHostView';
import { AdminKitchenView } from '../Admin/AdminKitchenView';
import { AdminWaiterView } from '../Admin/AdminWaiterView';

export const AdminScreen = () => {
  const { setActiveTab } = useGameStore();
  
  // --- STATE ---
  const [currentRole, setCurrentRole] = useState<AdminRole>('admin');
  
  // Local State for Tables (initialized from Mock, but mutable for Demo)
  const [tables, setTables] = useState<AdminTable[]>(MOCK_FLOOR_PLAN);

  // Interaction State (Shared between Host & Waiter)
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const selectedTable = tables.find(t => t.id === selectedTableId) || null;

  // --- ACTIONS (Lifecycle Logic) ---

  const handleWalkIn = () => {
      if (!selectedTable) return;
      updateTable(selectedTable.id, {
          status: 'busy',
          lifecycle: 'seated',
          timeSeated: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          durationMin: 0,
          guestName: 'Гости (Walk-in)',
          currentBill: 0,
          orderSummary: []
      });
      setSelectedTableId(null); // Close modal
  };

  const handlePaymentRequest = () => {
      if (!selectedTable) return;
      updateTable(selectedTable.id, {
          status: 'alert',
          lifecycle: 'paying',
          alertMessage: 'Запрос счета'
      });
      setShowPaymentModal(true);
  };

  const handleCloseCheck = () => {
      if (!selectedTable) return;
      setShowPaymentModal(false);
      
      // Simulate cleaning then free
      updateTable(selectedTable.id, {
          status: 'busy',
          lifecycle: 'cleaning',
          guestName: undefined,
          currentBill: 0,
          orderSummary: []
      });

      setTimeout(() => {
          updateTable(selectedTable.id, {
              status: 'free',
              lifecycle: undefined,
              timeSeated: undefined,
              durationMin: undefined
          });
      }, 2000); // 2 sec cleaning simulation
      
      setSelectedTableId(null);
  };

  const handleFireMains = () => {
      if (!selectedTable) return;
      // Just a visual update for demo
      alert(`Курс "Горячее" для стола ${selectedTable.label} отправлен на кухню!`);
      updateTable(selectedTable.id, { lifecycle: 'eating' });
  };

  const updateTable = (id: string, updates: Partial<AdminTable>) => {
      setTables(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  // --- RENDERERS ---

  const renderAdminBottomNav = () => (
      <div className="bg-[#1c1c1e] border-t border-white/10 px-4 py-3 pb-6 shrink-0 flex justify-between items-center gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.5)] z-20">
          {(['admin', 'kitchen', 'waiter'] as AdminRole[]).map((role) => {
              const isActive = currentRole === role;
              let icon = '';
              let label = '';
              
              switch(role) {
                  case 'admin': icon = 'storefront'; label = 'Зал / Хост'; break;
                  case 'kitchen': icon = 'skillet'; label = 'Кухня (KDS)'; break;
                  case 'waiter': icon = 'person'; label = 'Официант'; break;
              }

              return (
                  <button
                    key={role}
                    onClick={() => { setCurrentRole(role); setSelectedTableId(null); }}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-2 rounded-xl transition-all duration-300 ${
                        isActive 
                        ? 'bg-primary text-black shadow-lg shadow-primary/20 scale-105' 
                        : 'text-white/40 hover:text-white hover:bg-white/5'
                    }`}
                  >
                      <span className="material-icons-round text-2xl">{icon}</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
                  </button>
              );
          })}
      </div>
  );

  return (
    <div className="flex flex-col h-full bg-black text-white relative overflow-hidden font-sans">
        
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 shrink-0 border-b border-white/5 bg-[#121212] z-30">
             <button onClick={() => setActiveTab('profile')} className="p-2 -ml-2 text-white/50 hover:text-white flex items-center gap-2 group">
                <span className="material-icons-round text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">Выход</span>
             </button>
             <div className="flex flex-col items-center">
                 <h1 className="font-logo text-lg tracking-widest uppercase font-bold text-white">Gastro-OS</h1>
                 <div className="flex items-center gap-1.5 mt-0.5">
                     <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${currentRole === 'kitchen' ? 'bg-orange-500' : 'bg-status-green'}`}></div>
                     <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">
                         {currentRole === 'admin' ? 'Hall Control' : currentRole === 'kitchen' ? 'KDS System' : 'Waiter App'}
                     </span>
                 </div>
             </div>
             <div className="w-10"></div>
        </div>

        {/* Main Content Area - PASSING DYNAMIC TABLES */}
        {currentRole === 'admin' && (
            <AdminHostView 
                onSelectTable={(t) => setSelectedTableId(t.id)} 
                // We need to pass the DYNAMIC tables to the view, 
                // but AdminHostView currently imports MOCK directly.
                // We will patch AdminHostView next to accept props override or use context.
                // For now, let's assume we modify AdminHostView to accept `tables` prop or we stick to this structure
                // and I will update AdminHostView in the next file block to accept `tables` prop.
                tables={tables}
            />
        )}
        
        {currentRole === 'kitchen' && (
            <AdminKitchenView />
        )}
        
        {currentRole === 'waiter' && (
            <AdminWaiterView 
                onSelectTable={(t) => setSelectedTableId(t.id)} 
                onRequestPayment={(t) => { setSelectedTableId(t.id); setShowPaymentModal(true); }}
                tables={tables}
            />
        )}

        {/* Admin Specific Bottom Nav */}
        {renderAdminBottomNav()}

        {/* --- SHARED MODALS (Host & Waiter) --- */}

        {/* RICH TABLE DETAILS MODAL */}
        <AnimatePresence>
            {selectedTable && !showPaymentModal && (
                <motion.div 
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    className="absolute bottom-0 left-0 right-0 bg-[#1c1c1e] border-t border-white/10 rounded-t-3xl z-40 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 bg-[#2c2c2e] border-b border-white/5 flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Стол</span>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedTable.status === 'free' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                                    {selectedTable.status === 'free' ? 'Свободен' : selectedTable.lifecycle || 'Занят'}
                                </span>
                            </div>
                            <h2 className="text-4xl font-mono font-bold text-white">{selectedTable.label}</h2>
                        </div>
                        <button onClick={() => setSelectedTableId(null)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20">
                            <span className="material-icons-round text-white">close</span>
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto space-y-6 pb-32">
                        
                        {/* 1. Guest & Waiter Info */}
                        <div className="flex gap-4">
                            <div className="flex-1 bg-black/20 p-3 rounded-xl border border-white/5">
                                <span className="text-[10px] text-white/30 uppercase font-bold block mb-1">Гость</span>
                                <div className="font-bold text-sm text-white">{selectedTable.guestName || 'Нет гостей'}</div>
                                {selectedTable.notes && <div className="text-xs text-yellow-500 mt-1 italic">"{selectedTable.notes}"</div>}
                            </div>
                            <div className="flex-1 bg-black/20 p-3 rounded-xl border border-white/5">
                                <span className="text-[10px] text-white/30 uppercase font-bold block mb-1">Официант</span>
                                <div className="font-bold text-sm text-white">{selectedTable.waiterName || 'Не назначен'}</div>
                            </div>
                        </div>

                        {/* 2. Timeline */}
                        <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] text-white/30 uppercase font-bold block mb-1">Посадка</span>
                                <span className="font-mono text-sm">{selectedTable.timeSeated || '--:--'}</span>
                            </div>
                            <div className="h-8 w-[1px] bg-white/10"></div>
                            <div>
                                <span className="text-[10px] text-white/30 uppercase font-bold block mb-1">Длительность</span>
                                <span className={`font-mono text-sm ${selectedTable.durationMin && selectedTable.durationMin > 90 ? 'text-red-500' : 'text-green-500'}`}>
                                    {selectedTable.durationMin !== undefined ? `${selectedTable.durationMin} мин` : '--'}
                                </span>
                            </div>
                            <div className="h-8 w-[1px] bg-white/10"></div>
                            <div>
                                <span className="text-[10px] text-white/30 uppercase font-bold block mb-1">Бронь</span>
                                <span className="font-mono text-sm text-purple-400">{selectedTable.nextReservation || 'Нет'}</span>
                            </div>
                        </div>

                        {/* 3. Order Summary */}
                        {selectedTable.status !== 'free' && (
                            <div>
                                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Заказ</h3>
                                <div className="bg-black/20 rounded-xl border border-white/5 p-4">
                                    {selectedTable.orderSummary && selectedTable.orderSummary.length > 0 ? (
                                        <ul className="space-y-2">
                                            {selectedTable.orderSummary.map((item, i) => (
                                                <li key={i} className="flex justify-between items-center text-sm border-b border-white/5 last:border-0 pb-1 last:pb-0">
                                                    <span className="text-white/80">{item}</span>
                                                    <span className="material-icons-round text-xs text-status-green">check_circle</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-white/30 italic text-sm">Заказ еще не сформирован</p>
                                    )}
                                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-end">
                                        <span className="text-xs text-white/50">Итого</span>
                                        <span className="text-xl font-mono font-bold text-primary">{selectedTable.currentBill?.toLocaleString() || 0} ₽</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. Actions Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {selectedTable.status === 'free' ? (
                                <button 
                                    onClick={handleWalkIn}
                                    className="col-span-2 py-4 bg-primary text-black font-bold text-sm uppercase rounded-xl hover:opacity-90 shadow-lg shadow-primary/20"
                                >
                                    Быстрая посадка (Walk-in)
                                </button>
                            ) : (
                                <>
                                    <button onClick={handlePaymentRequest} className="py-4 bg-status-green text-white font-bold text-xs uppercase rounded-xl hover:opacity-90 shadow-lg shadow-green-900/20">
                                        Расчет / Лояльность
                                    </button>
                                    <button className="py-4 bg-[#2c2c2e] border border-white/10 text-white font-bold text-xs uppercase rounded-xl hover:bg-white/10">
                                        Печать пречека
                                    </button>
                                    {selectedTable.lifecycle === 'ordered' && (
                                        <button onClick={handleFireMains} className="col-span-2 py-3 bg-orange-500/20 border border-orange-500 text-orange-500 font-bold text-xs uppercase rounded-xl hover:bg-orange-500 hover:text-white transition-colors">
                                            🔥 Готовить горячее (Fire Mains)
                                        </button>
                                    )}
                                    <button className="col-span-2 py-2 text-xs text-white/30 uppercase tracking-widest hover:text-white">
                                        Пересадить гостей
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Waiter Payment/Loyalty Modal */}
        <AnimatePresence>
            {showPaymentModal && selectedTable && (
                <motion.div 
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    className="absolute bottom-0 left-0 right-0 h-[85vh] bg-[#121212] border-t border-white/10 rounded-t-3xl z-50 shadow-2xl flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 pb-2 shrink-0">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold uppercase tracking-widest text-white">Расчет</h2>
                            <button onClick={() => setShowPaymentModal(false)} className="text-white/50 hover:text-white">Закрыть</button>
                        </div>
                        <div className="flex items-end justify-between border-b border-white/10 pb-4">
                            <div>
                                <p className="text-[10px] text-white/40 uppercase font-bold mb-1">К оплате</p>
                                <p className="text-4xl font-mono font-bold text-white">{selectedTable.currentBill} ₽</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-white">Стол {selectedTable.label}</p>
                                <p className="text-xs text-white/50">Гостей: {selectedTable.guests || 2}</p>
                            </div>
                        </div>
                    </div>

                    {/* Loyalty Section */}
                    <div className="p-6 pt-2 overflow-y-auto flex-1 pb-32">
                        <div className="bg-gradient-to-br from-stone-800 to-black p-4 rounded-xl border border-white/10 mb-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-primary text-black text-[9px] font-bold px-2 py-1 rounded-bl-lg uppercase">Gold Member</div>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                                    <span className="material-icons-round text-primary text-2xl">person</span>
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{selectedTable.guestName || 'Гость'}</p>
                                    <p className="text-xs text-primary font-mono">Баланс: 1250 бонусов</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-xs font-bold text-white/60 uppercase">Списать 50%?</span>
                                <div className="w-12 h-6 bg-green-500/20 rounded-full relative cursor-pointer border border-green-500/50">
                                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-green-500 rounded-full shadow"></div>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-[10px] text-white/40 uppercase font-bold mb-3 tracking-widest">Способ оплаты</h3>
                        <div className="grid grid-cols-2 gap-3 mb-6">
                             <button className="py-4 bg-[#2c2c2e] rounded-xl flex flex-col items-center gap-2 border border-primary/50 text-primary hover:bg-primary/10 transition-colors">
                                 <span className="material-icons-round">credit_card</span>
                                 <span className="text-xs font-bold uppercase">Терминал</span>
                             </button>
                             <button className="py-4 bg-[#1c1c1e] rounded-xl flex flex-col items-center gap-2 border border-white/5 text-white/40 hover:text-white">
                                 <span className="material-icons-round">payments</span>
                                 <span className="text-xs font-bold uppercase">Наличные</span>
                             </button>
                        </div>
                    </div>
                    
                    {/* Action */}
                    <div className="p-6 pt-0 bg-[#121212] shrink-0 absolute bottom-0 left-0 w-full">
                         <button 
                            onClick={handleCloseCheck}
                            className="w-full py-4 bg-status-green text-white font-bold uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(74,222,128,0.2)] hover:scale-[1.02] transition-transform"
                        >
                             Закрыть чек и начислить XP
                         </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

    </div>
  );
};
