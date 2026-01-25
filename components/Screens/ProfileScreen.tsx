
import React from 'react';
import { useGameStore } from '../../store/GameContext';

export const ProfileScreen: React.FC = () => {
  const { userProfile, visits, updatePreferences, menuItems, favorites, openProduct, setActiveTab, setMenuOpen, isAdmin } = useGameStore();

  // Helper to safely toggle preferences
  const togglePreference = (key: keyof typeof userProfile.preferences) => {
    updatePreferences({ [key]: !userProfile.preferences[key] });
  };

  const handleAdminClick = () => {
      if (isAdmin) {
          setActiveTab('admin');
      } else {
          setActiveTab('auth');
      }
  };

  const prefLabels: Record<string, {label: string, sub: string}> = {
      avoidGluten: { label: 'Без глютена', sub: 'Исключить пшеницу' },
      avoidLactose: { label: 'Без лактозы', sub: 'Без молочных продуктов' },
      spicyTolerance: { label: 'Острая пища', sub: 'Люблю поострее' }
  };

  const favoriteItems = menuItems.filter(item => favorites.has(item.id));
  const displayedFavorites = favoriteItems.length > 0 ? favoriteItems : menuItems.slice(0, 3); // Fallback visual

  return (
    <div className="flex h-full w-full flex-col bg-background-light text-text-main overflow-y-auto no-scrollbar pb-24">
       
       {/* Header */}
       <header className="sticky top-0 z-30 flex items-center bg-white/95 backdrop-blur-md px-6 py-4 justify-between border-b border-[#F0EAE5]">
        <button 
            className="text-text-main hover:text-primary transition-colors -ml-2 p-2" 
            onClick={() => setMenuOpen(true)}
        >
          <span className="material-icons-round text-3xl">menu</span>
        </button>
        <h2 className="text-text-main font-logo-custom text-xl tracking-widest uppercase font-bold">Профиль</h2>
        <button 
            onClick={handleAdminClick}
            className="text-text-main/70 hover:text-primary transition-colors -mr-2 p-2"
        >
          <span className="material-icons-round text-2xl">settings</span>
        </button>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center pt-10 pb-12 bg-background-soft relative">
        <div className="absolute top-0 left-0 w-full h-full bg-noise opacity-[0.03]"></div>
        
        <div className="relative mb-6 z-10">
            <div className="w-32 h-32 rounded-full p-1 border-2 border-primary/20 relative bg-white shadow-lg shadow-primary/10">
                <div className="w-full h-full rounded-full bg-cover bg-center grayscale contrast-110 brightness-110" style={{ backgroundImage: `url('${userProfile.avatarUrl}')` }}></div>
            </div>
            <button className="absolute bottom-1 right-1 bg-primary text-white rounded-full p-2.5 border-4 border-background-soft hover:scale-110 transition-transform shadow-md">
                <span className="material-icons-round text-[18px] block">edit</span>
            </button>
        </div>
        
        <h1 className="text-3xl font-serif text-text-main text-center mb-3 leading-tight z-10">{userProfile.name}</h1>
        
        <div className="px-5 py-2 border border-primary/30 rounded-full bg-white/80 backdrop-blur-sm shadow-sm z-10">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="material-icons-round text-sm">stars</span>
                Участник клуба: Гурман
            </span>
        </div>
      </div>

      <div className="rounded-t-[32px] bg-background-light -mt-6 pt-8 relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
          
          {/* Visit History */}
          <div className="px-6 mb-10">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h3 className="text-xl font-serif font-bold text-text-main">История визитов</h3>
                </div>
                <button className="text-[10px] font-bold text-primary uppercase tracking-widest border-b border-primary/30 pb-0.5 hover:border-primary transition-colors">Все</button>
            </div>
            
            <div className="flex flex-col gap-3">
                {visits.length === 0 ? (
                    <p className="text-text-main/40 text-sm italic text-center py-4 bg-background-soft rounded-xl">Пока нет истории визитов</p>
                ) : (
                    visits.slice(0, 2).map((visit) => (
                        <div key={visit.id} className="bg-white p-4 rounded-xl border border-[#F0EAE5] flex justify-between items-center group cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-background-soft flex items-center justify-center text-primary border border-[#E5E0DB] group-hover:bg-primary group-hover:text-white transition-colors">
                                    <span className="material-icons-round text-[24px]">restaurant</span>
                                </div>
                                <div>
                                    <h4 className="text-text-main font-serif text-lg leading-tight group-hover:text-primary transition-colors">{visit.restaurantName}</h4>
                                    <p className="text-[10px] text-text-main/50 mt-1 uppercase tracking-wide font-sans">{new Date(visit.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-text-main font-bold text-lg font-serif">{visit.totalAmount.toLocaleString()} ₽</span>
                                <div className="flex items-center gap-1 mt-1 text-primary text-[9px] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-opacity">
                                    <span>Чек</span>
                                    <span className="material-icons-round text-[12px]">receipt_long</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </div>

          {/* Preferences */}
          <div className="px-6 mb-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h3 className="text-xl font-serif font-bold text-text-main">Предпочтения</h3>
            </div>
            
            <div className="bg-white rounded-xl border border-[#F0EAE5] divide-y divide-[#F0EAE5] shadow-sm overflow-hidden">
                {['avoidGluten', 'avoidLactose', 'spicyTolerance'].map((key) => {
                    const info = prefLabels[key] || { label: key, sub: '' };
                    const isActive = userProfile.preferences[key as keyof typeof userProfile.preferences];
                    
                    return (
                    <div key={key} className="flex items-center justify-between p-5 hover:bg-background-soft transition-colors cursor-pointer" onClick={() => togglePreference(key as any)}>
                        <div>
                            <h4 className="text-text-main font-bold text-base">{info.label}</h4>
                            <p className="text-[10px] text-text-main/50 mt-1 uppercase tracking-wide font-sans">{info.sub}</p>
                        </div>
                        <div className={`w-12 h-7 rounded-full relative transition-all duration-300 ${isActive ? 'bg-primary' : 'bg-gray-200'}`}>
                            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${isActive ? 'left-6' : 'left-1'}`}></div>
                        </div>
                    </div>
                )})}
            </div>
          </div>

          {/* Favorites */}
          <div className="pl-6 mb-6">
             <div className="flex items-center justify-between mb-6 pr-6">
                <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-primary rounded-full"></div>
                    <h3 className="text-xl font-serif font-bold text-text-main">Избранное</h3>
                </div>
                <span className="text-[9px] font-bold text-primary uppercase tracking-widest border border-primary/20 bg-primary/5 px-2 py-1 rounded-lg">Свайп</span>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pr-6 pb-4">
                {displayedFavorites.map(item => (
                    <div key={item.id} onClick={() => openProduct(item)} className="shrink-0 w-40 group cursor-pointer">
                        <div className="aspect-[4/5] w-full relative rounded-2xl overflow-hidden bg-background-soft mb-3 shadow-md group-hover:shadow-lg transition-all duration-300">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url('${item.imageUrl}')` }}></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                            
                            <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-primary shadow-sm active:scale-90 transition-transform">
                                <span className="material-icons-round text-[18px] filled">favorite</span>
                            </button>
                            
                            <div className="absolute bottom-3 left-3">
                                 <span className="text-white font-bold text-lg font-serif drop-shadow-md">{item.price} ₽</span>
                            </div>
                        </div>
                        <h4 className="text-text-main font-serif text-lg leading-tight mb-1 group-hover:text-primary transition-colors">{item.name}</h4>
                        <span className="text-[10px] text-text-main/50 uppercase tracking-wider font-sans">Основное</span>
                    </div>
                ))}
            </div>
          </div>
      </div>

    </div>
  );
};
