
import React, { useState } from 'react';
import { useGameStore } from '../../store/GameContext';
import { SplitType } from '../../types';

export const BillScreen: React.FC = () => {
  const { orderItems, setActiveTab, myParticipantId, payBill, showConfetti, setMenuOpen } = useGameStore();
  const [splitMode, setSplitMode] = useState<SplitType>('personal');
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [isPaying, setIsPaying] = useState(false);

  // Simplified selection logic for demo purposes
  const myItems = orderItems.filter(i => i.participantId === myParticipantId);
  const totalAmount = myItems.reduce((acc, i) => acc + (i.priceAtOrder * i.quantity), 0);
  const tipAmount = Math.round(totalAmount * (tipPercent / 100));
  const finalPay = totalAmount + tipAmount;

  const handlePayAction = async () => {
    setIsPaying(true);
    await payBill(finalPay, tipPercent);
    setIsPaying(false);
    setTimeout(() => setActiveTab('games'), 2000);
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    // Just a visual toggle for manual mode simulation
    const target = e.currentTarget;
    target.classList.toggle('bg-primary');
    target.classList.toggle('border-primary');
    const check = target.querySelector('span');
    if (check) check.classList.toggle('hidden');
  };

  return (
    <div className="flex flex-col h-full w-full bg-background-light text-text-main relative overflow-hidden">
      
      {/* Confetti Overlay */}
      {showConfetti && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
             <div className="bg-white p-8 rounded-2xl text-center shadow-2xl animate-bounce border border-primary/20">
                 <h2 className="text-3xl font-logo font-bold text-text-main mb-2">ОПЛАТА</h2>
                 <p className="text-sm font-sans text-text-main/70">Спасибо за визит!</p>
             </div>
          </div>
      )}

      {/* Header */}
      <div className="pt-8 pb-4 px-6 shrink-0 relative flex flex-col items-center border-b border-black/5">
        <button 
            onClick={() => setMenuOpen(true)}
            className="absolute left-6 top-8 p-1 -ml-1 rounded-full hover:bg-black/5 transition text-text-main"
        >
            <span className="material-icons-round text-3xl">menu</span>
        </button>
        
        <h1 className="text-xl font-logo font-bold tracking-widest text-text-main uppercase mb-1">Маргарита</h1>
        <div className="flex justify-center items-center mt-2">
            <span className="font-mono text-5xl font-bold text-primary tracking-tight">{totalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* Split Controls */}
      <div className="px-4 mt-6 mb-6 shrink-0">
        <div className="flex rounded-lg border border-black/10 overflow-hidden bg-background-soft">
            {[
                { id: 'personal', label: 'Мои блюда' },
                { id: 'equal', label: 'Поровну' },
                { id: 'manual', label: 'Вручную' }
            ].map(m => (
                <button 
                    key={m.id}
                    onClick={() => setSplitMode(m.id as SplitType)}
                    className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-wider transition-colors ${splitMode === m.id ? 'bg-primary text-white shadow-sm' : 'bg-transparent text-text-main/60 hover:text-text-main'}`}
                >
                    {m.label}
                </button>
            ))}
        </div>
      </div>

      {/* Bill List */}
      <main className="flex-1 overflow-y-auto px-6 space-y-5 mb-8 no-scrollbar">
        {orderItems.map((item) => (
            <label key={item.id} className="flex items-center cursor-pointer group select-none">
                <div 
                    onClick={splitMode === 'manual' ? handleCheckboxClick : undefined}
                    className={`w-5 h-5 border rounded mr-4 flex items-center justify-center transition-colors shrink-0
                        ${(splitMode === 'personal' && item.participantId === myParticipantId) || splitMode === 'equal' 
                            ? 'border-primary bg-primary' 
                            : 'border-gray-300'
                        }
                    `}
                >
                     <span className={`material-icons-round text-white text-sm font-bold ${(splitMode === 'personal' && item.participantId === myParticipantId) || splitMode === 'equal' ? '' : 'hidden'}`}>check</span>
                </div>
                
                <div className="flex-1 flex items-baseline overflow-hidden">
                    <span className="text-text-main text-sm font-bold uppercase tracking-wide truncate pr-2">{item.dish?.name}</span>
                    {item.quantity > 1 && <span className="text-xs text-text-main/50 font-bold mr-2">x{item.quantity}</span>}
                    <div className="flex-grow border-b border-dotted border-black/20 relative -top-1"></div>
                    <span className="text-text-main font-bold font-mono ml-2">{(item.priceAtOrder * item.quantity).toLocaleString()}</span>
                </div>
            </label>
        ))}
      </main>

      {/* Gold Zigzag (UPDATED HEIGHT) */}
      <div className="w-full h-10 restaurant-wall mb-6 shrink-0"></div>

      {/* Footer / Payment */}
      <div className="px-6 text-center pb-32 shrink-0 bg-background-light">
        <h3 className="text-text-main/40 font-bold text-[9px] tracking-[0.2em] uppercase mb-4">Чаевые официанту</h3>
        
        <div className="flex justify-between items-center gap-3 mb-8">
            {[0, 5, 10, 15].map(tip => (
                <button 
                    key={tip} 
                    onClick={() => setTipPercent(tip)}
                    className={`flex-1 h-12 rounded-xl font-bold flex items-center justify-center transition-all ${tipPercent === tip ? 'bg-anthracite text-primary border border-primary' : 'bg-background-soft text-text-main border border-transparent'}`}
                >
                    {tip}%
                </button>
            ))}
        </div>

        <button 
            onClick={handlePayAction}
            className="w-full bg-primary text-white py-4 rounded-xl text-lg font-bold shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-wider"
        >
            <span>Оплатить</span>
            <span className="font-mono text-xl text-anthracite bg-white/20 px-2 rounded">{finalPay.toLocaleString()}</span>
        </button>
      </div>

    </div>
  );
};
