import { Outlet, useLocation } from 'react-router';
import { PlayerBar } from './PlayerBar';
import { Sidebar } from './Sidebar';
import { useMusic } from '../context/MusicContext';
import { useScrollbar } from '../hooks/useScrollbar';
import { cn } from '../components/ui/utils';
import { useState } from 'react';

export const Root = () => {
  const { isDarkMode } = useMusic();
  const location = useLocation();
  const scrollRef = useScrollbar<HTMLDivElement>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isPlayerPage = location.pathname === '/player';

  return (
    <div className={cn(
      "h-screen flex flex-col overflow-hidden font-sans antialiased selection:bg-blue-500/30",
      "bg-white dark:bg-[#121212] text-gray-900 dark:text-white",
      "bg-noise"
    )}>
      
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div 
        ref={scrollRef} 
        className={cn(
          "flex-1 overflow-y-auto scrollbar-thin",
          !isPlayerPage && "lg:pl-64", // Push content when sidebar is fixed
          !isPlayerPage && "pb-[72px]" // PlayerBar height (only if not player page)
        )}
      >
         <div className={cn("min-h-full animate-fade-in", !isPlayerPage && "p-6")}>
            <Outlet />
         </div>
      </div>
      
      <PlayerBar />
    </div>
  );
};
