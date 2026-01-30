import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { Sidebar } from './Sidebar';
import { cn } from '../components/ui/utils';

export const UserInterfacePage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    isDarkMode,
    toggleDarkMode,
    showCoverInList,
    setShowCoverInList,
    lyricsFontSize,
    setLyricsFontSize,
    lyricsTextAlign,
    setLyricsTextAlign,
    lyricsFontWeight,
    setLyricsFontWeight,
  } = useMusic();

  return (
    <div className="relative pb-20">
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 -mx-6 px-6 py-4 mb-6 flex items-center gap-4",
        "bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10"
      )}>
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold tracking-tight">User Interface</h1>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Appearance Group */}
        <section>
           <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">Appearance</h2>
           <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                 <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Use dark theme for low light environments</p>
                 </div>
                 <button
                    onClick={toggleDarkMode}
                    className={cn(
                      "w-11 h-6 rounded-full transition-colors relative",
                      isDarkMode ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                    )}
                  >
                    <div className={cn(
                       "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                       isDarkMode ? "translate-x-5" : "translate-x-0"
                    )} />
                  </button>
              </div>
           </div>
        </section>

        {/* Lyrics Group */}
        <section>
           <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">Lyrics Display</h2>
           <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
              
              {/* Font Size */}
              <div className="p-4 border-b border-black/5 dark:border-white/5">
                 <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">Font Size</span>
                    <span className="text-sm text-gray-500">{lyricsFontSize}px</span>
                 </div>
                 <input
                    type="range"
                    min="12"
                    max="32"
                    value={lyricsFontSize}
                    onChange={(e) => setLyricsFontSize(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                 />
              </div>

              {/* Text Align */}
              <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5">
                 <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Center Align Lyrics</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Display lyrics in the center of the screen</p>
                 </div>
                 <button
                    onClick={() => setLyricsTextAlign(!lyricsTextAlign)}
                    className={cn(
                      "w-11 h-6 rounded-full transition-colors relative",
                      lyricsTextAlign ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                    )}
                  >
                    <div className={cn(
                       "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                       lyricsTextAlign ? "translate-x-5" : "translate-x-0"
                    )} />
                  </button>
              </div>

              {/* Font Weight */}
              <div className="p-4">
                 <label className="block mb-3 font-medium text-gray-900 dark:text-white">Font Weight</label>
                 <div className="grid grid-cols-3 gap-2 bg-gray-100 dark:bg-black/20 p-1 rounded-lg">
                    {[
                       { value: 'normal', label: 'Normal' },
                       { value: 'medium', label: 'Medium' },
                       { value: 'bold', label: 'Bold' },
                    ].map((option) => (
                       <button
                          key={option.value}
                          onClick={() => setLyricsFontWeight(option.value as any)}
                          className={cn(
                             "py-1.5 rounded-md text-sm font-medium transition-all",
                             lyricsFontWeight === option.value
                                ? "bg-white dark:bg-gray-700 text-black dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                          )}
                       >
                          {option.label}
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Lists Group */}
        <section>
           <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">Lists</h2>
           <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                 <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Show Covers</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Display album art in song lists</p>
                 </div>
                 <button
                    onClick={() => setShowCoverInList(!showCoverInList)}
                    className={cn(
                      "w-11 h-6 rounded-full transition-colors relative",
                      showCoverInList ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                    )}
                  >
                    <div className={cn(
                       "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                       showCoverInList ? "translate-x-5" : "translate-x-0"
                    )} />
                  </button>
              </div>
           </div>
        </section>

      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};
