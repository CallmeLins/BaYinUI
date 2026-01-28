import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Menu, MoreVertical, Plus } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useMusic } from '../context/MusicContext';

export const PlaylistsPage = () => {
  const navigate = useNavigate();
  const { playlists, isDarkMode, createPlaylist, deletePlaylist, updatePlaylist } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [playlistName, setPlaylistName] = useState('');
  const [menuPlaylistId, setMenuPlaylistId] = useState<string | null>(null);

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
          <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">歌单</h1>
          <button
            onClick={() => setShowCreateMenu(true)}
            className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div>
        {playlists.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            暂无歌单
          </div>
        ) : (
          playlists.map((playlist) => (
            <div
              key={playlist.id}
              className={`flex items-center gap-3 px-4 py-3 border-b ${
                isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'
              }`}
            >
              <div
                className="flex-1 min-w-0 cursor-pointer"
                onClick={() => navigate(`/playlists/${playlist.id}`)}
              >
                <div className="font-medium truncate">{playlist.name}</div>
                <div className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {playlist.songCount} 首歌曲
                </div>
              </div>
              <button
                onClick={() => setMenuPlaylistId(playlist.id)}
                className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Create menu */}
      {showCreateMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowCreateMenu(false)}
          />
          <div
            style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
            className="fixed bottom-0 left-0 right-0 lg:left-64 rounded-t-3xl p-6 z-50 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setShowCreateMenu(false);
                setShowCreateDialog(true);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>新建歌单</span>
            </button>
          </div>
        </>
      )}

      {/* Playlist menu */}
      {menuPlaylistId && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setMenuPlaylistId(null)}
          />
          <div
            style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
            className="fixed bottom-0 left-0 right-0 lg:left-64 rounded-t-3xl p-6 z-50 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-2">
              <button
                onClick={() => {
                  const playlist = playlists.find(p => p.id === menuPlaylistId);
                  if (playlist) openEditDialog(playlist.id, playlist.name);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                编辑
              </button>
              <button
                onClick={() => openDeleteDialog(menuPlaylistId)}
                className={`w-full text-left px-4 py-3 rounded-lg ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } text-red-500`}
              >
                删除歌单
              </button>
            </div>
          </div>
        </>
      )}

      {/* Create dialog */}
      {showCreateDialog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowCreateDialog(false);
            setPlaylistName('');
          }}
        >
          <div 
            style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
            className="rounded-lg p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-4">新建歌单</h3>
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="输入歌单名称"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } outline-none focus:border-blue-500`}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateDialog(false);
                  setPlaylistName('');
                }}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                取消
              </button>
              <button
                onClick={handleCreate}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit dialog */}
      {showEditDialog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowEditDialog(false);
            setPlaylistName('');
          }}
        >
          <div 
            style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
            className="rounded-lg p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-4">编辑歌单</h3>
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="输入歌单名称"
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } outline-none focus:border-blue-500`}
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditDialog(false);
                  setPlaylistName('');
                }}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                取消
              </button>
              <button
                onClick={handleEdit}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                } text-white`}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete dialog */}
      {showDeleteDialog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteDialog(false)}
        >
          <div 
            style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
            className="rounded-lg p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-4">删除歌单</h3>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              确定要删除这个歌单吗？此操作无法撤销。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};