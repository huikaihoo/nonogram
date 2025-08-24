import { cn } from '@/lib/utils';
import type { HintData, InputType } from '@/logic/game';

type HintProps = {
  hintType: 'row' | 'col';
  data: HintData;
  grids: InputType[];
  className?: string;
};

const Hint: React.FC<HintProps> = ({ hintType, data, grids, className }) => {
  const finished =
    data.count === 0 ||
    grids.slice(0, data.lastIdx + 1).every((cell) => cell !== 'empty') ||
    grids.slice(data.firstIdx).every((cell) => cell !== 'empty');

  return (
    <div
      className={cn(
        'rounded border select-none',
        hintType === 'col' ? 'px-1 mt-0.5' : 'px-0.5 ml-0.5',
        finished && 'line-through text-gray-300 border-gray-200 dark:text-gray-800 dark:border-gray-800',
        className,
      )}
    >
      {data.count}
    </div>
  );
};

export default Hint;
export type { HintProps };
