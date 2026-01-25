
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/GameContext';
import { STORIES } from '../../constants';

export const StoryViewer: React.FC = () => {
  const { activeStory, openStory, openProduct, menuItems } = useGameStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeStory) {
      setCurrentIndex(0);
    }
  }, [activeStory]);

  // Helper to go to next slide or next story
  const advance = () => {
      if (!activeStory) return;

      if (currentIndex < activeStory.slides.length - 1) {
          // Next slide in current story
          setCurrentIndex(prev => prev + 1);
      } else {
          // Check for next story
          const currentStoryIndex = STORIES.findIndex(s => s.id === activeStory.id);
          if (currentStoryIndex !== -1 && currentStoryIndex < STORIES.length - 1) {
              openStory(STORIES[currentStoryIndex + 1]);
          } else {
              openStory(null);
          }
      }
  };

  const goBack = () => {
      if (currentIndex > 0) {
          setCurrentIndex(prev => prev - 1);
      } else {
          // Optional: Go to previous story logic could be added here
          // For now, just reset or do nothing at start
      }
  };

  useEffect(() => {
    if (!activeStory) return;

    const timer = setInterval(() => {
      advance();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex, activeStory, openStory]);

  if (!activeStory) return null;

  const currentSlide = activeStory.slides[currentIndex];

  const handleTap = (e: React.MouseEvent) => {
      const width = window.innerWidth;
      const x = e.clientX;
      if (x > width / 2) {
          advance();
      } else {
          goBack();
      }
  };

  const handleDishClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (currentSlide.dishId) {
          const dish = menuItems.find(d => d.id === currentSlide.dishId);
          if (dish) {
              openStory(null);
              openProduct(dish);
          }
      }
  }

  return (
    <AnimatePresence>
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[70] bg-black flex items-center justify-center overflow-hidden"
        >
             {/* Progress Bars */}
             <div className="absolute top-4 left-0 w-full px-2 flex gap-1 z-20">
                {activeStory.slides.map((_, idx) => (
                    <div key={`${activeStory.id}-${idx}`} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: "0%" }}
                            animate={{ width: idx < currentIndex ? "100%" : idx === currentIndex ? "100%" : "0%" }}
                            transition={idx === currentIndex ? { duration: 5, ease: "linear" } : { duration: 0 }}
                            className="h-full bg-white"
                        />
                    </div>
                ))}
             </div>

             {/* Close Button */}
             <button onClick={() => openStory(null)} className="absolute top-6 right-4 z-30 text-white/80">
                <span className="material-symbols-outlined text-[24px]">close</span>
             </button>

             {/* Content */}
             <div className="relative w-full h-full" onClick={handleTap}>
                 <motion.img 
                    key={currentSlide.imageUrl}
                    src={currentSlide.imageUrl}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>

                 <div className="absolute bottom-12 left-0 w-full p-6 pb-safe-area-bottom">
                     <h2 className="text-white font-serif text-3xl italic mb-2 drop-shadow-lg">{currentSlide.title}</h2>
                     <p className="text-white/80 text-sm font-sans mb-6">{currentSlide.subtitle}</p>

                     {currentSlide.dishId && (
                         <button 
                            onClick={handleDishClick}
                            className="bg-white text-black px-6 py-3 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
                        >
                             <span>Смотреть Блюдо</span>
                             <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                         </button>
                     )}
                 </div>
             </div>
        </motion.div>
    </AnimatePresence>
  );
};
