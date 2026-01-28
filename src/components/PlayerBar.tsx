import { useNavigate, useLocation } from 'react-router';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const PlayerBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSong, isPlaying, progress, togglePlay, isDarkMode } = useMusic();

  // 在播放页面时不显示底部播放栏
  if (location.pathname === '/player') {
    return null;
  }

  const progressPercentage = currentSong ? (progress / currentSong.duration) * 100 : 0;

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: 实现上一曲功能
    console.log('Previous track');
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: 实现下一曲功能
    console.log('Next track');
  };

  return (
    <div
      style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
      className="fixed bottom-0 left-0 right-0 md:left-0 lg:left-64 shadow-lg z-40"
    >
      {/* Progress bar */}
      <div className={`w-full h-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}>
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Player content */}
      <div
        className="flex items-center px-4 py-3 gap-3"
      >
        {currentSong ? (
          <>
            <div 
              className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
              onClick={() => navigate('/player')}
            >
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-12 h-12 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{currentSong.title}</div>
                <div
                  className={`text-sm truncate ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}
                >
                  {currentSong.artist}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                className={`p-2 rounded-full ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className={`p-2 rounded-full ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" fill="currentColor" />
                ) : (
                  <Play className="w-6 h-6" fill="currentColor" />
                )}
              </button>
              <button
                onClick={handleNext}
                className={`p-2 rounded-full ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <>
            <div
              className={`w-12 h-12 rounded ${
                isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
              } flex items-center justify-center`}
            >
              <Play
                className={`w-6 h-6 ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div
                className={`font-medium ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                未播放
              </div>
              <div
                className={`text-sm ${
                  isDarkMode ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                未知艺术家
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className={`p-2 rounded-full ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`}
                disabled
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded-full ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`}
                disabled
              >
                <Play className="w-6 h-6" />
              </button>
              <button
                className={`p-2 rounded-full ${
                  isDarkMode ? 'text-gray-600' : 'text-gray-400'
                }`}
                disabled
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};