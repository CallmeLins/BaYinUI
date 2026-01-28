import { useRef, useState } from 'react';
import { useMusic } from '../context/MusicContext';

interface AlphabetScrollerProps {
  items: Array<{ id: string; name: string }>;
}

export const AlphabetScroller = ({ items }: AlphabetScrollerProps) => {
  const { isDarkMode } = useMusic();
  const alphabetIndex = ['0', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const indexBarRef = useRef<HTMLDivElement>(null);

  const handleIndexTouch = (e: React.TouchEvent | React.MouseEvent) => {
    if (!indexBarRef.current) return;

    const touch = 'touches' in e ? e.touches[0] : e;
    const rect = indexBarRef.current.getBoundingClientRect();
    const y = touch.clientY - rect.top;
    const index = Math.floor((y / rect.height) * alphabetIndex.length);

    if (index >= 0 && index < alphabetIndex.length) {
      const letter = alphabetIndex[index];
      setActiveIndex(letter);
      scrollToLetter(letter);
    }
  };

  const scrollToLetter = (letter: string) => {
    // 查找以该字母开头的第一个项目
    let targetItem;
    
    if (letter === '0') {
      targetItem = items.find(item => /^[0-9]/.test(item.name));
    } else if (letter === '#') {
      targetItem = items.find(item => !/^[a-zA-Z0-9]/.test(item.name));
    } else {
      targetItem = items.find(item => 
        item.name.toUpperCase().startsWith(letter) || 
        item.name.toLowerCase().startsWith(letter.toLowerCase())
      );
    }

    if (targetItem) {
      const element = document.getElementById(`item-${targetItem.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleIndexTouchEnd = () => {
    setTimeout(() => setActiveIndex(null), 500);
  };

  if (items.length === 0) return null;

  return (
    <>
      {/* 字母索引 */}
      <div
        ref={indexBarRef}
        className="fixed right-1 top-1/2 -translate-y-1/2 z-50 py-2 pointer-events-auto"
        onTouchStart={handleIndexTouch}
        onTouchMove={handleIndexTouch}
        onTouchEnd={handleIndexTouchEnd}
        onMouseDown={handleIndexTouch}
        onMouseMove={(e) => e.buttons === 1 && handleIndexTouch(e)}
        onMouseUp={handleIndexTouchEnd}
      >
        {alphabetIndex.map((letter) => (
          <div
            key={letter}
            className={`text-xs px-1 py-0.5 cursor-pointer select-none ${
              activeIndex === letter
                ? isDarkMode ? 'text-blue-400 font-bold' : 'text-blue-600 font-bold'
                : isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* 字母提示 */}
      {activeIndex && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-20 h-20 rounded-lg bg-black bg-opacity-70 flex items-center justify-center pointer-events-none">
          <span className="text-white text-4xl font-bold">{activeIndex}</span>
        </div>
      )}
    </>
  );
};
