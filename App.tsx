import React, { useState, useEffect, useMemo } from 'react';
import { MindMap } from './components/MindMap';
import { Quiz } from './components/Quiz';
import { Result } from './components/Result';
import { Character } from './components/Character';
import { ClassificationGame } from './components/ClassificationGame';
import { AppPhase } from './types';
import { playSound, speak, checkVietnameseVoice } from './utils/audioUtils';
import { Play, Volume2, AlertCircle, Sparkles, Home } from 'lucide-react';

// Floating Particles Component
const FloatingParticles: React.FC = () => {
  const particles = useMemo(() => {
    const colors = ['#60a5fa', '#34d399', '#f472b6', '#fbbf24', '#a78bfa', '#fb923c'];
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      size: Math.random() * 20 + 10,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 15 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>('intro');
  const [score, setScore] = useState(0);
  const [hasVoice, setHasVoice] = useState<boolean | null>(null);

  useEffect(() => {
    checkVietnameseVoice().then(status => {
      setHasVoice(status);
      if (status) {
        console.log("Phát hiện giọng Tiếng Việt.");
      } else {
        console.log("Không tìm thấy giọng Tiếng Việt.");
      }
    });
  }, []);

  const getCharacterMessage = () => {
    switch (phase) {
      case 'intro': return "Chào bạn! Cùng tìm hiểu về Thực vật và Động vật nhé!";
      case 'mindmap': return "Bấm vào các ô để nghe kiến thức nha!";
      case 'quiz': return "Chọn đáp án đúng nhất nhé!";
      case 'game': return "Kéo thả vào đúng nhóm nào!";
      case 'result': return score > 5 ? "Bạn giỏi quá đi!" : "Không sao, làm lại nào!";
      default: return "";
    }
  };

  const getCharacterEmotion = () => {
    if (phase === 'result' && score > 5) return 'excited';
    if (phase === 'quiz' || phase === 'game') return 'neutral';
    return 'happy';
  };

  const startApp = () => {
    playSound('click');
    setPhase('mindmap');
    speak("Chào mừng các em đến với bài học Phân loại thực vật và động vật. Hãy khám phá sơ đồ tư duy nhé!");
  };

  const testVoice = () => {
    speak("Xin chào, đây là giọng đọc Tiếng Việt.");
  };

  return (
    <div className="min-h-screen relative overflow-hidden font-sans">
      {/* Floating Particles Background */}
      <FloatingParticles />

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-green-50/30 pointer-events-none z-0" />

      <main className="container mx-auto px-4 py-6 relative z-10">
        {phase === 'intro' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8 animate-pop">

            {/* Decorative sparkles */}
            <div className="absolute top-20 left-20 text-4xl animate-bounce opacity-50">✨</div>
            <div className="absolute top-40 right-32 text-3xl bounce-subtle opacity-50">🌟</div>
            <div className="absolute bottom-40 left-32 text-3xl bounce-subtle opacity-50" style={{ animationDelay: '1s' }}>💫</div>

            {/* Voice Setup Guide if no voice detected */}
            {hasVoice === false && (
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 text-gray-800 p-5 rounded-2xl shadow-xl max-w-2xl text-left animate-pop">
                <div className="flex items-center font-bold text-lg mb-3 text-yellow-700">
                  <AlertCircle className="w-6 h-6 mr-2" />
                  🔊 Hướng dẫn cài giọng đọc Tiếng Việt
                </div>

                <p className="text-gray-600 mb-4">
                  Để bài học có thể đọc tiếng Việt, hãy cài đặt giọng Việt theo hệ điều hành của bạn:
                </p>

                <div className="space-y-3 text-sm">
                  {/* Windows */}
                  <details className="bg-white/80 rounded-xl p-3 cursor-pointer hover:bg-white transition-colors">
                    <summary className="font-bold text-blue-700 flex items-center gap-2">
                      💻 Windows 10/11
                    </summary>
                    <ol className="mt-2 ml-4 space-y-1 text-gray-600 list-decimal list-inside">
                      <li>Mở <strong>Settings</strong> (Cài đặt)</li>
                      <li>Chọn <strong>Time & Language</strong> → <strong>Language</strong></li>
                      <li>Nhấn <strong>Add a language</strong> → Tìm "Tiếng Việt"</li>
                      <li>Tick ✅ <strong>Text to Speech</strong> khi cài đặt</li>
                      <li>Khởi động lại trình duyệt</li>
                    </ol>
                  </details>

                  {/* macOS */}
                  <details className="bg-white/80 rounded-xl p-3 cursor-pointer hover:bg-white transition-colors">
                    <summary className="font-bold text-gray-700 flex items-center gap-2">
                      🍎 macOS
                    </summary>
                    <ol className="mt-2 ml-4 space-y-1 text-gray-600 list-decimal list-inside">
                      <li>Mở <strong>System Preferences</strong></li>
                      <li>Chọn <strong>Accessibility</strong> → <strong>Spoken Content</strong></li>
                      <li>Nhấn <strong>System Voice</strong> → <strong>Manage Voices</strong></li>
                      <li>Tải <strong>Vietnamese</strong> voice</li>
                    </ol>
                  </details>

                  {/* iOS */}
                  <details className="bg-white/80 rounded-xl p-3 cursor-pointer hover:bg-white transition-colors">
                    <summary className="font-bold text-gray-700 flex items-center gap-2">
                      📱 iPhone / iPad
                    </summary>
                    <ol className="mt-2 ml-4 space-y-1 text-gray-600 list-decimal list-inside">
                      <li>Mở <strong>Settings</strong> (Cài đặt)</li>
                      <li>Chọn <strong>Accessibility</strong> → <strong>Spoken Content</strong></li>
                      <li>Bật <strong>Speak Selection</strong></li>
                      <li>Nhấn <strong>Voices</strong> → <strong>Vietnamese</strong> → Tải về</li>
                    </ol>
                  </details>

                  {/* Android */}
                  <details className="bg-white/80 rounded-xl p-3 cursor-pointer hover:bg-white transition-colors">
                    <summary className="font-bold text-green-700 flex items-center gap-2">
                      🤖 Android
                    </summary>
                    <ol className="mt-2 ml-4 space-y-1 text-gray-600 list-decimal list-inside">
                      <li>Mở <strong>Settings</strong> (Cài đặt)</li>
                      <li>Tìm <strong>Text-to-speech</strong> (hoặc TTS)</li>
                      <li>Chọn <strong>Google TTS</strong> làm engine mặc định</li>
                      <li>Nhấn ⚙️ → <strong>Install voice data</strong> → <strong>Vietnamese</strong></li>
                    </ol>
                  </details>
                </div>

                <p className="mt-4 text-xs text-gray-500 italic">
                  💡 Sau khi cài xong, hãy refresh lại trang này nhé!
                </p>
              </div>
            )}

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
              <span className="gradient-text">PHÂN LOẠI</span> <br />
              <span className="text-green-600">THỰC VẬT</span> & <span className="text-rose-600">ĐỘNG VẬT</span>
            </h1>

            <p className="text-xl text-gray-600 max-w-lg">
              Bài học tương tác sinh động dành cho các nhà sinh học tí hon! 🔬
            </p>

            <p className="text-lg text-purple-600 font-medium">
              ✨ Được biên soạn bởi cô Thanh ✨
            </p>

            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={testVoice}
                className="inline-flex items-center justify-center px-6 py-4 text-lg font-semibold text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition-all hover:scale-105 shadow-md"
              >
                <Volume2 className="mr-2 w-6 h-6" />
                Thử giọng đọc
              </button>

              <button
                onClick={startApp}
                className="group relative inline-flex items-center justify-center px-8 py-4 text-2xl font-bold text-white transition-all duration-200 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 hover:from-blue-500 hover:to-indigo-500 shadow-xl hover:-translate-y-1 glow-pulse"
              >
                <Play className="mr-3 w-8 h-8 fill-current" />
                Bắt đầu
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-bounce" />
              </button>
            </div>
          </div>
        )}

        {phase === 'mindmap' && (
          <MindMap onComplete={() => setPhase('quiz')} onGoHome={() => setPhase('intro')} />
        )}

        {phase === 'quiz' && (
          <Quiz
            onFinish={(finalScore) => {
              setScore(finalScore);
              setPhase('result');
            }}
            onGoHome={() => setPhase('intro')}
          />
        )}

        {phase === 'result' && (
          <Result
            score={score}
            total={6}
            onRestart={() => {
              setScore(0);
              setPhase('mindmap');
            }}
            onPlayGame={() => setPhase('game')}
          />
        )}

        {phase === 'game' && (
          <ClassificationGame
            onComplete={() => {
              setPhase('intro');
            }}
            onGoHome={() => setPhase('intro')}
          />
        )}
      </main>

      <Character message={getCharacterMessage()} emotion={getCharacterEmotion()} />
    </div>
  );
};

export default App;