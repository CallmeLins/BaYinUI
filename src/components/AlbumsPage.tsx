import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { MoreVertical, Menu } from 'lucide-react';
import { AlphabetScroller } from './AlphabetScroller';
import { useMusic } from '../context/MusicContext';
import { cn } from '../components/ui/utils';
import { motion } from 'framer-motion';

type AlbumSortOption = 'name' | 'artist' | 'year' | 'count';

export const AlbumsPage = () => {
  const navigate = useNavigate();
  const { albums, isDarkMode, hasScanned, setMobileSidebarOpen } = useMusic();
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<AlbumSortOption>('name');

  const sortedAlbums = useMemo(() => {
    return [...albums].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'zh-CN');
        case 'artist':
          return a.artist.localeCompare(b.artist, 'zh-CN');
        case 'year':
          return (b.year || 0) - (a.year || 0);
        case 'count':
          return b.songCount - a.songCount;
        default:
          return 0;
      }
    });
  }, [albums, sortBy]);

  const handleSortOption = (option: AlbumSortOption) => {
    setSortBy(option);
    setSortMenuOpen(false);
  };

  return (
    <div className="relative pb-20">
      {/* Header - Glassmorphic & Sticky */}
      <div className="sticky top-0 z-10 -mx-6 px-6 py-4 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10 flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-semibold tracking-tight">Albums</h1>
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
        ) : albums.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No albums found.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sortedAlbums.map((album, index) => (
              <motion.div
                key={album.id}
                id={`item-${album.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 30 }}
                onClick={() => navigate(`/albums/${album.id}`)}
                className={cn(
                  "group relative flex flex-col cursor-pointer",
                  // Bento Card Style
                  "bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl",
                  "border border-black/5 dark:border-white/10",
                  "shadow-sm hover:shadow-md transition-all duration-300",
                  "overflow-hidden"
                )}
                whileHover={{ scale: 1.02 }}
              >
                <div className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-white/5">
                  <img
                    src={album.coverUrl}
                    alt={album.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-base truncate text-gray-900 dark:text-white mb-0.5">
                    {album.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {album.artist}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {album.songCount} songs
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Alphabet scroller */}
      {hasScanned && sortedAlbums.length > 0 && (
        <AlphabetScroller items={sortedAlbums.map(a => ({ id: a.id, name: sortBy === 'artist' ? a.artist : a.name }))} />
      )}

      {/* Sort menu - Replaced with a cleaner Popover if possible, but keeping simple for now */}
      {sortMenuOpen && (
        <>
          <div
            data-no-drag
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
              {([
                { label: 'Title', value: 'name' as AlbumSortOption },
                { label: 'Artist', value: 'artist' as AlbumSortOption },
                { label: 'Year', value: 'year' as AlbumSortOption },
                { label: 'Song Count', value: 'count' as AlbumSortOption },
              ]).map((option) => (
                <button
                  key={option.value}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    sortBy === option.value
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-500 hover:text-white text-gray-700 dark:text-gray-200"
                  )}
                  onClick={() => handleSortOption(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};