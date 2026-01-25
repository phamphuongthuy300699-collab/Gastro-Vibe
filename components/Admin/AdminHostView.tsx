
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_WALLS_HALL, MOCK_WALLS_TERRACE } from '../../constants';
import { AdminTable, ZoneId, Wall } from '../../types';

interface AdminHostViewProps {
    onSelectTable: (table: AdminTable) => void;
    tables: AdminTable[]; // Added this prop
}

// Mock Data for Timeline (Real app would fetch this based on selectedDate)
const MOCK_RESERVATIONS = [
    { id: 'r1', time: '18:00', duration: 120, tableId: 't2', label: '2', name: 'Смирнов', guests: 2, status: 'confirmed' },
    { id: 'r2', time: '18:30', duration: 90, tableId: 'tr2', label: 'T2', name: 'Петрова', guests: 4, status: 'confirmed' },
    { id: 'r3', time: '19:00', duration: 120, tableId: 't3', label: '3', name: 'Сидоров', guests: 2, status: 'pending' },
    { id: 'r4', time: '20:00', duration: 180, tableId: 't6', label: '6', name: 'День Рождения', guests: 8, status: 'confirmed' },
    { id: 'r5', time: '21:00', duration: 60, tableId: 't2', label: '2', name: 'Анна К.', guests: 2, status: 'confirmed' },
];

export const AdminHostView: React.FC<AdminHostViewProps> = ({ onSelectTable, tables }) => {
  const [activeZone, setActiveZone] = useState<ZoneId>('hall');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Mobile UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNewResModal, setShowNewResModal] = useState(false);

  // New Reservation Form State
  const [newResForm, setNewResForm] = useState({
      name: '',
      phone: '',
      guests: 2,
      time: '19:00',
      tableId: '',
      duration: 90
  });

  const currentTables = (tables || []).filter(t => t.zoneId === activeZone);
  const currentWalls = activeZone === 'hall' ? (MOCK_WALLS_HALL || []) : (MOCK_WALLS_TERRACE || []);
  const bgTexture = activeZone === 'hall' 
        ? "url('https://www.transparenttextures.com/patterns/dark-matter.png')" 
        : "url('https://www.transparenttextures.com/patterns/wood-pattern.png')";

  // --- Helpers ---

  const formatDate = (date: Date) => {
      return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' });
  };

  const shiftDate = (days: number) => {
      const next = new Date(selectedDate);
      next.setDate(selectedDate.getDate() + days);
      setSelectedDate(next);
  };

  // Convert "18:30" to minutes from start of day (00:00)
  const timeToMinutes = (timeStr: string) => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
  };

  // --- Rendering Map Elements ---

  const renderWalls = (walls: Wall[]) => {
      if (!walls) return null;
      return walls.map((w, i) => (
          <div 
            key={i}
            className={`absolute flex items-center justify-center ${w.type === 'window' ? 'bg-blue-300/20 border-blue-300/30' : 'bg-stone-700'}`}
            style={{
                left: `${w.x}%`, top: `${w.y}%`, width: `${w.w}%`, height: `${w.h}%`,
                border: w.type === 'window' ? '1px solid rgba(147, 197, 253, 0.3)' : undefined
            }}
          >
              {w.type === 'entrance' && <span className="text-[8px] text-white/30 uppercase tracking-widest -rotate-90">Вход</span>}
              {w.type === 'wc' && <span className="material-icons-round text-white/30 text-xs">wc</span>}
              {w.type === 'bar' && <span className="material-icons-round text-white/30 text-xs">local_bar</span>}
          </div>
      ));
  };

  const renderChair = (pos: 'top'|'bottom'|'left'|'right', idx: number) => {
      const styles: any = { position: 'absolute', width: '12px', height: '12px', background: '#3f3f46', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' };
      if (pos === 'top') { styles.top = '-14px'; styles.left = '50%'; styles.transform = 'translateX(-50%)'; }
      if (pos === 'bottom') { styles.bottom = '-14px'; styles.left = '50%'; styles.transform = 'translateX(-50%)'; }
      if (pos === 'left') { styles.left = '-14px'; styles.top = '50%'; styles.transform = 'translateY(-50%)'; }
      if (pos === 'right') { styles.right = '-14px'; styles.top = '50%'; styles.transform = 'translateY(-50%)'; }
      return <div key={idx} style={styles}></div>;
  };

  const getLifecycleColor = (status: string, lifecycle?: string) => {
      if (status === 'free') return 'border-status-green/40';
      if (status === 'alert') return 'border-yellow-400';
      if (status === 'reserved') return 'border-purple-400/40';
      
      switch(lifecycle) {
          case 'seated': return 'border-blue-400';
          case 'ordered': return 'border-orange-400';
          case 'waiting_food': return 'border-orange-500 animate-pulse';
          case 'eating': return 'border-red-500';
          case 'paying': return 'border-green-400';
          case 'cleaning': return 'border-gray-500 bg-gray-700/50';
          default: return 'border-white/20';
      }
  };

  // --- Render Functions ---

  const renderMap = () => (
    <div className="flex-1 relative bg-[#121212] rounded-2xl overflow-hidden shadow-2xl border border-white/5 mx-4 mb-4">
        {/* Floor Texture */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: bgTexture }}></div>
        
        {/* Walls Layer */}
        {renderWalls(currentWalls)}

        {/* Tables Layer */}
        <div className="absolute inset-0 m-4"> 
            {currentTables.map((table) => (
                <motion.div
                    key={table.id}
                    layoutId={`table-${table.id}`}
                    onClick={() => onSelectTable(table)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`absolute flex flex-col items-center justify-center cursor-pointer shadow-lg border-2 transition-colors duration-500 z-10 bg-[#2c2c2e]
                        ${getLifecycleColor(table.status, table.lifecycle)}
                        ${table.status === 'alert' ? 'animate-pulse shadow-[0_0_15px_rgba(250,204,21,0.3)]' : ''}
                        ${table.status === 'reserved' ? 'opacity-70 border-dashed' : ''}
                        ${table.shape === 'round' ? 'rounded-full' : 'rounded-lg'}
                    `}
                    style={{
                        left: `${table.x}%`, top: `${table.y}%`,
                        width: `${table.width}px`, height: `${table.height}px`,
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    {/* Chairs */}
                    {table.chairs?.map((pos, idx) => renderChair(pos, idx))}

                    {/* Label */}
                    <span className={`font-mono font-bold text-lg leading-none ${table.status === 'alert' ? 'text-yellow-400' : 'text-white'}`}>
                        {table.label}
                    </span>

                    {/* Ghost Reservation Indicator */}
                    {table.status === 'free' && table.nextReservation && (
                        <div className="absolute -bottom-6 bg-purple-900/80 text-purple-200 text-[8px] px-1 rounded whitespace-nowrap border border-purple-500/30">
                            Резерв {table.nextReservation}
                        </div>
                    )}
                    
                    {/* Meta Info (Busy Only) */}
                    {table.status === 'busy' && (
                        <div className="mt-1 flex flex-col items-center">
                             {table.lifecycle === 'cleaning' ? (
                                <span className="text-[8px] text-white/50 uppercase">Клининг</span>
                             ) : (
                                <span className="text-[8px] text-white/50 font-mono tracking-tighter">{table.durationMin ?? 0} мин</span>
                             )}
                        </div>
                    )}

                    {/* Status Icon */}
                    {table.status === 'alert' && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[8px] font-bold px-1 rounded shadow animate-bounce">!</div>
                    )}
                </motion.div>
            ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-10 flex gap-2 bg-black/80 backdrop-blur px-3 py-2 rounded-lg border border-white/5 flex-wrap max-w-[200px]">
            <div className="flex items-center gap-1.5 mr-2"><div className="w-2 h-2 rounded-full bg-status-green"></div><span className="text-[8px] text-white/60 uppercase">Своб</span></div>
            <div className="flex items-center gap-1.5 mr-2"><div className="w-2 h-2 rounded-full bg-blue-400"></div><span className="text-[8px] text-white/60 uppercase">Меню</span></div>
            <div className="flex items-center gap-1.5 mr-2"><div className="w-2 h-2 rounded-full bg-orange-400"></div><span className="text-[8px] text-white/60 uppercase">Ждут</span></div>
            <div className="flex items-center gap-1.5 mr-2"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[8px] text-white/60 uppercase">Едят</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400"></div><span className="text-[8px] text-white/60 uppercase">Оплата</span></div>
        </div>
    </div>
  );

  const renderTimelineSidebar = () => (
    <div className="flex flex-col h-full bg-[#1c1c1e] border-l border-white/10 shadow-2xl relative">
        {/* Date Header */}
        <div className="p-4 border-b border-white/5 bg-[#2c2c2e]">
            <div className="flex justify-between items-center mb-2">
                 <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Бронирование</h3>
                 <button className="lg:hidden p-1 text-white/50" onClick={() => setIsSidebarOpen(false)}>
                     <span className="material-icons-round">close</span>
                 </button>
            </div>
            <div className="flex items-center justify-between bg-black/30 p-2 rounded-lg border border-white/5 relative group">
                <button onClick={() => shiftDate(-1)} className="text-white/50 hover:text-white p-1"><span className="material-icons-round text-sm">chevron_left</span></button>
                
                {/* Date Display & Hidden Input */}
                <div className="text-center relative">
                    <span className="text-sm font-bold text-white capitalize block cursor-pointer">{formatDate(selectedDate)}</span>
                    <input 
                        type="date" 
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        onChange={(e) => e.target.valueAsDate && setSelectedDate(e.target.valueAsDate)}
                    />
                </div>
                
                <button onClick={() => shiftDate(1)} className="text-white/50 hover:text-white p-1"><span className="material-icons-round text-sm">chevron_right</span></button>
            </div>
            <button onClick={() => setSelectedDate(new Date())} className="w-full mt-2 text-[10px] text-primary font-bold uppercase tracking-widest hover:underline">Сегодня</button>
        </div>

        {/* Timeline List */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-2">
            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-[3.5rem] top-0 bottom-0 w-[1px] bg-white/10"></div>

                {MOCK_RESERVATIONS.map((res, i) => (
                    <div key={res.id} className="flex group mb-6 relative">
                        {/* Time Column */}
                        <div className="w-14 text-right pr-4 pt-1">
                            <span className="text-xs font-mono font-bold text-white/60">{res.time}</span>
                        </div>
                        
                        {/* Connector Dot */}
                        <div className="absolute left-[3.35rem] top-2 w-1.5 h-1.5 rounded-full bg-primary ring-4 ring-[#1c1c1e]"></div>

                        {/* Card */}
                        <div className="flex-1 bg-[#2c2c2e] p-3 rounded-xl border border-white/5 hover:border-primary/30 transition-colors shadow-lg ml-2 cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="text-sm font-bold text-white">{res.name}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[10px] bg-white/10 px-1.5 rounded text-white/70 flex items-center gap-1">
                                            <span className="material-icons-round text-[10px]">people</span> {res.guests}
                                        </span>
                                        <span className={`text-[10px] px-1.5 rounded font-bold uppercase ${res.status === 'confirmed' ? 'text-green-400 bg-green-400/10' : 'text-orange-400 bg-orange-400/10'}`}>
                                            {res.status === 'confirmed' ? 'Подтв.' : 'Ожидание'}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-black/40 flex items-center justify-center border border-white/5">
                                    <span className="text-sm font-mono font-bold text-primary">{res.label}</span>
                                </div>
                            </div>
                            
                            <div className="flex gap-2 border-t border-white/5 pt-2 mt-1">
                                <button className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded text-[10px] font-bold uppercase tracking-wider text-white/60 flex items-center justify-center gap-1 transition-colors">
                                    <span className="material-icons-round text-[12px]">phone</span>
                                    Звонок
                                </button>
                                <button className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded text-[10px] font-bold uppercase tracking-wider text-white/60 flex items-center justify-center gap-1 transition-colors">
                                    <span className="material-icons-round text-[12px]">edit</span>
                                    Изм.
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add Button */}
                <button 
                    onClick={() => { setShowNewResModal(true); setIsSidebarOpen(false); }}
                    className="ml-16 mt-4 w-[calc(100%-4rem)] py-3 border border-dashed border-white/20 rounded-xl text-white/40 text-xs font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                >
                    <span className="material-icons-round">add</span>
                    Новая бронь
                </button>
            </div>
        </div>
    </div>
  );

  const renderNewReservationModal = () => {
      // Timeline constants
      const startHour = 12; 
      const endHour = 24;
      const totalHours = endHour - startHour;
      
      return (
        <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <motion.div 
                initial={{ scale: 0.95 }} animate={{ scale: 1 }}
                className="bg-[#1c1c1e] w-full max-w-2xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Modal Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#2c2c2e]">
                    <h2 className="text-lg font-bold text-white uppercase tracking-widest">Новая бронь</h2>
                    <button onClick={() => setShowNewResModal(false)} className="text-white/50 hover:text-white">
                        <span className="material-icons-round">close</span>
                    </button>
                </div>

                {/* Form Inputs */}
                <div className="p-6 grid grid-cols-2 gap-4 shrink-0">
                    <div>
                        <label className="text-[10px] text-white/40 font-bold uppercase block mb-1">Дата</label>
                        <input 
                            type="date" 
                            value={selectedDate.toISOString().split('T')[0]} 
                            onChange={(e) => e.target.valueAsDate && setSelectedDate(e.target.valueAsDate)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-white/40 font-bold uppercase block mb-1">Гостей</label>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setNewResForm({...newResForm, guests: Math.max(1, newResForm.guests - 1)})} className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white">-</button>
                            <span className="flex-1 text-center font-bold text-white">{newResForm.guests}</span>
                            <button onClick={() => setNewResForm({...newResForm, guests: newResForm.guests + 1})} className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-white">+</button>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-white/40 font-bold uppercase block mb-1">Имя</label>
                        <input 
                            type="text" 
                            value={newResForm.name} 
                            onChange={(e) => setNewResForm({...newResForm, name: e.target.value})}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-primary outline-none"
                            placeholder="Имя гостя"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-white/40 font-bold uppercase block mb-1">Телефон</label>
                        <input 
                            type="tel" 
                            value={newResForm.phone} 
                            onChange={(e) => setNewResForm({...newResForm, phone: e.target.value})}
                            className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-sm focus:border-primary outline-none"
                            placeholder="+7..."
                        />
                    </div>
                </div>

                {/* VISUAL TIMELINE (Table Availability) */}
                <div className="flex-1 overflow-y-auto border-t border-white/5 bg-[#121212] relative">
                    <div className="sticky top-0 z-10 bg-[#121212] border-b border-white/5 flex text-[9px] text-white/40 font-mono pl-16 pr-4 py-2">
                        {Array.from({length: totalHours + 1}).map((_, i) => (
                             <div key={i} className="flex-1 text-center border-l border-white/5 h-4 -ml-[1px]">{startHour + i}</div>
                        ))}
                    </div>

                    <div className="p-4 pt-0">
                        {tables.filter(t => t.zoneId === activeZone).map(table => {
                            // Find reservations for this table
                            const tableRes = MOCK_RESERVATIONS.filter(r => r.tableId === table.id);

                            return (
                                <div 
                                    key={table.id} 
                                    onClick={() => setNewResForm({...newResForm, tableId: table.id})}
                                    className={`flex items-center h-12 mb-2 rounded-lg cursor-pointer transition-colors border ${newResForm.tableId === table.id ? 'bg-primary/10 border-primary' : 'hover:bg-white/5 border-transparent'}`}
                                >
                                    {/* Table Label */}
                                    <div className="w-16 shrink-0 flex flex-col items-center justify-center border-r border-white/5 h-full">
                                        <span className={`font-bold font-mono ${newResForm.tableId === table.id ? 'text-primary' : 'text-white'}`}>{table.label}</span>
                                        <span className="text-[8px] text-white/30">{table.chairs?.length} чел</span>
                                    </div>

                                    {/* Timeline Bar */}
                                    <div 
                                        className="flex-1 relative h-full mx-2"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            const x = e.clientX - rect.left;
                                            const width = rect.width;
                                            const minutes = Math.round(((x / width) * (totalHours * 60) + (startHour * 60)) / 15) * 15;
                                            const h = Math.floor(minutes / 60);
                                            const m = minutes % 60;
                                            const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                                            setNewResForm(prev => ({...prev, tableId: table.id, time}));
                                        }}
                                    >
                                        {/* Grid Lines */}
                                        <div className="absolute inset-0 flex pointer-events-none">
                                            {Array.from({length: totalHours}).map((_, i) => (
                                                <div key={i} className="flex-1 border-r border-white/5"></div>
                                            ))}
                                        </div>

                                        {/* Reservations Blocks */}
                                        {tableRes.map(res => {
                                            const startMin = timeToMinutes(res.time) - (startHour * 60);
                                            const startPct = (startMin / (totalHours * 60)) * 100;
                                            const widthPct = (res.duration / (totalHours * 60)) * 100;

                                            return (
                                                <div 
                                                    key={res.id}
                                                    className="absolute top-2 bottom-2 bg-red-500/30 border border-red-500 rounded flex items-center px-1 overflow-hidden whitespace-nowrap z-10 pointer-events-none"
                                                    style={{ left: `${startPct}%`, width: `${widthPct}%` }}
                                                >
                                                    <span className="text-[8px] text-white font-bold">{res.time}</span>
                                                </div>
                                            )
                                        })}
                                        
                                        {/* Current Selection Visual */}
                                        {newResForm.tableId === table.id && (
                                             <div 
                                                className="absolute top-1 bottom-1 bg-primary/20 border border-dashed border-primary rounded z-20 flex items-center justify-center pointer-events-none"
                                                style={{ 
                                                    left: `${((timeToMinutes(newResForm.time) - (startHour * 60)) / (totalHours * 60)) * 100}%`, 
                                                    width: `${(newResForm.duration / (totalHours * 60)) * 100}%` 
                                                }}
                                             >
                                                 <span className="text-[9px] text-primary font-bold">{newResForm.time}</span>
                                             </div>
                                        )}

                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-white/5 bg-[#2c2c2e] shrink-0 flex justify-between items-center">
                     <div>
                         <span className="block text-[10px] text-white/40 uppercase font-bold">Выбрано</span>
                         <div className="text-white text-sm font-bold">
                             {newResForm.tableId ? `Стол ${tables.find(t => t.id === newResForm.tableId)?.label}` : 'Выберите стол'} 
                             <span className="mx-2 text-white/30">|</span> 
                             {newResForm.time}
                         </div>
                     </div>
                     <button 
                        disabled={!newResForm.tableId}
                        onClick={() => setShowNewResModal(false)}
                        className="bg-primary text-black px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                    >
                         Создать
                     </button>
                </div>
            </motion.div>
        </motion.div>
      );
  }

  return (
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative h-full">
          
          {/* LEFT: MAP AREA (Takes full space on mobile, flex-1 on desktop) */}
          <div className="flex-1 flex flex-col min-h-0 relative">
                {/* Zone Tabs */}
                <div className="flex gap-2 mb-3 shrink-0 px-4">
                    <button onClick={() => setActiveZone('hall')} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${activeZone === 'hall' ? 'bg-primary text-black border-primary' : 'bg-[#1c1c1e] text-white/50 border-white/10'}`}>Основной Зал</button>
                    <button onClick={() => setActiveZone('terrace')} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${activeZone === 'terrace' ? 'bg-primary text-black border-primary' : 'bg-[#1c1c1e] text-white/50 border-white/10'}`}>Летняя Терраса</button>
                </div>

                {renderMap()}
          </div>

          {/* MOBILE TOGGLE FAB */}
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden absolute bottom-6 right-6 w-14 h-14 bg-primary text-black rounded-full shadow-2xl z-30 flex items-center justify-center border border-white/20 active:scale-95 transition-transform"
          >
              <span className="material-icons-round text-2xl">calendar_today</span>
          </button>

          {/* RIGHT: RESERVATION TIMELINE SIDEBAR */}
          {/* Mobile: Drawer / Desktop: Static */}
          <AnimatePresence>
            {(isSidebarOpen || window.innerWidth >= 1024) && (
                <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`fixed inset-y-0 right-0 w-80 lg:relative lg:w-80 lg:transform-none z-40 lg:z-auto ${isSidebarOpen ? 'shadow-2xl' : ''} ${window.innerWidth >= 1024 ? '!translate-x-0' : ''}`}
                >
                   {renderTimelineSidebar()}
                </motion.div>
            )}
          </AnimatePresence>
          
          {/* Backdrop for Mobile Drawer */}
          {isSidebarOpen && (
              <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>
          )}

          {/* NEW RESERVATION MODAL */}
          <AnimatePresence>
              {showNewResModal && renderNewReservationModal()}
          </AnimatePresence>

      </div>
  );
};
