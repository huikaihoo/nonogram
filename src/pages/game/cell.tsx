import { XIcon } from 'lucide-react';
import type React from 'react';

import { cn } from '@/lib/utils';
import type { InputType } from '@/logic/game';

type CellProps = {
  coordinate: string;
  input: InputType; // "empty" | "filled" | "crossed" | "solution"
  result: boolean; // cell should be filled or not
  className?: string;
  isHighlighted?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
};

const Cell: React.FC<CellProps> = ({
  coordinate,
  input,
  result,
  className,
  isHighlighted,
  onMouseEnter,
  onMouseLeave,
}) => {
  const isCorrect = input === 'empty' || (input === 'filled' && result) || (input === 'crossed' && !result);

  let baseClass =
    'touch-none min-w-[1.2rem] min-h-[1.2rem] max-w-[2rem] max-h-[2rem] w-full h-full border flex items-center justify-center select-none aspect-square dark:bg-gray-500 dark:text-black';
  baseClass = cn(baseClass, input === 'empty' ? 'cursor-pointer' : 'cursor-default');

  let content: React.ReactNode = null;
  let needHighlight = isHighlighted || false;

  if (input === 'empty' || (input === 'solution' && !result)) {
    // empty or not filled when apply solution
    baseClass = cn(baseClass, 'bg-white');
  } else if (result) {
    // filled
    const bgColor = input === 'solution' || !isCorrect ? 'bg-red-400 dark:bg-red-900' : 'bg-gray-700 dark:bg-black';
    baseClass = cn(baseClass, bgColor);
    needHighlight = false;
  } else {
    // not filled
    baseClass = cn(baseClass, isCorrect ? 'text-gray-700' : 'text-red-400 dark:text-red-700', 'text-2xl font-bold');
    content = <XIcon strokeWidth={3} />;
  }

  return (
    <div
      className={cn(baseClass, needHighlight && 'bg-yellow-100 dark:bg-yellow-700/80', className)}
      cell-coordinate={coordinate}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {content}
    </div>
  );
};

export default Cell;
export type { InputType, CellProps };
