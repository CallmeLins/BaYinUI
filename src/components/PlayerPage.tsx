import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, MoreVertical, Heart, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, Clock, List, Repeat1 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

type PlayMode = 'shuffle' | 'sequence' | 'repeat-one';

export const PlayerPage = () => {
  const navigate = useNavigate();
  const { 
    currentSong, 
    isPlaying, 
    progress, 
    togglePlay, 
    setProgress, 
    isDarkMode, 
    playlists, 
    createPlaylist, 
    addSongsToPlaylist, 
    deleteSongs,
    queue,
    currentQueueIndex,
    removeFromQueue,
    clearQueue,
    playNext,
    playPrevious
  } = useMusic();
  const [playMode, setPlayMode] = useState<PlayMode>('sequence');
  const [timerMenuOpen, setTimerMenuOpen] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
  const [extendToEnd, setExtendToEnd] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  
  const pageRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // 模拟歌词
  const lyrics = [
    { time: 0, text: '从前从前有个人爱你很久' },
    { time: 5, text: '但偏偏风渐渐把距离吹得好远' },
    { time: 10, text: '好不容易又能再多爱一天' },
    { time: 15, text: '但故事的最后你好像还是说了拜拜' },
    { time: 20, text: '从前从前有个人爱你很久' },
    { time: 25, text: '但偏偏风渐渐把距离吹得好远' },
    { time: 30, text: '好不容易又能再多爱一天' },
    { time: 35, text: '但故事的最后你好像还是说了拜拜' },
  ];

  const currentLyricIndex = Math.floor(progress / 30);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(parseInt(e.target.value));
  };

  const togglePlayMode = () => {
    const modes: PlayMode[] = ['sequence', 'shuffle', 'repeat-one'];
    const currentModeIndex = modes.indexOf(playMode);
    setPlayMode(modes[(currentModeIndex + 1) % modes.length]);
  };

  const getPlayModeIcon = () => {
    switch (playMode) {
      case 'shuffle':
        return <Shuffle className="w-6 h-6" />;
      case 'repeat-one':
        return <Repeat1 className="w-6 h-6" />;
      default:
        return <Repeat className="w-6 h-6" />;
    }
  };

  // 处理上滑打开队列
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !touchStartX || !touchEndX) return;
    
    const distanceY = touchStart - touchEnd;
    const distanceX = touchStartX - touchEndX;
    const isUpSwipe = distanceY > 50 && Math.abs(distanceX) < 50;
    const isLeftSwipe = distanceX > 80 && Math.abs(distanceY) < 50;
    const isRightSwipe = distanceX < -80 && Math.abs(distanceY) < 50;

    if (isUpSwipe) {
      setQueueOpen(true);
    } else if (isLeftSwipe && !showLyrics) {
      setShowLyrics(true);
    } else if (isRightSwipe && showLyrics) {
      setShowLyrics(false);
    }

    setTouchStart(null);
    setTouchEnd(null);
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // 处理鼠标拖拽
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setTouchEnd(null);
    setTouchStart(e.clientY);
    setTouchEndX(null);
    setTouchStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTouchEnd(e.clientY);
    setTouchEndX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (!touchStart || !touchEnd || !touchStartX || !touchEndX) return;
    
    const distanceY = touchStart - touchEnd;
    const distanceX = touchStartX - touchEndX;
    const isUpSwipe = distanceY > 50 && Math.abs(distanceX) < 50;
    const isLeftSwipe = distanceX > 80 && Math.abs(distanceY) < 50;
    const isRightSwipe = distanceX < -80 && Math.abs(distanceY) < 50;

    if (isUpSwipe) {
      setQueueOpen(true);
    } else if (isLeftSwipe && !showLyrics) {
      setShowLyrics(true);
    } else if (isRightSwipe && showLyrics) {
      setShowLyrics(false);
    }

    setTouchStart(null);
    setTouchEnd(null);
    setTouchStartX(null);
    setTouchEndX(null);
  };

  // 处理队列页面下滑
  const handleQueueTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleQueueTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleQueueTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchEnd - touchStart;
    const isDownSwipe = distance > 50;

    if (isDownSwipe) {
      setQueueOpen(false);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // 处理队列页面鼠标拖拽
  const [isQueueDragging, setIsQueueDragging] = useState(false);

  const handleQueueMouseDown = (e: React.MouseEvent) => {
    setIsQueueDragging(true);
    setTouchEnd(null);
    setTouchStart(e.clientY);
  };

  const handleQueueMouseMove = (e: React.MouseEvent) => {
    if (!isQueueDragging) return;
    setTouchEnd(e.clientY);
  };

  const handleQueueMouseUp = () => {
    if (!isQueueDragging) return;
    setIsQueueDragging(false);
    
    if (!touchStart || !touchEnd) return;
    
    const distance = touchEnd - touchStart;
    const isDownSwipe = distance > 50;

    if (isDownSwipe) {
      setQueueOpen(false);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleRemoveFromQueue = (index: number) => {
    // 从队列中移除歌曲
    removeFromQueue(index);
  };

  const handleClearQueue = () => {
    // 清空队列
    clearQueue();
  };

  if (!currentSong) {
    navigate('/');
    return null;
  }

  if (queueOpen) {
    return (
      <div
        className={`fixed inset-0 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} z-50`}
        onTouchStart={handleQueueTouchStart}
        onTouchMove={handleQueueTouchMove}
        onTouchEnd={handleQueueTouchEnd}
        onMouseDown={handleQueueMouseDown}
        onMouseMove={handleQueueMouseMove}
        onMouseUp={handleQueueMouseUp}
      >
        {/* Header */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-center text-xs mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            向下轻扫以返回播放界面
          </p>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setQueueOpen(false)}
              className={`p-2 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded`}
            >
              <ChevronDown className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-medium">播放队列</h2>
            <button
              onClick={handleClearQueue}
              className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}
            >
              清空
            </button>
          </div>
          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            当前第 {currentQueueIndex + 1} 首，共 {queue.length} 首
          </p>
        </div>

        {/* Queue list */}
        <div className="overflow-y-auto">
          {queue.map((song, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 px-4 py-3 border-b ${
                index === currentQueueIndex
                  ? isDarkMode ? 'bg-blue-900 bg-opacity-30 border-blue-700' : 'bg-blue-50 border-blue-200'
                  : isDarkMode ? 'border-gray-700' : 'border-gray-100'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className={`font-medium truncate ${index === currentQueueIndex ? 'text-blue-500' : ''}`}>
                  {song.title}
                </div>
                <div className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {song.artist} · {song.album}
                </div>
              </div>
              <button
                onClick={() => handleRemoveFromQueue(index)}
                className={`p-2 ${isDarkMode ? 'text-red-400 hover:bg-gray-800' : 'text-red-600 hover:bg-gray-100'} rounded`}
              >
                <span className="text-xl">−</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="fixed inset-0 z-50 flex flex-col overflow-hidden"
    >
      {/* Background with blur */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentSong.coverUrl}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 backdrop-blur-3xl" style={{
          backgroundColor: isDarkMode ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.85)'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
          <button onClick={() => navigate(-1)} className={`p-2 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} hover:bg-opacity-50 rounded`}>
            <ChevronDown className="w-6 h-6" />
          </button>
          <h2 className="text-base">正在播放</h2>
          <div className="w-10" />
        </div>

        {/* Main content - scrollable */}
        <div className="flex-1 overflow-y-auto px-8 py-4">
          <div className="max-w-6xl mx-auto">
            {/* Song info */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-medium mb-2 truncate">{currentSong.title}</h1>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} truncate`}>
                {currentSong.artist}
              </p>
            </div>

            {/* Album cover and Lyrics - Two column on wide screens, swipeable on mobile */}
            <div className="mb-6">
              {/* Mobile: Swipeable single view */}
              <div className="md:hidden">
                {!showLyrics ? (
                  <>
                    <div className="mb-6">
                      <img
                        src={currentSong.coverUrl}
                        alt={currentSong.title}
                        className="w-full aspect-square rounded-2xl object-cover shadow-2xl"
                      />
                    </div>

                    {/* Preview Lyrics (3 lines) */}
                    <div className="h-24 flex flex-col items-center justify-center">
                      {lyrics.slice(Math.max(0, currentLyricIndex - 1), currentLyricIndex + 2).map((lyric, idx) => {
                        const actualIndex = Math.max(0, currentLyricIndex - 1) + idx;
                        return (
                          <p
                            key={actualIndex}
                            className={`text-center transition-all duration-300 py-1 ${
                              idx === 1
                                ? 'text-base font-medium'
                                : isDarkMode ? 'text-sm text-gray-400' : 'text-sm text-gray-500'
                            }`}
                          >
                            {lyric.text}
                          </p>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="relative">
                    <div className="space-y-6 py-8">
                      {lyrics.map((lyric, index) => (
                        <p
                          key={index}
                          className={`text-center transition-all duration-300 text-lg leading-relaxed ${
                            index === currentLyricIndex
                              ? 'font-medium scale-110 opacity-100'
                              : 'opacity-40'
                          }`}
                        >
                          {lyric.text}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Tablet/Desktop: Two columns */}
              <div className="hidden md:grid md:grid-cols-2 gap-8 items-start">
                {/* Left: Album cover */}
                <div className="flex justify-center">
                  <img
                    src={currentSong.coverUrl}
                    alt={currentSong.title}
                    className="w-full max-w-md aspect-square rounded-2xl object-cover shadow-2xl"
                  />
                </div>

                {/* Right: Full lyrics */}
                <div className="relative h-full min-h-[400px] flex items-center">
                  <div className="w-full max-h-[600px] overflow-y-auto overflow-x-hidden scrollbar-hide">
                    <div className="space-y-6 py-8">
                      {lyrics.map((lyric, index) => (
                        <p
                          key={index}
                          className={`text-center transition-all duration-300 text-lg leading-relaxed ${
                            index === currentLyricIndex
                              ? 'font-medium scale-110 opacity-100'
                              : 'opacity-40'
                          }`}
                        >
                          {lyric.text}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-6">
              <input
                type="range"
                min="0"
                max={currentSong.duration}
                value={progress}
                onChange={handleProgressChange}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                style={{
                  background: `linear-gradient(to right, ${isDarkMode ? '#3b82f6' : '#2563eb'} 0%, ${
                    isDarkMode ? '#3b82f6' : '#2563eb'
                  } ${(progress / currentSong.duration) * 100}%, ${isDarkMode ? '#374151' : '#e5e7eb'} ${
                    (progress / currentSong.duration) * 100
                  }%, ${isDarkMode ? '#374151' : '#e5e7eb'} 100%)`,
                }}
              />
              <div className="flex justify-between mt-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {formatDuration(progress)}
                </span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {formatDuration(currentSong.duration)}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <button
                onClick={playPrevious}
                className={`p-3 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} hover:bg-opacity-50 rounded-full`}
              >
                <SkipBack className="w-8 h-8" />
              </button>
              <button
                onClick={togglePlay}
                className={`p-5 ${
                  isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } rounded-full text-white shadow-lg`}
              >
                {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 ml-1" />}
              </button>
              <button
                onClick={playNext}
                className={`p-3 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} hover:bg-opacity-50 rounded-full`}
              >
                <SkipForward className="w-8 h-8" />
              </button>
            </div>

            {/* Bottom controls */}
            <div className="flex items-center justify-between pb-8">
              <button
                onClick={togglePlayMode}
                className={`p-3 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} hover:bg-opacity-50 rounded-full`}
              >
                {getPlayModeIcon()}
              </button>
              <button
                onClick={() => setTimerMenuOpen(true)}
                className={`p-3 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} hover:bg-opacity-50 rounded-full`}
              >
                <Clock className="w-6 h-6" />
              </button>
              <button
                onClick={() => setQueueOpen(true)}
                className={`p-3 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} hover:bg-opacity-50 rounded-full`}
              >
                <List className="w-6 h-6" />
              </button>
              <button
                onClick={() => setMoreMenuOpen(true)}
                className={`p-3 ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} hover:bg-opacity-50 rounded-full`}
              >
                <MoreVertical className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Timer menu */}
      {timerMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setTimerMenuOpen(false)}
          />
          <div
            className={`fixed bottom-0 left-0 right-0 ${
              isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-300'
            } rounded-t-3xl p-6 z-50 shadow-lg`}
          >
            <h3 className="text-lg font-medium mb-6">定时停止播放</h3>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>时长</span>
                <span className="text-lg font-medium">{selectedTimer || 0} 分钟</span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                value={selectedTimer || 0}
                onChange={(e) => setSelectedTimer(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                style={{
                  background: `linear-gradient(to right, ${isDarkMode ? '#3b82f6' : '#2563eb'} 0%, ${
                    isDarkMode ? '#3b82f6' : '#2563eb'
                  } ${((selectedTimer || 0) / 120) * 100}%, ${isDarkMode ? '#374151' : '#e5e7eb'} ${
                    ((selectedTimer || 0) / 120) * 100
                  }%, ${isDarkMode ? '#374151' : '#e5e7eb'} 100%)`,
                }}
              />
              <div className="flex justify-between mt-2">
                <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>0</span>
                <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>120</span>
              </div>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-lg mb-6 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <span>自动延长到整首歌播完</span>
              <button
                onClick={() => setExtendToEnd(!extendToEnd)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  extendToEnd
                    ? 'bg-blue-600'
                    : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    extendToEnd ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setTimerMenuOpen(false)}
                className={`flex-1 py-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                取消
              </button>
              <button
                onClick={() => {
                  setTimerMenuOpen(false);
                  // Apply timer
                }}
                disabled={!selectedTimer}
                className={`flex-1 py-3 rounded-lg ${
                  selectedTimer
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : isDarkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-300 text-gray-400'
                }`}
              >
                确定
              </button>
            </div>
          </div>
        </>
      )}

      {/* More menu */}
      {moreMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMoreMenuOpen(false)}
          />
          <div
            className={`fixed bottom-0 left-0 right-0 ${
              isDarkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-gray-50 border-t border-gray-300'
            } rounded-t-3xl p-6 z-50 shadow-lg`}
          >
            {/* Song info */}
            <div className={`flex items-center gap-3 mb-6 pb-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <img
                src={currentSong.coverUrl}
                alt={currentSong.title}
                className="w-16 h-16 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{currentSong.title}</div>
                <div className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentSong.artist}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setMoreMenuOpen(false);
                  // Handle add to playlist
                }}
                className={`w-full text-left px-4 py-3 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                添加到歌单
              </button>
              <button
                onClick={() => {
                  setMoreMenuOpen(false);
                  // Handle play next
                }}
                className={`w-full text-left px-4 py-3 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                下一首播放
              </button>
              <button
                onClick={() => {
                  setMoreMenuOpen(false);
                  navigate(`/artists/${currentSong.artist}`);
                }}
                className={`w-full text-left px-4 py-3 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                艺术家
              </button>
              <button
                onClick={() => {
                  setMoreMenuOpen(false);
                  navigate(`/albums/${currentSong.album}`);
                }}
                className={`w-full text-left px-4 py-3 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                专辑
              </button>
              <button
                onClick={() => {
                  setMoreMenuOpen(false);
                  // Show song info
                }}
                className={`w-full text-left px-4 py-3 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                歌曲信息
              </button>
              <button
                onClick={() => {
                  setMoreMenuOpen(false);
                  // Handle delete
                }}
                className={`w-full text-left px-4 py-3 rounded ${isDarkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'}`}
              >
                永久删除
              </button>
              <button
                onClick={() => setMoreMenuOpen(false)}
                className={`w-full text-center px-4 py-3 rounded mt-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}
              >
                取消
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};