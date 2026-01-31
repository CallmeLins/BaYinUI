import { useNavigate, useLocation } from 'react-router';
import {
  Music2, Disc, Mic, ListMusic, ScanSearch, Database, Settings, Info,
  LogOut, Sun, Moon, Search
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { usePlatform } from '../hooks/usePlatform';
import { motion } from 'framer-motion';
import { cn } from '../components/ui/utils';
import { getCurrentWindow } from '@tauri-apps/api/window';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode, isMobileSidebarOpen, setMobileSidebarOpen } = useMusic();
  const { isMobile, insets } = usePlatform();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
    setMobileSidebarOpen(false);
  };

  const handleExit = async () => {
    try {
      await getCurrentWindow().close();
    } catch (e) {
      console.error('Failed to close:', e);
    }
  };

  const isPlayerPage = location.pathname === '/player';
  if (isPlayerPage) return null;

  const shouldShowMobile = isOpen || isMobileSidebarOpen;

  const handleClose = () => {
    onClose();
    setMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Sidebar Container */}
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 w-64 z-30 transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]",
          "bg-gray-100/60 dark:bg-[#1e1e1e]/60 backdrop-blur-2xl saturate-150",
          "border-r border-black/5 dark:border-white/10 shadow-[1px_0_0_0_rgba(255,255,255,0.1)]",
          shouldShowMobile ? 'translate-x-0' : '-translate-x-full',
          "lg:translate-x-0"
        )}
      >
        {/* Top Actions — dynamic padding per platform */}
        <div
          className="flex items-center justify-between px-3 pb-2"
          style={{ paddingTop: isMobile ? insets.top + 12 : undefined }}
        >
           <div className={cn("flex gap-1", !isMobile && "pt-4 lg:pt-10")}>
              <button
                  onClick={toggleDarkMode}
                  className={cn(
                    "p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-400",
                    isMobile && "p-2.5"
                  )}
                  title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                  {isDarkMode ? <Sun className={cn("w-4 h-4", isMobile && "w-5 h-5")} /> : <Moon className={cn("w-4 h-4", isMobile && "w-5 h-5")} />}
              </button>
              <button
                  onClick={handleExit}
                  className={cn(
                    "p-2 rounded-md hover:bg-red-500/10 hover:text-red-500 transition-colors text-gray-600 dark:text-gray-400",
                    isMobile && "p-2.5"
                  )}
                  title="Exit"
                >
                  <LogOut className={cn("w-4 h-4", isMobile && "w-5 h-5")} />
              </button>
           </div>
        </div>

        {/* Search Input */}
        <div className="px-3 mb-4">
          <div className="relative group">
            <Search className={cn(
              "absolute left-2.5 text-gray-400 group-focus-within:text-blue-500 transition-colors",
              isMobile ? "w-5 h-5 top-2.5" : "w-4 h-4 top-1.5"
            )} />
            <input
              type="text"
              placeholder="Search"
              className={cn(
                "w-full bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-[6px] focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-gray-400",
                isMobile ? "py-2 pl-9 pr-3 text-base" : "py-1 pl-8 pr-2 text-sm"
              )}
            />
          </div>
        </div>

        <div className="px-2 py-2 flex flex-col h-[calc(100%-120px)] overflow-y-auto scrollbar-hide">

          {/* Library Section */}
          <div className="mb-6">
            <h3 className={cn(
              "px-3 font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider",
              isMobile ? "text-sm mb-2" : "text-xs"
            )}>Library</h3>
            <div className={cn(isMobile ? "space-y-1" : "space-y-[1px]")}>
              <SidebarItem
                icon={<Music2 />}
                label="Songs"
                isActive={location.pathname === '/'}
                onClick={() => handleNavigation('/')}
                isMobile={isMobile}
              />
              <SidebarItem
                icon={<Disc />}
                label="Albums"
                isActive={location.pathname === '/albums'}
                onClick={() => handleNavigation('/albums')}
                isMobile={isMobile}
              />
              <SidebarItem
                icon={<Mic />}
                label="Artists"
                isActive={location.pathname === '/artists'}
                onClick={() => handleNavigation('/artists')}
                isMobile={isMobile}
              />
              <SidebarItem
                icon={<ListMusic />}
                label="Playlists"
                isActive={location.pathname === '/playlists'}
                onClick={() => handleNavigation('/playlists')}
                isMobile={isMobile}
              />
            </div>
          </div>

          {/* System Section */}
          <div className="mb-6">
            <h3 className={cn(
              "px-3 font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider",
              isMobile ? "text-sm mb-2" : "text-xs"
            )}>System</h3>
            <div className={cn(isMobile ? "space-y-1" : "space-y-[1px]")}>
              <SidebarItem
                icon={<ScanSearch />}
                label="Scan Music"
                isActive={location.pathname === '/scan'}
                onClick={() => handleNavigation('/scan')}
                isMobile={isMobile}
              />
              <SidebarItem
                icon={<Database />}
                label="Library Stats"
                isActive={location.pathname === '/library'}
                onClick={() => handleNavigation('/library')}
                isMobile={isMobile}
              />
              <SidebarItem
                icon={<Settings />}
                label="Settings"
                isActive={location.pathname === '/settings'}
                onClick={() => handleNavigation('/settings')}
                isMobile={isMobile}
              />
               <SidebarItem
                icon={<Info />}
                label="About"
                isActive={location.pathname === '/about'}
                onClick={() => handleNavigation('/about')}
                isMobile={isMobile}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Backdrop for mobile */}
      {shouldShowMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          data-no-drag
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={handleClose}
        />
      )}
    </>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  isMobile?: boolean;
}

const SidebarItem = ({ icon, label, isActive, onClick, isMobile }: SidebarItemProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 rounded-md font-medium transition-all duration-200 group relative",
        isMobile ? "px-3 py-2.5 text-base" : "px-3 py-1.5 text-sm",
        isActive
          ? "bg-blue-500 text-white shadow-sm"
          : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10"
      )}
    >
      <span className={cn(
        isMobile ? "w-5 h-5 [&>svg]:w-5 [&>svg]:h-5" : "w-4 h-4 [&>svg]:w-4 [&>svg]:h-4",
        "[&>svg]:stroke-[1.5px]",
        isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100"
      )}>
        {icon}
      </span>
      <span className="tracking-wide">{label}</span>
    </button>
  );
};