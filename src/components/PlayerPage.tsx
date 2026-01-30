import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, MoreVertical, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, List, Repeat1, MessageSquare } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { getLyrics, parseLrcLyrics, type LyricLine } from '../services/scanner';
import { cn } from '../components/ui/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { SongMenu } from './SongMenu';

type PlayMode = 'shuffle' | 'sequence' | 'repeat-one';

// Get visible lyrics (current + surrounding lines, with placeholders to keep current in center)
const getVisibleLyrics = (lyrics: LyricLine[], currentIndex: number, range: number = 6) => {
  if (lyrics.length === 0) return [];

  // If lyrics are short, show all without placeholders
  if (lyrics.length <= range * 2 + 1) {
    return lyrics.map((lyric, idx) => ({
      ...lyric,
      originalIndex: idx,
      isPlaceholder: false,
    }));
  }

  const effectiveIndex = currentIndex === -1 ? 0 : currentIndex;

  const result: Array<{ text: string; time: number; originalIndex: number; isPlaceholder: boolean }> = [];
  for (let i = -range; i <= range; i++) {
    const idx = effectiveIndex + i;
    if (idx >= 0 && idx < lyrics.length) {
      result.push({
        ...lyrics[idx],
        originalIndex: idx,
        isPlaceholder: false,
      });
    } else {
      result.push({
        text: '',
        time: 0,
        originalIndex: idx,
        isPlaceholder: true,
      });
    }
  }
  return result;
};

export const PlayerPage = () => {
  const navigate = useNavigate();
  const {
    currentSong,
    isPlaying,
    progress,
    duration,
    togglePlay,
    setProgress,
    queue,
    currentQueueIndex,
    removeFromQueue,
    clearQueue,
    playNext,
    playPrevious,
    playFromQueue
  } = useMusic();

  const [playMode, setPlayMode] = useState<PlayMode>('sequence');
  const [showLyrics, setShowLyrics] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const desktopLyricsRef = useRef<HTMLDivElement>(null);
  const [isLyricsLoaded, setIsLyricsLoaded] = useState(false);

  // Load Lyrics
  useEffect(() => {
    const loadLyrics = async () => {
      if (!currentSong?.filePath) {
        setLyrics([]);
        setIsLyricsLoaded(true);
        return;
      }
      try {
        const lrcContent = await getLyrics(currentSong.filePath);
        if (lrcContent) {
          setLyrics(parseLrcLyrics(lrcContent));
        } else {
          setLyrics([]);
        }
      } catch (error) {
        console.error('Failed to load lyrics:', error);
        setLyrics([]);
      } finally {
        setIsLyricsLoaded(true);
      }
    };
    setIsLyricsLoaded(false);
    loadLyrics();
  }, [currentSong?.filePath]);

  // Find current lyric index
  const currentLyricIndex = lyrics.findIndex((lyric, index) => {
    const nextLyric = lyrics[index + 1];
    return progress >= lyric.time && (!nextLyric || progress < nextLyric.time);
  });

  // Get scroll target index (0 during intro, currentLyricIndex otherwise)
  const scrollTargetIndex = lyrics.length === 0 ? -1 : (currentLyricIndex === -1 ? 0 : currentLyricIndex);

  // Track last scrolled index to determine scroll behavior
  const lastScrolledIndexRef = useRef<number>(-1);
  const isFirstScrollRef = useRef(true);

  // Reset on lyrics view change
  useEffect(() => {
    if (showLyrics) {
      isFirstScrollRef.current = true;
    } else {
      lastScrolledIndexRef.current = -1;
    }
  }, [showLyrics]);

  // Scroll lyrics based on progress (mobile full lyrics view)
  useEffect(() => {
    if (!showLyrics || !lyricsContainerRef.current || lyrics.length === 0 || scrollTargetIndex === -1) {
      return;
    }

    const activeElement = lyricsContainerRef.current.children[scrollTargetIndex] as HTMLElement;
    if (!activeElement) return;

    const useInstantScroll = isFirstScrollRef.current;

    activeElement.scrollIntoView({
      behavior: useInstantScroll ? 'auto' : 'smooth',
      block: 'center',
    });

    isFirstScrollRef.current = false;
    lastScrolledIndexRef.current = scrollTargetIndex;
  }, [scrollTargetIndex, showLyrics, lyrics, progress]);

  const formatDuration = (seconds: number) => {
    const totalSeconds = Math.floor(seconds);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayMode = () => {
    const modes: PlayMode[] = ['sequence', 'shuffle', 'repeat-one'];
    const currentModeIndex = modes.indexOf(playMode);
    setPlayMode(modes[(currentModeIndex + 1) % modes.length]);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (!currentSong) {
    navigate('/');
    return null;
  }

  // Get visible lyrics for desktop view
  const visibleLyrics = getVisibleLyrics(lyrics, currentLyricIndex, 6);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black text-white overflow-hidden">

      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          key={currentSong.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
           <img
             src={currentSong.coverUrl}
             alt=""
             className="w-full h-full object-cover opacity-60 blur-3xl scale-125"
           />
           <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors z-20"
          >
            <ChevronDown className="w-6 h-6 text-white/80" />
          </button>
          <div className="flex flex-col items-center pointer-events-none">
             <span className="text-xs font-medium text-white/50 uppercase tracking-widest">Now Playing</span>
          </div>
          <button
            onClick={() => setQueueOpen(true)}
            className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors z-20"
          >
            <List className="w-6 h-6 text-white/80" />
          </button>
        </div>

        {/* Center Area - Responsive Layout */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-8 min-h-0 relative">

          {/* Mobile Layout: Cover or Lyrics (toggle) */}
          <div className="md:hidden w-full h-full flex flex-col items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {!showLyrics ? (
                <motion.div
                  key="cover"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  className="w-full max-w-sm aspect-square relative group cursor-pointer"
                  onClick={() => setShowLyrics(true)}
                >
                  <img
                    src={currentSong.coverUrl}
                    alt={currentSong.title}
                    className="w-full h-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-cover border border-white/10"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="lyrics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full max-w-2xl relative cursor-pointer select-none"
                  onClick={() => setShowLyrics(false)}
                >
                  <div
                     ref={lyricsContainerRef}
                     className="h-full overflow-y-auto scrollbar-hide text-center py-[40vh] space-y-8 select-none"
                     style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}
                  >
                     {lyrics.length > 0 ? (
                        lyrics.map((lyric, idx) => {
                           const isActive = idx === currentLyricIndex;
                           return (
                              <p
                                 key={idx}
                                 className={cn(
                                    "text-xl font-bold transition-all duration-500 px-4",
                                    isActive ? "text-white scale-110 blur-0" : "text-white/30 blur-[1px] scale-100"
                                 )}
                              >
                                 {lyric.text}
                              </p>
                           )
                        })
                     ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-white/50 text-xl">
                              {isLyricsLoaded ? "No lyrics available" : "Loading lyrics..."}
                          </p>
                        </div>
                     )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop/Tablet Layout: Cover + Lyrics side by side */}
          <div className="hidden md:flex w-full max-w-5xl items-center gap-8 lg:gap-12">
            {/* Left: Cover */}
            <div className="flex-shrink-0 w-[280px] lg:w-[320px] xl:w-[360px] aspect-square">
              <motion.div
                key={currentSong.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="w-full h-full"
              >
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="w-full h-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] object-cover border border-white/10"
                />
              </motion.div>
            </div>

            {/* Right: Lyrics (limited lines, same height as cover) */}
            <div className="flex-1 min-w-0 h-[280px] lg:h-[320px] xl:h-[360px] overflow-hidden flex items-center">
              <div
                ref={desktopLyricsRef}
                className="w-full space-y-4 select-none text-center"
                style={{ maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' }}
              >
                {lyrics.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    {visibleLyrics.map((lyric) => {
                      const isActive = lyric.originalIndex === currentLyricIndex;
                      if (lyric.isPlaceholder) {
                        return (
                          <motion.p
                            key={lyric.originalIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-lg lg:text-xl xl:text-2xl leading-relaxed h-[1.75em]"
                          >
                            &nbsp;
                          </motion.p>
                        );
                      }
                      return (
                        <motion.p
                          key={lyric.originalIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                          className={cn(
                            "text-lg lg:text-xl xl:text-2xl font-semibold transition-all duration-300 leading-relaxed",
                            isActive
                              ? "text-white"
                              : "text-white/30"
                          )}
                        >
                          {lyric.text}
                        </motion.p>
                      );
                    })}
                  </AnimatePresence>
                ) : (
                  <p className="text-white/40 text-lg text-center">
                    {isLyricsLoaded ? "No lyrics available" : "Loading lyrics..."}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="px-6 md:px-8 pb-8 md:pb-12 pt-4 md:pt-6 w-full max-w-3xl mx-auto flex-shrink-0">

          {/* Song Info */}
          <div className="flex items-center justify-between mb-4 md:mb-6">
             <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-white truncate mb-1">{currentSong.title}</h1>
                <p className="text-base md:text-lg text-white/60 truncate">{currentSong.artist}</p>
             </div>
             {/* Lyrics toggle button - only show on mobile */}
             <button
                onClick={() => setShowLyrics(!showLyrics)}
                className={cn(
                   "md:hidden p-2.5 rounded-full transition-colors ml-4",
                   showLyrics ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                )}
             >
                <MessageSquare className="w-5 h-5 fill-current" />
             </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 md:mb-8 group">
            <input
              type="range"
              min="0"
              max={duration || currentSong.duration}
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white hover:h-2 transition-all"
              style={{
                background: `linear-gradient(to right, white 0%, white ${(progress / (duration || currentSong.duration)) * 100}%, rgba(255,255,255,0.2) ${(progress / (duration || currentSong.duration)) * 100}%, rgba(255,255,255,0.2) 100%)`,
              }}
            />
            <div className="flex justify-between mt-2 text-xs font-medium text-white/40 group-hover:text-white/60 transition-colors">
              <span>{formatDuration(progress)}</span>
              <span>{formatDuration(duration || currentSong.duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between">
             <button
                onClick={togglePlayMode}
                className={cn(
                   "p-2 rounded-full transition-colors",
                   playMode !== 'sequence' ? "text-blue-400 bg-blue-400/10" : "text-white/40 hover:text-white/60"
                )}
             >
                {playMode === 'shuffle' ? <Shuffle className="w-5 h-5" /> : playMode === 'repeat-one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
             </button>

             <div className="flex items-center gap-6 md:gap-8">
                <button
                   onClick={playPrevious}
                   className="text-white hover:text-white/70 transition-colors active:scale-95"
                >
                   <SkipBack className="w-8 h-8 md:w-9 md:h-9 fill-current" />
                </button>

                <button
                   onClick={togglePlay}
                   className="w-16 h-16 md:w-20 md:h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-white/10"
                >
                   {isPlaying ? (
                      <Pause className="w-7 h-7 md:w-8 md:h-8 fill-current" />
                   ) : (
                      <Play className="w-7 h-7 md:w-8 md:h-8 fill-current ml-1" />
                   )}
                </button>

                <button
                   onClick={playNext}
                   className="text-white hover:text-white/70 transition-colors active:scale-95"
                >
                   <SkipForward className="w-8 h-8 md:w-9 md:h-9 fill-current" />
                </button>
             </div>

             <button
                onClick={() => setMenuOpen(true)}
                className="p-2 rounded-full text-white/40 hover:text-white/60 transition-colors"
             >
                <MoreVertical className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      {/* Queue Sheet */}
      <AnimatePresence>
        {queueOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setQueueOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 h-[70vh] bg-white/95 dark:bg-[#1e1e1e]/90 backdrop-blur-xl rounded-t-3xl border-t border-black/10 dark:border-white/10 z-50 flex flex-col"
            >
               <div className="p-4 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Playing Next</h2>
                  <button
                     onClick={clearQueue}
                     className="text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium"
                  >
                     Clear
                  </button>
               </div>
               <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
                  {queue.map((song, index) => (
                     <div
                        key={index}
                        onClick={() => playFromQueue(index)}
                        className={cn(
                           "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors",
                           index === currentQueueIndex ? "bg-blue-50 dark:bg-white/10" : "hover:bg-gray-100 dark:hover:bg-white/5"
                        )}
                     >
                        <img src={song.coverUrl} className="w-10 h-10 rounded-md object-cover bg-gray-200 dark:bg-white/5" />
                        <div className="flex-1 min-w-0">
                           <div className={cn("font-medium truncate flex items-center gap-1.5", index === currentQueueIndex ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white")}>
                              <span className="truncate">{song.title}</span>
                              {song.isHr && (
                                <span className="flex-shrink-0 text-[9px] px-1 py-0.5 bg-red-500 text-white rounded-[3px] font-bold tracking-wider">HR</span>
                              )}
                              {song.isSq && (
                                <span className="flex-shrink-0 text-[9px] px-1 py-0.5 bg-yellow-500 text-white rounded-[3px] font-bold tracking-wider">SQ</span>
                              )}
                           </div>
                           <div className="text-xs text-gray-500 dark:text-white/40 truncate">{song.artist}</div>
                        </div>
                        <button
                           onClick={(e) => { e.stopPropagation(); removeFromQueue(index); }}
                           className="p-2 text-gray-300 dark:text-white/20 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        >
                           &times;
                        </button>
                     </div>
                  ))}
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Song Menu */}
      <SongMenu
        isOpen={menuOpen}
        song={currentSong}
        onClose={() => setMenuOpen(false)}
      />
    </div>
  );
};
