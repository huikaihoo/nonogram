import type React from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Game } from '@/service/game';

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

type PlayMode = 'fill' | 'cross';

type BoardProps = {
  game: Game;
  grid: CellType[][];
  onGridChange?: (grid: CellType[][]) => void;
  playMode: PlayMode;
};

const Board: React.FC<BoardProps> = ({ grid, game, onGridChange, playMode }) => {
  const rows = game.leftHints.length;
  const cols = game.topHints.length;

  const toggleCell = (r: number, c: number, reverseMode = false) => {
    if (!onGridChange) return;
    const newGrid = grid.map((row) => [...row]);
    const current = newGrid[r][c];
    const currentMode: PlayMode = reverseMode ? (playMode === 'fill' ? 'cross' : 'fill') : playMode;

    if (currentMode === 'fill') {
      // Fill mode: empty -> filled -> empty
      if (current === 'empty') newGrid[r][c] = 'filled';
      else if (current === 'filled') newGrid[r][c] = 'empty';
      else newGrid[r][c] = 'filled'; // crossed -> filled
    } else {
      // Cross mode: empty -> crossed -> empty
      if (current === 'empty') newGrid[r][c] = 'crossed';
      else if (current === 'crossed') newGrid[r][c] = 'empty';
      else newGrid[r][c] = 'crossed'; // filled -> crossed
    }

    onGridChange(newGrid);
  };

  const maxTopHintHeight = Math.max(...game.topHints.map((h) => h.length));
  const maxLeftHintWidth = Math.max(...game.leftHints.map((h) => h.length));

  const hintBlockClass =
    'flex items-center justify-center border border-gray-300 text-xs text-center p-0.5 leading-tight';

  return (
    <Card className="inline-block overflow-auto p-4">
      <div
        className="inline-grid"
        style={{
          gridTemplateColumns: `${maxLeftHintWidth * 1.5}rem repeat(${cols}, 1.5rem)`,
          gridTemplateRows: `${maxTopHintHeight * 1.5}rem repeat(${rows}, 1.5rem)`,
        }}
      >
        {/* Empty top-left corner */}
        <div className="col-span-1 row-span-1"></div>

        {/* Top hints */}
        {game.topHints.map((colHint, cIdx) => {
          const extraBorder = [];
          if (cIdx % 5 === 0) extraBorder.push('border-l-2 border-l-black');

          return (
            <div
              key={`top-${cIdx}`}
              className={cn(hintBlockClass, extraBorder.join(' '))}
              style={{
                gridColumnStart: cIdx + 2,
                gridRowStart: 1,
                flexDirection: 'column',
                height: `${maxTopHintHeight * 1.5}rem`,
              }}
            >
              {colHint.map((hint, idx) => (
                <div key={idx}>{hint}</div>
              ))}
            </div>
          );
        })}

        {/* Left hints */}
        {game.leftHints.map((rowHint, rIdx) => {
          const extraBorder = [];
          if (rIdx % 5 === 0) extraBorder.push('border-t-2 border-t-black');

          return (
            <div
              key={`left-${rIdx}`}
              className={cn(hintBlockClass, extraBorder.join(' '))}
              style={{
                gridRowStart: rIdx + 2,
                gridColumnStart: 1,
                flexDirection: 'row',
                width: `${maxLeftHintWidth * 1.5}rem`,
              }}
            >
              {rowHint.join(' ')}
            </div>
          );
        })}

        {/* Cells */}
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const extraBorder = [];
            if (cIdx % 5 === 0) extraBorder.push('border-l-2 border-l-black');
            if (rIdx % 5 === 0) extraBorder.push('border-t-2 border-t-black');

            return (
              <Cell
                key={`${rIdx}-${cIdx}`}
                type={cell}
                result={game.board[rIdx][cIdx]}
                onClick={() => toggleCell(rIdx, cIdx)}
                onRightClick={() => toggleCell(rIdx, cIdx, true)}
                style={{
                  gridColumnStart: cIdx + 2,
                  gridRowStart: rIdx + 2,
                }}
                className={extraBorder.join(' ')}
              />
            );
          }),
        )}
      </div>
    </Card>
  );
};

export default Board;
export type { PlayMode };
