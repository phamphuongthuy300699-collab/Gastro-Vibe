
import React, { useEffect, useMemo, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../store/GameContext';
import { trackPilotEvent } from '../../lib/analytics';

export const ProductSheet: React.FC = () => {
  const {
    selectedDish,
    openProduct,
    favorites,
    toggleFavorite,
    menuItems,
  } = useGameStore();

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (selectedDish?.videoUrl && videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => undefined);
    }
  }, [selectedDish]);

  const relatedDishes = useMemo(() => {
    if (!selectedDish) return [];

    const relatedIds = selectedDish.relatedItemIds || [];
    return menuItems
      .filter((item) =>
        item.id !== selectedDish.id &&
        (relatedIds.includes(item.id) || (!!item.slug && relatedIds.includes(item.slug)))
      )
      .slice(0, 6);
  }, [menuItems, selectedDish]);

  if (!selectedDish) return null;

  const isFavorite = favorites.has(selectedDish.id);

  const openRelatedDish = (dishId: string) => {
    const dish = menuItems.find((item) => item.id === dishId);
    if (!dish) return;

    void trackPilotEvent('dish_open', {
      dishId: dish.id,
      categoryId: dish.categoryId,
      source: 'related-dish',
    });
    openProduct(dish);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-end justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => openProduct(null)}
          className="absolute inset-0 bg-anthracite/60 backdrop-blur-[4px] pointer-events-auto"
        />

        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="relative w-full max-w-md h-[94vh] bg-background-light rounded-t-[26px] overflow-hidden shadow-2xl pointer-events-auto flex flex-col"
        >
          <div className="relative h-[42vh] min-h-[290px] w-full shrink-0 bg-anthracite">
            {selectedDish.videoUrl ? (
              <video
                ref={videoRef}
                src={selectedDish.videoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : selectedDish.imageUrl ? (
              <img
                src={selectedDish.imageUrl}
                alt={selectedDish.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="font-logo text-primary text-2xl uppercase tracking-[0.24em]">
                  Маргарита
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/55 pointer-events-none" />

            <div className="absolute top-0 left-0 w-full p-5 flex justify-between items-start z-20">
              <button
                onClick={() => openProduct(null)}
                className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center text-text-main active:scale-95 transition-transform"
                aria-label="Закрыть"
              >
                <span className="material-icons-round text-3xl">keyboard_arrow_down</span>
              </button>

              <button
                onClick={() => void toggleFavorite(selectedDish.id)}
                className={`w-11 h-11 rounded-full backdrop-blur-md shadow-sm flex items-center justify-center active:scale-95 transition-all ${
                  isFavorite ? 'bg-primary text-white' : 'bg-white/90 text-text-main'
                }`}
                aria-label={isFavorite ? 'Убрать из моего выбора' : 'Добавить в мой выбор'}
              >
                <span className="material-icons-round text-2xl">
                  {isFavorite ? 'favorite' : 'favorite_border'}
                </span>
              </button>
            </div>

            <div className="absolute left-5 right-5 bottom-5 z-10 text-white">
              <div className="flex items-center gap-2 mb-2">
                {!!selectedDish.featured && (
                  <span className="px-2 py-1 rounded bg-primary text-white text-[9px] font-bold uppercase tracking-widest">
                    Рекомендуем
                  </span>
                )}
                {!!selectedDish.badges?.[0] && (
                  <span className="px-2 py-1 rounded bg-black/35 backdrop-blur text-white text-[9px] font-bold uppercase tracking-widest">
                    {selectedDish.badges[0]}
                  </span>
                )}
              </div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/70 mb-1">
                Маргарита
              </div>
              <h1 className="text-3xl font-logo font-bold uppercase tracking-wide leading-none drop-shadow-md max-w-[85%]">
                {selectedDish.name}
              </h1>
            </div>
          </div>

          <div className="h-[9px] restaurant-wall shrink-0" />

          <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-6 pb-32 bg-gradient-to-b from-background-soft/45 via-background-light to-background-light">
            <div className="flex justify-between items-baseline gap-4 mb-5">
              <div className="text-[10px] uppercase tracking-[0.24em] font-logo font-bold text-primary">
                Маргарита · Хочу попробовать
              </div>
              <div className="text-2xl font-bold font-mono text-primary whitespace-nowrap">
                {selectedDish.price} ₽
              </div>
            </div>

            <p className="text-[15px] text-text-main/75 leading-relaxed border-l-2 border-primary pl-4 mb-8">
              {selectedDish.marketingCopy || selectedDish.description || 'Блюдо из актуального меню «Маргариты».'}
            </p>

            {!!selectedDish.ingredients?.length && (
              <section className="mb-8">
                <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-text-main mb-3">
                  В составе
                </h2>
                <div className="flex flex-wrap gap-2">
                  {selectedDish.ingredients.map((ingredient) => (
                    <span
                      key={ingredient}
                      className="px-3 py-2 rounded-xl bg-white border border-black/5 text-[11px] text-text-main/65"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {relatedDishes.length > 0 && (
              <section className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-icons-round text-primary text-lg">auto_awesome</span>
                  <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-text-main">
                    С этим вкусно
                  </h2>
                </div>
                <div className="flex overflow-x-auto gap-3 -mx-6 px-6 pb-2 no-scrollbar snap-x">
                  {relatedDishes.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => openRelatedDish(item.id)}
                      className="snap-start w-36 shrink-0 bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm text-left active:scale-[0.98] transition-transform"
                    >
                      <div className="w-full h-24 bg-gray-100 overflow-hidden">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-anthracite flex items-center justify-center text-primary text-[10px] uppercase tracking-wider">
                            Маргарита
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="text-[10px] font-bold uppercase leading-tight line-clamp-2 min-h-[28px]">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-primary font-mono font-bold mt-2">
                          {item.price} ₽
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-2xl bg-anthracite text-white p-5 mb-5">
              <div className="flex gap-3">
                <span className="material-icons-round text-primary">room_service</span>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-[0.16em] mb-1">
                    Выбор остаётся за гостем
                  </h2>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Сохраните блюдо в «Мой выбор» и покажите список официанту — он поможет с деталями и подачей.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <div className="absolute bottom-0 left-0 w-full bg-white/95 backdrop-blur-lg border-t border-black/5 p-5 pb-8 z-20">
            <button
              onClick={() => void toggleFavorite(selectedDish.id)}
              className={`w-full h-14 rounded-2xl flex items-center justify-between px-5 shadow-lg transition-all active:scale-[0.98] ${
                isFavorite
                  ? 'bg-anthracite text-white shadow-black/10'
                  : 'bg-primary text-white shadow-primary/30'
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="material-icons-round text-2xl">
                  {isFavorite ? 'check_circle' : 'favorite_border'}
                </span>
                <span className="text-left">
                  <span className="block font-bold text-xs uppercase tracking-widest">
                    {isFavorite ? 'В моём выборе' : 'Хочу попробовать'}
                  </span>
                  <span className="block text-[10px] opacity-70 mt-0.5">
                    {isFavorite ? 'Нажмите, чтобы убрать' : 'Сохранить и показать официанту'}
                  </span>
                </span>
              </span>
              <span className="font-mono text-lg font-bold">{selectedDish.price} ₽</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
