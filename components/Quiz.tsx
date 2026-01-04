import React, { useState } from 'react';
import { QUESTIONS } from '../constants';
import { speak, playSound } from '../utils/audioUtils';
import { CheckCircle, XCircle, Home } from 'lucide-react';

interface QuizProps {
  onFinish: (score: number) => void;
  onGoHome: () => void;
}

export const Quiz: React.FC<QuizProps> = ({ onFinish, onGoHome }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = QUESTIONS[currentIndex];

  const handleAnswer = (optionId: string) => {
    if (isChecking) return;

    setSelectedId(optionId);
    setIsChecking(true);
    speak(optionId === currentQuestion.correctId ? "Chính xác!" : "Tiếc quá, sai rồi.");

    if (optionId === currentQuestion.correctId) {
      playSound('correct');
      setScore(prev => prev + 1);
    } else {
      playSound('wrong');
    }

    setTimeout(() => {
      if (currentIndex < QUESTIONS.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedId(null);
        setIsChecking(false);
      } else {
        onFinish(score + (optionId === currentQuestion.correctId ? 1 : 0));
      }
    }, 2000);
  };

  // Play question audio when index changes
  React.useEffect(() => {
    speak(currentQuestion.question);
  }, [currentIndex, currentQuestion]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-3xl mx-auto px-4 relative">
      {/* Home Button */}
      <button
        onClick={onGoHome}
        className="absolute top-0 left-0 bg-white/90 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-20"
        title="Về trang chủ"
      >
        <Home className="w-6 h-6" />
      </button>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-8">
        <div
          className="bg-blue-500 h-4 rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex) / QUESTIONS.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full mb-8 border-t-8 border-blue-500 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-2 rounded-bl-xl font-bold">
          Câu {currentIndex + 1}/{QUESTIONS.length}
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mt-4 mb-2">
          {currentQuestion.question}
        </h3>
      </div>

      {/* Options Grid */}
      <div className="grid gap-4 w-full">
        {currentQuestion.options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrect = option.id === currentQuestion.correctId;
          const showResult = isChecking && (isSelected || (isChecking && isCorrect && selectedId !== null));

          let buttonStyle = "bg-white border-4 border-blue-100 hover:border-blue-300 text-gray-700";

          if (showResult) {
            if (isCorrect) buttonStyle = "bg-green-100 border-green-500 text-green-800 scale-105";
            else if (isSelected) buttonStyle = "bg-red-100 border-red-500 text-red-800 opacity-80";
          } else if (isSelected) {
            buttonStyle = "bg-blue-100 border-blue-500";
          }

          return (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id)}
              disabled={isChecking}
              className={`
                relative p-6 rounded-xl text-lg sm:text-xl font-bold transition-all duration-200 shadow-md text-left flex items-center justify-between
                ${buttonStyle}
              `}
            >
              <span className="flex items-center gap-3">
                <span className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0
                    ${showResult && isCorrect ? 'bg-green-500' : (showResult && isSelected ? 'bg-red-500' : 'bg-blue-400')}
                `}>
                  {option.id}
                </span>
                {option.text}
              </span>

              {showResult && isCorrect && <CheckCircle className="text-green-600 w-8 h-8 animate-bounce" />}
              {showResult && isSelected && !isCorrect && <XCircle className="text-red-600 w-8 h-8 animate-pulse" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};