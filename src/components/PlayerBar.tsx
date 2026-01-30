import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Volume1, ListMusic } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { cn } from '../components/ui/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const PlayerBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentSong,
    isPlaying,
    progress,
    togglePlay,
    playPrevious,
    playNext,
    volume,
    isMuted,
    setVolume,
    toggleMute,
    queue,
    currentQueueIndex,
    playFromQueue,
    removeFromQueue,
    clearQueue,
  } = useMusic();

  const [queueOpen, setQueueOpen] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const volumeBarRef = useRef<HTMLDivElement>(null);

  // Volume control handlers - must be before early return
  const handleVolumeChange = useCallback((clientX: number) => {
    if (!volumeBarRef.current) return;
    const rect = volumeBarRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, x / rect.width));
    setVolume(newVolume);
  }, [setVolume]);

  useEffect(() => {
    if (!isDraggingVolume) return;

    const handleMouseMove = (e: MouseEvent) => {
      handleVolumeChange(e.clientX);
    };

    const handleMouseUp = () => {
      setIsDraggingVolume(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingVolume, handleVolumeChange]);

  // Early return after all hooks
  if (location.pathname === '/player') {
    return null;
  }

  const progressPercentage = currentSong ? (progress / currentSong.duration) * 100 : 0;

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPrevious();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    playNext();
  };

  const handleVolumeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDraggingVolume(true);
    handleVolumeChange(e.clientX);
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const displayVolume = isMuted ? 0 : volume;

  return (
    <>
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 lg:left-64 z-40",
          // Visual Physics: Ultra-bright material for popovers/menus/bars
          "bg-white/85 dark:bg-[#282828]/85 backdrop-blur-xl saturate-150",
          // Lighting: Top Edge Highlight
          "border-t border-black/5 dark:border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]"
        )}
      >
        {/* Progress Bar - Apple Style (Thin, on top edge) */}
        <div className="absolute top-[-1px] left-0 right-0 h-[2px] bg-transparent group cursor-pointer">
           {/* Background track */}
           <div className="absolute inset-0 bg-gray-200/50 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
           {/* Active track */}
           <motion.div
              className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
           />
        </div>

        <div className="flex items-center justify-between px-4 py-3 h-[72px]">

          {/* Left: Song Info */}
          <div className="flex items-center gap-3 w-1/3 min-w-0">
            {currentSong ? (
              <motion.div
                layoutId="current-song-cover"
                className="relative group cursor-pointer"
                onClick={() => navigate('/player')}
              >
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-12 h-12 rounded-[6px] object-cover shadow-md border border-black/5 dark:border-white/5"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-[6px]" />
              </motion.div>
            ) : (
              <div className="w-12 h-12 rounded-[6px] bg-gray-200 dark:bg-white/10 flex items-center justify-center shadow-inner">
                <Music2 className="w-5 h-5 text-gray-400" />
              </div>
            )}

            <div className="flex-1 min-w-0 flex flex-col justify-center cursor-pointer" onClick={() => navigate('/player')}>
              <div className="font-medium text-sm text-gray-900 dark:text-white truncate leading-tight">
                {currentSong?.title || "Not Playing"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {currentSong?.artist || "Select a song"}
              </div>
            </div>
          </div>

          {/* Center: Controls */}
          <div className="flex items-center justify-center gap-4 w-1/3">
            <button
              onClick={handlePrevious}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95"
              disabled={!currentSong}
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="p-3 rounded-full bg-white dark:bg-white/10 text-black dark:text-white shadow-sm border border-black/5 dark:border-white/10 hover:scale-105 active:scale-95 transition-all"
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-full text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all active:scale-95"
              disabled={!currentSong}
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Right: Volume / Extra */}
          <div className="flex items-center justify-end gap-2 w-1/3">
             <button
                onClick={() => setQueueOpen(true)}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  queue.length > 0
                    ? "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                )}
             >
                <ListMusic className="w-4 h-4" />
             </button>
             <div
                ref={volumeBarRef}
                className="w-24 h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden relative group cursor-pointer"
                onMouseDown={handleVolumeMouseDown}
             >
                <div
                  className="absolute inset-y-0 left-0 bg-gray-400 dark:bg-white/50 rounded-full transition-all"
                  style={{ width: `${displayVolume * 100}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-600 dark:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                  style={{ left: `calc(${displayVolume * 100}% - 6px)` }}
                />
             </div>
             <button
                onClick={toggleMute}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
             >
                <VolumeIcon className="w-4 h-4" />
             </button>
          </div>

        </div>
      </div>

      {/* Queue Panel - Bottom Sheet (outside PlayerBar for proper z-index) */}
      <AnimatePresence>
        {queueOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 lg:left-64 bg-black/50 backdrop-blur-sm z-[60]"
              onClick={() => setQueueOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 lg:left-64 h-[70vh] bg-white/95 dark:bg-[#1e1e1e]/95 backdrop-blur-xl rounded-t-3xl border-t border-black/10 dark:border-white/10 z-[60] flex flex-col"
            >
              <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Playing Next</h2>
                {queue.length > 0 && (
                  <button
                    onClick={clearQueue}
                    className="text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
                {queue.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                    <ListMusic className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm">Queue is empty</p>
                  </div>
                ) : (
                  queue.map((song, index) => (
                    <div
                      key={`${song.id}-${index}`}
                      onClick={() => playFromQueue(index)}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors",
                        index === currentQueueIndex
                          ? "bg-blue-50 dark:bg-white/10"
                          : "hover:bg-gray-100 dark:hover:bg-white/5"
                      )}
                    >
                      <img
                        src={song.coverUrl}
                        alt={song.title}
                        className="w-10 h-10 rounded-md object-cover bg-gray-200 dark:bg-white/5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className={cn(
                          "font-medium truncate flex items-center gap-1.5",
                          index === currentQueueIndex
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-900 dark:text-white"
                        )}>
                          <span className="truncate">{song.title}</span>
                          {song.isHr && (
                            <span className="flex-shrink-0 text-[9px] px-1 py-0.5 bg-red-500 text-white rounded-[3px] font-bold tracking-wider">HR</span>
                          )}
                          {song.isSq && (
                            <span className="flex-shrink-0 text-[9px] px-1 py-0.5 bg-yellow-500 text-white rounded-[3px] font-bold tracking-wider">SQ</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-white/40 truncate">
                          {song.artist}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(index);
                        }}
                        className="p-2 text-gray-300 hover:text-red-500 dark:text-white/20 dark:hover:text-red-400 transition-colors"
                      >
                        &times;
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

function Music2(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    )
  }
