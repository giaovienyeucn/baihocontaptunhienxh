import React, { useEffect, useState } from 'react';
import { Bot, Smile, Star } from 'lucide-react';

interface CharacterProps {
  message: string;
  emotion?: 'happy' | 'neutral' | 'excited';
}

export const Character: React.FC<CharacterProps> = ({ message, emotion = 'neutral' }) => {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    setBounce(true);
    const timer = setTimeout(() => setBounce(false), 500);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-end animate-pop">
      <div className={`relative w-24 h-24 sm:w-32 sm:h-32 bg-blue-100 rounded-full border-4 border-blue-400 flex items-center justify-center shadow-lg transition-transform duration-300 ${bounce ? '-translate-y-2' : ''}`}>
        {emotion === 'excited' ? (
             <Star className="w-16 h-16 text-yellow-500 animate-spin-slow" />
        ) : emotion === 'happy' ? (
             <Smile className="w-16 h-16 text-blue-600" />
        ) : (
             <Bot className="w-16 h-16 text-blue-600" />
        )}
      </div>
      <div className="ml-4 mb-8 bg-white p-4 rounded-2xl rounded-bl-none shadow-xl border-2 border-blue-200 max-w-[200px] sm:max-w-xs">
        <p className="text-gray-800 font-bold text-sm sm:text-base">{message}</p>
      </div>
    </div>
  );
};