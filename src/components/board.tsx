import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import type { Game } from "@/service/game";

type CellType = "empty" | "filled" | "marked";

type CellProps = {
  type: CellType;
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
};
const Cell: React.FC<CellProps> = ({ type, onClick, style, className }) => {
  const base =
    "w-6 h-6 border border-gray-300 flex items-center justify-center cursor-pointer select-none";
  switch (type) {
    case "filled":
      return (
        <div
          onClick={onClick}
          style={style}
          className={cn(base, "bg-gray-800", className)}
        ></div>
      );
    case "marked":
      return (
        <div
          onClick={onClick}
          style={style}
          className={cn(base, "text-red-500 text-lg font-bold", className)}
        >
          &times;
        </div>
      );
    default:
      return (
        <div
          onClick={onClick}
          style={style}
          className={cn(base, "bg-white", className)}
        ></div>
      );
  }
};

type BoardProps = {
  initialGrid: CellType[][];
  game: Game;
};

const Board: React.FC<BoardProps> = ({ initialGrid, game }) => {
  const rows = game.leftHints.length;
  const cols = game.topHints.length;
  const [grid, setGrid] = useState<CellType[][]>(initialGrid);

  const toggleCell = (r: number, c: number) => {
    setGrid((prev) => {
      const newGrid = prev.map((row) => [...row]);
      const current = newGrid[r][c];
      if (current === "empty") newGrid[r][c] = "filled";
      else if (current === "filled") newGrid[r][c] = "marked";
      else newGrid[r][c] = "empty";
      return newGrid;
    });
  };

  const maxTopHintHeight = Math.max(...game.topHints.map((h) => h.length));
  const maxLeftHintWidth = Math.max(...game.leftHints.map((h) => h.length));

  const hintBlockClass =
    "flex items-center justify-center border border-gray-300 text-xs text-center p-0.5 leading-tight";

  return (
    <Card className="inline-block overflow-auto p-4">
      <div
        className="inline-grid"
        style={{
          gridTemplateColumns: `${
            maxLeftHintWidth * 1.5
          }rem repeat(${cols}, 1.5rem)`,
          gridTemplateRows: `${
            maxTopHintHeight * 1.5
          }rem repeat(${rows}, 1.5rem)`,
        }}
      >
        {/* Empty top-left corner */}
        <div className="col-span-1 row-span-1"></div>

        {/* Top hints */}
        {game.topHints.map((colHint, cIdx) => {
          const extraBorder = [];
          if (cIdx % 5 === 0) extraBorder.push("border-l-2 border-l-black");

          return (
            <div
              key={`top-${cIdx}`}
              className={cn(hintBlockClass, extraBorder.join(" "))}
              style={{
                gridColumnStart: cIdx + 2,
                gridRowStart: 1,
                flexDirection: "column",
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
          if (rIdx % 5 === 0) extraBorder.push("border-t-2 border-t-black");

          return (
            <div
              key={`left-${rIdx}`}
              className={cn(hintBlockClass, extraBorder.join(" "))}
              style={{
                gridRowStart: rIdx + 2,
                gridColumnStart: 1,
                flexDirection: "row",
                width: `${maxLeftHintWidth * 1.5}rem`,
              }}
            >
              {rowHint.join(" ")}
            </div>
          );
        })}

        {/* Cells */}
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const extraBorder = [];
            if (cIdx % 5 === 0) extraBorder.push("border-l-2 border-l-black");
            if (rIdx % 5 === 0) extraBorder.push("border-t-2 border-t-black");

            return (
              <Cell
                key={`${rIdx}-${cIdx}`}
                type={cell}
                onClick={() => toggleCell(rIdx, cIdx)}
                style={{
                  gridColumnStart: cIdx + 2,
                  gridRowStart: rIdx + 2,
                }}
                className={extraBorder.join(" ")}
              />
            );
          })
        )}
      </div>
    </Card>
  );
};

export default Board;
