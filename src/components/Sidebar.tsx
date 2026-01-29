import { useNavigate, useLocation } from 'react-router';
import { X, Sun, Moon, Music2, LogOut, Volume2, Disc, Mic, Folder, ListMusic, ScanSearch, Database, BarChart3, Settings, Info } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode, toggleDarkMode } = useMusic();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  // 在播放页面时隐藏侧边栏
  const isPlayerPage = location.pathname === '/player';
  if (isPlayerPage) return null;

  // 在大屏幕上常驻显示，在小屏幕上根据isOpen显示
  // 大屏幕：lg:block（始终显示，不需要isOpen）
  // 小屏幕：isOpen控制显示
  const shouldShowMobile = isOpen;

  return (
    <>
      {/* Sidebar */}
      <div
        style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
        className={`fixed top-0 left-0 bottom-0 w-64 shadow-lg overflow-y-auto scrollbar-thin transition-transform duration-300 z-30 ${
          shouldShowMobile ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="p-6">
          {/* Top action buttons */}
          <div className="flex items-center gap-4 mb-8">
            <button
              className={`p-3 rounded-full ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="退出"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-3 rounded-full ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title={isDarkMode ? '日间模式' : '夜间模式'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {/* 音效按钮暂时隐藏 */}
            {/* <button
              className={`p-3 rounded-full ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              }`}
              title="音效"
            >
              <Volume2 className="w-5 h-5" />
            </button> */}
          </div>

          {/* Library section */}
          <div className="mb-8">
            <div className="space-y-1">
              <SidebarItem
                icon={<Music2 className="w-5 h-5" />}
                label="歌曲"
                onClick={() => handleNavigation('/')}
              />
              <SidebarItem
                icon={<Disc className="w-5 h-5" />}
                label="专辑"
                onClick={() => handleNavigation('/albums')}
              />
              <SidebarItem
                icon={<Mic className="w-5 h-5" />}
                label="艺术家"
                onClick={() => handleNavigation('/artists')}
              />
              <SidebarItem
                icon={<ListMusic className="w-5 h-5" />}
                label="歌单"
                onClick={() => handleNavigation('/playlists')}
              />
            </div>
          </div>

          {/* Settings section */}
          <div className={`pt-6 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="space-y-1">
              <SidebarItem
                icon={<ScanSearch className="w-5 h-5" />}
                label="扫描音乐"
                onClick={() => handleNavigation('/scan')}
              />
              <SidebarItem
                icon={<Database className="w-5 h-5" />}
                label="音乐库"
                onClick={() => handleNavigation('/library')}
              />
              <SidebarItem
                icon={<Settings className="w-5 h-5" />}
                label="设置"
                onClick={() => handleNavigation('/settings')}
              />
              <SidebarItem
                icon={<Info className="w-5 h-5" />}
                label="关于"
                onClick={() => handleNavigation('/about')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clickable area to close sidebar - only on mobile */}
      {shouldShowMobile && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const SidebarItem = ({ icon, label, onClick }: SidebarItemProps) => {
  const { isDarkMode } = useMusic();

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
        isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
      } transition-colors`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};