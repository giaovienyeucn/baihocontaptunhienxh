import React, { useState, useMemo } from 'react';
import { playSound, speak } from '../utils/audioUtils';
import { CheckCircle, XCircle, Sparkles, RotateCcw, Home } from 'lucide-react';

// Game items with emoji and category
const GAME_ITEMS = [
    { id: 1, emoji: '🌻', name: 'Hoa hướng dương', category: 'plant' },
    { id: 2, emoji: '🐕', name: 'Con chó', category: 'animal' },
    { id: 3, emoji: '🌲', name: 'Cây thông', category: 'plant' },
    { id: 4, emoji: '🐱', name: 'Con mèo', category: 'animal' },
    { id: 5, emoji: '🍎', name: 'Quả táo', category: 'plant' },
    { id: 6, emoji: '🐦', name: 'Con chim', category: 'animal' },
    { id: 7, emoji: '🌷', name: 'Hoa tulip', category: 'plant' },
    { id: 8, emoji: '🐟', name: 'Con cá', category: 'animal' },
    { id: 9, emoji: '🥕', name: 'Củ cà rốt', category: 'plant' },
    { id: 10, emoji: '🦋', name: 'Con bướm', category: 'animal' },
];

interface ClassificationGameProps {
    onComplete: () => void;
    onGoHome: () => void;
}

interface DragItem {
    id: number;
    emoji: string;
    name: string;
    category: 'plant' | 'animal';
}

export const ClassificationGame: React.FC<ClassificationGameProps> = ({ onComplete, onGoHome }) => {
    const [items, setItems] = useState<DragItem[]>(() =>
        [...GAME_ITEMS].sort(() => Math.random() - 0.5)
    );
    const [plantZone, setPlantZone] = useState<DragItem[]>([]);
    const [animalZone, setAnimalZone] = useState<DragItem[]>([]);
    const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
    const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong' | null; zone: string | null }>({ type: null, zone: null });
    const [score, setScore] = useState(0);

    const isComplete = items.length === 0;

    const handleDragStart = (e: React.DragEvent, item: DragItem) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent, targetZone: 'plant' | 'animal') => {
        e.preventDefault();
        if (!draggedItem) return;

        const isCorrect = draggedItem.category === targetZone;

        if (isCorrect) {
            playSound('correct');
            speak('Đúng rồi!');
            setScore(prev => prev + 1);
            setFeedback({ type: 'correct', zone: targetZone });

            // Move item to zone
            setItems(prev => prev.filter(i => i.id !== draggedItem.id));
            if (targetZone === 'plant') {
                setPlantZone(prev => [...prev, draggedItem]);
            } else {
                setAnimalZone(prev => [...prev, draggedItem]);
            }
        } else {
            playSound('wrong');
            speak('Sai rồi, thử lại nhé!');
            setFeedback({ type: 'wrong', zone: targetZone });
        }

        setDraggedItem(null);
        setTimeout(() => setFeedback({ type: null, zone: null }), 800);
    };

    const handleTouchStart = (item: DragItem) => {
        setDraggedItem(item);
    };

    const handleZoneClick = (targetZone: 'plant' | 'animal') => {
        if (!draggedItem) return;

        const isCorrect = draggedItem.category === targetZone;

        if (isCorrect) {
            playSound('correct');
            speak('Đúng rồi!');
            setScore(prev => prev + 1);
            setFeedback({ type: 'correct', zone: targetZone });

            setItems(prev => prev.filter(i => i.id !== draggedItem.id));
            if (targetZone === 'plant') {
                setPlantZone(prev => [...prev, draggedItem]);
            } else {
                setAnimalZone(prev => [...prev, draggedItem]);
            }
        } else {
            playSound('wrong');
            speak('Sai rồi!');
            setFeedback({ type: 'wrong', zone: targetZone });
        }

        setDraggedItem(null);
        setTimeout(() => setFeedback({ type: null, zone: null }), 800);
    };

    const resetGame = () => {
        setItems([...GAME_ITEMS].sort(() => Math.random() - 0.5));
        setPlantZone([]);
        setAnimalZone([]);
        setScore(0);
        setDraggedItem(null);
    };

    return (
        <div className="flex flex-col items-center min-h-[80vh] py-6 px-4 animate-pop relative">
            {/* Home Button */}
            <button
                onClick={onGoHome}
                className="absolute top-4 left-4 bg-white/90 hover:bg-white text-gray-700 p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-20"
                title="Về trang chủ"
            >
                <Home className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-3xl sm:text-4xl font-extrabold gradient-text mb-2">
                    🎮 Phân Loại Động Thực Vật
                </h2>
                <p className="text-gray-600 text-lg">Kéo thả vào đúng nhóm nhé!</p>
                <div className="mt-3 flex items-center justify-center gap-4">
                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">
                        Điểm: {score}/{GAME_ITEMS.length}
                    </span>
                    <button
                        onClick={resetGame}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-semibold flex items-center gap-2 transition-colors"
                    >
                        <RotateCcw size={18} /> Chơi lại
                    </button>
                </div>
            </div>

            {/* Drop Zones */}
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-4xl mb-8">
                {/* Plant Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'plant')}
                    onClick={() => handleZoneClick('plant')}
                    className={`
            flex-1 min-h-[180px] rounded-3xl border-4 border-dashed p-4 transition-all duration-300
            flex flex-col items-center justify-start
            ${feedback.type === 'correct' && feedback.zone === 'plant'
                            ? 'border-green-500 bg-green-100 scale-105'
                            : feedback.type === 'wrong' && feedback.zone === 'plant'
                                ? 'border-red-500 bg-red-100 animate-pulse'
                                : 'border-green-300 bg-green-50 hover:bg-green-100 hover:border-green-400'}
            ${draggedItem ? 'ring-4 ring-green-200' : ''}
          `}
                >
                    <div className="text-4xl mb-2">🌱</div>
                    <h3 className="text-xl font-bold text-green-700 mb-3">Thực Vật</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {plantZone.map(item => (
                            <span key={item.id} className="text-3xl animate-pop bg-white rounded-xl p-2 shadow-md">
                                {item.emoji}
                            </span>
                        ))}
                    </div>
                    {feedback.type === 'correct' && feedback.zone === 'plant' && (
                        <CheckCircle className="text-green-600 w-12 h-12 mt-2 animate-bounce" />
                    )}
                    {feedback.type === 'wrong' && feedback.zone === 'plant' && (
                        <XCircle className="text-red-600 w-12 h-12 mt-2 animate-pulse" />
                    )}
                </div>

                {/* Animal Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'animal')}
                    onClick={() => handleZoneClick('animal')}
                    className={`
            flex-1 min-h-[180px] rounded-3xl border-4 border-dashed p-4 transition-all duration-300
            flex flex-col items-center justify-start
            ${feedback.type === 'correct' && feedback.zone === 'animal'
                            ? 'border-green-500 bg-green-100 scale-105'
                            : feedback.type === 'wrong' && feedback.zone === 'animal'
                                ? 'border-red-500 bg-red-100 animate-pulse'
                                : 'border-rose-300 bg-rose-50 hover:bg-rose-100 hover:border-rose-400'}
            ${draggedItem ? 'ring-4 ring-rose-200' : ''}
          `}
                >
                    <div className="text-4xl mb-2">🐾</div>
                    <h3 className="text-xl font-bold text-rose-700 mb-3">Động Vật</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {animalZone.map(item => (
                            <span key={item.id} className="text-3xl animate-pop bg-white rounded-xl p-2 shadow-md">
                                {item.emoji}
                            </span>
                        ))}
                    </div>
                    {feedback.type === 'correct' && feedback.zone === 'animal' && (
                        <CheckCircle className="text-green-600 w-12 h-12 mt-2 animate-bounce" />
                    )}
                    {feedback.type === 'wrong' && feedback.zone === 'animal' && (
                        <XCircle className="text-red-600 w-12 h-12 mt-2 animate-pulse" />
                    )}
                </div>
            </div>

            {/* Items to drag */}
            {!isComplete && (
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100 w-full max-w-3xl">
                    <p className="text-center text-gray-500 mb-4 font-semibold">
                        {draggedItem ? `Đã chọn: ${draggedItem.emoji} ${draggedItem.name} - Bấm vào nhóm phù hợp!` : 'Kéo hoặc bấm vào item để chọn'}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        {items.map(item => (
                            <div
                                key={item.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, item)}
                                onClick={() => handleTouchStart(item)}
                                className={`
                  text-5xl cursor-grab active:cursor-grabbing p-4 rounded-2xl
                  bg-gradient-to-br from-white to-gray-50 shadow-lg
                  hover:shadow-xl hover:scale-110 transition-all duration-200
                  border-2 border-transparent hover:border-blue-300
                  wiggle
                  ${draggedItem?.id === item.id ? 'ring-4 ring-blue-400 scale-110 bg-blue-50' : ''}
                `}
                                title={item.name}
                            >
                                {item.emoji}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Completion */}
            {isComplete && (
                <div className="text-center animate-pop bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl p-8 shadow-2xl border-4 border-yellow-400">
                    <Sparkles className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-bounce" />
                    <h3 className="text-3xl font-extrabold text-gray-800 mb-2">🎉 Tuyệt vời!</h3>
                    <p className="text-xl text-gray-600 mb-4">
                        Bạn đã phân loại đúng {score}/{GAME_ITEMS.length} items!
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={resetGame}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                        >
                            <RotateCcw size={20} /> Chơi lại
                        </button>
                        <button
                            onClick={onComplete}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-transform hover:scale-105"
                        >
                            Hoàn thành ✓
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
