import { useRef, useState } from 'react';
import { cn } from '../components/ui/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface AlphabetScrollerProps {
  items: Array<{ id: string; name: string }>;
}

export const AlphabetScroller = ({ items }: AlphabetScrollerProps) => {
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
      const element = document.getElementById(`item-${targetItem.id}`) || document.getElementById(`song-${targetItem.id}`);
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
      {/* Alphabet Index Bar */}
      <div
        ref={indexBarRef}
        className={cn(
          "fixed right-1 top-1/2 -translate-y-1/2 z-50 py-2 pointer-events-auto select-none",
          "bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-full px-1"
        )}
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
            className={cn(
              "text-[10px] leading-3 py-[1px] cursor-pointer text-center transition-all",
              activeIndex === letter
                ? "text-blue-500 font-bold scale-150 origin-right"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            )}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Large Letter Overlay */}
      <AnimatePresence>
        {activeIndex && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className={cn(
              "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
              "w-20 h-20 rounded-2xl",
              "bg-gray-100/80 dark:bg-[#323232]/80 backdrop-blur-xl",
              "flex items-center justify-center shadow-2xl border border-white/10"
            )}
          >
            <span className="text-4xl font-bold text-gray-900 dark:text-white">{activeIndex}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};