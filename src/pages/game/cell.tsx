import type React from 'react';

import { cn } from '@/lib/utils';

type CellType = 'empty' | 'filled' | 'crossed';

type CellProps = {
  type: CellType;
  result: boolean;
  onClick: () => void;
  onRightClick: () => void;
  style?: React.CSSProperties;
  className?: string;
};

const Cell: React.FC<CellProps> = ({ type, onClick, onRightClick, style, className, result }) => {
  const base = 'w-6 h-6 border border-gray-300 flex items-center justify-center cursor-pointer select-none';

  // Determine if the current cell state is correct
  const isCorrect = type === 'empty' || (type === 'filled' && result) || (type === 'crossed' && !result);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent context menu
    onRightClick();
  };

  switch (type) {
    case 'filled':
      return (
        <div
          onClick={onClick}
          onContextMenu={handleRightClick}
          style={style}
          className={cn(base, isCorrect ? 'bg-gray-500' : 'bg-red-400', className)}
        ></div>
      );
    case 'crossed':
      return (
        <div
          onClick={onClick}
          onContextMenu={handleRightClick}
          style={style}
          className={cn(base, isCorrect ? 'text-gray-700' : 'text-red-400', 'text-lg font-bold', className)}
        >
          &times;
        </div>
      );
    default:
      return (
        <div
          onClick={onClick}
          onContextMenu={handleRightClick}
          style={style}
          className={cn(base, 'bg-white', className)}
        ></div>
      );
  }
};

export default Cell;
export type { CellType, CellProps };
