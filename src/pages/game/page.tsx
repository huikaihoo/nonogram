import { Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { validatePuzzleCode } from '@/logic/code';
import { buildGame } from '@/logic/game';
import Board from '@/pages/game/board';
import type { InputType } from '@/pages/game/cell';

interface GamePageProps {
  setGameCode: (code: string) => void;
}

const GamePage: React.FC<GamePageProps> = ({ setGameCode }) => {
  const { type, code } = useParams<{ type: string; code: string }>();

  // No need to keep puzzleCode in state if not used elsewhere
  const [game, setGame] = useState(() => buildGame('4222', 20, 20, 0.6));
  const [inputMode, setInputMode] = useState<InputType>('filled');
  const [grid, setGrid] = useState<InputType[][]>(() =>
    Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => 'empty')),
  );

  const navigate = useNavigate();

  useEffect(() => {
    // Validate type (must be 'p' or 'i') and code
    const isValidType = type === 'p' || type === 'i';
    const puzzleCode = validatePuzzleCode(code);

    if (!isValidType || !puzzleCode) {
      navigate('/start', { replace: true });
    }
    if (puzzleCode) {
      setGameCode(puzzleCode.code);
      const { seed, height, width, fillPercent } = puzzleCode;
      const thresholdNum = fillPercent / 100;
      setGame(buildGame(seed, height, width, thresholdNum));
      setGrid(Array.from({ length: height }, () => Array.from({ length: width }, () => 'empty')));
    }
    return () => {
      setGameCode(''); // Clear game code when component unmounts
    };
  }, [type, code, navigate, setGameCode]);

  const handleRestart = () => {
    setGrid(grid.map((row) => row.map(() => 'empty')));
  };

  const handleShowSolution = () => {
    setGrid(grid.map((row) => row.map((cell) => (cell === 'empty' ? 'solution' : cell))));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center justify-between gap-2 flex-wrap w-full">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleRestart}>
            Restart
          </Button>
          <Button size="sm" variant="outline" onClick={handleShowSolution}>
            Solution
          </Button>
        </div>
        <Button size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
      <div className="mt-8 flex w-full">
        <Board grids={grid} game={game} onGridChange={setGrid} inputMode={inputMode} />
      </div>
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Mode:</span>
          <ToggleGroup
            variant="outline"
            size="lg"
            type="single"
            value={inputMode}
            onValueChange={(value) => value && setInputMode(value as InputType)}
          >
            <ToggleGroupItem value="filled">Fill</ToggleGroupItem>
            <ToggleGroupItem value="crossed">Cross</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
