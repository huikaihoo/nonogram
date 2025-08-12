import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import Board, { type PlayMode } from '@/pages/game/board';
import { buildGame } from '@/services/game';

// Configuration constants
const DIMENSION_MIN = 5;
const DIMENSION_MAX = 30;
const THRESHOLD_MIN = 0.1;
const THRESHOLD_MAX = 0.9;
const THRESHOLD_STEP = 0.1;

function GamePage() {
  const [seed, setSeed] = React.useState('4222');
  const [height, setHeight] = React.useState<number | string>(20);
  const [width, setWidth] = React.useState<number | string>(20);
  const [threshold, setThreshold] = React.useState<number | string>(0.6);
  const [game, setGame] = React.useState(() => buildGame(seed, 20, 20, 0.6));
  const [grid, setGrid] = React.useState<('empty' | 'filled' | 'crossed')[][]>(() => {
    const heightNum = typeof height === 'number' ? height : parseInt(height as string) || DIMENSION_MIN;
    const widthNum = typeof width === 'number' ? width : parseInt(width as string) || DIMENSION_MIN;
    return Array.from({ length: heightNum }, () => Array.from({ length: widthNum }, () => 'empty'));
  });
  const [playMode, setPlayMode] = React.useState<PlayMode>('fill');

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(e.target.value);
  };

  const handleNewGame = () => {
    const heightNum = typeof height === 'number' ? height : parseInt(height as string) || DIMENSION_MIN;
    const widthNum = typeof width === 'number' ? width : parseInt(width as string) || DIMENSION_MIN;
    const thresholdNum = typeof threshold === 'number' ? threshold : parseFloat(threshold as string) || THRESHOLD_MIN;

    const newGame = buildGame(seed, heightNum, widthNum, thresholdNum);
    setGame(newGame);
    setGrid(Array.from({ length: heightNum }, () => Array.from({ length: widthNum }, () => 'empty')));
  };

  const handleShowSolution = () => {
    setGrid(game.board.map((row) => row.map((cell) => (cell ? 'filled' : 'empty'))));
  };

  return (
    <>
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <label htmlFor="height" className="text-sm font-medium">
            Height:
          </label>
          <Input
            id="height"
            type="number"
            value={height}
            numberValidation="int"
            min={DIMENSION_MIN}
            max={DIMENSION_MAX}
            onValueChange={setHeight}
            className="w-20"
          />
        </div>
        <div className="flex items-center gap-1">
          <label htmlFor="width" className="text-sm font-medium">
            Width:
          </label>
          <Input
            id="width"
            type="number"
            value={width}
            numberValidation="int"
            min={DIMENSION_MIN}
            max={DIMENSION_MAX}
            onValueChange={setWidth}
            className="w-20"
          />
        </div>
        <div className="flex items-center gap-1">
          <label htmlFor="threshold" className="text-sm font-medium">
            Threshold:
          </label>
          <Input
            id="threshold"
            type="number"
            value={threshold}
            numberValidation="float"
            min={THRESHOLD_MIN}
            max={THRESHOLD_MAX}
            onValueChange={setThreshold}
            className="w-20"
            step={THRESHOLD_STEP}
          />
        </div>
        <div className="flex items-center gap-1">
          <label htmlFor="seed" className="text-sm font-medium">
            Seed:
          </label>
          <Input id="seed" type="text" value={seed} onChange={handleSeedChange} className="w-36" placeholder="Seed" />
        </div>
        <Button onClick={handleNewGame}>New Game</Button>
        <Button variant="outline" onClick={handleShowSolution}>
          Solution
        </Button>
      </div>
      <div className="mt-4">
        <Board grid={grid} game={game} onGridChange={setGrid} playMode={playMode} />
      </div>
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium">Mode:</span>
        <ToggleGroup
          variant="outline"
          size="lg"
          type="single"
          value={playMode}
          onValueChange={(value) => value && setPlayMode(value as PlayMode)}
        >
          <ToggleGroupItem value="fill">Fill</ToggleGroupItem>
          <ToggleGroupItem value="cross">Cross</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </>
  );
}

export default GamePage;
