
import React from 'react';
import { MOCK_WAITER_NOTIFICATIONS } from '../../constants';
import { AdminTable } from '../../types';

interface AdminWaiterViewProps {
    onSelectTable: (table: AdminTable) => void;
    onRequestPayment: (table: AdminTable) => void;
    tables: AdminTable[]; // Added this prop
}

export const AdminWaiterView: React.FC<AdminWaiterViewProps> = ({ onSelectTable, onRequestPayment, tables }) => {
  // Sort tables: Alerts -> Paying -> Eating -> Others
  const myTables = [...(tables || [])].filter(t => t.status === 'busy' || t.status === 'alert').sort((a, b) => {
      if (a.status === 'alert') return -1;
      if (b.status === 'alert') return 1;
      if (a.lifecycle === 'paying') return -1;
      return 0;
  });

  return (
      <div className="flex-1 flex flex-col min-h-0 gap-6 overflow-y-auto no-scrollbar pb-4 px-4">
          
          {/* Section A: Notifications */}
          <section>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 pl-1">Готово к выдаче</h3>
              <div className="space-y-2">
                  {(MOCK_WAITER_NOTIFICATIONS || []).map(notif => (
                      <div key={notif.id} className={`p-4 rounded-xl border-l-4 shadow-lg flex items-center justify-between ${notif.type === 'kitchen_ready' ? 'bg-[#1c1c1e] border-orange-500' : 'bg-[#1c1c1e] border-blue-500'}`}>
                          <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif.type === 'kitchen_ready' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                  <span className="material-icons-round">{notif.type === 'kitchen_ready' ? 'restaurant' : 'local_bar'}</span>
                              </div>
                              <div>
                                  <h4 className="text-sm font-bold text-white leading-none">{notif.tableLabel}</h4>
                                  <p className="text-xs text-white/60 mt-1">{notif.message}</p>
                              </div>
                          </div>
                          <button className="px-3 py-2 bg-white/10 rounded-lg text-xs font-bold uppercase hover:bg-white/20 transition-colors">Забрать</button>
                      </div>
                  ))}
              </div>
          </section>

          {/* Section B: My Tables (Sorted) */}
          <section>
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 pl-1">Мои столы (По приоритету)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {myTables.map(table => (
                      <div 
                        key={table.id} 
                        onClick={() => { 
                            onSelectTable(table); 
                            if (table.status === 'alert') onRequestPayment(table); 
                        }}
                        className={`p-3 rounded-xl border flex flex-col justify-between h-32 cursor-pointer relative overflow-hidden ${table.status === 'alert' ? 'bg-yellow-900/20 border-yellow-500/50' : 'bg-[#1c1c1e] border-white/10'}`}
                      >
                          <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                  <span className="text-2xl font-mono font-bold text-white">{table.label}</span>
                                  {table.lifecycle === 'paying' && <span className="text-[10px] bg-green-500 text-black px-1.5 rounded font-bold uppercase">Оплата</span>}
                              </div>
                              {table.status === 'alert' && <span className="material-icons-round text-yellow-500 animate-bounce">notifications</span>}
                          </div>
                          
                          <div className="mt-2">
                              {table.lifecycle === 'ordered' && <button className="w-full py-1.5 bg-orange-500/20 border border-orange-500/50 text-orange-500 text-[10px] font-bold uppercase rounded hover:bg-orange-500 hover:text-white transition-colors">🔥 Fire Mains</button>}
                              {table.lifecycle === 'seated' && <p className="text-[10px] text-white/40 italic">Смотрят меню...</p>}
                          </div>

                          <div className="mt-auto pt-2 border-t border-white/5 flex justify-between items-end">
                              <p className="text-xs text-white/50">{table.currentBill?.toLocaleString()} ₽</p>
                              <span className="text-[10px] font-mono text-white/30">{table.durationMin} мин</span>
                          </div>
                      </div>
                  ))}
              </div>
          </section>
      </div>
  );
};
