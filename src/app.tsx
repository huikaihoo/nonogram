import { Copy, Gamepad2, Home, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router';

import AppSidebar, { type NavItem } from '@/components/sidebar';
import { CopyButton } from '@/components/ui/copy-button';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import GamePage from '@/pages/game/page';
import GeneratePage from '@/pages/generate/page';
import StartPage from '@/pages/start/page';

const navItems: NavItem[] = [
  { title: 'Home', url: '/', icon: Home, showInSidebar: true },
  { title: 'Nonogram Generator', url: '/generate', icon: Sparkles, showInSidebar: true },
  { title: 'Puzzle #', url: '/game/p/', icon: Gamepad2, showInSidebar: false },
  { title: 'Image #', url: '/game/i/', icon: Copy, showInSidebar: false },
];

function App() {
  const location = useLocation();
  const current = navItems.find((item, idx) => idx > 0 && location.pathname.startsWith(item.url)) || navItems[0];
  const Icon = current.icon;

  const [gameCode, setGameCode] = useState<string>('');

  return (
    <SidebarProvider>
      <AppSidebar navItems={navItems} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Icon className="h-4 w-4" />
            <span className="font-semibold flex items-center gap-1">
              {current.title}
              {gameCode && (
                <>
                  {gameCode}
                  <CopyButton content={gameCode} variant="ghost" size="sm" className="ml-1" />
                </>
              )}
            </span>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Routes>
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/game/:type/:code" element={<GamePage setGameCode={setGameCode} />} />
            <Route path="*" element={<StartPage />} />
          </Routes>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
