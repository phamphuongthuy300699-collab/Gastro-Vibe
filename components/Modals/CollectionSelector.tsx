
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/GameContext';
import { Dish } from '../../types';

export const CollectionSelector: React.FC = () => {
  const { activeCollection, openCollection, addToOrder, menuItems } = useGameStore();
  // Map of course index -> selected dish ID (or slug)
  const [selections, setSelections] = useState<Record<number, string>>({});
  const [swappingCourseIndex, setSwappingCourseIndex] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (activeCollection) {
      const initialSelections: Record<number, string> = {};
      activeCollection.courses.forEach((course, index) => {
        initialSelections[index] = course.defaultDishId;
      });
      setSelections(initialSelections);
      setSwappingCourseIndex(null);
      setQuantity(1);
    }
  }, [activeCollection]);

  if (!activeCollection) return null;

  // Helper to find a dish by either its Real ID (UUID) or its Slug (Text ID)
  const findDish = (identifier: string): Dish | undefined => {
      return menuItems.find(d => d.id === identifier || d.slug === identifier);
  };

  const handleSwap = (courseIndex: number, dishId: string) => {
      setSelections(prev => ({ ...prev, [courseIndex]: dishId }));
      setSwappingCourseIndex(null);
  };

  const handleAddSet = () => {
      // Add each item in the selection to order, multiplied by set quantity
      Object.values(selections).forEach((dishIdentifier) => {
          // We pass the identifier, addToOrder will perform the robust lookup again
          addToOrder({ dishId: dishIdentifier as string, quantity: quantity });
      });
      openCollection(null);
  };

  // CORRECTED MATH: Calculate base price + deltas for upgrades
  const calculateTotalPrice = () => {
     let unitPrice = activeCollection.price;

     activeCollection.courses.forEach((course, index) => {
         const selectedId = selections[index];
         
         // Only calculate delta if selection changed from default
         if (selectedId !== course.defaultDishId) {
             const defaultDish = findDish(course.defaultDishId);
             const selectedDish = findDish(selectedId);

             // If both exist, add the difference. 
             // Example: Default 300, Selected 500 -> Delta +200. Total = Base + 200.
             if (defaultDish && selectedDish) {
                 unitPrice += (selectedDish.price - defaultDish.price);
             }
         }
     });

     return unitPrice * quantity;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-end justify-center pointer-events-none">
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => openCollection(null)}
            className="absolute inset-0 bg-black/50 backdrop-blur-[2px] pointer-events-auto"
        />

        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full h-[95vh] bg-background-light rounded-t-2xl overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
        >
             {/* Header */}
             <div className="relative h-56 shrink-0 z-10 group">
                 <div className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" style={{ backgroundImage: `url('${activeCollection.imageUrl}')` }}></div>
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                 
                 <button 
                    onClick={() => openCollection(null)} 
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-colors"
                 >
                    <span className="material-symbols-outlined text-[24px]">close</span>
                 </button>
                 
                 <div className="absolute bottom-6 left-6 right-6">
                     <span className="inline-block bg-primary/90 text-white text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-3 backdrop-blur-sm">Сет Меню</span>
                     <h2 className="text-4xl font-serif text-white italic drop-shadow-md leading-none">{activeCollection.title}</h2>
                 </div>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto px-6 py-6 relative z-10 no-scrollbar pb-36 bg-background-light">
                 <p className="text-text-main/70 text-base mb-8 leading-relaxed font-serif italic border-l-2 border-primary/20 pl-4">
                    "{activeCollection.description}"
                 </p>

                 <div className="space-y-6">
                     {activeCollection.courses.map((course, index) => {
                         const selectedDishId = selections[index];
                         const selectedDish = findDish(selectedDishId);
                         
                         // Combine default + options into one list for swapping so user can go back to default
                         const availableOptions = Array.from(new Set([course.defaultDishId, ...course.options]));

                         // Fallback UI if dish is missing in DB
                         if (!selectedDish) {
                             return (
                                 <div key={index} className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                                     <span className="material-icons-round text-red-400">error_outline</span>
                                     <div className="text-xs text-red-400">
                                         <span className="font-bold block uppercase">Блюдо недоступно</span>
                                         Код: "{selectedDishId}"
                                     </div>
                                 </div>
                             )
                         }

                         return (
                             <div key={index} className="bg-white border border-[#F0EAE5] rounded-xl p-4 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
                                 <div className="flex justify-between items-center mb-4">
                                     <span className="text-[10px] font-bold text-text-main/40 uppercase tracking-widest">{course.courseName}</span>
                                     {availableOptions.length > 1 && (
                                         <button 
                                            onClick={() => setSwappingCourseIndex(swappingCourseIndex === index ? null : index)}
                                            className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 px-2 py-1 rounded transition-colors ${swappingCourseIndex === index ? 'text-primary bg-primary/10' : 'text-primary hover:bg-primary/5'}`}
                                         >
                                             <span className="material-icons-round text-[14px]">swap_horiz</span>
                                             {swappingCourseIndex === index ? 'Скрыть' : 'Заменить'}
                                         </button>
                                     )}
                                 </div>
                                 
                                 <div className="flex gap-4 items-center">
                                     <div className="w-20 h-20 rounded-lg bg-cover bg-center shrink-0 shadow-inner" style={{ backgroundImage: `url('${selectedDish.imageUrl}')` }}></div>
                                     <div className="flex-1 min-w-0">
                                         <h4 className="text-text-main font-serif text-xl font-medium leading-tight mb-1 truncate">{selectedDish.name}</h4>
                                         <p className="text-xs text-text-main/50 line-clamp-2 leading-relaxed">{selectedDish.description}</p>
                                     </div>
                                 </div>

                                 {/* Swap Selection Area (Inline Expansion) */}
                                 <AnimatePresence>
                                     {swappingCourseIndex === index && (
                                         <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden border-t border-dashed border-gray-200 mt-4 pt-4"
                                         >
                                             <p className="text-[10px] text-text-main/40 uppercase tracking-wider mb-3 font-bold">Выберите вариант:</p>
                                             <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                                                 {availableOptions.map(optId => {
                                                     const optDish = findDish(optId);
                                                     if (!optDish) return null;
                                                     const isSelected = selectedDishId === optId;
                                                     
                                                     // Price Delta Logic
                                                     const defaultDish = findDish(course.defaultDishId);
                                                     let priceBadge = null;
                                                     if (defaultDish) {
                                                         const delta = optDish.price - defaultDish.price;
                                                         if (delta > 0) priceBadge = `+${delta} ₽`;
                                                         // We can optionally show negative deltas if needed
                                                         // else if (delta < 0) priceBadge = `${delta} ₽`;
                                                     }

                                                     return (
                                                         <div 
                                                            key={optId} 
                                                            onClick={() => handleSwap(index, optId)}
                                                            className={`shrink-0 w-32 cursor-pointer rounded-xl border-2 transition-all overflow-hidden relative group ${isSelected ? 'border-primary shadow-md scale-[1.02]' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                                                         >
                                                             <div className="h-24 w-full bg-cover bg-center relative" style={{ backgroundImage: `url('${optDish.imageUrl}')` }}>
                                                                 {priceBadge && (
                                                                     <div className="absolute top-1 right-1 bg-black/70 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                                                         {priceBadge}
                                                                     </div>
                                                                 )}
                                                             </div>
                                                             <div className={`p-3 ${isSelected ? 'bg-primary text-white' : 'bg-transparent text-text-main'}`}>
                                                                 <p className="text-[10px] font-bold leading-tight line-clamp-2">{optDish.name}</p>
                                                             </div>
                                                         </div>
                                                     )
                                                 })}
                                             </div>
                                         </motion.div>
                                     )}
                                 </AnimatePresence>
                             </div>
                         );
                     })}
                 </div>
             </div>

             {/* Footer */}
             <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-[#F0EAE5] px-6 py-6 z-30 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                 <div className="flex items-center gap-4">
                     {/* Quantity Control */}
                     <div className="flex items-center bg-gray-100 rounded-xl h-14 px-2 shrink-0">
                        <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-full flex items-center justify-center text-text-main/50 hover:text-text-main active:scale-90 transition-transform"
                        >
                            <span className="material-icons-round text-xl">remove</span>
                        </button>
                        <span className="w-8 text-center font-bold text-lg text-text-main tabular-nums">{quantity}</span>
                        <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-full flex items-center justify-center text-text-main/50 hover:text-text-main active:scale-90 transition-transform"
                        >
                            <span className="material-icons-round text-xl">add</span>
                        </button>
                    </div>

                     <button 
                        onClick={handleAddSet}
                        className="flex-1 bg-text-main text-white hover:bg-primary transition-all duration-300 font-bold text-sm uppercase tracking-[0.15em] h-14 rounded-xl flex items-center justify-between px-6 shadow-lg active:scale-[0.98]"
                     >
                         <span>В корзину</span>
                         <span className="font-serif italic text-xl">{calculateTotalPrice().toLocaleString()} ₽</span>
                     </button>
                 </div>
             </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
