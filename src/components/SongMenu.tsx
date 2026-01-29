import { ListPlus, PlaySquare, User, Disc, Info, Trash2 } from 'lucide-react';
import { Song, useMusic } from '../context/MusicContext';

interface SongMenuProps {
  song: Song;
  onClose: () => void;
}

export const SongMenu = ({ song, onClose }: SongMenuProps) => {
  const { isDarkMode, addNextToQueue } = useMusic();

  const handlePlayNext = () => {
    addNextToQueue(song);
    onClose();
  };

  const menuItems = [
    { icon: <ListPlus className="w-5 h-5" />, label: '添加到歌单', onClick: onClose },
    { icon: <PlaySquare className="w-5 h-5" />, label: '下一首播放', onClick: handlePlayNext },
    { icon: <User className="w-5 h-5" />, label: '艺术家', onClick: onClose },
    { icon: <Disc className="w-5 h-5" />, label: '专辑', onClick: onClose },
    { icon: <Info className="w-5 h-5" />, label: '歌曲信息', onClick: onClose },
    { icon: <Trash2 className="w-5 h-5 text-red-500" />, label: '永久删除', danger: true, onClick: onClose },
  ];

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div
        style={{ backgroundColor: isDarkMode ? '#191919' : '#ffffff' }}
        className="fixed bottom-0 left-0 right-0 rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto scrollbar-thin shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Song info */}
        <div className={`flex items-center gap-4 mb-6 pb-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <img
            src={song.coverUrl}
            alt={song.title}
            className="w-16 h-16 rounded object-cover"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{song.title}</div>
            <div className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {song.artist} · {song.album}
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors ${item.danger ? 'text-red-500' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};