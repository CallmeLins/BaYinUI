import { useNavigate, useParams } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { SongList } from './SongList';
import { AlphabetScroller } from './AlphabetScroller';
import { useMusic } from '../context/MusicContext';
import { cn } from '../components/ui/utils';
import { motion } from 'framer-motion';

export const AlbumDetailPage = () => {
  const navigate = useNavigate();
  const { albumId } = useParams();
  const { albums, songs } = useMusic();

  const album = albums.find(a => a.id === albumId);
  const albumSongs = songs.filter(s => s.album === album?.name);

  if (!album) {
    return null;
  }

  return (
    <div className="relative pb-20">
      {/* Header */}
      <div className={cn(
        "sticky top-0 z-10 -mx-6 px-6 py-4 mb-6 flex items-center gap-4",
        "bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10"
      )}>
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-lg font-semibold tracking-tight">{album.name}</span>
      </div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 px-4"
      >
        <div className="relative group">
          <img
            src={album.coverUrl}
            alt={album.name}
            className="w-48 h-48 rounded-2xl object-cover shadow-2xl border-4 border-white dark:border-[#282828]"
          />
          <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.2)] pointer-events-none" />
        </div>
        
        <div className="flex flex-col items-center md:items-start justify-center pt-4 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{album.name}</h1>
          <p className="text-lg font-medium text-blue-500 mb-2">{album.artist}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
             <span>{album.songCount} Songs</span>
             {album.year && (
                <>
                   <span>•</span>
                   <span>{album.year}</span>
                </>
             )}
          </div>
        </div>
      </motion.div>

      {/* Songs List */}
      <div className="bg-white/50 dark:bg-[#1e1e1e]/50 backdrop-blur-md rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden shadow-sm">
        <SongList songs={albumSongs} />
      </div>

      {/* Alphabet scroller */}
      <AlphabetScroller items={albumSongs.map(s => ({ id: s.id, name: s.title }))} />
    </div>
  );
};
