import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Search, Shuffle, ArrowUpDown, CheckSquare, Trash2, ListPlus, Play, X, MoreVertical, Menu } from 'lucide-react';
import { SongList } from './SongList';
import { useMusic } from '../context/MusicContext';
import { Song } from '../context/MusicContext';
import { cn } from '../components/ui/utils';
import { motion, AnimatePresence } from 'framer-motion';

type SortOption = 'title' | 'artist' | 'album' | 'duration' | 'size' | 'date';

export const SongsPage = () => {
  const navigate = useNavigate();
  const { songs, hasScanned, shufflePlay, isDarkMode, playlists, playWithQueue, createPlaylist, addSongsToPlaylist, deleteSongs, setMobileSidebarOpen } = useMusic();
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleShufflePlay = () => {
    shufflePlay(songs);
  };

  const alphabetIndex = ['0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const indexBarRef = useRef<HTMLDivElement>(null);

  // Sorting Logic
  const sortedSongs = [...songs].sort((a, b) => {
    switch (sortBy) {
      case 'title': return a.title.localeCompare(b.title, 'zh-CN');
      case 'artist': return a.artist.localeCompare(b.artist, 'zh-CN');
      case 'album': return a.album.localeCompare(b.album, 'zh-CN');
      case 'duration': return b.duration - a.duration;
      case 'size': return (b.fileSize || 0) - (a.fileSize || 0);
      case 'date': return parseInt(b.id) - parseInt(a.id);
      default: return 0;
    }
  });

  const handleSortOption = (option: SortOption) => {
    setSortBy(option);
    setSortMenuOpen(false);
  };

  const toggleSelectAll = () => {
    if (selectedSongs.size === songs.length) {
      setSelectedSongs(new Set());
    } else {
      setSelectedSongs(new Set(songs.map(s => s.id)));
    }
  };

  const toggleSongSelection = (songId: string) => {
    const newSelected = new Set(selectedSongs);
    if (newSelected.has(songId)) {
      newSelected.delete(songId);
    } else {
      newSelected.add(songId);
    }
    setSelectedSongs(newSelected);
  };

  const handleDelete = () => {
    deleteSongs(Array.from(selectedSongs));
    setSelectedSongs(new Set());
    setSelectionMode(false);
    setDeleteConfirmOpen(false);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addSongsToPlaylist(playlistId, Array.from(selectedSongs));
    setSelectedSongs(new Set());
    setSelectionMode(false);
    setAddToPlaylistOpen(false);
  };

  const handleCreateAndAddToPlaylist = () => {
    if (newPlaylistName.trim()) {
      const playlistId = createPlaylist(newPlaylistName.trim());
      addSongsToPlaylist(playlistId, Array.from(selectedSongs));
      setSelectedSongs(new Set());
      setSelectionMode(false);
      setAddToPlaylistOpen(false);
      setNewPlaylistName('');
      setShowNewPlaylistInput(false);
    }
  };

  const handlePlaySelected = () => {
    if (selectedSongs.size > 0) {
      const selectedSongList = songs.filter(s => selectedSongs.has(s.id));
      if (selectedSongList.length > 0) {
        playWithQueue(selectedSongList[0], selectedSongList);
      }
    }
  };

  // Alphabet Index Logic
  const handleIndexTouch = (e: React.TouchEvent | React.MouseEvent) => {
    if (!indexBarRef.current) return;
    const touch = 'touches' in e ? e.touches[0] : e;
    const rect = indexBarRef.current.getBoundingClientRect();
    const y = touch.clientY - rect.top;
    const index = Math.floor((y / rect.height) * alphabetIndex.length);

    if (index >= 0 && index < alphabetIndex.length) {
      const letter = alphabetIndex[index];
      setActiveIndex(letter);
      scrollToLetter(letter);
    }
  };

  const scrollToLetter = (letter: string) => {
    let targetSong: Song | undefined;
    if (letter === '0') {
      targetSong = sortedSongs.find(s => /^[0-9]/.test(s.title));
    } else if (letter === '#') {
      targetSong = sortedSongs.find(s => !/^[a-zA-Z0-9]/.test(s.title));
    } else {
      targetSong = sortedSongs.find(s => 
        s.title.toUpperCase().startsWith(letter) || 
        s.title.toLowerCase().startsWith(letter.toLowerCase())
      );
    }
    if (targetSong) {
      const element = document.getElementById(`song-${targetSong.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleIndexTouchEnd = () => {
    setTimeout(() => setActiveIndex(null), 500);
  };

  return (
    <div className="relative pb-20">
      {/* Sticky Glass Header */}
      <div className={cn(
        "sticky top-0 z-10 -mx-6 px-6 py-4 mb-2 flex items-center justify-between",
        "bg-white/85 dark:bg-[#121212]/85 backdrop-blur-xl saturate-150 border-b border-black/5 dark:border-white/10 transition-colors duration-300"
      )}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 -ml-2 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Songs</h1>
          {hasScanned && (
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium hidden sm:inline-block pt-1">
              {songs.length} songs
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/search')}
            className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSortMenuOpen(true)}
            className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-gray-600 dark:text-gray-300"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      {hasScanned && (
        <div className="flex items-center gap-3 mb-6 px-1">
          {!selectionMode ? (
            <>
              <button
                onClick={handleShufflePlay}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-white/15 transition-all active:scale-95"
                title="Shuffle All"
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setSelectionMode(true)}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-blue-600 dark:text-blue-400 hover:bg-gray-200 dark:hover:bg-white/15 transition-all active:scale-95"
                title="Select Songs"
              >
                <CheckSquare className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex-1 flex items-center gap-2 bg-blue-50 dark:bg-blue-500/10 p-1.5 rounded-xl border border-blue-100 dark:border-blue-500/20">
              <button
                onClick={() => {
                  setSelectionMode(false);
                  setSelectedSongs(new Set());
                }}
                className="p-2 rounded-lg hover:bg-blue-200/50 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <span className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex-1 text-center">
                {selectedSongs.size} Selected
              </span>
              <button
                onClick={toggleSelectAll}
                className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 text-blue-600 dark:text-blue-300 font-semibold shadow-sm border border-blue-100 dark:border-white/5"
              >
                {selectedSongs.size === songs.length ? 'None' : 'All'}
              </button>
              
              <div className="w-[1px] h-6 bg-blue-200 dark:bg-white/10 mx-1" />

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePlaySelected}
                  disabled={selectedSongs.size === 0}
                  className="p-2 rounded-lg hover:bg-blue-200/50 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 disabled:opacity-30 transition-colors"
                >
                  <Play className="w-5 h-5 fill-current" />
                </button>
                <button
                  onClick={() => setAddToPlaylistOpen(true)}
                  disabled={selectedSongs.size === 0}
                  className="p-2 rounded-lg hover:bg-blue-200/50 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 disabled:opacity-30 transition-colors"
                >
                  <ListPlus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  disabled={selectedSongs.size === 0}
                  className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 text-red-500 dark:text-red-400 disabled:opacity-30 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="relative min-h-[50vh]">
        {!hasScanned ? (
          <div className="flex flex-col items-center justify-center h-full pt-20">
            <p className="text-gray-500 mb-4">No music found.</p>
            <button
              onClick={() => navigate('/scan')}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600"
            >
              Scan Music
            </button>
          </div>
        ) : (
          <>
            <SongList 
              songs={sortedSongs} 
              selectionMode={selectionMode}
              selectedSongs={selectedSongs}
              onToggleSelection={toggleSongSelection}
            />
            
            {/* Alphabet Index */}
            <div
              ref={indexBarRef}
              className="fixed right-1 top-1/2 -translate-y-1/2 z-20 py-2 select-none"
              onTouchStart={handleIndexTouch}
              onTouchMove={handleIndexTouch}
              onTouchEnd={handleIndexTouchEnd}
              onMouseDown={handleIndexTouch}
              onMouseMove={(e) => e.buttons === 1 && handleIndexTouch(e)}
              onMouseUp={handleIndexTouchEnd}
            >
              {alphabetIndex.map((letter) => (
                <div
                  key={letter}
                  className={cn(
                    "text-[10px] px-1 py-[1px] cursor-pointer text-center transition-colors",
                    activeIndex === letter
                      ? "text-blue-500 font-bold scale-125"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  )}
                >
                  {letter}
                </div>
              ))}
            </div>

            {/* Large Letter Overlay */}
            <AnimatePresence>
              {activeIndex && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-20 h-20 rounded-xl bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-md flex items-center justify-center shadow-2xl"
                >
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{activeIndex}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {/* Modals / Popovers */}
      {/* Sort Menu */}
      {sortMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm" onClick={() => setSortMenuOpen(false)} />
          <div className="fixed bottom-24 right-6 w-64 z-50 bg-white/90 dark:bg-[#323232]/90 backdrop-blur-xl rounded-xl shadow-2xl border border-black/5 dark:border-white/10 p-1.5 animate-fade-in">
            <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By</h3>
            <div className="space-y-0.5">
              {[
                { label: 'Title', value: 'title' },
                { label: 'Artist', value: 'artist' },
                { label: 'Album', value: 'album' },
                { label: 'Duration', value: 'duration' },
                { label: 'Date Added', value: 'date' },
              ].map((option) => (
                <button
                  key={option.value}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                    sortBy === option.value 
                      ? "bg-blue-500 text-white" 
                      : "hover:bg-blue-500 hover:text-white text-gray-700 dark:text-gray-200"
                  )}
                  onClick={() => handleSortOption(option.value as SortOption)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl p-6 border border-black/5 dark:border-white/10">
            <h3 className="text-lg font-semibold mb-2">Delete Songs?</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Are you sure you want to delete {selectedSongs.size} songs? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Playlist */}
      {addToPlaylistOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl p-6 border border-black/5 dark:border-white/10 max-h-[80vh] flex flex-col">
            <h3 className="text-lg font-semibold mb-4">Add to Playlist</h3>
            
            {showNewPlaylistInput ? (
              <div className="mb-4">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="Playlist Name"
                  className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-black/20 border-none focus:ring-2 focus:ring-blue-500 outline-none"
                  autoFocus
                />
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setShowNewPlaylistInput(false);
                      setNewPlaylistName('');
                    }}
                    className="flex-1 py-2 rounded-lg bg-gray-100 dark:bg-white/10 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateAndAddToPlaylist}
                    disabled={!newPlaylistName.trim()}
                    className="flex-1 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium disabled:opacity-50"
                  >
                    Create
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowNewPlaylistInput(true)}
                className="w-full text-left px-4 py-3 rounded-xl mb-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center gap-2"
              >
                <ListPlus className="w-5 h-5" />
                New Playlist
              </button>
            )}

            <div className="flex-1 overflow-y-auto min-h-0 space-y-1">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                >
                  <div className="font-medium text-gray-900 dark:text-white">{playlist.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{playlist.songCount} songs</div>
                </button>
              ))}
            </div>
            
            <button 
               onClick={() => setAddToPlaylistOpen(false)}
               className="mt-4 w-full py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 font-medium text-sm transition-colors"
            >
               Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};