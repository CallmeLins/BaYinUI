import { useState } from 'react';
import { MoreVertical, Check } from 'lucide-react';
import { Song, useMusic } from '../context/MusicContext';
import { SongMenu } from './SongMenu';

interface SongListProps {
  songs: Song[];
  selectionMode?: boolean;
  selectedSongs?: Set<string>;
  onToggleSelection?: (songId: string) => void;
}

export const SongList = ({ songs, selectionMode = false, selectedSongs = new Set(), onToggleSelection }: SongListProps) => {
  const { playSong, isDarkMode, showCoverInList } = useMusic();
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSongClick = (song: Song) => {
    if (selectionMode && onToggleSelection) {
      onToggleSelection(song.id);
    } else {
      playSong(song);
    }
  };

  const handleMenuOpen = (song: Song) => {
    setSelectedSong(song);
    setMenuOpen(true);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      <div className={selectionMode ? 'pr-8' : ''}>
        {songs.map((song) => (
          <div
            key={song.id}
            id={`song-${song.id}`}
            className={`flex items-center gap-3 px-4 py-3 border-b ${
              isDarkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-100 hover:bg-gray-50'
            } cursor-pointer`}
            onClick={() => handleSongClick(song)}
          >
            {showCoverInList && (
              <img
                src={song.coverUrl}
                alt={song.title}
                className="w-14 h-14 rounded object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium truncate">{song.title}</span>
                {song.isHR && (
                  <span className="text-xs px-1.5 py-0.5 bg-red-500 text-white rounded">HR</span>
                )}
                {song.isSQ && (
                  <span className="text-xs px-1.5 py-0.5 bg-yellow-500 text-white rounded">SQ</span>
                )}
              </div>
              <div className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {song.artist} · {song.album}
              </div>
            </div>
            {selectionMode ? (
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                  selectedSongs.has(song.id)
                    ? 'bg-blue-600 border-blue-600'
                    : isDarkMode ? 'border-gray-600' : 'border-gray-400'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleSelection) {
                    onToggleSelection(song.id);
                  }
                }}
              >
                {selectedSongs.has(song.id) && <Check className="w-4 h-4 text-white" />}
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuOpen(song);
                }}
                className={`p-2 rounded ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Song menu */}
      {menuOpen && selectedSong && (
        <SongMenu
          song={selectedSong}
          onClose={() => {
            setMenuOpen(false);
            setSelectedSong(null);
          }}
        />
      )}
    </div>
  );
};