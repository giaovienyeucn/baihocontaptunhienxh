import React, { useEffect } from 'react';
import { Trophy, RefreshCw, Star, Gamepad2 } from 'lucide-react';
import { playSound, speak } from '../utils/audioUtils';

interface ResultProps {
  score: number;
  total: number;
  onRestart: () => void;
  onPlayGame?: () => void;
}

export const Result: React.FC<ResultProps> = ({ score, total, onRestart, onPlayGame }) => {
  const isVictory = score > 5;

  useEffect(() => {
    if (isVictory) {
      playSound('victory');
      speak(`Chúc mừng! Bạn trả lời đúng ${score} trên ${total} câu.`);
    } else {
      speak(`Bạn làm tốt lắm, nhưng hãy cố gắng thêm nhé!`);
    }
  }, [isVictory, score, total]);

  const confettiColors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#1dd1a1'];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      {isVictory && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                width: `${8 + Math.random() * 8}px`,
                height: `${8 + Math.random() * 8}px`,
              }}
            />
          ))}
        </div>
      )}

      <div className={`
        relative p-12 rounded-3xl shadow-2xl max-w-lg w-full transform transition-all animate-pop
        ${isVictory ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-400' : 'bg-gradient-to-br from-blue-100 to-indigo-100 border-4 border-blue-400'}
      `}>
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 shadow-lg glow-pulse ${isVictory ? 'bg-yellow-400 border-yellow-200' : 'bg-blue-400 border-blue-200'}`}>
            {isVictory ? <Trophy size={48} className="text-white" /> : <Star size={48} className="text-white" />}
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-gray-800 mt-8 mb-4">
          {isVictory ? '🎉 TUYỆT VỜI!' : '💪 CỐ GẮNG LÊN!'}
        </h2>

        <div className="text-6xl font-black gradient-text mb-6">
          {score} / {total}
        </div>

        <p className="text-xl text-gray-600 mb-8 font-semibold">
          {isVictory
            ? "Bạn là chuyên gia sinh học nhí! 🌟"
            : "Hãy ôn lại bài và thử lại nhé!"}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onRestart}
            className={`
              flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-xl font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95
              ${isVictory ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-500 hover:bg-blue-600'}
            `}
          >
            <RefreshCw /> Làm lại bài
          </button>

          {onPlayGame && (
            <button
              onClick={onPlayGame}
              className="flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-xl font-bold text-white shadow-lg transition-all hover:scale-105 active:scale-95 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Gamepad2 /> Chơi Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
};