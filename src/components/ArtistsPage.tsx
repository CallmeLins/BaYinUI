import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MoreVertical, Menu } from 'lucide-react';
import { AlphabetScroller } from './AlphabetScroller';
import { useMusic } from '../context/MusicContext';
import { cn } from '../components/ui/utils';
import { motion } from 'framer-motion';

export const ArtistsPage = () => {
  const navigate = useNavigate();
  const { artists, isDarkMode, hasScanned, setMobileSidebarOpen } = useMusic();
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

  return (
    <div className="relative pb-20">
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 -mx-6 px-6 py-4 mb-6 flex items-center justify-between",
        "bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10"
      )}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold tracking-tight">Artists</h1>
        </div>
        <button
          onClick={() => setSortMenuOpen(true)}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Main content - Bento Grid */}
      <div>
        {!hasScanned ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No music scanned yet.</p>
            <button 
              onClick={() => navigate('/scan')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition-colors"
            >
              Scan Music
            </button>
          </div>
        ) : artists.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No artists found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {artists.map((artist, index) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => navigate(`/artists/${artist.id}`)}
                className={cn(
                  "group relative flex flex-col items-center text-center cursor-pointer",
                  "bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl",
                  "border border-black/5 dark:border-white/10",
                  "p-6 shadow-sm hover:shadow-md transition-all duration-300"
                )}
                whileHover={{ scale: 1.02 }}
              >
                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden shadow-md border border-black/5 dark:border-white/10">
                  <img
                    src={artist.coverUrl}
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-medium text-base truncate w-full text-gray-900 dark:text-white mb-1">
                  {artist.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {artist.songCount} songs
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Alphabet scroller */}
      {hasScanned && artists.length > 0 && (
        <div className="fixed right-2 top-1/2 -translate-y-1/2 z-20">
           <AlphabetScroller items={artists.map(a => ({ id: a.id, name: a.name }))} />
        </div>
      )}

      {/* Sort menu */}
      {sortMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            onClick={() => setSortMenuOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={cn(
              "fixed bottom-24 right-6 w-64 z-50",
              "bg-white/90 dark:bg-[#323232]/90 backdrop-blur-xl",
              "rounded-xl shadow-2xl border border-black/5 dark:border-white/10",
              "p-1.5"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By</h3>
            <div className="space-y-0.5">
              {['Name', 'Song Count'].map((option) => (
                <button
                  key={option}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-blue-500 hover:text-white transition-colors"
                  onClick={() => setSortMenuOpen(false)}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};