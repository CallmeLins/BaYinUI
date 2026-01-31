import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, MoreVertical, Shuffle, SkipBack, Play, Pause, SkipForward, Repeat, List, Repeat1, MessageSquare } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { getLyrics, parseLrcLyrics, type LyricLine } from '../services/scanner';
import { cn } from '../components/ui/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { SongMenu } from './SongMenu';
import { getCurrentWindow } from '@tauri-apps/api/window';

type PlayMode = 'shuffle' | 'sequence' | 'repeat-one';

// Check if element or its parents are interactive
const isInteractiveElement = (element: HTMLElement | null): boolean => {
  while (element) {
    const tagName = element.tagName.toLowerCase();
    if (
      tagName === 'button' ||
      tagName === 'a' ||
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
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
    playFromQueue,
    lyricsFontSize,
    lyricsTextAlign,
    lyricsFontWeight,
  } = useMusic();

  const [playMode, setPlayMode] = useState<PlayMode>('sequence');
  const [showLyrics, setShowLyrics] = useState(false);
  const [queueOpen, setQueueOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const desktopLyricsRef = useRef<HTMLDivElement>(null);
  const [isLyricsLoaded, setIsLyricsLoaded] = useState(false);

  // Handle window dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (isInteractiveElement(e.target as HTMLElement)) return;
    getCurrentWindow().startDragging().catch(() => {});
  }, []);

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
    <div
      onMouseDown={handleMouseDown}
      className="fixed inset-0 z-[100] flex flex-col bg-[#121212] text-white overflow-hidden font-sans antialiased"
    >

      {/* --- Visual Physics: Background Layer --- */}
      {/* 1. Base Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black z-0" />
      
      {/* 2. Dynamic Glassmorphism Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          key={currentSong.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
           {/* The Image Source */}
           <img
             src={currentSong.coverUrl}
             alt=""
             className="w-full h-full object-cover scale-110"
           />
           {/* The "Vibrancy 3.0" Filter Stack */}
           <div className="absolute inset-0 bg-black/60 backdrop-blur-[100px] saturate-150" />
           
           {/* Noise Texture for Realism */}
           <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" 
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
           />
        </motion.div>
      </div>

      {/* --- Main Window Shell --- */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Window Header (Draggable Area) */}
        <div className="flex items-center justify-between px-6 py-5 flex-shrink-0">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors z-20 active:scale-95 duration-200"
          >
            <ChevronDown className="w-6 h-6 text-white/90 drop-shadow-md" />
          </button>
          
          <div className="flex flex-col items-center pointer-events-none opacity-80">
             <span className="text-[11px] font-semibold text-white/60 uppercase tracking-[0.2em] drop-shadow-sm">Now Playing</span>
          </div>
          
          <button
            onClick={() => setQueueOpen(true)}
            className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors z-20 active:scale-95 duration-200"
          >
            <List className="w-6 h-6 text-white/90 drop-shadow-md" />
          </button>
        </div>

        {/* --- Center Stage: Responsive Layout --- */}
        <div className="flex-1 flex items-center justify-center px-6 md:px-12 lg:px-20 min-h-0 relative w-full max-w-[1400px] mx-auto">

          {/* Mobile Layout: Cover or Lyrics (toggle) */}
          <div className="md:hidden w-full h-full flex flex-col items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {!showLyrics ? (
                <motion.div
                  key="cover"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 220, damping: 25 }}
                  className="w-full max-w-[340px] aspect-square relative group cursor-pointer"
                  onClick={() => setShowLyrics(true)}
                >
                  {/* Physical Depth Shadow */}
                  <div className="absolute inset-4 rounded-[24px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)]" />
                  
                  <img
                    src={currentSong.coverUrl}
                    alt={currentSong.title}
                    className="relative w-full h-full rounded-[24px] object-cover border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]"
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
                     className={cn(
                       "h-full overflow-y-auto scrollbar-hide py-[40vh] space-y-8 select-none",
                       lyricsTextAlign ? "text-center" : "text-left px-6"
                     )}
                     style={{ maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' }}
                  >
                     {lyrics.length > 0 ? (
                        lyrics.map((lyric, idx) => {
                           const isActive = idx === currentLyricIndex;
                           return (
                              <p
                                 key={idx}
                                 className={cn(
                                    "transition-all duration-500 px-4 leading-relaxed tracking-tight",
                                    isActive
                                      ? "text-white scale-105 blur-0 drop-shadow-lg"
                                      : "text-white/30 blur-[1.5px] scale-95"
                                 )}
                                 style={{
                                   fontSize: `${lyricsFontSize}px`,
                                   fontWeight: lyricsFontWeight === 'bold' ? 700 : lyricsFontWeight === 'medium' ? 500 : 400,
                                 }}
                              >
                                 {lyric.text}
                              </p>
                           )
                        })
                     ) : (
                        <div className="h-full flex items-center justify-center">
                          <p className="text-white/40 text-lg font-medium tracking-wide">
                              {isLyricsLoaded ? "No lyrics available" : "Loading..."}
                          </p>
                        </div>
                     )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop/Tablet Layout: Split View "Bento" Style */}
          <div className="hidden md:flex w-full h-[65vh] lg:h-[70vh] items-center gap-12 lg:gap-20 xl:gap-24">
            
            {/* Left Pane: Album Art & Info */}
            <div className="flex-1 flex flex-col items-end justify-center max-w-[45%]">
              <motion.div
                key={currentSong.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 180, damping: 24 }}
                className="relative w-full max-w-[420px] aspect-square"
              >
                {/* Visual Physics: Deep Ambient Shadow */}
                <div className="absolute inset-6 bg-black/40 rounded-[32px] blur-2xl translate-y-8" />
                
                {/* The Cover Art */}
                <img
                  src={currentSong.coverUrl}
                  alt={currentSong.title}
                  className="relative w-full h-full rounded-[32px] object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_40px_-12px_rgba(0,0,0,0.5)]"
                />
                
                {/* Top Bezel Highlight (Studio Lighting) */}
                <div className="absolute inset-0 rounded-[32px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] pointer-events-none" />
              </motion.div>

              {/* Desktop Song Info (Left Aligned under art) */}
              <div className="w-full max-w-[420px] mt-8 pl-1">
                <motion.h1 
                  key={currentSong.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight drop-shadow-md truncate"
                >
                  {currentSong.title}
                </motion.h1>
                <motion.p 
                  key={currentSong.artist}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-xl text-white/60 font-medium mt-2 tracking-wide truncate"
                >
                  {currentSong.artist}
                </motion.p>
              </div>
            </div>

            {/* Right Pane: Lyrics Stream */}
            <div className="flex-1 h-full flex items-center justify-start max-w-[55%] relative">
               {/* Glass Container for Lyrics (Optional: adds separation) */}
               <div className="absolute inset-y-0 -left-8 right-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent opacity-0 lg:opacity-100 pointer-events-none" />

              <div
                ref={desktopLyricsRef}
                className={cn(
                  "w-full h-full overflow-hidden flex flex-col justify-center pl-4 lg:pl-8",
                  lyricsTextAlign ? "text-center" : "text-left"
                )}
                style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)' }}
              >
                {lyrics.length > 0 ? (
                  <div className="space-y-6 lg:space-y-8">
                    <AnimatePresence mode="popLayout">
                      {visibleLyrics.map((lyric) => {
                        const isActive = lyric.originalIndex === currentLyricIndex;
                        if (lyric.isPlaceholder) {
                          return (
                            <div key={`placeholder-${lyric.originalIndex}`} className="h-[2em] lg:h-[2.5em]" />
                          );
                        }
                        return (
                          <motion.p
                            key={lyric.originalIndex}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{
                              opacity: isActive ? 1 : 0.3,
                              x: 0,
                              scale: isActive ? 1 : 0.98,
                              filter: isActive ? 'blur(0px)' : 'blur(1px)'
                            }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={cn(
                              "transition-colors duration-300 leading-tight tracking-tight cursor-default",
                              lyricsTextAlign ? "origin-center" : "origin-left",
                              isActive ? "text-white drop-shadow-lg" : "text-white/40 hover:text-white/60"
                            )}
                            style={{
                              fontSize: `${Math.round(lyricsFontSize * 1.5)}px`,
                              fontWeight: lyricsFontWeight === 'bold' ? 700 : lyricsFontWeight === 'medium' ? 500 : 400,
                            }}
                          >
                            {lyric.text}
                          </motion.p>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    <p className="text-white/30 text-2xl font-medium tracking-wide animate-pulse">
                      {isLyricsLoaded ? "Instrumental / No Lyrics" : "Loading..."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* --- Bottom Controls Area --- */}
        <div className="px-6 md:px-12 pb-8 md:pb-10 pt-6 w-full max-w-4xl mx-auto flex-shrink-0 z-20">

          {/* Mobile Song Info (Hidden on Desktop) */}
          <div className="md:hidden flex items-center justify-between mb-6">
             <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-white truncate mb-1 tracking-tight">{currentSong.title}</h1>
                <p className="text-lg text-white/60 truncate font-medium">{currentSong.artist}</p>
             </div>
             <button
                onClick={() => setShowLyrics(!showLyrics)}
                className={cn(
                   "p-3 rounded-full transition-all shadow-lg",
                   showLyrics 
                    ? "bg-white text-black shadow-white/20" 
                    : "bg-white/10 text-white hover:bg-white/20 border border-white/5"
                )}
             >
                <MessageSquare className="w-5 h-5 fill-current" />
             </button>
          </div>

          {/* Progress Bar (macOS Slider Style) */}
          <div className="mb-8 group relative">
            {/* Hover Glow Effect */}
            <div className="absolute -inset-y-2 -inset-x-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
            
            <input
              type="range"
              min="0"
              max={duration || currentSong.duration}
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value))}
              className="relative w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-white hover:h-1.5 focus:outline-none z-10"
              style={{
                background: `linear-gradient(to right, white 0%, white ${(progress / (duration || currentSong.duration)) * 100}%, rgba(255,255,255,0.15) ${(progress / (duration || currentSong.duration)) * 100}%, rgba(255,255,255,0.15) 100%)`,
              }}
            />
            {/* Custom Thumb (Simulated via CSS or just stick to accent-white for native feel) */}
            
            <div className="flex justify-between mt-3 text-xs font-semibold text-white/40 group-hover:text-white/70 transition-colors tracking-wide font-mono">
              <span>{formatDuration(progress)}</span>
              <span>{formatDuration(duration || currentSong.duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between">
             <button
                onClick={togglePlayMode}
                className={cn(
                   "p-2.5 rounded-lg transition-all duration-200 active:scale-95",
                   playMode !== 'sequence' 
                    ? "text-blue-400 bg-blue-500/10 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]" 
                    : "text-white/30 hover:text-white/60 hover:bg-white/5"
                )}
             >
                {playMode === 'shuffle' ? <Shuffle className="w-5 h-5" /> : playMode === 'repeat-one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
             </button>

             <div className="flex items-center gap-8 md:gap-12">
                <button
                   onClick={playPrevious}
                   className="text-white/80 hover:text-white transition-colors active:scale-90 duration-200"
                >
                   <SkipBack className="w-9 h-9 md:w-10 md:h-10 fill-current drop-shadow-sm" />
                </button>

                <button
                   onClick={togglePlay}
                   className="w-16 h-16 md:w-20 md:h-20 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] border border-white/50"
                >
                   {isPlaying ? (
                      <Pause className="w-7 h-7 md:w-9 md:h-9 fill-current" />
                   ) : (
                      <Play className="w-7 h-7 md:w-9 md:h-9 fill-current ml-1" />
                   )}
                </button>

                <button
                   onClick={playNext}
                   className="text-white/80 hover:text-white transition-colors active:scale-90 duration-200"
                >
                   <SkipForward className="w-9 h-9 md:w-10 md:h-10 fill-current drop-shadow-sm" />
                </button>
             </div>

             <button
                onClick={() => setMenuOpen(true)}
                className="p-2.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all active:scale-95"
             >
                <MoreVertical className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      {/* Queue Sheet (Glassmorphism Modal) */}
      <AnimatePresence>
        {queueOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              data-no-drag
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setQueueOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 h-[75vh] bg-[#1e1e1e]/80 backdrop-blur-2xl rounded-t-[32px] border-t border-white/10 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] z-50 flex flex-col"
            >
               {/* Handle Bar */}
               <div className="w-full flex justify-center pt-3 pb-1">
                 <div className="w-12 h-1.5 bg-white/20 rounded-full" />
               </div>

               <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white tracking-wide">Playing Next</h2>
                  <button
                     onClick={clearQueue}
                     className="text-sm text-red-400 hover:text-red-300 font-medium px-3 py-1 rounded-full hover:bg-red-500/10 transition-colors"
                  >
                     Clear
                  </button>
               </div>
               <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-1">
                  {queue.map((song, index) => (
                     <div
                        key={index}
                        onClick={() => playFromQueue(index)}
                        className={cn(
                           "flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 group",
                           index === currentQueueIndex 
                            ? "bg-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]" 
                            : "hover:bg-white/5"
                        )}
                     >
                        <div className="relative w-12 h-12 flex-shrink-0">
                           <img src={song.coverUrl} className="w-full h-full rounded-lg object-cover shadow-sm" />
                           {index === currentQueueIndex && (
                             <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center backdrop-blur-[1px]">
                               <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                             </div>
                           )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                           <div className={cn("font-medium truncate flex items-center gap-2 text-base", index === currentQueueIndex ? "text-white" : "text-white/90")}>
                              <span className="truncate">{song.title}</span>
                              {song.isHr && (
                                <span className="flex-shrink-0 text-[9px] px-1.5 py-0.5 bg-red-500/80 text-white rounded-[4px] font-bold tracking-wider border border-red-400/20">HR</span>
                              )}
                              {song.isSq && (
                                <span className="flex-shrink-0 text-[9px] px-1.5 py-0.5 bg-yellow-500/80 text-white rounded-[4px] font-bold tracking-wider border border-yellow-400/20">SQ</span>
                              )}
                           </div>
                           <div className="text-sm text-white/50 truncate mt-0.5">{song.artist}</div>
                        </div>
                        <button
                           onClick={(e) => { e.stopPropagation(); removeFromQueue(index); }}
                           className="p-2 text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
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
