import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft, Search } from 'lucide-react';
import { SongList } from './SongList';
import { AlphabetScroller } from './AlphabetScroller';
import { Sidebar } from './Sidebar';
import { useMusic } from '../context/MusicContext';

export const PlaylistDetailPage = () => {
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const { playlists, isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlist) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <div
        style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
        className="sticky top-0 z-10"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-medium">{playlist.name}</h1>
          <button
            onClick={() => navigate('/search')}
            className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Songs */}
      {playlist.songs.length === 0 ? (
        <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          歌单中暂无歌曲
        </div>
      ) : (
        <>
          <SongList songs={playlist.songs} />
          <AlphabetScroller items={playlist.songs.map(s => ({ id: s.id, name: s.title }))} />
        </>
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};