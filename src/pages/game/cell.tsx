import { XIcon } from 'lucide-react';
import type React from 'react';

import { cn } from '@/lib/utils';

type InputType = 'empty' | 'filled' | 'crossed' | 'solution';

type CellProps = {
  coordinate: string;
  input: InputType;
  result: boolean; // cell should be filled or not
  style?: React.CSSProperties;
  className?: string;
};

const Cell: React.FC<CellProps> = ({ coordinate, input, result, style, className }) => {
  const base =
    'min-w-[1.2rem] min-h-[1.2rem] max-w-[2rem] max-h-[2rem] w-full h-full border border-gray-300 flex items-center justify-center select-none aspect-square';
  const isCorrect = input === 'empty' || (input === 'filled' && result) || (input === 'crossed' && !result);

  let cellClass = cn(base, input === 'empty' ? 'cursor-pointer' : 'cursor-default');
  let content: React.ReactNode = null;

  if (input === 'empty' || (input === 'solution' && !result)) {
    // empty or not filled when apply solution
    cellClass = cn(cellClass, 'bg-white', className);
  } else if (result) {
    // filled
    const bgColor = input === 'solution' ? 'bg-yellow-400' : isCorrect ? 'bg-gray-500' : 'bg-red-400';
    cellClass = cn(cellClass, bgColor, className);
  } else {
    // not filled
    cellClass = cn(cellClass, isCorrect ? 'text-gray-700' : 'text-red-400', 'text-2xl font-bold', className);
    content = <XIcon strokeWidth={3} />;
  }

  return (
    <div style={{ ...style, touchAction: 'none' }} className={cellClass} cell-coordinate={coordinate}>
      {content}
    </div>
  );
};

export default Cell;
export type { InputType, CellProps };
