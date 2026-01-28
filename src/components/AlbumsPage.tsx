import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Menu, MoreVertical } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { AlphabetScroller } from './AlphabetScroller';
import { useMusic } from '../context/MusicContext';

export const AlbumsPage = () => {
  const navigate = useNavigate();
  const { albums, isDarkMode, hasScanned } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sortMenuOpen, setSortMenuOpen] = useState(false);

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
          <h1 className="text-lg font-medium absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">专辑</h1>
          <button
            onClick={() => setSortMenuOpen(true)}
            className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div>
        {!hasScanned ? (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            请先扫描音乐
          </div>
        ) : albums.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            暂无专辑
          </div>
        ) : (
          albums.map((album) => (
            <div
              key={album.id}
              id={`item-${album.id}`}
              className={`flex items-center gap-3 px-4 py-3 border-b ${
                isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'
              } cursor-pointer`}
              onClick={() => navigate(`/albums/${album.id}`)}
            >
              <img
                src={album.coverUrl}
                alt={album.name}
                className="w-14 h-14 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{album.name}</div>
                <div className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {album.artist} · {album.songCount} 首歌曲
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alphabet scroller */}
      {hasScanned && albums.length > 0 && <AlphabetScroller items={albums.map(a => ({ id: a.id, name: a.name }))} />}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Sort menu */}
      {sortMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setSortMenuOpen(false)}
          />
          <div
            style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
            className="fixed bottom-0 left-0 right-0 lg:left-64 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto z-50 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium mb-4">排序方式</h3>
            <div className="space-y-2">
              {['标题', '年份', '数量'].map((option) => (
                <button
                  key={option}
                  className={`w-full text-left px-4 py-3 rounded ${
                    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSortMenuOpen(false)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};