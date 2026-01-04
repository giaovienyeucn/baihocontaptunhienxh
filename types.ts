import { LucideIcon } from 'lucide-react';

export interface MindMapNode {
  id: string;
  title: string;
  description?: string;
  color: string;
  icon?: LucideIcon;
  children?: MindMapNode[];
  position?: 'left' | 'right' | 'bottom';
}

export interface Question {
  id: number;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctId: string;
}

export type AppPhase = 'intro' | 'mindmap' | 'quiz' | 'result' | 'game';
