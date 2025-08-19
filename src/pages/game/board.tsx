import { useRef, useState } from 'react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { autoFinisheGrids, type Game } from '@/logic/game';
import Cell, { type InputType } from '@/pages/game/cell';

type BoardProps = {
  game: Game;
  inputMode: InputType;
  grids: InputType[][];
  onGridChange?: (grid: InputType[][]) => void;
};

const Board: React.FC<BoardProps> = ({ game, inputMode, grids, onGridChange }) => {
  const rows = game.leftHints.length;
  const cols = game.topHints.length;

  const [touching, setTouching] = useState(false);
  const touchStatus = useRef<{
    toggledCells: Set<string>;
    axis: 'row' | 'col' | null;
    index: number | null;
    reverseMode: boolean;
  }>({
    toggledCells: new Set(),
    axis: null,
    index: null,
    reverseMode: false,
  });

  const toggleCell = (r: number, c: number, reverseMode = false) => {
    console.log('toggleCell', { r, c, reverseMode });
    if (!onGridChange) return;
    const current = grids[r][c];
    // Only allow clicks if the cell is empty
    if (current !== 'empty') return;

    const newGrids = grids.map((row) => [...row]);
    newGrids[r][c] = reverseMode ? (inputMode === 'filled' ? 'crossed' : 'filled') : inputMode;
    autoFinisheGrids(newGrids, game.solution, r, c); // auto update newGrids to crossed if row / col is finished

    onGridChange(newGrids);
  };

  // Pointer event handlers (unified for mouse/touch/stylus)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    console.log('handlePointerDown', e);
    e.preventDefault();
    setTouching(true);
    touchStatus.current = {
      toggledCells: new Set(),
      axis: null,
      index: null,
      reverseMode: e.button === 2, // check if it is right-click
    };

    const cell = getCellFromPointer(e);
    if (cell) {
      const [row, col, key] = cell;
      touchStatus.current.toggledCells.add(key);
      toggleCell(row, col, touchStatus.current.reverseMode);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!touching) return;
    e.preventDefault();
    // Only act if pointer is down (buttons !== 0)
    if (e.buttons === 0) return;
    const cell = getCellFromPointer(e);
    if (cell) {
      const [row, col, key] = cell;
      if (touchStatus.current.toggledCells.has(key)) return;

      // If this is the first move (second cell), determine axis
      if (touchStatus.current.axis === null && touchStatus.current.toggledCells.size > 0) {
        // Find the first toggled cell
        const [firstKey] = touchStatus.current.toggledCells;
        const [firstRow, firstCol] = firstKey.split('-').map(Number);

        if (row === firstRow && col !== firstCol) {
          touchStatus.current.axis = 'row';
          touchStatus.current.index = row;
        } else if (col === firstCol && row !== firstRow) {
          touchStatus.current.axis = 'col';
          touchStatus.current.index = col;
        } else {
          // If diagonal or same cell, do not allow
          return;
        }
      }

      // After axis is set, only allow toggling cells in the same row or column as all toggled cells
      // Allow toggling if:
      // - axis is 'row' and row matches
      // - axis is 'col' and col matches
      // - axis is null (first cell)
      if (
        (touchStatus.current.axis === 'row' && row === touchStatus.current.index) ||
        (touchStatus.current.axis === 'col' && col === touchStatus.current.index) ||
        touchStatus.current.axis === null
      ) {
        touchStatus.current.toggledCells.add(key);
        toggleCell(row, col, touchStatus.current.reverseMode);
      }
    }
  };

  const handlePointerUp = () => {
    console.log('handlePointerUp');
    setTouching(false);
    touchStatus.current = {
      toggledCells: new Set(),
      axis: null,
      index: null,
      reverseMode: false,
    };
  };

  // Helper for pointer event
  const getCellFromPointer = (e: React.PointerEvent): [number, number, string] | null => {
    const element = document.elementFromPoint(e.clientX, e.clientY);
    if (!element) {
      console.log('getCellFromPointer: no element at point', e.clientX, e.clientY);
      return null;
    }
    const cellDiv = element.closest('[cell-coordinate]');
    if (!cellDiv) {
      console.log('getCellFromPointer: no cell found');
      return null;
    }
    const coordinate = (cellDiv as HTMLElement).getAttribute('cell-coordinate');
    if (!coordinate) {
      console.log('getCellFromPointer: missing cell-coordinate attribute');
      return null;
    }
    const [r, c] = coordinate.split('-').map(Number);
    console.log('getCellFromPointer: found cell', r, c);
    return [r, c, coordinate];
  };

  const maxTopHintHeight = Math.max(...game.topHints.map((h) => h.length));
  const maxLeftHintWidth = Math.max(...game.leftHints.map((h) => h.length));

  const hintBlockClass = 'flex items-center justify-center border border-gray-300 text-xs text-center';

  return (
    <Card className="w-full block overflow-auto shadow-none border-0">
      <div className="flex justify-center items-center w-full h-full">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `${maxLeftHintWidth * 1}rem repeat(${cols}, minmax(1.2rem, 2rem))`,
            gridTemplateRows: `${maxTopHintHeight * 1.2}rem repeat(${rows}, minmax(1.2rem, 1fr))`,
            maxWidth: '100%',
          }}
          onContextMenu={(e) => e.preventDefault()} // Prevent default context menu
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
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
                  height: `${maxTopHintHeight * 1.2}rem`,
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
                  width: `${maxLeftHintWidth * 1}rem`,
                }}
              >
                {rowHint.join(' ')}
              </div>
            );
          })}

          {/* Cells */}
          {grids.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const extraBorder = [];
              if (cIdx % 5 === 0) extraBorder.push('border-l-2 border-l-black');
              if (rIdx % 5 === 0) extraBorder.push('border-t-2 border-t-black');

              return (
                <Cell
                  key={`${rIdx}-${cIdx}`}
                  coordinate={`${rIdx}-${cIdx}`}
                  input={cell}
                  result={game.solution[rIdx][cIdx]}
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
      </div>
    </Card>
  );
};

export default Board;
