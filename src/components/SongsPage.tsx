import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Menu, Search, Shuffle, ArrowUpDown, CheckSquare, Trash2, ListPlus, Play, X, MoreVertical } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { SongList } from './SongList';
import { useMusic } from '../context/MusicContext';
import { Song } from '../context/MusicContext';

type SortOption = 'title' | 'artist' | 'album' | 'duration' | 'size' | 'date';

export const SongsPage = () => {
  const navigate = useNavigate();
  const { songs, hasScanned, shufflePlay, isDarkMode, playlists, playSong, createPlaylist, addSongsToPlaylist, deleteSongs } = useMusic();
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState<Set<string>>(new Set());
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addToPlaylistOpen, setAddToPlaylistOpen] = useState(false);
  const [showNewPlaylistInput, setShowNewPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleShufflePlay = () => {
    // 随机播放时，将所有歌曲添加到播放队列
    shufflePlay(songs);
  };

  const alphabetIndex = ['0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const indexBarRef = useRef<HTMLDivElement>(null);

  // 排序歌曲
  const sortedSongs = [...songs].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title, 'zh-CN');
      case 'artist':
        return a.artist.localeCompare(b.artist, 'zh-CN');
      case 'album':
        return a.album.localeCompare(b.album, 'zh-CN');
      case 'duration':
        return b.duration - a.duration;
      case 'size':
        return (b.fileSize || 0) - (a.fileSize || 0);
      case 'date':
        return parseInt(b.id) - parseInt(a.id);
      default:
        return 0;
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
      const firstSelectedSong = songs.find(s => selectedSongs.has(s.id));
      if (firstSelectedSong) {
        playSong(firstSelectedSong);
      }
    }
  };

  // 字母索引处理
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
    // 查找以该字母开头的第一首歌
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
    <div 
      style={{ backgroundColor: isDarkMode ? '#0c0c0c' : '#f8f9fb' }}
      className="relative min-h-screen"
    >
      {/* Header */}
      <div
        style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
        className="sticky top-0 z-10"
      >
        <div className="relative flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`p-2 rounded lg:hidden ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">歌曲</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/search')}
              className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <Search className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSortMenuOpen(true)}
              className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
            >
              <MoreVertical className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Control bar */}
        {hasScanned && (
          <div className="flex items-center px-4 py-2 gap-2">
            {!selectionMode ? (
              <>
                <button
                  onClick={handleShufflePlay}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                    isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white`}
                >
                  <Shuffle className="w-4 h-4" />
                  <span>随机播放</span>
                </button>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {songs.length} 首歌曲
                </span>
                <div className="flex-1" />
                <button
                  onClick={() => setSortMenuOpen(true)}
                  className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                >
                  <ArrowUpDown className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setSelectionMode(true)}
                  className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                >
                  <CheckSquare className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setSelectionMode(false);
                    setSelectedSongs(new Set());
                  }}
                  className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                >
                  <X className="w-5 h-5" />
                </button>
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  已选 {selectedSongs.size} 首
                </span>
                <button
                  onClick={toggleSelectAll}
                  className={`text-sm px-3 py-1 rounded ${
                    isDarkMode ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  {selectedSongs.size === songs.length ? '取消全选' : '全选'}
                </button>
                <div className="flex-1" />
                <button
                  onClick={handlePlaySelected}
                  disabled={selectedSongs.size === 0}
                  className={`p-2 rounded ${
                    selectedSongs.size > 0
                      ? isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <Play className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setAddToPlaylistOpen(true)}
                  disabled={selectedSongs.size === 0}
                  className={`p-2 rounded ${
                    selectedSongs.size > 0
                      ? isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <ListPlus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteConfirmOpen(true)}
                  disabled={selectedSongs.size === 0}
                  className={`p-2 rounded ${
                    selectedSongs.size > 0
                      ? isDarkMode ? 'hover:bg-gray-800 text-red-400' : 'hover:bg-gray-100 text-red-600'
                      : 'opacity-50 cursor-not-allowed'
                  }`}
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="relative">
        {!hasScanned ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <button
              onClick={() => navigate('/scan')}
              className={`px-6 py-3 rounded-lg ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              扫描音乐
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
            
            {/* 字母索引 */}
            <div
              ref={indexBarRef}
              className="fixed right-1 top-1/2 -translate-y-1/2 z-50 py-2 pointer-events-auto"
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
                  className={`text-xs px-1 py-0.5 cursor-pointer select-none ${
                    activeIndex === letter
                      ? isDarkMode ? 'text-blue-400 font-bold' : 'text-blue-600 font-bold'
                      : isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  {letter}
                </div>
              ))}
            </div>

            {/* 字母提示 */}
            {activeIndex && (
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-20 h-20 rounded-lg bg-black bg-opacity-70 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">{activeIndex}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Sort menu */}
      {sortMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50"
            onClick={() => setSortMenuOpen(false)}
          />
          {/* Menu */}
          <div
            style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
            className="fixed bottom-0 left-0 right-0 lg:left-64 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto scrollbar-thin z-50 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-4">排序方式</h3>
            <div className="space-y-2">
              {[
                { label: '标题', value: 'title' as SortOption },
                { label: '艺术家', value: 'artist' as SortOption },
                { label: '专辑', value: 'album' as SortOption },
                { label: '时长', value: 'duration' as SortOption },
                { label: '大小', value: 'size' as SortOption },
                { label: '添加时间', value: 'date' as SortOption },
              ].map((option) => (
                <button
                  key={option.value}
                  className={`w-full text-left px-4 py-3 rounded ${
                    sortBy === option.value
                      ? isDarkMode ? 'bg-blue-900 text-blue-400' : 'bg-blue-100 text-blue-600'
                      : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => handleSortOption(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Delete confirmation */}
      {deleteConfirmOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50"
            onClick={() => setDeleteConfirmOpen(false)}
          />
          {/* Dialog */}
          <div
            style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
            className="fixed bottom-0 left-0 right-0 lg:left-64 rounded-t-3xl p-6 z-50 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-2">确认删除</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              确定要永久删除选中的 {selectedSongs.size} 首歌曲吗？此操作无法撤销。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className={`flex-1 py-3 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                删除
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add to playlist */}
      {addToPlaylistOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50"
            onClick={() => {
              setAddToPlaylistOpen(false);
              setShowNewPlaylistInput(false);
              setNewPlaylistName('');
            }}
          />
          {/* Dialog */}
          <div
            style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
            className="fixed bottom-0 left-0 right-0 lg:left-64 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto scrollbar-thin z-50 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-4">添加到歌单</h3>
            
            {showNewPlaylistInput ? (
              <div className="mb-4">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="输入歌单名称"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    isDarkMode
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  autoFocus
                />
                <div className="flex gap-3 mt-3">
                  <button
                    onClick={() => {
                      setShowNewPlaylistInput(false);
                      setNewPlaylistName('');
                    }}
                    className={`flex-1 py-2 rounded-lg ${
                      isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleCreateAndAddToPlaylist}
                    disabled={!newPlaylistName.trim()}
                    className={`flex-1 py-2 rounded-lg ${
                      newPlaylistName.trim()
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    创建并添加
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowNewPlaylistInput(true)}
                className={`w-full text-left px-4 py-3 rounded-lg mb-3 ${
                  isDarkMode
                    ? 'bg-blue-900 text-blue-400 hover:bg-blue-800'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                + 新建歌单
              </button>
            )}

            <div className="space-y-2">
              {playlists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{playlist.name}</div>
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {playlist.songCount} 首歌曲
                  </div>
                </button>
              ))}
              {playlists.length === 0 && !showNewPlaylistInput && (
                <p className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  暂无歌单，请先创建
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};