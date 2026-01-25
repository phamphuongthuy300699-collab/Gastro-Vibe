
import React, { useState } from 'react';
import { MOCK_KITCHEN_TICKETS } from '../../constants';
import { KitchenTicketItem } from '../../types';

export const AdminKitchenView: React.FC = () => {
  const [kdsStationFilter, setKdsStationFilter] = useState<'all' | 'kitchen' | 'bar'>('all');

  // 1. Filter Tickets
  const filteredTickets = (MOCK_KITCHEN_TICKETS || []).filter(t => {
      if (kdsStationFilter === 'all') return true;
      return t.items.some(i => i.station === kdsStationFilter);
  });

  // 2. Calculate All Day Counts
  const allDayCounts = filteredTickets.reduce((acc, ticket) => {
      ticket.items.forEach(item => {
          if (kdsStationFilter === 'all' || item.station === kdsStationFilter) {
              acc[item.name] = (acc[item.name] || 0) + item.qty;
          }
      });
      return acc;
  }, {} as Record<string, number>);

  const topItems = Object.entries(allDayCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const renderItemGroup = (items: KitchenTicketItem[], title?: string) => {
       if (items.length === 0) return null;
       return (
           <div className="mb-2 last:mb-0">
               {title && <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1 border-b border-white/5">{title}</div>}
               {items.map((item, idx) => (
                   <div key={idx} className="flex gap-2 items-start py-1">
                       <span className="text-lg font-bold text-primary font-mono leading-none pt-0.5">{item.qty}</span>
                       <div className="leading-tight">
                           <span className="text-sm font-bold text-white block">{item.name}</span>
                           {item.mods.length > 0 && (
                               <span className="text-xs text-orange-400 font-bold block mt-0.5">{item.mods.join(', ').toUpperCase()}</span>
                           )}
                       </div>
                   </div>
               ))}
           </div>
       );
   };

  return (
      <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0 px-4 pb-4">
           {/* Left Sidebar (Responsive: Top on Mobile, Left on Desktop) */}
           <div className="w-full lg:w-56 bg-[#1c1c1e] rounded-xl border border-white/10 p-4 flex flex-col shrink-0 lg:h-full max-h-48 lg:max-h-full overflow-hidden">
               <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex justify-between items-center">
                   <span>В работе (Всего)</span>
                   <span className="lg:hidden text-[10px] bg-white/10 px-2 rounded">{filteredTickets.length} билетов</span>
               </h3>
               
               <div className="flex lg:flex-col gap-4 lg:gap-0 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:space-y-3 pb-2 lg:pb-0">
                   {topItems.map(([name, count]) => (
                       <div key={name} className="flex justify-between items-center lg:border-b border-white/5 pb-2 min-w-[120px] lg:min-w-0 bg-white/5 lg:bg-transparent p-2 lg:p-0 rounded lg:rounded-none">
                           <span className="text-xs font-bold text-white/80 lg:line-clamp-1">{name}</span>
                           <span className="text-lg font-mono font-bold text-primary ml-2">{count}</span>
                       </div>
                   ))}
               </div>
               
               {/* Filters Desktop */}
               <div className="mt-auto pt-4 hidden lg:flex flex-col gap-2">
                   <button onClick={() => setKdsStationFilter('all')} className={`w-full py-2 rounded text-[10px] font-bold uppercase border ${kdsStationFilter === 'all' ? 'bg-white text-black border-white' : 'text-white/40 border-white/10'}`}>Все цеха</button>
                   <button onClick={() => setKdsStationFilter('kitchen')} className={`w-full py-2 rounded text-[10px] font-bold uppercase border ${kdsStationFilter === 'kitchen' ? 'bg-orange-500 text-white border-orange-500' : 'text-white/40 border-white/10'}`}>Кухня</button>
                   <button onClick={() => setKdsStationFilter('bar')} className={`w-full py-2 rounded text-[10px] font-bold uppercase border ${kdsStationFilter === 'bar' ? 'bg-blue-500 text-white border-blue-500' : 'text-white/40 border-white/10'}`}>Бар</button>
               </div>
           </div>

           {/* Mobile Filter Tabs */}
           <div className="flex lg:hidden gap-2 shrink-0">
               <button onClick={() => setKdsStationFilter('all')} className={`flex-1 py-2 rounded text-[10px] font-bold uppercase border ${kdsStationFilter === 'all' ? 'bg-white text-black border-white' : 'text-white/40 border-white/10'}`}>Все</button>
               <button onClick={() => setKdsStationFilter('kitchen')} className={`flex-1 py-2 rounded text-[10px] font-bold uppercase border ${kdsStationFilter === 'kitchen' ? 'bg-orange-500 text-white border-orange-500' : 'text-white/40 border-white/10'}`}>Кухня</button>
               <button onClick={() => setKdsStationFilter('bar')} className={`flex-1 py-2 rounded text-[10px] font-bold uppercase border ${kdsStationFilter === 'bar' ? 'bg-blue-500 text-white border-blue-500' : 'text-white/40 border-white/10'}`}>Бар</button>
           </div>

           {/* Right Grid: Tickets */}
           <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 content-start">
               {filteredTickets.map(ticket => {
                   let headerColor = 'bg-status-green';
                   if (ticket.elapsedMin > 10) headerColor = 'bg-yellow-500';
                   if (ticket.elapsedMin > 20) headerColor = 'bg-red-500 animate-pulse';

                   // Group Items by Course
                   const starters = ticket.items.filter(i => i.course === 'starter');
                   const mains = ticket.items.filter(i => i.course === 'main');
                   const others = ticket.items.filter(i => !['starter', 'main'].includes(i.course));

                   return (
                       <div key={ticket.id} className="bg-[#1c1c1e] rounded-xl overflow-hidden border border-white/10 flex flex-col h-full shadow-lg min-h-[300px]">
                           <div className={`${headerColor} p-2 flex justify-between items-center text-black`}>
                               <span className="font-mono font-bold text-lg">#{ticket.tableLabel}</span>
                               <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                                   <span className="material-icons-round text-sm">schedule</span>
                                   <span className="font-mono font-bold text-sm">{ticket.elapsedMin} мин</span>
                               </div>
                           </div>
                           
                           <div className="p-3 flex-1 overflow-y-auto">
                               {renderItemGroup(starters, 'Закуски')}
                               {renderItemGroup(mains, 'Горячее')}
                               {renderItemGroup(others, 'Напитки / Десерты')}
                           </div>

                           <div className="p-2 bg-[#2c2c2e] border-t border-white/5 flex justify-between items-center shrink-0">
                               <span className="text-[9px] text-white/30 font-bold uppercase">Оф: {ticket.serverName}</span>
                               <button className="px-4 py-2 bg-white/10 hover:bg-green-600 rounded text-[10px] font-bold uppercase transition-colors">Готово</button>
                           </div>
                       </div>
                   )
               })}
           </div>
      </div>
  );
};
