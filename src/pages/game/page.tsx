import { Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { validatePuzzleCode } from '@/logic/code';
import { buildGame, type Game } from '@/logic/game';
import Board from '@/pages/game/board';
import type { InputType } from '@/pages/game/cell';

interface GamePageProps {
  setGameCode: (code: string) => void;
}

const GamePage: React.FC<GamePageProps> = ({ setGameCode }) => {
  const { type, code } = useParams<{ type: string; code: string }>();

  const [inputMode, setInputMode] = useState<InputType>('filled');
  const [game, setGame] = useState<Game | null>(null);
  const [grid, setGrid] = useLocalStorage<InputType[][] | null>(`game:${code || 'invalid'}`, null);
  const [_, setGameHistory] = useLocalStorage<string[]>('game-history', []);

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
      // Only initialize grid if not already present in local storage
      if (!grid) {
        setGrid(Array.from({ length: height }, () => Array.from({ length: width }, () => 'empty')));
      }
      // Update game history, remove current code if past history, prepend, limit to 15
      setGameHistory((prev) => {
        const filtered = prev.filter((c) => c !== puzzleCode.code);
        return [puzzleCode.code, ...filtered].slice(0, 15);
      });
    }
    return () => {
      setGameCode(''); // Clear game code when component unmounts
    };
  }, [type, code, navigate, setGameCode, grid, setGrid, setGameHistory]);

  const handleRestart = () => {
    if (game) {
      const rows = game.solution.length;
      const cols = game.solution[0]?.length || 0;
      setGrid(Array.from({ length: rows }, () => Array.from({ length: cols }, () => 'empty')));
    }
  };

  const handleShowSolution = () => {
    if (grid) {
      setGrid(grid.map((row: InputType[]) => row.map((cell: InputType) => (cell === 'empty' ? 'solution' : cell))));
    }
  };

  return (
    <div className="container mx-auto p-0 max-w-4xl">
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
      {game && grid && (
        <div className="mt-8 flex w-full">
          <Board grids={grid} game={game} onGridChange={setGrid} inputMode={inputMode} />
        </div>
      )}
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
