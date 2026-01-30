import { useNavigate, useLocation } from 'react-router';
import { Play, Pause, SkipBack, SkipForward, Volume2, ListMusic } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { cn } from '../components/ui/utils';
import { motion } from 'framer-motion';

export const PlayerBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentSong, isPlaying, progress, togglePlay, playPrevious, playNext } = useMusic();

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

  return (
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
           <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              <ListMusic className="w-4 h-4" />
           </button>
           <div className="w-24 h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden relative group">
              <div className="absolute inset-y-0 left-0 w-2/3 bg-gray-400 dark:bg-white/50 rounded-full" />
           </div>
           <button className="p-2 rounded-md text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              <Volume2 className="w-4 h-4" />
           </button>
        </div>

      </div>
    </div>
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
