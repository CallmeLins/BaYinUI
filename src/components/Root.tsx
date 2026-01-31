import { Outlet, useLocation } from 'react-router';
import { PlayerBar } from './PlayerBar';
import { Sidebar } from './Sidebar';
import { useMusic } from '../context/MusicContext';
import { useScrollbar } from '../hooks/useScrollbar';
import { cn } from '../components/ui/utils';
import { useState, useEffect, useCallback } from 'react';
import { Minus, Square, X, Copy } from 'lucide-react';
import { getCurrentWindow } from '@tauri-apps/api/window';

// Check if element or its parents are interactive (should not trigger drag)
const isInteractiveElement = (element: HTMLElement | null): boolean => {
  while (element) {
    const tagName = element.tagName.toLowerCase();
    if (
      tagName === 'button' ||
      tagName === 'a' ||
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      tagName === 'label' ||
      element.getAttribute('role') === 'button' ||
      element.getAttribute('data-no-drag') !== null ||
      element.classList.contains('cursor-pointer')
    ) {
      return true;
    }
    element = element.parentElement;
  }
  return false;
};

export const Root = () => {
  const { isDarkMode } = useMusic();
  const location = useLocation();
  const scrollRef = useScrollbar<HTMLDivElement>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const isPlayerPage = location.pathname === '/player';

  // Handle window dragging on mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only handle left mouse button
    if (e.button !== 0) return;

    // Check if clicked on interactive element
    if (isInteractiveElement(e.target as HTMLElement)) return;

    // Start dragging
    getCurrentWindow().startDragging().catch(() => {});
  }, []);

  // Check if window is maximized
  useEffect(() => {
    const checkMaximized = async () => {
      try {
        const maximized = await getCurrentWindow().isMaximized();
        setIsMaximized(maximized);
      } catch (e) {
        // Ignore errors (e.g., in browser)
      }
    };
    checkMaximized();

    // Listen for resize to update maximized state
    const unlisten = getCurrentWindow().onResized(async () => {
      try {
        const maximized = await getCurrentWindow().isMaximized();
        setIsMaximized(maximized);
      } catch (e) {}
    });

    return () => {
      unlisten.then(fn => fn());
    };
  }, []);

  const handleMinimize = async () => {
    try {
      await getCurrentWindow().minimize();
    } catch (e) {
      console.error('Failed to minimize:', e);
    }
  };

  const handleMaximize = async () => {
    try {
      await getCurrentWindow().toggleMaximize();
    } catch (e) {
      console.error('Failed to toggle maximize:', e);
    }
  };

  const handleClose = async () => {
    try {
      await getCurrentWindow().close();
    } catch (e) {
      console.error('Failed to close:', e);
    }
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={cn(
        "h-screen flex flex-col overflow-hidden font-sans antialiased",
        "bg-white dark:bg-[#121212] text-gray-900 dark:text-white",
        "bg-noise"
      )}
    >

      {/* Custom Title Bar - Desktop Only */}
      {!isPlayerPage && (
        <div className="hidden lg:flex h-8 flex-shrink-0 items-center justify-end bg-gray-100/80 dark:bg-[#1a1a1a]/80 backdrop-blur-sm border-b border-black/5 dark:border-white/5 select-none pl-64">
          {/* Spacer */}
          <div className="flex-1 h-full" />

          {/* Window controls */}
          <div className="flex items-center h-full">
            <button
              onClick={handleMinimize}
              className="h-full px-4 hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              <Minus className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={handleMaximize}
              className="h-full px-4 hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
            >
              {isMaximized ? (
                <Copy className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              ) : (
                <Square className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              )}
            </button>
            <button
              onClick={handleClose}
              className="h-full px-4 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center group"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-white" />
            </button>
          </div>
        </div>
      )}

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
         <div className={cn("min-h-full animate-fade-in", !isPlayerPage && "px-6 pb-6")}>
            <Outlet />
         </div>
      </div>

      <PlayerBar />
    </div>
  );
};
