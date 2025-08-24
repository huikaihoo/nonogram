import PuzzleSection from '@/pages/start/puzzle';
import RandomSection from '@/pages/start/random';

function StartPage() {
  return (
    <div className="container mx-auto p-1 max-w-2xl">
      <h1 className="text-3xl font-bold mb-12 text-center">Nonogram Online</h1>
      <div className="flex flex-col items-center gap-2 mt-6 mb-6">
        <RandomSection />
      </div>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">Or</span>
      </div>
      <div className="flex flex-col items-center gap-2 mt-6 mb-6">
        <PuzzleSection />
      </div>
    </div>
  );
}

export default StartPage;
