import { useState, useRef, useCallback, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { MoreVertical, Check } from 'lucide-react';
import { Song, useMusic } from '../context/MusicContext';
import { SongMenu } from './SongMenu';
import { cn } from '../components/ui/utils';

interface SongListProps {
  songs: Song[];
  selectionMode?: boolean;
  selectedSongs?: Set<string>;
  onToggleSelection?: (songId: string) => void;
  scrollToIndex?: number;
}

// 每行高度（px-2 上下共 16px + 内容高度 40px = 56px）
const ROW_HEIGHT = 56;

export const SongList = ({
  songs,
  selectionMode = false,
  selectedSongs = new Set(),
  onToggleSelection,
  scrollToIndex
}: SongListProps) => {
  const { playWithQueue, showCoverInList, currentSong } = useMusic();
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // 滚动容器引用
  const parentRef = useRef<HTMLDivElement>(null);

  // 虚拟化配置
  const virtualizer = useVirtualizer({
    count: songs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5, // 预渲染上下各5行，提升滚动流畅度
  });

  // 当 scrollToIndex 变化时滚动到指定位置
  useEffect(() => {
    if (scrollToIndex !== undefined && scrollToIndex >= 0 && scrollToIndex < songs.length) {
      virtualizer.scrollToIndex(scrollToIndex, { align: 'start', behavior: 'smooth' });
    }
  }, [scrollToIndex, songs.length, virtualizer]);

  const handleSongClick = useCallback((song: Song) => {
    if (selectionMode && onToggleSelection) {
      onToggleSelection(song.id);
    } else {
      playWithQueue(song, songs);
    }
  }, [selectionMode, onToggleSelection, playWithQueue, songs]);

  const handleMenuOpen = useCallback((song: Song) => {
    setSelectedSong(song);
    setMenuOpen(true);
  }, []);

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="relative w-full">
      {/* 滚动容器 - 使用 calc 动态计算高度 */}
      <div
        ref={parentRef}
        className="overflow-y-auto"
        style={{
          height: `calc(100vh - 280px)`, // 减去头部、工具栏、底部播放器的高度
          minHeight: '300px',
          maxHeight: '70vh'
        }}
      >
        {/* 虚拟化内容容器 */}
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualRow) => {
            const index = virtualRow.index;
            const song = songs[index];
            const isSelected = selectedSongs.has(song.id);
            const isCurrent = currentSong?.id === song.id;

            return (
              <div
                key={song.id}
                data-index={index}
                data-no-drag
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div
                  className={cn(
                    "group relative flex items-center gap-2 pl-2 pr-1 h-full cursor-default transition-colors duration-100",
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
                      src={song.coverUrl || '/placeholder-album.png'}
                      alt={song.title}
                      className="w-10 h-10 rounded-[4px] object-cover shadow-sm bg-gray-200 dark:bg-gray-700"
                      loading="lazy"
                    />
                  )}

                  <div className="flex-1 min-w-0 flex flex-col justify-center h-10">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium leading-tight">
                        {song.title}
                      </span>
                      {song.isHr && (
                        <span className="text-[9px] px-1 py-0.5 bg-red-500 text-white rounded-[3px] font-bold tracking-wider flex-shrink-0">HR</span>
                      )}
                      {song.isSq && (
                        <span className="text-[9px] px-1 py-0.5 bg-yellow-500 text-white rounded-[3px] font-bold tracking-wider flex-shrink-0">SQ</span>
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
              </div>
            );
          })}
        </div>
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

// 导出查找歌曲索引的辅助函数
export function findSongIndexByLetter(songs: Song[], letter: string, sortBy: string): number {
  const getField = (song: Song): string => {
    switch (sortBy) {
      case 'artist': return song.artist;
      case 'album': return song.album;
      default: return song.title;
    }
  };

  if (letter === '0') {
    return songs.findIndex(s => /^[0-9]/.test(getField(s)));
  } else if (letter === '#') {
    return songs.findIndex(s => !/^[a-zA-Z0-9]/.test(getField(s)));
  } else {
    return songs.findIndex(s => {
      const field = getField(s);
      return field.toUpperCase().startsWith(letter) ||
             field.toLowerCase().startsWith(letter.toLowerCase());
    });
  }
}
