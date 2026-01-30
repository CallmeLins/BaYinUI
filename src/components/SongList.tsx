import { useState } from 'react';
import { MoreVertical, Check } from 'lucide-react';
import { Song, useMusic } from '../context/MusicContext';
import { SongMenu } from './SongMenu';
import { cn } from '../components/ui/utils';

interface SongListProps {
  songs: Song[];
  selectionMode?: boolean;
  selectedSongs?: Set<string>;
  onToggleSelection?: (songId: string) => void;
}

export const SongList = ({ songs, selectionMode = false, selectedSongs = new Set(), onToggleSelection }: SongListProps) => {
  const { playWithQueue, showCoverInList, currentSong } = useMusic();
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSongClick = (song: Song) => {
    if (selectionMode && onToggleSelection) {
      onToggleSelection(song.id);
    } else {
      playWithQueue(song, songs);
    }
  };

  const handleMenuOpen = (song: Song) => {
    setSelectedSong(song);
    setMenuOpen(true);
  };

  return (
    <div className="relative w-full">
      <div className="flex flex-col">
        {songs.map((song, index) => {
          const isSelected = selectedSongs.has(song.id);
          const isCurrent = currentSong?.id === song.id;

          return (
            <div
              key={song.id}
              id={`song-${song.id}`}
              className={cn(
                "group relative flex items-center gap-2 px-1 py-2 cursor-default transition-colors duration-100",
                // Zebra Striping
                index % 2 === 0 ? "bg-transparent" : "bg-black/[0.02] dark:bg-white/[0.02]",
                // Hover State
                "hover:bg-blue-500 hover:text-white",
                // Selection State (if in selection mode)
                isSelected && "bg-blue-500 text-white",
                // Current Playing State
                isCurrent && !isSelected && "bg-black/5 dark:bg-white/10 font-medium"
              )}
              onClick={() => handleSongClick(song)}
            >
              {showCoverInList && (
                <img
                  src={song.coverUrl}
                  alt={song.title}
                  className="w-10 h-10 rounded-[4px] object-cover shadow-sm"
                />
              )}
              
              <div className="flex-1 min-w-0 flex flex-col justify-center h-10">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium leading-tight">
                    {song.title}
                  </span>
                  {song.isHR && (
                    <span className="text-[9px] px-1 py-0.5 bg-red-500 text-white rounded-[3px] font-bold tracking-wider">HR</span>
                  )}
                  {song.isSQ && (
                    <span className="text-[9px] px-1 py-0.5 bg-yellow-500 text-white rounded-[3px] font-bold tracking-wider">SQ</span>
                  )}
                </div>
                <div className={cn(
                  "text-xs truncate opacity-70 group-hover:text-white/80",
                  isCurrent ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                )}>
                  {song.artist} &middot; {song.album}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                {selectionMode ? (
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center transition-all",
                      isSelected
                        ? "bg-white border-white text-blue-500"
                        : "border-white/50"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleSelection) {
                        onToggleSelection(song.id);
                      }
                    }}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMenuOpen(song);
                    }}
                    className="p-1.5 rounded-md hover:bg-white/20 text-current"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Separator Line (Indented) */}
              <div className="absolute bottom-0 left-1 right-0 h-[1px] bg-black/5 dark:bg-white/5 group-hover:hidden" />
            </div>
          );
        })}
      </div>

      {/* Song menu */}
      <SongMenu
        isOpen={menuOpen}
        song={selectedSong}
        onClose={() => setMenuOpen(false)}
      />
    </div>
  );
};