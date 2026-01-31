import { useNavigate, useParams } from 'react-router';
import { ChevronLeft, Search } from 'lucide-react';
import { SongList } from './SongList';
import { AlphabetScroller } from './AlphabetScroller';
import { useMusic } from '../context/MusicContext';
import { cn } from '../components/ui/utils';

export const PlaylistDetailPage = () => {
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const { playlists } = useMusic();

  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlist) {
    return null;
  }

  return (
    <div className="relative pb-20">
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 -mx-6 px-6 py-4 mb-6 flex items-center justify-between",
        "bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10"
      )}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold tracking-tight">{playlist.name}</h1>
        </div>
        <button
          onClick={() => navigate('/search')}
          className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {/* Songs */}
      <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden shadow-sm">
        {playlist.songs.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No songs in this playlist.
          </div>
        ) : (
          <SongList songs={playlist.songs} />
        )}
      </div>

      {playlist.songs.length > 0 && (
        <AlphabetScroller items={playlist.songs.map(s => ({ id: s.id, name: s.title }))} />
      )}
    </div>
  );
};
