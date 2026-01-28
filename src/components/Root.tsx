import { Outlet, useLocation } from 'react-router';
import { PlayerBar } from './PlayerBar';
import { useMusic } from '../context/MusicContext';

export const Root = () => {
  const { isDarkMode } = useMusic();
  const location = useLocation();
  
  // 在播放页面时不应用侧边栏的padding
  const isPlayerPage = location.pathname === '/player';

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <div className={`flex-1 overflow-y-auto pb-20 ${!isPlayerPage ? 'lg:pl-64' : ''}`}>
        <Outlet />
      </div>
      <PlayerBar />
    </div>
  );
};