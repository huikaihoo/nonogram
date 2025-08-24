import { BadgeCheck, BadgeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn, padZero } from '@/lib/utils';
import { autoFinisheGrids, type Game } from '@/logic/game';
import Cell, { type InputType } from '@/pages/game/cell';
import Hint from '@/pages/game/hint';

type BoardProps = {
  game: Game;
  inputMode: InputType;
  grids: InputType[][];
  onGridChange?: (grid: InputType[][]) => void;
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

const Board: React.FC<BoardProps> = ({ game, inputMode, grids, onGridChange }) => {
  const rows = game.leftHints.length;
  const cols = game.topHints.length;

  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  // Calculate scores
  useEffect(() => {
    let correct = 0;
    let wrong = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grids[r][c] === 'filled') {
          game.solution[r][c] ? correct++ : wrong++;
        } else if ((grids[r][c] === 'crossed' || grids[r][c] === 'solution') && game.solution[r][c]) {
          wrong++;
        }
      }
    }
    setCorrectCount(correct);
    setWrongCount(wrong);
  }, [rows, cols, game, grids]);

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
      // Allow toggling if (axis is 'row' and row matches) or (axis is 'col' and col matches) or (axis is null)
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

  const maxTopHintHeight = Math.max(...game.topHints.map((h) => h.length), 5);
  const maxLeftHintWidth = Math.max(...game.leftHints.map((h) => h.length), 5.5);

  const hintBlockClass = 'flex items-center justify-center border text-xs text-center dark:bg-gray-700';

  return (
    <Card className="w-full block overflow-auto shadow-none border-0">
      <div className="flex justify-center items-center w-full h-full">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `${maxLeftHintWidth * 1.2}rem repeat(${cols}, minmax(1.2rem, 2rem))`,
            gridTemplateRows: `${maxTopHintHeight * 1.3}rem repeat(${rows}, minmax(1.2rem, 1fr))`,
            maxWidth: '100%',
          }}
          onContextMenu={(e) => e.preventDefault()} // Prevent default context menu
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Top-left corner with score badges */}
          <div className="col-span-1 row-span-1 flex flex-col items-center justify-center">
            <span className="mb-1">
              <Badge variant="default" className="bg-blue-600 text-white">
                <BadgeCheck />
                {padZero(correctCount, 3)}
              </Badge>
            </span>
            <span>
              <Badge variant="default" className="bg-red-600 text-white">
                <BadgeX />
                {padZero(wrongCount, 3)}
              </Badge>
            </span>
          </div>

          {/* Top hints */}
          {game.topHints.map((colHint, cIdx) => {
            const isHighlighted = !!hoveredCell && hoveredCell.col === cIdx;
            const extraBorder = [];
            if (cIdx % 5 === 0) extraBorder.push('border-l-2 border-l-black');

            return (
              <div
                key={`top-${cIdx}`}
                className={cn(
                  hintBlockClass,
                  extraBorder.join(' '),
                  isHighlighted && 'bg-yellow-100 dark:bg-yellow-700/80',
                )}
                style={{
                  gridColumnStart: cIdx + 2,
                  gridRowStart: 1,
                  flexDirection: 'column',
                  height: `${maxTopHintHeight * 1.3}rem`,
                }}
                onMouseEnter={() => setHoveredCell({ row: -1, col: cIdx })}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {colHint.map((data, idx) => (
                  <Hint key={idx} hintType="col" data={data} grids={grids.map((row) => row[cIdx])} />
                ))}
              </div>
            );
          })}

          {/* Left hints */}
          {game.leftHints.map((rowHint, rIdx) => {
            const isHighlighted = !!hoveredCell && hoveredCell.row === rIdx;
            const extraBorder = [];
            if (rIdx % 5 === 0) extraBorder.push('border-t-2 border-t-black');

            return (
              <div
                key={`left-${rIdx}`}
                className={cn(
                  hintBlockClass,
                  extraBorder.join(' '),
                  isHighlighted && 'bg-yellow-100 dark:bg-yellow-700/80',
                )}
                style={{
                  gridRowStart: rIdx + 2,
                  gridColumnStart: 1,
                  flexDirection: 'row',
                  width: `${maxLeftHintWidth * 1.2}rem`,
                }}
                onMouseEnter={() => setHoveredCell({ row: rIdx, col: -1 })}
                onMouseLeave={() => setHoveredCell(null)}
              >
                {rowHint.map((data, idx) => (
                  <Hint key={idx} hintType="row" data={data} grids={grids[rIdx]} />
                ))}
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
                  isHighlighted={hoveredCell !== null && (hoveredCell.row === rIdx) !== (hoveredCell.col === cIdx)}
                  onMouseEnter={() => setHoveredCell({ row: rIdx, col: cIdx })}
                  onMouseLeave={() => setHoveredCell(null)}
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
