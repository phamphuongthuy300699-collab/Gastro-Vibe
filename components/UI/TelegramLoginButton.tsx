
import React, { useEffect, useRef } from 'react';
import { TelegramUser } from '../../types';

interface TelegramLoginButtonProps {
  botName: string; // Имя бота без @ (например: GastroVibe_Auth_Bot)
  onAuth: (user: TelegramUser) => void;
}

export const TelegramLoginButton: React.FC<TelegramLoginButtonProps> = ({ botName, onAuth }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Очистка контейнера перед добавлением скрипта (чтобы не дублировался при ре-рендере)
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    
    // Настройки виджета
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', 'large'); // medium, large
    script.setAttribute('data-radius', '12');
    script.setAttribute('data-request-access', 'write');
    script.setAttribute('data-userpic', 'false'); // Скрываем фото в кнопке, чтобы она вписалась в дизайн
    
    // Callback функция
    // Telegram ищет глобальную функцию для колбэка
    (window as any).onTelegramAuth = (user: TelegramUser) => {
      onAuth(user);
    };
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');

    containerRef.current.appendChild(script);
  }, [botName, onAuth]);

  return (
    <div className="flex justify-center w-full" ref={containerRef}>
      {/* Сюда Telegram инжектит кнопку */}
    </div>
  );
};
