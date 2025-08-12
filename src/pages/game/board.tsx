import type React from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Cell, { type InputType } from '@/pages/game/cell';
import type { Game } from '@/services/game';

type BoardProps = {
  game: Game;
  inputMode: InputType;
  grid: InputType[][];
  onGridChange?: (grid: InputType[][]) => void;
};

const Board: React.FC<BoardProps> = ({ game, inputMode, grid, onGridChange }) => {
  const rows = game.leftHints.length;
  const cols = game.topHints.length;

  const toggleCell = (r: number, c: number, reverseMode = false) => {
    if (!onGridChange) return;
    const current = grid[r][c];

    // Only allow clicks if the cell is empty
    if (current !== 'empty') return;

    const newGrid = grid.map((row) => [...row]);
    const currentMode: InputType = reverseMode ? (inputMode === 'filled' ? 'crossed' : 'filled') : inputMode;

    if (currentMode === 'filled') {
      newGrid[r][c] = 'filled';
    } else if (currentMode === 'crossed') {
      newGrid[r][c] = 'crossed';
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
                input={cell}
                result={game.result[rIdx][cIdx]}
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
