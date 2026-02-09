
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/GameContext';
import { DishVariant, DishModifier } from '../../types';
import { DEFAULT_MENU_ITEMS } from '../../constants';

export const ProductSheet: React.FC = () => {
  const { selectedDish, openProduct, addToOrder, removeFromOrder, favorites, toggleFavorite, menuItems, orderItems, myParticipantId } = useGameStore();
  
  // States
  const [quantity, setQuantity] = useState(1);
  const [modifiers, setModifiers] = useState<Set<string>>(new Set());
  const [excludedIngredients, setExcludedIngredients] = useState<Set<string>>(new Set());
  
  // New: Drink specific states
  const [selectedVariant, setSelectedVariant] = useState<DishVariant | null>(null);
  const [showMacros, setShowMacros] = useState(false);

  // New: Local state for Cross-Sells (Pending additions)
  const [pendingRelated, setPendingRelated] = useState<Record<string, number>>({});

  // Visual feedback state for quick add buttons
  const [addedFeedbackIds, setAddedFeedbackIds] = useState<Set<string>>(new Set());

  // Ref for robust video playing
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- HARDENED LOGIC START ---
  const localDef = selectedDish ? DEFAULT_MENU_ITEMS.find(i => i.id === (selectedDish.slug || selectedDish.id)) : null;
  
  const effectiveType = (selectedDish?.type === 'drink' || localDef?.type === 'drink') ? 'drink' : 'food';
  const effectiveVariants = (selectedDish?.variants && selectedDish.variants.length > 0) 
      ? selectedDish.variants 
      : (localDef?.variants || []);
  const effectiveABV = selectedDish?.abv || localDef?.abv;
  const effectiveRelatedIds = selectedDish?.relatedItemIds || localDef?.relatedItemIds || [];
  
  const isDrink = effectiveType === 'drink';
  // --- HARDENED LOGIC END ---

  // Reset state when dish opens
  useEffect(() => {
    if (selectedDish) {
        setQuantity(1);
        setModifiers(new Set());
        setExcludedIngredients(new Set());
        setShowMacros(false);
        setAddedFeedbackIds(new Set());
        setPendingRelated({}); // Reset pending cross-sells
        
        // Auto-select first variant if available
        if (effectiveVariants.length > 0) {
            setSelectedVariant(effectiveVariants[0]);
        } else {
            setSelectedVariant(null);
        }

        // Auto-select first option of any Single Select Modifier groups
        if (selectedDish.modifiers) {
             const preSelected = new Set<string>();
             selectedDish.modifiers.forEach(mod => {
                 // Determine groups
                 if (mod.isSingleSelect && mod.group) {
                     // If we haven't selected for this group yet, select the first one we find
                 }
             });
        }
    }
  }, [selectedDish]);

  // Video Autoplay fix for iOS
  useEffect(() => {
      if (selectedDish?.videoUrl && videoRef.current) {
          videoRef.current.defaultMuted = true;
          videoRef.current.muted = true;
      }
  }, [selectedDish]);

  if (!selectedDish) return null;

  // --- Handlers ---

  const toggleModifier = (mod: DishModifier) => {
    const next = new Set(modifiers);
    
    if (mod.isSingleSelect && mod.group) {
        // Remove other modifiers in the same group from the set
        selectedDish.modifiers?.forEach(m => {
            if (m.group === mod.group && m.id !== mod.id) {
                next.delete(m.id);
            }
        });
        // Always select the new one (radio behavior)
        next.add(mod.id);
    } else {
        // Standard toggle behavior
        if (next.has(mod.id)) next.delete(mod.id);
        else next.add(mod.id);
    }
    
    setModifiers(next);
  };

  const toggleIngredient = (ingredient: string) => {
    const next = new Set(excludedIngredients);
    if (next.has(ingredient)) next.delete(ingredient);
    else next.add(ingredient);
    setExcludedIngredients(next);
  };

  // Calculates Price of Main Dish + Modifiers + Pending Cross Sells
  const calculateTotal = () => {
    // 1. Main Dish Cost
    let mainPrice = selectedVariant ? selectedVariant.price : selectedDish.price;
    selectedDish.modifiers?.forEach(mod => {
        if (modifiers.has(mod.id)) {
            mainPrice += mod.priceDelta;
        }
    });
    let total = mainPrice * quantity;

    // 2. Pending Related Items Cost
    Object.entries(pendingRelated).forEach(([relatedId, count]) => {
        const relatedItem = menuItems.find(i => i.id === relatedId);
        if (relatedItem) {
            total += relatedItem.price * count;
        }
    });

    return total;
  };

  const handleAdd = () => {
    // 1. Add Main Dish
    addToOrder({
        dishId: selectedDish.id,
        quantity,
        priceAtOrder: (selectedVariant ? selectedVariant.price : selectedDish.price) + 
                      (Array.from(modifiers).reduce((acc, modId) => {
                          const m = selectedDish.modifiers?.find(x => x.id === modId);
                          return acc + (m?.priceDelta || 0);
                      }, 0)),
        selectedModifiers: Array.from(modifiers),
        excludedIngredients: Array.from(excludedIngredients),
        selectedVariantId: selectedVariant?.id
    });

    // 2. Add Pending Related Items (Default config)
    Object.entries(pendingRelated).forEach(([relatedId, count]) => {
        if (count > 0) {
            addToOrder({ 
                dishId: relatedId, 
                quantity: count,
                // Note: Cross-sells added this way have no modifiers
            });
        }
    });

    openProduct(null);
  };

  const handleQuickAdd = (e: React.MouseEvent, itemId: string) => {
      e.stopPropagation();
      
      // Update local state instead of global cart
      setPendingRelated(prev => ({
          ...prev,
          [itemId]: (prev[itemId] || 0) + 1
      }));
      
      // Trigger visual feedback
      setAddedFeedbackIds(prev => {
          const next = new Set(prev);
          next.add(itemId);
          return next;
      });

      // Remove feedback after 1s
      setTimeout(() => {
          setAddedFeedbackIds(prev => {
            const next = new Set(prev);
            next.delete(itemId);
            return next;
        });
      }, 1000);
  };

  const handleQuickRemove = (e: React.MouseEvent, itemId: string) => {
      e.stopPropagation();
      
      // Update local state
      setPendingRelated(prev => {
          const current = prev[itemId] || 0;
          if (current <= 1) {
              const next = { ...prev };
              delete next[itemId];
              return next;
          }
          return { ...prev, [itemId]: current - 1 };
      });
  };

  // --- Helper Calculations ---
  const isFavorite = favorites.has(selectedDish.id);
  
  const weight = selectedVariant 
    ? selectedVariant.volume 
    : (isDrink ? '350 мл' : '280 г');
  
  const nutrition = selectedDish.nutrition || {
      calories: selectedDish.calories || 320,
      protein: Math.round((selectedDish.calories || 320) * 0.20 / 4),
      fats: Math.round((selectedDish.calories || 320) * 0.30 / 9),
      carbs: Math.round((selectedDish.calories || 320) * 0.50 / 4)
  };

  // --- FIXED CROSS SELL LOGIC (Deduplication) ---
  const seenIds = new Set<string>();
  const relatedDishes = menuItems.filter(item => {
      const isRelated = effectiveRelatedIds.includes(item.id) || (item.slug && effectiveRelatedIds.includes(item.slug));
      
      if (isRelated && !seenIds.has(item.id) && item.id !== selectedDish.id) {
          seenIds.add(item.id);
          return true;
      }
      return false;
  });

  // Check if we have doneness modifiers to change the title
  const hasDoneness = selectedDish.modifiers?.some(m => m.group === 'doneness');
  const modifiersTitle = isDrink 
        ? 'Настройки напитка' 
        : (hasDoneness ? 'Прожарка и добавки' : 'Добавить');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-end justify-center pointer-events-none">
        
        {/* 1. Backdrop */}
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => openProduct(null)}
            className="absolute inset-0 bg-anthracite/60 backdrop-blur-[4px] pointer-events-auto"
        />

        {/* 2. Sheet Container */}
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full h-[95vh] bg-background-light rounded-t-[24px] overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
        >
             
             {/* Header Image / Video Area */}
            <div className="relative h-[35vh] min-h-[250px] w-full shrink-0 bg-anthracite">
                {selectedDish.videoUrl ? (
                    <video 
                        ref={videoRef}
                        src={selectedDish.videoUrl} 
                        autoPlay 
                        muted 
                        loop 
                        playsInline 
                        className="w-full h-full object-cover opacity-90"
                    />
                ) : (
                    <img 
                        src={selectedDish.imageUrl} 
                        alt={selectedDish.name}
                        className="w-full h-full object-cover opacity-90"
                    />
                )}
                
                {/* Navbar Actions */}
                <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20">
                    <button 
                        onClick={() => openProduct(null)}
                        className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center text-text-main hover:scale-105 transition-transform active:scale-95"
                    >
                        <span className="material-icons-round text-3xl">keyboard_arrow_down</span>
                    </button>

                    <div className="flex gap-3">
                         {effectiveABV && (
                             <div className="h-10 px-3 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center">
                                 <span className="text-xs font-bold font-mono text-anthracite">ABV {effectiveABV}%</span>
                             </div>
                         )}

                        <button 
                            onClick={() => toggleFavorite(selectedDish.id)}
                            className={`w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${isFavorite ? 'text-primary' : 'text-text-main/40'}`}
                        >
                            <span className={`material-icons-round text-2xl ${isFavorite ? '' : 'material-icons-outlined'}`}>favorite</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Scrollable Area */}
            <div className="flex-1 overflow-y-auto no-scrollbar -mt-6 pt-10 px-6 pb-32 bg-background-light rounded-t-[24px] relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                
                {/* Decorative Handle */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-black/10 rounded-full"></div>

                {/* Title & Info */}
                <div className="flex flex-col gap-1 mb-6">
                    <div className="flex justify-between items-start">
                         <h1 className="text-2xl font-logo font-bold uppercase tracking-wide text-text-main leading-tight max-w-[70%]">
                            {selectedDish.name}
                        </h1>
                         <div className="flex flex-col items-end">
                             <div className="text-xl font-bold font-mono text-primary tabular-nums bg-anthracite px-2 py-1 rounded-lg shadow-sm">
                                 {selectedVariant ? selectedVariant.price : selectedDish.price}₽
                             </div>
                             {selectedDish.oldPrice && (
                                 <span className="text-xs text-red-400 line-through decoration-red-400 mt-1 mr-1">{selectedDish.oldPrice}₽</span>
                             )}
                         </div>
                    </div>
                   
                    {/* Meta Data */}
                    <div className="flex items-center gap-4 text-xs text-text-main/60 font-sans mt-2">
                        <span className="font-bold bg-gray-100 px-2 py-0.5 rounded text-text-main">{weight}</span>
                        {!isDrink && (
                            <>
                                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                <span className="font-bold">{nutrition.calories} ккал</span>
                                <button onClick={() => setShowMacros(!showMacros)} className="text-primary underline opacity-80">КБЖУ</button>
                            </>
                        )}
                    </div>

                    {/* Macros Expandable */}
                    <AnimatePresence>
                        {showMacros && !isDrink && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="flex gap-4 mt-3 bg-background-soft p-3 rounded-xl border border-primary/20">
                                    <div className="text-center flex-1">
                                        <div className="text-xs font-bold text-text-main">{nutrition.protein}</div>
                                        <div className="text-[9px] uppercase text-text-main/50 tracking-wider">Белки</div>
                                    </div>
                                    <div className="w-[1px] bg-primary/10"></div>
                                    <div className="text-center flex-1">
                                        <div className="text-xs font-bold text-text-main">{nutrition.fats}</div>
                                        <div className="text-[9px] uppercase text-text-main/50 tracking-wider">Жиры</div>
                                    </div>
                                    <div className="w-[1px] bg-primary/10"></div>
                                    <div className="text-center flex-1">
                                        <div className="text-xs font-bold text-text-main">{nutrition.carbs}</div>
                                        <div className="text-[9px] uppercase text-text-main/50 tracking-wider">Углев.</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <p className="text-text-main/80 text-sm leading-relaxed font-sans border-l-2 border-primary pl-3 mb-8">
                    {selectedDish.description}
                </p>

                {/* --- SECTIONS --- */}

                {/* 1. Size Selection */}
                {effectiveVariants.length > 0 && (
                     <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-text-main mb-3">Выберите объем</h3>
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            {effectiveVariants.map(variant => {
                                const isSelected = selectedVariant?.id === variant.id;
                                return (
                                    <button
                                        key={variant.id}
                                        onClick={() => setSelectedVariant(variant)}
                                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                                            isSelected 
                                                ? 'bg-white text-anthracite shadow-md' 
                                                : 'text-text-main/50 hover:text-text-main'
                                        }`}
                                    >
                                        {variant.name}
                                    </button>
                                )
                            })}
                        </div>
                     </div>
                )}

                {/* 2. Cross Sells (Updated for Local State Accumulation) */}
                {relatedDishes.length > 0 && (
                     <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-text-main mb-3 flex items-center gap-2">
                            <span className="material-icons-round text-primary text-sm">thumb_up</span>
                            {isDrink ? 'Идеальная пара' : 'С этим вкусно'}
                        </h3>
                        <p className="text-[9px] text-text-main/50 mb-2 -mt-1">Для выбора добавок нажмите на фото</p>
                        <div className="flex overflow-x-auto gap-3 pb-2 -mx-6 px-6 no-scrollbar snap-x">
                            {relatedDishes.map(item => {
                                const isAdded = addedFeedbackIds.has(item.id);
                                // Show Pending Quantity for this session only
                                const qtyPending = pendingRelated[item.id] || 0;

                                return (
                                <div key={item.id} className="snap-start w-36 flex-shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden cursor-pointer active:scale-95 transition-transform" onClick={() => openProduct(item)}>
                                    <div className="w-full h-24 bg-gray-50 overflow-hidden relative">
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                        
                                        {/* Pending Quantity Badge */}
                                        {qtyPending > 0 && (
                                            <div className="absolute top-1 left-1 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-white/10 z-10 animate-bounce">
                                                +{qtyPending}
                                            </div>
                                        )}

                                        {/* Minus Button (Left) - Only if qty > 0 */}
                                        {qtyPending > 0 && (
                                            <button 
                                                onClick={(e) => handleQuickRemove(e, item.id)}
                                                className="absolute bottom-1 left-1 w-6 h-6 rounded-full bg-white/90 backdrop-blur text-anthracite flex items-center justify-center shadow-md hover:bg-white active:scale-95 transition-all z-20 border border-black/5"
                                            >
                                                <span className="material-icons-round text-[14px]">remove</span>
                                            </button>
                                        )}

                                        {/* Add Button (Right) */}
                                        <button 
                                            onClick={(e) => handleQuickAdd(e, item.id)}
                                            className={`absolute bottom-1 right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all duration-300 z-20 ${
                                                isAdded 
                                                ? 'bg-status-green text-white scale-110' 
                                                : 'bg-anthracite text-white hover:bg-primary'
                                            }`}
                                        >
                                            <span className="material-icons-round text-[14px]">
                                                {isAdded ? 'check' : 'add'}
                                            </span>
                                        </button>
                                    </div>
                                    <div className="p-2 flex-1 flex flex-col justify-between">
                                        <h4 className="text-[10px] font-bold text-text-main leading-tight line-clamp-2 uppercase tracking-wide">{item.name}</h4>
                                        <span className="text-[10px] font-medium text-text-main/60 mt-1">{item.price} ₽</span>
                                    </div>
                                </div>
                            )})}
                        </div>
                    </div>
                )}

                {/* 3. Ingredients */}
                {!isDrink && selectedDish.ingredients && selectedDish.ingredients.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-text-main mb-3">Состав блюда</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedDish.ingredients.map((ing, idx) => {
                                const isExcluded = excludedIngredients.has(ing);
                                return (
                                    <button 
                                        key={idx}
                                        onClick={() => toggleIngredient(ing)}
                                        className={`px-3 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200 border flex items-center gap-1.5
                                            ${isExcluded 
                                                ? 'bg-red-50 border-red-100 text-red-400 line-through decoration-red-400 opacity-60' 
                                                : 'bg-white border-black/10 text-text-main shadow-sm hover:border-primary'}
                                        `}
                                    >
                                        {!isExcluded && <span className="material-icons-round text-[12px] text-green-500">check</span>}
                                        {isExcluded && <span className="material-icons-round text-[12px]">close</span>}
                                        <span>{ing}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 4. Modifiers (Updated with Radio/Check logic) */}
                {selectedDish.modifiers && selectedDish.modifiers.length > 0 && (
                    <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-text-main mb-3">
                            {modifiersTitle}
                        </h3>
                        <div className="space-y-2">
                            {selectedDish.modifiers.map(mod => {
                                const isActive = modifiers.has(mod.id);
                                const isRadio = !!mod.isSingleSelect;

                                return (
                                    <div 
                                        key={mod.id} 
                                        onClick={() => toggleModifier(mod)}
                                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
                                            isActive 
                                            ? 'bg-primary/5 border-primary shadow-inner' 
                                            : 'bg-white border-black/5 shadow-sm'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                                                isRadio 
                                                    ? (isActive ? 'border-primary border-4' : 'border-gray-300 border-2')
                                                    : (isActive ? 'bg-primary border border-primary rounded-md' : 'border-gray-300 border rounded-md')
                                            }`}>
                                                {isActive && !isRadio && (
                                                    <span className="material-icons-round text-white text-[14px]">check</span>
                                                )}
                                            </div>
                                            <span className={`text-xs uppercase tracking-wide ${isActive ? 'text-text-main font-bold' : 'text-text-main/70 font-medium'}`}>{mod.name}</span>
                                        </div>
                                        <span className="text-xs font-bold text-text-main">{mod.priceDelta > 0 ? `+ ${mod.priceDelta} ₽` : '0 ₽'}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Sticky Footer */}
            <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-black/5 p-6 pb-8 z-20">
                <div className="flex items-center gap-4">
                    <div className="flex items-center bg-gray-100 rounded-xl h-12 px-2 shrink-0">
                        <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-full flex items-center justify-center text-text-main/50 hover:text-text-main active:scale-90 transition-transform"
                        >
                            <span className="material-icons-round text-xl">remove</span>
                        </button>
                        <span className="w-6 text-center font-bold text-base text-text-main tabular-nums">{quantity}</span>
                        <button 
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-full flex items-center justify-center text-text-main/50 hover:text-text-main active:scale-90 transition-transform"
                        >
                            <span className="material-icons-round text-xl">add</span>
                        </button>
                    </div>

                    <button 
                        onClick={handleAdd}
                        className="flex-1 h-12 bg-primary text-white rounded-xl flex items-center justify-between px-6 shadow-lg shadow-primary/30 hover:bg-primary-dark transition-colors active:scale-95"
                    >
                        <span className="font-bold text-xs uppercase tracking-widest">Добавить</span>
                        <span className="font-mono text-lg font-bold">{calculateTotal()} ₽</span>
                    </button>
                </div>
            </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
