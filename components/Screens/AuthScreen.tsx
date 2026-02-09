
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/GameContext';
import { supabase } from '../../lib/supabase';

export const AuthScreen: React.FC = () => {
  const { setActiveTab, setIsAdmin } = useGameStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    console.log("AuthScreen Mounted");
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            console.error("Login Error:", error);
            // Handle specific schema error which happens if auth.identities is missing or permissions are wrong
            if (error.message.includes('schema') || error.message.includes('Database error')) {
                setErrorMsg('Ошибка БД: Запустите docs/CREATE_ADMIN.sql');
            } else {
                setErrorMsg(error.message === 'Invalid login credentials' ? 'Неверный логин или пароль' : error.message);
            }
        } else if (data.user) {
            // Success
            setIsAdmin(true);
            setActiveTab('admin');
        }
    } catch (err: any) {
        console.error("Unexpected Login Error:", err);
        setErrorMsg('Ошибка соединения');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-anthracite text-white p-6 justify-between relative overflow-hidden">
        {/* Background Noise */}
        <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none"></div>

        <button 
            onClick={() => setActiveTab('profile')}
            className="absolute top-6 left-6 p-2 -ml-2 text-white/50 hover:text-white transition-colors"
        >
            <span className="material-icons-round text-3xl">close</span>
        </button>

        <div className="flex-1 flex flex-col justify-center max-w-xs mx-auto w-full z-10">
            <div className="mb-8 text-center">
                 <span className="material-icons-round text-5xl text-gold mb-4">admin_panel_settings</span>
                 <h2 className="font-logo font-bold text-xl uppercase tracking-widest">Администратор</h2>
                 <p className="text-white/40 text-xs mt-2 font-mono">Вход в систему управления</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1 block">Email</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-gold transition-colors"
                        placeholder="admin@gastrovibe.com"
                        required
                    />
                </div>
                
                <div>
                    <label className="text-[10px] uppercase font-bold tracking-widest text-white/50 mb-1 block">Пароль</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-gold transition-colors"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {errorMsg && (
                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg animate-pulse">
                        <p className="text-xs text-red-200 text-center font-bold">{errorMsg}</p>
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gold text-anthracite font-bold text-sm uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-colors mt-4 disabled:opacity-50"
                >
                    {isLoading ? 'Вход...' : 'Войти'}
                </button>
            </form>
            
            <p className="text-center text-[10px] text-white/20 mt-8">
                Нет аккаунта? Запустите SQL скрипт из docs/CREATE_ADMIN.sql
            </p>
        </div>
    </div>
  );
};
