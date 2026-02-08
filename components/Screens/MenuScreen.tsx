
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useGameStore } from '../../store/GameContext';
import { Dish } from '../../types';

// --- SUB-COMPONENT: Grid Item with Swipe ---
const MenuGridItem: React.FC<{ item: Dish; onClick: () => void }> = ({ item, onClick }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const width = scrollRef.current.offsetWidth;
            const scrollLeft = scrollRef.current.scrollLeft;
            const newIndex = Math.round(scrollLeft / width);
            setActiveIndex(newIndex);
            
            // Play video if it's the active slide
            if (newIndex === 1 && videoRef.current) {
                videoRef.current.play().catch(e => console.warn("Swipe play failed", e));
            } else if (newIndex === 0 && videoRef.current) {
                videoRef.current.pause();
            }
        }
    };

    // Autoplay hack for iOS
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.defaultMuted = true;
            videoRef.current.muted = true;
        }
    }, [item.videoUrl]);

    const hasVideo = !!item.videoUrl;

    return (
        <div className="group cursor-pointer mb-8" onClick={onClick}>
            <div className="relative rounded-xl overflow-hidden aspect-[3/4] mb-3 bg-gray-100 shadow-sm border border-black/5">
                
                {/* Carousel Container */}
                <div 
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
                >
                    {/* Slide 1: Image */}
                    <div className="w-full h-full flex-shrink-0 snap-center relative">
                        <img 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                            src={item.imageUrl} 
                            loading="lazy"
                        />
                    </div>

                    {/* Slide 2: Video (Only if exists) */}
                    {hasVideo && (
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

                {/* Price Tag (Always Visible) */}
                <div className="absolute top-2 right-2 z-10">
                    <div className="bg-anthracite/90 backdrop-blur px-2 py-1 rounded-md shadow-sm border border-white/10">
                        <span className="text-xs font-bold text-primary tabular-nums">{item.price} ₽</span>
                    </div>
                </div>

                {/* Dots Indicator (Only if video exists) */}
                {hasVideo && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                        <div className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${activeIndex === 0 ? 'bg-white scale-125' : 'bg-white/40'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all ${activeIndex === 1 ? 'bg-primary scale-125' : 'bg-white/40'}`}></div>
                    </div>
                )}
            </div>

            <div className="px-1">
                <h3 className="font-bold text-[12px] uppercase tracking-wide leading-tight mb-1 text-text-main">{item.name}</h3>
                <p className="text-[10px] text-text-main/60 leading-relaxed font-sans line-clamp-2">{item.description}</p>
            </div>
        </div>
    );
};

// --- SUB-COMPONENT: Vibe Feed Item (Fixes Hook Error) ---
const VibeFeedItem: React.FC<{ 
    item: Dish; 
    isMuted: boolean; 
    toggleMute: () => void;
    onOpen: () => void;
    onAdd: () => void;
}> = ({ item, isMuted, toggleMute, onOpen, onAdd }) => {
    const vRef = useRef<HTMLVideoElement>(null);

    // Vibe Feed Autoplay Logic
    useEffect(() => {
        if (vRef.current) {
            vRef.current.defaultMuted = true;
            vRef.current.muted = true; // Ensure mute property is set on DOM element
            vRef.current.play().catch(e => console.log("Autoplay prevented", e));
        }
    }, []);

    return (
        <div className="w-full h-full snap-start relative shrink-0">
            {item.videoUrl ? (
                    <div className="w-full h-full relative">
                    <video 
                        ref={vRef}
                        src={item.videoUrl} 
                        className="w-full h-full object-cover" 
                        autoPlay 
                        muted={isMuted} // React prop
                        loop 
                        playsInline 
                    />
                    {/* Mute Toggle */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                        className="absolute top-24 right-4 z-20 w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white/80 hover:bg-black/60 transition"
                    >
                        <span className="material-icons-round text-xl">
                            {isMuted ? 'volume_off' : 'volume_up'}
                        </span>
                    </button>
                    </div>
            ) : (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none"></div>

            <div className="absolute bottom-24 left-0 w-full px-6 text-white pb-6 z-10">
                <div className="flex justify-between items-end mb-4">
                        <div className="flex-1 pr-4">
                        <div className="flex gap-2 mb-2">
                            {item.badges.length > 0 && (
                                <span className="inline-block bg-primary/90 text-anthracite text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
                                    {item.badges[0]}
                                </span>
                            )}
                            {item.abv && (
                                <span className="inline-block bg-white/20 backdrop-blur text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-sm">
                                    ABV {item.abv}%
                                </span>
                            )}
                        </div>
                        <h2 className="text-3xl font-logo font-bold uppercase tracking-wider mb-2 leading-none drop-shadow-md">{item.name}</h2>
                        <p className="text-sm text-white/80 line-clamp-3 font-light leading-relaxed">{item.description}</p>
                        </div>
                        <div className="text-3xl font-bold text-primary font-mono whitespace-nowrap">{item.price} ₽</div>
                </div>
                
                <div className="mt-6 flex gap-3">
                    <button 
                        onClick={onOpen}
                        className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-white/20 transition-colors"
                    >
                        Подробнее
                    </button>
                        <button 
                        onClick={onAdd}
                        className="w-14 h-14 bg-primary text-anthracite rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-primary/30"
                    >
                        <span className="material-icons-round text-2xl">add</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export const MenuScreen: React.FC = () => {
  const { 
    openProduct, 
    openStory, 
    openCollection, 
    menuItems, 
    categories, 
    isLoading, 
    addToOrder,
    setMenuOpen,
    setActiveTab,
    stories,      
    collections   
  } = useGameStore();
  
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'mood'>('grid');
  
  // Stories Scroll State
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  
  // Mood View State
  const [isMuted, setIsMuted] = useState(true);

  const isProgrammaticScroll = useRef(false);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const storiesContainerRef = useRef<HTMLDivElement>(null);

  // --- VIBE FEED LOGIC (UPDATED SORTING) ---
  const vibeFeedItems = useMemo(() => {
      const withVideo: any[] = [];
      const withoutVideo: any[] = [];

      menuItems.forEach(item => {
          if (item.videoUrl) {
              withVideo.push(item);
          } else {
              withoutVideo.push(item);
          }
      });

      // Shuffle both lists for discovery so it's not static
      const shuffledWithVideo = withVideo.sort(() => Math.random() - 0.5);
      const shuffledWithoutVideo = withoutVideo.sort(() => Math.random() - 0.5);

      // Prioritize items with video
      return [...shuffledWithVideo, ...shuffledWithoutVideo];
  }, [menuItems]);
  // -----------------------

  useEffect(() => {
    const tabsContainer = tabsContainerRef.current;
    if (tabsContainer) {
        const activeTab = document.getElementById(`tab-btn-${activeCategoryId}`);
        if (activeTab) {
            const tabLeft = activeTab.offsetLeft;
            const tabWidth = activeTab.offsetWidth;
            const containerWidth = tabsContainer.clientWidth;
            const targetLeft = tabLeft - (containerWidth / 2) + (tabWidth / 2);
            tabsContainer.scrollTo({ left: targetLeft, behavior: 'smooth' });
        }
    }
  }, [activeCategoryId]);

  const scrollToCategory = (catId: string) => {
      isProgrammaticScroll.current = true;
      setActiveCategoryId(catId);
      const container = scrollContainerRef.current;
      if (container) {
          if (catId === 'all') {
               container.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
              const el = document.getElementById(`cat-${catId}`);
              if (el) {
                  const stickyHeaderHeight = 65; 
                  const targetTop = el.offsetTop - stickyHeaderHeight;
                  container.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
              }
          }
      }
      setTimeout(() => { isProgrammaticScroll.current = false; }, 800);
  };

  const handleContentScroll = (e: React.UIEvent<HTMLDivElement>) => {
      if (isProgrammaticScroll.current) return;
      const container = e.currentTarget;
      const scrollTop = container.scrollTop;
      const stickyHeaderHeight = 65;
      if (scrollTop < 50) {
          if (activeCategoryId !== 'all') setActiveCategoryId('all');
          return;
      }
      const scrollOffset = scrollTop + stickyHeaderHeight + 20; 
      let currentId = 'all';
      for (const cat of categories) {
          const el = document.getElementById(`cat-${cat.id}`);
          if (el) {
              if (el.offsetTop <= scrollOffset) {
                  currentId = cat.id;
              }
          }
      }
      if (currentId !== activeCategoryId) {
          setActiveCategoryId(currentId);
      }
  };

  const handleStoriesScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const itemWidth = 80; 
      const scrollLeft = container.scrollLeft;
      const index = Math.round(scrollLeft / itemWidth);
      setActiveStoryIndex(Math.min(stories.length, Math.max(0, index)));
  };

  if (isLoading) {
    return (
        <div className="flex flex-col h-full items-center justify-center bg-background-light text-text-main">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="opacity-50 text-xs uppercase tracking-widest font-bold">Загрузка меню...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background-light text-text-main font-sans">
      
      {/* 1. Header */}
      <header className="flex justify-between items-center px-5 pt-6 pb-4 bg-background-light z-10 shrink-0 shadow-sm border-b border-black/5">
         <div className="flex items-center gap-4">
            <button 
              onClick={() => setMenuOpen(true)}
              className="p-1 -ml-1 rounded-full hover:bg-black/5 transition text-text-main"
            >
              <span className="material-icons-round text-3xl">menu</span>
            </button>
            <h1 className="text-2xl font-logo font-bold tracking-[0.2em] uppercase text-text-main pt-1">
                {viewMode === 'grid' ? 'МЕНЮ' : 'VIBE'}
            </h1>
         </div>
         
        <div className="flex items-center space-x-2 text-sm font-medium bg-background-soft rounded-full p-1 border border-black/5">
            <button 
                onClick={() => setViewMode('grid')}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-anthracite shadow-md text-primary' : 'text-text-main/40'}`}
            >
                <span className="material-icons-round text-xl">grid_view</span>
            </button>
            <button 
                 onClick={() => setViewMode('mood')}
                 className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${viewMode === 'mood' ? 'bg-anthracite shadow-md text-primary' : 'text-text-main/40'}`}
            >
                <span className="material-icons-round text-xl">play_arrow</span>
            </button>
        </div>
      </header>

      {/* Main Content Area */}
      {viewMode === 'grid' ? (
      <div 
        id="menu-scroll-container"
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar pb-32 scroll-smooth relative"
        onScroll={handleContentScroll}
      >
        
        {/* 2. Stories with Indicators */}
        <div className="relative pt-6 pb-2">
            {/* Dots Indicator */}
            <div className="flex justify-center gap-1.5 mb-2">
                {stories.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1.5 rounded-full transition-all duration-300 ${activeStoryIndex === idx ? 'w-4 bg-primary' : 'w-1.5 bg-gray-300'}`}
                    />
                ))}
            </div>

            <section 
                ref={storiesContainerRef}
                onScroll={handleStoriesScroll}
                className="flex space-x-6 px-5 py-2 overflow-x-auto no-scrollbar w-full items-start snap-x"
            >
                {stories.map((story) => (
                    <div key={story.id} onClick={() => openStory(story)} className="flex flex-col items-center flex-shrink-0 space-y-2 cursor-pointer group w-[72px] snap-center">
                        <div className={`w-[72px] h-[72px] rounded-full p-[2px] border ${story.colorRing.includes('gold') ? 'border-primary' : 'border-primary/30'} transition-all group-hover:scale-105`}>
                            <div className="w-full h-full rounded-full border-2 border-background-light overflow-hidden">
                                <img alt={story.title} className="w-full h-full object-cover" src={story.previewImage} />
                            </div>
                        </div>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-text-main text-center whitespace-pre-line leading-tight">{story.title}</span>
                    </div>
                ))}
                
                 {/* Featured Events */}
                 <div 
                    onClick={() => setActiveTab('events')} 
                    className="flex flex-col items-center flex-shrink-0 space-y-2 cursor-pointer w-[72px] snap-center group relative z-10"
                 >
                    <div className="w-[72px] h-[72px] rounded-full p-[2px] border-2 border-primary/80 relative transition-transform duration-300 group-hover:scale-110">
                        <div className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-pulse"></div>
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary via-[#D4AF37] to-[#B8860B] flex items-center justify-center relative z-10 shadow-inner">
                            <span className="material-icons-round text-white text-3xl drop-shadow-md">calendar_month</span>
                        </div>
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white z-20">
                            NEW
                        </div>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-primary drop-shadow-sm group-hover:text-[#A08040] transition-colors">Афиша</span>
                </div>
            </section>
        </div>

        {/* 3. Collections */}
        <section className="flex space-x-4 px-5 py-2 overflow-x-auto no-scrollbar w-full">
            {collections.map((col) => (
                <div key={col.id} onClick={() => openCollection(col)} className="relative w-64 h-36 flex-shrink-0 rounded-xl overflow-hidden shadow-lg group cursor-pointer">
                    <img alt={col.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={col.imageUrl} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                        <span className="text-[9px] text-primary font-bold uppercase tracking-widest bg-black/50 backdrop-blur px-2 py-1 rounded mb-2 inline-block">Сет</span>
                        <h3 className="text-white font-logo font-bold text-lg uppercase tracking-wider leading-none">{col.title}</h3>
                    </div>
                </div>
            ))}
        </section>

        {/* 4. Zigzag Divider */}
        <div className="w-full h-10 restaurant-wall mt-6 mb-2"></div>

        {/* 5. Category Tabs (Sticky) */}
        <div className="sticky top-0 z-30 bg-background-light/95 backdrop-blur-md pt-4 pb-0 border-b border-black/5 shadow-sm">
            <nav 
                ref={tabsContainerRef}
                className="flex space-x-8 px-5 overflow-x-auto no-scrollbar w-full relative"
            >
                <button
                    id="tab-btn-all"
                    onClick={() => scrollToCategory('all')}
                    className={`pb-3 text-[11px] font-bold tracking-[0.2em] border-b-[2px] transition-colors whitespace-nowrap uppercase flex-shrink-0 ${activeCategoryId === 'all' ? 'border-primary text-text-main' : 'border-transparent text-text-main/40 hover:text-text-main'}`}
                >
                    ВСЕ
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        id={`tab-btn-${cat.id}`}
                        onClick={() => scrollToCategory(cat.id)}
                        className={`pb-3 text-[11px] font-bold tracking-[0.2em] border-b-[2px] transition-colors whitespace-nowrap uppercase flex-shrink-0 ${activeCategoryId === cat.id ? 'border-primary text-text-main' : 'border-transparent text-text-main/40 hover:text-text-main'}`}
                    >
                        {cat.name}
                    </button>
                ))}
            </nav>
        </div>

        {/* 6. Product List (Updated with Swipeable Grid Items) */}
        <div className="px-5 py-6 bg-background-light min-h-[50vh]">
            {categories.map(category => {
                const categoryItems = menuItems.filter(item => item.categoryId === category.id);
                if (categoryItems.length === 0) return null;

                return (
                    <section key={category.id} id={`cat-${category.id}`} className="mb-4">
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-lg font-logo font-bold uppercase tracking-widest text-text-main">{category.name}</h2>
                            <div className="h-[1px] flex-1 bg-black/5"></div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-x-4">
                            {categoryItems.map((item) => (
                                <MenuGridItem 
                                    key={item.id} 
                                    item={item} 
                                    onClick={() => openProduct(item)} 
                                />
                            ))}
                        </div>
                    </section>
                )
            })}
        </div>
      </div>
      ) : (
        /* Mood View (FIXED: Extracted Component) */
        <div className="flex-1 h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth no-scrollbar bg-black pb-0">
            {vibeFeedItems.slice(0, 20).map((item) => (
                <VibeFeedItem 
                    key={item.id}
                    item={item}
                    isMuted={isMuted}
                    toggleMute={() => setIsMuted(!isMuted)}
                    onOpen={() => openProduct(item)}
                    onAdd={() => addToOrder({ dishId: item.id, quantity: 1 })}
                />
            ))}
        </div>
      )}
    </div>
  );
};
