import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import "./App.css";
import Board from "@/components/board";
import { buildGame } from "@/service/game";

function App() {
  const [seed, setSeed] = React.useState(4222);
  const [game, setGame] = React.useState(() => buildGame(seed, 20, 20));

  const handleSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(Number(e.target.value));
  };

  const handleApplySeed = () => {
    setGame(buildGame(seed, 10, 10));
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Board
        initialGrid={game.board.map((row) =>
          row.map((cell) => (cell ? "filled" : "empty"))
        )}
        game={game}
      />
      <div className="mt-4 flex items-center gap-2">
        <Input
          type="number"
          value={seed}
          onChange={handleSeedChange}
          className="w-32"
          placeholder="Seed"
        />
        <Button onClick={handleApplySeed}>Apply</Button>
      </div>
    </div>
  );
}

export default App;
