import { useState } from 'react';
import { useNavigate } from 'react-router';
import { X, Search } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export const SearchPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, songs } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div 
      style={{ backgroundColor: isDarkMode ? '#0c0c0c' : '#f8f9fb' }}
      className="min-h-screen"
    >
      {/* Search header */}
      <div 
        style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
        className="sticky top-0 p-4"
      >
        <div className="flex items-center gap-3">
          <div className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索歌曲、艺术家、专辑"
              className={`flex-1 bg-transparent outline-none ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              autoFocus
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => navigate(-1)}
            className={`px-4 py-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
          >
            取消
          </button>
        </div>
      </div>

      {/* Search results */}
      <div className="p-4">
        {searchQuery === '' ? (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            输入关键词开始搜索
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            未找到相关歌曲
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSongs.map((song) => (
              <div
                key={song.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} cursor-pointer`}
              >
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{song.title}</div>
                  <div className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {song.artist} · {song.album}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};