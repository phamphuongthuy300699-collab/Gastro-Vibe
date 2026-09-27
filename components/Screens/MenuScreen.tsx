import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGameStore } from '../../store/GameContext';
import { Dish } from '../../types';
import { trackPilotEvent } from '../../lib/analytics';

interface MenuScreenProps {
  initialViewMode?: 'grid' | 'mood';
  lockViewMode?: boolean;
}

interface MenuGridItemProps {
  item: Dish;
  isSaved: boolean;
  onOpen: () => void;
  onSave: () => void;
}

const MenuGridItem: React.FC<MenuGridItemProps> = ({ item, isSaved, onOpen, onSave }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    const nextIndex = Math.round(scrollRef.current.scrollLeft / width);
    setActiveIndex(nextIndex);

    if (nextIndex === 1 && videoRef.current) {
      videoRef.current.play().catch(() => undefined);
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
    }
  }, [item.videoUrl]);

  return (
    <article className="group cursor-pointer mb-8" onClick={onOpen}>
      <div className="relative rounded-xl overflow-hidden aspect-[3/4] mb-3 bg-gray-100 shadow-sm border border-black/5">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
        >
          <div className="w-full h-full flex-shrink-0 snap-center relative">
            {item.imageUrl ? (
              <img
                alt={item.name}
                className="w-full h-full object-cover"
                src={item.imageUrl}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-anthracite flex items-center justify-center px-4 text-center">
                <span className="font-logo text-primary text-sm tracking-[0.2em] uppercase">Маргарита</span>
              </div>
            )}
          </div>

          {!!item.videoUrl && (
            <div className="w-full h-full flex-shrink-0 snap-center relative bg-black">
              <video
                ref={videoRef}
                src={item.videoUrl}
                className="w-full h-full object-cover opacity-90"
                muted
                loop
                playsInline
              />
            </div>
          )}
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onSave();
          }}
          aria-label={isSaved ? 'Убрать из моего выбора' : 'Добавить в мой выбор'}
          className={`absolute top-2 left-2 z-20 w-10 h-10 rounded-full backdrop-blur-md border border-white/20 shadow-md flex items-center justify-center transition-all ${
            isSaved ? 'bg-primary text-white' : 'bg-black/35 text-white'
          }`}
        >
          <span className="material-icons-round text-[22px]">{isSaved ? 'favorite' : 'favorite_border'}</span>
        </button>

        <div className="absolute top-2 right-2 z-10">
          <div className="bg-anthracite/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm border border-white/10">
            <span className="text-xs font-bold text-primary tabular-nums">{item.price} ₽</span>
          </div>
        </div>

        {!!item.videoUrl && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
            <div className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${activeIndex === 0 ? 'bg-white scale-125' : 'bg-white/40'}`} />
            <div className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${activeIndex === 1 ? 'bg-primary scale-125' : 'bg-white/40'}`} />
          </div>
        )}
      </div>

      <div className="px-1">
        <h3 className="font-bold text-[12px] uppercase tracking-wide leading-tight mb-1 text-text-main">{item.name}</h3>
        <p className="text-[10px] text-text-main/55 leading-relaxed font-sans line-clamp-2">
          {item.marketingCopy || item.description}
        </p>
      </div>
    </article>
  );
};

interface VibeFeedItemProps {
  item: Dish;
  isMuted: boolean;
  isSaved: boolean;
  toggleMute: () => void;
  onOpen: () => void;
  onSave: () => void;
  onView: () => void;
}

const VibeFeedItem: React.FC<VibeFeedItemProps> = ({
  item,
  isMuted,
  isSaved,
  toggleMute,
  onOpen,
  onSave,
  onView,
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const viewSentRef = useRef(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = isMuted;
      videoRef.current.play().catch(() => undefined);
    }
  }, [isMuted, item.videoUrl]);

  useEffect(() => {
    const element = itemRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.7 && !viewSentRef.current) {
          viewSentRef.current = true;
          onView();
        }
      },
      { threshold: [0.7] }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [onView]);

  return (
    <div ref={itemRef} className="w-full h-full snap-start relative shrink-0">
      {item.videoUrl ? (
        <div className="w-full h-full relative">
          <video
            ref={videoRef}
            src={item.videoUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted={isMuted}
            loop
            playsInline
          />
          <button
            onClick={(event) => {
              event.stopPropagation();
              toggleMute();
            }}
            className="absolute top-5 right-4 z-20 w-11 h-11 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white/80"
            aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
          >
            <span className="material-icons-round text-xl">{isMuted ? 'volume_off' : 'volume_up'}</span>
          </button>
        </div>
      ) : item.imageUrl ? (
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-anthracite flex items-center justify-center">
          <span className="font-logo text-primary text-2xl tracking-[0.2em] uppercase">Маргарита</span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[7px] restaurant-wall z-20 opacity-90" />

      <div className="absolute top-5 left-5 z-10">
        <span className="text-[10px] font-logo font-bold uppercase tracking-[0.24em] text-white/85">Маргарита · VIBE</span>
      </div>

      <div className="absolute bottom-24 left-0 w-full px-6 text-white pb-6 z-10">
        <div className="flex justify-between items-end mb-4">
          <div className="flex-1 pr-4 min-w-0">
            {!!item.badges?.length && (
              <span className="inline-block mb-2 bg-primary/90 text-anthracite text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
                {item.badges[0]}
              </span>
            )}
            <h2 className="text-3xl font-logo font-bold uppercase tracking-wider mb-2 leading-none drop-shadow-md">
              {item.name}
            </h2>
            <p className="text-sm text-white/80 line-clamp-3 font-light leading-relaxed">
              {item.marketingCopy || item.description}
            </p>
          </div>
          <div className="text-3xl font-bold text-primary font-mono whitespace-nowrap">{item.price} ₽</div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onOpen}
            className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl"
          >
            Подробнее
          </button>
          <button
            onClick={onSave}
            aria-label={isSaved ? 'Сохранено в моём выборе' : 'Сохранить в мой выбор'}
            className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform shadow-lg ${
              isSaved ? 'bg-white text-primary' : 'bg-primary text-anthracite shadow-primary/30'
            }`}
          >
            <span className="material-icons-round text-2xl">{isSaved ? 'favorite' : 'favorite_border'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const OPEN_CHOICE_KEY = 'gastro-vibe-open-choice';

export const MenuScreen: React.FC<MenuScreenProps> = ({ initialViewMode = 'grid' }) => {
  const {
    openProduct,
    openStory,
    stories,
    menuItems,
    categories,
    isLoading,
    favorites,
    toggleFavorite,
    setActiveTab,
  } = useGameStore();

  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'mood'>(initialViewMode);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const isProgrammaticScroll = useRef(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setViewMode(initialViewMode);

    if (initialViewMode === 'grid') {
      try {
        const shouldOpenChoice = window.sessionStorage.getItem(OPEN_CHOICE_KEY) === '1';
        if (shouldOpenChoice) {
          setShowFavoritesOnly(true);
          window.sessionStorage.removeItem(OPEN_CHOICE_KEY);
        }
      } catch {
        // Navigation still works if sessionStorage is unavailable.
      }
    }

    void trackPilotEvent(initialViewMode === 'mood' ? 'vibe_open' : 'menu_open', {
      source: initialViewMode === 'mood' ? 'vibe' : 'menu',
    });
  }, [initialViewMode]);

  const vibeFeedItems = useMemo(() => {
    const withVideo: Dish[] = [];
    const withoutVideo: Dish[] = [];

    menuItems.forEach((item) => {
      if (item.videoUrl) withVideo.push(item);
      else withoutVideo.push(item);
    });

    const businessSort = (a: Dish, b: Dish) =>
      Number(!!b.featured) - Number(!!a.featured) ||
      (b.vibePriority || 0) - (a.vibePriority || 0) ||
      a.name.localeCompare(b.name, 'ru');

    withVideo.sort(businessSort);
    withoutVideo.sort(businessSort);
    return [...withVideo, ...withoutVideo];
  }, [menuItems]);

  const favoriteItems = useMemo(
    () => menuItems.filter((item) => favorites.has(item.id)),
    [favorites, menuItems]
  );

  useEffect(() => {
    if (showFavoritesOnly) return;
    const tabsContainer = tabsContainerRef.current;
    const activeTab = document.getElementById(`tab-btn-${activeCategoryId}`);

    if (tabsContainer && activeTab) {
      const targetLeft = activeTab.offsetLeft - tabsContainer.clientWidth / 2 + activeTab.offsetWidth / 2;
      tabsContainer.scrollTo({ left: targetLeft, behavior: 'smooth' });
    }
  }, [activeCategoryId, showFavoritesOnly]);

  const openDish = (item: Dish, source: 'menu-grid' | 'my-choice' | 'vibe') => {
    void trackPilotEvent('dish_open', {
      dishId: item.id,
      categoryId: item.categoryId,
      source,
    });
    openProduct(item);
  };

  const openMyChoiceFromVibe = () => {
    try {
      window.sessionStorage.setItem(OPEN_CHOICE_KEY, '1');
    } catch {
      // Fallback below still returns to the menu.
    }
    setActiveTab('menu');
  };

  const handleHeaderTitleClick = () => {
    if (viewMode === 'mood') {
      setActiveTab('menu');
      return;
    }

    if (showFavoritesOnly) {
      setShowFavoritesOnly(false);
      setActiveCategoryId('all');
      window.setTimeout(() => scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 0);
      return;
    }

    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToCategory = (categoryId: string) => {
    setShowFavoritesOnly(false);
    isProgrammaticScroll.current = true;
    setActiveCategoryId(categoryId);

    if (categoryId !== 'all') {
      void trackPilotEvent('category_open', { categoryId, source: 'menu' });
    }

    const container = scrollContainerRef.current;
    if (container) {
      if (categoryId === 'all') {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(`cat-${categoryId}`);
        if (element) {
          container.scrollTo({ top: Math.max(0, element.offsetTop - 65), behavior: 'smooth' });
        }
      }
    }

    window.setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 800);
  };

  const handleContentScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (isProgrammaticScroll.current || showFavoritesOnly) return;

    const container = event.currentTarget;
    if (container.scrollTop < 50) {
      if (activeCategoryId !== 'all') setActiveCategoryId('all');
      return;
    }

    const scrollOffset = container.scrollTop + 85;
    let currentId = 'all';
    for (const category of categories) {
      const element = document.getElementById(`cat-${category.id}`);
      if (element && element.offsetTop <= scrollOffset) currentId = category.id;
    }
    if (currentId !== activeCategoryId) setActiveCategoryId(currentId);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-background-light text-text-main">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="opacity-50 text-xs uppercase tracking-widest font-bold">Загрузка меню...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-light text-text-main font-sans">
      <header className="flex justify-between items-center px-5 pt-5 pb-4 bg-background-light z-40 shrink-0 shadow-sm border-b border-black/5">
        <button onClick={handleHeaderTitleClick} className="text-left active:opacity-60 transition-opacity" aria-label="Вернуться в меню">
          <div className="text-[9px] font-bold uppercase tracking-[0.28em] text-primary mb-1">Маргарита</div>
          <h1 className="text-2xl font-logo font-bold tracking-[0.16em] uppercase text-text-main leading-none">
            {viewMode === 'grid' ? 'Меню' : 'VIBE'}
          </h1>
        </button>

        {viewMode === 'grid' ? (
          <button
            onClick={() => setShowFavoritesOnly((value) => !value)}
            className={`h-10 px-3 rounded-full border flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-all ${
              showFavoritesOnly
                ? 'bg-anthracite text-white border-anthracite'
                : 'bg-white text-text-main border-black/10'
            }`}
          >
            <span className="material-icons-round text-[18px] text-primary">favorite</span>
            Мой выбор
            <span className="min-w-5 h-5 px-1 rounded-full bg-primary/15 text-primary flex items-center justify-center">
              {favorites.size}
            </span>
          </button>
        ) : (
          <button
            onClick={openMyChoiceFromVibe}
            className="h-10 px-3 rounded-full bg-black/5 border border-black/5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider active:scale-[0.98] transition-transform"
          >
            <span className="material-icons-round text-[18px] text-primary">favorite</span>
            Мой выбор
            <span className="min-w-5 h-5 px-1 rounded-full bg-primary/15 text-primary flex items-center justify-center">
              {favorites.size}
            </span>
          </button>
        )}
      </header>

      {viewMode === 'grid' ? (
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-32 scroll-smooth relative"
          onScroll={handleContentScroll}
        >
          {showFavoritesOnly ? (
            <section className="px-5 py-7 min-h-full">
              <div className="mb-7">
                <div className="text-[10px] uppercase tracking-[0.24em] font-bold text-primary mb-2">Хочу попробовать</div>
                <h2 className="text-3xl font-logo font-bold uppercase tracking-wide mb-2">Мой выбор</h2>
                <p className="text-sm text-text-main/55 max-w-xs">Сохраните понравившиеся блюда и покажите этот список официанту.</p>
              </div>

              {favoriteItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4">
                  {favoriteItems.map((item) => (
                    <MenuGridItem
                      key={item.id}
                      item={item}
                      isSaved
                      onOpen={() => openDish(item, 'my-choice')}
                      onSave={() => void toggleFavorite(item.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl bg-white border border-black/5 p-8 text-center shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                    <span className="material-icons-round text-3xl">favorite_border</span>
                  </div>
                  <h3 className="font-bold uppercase tracking-wide mb-2">Пока пусто</h3>
                  <p className="text-sm text-text-main/50 mb-5">Нажимайте на сердечко в меню или VIBE — блюда появятся здесь.</p>
                  <button
                    onClick={() => setShowFavoritesOnly(false)}
                    className="px-5 py-3 rounded-xl bg-anthracite text-white text-xs font-bold uppercase tracking-widest"
                  >
                    Смотреть меню
                  </button>
                </div>
              )}
            </section>
          ) : (
            <>
              {!!stories.length && (
                <section className="pt-6 pb-5 bg-background-soft/55">
                  <div className="px-5 mb-4 flex items-end justify-between">
                    <div>
                      <div className="text-[9px] font-bold uppercase tracking-[0.28em] text-primary mb-1">Сейчас в «Маргарите»</div>
                      <h2 className="text-xl font-logo font-bold uppercase tracking-[0.08em]">Истории и акценты</h2>
                    </div>
                    <span className="text-[10px] text-text-main/40">листайте</span>
                  </div>

                  <div className="flex gap-5 overflow-x-auto no-scrollbar px-5 pb-1">
                    {stories.map((story) => (
                      <button
                        key={story.id}
                        onClick={() => openStory(story)}
                        className="w-[82px] shrink-0 text-center group"
                      >
                        <div className="w-[78px] h-[78px] mx-auto rounded-full p-[2px] border border-primary bg-background-light shadow-sm transition-transform group-active:scale-95">
                          <div className="w-full h-full rounded-full overflow-hidden border-2 border-background-light">
                            <img src={story.previewImage} alt={story.title} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                        </div>
                        <span className="block mt-2 text-[9px] leading-tight font-bold uppercase tracking-[0.12em] text-text-main">
                          {story.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <div className="w-full h-[9px] restaurant-wall opacity-95" />

              <section className="pt-6 pb-5">
                <div className="px-5 mb-4 flex items-end justify-between">
                  <div>
                    <div className="text-[9px] font-bold uppercase tracking-[0.24em] text-primary mb-1">Навигация по вкусу</div>
                    <h2 className="text-xl font-logo font-bold uppercase tracking-wide">Разделы меню</h2>
                  </div>
                  <span className="text-[10px] text-text-main/40">{categories.length} разделов</span>
                </div>

                <div className="flex gap-3 overflow-x-auto no-scrollbar px-5">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => scrollToCategory(category.id)}
                      className="relative w-28 h-36 shrink-0 rounded-2xl overflow-hidden text-left shadow-md bg-anthracite"
                    >
                      {category.imageUrl ? (
                        <img src={category.imageUrl} alt={category.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="absolute inset-0 bg-anthracite" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                      <span className="absolute bottom-3 left-3 right-3 text-white text-[10px] font-bold uppercase tracking-wider leading-tight">
                        {category.name}
                      </span>
                    </button>
                  ))}
                </div>
              </section>

              <div className="sticky top-0 z-30 bg-background-light/95 backdrop-blur-md pt-4 border-b border-black/5 shadow-sm">
                <nav ref={tabsContainerRef} className="flex space-x-8 px-5 overflow-x-auto no-scrollbar w-full">
                  <button
                    id="tab-btn-all"
                    onClick={() => scrollToCategory('all')}
                    className={`pb-3 text-[11px] font-bold tracking-[0.2em] border-b-[2px] transition-colors whitespace-nowrap uppercase shrink-0 ${
                      activeCategoryId === 'all' ? 'border-primary text-text-main' : 'border-transparent text-text-main/40'
                    }`}
                  >
                    Все
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      id={`tab-btn-${category.id}`}
                      onClick={() => scrollToCategory(category.id)}
                      className={`pb-3 text-[11px] font-bold tracking-[0.2em] border-b-[2px] transition-colors whitespace-nowrap uppercase shrink-0 ${
                        activeCategoryId === category.id ? 'border-primary text-text-main' : 'border-transparent text-text-main/40'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="px-5 py-6 bg-background-light min-h-[50vh]">
                {categories.map((category) => {
                  const categoryItems = menuItems.filter((item) => item.categoryId === category.id);
                  if (categoryItems.length === 0) return null;

                  return (
                    <section key={category.id} id={`cat-${category.id}`} className="mb-5">
                      <div className="flex items-center gap-3 mb-6">
                        {category.imageUrl && (
                          <img src={category.imageUrl} alt="" className="w-10 h-10 rounded-xl object-cover" loading="lazy" />
                        )}
                        <h2 className="text-lg font-logo font-bold uppercase tracking-widest text-text-main">{category.name}</h2>
                        <div className="h-px flex-1 bg-black/5" />
                      </div>

                      <div className="grid grid-cols-2 gap-x-4">
                        {categoryItems.map((item) => (
                          <MenuGridItem
                            key={item.id}
                            item={item}
                            isSaved={favorites.has(item.id)}
                            onOpen={() => openDish(item, 'menu-grid')}
                            onSave={() => void toggleFavorite(item.id)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar bg-black">
          {vibeFeedItems.slice(0, 20).map((item) => (
            <VibeFeedItem
              key={item.id}
              item={item}
              isMuted={isMuted}
              isSaved={favorites.has(item.id)}
              toggleMute={() => setIsMuted((value) => !value)}
              onOpen={() => openDish(item, 'vibe')}
              onSave={() => void toggleFavorite(item.id)}
              onView={() =>
                void trackPilotEvent('vibe_item_view', {
                  dishId: item.id,
                  categoryId: item.categoryId,
                  source: 'vibe',
                })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};
