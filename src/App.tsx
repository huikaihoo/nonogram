import GamePage from '@/pages/game/page';
import GeneratePage from '@/pages/generate/page';

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <GeneratePage />
      <GamePage />
    </div>
  );
}

export default App;
