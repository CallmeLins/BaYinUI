import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { SongList } from './SongList';
import { AlphabetScroller } from './AlphabetScroller';
import { Sidebar } from './Sidebar';
import { useMusic } from '../context/MusicContext';

export const ArtistDetailPage = () => {
  const navigate = useNavigate();
  const { artistId } = useParams();
  const { artists, songs, isDarkMode } = useMusic();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const artist = artists.find(a => a.id === artistId);
  const artistSongs = songs.filter(s => s.artist === artist?.name);

  if (!artist) {
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

      {/* Artist info */}
      <div className="px-4 py-6">
        <div className="flex items-start gap-4">
          <img
            src={artist.coverUrl}
            alt={artist.name}
            className="w-32 h-32 rounded-full object-cover shadow-lg"
          />
          <div className="flex-1 min-w-0 pt-2">
            <h1 className="text-2xl font-bold mb-2">{artist.name}</h1>
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {artist.songCount} 首歌曲
            </div>
          </div>
        </div>
      </div>

      {/* Songs */}
      <SongList songs={artistSongs} />

      {/* Alphabet scroller */}
      <AlphabetScroller items={artistSongs.map(s => ({ id: s.id, name: s.title }))} />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
};