import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../../store/GameContext';
import { trackPilotEvent } from '../../lib/analytics';

export const StoryViewer: React.FC = () => {
  const { activeStory, openStory, openProduct, menuItems, stories } = useGameStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeStory) setCurrentIndex(0);
  }, [activeStory]);

  const advance = () => {
    if (!activeStory) return;

    if (currentIndex < activeStory.slides.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    const storyIndex = stories.findIndex((story) => story.id === activeStory.id);
    if (storyIndex >= 0 && storyIndex < stories.length - 1) {
      openStory(stories[storyIndex + 1]);
    } else {
      openStory(null);
    }
  };

  const goBack = () => {
    if (!activeStory) return;

    if (currentIndex > 0) {
      setCurrentIndex((index) => index - 1);
      return;
    }

    const storyIndex = stories.findIndex((story) => story.id === activeStory.id);
    if (storyIndex > 0) {
      const previousStory = stories[storyIndex - 1];
      openStory(previousStory);
      window.setTimeout(() => {
        setCurrentIndex(Math.max(0, previousStory.slides.length - 1));
      }, 0);
    }
  };

  useEffect(() => {
    if (!activeStory) return;

    const timer = window.setTimeout(advance, 5500);
    return () => window.clearTimeout(timer);
  }, [activeStory, currentIndex]);

  if (!activeStory) return null;

  const currentSlide = activeStory.slides[currentIndex];
  if (!currentSlide) return null;

  const handleTap = (event: React.MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = event.clientX - bounds.left;

    if (relativeX > bounds.width / 2) advance();
    else goBack();
  };

  const handleDishClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (!currentSlide.dishId) return;

    const dish = menuItems.find((item) => item.id === currentSlide.dishId || item.slug === currentSlide.dishId);
    if (!dish) return;

    void trackPilotEvent('dish_open', {
      dishId: dish.id,
      categoryId: dish.categoryId,
      source: 'story',
      metadata: { storyId: activeStory.id },
    });

    openStory(null);
    openProduct(dish);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
        transition={{ duration: 0.24 }}
        className="fixed inset-0 z-[70] bg-anthracite flex justify-center"
      >
        <div className="relative w-full max-w-md h-[100dvh] overflow-hidden bg-anthracite">
          <div className="absolute top-0 left-0 right-0 h-[7px] restaurant-wall z-40" />

          <div className="absolute top-5 left-0 right-0 px-4 flex gap-1.5 z-30">
            {activeStory.slides.map((_, index) => (
              <div
                key={`${activeStory.id}-${index}`}
                className="h-[3px] flex-1 bg-white/20 rounded-full overflow-hidden"
              >
                <motion.div
                  key={`${activeStory.id}-${currentIndex}-${index}`}
                  initial={{ width: index < currentIndex ? '100%' : '0%' }}
                  animate={{
                    width:
                      index < currentIndex
                        ? '100%'
                        : index === currentIndex
                          ? '100%'
                          : '0%',
                  }}
                  transition={
                    index === currentIndex
                      ? { duration: 5.5, ease: 'linear' }
                      : { duration: 0 }
                  }
                  className="h-full bg-primary"
                />
              </div>
            ))}
          </div>

          <div className="absolute top-10 left-5 right-5 z-30 flex items-center justify-between">
            <div>
              <div className="text-[9px] uppercase tracking-[0.28em] font-bold text-primary mb-1">
                Маргарита · Stories
              </div>
              <div className="text-white/80 text-[10px] uppercase tracking-[0.14em] font-bold whitespace-pre-line leading-tight">
                {activeStory.title}
              </div>
            </div>
            <button
              onClick={() => openStory(null)}
              className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md border border-white/15 flex items-center justify-center text-white"
              aria-label="Закрыть"
            >
              <span className="material-icons-round text-xl">close</span>
            </button>
          </div>

          <div className="relative w-full h-full" onClick={handleTap}>
            {currentSlide.imageUrl ? (
              <motion.img
                key={currentSlide.imageUrl}
                src={currentSlide.imageUrl}
                alt={currentSlide.title}
                initial={{ opacity: 0.6, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-anthracite flex items-center justify-center">
                <span className="font-logo text-primary text-2xl uppercase tracking-[0.24em]">
                  Маргарита
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/90 pointer-events-none" />

            <div className="absolute bottom-0 left-0 right-0 p-6 pb-12 z-20">
              <div className="w-10 h-px bg-primary mb-4" />
              <h2 className="text-white font-logo text-3xl font-bold uppercase tracking-[0.04em] leading-[1.05] mb-3 drop-shadow-lg">
                {currentSlide.title}
              </h2>
              <p className="text-white/75 text-sm font-sans leading-relaxed max-w-[88%] mb-6">
                {currentSlide.subtitle}
              </p>

              {currentSlide.dishId && (
                <button
                  onClick={handleDishClick}
                  className="bg-primary text-white px-5 py-3.5 rounded-xl font-bold text-[10px] uppercase tracking-[0.18em] flex items-center gap-2 shadow-xl active:scale-[0.98] transition-transform"
                >
                  <span>Открыть блюдо</span>
                  <span className="material-icons-round text-base">arrow_forward</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
