import { Gamepad2, Sparkles } from 'lucide-react';
import { Route, Routes, useLocation } from 'react-router';

import AppSidebar, { type NavItem } from '@/components/sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import GamePage from '@/pages/game/page';
import GeneratePage from '@/pages/generate/page';

const navItems: NavItem[] = [
  { title: 'Nonogram Generator', url: '/generate', icon: Sparkles },
  { title: 'Play Game', url: '/game', icon: Gamepad2 },
];

function App() {
  const location = useLocation();
  const current = navItems.find((item) => item.url === location.pathname) || navItems[0];
  const Icon = current.icon;

  return (
    <SidebarProvider>
      <AppSidebar navItems={navItems} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Icon className="h-5 w-5" />
            <span className="font-semibold">{current.title}</span>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Routes>
            <Route path="/generate" element={<GeneratePage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="*" element={<GeneratePage />} />
          </Routes>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
