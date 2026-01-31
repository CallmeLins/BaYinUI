import { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { X, Search } from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { SongList } from './SongList';
import { AlphabetScroller } from './AlphabetScroller';
import { cn } from '../components/ui/utils';

export const SearchPage = () => {
  const navigate = useNavigate();
  const { isDarkMode, songs } = useMusic();
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative pb-20">
      {/* Search header */}
      <div className={cn(
        "sticky top-0 z-10 -mx-6 px-6 py-4 mb-2",
        "bg-white/85 dark:bg-[#121212]/85 backdrop-blur-xl saturate-150 border-b border-black/5 dark:border-white/10 transition-colors duration-300"
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl",
            "bg-gray-100 dark:bg-white/10"
          )}>
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索歌曲、艺术家、专辑"
              className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={() => navigate(-1)}
            className="px-3 py-2 text-blue-600 dark:text-blue-400 font-medium"
          >
            取消
          </button>
        </div>
      </div>

      {/* Search results */}
      <div className="min-h-[50vh]">
        {searchQuery === '' ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
            <Search className="w-12 h-12 mb-4 opacity-50" />
            <p>输入关键词开始搜索</p>
          </div>
        ) : filteredSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500">
            <p>未找到相关歌曲</p>
            <p className="text-sm mt-2">尝试其他关键词</p>
          </div>
        ) : (
          <>
            <div className="px-1 mb-2 text-sm text-gray-500 dark:text-gray-400">
              找到 {filteredSongs.length} 首歌曲
            </div>
            <SongList songs={filteredSongs} />

            {/* Alphabet scroller for search results */}
            {filteredSongs.length > 10 && (
              <AlphabetScroller items={filteredSongs.map(s => ({ id: s.id, name: s.title }))} />
            )}
          </>
        )}
      </div>
    </div>
  );
};