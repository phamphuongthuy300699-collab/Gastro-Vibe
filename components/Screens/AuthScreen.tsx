
import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/GameContext';
import { supabase } from '../../lib/supabase';
import { TelegramLoginButton } from '../UI/TelegramLoginButton';
import { TelegramUser } from '../../types';

export const AuthScreen: React.FC = () => {
  const { setActiveTab, setIsAdmin } = useGameStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Имя вашего бота
  const TELEGRAM_BOT_NAME = 'GastroVibe_Auth_Bot'; 

  useEffect(() => {
    console.log("AuthScreen Mounted");
  }, []);

  // --- ЛОГИКА "ТЕНЕВОЙ" АВТОРИЗАЦИИ ---
  const handleTelegramAuth = async (tgUser: TelegramUser) => {
      setIsLoading(true);
      setErrorMsg('');
      console.log("Telegram Auth Data:", tgUser);

      // 1. Генерируем "Теневые" учетные данные на основе Telegram ID
      // Это позволяет нам использовать стандартную Auth таблицу Supabase
      const shadowEmail = `${tgUser.id}@telegram.user`;
      const shadowPassword = `tg_secret_${tgUser.id}_gastrovibe`; 

      try {
          // 2. Пробуем ВОЙТИ
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email: shadowEmail,
              password: shadowPassword,
          });

          if (signInError && signInError.message.includes('Invalid login credentials')) {
              // 3. Если не вышло (пользователь новый) -> РЕГИСТРИРУЕМ
              console.log("User not found, registering...");
              
              const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                  email: shadowEmail,
                  password: shadowPassword,
                  options: {
                      data: {
                          full_name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
                          avatar_url: tgUser.photo_url || '',
                          telegram_id: tgUser.id
                      }
                  }
              });

              if (signUpError) throw signUpError;
              
              // Успешная регистрация
              if (signUpData.user) {
                  // Обновляем UI через слушатель в DataContext (он сам подхватит событие)
                  console.log("Registered via Telegram Shadow Account");
              }

          } else if (signInError) {
              throw signInError;
          } else {
              // 4. Успешный вход
              // Нужно обновить данные профиля, если фото или имя в ТГ изменились
              if (signInData.user) {
                  await supabase.from('profiles').update({
                      full_name: `${tgUser.first_name} ${tgUser.last_name || ''}`.trim(),
                      avatar_url: tgUser.photo_url || ''
                  }).eq('id', signInData.user.id);
              }
          }
          
          // Редирект в профиль после успеха
          setTimeout(() => setActiveTab('profile'), 500);

      } catch (err: any) {
          console.error("Auth System Error:", err);
          setErrorMsg('Ошибка авторизации: ' + err.message);
      } finally {
          setIsLoading(false);
      }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            if (error.message.includes('schema') || error.message.includes('Database error')) {
                setErrorMsg('Ошибка БД: Запустите docs/CREATE_ADMIN.sql');
            } else {
                setErrorMsg('Неверный логин или пароль');
            }
        } else if (data.user) {
            setIsAdmin(true);
            setActiveTab('admin');
        }
    } catch (err: any) {
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
            <div className="mb-10 text-center">
                 <h2 className="font-logo font-bold text-2xl uppercase tracking-widest text-primary mb-2">Gastro-Vibe</h2>
                 <p className="text-white/40 text-xs font-mono">Авторизация</p>
            </div>

            {/* TELEGRAM BUTTON AREA */}
            <div className="space-y-4 mb-12 flex flex-col items-center">
                {/* 
                    ВАЖНО: Кнопка Telegram рендерится через внешний скрипт.
                    Она может не появиться на localhost, если домен не добавлен в @BotFather через /setdomain.
                    Для тестов можно использовать ngrok или просто задеплоить проект.
                */}
                <div className="bg-white/5 p-2 rounded-xl w-full flex justify-center min-h-[60px]">
                    <TelegramLoginButton 
                        botName={TELEGRAM_BOT_NAME} 
                        onAuth={handleTelegramAuth} 
                    />
                </div>
                
                <p className="text-center text-[10px] text-white/30 px-4">
                    Нажимая "Войти", вы сохраняете свой прогресс, уровень и баланс GP.
                </p>
                
                {isLoading && (
                    <div className="text-primary text-xs font-bold animate-pulse">Обработка данных...</div>
                )}
            </div>

            {/* Divider */}
            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-[10px] text-white/20 uppercase tracking-widest">Персонал</span>
                <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Admin Login */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErrorMsg(''); }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-xs placeholder-white/20 focus:outline-none focus:border-gold transition-colors"
                        placeholder="admin@gastrovibe.com"
                        required
                    />
                </div>
                
                <div>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-xs placeholder-white/20 focus:outline-none focus:border-gold transition-colors"
                        placeholder="Пароль"
                        required
                    />
                </div>

                {errorMsg && (
                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                        <p className="text-xs text-red-200 text-center font-bold">{errorMsg}</p>
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white/5 hover:bg-gold hover:text-black border border-white/10 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-xl transition-all disabled:opacity-50"
                >
                    Вход для админов
                </button>
            </form>
        </div>
    </div>
  );
};
