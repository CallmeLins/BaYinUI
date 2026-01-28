import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { SongList } from './SongList';
import { AlphabetScroller } from './AlphabetScroller';
import { Sidebar } from './Sidebar';
import { useMusic } from '../context/MusicContext';

export const AlbumDetailPage = () => {
  const navigate = useNavigate();
  const { albumId } = useParams();
  const { albums, songs, isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const album = albums.find(a => a.id === albumId);
  const albumSongs = songs.filter(s => s.album === album?.name);

  if (!album) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <div
        style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
        className="sticky top-0 z-10"
      >
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Album info */}
      <div className="px-4 py-6">
        <div className="flex items-start gap-4">
          <img
            src={album.coverUrl}
            alt={album.name}
            className="w-32 h-32 rounded-lg object-cover shadow-lg"
          />
          <div className="flex-1 min-w-0 pt-2">
            <h1 className="text-2xl font-bold mb-2">{album.name}</h1>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {album.artist}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {album.songCount} 首歌曲
            </div>
            {album.year && (
              <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {album.year}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Songs */}
      <SongList songs={albumSongs} />

      {/* Alphabet scroller */}
      <AlphabetScroller items={albumSongs.map(s => ({ id: s.id, name: s.title }))} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};