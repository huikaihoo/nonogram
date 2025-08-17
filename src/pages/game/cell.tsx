import type React from 'react';

import { cn } from '@/lib/utils';

type InputType = 'empty' | 'filled' | 'crossed' | 'solution';

type CellProps = {
  input: InputType;
  result: boolean;
  onClick: () => void;
  onRightClick: () => void;
  style?: React.CSSProperties;
  className?: string;
};

const Cell: React.FC<CellProps> = ({ input, result, onClick, onRightClick, style, className }) => {
  const base =
    'min-w-[1.2rem] min-h-[1.2rem] max-w-[2rem] max-h-[2rem] w-full h-full border border-gray-300 flex items-center justify-center select-none aspect-square';
  const cursorClass = input === 'empty' ? 'cursor-pointer' : 'cursor-default';

  // Determine if the current cell state is correct
  const isCorrect = input === 'empty' || (input === 'filled' && result) || (input === 'crossed' && !result);

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent context menu
    onRightClick();
  };

  // Handle empty cells and solution cells with false result (both show white background)
  if (input === 'empty' || (input === 'solution' && !result)) {
    return (
      <div
        onClick={onClick}
        onContextMenu={handleRightClick}
        style={style}
        className={cn(base, cursorClass, 'bg-white', className)}
      ></div>
    );
  }

  // Render based on result when input is not empty
  if (result) {
    // Show filled case when result is true
    const bgColor = input === 'solution' ? 'bg-yellow-400' : isCorrect ? 'bg-gray-500' : 'bg-red-400';
    return (
      <div
        onClick={onClick}
        onContextMenu={handleRightClick}
        style={style}
        className={cn(base, cursorClass, bgColor, className)}
      ></div>
    );
  } else {
    // Show cross when result is false (non-solution cases)
    return (
      <div
        onClick={onClick}
        onContextMenu={handleRightClick}
        style={style}
        className={cn(base, cursorClass, isCorrect ? 'text-gray-700' : 'text-red-400', 'text-2xl font-bold', className)}
      >
        &times;
      </div>
    );
  }
};

export default Cell;
export type { InputType, CellProps };
