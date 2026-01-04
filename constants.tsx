import { Leaf, Droplets, Heart, Eye, HandHeart, UtensilsCrossed, Trees, PawPrint } from 'lucide-react';
import { MindMapNode, Question } from './types';

export const MIND_MAP_DATA: MindMapNode = {
  id: 'root',
  title: 'PHÂN LOẠI THỰC VẬT VÀ ĐỘNG VẬT',
  color: 'bg-gradient-to-br from-blue-400 to-blue-600',
  icon: Trees,
  children: [
    {
      id: 'branch-plant',
      title: 'Các bộ phận của thực vật và chức năng',
      color: 'bg-green-600',
      position: 'left',
      children: [
        {
          id: 'leaf',
          title: 'Lá cây',
          description: 'Quang hợp, thoát hơi nước',
          color: 'bg-green-300 text-green-900',
          icon: Leaf
        },
        {
          id: 'root-part',
          title: 'Rễ cây',
          description: 'Hút nước và chất trong đất',
          color: 'bg-green-300 text-green-900',
          icon: Droplets
        }
      ]
    },
    {
      id: 'branch-animal',
      title: 'Các bộ phận của động vật và chức năng',
      color: 'bg-rose-500',
      position: 'right',
      children: [
        {
          id: 'fur',
          title: 'Lông',
          description: 'Giữ ấm và điều hoà cơ thể',
          color: 'bg-red-200 text-red-900',
          icon: PawPrint
        },
        {
          id: 'eye',
          title: 'Mắt',
          description: 'Quan sát và nhận biết xung quanh',
          color: 'bg-red-200 text-red-900',
          icon: Eye
        }
      ]
    },
    {
      id: 'branch-usage',
      title: 'Sử dụng hợp lí thực vật và động vật',
      color: 'bg-indigo-500',
      position: 'bottom',
      children: [
        {
          id: 'veg-usage',
          title: 'Dùng rau tiết kiệm,',
          description: 'không nấu thừa',
          color: 'bg-yellow-400 text-yellow-900',
          icon: UtensilsCrossed
        },
        {
          id: 'animal-care',
          title: 'Chăm sóc,',
          description: 'không hành hạ động vật',
          color: 'bg-orange-400 text-orange-900',
          icon: HandHeart
        }
      ]
    }
  ]
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Lá cây có chức năng gì?",
    options: [
      { id: "A", text: "Quang hợp, thoát hơi nước" },
      { id: "B", text: "Tạo ra rễ mới" },
      { id: "C", text: "Hút nước từ đất" }
    ],
    correctId: "A"
  },
  {
    id: 2,
    question: "Rễ cây dùng để làm gì?",
    options: [
      { id: "A", text: "Tạo ra ánh sáng" },
      { id: "B", text: "Hút nước và chất trong đất" },
      { id: "C", text: "Giữ ấm cho cây" }
    ],
    correctId: "B"
  },
  {
    id: 3,
    question: "Lông của động vật có tác dụng gì?",
    options: [
      { id: "A", text: "Giữ ấm và điều hòa cơ thể" },
      { id: "B", text: "Giúp động vật bay" },
      { id: "C", text: "Dùng để ăn thức ăn" }
    ],
    correctId: "A"
  },
  {
    id: 4,
    question: "Mắt của động vật dùng để làm gì?",
    options: [
      { id: "A", text: "Giúp động vật thở" },
      { id: "B", text: "Quan sát và nhận biết xung quanh" },
      { id: "C", text: "Giúp động vật chạy nhanh" }
    ],
    correctId: "B"
  },
  {
    id: 5,
    question: "Cách sử dụng rau đúng là gì?",
    options: [
      { id: "A", text: "Nấu thật nhiều rồi bỏ đi" },
      { id: "B", text: "Dùng rau tiết kiệm, không nấu thừa" },
      { id: "C", text: "Hái rau thật nhiều cho vui" }
    ],
    correctId: "B"
  },
  {
    id: 6,
    question: "Chúng ta nên đối xử với động vật như thế nào?",
    options: [
      { id: "A", text: "Đánh và trêu chọc động vật" },
      { id: "B", text: "Chăm sóc, không hành hạ động vật" },
      { id: "C", text: "Bỏ đói động vật" }
    ],
    correctId: "B"
  }
];