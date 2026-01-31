import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { MoreVertical, Plus, Edit2, Trash2, Menu, ArrowUpDown } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { cn } from '../components/ui/utils';
import { motion, AnimatePresence } from 'framer-motion';

type PlaylistSortOption = 'name' | 'count' | 'recent';

export const PlaylistsPage = () => {
  const navigate = useNavigate();
  const { playlists, isDarkMode, createPlaylist, deletePlaylist, updatePlaylist, setMobileSidebarOpen } = useMusic();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [playlistName, setPlaylistName] = useState('');
  const [menuPlaylistId, setMenuPlaylistId] = useState<string | null>(null);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [sortBy, setSortBy] = useState<PlaylistSortOption>('recent');

  const sortedPlaylists = useMemo(() => {
    return [...playlists].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'zh-CN');
        case 'count':
          return b.songCount - a.songCount;
        case 'recent':
          return 0; // keep original order (most recently created)
        default:
          return 0;
      }
    });
  }, [playlists, sortBy]);

  const handleSortOption = (option: PlaylistSortOption) => {
    setSortBy(option);
    setSortMenuOpen(false);
  };

  const handleCreate = () => {
    if (playlistName.trim()) {
      createPlaylist(playlistName);
      setPlaylistName('');
      setShowCreateDialog(false);
    }
  };

  const handleEdit = () => {
    if (selectedPlaylist && playlistName.trim()) {
      updatePlaylist(selectedPlaylist, playlistName);
      setPlaylistName('');
      setShowEditDialog(false);
      setMenuPlaylistId(null);
    }
  };

  const handleDelete = () => {
    if (selectedPlaylist) {
      deletePlaylist(selectedPlaylist);
      setShowDeleteDialog(false);
      setMenuPlaylistId(null);
    }
  };

  const openEditDialog = (id: string, name: string) => {
    setSelectedPlaylist(id);
    setPlaylistName(name);
    setShowEditDialog(true);
    setMenuPlaylistId(null);
  };

  const openDeleteDialog = (id: string) => {
    setSelectedPlaylist(id);
    setShowDeleteDialog(true);
    setMenuPlaylistId(null);
  };

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
          <h1 className="text-2xl font-semibold tracking-tight">Playlists</h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSortMenuOpen(true)}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div>
        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No playlists yet.</p>
            <button 
              onClick={() => setShowCreateDialog(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition-colors"
            >
              Create Playlist
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {sortedPlaylists.map((playlist, index) => (
              <motion.div
                key={playlist.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "group flex items-center justify-between p-4 rounded-xl cursor-pointer",
                  "bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md",
                  "border border-black/5 dark:border-white/10",
                  "hover:bg-white/80 dark:hover:bg-[#1e1e1e]/80 transition-all shadow-sm"
                )}
                onClick={() => navigate(`/playlists/${playlist.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-lg text-gray-900 dark:text-white truncate">
                    {playlist.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {playlist.songCount} songs
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuPlaylistId(playlist.id);
                  }}
                  className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                >
                  <MoreVertical className="w-5 h-5 text-gray-500" />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Playlist Menu Modal */}
      <AnimatePresence>
        {menuPlaylistId && (
          <div data-no-drag className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm" onClick={() => setMenuPlaylistId(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "w-full max-w-xs overflow-hidden",
                "bg-white/90 dark:bg-[#282828]/90 backdrop-blur-xl",
                "rounded-2xl shadow-2xl border border-black/5 dark:border-white/10",
                "p-2"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  const playlist = playlists.find(p => p.id === menuPlaylistId);
                  if (playlist) openEditDialog(playlist.id, playlist.name);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left"
              >
                <Edit2 className="w-4 h-4" />
                <span>Rename Playlist</span>
              </button>
              <button
                onClick={() => openDeleteDialog(menuPlaylistId!)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors text-left"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Playlist</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create/Edit Dialog */}
      {(showCreateDialog || showEditDialog) && (
        <div data-no-drag className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "w-full max-w-sm p-6 rounded-2xl shadow-2xl",
              "bg-white dark:bg-[#1e1e1e] border border-black/5 dark:border-white/10"
            )}
          >
            <h3 className="text-lg font-semibold mb-4">
              {showCreateDialog ? 'New Playlist' : 'Rename Playlist'}
            </h3>
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Playlist Name"
              className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-black/20 border-none focus:ring-2 focus:ring-blue-500 outline-none mb-6"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateDialog(false);
                  setShowEditDialog(false);
                  setPlaylistName('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 font-medium hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={showCreateDialog ? handleCreate : handleEdit}
                disabled={!playlistName.trim()}
                className="flex-1 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {showCreateDialog ? 'Create' : 'Save'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div data-no-drag className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "w-full max-w-sm p-6 rounded-2xl shadow-2xl",
              "bg-white dark:bg-[#1e1e1e] border border-black/5 dark:border-white/10"
            )}
          >
            <h3 className="text-lg font-semibold mb-2">Delete Playlist?</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
              Are you sure you want to delete this playlist? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 font-medium hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sort Menu */}
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
                { label: 'Recently Added', value: 'recent' as PlaylistSortOption },
                { label: 'Name', value: 'name' as PlaylistSortOption },
                { label: 'Song Count', value: 'count' as PlaylistSortOption },
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