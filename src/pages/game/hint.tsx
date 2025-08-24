import { cn } from '@/lib/utils';
import type { HintData, InputType } from '@/logic/game';

type HintProps = {
  hintType: 'row' | 'col';
  data: HintData;
  grids: InputType[];
  style?: React.CSSProperties;
  className?: string;
};

const Hint: React.FC<HintProps> = ({ hintType, data, grids, style, className }) => {
  const finished =
    data.count === 0 ||
    grids.slice(0, data.lastIdx + 1).every((cell) => cell !== 'empty') ||
    grids.slice(data.firstIdx).every((cell) => cell !== 'empty');

  let baseClass = 'rounded border select-none';

  baseClass = cn(baseClass, hintType === 'col' ? 'px-1 mt-0.5' : 'px-0.5 ml-0.5');
  baseClass = cn(
    baseClass,
    finished ? 'line-through text-gray-300 border-gray-200 dark:text-gray-800 dark:border-gray-800' : '',
  );

  return (
    <div className={cn('', baseClass, className)} style={style}>
      {data.count}
    </div>
  );
};

export default Hint;
export type { HintProps };
