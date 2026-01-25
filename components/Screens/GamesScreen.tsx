
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/GameContext';
import { SECRET_MENU_ITEMS, REDEEM_ITEMS, QUIZ_QUESTIONS } from '../../constants';

type GameView = 'hub' | 'roulette' | 'quiz' | 'match3';

interface MatchItem {
    id: number;
    icon: string;
    isNew?: boolean; // To animate entry differently if needed
}

export const GamesScreen: React.FC = () => {
  const { userProfile, setMenuOpen, participants } = useGameStore();
  const [activeView, setActiveView] = useState<GameView>('hub');

  // --- SUB-COMPONENTS ---

  // 1. ROULETTE GAME (Randomized)
  const RouletteGame = () => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winnerId, setWinnerId] = useState<string | null>(null);

    const handleSpin = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setWinnerId(null);

        // 1. Random Selection (Anyone can lose)
        const targetIndex = Math.floor(Math.random() * participants.length);
        
        // 2. Calculate the Angle to point at Target
        // Participants are placed visually at: (idx * 360 / N) - 90 degrees
        const segmentAngle = 360 / participants.length;
        const targetVisualAngle = (targetIndex * segmentAngle) - 90;
        
        // The bottle image points UP at 0deg.
        // Participant 0 is at -90deg (Top).
        // To point at P0, Bottle needs to be at 0deg.
        // To point at any PX (angle A), Bottle needs to rotate by (A - (-90)) = A + 90.
        const targetBottleAngle = targetVisualAngle + 90;
        
        // 3. Calculate smooth rotation
        const minSpins = 5 * 360; // Minimum 5 full turns
        
        // We want the new rotation to be: currentRotation + minSpins + difference to align with target
        const baseNextRotation = rotation + minSpins;
        
        // Normalize angles to 0-360 for calculation
        const currentMod = (baseNextRotation % 360 + 360) % 360;
        const targetMod = (targetBottleAngle % 360 + 360) % 360;
        
        // Calculate the forward distance needed to reach targetMod from currentMod
        let diff = targetMod - currentMod;
        if (diff < 0) diff += 360; // Ensure we always rotate forward (clockwise)
        
        const newRotation = baseNextRotation + diff;
        setRotation(newRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setWinnerId(participants[targetIndex].id);
        }, 4000); 
    };

    return (
        <div className="flex flex-col h-full bg-anthracite text-white relative overflow-hidden">
             <div className="absolute inset-0 bg-noise opacity-10"></div>
             
             {/* Header */}
             <div className="p-4 flex items-center justify-between z-10">
                 <button onClick={() => setActiveView('hub')} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                     <span className="material-icons-round">arrow_back</span>
                 </button>
                 <h2 className="font-logo font-bold text-xl uppercase tracking-widest text-primary">Рулетка</h2>
                 <div className="w-10"></div>
             </div>

             <div className="flex-1 flex flex-col items-center justify-center relative">
                 {/* Table Area */}
                 <div className="relative w-72 h-72 rounded-full border-4 border-white/10 flex items-center justify-center bg-[#2c2c2e] shadow-2xl">
                     
                     {/* Participants (Avatars) */}
                     {participants.map((p, idx) => {
                         const angle = (idx * (360 / participants.length)) - 90; 
                         return (
                             <div 
                                key={p.id}
                                className="absolute w-14 h-14 rounded-full border-2 border-primary shadow-lg overflow-hidden transition-all duration-300"
                                style={{ 
                                    transform: `rotate(${angle}deg) translate(${145}px) rotate(${-angle}deg)`, // Keep avatar upright
                                    borderColor: winnerId === p.id ? '#ef4444' : '#C5A059', // Red for loser
                                    scale: winnerId === p.id ? 1.2 : 1,
                                    boxShadow: winnerId === p.id ? '0 0 20px rgba(239, 68, 68, 0.6)' : ''
                                }}
                             >
                                 <img src={p.avatarUrl} className="w-full h-full object-cover" />
                             </div>
                         )
                     })}

                     {/* The Bottle (Pointer) */}
                     <div 
                        className="relative w-16 h-48 transition-transform duration-[4000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                        style={{ transform: `rotate(${rotation}deg)` }}
                     >
                        {/* Simple CSS Bottle Shape */}
                        <div className="w-12 h-32 bg-green-800 mx-auto rounded-b-lg rounded-t-3xl border-2 border-green-600 relative overflow-hidden shadow-xl">
                            <div className="absolute top-10 left-0 w-full h-12 bg-yellow-100/10 rotate-12 scale-125"></div>
                            {/* Label */}
                            <div className="absolute top-16 left-2 w-8 h-8 bg-white/80 rounded-sm"></div>
                        </div>
                        <div className="w-4 h-12 bg-green-700 mx-auto -mt-1 border-x-2 border-green-600"></div>
                        <div className="w-6 h-4 bg-gold mx-auto -mt-12 rounded-sm relative z-10"></div>
                     </div>

                 </div>
                 
                 {/* Status Text */}
                 <div className="mt-12 text-center h-20 px-6">
                     {winnerId ? (
                         <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                            <p className="text-white/60 text-xs uppercase tracking-widest font-bold mb-2">Не повезло...</p>
                            <div className="bg-red-500/20 border border-red-500 p-4 rounded-xl">
                                <p className="text-sm font-bold text-white uppercase tracking-wider">
                                    Платит теперь: <span className="text-red-400 text-lg block mt-1">{participants.find(p => p.id === winnerId)?.nickname}</span>
                                </p>
                            </div>
                         </motion.div>
                     ) : (
                         <p className="text-white/40 text-xs uppercase tracking-widest animate-pulse">
                             {isSpinning ? 'Выбираем жертву...' : 'Крутите бутылочку, чтобы узнать кто платит'}
                         </p>
                     )}
                 </div>

                 <button 
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="mt-4 bg-primary text-black font-bold uppercase tracking-widest px-10 py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                     Крутить
                 </button>
             </div>
        </div>
    );
  };

  // 2. QUIZ GAME (Redesigned)
  const QuizGame = () => {
      const [qIndex, setQIndex] = useState(0);
      const [score, setScore] = useState(0);
      const [showResult, setShowResult] = useState(false);
      const [selectedOption, setSelectedOption] = useState<number | null>(null);

      const currentQ = QUIZ_QUESTIONS[qIndex];
      const progress = ((qIndex) / QUIZ_QUESTIONS.length) * 100;

      const handleAnswer = (optIdx: number) => {
          if (selectedOption !== null) return;
          setSelectedOption(optIdx);
          const correct = optIdx === currentQ.answer;
          if (correct) setScore(s => s + 50);

          setTimeout(() => {
              if (qIndex < QUIZ_QUESTIONS.length - 1) {
                  setQIndex(qIndex + 1);
                  setSelectedOption(null);
              } else {
                  setShowResult(true);
              }
          }, 1200);
      };

      if (showResult) {
          return (
              <div className="flex flex-col h-full bg-[#1e293b] text-white p-6 items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-[#1e293b] to-[#1e293b]"></div>
                  
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative z-10 w-32 h-32 bg-primary rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(197,160,89,0.4)]">
                      <span className="material-icons-round text-6xl text-anthracite">emoji_events</span>
                  </motion.div>
                  
                  <h2 className="relative z-10 text-4xl font-logo font-bold uppercase mb-2 text-white">Победа!</h2>
                  <p className="relative z-10 text-white/60 mb-8 font-mono">Вы заработали +{score} XP</p>
                  
                  <button onClick={() => setActiveView('hub')} className="relative z-10 w-full bg-white text-anthracite font-bold py-4 rounded-xl uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                      В меню
                  </button>
              </div>
          )
      }

      return (
          <div className="flex flex-col h-full bg-[#1e293b] text-white relative font-sans">
              <div className="absolute inset-0 bg-noise opacity-5"></div>

              {/* Header */}
              <div className="p-6 pb-2 pt-8 z-10">
                 <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setActiveView('hub')} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                        <span className="material-icons-round">arrow_back</span>
                    </button>
                    <div className="bg-white/10 px-3 py-1 rounded-full border border-white/10">
                        <span className="text-xs font-bold font-mono tracking-widest">{qIndex + 1} / {QUIZ_QUESTIONS.length}</span>
                    </div>
                 </div>
                 
                 {/* Progress Bar */}
                 <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                     <motion.div 
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-blue-400 to-purple-500"
                     />
                 </div>
             </div>

             <div className="flex-1 px-6 pb-8 flex flex-col justify-center max-w-md mx-auto w-full z-10">
                 <AnimatePresence mode="wait">
                    <motion.div 
                        key={qIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="mb-8"
                    >
                         <h3 className="text-2xl font-bold leading-snug drop-shadow-md">{currentQ.question}</h3>
                    </motion.div>
                 </AnimatePresence>

                 <div className="space-y-3">
                     {currentQ.options.map((opt, idx) => {
                         let stateStyles = 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10';
                         let icon = null;

                         if (selectedOption !== null) {
                             if (idx === currentQ.answer) {
                                 stateStyles = 'bg-green-500 text-white border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
                                 icon = 'check_circle';
                             } else if (idx === selectedOption) {
                                 stateStyles = 'bg-red-500 text-white border-red-500';
                                 icon = 'cancel';
                             } else {
                                 stateStyles = 'opacity-30 border-transparent';
                             }
                         }

                         return (
                            <button 
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                disabled={selectedOption !== null}
                                className={`w-full py-4 px-5 rounded-2xl border-2 font-bold text-left transition-all duration-300 flex items-center justify-between group ${stateStyles}`}
                            >
                                <span>{opt}</span>
                                {icon && <span className="material-icons-round">{icon}</span>}
                                {!icon && <span className="w-4 h-4 rounded-full border-2 border-white/20 group-hover:border-white/60"></span>}
                            </button>
                         )
                     })}
                 </div>
             </div>
          </div>
      );
  };

  // 3. MATCH 3 GAME (With Cascade & Validation)
  const Match3Game = () => {
    // Game Config
    const GRID_SIZE = 7;
    const SYMBOLS = ['🍕', '🍔', '🍟', '🥤', '🍦', '🥑'];
    
    // Using objects with unique IDs for layout animation
    const [grid, setGrid] = useState<MatchItem[][]>([]);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState<{r:number, c:number} | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [shakingIds, setShakingIds] = useState<Set<number>>(new Set());
    
    // Global ID counter for generating unique keys
    const nextIdRef = useRef(0);

    // Helpers
    const getNextId = () => {
        nextIdRef.current += 1;
        return nextIdRef.current;
    }

    const randomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

    const createItem = (): MatchItem => ({
        id: getNextId(),
        icon: randomSymbol(),
        isNew: true
    });

    const createGrid = () => {
        const newGrid: MatchItem[][] = [];
        for(let r=0; r<GRID_SIZE; r++) {
            const row: MatchItem[] = [];
            for(let c=0; c<GRID_SIZE; c++) {
                row.push(createItem());
            }
            newGrid.push(row);
        }
        return newGrid;
    };

    // Init
    useEffect(() => {
        const initialGrid = createGrid();
        // Prevent initial matches on load? Or just let them clear. 
        // Let's just set it, if it matches, user gets free points on first click logic or we clean it.
        // For simplicity, we just set it.
        setGrid(initialGrid);
    }, []);

    const findMatches = (currentGrid: MatchItem[][]) => {
        const matched = new Set<string>();
        // Horizontal
        for(let r=0; r<GRID_SIZE; r++) {
            for(let c=0; c<GRID_SIZE-2; c++) {
                const sym = currentGrid[r][c].icon;
                if(sym && sym === currentGrid[r][c+1].icon && sym === currentGrid[r][c+2].icon) {
                    matched.add(`${r},${c}`);
                    matched.add(`${r},${c+1}`);
                    matched.add(`${r},${c+2}`);
                }
            }
        }
        // Vertical
        for(let r=0; r<GRID_SIZE-2; r++) {
            for(let c=0; c<GRID_SIZE; c++) {
                const sym = currentGrid[r][c].icon;
                if(sym && sym === currentGrid[r+1][c].icon && sym === currentGrid[r+2][c].icon) {
                    matched.add(`${r},${c}`);
                    matched.add(`${r+1},${c}`);
                    matched.add(`${r+2},${c}`);
                }
            }
        }
        return Array.from(matched).map(str => {
            const [r, c] = str.split(',').map(Number);
            return {r, c};
        });
    };

    // Main Game Loop (Cascade)
    const processBoard = async (currentGrid: MatchItem[][]) => {
        const matches = findMatches(currentGrid);
        
        if (matches.length === 0) {
            setIsProcessing(false);
            return;
        }

        // 1. Highlight/Score
        let points = matches.length * 10;
        setScore(s => s + points);

        // 2. Identify which cells are to be removed
        const toRemove = new Set(matches.map(m => `${m.r},${m.c}`));

        // 3. Construct new Columns (Gravity)
        const nextGrid: MatchItem[][] = Array(GRID_SIZE).fill(null).map(() => []);

        for (let c = 0; c < GRID_SIZE; c++) {
            // Get items NOT removed
            const existingItems: MatchItem[] = [];
            for (let r = 0; r < GRID_SIZE; r++) {
                if (!toRemove.has(`${r},${c}`)) {
                    existingItems.push(currentGrid[r][c]);
                }
            }

            const missingCount = GRID_SIZE - existingItems.length;
            const newItems: MatchItem[] = [];
            for(let i=0; i<missingCount; i++) {
                newItems.push(createItem());
            }

            // [New items at TOP, Existing shifted DOWN]
            const newColumn = [...newItems, ...existingItems];
            
            for(let r=0; r<GRID_SIZE; r++) {
                if (!nextGrid[r]) nextGrid[r] = [];
                nextGrid[r][c] = newColumn[r];
            }
        }

        // 4. Update Grid & Wait for animation
        setGrid(nextGrid);
        
        // Wait for layout animation (falling)
        await new Promise(resolve => setTimeout(resolve, 600));

        // 5. Recursion: Check for new matches
        await processBoard(nextGrid);
    };

    const handleCellClick = async (r: number, c: number) => {
        if (isProcessing) return;

        if (!selected) {
            setSelected({r, c});
            return;
        }

        const isAdjacent = Math.abs(selected.r - r) + Math.abs(selected.c - c) === 1;

        if (isAdjacent) {
            setIsProcessing(true);
            
            // 1. Try Swap
            const tempGrid = grid.map(row => [...row]);
            const item1 = tempGrid[selected.r][selected.c];
            const item2 = tempGrid[r][c];
            
            tempGrid[r][c] = item1;
            tempGrid[selected.r][selected.c] = item2;
            
            setGrid(tempGrid);
            setSelected(null);

            // Wait for swap animation
            await new Promise(resolve => setTimeout(resolve, 300));

            // 2. Validate
            const matches = findMatches(tempGrid);
            
            if (matches.length > 0) {
                // Valid Swap -> Start Cascade
                await processBoard(tempGrid);
            } else {
                // Invalid Swap -> Shake & Revert
                setShakingIds(new Set([item1.id, item2.id]));
                
                await new Promise(resolve => setTimeout(resolve, 400));
                
                // Revert
                const revertedGrid = tempGrid.map(row => [...row]);
                revertedGrid[r][c] = item2;
                revertedGrid[selected.r][selected.c] = item1;
                setGrid(revertedGrid);
                setShakingIds(new Set());
                setIsProcessing(false);
            }
        } else {
            setSelected({r, c}); // Just change selection
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#fdf6e3] text-anthracite relative font-sans">
             {/* Header */}
             <div className="p-4 flex items-center justify-between bg-white shadow-sm z-10">
                 <button onClick={() => setActiveView('hub')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-text-main">
                     <span className="material-icons-round">arrow_back</span>
                 </button>
                 <div className="flex flex-col items-center">
                    <h2 className="font-logo font-bold text-lg uppercase tracking-widest text-primary">Вкусный ряд</h2>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Собери 3 в ряд</span>
                 </div>
                 <div className="flex items-center gap-1 bg-anthracite text-white rounded-full px-4 py-1">
                     <span className="material-icons-round text-sm text-primary">star</span>
                     <motion.span 
                        key={score}
                        initial={{ scale: 1.5, color: '#C5A059' }}
                        animate={{ scale: 1, color: '#FFFFFF' }}
                        className="font-mono font-bold text-sm"
                     >
                         {score}
                     </motion.span>
                 </div>
             </div>

             <div className="flex-1 flex items-center justify-center p-4">
                 <div className="bg-white p-2 rounded-2xl shadow-xl border-4 border-[#e5e7eb] relative">
                     <div 
                        className="grid gap-1" 
                        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
                     >
                         {grid.map((row, rIdx) => (
                             row.map((item, cIdx) => {
                                 const isShaking = shakingIds.has(item.id);
                                 
                                 return (
                                     <motion.button
                                        key={item.id}
                                        layout
                                        variants={{
                                            idle: { x: 0, rotate: 0 },
                                            shake: { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } }
                                        }}
                                        animate={isShaking ? 'shake' : 'idle'}
                                        transition={{ 
                                            layout: { type: "spring", stiffness: 300, damping: 25 }
                                        }}
                                        onClick={() => handleCellClick(rIdx, cIdx)}
                                        className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl rounded-lg relative ${
                                            selected?.r === rIdx && selected?.c === cIdx 
                                                ? 'bg-primary shadow-inner scale-90 z-10' 
                                                : 'bg-gray-100 hover:bg-gray-200 z-0'
                                        }`}
                                     >
                                         <span className="pointer-events-none select-none">{item.icon}</span>
                                     </motion.button>
                                 )
                             })
                         ))}
                     </div>
                 </div>
             </div>

             <div className="p-4 pb-8 text-center text-xs text-gray-400 uppercase tracking-widest font-bold">
                 Гравитация включена
             </div>
        </div>
    );
  };

  // --- MAIN RENDER ---

  const nextLevelXp = (userProfile.level + 1) * 150;
  const progressPercent = Math.min(100, (userProfile.totalXp / nextLevelXp) * 100);

  if (activeView === 'roulette') return <RouletteGame />;
  if (activeView === 'quiz') return <QuizGame />;
  if (activeView === 'match3') return <Match3Game />;

  return (
    <div className="flex flex-col h-full w-full bg-background-light text-text-main overflow-hidden relative">
       
       {/* 1. Header */}
       <header className="px-6 pt-10 pb-6 flex-none bg-background-light z-20 flex items-center gap-4">
         <button 
            onClick={() => setMenuOpen(true)}
            className="p-1 -ml-1 rounded-full hover:bg-black/5 transition text-text-main"
         >
            <span className="material-icons-round text-3xl">menu</span>
         </button>
         <h1 className="text-3xl font-extrabold tracking-wider uppercase font-sans text-text-main pt-1">
            Клуб привилегий
         </h1>
       </header>

       {/* Main Scrollable Content */}
       <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
        
        {/* 2. Membership Card */}
        <section className="px-4 mb-2 relative z-10">
            <div className="relative w-full h-56 rounded-3xl p-6 overflow-hidden flex flex-col justify-between text-white shadow-2xl" style={{ background: 'linear-gradient(145deg, #2e2e2e 0%, #1a1a1a 100%)', boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.5)' }}>
                {/* Mural Overlay */}
                <div className="absolute right-0 top-0 bottom-0 w-3/5 opacity-40 mix-blend-overlay pointer-events-none">
                    <img alt="Mural Art" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjL09xVAuNcfJRF3a7V_PJBoGQgfqfrNwVmGUNtZl71sl_gZWny3xirNUeHym-HZReQ1UOwOtJ5xb_mOxZwvXXBzZDBSwYzTBzPgrxqThypenCX2bvWGRC74XtVsITexCmgHoiCRSVO-cXgwLQrOoRPXFLDL8AmS-8qO3PXTfbpKnR8fKSYotMXkq3ueMEs0Ek9vz6FcUH2HaQ_Y7E97T4XiJKZCLuR8K9Ve4Ok2twO0I4bpMuWxXo8-wqvn9eAqBtGvS4NF-J" />
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#1a1a1a]"></div>
                </div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-5xl font-bold font-sans tracking-tight text-white">{userProfile.balanceGP} <span className="text-3xl font-medium text-primary">GP</span></span>
                            <p className="text-gray-400 font-medium tracking-widest mt-1 uppercase text-sm">Гурман</p>
                        </div>
                        <span className="material-icons-round text-white/20 text-4xl">verified</span>
                    </div>
                </div>

                <div className="relative z-10 w-full mt-auto">
                    <div className="flex justify-between text-xs text-primary mb-2 font-bold tracking-widest uppercase">
                        <span>XP</span>
                        <span className="text-white/50">{userProfile.totalXp} / {nextLevelXp}</span>
                    </div>
                    <div className="w-full bg-gray-800 h-3 rounded-full border border-white/5 overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full rounded-full shadow-[0_0_10px_rgba(166,83,33,0.5)]"
                            style={{ background: 'linear-gradient(90deg, #8B3A15 0%, #A65321 100%)' }}
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* 3. Redeem Section */}
        <section className="mt-8 mb-8 pl-4">
             <div className="flex items-center gap-2 mb-4">
                <span className="material-icons-round text-primary">redeem</span>
                <h2 className="text-xl font-bold uppercase tracking-wide text-text-main">Потратить баллы</h2>
             </div>
             
             <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar pr-4">
                {REDEEM_ITEMS.map((item) => (
                    <div key={item.id} className="flex-shrink-0 w-36 bg-white rounded-2xl p-3 border border-gray-100 shadow-md group active:scale-95 transition-transform">
                        <div className="aspect-square rounded-xl bg-gray-100 mb-3 overflow-hidden relative">
                             <img src={item.imageUrl} className="w-full h-full object-cover" />
                             <div className="absolute top-1 right-1 bg-black/60 backdrop-blur text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                                {item.priceGP} GP
                             </div>
                        </div>
                        <h4 className="text-xs font-bold uppercase leading-tight mb-2 h-8 line-clamp-2">{item.name}</h4>
                        <button className="w-full py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg text-[10px] font-bold uppercase transition-colors">
                            Обменять
                        </button>
                    </div>
                ))}
             </div>
        </section>

        {/* 4. Wall Divider */}
        <div className="w-full h-10 restaurant-wall mb-8 shrink-0"></div>

        {/* 5. Secret Menu Section */}
        <section className="mb-10 pl-4">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-text-main">Секретное меню</h2>
            <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar pr-4">
                {SECRET_MENU_ITEMS.map((item) => (
                     <div key={item.id} className="flex-shrink-0 w-40 h-40 rounded-3xl relative overflow-hidden group shadow-md bg-gray-100">
                        <img alt={item.name} className="w-full h-full object-cover filter blur-sm scale-110 transition-all duration-700 group-hover:scale-125" src={item.imageUrl} />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-2 text-center backdrop-blur-[2px]">
                            <span className="material-icons-round text-white text-3xl mb-1">lock</span>
                            <p className="text-white text-[10px] font-bold uppercase tracking-wider leading-tight">Доступно<br/>с {item.unlockLevel} уровня</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* 6. Games Section (Interactive) */}
        <section className="px-4 space-y-6 mb-8">
             {/* Roulette */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col">
                <div className="h-32 bg-gray-100 relative overflow-hidden flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-[8px] border-white shadow-inner flex items-center justify-center relative -bottom-10 opacity-90 animate-spin [animation-duration:20s]">
                         <div className="w-full h-full rounded-full bg-[conic-gradient(#A65321_0deg_45deg,#F3E5DC_45deg_90deg,#A65321_90deg_135deg,#F3E5DC_135deg_180deg,#A65321_180deg_225deg,#F3E5DC_225deg_270deg,#A65321_270deg_315deg,#F3E5DC_315deg_360deg)]"></div>
                    </div>
                    <div className="absolute bottom-0 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[15px] border-t-text-main translate-y-2 z-10"></div>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-text-main mb-2 uppercase">Рулетка счета</h3>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        Испытайте удачу! Вращайте бутылочку, чтобы определить, кто платит.
                    </p>
                    <button onClick={() => setActiveView('roulette')} className="w-full bg-primary hover:bg-[#8B3A15] text-white font-bold py-4 rounded-xl uppercase tracking-wider shadow-lg shadow-primary/30 active:scale-95 transition-all">
                        Играть
                    </button>
                </div>
            </div>

            {/* Match 3 (New) */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col">
                 <div className="h-32 bg-[#fdf6e3] relative overflow-hidden flex items-center justify-center">
                     <div className="grid grid-cols-4 gap-2 opacity-50 transform rotate-12">
                        <span className="text-3xl">🍕</span><span className="text-3xl">🍔</span><span className="text-3xl">🥑</span><span className="text-3xl">🍟</span>
                        <span className="text-3xl">🍦</span><span className="text-3xl">🥤</span><span className="text-3xl">🍕</span><span className="text-3xl">🍔</span>
                     </div>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-text-main mb-2 uppercase">Вкусный ряд</h3>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        Собирайте комбинации из любимых блюд и получайте скидки.
                    </p>
                    <button onClick={() => setActiveView('match3')} className="w-full bg-[#6B8E23] hover:bg-green-700 text-white font-bold py-4 rounded-xl uppercase tracking-wider shadow-lg shadow-green-500/30 active:scale-95 transition-all">
                        Играть
                    </button>
                </div>
            </div>

            {/* Quiz */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col">
                <div className="h-32 bg-[#2D3E50] relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-900/20"></div>
                    <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full border-[16px] border-white/5"></div>
                    <div className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full border-[12px] border-primary/20"></div>
                    <div className="bg-white/10 backdrop-blur-md text-white font-black text-2xl px-8 py-3 rounded-xl transform -rotate-3 shadow-lg border border-white/20 tracking-widest">
                        QVIZ
                    </div>
                </div>
                <div className="p-6">
                    <h3 className="text-xl font-bold text-text-main mb-2 uppercase">Квиз</h3>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        Отвечайте на вопросы об итальянской кухне, зарабатывайте баллы.
                    </p>
                    <button onClick={() => setActiveView('quiz')} className="w-full bg-[#2D3E50] hover:bg-black text-white font-bold py-4 rounded-xl uppercase tracking-wider shadow-lg shadow-black/20 active:scale-95 transition-all">
                        Играть
                    </button>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
};
