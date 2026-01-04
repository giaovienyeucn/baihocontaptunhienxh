import React, { useRef, useEffect, useState } from 'react';
import { MIND_MAP_DATA } from '../constants';
import { speak, playSound } from '../utils/audioUtils';
import { MindMapNode } from '../types';
import { Home } from 'lucide-react';

interface MindMapProps {
  onComplete: () => void;
  onGoHome: () => void;
}

// Enhanced 3D Node Card Component
const NodeCard = React.forwardRef<HTMLButtonElement, {
  node: MindMapNode;
  onClick: () => void;
  variant?: 'center' | 'branch' | 'leaf';
  bgColor?: string;
  textColor?: string;
}>(({ node, onClick, variant = 'leaf', bgColor = '', textColor = 'text-gray-800' }, ref) => {
  const Icon = node.icon;

  if (variant === 'center') {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-full flex flex-col items-center justify-center text-white 
                   bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 
                   shadow-[0_8px_30px_rgba(59,130,246,0.5),inset_0_-4px_10px_rgba(0,0,0,0.2),inset_0_4px_10px_rgba(255,255,255,0.3)]
                   border-4 border-white/50
                   transition-all duration-300 hover:scale-105 hover:shadow-[0_12px_40px_rgba(59,130,246,0.6)]
                   active:scale-95 cursor-pointer z-20"
      >
        {Icon && <Icon className="w-8 h-8 sm:w-12 sm:h-12 mb-1 sm:mb-2 text-white drop-shadow-lg" />}
        <span className="text-xs sm:text-sm font-extrabold leading-tight text-center px-2 sm:px-3 drop-shadow-md">
          {node.title}
        </span>
      </button>
    );
  }

  if (variant === 'branch') {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={`px-3 py-2 sm:px-5 sm:py-4 rounded-2xl flex items-center justify-center text-white font-extrabold text-center 
                   min-w-[140px] max-w-[160px] sm:min-w-[180px] sm:max-w-[200px]
                   ${bgColor}
                   shadow-[0_6px_20px_rgba(0,0,0,0.25),inset_0_-3px_8px_rgba(0,0,0,0.2),inset_0_3px_8px_rgba(255,255,255,0.25)]
                   border-2 border-white/30
                   transition-all duration-300 hover:scale-105 hover:-translate-y-1
                   active:scale-95 cursor-pointer z-10`}
      >
        <span className="text-xs sm:text-sm leading-tight drop-shadow-sm">{node.title}</span>
      </button>
    );
  }

  // Leaf variant
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`px-3 py-2 sm:px-5 sm:py-4 rounded-2xl flex flex-col items-center gap-1 sm:gap-2 min-w-[100px] max-w-[130px] sm:min-w-[140px] sm:max-w-[160px]
                 ${bgColor}
                 shadow-[0_6px_20px_rgba(0,0,0,0.15),inset_0_-2px_6px_rgba(0,0,0,0.1),inset_0_2px_6px_rgba(255,255,255,0.5)]
                 border-2 border-white/60
                 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]
                 active:scale-95 cursor-pointer z-10`}
    >
      {Icon && <Icon className={`w-7 h-7 sm:w-10 sm:h-10 ${textColor} drop-shadow-sm`} />}
      <div className="text-center">
        <span className={`font-bold text-sm sm:text-base block ${textColor}`}>{node.title}</span>
        {node.description && (
          <span className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1 block leading-tight">{node.description}</span>
        )}
      </div>
    </button>
  );
});

NodeCard.displayName = 'NodeCard';

// Curved connection line component
const CurvedLine = ({
  x1, y1, x2, y2, color, direction = 'down'
}: {
  x1: number; y1: number; x2: number; y2: number; color: string; direction?: 'up' | 'down' | 'left' | 'right';
}) => {
  // Calculate control points for smooth curve
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  let cx1, cy1, cx2, cy2;

  if (direction === 'up') {
    cx1 = x1;
    cy1 = y1 - Math.abs(y2 - y1) * 0.5;
    cx2 = x2;
    cy2 = y2 + Math.abs(y2 - y1) * 0.5;
  } else if (direction === 'down') {
    cx1 = x1;
    cy1 = y1 + Math.abs(y2 - y1) * 0.5;
    cx2 = x2;
    cy2 = y2 - Math.abs(y2 - y1) * 0.5;
  } else {
    cx1 = midX;
    cy1 = y1;
    cx2 = midX;
    cy2 = y2;
  }

  return (
    <path
      d={`M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`}
      stroke={color}
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
      style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
    />
  );
};

export const MindMap: React.FC<MindMapProps> = ({ onComplete, onGoHome }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLButtonElement>(null);
  const plantBranchRef = useRef<HTMLButtonElement>(null);
  const animalBranchRef = useRef<HTMLButtonElement>(null);
  const usageBranchRef = useRef<HTMLButtonElement>(null);
  const leafRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; color: string; direction: 'up' | 'down' }[]>([]);

  const handleNodeClick = (node: MindMapNode) => {
    playSound('click');
    const textToRead = `${node.title}. ${node.description || ''}`;
    speak(textToRead);
  };

  const root = MIND_MAP_DATA;
  const plantBranch = root.children![0];
  const animalBranch = root.children![1];
  const usageBranch = root.children![2];

  // Calculate lines after render
  useEffect(() => {
    const calculateLines = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const getCenter = (el: HTMLElement | null) => {
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top
        };
      };

      const newLines: typeof lines = [];

      const center = getCenter(centerRef.current);
      const plantBranchPos = getCenter(plantBranchRef.current);
      const animalBranchPos = getCenter(animalBranchRef.current);
      const usageBranchPos = getCenter(usageBranchRef.current);

      // Center to branches
      if (center.x && plantBranchPos.x) {
        newLines.push({
          x1: center.x - 60, y1: center.y,
          x2: plantBranchPos.x + 80, y2: plantBranchPos.y,
          color: '#22c55e', direction: 'down'
        });
      }
      if (center.x && animalBranchPos.x) {
        newLines.push({
          x1: center.x + 60, y1: center.y,
          x2: animalBranchPos.x - 80, y2: animalBranchPos.y,
          color: '#f43f5e', direction: 'down'
        });
      }
      if (center.x && usageBranchPos.x) {
        newLines.push({
          x1: center.x, y1: center.y + 70,
          x2: usageBranchPos.x, y2: usageBranchPos.y - 25,
          color: '#8b5cf6', direction: 'down'
        });
      }

      // Plant branch to leaves (0, 1)
      const leaf0 = getCenter(leafRefs.current[0]);
      const leaf1 = getCenter(leafRefs.current[1]);
      if (plantBranchPos.x && leaf0.x) {
        newLines.push({
          x1: plantBranchPos.x - 40, y1: plantBranchPos.y - 20,
          x2: leaf0.x, y2: leaf0.y + 40,
          color: '#4ade80', direction: 'up'
        });
      }
      if (plantBranchPos.x && leaf1.x) {
        newLines.push({
          x1: plantBranchPos.x + 40, y1: plantBranchPos.y - 20,
          x2: leaf1.x, y2: leaf1.y + 40,
          color: '#4ade80', direction: 'up'
        });
      }

      // Animal branch to leaves (2, 3)
      const leaf2 = getCenter(leafRefs.current[2]);
      const leaf3 = getCenter(leafRefs.current[3]);
      if (animalBranchPos.x && leaf2.x) {
        newLines.push({
          x1: animalBranchPos.x - 40, y1: animalBranchPos.y - 20,
          x2: leaf2.x, y2: leaf2.y + 40,
          color: '#fb7185', direction: 'up'
        });
      }
      if (animalBranchPos.x && leaf3.x) {
        newLines.push({
          x1: animalBranchPos.x + 40, y1: animalBranchPos.y - 20,
          x2: leaf3.x, y2: leaf3.y + 40,
          color: '#fb7185', direction: 'up'
        });
      }

      // Usage branch to leaves (4, 5)
      const leaf4 = getCenter(leafRefs.current[4]);
      const leaf5 = getCenter(leafRefs.current[5]);
      if (usageBranchPos.x && leaf4.x) {
        newLines.push({
          x1: usageBranchPos.x - 40, y1: usageBranchPos.y + 20,
          x2: leaf4.x, y2: leaf4.y - 40,
          color: '#eab308', direction: 'down'
        });
      }
      if (usageBranchPos.x && leaf5.x) {
        newLines.push({
          x1: usageBranchPos.x + 40, y1: usageBranchPos.y + 20,
          x2: leaf5.x, y2: leaf5.y - 40,
          color: '#f97316', direction: 'down'
        });
      }

      setLines(newLines);
    };

    // Calculate after a short delay to ensure DOM is ready
    const timer = setTimeout(calculateLines, 100);
    window.addEventListener('resize', calculateLines);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateLines);
    };
  }, []);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen py-4 w-full overflow-x-hidden overflow-y-auto pb-8">
      <h2 className="text-xl sm:text-3xl font-extrabold gradient-text mb-4 sm:mb-6 uppercase text-center px-4">
        Sơ đồ tư duy
      </h2>

      {/* Home Button */}
      <button
        onClick={onGoHome}
        className="fixed top-3 left-3 bg-white/90 hover:bg-white text-gray-700 p-2 sm:p-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 z-20"
        title="Về trang chủ"
      >
        <Home className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Mind Map Container - Changes layout based on screen size */}
      <div ref={containerRef} className="relative w-full max-w-4xl mx-auto px-2 sm:px-4">
        {/* SVG Layer - Hidden on mobile due to vertical layout */}
        {!isMobile && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            {lines.map((line, i) => (
              <CurvedLine key={i} {...line} />
            ))}
          </svg>
        )}

        {/* Mind Map Content - Vertical on mobile, horizontal on desktop */}
        <div className="relative z-10 flex flex-col items-center gap-2 sm:gap-3">

          {/* On Mobile: Show vertical list layout */}
          {isMobile ? (
            <>
              {/* Center Node */}
              <div className="mb-2">
                <NodeCard
                  ref={centerRef}
                  node={root}
                  onClick={() => handleNodeClick(root)}
                  variant="center"
                />
              </div>

              {/* Connector Arrow */}
              <div className="flex flex-col items-center text-gray-400 my-1">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-green-400 rounded-full"></div>
                <div className="text-green-500 text-lg">▼</div>
              </div>

              {/* Plant Section */}
              <div className="w-full bg-green-50/50 rounded-2xl p-3 mb-2">
                <div className="flex justify-center mb-3">
                  <NodeCard
                    ref={plantBranchRef}
                    node={plantBranch}
                    onClick={() => handleNodeClick(plantBranch)}
                    variant="branch"
                    bgColor="bg-gradient-to-br from-green-400 to-green-600"
                  />
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <NodeCard
                    ref={el => leafRefs.current[0] = el}
                    node={plantBranch.children![0]}
                    onClick={() => handleNodeClick(plantBranch.children![0])}
                    variant="leaf"
                    bgColor="bg-gradient-to-br from-green-100 to-green-200"
                    textColor="text-green-700"
                  />
                  <NodeCard
                    ref={el => leafRefs.current[1] = el}
                    node={plantBranch.children![1]}
                    onClick={() => handleNodeClick(plantBranch.children![1])}
                    variant="leaf"
                    bgColor="bg-gradient-to-br from-green-100 to-green-200"
                    textColor="text-green-700"
                  />
                </div>
              </div>

              {/* Connector Arrow */}
              <div className="flex flex-col items-center text-gray-400 my-1">
                <div className="w-1 h-4 bg-gradient-to-b from-green-400 to-rose-400 rounded-full"></div>
                <div className="text-rose-500 text-lg">▼</div>
              </div>

              {/* Animal Section */}
              <div className="w-full bg-rose-50/50 rounded-2xl p-3 mb-2">
                <div className="flex justify-center mb-3">
                  <NodeCard
                    ref={animalBranchRef}
                    node={animalBranch}
                    onClick={() => handleNodeClick(animalBranch)}
                    variant="branch"
                    bgColor="bg-gradient-to-br from-rose-400 to-rose-600"
                  />
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <NodeCard
                    ref={el => leafRefs.current[2] = el}
                    node={animalBranch.children![0]}
                    onClick={() => handleNodeClick(animalBranch.children![0])}
                    variant="leaf"
                    bgColor="bg-gradient-to-br from-rose-100 to-rose-200"
                    textColor="text-rose-700"
                  />
                  <NodeCard
                    ref={el => leafRefs.current[3] = el}
                    node={animalBranch.children![1]}
                    onClick={() => handleNodeClick(animalBranch.children![1])}
                    variant="leaf"
                    bgColor="bg-gradient-to-br from-rose-100 to-rose-200"
                    textColor="text-rose-700"
                  />
                </div>
              </div>

              {/* Connector Arrow */}
              <div className="flex flex-col items-center text-gray-400 my-1">
                <div className="w-1 h-4 bg-gradient-to-b from-rose-400 to-violet-400 rounded-full"></div>
                <div className="text-violet-500 text-lg">▼</div>
              </div>

              {/* Usage Section */}
              <div className="w-full bg-violet-50/50 rounded-2xl p-3">
                <div className="flex justify-center mb-3">
                  <NodeCard
                    ref={usageBranchRef}
                    node={usageBranch}
                    onClick={() => handleNodeClick(usageBranch)}
                    variant="branch"
                    bgColor="bg-gradient-to-br from-violet-500 to-purple-600"
                  />
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <NodeCard
                    ref={el => leafRefs.current[4] = el}
                    node={usageBranch.children![0]}
                    onClick={() => handleNodeClick(usageBranch.children![0])}
                    variant="leaf"
                    bgColor="bg-gradient-to-br from-yellow-100 to-yellow-200"
                    textColor="text-yellow-700"
                  />
                  <NodeCard
                    ref={el => leafRefs.current[5] = el}
                    node={usageBranch.children![1]}
                    onClick={() => handleNodeClick(usageBranch.children![1])}
                    variant="leaf"
                    bgColor="bg-gradient-to-br from-orange-100 to-orange-200"
                    textColor="text-orange-700"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Desktop: Original horizontal layout */}
              {/* Top Row - Leaf Nodes */}
              <div className="flex justify-between w-full px-4">
                {/* Plant Leaves */}
                <div className="flex gap-3">
                  <NodeCard
                    ref={el => leafRefs.current[0] = el}
                    node={plantBranch.children![0]}
                    onClick={() => handleNodeClick(plantBranch.children![0])}
                    variant="leaf"
                    bgColor="bg-gradient-to-br from-green-100 to-green-200"
                    textColor="text-green-700"
                  />
                  <NodeCard
                    ref={el => leafRefs.current[1] = el}
                    node={plantBranch.children![1]}
                    onClick={() => handleNodeClick(plantBranch.children![1])}
                    variant="leaf"
                    bgColor="bg-gradient-to-br from-green-100 to-green-200"
                    textColor="text-green-700"
                  />
                </div>

                {/* Animal Leaves */}
                <div className="flex gap-3">
                  <NodeCard
                    ref={el => leafRefs.current[2] = el}
                    node={animalBranch.children![0]}
                    onClick={() => handleNodeClick(animalBranch.children![0])}
                    variant="leaf"
                    bgColor="bg-gradient-to-br from-rose-100 to-rose-200"
                    textColor="text-rose-700"
                  />
                  <NodeCard
                    ref={el => leafRefs.current[3] = el}
                    node={animalBranch.children![1]}
                    onClick={() => handleNodeClick(animalBranch.children![1])}
                    variant="leaf"
                    bgColor="bg-gradient-to-br from-rose-100 to-rose-200"
                    textColor="text-rose-700"
                  />
                </div>
              </div>

              {/* Middle Row - Branch Nodes + Center */}
              <div className="flex items-center justify-center gap-6 my-2">
                {/* Plant Branch */}
                <NodeCard
                  ref={plantBranchRef}
                  node={plantBranch}
                  onClick={() => handleNodeClick(plantBranch)}
                  variant="branch"
                  bgColor="bg-gradient-to-br from-green-400 to-green-600"
                />

                {/* Center Node */}
                <NodeCard
                  ref={centerRef}
                  node={root}
                  onClick={() => handleNodeClick(root)}
                  variant="center"
                />

                {/* Animal Branch */}
                <NodeCard
                  ref={animalBranchRef}
                  node={animalBranch}
                  onClick={() => handleNodeClick(animalBranch)}
                  variant="branch"
                  bgColor="bg-gradient-to-br from-rose-400 to-rose-600"
                />
              </div>

              {/* Bottom Section - Usage Branch */}
              <div className="flex flex-col items-center gap-3 mt-2">
                {/* Usage Branch Node */}
                <NodeCard
                  ref={usageBranchRef}
                  node={usageBranch}
                  onClick={() => handleNodeClick(usageBranch)}
                  variant="branch"
                  bgColor="bg-gradient-to-br from-violet-500 to-purple-600"
                />

                {/* Usage Leaves */}
                <div className="flex gap-4">
                  <NodeCard
                    ref={el => leafRefs.current[4] = el}
                    node={usageBranch.children![0]}
                    onClick={() => handleNodeClick(usageBranch.children![0])}
                    variant="leaf"
                    bgColor="bg-gradient-to-br from-yellow-100 to-yellow-200"
                    textColor="text-yellow-700"
                  />
                  <NodeCard
                    ref={el => leafRefs.current[5] = el}
                    node={usageBranch.children![1]}
                    onClick={() => handleNodeClick(usageBranch.children![1])}
                    variant="leaf"
                    bgColor="bg-gradient-to-br from-orange-100 to-orange-200"
                    textColor="text-orange-700"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <p className="text-gray-500 mt-4 text-center px-4 text-xs sm:text-sm">
        💡 Bấm vào các ô để nghe kiến thức
      </p>

      <button
        onClick={onComplete}
        className="mt-4 mb-24 sm:mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 
                   text-white text-base sm:text-lg font-bold py-3 px-6 sm:px-10 rounded-full 
                   shadow-[0_8px_30px_rgba(99,102,241,0.4)]
                   transform transition hover:scale-105 hover:-translate-y-1 active:scale-95 glow-pulse"
      >
        Làm bài tập ngay! 🚀
      </button>
    </div>
  );
};